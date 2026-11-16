
import mongoose from 'mongoose';
import Review from '../models/reviewModelSchema.js';
import Seller from '../models/sellerModelSchema.js';

const idOf = (v) => String(v?._id ?? v ?? '');

const initialName = (first, last) => {
    const f = String(first || '').trim();
    const l = String(last || '').trim();

    if (!f) return 'User';
    return l ? `${f} ${l[0].toUpperCase()}.` : f;
};

export const reviewerDisplayName = (doc, type) => {
    if (!doc) return 'Deleted User';

    if (type === 'Seller') {
        const parts = String(doc.fullName || '').trim().split(/\s+/).filter(Boolean);
        return initialName(parts[0], parts.length > 1 ? parts[parts.length - 1] : '');
    }
    return initialName(doc.firstName, doc.lastName);
};

export const REVIEW_MESSAGES = {
    order_not_found: 'Order not found.',
    not_buyer: 'Only the buyer of this order can review it.',
    own_listing: 'You cannot review your own listing.',
    already_reviewed: 'You have already reviewed this order.',
    order_not_paid: 'This order is not paid.',
    handover_pending: 'You can review after the vehicle handover is confirmed.',
    open_dispute: 'Review is paused while a dispute is open on this order.',
    locked_by_reply: 'The seller has replied, so this review can no longer be edited.',
    hidden: 'This review is hidden and cannot be edited.',
};

// paid + handover confirmed + not open dispute
export const getReviewEligibility = (order, userId, existingReview) => {
    if (!order) return { canReview: false, reason: 'Order Not Found' };
    if (idOf(order.buyerId) !== String(userId)) return { canReview: false, reason: 'not_buyer' };
    if (order.buyerType === 'Seller' && idOf(order.sellerId) === idOf(order.buyerId)) {
        return { canReview: false, reason: 'own_listing' };
    }
    if (existingReview) return { canReview: false, reason: 'already_reviewed' };
    if (order.status !== 'paid') return { canReview: false, reason: 'order_not_paid' };
    if (order.handover?.status !== 'confirmed') return { canReview: false, reason: 'handover_pending' };
    if (order.hasOpenDispute) return { canReview: false, reason: 'open_dispute' };
    return { canReview: true, reason: null };
};

// review edit 
export const getEditEligibility = (review, order) => {
    if (review.reply?.text) return { canEdit: false, reason: 'locked_by_reply' };
    if (review.isHidden) return { canEdit: false, reason: 'hidden' };
    if (!order || order.status !== 'paid') return { canEdit: false, reason: 'order_not_paid' };
    if (order.hasOpenDispute) return { canEdit: false, reason: 'open_dispute' };
    return { canEdit: true, reason: null };
};

// overall average rating and total review count recalculate
export const recalcSellerRating = async (sellerId) => {
    const [row] = await Review.aggregate([
        { $match: { sellerId: new mongoose.Types.ObjectId(String(sellerId)), isHidden: false } },
        { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);

    const ratingCount = row?.count || 0;
    const ratingAverage = row ? Math.round(row.avg * 10) / 10 : 0;

    await Seller.updateOne({ _id: sellerId }, { $set: { ratingAverage, ratingCount } });
    return { ratingAverage, ratingCount };
};

// order cancel / refund_buyer hone par: review hide + featured band + average dobara
// (admin ne pehle se hide kiya ho to usse nahi chhedta)
export const hideReviewForCanceledOrder = async (orderId) => {
    const review = await Review.findOneAndUpdate(
        { orderId, isHidden: false },
        { $set: { isHidden: true, hiddenReason: 'order_canceled', hiddenAt: new Date(), featured: false } },
        { new: true }
    );
    if (review) await recalcSellerRating(review.sellerId);
    return review;
};
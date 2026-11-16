
import mongoose from "mongoose";
import Review from '../models/reviewModelSchema.js';
import Order from '../models/orderModelSchema.js';
import Seller from '../models/sellerModelSchema.js';
import {
    getReviewEligibility, REVIEW_MESSAGES, getEditEligibility, recalcSellerRating, reviewerDisplayName,
} from '../utils/reviewHelper.js';
import { notifyParty } from "../utils/disputeNotify.js";

const fail = (res, message, status = 400) => res.status(status).json({ success: false, message });

// ================================================ ADMIN

const MAX_FEATURED = 12;

const escRx = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const fullName = (doc, type) => {
    if (!doc) return 'Deleted user';
    if (type === 'Seller') return doc.businessName || doc.fullName || 'User';
    return `${doc.firstName || ''} ${doc.lastName || ''}`.trim() || 'User';
};

const adminShape = (r) => ({
    _id: r._id,
    reviewId: r.reviewId,
    orderNumber: r.orderId?.orderId || null,
    orderStatus: r.orderId?.status || null,
    listingId: r.listingId,
    vehicle: r.vehicleId ? `${r.vehicleId.year || ''} ${r.vehicleId.make || ''} ${r.vehicleId.model || ''}`.trim() : null,
    images: r.vehicleId?.images || [],
    seller: r.sellerId ? { name: r.sellerId.businessName || r.sellerId.fullName, readableId: r.sellerId.sellerId } : null,
    reviewer: {
        name: fullName(r.reviewerId, r.reviewerType),
        email: r.reviewerId?.email || null,
        type: r.reviewerType,
    },
    rating: r.rating,
    comment: r.comment,
    createdAt: r.createdAt,
    editedAt: r.editedAt || null,
    reply: r.reply?.text ? { text: r.reply.text, at: r.reply.at, editedAt: r.reply.editedAt || null } : null,
    isHidden: !!r.isHidden,
    hiddenReason: r.hiddenReason || null,
    hiddenAt: r.hiddenAt || null,
    hiddenByName: r.hiddenBy?.name || null,
    featured: !!r.featured,
    featuredAt: r.featuredAt || null,
    featuredByName: r.featuredBy?.name || null,
    editedAfterFeatured: !!r.editedAfterFeatured,
});

const populateAdmin = (q) => q
    .populate('reviewerId', 'firstName lastName fullName businessName email')
    .populate('sellerId', 'sellerId fullName businessName')
    .populate('vehicleId', 'make model year images')
    .populate('orderId', 'orderId status')
    .populate('hiddenBy', 'name')
    .populate('featuredBy', 'name');

// all reviews
export const getAllReviews = async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(parseInt(req.query.limit) || 10, 50);

        const { status, sortBy } = req.query;
        const rating = parseInt(req.query.rating);
        const search = String(req.query.search || '').trim();

        const match = {};

        if (status === 'visible') match.isHidden = false;
        if (status === 'hidden') match.isHidden = true;
        if (status === 'featured') match.featured = true;
        if (status === 'edited_after_featured') match.editedAfterFeatured = true;

        if (rating >= 1 && rating <= 5) match.rating = rating;

        if (search) {
            const rx = new RegExp(escRx(search), 'i');

            const [sellerIds, orderIds] = await Promise.all([
                Seller.find({ $or: [{ sellerId: rx }, { fullName: rx }, { businessName: rx }] }).distinct('_id'),
                Order.find({ orderId: rx }).distinct('_id'),
            ]);

            match.$or = [
                { reviewId: rx }, { listingId: rx },
                { sellerId: { $in: sellerIds } }, { orderId: { $in: orderIds } },
            ];
        }

        const sort = sortBy === 'oldest' ? { createdAt: 1 }
            : sortBy === 'rating_high' ? { rating: -1, createdAt: -1 }
                : sortBy === 'rating_low' ? { rating: 1, createdAt: -1 }
                    : { createdAt: -1 };

        const [rows, total, all, hidden, featured, edited, avg] = await Promise.all([
            populateAdmin(Review.find(match).sort(sort).skip((page - 1) * limit).limit(limit)).lean(),
            Review.countDocuments(match),
            Review.countDocuments({}),
            Review.countDocuments({ isHidden: true }),
            Review.countDocuments({ featured: true }),
            Review.countDocuments({ editedAfterFeatured: true }),
            Review.aggregate([{ $match: { isHidden: false } }, { $group: { _id: null, avg: { $avg: '$rating' } } }]),
        ]);

        return res.status(200).json({
            success: true,
            reviews: rows.map(adminShape),
            stats: {
                total: all,
                hidden,
                featured,
                editedAfterFeatured: edited,
                average: avg[0] ? Math.round(avg[0].avg * 10) / 10 : 0,
            },
            maxFeatured: MAX_FEATURED,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });

    } catch (err) {
        console.log("getAllReviews error :", err);
        return fail(res, 'Server Error Occured', 500);
    }
};

// review by id
export const getReviewById = async (req, res) => {
    try {
        const { id } = req.params;

        const filter = mongoose.isValidObjectId(id) ? { _id: id } : { reviewId: id };
        const review = await populateAdmin(Review.findOne(filter)).lean();
        if (!review) return fail(res, 'Review not found', 404);

        return res.status(200).json({
            success: true,
            review: adminShape(review)
        });
    } catch (err) {
        console.log("getReviewById error :", err);
        return fail(res, 'Server Error Occured', 500);
    }
};

// hide review
export const hideReview = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) return fail(res, 'Review not found', 404);

        const review = await Review.findOneAndUpdate(
            { _id: req.params.id, isHidden: false },
            {
                $set: { isHidden: true, hiddenReason: 'admin', hiddenAt: new Date(), hiddenBy: req.user.id, featured: false },
                $unset: { featuredAt: '', featuredBy: '' },
            },
            { new: true }
        );

        if (!review) return fail(res, 'Review not found or already hidden', 400);

        await recalcSellerRating(review.sellerId);
        return res.status(200).json({
            success: true,
            message: 'Review hidden'
        });

    } catch (err) {
        console.log("hideReview error :", err);
        return fail(res, 'Server Error Occured', 500);
    }
};

// un-hide review
export const unhideReview = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) return fail(res, 'Review not found', 404);

        const review = await Review.findOneAndUpdate(
            { _id: req.params.id, isHidden: true, hiddenReason: 'admin' },
            { $set: { isHidden: false }, $unset: { hiddenReason: '', hiddenAt: '', hiddenBy: '' } },
            { new: true }
        );
        if (!review) return fail(res, 'Only reviews hidden by an admin can be unhidden', 409);

        await recalcSellerRating(review.sellerId);
        return res.status(200).json({
            success: true,
            message: 'Review is visible again'
        });

    } catch (err) {
        console.error('unhideReview error:', err);
        return fail(res, 'Server Error Occured', 500);
    }
};

// featured review
export const featureReview = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) return fail(res, 'Review not found', 404);

        const count = await Review.countDocuments({ featured: true });
        if (count >= MAX_FEATURED) {
            return fail(res, `You can feature at most ${MAX_FEATURED} reviews. Remove one first.`, 409);
        }

        const review = await Review.findOneAndUpdate(
            { _id: req.params.id, isHidden: false, featured: false },
            { $set: { featured: true, featuredAt: new Date(), featuredBy: req.user.id, editedAfterFeatured: false } },
            { new: true }
        );
        if (!review) return fail(res, 'Review not found, hidden, or already featured', 409);

        return res.status(200).json({
            success: true,
            message: 'Review featured on home page'
        });

    } catch (err) {
        console.error('featureReview error:', err);
        return fail(res, 'Server Error Occured', 500);
    }
};

// un-featured review 
export const unfeatureReview = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) return fail(res, 'Review not found', 404);

        const review = await Review.findOneAndUpdate(
            { _id: req.params.id, featured: true },
            { $set: { featured: false, editedAfterFeatured: false }, $unset: { featuredAt: '', featuredBy: '' } },
            { new: true }
        );
        if (!review) return fail(res, 'Review not found or not featured', 404);

        return res.status(200).json({
            success: true,
            message: 'Removed from home page'
        });

    } catch (err) {
        console.error('unfeatureReview error:', err);
        return fail(res, 'Server Error Occured', 500);
    }
};

// ================================================ PUBLIC (without login)

const MAX_HOME_REVIEWS = 12;

const vehicleTitle = (v) => (v ? `${v.year || ''} ${v.make || ''} ${v.model || ''}`.trim() : null);

const publicShape = (r) => ({
    _id: r._id,
    rating: r.rating,
    comment: r.comment,
    createdAt: r.createdAt,
    editedAt: r.editedAt || null,
    reviewer: {
        name: reviewerDisplayName(r.reviewerId, r.reviewerType),
        role: 'Verified Buyer',
        profileImage: r.reviewerType === 'Seller'
            ? r.reviewerId?.profileImage || null
            : r.reviewerId?.profileImageUrl || null,
    },
    vehicle: vehicleTitle(r.vehicleId),
    reply: r.reply?.text ? { text: r.reply.text, at: r.reply.at, editedAt: r.reply.editedAt || null } : null,
});

// home reviews
export const getHomeReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ featured: true, isHidden: false })
            .sort({ featuredAt: -1 })
            .limit(MAX_HOME_REVIEWS)
            .populate('reviewerId', 'firstName lastName fullName profileImage profileImageUrl')
            .populate('vehicleId', 'make model year')
            .lean();

        res.set('Cache-Control', 'public, max-age=60');
        res.status(200).json({
            success: true,
            reviews: reviews.map(publicShape)
        });
    } catch (err) {
        console.log('getHomeReviews error :', err);
        return fail(res, 'Server Error Occured', err);
    }
};

// seller public reviews
export const getSellerPublicReviews = async (req, res) => {
    try {
        const { sellerId } = req.params;
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(parseInt(req.query.limit) || 10, 20);

        const seller = await Seller.findOne(mongoose.isValidObjectId(sellerId) ? { _id: sellerId } : { sellerId })
            .select('sellerId businessName fullName profileImage businessYear country emirate city area createdAt ratingAverage ratingCount status accountStatus')
            .lean();

        if (!seller || seller.status !== 'approved' || seller.accountStatus !== 'active') {
            return fail(res, 'Seller not found', 404);
        }

        const match = { sellerId: seller._id, isHidden: false };

        const [reviews, total, dist] = await Promise.all([
            Review.find(match)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .populate('reviewerId', 'firstName lastName fullName')
                .populate('vehicleId', 'make model year')
                .lean(),
            Review.countDocuments(match),
            Review.aggregate([{ $match: match }, { $group: { _id: '$rating', count: { $sum: 1 } } }]),
        ]);

        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        dist.forEach((d) => { distribution[d._id] = d.count; });

        res.set('Cache-Control', 'public, max-age=60');
        return res.status(200).json({
            success: true,
            seller: {
                sellerId: seller.sellerId,
                name: seller.businessName || seller.fullName,
                ownerName: seller.fullName,
                profileImage: seller.profileImage || null,
                businessYear: seller.businessYear || null,
                country: seller.country || null,
                emirate: seller.emirate || null,
                city: seller.city || null,
                area: seller.area || null,
                memberSince: seller.createdAt,
            },
            summary: { ratingAverage: seller.ratingAverage || 0, ratingCount: seller.ratingCount || 0, distribution },
            reviews: reviews.map(publicShape),
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (err) {
        console.error('getSellerPublicReviews error:', err);
        return fail(res, 'Server Error Occured', 500);
    }
};

// ================================================ SELLER

// my reviews
export const getMyReceivedReviews = async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(parseInt(req.query.limit) || 10, 20);

        const match = { sellerId: req.user.id, isHidden: false };

        const [reviews, total, seller] = await Promise.all([
            Review.find(match)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .populate('reviewerId', 'firstName lastName fullName')
                .populate('vehicleId', 'make model year')
                .populate('orderId', 'orderId')
                .lean(),
            Review.countDocuments(match),
            Seller.findById(req.user.id).select('ratingAverage ratingCount').lean(),
        ]);

        res.status(200).json({
            succsee: true,
            summary: { ratingAverage: seller?.ratingAverage || 0, ratingCount: seller?.ratingCount || 0 },
            reviews: reviews.map((r) => ({
                ...publicShape(r),
                reviewId: r.reviewId,
                orderNumber: r.orderId?.orderId || null,
                canReply: true,
            })),
            pagination: {
                page, limit, total,
                totalPages: Math.ceil(total / limit)
            },
        });

    } catch (err) {
        console.log('getMyReceivedReviews error :', err);
        return fail(res, 'Server Error Occured', err);
    }
};

// ================================================ SELLER + BUYER

const MAX_COMMENT = 500;

const cleanText = (v) => String(v ?? '').trim();
const msgOf = (reason) => REVIEW_MESSAGES[reason] || 'Not Allowed';

const findOrder = (idOrCode) => Order.findOne(
    mongoose.isValidObjectId(idOrCode) ? { _id: idOrCode } : { orderId: idOrCode }
).lean();

const parseRating = (v) => {
    const n = Number(v);
    return Number.isInteger(n) && n >= 1 && n <= 5 ? n : null;
};

const shape = (r) => (r ? {
    _id: r._id,
    reviewId: r.reviewId,
    rating: r.rating,
    comment: r.comment,
    createdAt: r.createdAt,
    editedAt: r.editedAt || null,
    reply: r.reply?.text ? { text: r.reply.text, at: r.reply.at, editedAt: r.reply.editedAt || null } : null,
    isHidden: !!r.isHidden,
} : null);

// get order review
export const getOrderReview = async (req, res) => {
    try {
        const order = await findOrder(req.params.orderId);
        if (!order) return fail(res, "Order not found", 404);

        const review = await Review.findOne({ orderId: order._id }).lean();
        const isBuyer = String(order.buyerId) === String(req.user.id);
        const isSeller = String(order.sellerId) === String(req.user.id);

        if (!isBuyer && !isSeller) return fail(res, 'Order not found', 404);

        const give = isBuyer ? getReviewEligibility(order, req.user.id, review) : { canReview: false, reason: 'not_buyer' };
        const edit = isBuyer && review ? getEditEligibility(review, order) : { canEdit: false, reason: null };

        return res.status(200).json({
            success: true,
            role: isBuyer ? 'buyer' : 'seller',
            review: shape(review),
            canReview: give.canReview,
            reviewReason: give.canReview || !isBuyer ? null : msgOf(give.reason),
            canEdit: edit.canEdit,
            editReason: edit.canEdit || !review ? null : msgOf(edit.reason),
            canReply: isSeller && !!review && !review.isHidden,
        });

    } catch (err) {
        console.log("getOrderReview error :", err);
        return fail(res, 'Server Error Occured', 500);
    }
};

// create review
export const createReview = async (req, res) => {
    try {
        const rating = parseRating(req.body?.rating);
        const comment = cleanText(req.body?.comment);

        if (!rating) return fail(res, 'Please select a rating from 1 to 5');
        if (comment.length > MAX_COMMENT) return fail(res, `Comment is too long (max ${MAX_COMMENT} characters)`);

        const order = await findOrder(req.params.orderId);
        if (!order) return fail(res, 'Order not found', 404);

        const existing = await Review.findOne({ orderId: order._id }).select('_id').lean();

        const elig = getReviewEligibility(order, req.user.id, existing);
        if (!elig.canReview) return fail(res, msgOf(elig.reason), elig.reason === 'not_buyer' ? 404 : 409);

        let review;
        try {
            review = await Review.create({
                orderId: order._id,
                vehicleId: order.vehicleId,
                listingId: order.listingId,
                sellerId: order.sellerId,
                reviewerId: order.buyerId,
                reviewerType: order.buyerType,
                rating,
                comment,
            });
        } catch (err) {
            if (err?.code === 11000) return fail(res, msgOf('already_reviewed'), 409);
            throw err;
        }

        await recalcSellerRating(order.sellerId);

        await notifyParty({ id: order.sellerId, type: 'Seller' }, {
            type: 'review_received',
            vehicleId: order.vehicleId,
            title: 'New review received',
            message: `A buyer left a ${rating}-star review on order ${order.orderId} (${order.listingId}). You can reply to it.`,
        });

        return res.status(201).json({
            success: true,
            message: 'Review submitted',
            review: shape(review)
        });

    } catch (err) {
        console.log('createReview error :', err);
        return fail(res, 'Server Error Occured', 500);
    }
};

// edit review
export const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) return fail(res, 'Review not found', 404);

        const rating = parseRating(req.body?.rating);
        const comment = cleanText(req.body?.comment);

        if (!rating) return fail(res, 'Please select a rating from 1 to 5');
        if (comment.length > MAX_COMMENT) return fail(res, `Comment is too long (max ${MAX_COMMENT} characters)`);

        const review = await Review.findOne({ _id: id, reviewerId: req.user.id }).lean();
        if (!review) return fail(res, 'Review not found', 404);

        const order = await Order.findById(review.orderId).lean();
        const elig = getEditEligibility(review, order);
        if (!elig.canEdit) return fail(res, msgOf(elig.reason), 409);

        // filter me "reply nahi hai" bhi hai: edit aur seller reply ek saath aaye to reply jeetta hai
        const updated = await Review.findOneAndUpdate(
            { _id: id, reviewerId: req.user.id, isHidden: false, 'reply.text': { $exists: false } },
            {
                $set: {
                    rating,
                    comment,
                    editedAt: new Date(),
                    // edit ke baad home page se hatao, admin dobara dekh kar chune
                    featured: false,
                    ...(review.featured ? { editedAfterFeatured: true } : {}),
                },
                $unset: { featuredAt: '', featuredBy: '' },
            },
            { new: true }
        );

        if (!updated) return fail(res, msgOf('locked_by_reply'), 409);

        await recalcSellerRating(updated.sellerId);

        return res.status(200).json({
            success: true,
            message: 'Review updated',
            review: shape(updated)
        });

    } catch (err) {
        console.log('updateReview error :', err);
        return fail(res, 'Server Error Occured', 500);
    }
};

// reply to review
export const replyToReview = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) return fail(res, 'Review not found', 404);

        const text = cleanText(req.body?.text);
        if (!text) return fail(res, 'Please write a reply');
        if (text.length > MAX_COMMENT) return fail(res, `Reply is too long (max ${MAX_COMMENT} characters)`);

        const review = await Review.findOne({ _id: id, sellerId: req.user.id }).lean();
        if (!review) return fail(res, 'Review not found', 404);
        if (review.isHidden) return fail(res, 'This review is hidden', 409);

        const now = new Date();
        const hasReply = !!review.reply?.text;

        const set = hasReply
            ? { 'reply.text': text, 'reply.editedAt': now }
            : { 'reply.text': text, 'reply.at': now };

        const updated = await Review.findOneAndUpdate(
            { _id: id, sellerId: req.user.id, isHidden: false },
            { $set: set },
            { new: true }
        );
        if (!updated) return fail(res, 'Review not found', 404);

        if (!hasReply) {
            await notifyParty({ id: updated.reviewerId, type: updated.reviewerType }, {
                type: 'review_replied',
                vehicleId: updated.vehicleId,
                title: 'The seller replied to your review',
                message: `The seller replied to your review on ${updated.listingId}. Your review can no longer be edited.`,
            });
        }

        return res.status(200).json({
            success: true,
            message: hasReply ? 'Reply updated' : 'Reply posted',
            review: shape(updated),
        });
    } catch (err) {
        console.log('replyToReview error :', err);
        return fail(res, 'Server Error Occured', 500);
    }
};

// my given reviews 
export const getMyGivenReviews = async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(parseInt(req.query.limit) || 10, 20);

        const match = { reviewerId: req.user.id };

        const [rows, total] = await Promise.all([
            Review.find(match)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit()
                .populate('sellerId', 'businessName fullName')
                .populate('vehicleId', 'make model year')
                .populate('orderId', 'orderId status hasOpenDispute')
                .lean(),
            Review.countDocuments(match),
        ]);

        const reviews = rows.map((r) => {
            const edit = getEditEligibility(r, r.orderId);
            return {
                _id: r._id,
                reviewId: r.reviewId,
                rating: r.rating,
                comment: r.comment,
                createdAt: r.createdAt,
                editedAt: r.editedAt || null,
                reply: r.reply?.text ? { text: r.reply.text, at: r.reply.at, editedAt: r.reply.editedAt || null } : null,
                isHidden: !!r.isHidden,
                seller: r.sellerId?.businessName || r.sellerId?.fullName || 'Seller',
                vehicle: vehicleTitle(r.vehicleId),
                orderNumber: r.orderId?.orderId || null,
                canEdit: edit.canEdit,
                editReason: edit.canEdit ? null : msgOf(edit.reason),
            };
        });

        return res.status(200).json({
            success: true,
            message: "List Fetched Successfully",
            reviews,
            pagination: {
                page, limit, total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        console.log('getMyGivenReviews error :', err);
        return fail(res, 'Server Error Occured', 500);
    }
};
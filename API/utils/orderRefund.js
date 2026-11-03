
import mongoose from 'mongoose';
import Order from '../models/orderModelSchema.js';
import Payout from '../models/payoutModelSchema.js';
import Vehicle from '../models/vehicleModelSchema.js';
import Bid from '../models/bidModelSchema.js';
import PaymentEvent from '../models/paymentEventModelSchema.js';
import { getStripe } from '../config/stripe.js';
import { createNotification } from '../services/notificationService.js';

// adminController.cancelAndRefundOrder ka core. Logic wahi hai, bas req/res hata kar yahan nikala hai
// taaki Admin "Cancel & Refund" aur Dispute resolve (refund buyer) dono ek hi code chalayein.
//
// Order of operations (paise ki baat hai):
//   1) Payout ko 'canceled' karke LOCK  -> seller request / admin transfer ab nahi ho sakta
//   2) Stripe refund                    -> fail ho to lock wapas hata do, kuchh nahi badlta
//   3) Order canceled, car unsold, bid canceled, notifications
//
// Return:  { ok: true, message, refundStatus?, alreadyCanceled? }
//     ya   { ok: false, status, message, code }
//
// viaDispute = true sirf dispute resolve se aata hai. Direct admin cancel open dispute ke order par rukta hai.

const OPEN_PAYOUT_STATUSES = ['on_hold', 'available', 'requested'];

const notifySafe = async (payload) => {
    try {
        await createNotification(payload);
    } catch (err) {
        console.error('[refund] notification failed:', err.message);
    }
};

const fail = (status, message, code) => ({ ok: false, status, message, code });

export const cancelAndRefundCore = async ({ orderId, reason, actor, viaDispute = false }) => {
    const why = typeof reason === 'string' ? reason.trim() : '';

    if (!mongoose.isValidObjectId(orderId)) return fail(400, 'Invalid order id', 'invalid_id');
    if (why.length < 3) return fail(400, 'A reason is required', 'reason_required');

    const order = await Order.findById(orderId).lean();
    if (!order) return fail(404, 'Order Not Found', 'not_found');

    if (order.hasOpenDispute && !viaDispute) {
        return fail(409, 'This order has an open dispute. Resolve it from Dispute Management instead.', 'open_dispute');
    }

    if (order.status !== 'paid') return fail(400, `Only paid orders can be refunded (order is ${order.status})`, 'not_paid');

    const pi = order.stripePaymentIntentId;
    if (!pi) return fail(400, 'No Stripe payment found for this order', 'no_payment');

    const now = new Date();

    // ---- 1) lock via payout ----
    const locked = await Payout.findOneAndUpdate(
        { orderId: order._id, status: { $in: OPEN_PAYOUT_STATUSES } },
        {
            $set: { status: 'canceled' },
            $push: { history: { status: 'canceled', at: now, by: actor.role, byId: actor.id, note: `Order canceled & refunded: ${why}` } },
        },
        { new: false }
    ).lean();

    const revertLock = async (note) => {
        if (!locked) return;
        await Payout.updateOne(
            { _id: locked._id, status: 'canceled' },
            {
                $set: { status: locked.status },
                $push: { history: { status: locked.status, at: new Date(), by: 'system', note } },
            }
        );
    };

    if (!locked) {
        const existing = await Payout.findOne({ orderId: order._id }).select('status').lean();
        // payout hi nahi bana tha, ya pichli attempt beech me ruki thi (canceled) -> aage badho
        if (existing && existing.status !== 'canceled') {
            return fail(400, `Seller payout is already ${existing.status}. This cannot be auto-refunded, handle it manually.`, 'payout_closed');
        }
    }

    // ---- 2) Stripe refund ----
    let refund;
    try {
        refund = await getStripe().refunds.create(
            { payment_intent: pi, metadata: { orderId: order.orderId, reason: viaDispute ? 'dispute_refund' : 'admin_cancel' } },
            { idempotencyKey: `refund_admin_${pi}` }
        );
    } catch (err) {
        if (err?.code === 'charge_already_refunded') {
            refund = { id: null, status: 'succeeded' };       // pehle ho chuka tha
        } else {
            console.error('[refund] Stripe refund failed:', err.message);
            await revertLock('Refund failed, cancel reverted');

            await PaymentEvent.create({
                type: 'refund.admin',
                orderId: order._id,
                paymentIntentId: pi,
                amount: Math.round(order.amount * 100),
                currency: 'aed',
                outcome: 'refund_failed',
                processed: true,
                note: err.message,
            });
            return fail(502, 'Refund failed at the payment gateway. Nothing was changed, try again.', 'gateway_failed');
        }
    }

    if (refund.status === 'failed' || refund.status === 'canceled') {
        await revertLock('Refund failed, cancel reverted');
        return fail(502, 'Refund was not accepted by the payment gateway. Nothing was changed.', 'gateway_rejected');
    }

    // ---- 3) Order / vehicle / bid ----
    const canceled = await Order.findOneAndUpdate(
        { _id: order._id, status: 'paid' },
        {
            $set: {
                status: 'canceled',
                isOpen: false,                    // new order created for this vehicle
                canceledAt: now,
                'refund.status': refund.status,
                'refund.stripeRefundId': refund.id,
                'refund.amount': order.amount,
                'refund.reason': why,
                'refund.refundedAt': now,
                'refund.refundedBy': actor.id,
            },
            $push: { statusHistory: { status: 'canceled', at: now, by: actor.role, note: `Refunded: ${why}` } },
        },
        { new: true }
    ).lean();

    await PaymentEvent.create({
        type: 'refund.admin',
        orderId: order._id,
        paymentIntentId: pi,
        amount: Math.round(order.amount * 100),
        currency: 'aed',
        outcome: 'refunded_admin',
        processed: true,
        note: why,
    });

    if (!canceled) {
        return { ok: true, message: 'Order was already canceled', alreadyCanceled: true };
    }

    // vehicle can be relisted
    await Vehicle.updateOne(
        { _id: order.vehicleId, auctionStatus: 'sold' },
        { $set: { auctionStatus: 'unsold', soldOn: null } }
    );

    if (order.bidId) {
        await Bid.updateOne({ _id: order.bidId, status: 'won' }, { $set: { status: 'canceled' } });
    }

    await notifySafe({
        recipientId: order.buyerId,
        recipientType: order.buyerType,
        type: 'purchase_canceled',
        vehicleId: order.vehicleId,
        title: 'Order canceled and refunded',
        message: `Your order for ${order.listingId} was canceled and AED ${order.amount} is being refunded to your card. Reason: ${why}`,
    });

    await notifySafe({
        recipientId: order.sellerId,
        recipientType: 'Seller',
        type: 'order_canceled',
        vehicleId: order.vehicleId,
        title: 'Sale canceled',
        message: `The sale of ${order.listingId} was canceled and the buyer was refunded. The vehicle is unsold and can be relisted by admin. Reason: ${why}`,
    });

    return { ok: true, message: 'Order canceled and refunded', refundStatus: refund.status };
};
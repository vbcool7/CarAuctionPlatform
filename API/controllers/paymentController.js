
import mongoose from "mongoose";
import Order from '../models/orderModelSchema.js';
import Vehicle from '../models/vehicleModelSchema.js';
import Bid from '../models/bidModelSchema.js';
import Admin from '../models/adminModelSchema.js';
import PaymentEvent from '../models/paymentEventModelSchema.js';

import { getStripe } from '../config/stripe.js';
import { createNotification } from "../services/notificationService.js";
import { createPayoutForOrder } from "../utils/payoutHelper.js";

const notifySafe = async (payload) => {
    try {
        await createNotification(payload);
    } catch (err) {
        console.error('[payment] notification failed:', err.message);
    }
};

const MIN_CHECKOUT_MS = 31 * 60 * 1000;      // Stripe session min 30 min jeeta hai
const MAX_CHECKOUT_MS = 24 * 60 * 60 * 1000; // Stripe session max 24 ghante

const roleToType = (role) => (role === 'buyer' ? 'Buyer' : role === 'seller' ? 'Seller' : null);

// Buyer/Seller ko payment karne ke liye page deti hai
export const createCheckoutSession = async (req, res) => {
    try {
        const { id } = req.params;
        const userType = roleToType(req.user.role);

        if (!mongoose.isValidObjectId(id) || !userType) {
            return res.status(400).json({
                success: false,
                message: 'Invalid request'
            });
        }

        const order = await Order.findOne({ _id: id, buyerId: req.user.id, buyerType: userType });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        if (order.status !== 'pending_payment') {
            return res.status(400).json({
                success: false,
                message: `This order is ${order.status}`
            });
        }

        const now = Date.now();
        const msLeft = new Date(order.paymentDueAt).getTime() - now;
        if (msLeft <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Payment window has expired'
            });
        }

        if (msLeft < MIN_CHECKOUT_MS) {
            return res.status(400).json({
                success: false,
                message: 'Payment window is closing in less than 30 minutes, cannot start a new payment'
            });
        }

        const stripe = getStripe();

        // purana open session expire karo: do tab me double charge na ho
        if (order.stripeSessionId) {
            try {
                await stripe.checkout.sessions.expire(order.stripeSessionId);
            } catch (e) {
                // already expired/complete: ignore
            }
        }

        const base = process.env.FRONTEND_URL || 'http://localhost:5173';
        const successUrl = process.env.PAYMENT_SUCCESS_URL || `${base}/payment-result?status=success&order=${order.orderId}`;
        const cancelUrl = process.env.PAYMENT_CANCEL_URL || `${base}/payment-result?status=cancelled&order=${order.orderId}`;

        const expiresAtMs = Math.min(now + MAX_CHECKOUT_MS, new Date(order.paymentDueAt).getTime());

        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            client_reference_id: String(order._id),
            metadata: { orderMongoId: String(order._id), orderId: order.orderId },
            payment_intent_data: { metadata: { orderMongoId: String(order._id), orderId: order.orderId } },
            line_items: [{
                quantity: 1,
                price_data: {
                    currency: 'aed',
                    unit_amount: Math.round(order.amount * 100),
                    product_data: { name: `Vehicle ${order.listingId}`, description: `Order ${order.orderId}` },
                },
            }],

            success_url: successUrl,
            cancel_url: cancelUrl,
            expires_at: Math.floor(expiresAtMs / 1000),
        });

        await Order.updateOne(
            { _id: order._id, status: 'pending_payment' },
            { $set: { stripeSessionId: session.id } }
        );

        await PaymentEvent.create({
            type: 'checkout.session.created',
            orderId: order._id,
            sessionId: session.id,
            amount: Math.round(order.amount * 100),
            currency: 'aed',
            outcome: 'session_created',
            processed: true,
        });

        return res.status(200).json({
            success: true,
            url: session.url
        });

    } catch (err) {
        console.log("createCheckoutSession error :", err);
        res.status(500).json({
            success: false,
            message: "Server Error Occured"
        });
    }
};

// ============ Webhook: payment confirm (raw body chahiye) ============
export const refundPayment = async (req, res) => {
    try {
        await getStripe().refunds.create(
            { payment_intent: paymentIntentId, metadata: { reason } },
            { idempotencyKey: `refund_${paymentIntentId}` }
        );
        return true;

    } catch (err) {
        console.error('[payment] refund failed for', paymentIntentId, err.message);
        return false;
    }
};

// after payment success : mark vehicle 'sold'
// winning bid : mark 'won'
const finalizeSale = async (order, now) => {
    const v = await Vehicle.updateOne(
        { _id: order.vehicleId, auctionStatus: 'pending_payment' },
        { $set: { auctionStatus: 'sold', soldOn: now } }
    );

    if (order.bidId) {
        await Bid.updateOne({ _id: order.bidId, status: 'active' }, { $set: { status: 'won' } });
    }
    return v.modifiedCount > 0;
};

const processPaidSession = async (session) => {
    const orderMongoId = session.metadata?.orderMongoId;

    if (!mongoose.isValidObjectId(orderMongoId)) {
        return {
            outcome: 'ignored',
            note: 'No order metadata on session'
        };
    }

    const order = await Order.findById(orderMongoId).lean();
    if (!order) {
        return { outcome: 'ignored', note: 'Order not found' };
    }

    const admin = await Admin.findOne();
    const adminNotify = (title, message) => admin && notifySafe({
        recipientId: admin._id, recipientType: 'Admin', type: 'payment_received',
        vehicleId: order.vehicleId, title, message,
    });

    const pi = session.payment_intent;
    const now = new Date();

    // amount / currency check
    if (session.currency !== 'aed' || session.amount_total !== Math.round(order.amount * 100)) {
        const refunded = await refundPayment(pi, 'amount_mismatch');
        await adminNotify(
            refunded ? 'Payment amount mismatch (refunded)' : 'Payment amount mismatch - REFUND MANUALLY',
            `Order ${order.orderId}: expected AED ${order.amount}, got ${session.amount_total / 100} ${session.currency}. PaymentIntent ${pi}.`
        );
        return { outcome: refunded ? 'amount_mismatch' : 'refund_failed', orderId: order._id, note: 'Amount/currency mismatch' };
    }

    // ATOMIC: sirf pending_payment hi paid ho sakta hai
    const paid = await Order.findOneAndUpdate(
        { _id: order._id, status: 'pending_payment' },
        {
            $set: { status: 'paid', paidAt: now, stripePaymentIntentId: pi, stripeSessionId: session.id },
            $push: { statusHistory: { status: 'paid', at: now, by: 'gateway', note: `Stripe payment ${pi}` } },
        },
        { new: true }
    ).lean();

    if (paid) {
        const vehicleUpdated = await finalizeSale(paid, now);

        await notifySafe({
            recipientId: paid.buyerId, recipientType: paid.buyerType, type: 'payment_received',
            vehicleId: paid.vehicleId, title: 'Payment successful',
            message: `We received your payment of AED ${paid.amount} for ${paid.listingId}.`,
        });
        await notifySafe({
            recipientId: paid.sellerId, recipientType: 'Seller', type: 'auction_sold',
            vehicleId: paid.vehicleId, title: 'Your vehicle has been sold',
            message: `${paid.listingId} was sold for AED ${paid.amount}.`,
        });
        await adminNotify('Vehicle Sold', `${paid.listingId} was sold for AED ${paid.amount} (Order ${paid.orderId}).`);

        if (!vehicleUpdated) {
            await adminNotify('Check vehicle status', `Order ${paid.orderId} is paid but the vehicle was not in pending_payment.`);
        }

        // payout create
        // return { outcome: 'paid', orderId: paid._id };
        try {
            await createPayoutForOrder(paid);
        } catch (payoutErr) {
            console.error('CRITICAL: payout creation failed for order', paid.orderId, payoutErr);
        }
    }

    // Order pending nahi tha. Ye same payment ka webhook RETRY hai ya alag (late / duplicate) payment?
    if (order.status === 'paid' && order.stripePaymentIntentId === pi) {
        await finalizeSale(order, now);   // retry: bacha hua kaam poora karo, refund nahi

        try {
            await createPayoutForOrder(order);
        } catch (e) {
            console.error('CRITICAL: payout creation failed', order.orderId, e);
        }

        return { outcome: 'paid', orderId: order._id, note: 'Webhook retry' };
    }

    const isDuplicate = order.status === 'paid';
    const refunded = await refundPayment(pi, isDuplicate ? 'duplicate' : 'late');

    await notifySafe({
        recipientId: order.buyerId,
        recipientType: order.buyerType,
        type: 'payment_expired',
        vehicleId: order.vehicleId,
        title: refunded ? 'Payment refunded' : 'Payment received after expiry',
        message: refunded
            ? `Your payment for ${order.listingId} arrived after the order was no longer valid, so it is being refunded.`
            : `Your payment for ${order.listingId} arrived after the order was no longer valid. Support will refund you.`,
    });
    await adminNotify(
        refunded ? 'Late/duplicate payment refunded' : 'Late/duplicate payment - REFUND MANUALLY',
        `Order ${order.orderId} (${order.status}). PaymentIntent ${pi}.`
    );

    return {
        outcome: refunded ? (isDuplicate ? 'refunded_duplicate' : 'refunded_late') : 'refund_failed',
        orderId: order._id,
        note: `Order was ${order.status}`,
    };
};

export const stripeWebhook = async (req, res) => {
    let event;
    try {
        event = getStripe().webhooks.constructEvent(
            req.body,
            req.headers['stripe-signature'],
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error('[payment] webhook signature failed:', err.message);
        return res.status(400).send('Invalid signature');
    }

    try {
        const handled = ['checkout.session.completed', 'checkout.session.async_payment_succeeded'];

        if (!handled.includes(event.type)) {
            return res.status(200).json({
                received: true
            });
        }

        const session = event.data.object;
        if (session.payment_status !== 'paid') {
            return res.status(200).json({ received: true });
        }

        // dedupe + history
        let log;
        try {
            log = await PaymentEvent.create({
                eventId: event.id,
                type: event.type,
                sessionId: session.id,
                paymentIntentId: session.payment_intent,
                amount: session.amount_total,
                currency: session.currency,
            });
        } catch (e) {
            if (e?.code !== 11000) throw e;
            log = await PaymentEvent.findOne({ eventId: event.id });

            if (log?.processed) return res.status(200).json({
                received: true
            });
        }

        const result = await processPaidSession(session);

        await PaymentEvent.updateOne(
            { _id: log._id },
            { $set: { processed: true, outcome: result.outcome, note: result.note, orderId: result.orderId } }
        );

        return res.status(200).json({
            received: true
        });

    } catch (err) {
        console.error('[payment] webhook processing error:', err);
        return res.status(500).json({
            success: false,
            message: "Server Error Occured"
        });
    }
};

// ============ 3) Order status (payment result page polling) ============
const ORDER_FIELDS = 'orderId listingId vehicleId source amount currency status paymentDueAt paidAt expiredAt createdAt statusHistory handover.status handover.confirmedAt bidId refund.amount refund.refundedAt';

export const getMyOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const userType = roleToType(req.user.role);

        if (!userType) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role'
            });
        }

        // mongo _id ya readable orderId (ORD-00001) dono chalega
        const filter = mongoose.isValidObjectId(id) ? { _id: id } : { orderId: id };
        const order = await Order.findOne({ ...filter, buyerId: req.user.id, buyerType: userType })
            .select(ORDER_FIELDS)
            .populate(
                'vehicleId',
                `
        make model year trim vin mileage listingId
        vehicleType bodyType fuelType transmission drivetrain
        exteriorColor interiorColor country emirate city zipCode
        titleStatus accidentHistory vehicleDescription
        overallCondition mechanicalCondition
        exteriorCondition interiorCondition
        tiresCondition glassCondition
        paintType repainted sunroof smokeOdor petFriendly
        engineSize cylinders doors seats images documents
        priceType buyNowPrice startingBidPrice currentBid
        auctionType auctionStatus auctionStartDateTime
        auctionEndDateTime auctionDuration
    `
            )
            .populate('sellerId', 'fullName businessName')
            .lean();

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        return res.status(200).json({
            success: true,
            order
        });

    } catch (err) {
        console.error('getMyOrder error:', err);
        return res.status(500).json({
            success: false,
            message: 'Server Error Occured'
        });
    }
};

export const getMyOrders = async (req, res) => {
    try {
        const userType = roleToType(req.user.role);

        if (!userType) return res.status(400).json({
            success: false,
            message: 'Invalid role'
        });

        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(parseInt(req.query.limit) || 10, 50);

        const filter = { buyerId: req.user.id, buyerType: userType };
        if (req.query.status) filter.status = req.query.status;
        if (req.query.source) filter.source = req.query.source;;

        const [orders, total] = await Promise.all([
            Order.find(filter)
                .select(ORDER_FIELDS)
                .populate('vehicleId', 'make model year images mileage transmission fuelType emirate')
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            Order.countDocuments(filter),
        ]);

        return res.status(200).json({
            success: true,
            orders,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            },
        });
    } catch (err) {
        console.error('getMyOrders error:', err);
        return res.status(500).json({
            success: false,
            message: 'Server Error Occured'
        });
    }
};

// get order summary
export const getMyOrdersSummary = async (req, res) => {
    try {
        const userType = roleToType(req.user.role);
        if (!userType) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role'
            })
        };

        const rows = await Order.aggregate([
            { $match: { buyerId: new mongoose.Types.ObjectId(req.user.id), buyerType: userType, source: req.query.source || { $in: ['auction', 'buy_now'] } } },
            { $group: { _id: '$status', count: { $sum: 1 }, total: { $sum: '$amount' } } },
        ]);

        const summary = {};
        rows.forEach((r) => { summary[r._id] = { count: r.count, total: r.total }; });

        return res.status(200).json({
            success: true,
            summary
        });

    } catch (err) {
        console.error('getMyOrdersSummary error:', err);
        return res.status(500).json({
            success: false,
            message: 'Server Error Occured'
        });
    }
};
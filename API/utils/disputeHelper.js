
import Dispute from '../models/disputeModelSchema.js';
import Order from '../models/orderModelSchema.js';
import Payout from '../models/payoutModelSchema.js';

import { DISPUTE_STATUSES, OPEN_DISPUTE_STATUSES } from '../models/disputeModelSchema.js';

const DAY_MS = 24 * 60 * 60 * 1000;

// Maximum days after payment to raise a dispute.
export const DISPUTE_WINDOW_DAYS = Number(process.env.DISPUTE_WINDOW_DAYS) > 0 ? Number(process.env.DISPUTE_WINDOW_DAYS) : 7;

// Show a red badge for disputes open for more than 7 days.
export const DISPUTE_STALE_DAYS = 7;

// Payout statuses eligible for a hold.
export const HOLDABLE_PAYOUT_STATUSES = ['on_hold', 'available', 'requested'];

export const partyName = (doc, type) => {
    if (!doc) return type === 'Seller' ? 'Seller' : 'Buyer';
    if (type === 'Seller') return doc.businessName || doc.fullName || 'Seller';
    return doc.companyName || [doc.firstName, doc.lastName].filter(Boolean).join(' ') || doc.fullName || 'Buyer';
}

export const vehicleTitleOf = (v) => (v ? [v.year, v.make, v.model].filter(Boolean).join(' ') : '');

export const vehicleImageOf = (v) => {
    const first = v?.images?.[0];
    if (!first) return '';
    return typeof first === 'string' ? first : first.url || first.secure_url || '';
}

export const roleInOrder = (order, user) => {
    if (!order || !user) return null;
    const uid = String(user.id);

    if (user.role === 'seller' && String(order.sellerId?._id || order.sellerId) === uid) return 'seller';

    const buyerType = user.role === 'buyer' ? 'Buyer' : user.role === 'seller' ? 'Seller' : null;
    if (buyerType && order.buyerType === buyerType && String(order.buyerId?._id || order.buyerId) === uid) return 'buyer';

    return null;
};

// check open days
export const daysOpenOf = (d, now = Date.now()) => {
    if (!d?.isOpen) return null;
    return Math.max(0, Math.floor((now - new Date(d.createdAt).getTime()) / DAY_MS));
};

// Checks whether a buyer or seller is eligible to raise a dispute for an order.
export const computeEligibility = ({ order, role, payout, openDispute, myDispute, now = Date.now() }) => {
    const deadline = order?.paidAt ? new Date(new Date(order.paidAt).getTime() + DISPUTE_WINDOW_DAYS * DAY_MS) : null;
    const no = (reason) => ({ canRaise: false, reason, deadline });

    if (!role) return no('This is not your order');
    if (order.status !== 'paid') return no('Disputes can only be raised on paid orders');
    if (myDispute) return no('You have already raised a dispute on this order');
    if (openDispute) return no('A dispute is already open on this order');
    if (!deadline || now > deadline.getTime()) return no(`The ${DISPUTE_WINDOW_DAYS}-day dispute window has ended`);
    if (payout?.status === 'paid') return no('The seller payout has already been transferred');
    if (payout?.status === 'canceled') return no('This order is being refunded');

    return { canRaise: true, reason: null, deadline };
};

// Fetches dispute and payout details for orders and checks dispute eligibility.
export const getDisputeInfoForOrders = async (orders, user, forceRole = null) => {
    const list = (orders || []).filter(Boolean);
    const paidIds = list.filter((o) => o.status === 'paid').map((o) => o._id);

    let disputes = [];
    let payouts = [];

    if (paidIds.length) {
        [disputes, payouts] = await Promise.all([
            Dispute.find({ orderId: { $in: paidIds } }).select('disputeId orderId status isOpen raisedBy.role').lean(),
            Payout.find({ orderId: { $in: paidIds } }).select('orderId status').lean(),
        ]);
    }

    const disputesByOrder = new Map();
    disputes.forEach((d) => {
        const k = String(d.orderId);
        if (!disputesByOrder.has(k)) disputesByOrder.set(k, []);
        disputesByOrder.get(k).push(d);
    });
    const payoutByOrder = new Map(payouts.map((p) => [String(p.orderId), p]));

    const brief = (d) => (d ? { _id: d._id, disputeId: d.disputeId, status: d.status } : null);

    const map = new Map();
    list.forEach((order) => {
        const k = String(order._id);
        const role = forceRole || roleInOrder(order, user);
        const all = disputesByOrder.get(k) || [];
        const open = all.find((d) => d.isOpen) || null;
        const mine = all.find((d) => d.raisedBy?.role === role) || null;

        const elig = computeEligibility({ order, role, payout: payoutByOrder.get(k), openDispute: open, myDispute: mine });

        map.set(k, {
            role,
            canRaise: elig.canRaise,
            reason: elig.reason,
            deadline: elig.deadline,
            openDispute: open ? { ...brief(open), raisedByMe: open.raisedBy?.role === role } : null,
            myDispute: brief(mine),
        });
    });

    return map;
};

// Dispute raise hone par: Order flag + Payout freeze.
// { ok: true } ya { ok: false, reason: 'payout_paid' | 'payout_locked' }
export const applyHold = async (orderId) => {
    await Order.updateOne({ _id: orderId, status: 'paid' }, { $set: { hasOpenDispute: true } });

    const payout = await Payout.findOne({ orderId }).select('status').lean();
    if (!payout) return { ok: true };   // payout abhi bana hi nahi: Order flag se confirmHandover rukta hai, createPayoutForOrder flag se hold lagata hai

    const res = await Payout.updateOne(
        { orderId, status: { $in: HOLDABLE_PAYOUT_STATUSES } },
        { $set: { disputeHold: true } }
    );

    if (res.matchedCount === 0) {
        const now = await Payout.findOne({ orderId }).select('status').lean();
        return { ok: false, reason: now?.status === 'paid' ? 'payout_paid' : 'payout_locked' };
    }
    return { ok: true };
};

// Releases stale payout holds when no open dispute exists.
export const releaseHold = async (orderId) => {
    await Order.updateOne({ _id: orderId }, { $set: { hasOpenDispute: false } });
    await Payout.updateOne({ orderId, disputeHold: true }, { $set: { disputeHold: false } });
};

export const reconcileHolds = async () => {
    const flaggedOrders = await Order.find({ hasOpenDispute: true }).select('_id').lean();
    const heldOrderIds = await Payout.find({ disputeHold: true }).distinct('orderId');

    const candidates = new Map();
    flaggedOrders.forEach((o) => candidates.set(String(o._id), o._id));
    heldOrderIds.forEach((id) => candidates.set(String(id), id));

    if (!candidates.size) return { checked: 0, released: 0 };

    const ids = [...candidates.values()];
    const stillOpen = new Set((await Dispute.find({ orderId: { $in: ids }, isOpen: true }).distinct('orderId')).map(String));

    let released = 0;
    for (const [key, id] of candidates) {
        if (stillOpen.has(key)) continue;
        await releaseHold(id);
        released += 1;
    }

    return { checked: candidates.size, released };
};
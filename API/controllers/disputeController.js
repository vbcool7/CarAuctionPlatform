
import mongoose from "mongoose";
import Dispute from "../models/disputeModelSchema.js";
import DisputeCategory from '../models/disputeCategoryModelSchema.js';
import Order from '../models/orderModelSchema.js';
import Payout from '../models/payoutModelSchema.js';
import Admin from '../models/adminModelSchema.js';
import Buyer from '../models/buyerModelSchema.js';
import Seller from '../models/sellerModelSchema.js';
import Vehicle from '../models/vehicleModelSchema.js';

import { deleteCloudinaryFiles } from "../utils/cloudinaryUtils.js";
import { notifyParty, notifyStaff } from "../utils/disputeNotify.js";
import { DISPUTE_ICON_KEYS, DEFAULT_DISPUTE_ICON } from "../utils/disputeIcons.js";
import { cancelAndRefundCore } from "../utils/orderRefund.js";
import { DISPUTE_STATUSES, OPEN_DISPUTE_STATUSES } from "../models/disputeModelSchema.js";

import {
    computeEligibility, applyHold, releaseHold, daysOpenOf, vehicleImageOf, vehicleTitleOf, roleInOrder, partyName,
    reconcileHolds, DISPUTE_STALE_DAYS
} from "../utils/disputeHelper.js";

const bad = (res, message, code = 400) => res.status(code).json({ success: false, message });
const clean = (v) => (typeof v === 'string' ? v.trim() : '');
const escRx = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const isYMD = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s || '');
const findFilter = (id) => (mongoose.isValidObjectId(id) ? { _id: id } : { disputeId: id });

const safeRelease = async (orderId, disputeId) => {
    for (let i = 0; i < 2; i += 1) {
        try {
            await releaseHold(orderId);
            return true;
        } catch (err) {
            console.error(`CRITICAL: releaseHold failed for dispute ${disputeId} (attempt ${i + 1})`, err);
        }
    }
    return false;
};

// ================================================= ADMIN

const keyOf = (name) => name.toLowerCase().replace(/\s+/g, ' ').trim();

const categoryRow = (c, counts) => ({
    _id: c._id,
    disputeCategoryId: c.disputeCategoryId || '',
    name: c.name,
    description: c.description || '',
    icon: c.icon,
    appliesTo: c.appliesTo,
    isActive: c.isActive,
    disputes: counts?.total || 0,
    openDisputes: counts?.open || 0,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
});

const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_NOTE = 1000;
const RESOLVE_ACTIONS = ['refund_buyer', 'release_seller', 'reject', 'close'];

const actorOf = async (req) => {
    const admin = await Admin.findById(req.user.id).select('name').lean();
    return { id: req.user.id, role: req.user.role, name: admin?.name || '' };
};

const rowOf = (d, now = Date.now()) => {
    const daysOpen = daysOpenOf(d, now);
    return {
        _id: d._id,
        disputeId: d.disputeId,
        orderId: d.orderId,
        orderNumber: d.orderNumber,
        listingId: d.listingId,
        vehicleTitle: d.vehicleTitle,
        vehicleImage: d.vehicleImage,
        amount: d.amount,
        currency: d.currency,
        category: { _id: d.categoryId, name: d.categoryName },
        raisedBy: { role: d.raisedBy?.role, name: d.raisedBy?.name },
        against: { role: d.against?.role, name: d.against?.name },
        status: d.status,
        outcome: d.resolution?.outcome || null,
        daysOpen,
        isStale: daysOpen != null && daysOpen >= DISPUTE_STALE_DAYS,
        hasResponse: !!d.response?.at,
        createdAt: d.createdAt,
        resolvedAt: d.resolution?.at || null,
    };
};

const OUTCOME_COPY = {
    refund_buyer: { status: 'resolved', title: 'Dispute resolved', text: 'The buyer was refunded and the sale was canceled.' },
    release_seller: { status: 'resolved', title: 'Dispute resolved', text: 'The sale stands and the seller payout continues as normal.' },
    reject: { status: 'rejected', title: 'Dispute rejected', text: 'The dispute was rejected. The sale stands.' },
    close: { status: 'closed', title: 'Dispute closed', text: 'The dispute was closed without a decision.' },
};

// validate category
const readCategoryBody = (body, partial) => {
    const out = {};
    const errors = [];

    if (!partial || body?.name !== undefined) {
        const name = clean(body?.name).replace(/\s+/g, ' ');
        if (name.length < 2 || name.length > 60) errors.push('Category name must be 2 to 60 characters');
        out.name = name;
    }
    if (body?.description !== undefined) {
        const description = clean(body.description);
        if (description.length > 300) errors.push('Description is too long (max 300 characters)');
        out.description = description;
    }
    if (body?.icon !== undefined) {
        if (!DISPUTE_ICON_KEYS.includes(body.icon)) errors.push('Invalid icon');
        out.icon = body.icon;
    } else if (!partial) {
        out.icon = DEFAULT_DISPUTE_ICON;
    }
    if (!partial || body?.appliesTo !== undefined) {
        if (!['buyer', 'seller', 'both'].includes(body?.appliesTo)) errors.push('Choose who this category applies to (buyer, seller or both)');
        out.appliesTo = body?.appliesTo;
    }
    if (body?.isActive !== undefined) {
        if (typeof body.isActive !== 'boolean') errors.push('isActive must be true or false');
        out.isActive = body.isActive;
    }

    return { out, error: errors[0] || null };
};

// get dispute categories
export const getAllDisputeCategories = async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(parseInt(req.query.limit) || 10, 50);

        const search = clean(req.query.search);

        const filter = {};
        if (req.query.status === 'active') filter.isActive = true;
        if (req.query.status === 'inactive') filter.isActive = false;

        if (['buyer', 'seller', 'both'].includes(req.query.appliesTo)) filter.appliesTo = req.query.appliesTo;

        if (search) filter.name = new RegExp(escRx(search), 'i');

        const [rows, total, all, active, counts] = await Promise.all([
            DisputeCategory.find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            DisputeCategory.countDocuments(filter),
            DisputeCategory.countDocuments({}),
            DisputeCategory.countDocuments({ isActive: true }),
            Dispute.aggregate([
                { $group: { _id: '$categoryId', total: { $sum: 1 }, open: { $sum: { $cond: ['$isOpen', 1, 0] } } } },
            ]),
        ]);
        const countBy = new Map(counts.map((c) => [String(c._id), c]));

        return res.status(200).json({
            success: true,
            categories: rows.map((c) => categoryRow(c, countBy.get(String(c._id)))),
            stats: { total: all, active, inactive: all - active },
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            },
        });

    } catch (err) {
        console.error('getAllDisputeCategories error:', err);
        return bad(res, 'Server Error Occured', 500);
    }
};

// get dispute category by id
export const getDisputeCategoryById = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) return bad(res, 'Invalid category id');

        const c = await DisputeCategory.findById(req.params.id).lean();
        if (!c) return bad(res, 'Category not found', 404);

        const [total, open] = await Promise.all([
            Dispute.countDocuments({ categoryId: c._id }),
            Dispute.countDocuments({ categoryId: c._id, isOpen: true }),
        ]);

        return res.status(200).json({
            success: true,
            category: categoryRow(c, { total, open })
        });

    } catch (err) {
        console.error('getDisputeCategoryById error:', err);
        return bad(res, 'Server Error Occured', 500);
    }
};

// create dispute category
export const createDisputeCategory = async (req, res) => {
    try {
        const { out, error } = readCategoryBody(req.body, false);
        if (error) return bad(res, error);

        try {
            const c = await DisputeCategory.create({ ...out, nameKey: keyOf(out.name), createdBy: req.user.id });

            return res.status(201).json({
                success: true,
                message: 'Category created',
                category: categoryRow(c.toObject ? c.toObject() : c)
            });
        } catch (err) {
            if (err?.code === 11000) return bad(res, 'A category with this name already exists', 409);
            throw err;
        }

    } catch (err) {
        console.error('createDisputeCategory error:', err);
        return bad(res, 'Server Error Occured', 500);
    }
};

// update dispute category
export const updateDisputeCategory = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) return bad(res, 'Invalid category id');

        const { out, error } = readCategoryBody(req.body, true);
        if (error) return bad(res, error);
        if (!Object.keys(out).length) return bad(res, 'Nothing to update');

        const set = { ...out, updatedBy: req.user.id };
        if (out.name) set.nameKey = keyOf(out.name);

        try {
            const c = await DisputeCategory.findByIdAndUpdate(req.params.id, { $set: set }, { new: true }).lean();
            if (!c) return bad(res, 'Category not found', 404);

            return res.status(200).json({
                success: true,
                message: 'Category updated',
                category: categoryRow(c)
            });
        } catch (err) {
            if (err?.code === 11000) return bad(res, 'A category with this name already exists', 409);
            throw err;
        }

    } catch (err) {
        console.error('updateDisputeCategory error:', err);
        return bad(res, 'Server Error Occured', 500);
    }
};

// get all disputes
export const getAllDisputes = async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(parseInt(req.query.limit) || 10, 50);

        const { status, categoryId, raisedByRole, startDate, endDate, sortBy } = req.query;
        const search = clean(req.query.search);

        const filter = {};

        if (DISPUTE_STATUSES.includes(status)) filter.status = status;
        if (mongoose.isValidObjectId(categoryId)) filter.categoryId = categoryId;
        if (raisedByRole === 'buyer' || raisedByRole === 'seller') filter['raisedBy.role'] = raisedByRole;

        // date: createdAt, UAE time 
        const created = {};
        if (isYMD(startDate)) created.$gte = new Date(`${startDate}T00:00:00+04:00`);
        if (isYMD(endDate)) created.$lte = new Date(`${endDate}T23:59:59.999+04:00`);
        if (Object.keys(created).length) filter.createdAt = created;

        if (search) {
            const rx = new RegExp(escRx(search), 'i');
            filter.$or = [
                { disputeId: rx }, { orderNumber: rx }, { listingId: rx }, { vehicleTitle: rx }, { categoryName: rx },
                { 'raisedBy.name': rx }, { 'against.name': rx },
            ];
        }

        const sort = sortBy === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };
        const now = Date.now();
        const staleBefore = new Date(now - DISPUTE_STALE_DAYS * DAY_MS);

        const [rows, total, total_all, ...byStatus] = await Promise.all([
            Dispute.find(filter)
                .select('-adminNotes -evidence -history -description')
                .sort(sort)
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            Dispute.countDocuments(filter),
            Dispute.countDocuments({}),
            ...DISPUTE_STATUSES.map((s) => Dispute.countDocuments({ status: s })),
        ]);

        const stale = await Dispute.countDocuments({ isOpen: true, createdAt: { $lte: staleBefore } });

        const stats = { total: total_all, stale };
        DISPUTE_STATUSES.forEach((s, i) => { stats[s] = byStatus[i]; });

        return res.status(200).json({
            success: true,
            disputes: rows.map((d) => rowOf(d, now)),
            stats,
            staleAfterDays: DISPUTE_STALE_DAYS,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            },
        });

    } catch (err) {
        console.error('getAllDisputes error:', err);
        return bad(res, 'Server Error Occured', 500);
    }
};

// get dispute by id
export const getDisputeDetail = async (req, res) => {
    try {
        const d = await Dispute.findOne(findFilter(req.params.id)).lean();
        if (!d) return bad(res, 'Dispute not found', 404);

        const BuyerSide = d.raisedBy.role === 'buyer' ? d.raisedBy : d.against;
        const BuyerModel = BuyerSide.type === 'Seller' ? Seller : Buyer;

        const [order, payout, buyerDoc, sellerDoc] = await Promise.all([
            Order.findById(d.orderId).select('orderId status amount currency paidAt source handover.status handover.confirmedAt').lean(),
            Payout.findOne({ orderId: d.orderId }).select('payoutId status disputeHold netAmount').lean(),
            BuyerModel.findById(BuyerSide.id).select('email').lean(),
            Seller.findById(d.raisedBy.role === 'seller' ? d.raisedBy.id : d.against.id).select('email').lean(),
        ]);

        const emailOf = (p) => (p.role === 'buyer' ? buyerDoc?.email : sellerDoc?.email) || null;
        const party = (p) => ({ role: p.role, type: p.type, id: p.id, name: p.name, email: emailOf(p) });

        const isAdmin = req.user.role === 'admin';
        const isOpen = !!d.isOpen;
        const refundPossible = order?.status === 'paid' && payout?.status !== 'paid';

        return res.status(200).json({
            success: true,
            dispute: {
                ...rowOf(d),
                description: d.description,
                evidence: d.evidence || [],
                response: d.response?.at ? { description: d.response.description, evidence: d.response.evidence || [], at: d.response.at } : null,
                raisedBy: party(d.raisedBy),
                against: party(d.against),
                reviewedBy: d.reviewedBy || null,
                reviewStartedAt: d.reviewStartedAt || null,
                resolution: d.resolution?.at
                    ? { outcome: d.resolution.outcome || null, note: d.resolution.note, by: d.resolution.by || null, at: d.resolution.at }
                    : null,
                adminNotes: d.adminNotes || [],
                timeline: (d.history || []).map((h) => ({ status: h.status, at: h.at, by: h.by, note: h.note })),
                order: order
                    ? {
                        _id: order._id, orderId: order.orderId, status: order.status, amount: order.amount, currency: order.currency,
                        paidAt: order.paidAt, source: order.source, handoverStatus: order.handover?.status || 'pending',
                    }
                    : null,
                payout: payout
                    ? { _id: payout._id, payoutId: payout.payoutId, status: payout.status, disputeHold: !!payout.disputeHold, netAmount: payout.netAmount }
                    : null,
                actions: {
                    canStartReview: d.status === 'open',
                    canResolve: d.status === 'under_review',
                    canClose: isOpen,
                    canRefund: d.status === 'under_review' && isAdmin && refundPossible,
                },
                viewerRole: req.user.role,
            },
        });

    } catch (err) {
        console.error('getDisputeDetail error:', err);
        return bad(res, 'Server Error Occured', 500);
    }
};

// review dispute
export const startDisputeReview = async (req, res) => {
    try {
        const person = await actorOf(req);
        const now = new Date();

        const d = await Dispute.findOneAndUpdate(
            { ...findFilter(req.params.id), status: 'open', isOpen: true },
            {
                $set: { status: 'under_review', reviewedBy: person, reviewStartedAt: now },
                $push: { history: { status: 'under_review', at: now, by: req.user.role, byId: req.user.id, note: 'Review started' } },
            },
            { new: true }
        ).lean();

        if (!d) {
            const existing = await Dispute.findOne(findFilter(req.params.id)).select('status').lean();
            if (!existing) return bad(res, 'Dispute not found', 404);
            return bad(res, `Review can only be started on an open dispute (status: ${existing.status})`);
        }

        await notifyParty(d.raisedBy, {
            type: 'dispute_under_review',
            vehicleId: d.vehicleId,
            title: 'Your dispute is under review',
            message: `${d.disputeId} (order ${d.orderNumber}) is now being reviewed by our team.`,
        });

        return res.status(200).json({
            success: true,
            message: 'Review started',
            dispute: rowOf(d)
        });

    } catch (err) {
        console.error('startDisputeReview error:', err);
        return bad(res, 'Server Error Occured', 500);
    }
};

// add note
export const addDisputeNote = async (req, res) => {
    try {
        const note = clean(req.body?.note);

        if (note.length < 3) return bad(res, 'Note is too short');
        if (note.length > MAX_NOTE) return bad(res, `Note is too long (max ${MAX_NOTE} characters)`);

        const person = await actorOf(req);
        const d = await Dispute.findOneAndUpdate(
            findFilter(req.params.id),
            { $push: { adminNotes: { note, by: person, at: new Date() } } },
            { new: true }
        ).select('adminNotes').lean();

        if (!d) return bad(res, 'Dispute not found', 404);

        return res.status(200).json({
            success: true,
            message: 'Note added',
            adminNotes: d.adminNotes
        });

    } catch (err) {
        console.error('addDisputeNote error:', err);
        return bad(res, 'Server Error Occured', 500);
    }
};

// resolve dispute
export const resolveDispute = async (req, res) => {
    try {
        const action = req.body?.action;
        const note = clean(req.body?.note);

        if (!RESOLVE_ACTIONS.includes(action)) return bad(res, 'Invalid action');
        if (note.length < 3) return bad(res, 'A resolution note is required (both parties will see it)');
        if (note.length > MAX_NOTE) return bad(res, `Note is too long (max ${MAX_NOTE} characters)`);

        if (action === 'refund_buyer' && req.user.role !== 'admin') {
            return bad(res, 'Only an admin can refund the buyer', 403);
        }

        const d = await Dispute.findOne(findFilter(req.params.id)).lean();
        if (!d) return bad(res, 'Dispute not found', 404);
        if (!d.isOpen) return bad(res, `This dispute is already ${d.status}`, 409);

        if (action !== 'close' && d.status !== 'under_review') {
            return bad(res, 'Start the review before deciding this dispute');
        }

        const person = await actorOf(req);
        const copy = OUTCOME_COPY[action];

        // ---- refund: pehle paisa, phir dispute close. Refund fail ho to dispute under_review hi rehta hai, hold bhi ----
        if (action === 'refund_buyer') {
            const order = await Order.findById(d.orderId).select('status refund.refundedAt').lean();
            const alreadyRefunded = order?.status === 'canceled' && !!order?.refund?.refundedAt;   // pichli attempt beech me ruki thi

            if (!alreadyRefunded) {
                const r = await cancelAndRefundCore({
                    orderId: String(d.orderId),
                    reason: `Dispute ${d.disputeId}: ${note}`,
                    actor: { id: req.user.id, role: req.user.role },
                    viaDispute: true,
                });
                if (!r.ok) return bad(res, r.message, r.status);
            }
        }

        const now = new Date();
        const set = {
            status: copy.status,
            isOpen: false,
            'resolution.note': note,
            'resolution.by': person,
            'resolution.at': now,
        };
        if (action === 'refund_buyer' || action === 'release_seller') set['resolution.outcome'] = action;

        const updated = await Dispute.findOneAndUpdate(
            { _id: d._id, isOpen: true, status: action === 'close' ? { $in: OPEN_DISPUTE_STATUSES } : 'under_review' },
            {
                $set: set,
                $push: { history: { status: copy.status, at: now, by: req.user.role, byId: req.user.id, note } },
            },
            { new: true }
        ).lean();

        if (!updated) return bad(res, 'This dispute was already decided by someone else', 409);

        await safeRelease(d.orderId, d.disputeId);

        const msg = `${d.disputeId} (order ${d.orderNumber}): ${copy.text} Note: ${note}`;
        await Promise.all([
            notifyParty(d.raisedBy, { type: 'dispute_resolved', vehicleId: d.vehicleId, title: copy.title, message: msg }),
            notifyParty(d.against, { type: 'dispute_resolved', vehicleId: d.vehicleId, title: copy.title, message: msg }),
        ]);

        return res.status(200).json({ success: true, message: copy.title, dispute: rowOf(updated) });

    } catch (err) {
        console.error('resolveDispute error:', err);
        return bad(res, 'Server Error Occured', 500);
    }
};

// Clean up stale dispute holds from orders and payouts
export const reconcileDisputeHolds = async (req, res) => {
    try {
        const result = await reconcileHolds();
        return res.status(200).json({ success: true, ...result });
    } catch (err) {
        console.error('reconcileDisputeHolds error:', err);
        return bad(res, 'Server Error Occured', 500);
    }
};

// ================================================= SELLER / BUYER

const MIN_DESC = 20;
const MAX_DESC = 2000;
const MIN_RESPONSE = 10;

const CLOSED_STATUSES = ['resolved', 'rejected', 'closed', 'withdrawn'];

// ---- uploads ----
const evidenceFrom = (req) =>
    (req.files?.evidence || []).map((f) => ({
        url: f.path,
        name: String(f.originalname || '').slice(0, 120),
        kind: f.mimetype === 'application/pdf' ? 'pdf' : 'image',
        publicId: f.filename,
    }));

const dropFiles = async (req) => {
    try {
        if (req.files?.evidence?.length) await deleteCloudinaryFiles(req.files);
    } catch (err) {
        console.error('[dispute] evidence cleanup failed:', err.message);
    }
};

const reject = async (req, res, message, code = 400) => {
    await dropFiles(req);
    return bad(res, message, code);
};

const userType = (role) => (role === 'buyer' ? 'Buyer' : role === 'seller' ? 'Seller' : null);

// ------ shape ------
export const shapeForUser = (d, user) => {

    const uid = String(user.id);
    const iRaised = String(d.raisedBy?.id) === uid;
    const me = iRaised ? d.raisedBy : d.against;
    const other = iRaised ? d.against : d.raisedBy;
    const responded = !!d.response?.at;
    const terminal = ['resolved', 'rejected', 'closed'].includes(d.status);

    return {
        _id: d._id,
        disputeId: d.disputeId,
        orderId: d.orderId,
        orderNumber: d.orderNumber,
        listingId: d.listingId,
        vehicleTitle: d.vehicleTitle,
        vehicleImage: d.vehicleImage,
        amount: d.amount,
        currency: d.currency,
        status: d.status,
        isOpen: !!d.isOpen,
        daysOpen: daysOpenOf(d),
        iRaised,
        myRole: me?.role,
        raisedByRole: d.raisedBy?.role,
        counterparty: { role: other?.role, name: other?.name },
        category: { _id: d.categoryId, name: d.categoryName },
        description: d.description,
        evidence: d.evidence || [],
        response: responded
            ? { description: d.response.description, evidence: d.response.evidence || [], at: d.response.at }
            : null,
        canRespond: !iRaised && !!d.isOpen && !responded,
        canWithdraw: iRaised && !!d.isOpen,
        resolution: terminal
            ? { outcome: d.resolution?.outcome || null, note: d.resolution?.note || '', at: d.resolution?.at || null }
            : null,
        timeline: (d.history || []).map((h) => ({ status: h.status, at: h.at })),
        createdAt: d.createdAt,
        updatedAt: d.updatedAt,
    };
};

const shapeRow = (d, user) => {
    const full = shapeForUser(d, user);
    return {
        _id: full._id,
        disputeId: full.disputeId,
        orderNumber: full.orderNumber,
        listingId: full.listingId,
        vehicleTitle: full.vehicleTitle,
        vehicleImage: full.vehicleImage,
        amount: full.amount,
        currency: full.currency,
        status: full.status,
        daysOpen: full.daysOpen,
        iRaised: full.iRaised,
        myRole: full.myRole,
        counterparty: full.counterparty,
        categoryName: d.categoryName,
        createdAt: full.createdAt,
    };
};

// get dispute categories
export const getDisputeCategories = async (req, res) => {
    try {
        const filter = { isActive: true };
        if (['buyer', 'seller'].includes(req.query.as)) filter.appliesTo = { $in: [req.query.as, 'both'] };

        const categories = await DisputeCategory.find(filter)
            .select('name description icon appliesTo')
            .sort({ name: 1 })
            .lean();

        return res.status(200).json({
            success: true,
            categories
        });

    } catch (err) {
        console.error('getDisputeCategories error:', err);
        return bad(res, 'Server Error Occured', 500);
    }
};

// dispute raise
export const raiseDispute = async (req, res) => {
    try {
        const { orderId } = req.params;
        const categoryId = req.body?.categoryId;
        const description = clean(req.body?.description);

        if (!mongoose.isValidObjectId(categoryId)) return reject(req, res, 'Please select a category');
        if (description.length < MIN_DESC) return reject(req, res, `Please describe the problem (at least ${MIN_DESC} characters)`);
        if (description.length > MAX_DESC) return reject(req, res, `Description is too long (max ${MAX_DESC} characters)`);

        const orderFilter = mongoose.isValidObjectId(orderId) ? { _id: orderId } : { orderId };
        const order = await Order.findOne(orderFilter).lean();

        const role = roleInOrder(order, req.user);
        if (!order || !role) return reject(req, res, 'Order not found', 404);

        const category = await DisputeCategory.findOne({ _id: categoryId, isActive: true }).lean();
        if (!category) return reject(req, res, 'This category is not available');

        if (category.appliesTo !== 'both' && category.appliesTo !== role) {
            return reject(req, res, 'This category is not available for your role');
        }

        const [payout, existing] = await Promise.all([
            Payout.findOne({ orderId: order._id }).select('status').lean(),
            Dispute.find({ orderId: order._id }).select('isOpen raisedBy.role').lean(),
        ]);

        const elig = computeEligibility({
            order,
            role,
            payout,
            openDispute: existing.find((d) => d.isOpen),
            myDispute: existing.find((d) => d.raisedBy?.role === role),
        });
        if (!elig.canRaise) return reject(req, res, elig.reason, 409);

        // name snapshot
        const BuyerModel = order.buyerType === 'Seller' ? Seller : Buyer;
        const [buyerDoc, sellerDoc, vehicle] = await Promise.all([
            BuyerModel.findById(order.buyerId).select('firstName lastName companyName fullName businessName').lean(),
            Seller.findById(order.sellerId).select('fullName businessName').lean(),
            Vehicle.findById(order.vehicleId).select('make model year images listingId').lean(),
        ]);

        const partyOf = (r) => (r === 'buyer'
            ? { role: 'buyer', id: order.buyerId, type: order.buyerType, name: partyName(buyerDoc, order.buyerType) }
            : { role: 'seller', id: order.sellerId, type: 'Seller', name: partyName(sellerDoc, 'Seller') });

        const raisedBy = partyOf(role);
        const against = partyOf(role === 'buyer' ? 'seller' : 'buyer');

        const now = new Date();
        let dispute;

        try {
            dispute = await Dispute.create({
                orderId: order._id,
                orderNumber: order.orderId,
                vehicleId: order.vehicleId,
                listingId: order.listingId,
                vehicleTitle: vehicleTitleOf(vehicle),
                vehicleImage: vehicleImageOf(vehicle),
                amount: order.amount,
                currency: order.currency || 'AED',
                raisedBy,
                against,
                categoryId: category._id,
                categoryName: category.name,
                description,
                evidence: evidenceFrom(req),
                history: [{ status: 'open', at: now, by: role, byId: req.user.id, note: 'Dispute raised' }],
            });
        } catch (err) {
            if (err?.code === 11000) {
                return reject(req, res, err.keyPattern?.['raisedBy.role']
                    ? 'You have already raised a dispute on this order'
                    : 'A dispute is already open on this order', 409);
            }
            throw err;
        }

        // Order flag + Payout freeze. Payout isi beech 'paid' ho gaya ho to dispute wapas lo.
        const hold = await applyHold(order._id);
        if (!hold.ok) {
            await Dispute.deleteOne({ _id: dispute._id });
            await Order.updateOne({ _id: order._id }, { $set: { hasOpenDispute: false } });
            return reject(req, res, hold.reason === 'payout_paid'
                ? 'The seller payout was just transferred, so a dispute can no longer be raised'
                : 'This order is being refunded, so a dispute cannot be raised', 409);
        }

        await notifyParty(against, {
            type: 'dispute_raised',
            vehicleId: order.vehicleId,
            title: 'A dispute was raised on your order',
            message: `${dispute.disputeId}: ${raisedBy.name} raised a dispute (${category.name}) on order ${order.orderId} (${order.listingId}). Please add your response.`,
        });

        await notifyStaff({
            type: 'dispute_raised',
            vehicleId: order.vehicleId,
            title: 'New dispute',
            message: `${dispute.disputeId} (${category.name}) on order ${order.orderId}, raised by the ${role}.`,
        });

        return res.status(201).json({
            success: true,
            message: 'Dispute raised',
            dispute: { _id: dispute._id, disputeId: dispute.disputeId, status: dispute.status },
        });

    } catch (err) {
        await dropFiles(req);
        console.error('raiseDispute error:', err);
        return bad(res, 'Server Error Occured', 500);
    }
};

// submit a response to an open dispute
export const respondToDispute = async (req, res) => {
    try {
        const description = clean(req.body?.description);
        if (description.length < MIN_RESPONSE) return reject(req, res, `Please write your response (at least ${MIN_RESPONSE} characters)`);
        if (description.length > MAX_DESC) return reject(req, res, `Response is too long (max ${MAX_DESC} characters)`);

        const type = userType(req.user.role);
        const existing = await Dispute.findOne({ ...findFilter(req.params.id), 'against.id': req.user.id, 'against.type': type })
            .select('status isOpen response.at raisedBy against disputeId vehicleId orderNumber')
            .lean();

        if (!existing) return reject(req, res, 'Dispute not found', 404);
        if (!existing.isOpen) return reject(req, res, `This dispute is ${existing.status}, responses are closed`);
        if (existing.response?.at) return reject(req, res, 'You have already responded to this dispute');

        const now = new Date();
        const updated = await Dispute.findOneAndUpdate(
            { _id: existing._id, isOpen: true, 'response.at': { $exists: false } },
            {
                $set: { 'response.description': description, 'response.evidence': evidenceFrom(req), 'response.at': now },
                $push: { history: { status: 'response', at: now, by: existing.against.role, byId: req.user.id, note: 'Response added' } },
            },
            { new: true }
        ).lean();

        if (!updated) return reject(req, res, 'This dispute can no longer take a response', 409);

        await notifyParty(existing.raisedBy, {
            type: 'dispute_response_received',
            vehicleId: existing.vehicleId,
            title: 'Response received on your dispute',
            message: `${existing.against.name} responded to ${existing.disputeId} (order ${existing.orderNumber}).`,
        });

        await notifyStaff({
            type: 'dispute_response_received',
            vehicleId: existing.vehicleId,
            title: 'Dispute response added',
            message: `${existing.disputeId} (order ${existing.orderNumber}) has a response from the ${existing.against.role}.`,
        });

        return res.status(200).json({
            success: true,
            message: 'Response submitted',
            dispute: shapeForUser(updated, req.user)
        });

    } catch (err) {
        await dropFiles(req);
        console.error('respondToDispute error:', err);
        return bad(res, 'Server Error Occured', 500);
    }
};

// dispute withdraw
export const withdrawDispute = async (req, res) => {
    try {
        const type = userType(req.user.role);
        const existing = await Dispute.findOne({ ...findFilter(req.params.id), 'raisedBy.id': req.user.id, 'raisedBy.type': type })
            .select('status isOpen orderId against raisedBy disputeId vehicleId orderNumber')
            .lean();

        if (!existing) return bad(res, 'Dispute not found', 404);
        if (!existing.isOpen) return bad(res, `This dispute is already ${existing.status}`);

        const now = new Date();
        const updated = await Dispute.findOneAndUpdate(
            { _id: existing._id, isOpen: true },
            {
                $set: { status: 'withdrawn', isOpen: false },
                $push: { history: { status: 'withdrawn', at: now, by: existing.raisedBy.role, byId: req.user.id, note: 'Withdrawn by the person who raised it' } },
            },
            { new: true }
        ).lean();

        if (!updated) return bad(res, 'This dispute is no longer open', 409);

        await safeRelease(existing.orderId, existing.disputeId);

        await notifyParty(existing.against, {
            type: 'dispute_withdrawn',
            vehicleId: existing.vehicleId,
            title: 'Dispute withdrawn',
            message: `${existing.disputeId} on order ${existing.orderNumber} was withdrawn.`,
        });

        await notifyStaff({
            type: 'dispute_withdrawn',
            vehicleId: existing.vehicleId,
            title: 'Dispute withdrawn',
            message: `${existing.disputeId} on order ${existing.orderNumber} was withdrawn by the ${existing.raisedBy.role}.`,
        });

        return res.status(200).json({
            success: true,
            message: 'Dispute withdrawn',
            dispute: shapeForUser(updated, req.user)
        });

    } catch (err) {
        console.error('withdrawDispute error:', err);
        return bad(res, 'Server Error Occured', 500);
    }
};

// get my disputes, status: '' | open | under_review | closed (resolved/rejected/closed/withdrawn), view:   '' | raised | against
export const getMyDisputes = async (req, res) => {
    try {
        const uid = req.user.id;
        const type = userType(req.user.role);
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(parseInt(req.query.limit) || 10, 50);

        const view = req.query.view;
        const mine = view === 'raised'
            ? { 'raisedBy.id': uid, 'raisedBy.type': type }
            : view === 'against'
                ? { 'against.id': uid, 'against.type': type }
                : { $or: [{ 'raisedBy.id': uid, 'raisedBy.type': type }, { 'against.id': uid, 'against.type': type }] };

        const and = [mine];

        const st = req.query.status;
        if (st === 'open' || st === 'under_review') and.push({ status: st });
        else if (st === 'closed') and.push({ status: { $in: CLOSED_STATUSES } });

        const search = clean(req.query.search);
        if (search) {
            const rx = new RegExp(escRx(search), 'i');
            and.push({ $or: [{ disputeId: rx }, { orderNumber: rx }, { listingId: rx }] });
        }

        const filter = and.length === 1 ? and[0] : { $and: and };

        const [rows, total, cAll, cOpen, cReview, cClosed] = await Promise.all([
            Dispute.find(filter)
                .select('-adminNotes -evidence -response -resolution')
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            Dispute.countDocuments(filter),
            Dispute.countDocuments(mine),
            Dispute.countDocuments({ $and: [mine, { status: 'open' }] }),
            Dispute.countDocuments({ $and: [mine, { status: 'under_review' }] }),
            Dispute.countDocuments({ $and: [mine, { status: { $in: CLOSED_STATUSES } }] }),
        ]);

        return res.status(200).json({
            success: true,
            disputes: rows.map((d) => shapeRow(d, req.user)),
            summary: { all: cAll, open: cOpen, under_review: cReview, closed: cClosed },
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            },
        });

    } catch (err) {
        console.error('getMyDisputes error:', err);
        return bad(res, 'Server Error Occured', 500);
    }
};

// get my dispute
export const getMyDispute = async (req, res) => {
    try {
        const type = userType(req.user.role);
        const uid = req.user.id;

        const dispute = await Dispute.findOne({
            ...findFilter(req.params.id),
            $or: [{ 'raisedBy.id': uid, 'raisedBy.type': type }, { 'against.id': uid, 'against.type': type }],
        })
            .select('-adminNotes')
            .lean();

        if (!dispute) return bad(res, 'Dispute not found', 404);

        return res.status(200).json({
            success: true,
            dispute: shapeForUser(dispute, req.user)
        });

    } catch (err) {
        console.error('getMyDispute error:', err);
        return bad(res, 'Server Error Occured', 500);
    }
};
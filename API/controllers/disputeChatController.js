
import mongoose from 'mongoose';
import Admin from '../models/adminModelSchema.js';
import Conversation from '../models/conversationModelSchema.js';
import Message from '../models/messageModelSchema.js';
import Dispute from '../models/disputeModelSchema.js';

import { getIO } from '../sockets/socketServer.js';
import { emitToUser } from '../sockets/socketEmitter.js';
import { tooFast, previewOf } from '../utils/liveChatHelper.js';
import {
    DISPUTE_STAFF_ROOM, CHAT_OPEN_STATUSES, DISPUTE_MAX_TEXT, isDisputeChatOpen, partyIdsOf, partyRoleOf
} from '../utils/disputeChatHelper.js';

const fail = (res, message, code = 400) => res.status(code).json({ success: false, message });

// :id = dispute _id ya disputeId (DSP-...)
const findDispute = (id) => {
    const filter = mongoose.isValidObjectId(id) ? { _id: id } : { disputeId: id };
    return Dispute.findOne(filter).select('disputeId status raisedBy against').lean();
};

const getOrCreateConversation = async (d) => {
    const existing = await Conversation.findOne({ type: 'dispute', refId: d._id });
    if (existing) return existing;

    try {
        return await Conversation.create({ type: 'dispute', refId: d._id });
    } catch (err) {
        if (err?.code === 11000) return Conversation.findOne({ type: 'dispute', refId: d._id });
        throw err;
    }
};

// admin + permission manage
const getDisputeStaffIds = async () => {
    const staff = await Admin.find({
        isActive: { $ne: false },
        $or: [{ role: 'admin' }, { 'permissions.managePayments': true }],
    }).select('_id').lean();
    return staff.map((s) => String(s._id));
};

const emitToDisputeStaff = (event, payload) => {
    try {
        getIO().to(DISPUTE_STAFF_ROOM).emit(event, payload);
    } catch (err) {
        console.error('[disputeChat] emitToDisputeStaff failed:', err.message);
    }
};

const roleLabel = (r) => (r === 'seller' ? 'Seller' : 'Buyer');

// staff ko: only 1st name
const forStaff = (m) => ({
    _id: m._id,
    from: m.sender.kind,
    role: m.sender.role,
    senderId: String(m.sender.id),
    displayName: m.sender.kind === 'staff' ? (m.sender.displayName || 'Support') : roleLabel(m.sender.role),
    text: m.text || '',
    createdAt: m.createdAt,
});

// buyer / seller ko: staff = "Support Team", doosri party = sirf role, id kabhi nahi
const forParty = (m, uid) => ({
    _id: m._id,
    from: m.sender.kind,
    role: m.sender.role,
    mine: m.sender.kind === 'user' && String(m.sender.id) === String(uid),
    displayName: m.sender.kind === 'staff' ? 'Support Team' : roleLabel(m.sender.role),
    text: m.text || '',
    createdAt: m.createdAt,
});

const readText = (req) => {
    const text = String(req.body?.text ?? '').trim();
    if (!text) return { error: "Message can't be empty" };
    if (text.length > DISPUTE_MAX_TEXT) return { error: `Message must be ${DISPUTE_MAX_TEXT} characters or less` };
    return { text };
};

const loadMessages = async (conv, query) => {
    const limit = Math.min(parseInt(query.limit) || 30, 50);
    const filter = { conversationId: conv._id };

    const before = query.before ? new Date(query.before) : null;
    if (before && !isNaN(before)) filter.createdAt = { $lt: before };

    const rows = await Message.find(filter).sort({ createdAt: -1 }).limit(limit + 1).lean();
    return { rows: rows.slice(0, limit).reverse(), hasMore: rows.length > limit };
};

// ========================================== ADMIN

// get dispute chat
export const getDisputeChat = async (req, res) => {
    try {
        const d = await findDispute(req.params.id);
        if (!d) return fail(res, 'Dispute not found', 404);

        const canChat = isDisputeChatOpen(d);
        const conv = await Conversation.findOne({ type: 'dispute', refId: d._id }).lean();

        if (!conv) {
            return res.status(200).json({ success: true, canChat, viewerId: String(req.user.id), conversationId: null, unread: 0, messages: [], hasMore: false });
        }

        const { rows, hasMore } = await loadMessages(conv, req.query);

        return res.status(200).json({
            success: true,
            canChat,
            viewerId: String(req.user.id),
            conversationId: String(conv._id),
            unread: conv.staffUnread?.[String(req.user.id)] || 0,
            messages: rows.map(forStaff),
            hasMore,
        });

    } catch (err) {
        console.error('getDisputeChatAdmin error:', err);
        return fail(res, 'Server Error Occured', 500);
    }
};

//send dispute
export const sendDisputeChat = async (req, res) => {
    try {
        const d = await findDispute(req.params.id);
        if (!d) return fail(res, 'Dispute not found', 404);

        if (!isDisputeChatOpen(d)) return fail(res, 'This dispute is closed. Chat is read-only.', 403);

        const { text, error } = readText(req);
        if (error) return fail(res, error);

        if (tooFast(`dispute-staff:${req.user.id}`, 30)) {
            return fail(res, 'You are sending messages too fast. Please wait a moment.', 429);
        }

        const conv = await getOrCreateConversation(d);

        const staff = await Admin.findById(req.user.id).select('name role').lean();
        const firstName = String(staff?.name || '').trim().split(/\s+/)[0] || 'Support';

        const msg = await Message.create({
            conversationId: conv._id,
            sender: { kind: 'staff', id: req.user.id, role: staff?.role || req.user.role, displayName: firstName },
            text,
        });

        // staff reply = staff ke liye sab padha hua, dono parties ka unread +1
        const inc = {};
        partyIdsOf(d).forEach((pid) => { inc[`partyUnread.${pid}`] = 1; });

        const update = {
            $set: {
                lastMessageAt: msg.createdAt,
                lastMessage: { text: previewOf(text), senderKind: 'staff' },
                staffUnread: {},
            },
        };
        if (Object.keys(inc).length) update.$inc = inc;

        await Conversation.updateOne({ _id: conv._id }, update);

        const conversationId = String(conv._id);
        const disputeId = String(d._id);

        emitToDisputeStaff('dispute:message', { conversationId, disputeId, message: forStaff(msg) });
        emitToDisputeStaff('dispute:read', { disputeId });
        partyIdsOf(d).forEach((pid) => {
            emitToUser(pid, 'dispute:message', { conversationId, disputeId, message: forParty(msg, pid) });
        });

        return res.status(201).json({ success: true, message: forStaff(msg) });

    } catch (err) {
        console.error('sendDisputeChatAdmin error:', err);
        return fail(res, 'Server Error Occured', 500);
    }
};

// mark read
export const markDisputeChatRead = async (req, res) => {
    try {
        const d = await findDispute(req.params.id);
        if (!d) return fail(res, 'Dispute not found', 404);

        await Conversation.updateOne({ type: 'dispute', refId: d._id }, { $set: { staffUnread: {} } });

        emitToDisputeStaff('dispute:read', { disputeId: String(d._id) });
        return res.status(200).json({ success: true });

    } catch (err) {
        console.error('markDisputeChatReadAdmin error:', err);
        return fail(res, 'Server Error Occured', 500);
    }
};

// ========================================== BUYER / SELLER

// get disputes chat
export const getMyDisputeChat = async (req, res) => {
    try {
        const d = await findDispute(req.params.id);
        if (!d || !partyRoleOf(d, req.user)) return fail(res, 'Dispute not found', 404);

        const uid = String(req.user.id);
        const canChat = isDisputeChatOpen(d);
        const conv = await Conversation.findOne({ type: 'dispute', refId: d._id }).lean();

        if (!conv) {
            return res.status(200).json({ success: true, canChat, conversationId: null, unread: 0, messages: [], hasMore: false });
        }

        const { rows, hasMore } = await loadMessages(conv, req.query);

        return res.status(200).json({
            success: true,
            canChat,
            conversationId: String(conv._id),
            unread: conv.partyUnread?.[uid] || 0,
            messages: rows.map((m) => forParty(m, uid)),
            hasMore,
        });

    } catch (err) {
        console.error('getMyDisputeChat error:', err);
        return fail(res, 'Server Error Occured', 500);
    }
};

// send chat
export const sendMyDisputeChat = async (req, res) => {
    try {
        const d = await findDispute(req.params.id);
        const role = d && partyRoleOf(d, req.user);
        if (!role) return fail(res, 'Dispute not found', 404);

        if (!isDisputeChatOpen(d)) return fail(res, 'This dispute is closed. Chat is read-only.', 403);

        const { text, error } = readText(req);
        if (error) return fail(res, error);

        const uid = String(req.user.id);
        if (tooFast(`dispute:${uid}`)) return fail(res, 'You are sending messages too fast. Please wait a moment.', 429);

        const conv = await getOrCreateConversation(d);

        const msg = await Message.create({
            conversationId: conv._id,
            sender: { kind: 'user', id: req.user.id, role },
            text,
        });

        // unread: sab staff +1, doosri party +1 (apna nahi)
        const staffIds = await getDisputeStaffIds();
        const others = partyIdsOf(d).filter((p) => p !== uid);

        const inc = {};
        staffIds.forEach((sid) => { inc[`staffUnread.${sid}`] = 1; });
        others.forEach((pid) => { inc[`partyUnread.${pid}`] = 1; });

        const update = {
            $set: { lastMessageAt: msg.createdAt, lastMessage: { text: previewOf(text), senderKind: 'user' } },
        };
        if (Object.keys(inc).length) update.$inc = inc;

        await Conversation.updateOne({ _id: conv._id }, update);

        const conversationId = String(conv._id);
        const disputeId = String(d._id);

        emitToDisputeStaff('dispute:message', { conversationId, disputeId, message: forStaff(msg) });
        partyIdsOf(d).forEach((pid) => {
            emitToUser(pid, 'dispute:message', { conversationId, disputeId, message: forParty(msg, pid) });
        });

        return res.status(201).json({ success: true, message: forParty(msg, uid) });

    } catch (err) {
        console.error('sendMyDisputeChat error:', err);
        return fail(res, 'Server Error Occured', 500);
    }
};

// mark read
export const markMyDisputeChatRead = async (req, res) => {
    try {
        const d = await findDispute(req.params.id);
        if (!d || !partyRoleOf(d, req.user)) return fail(res, 'Dispute not found', 404);

        const uid = String(req.user.id);
        await Conversation.updateOne(
            { type: 'dispute', refId: d._id },
            { $set: { [`partyUnread.${uid}`]: 0 } }
        );

        emitToUser(uid, 'dispute:read', { disputeId: String(d._id) });
        return res.status(200).json({ success: true });

    } catch (err) {
        console.error('markMyDisputeChatRead error:', err);
        return fail(res, 'Server Error Occured', 500);
    }
};
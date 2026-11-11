
import mongoose from "mongoose";
import Admin from '../models/adminModelSchema.js';
import Conversation from '../models/conversationModelSchema.js';
import Message from '../models/messageModelSchema.js';
import { cleanupUploadedFiles } from "../utils/cloudinaryUtils.js";
import { emitToUser } from '../sockets/socketEmitter.js';
import {
    MAX_TEXT, emitToStaff, getChatStatus, getLiveChatStaffIds, previewOf, serializeMessage, tooFast
} from '../utils/liveChatHelper.js';

const attachmentOf = (file) => file ? [{
    url: file.path,
    publicId: file.filename,
    kind: file.mimetype === 'application/pdf' ? 'pdf' : 'image',
    name: file.originalname || '',
    size: file.size || 0,
}] : [];

// text khali ho to list me ye dikhega
const previewText = (text, file) =>
    text || (file ? (file.mimetype === 'application/pdf' ? '📎 PDF' : '📎 Photo') : '');

// ========================================== ADMIN

const USER_FIELDS = 'name fullName firstName lastName businessName companyName email profilePhoto';
const NAME_KEYS = ['businessName', 'companyName', 'fullName', 'name'];

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const resolveUserName = (u) => {
    if (!u) return 'Deleted user';
    for (const k of NAME_KEYS) if (u[k]) return u[k];
    const joined = [u.firstName, u.lastName].filter(Boolean).join(' ');
    return joined || u.email || 'Unknown user';
};

const unreadFor = (conv, adminId) => {
    const m = conv.staffUnread || {};
    const v = typeof m.get === 'function' ? m.get(String(adminId)) : m[String(adminId)];
    return v || 0;
};

// msg shape to - admin / staff 
const serializeForStaff = (m) => ({
    _id: m._id,
    from: m.sender.kind,
    text: m.text || '',
    attachments: m.attachments || [],
    createdAt: m.createdAt,
    senderId: String(m.sender.id),
    senderRole: m.sender.role,
    displayName: m.sender.kind === 'staff' ? (m.sender.displayName || 'Support') : null,
});

// // msg shape to - user
const serializeForUser = (m) => ({
    _id: m._id,
    from: m.sender.kind,
    text: m.text || '',
    attachments: m.attachments || [],
    createdAt: m.createdAt,
    displayName: m.sender.kind === 'staff' ? (m.sender.displayName || 'Support') : null,
});

// get live chat conversation
export const getLiveChatConversations = async (req, res) => {
    try {
        const adminId = String(req.user.id);
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(parseInt(req.query.limit) || 20, 50);

        const search = String(req.query.search || '').trim();

        const filter = { type: 'support' }

        if (req.query.unreadOnly === 'true') {
            filter[`staffUnread.${adminId}`] = { $gt: 0 };
        }

        if (search) {
            const rx = new RegExp(escapeRegex(search), 'i');
            const or = ['name', 'fullName', 'firstName', 'lastName', 'businessName', 'companyName', 'email']
                .map((f) => ({ [f]: rx }));

            const [buyers, sellers] = await Promise.all([
                mongoose.model('Buyer').find({ $or: or }).select('_id').limit(200).lean(),
                mongoose.model('Seller').find({ $or: or }).select('_id').limit(200).lean(),
            ]);

            filter.userId = { $in: [...buyers, ...sellers].map((u) => u._id) };
        }

        const [rows, total] = await Promise.all([
            Conversation.find(filter)
                .sort({ lastMessageAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .populate({ path: 'userId', select: USER_FIELDS })
                .lean(),
            Conversation.countDocuments(filter),
        ]);

        const conversations = rows.map((c) => ({
            _id: c._id,
            user: {
                _id: c.userId?._id || null,
                name: resolveUserName(c.userId),
                role: c.userType === 'Seller' ? 'seller' : 'buyer',
                profilePhoto: c.userId?.profilePhoto || '',
            },
            lastMessage: c.lastMessage?.text || '',
            lastSenderKind: c.lastMessage?.senderKind || null,
            lastMessageAt: c.lastMessageAt,
            unread: unreadFor(c, adminId),
        }));

        return res.status(200).json({
            success: true,
            conversations,
            pagination: { page, limit, total, totalPages: Math.max(Math.ceil(total / limit), 1) },
        });

    } catch (err) {
        console.log("getLiveChatConversations error :", err);
        return res.status(500).json({
            success: false,
            message: "Server Error Occured"
        });
    }
};

// unread count
export const getLiveChatUnreadCount = async (req, res) => {
    try {
        const adminId = String(req.user.id);

        const rows = await Conversation.find({ type: 'support', [`staffUnread.${adminId}`]: { $gt: 0 }, })
            .select('staffUnread').lean();

        const messages = rows.reduce((sum, c) => sum + unreadFor(c, adminId), 0);
        return res.status(200).json({
            success: true,
            conversations: rows.length,
            messages
        });

    } catch (err) {
        console.error('getLiveChatUnreadCount error:', err);
        return res.status(500).json({
            success: false,
            message: 'Server Error Occured'
        });
    }
};

// get live chat msgs
export const getLiveChatMessages = async (req, res) => {
    try {
        const { id } = req.params;  // conv id

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid conversation id'
            });
        }

        const conv = await Conversation.findOne({ _id: id, type: 'support' })
            .populate({ path: 'userId', select: USER_FIELDS })
            .lean();

        if (!conv) return res.status(404).json({
            success: false,
            message: 'Conversation not found'
        });

        const limit = Math.min(parseInt(req.query.limit) || 30, 50);
        const filter = { conversationId: conv._id };

        const before = req.query.before ? new Date(req.query.before) : null;
        if (before && !isNaN(before)) filter.createdAt = { $lt: before };

        const rows = await Message.find(filter).sort({ createdAt: -1 }).limit(limit + 1).lean();
        const hasMore = rows.length > limit;

        return res.status(200).json({
            success: true,
            conversation: {
                _id: conv._id,
                user: {
                    _id: conv.userId?._id || null,
                    name: resolveUserName(conv.userId),
                    role: conv.userType === 'Seller' ? 'seller' : 'buyer',
                    email: conv.userId?.email || '',
                    profilePhoto: conv.userId?.profilePhoto || '',
                },
            },
            messages: rows.slice(0, limit).reverse().map(serializeForStaff),
            hasMore,
        });

    } catch (err) {
        console.error('getLiveChatMessages error:', err);
        return res.status(500).json({
            success: false,
            message: 'Server Error Occured'
        });
    }
};

// send live chat reply
export const sendLiveChatReply = async (req, res) => {
    let saved = false;
    try {
        const { id } = req.params;  // conv id

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid conversation id'
            });
        }

        const text = String(req.body?.text ?? '').trim();

        if (!text && !req.file) {
            return res.status(400).json({
                success: false,
                message: 'Message cannot be empty'
            });
        }

        if (text.length > MAX_TEXT) {
            return res.status(400).json({
                success: false,
                message: `Message must be ${MAX_TEXT} characters or less`
            });
        }

        if (tooFast(`staff:${req.user.id}`, 30)) {
            return res.status(429).json({
                success: false,
                message: 'You are sending messages too fast. Please wait a moment.'
            });
        }

        const conv = await Conversation.findOne({ _id: id, type: 'support' }).select('_id userId').lean();
        if (!conv) {
            return res.status(404).json({
                success: false,
                message: 'Conversation not found'
            });
        }

        // naam har baar DB se (snapshot message me save hota hai)
        const staff = await Admin.findById(req.user.id).select('name role').lean();
        const firstName = String(staff?.name || '').trim().split(/\s+/)[0] || 'Support';

        const msg = await Message.create({
            conversationId: conv._id,
            sender: { kind: 'staff', id: req.user.id, role: staff?.role || req.user.role, displayName: firstName },
            text,
            attachments: attachmentOf(req.file)
        });

        saved = true;

        // staff ne reply kiya = sabke liye padha hua, user ka unread +1
        await Conversation.updateOne(
            { _id: conv._id },
            {
                $set: {
                    lastMessageAt: msg.createdAt,
                    lastMessage: { text: previewOf(previewText(text, req.file)), senderKind: 'staff' },
                    staffUnread: {},
                },
                $inc: { userUnread: 1 },
            }
        );

        const conversationId = String(conv._id);
        emitToStaff('chat:message', { conversationId, message: serializeForStaff(msg) });
        emitToStaff('chat:read', { conversationId });
        emitToUser(conv.userId, 'chat:message', { conversationId, message: serializeForUser(msg) });

        return res.status(201).json({ success: true, message: serializeForStaff(msg) });

    } catch (err) {
        console.error('sendLiveChatReply error:', err);
        return res.status(500).json({
            success: false,
            message: 'Server Error Occured'
        });
    } finally {
        if (!saved) await cleanupUploadedFiles(req.file);
    }
};

// mark read
export const markLiveChatRead = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid conversation id"
            });
        }

        const result = await Conversation.updateOne({ _id: id, type: 'support' }, { $set: { staffUnread: {} } });

        if (!result.matchedCount) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found"
            });
        }

        emitToStaff('chat:read', { conversationId: String(id) });
        return res.status(200).json({
            success: true,
            message: "Marked Read"
        });

    } catch (err) {
        console.log("markLiveChatRead error :", err);
        return res.status(500).json({
            success: false,
            message: "Server Error Occured"
        });
    }
};

// ========================================== BUYER / SELLER

// find role
const userTypeOf = (role) => (role === 'buyer' ? 'Buyer' : role === 'seller' ? 'Seller' : null);

const getOrCreateConversation = async (userId, userType) => {
    const existing = await Conversation.findOne({ userId, type: 'support' });
    if (existing) return existing;

    try {
        return await Conversation.create({ type: 'support', userId, userType });
    } catch (err) {
        if (err?.code === 11000) return Conversation.findOne({ userId, type: 'support' });
        throw err;
    }
};

// get support status - online / offline
export const getSupportChatStatus = async (req, res) => {
    try {
        const status = await getChatStatus();
        return res.status(200).json({
            success: true,
            status
        });
    } catch (err) {
        console.log("getSupportChatStatus error :", err);
        return res.status(500).json({
            success: false,
            message: 'Server Error Occured'
        });
    }
};

// get my support chat 
export const getMySupportChat = async (req, res) => {
    try {
        const userType = userTypeOf(req.user.role);
        if (!userType) {
            return res.status(403).json({
                success: false,
                message: "Access Denied"
            });
        }

        const limit = Math.min(parseInt(req.query.limit) || 30, 50);
        const status = await getChatStatus();

        const conv = await Conversation.findOne({ userId: req.user.id, type: 'support' }).lean();

        if (!conv) {
            return res.status(200).json({
                success: true,
                conversation: null,
                messages: [],
                hasMore: false,
                status
            });
        }

        const filter = { conversationId: conv._id };
        const before = req.query.before ? new Date(req.query.before) : null;

        if (before && !isNaN(before)) {
            filter.createdAt = { $lt: before }
        };

        const rows = await Message.find(filter).sort({ createdAt: -1 }).limit(limit + 1).lean();
        const hasMore = rows.length > limit;
        const messages = rows.slice(0, limit).reverse().map(serializeMessage);

        return res.status(200).json({
            success: true,
            conversation: { _id: conv._id, userUnread: conv.userUnread || 0 },
            messages,
            hasMore,
            status,
        });

    } catch (err) {
        console.log("getMySupportChat error :", err);
        return res.status(500).json({
            success: false,
            message: 'Server Error Occured'
        });
    }
};

// send support messages
export const sendSupportMessages = async (req, res) => {
    let saved = false;
    try {
        const userType = userTypeOf(req.user.role);
        if (!userType) {
            return res.status(403).json({
                success: false,
                message: "Access Denied"
            });
        }

        const text = String(req.body?.text ?? '').trim();

        if (!text && !req.file) {
            return res.status(400).json({
                success: false,
                message: "Message can't be empty"
            });
        }

        if (text.length > MAX_TEXT) {
            return res.status(400).json({
                success: false,
                message: `Message must be ${MAX_TEXT} characters or less`
            });
        }

        if (tooFast(String(req.user.id))) {
            return res.status(429).json({
                success: false,
                message: 'You are sending messages too fast. Please wait a moment.'
            });
        }

        const conv = await getOrCreateConversation(req.user.id, userType);

        const msg = await Message.create({
            conversationId: conv._id,
            sender: {
                kind: 'user',
                id: req.user.id,
                role: req.user.role
            },
            text,
            attachments: attachmentOf(req.file)
        });

        saved = true;

        // unread +1 of each staff member
        const staffIds = await getLiveChatStaffIds();
        const update = {
            $set: {
                lastMessageAt: msg.createdAt,
                lastMessage: { text: previewOf(previewText(text, req.file)), senderKind: 'user' },
            },
        };

        if (staffIds.length) {
            update.$inc = {};
            staffIds.forEach((id) => { update.$inc[`staffUnread.${id}`] = 1; });
        }

        await Conversation.updateOne({ _id: conv._id }, update);

        const message = serializeMessage(msg);
        const payload = { conversationId: String(conv._id), message };

        emitToStaff('chat:message', payload);
        emitToUser(req.user.id, 'chat:message', payload);   // isi user ke doosre tabs / devices ke liye

        const status = await getChatStatus();
        return res.status(201).json({
            success: true,
            message,
            status
        });

    } catch (err) {
        console.log("sendSupportMessages error :", err);
        return res.status(500).json({
            success: false,
            message: 'Server Error Occured'
        });
    } finally {
        if (!saved) await cleanupUploadedFiles(req.file);
    }
};

// mark unread msgs to read
export const markSupportChatRead = async (req, res) => {
    try {
        if (!userTypeOf(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Access Denied'
            });
        }

        if (!mongoose.isValidObjectId(req.user.id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user'
            })
        };

        await Conversation.updateOne({ userId: req.user.id, type: 'support' }, { $set: { userUnread: 0 } });

        return res.status(200).json({
            success: true
        });

    } catch (err) {
        console.error('markSupportChatRead error:', err);
        return res.status(500).json({
            success: false,
            message: 'Server Error Occured'
        });
    }
};

// unread count
export const getMyUnreadCount = async (req, res) => {
    try {
        if (!userTypeOf(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Access Denied'
            });
        }

        const conv = await Conversation.findOne({ userId: req.user.id, type: 'support' })
            .select('userUnread').lean();

        return res.status(200).json({
            success: true,
            count: conv?.userUnread || 0
        });

    } catch (err) {
        console.error('getMyUnreadCount error:', err);
        return res.status(500).json({
            success: false,
            message: 'Server Error Occured'
        });
    }
};
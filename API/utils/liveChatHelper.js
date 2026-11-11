
import Admin from '../models/adminModelSchema.js';
import { getIO } from '../sockets/socketServer.js';

export const STAFF_ROOM = 'staff:livechat';
export const MAX_TEXT = 1000;

const TZ = 'Asia/Dubai';

// Mon-Fri, 9:00 to 18:00 
export const isWorkingHours = (now = new Date()) => {
    const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: TZ,
        weekday: 'short',
        hour: 'numeric',
        hour12: false,
    }).formatToParts(now);

    const weekday = parts.find((p) => p.type === 'weekday')?.value;
    let hour = Number(parts.find((p) => p.type === 'hour')?.value);
    if (hour === 24) hour = 0;

    return !['Sat', 'Sun'].includes(weekday) && hour >= 9 && hour < 18;
};

// check admin / manager online or not
export const isStaffOnline = async () => {
    try {
        const sockets = await getIO().in(STAFF_ROOM).allSockets();
        return sockets.size > 0;
    } catch {
        return false;
    }
};

// ONLINE = working hours AND real presence
export const getChatStatus = async () => {
    const workingHours = isWorkingHours();
    const staffConnected = await isStaffOnline();
    return { online: workingHours && staffConnected, workingHours };
};

// find out id of active admin + permissioned manageLiveChat manager
export const getLiveChatStaffIds = async () => {
    const staff = await Admin.find({
        isActive: true,
        $or: [{ role: 'admin' }, { 'permissions.manageLiveChat': true }],
    }).select('_id').lean();
    return staff.map((s) => String(s._id));
};

export const emitToStaff = (event, payload) => {
    try {
        getIO().to(STAFF_ROOM).emit(event, payload);
    } catch (err) {
        console.error('[liveChat] emitToStaff failed:', err.message);
    }
};

// msg preview of 120 chars
export const previewOf = (text) => String(text || '').slice(0, 120);

// show name not id - to user
export const serializeMessage = (m) => ({
    _id: m._id,
    from: m.sender.kind,
    text: m.text || '',
    attachments: m.attachments || [],
    createdAt: m.createdAt,
    displayName: m.sender.kind === 'staff' ? (m.sender.displayName || 'Support') : null,
});

// simple in-memory rate limit (ek server instance ke liye theek hai)
const hits = new Map();
export const tooFast = (key, limit = 10, windowMs = 60_000) => {
    const now = Date.now();
    const recent = (hits.get(key) || []).filter((t) => now - t < windowMs);
    if (recent.length >= limit) {
        hits.set(key, recent);
        return true;
    }
    recent.push(now);
    hits.set(key, recent);
    return false;
};
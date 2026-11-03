
import Admin from '../models/adminModelSchema.js';
import { createNotification } from '../services/notificationService.js';

export const notifySafe = async (payload) => {
    try {
        await createNotification(payload);
    } catch (err) {
        console.error('[dispute] notification failed:', err.message);
    }
};

export const notifyParty = (party, { type, vehicleId, title, message }) => {
    if (!party?.id) return null;
    return notifySafe({
        recipientId: party.id,
        recipientType: party.type,
        type,
        vehicleId,
        title,
        message
    });
};

export const notifyStaff = async ({ type, vehicleId, title, message }) => {
    try {
        const staff = await Admin.find({
            isActive: true,
            $or: [{ role: 'admin' }, { 'permissions.managePayments': true }],
        }).select('_id').lean();

        await Promise.all(
            staff.map((a) => notifySafe({
                recipientId: a._id,
                recipientType: 'Admin',
                type,
                vehicleId,
                title,
                message
            }))
        );
    } catch (err) {
        console.error('[dispute] staff notification failed:', err.message);
    }
};
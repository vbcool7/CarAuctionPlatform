
import Notification from '../models/notificationModelSchema.js';
import { emitToUser } from '../sockets/socketEmitter.js';

export const createNotification = async ({ recipientId, recipientType, type, vehicleId, title, message }) => {
    try {
        const notification = await Notification.create({
            recipientId,
            recipientType,
            type,
            vehicleId,
            title,
            message,
        });

        emitToUser(recipientId, 'notification', {
            _id: notification._id,
            type: notification.type,
            title: notification.title,
            message: notification.message,
            vehicleId: notification.vehicleId,
            isRead: notification.isRead,
            createdAt: notification.createdAt,
        });

        return notification;
    } catch (err) {
        // notification-failure se main operation (purchase/cancel) fail nahi hona chahiye
        console.error('[notification.service] failed to create notification:', err.message);
        return null;
    }
};
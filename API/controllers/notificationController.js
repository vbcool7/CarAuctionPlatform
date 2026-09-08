
import Notification from '../models/notificationModelSchema.js';

// get notifications
export const getAllNotifications = async (req, res) => {
    try {
        const recipientId = req.user.id;
        const recipientType = req.user.role === 'buyer' ? 'Buyer' : 'Seller';

        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, Math.min(50, parseInt(req.query.limit) || 10));
        const skip = (page - 1) * limit;

        const filter = { recipientId, recipientType };
        if (req.query.isRead === 'true') filter.isRead = true;
        if (req.query.isRead === 'false') filter.isRead = false;

        const [notifications, filteredCount, unreadCount, totalCount] = await Promise.all([
            Notification.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Notification.countDocuments(filter),
            Notification.countDocuments({ recipientId, recipientType, isRead: false }),
            Notification.countDocuments({ recipientId, recipientType }),
        ]);

        res.status(200).json({
            success: true,
            unreadCount,
            totalCount,
            count: notifications.length,
            totalPages: Math.ceil(filteredCount / limit),
            data: notifications,
        });

    } catch (err) {
        console.error("Get All Notifications Error:", err);
        res.status(500).json({
            success: false,
            message: "Server Error Occured"
        });
    }
};

// mark read
export const markReadNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const recipientId = req.user.id;
        const recipientType = req.user.role === 'buyer' ? 'Buyer' : 'Seller';

        const notification = await Notification.findOneAndUpdate(
            { _id: id, recipientId, recipientType },
            { $set: { isRead: true } },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        res.status(200).json({
            success: true,
            data: notification,
        });

    } catch (err) {
        console.error("Mark Read Notification Error:", err);
        res.status(500).json({
            success: false,
            message: "Server Error Occured"
        });
    }
};

// mark all read
export const markAllReadNotifications = async (req, res) => {
    try {
        const recipientId = req.user.id;
        const recipientType = req.user.role === 'buyer' ? 'Buyer' : 'Seller';

        const result = await Notification.updateMany(
            { recipientId, recipientType, isRead: false },
            { $set: { isRead: true } }
        );

        res.status(200).json({
            success: true,
            message: "All notifications marked as read",
            modifiedCount: result.modifiedCount,
        });

    } catch (err) {
        console.error("Mark All Read Notifications Error:", err);
        res.status(500).json({ 
            success: false, 
            message: "Server Error Occured" 
        });
    }
};
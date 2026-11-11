
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import requirePermission from '../middlewares/requirePermission.js';
import { upload } from '../middlewares/imageStorage.js';
import {
    getLiveChatConversations, getLiveChatUnreadCount, getLiveChatMessages, sendLiveChatReply, markLiveChatRead,
    getSupportChatStatus, getMySupportChat, sendSupportMessages, markSupportChatRead, getMyUnreadCount
} from '../controllers/supportChatController.js';

const router = express.Router();

const chatUpload = (req, res, next) => {
    upload.single('attachment')(req, res, (err) => {
        if (!err) return next();
        const message =
            err.code === 'LIMIT_FILE_SIZE' ? 'File must be 10MB or less'
                : err.code === 'LIMIT_UNEXPECTED_FILE' ? 'Only one file per message is allowed'
                    : err.message || 'Upload failed';
        return res.status(400).json({ success: false, message });
    });
};

// ========================================== ADMIN

router.get('/conversations', authMiddleware(['admin', 'auctionManager']), requirePermission('manageLiveChat'), getLiveChatConversations);
router.get('/unread-count', authMiddleware(['admin', 'auctionManager']), requirePermission('manageLiveChat'), getLiveChatUnreadCount);
router.get('/conversations/:id/messages', authMiddleware(['admin', 'auctionManager']), requirePermission('manageLiveChat'), getLiveChatMessages);
router.post('/conversations/:id/reply', authMiddleware(['admin', 'auctionManager']), requirePermission('manageLiveChat'), chatUpload, sendLiveChatReply);
router.post('/conversations/:id/read', authMiddleware(['admin', 'auctionManager']), requirePermission('manageLiveChat'), markLiveChatRead);

// ========================================== BUYER / SELLER

router.get('/get-status', authMiddleware(['buyer', 'seller']), getSupportChatStatus);
router.get('/my-messages', authMiddleware(['buyer', 'seller']), getMySupportChat);
router.post('/send-messages', authMiddleware(['buyer', 'seller']), chatUpload, sendSupportMessages);
router.post('/read-messages', authMiddleware(['buyer', 'seller']), markSupportChatRead);
router.get('/my-unread', authMiddleware(['buyer', 'seller']), getMyUnreadCount);

export default router;
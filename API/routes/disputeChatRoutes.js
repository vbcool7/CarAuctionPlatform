
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import requirePermission from '../middlewares/requirePermission.js';
import {
    getDisputeChat, sendDisputeChat, markDisputeChatRead,
    getMyDisputeChat, sendMyDisputeChat, markMyDisputeChatRead
} from '../controllers/disputeChatController.js';

const router = express.Router();

// ========================================== ADMIN

router.get('/chat/:id', authMiddleware(['admin', 'auctionManager']), requirePermission('managePayments'), getDisputeChat);
router.post('/send-chat/:id', authMiddleware(['admin', 'auctionManager']), requirePermission('managePayments'), sendDisputeChat);
router.post('/mark-read/:id', authMiddleware(['admin', 'auctionManager']), requirePermission('managePayments'), markDisputeChatRead);

// ========================================== BUYER / SELLER 

router.get('/my-dispute-chat/:id', authMiddleware(['buyer', 'seller']), getMyDisputeChat);
router.post('/my-dispute-chat/:id/send', authMiddleware(['buyer', 'seller']), sendMyDisputeChat);
router.post('/my-dispute-chat/:id/read', authMiddleware(['buyer', 'seller']), markMyDisputeChatRead);

export default router;
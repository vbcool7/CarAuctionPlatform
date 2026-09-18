
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { getAllNotifications, markReadNotification, markAllReadNotifications } from '../controllers/notificationController.js';

const router = express.Router();

router.get('/get-all-notifications', authMiddleware(['seller', 'buyer', 'admin', 'auctionManager']), getAllNotifications);
router.patch('/mark-read-notification/:id', authMiddleware(['seller', 'buyer', 'admin', 'auctionManager']), markReadNotification);
router.patch('/mark-all-read-notifications', authMiddleware(['seller', 'buyer', 'admin', 'auctionManager']), markAllReadNotifications);

export default router;
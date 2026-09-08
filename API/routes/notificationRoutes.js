
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { getAllNotifications, markReadNotification, markAllReadNotifications } from '../controllers/notificationController.js';

const router = express.Router();

router.get('/get-all-notifications', authMiddleware(['seller', 'buyer']), getAllNotifications);
router.patch('/mark-read-notification/:id', authMiddleware(['seller', 'buyer']), markReadNotification);
router.patch('/mark-all-read-notifications', authMiddleware(['seller', 'buyer']), markAllReadNotifications);

export default router;
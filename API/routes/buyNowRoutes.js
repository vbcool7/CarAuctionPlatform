
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { buyNow } from '../controllers/buyNowController.js';

const router = express.Router();

router.post('/buy-now', authMiddleware(['buyer', 'seller']), buyNow);

export default router;
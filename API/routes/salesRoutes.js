
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { getMySales, getMySalesSummary, getDashboardSummary, getMySaleDetail } from '../controllers/salesController.js';

const router = express.Router();

router.get('/get-dashboard-summary', authMiddleware(['seller']), getDashboardSummary);
router.get('/get-my-sales-summary', authMiddleware(['seller']), getMySalesSummary);
router.get('/get-my-sales', authMiddleware(['seller']), getMySales);
router.get('/get-sale-detail/:id', authMiddleware(['seller']), getMySaleDetail);

export default router;
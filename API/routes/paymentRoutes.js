
import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { createCheckoutSession, getMyOrder, getMyOrders, getMyOrdersSummary } from "../controllers/paymentController.js";

const router = express.Router();

router.get('/get-my-order-detail/:id', authMiddleware(['buyer','seller']), getMyOrder);
router.get('/get-my-orders', authMiddleware(['buyer','seller']), getMyOrders);
router.post('/order-checkout/:id', authMiddleware(['buyer','seller']), createCheckoutSession);
router.get('/get-my-orders-summary', authMiddleware(['buyer','seller']), getMyOrdersSummary);

export default router;
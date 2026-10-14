
import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { createCheckoutSession, getMyOrder, getMyOrders } from "../controllers/paymentController.js";

const router = express.Router();

router.get('/get-my-order-detail/:id', authMiddleware(['buyer','seller']), getMyOrder);
router.get('/get-my-orders', authMiddleware(['buyer','seller']), getMyOrders);
router.post('/order-checkout/:id', authMiddleware(['buyer','seller']), createCheckoutSession);

export default router;
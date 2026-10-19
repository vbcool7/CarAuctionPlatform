
import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { getMyPayouts, getMyPayoutById, requestPayout } from "../controllers/payoutController.js";

const router = express.Router();

router.get('/get-my-payouts', authMiddleware(['seller']), getMyPayouts);
router.get('/get-my-payout-detail/:id', authMiddleware(['seller']), getMyPayoutById);
router.post('/request-for-payout/:id', authMiddleware(['seller']), requestPayout);

export default router;
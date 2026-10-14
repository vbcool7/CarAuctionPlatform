
import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { getMyPayouts, requestPayout } from "../controllers/payoutController.js";

const router = express.Router();

router.get('/get-my-payouts', authMiddleware(['seller']), getMyPayouts);
router.post('/request-for-payout/:id', authMiddleware(['seller']), requestPayout);

export default router;
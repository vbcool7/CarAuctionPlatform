
import express from 'express';
import {sentOTP, verifyOTP} from '../controllers/otpController.js';

const router = express.Router();

router.post("/send-otp", sentOTP);
router.post("/verify-otp", verifyOTP);

export default router;

import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/imageStorage.js';

import { buyerRegistration, buyerLogin, buyerForgotPass, buyerResetpassword, buyerLogout, getBuyer, buyerChangePassword } from '../controllers/buyerController.js';

const router = express.Router();

const buyerUploads = upload.fields([
    { name: 'frontImageUrl', maxCount: 1 },
    { name: 'backImageUrl', maxCount: 1 },
    { name: 'selfieImageUrl', maxCount: 1 },
    { name: 'documentUrl', maxCount: 1 },
    { name: 'landlordIdUrl', maxCount: 1 },
]);

router.post('/buyer-registration', buyerUploads, buyerRegistration);
router.post('/buyer-login', buyerLogin);
router.post('/buyer-forgot-password', buyerForgotPass);
router.post('/buyer-reset-password/:buyer_id/:token', buyerResetpassword);

router.post('/buyer-logout', authMiddleware(['buyer']), buyerLogout);
router.get('/buyer-get/:buyer_id', authMiddleware(['buyer']), getBuyer);
router.put('/buyer-change-password', authMiddleware(['buyer']), buyerChangePassword);

export default router;
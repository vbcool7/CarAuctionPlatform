
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/imageStorage.js';

import {
    buyerRegistration, buyerLogin, buyerForgotPass, buyerResetpassword, buyerLogout, getBuyer, reuploadBuyerDocs,
    getBuyerDashboardStats, buyerChangePassword, updateBuyerProfile,
} from '../controllers/buyerController.js';

const router = express.Router();

const buyerUploads = upload.fields([
    { name: 'frontImageUrl', maxCount: 1 },
    { name: 'backImageUrl', maxCount: 1 },
    { name: 'selfieImageUrl', maxCount: 1 },
    { name: 'documentUrl', maxCount: 1 },
    { name: 'landlordIdUrl', maxCount: 1 },
]);

const profileImageUpload = (req, res, next) => {
    uploadImage.fields([{ name: 'profileImage', maxCount: 1 }])(req, res, (err) => {
        if (!err) return next();

        const message = err.code === 'LIMIT_FILE_SIZE'
            ? 'Photo must be under 2MB'
            : (err.message || 'Photo upload failed');

        return res.status(400).json({ success: false, message });
    });
};

router.post('/buyer-registration', buyerUploads, buyerRegistration);
router.post('/buyer-login', buyerLogin);
router.post('/buyer-forgot-password', buyerForgotPass);
router.post('/buyer-reset-password/:buyer_id/:token', buyerResetpassword);

router.post('/buyer-logout', authMiddleware(['buyer']), buyerLogout);
router.get('/buyer-get/:id', authMiddleware(['buyer']), getBuyer);
router.put('/buyer-change-password', authMiddleware(['buyer']), buyerChangePassword);

router.patch('/buyer-update-profile', authMiddleware(['buyer']), profileImageUpload, updateBuyerProfile);

router.patch('/buyer-reupload/:buyer_id/:token/:group', buyerUploads, reuploadBuyerDocs);

router.get('/dashboard-stats', authMiddleware(['buyer']), getBuyerDashboardStats);

export default router;
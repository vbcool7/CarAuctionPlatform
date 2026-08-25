
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/imageStorage.js';

import { 
    registerStep1, registerStep2, registerStep3, registerStep4, registerStep5, registerStep6, registerStep7, 
    sellerLogin, sellerForgotPass, sellerResetpassword, sellerLogout, sellerGet , reuploadSellerDocs, 
} from '../controllers/sellerController.js';

const router = express.Router();

const sellerUploads = upload.fields([
    { name: 'tradeLicense', maxCount: 1 },
    { name: 'emiratesId', maxCount: 1 },
    { name: 'bankStatement', maxCount: 1 },
    { name: 'vatCertificate', maxCount: 1 },
]);

router.post('/seller_register_step1', upload.single('profileImage'), registerStep1);
router.patch('/seller_register_step2/:id', registerStep2);
router.patch('/seller_register_step3/:id', registerStep3);
router.patch('/seller_register_step4/:id', registerStep4);
router.patch('/seller_register_step5/:id', sellerUploads, registerStep5);
router.patch('/seller_register_step6/:id', registerStep6);
router.post('/seller_register_step7/:id', registerStep7);
router.post('/seller-login', sellerLogin);
router.post('/seller-forgot-password', sellerForgotPass);
router.post('/seller-reset-password/:seller_id/:token', sellerResetpassword);
router.post('/seller-logout', sellerLogout);
router.get('/seller-get', authMiddleware(['seller']), sellerGet);

router.patch('/seller-reupload/:seller_id/:token/:document', sellerUploads, reuploadSellerDocs);

export default router;
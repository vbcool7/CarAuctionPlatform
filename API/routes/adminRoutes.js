
import express from 'express';
import { upload } from '../middlewares/imageStorage.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { adminSignup, adminLogin, adminGet, adminLogout, addNewBuyer } from '../controllers/adminController.js';

const router = express.Router();

const identityDocsUpload = upload.fields([
    { name: 'profileImageUrl', maxCount: 1 },
    { name: 'frontImageUrl', maxCount: 1 },
    { name: 'backImageUrl', maxCount: 1 },
    { name: 'selfieImageUrl', maxCount: 1 },
    { name: 'documentUrl', maxCount: 1 },
    { name: 'landlordIdUrl', maxCount: 1 },
]);

router.post('/admin-signup', upload.single('profilePhoto'), adminSignup);
router.post('/admin-login', adminLogin);
router.get('/admin-get', authMiddleware(['admin']), adminGet)
router.post('/admin-logout', adminLogout);

router.post('/add-new-buyer', authMiddleware(['admin']), identityDocsUpload, addNewBuyer);

export default router;
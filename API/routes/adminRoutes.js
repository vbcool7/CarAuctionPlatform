
import express from 'express';
import { upload } from '../middlewares/imageStorage.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { adminSignup, adminLogin, adminGet, adminLogout } from '../controllers/adminController.js';

const router = express.Router();

router.post('/admin-signup', upload.single('profilePhoto'), adminSignup);
router.post('/admin-login', adminLogin);
router.get('/admin-get', authMiddleware(['admin']), adminGet)
router.post('/admin-logout', adminLogout);

export default router;
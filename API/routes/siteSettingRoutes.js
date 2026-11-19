
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { 
    getPublicSettings, getAdminSettings, updateSettings 
} from '../controllers/siteSettingController.js';

const router = express.Router();

// =================================================== PUBLIC

router.get('/public', getPublicSettings);

// =================================================== ADMIN

router.get('/settings', authMiddleware(['admin']), getAdminSettings);
router.patch('/update-settings', authMiddleware(['admin']), updateSettings);

export default router;
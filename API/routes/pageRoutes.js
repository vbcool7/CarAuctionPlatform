
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import {
    getAllPages, getPageById, createPage, updatePage, deletePage, getPublicPageBySlug,
} from '../controllers/pageController.js';

import { getPublicFooterPages } from '../controllers/pageFooterController.js';

const router = express.Router();

// =================================================== PUBLIC

router.get('/public/:slug', getPublicPageBySlug);
router.get('/public-footer', getPublicFooterPages);

// =================================================== ADMIN

router.get('/pages', authMiddleware(['admin']), getAllPages);
router.get('/page-detail/:id', authMiddleware(['admin']), getPageById);
router.post('/create-page', authMiddleware(['admin']), createPage);
router.patch('/update-page/:id', authMiddleware(['admin']), updatePage);
router.delete('/delete-page/:id', authMiddleware(['admin']), deletePage);

export default router;
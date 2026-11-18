
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import {
    getAllFaqCategories, createFaqCategory, updateFaqCategory, moveFaqCategory, deleteFaqCategory,
    getAllFaqs, getFaqById, createFaq, updateFaq, moveFaq, deleteFaq,
    getPublicFaqs,
} from '../controllers/faqController.js';

const router = express.Router();

// =================================================== ADMIN 

router.get('/categories', authMiddleware(['admin']), getAllFaqCategories);
router.post('/category', authMiddleware(['admin']), createFaqCategory);
router.patch('/category/:id', authMiddleware(['admin']), updateFaqCategory);
router.patch('/category-move/:id', authMiddleware(['admin']), moveFaqCategory);
router.delete('/category/:id', authMiddleware(['admin']), deleteFaqCategory);

router.get('/faqs', authMiddleware(['admin']), getAllFaqs);
router.get('/faq/:id', authMiddleware(['admin']), getFaqById);
router.post('/create-faq', authMiddleware(['admin']), createFaq);
router.patch('/update-faq/:id', authMiddleware(['admin']), updateFaq);
router.patch('/faq-move/:id', authMiddleware(['admin']), moveFaq);
router.delete('/delete-faq/:id', authMiddleware(['admin']), deleteFaq);

// =================================================== PUBLIC

router.get('/public', getPublicFaqs);

export default router;
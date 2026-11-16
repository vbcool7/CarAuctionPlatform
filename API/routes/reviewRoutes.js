
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import {
    getAllReviews, getReviewById, hideReview, unhideReview, featureReview, unfeatureReview,
    getOrderReview, createReview, updateReview, replyToReview,
    getHomeReviews, getSellerPublicReviews, getMyReceivedReviews, getMyGivenReviews,
} from '../controllers/reviewController.js';

const router = express.Router();

// ================================================= ADMIN

router.get('/get-all-reviews', authMiddleware(['admin']), getAllReviews);
router.get('/review-detail/:id', authMiddleware(['admin']), getReviewById);
router.patch('/review-hide/:id', authMiddleware(['admin']), hideReview);
router.patch('/review-unhide/:id', authMiddleware(['admin']), unhideReview);
router.patch('/review-feature/:id', authMiddleware(['admin']), featureReview);
router.patch('/review-unfeature/:id', authMiddleware(['admin']), unfeatureReview);

// ================================================= PUBLIC

router.get('/public/home-reviews', getHomeReviews);
router.get('/public/seller-reviews/:sellerId', getSellerPublicReviews);

// ================================================= SELLER + BUYER

router.get('/received', authMiddleware(['seller']), getMyReceivedReviews);
router.get('/reviews/:orderId', authMiddleware(['buyer', 'seller']), getOrderReview);
router.post('/create/:orderId', authMiddleware(['buyer', 'seller']), createReview);
router.patch('/update/:id', authMiddleware(['buyer', 'seller']), updateReview);
router.post('/reply/:id', authMiddleware(['buyer', 'seller']), replyToReview);
router.get('/given', authMiddleware(['buyer', 'seller']), getMyGivenReviews);

export default router;
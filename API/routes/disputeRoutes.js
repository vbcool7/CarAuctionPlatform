
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import requirePermission from '../middlewares/requirePermission.js';
import { upload } from '../middlewares/imageStorage.js';

import { 
    createDisputeCategory, updateDisputeCategory, getAllDisputeCategories, getDisputeCategoryById, 
    getAllDisputes, getDisputeDetail, startDisputeReview, addDisputeNote, resolveDispute, reconcileDisputeHolds,
    getDisputeCategories, raiseDispute, respondToDispute, withdrawDispute, getMyDisputes, getMyDispute 
} from '../controllers/disputeController.js';

const router = express.Router();

// ================================================= ADMIN

router.post('/create-dispute-category', authMiddleware(['admin']), createDisputeCategory);
router.patch('/update-dispute-category/:id', authMiddleware(['admin']), updateDisputeCategory);
router.get('/dispute-categories', authMiddleware(['admin', 'auctionManager']), requirePermission('managePayments'), getAllDisputeCategories);
router.get('/dispute-category/:id', authMiddleware(['admin', 'auctionManager']), requirePermission('managePayments'), getDisputeCategoryById);

router.get('/get-all-disputes', authMiddleware(['admin', 'auctionManager']), requirePermission('managePayments'), getAllDisputes);
router.get('/dispute-detail/:id', authMiddleware(['admin', 'auctionManager']), requirePermission('managePayments'), getDisputeDetail);
router.patch('/dispute-start-review/:id', authMiddleware(['admin', 'auctionManager']), requirePermission('managePayments'), startDisputeReview);
router.post('/dispute-add-note/:id', authMiddleware(['admin', 'auctionManager']), requirePermission('managePayments'), addDisputeNote);
router.patch('/dispute-resolve/:id', authMiddleware(['admin', 'auctionManager']), requirePermission('managePayments'), resolveDispute);
router.post('/dispute-reconcile-holds', authMiddleware(['admin']), reconcileDisputeHolds);

// ================================================= SELLER / BUYER

const evidenceUpload = (req, res, next) => {
    upload.fields([{ name: 'evidence', maxCount: 5 }])(req, res, (err) => {
        if (!err) return next();

        const message =
            err.code === 'LIMIT_FILE_SIZE' ? 'Each file must be under 10MB'
                : err.code === 'LIMIT_UNEXPECTED_FILE' ? 'You can attach at most 5 files'
                    : (err.message || 'File upload failed');

        return res.status(400).json({ success: false, message });
    });
};

router.get('/get-dispute-categories', authMiddleware(['buyer', 'seller']), getDisputeCategories);
router.post('/raise-dispute/:orderId', authMiddleware(['buyer', 'seller']), evidenceUpload, raiseDispute);
router.post('/respond-dispute/:id', authMiddleware(['buyer', 'seller']), evidenceUpload, respondToDispute);
router.patch('/withdraw-dispute/:id', authMiddleware(['buyer', 'seller']), withdrawDispute);
router.get('/my-disputes', authMiddleware(['buyer', 'seller']), getMyDisputes);
router.get('/my-dispute-detail/:id', authMiddleware(['buyer', 'seller']), getMyDispute);

export default router;
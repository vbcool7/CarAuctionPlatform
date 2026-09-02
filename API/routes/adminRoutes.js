
import express from 'express';
import { upload } from '../middlewares/imageStorage.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import {
    adminSignup, adminLogin, adminGet, adminLogout,
    addNewBuyer, getAllBuyers, toggleBuyerVerification, getBuyerById, buyerDocVerification,
    addNewSeller, getAllSellers, toggleSellerVerification, getSellerById, sellerDocVerification, 
    getAllVehicles, getVehiclesBySeller, getVehicleById, reviewVehicle, getVehicleApprovalSummary,
    getAllBids,
    getAllAuctions, getAuctionDetail, getAllAuctionStats, getLiveAuctionStats, getUpcomingAuctionStats
} from '../controllers/adminController.js';

const router = express.Router();

const identityDocsUpload = upload.fields([
    { name: 'profileImageUrl', maxCount: 1 },
    { name: 'frontImageUrl', maxCount: 1 },
    { name: 'backImageUrl', maxCount: 1 },
    { name: 'selfieImageUrl', maxCount: 1 },
    { name: 'documentUrl', maxCount: 1 },
    { name: 'landlordIdUrl', maxCount: 1 },
]);

const sellerDocsUpload = upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'tradeLicense', maxCount: 1 },
    { name: 'emiratesId', maxCount: 1 },
    { name: 'bankStatement', maxCount: 1 },
    { name: 'vatCertificate', maxCount: 1 },
]);

// ============================ ADMIN
router.post('/admin-signup', upload.single('profilePhoto'), adminSignup);
router.post('/admin-login', adminLogin);
router.get('/admin-get', authMiddleware(['admin']), adminGet);
router.post('/admin-logout', adminLogout);

// ============================ BUYER
router.post('/add-new-buyer', authMiddleware(['admin']), (req, res, next) => {
    identityDocsUpload(req, res, (err) => {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    success: false,
                    message: "File size exceeds 10MB limit"
                });
            }

            return res.status(400).json({
                success: false,
                message: err.message || "Invalid file upload"
            });
        }

        next();
    })
}, addNewBuyer);

router.get('/all-buyers-list', authMiddleware(['admin']), getAllBuyers);
router.patch('/toggle-buyer-verification/:buyerId', authMiddleware(['admin']), toggleBuyerVerification);
router.get('/get-buyer/:id', authMiddleware(['admin']), getBuyerById);
router.patch('/buyer-document-verification/:id/:group', authMiddleware(['admin']), buyerDocVerification);

// ============================ SELLER
router.post('/add-new-seller', authMiddleware(['admin']), (req, res, next) => {
    sellerDocsUpload(req, res, (err) => {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    success: false,
                    message: "File size exceeds 10MB limit"
                });
            }

            return res.status(400).json({
                success: false,
                message: err.message || "Invalid file upload"
            });
        }

        next();
    });
}, addNewSeller);

router.get('/all-sellers-list', authMiddleware(['admin']), getAllSellers);
router.patch('/toggle-seller-verification/:sellerId', authMiddleware(['admin']), toggleSellerVerification);
router.get('/get-seller/:sellerId', authMiddleware(['admin']), getSellerById);
router.patch('/seller-document-verification/:id/:document', authMiddleware(['admin']), sellerDocVerification);

// ============================ VEHICLE
router.get('/all-vehicles-list', authMiddleware(['admin']), getAllVehicles);
router.get('/get-seller-vehicles/:sellerId', authMiddleware(['admin']), getVehiclesBySeller);
router.get('/get-vehicle/:id', authMiddleware(['admin']), getVehicleById);
router.patch('/vehicle-review/:id', authMiddleware(['admin']), reviewVehicle);
router.get('/vehicle-approval-summary', authMiddleware(['admin']), getVehicleApprovalSummary);

// ============================ BID
router.get('/all-bids', authMiddleware(['admin']), getAllBids);

// ============================ AUCTION
router.get('/all-auctions', authMiddleware(['admin']), getAllAuctions);
router.get('/auction-detail/:id', authMiddleware(['admin']), getAuctionDetail);
router.get("/all-auction-stats", authMiddleware(['admin']), getAllAuctionStats);
router.get("/live-auction-stats", authMiddleware(['admin']), getLiveAuctionStats);
router.get("/upcoming-auction-stats", authMiddleware(['admin']), getUpcomingAuctionStats);

export default router;
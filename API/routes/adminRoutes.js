
import express from 'express';
import { upload } from '../middlewares/imageStorage.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import requirePermission from '../middlewares/requirePermission.js';
import {
    adminSignup, login, adminGet, adminLogout,
    addNewBuyer, getAllBuyers, toggleBuyerVerification, getBuyerById, buyerDocVerification, suspendBuyer, reactivateBuyer, getBuyerStats,
    addNewSeller, getAllSellers, toggleSellerVerification, getSellerById, sellerDocVerification, suspendSeller, reactivateSeller, getSellerStats,
    getAllVehicles, getVehiclesBySeller, getVehicleById, reviewVehicle, getVehicleApprovalSummary, getDistinctMakes,
    getAllAuctions, getAuctionDetail, getAllAuctionStats, getLiveAuctionStats, getUpcomingAuctionStats, getCompletedAuctionStats, getCanceledAuctionStats,
    getAllBids, getBidDetail, getBidStats,
    getAllSales,
    addManager, getAllManagers, getManagerById, editManagerPermissions, toggleManagerStatus, 
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
router.post('/login', login);
router.get('/admin-get', authMiddleware(['admin']), adminGet);
router.post('/admin-logout', adminLogout);

// ============================ MANAGER
router.post('/add-manager', authMiddleware(['admin']), upload.single('profilePhoto'), addManager);
router.get('/all-managers-list', authMiddleware(['admin']), getAllManagers);
router.get('/get-manager/:id', authMiddleware(['admin']), getManagerById);
router.patch('/edit-manager-permissions/:id', authMiddleware(['admin']), editManagerPermissions);
router.patch('/toggle-manager-status/:id', authMiddleware(['admin']), toggleManagerStatus);

// ============================ BUYER
router.post('/add-new-buyer', authMiddleware(['admin', 'auctionManager']), requirePermission('manageUsers'), (req, res, next) => {
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

router.get('/all-buyers-list', authMiddleware(['admin', 'auctionManager']), requirePermission('manageUsers'), getAllBuyers);
router.patch('/toggle-buyer-verification/:buyerId', authMiddleware(['admin', 'auctionManager']), requirePermission('manageUsers'), toggleBuyerVerification);
router.get('/get-buyer/:id', authMiddleware(['admin', 'auctionManager']), requirePermission('manageUsers'), getBuyerById);
router.patch('/buyer-document-verification/:id/:group', authMiddleware(['admin', 'auctionManager']), requirePermission('manageUsers'), buyerDocVerification);
router.patch('/suspend-buyer/:id', authMiddleware(['admin', 'auctionManager']), requirePermission('manageUsers'), suspendBuyer);
router.patch('/reactivate-buyer/:id', authMiddleware(['admin', 'auctionManager']), requirePermission('manageUsers'), reactivateBuyer);
router.get('/buyer-stats', authMiddleware(['admin', 'auctionManager']), requirePermission('manageUsers'), getBuyerStats);

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
router.patch('/suspend-seller/:id', authMiddleware(['admin']), suspendSeller);
router.patch('/reactivate-seller/:id', authMiddleware(['admin']), reactivateSeller);
router.get('/seller-stats', authMiddleware(['admin']), getSellerStats);

// ============================ VEHICLE
router.get('/distinct-makes', authMiddleware(['admin', 'auctionManager']), requirePermission('manageVehicles'), getDistinctMakes);
router.get('/all-vehicles-list', authMiddleware(['admin', 'auctionManager']), requirePermission('manageVehicles'), getAllVehicles);
router.get('/get-seller-vehicles/:sellerId', authMiddleware(['admin', 'auctionManager']), requirePermission('manageVehicles'), getVehiclesBySeller);
router.get('/get-vehicle/:id', authMiddleware(['admin', 'auctionManager']), requirePermission('manageVehicles'), getVehicleById);
router.patch('/vehicle-review/:id', authMiddleware(['admin', 'auctionManager']), requirePermission('manageVehicles'), reviewVehicle);
router.get('/vehicle-approval-summary', authMiddleware(['admin', 'auctionManager']), requirePermission('manageVehicles'), getVehicleApprovalSummary);

// ============================ AUCTION
router.get('/all-auctions', authMiddleware(['admin', 'auctionManager']), requirePermission('manageAuctions'), getAllAuctions);
router.get('/auction-detail/:id', authMiddleware(['admin', 'auctionManager']), requirePermission('manageAuctions'), getAuctionDetail);
router.get("/all-auction-stats", authMiddleware(['admin', 'auctionManager']), requirePermission('manageAuctions'), getAllAuctionStats);
router.get("/live-auction-stats", authMiddleware(['admin', 'auctionManager']), requirePermission('manageAuctions'), getLiveAuctionStats);
router.get("/upcoming-auction-stats", authMiddleware(['admin', 'auctionManager']), requirePermission('manageAuctions'), getUpcomingAuctionStats);
router.get("/completed-auction-stats", authMiddleware(['admin', 'auctionManager']), requirePermission('manageAuctions'), getCompletedAuctionStats);
router.get("/canceled-auction-stats", authMiddleware(['admin', 'auctionManager']), requirePermission('manageAuctions'), getCanceledAuctionStats);

// ============================ BID
router.get('/bids-stats', authMiddleware(['admin', 'auctionManager']), requirePermission('manageBids'), getBidStats);
router.get('/all-bids', authMiddleware(['admin', 'auctionManager']), requirePermission('manageBids'), getAllBids);
router.get('/bid-detail/:id', authMiddleware(['admin', 'auctionManager']), requirePermission('manageBids'), getBidDetail);

// ============================ SALES
router.get('/all-sales', authMiddleware(['admin']), getAllSales);

export default router;
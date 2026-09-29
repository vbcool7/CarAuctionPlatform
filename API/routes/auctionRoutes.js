
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import requirePermission from '../middlewares/requirePermission.js';

import {
    getMyAuctions, getMyAuctionById,
    cancelAuction,
    getAllAuctions, getDistinctMakes, getDistinctModels, getupcomingAuctionDates, getLostAuctions, getAuctionDetail, 
    getHomeLiveAuctions, getHomeSoldedVehicles, getPublicAuctions, getPublicAuctionDetail, getUpcomingAuctionDates, 
} from '../controllers/auctionController.js';

const router = express.Router();

// ============================================= SELLER
router.get('/get-my-auctions', authMiddleware(['seller']), getMyAuctions);
router.get('/my-auction-detail/:id', authMiddleware(['seller']), getMyAuctionById);


// ============================================= SELLER + ADMIN + MANAGER
router.patch('/cancel-auction/:id', authMiddleware(['seller', 'admin', 'auctionManager']), requirePermission('manageAuctions'), cancelAuction);

// ============================================= BUYER
router.get('/distinct-makes', getDistinctMakes);
router.get('/distinct-model', getDistinctModels);
router.get('/get-all-auctions', authMiddleware(['buyer']), getAllAuctions);
router.get('/get-auction-detail/:id',authMiddleware(['buyer']), getAuctionDetail)
router.get('/get-upcoming-auction-dates', getupcomingAuctionDates);
router.get('/get-lost-auctions-buyer', authMiddleware(['buyer']), getLostAuctions);

// ============================================= USER
router.get('/get-live-auctions', getHomeLiveAuctions);
router.get('/get-solded-auctions', getHomeSoldedVehicles);
router.get('/get-auction-list', getPublicAuctions);
router.get('/get-public-auction-detail/:id', getPublicAuctionDetail);
router.get('/get-upcoming-auction-dates', getUpcomingAuctionDates);

export default router;
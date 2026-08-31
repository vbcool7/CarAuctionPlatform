
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { updateAuctionStatuses, getMyAuctions, getMyAuctionById } from '../controllers/auctionController.js';

const router = express.Router();

router.post('/update-status', updateAuctionStatuses);

router.get('/get-my-auctions', authMiddleware(['seller']), getMyAuctions);
router.get('/my-auction-detail/:id', authMiddleware(['seller']), getMyAuctionById);

export default router;

import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { getMyAuctions, getMyAuctionById, cancelAuction   } from '../controllers/auctionController.js';

const router = express.Router();

router.get('/get-my-auctions', authMiddleware(['seller']), getMyAuctions);
router.get('/my-auction-detail/:id', authMiddleware(['seller']), getMyAuctionById);

router.patch('/cancel-auction/:id', authMiddleware(['seller', 'admin']), cancelAuction);

export default router;
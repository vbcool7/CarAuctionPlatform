
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { placeBid, getVehicleBids, getMyBids, getMyBidDetail, withdrawBid } from '../controllers/bidController.js';

const router = express.Router();

router.post('/place-bid', authMiddleware(['buyer', 'seller']), placeBid);
router.get('/vehicle-bids/:id', authMiddleware(['buyer', 'seller']), getVehicleBids);
router.get('/my-bids', authMiddleware(['buyer', 'seller']), getMyBids);
router.get('/my-bid-detail/:id',authMiddleware(['buyer', 'seller']), getMyBidDetail);
router.patch('/withdraw-bid/:id', authMiddleware(['buyer', 'seller']), withdrawBid);

export default router;

import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { toggleWatchlist, getMyWatchlist, clearWatchlist } from '../controllers/watchlistController.js';

const router = express.Router();

router.post('/toggle-watchlist', authMiddleware(['buyer', 'seller']), toggleWatchlist);
router.get('/get-my-watchlist', authMiddleware(['buyer', 'seller']), getMyWatchlist);
router.delete('/clear-watchlist', authMiddleware(['buyer', 'seller']), clearWatchlist);

export default router;
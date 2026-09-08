
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { buyVehicle } from '../controllers/purchaseController.js';

const router = express.Router();

router.post('/buy-vehicle/:id', authMiddleware(['buyer', 'seller']), buyVehicle);

export default router;
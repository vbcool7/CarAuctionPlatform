
import express from 'express';
import buyerRoutes from './buyerRoutes.js';
import sellerRoutes from './sellerRoutes.js';
import otpRoutes from './otpRoutes.js';
import adminRoutes from './adminRoutes.js';
import vehicleRoutes from './vehicleRoutes.js';
import auctionRoutes from './auctionRoutes.js';
import bidRoutes from './bidRoutes.js';

const rootRouter = express.Router();

rootRouter.use('/buyer', buyerRoutes);
rootRouter.use('/otp', otpRoutes);
rootRouter.use('/admin', adminRoutes);
rootRouter.use('/seller', sellerRoutes);
rootRouter.use('/vehicle', vehicleRoutes);
rootRouter.use('/auction', auctionRoutes);
rootRouter.use('/bid', bidRoutes);

export default rootRouter;
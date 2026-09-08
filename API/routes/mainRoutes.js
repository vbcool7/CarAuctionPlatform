
import express from 'express';
import buyerRoutes from './buyerRoutes.js';
import sellerRoutes from './sellerRoutes.js';
import otpRoutes from './otpRoutes.js';
import adminRoutes from './adminRoutes.js';
import vehicleRoutes from './vehicleRoutes.js';
import auctionRoutes from './auctionRoutes.js';
import bidRoutes from './bidRoutes.js';
import purchaseRoutes from './purchaseRoutes.js';
import notificationRoutes from './notificationRoutes.js';

const rootRouter = express.Router();

rootRouter.use('/buyer', buyerRoutes);
rootRouter.use('/otp', otpRoutes);
rootRouter.use('/admin', adminRoutes);
rootRouter.use('/seller', sellerRoutes);
rootRouter.use('/vehicle', vehicleRoutes);
rootRouter.use('/auction', auctionRoutes);
rootRouter.use('/bid', bidRoutes);
rootRouter.use('/purchase', purchaseRoutes);
rootRouter.use('/notification', notificationRoutes);

export default rootRouter;
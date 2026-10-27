
import express from 'express';
import buyerRoutes from './buyerRoutes.js';
import sellerRoutes from './sellerRoutes.js';
import otpRoutes from './otpRoutes.js';
import adminRoutes from './adminRoutes.js';
import vehicleRoutes from './vehicleRoutes.js';
import auctionRoutes from './auctionRoutes.js';
import bidRoutes from './bidRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import watchlistRoutes from './watchlistRoutes.js';
import buyNowRoutes from './buyNowRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import payoutRoutes from './payoutRoutes.js';
import salesRoutes from './salesRoutes.js';
import invoiceRoutes from './invoiceRoutes.js';

const rootRouter = express.Router();

rootRouter.use('/buyer', buyerRoutes);
rootRouter.use('/otp', otpRoutes);
rootRouter.use('/admin', adminRoutes);
rootRouter.use('/seller', sellerRoutes);
rootRouter.use('/vehicle', vehicleRoutes);
rootRouter.use('/auction', auctionRoutes);
rootRouter.use('/bid', bidRoutes);
rootRouter.use('/notification', notificationRoutes);
rootRouter.use('/watchlist', watchlistRoutes);
rootRouter.use('/buy', buyNowRoutes);
rootRouter.use('/payment', paymentRoutes);
rootRouter.use('/payout', payoutRoutes);
rootRouter.use('/sales', salesRoutes);
rootRouter.use('/invoice', invoiceRoutes);

export default rootRouter;
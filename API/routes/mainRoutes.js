
import express from 'express';
import buyerRoutes from './buyerRoutes.js';
import sellerRoutes from './sellerRoutes.js';
import otpRoutes from './otpRoutes.js';
import adminRoutes from './adminRoutes.js';

const rootRouter = express.Router();

rootRouter.use('/buyer', buyerRoutes);
rootRouter.use('/otp', otpRoutes);
rootRouter.use('/admin', adminRoutes);
rootRouter.use('/seller', sellerRoutes);

export default rootRouter;
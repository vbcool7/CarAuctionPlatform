
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';

import { downloadBuyerInvoice, downloadSellerSaleStatement } from '../controllers/invoiceController.js';

const router = express.Router();

router.get('/get-invoice/:id', authMiddleware(['buyer', 'seller']), downloadBuyerInvoice);
router.get('/get-sale-statement/:id', authMiddleware(['seller']), downloadSellerSaleStatement);

export default router;
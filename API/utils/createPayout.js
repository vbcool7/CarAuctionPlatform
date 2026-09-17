
import Payout from '../models/payoutModelSchema.js';
import { getNextPayoutId, getNextInvoiceNumber } from './counterHelper.js'; 

export const createPayoutForSale = async ({
    vehicleId,
    sellerId,
    buyerId,
    buyerType,
    saleAmount,
    saleType,   // 'Bid' | 'Purchase'
    sourceId,
}) => {
    const commissionRate = 5;
    const commissionAmount = +(saleAmount * commissionRate / 100).toFixed(2);
    const payoutAmount = +(saleAmount - commissionAmount).toFixed(2);

    const payoutId = await getNextPayoutId();
    const invoiceNumber = await getNextInvoiceNumber();

    return Payout.create({
        payoutId,
        invoiceNumber,
        vehicleId,
        sellerId,
        buyerId,
        buyerType,
        saleType,
        sourceId,
        saleAmount,
        commissionRate,
        commissionAmount,
        payoutAmount,
        status: 'pending',
    });
};
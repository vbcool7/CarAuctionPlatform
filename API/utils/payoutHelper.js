
import Payout from "../models/payoutModelSchema.js";

// commission % from .env
export const getCommissionPercent = () => {
    const n = Number(process.env.COMMISSION_PERCENT);
    return Number.isFinite(n) && n >= 0 && n <= 100 ? n : 5;
};

// commission calculation
export const calcCommission = (gross, percent) => {
    const commissionAmount = Math.round(gross * percent) / 100;
    const netAmount = Math.round((gross - commissionAmount) * 100) / 100;
    return { commissionAmount, netAmount };
};

// Payment success par call hota hai. Dobara call karo to duplicate nahi banta (null return).
export const createPayoutForOrder = async (order) => {

    const percent = getCommissionPercent();
    const { commissionAmount, netAmount } = calcCommission(order.amount, percent);
    const handoverDone = order.handover?.status === 'confirmed';

    try {
        return await Payout.create({
            orderId: order._id,
            vehicleId: order.vehicleId,
            listingId: order.listingId,
            sellerId: order.sellerId,
            grossAmount: order.amount,
            commissionPercent: percent,
            commissionAmount,
            netAmount,
            currency: order.currency || 'AED',
            status: handoverDone ? 'available' : 'on_hold',
            history: [{
                status: handoverDone ? 'available' : 'on_hold',
                by: 'system',
                note: `Payment received. Commission ${percent}% = AED ${commissionAmount}`,
            }],
        });
    } catch (err) {
        if (err?.code === 11000) return null;
        throw err;
    }
};
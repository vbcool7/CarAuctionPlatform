
import cron from 'node-cron';
import { runAuctionEndUpdate, runAuctionStatusUpdate, runFixedPriceExpiry, runPaymentExpiry } from '../controllers/auctionController.js';

export const startAuctionCron = () => {
 
    // run every minute
    cron.schedule('* * * * *', async () => {
        try {
            const liveCount = await runAuctionStatusUpdate();
            if (liveCount > 0) {
                console.log(`[auction-cron] ${liveCount} vehicle(s) moved to live`);
            }
 
            const closedCount = await runAuctionEndUpdate();
            if (closedCount > 0) {
                console.log(`[auction-cron] ${closedCount} vehicle(s) closed (pending_payment/unsold/reserve-not-met)`);
            }
 
            const expiredCount = await runFixedPriceExpiry();
            if (expiredCount > 0) {
                console.log(`[auction-cron] ${expiredCount} fixed-price vehicle(s) expired (unsold)`);
            }
 
            const paymentExpiredCount = await runPaymentExpiry();
            if (paymentExpiredCount > 0) {
                console.log(`[auction-cron] ${paymentExpiredCount} order(s) expired unpaid (vehicle -> unsold)`);
            }
 
        } catch (error) {
            console.error('[auction-cron] error:', error);
        }
    });
};
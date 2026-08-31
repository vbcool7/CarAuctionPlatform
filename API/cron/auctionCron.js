
import cron from 'node-cron';
import { runAuctionEndUpdate, runAuctionStatusUpdate } from '../controllers/auctionController.js';

export const startAuctionCron = () => {

    // run every minute
    cron.schedule('* * * * *', async () => {
        try{
            const liveCount = await runAuctionStatusUpdate();
            if(liveCount > 0){
                console.log(`[auction-cron] ${liveCount} vehicle(s) moved to live`);
            }

            const closedCount = await runAuctionEndUpdate();
            if(closedCount > 0){
                console.log(`[auction-cron] ${closedCount} vehicle(s) closed (sold/unsold/reserve-not-met)`);
            }

        }catch(error){
            console.error('[auction-cron] error:', error);
        }
    });
};
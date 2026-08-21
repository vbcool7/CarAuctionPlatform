
import { Counter } from '../models/counter.js';

export const getNextSequence = async (key, prefix, padLength = 5) => {
    const counter = await Counter.findByIdAndUpdate(
        key,
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    return `${prefix}-${String(counter.seq).padStart(padLength, '0')}`;
};

export const getNextListingId = () => getNextSequence('listingId', 'LST');
export const getNextBuyerId = () => getNextSequence('buyerId', 'BYR');
export const getNextSellerId = () => getNextSequence('sellerId', 'SLR');

import mongoose from 'mongoose';
import Seller from '../models/sellerModelSchema.js';

export const getSellerForStep = async (id, stepNumber) => {
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return { error: { status: 400, message: "Invalid seller id" } };
    }

    const seller = await Seller.findById(id);

    if (!seller) {
        return { error: { status: 404, message: "No registration draft found for this id" } };
    }

    if (seller.isComplete) {
        return { error: { status: 400, message: "This registration is already complete" } };
    }
    if (seller.registrationStep < stepNumber - 1) {
        return {
            error: {
                status: 400,
                message: `Please complete step ${seller.registrationStep + 1} first`
            }
        };
    }

    return { seller };
} 
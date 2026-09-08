
import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema(
    {
        purchaseId: {
            type: String,
            unique: true,
        },
        vehicleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vehicle',
            required: true,
        },
        buyerId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'buyerType',
        },
        buyerType: {
            type: String,
            required: true,
            enum: ['Buyer', 'Seller'],
        },
        amount: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model('Purchase', purchaseSchema);
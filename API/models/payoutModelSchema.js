
import mongoose from 'mongoose';

const payoutSchema = new mongoose.Schema(
    {
        payoutId: { type: String, unique: true },
        invoiceNumber: { type: String, unique: true, required: true },

        vehicleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vehicle',
            required: true,
        },

        sellerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Seller',
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

        saleType: {
            type: String,
            required: true,
            enum: ['Bid', 'Purchase'],   // matches actual model names, so refPath works
        },
        
        sourceId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'saleType',
        },

        saleAmount: { type: Number, required: true },
        commissionRate: { type: Number, default: 5 },
        commissionAmount: { type: Number, required: true },
        payoutAmount: { type: Number, required: true },

        status: {
            type: String,
            required: true,
            enum: ['pending', 'processing', 'paid'],
            default: 'pending',
        },
    },
    { timestamps: true }
);

export default mongoose.model('Payout', payoutSchema);

import mongoose, { model } from "mongoose";
import { getNextPayoutId } from "../utils/counterHelper.js";

const historySchema = new mongoose.Schema(
    {
        _id: false,
        status: { type: String, required: true },
        at: { type: Date, default: Date.now },
        by: { type: String, default: 'system' },   // system | seller | admin | auctionManager
        byId: { type: mongoose.Schema.Types.ObjectId },
        note: { type: String },
    }
);

const payoutSchema = new mongoose.Schema(
    {
        payoutId: {
            type: String,
            unique: true
        },

        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            required: true
        },

        vehicleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vehicle',
            required: true
        },

        listingId: {
            type: String
        },

        sellerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Seller',
            required: true
        },

        grossAmount: { type: Number, required: true },
        commissionPercent: { type: Number, required: true },
        commissionAmount: { type: Number, required: true },
        netAmount: { type: Number, required: true },
        currency: { type: String, default: 'AED' },

        status: {
            type: String,
            enum: ['on_hold', 'available', 'requested', 'paid', 'canceled'],
            default: 'on_hold',
        },

        requestedAt: { type: Date },

        bankSnapshot: {
            accountHolderName: String,
            bankName: String,
            ibanNumber: String,
            accountNumber: String,
            swiftCode: String,
        },

        paidAt: {
            type: Date
        },

        paidBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin'
        },

        transferReference: {
            type: String
        },

        history: { type: [historySchema], default: [] },
    },
    { timestamps: true }
);

payoutSchema.index({ orderId: 1 }, { unique: true });
payoutSchema.index({ sellerId: 1, createdAt: -1 });
payoutSchema.index({ status: 1, createdAt: -1 });

payoutSchema.pre('validate', async function () {
    if (!this.payoutId) {
        this.payoutId = await getNextPayoutId();
    }
});

export default mongoose.model('Payout', payoutSchema);
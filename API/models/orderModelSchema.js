
import mongoose from 'mongoose';
import { getNextOrderId } from '../utils/counterHelper.js';

// Ek vehicle ki har sale-attempt ka ALAG Order banta hai (kabhi delete nahi hota).
// Relist ke baad naya Order banega, purane expired Orders history me rahenge.
// export const PAYMENT_WINDOW_MS = 48 * 60 * 60 * 1000; // 48 hours

export const PAYMENT_WINDOW_MS = (Number(process.env.PAYMENT_WINDOW_MINUTES) || 48 * 60) * 60 * 1000;

const historySchema = new mongoose.Schema(
    {
        _id: false,
        status: { type: String, required: true },
        at: { type: Date, default: Date.now },
        by: { type: String, default: 'system' },   // system | buyer | admin | gateway
        note: { type: String },
    }
);

const orderSchema = new mongoose.Schema(
    {
        orderId: { type: String, unique: true },   // ORD-XXXX (readable id)

        vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
        listingId: { type: String },
        sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },

        buyerId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'buyerType' },
        buyerType: { type: String, required: true, enum: ['Buyer', 'Seller'] }, // winner seller bhi ho sakta hai

        source: { type: String, required: true, enum: ['auction', 'buy_now'] },
        bidId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bid' },  // sirf auction me

        amount: { type: Number, required: true },
        currency: { type: String, default: 'AED' },

        status: {
            type: String,
            enum: ['pending_payment', 'paid', 'expired', 'canceled'],
            default: 'pending_payment',
        },

        // true = pending_payment ya paid. Expired/canceled pe false.
        // Neeche ke unique index se ek vehicle ka ek hi open Order ho sakta hai.
        isOpen: { type: Boolean, default: true },

        paymentDueAt: { type: Date, required: true },
        paidAt: { type: Date },
        stripeSessionId: { type: String },
        stripePaymentIntentId: { type: String },

        handover: {
            status: {
                type: String,
                enum: ['pending', 'confirmed'],
                default: 'pending'
            },
            confirmedAt: { type: Date },
            confirmedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Admin'
            },
            confirmedByRole: { type: String },
            note: { type: String },
        },

        refund: {
            status: { type: String },
            stripeRefundId: { type: String },
            amount: { type: Number },
            reason: { type: String },
            refundedAt: { type: Date },
            refundedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Admin'
            },
        },

        expiredAt: { type: Date },
        canceledAt: { type: Date },

        statusHistory: { type: [historySchema], default: [] },
    },
    { timestamps: true }
);

// DB-level guard: double order / double cron run / buy-now race nahi chalega
orderSchema.index(
    { vehicleId: 1 },
    { unique: true, partialFilterExpression: { isOpen: true } }
);
// ek buyer ka ek time pe sirf ek pending Buy Now (bina deposit ke car lock karne ka misuse rokne ke liye)
orderSchema.index(
    { buyerId: 1 },
    { unique: true, partialFilterExpression: { status: 'pending_payment', source: 'buy_now' } }
);
orderSchema.index({ status: 1, paymentDueAt: 1 });  // expiry cron ke liye
orderSchema.index({ buyerId: 1, createdAt: -1 });
orderSchema.index({ sellerId: 1, createdAt: -1 });

orderSchema.pre('validate', async function () {
    if (!this.orderId) {
        this.orderId = await getNextOrderId();
    }
});

export default mongoose.model('Order', orderSchema);
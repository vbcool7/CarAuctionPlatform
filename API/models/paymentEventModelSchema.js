
import mongoose from 'mongoose';

// Gateway se aaye / hamare bheje har payment event ka permanent log (kabhi delete nahi hota).
const paymentEventSchema = new mongoose.Schema(
    {
        provider: { type: String, default: 'stripe' },

        eventId: { type: String },          // Stripe event id (evt_...) - dedupe ke liye
        type: { type: String, required: true },

        orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
        sessionId: { type: String },
        paymentIntentId: { type: String },

        amount: { type: Number },           
        currency: { type: String },

        outcome: {
            type: String,
            enum: [
                'received',            // abhi process nahi hua
                'session_created',     // humne checkout session banaya
                'paid',                // order paid hua
                'amount_mismatch',     // amount/currency match nahi -> refund
                'refunded_late',       // expiry/cancel ke baad payment aaya -> refund
                'refunded_duplicate',  // dobara payment -> refund
                'refund_failed',       // refund fail: ADMIN ko manually dekhna hai
                'ignored',
                'refunded_admin'
            ],
            default: 'received',
        },
        processed: { type: Boolean, default: false },
        note: { type: String },
    },
    { timestamps: true }
);

paymentEventSchema.index(
    { eventId: 1 },
    { unique: true, partialFilterExpression: { eventId: { $type: 'string' } } }
);
paymentEventSchema.index({ orderId: 1, createdAt: -1 });

export default mongoose.model('PaymentEvent', paymentEventSchema);
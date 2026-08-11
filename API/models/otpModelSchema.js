
import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['buyer', 'seller'],
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

otpSchema.index(
    { createdAt: 1 },
    {
        expireAfterSeconds: 1800,
        partialFilterExpression: { verified: false }
    }
);

export default mongoose.model("OTP", otpSchema);
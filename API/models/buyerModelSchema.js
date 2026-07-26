
import mongoose from 'mongoose';

const buyerSchema = new mongoose.Schema({

    role: {
        type: String,
        default: "buyer"
    },

    // Step 1
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    profileImageUrl: { type: String },
    gender: {
        type: String,
        enum: ['male', 'female', 'other']
    },

    // Step 2
    isEmailVerified: { type: Boolean, default: false },
    isMobileVerified: { type: Boolean, default: false },

    // Step 3
    dob: { type: Date },
    nationality: { type: String },
    country: { type: String },
    city: { type: String },
    address: { type: String },
    pincode: { type: String },
    buyerType: {
        type: String,
        enum: ['individual', 'dealer', 'business']
    },
    companyName: { type: String },
    registrationNumber: { type: String },
    vatNumber: { type: String },

    // Step 4
    identityVerification: {
        documentType: {
            type: String,
            enum: ['passport', 'national_id', 'driving_license']
        },
        frontImageUrl: {
            type: String,
            required: [true, 'Front image is required']
        },
        backImageUrl: {
            type: String,
            required: [function () {
                return ['passport', 'national_id'].includes(this.documentType);
            }, 'Back image required for passport/national ID']
        },
        selfieImageUrl: {
            type: String,
            required: [true, 'Selfie is required']
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        },
        reviewedAt: { type: Date },
        rejectionReason: { type: String }
    },

    addressVerification: {
        documentType: {
            type: String,
            enum: ['bank_statement', 'utility_bill', 'rental_agreement']
        },
        documentUrl: {
            type: String,
            required: [true, 'Document is required']
        },
        landlordIdUrl: {
            type: String,
            required: [function () {
                return this.documentType === 'rental_agreement';
            }, 'Landlord ID required for rental agreement']
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        },
        reviewedAt: { type: Date },
        rejectionReason: { type: String }
    },

    // Step 5 — gateway undecided, keep this generic
    payment: {
        method: {
            type: String,
            enum: ['card', 'bank_transfer', 'paypal', 'other']
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'failed', 'refunded'],
            default: 'pending'
        },
        depositAmount: { type: Number, default: 5000 },
        platformFee: { type: Number, default: 250 },
        depositRefundable: { type: Boolean, default: true },
        paidAt: { type: Date }
    },

    registrationStatus: {
        type: String,
        enum: ['in_progress', 'submitted'],
        default: 'in_progress'
    },
    termsAccepted: { type: Boolean, default: false },
    submittedAt: { type: Date },

    createdBy: {
        type: String,
        enum: ['self', 'admin'],
        default: 'self'
    },
    addedByAdminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },

}, { timestamps: true });

buyerSchema.virtual('payment.totalPayable').get(function () {
    return (this.payment?.depositAmount || 0) + (this.payment?.platformFee || 0);
});

buyerSchema.set('toJSON', { virtuals: true });
buyerSchema.set('toObject', { virtuals: true });

export default mongoose.model('Buyer', buyerSchema);
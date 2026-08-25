
import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema({
    role: {
        type: String,
        default: 'seller'
    },
    sellerId: { 
        type: String, 
        unique: true 
    },
    registrationStep: {
        type: Number,
        default: 1
    },
    isComplete: {
        type: Boolean,
        default: false
    },

    // personal info (Step 1 — always required, entry point of the wizard)
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    profileImage: {
        type: String
    },
    password: {
        type: String,
        required: true,
        select: false
    },

    // business info (Step 2)
    businessName: {
        type: String,
        required: function () {
            return this.isComplete;
        }
    },
    businessType: {
        type: String,
        enum: ['car_dealership', 'individual_seller', 'vehicle_importer', 'fleet_company', 'rental_company', 'auction_house', 'other'],
        required: function () {
            return this.isComplete;
        }
    },
    licenseNumber: {
        type: String,
        required: function () {
            return this.isComplete;
        }
    },
    vatNumber: {
        type: String
    },
    businessYear: {
        type: String,
        enum: ['less_than_1', '1_plus', '2_plus', '3_plus', '5_plus', '10_plus', '15_plus', '20_plus'],
        required: function () {
            return this.isComplete;
        }
    },
    employees: {
        type: String,
        enum: ['1-10', '11-20', '21-50', '51-100', '101-250', '250_plus',],
        required: function () {
            return this.isComplete;
        }
    },
    website: {
        type: String
    },
    businessDescription: {
        type: String,
    },

    // address info (Step 3)
    country: {
        type: String,
        enum: ['united_arab_emirates'],
        required: function () {
            return this.isComplete;
        }
    },
    emirate: {
        type: String,
        enum: ['abu_dhabi', 'dubai', 'sharjah', 'ajman', 'umm_al_quwain', 'ras_al_khaimah', 'fujairah'],
        required: function () {
            return this.isComplete;
        }
    },
    city: {
        type: String,
        required: function () {
            return this.isComplete;
        }
    },
    area: {
        type: String,
        required: function () {
            return this.isComplete;
        }
    },
    streetAddress: {
        type: String,
        required: function () {
            return this.isComplete;
        }
    },
    building: {
        type: String,
    },
    poBox: {
        type: String,
    },
    zipCode: {
        type: String,
    },

    // bank details (Step 4)
    accountHolderName: {
        type: String,
        required: function () {
            return this.isComplete;
        }
    },
    bankName: {
        type: String,
        required: function () {
            return this.isComplete;
        }
    },
    ibanNumber: {
        type: String,
        required: function () {
            return this.isComplete;
        }
    },
    accountNumber: {
        type: String,
        required: function () {
            return this.isComplete;
        }
    },
    swiftCode: {
        type: String,
        required: function () {
            return this.isComplete;
        }
    },
    currency: {
        type: String,
        enum: ['aed_uae_dirham'],
        required: function () {
            return this.isComplete;
        }
    },

    // doc upload (Step 5) — per-document status, admin can reject individually
    tradeLicense: {
        url: {
            type: String,
            required: function () {
                return this.isComplete;
            }
        },
        status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
        reviewedAt: { type: Date },
        rejectionReason: { type: String }
    },
    emiratesId: {
        url: {
            type: String,
            required: function () {
                return this.isComplete;
            }
        },
        status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
        reviewedAt: { type: Date },
        rejectionReason: { type: String }
    },
    bankStatement: {
        url: {
            type: String,
            required: function () {
                return this.isComplete;
            }
        },
        status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
        reviewedAt: { type: Date },
        rejectionReason: { type: String }
    },
    vatCertificate: {
        url: { type: String }, 
        status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
        reviewedAt: { type: Date },
        rejectionReason: { type: String }
    },

    // email / phone verification (Step 6)
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    isPhoneVerified: {
        type: Boolean,
        default: false
    },

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
    lastLoginAt: { 
        type: Date 
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },

}, { timestamps: true })

export default mongoose.model('Seller', sellerSchema);
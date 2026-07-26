
import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema({
    role: {
        type: String,
        default: 'seller'
    },

    // personal info
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: String,
        required: true,
        unique: true
    },
    dob: {
        type: Date
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other']
    },
    nationality: {
        type: String
    },
    profileImageUrl: {
        type: String
    },

    // acc info
    password: {
        type: String,
        required: true,
        select: false
    },

    // business info
    companyName: {
        type: String,
        required: true
    },
    businessType: {
        type: String,
        enum: ['Sole Establishment', 'LLC (Limited Liability Company)', 'Civil Company', 'Branch of Foreign Company', 'Other']
    },
    sellerType: {
        type: String,
        enum: ['individual', 'dealer', 'business']
    },
    tradeLicense: {
        type: String,
        required: true
    },
    tradeLicenseExpireDate: {
        type: Date,
        required: true
    },
    vatNumber: {
        type: String
    },
    website: {
        type: String
    },
    businessAddress: {
        type: String,
        required: true
    },

    // additional info
    prefferedLanguage: {
        type: String,
        enum: ['English']
    },
    supportMail: {
        type: String,
        required: true
    },
    supportMobile: {
        type: String,
        required: true
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

}, { timestamps: true })

export default mongoose.model('Seller', sellerSchema);
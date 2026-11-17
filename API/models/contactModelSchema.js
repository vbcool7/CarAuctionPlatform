
import mongoose from "mongoose";
import { getNextContactId } from "../utils/counterHelper.js";

export const CONTACT_SUBJECTS = [
    'general_inquiry',
    'account_registration',
    'account_verification',
    'buying',
    'selling',
    'auction',
    'bidding_issue',
    'payment',
    'refund',
    'vehicle_information',
    'document_verification',
    'delivery_and_handover',
    'technical_support',
    'complaint',
    'feedback',
    'other',
];

const contactSchema = new mongoose.Schema(
    {
        contactId: {
            type: String,
            required: true,
            unique: true
        },

        fullName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 120,
        },

        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            maxlength: 254,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
        },

        phone: {
            type: String,
            required: true,
            trim: true,
            maxlength: 30
        },

        subject: {
            type: String,
            required: true,
            enum: CONTACT_SUBJECTS,
        },

        message: {
            type: String,
            required: true,
            trim: true,
            minlength: 10,
            maxlength: 5000,
        },

        privacyAccepted: {
            type: Boolean,
            required: true,
            validate: {
                validator: (value) => value === true,
                message: 'Privacy Policy must be accepted',
            },
        },

        status: {
            type: String,
            enum: ['new', 'read', 'replied', 'closed'],
            default: 'new',
            index: true,
        },

        repliedBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            refPath: 'repliedByType',
            default: null,
        },

        repliedByType: {
            type: String,
            enum: ['admin', 'auctionManager'],
            default: null,
        },

        adminReply: {
            type: String,
            trim: true,
            maxlength: 5000,
            default: '',
        },

        repliedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

contactSchema.pre('validate', async function () {
    if (this.isNew && !this.contactId) {
        this.contactId = await getNextContactId();
    }
});

contactSchema.index({ createdAt: -1 });

export default mongoose.model('Contact', contactSchema);
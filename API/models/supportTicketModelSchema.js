
import mongoose from "mongoose";

export const BUYER_CATEGORIES = [
    "auction",
    "payment",
    "vehicle",
    "account",
    "technical",
    "bidding",
    "order",
    "refund",
    "document",
    "verification",
    "notification",
    "other",
];

export const SELLER_CATEGORIES = [
    "auction",
    "payout",
    "vehicle",
    "account",
    "technical",
    "listing",
    "order",
    "payment",
    "refund",
    "document",
    "verification",
    "notification",
    "other",
];

export const ALL_CATEGORIES = [...new Set([...BUYER_CATEGORIES, ...SELLER_CATEGORIES])];

const supportTicketSchema = new mongoose.Schema(
    {
        supportId: {
            type: String,
            unique: true
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            index: true,
            refPath: "userType",
        },

        userType: {
            type: String,
            enum: ["Buyer", "Seller"],
            required: true,
        },

        subject: {
            type: String,
            required: true,
            trim: true,
            maxlength: 150,
        },

        category: {
            type: String,
            enum: ALL_CATEGORIES,
            required: true,
        },

        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium",
        },

        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: 2000,
        },

        attachment: [
            {
                url: {
                    type: String,
                    required: true,
                },
                publicId: {
                    type: String,
                    default: "",
                },
                fileName: {
                    type: String,
                    required: true,
                },
                fileType: {
                    type: String,
                    required: true,
                },
            },
        ],

        status: {
            type: String,
            enum: ["open", "in_progress", "resolved", "closed"],
            default: "open",
            index: true,
        },
    },
    { timestamps: true }
);

const SupportTicket = mongoose.model("SupportTicket", supportTicketSchema);

export default SupportTicket;
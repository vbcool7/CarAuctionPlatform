
import mongoose from "mongoose";

const supportCallRequestSchema = new mongoose.Schema(
    {
        callRequestId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: "userType",
            index: true,
        },

        userType: {
            type: String,
            enum: ["Buyer", "Seller"],
            required: true,
        },

        fullName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },

        contactNumber: {
            type: String,
            required: true,
            trim: true,
            match: /^(05\d{8}|\+9715\d{8})$/,
        },

        preferredDate: {
            type: String,
            required: true,
        },

        preferredTimeSlot: {
            type: String,
            required: true,
            enum: [
                "9:00 AM to 12:00 PM",
                "1:00 PM to 3:00 PM",
                "4:00 PM to 6:00 PM",
            ],
        },

        topic: {
            type: String,
            required: true,
            trim: true,
            maxlength: 150,
        },

        description: {
            type: String,
            trim: true,
            maxlength: 2000,
            default: "",
        },

        status: {
            type: String,
            enum: ["pending", "contacted", "completed", "cancelled"],
            default: "pending",
            index: true,
        },
    },
    { timestamps: true }
);

const SupportCallRequest = mongoose.model("SupportCallRequest", supportCallRequestSchema);

export default SupportCallRequest;
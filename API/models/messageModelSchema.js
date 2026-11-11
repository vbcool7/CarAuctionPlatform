
import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema(
    {
        url: { type: String, required: true },
        publicId: { type: String, default: null },
        kind: { type: String, enum: ['image', 'pdf'], required: true },
        name: { type: String, default: '' },
        size: { type: Number, default: 0 },
    },
    { _id: false }
);

const messageSchema = new mongoose.Schema(
    {
        conversationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Conversation',
            required: true,
        },

        sender: {
            kind: {
                type: String,
                enum: ['user', 'staff'],
                required: true
            },
            id: {
                type: mongoose.Schema.Types.ObjectId,
                required: true
            },
            role: {
                type: String,
                required: true              // buyer | seller | admin | auctionManager
            },
            displayName: {
                type: String,
                default: ''                 // first name for staff
            },
        },

        text: {
            type: String,
            trim: true,
            maxlength: 1000,
            required: function () { return !this.attachments?.length; },
        },

        attachments: {
            type: [attachmentSchema],
            default: []
        },
    },
    { timestamps: true }
);

messageSchema.index({ conversationId: 1, createdAt: 1 });

export default mongoose.model('Message', messageSchema);
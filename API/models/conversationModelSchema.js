
import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ['support', 'dispute', 'order'],
            default: 'support',
            required: true,
        },

        // owner of support thread (seller or buyer)
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'userType',
            required: function () { return this.type === 'support'; },
        },

        userType: {
            type: String,
            enum: ['Buyer', 'Seller'],
            required: function () { return this.type === 'support'; },
        },

        // dispute / order for chat (null in support)
        refId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null,
        },

        lastMessageAt: {
            type: Date,
            default: Date.now
        },

        lastMessage: {
            text: {
                type: String,
                default: ''
            },
            senderKind: {
                type: String,
                enum: ['user', 'staff', null],
                default: null
            },
        },

        userUnread: {
            type: Number,
            default: 0
        },

        staffUnread: {
            type: Map,
            of: Number,
            default: {}
        },

        // dispute chat: each party have separate unread, key = userId
        partyUnread: {
            type: Map,
            of: Number,
            default: {}
        },
    },
    { timestamps: true }
);

conversationSchema.index(
    { userId: 1, type: 1 },
    { unique: true, partialFilterExpression: { type: 'support' } }
);

// admin list: latest activity on top
conversationSchema.index({ type: 1, lastMessageAt: -1 });

conversationSchema.index(
    { type: 1, refId: 1 },
    { unique: true, partialFilterExpression: { type: 'dispute' } }
);

export default mongoose.model('Conversation', conversationSchema);
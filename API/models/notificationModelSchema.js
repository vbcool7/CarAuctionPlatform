
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
    {
        recipientId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'recipientType',
        },

        recipientType: {
            type: String,
            required: true,
            enum: ['Buyer', 'Seller', 'Admin'],
        },

        type: {
            type: String,
            required: true,
            enum: ['auction_sold', 'auction_unsold', 'reserve_not_met', 'auction_canceled',
                // 'outbid', 'won' — deliberately NOT added yet, blocked on bid-semantics decision
            ],
        },

        vehicleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vehicle',
            required: true,
        },

        title: {
            type: String,
            required: true
        },

        message: {
            type: String,
            required: true
        },

        isRead: {
            type: Boolean,
            default: false
        },
    },
    { timestamps: true }
);

export default mongoose.model('Notification', notificationSchema);
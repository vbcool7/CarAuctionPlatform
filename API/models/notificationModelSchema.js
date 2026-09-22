
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
            enum: [
                'buyer_added', 'buyer_verification_changed', 'buyer_document_reviewed', 'buyer_suspended', 'buyer_reactivated',
                'seller_added', 'seller_verification_changed', 'seller_document_reviewed', 'seller_suspended', 'seller_reactivated',
                'vehicle_added', 'vehicle_reviewed',
                'new_bid_received', 'reserve_price_met',
                'auction_sold', 'auction_unsold', 'reserve_not_met', 'auction_canceled',
                // 'outbid', 'won' — deliberately NOT added yet, blocked on bid-semantics decision
            ],
        },

        vehicleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vehicle',
            required: false,
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

import mongoose from "mongoose";

const bidSchema = new mongoose.Schema(
    {
        vehicleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vehicle',
            required: true
        },

        bidderId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'bidderType'   // [seller or buyer]
        },

        bidderType: {
            type: String,
            required: true,
            enum: ['Buyer', 'Seller']
        },

        bidId: { 
            type: String, 
            unique: true 
        },

        amount: {
            type: Number,
            required: true
        },

        status: {
            type: String,
            enum: ['active', 'outbid', 'won', 'withdrawn', 'cancelled'],    // cancelled by only admin or seller
            default: 'active'
        }
    },
    { timestamps: true }
)

export default mongoose.model('Bid', bidSchema);
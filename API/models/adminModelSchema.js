
import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    profilePhoto: {
        type: String,
        default: ""
    },

    role: {
        type: String,
        enum: ['admin', 'auctionManager'],
        default: "admin"
    },

    permissions: {
        manageAuctions: { type: Boolean, default: false },
        manageBids: { type: Boolean, default: false },
        manageVehicles: { type: Boolean, default: false },
        manageUsers: { type: Boolean, default: false },
        managePayments: { type: Boolean, default: false },
        managePayouts: { type: Boolean, default: false },
        manageReports: { type: Boolean, default: false },
    },
    
    isActive: {
        type: Boolean,
        default: true
    }
},
    { timestamps: true }
)

export default mongoose.model("Admin", adminSchema);
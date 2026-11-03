
import mongoose from "mongoose";
import { getNextDisputeId } from "../utils/counterHelper.js";

export const DISPUTE_STATUSES = ['open', 'under_review', 'resolved', 'rejected', 'closed', 'withdrawn'];
export const OPEN_DISPUTE_STATUSES = ['open', 'under_review'];

const evidenceSchema = new mongoose.Schema(
    {
        _id: false,
        url: { type: String, required: true },
        name: { type: String },
        kind: { type: String, enum: ['image', 'pdf'], default: 'image' },
        publicId: { type: String },
    }
);

const partySchema = new mongoose.Schema(
    {
        _id: false,
        role: { type: String, enum: ['buyer', 'seller'], required: true },
        id: { type: mongoose.Schema.Types.ObjectId, required: true },
        type: { type: String, enum: ['Buyer', 'Seller'], required: true },
        name: { type: String },
    }
);

const personSchema = new mongoose.Schema(
    {
        _id: false,
        id: { type: mongoose.Schema.Types.ObjectId },
        role: { type: String },     // admin | auctionManager
        name: { type: String },
    }
);

const historySchema = new mongoose.Schema(
    {
        _id: false,
        status: { type: String, required: true },
        at: { type: Date, default: Date.now },
        by: { type: String, default: 'system' },   // buyer | seller | admin | auctionManager | system
        byId: { type: mongoose.Schema.Types.ObjectId },
        note: { type: String },
    }
);

const disputeSchema = new mongoose.Schema(
    {
        disputeId: { type: String, required: true, unique: true }, 

        orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
        orderNumber: { type: String },
        vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
        listingId: { type: String },
        vehicleTitle: { type: String },
        vehicleImage: { type: String },
        amount: { type: Number, required: true },
        currency: { type: String, default: 'AED' },

        raisedBy: { type: partySchema, required: true },
        against: { type: partySchema, required: true },

        categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'DisputeCategory', required: true },
        categoryName: { type: String, required: true },

        description: { type: String, required: true, trim: true, maxlength: 2000 },
        evidence: { type: [evidenceSchema], default: [] },

        response: {
            description: { type: String, trim: true, maxlength: 2000 },
            evidence: { type: [evidenceSchema], default: [] },
            at: { type: Date },
        },
 
        status: { type: String, enum: DISPUTE_STATUSES, default: 'open' },

        // true = open / under_review. Neeche ke partial unique index se ek order pe ek hi open dispute
        isOpen: { type: Boolean, default: true },
 
        reviewedBy: { type: personSchema },
        reviewStartedAt: { type: Date },
 
        resolution: {
            outcome: { type: String, enum: ['refund_buyer', 'release_seller'] },   
            note: { type: String },                                                
            by: { type: personSchema },
            at: { type: Date },
        },

        adminNotes: {
            type: [{
                _id: false,
                note: { type: String, required: true, maxlength: 1000 },
                by: { type: personSchema },
                at: { type: Date, default: Date.now },
            }],
            default: [],
        },
 
        history: { type: [historySchema], default: [] },
    },
    { timestamps: true }
);

disputeSchema.index({ orderId: 1 }, { unique: true, partialFilterExpression: { isOpen: true } });
disputeSchema.index({ orderId: 1, 'raisedBy.role': 1 }, { unique: true });
disputeSchema.index({ 'raisedBy.id': 1, createdAt: -1 });
disputeSchema.index({ 'against.id': 1, createdAt: -1 });
disputeSchema.index({ status: 1, createdAt: -1 });
disputeSchema.index({ categoryId: 1 });
 
disputeSchema.pre('validate', async function () {
    if (!this.disputeId) {
        this.disputeId = await getNextDisputeId();
    }
});

export default mongoose.model('Dispute', disputeSchema);
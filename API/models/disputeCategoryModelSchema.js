
import mongoose from "mongoose";
import { getNextDisputeCategoryId } from "../utils/counterHelper.js";

import { DISPUTE_ICON_KEYS, DEFAULT_DISPUTE_ICON } from '../utils/disputeIcons.js';

const disputeCategorySchema = new mongoose.Schema(
    {
        disputeCategoryId: { type: String, required: true, unique: true, },

        name: { type: String, required: true, trim: true, maxlength: 60 },

        nameKey: { type: String, required: true, unique: true },

        description: { type: String, trim: true, maxlength: 300, default: '' },

        icon: { type: String, enum: DISPUTE_ICON_KEYS, default: DEFAULT_DISPUTE_ICON },

        appliesTo: { type: String, enum: ['buyer', 'seller', 'both'], default: 'both' },

        isActive: { type: Boolean, default: true },

        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    },
    { timestamps: true }
);

disputeCategorySchema.index({ isActive: 1, appliesTo: 1 });

disputeCategorySchema.pre('validate', async function () {
    if (!this.disputeCategoryId) {
        this.disputeCategoryId = await getNextDisputeCategoryId();
    }
});

export default mongoose.model('DisputeCategory', disputeCategorySchema);

import mongoose from 'mongoose';
import { getNextReviewId } from '../utils/counterHelper.js';

const reviewSchema = new mongoose.Schema(
    {
        reviewId: {
            type: String,
            unique: true
        },

        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            required: true,
            unique: true,
        },

        vehicleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vehicle',
            required: true
        },

        listingId: {
            type: String
        },

        sellerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Seller',
            required: true
        },

        reviewerId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'reviewerType'
        },

        reviewerType: {
            type: String,
            required: true,
            enum: ['Buyer', 'Seller']
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },

        comment: {
            type: String,
            trim: true,
            maxLength: 500,
            default: ''
        },

        editedAt: {
            type: Date
        },

        reply: {
            text: { type: String, trim: true, maxLength: 500 },
            at: { type: Date },
            editedAt: { type: Date }
        },

        // admin moderation / system hide
        isHidden: {
            type: Boolean,
            default: false
        },

        hiddenReason: {
            type: String,
            enum: ['admin', 'order_canceled']
        },

        hiddenAt: {
            type: Date
        },

        hiddenBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin'
        },

        // show on home page (only admin handle)
        featured: {
            type: Boolean,
            default: false
        },

        featuredAt: {
            type: Date
        },

        featuredBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin'
        },

        // after edited then false
        editedAfterFeatured: {
            type: Boolean,
            default: false
        },

    }, { timestamps: true }
);

reviewSchema.index({ sellerId: 1, isHidden: 1, createdAt: -1 });
reviewSchema.index({ featured: 1, isHidden: 1, featuredAt: -1 });
reviewSchema.index({ reviewerId: 1, createdAt: -1 });

reviewSchema.pre('validate', async function () {
    if (!this.reviewId) {
        this.reviewId = await getNextReviewId();
    }
});

export default mongoose.model('Review', reviewSchema);
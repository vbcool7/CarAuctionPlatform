
import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema(
    {
        faqId: {
            type: String,
            required: true,
            unique: true
        },

        question: {
            type: String,
            required: true,
            trim: true,
            maxlength: 300
        },

        answer: {
            type: String,
            required: true,
            trim: true,
            maxlength: 2000
        },

        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'FaqCategory',
            required: true
        },

        order: {
            type: Number,
            default: 0
        },

        isActive: {
            type: Boolean,
            default: true
        },

        createdBy: {
            id: { type: mongoose.Schema.Types.ObjectId },
            name: String
        },

        updatedBy: {
            id: { type: mongoose.Schema.Types.ObjectId },
            name: String
        },
    },
    { timestamps: true }
);

faqSchema.index({ categoryId: 1, order: 1 });
faqSchema.index({ isActive: 1, order: 1 });

export default mongoose.model('Faq', faqSchema);
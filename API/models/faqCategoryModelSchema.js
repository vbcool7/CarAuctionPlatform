
import mongoose from 'mongoose';
import { FAQ_DEFAULT_ICON, FAQ_ICON_KEYS } from '../utils/faqIcons';

const faqCategorySchema = new mongoose.Schema(
    {
        name: { 
            type: String, 
            required: true, 
            trim: true, 
            maxlength: 60 
        },

        slug: { 
            type: String, 
            required: true, 
            unique: true, 
            trim: true 
        },

        icon: { 
            type: String, 
            enum: FAQ_ICON_KEYS, 
            default: FAQ_DEFAULT_ICON 
        },

        order: { 
            type: Number, 
            default: 0 
        },

        isActive: { 
            type: Boolean, 
            default: true 
        },
    },
    { timestamps: true }
);

faqCategorySchema.index({ isActive: 1, order: 1 });

export default mongoose.model('FaqCategory', faqCategorySchema);
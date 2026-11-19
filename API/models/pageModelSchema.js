
import mongoose from 'mongoose';

const pageSchema = new mongoose.Schema(
    {
        title: { 
            type: String, 
            required: true, 
            trim: true, 
            maxlength: 120 
        },

        slug: { 
            type: String, 
            required: true, 
            unique: true, 
            trim: true, 
            lowercase: true, 
            maxlength: 140 
        },

        // CKEditor HTML, sanitize before saving
        content: { 
            type: String, 
            default: '' 
        },

        status: { 
            type: String, 
            enum: ['draft', 'published'], 
            default: 'draft' 
        },

        publishedAt: { 
            type: Date, 
            default: null 
        },

        lastUpdatedAt: { 
            type: Date, 
            default: Date.now 
        },

        // Step: for (dynamic footer) '' = footer me nahi.
        footerColumn: { 
            type: String, 
            enum: ['', 'support', 'buyers', 'sellers'], 
            default: '' 
        },

        footerOrder: { 
            type: Number, 
            default: 0, 
            min: 0, 
            max: 999 
        },

        updatedBy: { 
            type: mongoose.Schema.Types.ObjectId, 
            default: null 
        },
    },
    { timestamps: true }
);

pageSchema.index({ status: 1, footerColumn: 1, footerOrder: 1 });

export default mongoose.model("Page", pageSchema);
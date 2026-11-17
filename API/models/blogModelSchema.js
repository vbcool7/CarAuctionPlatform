
import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
    {
        blogId: {
            type: String,
            unique: true
        },

        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 150
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        excerpt: {
            type: String,
            trim: true,
            maxlength: 300,
            default: ''
        },

        coverImage: {
            url: { type: String, default: null },
            publicId: { type: String, default: null },
        },

        content: { 
            type: String, 
            default: '' 
        },    
                           
        readingTime: {       // minutes, auto by content
            type: Number, 
            default: 1 
        },                    

        category: { 
            type: String, 
            trim: true, 
            default: '' 
        },
                  
        categorySlug: { 
            type: String, 
            default: '', 
            index: true 
        },    

        tags: { type: [String], default: [] },

        status: { 
            type: String, 
            enum: ['draft', 'published'], 
            default: 'draft' 
        },

        publishedAt: { 
            type: Date, 
            default: null 
        },                   

        author: {
            id: { type: mongoose.Schema.Types.ObjectId, default: null },
            name: { type: String, default: 'Admin' },
        },
        
        updatedBy: {
            id: { type: mongoose.Schema.Types.ObjectId, default: null },
            name: { type: String, default: null },
        },
    },
    { timestamps: true }
);

blogSchema.index({ status: 1, publishedAt: -1 });

export default mongoose.model('Blog', blogSchema);

import mongoose from 'mongoose';

const siteSettingSchema = new mongoose.Schema(
    {
        key: { 
            type: String, 
            default: 'site', 
            unique: true, 
            immutable: true 
        },

        tagline: { 
            type: String, 
            trim: true, 
            maxlength: 200, 
            default: "The Middle East's most trusted online car auction platform." 
        },

        phone: { 
            type: String, 
            trim: true, 
            maxlength: 30, 
            default: '+97141234567' 
        },

        email: { 
            type: String, 
            trim: true, 
            lowercase: true, 
            maxlength: 120, 
            default: 'support@biddrive.ae' 
        },

        address: { 
            type: String, 
            trim: true, 
            maxlength: 300, 
            default: 'Business Bay, Dubai, United Arab Emirates' 
        },

        supportHours: { 
            type: String, 
            trim: true, 
            maxlength: 100, 
            default: 'Mon - Fri, 9:00 AM - 6:00 PM (Dubai time)' 
        },

        social: {
            facebook: { type: String, trim: true, maxlength: 300, default: '' },
            instagram: { type: String, trim: true, maxlength: 300, default: '' },
            twitter: { type: String, trim: true, maxlength: 300, default: '' },
            youtube: { type: String, trim: true, maxlength: 300, default: '' },
        },

        updatedBy: { 
            type: mongoose.Schema.Types.ObjectId, 
            default: null 
        },
    },
    { timestamps: true }
);

export default mongoose.model("SiteSetting", siteSettingSchema);
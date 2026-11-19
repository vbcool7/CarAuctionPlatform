
import SiteSetting from '../models/siteSettingModelSchema.js';

const SOCIAL_KEYS = ['facebook', 'instagram', 'twitter', 'youtube'];

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const str = (v) => (typeof v === 'string' ? v.trim() : '');

// +, spaces, -, ( ) allowed; digits 7-15
const isValidPhone = (v) => {
    if (!/^\+?[\d\s\-()]+$/.test(v)) return false;
    const digits = v.replace(/\D/g, '');
    return digits.length >= 7 && digits.length <= 15;
};

const isHttpUrl = (v) => {
    try {
        const u = new URL(v);
        return u.protocol === 'http:' || u.protocol === 'https:';
    } catch (err) {
        return false;
    }
};

const getOrCreate = () =>
    SiteSetting.findOneAndUpdate(
        { key: 'site' },
        { $setOnInsert: { key: 'site' } },
        { returnDocument: 'after', upsert: true }
    );

// publicity fields
const toPublic = (s) => ({
    tagline: s.tagline,
    phone: s.phone,
    email: s.email,
    address: s.address,
    supportHours: s.supportHours,
    social: {
        facebook: s.social?.facebook || '',
        instagram: s.social?.instagram || '',
        twitter: s.social?.twitter || '',
        youtube: s.social?.youtube || '',
    },
});

// =================================================== PUBLIC

// get public setting
export const getPublicSettings = async (req, res) => {
    try {
        const s = await getOrCreate();
        res.set('Cache-Control', 'public, max-age=60');

        return res.status(200).json({ 
            success: true, 
            settings: toPublic(s) 
        });
    } catch (err) {
        console.error('getPublicSettings error:', err);
        return res.status(500).json({ 
            success: false, 
            message: 'Server Error Occured' 
        });
    }
};

// =================================================== ADMIN

// get settings
export const getAdminSettings = async (req, res) => {
    try {
        const s = await getOrCreate();

        return res.status(200).json({
            success: true,
            settings: { ...toPublic(s), updatedAt: s.updatedAt },
        });

    } catch (err) {
        console.error('getAdminSettings error:', err);
        return res.status(500).json({ 
            success: false, 
            message: 'Server Error Occured' 
        });
    }
};

// update setting
export const updateSettings = async (req, res) => {
    try {
        const body = req.body || {};
        const errors = {};
        const set = {};

        if (body.tagline !== undefined) {
            const v = str(body.tagline);
            if (v.length > 200) errors.tagline = 'Tagline max 200 characters';
            else set.tagline = v;
        }

        if (body.phone !== undefined) {
            const v = str(body.phone);
            if (!v) errors.phone = 'Phone is required';
            else if (!isValidPhone(v)) errors.phone = 'Enter a valid phone number (7-15 digits, + allowed)';
            else set.phone = v;
        }

        if (body.email !== undefined) {
            const v = str(body.email).toLowerCase();
            if (!v) errors.email = 'Email is required';
            else if (!EMAIL_RX.test(v)) errors.email = 'Enter a valid email';
            else set.email = v;
        }

        if (body.address !== undefined) {
            const v = str(body.address);
            if (!v) errors.address = 'Address is required';
            else if (v.length > 300) errors.address = 'Address max 300 characters';
            else set.address = v;
        }

        if (body.supportHours !== undefined) {
            const v = str(body.supportHours);
            if (v.length > 100) errors.supportHours = 'Support hours max 100 characters';
            else set.supportHours = v;
        }

        if (body.social && typeof body.social === 'object') {
            for (const k of SOCIAL_KEYS) {
                if (body.social[k] === undefined) continue;
                const v = str(body.social[k]);
                if (v && (!isHttpUrl(v) || v.length > 300)) errors[`social.${k}`] = 'Enter a valid http/https link';
                else set[`social.${k}`] = v;   
            }
        }

        if (Object.keys(errors).length) {
            return res.status(400).json({ success: false, message: 'Please fix the highlighted fields', errors });
        }

        await getOrCreate();
        const s = await SiteSetting.findOneAndUpdate(
            { key: 'site' },
            { $set: { ...set, updatedBy: req.user?.id || null } },
            { returnDocument: 'after' }
        );

        return res.status(200).json({
            success: true,
            message: 'Settings updated',
            settings: { ...toPublic(s), updatedAt: s.updatedAt },
        });
        
    } catch (err) {
        console.error('updateSettings error:', err);
        return res.status(500).json({ 
            success: false, 
            message: 'Server Error Occured' 
        });
    }
};
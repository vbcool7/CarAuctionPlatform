
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        let folderName = 'CarAuction/Others';

        if (req.baseUrl.includes('buyer')) {
            folderName = 'CarAuction/Buyer';
        } else if (req.baseUrl.includes('seller')) {
            folderName = 'CarAuction/Seller';
        } else if (req.baseUrl.includes('admin')) {
            folderName = 'CarAuction/Admin';
        } else if (req.baseUrl.includes('vehicle')) {
            folderName = 'CarAuction/Vehicle';
        }

        const isPdf = file.mimetype === 'application/pdf';

        return {
            folder: folderName,
            allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'pdf'],
            resource_type: isPdf ? 'raw' : 'image',
            public_id: `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1E9)}`,
            transformation: isPdf ? undefined : [
                { quality: 'auto:good' },
                { fetch_format: 'auto' },
                { width: 1080, height: 1080, crop: 'limit' }
            ]
        };
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024,   // 10MB doc upload
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPG, PNG, WEBP, and PDF are allowed.'), false);
        }
    },
});

export { upload };
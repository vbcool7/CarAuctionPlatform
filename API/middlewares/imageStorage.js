
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

const upload = multer({ storage: storage });

export { upload };
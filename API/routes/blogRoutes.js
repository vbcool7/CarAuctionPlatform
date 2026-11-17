
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { uploadImage } from '../middlewares/imageStorage.js';
import {
    getAllBlogs, getBlogById, createBlog, updateBlog, deleteBlog, uploadBlogContentImage,
    getPublicBlogs, getPublicBlogBySlug, 
} from '../controllers/blogController.js';

const router = express.Router();

const imageUpload = (field) => (req, res, next) => {
    uploadImage.single(field)(req, res, (err) => {
        if (!err) return next();
        const message = err.code === 'LIMIT_FILE_SIZE'
            ? 'Image must be 2MB or smaller'
            : err.code === 'LIMIT_UNEXPECTED_FILE'
                ? 'Unexpected file field'
                : err.message || 'Invalid file upload';
        return res.status(400).json({ success: false, message });
    });
};

// =================================================== ADMIN

router.get('/blogs', authMiddleware(['admin']), getAllBlogs);
router.get('/blog/:id', authMiddleware(['admin']), getBlogById);
router.post('/create-blog', authMiddleware(['admin']), imageUpload('coverImage'), createBlog);
router.patch('/update-blog/:id', authMiddleware(['admin']), imageUpload('coverImage'), updateBlog);
router.delete('/delete/:id', authMiddleware(['admin']), deleteBlog);
router.post('/upload-image', authMiddleware(['admin']), imageUpload('image'), uploadBlogContentImage);

// =================================================== PUBLIC

router.get('/public/blogs', getPublicBlogs);
router.get('/public/blog/:slug', getPublicBlogBySlug);

export default router;
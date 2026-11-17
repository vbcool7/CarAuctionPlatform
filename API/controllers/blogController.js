
import Blog from '../models/blogModelSchema.js';

import { getNextBlogId } from '../utils/counterHelper.js';
import { cleanupUploadedFiles, deleteOldFileFromCloudinary } from '../utils/cloudinaryUtils.js';
import {
    makeUniqueSlug, sanitizeContent, calcReadingTime, parseTags, categorySlugOf, escRx, CONTENT_MAX, hasUnuploadedImages,
    extractBlogImageUrls, parseImageList,
} from '../utils/blogHelper.js';

const fail = (res, message, status = 400) => res.status(status).json({ success: false, message });

const actorOf = (req) => ({
    id: req.user?._id || req.user?.id || null,
    name: req.user?.fullName || req.user?.name || 'Admin',
});

const shape = (b) => ({
    _id: b._id,
    blogId: b.blogId,
    title: b.title,
    slug: b.slug,
    excerpt: b.excerpt,
    coverImage: b.coverImage?.url || null,
    content: b.content,
    readingTime: b.readingTime,
    category: b.category,
    tags: b.tags,
    status: b.status,
    publishedAt: b.publishedAt,
    author: b.author?.name || 'Admin',
    updatedBy: b.updatedBy?.name || null,
    createdAt: b.createdAt,
    updatedAt: b.updatedAt,
});

const listShape = (b) => {
    const { content, ...rest } = shape(b);
    return rest;
};

const removeImageSafe = async (url) => {
    if (!url) return;
    try { await deleteOldFileFromCloudinary(url); }
    catch (err) { console.log('blog image delete error :', err); }
};

// jo images content se hat gayi, unhe Cloudinary se hatao (kisi aur blog me use ho rahi ho to nahi)
const deleteUnusedContentImages = async (urls, excludeId = null) => {
    for (const url of urls) {
        try {
            const usedElsewhere = await Blog.exists({
                ...(excludeId ? { _id: { $ne: excludeId } } : {}),
                content: { $regex: escRx(url) },
            });
            if (!usedElsewhere) await deleteOldFileFromCloudinary(url);
        } catch (err) {
            console.log('content image cleanup error :', err);
        }
    }
};

// =================================================== ADMIN

// blog list
export const getAllBlogs = async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(parseInt(req.query.limit) || 10, 50);

        const { status, category, sortBy } = req.query;
        const search = String(req.query.search || '').trim();

        const match = {};
        if (status === 'draft' || status === 'published') match.status = status;
        if (category && category !== 'all') match.categorySlug = String(category);

        if (search) {
            const rx = new RegExp(escRx(search), 'i');
            match.$or = [{ title: rx }, { blogId: rx }, { tags: rx }];
        }

        const sort = sortBy === 'oldest' ? { createdAt: 1 }
            : sortBy === 'az' ? { title: 1 }
                : { createdAt: -1 };

        const [rows, total, all, published, categories] = await Promise.all([
            Blog.find(match).select('-content').sort(sort).skip((page - 1) * limit).limit(limit).lean(),
            Blog.countDocuments(match),
            Blog.countDocuments({}),
            Blog.countDocuments({ status: 'published' }),
            Blog.aggregate([
                { $match: { categorySlug: { $ne: '' } } },
                { $group: { _id: '$categorySlug', label: { $first: '$category' } } },
                { $sort: { label: 1 } },
            ]),
        ]);

        return res.status(200).json({
            success: true,
            message: "Blog list fetched successfully",
            blogs: rows.map(listShape),
            stats: { total: all, published, drafts: all - published },
            // filter dropdown + for form suggestions (those categories already used)
            categories: categories.map((c) => ({ value: c._id, label: c.label })),
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });

    } catch (err) {
        console.log("getAllBlogs error :", err);
        return fail(res, 'Server Error Occured', 500);
    }
};

// blog by id
export const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).lean();
        if (!blog) return fail(res, 'Blog not found', 404);
        return res.status(200).json({
            success: true,
            blog: shape(blog)
        });
    } catch (err) {
        console.log("getBlogById error :", err);
        return fail(res, 'Server Error Occured', 500);
    }
};

// create blog
export const createBlog = async (req, res) => {
    let saved = false;
    try {
        const title = String(req.body.title || '').trim();
        const status = req.body.status === 'published' ? 'published' : 'draft';
        const category = String(req.body.category || '').trim().slice(0, 40);
        const rawContent = String(req.body.content || '');

        if (!title) return fail(res, 'Title is required');
        if (title.length > 150) return fail(res, 'Title must be 150 characters or less');
        if (rawContent.length > CONTENT_MAX) return fail(res, 'Content is too long');

        if (hasUnuploadedImages(rawContent)) {
            return fail(res, 'An image is still uploading. Please wait a moment and try again.');
        }

        const content = sanitizeContent(rawContent);

        if (status === 'published') {
            if (!category) return fail(res, 'Category is required to publish');
            if (!req.file) return fail(res, 'Cover image is required to publish');
            if (!calcReadingTime(content) || !content.replace(/<[^>]*>/g, '').trim()) {
                return fail(res, 'Content is required to publish');
            }
        }

        const actor = actorOf(req);

        const blog = await Blog.create({
            blogId: await getNextBlogId(),
            title,
            slug: await makeUniqueSlug(title),
            excerpt: String(req.body.excerpt || '').trim().slice(0, 300),
            coverImage: req.file ? { url: req.file.path, publicId: req.file.filename } : { url: null, publicId: null },
            content,
            readingTime: calcReadingTime(content),
            category,
            categorySlug: categorySlugOf(category),
            tags: parseTags(req.body.tags),
            status,
            publishedAt: status === 'published' ? new Date() : null,
            author: actor,
            updatedBy: actor,
        });
        saved = true;

        const keepCreate = new Set(extractBlogImageUrls(content));
        await deleteUnusedContentImages(parseImageList(req.body.uploadedImages).filter((u) => !keepCreate.has(u)), blog._id);

        return res.status(201).json({
            success: true,
            message: 'Blog created',
            blog: shape(blog.toObject())
        });
    } catch (err) {
        console.log('createBlog error :', err);
        return fail(res, 'Server Error Occured', 500);
    } finally {
        if (!saved && req.file) await cleanupUploadedFiles(req.file);
    }
};

// update blog
export const updateBlog = async (req, res) => {
    let saved = false;
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return fail(res, 'Blog not found', 404);

        const body = req.body;
        const oldImageUrl = blog.coverImage?.url || null;
        const oldContentImages = extractBlogImageUrls(blog.content);

        if (body.title !== undefined) {
            const title = String(body.title).trim();
            if (!title) return fail(res, 'Title cannot be empty');
            if (title.length > 150) return fail(res, 'Title must be 150 characters or less');
            if (title !== blog.title && !blog.publishedAt) {
                blog.slug = await makeUniqueSlug(title, blog._id);
            }
            blog.title = title;
        }

        if (body.excerpt !== undefined) blog.excerpt = String(body.excerpt).trim().slice(0, 300);

        if (body.category !== undefined) {
            blog.category = String(body.category).trim().slice(0, 40);
            blog.categorySlug = categorySlugOf(blog.category);
        }

        if (body.tags !== undefined) blog.tags = parseTags(body.tags);

        if (body.content !== undefined) {
            if (String(body.content).length > CONTENT_MAX) return fail(res, 'Content is too long');
            if (hasUnuploadedImages(body.content)) {
                return fail(res, 'An image is still uploading. Please wait a moment and try again.');
            }
            blog.content = sanitizeContent(body.content);
            blog.readingTime = calcReadingTime(blog.content);
        }

        // "removeCover=true" bhejo to cover hat jayegi (sirf draft me, publish ke liye cover chahiye)
        const removeCover = body.removeCover === 'true' || body.removeCover === true;
        if (req.file) {
            blog.coverImage = { url: req.file.path, publicId: req.file.filename };
        } else if (removeCover) {
            blog.coverImage = { url: null, publicId: null };
        }

        if (body.status === 'published' || body.status === 'draft') {
            blog.status = body.status;
        }

        if (blog.status === 'published') {
            if (!blog.category) return fail(res, 'Category is required to publish');
            if (!blog.coverImage?.url) return fail(res, 'Cover image is required to publish');
            if (!blog.content.replace(/<[^>]*>/g, '').trim() && !/<img/i.test(blog.content)) {
                return fail(res, 'Content is required to publish');
            }
            if (!blog.publishedAt) blog.publishedAt = new Date();
        }

        blog.updatedBy = actorOf(req);
        await blog.save();
        saved = true;

        if (oldImageUrl && oldImageUrl !== blog.coverImage?.url) await removeImageSafe(oldImageUrl);

        const keepUpdate = new Set(extractBlogImageUrls(blog.content));
        const candidates = [...new Set([...oldContentImages, ...parseImageList(body.uploadedImages)])];
        await deleteUnusedContentImages(candidates.filter((u) => !keepUpdate.has(u)), blog._id);

        return res.status(200).json({
            success: true,
            message: 'Blog updated',
            blog: shape(blog.toObject())
        });

    } catch (err) {
        console.log('updateBlog error :', err);
        return fail(res, 'Server Error Occured', 500);
    } finally {
        if (!saved && req.file) await cleanupUploadedFiles(req.file);
    }
};

// delete only drafted blog
export const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return fail(res, 'Blog not found', 404);
        if (blog.status === 'published') {
            return fail(res, 'Unpublish this blog before deleting it', 409);
        }

        const cover = blog.coverImage?.url;
        const contentImages = extractBlogImageUrls(blog.content);

        await blog.deleteOne();
        await removeImageSafe(cover);
        await deleteUnusedContentImages(contentImages);

        return res.status(200).json({
            success: true,
            message: 'Blog deleted'
        });
    } catch (err) {
        console.log('deleteBlog error :', err);
        return fail(res, 'Server Error Occured', 500);
    }
};

// ---------------------------------------------------------------- EDITOR IMAGE (CKEditor ke andar ki image)
export const uploadBlogContentImage = async (req, res) => {
    try {
        if (!req.file) return fail(res, 'Image is required');
        return res.status(201).json({
            success: true,
            url: req.file.path
        });
    } catch (err) {
        console.log('uploadBlogContentImage error :', err);
        return fail(res, 'Server Error Occured', 500);
    }
};

// =================================================== PUBLIC

const cardShape = (b) => ({
    blogId: b.blogId,
    title: b.title,
    slug: b.slug,
    excerpt: b.excerpt,
    coverImage: b.coverImage?.url || null,
    readingTime: b.readingTime,
    category: b.category,
    categorySlug: b.categorySlug,
    tags: b.tags,
    publishedAt: b.publishedAt,
    author: b.author?.name || 'Admin',
});

// get blogs
export const getPublicBlogs = async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit) || 9, 1), 24);
        const category = String(req.query.category || '').trim();
        const search = String(req.query.search || '').trim();

        const match = { status: 'published' };
        if (category && category !== 'all') match.categorySlug = category;
        if (search) {
            const rx = new RegExp(escRx(search), 'i');
            match.$or = [{ title: rx }, { excerpt: rx }, { tags: rx }];
        }

        const [rows, total, categories] = await Promise.all([
            Blog.find(match).select('-content').sort({ publishedAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
            Blog.countDocuments(match),
            Blog.aggregate([
                { $match: { status: 'published', categorySlug: { $ne: '' } } },
                { $group: { _id: '$categorySlug', label: { $first: '$category' }, count: { $sum: 1 } } },
                { $sort: { label: 1 } },
            ]),
        ]);

        res.set('Cache-Control', 'public, max-age=60');
        return res.status(200).json({
            success: true,
            blogs: rows.map(cardShape),
            categories: categories.map((c) => ({ value: c._id, label: c.label, count: c.count })),
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (err) {
        console.log('getPublicBlogs error :', err);
        return fail(res, 'Server Error Occured', 500);
    }
};

// blog by id
export const getPublicBlogBySlug = async (req, res) => {
    try {
        const slug = String(req.params.slug || '').toLowerCase().trim();
        const blog = await Blog.findOne({ slug, status: 'published' }).lean();
        if (!blog) return fail(res, 'Blog not found', 404);

        const related = blog.categorySlug
            ? await Blog.find({ status: 'published', categorySlug: blog.categorySlug, _id: { $ne: blog._id } })
                .select('-content').sort({ publishedAt: -1 }).limit(3).lean()
            : [];

        res.set('Cache-Control', 'public, max-age=60');
        return res.status(200).json({
            success: true,
            blog: { ...cardShape(blog), content: blog.content },
            related: related.map(cardShape),
        });
    } catch (err) {
        console.log('getPublicBlogBySlug error :', err);
        return fail(res, 'Server Error Occured', 500);
    }
};
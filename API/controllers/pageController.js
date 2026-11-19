
import mongoose from 'mongoose';
import Page from '../models/pageModelSchema.js';
import { slugify, sanitizeContent, stripHtml, escRx, CONTENT_MAX } from '../utils/blogHelper.js';

const FOOTER_COLUMNS = ['', 'support', 'buyers', 'sellers'];
const STATUSES = ['draft', 'published'];
const MAX_CONTENT = CONTENT_MAX || 100000;

const str = (v) => (typeof v === 'string' ? v.trim() : '');

const hasContent = (html) => /<img\s/i.test(html || '') || stripHtml(html || '').trim().length > 0;

const uniqueSlug = async (title, excludeId) => {
    const base = (slugify(title) || 'page').slice(0, 100);
    let slug = base;
    let n = 2;
    while (await Page.exists({ slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) })) {
        slug = `${base}-${n++}`;
    }
    return slug;
};

const parseBody = (body, isCreate) => {
    const errors = {};
    const out = {};

    if (isCreate || body.title !== undefined) {
        const v = str(body.title);
        if (!v) errors.title = 'Title is required';
        else if (v.length > 120) errors.title = 'Title max 120 characters';
        else out.title = v;
    }

    if (body.content !== undefined) {
        const raw = typeof body.content === 'string' ? body.content : '';
        if (raw.length > MAX_CONTENT) errors.content = 'Content is too long';
        else out.content = sanitizeContent(raw);
    }

    if (body.status !== undefined) {
        if (!STATUSES.includes(body.status)) errors.status = 'Invalid status';
        else out.status = body.status;
    }

    if (body.footerColumn !== undefined) {
        if (!FOOTER_COLUMNS.includes(body.footerColumn)) errors.footerColumn = 'Invalid footer column';
        else out.footerColumn = body.footerColumn;
    }

    if (body.footerOrder !== undefined) {
        const n = Number(body.footerOrder);
        if (!Number.isInteger(n) || n < 0 || n > 999) errors.footerOrder = 'Order must be a whole number from 0 to 999';
        else out.footerOrder = n;
    }

    return { out, errors };
};

const fail = (res, errors) =>
    res.status(400).json({ success: false, message: 'Please fix the highlighted fields', errors });

const toListItem = (p) => ({
    _id: p._id,
    title: p.title,
    slug: p.slug,
    status: p.status,
    footerColumn: p.footerColumn,
    footerOrder: p.footerOrder,
    publishedAt: p.publishedAt || null,
    lastUpdatedAt: p.lastUpdatedAt,
    updatedAt: p.updatedAt,
});

// =================================================== ADMIN

// get all pages
export const getAllPages = async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(parseInt(req.query.limit) || 10, 50);
        const { status } = req.query;
        const search = str(req.query.search);

        const match = {};
        if (STATUSES.includes(status)) match.status = status;
        if (search) match.title = new RegExp(escRx(search), 'i');

        const [rows, total, published, draft] = await Promise.all([
            Page.find(match).sort({ updatedAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
            Page.countDocuments(match),
            Page.countDocuments({ status: 'published' }),
            Page.countDocuments({ status: 'draft' }),
        ]);

        return res.status(200).json({
            success: true,
            pages: rows.map(toListItem),
            stats: { total: published + draft, published, draft },
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });

    } catch (err) {
        console.error('getAllPages error:', err);
        return res.status(500).json({
            success: false,
            message: 'Server Error Occured'
        });
    }
};

// get page by id
export const getPageById = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ success: false, message: 'Invalid page id' });
        }
        const p = await Page.findById(req.params.id).lean();
        if (!p) return res.status(404).json({ success: false, message: 'Page not found' });

        return res.status(200).json({
            success: true,
            page: { ...toListItem(p), content: p.content }
        });

    } catch (err) {
        console.error('getPageById error:', err);
        return res.status(500).json({
            success: false,
            message: 'Server Error Occured'
        });
    }
};

// create page
export const createPage = async (req, res) => {
    try {
        const { out, errors } = parseBody(req.body || {}, true);

        const status = out.status || 'draft';
        if (status === 'published' && !hasContent(out.content)) errors.content = 'Content is required to publish';
        if (Object.keys(errors).length) return fail(res, errors);

        const now = new Date();
        const created = await Page.create({
            title: out.title,
            slug: await uniqueSlug(out.title),
            content: out.content || '',
            status,
            publishedAt: status === 'published' ? now : null,
            lastUpdatedAt: now,
            footerColumn: out.footerColumn || '',
            footerOrder: out.footerOrder ?? 0,
            updatedBy: req.user?.id || null,
        });

        return res.status(201).json({
            success: true,
            message: 'Page created',
            page: toListItem(created)
        });

    } catch (err) {
        if (err?.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'A page with this title already exists. Please try again.'
            });
        }
        console.error('createPage error:', err);
        return res.status(500).json({
            success: false,
            message: 'Server Error Occured'
        });
    }
};

// update page
export const updatePage = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid page id'
            });
        }

        const p = await Page.findById(req.params.id);
        if (!p) return res.status(404).json({
            success: false,
            message: 'Page not found'
        });

        const { out, errors } = parseBody(req.body || {}, false);

        const nextContent = out.content !== undefined ? out.content : p.content;
        const nextStatus = out.status || p.status;

        if (nextStatus === 'published' && !hasContent(nextContent)) errors.content = 'Content is required to publish';
        if (Object.keys(errors).length) return fail(res, errors);

        const titleChanged = out.title !== undefined && out.title !== p.title;
        const contentChanged = out.content !== undefined && out.content !== p.content;

        // slug sirf tab badalta hai jab page kabhi publish nahi hua
        if (titleChanged && !p.publishedAt) p.slug = await uniqueSlug(out.title, p._id);
        if (out.title !== undefined) p.title = out.title;
        if (out.content !== undefined) p.content = out.content;
        if (out.footerColumn !== undefined) p.footerColumn = out.footerColumn;
        if (out.footerOrder !== undefined) p.footerOrder = out.footerOrder;

        if (titleChanged || contentChanged) p.lastUpdatedAt = new Date();

        p.status = nextStatus;
        if (nextStatus === 'published' && !p.publishedAt) p.publishedAt = new Date();

        p.updatedBy = req.user?.id || null;
        await p.save();

        return res.status(200).json({
            success: true,
            message: 'Page updated',
            page: { ...toListItem(p), content: p.content }
        });

    } catch (err) {
        if (err?.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'A page with this title already exists. Please try again.'
            });
        }
        console.error('updatePage error:', err);
        return res.status(500).json({
            success: false,
            message: 'Server Error Occured'
        });
    }
};

// delete page
export const deletePage = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid page id'
            });
        }

        const p = await Page.findById(req.params.id);
        if (!p) return res.status(404).json({
            success: false,
            message: 'Page not found'
        });

        if (p.status === 'published') {
            return res.status(409).json({
                success: false,
                message: 'Unpublish this page before deleting it'
            });
        }

        await p.deleteOne();
        return res.status(200).json({
            success: true,
            message: 'Page deleted'
        });

    } catch (err) {
        console.error('deletePage error:', err);
        return res.status(500).json({
            success: false,
            message: 'Server Error Occured'
        });
    }
};

// =================================================== PUBLIC

// get pages
export const getPublicPageBySlug = async (req, res) => {
    try {
        const slug = str(req.params.slug).toLowerCase();
        const p = await Page.findOne({ slug, status: 'published' })
            .select('title slug content lastUpdatedAt')
            .lean();

        if (!p) return res.status(404).json({
            success: false,
            message: 'Page not found'
        });

        res.set('Cache-Control', 'public, max-age=60');

        return res.status(200).json({
            success: true,
            page: { title: p.title, slug: p.slug, content: p.content, lastUpdatedAt: p.lastUpdatedAt },
        });

    } catch (err) {
        console.error('getPublicPageBySlug error:', err);
        return res.status(500).json({
            success: false,
            message: 'Server Error Occured'
        });
    }
};

import sanitizeHtml from 'sanitize-html';
import Blog from '../models/blogModelSchema.js';

export const CONTENT_MAX = 200000; // chars

export const slugify = (text = '') =>
    String(text)
        .toLowerCase()
        .trim()
        .replace(/&/g, ' and ')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 80);

// unique slug: car-guide, car-guide-2, car-guide-3 ...
export const makeUniqueSlug = async (title, excludeId = null) => {
    const base = slugify(title) || 'post';
    let slug = base;
    let i = 2;
    while (await Blog.exists({ slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) })) {
        slug = `${base}-${i++}`;
    }
    return slug;
};

// CKEditor HTML -> safe HTML (script, onerror, iframe, javascript: all remove)
export const sanitizeContent = (html = '') => {
    const cleaned = sanitizeHtml(String(html), {
        allowedTags: [
            'p', 'br', 'h1', 'h2', 'h3', 'h4', 'strong', 'b', 'em', 'i', 's',
            'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'figure', 'figcaption',
        ],
        allowedAttributes: {
            a: ['href', 'target', 'rel'],
            img: ['src', 'alt', 'width', 'height'],
            '*': ['style', 'class'],
        },
        allowedSchemes: ['http', 'https', 'mailto', 'tel'],
        allowedSchemesByTag: { img: ['http', 'https'] },
        allowedStyles: {
            '*': { 'text-align': [/^(left|right|center|justify)$/] },
        },
        transformTags: {
            a: (tagName, attribs) => ({
                tagName,
                attribs: { ...attribs, rel: 'noopener noreferrer nofollow', target: '_blank' },
            }),
        },
    });

    // bina src wali khali image hata do
    return cleaned
        .replace(/<figure[^>]*>\s*<img\s*\/?>\s*<\/figure>/gi, '')
        .replace(/<img\s*\/?>/gi, '');
};

// editor ne abhi tak upload na hui image (data:/blob:) bheji hai
export const hasUnuploadedImages = (html = '') =>
    /<img[^>]+src=["'](?:data:|blob:)/i.test(String(html));

export const stripHtml = (html = '') =>
    sanitizeHtml(String(html), { allowedTags: [], allowedAttributes: {} })
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

export const calcReadingTime = (html = '') => {
    const words = stripHtml(html).split(' ').filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
};

// tags: "a, b" ya '["a","b"]' ya array -> clean array (max 8, each tag max 30 char)
export const parseTags = (raw) => {
    let list = [];
    if (Array.isArray(raw)) list = raw;
    else if (typeof raw === 'string' && raw.trim()) {
        const s = raw.trim();
        if (s.startsWith('[')) {
            try { list = JSON.parse(s); } catch (e) { list = s.split(','); }
        } else list = s.split(',');
    }
    const seen = new Set();
    const out = [];
    for (const t of list) {
        const tag = String(t).trim().slice(0, 30);
        const key = tag.toLowerCase();
        if (tag && !seen.has(key)) { seen.add(key); out.push(tag); }
    }
    return out.slice(0, 8);
};

export const categorySlugOf = (category = '') => slugify(category);

export const escRx = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const isBlogImageUrl = (u) =>
    typeof u === 'string' && u.includes('res.cloudinary.com') && u.includes('/CarAuction/Blog/');

// content ke andar ki apni Cloudinary images ke URL
export const extractBlogImageUrls = (html = '') => {
    const urls = [];
    const rx = /<img[^>]+src="([^"]+)"/gi;
    let m;
    while ((m = rx.exec(String(html))) !== null) {
        if (isBlogImageUrl(m[1])) urls.push(m[1]);
    }
    return [...new Set(urls)];
};

// frontend se aayi "is session me upload hui images" ki list (sirf apne folder ke URL maane jaayenge)
export const parseImageList = (raw) => {
    let list = [];
    try { list = Array.isArray(raw) ? raw : JSON.parse(raw || '[]'); } catch (err) { list = []; }
    return [...new Set(list.filter(isBlogImageUrl))].slice(0, 100);
};
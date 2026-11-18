
import mongoose from 'mongoose';
import Faq from '../models/faqModelSchema.js';
import FaqCategory from '../models/faqCategoryModelSchema.js';

import { getNextFaqId } from '../utils/counterHelper.js';
import { FAQ_DEFAULT_ICON, FAQ_ICON_KEYS } from '../utils/faqIcons.js';
import { slugify, escRx } from '../utils/blogHelper.js';

const bad = (res, message, code = 400) => res.status(code).json({ success: false, message });
const clean = (v) => (typeof v === 'string' ? v.trim() : '');
const isId = (v) => mongoose.isValidObjectId(v);

const actorOf = (req) => ({
    id: req.user?.id || req.user?._id || null,
    name: req.user?.fullName || req.user?.name || 'Admin',
});

// scope ke andar item ko up / down karo. Order ko hamesha 0..n-1 normalize karta hai (ties nahi rehti).
const moveInScope = async (Model, filter, id, direction) => {
    const items = await Model.find(filter).sort({ order: 1, _id: 1 }).select('_id').lean();
    const i = items.findIndex((x) => String(x._id) === String(id));
    if (i < 0) return false;

    const j = direction === 'up' ? i - 1 : i + 1;
    if (j >= 0 && j < items.length) [items[i], items[j]] = [items[j], items[i]];

    await Model.bulkWrite(
        items.map((x, idx) => ({ updateOne: { filter: { _id: x._id }, update: { $set: { order: idx } } } }))
    );
    return true;
};

const nextOrder = async (Model, filter) => {
    const last = await Model.findOne(filter).sort({ order: -1 }).select('order').lean();
    return last ? last.order + 1 : 0;
};

// =================================================== ADMIN

// ------------------ Faq Category ------------------

// get faq categories
export const getAllFaqCategories = async (req, res) => {
    try {
        const [categories, counts] = await Promise.all([
            FaqCategory.find().sort({ order: 1, _id: 1 }).lean(),
            Faq.aggregate([
                { $group: { _id: '$categoryId', total: { $sum: 1 }, active: { $sum: { $cond: ['$isActive', 1, 0] } } } },
            ]),
        ]);

        const countMap = new Map(counts.map((c) => [String(c._id), c]));
        const list = categories.map((c) => ({
            ...c,
            faqCount: countMap.get(String(c._id))?.total || 0,
            activeFaqCount: countMap.get(String(c._id))?.active || 0,
        }));

        return res.status(200).json({
            success: true,
            categories: list,
            icons: FAQ_ICON_KEYS,
            stats: {
                total: list.length,
                active: list.filter((c) => c.isActive).length,
                inactive: list.filter((c) => !c.isActive).length,
            },
        });
    } catch (err) {
        console.log("getAllFaqCategories error :", err);
        return bad(res, 'Server Error Occured', 500);
    }
};

// create faq category
export const createFaqCategory = async (req, res) => {
    try {
        const name = clean(req.body.name);
        const icon = clean(req.body.icon) || FAQ_DEFAULT_ICON;

        if (!name || name.length > 60) return bad(res, 'Name is required (max 60 characters)');
        if (!FAQ_ICON_KEYS.includes(icon)) return bad(res, 'Invalid icon');

        const slug = slugify(name);
        if (!slug) return bad(res, 'Name must contain letters or numbers');

        if (await FaqCategory.exists({ slug })) return bad(res, 'A category with this name already exists', 409);

        const category = await FaqCategory.create({
            name,
            slug,
            icon,
            order: await nextOrder(FaqCategory, {}),
        });

        return res.status(201).json({
            success: true,
            message: 'Category created',
            category
        });

    } catch (err) {
        console.log("createFaqCategory error :", err);
        return bad(res, 'Server Error Occured', 500);
    }
};

// update faq category
export const updateFaqCategory = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isId(id)) return bad(res, 'Invalid Category Id');

        const category = await FaqCategory.findById(id);
        if (!category) return bad(res, 'Category not found', 404);

        if (req.body.name !== undefined) {
            const name = clean(req.body.name);
            if (!name || name.length > 60) return bad(res, 'Name is required (max 60 characters)');

            const slug = slugify(name);
            if (!slug) return bad(res, 'Name must contain letters or numbers');
            if (await FaqCategory.exists({ slug, _id: { $ne: category._id } })) {
                return bad(res, 'A category with this name already exists', 409);
            }
            category.name = name;
            category.slug = slug;
        }

        if (req.body.icon !== undefined) {
            const icon = clean(req.body.icon);
            if (!FAQ_ICON_KEYS.includes(icon)) return bad(res, 'Invalid icon');
            category.icon = icon;
        }

        if (req.body.isActive !== undefined) {
            category.isActive = req.body.isActive === true || req.body.isActive === 'true';
        }

        await category.save();
        return res.status(200).json({
            success: true,
            message: 'Category updated',
            category
        });

    } catch (err) {
        console.log("updateFaqCategory error :", err);
        return bad(res, 'Server Error Occured', 500);
    }
};

// move faq category
export const moveFaqCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { direction } = req.body;

        if (!isId(id)) return bad(res, 'Invalid category id');
        if (!['up', 'down'].includes(direction)) return bad(res, 'direction must be up or down');

        const ok = await moveInScope(FaqCategory, {}, id, direction);
        if (!ok) return bad(res, 'Category not found', 404);

        return res.status(200).json({
            success: true,
            message: 'Order updated'
        });

    } catch (err) {
        console.log("moveFaqCategory error :", err);
        return bad(res, 'Server Error Occured', 500);
    }
};

// delete faq category
export const deleteFaqCategory = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isId(id)) return bad(res, 'Invalid category id');

        const category = await FaqCategory.findById(id);
        if (!category) return bad(res, 'Category not found', 404);

        const used = await Faq.countDocuments({ categoryId: category._id });
        if (used > 0) {
            return bad(res, `This category has ${used} FAQ(s). Move or delete them first, or deactivate the category.`, 409);
        }

        await category.deleteOne();
        return res.status(200).json({
            success: true,
            message: 'Category deleted'
        });

    } catch (err) {
        console.log("deleteFaqCategory error :", err);
        return bad(res, 'Server Error Occured', 500);
    }
};

// ------------------ Faq ------------------

// get all faqs
export const getAllFaqs = async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(parseInt(req.query.limit) || 10, 50);

        const { categoryId, status } = req.query;
        const search = clean(req.query.search);

        const filter = {};
        if (categoryId && isId(categoryId)) filter.categoryId = categoryId;
        if (status === 'active') filter.isActive = true;
        if (status === 'inactive') filter.isActive = false;
        if (search) {
            const rx = new RegExp(escRx(search), 'i');
            filter.$or = [{ question: rx }, { answer: rx }, { faqId: rx }];
        }

        const sort = filter.categoryId ? { order: 1, _id: 1 } : { createdAt: -1 };

        const [faqs, total, grouped] = await Promise.all([
            Faq.find(filter)
                .sort(sort)
                .skip((page - 1) * limit)
                .limit(limit)
                .populate('categoryId', 'name icon')
                .lean(),
            Faq.countDocuments(filter),
            Faq.aggregate([{ $group: { _id: '$isActive', n: { $sum: 1 } } }]),
        ]);

        const active = grouped.find((g) => g._id === true)?.n || 0;
        const inactive = grouped.find((g) => g._id === false)?.n || 0;

        return res.status(200).json({
            success: true,
            faqs: faqs.map((f) => ({
                ...f,
                category: f.categoryId ? { _id: f.categoryId._id, name: f.categoryId.name, icon: f.categoryId.icon } : null,
                categoryId: f.categoryId?._id || null,
            })),
            stats: { total: active + inactive, active, inactive },
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });

    } catch (err) {
        console.log("getAllFaqs error :", err);
        return bad(res, 'Server Error Occured', 500);
    }
};

// get faq by id
export const getFaqById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isId(id)) return bad(res, 'Invalid FAQ id');

        const faq = await Faq.findById(id).lean();
        if (!faq) return bad(res, 'FAQ not found', 404);

        return res.status(200).json({
            success: true,
            faq
        });
    } catch (err) {
        console.log("getFaqById error :", err);
        return bad(res, 'Server Error Occured', 500);
    }
};

// create faq
export const createFaq = async (req, res) => {
    try {
        const question = clean(req.body.question);
        const answer = clean(req.body.answer);
        const { categoryId } = req.body;

        if (question.length < 5 || question.length > 300) return bad(res, 'Question must be 5 to 300 characters');
        if (answer.length < 3 || answer.length > 2000) return bad(res, 'Answer must be 3 to 2000 characters');
        if (!isId(categoryId)) return bad(res, 'Select a category');

        const category = await FaqCategory.findById(categoryId).lean();
        if (!category) return bad(res, 'Category not found', 404);
        if (!category.isActive) return bad(res, 'This category is inactive. Activate it first.');

        const actor = actorOf(req);
        const faq = await Faq.create({
            faqId: await getNextFaqId(),
            question,
            answer,
            categoryId,
            order: await nextOrder(Faq, { categoryId }),
            isActive: req.body.isActive === undefined ? true : (req.body.isActive === true || req.body.isActive === 'true'),
            createdBy: actor,
            updatedBy: actor,
        });

        return res.status(201).json({
            success: true,
            message: 'FAQ created',
            faq
        });

    } catch (err) {
        console.log("createFaq error :", err);
        return bad(res, 'Server Error Occured', 500);
    }
};

// update faq
export const updateFaq = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isId(id)) return bad(res, 'Invalid FAQ id');

        const faq = await Faq.findById(id);
        if (!faq) return bad(res, 'FAQ not found', 404);

        if (req.body.question !== undefined) {
            const question = clean(req.body.question);
            if (question.length < 5 || question.length > 300) return bad(res, 'Question must be 5 to 300 characters');
            faq.question = question;
        }

        if (req.body.answer !== undefined) {
            const answer = clean(req.body.answer);
            if (answer.length < 3 || answer.length > 2000) return bad(res, 'Answer must be 3 to 2000 characters');
            faq.answer = answer;
        }

        // if cat change then go in end of new cat
        if (req.body.categoryId !== undefined && String(req.body.categoryId) !== String(faq.categoryId)) {
            if (!isId(req.body.categoryId)) return bad(res, 'Select a category');

            const category = await FaqCategory.findById(req.body.categoryId).lean();
            if (!category) return bad(res, 'Category not found', 404);
            if (!category.isActive) return bad(res, 'This category is inactive. Activate it first.');

            faq.categoryId = category._id;
            faq.order = await nextOrder(Faq, { categoryId: category._id });
        }

        if (req.body.isActive !== undefined) {
            faq.isActive = req.body.isActive === true || req.body.isActive === 'true';
        }

        faq.updatedBy = actorOf(req);
        await faq.save();

        return res.status(200).json({ 
            success: true, 
            message: 'FAQ updated', 
            faq 
        });

    } catch (err) {
        console.log("updateFaq error :", err);
        return bad(res, 'Server Error Occured', 500);
    }
};

// move faq
export const moveFaq = async (req, res) => {
    try {
        const { id } = req.params;
        const { direction } = req.body;

        if (!isId(id)) return bad(res, 'Invalid FAQ id');
        if (!['up', 'down'].includes(direction)) return bad(res, 'direction must be up or down');

        const faq = await Faq.findById(id).select('categoryId').lean();
        if (!faq) return bad(res, 'FAQ not found', 404);

        await moveInScope(Faq, { categoryId: faq.categoryId }, id, direction);
        return res.status(200).json({ 
            success: true, 
            message: 'Order updated' 
        });

    } catch (err) {
        console.error('moveFaq error:', err);
        return bad(res, 'Server Error Occured', 500);
    }
};

// delete faq
export const deleteFaq = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isId(id)) return bad(res, 'Invalid FAQ id');

        const faq = await Faq.findByIdAndDelete(id);
        if (!faq) return bad(res, 'FAQ not found', 404);

        return res.status(200).json({ success: true, message: 'FAQ deleted' });
    } catch (err) {
        console.error('deleteFaq error:', err);
        return bad(res, 'Server Error Occured', 500);
    }
};

// =================================================== PUBLIC

// get faq
export const getPublicFaqs = async (req, res) => {
    try {
        const categories = await FaqCategory.find({ isActive: true })
            .sort({ order: 1, _id: 1 })
            .select('name slug icon')
            .lean();

        const categoryIds = categories.map((c) => c._id);

        const faqs = await Faq.find({ isActive: true, categoryId: { $in: categoryIds } })
            .sort({ order: 1, _id: 1 })
            .select('question answer categoryId')
            .lean();

        const countMap = new Map();
        for (const f of faqs) {
            const k = String(f.categoryId);
            countMap.set(k, (countMap.get(k) || 0) + 1);
        }

        res.set('Cache-Control', 'public, max-age=60');
        return res.status(200).json({
            success: true,
            categories: categories.map((c) => ({ ...c, count: countMap.get(String(c._id)) || 0 })),
            faqs,
            total: faqs.length,
        });
    } catch (err) {
        console.error('getPublicFaqs error:', err);
        return bad(res, 'Server Error Occured', 500);
    }
};

import Page from '../models/pageModelSchema.js';

const COLUMNS = ['support', 'buyers', 'sellers'];

export const getPublicFooterPages = async (req, res) => {
    try {
        const rows = await Page.find({ status: 'published', footerColumn: { $in: COLUMNS } })
            .sort({ footerOrder: 1, title: 1 })
            .select('title slug footerColumn')
            .lean();

        const columns = { support: [], buyers: [], sellers: [] };
        for (const r of rows) columns[r.footerColumn].push({ title: r.title, slug: r.slug });

        res.set('Cache-Control', 'public, max-age=60');
        return res.status(200).json({ success: true, columns });
    } catch (err) {
        console.error('getPublicFooterPages error:', err);
        return res.status(500).json({ success: false, message: 'Server Error Occured' });
    }
};

// Run (backend root se):   node scripts/seedFaqs.js
// Safe to re-run: category slug se milti hai (naya nahi banti), FAQ (category + question) se milti hai (skip).
// Admin ne jo FAQ badli / delete ki, wo dobara overwrite nahi hoti, sirf missing wali jodti hai.
import mongoose from 'mongoose';
import FaqCategory from '../models/faqCategoryModelSchema.js';
import Faq from '../models/faqModelSchema.js';
import { getNextFaqId } from '../utils/counterHelper.js';
import { slugify } from '../utils/blogHelper.js';
import { seedCategories } from './faqSeedData.js';

// GUESS: .env ka naam. dotenv install na ho / server pehle se env load karta ho to bhi chalega.
try { await import('dotenv/config'); } catch (err) { /* dotenv nahi hai, shell env se chalega */ }

const uri = process.env.MONGO_DB_URL || process.env.MONGODB_URI || process.env.DB_URI;
if (!uri) {
    console.error('Mongo URI nahi mili. .env me jo naam use hota hai wo MONGO_URI / MONGODB_URI / DB_URI me se nahi hai.');
    console.error('Run karo aise:  MONGO_URI="..." node scripts/seedFaqs.js   (Windows PowerShell: $env:MONGO_URI="..."; node scripts/seedFaqs.js)');
    process.exit(1);
}

let catsCreated = 0;
let catsReused = 0;
let faqsCreated = 0;
let faqsSkipped = 0;

try {
    await mongoose.connect(uri);

    for (let ci = 0; ci < seedCategories.length; ci++) {
        const seed = seedCategories[ci];
        const slug = slugify(seed.name);

        let category = await FaqCategory.findOne({ slug });
        if (category) {
            catsReused++;
        } else {
            const last = await FaqCategory.findOne().sort({ order: -1 }).select('order').lean();
            category = await FaqCategory.create({
                name: seed.name,
                slug,
                icon: seed.icon,
                order: last ? last.order + 1 : 0,
            });
            catsCreated++;
        }

        for (const item of seed.faqs) {
            const exists = await Faq.exists({ categoryId: category._id, question: item.q });
            if (exists) { faqsSkipped++; continue; }

            const last = await Faq.findOne({ categoryId: category._id }).sort({ order: -1 }).select('order').lean();
            await Faq.create({
                faqId: await getNextFaqId(),
                question: item.q,
                answer: item.a,
                categoryId: category._id,
                order: last ? last.order + 1 : 0,
                isActive: true,
                createdBy: { name: 'Seed' },
                updatedBy: { name: 'Seed' },
            });
            faqsCreated++;
        }
    }

    console.log(`Categories: ${catsCreated} new, ${catsReused} already there`);
    console.log(`FAQs: ${faqsCreated} new, ${faqsSkipped} skipped (already there)`);
} catch (err) {
    console.error('Seed failed:', err);
    process.exitCode = 1;
} finally {
    await mongoose.disconnect();
}
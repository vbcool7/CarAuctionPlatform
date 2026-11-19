
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import RichTextEditor from '../RichTextEditor';
import { useGetPageById, useCreatePage, useUpdatePage } from '../../../hooks/usePage';

// content empty or not
const isContentEmpty = (html = '') =>
    !/<img/i.test(html) && !html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();

const inputCls = (hasError) =>
    `w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#D97706] focus:ring-0 focus:outline-none ${hasError ? 'border-red-400' : 'border-slate-300'}`;

const FOOTER_OPTIONS = [
    { value: '', label: 'Not shown in footer' },
    { value: 'support', label: 'Support' },
    { value: 'buyers', label: 'For Buyers' },
    { value: 'sellers', label: 'For Sellers' },
];

const fmt = (d) =>
    d
        ? new Date(d).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Dubai' })
        : '—';

function PageForm({ setCurrentPage, page }) {

    const isEdit = !!page;
    const isPublished = page?.status === 'published';

    const createPage = useCreatePage();
    const updatePage = useUpdatePage();
    const saving = createPage.isPending || updatePage.isPending;

    const [formData, setFormData] = useState({
        title: page?.title || '',
        content: page?.content || '',
        footerColumn: page?.footerColumn || '',
        footerOrder: page?.footerOrder ?? 0,
    });
    const [errors, setErrors] = useState({});

    const updateField = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    // status: 'draft' | 'published'
    const handleSave = (status) => {
        const title = formData.title.trim();
        const clientErrors = {};

        if (!title) clientErrors.title = 'Page title is required';

        if (/<img[^>]+src=["'](?:data:|blob:)/i.test(formData.content)) {
            return toast.error('An image is still uploading. Please wait a moment and try again.');
        }

        if (status === 'published' && isContentEmpty(formData.content)) {
            clientErrors.content = 'Content is required to publish';
        }

        const order = Number(formData.footerOrder);
        if (formData.footerColumn && (!Number.isInteger(order) || order < 0 || order > 999)) {
            clientErrors.footerOrder = 'Order must be a whole number from 0 to 999';
        }

        if (Object.keys(clientErrors).length) {
            setErrors(clientErrors);
            return;
        }

        const payload = {
            title,
            content: formData.content,
            status,
            footerColumn: formData.footerColumn,
            footerOrder: formData.footerColumn ? order : 0,
        };

        const callbacks = {
            onSuccess: () => setCurrentPage('all-pages'),
            onError: (err) => setErrors(err.response?.data?.errors || {}),
        };

        if (isEdit) updatePage.mutate({ id: page._id, payload }, callbacks);
        else createPage.mutate(payload, callbacks);
    };

    return (
        <div>
            {/* header */}
            <div className="mb-6 flex flex-col gap-4 pb-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-bold text-[#0B1E3D] sm:text-2xl">
                        {isEdit ? 'Edit Page' : 'Create Page'}
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        {isEdit ? 'Update this page.' : 'Create a text page for your website, like Terms or Privacy Policy.'}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setCurrentPage('all-pages')}
                        className="flex gap-1 items-center rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-[#D97706] hover:bg-amber-50 hover:text-[#D97706]">
                        <ArrowLeft size={15} />
                        Back
                    </button>

                    <button
                        type="button"
                        disabled={saving}
                        onClick={() => handleSave('draft')}
                        className="rounded-lg bg-[#D97706] px-5 py-2.5 text-sm font-medium text-white shadow-md transition hover:bg-amber-700 disabled:opacity-50">
                        {isPublished ? 'Unpublish & Save Draft' : 'Save Draft'}
                    </button>
                </div>
            </div>

            <div className="w-full flex justify-between gap-6 items-start">

                {/* ---------- left ---------- */}
                <div className="w-[65%] grid grid-cols-1 gap-6 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">

                    {/* title */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-[#0B1E3D]">
                            Page Title <span className="text-red-500">*</span>
                        </label>

                        <input
                            type="text"
                            maxLength={120}
                            placeholder="e.g. Terms & Conditions"
                            value={formData.title}
                            onChange={(e) => updateField('title', e.target.value)}
                            className={inputCls(errors.title)}
                        />
                        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}

                        <p className="mt-2 text-xs text-slate-500">
                            {isEdit
                                ? <>URL: <span className="font-mono">/page/{page.slug}</span>{page.publishedAt ? ' (locked after first publish)' : ''}</>
                                : 'The URL (slug) is created automatically from the title.'}
                        </p>
                    </div>

                    {/* content */}
                    <div>
                        <div className="mb-4">
                            <div className="flex items-center gap-2">
                                <span className="h-5 w-1 rounded-full bg-[#D97706]"></span>
                                <h2 className="text-base font-semibold tracking-wide text-[#0B1E3D]">Page Content</h2>
                            </div>
                            <p className="mt-1 pl-3 text-sm leading-6 text-slate-500">
                                Write and format the page. Headings, lists, links and images are supported.
                            </p>
                        </div>

                        <div className={`rounded-2xl border bg-white overflow-hidden ${errors.content ? 'border-red-400' : 'border-slate-200'}`}>
                            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-3">
                                <h3 className="text-sm font-semibold text-[#0B1E3D]">Content Editor</h3>
                                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-[#D97706]">
                                    Required to publish
                                </span>
                            </div>

                            <div className="p-5">
                                <RichTextEditor
                                    value={formData.content}
                                    onChange={(val) => updateField('content', val)}
                                />
                            </div>
                        </div>
                        {errors.content && <p className="mt-1 text-xs text-red-500">{errors.content}</p>}
                    </div>
                </div>

                {/* ---------- right ---------- */}
                <div className="w-[35%] space-y-5">

                    {/* footer */}
                    <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                        <div className="border-b border-slate-100 pb-4 mb-4">
                            <h3 className="text-base font-semibold text-[#0B1E3D]">Website Footer</h3>
                            <p className="mt-1 text-xs text-slate-500">Choose where this page link appears in the footer.</p>
                        </div>

                        <label className="mb-2 block text-sm font-semibold text-[#0B1E3D]">Column</label>
                        <select
                            value={formData.footerColumn}
                            onChange={(e) => updateField('footerColumn', e.target.value)}
                            className={inputCls(errors.footerColumn)}>
                            {FOOTER_OPTIONS.map((o) => (
                                <option
                                    key={o.value}
                                    value={o.value}>
                                    {o.label}
                                </option>
                            ))}
                        </select>
                        {errors.footerColumn && <p className="mt-1 text-xs text-red-500">{errors.footerColumn}</p>}

                        {formData.footerColumn && (
                            <div className="mt-4">
                                <label className="mb-2 block text-sm font-semibold text-[#0B1E3D]">Order</label>
                                <input
                                    type="number"
                                    min={0}
                                    max={999}
                                    value={formData.footerOrder}
                                    onChange={(e) => updateField('footerOrder', e.target.value)}
                                    className={inputCls(errors.footerOrder)}
                                />
                                {errors.footerOrder && <p className="mt-1 text-xs text-red-500">{errors.footerOrder}</p>}
                                <p className="mt-2 text-xs text-slate-500">Smaller number appears first. Only published pages are shown.</p>
                            </div>
                        )}
                    </div>

                    {/* info (only in edit) */}
                    {isEdit && (
                        <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                            <div className="border-b border-slate-100 pb-4 mb-4">
                                <h3 className="text-base font-semibold text-[#0B1E3D]">Page Info</h3>
                            </div>

                            <dl className="space-y-3 text-sm">
                                <div className="flex justify-between gap-4">
                                    <dt className="text-slate-500">Status</dt>
                                    <dd>
                                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isPublished ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {isPublished ? 'Published' : 'Draft'}
                                        </span>
                                    </dd>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <dt className="text-slate-500">Last updated</dt>
                                    <dd className="font-medium text-slate-800 text-right">{fmt(page.lastUpdatedAt)}</dd>
                                </div>
                            </dl>

                            <p className="mt-4 text-xs text-slate-400">
                                Visitors see "Last updated" on this page. It changes only when you edit the title or content.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* bottom buttons */}
            <div className="py-6 flex items-start justify-start gap-3 bg-white border-t border-slate-200">
                <button
                    type="button"
                    onClick={() => setCurrentPage('all-pages')}
                    className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
                    Cancel
                </button>

                <button
                    type="button"
                    disabled={saving}
                    onClick={() => handleSave('published')}
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-[#D97706] hover:bg-amber-700 rounded-xl transition-colors shadow-sm disabled:opacity-50">
                    {saving ? 'Saving...' : isPublished ? 'Update Page' : 'Save & Publish'}
                </button>
            </div>
        </div>
    );
}

function CreateCustomPage({ setCurrentPage, initialData }) {

    const pageId = initialData?._id;
    const { data, isLoading, isError } = useGetPageById(pageId);

    if (pageId) {
        if (isLoading) return <p className="p-10 text-center">Loading page....</p>;
        if (isError || !data) return <p className="p-10 text-center text-red-500">Failed to load page</p>;
        return <PageForm setCurrentPage={setCurrentPage} page={data} />;
    }

    return <PageForm setCurrentPage={setCurrentPage} page={null} />;
}

export default CreateCustomPage;
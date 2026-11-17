
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ArrowLeft, ImagePlus, Upload, X } from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import { useGetAllBlogs, useGetBlogById, useCreateBlog, useUpdateBlog } from '../../hooks/useBlog';

const MAX_COVER = 2 * 1024 * 1024;
const COVER_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const errMsg = (e) => e?.response?.data?.message || 'Something went wrong';

// content khali hai ya nahi (image ho to khali nahi maana jaata)
const isContentEmpty = (html = '') =>
    !/<img/i.test(html) && !html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();

const inputCls = 'w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#D97706] focus:ring-0 focus:outline-none';

// ------------------------------------------------------------------
// Form (blog data aa jaane ke baad hi mount hota hai, taaki CKEditor ko shuru me hi content mile)
// ------------------------------------------------------------------
function BlogForm({ setCurrentPage, blog }) {

    const isEdit = !!blog;

    const createBlog = useCreateBlog();
    const updateBlog = useUpdateBlog();
    const saving = createBlog.isPending || updateBlog.isPending;

    // category suggestions (jo ab tak use hui)
    const { data: listData } = useGetAllBlogs({ page: 1, limit: 1 });
    const categorySuggestions = listData?.categories ?? [];

    const [formData, setFormData] = useState({
        title: blog?.title || '',
        category: blog?.category || '',
        tags: blog?.tags?.join(', ') || '',
        excerpt: blog?.excerpt || '',
        content: blog?.content || '',
        coverImage: blog?.coverImage ? { file: null, preview: blog.coverImage } : null,
    });

    const updateField = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

    // naya local preview URL page chhodte waqt free karo
    useEffect(() => {
        return () => {
            if (formData.coverImage?.file) URL.revokeObjectURL(formData.coverImage.preview);
        };
    }, [formData.coverImage]);

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file) return;

        if (!COVER_TYPES.includes(file.type)) return toast.error('Only JPG, PNG or WEBP images are allowed');
        if (file.size > MAX_COVER) return toast.error('Image must be 2MB or smaller');

        updateField('coverImage', { file, preview: URL.createObjectURL(file) });
    };

    const removeImage = () => updateField('coverImage', null);

    // status: 'draft' | 'published'
    const handleSave = (status) => {
        const title = formData.title.trim();

        if (!title) return toast.error('Post title is required');

        if (/<img[^>]+src=["'](?:data:|blob:)/i.test(formData.content)) {
            return toast.error('An image is still uploading. Please wait a moment and try again.');
        }

        if (status === 'published') {
            if (!formData.category.trim()) return toast.error('Category is required to publish');
            if (!formData.coverImage) return toast.error('Cover image is required to publish');
            if (isContentEmpty(formData.content)) return toast.error('Content is required to publish');
        }

        const body = new FormData();
        body.append('title', title);
        body.append('category', formData.category.trim());
        body.append('tags', formData.tags);
        body.append('excerpt', formData.excerpt.trim());
        body.append('content', formData.content);
        body.append('status', status);

        if (formData.coverImage?.file) {
            body.append('coverImage', formData.coverImage.file);
        } else if (isEdit && blog.coverImage && !formData.coverImage) {
            body.append('removeCover', 'true');
        }

        const done = (message) => ({
            onSuccess: () => {
                toast.success(message);
                setCurrentPage('all-blogs');
            },
            onError: (e) => toast.error(errMsg(e)),
        });

        if (isEdit) {
            updateBlog.mutate(
                { id: blog._id, data: body },
                done(status === 'published' ? 'Blog updated' : 'Saved as draft')
            );
        } else {
            createBlog.mutate(body, done(status === 'published' ? 'Blog published' : 'Draft saved'));
        }
    };

    const isPublished = blog?.status === 'published';

    return (
        <div>
            {/* header */}
            <div className="mb-6 flex flex-col gap-4 pb-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-bold text-[#0B1E3D] sm:text-2xl">
                        {isEdit ? 'Edit Blog Post' : 'Create Blog Post'}
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        {isEdit ? 'Update your blog post details.' : 'Write and publish a blog post for your website.'}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setCurrentPage('all-blogs')}
                        className="flex gap-1 items-center rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-[#D97706] hover:bg-amber-50 hover:text-[#D97706]"
                    >
                        <ArrowLeft size={15} />
                        Back
                    </button>

                    <button
                        type="button"
                        disabled={saving}
                        onClick={() => handleSave('draft')}
                        className="rounded-lg bg-[#D97706] px-5 py-2.5 text-sm font-medium text-white shadow-md transition hover:bg-amber-700 disabled:opacity-50"
                    >
                        {isPublished ? 'Unpublish & Save Draft' : 'Save Draft'}
                    </button>
                </div>
            </div>

            <div className="w-full flex justify-between gap-6 items-start">

                {/* =---------- left ------------ */}
                <div className="w-[65%] grid grid-cols-1 gap-6 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">

                    {/* Basic Information */}
                    <div>
                        <div className="mb-6 pb-2">
                            <div className="flex items-center gap-2">
                                <span className="h-5 w-1 rounded-full bg-[#D97706]"></span>
                                <h2 className="text-base font-semibold tracking-wide text-[#0B1E3D]">
                                    Basic Information
                                </h2>
                            </div>
                            <p className="mt-1 pl-3 text-sm leading-6 text-slate-500">
                                Enter the primary information for this blog post.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                            {/* Title */}
                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-semibold text-[#0B1E3D]">
                                    Post Title <span className="text-red-500">*</span>
                                </label>

                                <input
                                    type="text"
                                    maxLength={150}
                                    placeholder="Enter post title"
                                    value={formData.title}
                                    onChange={(e) => updateField('title', e.target.value)}
                                    className={inputCls}
                                />

                                <p className="mt-2 text-xs text-slate-500">
                                    {isEdit
                                        ? <>URL: <span className="font-mono">/blog/{blog.slug}</span>{isPublished || blog.publishedAt ? ' (locked after first publish)' : ''}</>
                                        : 'The URL (slug) is created automatically from the title.'}
                                </p>
                            </div>

                            {/* Category */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-[#0B1E3D]">
                                    Category <span className="text-red-500">*</span>
                                </label>

                                <input
                                    type="text"
                                    list="blog-categories"
                                    maxLength={40}
                                    placeholder="e.g. Auction Tips"
                                    value={formData.category}
                                    onChange={(e) => updateField('category', e.target.value)}
                                    className={inputCls}
                                />
                                <datalist id="blog-categories">
                                    {categorySuggestions.map((c) => (
                                        <option key={c.value} value={c.label} />
                                    ))}
                                </datalist>

                                <p className="mt-2 text-xs text-slate-500">Pick an existing one or type a new category.</p>
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-[#0B1E3D]">
                                    Tags
                                </label>

                                <input
                                    type="text"
                                    placeholder="Dubai, Cars, Tips"
                                    value={formData.tags}
                                    onChange={(e) => updateField('tags', e.target.value)}
                                    className={inputCls}
                                />

                                <p className="mt-2 text-xs text-slate-500">Separate with commas. Max 8 tags.</p>
                            </div>

                            {/* Excerpt */}
                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-semibold text-[#0B1E3D]">
                                    Excerpt
                                </label>

                                <textarea
                                    rows={3}
                                    maxLength={300}
                                    placeholder="Short summary shown on the blog list card..."
                                    value={formData.excerpt}
                                    onChange={(e) => updateField('excerpt', e.target.value)}
                                    className="w-full resize-none rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#D97706] focus:ring-0 focus:outline-none"
                                />

                                <div className="mt-1 text-right text-xs font-medium text-[#D97706]">
                                    {formData.excerpt.length} / 300
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div>
                        <div className="mb-6 pb-2">
                            <div className="flex items-center gap-2">
                                <span className="h-5 w-1 rounded-full bg-[#D97706]"></span>
                                <h2 className="text-base font-semibold tracking-wide text-[#0B1E3D]">
                                    Post Content
                                </h2>
                            </div>
                            <p className="mt-1 pl-3 text-sm leading-6 text-slate-500">
                                Write and format the content of this post. Images are limited to 2 MB.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
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
                    </div>
                </div>

                {/* =---------- right ------------ */}
                <div className="w-[35%] space-y-5">

                    {/* Cover image */}
                    <div className="overflow-hidden p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                        <div className="border-b border-slate-100 pb-4 mb-4">
                            <h3 className="text-base font-semibold text-[#0B1E3D]">
                                Cover Image <span className="text-red-500">*</span>
                            </h3>
                        </div>

                        {!formData.coverImage ? (
                            <label className="flex h-56 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/30 transition hover:border-[#D97706] hover:bg-amber-50/30">
                                <ImagePlus size={40} className="mb-3 text-slate-400" />

                                <p className="font-medium text-slate-700 text-sm">Click to upload cover image</p>
                                <p className="mt-1 text-xs text-slate-500">JPG, PNG, WEBP • Max 2 MB</p>

                                <div className="mt-5 flex items-center gap-2 rounded-lg bg-[#D97706] px-4 py-2 text-[13px] font-medium text-white">
                                    <Upload size={16} />
                                    Upload Image
                                </div>

                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                        ) : (
                            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white">
                                <img
                                    src={formData.coverImage.preview}
                                    alt="Cover preview"
                                    className="h-56 w-full object-cover"
                                />

                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute right-3 top-3 rounded-full bg-white p-1.5 shadow transition hover:bg-red-50"
                                >
                                    <X size={16} className="text-red-500" />
                                </button>

                                <div className="flex items-center justify-between border-t border-slate-100 px-3 py-4">
                                    {formData.coverImage.file ? (
                                        <div className="min-w-0">
                                            <p className="font-medium text-[#0B1E3D] text-xs truncate max-w-32">
                                                {formData.coverImage.file.name}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {(formData.coverImage.file.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="text-xs text-slate-500">Current image</p>
                                    )}

                                    <label className="cursor-pointer rounded-lg border border-[#D97706] px-4 py-1.5 text-sm font-medium text-[#D97706] transition hover:bg-amber-50">
                                        Change Image
                                        <input
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Post info (sirf edit me) */}
                    {isEdit && (
                        <div className="overflow-hidden p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                            <div className="border-b border-slate-100 pb-4 mb-4">
                                <h3 className="text-base font-semibold text-[#0B1E3D]">Post Info</h3>
                            </div>

                            <dl className="space-y-3 text-sm">
                                <div className="flex justify-between gap-4">
                                    <dt className="text-slate-500">Blog ID</dt>
                                    <dd className="font-medium text-slate-800">{blog.blogId}</dd>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <dt className="text-slate-500">Status</dt>
                                    <dd>
                                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isPublished ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {isPublished ? 'Published' : 'Draft'}
                                        </span>
                                    </dd>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <dt className="text-slate-500">Author</dt>
                                    <dd className="font-medium text-slate-800">{blog.author}</dd>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <dt className="text-slate-500">Reading time</dt>
                                    <dd className="font-medium text-slate-800">{blog.readingTime} min</dd>
                                </div>
                            </dl>

                            <p className="mt-4 text-xs text-slate-400">
                                Author is set when the post is created. Reading time updates automatically when you save.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* bottom buttons */}
            <div className="py-6 flex items-start justify-start gap-3 bg-white border-t border-slate-200">
                <button
                    type="button"
                    onClick={() => setCurrentPage('all-blogs')}
                    className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                >
                    Cancel
                </button>

                <button
                    type="button"
                    disabled={saving}
                    onClick={() => handleSave('published')}
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-[#D97706] hover:bg-amber-700 rounded-xl transition-colors shadow-sm disabled:opacity-50"
                >
                    {saving ? 'Saving...' : isPublished ? 'Update Post' : 'Save & Publish'}
                </button>
            </div>
        </div>
    );
}

// ------------------------------------------------------------------
// Wrapper: edit me pehle blog fetch karta hai (list me content nahi aata)
// ------------------------------------------------------------------
function CreateBlogPost({ setCurrentPage, initialData }) {

    const blogId = initialData?._id;
    const { data, isLoading, isError } = useGetBlogById(blogId);

    if (blogId) {
        if (isLoading) return <p className="p-10 text-center">Loading blog....</p>;
        if (isError || !data?.blog) return <p className="p-10 text-center text-red-500">Failed to load blog</p>;
        return <BlogForm setCurrentPage={setCurrentPage} blog={data.blog} />;
    }

    return <BlogForm setCurrentPage={setCurrentPage} blog={null} />;
}

export default CreateBlogPost;
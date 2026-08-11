
import { ArrowLeft, ImagePlus, Upload, X } from 'lucide-react';
import React, { useState } from 'react'
import RichTextEditor from './RichTextEditor';
import CustomDropdown from '../SharedComponents/CustomDropDown';
import DateInputField from '../UserManagement/Shared/DateInputField';

function CreateBlogPost({ setCurrentPage, initialData, key }) {

    const [formData, setFormData] = useState({
        content: initialData?.content || '',
        featuredImage: initialData?.featureImage ? { file: null, preview: initialData.featureImage } : null,
        title: initialData?.title || '',
        slug: initialData?.slug || '',
        category: initialData?.category || '',
        tags: initialData?.tags || '',
        metaTitle: initialData?.metaTitle || '',
        metaDescription: initialData?.metaDescription || '',
        status: initialData?.status || '',
        visibility: initialData?.visibility || '',
        publishDate: initialData?.publishedDate ? new Date(initialData.publishedDate) : '',
        author: initialData?.author || '',
        readingTime: initialData?.readingTime || '',
        showInNavigation: initialData?.showInNavigation ?? true,
        showInFooter: initialData?.showInFooter ?? true,
        allowComments: initialData?.allowComments ?? true,
    });

    // field update
    const updateField = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // img handle
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            updateField('featuredImage', { file, preview: URL.createObjectURL(file) });
        }
    };

    const removeImage = () => {
        if (formData.featuredImage?.preview) {
            URL.revokeObjectURL(formData.featuredImage.preview);
        }
        updateField('featuredImage', null);
    };

    // handle save
    const handleSave = () => {
        if (initialData?.id) {
            console.log('Updating blog:', initialData.id, formData);
            // update logic yahan aayega jab data layer ban jaayega
        } else {
            console.log('Creating new blog:', formData);
            // create logic yahan aayega
        }
        setCurrentPage('all-blogs');
    };

    return (
        <div>
            {/* header */}
            <div className="mb-6 flex flex-col gap-4 pb-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                    <div>
                        <h1 className="text-xl font-bold text-[#0B1E3D] sm:text-2xl">
                            {initialData ? 'Edit Blog Post' : 'Create Blog Post'}
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            {initialData ? 'Update your blog post details.' : 'Write and publish a blog post for your website.'}
                        </p>
                    </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setCurrentPage("all-blogs")}
                        className="flex gap-1 items-center rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-[#D97706] hover:bg-amber-50 hover:text-[#D97706]"
                    >
                        <ArrowLeft size={15} />
                        Back
                    </button>

                    <button className="rounded-lg bg-[#D97706] px-5 py-2.5 text-sm font-medium text-white shadow-md transition hover:bg-amber-700">
                        Save Draft
                    </button>
                </div>
            </div>

            <div className='w-full flex justify-between gap-6 items-start'>

                {/* =---------- left ------------ */}
                <div className="w-[65%] grid grid-cols-1 gap-6 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">

                    {/* ================= Basic Information ================= */}
                    <div className="mb-8">

                        <div className="mb-6 flex items-start justify-between pb-2">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="h-5 w-1 rounded-full bg-[#D97706]"></span>

                                    <h2 className="text-base font-semibold tracking-wide text-[#0B1E3D]">
                                        Basic Information
                                    </h2>
                                </div>

                                <p className="mt-1 pl-3 text-sm leading-6 text-slate-500">
                                    Enter the primary information for this custom page.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                            {/* Category */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-[#0B1E3D]">
                                    Category <span className="text-red-500">*</span>
                                </label>

                                <CustomDropdown
                                    label=""
                                    placeholder="Select Category"
                                    options={["Company", "Support", "Legal", "Marketing", "Other",]}
                                    selected={formData.category}
                                    onChange={(val) => updateField('category', val)}
                                />
                            </div>

                            {/* Page Title */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-[#0B1E3D]">
                                    Post Title <span className="text-red-500">*</span>
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter page title"
                                    value={formData.title}
                                    onChange={(e) => updateField('title', e.target.value)}
                                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#D97706] focus:ring-0 focus:outline-none"
                                />
                            </div>

                            {/* Slug */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-[#0B1E3D]">
                                    Slug <span className="text-red-500">*</span>
                                </label>

                                <input
                                    type="text"
                                    placeholder="about-us"
                                    value={formData.slug}
                                    onChange={(e) => updateField('slug', e.target.value)}
                                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#D97706] focus:ring-0 focus:outline-none"
                                />

                                <p className="mt-2 text-xs text-slate-500">
                                    URL friendly page slug.
                                </p>
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-[#0B1E3D]">
                                    Tags
                                </label>

                                <input
                                    type="text"
                                    placeholder="SEO, Company, Support..."
                                    value={formData.tags}
                                    onChange={(e) => updateField('tags', e.target.value)}
                                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#D97706] focus:ring-0 focus:outline-none"
                                />
                            </div>

                            {/* Featured Image */}
                            <div className="mt-8">
                                <label className="mb-2 block text-sm font-semibold text-[#0B1E3D]">
                                    Featured Image <span className="text-red-500">*</span>
                                </label>

                                {!formData.featuredImage ? (
                                    <label className="flex h-56 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/30  transition hover:border-[#D97706] hover:bg-amber-50/30">
                                        <ImagePlus size={40} className="mb-3 text-slate-400" />

                                        <p className="font-medium text-slate-700 text-sm">
                                            Click to upload blog image
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500">
                                            PNG, JPG, JPEG • Max 5 MB
                                        </p>

                                        <div className="mt-5 flex items-center gap-2 rounded-lg bg-[#D97706] px-4 py-2 text-[13px] font-medium text-white">
                                            <Upload size={16} />
                                            Upload Image
                                        </div>

                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                ) : (
                                    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white">
                                        <img
                                            src={formData.featuredImage.preview}
                                            alt="Preview"
                                            className="h-64 w-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute right-3 top-3 rounded-full bg-white p-1.5 shadow transition hover:bg-red-50"
                                        >
                                            <X size={16} className="text-red-500" />
                                        </button>

                                        <div className="flex items-center justify-between border-t border-slate-100 px-3 py-4">
                                            {formData.featuredImage.file ? (
                                                <div>
                                                    <p className="font-medium text-[#0B1E3D] text-xs truncate w-30">
                                                        {formData.featuredImage.file.name}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        {(formData.featuredImage.file.size / 1024 / 1024).toFixed(2)} MB
                                                    </p>
                                                </div>
                                            ) : (
                                                <p className="text-xs text-slate-500">Current image</p>
                                            )}

                                            <label className="cursor-pointer rounded-lg border border-[#D97706] px-4 py-1.5 text-sm font-medium text-[#D97706] transition hover:bg-amber-50">
                                                Change Image
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* ================= SEO Settings ================= */}
                    <div className="mb-8">
                        <div className="mb-6 flex items-start justify-between pb-2">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="h-5 w-1 rounded-full bg-[#D97706]"></span>

                                    <h2 className="text-base font-semibold tracking-wide text-[#0B1E3D]">
                                        SEO Settings
                                    </h2>
                                </div>
                                <p className="mt-1 pl-3 text-sm leading-6 text-slate-500">
                                    Improve search engine visibility.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Meta Title */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-[#0B1E3D]">
                                    Meta Title
                                </label>

                                <input
                                    type="text"
                                    value={formData.metaTitle}
                                    onChange={(e) => updateField('metaTitle', e.target.value)}
                                    placeholder="Enter SEO title"
                                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#D97706] focus:ring-0 focus:outline-none"
                                />

                            </div>

                            {/* Meta Description */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-[#0B1E3D]">
                                    Excerpt / Meta Description
                                </label>

                                <textarea
                                    rows={4}
                                    maxLength={200}
                                    value={formData.metaDescription}
                                    onChange={(e) => updateField('metaDescription', e.target.value)}
                                    placeholder="Write a short description for SEO..."
                                    className="w-full resize-none rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition-all focus:border-[#D97706] focus:ring-0 focus:ring-amber-100"
                                />

                                <div className="mt-2 flex justify-between">
                                    <span className="text-xs text-slate-400">
                                        Recommended: 150–160 characters
                                    </span>

                                    <span className="text-xs font-medium text-[#D97706]">
                                        0 / 200
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ================= Page Content ================= */}
                    <div>
                        <div className="mb-6 flex items-start justify-between pb-2">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="h-5 w-1 rounded-full bg-[#D97706]"></span>

                                    <h2 className="text-base font-semibold tracking-wide text-[#0B1E3D]">
                                        Page Content
                                    </h2>
                                </div>

                                <p className="mt-1 pl-3 text-sm leading-6 text-slate-500">
                                    Create and format the content that will appear on this page.
                                </p>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-3">
                                <div>
                                    <h3 className="text-sm font-semibold text-[#0B1E3D]">
                                        Content Editor
                                    </h3>

                                    <p className="mt-1 text-xs text-slate-500">
                                        Use the editor below to add text, images and formatting.
                                    </p>
                                </div>

                                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-[#D97706]">
                                    Required
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
                <div className="w-[35%] grid grid-cols-1 gap-6">
                    <div className="space-y-5">

                        {/* Publish Settings */}
                        <div className="overflow-hidden p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                            <div className="border-b border-slate-100 pb-4">
                                <h3 className="text-base font-semibold text-[#0B1E3D]">
                                    Publish Settings
                                </h3>
                            </div>

                            <div className="space-y-5">

                                {/* Status */}
                                <div className='mt-'>
                                    <label className="mb-2 block text-sm font-semibold text-[#0B1E3D]">
                                        Status <span className="text-red-500">*</span>
                                    </label>
                                    <CustomDropdown
                                        label=""
                                        placeholder="Select Status"
                                        options={["Draft", "Published"]}
                                        selected={formData.status}
                                        onChange={(val) => updateField('status', val)}
                                    />
                                </div>

                                {/* Visibility */}
                                <div className='mt-'>
                                    <label className="mb-2 block text-sm font-semibold text-[#0B1E3D]">
                                        Visibility <span className="text-red-500">*</span>
                                    </label>
                                    <CustomDropdown
                                        label=""
                                        placeholder="Select Visibility"
                                        options={["Public", "Private"]}
                                        selected={formData.visibility}
                                        onChange={(val) => updateField('visibility', val)}
                                    />
                                </div>

                                {/* Publish Date */}
                                <div className='mt-'>
                                    <label className="mb-2 block text-sm font-semibold text-[#0B1E3D]">
                                        Publish Immediately <span className="text-red-500">*</span>
                                    </label>
                                    <DateInputField
                                        selected={formData.publishDate}
                                        onChange={(date) => updateField('publishDate', date)}
                                    />
                                </div>

                                {/* Author */}
                                <div className='mt-'>
                                    <label className="mb-2 block text-sm font-semibold text-[#0B1E3D]">
                                        Author <span className="text-red-500">*</span>
                                    </label>
                                    <CustomDropdown
                                        label=""
                                        placeholder="Select Author Type"
                                        options={["Admin User"]}
                                        selected={formData.author}
                                        onChange={(val) => updateField('author', val)}
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-[#0B1E3D]">
                                        Reading Time
                                    </label>

                                    <div className="relative">
                                        <input
                                            type="number"
                                            placeholder="5"
                                            value={formData.readingTime}
                                            onChange={(e) => updateField('readingTime', e.target.value)}
                                            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#D97706] focus:ring-0 focus:outline-none"
                                        />

                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                                            min
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Post / Page Options */}
                        <div className="overflow-hidden p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                            <div className="border-b border-slate-100 pb-4">
                                <h3 className="text-base font-semibold text-[#0B1E3D]">
                                    Post Options
                                </h3>
                            </div>

                            {/* Show in Navigation */}
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h4 className="text-sm font-semibold text-[#0B1E3D]">
                                        Show in Navigation
                                    </h4>

                                    <p className="mt-1 text-xs text-slate-500">
                                        Display this page in the website navigation menu.
                                    </p>
                                </div>

                                <div className='flex gap-2 items-center mt-1.5'>
                                    <button
                                        onClick={() => updateField('showInNavigation', !formData.showInNavigation)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none 
                                        ${formData.showInNavigation ? "bg-[#D97706]" : "bg-gray-300"}`}>
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 
                                            ${formData.showInNavigation ? "translate-x-6" : "translate-x-1"}`}
                                        />
                                    </button>
                                </div>
                            </div>

                            {/* Show in Footer */}
                            <div className="flex items-start justify-between gap-4 border-t border-slate-100 pt-5">
                                <div>
                                    <h4 className="text-sm font-semibold text-[#0B1E3D]">
                                        Show in Footer
                                    </h4>

                                    <p className="mt-1 text-xs text-slate-500">
                                        Display this page in the footer section.
                                    </p>
                                </div>

                                <div className='flex gap-2 items-center mt-1.5'>
                                    <button
                                        onClick={() => updateField('showInFooter', !formData.showInFooter)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none 
                                        ${formData.showInFooter ? "bg-[#D97706]" : "bg-gray-300"}`}>
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 
                                            ${formData.showInFooter ? "translate-x-6" : "translate-x-1"}`}
                                        />
                                    </button>
                                </div>
                            </div>

                            {/* Allow Comments */}
                            <div className="flex items-start justify-between gap-4 border-t border-slate-100 pt-5">
                                <div>
                                    <h4 className="text-sm font-semibold text-[#0B1E3D]">
                                        Allow Comments
                                    </h4>

                                    <p className="mt-1 text-xs text-slate-500">
                                        Visitors can comment on this page.
                                    </p>
                                </div>

                                <div className='flex gap-2 items-center mt-1.5'>
                                    <button
                                        onClick={() => updateField('allowComments', !formData.allowComments)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none 
                                        ${formData.allowComments ? "bg-[#D97706]" : "bg-gray-300"}`}>
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 
                                            ${formData.allowComments ? "translate-x-6" : "translate-x-1"}`}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* SEO Preview */}
                        <div className="overflow-hidden p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                            <div className="border-b border-slate-100 pb-4">
                                <h3 className="text-base font-semibold text-[#0B1E3D]">
                                    SEO Preview
                                </h3>
                            </div>

                            <div className="space-y-4">

                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="truncate text-[11px] text-slate-500">
                                        https://www.biddrive.com/blog/car-buying-guide
                                    </p>

                                    <h4 className="mt-2 cursor-pointer text-sm font-semibold text-[#D97706] hover:underline">
                                        Complete Car Buying Guide | BidDrive
                                    </h4>

                                    <p className="mt-2 text-xs leading-5 text-slate-500">
                                        Learn everything about buying auction vehicles with
                                        expert tips and practical advice.
                                    </p>
                                </div>

                                <div className="space-y-2 rounded-xl border border-green-200 bg-green-50 p-4">

                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-medium text-slate-600">
                                            SEO Score
                                        </span>

                                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                                            Good
                                        </span>
                                    </div>

                                    <div className="flex justify-between text-xs text-slate-500">
                                        <span>Title Length</span>
                                        <span>54 / 60</span>
                                    </div>

                                    <div className="flex justify-between text-xs text-slate-500">
                                        <span>Description</span>
                                        <span>138 / 160</span>
                                    </div>

                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* buttons */}
            <div className="py-6 flex items-start justify-start gap-3 bg-white border-t border-slate-200">
                {/* Cancel Button */}
                <button
                    onClick={() => setCurrentPage('add-new-page')}
                    type="button"
                    className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                >
                    Cancel
                </button>

                {/* Save & Publish Button */}
                <button
                    type="button"
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-[#D97706] hover:bg-amber-700 rounded-xl transition-colors shadow-sm shadow-blue-500/20"
                >
                    {initialData ? 'Update Post' : 'Save & Publish'}
                </button>
            </div>
        </div>
    )
}

export default CreateBlogPost;
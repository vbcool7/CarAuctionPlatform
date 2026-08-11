
import React, { useState } from 'react';
import { ArrowLeft, ChevronUp, ImagePlus } from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import CustomDropdown from '../SharedComponents/CustomDropDown';
import DateInputField from '../UserManagement/Shared/DateInputField';

function CreateCustomPage({ setCurrentPage }) {

    const [content, setContent] = useState("");

    const [navigationToggle, setNavigationToggle] = useState(true);
    const [footerToggle, setFooterToggle] = useState(true);
    const [commentsToggle, setCommentsToggle] = useState(true);

    // field update
    const updateField = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <div>
            {/* header */}
            <div className="mb-6 flex flex-col gap-4 pb-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">

                    <div>
                        <h1 className="text-xl font-bold text-[#0B1E3D] sm:text-2xl">
                            Create Custom Page
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Add a new custom page to manage your website content.
                        </p>
                    </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setCurrentPage("all-pages")}
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

            <div className='w-full flex justify-between gap-6'>

                {/* =---------- left ------------ */}
                <div className='w-[65%] grid grid-cols-1 gap-6 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm'>

                    {/* Page Title */}
                    <div className="">
                        <label className="block text-[11px] sm:text-[14px] font-semibold text-[#0B1E3D] mb-2">
                            Page Title <span className="text-red-600">*</span>
                        </label>

                        <input
                            type="text"
                            placeholder="Enter page title"
                            className="w-full h-10 rounded-lg border border-slate-200 px-3 text-[10px] sm:text-[13px] text-slate-700 placeholder:text-slate-400 outline-none transition-all focus:border-[#D97706] focus:ring-2 focus:ring-amber-100"
                        />
                    </div>

                    {/* Page Slug */}
                    <div className="">
                        <label className="block text-[11px] sm:text-[14px] font-semibold text-[#0B1E3D] mb-2">
                            Page Slug <span className="text-red-600">*</span>
                        </label>

                        <input
                            type="text"
                            placeholder="enter-page-slug"
                            className="w-full h-10 rounded-lg border border-slate-200 px-3 text-[10px] sm:text-[13px] text-slate-700 placeholder:text-slate-400 outline-none transition-all focus:border-[#D97706] focus:ring-2 focus:ring-amber-100"
                        />
                        <p className='mt-1 text-xs text-gray-500'>The slug is the URL friendly version of the page title.</p>
                    </div>

                    {/* Meta Title */}
                    <div className="">
                        <label className="block text-[11px] sm:text-[14px] font-semibold text-[#0B1E3D] mb-2">
                            Mata Title
                        </label>

                        <input
                            type="text"
                            placeholder="Enter meta title (SEO)"
                            className="w-full h-10 rounded-lg border border-slate-200 px-3 text-[10px] sm:text-[13px] text-slate-700 placeholder:text-slate-400 outline-none transition-all focus:border-[#D97706] focus:ring-2 focus:ring-amber-100"
                        />
                    </div>

                    {/* Description */}
                    <div className="">
                        <label className="block text-[11px] sm:text-[14px] font-semibold text-[#0B1E3D] mb-2">
                            Meta Description
                        </label>

                        <textarea
                            rows="4"
                            maxLength={200}
                            placeholder="Enter meta description (SEO)"
                            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-[10px] sm:text-[13px] text-slate-700 placeholder:text-slate-400 outline-none resize-none transition-all focus:border-[#D97706] focus:ring-2 focus:ring-amber-100"
                        />
                        <div className="flex justify-end mt-1">
                            <span className="text-[9px] sm:text-[11px] text-slate-400">0 / 200</span>
                        </div>
                    </div>

                    {/* page content */}
                    <div className="">
                        <label className="block text-[11px] sm:text-[14px] font-semibold text-[#0B1E3D] mb-2">
                            Page Content <span className="text-red-600">*</span>
                        </label>

                        <div className=''>
                            <RichTextEditor value={content} onChange={setContent} />
                        </div>
                    </div>
                </div>

                {/* =---------- right ------------ */}
                <div className='w-[35%] grid grid-cols-1 gap-6 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm'>
                    <div className="space-y-5">

                        {/* Publish Settings */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="mb-5 flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-[#0B1E3D]">
                                    Publish Settings
                                </h3>
                                <ChevronUp className="h-4 w-4 text-slate-500" />
                            </div>

                            <div className="space-y-4">
                                <CustomDropdown
                                    label="Status"
                                    options={["Draft", "Published"]}
                                    value="Draft"
                                />

                                <CustomDropdown
                                    label="Visibility"
                                    options={["Public", "Private"]}
                                    value="Public"
                                />

                                <DateInputField
                                    label="Publish Date"
                                    value="May 21, 2024 10:30 AM"
                                />
                            </div>
                        </div>

                        {/* Page Options */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="mb-5 flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-[#0B1E3D]">
                                    Page Options
                                </h3>
                                <ChevronUp className="h-4 w-4 text-slate-500" />
                            </div>

                            <div className="space-y-5">

                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-sm font-medium text-[#0B1E3D]">
                                            Show in Navigation Menu
                                        </h4>
                                        <p className="mt-1 text-xs text-slate-500">
                                            Display this page in the website menu
                                        </p>
                                    </div>

                                    <div className='flex gap-2 items-center mt-1.5'>
                                        <button
                                            onClick={() => {
                                                setNavigationToggle(!navigationToggle)
                                                updateField('isNavigationToggle', !navigationToggle)
                                            }}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none 
                                        ${navigationToggle ? "bg-[#D97706]" : "bg-gray-300"}`}>
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 
                                            ${navigationToggle ? "translate-x-6" : "translate-x-1"}`}
                                            />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-sm font-medium text-[#0B1E3D]">
                                            Show in Footer
                                        </h4>
                                        <p className="mt-1 text-xs text-slate-500">
                                            Display this page in the footer section
                                        </p>
                                    </div>

                                    <div className='flex gap-2 items-center mt-1.5'>
                                        <button
                                            onClick={() => {
                                                setFooterToggle(!footerToggle)
                                                updateField('isFooterToggle', !footerToggle)
                                            }}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none 
                                        ${footerToggle ? "bg-[#D97706]" : "bg-gray-300"}`}>
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 
                                            ${footerToggle ? "translate-x-6" : "translate-x-1"}`}
                                            />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-sm font-medium text-[#0B1E3D]">
                                            Allow Comments
                                        </h4>
                                        <p className="mt-1 text-xs text-slate-500">
                                            Allow users to comment on this page
                                        </p>
                                    </div>

                                    <div className='flex gap-2 items-center mt-1.5'>
                                        <button
                                            onClick={() => {
                                                setCommentsToggle(!commentsToggle)
                                                updateField('isCommentsToggle', !commentsToggle)
                                            }}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none 
                                        ${commentsToggle ? "bg-[#D97706]" : "bg-gray-300"}`}>
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 
                                            ${commentsToggle ? "translate-x-6" : "translate-x-1"}`}
                                            />
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Featured Image */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <h3 className="mb-4 text-sm font-semibold text-[#0B1E3D]">
                                Featured Image
                            </h3>

                            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center transition hover:border-[#D97706] hover:bg-amber-50/30">
                                <ImagePlus className="mb-3 h-8 w-8 text-slate-400" />

                                <p className="text-sm font-medium text-[#0B1E3D]">
                                    Click to upload image
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                    or drag and drop
                                </p>

                                <p className="mt-3 text-[11px] leading-5 text-slate-400">
                                    Recommended size: 1200 × 630 px
                                    <br />
                                    Max size: 2MB (JPG, PNG)
                                </p>

                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                />
                            </label>
                        </div>

                    </div>
                </div>
            </div>

            <div className="py-6 flex items-start justify-start gap-3 bg-white border-t border-slate-200">
                {/* Cancel Button */}
                <button
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
                    Save & Publish
                </button>
            </div>

        </div>
    )
}

export default CreateCustomPage;
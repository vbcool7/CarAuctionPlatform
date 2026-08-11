import React from 'react';
import { ArrowLeft, Info } from 'lucide-react';

function EditDisputeCategory({ categoryId, setCurrentPage }) {

    const icons = [
        { key: 'card', bg: 'bg-red-50', border: 'border-red-500', color: 'text-red-500' },
        { key: 'box', bg: 'bg-orange-50', border: 'border-orange-200', color: 'text-orange-500' },
        { key: 'truck', bg: 'bg-blue-50', border: 'border-blue-200', color: 'text-blue-500' },
        { key: 'refresh', bg: 'bg-indigo-50', border: 'border-indigo-200', color: 'text-indigo-500' },
        { key: 'dollar', bg: 'bg-amber-50', border: 'border-amber-200', color: 'text-amber-500' },
        { key: 'user', bg: 'bg-green-50', border: 'border-green-200', color: 'text-green-500' },
        { key: 'chat', bg: 'bg-blue-50', border: 'border-blue-200', color: 'text-blue-500' },
    ];

    return (
        <div className="w-full bg-white border border-slate-100 rounded-2xl p-4 sm:p-5 shadow-sm">

            {/* Header */}
            <div className="flex items-start justify-between mb-5">
                <div>
                    <h3 className="text-xl font-bold text-[#0B1E3D]">Edit Dispute Category</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">Update the details, behavior, and SLA settings for this dispute category.</p>
                </div>

                <button
                    onClick={() => setCurrentPage("dispute-categories")}
                    className="w-full sm:w-auto py-2 px-4 inline-flex items-center justify-center gap-2 rounded-lg border border-[#D97706] bg-white text-xs sm:text-sm font-medium text-[#D97706] transition-colors duration-200 hover:bg-amber-50 active:scale-[0.98]"
                >
                    <ArrowLeft className="w-4 h-4 shrink-0" />
                    <span>Back to Categories</span>
                </button>
            </div>

            {/* Top 3-column grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* Column 1 */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-6">

                    {/* Section Header */}
                    <div className="mb-6">
                        <h3 className="text-base font-bold text-[#0B1E3D]">
                            Category Details
                        </h3>
                        <p className="mt-1 text-xs text-slate-500">
                            Update the basic information and appearance of this dispute category.
                        </p>
                    </div>

                    <div className="space-y-5">

                        {/* Category Name */}
                        <div>
                            <label className="block text-xs font-semibold text-[#0B1E3D]">
                                Category Name <span className="text-red-500">*</span>
                            </label>

                            <div className="relative mt-2">
                                <input
                                    type="text"
                                    defaultValue="Payment Not Received"
                                    maxLength={100}
                                    className="w-full h-10 border border-slate-200 rounded-lg bg-white px-3 pr-14 text-xs text-[#0B1E3D] outline-none transition-all placeholder:text-slate-400 focus:border-[#D97706] focus:ring-2 focus:ring-amber-100"
                                />

                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-slate-400">
                                    19/100
                                </span>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xs font-semibold text-[#0B1E3D]">
                                Description <span className="text-red-500">*</span>
                            </label>

                            <div className="relative mt-2">
                                <textarea
                                    defaultValue="Buyer claims payment was debited but not received."
                                    maxLength={500}
                                    rows={4}
                                    className="w-full border border-slate-200 rounded-lg bg-white px-3 py-2.5 pr-14 text-xs text-[#0B1E3D] resize-none outline-none transition-all placeholder:text-slate-400 focus:border-[#D97706] focus:ring-2 focus:ring-amber-100"
                                />

                                <span className="absolute right-3 bottom-2.5 text-[10px] font-medium text-slate-400">
                                    48/500
                                </span>
                            </div>
                        </div>

                        {/* Category Icon */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-xs font-semibold text-[#0B1E3D]">
                                    Category Icon
                                </label>

                                <span className="text-[10px] text-slate-400">
                                    Select one
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-2.5">
                                {icons.map((icon, idx) => (
                                    <button
                                        key={icon.key}
                                        type="button"
                                        className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-all hover:-translate-y-0.5 ${icon.bg} ${idx === 0
                                            ? `${icon.border} ring-2 ring-amber-100`
                                            : "border-slate-200 hover:border-slate-300"
                                            }`}
                                    >
                                        <span
                                            className={`w-4 h-4 rounded-sm ${icon.color}`}
                                        />
                                    </button>
                                ))}
                            </div>

                            <p className="mt-2 text-[10px] leading-4 text-slate-400">
                                Choose an icon that best represents this dispute category.
                            </p>
                        </div>

                        {/* Priority / Display Order / Status */}
                        <div className="pt-5 border-t border-slate-100">

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                {/* Priority Level */}
                                <div>
                                    <label className="block text-xs font-semibold text-[#0B1E3D]">
                                        Priority Level <span className="text-red-500">*</span>
                                    </label>

                                    <select
                                        className="mt-2 w-full h-10 border border-slate-200 rounded-lg bg-white px-3 text-xs text-[#0B1E3D] outline-none transition-all focus:border-[#D97706] focus:ring-2 focus:ring-amber-100"
                                    >
                                        <option>High</option>
                                        <option>Medium</option>
                                        <option>Low</option>
                                    </select>
                                </div>

                                {/* Display Order */}
                                {/* <div>
                                    <label className="block text-xs font-semibold text-[#0B1E3D]">
                                        Display Order <span className="text-red-500">*</span>
                                    </label>

                                    <input
                                        type="number"
                                        defaultValue={1}
                                        className="mt-2 w-full h-10 border border-slate-200 rounded-lg bg-white px-3 text-xs text-[#0B1E3D] outline-none transition-all focus:border-[#D97706] focus:ring-2 focus:ring-amber-100"
                                    />

                                    <p className="mt-1.5 text-[10px] text-slate-400">
                                        Lower numbers appear first.
                                    </p>
                                </div> */}

                                {/* Status */}
                                <div>
                                    <label className="block text-xs font-semibold text-[#0B1E3D]">
                                        Status <span className="text-red-500">*</span>
                                    </label>

                                    <select
                                        className="mt-2 w-full h-10 border border-slate-200 rounded-lg bg-white px-3 text-xs text-[#0B1E3D] outline-none transition-all focus:border-[#D97706] focus:ring-2 focus:ring-amber-100"
                                    >
                                        <option>Active</option>
                                        <option>Inactive</option>
                                    </select>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>

                {/* Column 2: Category Settings + Visibility */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-6">

                    {/* Section Header */}
                    <div className="mb-4">
                        <h3 className="text-base font-bold text-[#0B1E3D]">
                            Category Settings
                        </h3>

                        {/* <p className="mt-1 text-xs text-slate-500">
            Configure how this category behaves when managing disputes.
        </p> */}
                    </div>

                    <div className="space-y-5">

                        {/* Category Type */}
                        <div>
                            <label className="block text-xs font-semibold text-[#0B1E3D]">
                                Category Type
                            </label>

                            <select
                                className="mt-2 w-full h-10 border border-slate-200 rounded-lg bg-white px-3 text-xs text-[#0B1E3D] outline-none transition-all focus:border-[#D97706] focus:ring-2 focus:ring-amber-100"
                            >
                                <option>Standard</option>
                                <option>Financial</option>
                                <option>Policy</option>
                            </select>
                        </div>

                        {/* Allow Sub-Categories */}
                        <div>
                            <label className="block text-xs font-semibold text-[#0B1E3D]">
                                Allow Sub-Categories
                            </label>

                            <select
                                className="mt-2 w-full h-10 border border-slate-200 rounded-lg bg-white px-3 text-xs text-[#0B1E3D] outline-none transition-all focus:border-[#D97706] focus:ring-2 focus:ring-amber-100"
                            >
                                <option>Yes</option>
                                <option>No</option>
                            </select>
                        </div>

                        {/* Enable for Disputes */}
                        <div>
                            <label className="block text-xs font-semibold text-[#0B1E3D]">
                                Enable for Disputes
                            </label>

                            <select
                                className="mt-2 w-full h-10 border border-slate-200 rounded-lg bg-white px-3 text-xs text-[#0B1E3D] outline-none transition-all focus:border-[#D97706] focus:ring-2 focus:ring-amber-100"
                            >
                                <option>Yes</option>
                                <option>No</option>
                            </select>
                        </div>

                        {/* Default Status */}
                        <div>
                            <label className="block text-xs font-semibold text-[#0B1E3D]">
                                Default Status
                            </label>

                            <p className="mt-1 text-[10px] leading-4 text-slate-400">
                                This will be the initial status when a dispute is created.
                            </p>

                            <select
                                className="mt-2 w-full h-10 border border-slate-200 rounded-lg bg-white px-3 text-xs text-[#0B1E3D] outline-none transition-all focus:border-[#D97706] focus:ring-2 focus:ring-amber-100"
                            >
                                <option>Open</option>
                                <option>Pending</option>
                            </select>
                        </div>

                    </div>


                    {/* Visibility Section */}
                    <div className="mt-6 border-t border-slate-100">

                        <div className="mb-4">
                            <h3 className="text-sm font-bold text-[#0B1E3D]">
                                Visibility
                            </h3>

                            {/* <p className="mt-1 text-[10px] leading-4 text-slate-400">
                Choose who can raise or view disputes under this category.
            </p> */}
                        </div>

                        {/* Visible To */}
                        <div>
                            <label className="block text-xs font-semibold text-[#0B1E3D]">
                                Visible To <span className="text-red-500">*</span>
                            </label>

                            <div className="mt-2 min-h-10 flex flex-wrap items-center gap-2 border border-slate-200 rounded-lg p-2.5 bg-white">
                                {["Buyers", "Sellers", "Admins", "Support Agents"].map((tag) => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center gap-1.5 bg-violet-50 text-violet-700 border border-violet-100 text-[10px] font-semibold px-2.5 py-1.5 rounded-md"
                                    >
                                        {tag}

                                        <button
                                            type="button"
                                            className="flex items-center justify-center w-3.5 h-3.5 rounded-full text-violet-400 hover:bg-violet-100 hover:text-violet-700 transition-colors"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>

                            <p className="mt-2 text-[10px] leading-4 text-slate-400">
                                Select who can raise or view disputes under this category.
                            </p>
                        </div>

                    </div>

                </div>

                {/* Column 3: Category Summary */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-6">

                    {/* Header */}
                    <div className="mb-5">
                        <h3 className="text-base font-bold text-[#0B1E3D]">
                            Category Summary
                        </h3>

                        <p className="mt-1 text-[10px] leading-4 text-slate-400">
                            Review the current configuration and settings of this category.
                        </p>
                    </div>

                    {/* Category Preview */}
                    <div className="flex flex-col items-center text-center pb-5 border-b border-slate-100">

                        {/* Icon */}
                        <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mb-3">
                            {/* <span className="w-7 h-7 rounded-lg bg-red-500 shadow-sm" /> */}
                        </div>

                        {/* Category Name */}
                        <h4 className="text-sm font-bold text-[#0B1E3D]">
                            Payment Not Received
                        </h4>

                        {/* Priority */}
                        <span className="inline-flex items-center mt-2 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-600 border border-rose-100">
                            High Priority
                        </span>

                        {/* Description */}
                        <p className="max-w-65 mt-2 text-[11px] leading-4 text-slate-500">
                            Buyer claims payment was debited but not received.
                        </p>
                    </div>


                    {/* Category Details */}
                    <div className="mt-5 space-y-3">

                        {[
                            ["Category Type", "Standard"],
                            ["Allow Sub-Categories", "Yes"],
                            ["Status", "Active"],
                            ["Priority Level", "High"],
                            ["Auto Close", "7 Days"],
                            ["Initial Response SLA", "24 Hours"],
                            ["Resolution SLA", "7 Days"],
                            ["Final Response SLA", "24 Hours"],
                            ["Visible To", "Buyers, Sellers, Admins, Support Agents"],
                            ["Default Status", "Open"],
                            ["Created On", "May 20, 2024 10:30 AM"],
                            ["Created By", "Admin User"],
                        ].map(([label, value]) => (
                            <div
                                key={label}
                                className="flex items-start justify-between gap-4"
                            >
                                <span className="text-xs text-slate-500 shrink-0">
                                    {label}
                                </span>

                                <span
                                    className={`text-xs font-medium text-[#0B1E3D] text-right leading-4 ${label === "Visible To" ? "max-w-40" : ""
                                        }`}
                                >
                                    {value}
                                </span>
                            </div>
                        ))}

                    </div>

                    {/* Info Notice */}
                    <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-violet-200 bg-violet-50/70 px-3.5 py-3">

                        <div className="w-7 h-7 shrink-0 rounded-lg bg-violet-100 flex items-center justify-center">
                            <Info className="w-4 h-4 text-violet-600" />
                        </div>

                        <p className="text-[10px] leading-4 text-violet-700 pt-0.5">
                            Update the information and save your changes to keep the category settings up to date.
                        </p>

                    </div>
                </div>
            </div>

            {/* Bottom row: Auto Close + SLA Time Limits + SLA Breach Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">

                {/* Auto Close Settings */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-6">

                    {/* Header */}
                    <div className="mb-5">
                        <h3 className="text-base font-bold text-[#0B1E3D]">
                            Auto Close Settings
                        </h3>

                        <p className="mt-1 text-[10px] leading-4 text-slate-400">
                            Automatically close inactive disputes after a defined period.
                        </p>
                    </div>

                    {/* Enable Auto Close */}
                    <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100">
                        <div>
                            <label className="text-xs font-semibold text-[#0B1E3D]">
                                Enable Auto Close
                            </label>

                            <p className="mt-1 text-[10px] text-slate-400">
                                Close disputes with no activity.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full bg-[#D97706] transition-colors"
                        >
                            <span className="inline-block h-5 w-5 translate-x-5 rounded-full bg-white shadow-sm transition-transform" />
                        </button>
                    </div>

                    {/* Duration */}
                    <div className="mt-5">
                        <label className="block text-xs font-semibold text-[#0B1E3D]">
                            Auto Close After <span className="text-red-500">*</span>
                        </label>

                        <div className="mt-2 flex items-center gap-2">
                            <input
                                type="number"
                                defaultValue={7}
                                className="w-20 h-10 border border-slate-200 rounded-lg bg-white px-3 text-xs text-[#0B1E3D] outline-none transition-all focus:border-[#D97706] focus:ring-2 focus:ring-amber-100"
                            />

                            <select
                                className="h-10 flex-1 border border-slate-200 rounded-lg bg-white px-3 text-xs text-[#0B1E3D] outline-none transition-all focus:border-[#D97706] focus:ring-2 focus:ring-amber-100"
                            >
                                <option>Days</option>
                                <option>Hours</option>
                            </select>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="mt-5 rounded-lg border border-violet-100 bg-violet-50/60 px-3 py-2.5">
                        <p className="text-[10px] leading-4 text-violet-700">
                            Disputes will be automatically closed if no activity occurs for the selected duration.
                        </p>
                    </div>

                </div>


                {/* SLA Time Limits */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-6">

                    {/* Header */}
                    <div className="mb-5">
                        <h3 className="text-base font-bold text-[#0B1E3D]">
                            SLA Time Limits
                        </h3>

                        <p className="mt-1 text-[10px] leading-4 text-slate-400">
                            Define response and resolution time limits for disputes.
                        </p>
                    </div>

                    {/* SLA Fields */}
                    <div className="space-y-4">
                        {[
                            {
                                label: "Initial Response Time",
                                val: 24,
                                unit: "Hours",
                            },
                            {
                                label: "Resolution Time",
                                val: 7,
                                unit: "Days",
                            },
                            {
                                label: "Final Response Time",
                                val: 24,
                                unit: "Hours",
                            },
                        ].map((item) => (
                            <div key={item.label}>
                                <label className="block text-xs font-semibold text-[#0B1E3D]">
                                    {item.label} <span className="text-red-500">*</span>
                                </label>

                                <div className="mt-2 flex items-center gap-2">
                                    <input
                                        type="number"
                                        defaultValue={item.val}
                                        className="w-20 h-10 border border-slate-200 rounded-lg bg-white px-3 text-xs text-[#0B1E3D] outline-none transition-all focus:border-[#D97706] focus:ring-2 focus:ring-amber-100"
                                    />

                                    <select
                                        className="h-10 flex-1 border border-slate-200 rounded-lg bg-white px-3 text-xs text-[#0B1E3D] outline-none transition-all focus:border-[#D97706] focus:ring-2 focus:ring-amber-100"
                                    >
                                        <option>{item.unit}</option>
                                        <option>
                                            {item.unit === "Hours" ? "Days" : "Hours"}
                                        </option>
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Info */}
                    <div className="mt-5 rounded-lg border border-amber-100 bg-amber-50/60 px-3 py-2.5">
                        <p className="text-[10px] leading-4 text-amber-700">
                            SLA timers start when the dispute is created.
                        </p>
                    </div>

                </div>


                {/* SLA Breach Actions */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-6">

                    {/* Header */}
                    <div className="mb-5">
                        <h3 className="text-base font-bold text-[#0B1E3D]">
                            SLA Breach Actions
                        </h3>

                        <p className="mt-1 text-[10px] leading-4 text-slate-400">
                            Choose what action should be taken when an SLA is exceeded.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                        {[
                            ["Initial Response", "Send Reminder"],
                            ["Resolution", "Escalate to Admin"],
                            ["Final Response", "Send Reminder"],
                            ["Auto Close", "Enabled"],
                        ].map(([label, val]) => (
                            <div
                                key={label}
                                className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100 last:border-0 last:pb-0"
                            >
                                <label className="text-xs font-medium text-[#0B1E3D]">
                                    {label}
                                </label>

                                <select
                                    className="h-9 max-w-35 border border-slate-200 rounded-lg bg-white px-2.5 text-[10px] text-[#0B1E3D] outline-none transition-all focus:border-[#D97706] focus:ring-2 focus:ring-amber-100"
                                >
                                    <option>{val}</option>
                                    <option>Send Reminder</option>
                                    <option>Escalate to Admin</option>
                                    <option>Auto Close</option>
                                </select>
                            </div>
                        ))}
                    </div>

                    {/* Info */}
                    <div className="mt-5 rounded-lg border border-emerald-100 bg-emerald-50/60 px-3 py-2.5">
                        <p className="text-[10px] leading-4 text-emerald-700">
                            Actions will be triggered when SLA time limits are exceeded.
                        </p>
                    </div>

                </div>

            </div>

            {/* Bottom action buttons */}
            <div className="mt-6 pt-5 border-t border-slate-200 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">

                {/* Cancel */}
                <button
                    type="button"
                    onClick={() => setCurrentPage("dispute-categories")}
                    className="inline-flex items-center justify-center h-10 px-5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-[#0B1E3D] transition-all"
                >
                    Cancel
                </button>

                {/* Save Changes */}
                <button
                    type="button"
                    className="inline-flex items-center justify-center h-10 px-6 rounded-lg bg-[#D97706] text-xs font-semibold text-white shadow-sm hover:bg-amber-700 active:scale-[0.98] transition-all"
                >
                    Save Changes
                </button>

            </div>
        </div>
    );
}

export default EditDisputeCategory;
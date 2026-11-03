
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { DISPUTE_ICONS, DEFAULT_ICON_KEY } from '../../utils/disputeIcons';

const APPLIES_TO = [
    { value: 'both', label: 'Buyer & Seller' },
    { value: 'buyer', label: 'Buyer only' },
    { value: 'seller', label: 'Seller only' },
];

function CategoryForm({ initial, submitLabel, submitting, onSubmit, onCancel, showActive }) {

    const [name, setName] = useState(initial?.name || '');
    const [description, setDescription] = useState(initial?.description || '');
    const [icon, setIcon] = useState(initial?.icon || DEFAULT_ICON_KEY);
    const [appliesTo, setAppliesTo] = useState(initial?.appliesTo || 'both');
    const [isActive, setIsActive] = useState(initial?.isActive ?? true);

    const handleSubmit = (e) => {
        e.preventDefault();
        const cleanName = name.trim().replace(/\s+/g, ' ');

        if (cleanName.length < 2 || cleanName.length > 60) return toast.error('Category name must be 2 to 60 characters');
        if (description.trim().length > 300) return toast.error('Description is too long (max 300 characters)');

        const body = { name: cleanName, description: description.trim(), icon, appliesTo };
        if (showActive) body.isActive = isActive;
        onSubmit(body);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start max-w-6xl">

            {/* ============================= LEFT ============================= */}
            <div className="lg:col-span-2">
                <form
                    onSubmit={handleSubmit}
                    className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6 max-w-2xl">

                    <div>
                        <label className="block text-[13px] font-medium text-slate-700 mb-1">
                            Category Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            maxLength={60}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Payment issue"
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#D97706]"
                        />
                    </div>

                    <div>
                        <label className="block text-[13px] font-medium text-slate-700 mb-1">Description</label>
                        <textarea
                            value={description}
                            maxLength={300}
                            rows={3}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Short help text shown to buyer / seller (optional)"
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#D97706]"
                        />
                        <p className="mt-1 text-[11px] text-slate-400 text-right">{description.length}/300</p>
                    </div>

                    <div>
                        <label className="block text-[13px] font-medium text-slate-700 mb-2">Applies To</label>
                        <div className="flex flex-wrap gap-2">
                            {APPLIES_TO.map((o) => (
                                <button
                                    key={o.value}
                                    type="button"
                                    onClick={() => setAppliesTo(o.value)}
                                    className={`rounded-lg border px-4 py-2 text-[13px] font-medium transition-colors ${appliesTo === o.value
                                        ? 'border-[#D97706] bg-amber-50 text-[#D97706]'
                                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                                    {o.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-[13px] font-medium text-slate-700 mb-2">Icon</label>
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(DISPUTE_ICONS).map(([key, Icon]) => (
                                <button
                                    key={key}
                                    type="button"
                                    title={key}
                                    onClick={() => setIcon(key)}
                                    className={`w-11 h-11 rounded-lg border flex items-center justify-center transition-colors ${icon === key
                                        ? 'border-[#D97706] bg-amber-50 text-[#D97706]'
                                        : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                                    <Icon size={18} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {showActive && (
                        <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                            Active (This category will be visible to buyers and sellers when raising a dispute.)
                        </label>
                    )}

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={submitting}
                            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="rounded-lg bg-[#D97706] px-5 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50">
                            {submitting ? 'Saving...' : submitLabel}
                        </button>
                    </div>
                </form>
            </div>

            {/* ============================= RIGHT ============================= */}
            <div className="space-y-4">

                {/* Live Card Preview */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                            Live Preview
                        </span>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                            {isActive ? 'Active' : 'Inactive'}
                        </span>
                    </div>

                    <div className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/50 p-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200/60 flex items-center justify-center text-[#D97706] shrink-0">
                            {DISPUTE_ICONS[icon] ? (
                                React.createElement(DISPUTE_ICONS[icon], { size: 20 })
                            ) : (
                                <span className="text-xs font-bold text-[#D97706]">?</span>
                            )}
                        </div>
                        <div className="space-y-1 min-w-0">
                            <h4 className="text-sm font-medium text-slate-800 truncate">
                                {name || 'Category Name'}
                            </h4>
                            <p className="text-xs text-slate-500 line-clamp-2">
                                {description || 'No description provided for this category.'}
                            </p>
                            <div className="pt-1">
                                <span className="inline-block rounded bg-amber-100/60 px-2 py-0.5 text-[10px] font-medium text-[#D97706]">
                                    {APPLIES_TO.find((o) => o.value === appliesTo)?.label || appliesTo}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Helpful Guidelines Card */}
                <div className="rounded-xl border border-amber-200/80 bg-amber-50/40 p-5 shadow-sm">
                    <h4 className="text-xs font-semibold text-amber-900 mb-2 flex items-center gap-1.5">
                        💡 Quick Tips
                    </h4>
                    <ul className="space-y-2 text-xs text-amber-800/90 leading-relaxed">
                        <li className="flex items-start gap-1.5">
                            <span className="text-amber-600">•</span>
                            <span>Keep the category name clear and readable so users can easily select it.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                            <span className="text-amber-600">•</span>
                            <span>Choose an icon that clearly represents the purpose of the category.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                            <span className="text-amber-600">•</span>
                            <span>Use the description to provide helpful context or instructions for buyers/sellers.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                            <span className="text-amber-600">•</span>
                            <span>Ensure the category is set to 'Active' only when it's fully ready for production.</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default CategoryForm;
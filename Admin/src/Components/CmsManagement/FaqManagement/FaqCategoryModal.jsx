
import React, { useState, useEffect } from 'react';
import { X, FolderPlus, FolderEdit } from 'lucide-react';
import toast from 'react-hot-toast';

import { getFaqIcon } from './faqIcons';
import { useCreateFaqCategory, useUpdateFaqCategory } from '../../../hooks/useFaq';

const FaqCategoryModal = ({ open, onClose, category = null, icons = [] }) => {
    const isEdit = !!category;

    const [name, setName] = useState('');
    const [icon, setIcon] = useState('help');
    const [isActive, setIsActive] = useState(true);
    const [error, setError] = useState('');

    const createMutation = useCreateFaqCategory();
    const updateMutation = useUpdateFaqCategory();
    const saving = createMutation.isPending || updateMutation.isPending;

    useEffect(() => {
        if (!open) return;
        setName(category?.name || '');
        setIcon(category?.icon || 'help');
        setIsActive(category ? category.isActive : true);
        setError('');
    }, [open, category]);

    if (!open) return null;

    const iconOptions = icons.length ? icons : ['help'];

    const handleSubmit = async (e) => {
        e.preventDefault();

        const trimmed = name.trim();
        if (!trimmed) return setError('Name is required');
        if (trimmed.length > 60) return setError('Name can be at most 60 characters');
        setError('');

        try {
            if (isEdit) {
                const res = await updateMutation.mutateAsync({
                    id: category._id,
                    data: { name: trimmed, icon, isActive },
                });
                toast.success(res.message || 'Category updated');
            } else {
                const res = await createMutation.mutateAsync({ name: trimmed, icon });
                toast.success(res.message || 'Category created');
            }
            onClose();
        } catch (err) {
            setError(err?.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-800/50 backdrop-blur-sm px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-100 transition-all transform"
            >
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${isEdit ? 'bg-amber-50 text-[#D97706]' : 'bg-blue-50 text-[#0B1E3D]'}`}>
                            {isEdit ? <FolderEdit size={20} /> : <FolderPlus size={20} />}
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-[#0B1E3D]">
                                {isEdit ? 'Edit Category' : 'Add Category'}
                            </h2>
                            <p className="text-xs text-slate-500">
                                {isEdit ? 'Update FAQ category details' : 'Create a new category for FAQs'}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    {/* name */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">Category Name</label>
                            <span className="text-xs text-slate-400 font-medium">{name.length}/60</span>
                        </div>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            maxLength={60}
                            placeholder="e.g. Payments & Fees"
                            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#D97706] focus:ring-2 focus:ring-[#D97706]/15"
                        />
                    </div>

                    {/* icon */}
                    <div>
                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">Select Icon</label>
                        <div className="grid grid-cols-6 gap-2">
                            {iconOptions.map((key) => {
                                const Icon = getFaqIcon(key);
                                const selected = icon === key;
                                return (
                                    <button
                                        type="button"
                                        key={key}
                                        title={key}
                                        onClick={() => setIcon(key)}
                                        className={`flex h-11 items-center justify-center rounded-xl border transition ${selected
                                            ? 'border-[#D97706] bg-amber-50 text-[#D97706]'
                                            : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                                    >
                                        <Icon size={18} />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* active (only in edit) */}
                    {isEdit && (
                        <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isActive}
                                    onChange={(e) => setIsActive(e.target.checked)}
                                    className="h-4 w-4 rounded border-slate-300 accent-[#D97706]"
                                />
                                <div>
                                    <span className="text-sm font-semibold text-slate-800">Active Status</span>
                                    <p className="text-xs text-slate-500">Shown on the public FAQ page</p>
                                </div>
                            </label>

                            {!isActive && (
                                <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200/60 p-3 text-xs text-amber-800">
                                    <span className="mt-0.5 shrink-0">⚠️</span>
                                    <span>This category and all its FAQs will be hidden from the public FAQ page.</span>
                                </div>
                            )}
                        </div>
                    )}

                    {error && (
                        <div className="rounded-xl bg-red-50 border border-red-200/60 p-3 text-xs text-red-600 font-medium">
                            {error}
                        </div>
                    )}
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-xl bg-[#0B1E3D] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#142b52] disabled:opacity-50 flex items-center gap-2"
                    >
                        {saving ? (
                            <>
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Saving...
                            </>
                        ) : isEdit ? (
                            'Save Changes'
                        ) : (
                            'Create Category'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FaqCategoryModal;
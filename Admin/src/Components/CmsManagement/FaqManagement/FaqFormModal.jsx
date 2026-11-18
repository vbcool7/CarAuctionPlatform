import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useCreateFaq, useUpdateFaq } from '../../../hooks/useFaq';
import { X, FileQuestion } from 'lucide-react';

const Q_MIN = 5, Q_MAX = 300, A_MIN = 3, A_MAX = 2000;

// FAQ add / edit modal
const FaqFormModal = ({ open, onClose, faq = null, categories = [], defaultCategoryId = '' }) => {
    const isEdit = !!faq;

    const [categoryId, setCategoryId] = useState('');
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [error, setError] = useState('');

    const createMutation = useCreateFaq();
    const updateMutation = useUpdateFaq();
    const saving = createMutation.isPending || updateMutation.isPending;

    useEffect(() => {
        if (!open) return;
        setCategoryId(faq?.categoryId || defaultCategoryId || '');
        setQuestion(faq?.question || '');
        setAnswer(faq?.answer || '');
        setIsActive(faq ? faq.isActive : true);
        setError('');
    }, [open, faq, defaultCategoryId]);

    if (!open) return null;

    const options = categories.filter((c) => c.isActive || c._id === faq?.categoryId);
    const noActiveCategory = !categories.some((c) => c.isActive);
    const categoryChanged = isEdit && categoryId && categoryId !== faq.categoryId;

    const handleSubmit = async (e) => {
        e.preventDefault();

        const q = question.trim();
        const a = answer.trim();

        if (!categoryId) return setError('Select a category');
        if (q.length < Q_MIN || q.length > Q_MAX) return setError(`Question must be ${Q_MIN} to ${Q_MAX} characters`);
        if (a.length < A_MIN || a.length > A_MAX) return setError(`Answer must be ${A_MIN} to ${A_MAX} characters`);
        setError('');

        const data = { question: q, answer: a, categoryId, isActive };

        try {
            if (isEdit) {
                const res = await updateMutation.mutateAsync({ id: faq._id, data });
                toast.success(res.message || 'FAQ updated');
            } else {
                const res = await createMutation.mutateAsync(data);
                toast.success(res.message || 'FAQ created');
            }
            onClose();
        } catch (err) {
            setError(err?.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-800/50 backdrop-blur-sm px-4">
            {/* Modal Container (Fixed max height, flex column layout) */}
            <form
                onSubmit={handleSubmit}
                className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-100"
            >
                {/* Fixed Header */}
                <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-6 py-5 bg-slate-50/90 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${isEdit ? 'bg-amber-50 text-[#D97706]' : 'bg-blue-50 text-[#0B1E3D]'}`}>
                            <FileQuestion size={20} />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-[#0B1E3D]">
                                {isEdit ? `Edit FAQ ${faq.faqId ? `(${faq.faqId})` : ''}` : 'Add FAQ'}
                            </h2>
                            <p className="text-xs text-slate-500">
                                {isEdit ? 'Update FAQ question and answer' : 'Create a new frequently asked question'}
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

                {/* Scrollable Content Container (Yahan scrollbar aayega) */}
                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    {noActiveCategory && (
                        <div className="rounded-2xl bg-amber-50 border border-amber-200/60 p-4 text-xs font-medium text-amber-800 flex items-start gap-2">
                            <span className="text-base leading-none">⚠️</span>
                            <span>There is no active category. Create or activate a category first.</span>
                        </div>
                    )}

                    {/* category */}
                    <div>
                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">Category</label>
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#D97706] focus:ring-2 focus:ring-[#D97706]/15"
                        >
                            <option value="">Select category</option>
                            {options.map((c) => (
                                <option key={c._id} value={c._id}>
                                    {c.name}{c.isActive ? '' : ' (inactive)'}
                                </option>
                            ))}
                        </select>

                        {categoryChanged && (
                            <p className="mt-1.5 text-xs font-medium text-amber-600">
                                ℹ️ This FAQ will move to the end of the new category.
                            </p>
                        )}
                    </div>

                    {/* question */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">Question</label>
                            <span className={`text-xs font-medium ${question.length > Q_MAX ? 'text-red-500' : 'text-slate-400'}`}>
                                {question.length}/{Q_MAX}
                            </span>
                        </div>
                        <input
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            maxLength={Q_MAX}
                            placeholder="e.g. How do I place a bid?"
                            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#D97706] focus:ring-2 focus:ring-[#D97706]/15"
                        />
                    </div>

                    {/* answer */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">Answer (Plain Text)</label>
                            <span className={`text-xs font-medium ${answer.length > A_MAX ? 'text-red-500' : 'text-slate-400'}`}>
                                {answer.length}/{A_MAX}
                            </span>
                        </div>
                        <textarea
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            maxLength={A_MAX}
                            rows={5}
                            placeholder="Provide a clear and concise answer..."
                            className="w-full resize-y rounded-xl border border-slate-200 bg-white p-3.5 text-sm text-slate-800 outline-none transition focus:border-[#D97706] focus:ring-2 focus:ring-[#D97706]/15"
                        />
                    </div>

                    {/* active */}
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
                    </div>

                    {error && (
                        <div className="rounded-xl bg-red-50 border border-red-200/60 p-3 text-xs text-red-600 font-medium">
                            {error}
                        </div>
                    )}
                </div>

                {/* Fixed Footer Buttons */}
                <div className="flex shrink-0 items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/90 backdrop-blur-md px-6 py-4">
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
                        disabled={saving || noActiveCategory}
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
                            'Create FAQ'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FaqFormModal;
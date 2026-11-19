
import React, { useState, useEffect } from 'react';
import {
    Plus, Pencil, Trash2, ChevronLeft, ChevronRight, ArrowUp, ArrowDown, BadgeHelp, CheckCircle, XCircle, Layers
} from 'lucide-react';
import toast from 'react-hot-toast';

import SearchBar from '../../SharedComponents/SearchBar';
import FilterDropdown from '../../SharedComponents/FilterDropdown';
import FaqCategoryModal from './FaqCategoryModal';
import FaqFormModal from './FaqFormModal';

import { getPaginationRange } from '../../utils/getPaginationRange';
import {
    useGetFaqCategories, useGetAllFaqs, useUpdateFaq, useMoveFaq, useMoveFaqCategory, useDeleteFaq, useDeleteFaqCategory,
} from '../../../hooks/useFaq';

const LIMIT = 10;

const STATUS_OPTIONS = [
    { label: 'All Status', value: '' },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
];

const errMsg = (err) =>
    err?.response?.data?.message || 'Something went wrong';

const StatCard = ({ label, value, icon: Icon, iconBg, iconColor }) => (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div>
            <p className="text-xs font-medium text-slate-500">{label}</p>
            <h4 className="mt-2 text-xl font-bold text-[#0B1E3D]">
                {typeof value === 'number' ? value.toLocaleString() : value}
            </h4>
        </div>

        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}>
            <Icon size={21} className={iconColor} />
        </div>
    </div>
);

const FaqManagement = () => {

    const [selectedCatId, setSelectedCatId] = useState('');
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [status, setStatus] = useState('');
    const [page, setPage] = useState(1);

    const [catModal, setCatModal] = useState({ open: false, category: null, });
    const [faqModal, setFaqModal] = useState({ open: false, faq: null, });
    const [confirm, setConfirm] = useState(null);

    const { data: catData, isLoading: catLoading, } = useGetFaqCategories();
    const { data: faqData, isLoading: faqLoading, isError: faqError, } = useGetAllFaqs({
        page,
        limit: LIMIT,
        search: debouncedSearch,
        status,
        categoryId: selectedCatId,
    });

    // Search debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search.trim());
        }, 400);

        return () => clearTimeout(timer);
    }, [search]);

    // Reset page when filters change
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, status, selectedCatId]);

    const updateFaq = useUpdateFaq();
    const moveFaq = useMoveFaq();
    const moveCategory = useMoveFaqCategory();
    const deleteFaq = useDeleteFaq();
    const deleteCategory = useDeleteFaqCategory();

    const categories = catData?.categories || [];
    const icons = catData?.icons || [];
    const faqs = faqData?.faqs || [];

    const faqStats = faqData?.stats || {
        total: 0,
        active: 0,
        inactive: 0,
    };

    const pagination = faqData?.pagination || { page: 1, total: 0, totalPages: 1, };

    const selectedCat =
        categories.find((c) => c._id === selectedCatId) || null;

    const catIndex = selectedCat
        ? categories.findIndex((c) => c._id === selectedCat._id)
        : -1;

    // Reordering only when a category is selected and filters are clear
    const canReorder = !!selectedCatId && !debouncedSearch && !status;

    const deleting = deleteFaq.isPending || deleteCategory.isPending;

    const catHasFaqs =
        confirm?.type === 'category' && confirm.item.faqCount > 0;

    const from =
        pagination.total === 0
            ? 0
            : (pagination.page - 1) * LIMIT + 1;

    const to = Math.min(pagination.page * LIMIT, pagination.total);

    // Select category
    const selectCategory = (id) => {
        setSelectedCatId(id);
        setPage(1);
    };

    // Update filter
    const handleStatusChange = (value) => {
        setStatus(value);
        setPage(1);
    };

    // Clear filters
    const handleClearFilters = () => {
        setSearch('');
        setDebouncedSearch('');
        setStatus('');
        setSelectedCatId('');
        setPage(1);
    };

    // Toggle FAQ status
    const handleToggle = async (faq) => {
        try {
            await updateFaq.mutateAsync({
                id: faq._id,
                data: {
                    isActive: !faq.isActive,
                },
            });
        } catch (err) {
            toast.error(errMsg(err));
        }
    };

    // Move FAQ up/down
    const handleMoveFaq = async (id, direction) => {
        try {
            await moveFaq.mutateAsync({ id, direction });
        } catch (err) {
            toast.error(errMsg(err));
        }
    };

    // Move category left/right
    const handleMoveCategory = async (direction) => {
        if (!selectedCat) return;

        try {
            await moveCategory.mutateAsync({
                id: selectedCat._id,
                direction,
            });
        } catch (err) {
            toast.error(errMsg(err));
        }
    };

    // Delete FAQ or category
    const handleConfirmDelete = async () => {
        if (!confirm) return;

        try {
            if (confirm.type === 'faq') {
                const res = await deleteFaq.mutateAsync(confirm.item._id);

                toast.success(res.message || 'FAQ deleted');

                if (faqs.length === 1 && page > 1) {
                    setPage((prev) => prev - 1);
                }
            } else {
                const res = await deleteCategory.mutateAsync(
                    confirm.item._id
                );

                toast.success(res.message || 'Category deleted');

                if (selectedCatId === confirm.item._id) {
                    selectCategory('');
                }
            }
        } catch (err) {
            toast.error(errMsg(err));
        }

        setConfirm(null);
    };

    const liveCount = categories
        .filter((c) => c.isActive)
        .reduce((sum, c) => sum + (c.activeFaqCount || 0), 0);

    // stats
    const faqStatsCards = [
        {
            id: 1,
            label: 'Total FAQs',
            value: faqStats.total,
            icon: BadgeHelp,
            iconBg: 'bg-blue-50',
            iconColor: 'text-blue-600',
        },
        {
            id: 2,
            label: 'Live on Website',
            value: liveCount,
            icon: CheckCircle,
            iconBg: 'bg-emerald-50',
            iconColor: 'text-emerald-600',
        },
        {
            id: 3,
            label: 'Inactive FAQs',
            value: faqStats.inactive,
            icon: XCircle,
            iconBg: 'bg-amber-50',
            iconColor: 'text-amber-600',
        },
        {
            id: 4,
            label: 'Categories (Active / Total)',
            value: `${catData?.stats?.active ?? 0} / ${catData?.stats?.total ?? 0}`,
            icon: Layers,
            iconBg: 'bg-purple-50',
            iconColor: 'text-purple-600',
        },
    ];

    return (
        <div className="pb-6">

            {/* Header */}
            <div className="flex flex-col gap-5 pb-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3D]">FAQ Management</h1>

                    <div className="mt-2 flex items-center text-[11px] md:text-[13px]">
                        <span
                            onClick={() => setCurrentPage('dashboard')}
                            className="cursor-pointer text-slate-500 hover:text-[#D97706] transition-colors">
                            Dashboard
                        </span>
                        <span className="mx-2 text-slate-300">/</span>
                        <span className="text-slate-500">CMS Management</span>
                        <span className="mx-2 text-slate-300">/</span>
                        <span className="font-medium text-[#D97706]">FAQ Management</span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={() =>
                            setCatModal({ open: true, category: null })
                        }
                        className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-[#0B1E3D] transition hover:bg-slate-50"
                    >
                        <Plus size={16} />
                        Add Category
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            setFaqModal({ open: true, faq: null })
                        }
                        className="flex items-center justify-center gap-2 rounded-lg bg-[#D97706] px-4 py-2.5 text-sm font-medium text-white shadow-md transition hover:bg-amber-700 active:scale-[0.98]"
                    >
                        <Plus size={16} />
                        Add FAQ
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {faqStatsCards.map((stat) => (
                    <StatCard key={stat.id} {...stat} />
                ))}
            </div>

            {/* Categories */}
            <div className="my-6 rounded-xl border border-slate-200 bg-white p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-[#0B1E3D]">
                        FAQ Categories
                    </h2>

                    <span className="text-xs text-slate-400">
                        {categories.length} Categories
                    </span>
                </div>

                {catLoading ? (
                    <p className="text-sm text-slate-400">
                        Loading categories...
                    </p>
                ) : categories.length === 0 ? (
                    <p className="text-sm text-slate-500">
                        No categories found. Click Add Category to create one.
                    </p>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => selectCategory('')}
                            className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${!selectedCatId
                                ? 'border-[#D97706] bg-amber-50 text-[#D97706]'
                                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            All
                            <span className="ml-1.5 text-slate-400">
                                {faqStats.total}
                            </span>
                        </button>

                        {categories.map((category) => (
                            <button
                                type="button"
                                key={category._id}
                                onClick={() => selectCategory(category._id)}
                                className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${selectedCatId === category._id
                                    ? 'border-[#D97706] bg-amber-50 text-[#D97706]'
                                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                                    } ${!category.isActive ? 'opacity-60' : ''}`}
                            >
                                {category.name}

                                <span className="ml-1.5 text-slate-400">
                                    {category.faqCount}
                                </span>

                                {!category.isActive && (
                                    <span className="ml-1 text-slate-400">
                                        (Inactive)
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                )}

                {/* Selected category actions */}
                {selectedCat && (
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                        <div>
                            <p className="text-sm font-semibold text-[#0B1E3D]">
                                {selectedCat.name}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                {selectedCat.activeFaqCount}/{selectedCat.faqCount} FAQs active
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() =>
                                    setCatModal({
                                        open: true,
                                        category: selectedCat,
                                    })
                                }
                                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-[#D97706] hover:bg-amber-50 hover:text-[#D97706]"
                            >
                                <Pencil size={14} className="mr-1 inline" />
                                Edit
                            </button>

                            <button
                                type="button"
                                onClick={() => handleMoveCategory('up')}
                                disabled={
                                    catIndex <= 0 || moveCategory.isPending
                                }
                                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ChevronLeft size={14} className="mr-1 inline" />
                                Move Left
                            </button>

                            <button
                                type="button"
                                onClick={() => handleMoveCategory('down')}
                                disabled={
                                    catIndex === categories.length - 1 ||
                                    moveCategory.isPending
                                }
                                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Move Right
                                <ChevronRight size={14} className="ml-1 inline" />
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setConfirm({
                                        type: 'category',
                                        item: selectedCat,
                                    })
                                }
                                className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
                            >
                                <Trash2 size={14} className="mr-1 inline" />
                                Delete
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Search and Filters */}
            <div className="my-6 rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex w-full flex-wrap items-center gap-3 xl:flex-nowrap">

                    <div className="w-full flex-1 sm:min-w-60">
                        <SearchBar
                            placeholder="Search question, answer or FAQ ID..."
                            value={search}
                            onChange={setSearch}
                        />
                    </div>

                    <div className="w-full shrink-0 sm:w-44">
                        <FilterDropdown
                            label="All Status"
                            options={STATUS_OPTIONS}
                            value={status}
                            onChange={handleStatusChange}
                        />
                    </div>

                    <button
                        type="button"
                        onClick={handleClearFilters}
                        className="flex h-9 items-center gap-1.5 px-1.5 text-xs font-semibold text-amber-600 underline underline-offset-4 decoration-amber-300 transition-all hover:text-amber-700 hover:decoration-amber-600"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Reordering information */}
            {selectedCatId && !canReorder && (
                <p className="mb-3 text-xs text-slate-500">
                    Clear search and status filters to change the order of FAQs.
                </p>
            )}

            {!selectedCatId && faqs.length > 0 && (
                <p className="mb-3 text-xs text-slate-500">
                    Select a category above to change the order of its FAQs.
                </p>
            )}

            {/* FAQ Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table className="w-full min-w-212.5 text-left">
                    <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        <tr>
                            <th className="px-5 py-4">FAQ ID</th>
                            <th className="px-5 py-4">Question / Answer</th>
                            <th className="px-5 py-4">Category</th>
                            <th className="px-5 py-4">Status</th>
                            <th className="px-5 py-4">Order</th>
                            <th className="px-5 py-4 text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 bg-white">
                        {faqLoading ? (
                            <tr>
                                <td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-400">
                                    Loading FAQs...
                                </td>
                            </tr>
                        ) : faqError ? (
                            <tr>
                                <td colSpan={6} className="px-5 py-12 text-center text-sm text-red-500">
                                    Could not load FAQs.
                                </td>
                            </tr>
                        ) : faqs.length > 0 ? (
                            faqs.map((faq, i) => {

                                const index = (pagination.page - 1) * LIMIT + i;
                                const hiddenByCategory =
                                    faq.isActive &&
                                    categories.find((c) => c._id === faq.categoryId)?.isActive === false;

                                return (
                                    <tr
                                        key={faq._id}
                                        className="align-top transition-colors hover:bg-slate-50/70"
                                    >
                                        {/* faq id */}
                                        <td className="whitespace-nowrap px-5 py-4">
                                            <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs font-semibold text-slate-600">
                                                {faq.faqId}
                                            </span>
                                        </td>

                                        {/*ques / ans */}
                                        <td className="max-w-md px-5 py-4">
                                            <p className="text-sm font-semibold text-[#0B1E3D]">
                                                {faq.question}
                                            </p>

                                            <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                                                {faq.answer}
                                            </p>
                                        </td>

                                        {/* cat name */}
                                        <td className="whitespace-nowrap px-5 py-4">
                                            <span className="inline-flex rounded-full border border-blue-200/50 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                                                {faq.category?.name || '—'}
                                            </span>
                                        </td>

                                        {/* active / inactive */}
                                        <td className="whitespace-nowrap px-5 py-4">
                                            <button
                                                type="button"
                                                onClick={() => handleToggle(faq)}
                                                disabled={updateFaq.isPending}
                                                title="Click to toggle status"
                                                className={`rounded-full border px-3 py-1 text-xs font-semibold transition disabled:opacity-50 ${faq.isActive
                                                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                                    : 'border-slate-200 bg-slate-100 text-slate-600'
                                                    }`}
                                            >
                                                <span
                                                    className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${faq.isActive
                                                        ? 'bg-emerald-500'
                                                        : 'bg-slate-400'
                                                        }`}
                                                />
                                                {faq.isActive ? 'Active' : 'Inactive'}
                                            </button>

                                            {hiddenByCategory && (
                                                <p className="mt-1 text-[10px] font-medium text-amber-600">
                                                    Hidden: category inactive
                                                </p>
                                            )}
                                        </td>

                                        {/* order */}
                                        <td className="whitespace-nowrap px-5 py-4">
                                            {canReorder ? (
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleMoveFaq(faq._id, 'up')
                                                        }
                                                        disabled={
                                                            index === 0 ||
                                                            moveFaq.isPending
                                                        }
                                                        title="Move Up"
                                                        className="rounded-lg border border-slate-200 p-1.5 text-slate-500 transition hover:border-[#D97706] hover:bg-amber-50 hover:text-[#D97706] disabled:cursor-not-allowed disabled:opacity-30"
                                                    >
                                                        <ArrowUp size={14} />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleMoveFaq(faq._id, 'down')
                                                        }
                                                        disabled={
                                                            index === pagination.total - 1 ||
                                                            moveFaq.isPending
                                                        }
                                                        title="Move Down"
                                                        className="rounded-lg border border-slate-200 p-1.5 text-slate-500 transition hover:border-[#D97706] hover:bg-amber-50 hover:text-[#D97706] disabled:cursor-not-allowed disabled:opacity-30"
                                                    >
                                                        <ArrowDown size={14} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-slate-300">—</span>
                                            )}
                                        </td>

                                        {/* action btns */}
                                        <td className="whitespace-nowrap px-5 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    type="button"
                                                    title="Edit FAQ"
                                                    onClick={() => setFaqModal({ open: true, faq, })}
                                                    className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 shadow-sm transition hover:border-[#D97706] hover:bg-amber-50 hover:text-[#D97706]"
                                                >
                                                    <Pencil size={15} />
                                                </button>

                                                <button
                                                    type="button"
                                                    title="Delete FAQ"
                                                    onClick={() => setConfirm({ type: 'faq', item: faq, })}
                                                    className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-5 py-16 text-center">
                                    <p className="text-sm font-semibold text-slate-600">
                                        No FAQs Found
                                    </p>
                                    <p className="mt-1 text-xs text-slate-400">
                                        There are no FAQs to display right now.
                                    </p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 bg-white px-5 py-4 sm:flex-row">
                    <p className="hidden text-xs text-slate-500 sm:block">
                        Showing{' '}
                        <span className="font-semibold text-[#0B1E3D]">
                            {from}-{to}
                        </span>{' '}
                        of{' '}
                        <span className="font-semibold text-[#0B1E3D]">
                            {pagination.total}
                        </span>{' '}
                        FAQs
                    </p>

                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                            disabled={pagination.page <= 1}
                            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Previous
                        </button>

                        {getPaginationRange(
                            pagination.page,
                            pagination.totalPages
                        ).map((num, idx) =>
                            num === '...' ? (
                                <span
                                    key={`dot-${idx}`}
                                    className="px-2 text-xs text-slate-400"
                                >
                                    ...
                                </span>
                            ) : (
                                <button
                                    type="button"
                                    key={num}
                                    onClick={() => setPage(num)}
                                    className={`h-8 min-w-8 rounded-lg border px-2 text-xs font-semibold transition ${pagination.page === num
                                        ? 'border-[#D97706] bg-[#D97706] text-white shadow-sm'
                                        : 'border-slate-200 bg-white text-slate-600 hover:border-amber-200 hover:bg-amber-50 hover:text-[#D97706]'
                                        }`}
                                >
                                    {num}
                                </button>
                            )
                        )}

                        <button
                            type="button"
                            onClick={() => setPage((prev) => prev + 1)}
                            disabled={pagination.page >= pagination.totalPages}
                            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Category Modal */}
            <FaqCategoryModal
                open={catModal.open}
                category={catModal.category}
                icons={icons}
                onClose={() =>
                    setCatModal({ open: false, category: null })
                }
            />

            {/* FAQ Modal */}
            <FaqFormModal
                open={faqModal.open}
                faq={faqModal.faq}
                categories={categories}
                defaultCategoryId={selectedCat?.isActive ? selectedCatId : ''}
                onClose={() =>
                    setFaqModal({ open: false, faq: null })
                }
            />

            {/* Delete Confirmation Modal */}
            {confirm && (
                <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

                        <div className="flex flex-col items-center border-b border-slate-100 px-6 py-6">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                                <Trash2 className="text-red-600" size={27} />
                            </div>

                            <h2 className="mt-4 text-xl font-semibold text-[#0B1E3D]">
                                {confirm.type === 'faq'
                                    ? 'Delete FAQ?'
                                    : 'Delete Category?'}
                            </h2>

                            <p className="mt-2 text-center text-sm leading-6 text-slate-500">
                                {confirm.type === 'faq'
                                    ? `"${confirm.item.question}" will be permanently deleted. This cannot be undone.`
                                    : catHasFaqs
                                        ? `"${confirm.item.name}" has ${confirm.item.faqCount} FAQ(s). Move or delete them first, or deactivate the category instead.`
                                        : `"${confirm.item.name}" will be permanently deleted.`}
                            </p>
                        </div>

                        <div className="flex justify-end gap-3 p-5">
                            <button
                                type="button"
                                onClick={() => setConfirm(null)}
                                disabled={deleting}
                                className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleConfirmDelete}
                                disabled={deleting || catHasFaqs}
                                className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                {deleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FaqManagement;

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Star, Eye, EyeOff, Award, AlertTriangle, MessageSquare, CheckCircle, X, CornerDownRight, Car, ShieldAlert, Sparkles } from 'lucide-react';

import SearchBar from '../SharedComponents/SearchBar';
import FilterDropdown from '../SharedComponents/FilterDropdown';
import { fmtDate, fmtTime } from '../utils/formatter';
import { getPaginationRange } from '../utils/getPaginationRange';
import {
    useGetAllReviews, useHideReview, useUnhideReview, useFeatureReview, useUnfeatureReview,
} from '../../hooks/useReview';

const TABS = [
    { id: 'all', label: 'All Reviews', status: '' },
    { id: 'visible', label: 'Visible', status: 'visible' },
    { id: 'featured', label: 'Featured', status: 'featured' },
    { id: 'edited_after_featured', label: 'Edited After Featured', status: 'edited_after_featured' },
    { id: 'hidden', label: 'Hidden', status: 'hidden' },
];

const filterConfig = [
    {
        label: 'All Ratings',
        key: 'rating',
        options: [
            { label: 'All Ratings', value: '' },
            { label: '5 Stars', value: '5' },
            { label: '4 Stars', value: '4' },
            { label: '3 Stars', value: '3' },
            { label: '2 Stars', value: '2' },
            { label: '1 Star', value: '1' },
        ],
    },
    {
        label: 'Sort By',
        key: 'sortBy',
        options: [
            { label: 'Newest', value: 'newest' },
            { label: 'Oldest', value: 'oldest' },
            { label: 'Highest Rating', value: 'rating_high' },
            { label: 'Lowest Rating', value: 'rating_low' },
        ],
    },
];

const HIDDEN_LABEL = { admin: 'Admin', order_canceled: 'Order canceled' };

const errMsg = (e) => e?.response?.data?.message || 'Something went wrong';

const StarRating = ({ rating }) => (
    <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
            <Star
                key={star}
                size={14}
                className={star <= rating ? 'fill-[#D97706] text-[#D97706]' : 'fill-slate-100 text-slate-300'}
            />
        ))}
        <span className="ml-1.5 text-xs font-bold text-slate-700">{rating}.0</span>
    </div>
);

function Review({ setCurrentPage }) {

    const [page, setPage] = useState(1);
    const [status, setStatus] = useState('');
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [filters, setFilters] = useState({ rating: '', sortBy: 'newest' });
    const [selectedReview, setSelectedReview] = useState(null);

    const { data, isLoading, isError, isPlaceholderData } = useGetAllReviews({
        page,
        limit: 10,
        search: debouncedSearch,
        status,
        rating: filters.rating,
        sortBy: filters.sortBy,
    });

    const hide = useHideReview();
    const unhide = useUnhideReview();
    const feature = useFeatureReview();
    const unfeature = useUnfeatureReview();

    const reviews = data?.reviews ?? [];
    const stats = data?.stats ?? {};
    const maxFeatured = data?.maxFeatured ?? 12;
    const totalPages = data?.pagination?.totalPages || 1;
    const total = data?.pagination?.total || 0;

    const busy = hide.isPending || unhide.isPending || feature.isPending || unfeature.isPending;

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 400);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        setPage(1);
    }, [status, filters, debouncedSearch]);

    const updateFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

    // ---- actions ----
    const run = (mutation, review, okMsg) => {
        mutation.mutate(review._id, {
            onSuccess: () => {
                toast.success(okMsg);
                setSelectedReview(null);
            },
            onError: (e) => toast.error(errMsg(e)),
        });
    };

    const toggleHide = (r) => (r.isHidden
        ? run(unhide, r, 'Review is visible again')
        : run(hide, r, 'Review hidden'));

    const toggleFeature = (r) => (r.featured
        ? run(unfeature, r, 'Removed from home page')
        : run(feature, r, 'Review featured on home page'));

    // order canceled review - can't be recover by admin
    const canUnhide = (r) => r.hiddenReason === 'admin';

    if (isLoading) return <p className="p-10 text-center">Loading reviews....</p>;
    if (isError) return <p className="p-10 text-center text-red-500">Failed to load reviews</p>;

    const statsData = [
        { title: 'Total Reviews', value: Number(stats.total || 0).toLocaleString(), subTitle: 'All submitted reviews', icon: MessageSquare, theme: 'bg-purple-50', iconColor: 'text-purple-600' },
        { title: 'Average Rating', value: `${stats.average || 0} / 5`, subTitle: 'Across visible reviews', icon: Star, theme: 'bg-amber-50', iconColor: 'text-[#D97706]' },
        { title: 'Featured Reviews', value: `${stats.featured || 0} / ${maxFeatured}`, subTitle: 'Shown on home page', icon: Award, theme: 'bg-green-50', iconColor: 'text-green-600' },
        { title: 'Edited After Featured', value: Number(stats.editedAfterFeatured || 0).toLocaleString(), subTitle: 'Need a fresh look', icon: AlertTriangle, theme: 'bg-orange-50', iconColor: 'text-orange-600' },
        { title: 'Hidden Reviews', value: Number(stats.hidden || 0).toLocaleString(), subTitle: 'Not public', icon: EyeOff, theme: 'bg-slate-100', iconColor: 'text-slate-600' },
    ];

    return (
        <div className='pb-6'>

            {/* Header */}
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between pb-6">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3D]">Reviews & Moderation</h1>

                    <div className="mt-2 flex items-center text-[11px] md:text-[13px]">
                        <span
                            onClick={() => setCurrentPage('dashboard')}
                            className="cursor-pointer text-slate-500 hover:text-[#D97706] transition-colors">
                            Dashboard
                        </span>
                        <span className="mx-2 text-slate-300">/</span>
                        <span className="font-medium text-[#D97706]">Reviews</span>
                    </div>
                </div>
            </div>

            {/* stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-5 gap-4">
                {statsData.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className="group relative bg-white rounded-2xl border border-slate-100 px-4 py-5 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-300 flex items-center justify-between overflow-hidden"
                        >
                            <div className="min-w-0 pr-2">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1 truncate">{stat.title}</span>
                                <h4 className="text-xl font-bold text-slate-900 tracking-tight truncate">{stat.value}</h4>
                                <span className="text-[11px] font-medium mt-1.5 block text-slate-500 truncate">{stat.subTitle}</span>
                            </div>

                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-sm ${stat.theme} ${stat.iconColor}`}>
                                <Icon className="w-5 h-5" />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Search / Filter */}
            <div className="my-6 bg-white border border-slate-200 rounded-xl p-4">
                <div className="flex flex-wrap xl:flex-nowrap items-center gap-3">

                    <div className="flex-1 sm:w-75">
                        <SearchBar
                            placeholder="Search by review ID, order ID, listing ID or seller..."
                            value={search}
                            onChange={(value) => setSearch(value)}
                        />
                    </div>

                    {filterConfig.map(({ label, key, options }) => (
                        <div key={key} className="w-full sm:w-45">
                            <FilterDropdown
                                label={label}
                                options={options}
                                value={filters[key]}
                                onChange={(value) => updateFilter(key, value)}
                            />
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={() => {
                            setSearch('');
                            setDebouncedSearch('');
                            setStatus('');
                            setFilters({ rating: '', sortBy: 'newest' });
                            setPage(1);
                        }}
                        className="flex items-center gap-1.5 h-9 px-1.5 text-xs font-semibold text-amber-600 underline underline-offset-4 decoration-amber-300 hover:text-amber-700 hover:decoration-amber-600 transition-all">
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* tabs */}
            <div className="flex gap-8 border-b border-slate-200 mb-6 overflow-x-auto no-scrollbar">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setStatus(tab.status)}
                        className={`pb-3 text-[14px] font-medium whitespace-nowrap border-b-2 transition-colors flex items-center gap-2
                            ${status === tab.status
                                ? 'border-[#D97706] text-[#D97706]'
                                : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                        {tab.label}
                        {tab.id === 'edited_after_featured' && stats.editedAfterFeatured > 0 && (
                            <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-orange-100 text-orange-700">
                                {stats.editedAfterFeatured}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* table */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-left table-fixed min-w-280">
                    <thead className="bg-gray-100 border-b border-gray-200 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                        <tr>
                            <th className="px-5 py-4 w-36">Review / Order</th>
                            <th className="px-5 py-4 w-60">Vehicle & Seller</th>
                            <th className="px-5 py-4 w-48">Reviewer</th>
                            <th className="px-5 py-4 w-72">Rating & Comment</th>
                            <th className="px-5 py-4 w-44">Visibility</th>
                            <th className="px-5 py-4 w-32">Date</th>
                            <th className="px-5 py-4 w-36 text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody className={`divide-y divide-slate-100 transition-opacity ${isPlaceholderData ? 'opacity-50 pointer-events-none' : ''}`}>
                        {reviews.length > 0 ? (
                            reviews.map((r) => (
                                <tr
                                    key={r._id}
                                    className={`transition-colors ${r.isHidden ? 'bg-slate-50/70' : 'hover:bg-gray-50/50'}`}>

                                    {/* review / order id */}
                                    <td className="px-5 py-4 align-top">
                                        <div className="text-[13px] font-bold text-[#0B1E3D]">{r.reviewId}</div>
                                        <div className="text-[11px] text-slate-500 mt-0.5">
                                            Order: <span className="font-medium text-slate-700">{r.orderNumber || '—'}</span>
                                        </div>
                                    </td>

                                    {/* vehicle details */}
                                    <td className="px-5 py-4 align-top">
                                        <div className="flex items-start gap-2">

                                            <div className="w-16 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                                                {r?.images?.[0]?.url ? (
                                                    <img
                                                        src={r.images[0].url}
                                                        alt={r.vehicle || 'Vehicle'}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = 'none';
                                                        }}
                                                    />
                                                ) : (
                                                    <Car className="h-full w-full p-3 text-slate-300" />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-[13px] font-semibold text-slate-800 truncate" title={r.vehicle || ''}>
                                                    {r.vehicle || 'Deleted vehicle'}
                                                </div>
                                                <div className="text-[11px] text-slate-400">Listing : {r.listingId || '—'}</div>
                                                {r.seller ? (
                                                    <div className="text-[11px] text-slate-500 mt-1 truncate">
                                                        Seller: <span className="font-medium text-slate-700">{r.seller.name}</span>{' '}
                                                        <span className="text-slate-400">({r.seller.readableId})</span>
                                                    </div>
                                                ) : (
                                                    <div className="text-[11px] text-slate-400 mt-1">Seller removed</div>
                                                )}
                                            </div>
                                        </div>
                                    </td>

                                    {/* reviewer */}
                                    <td className="px-5 py-4 align-top">
                                        <div className="text-[13px] font-semibold text-slate-800 truncate">{r.reviewer?.name || 'Deleted user'}</div>
                                        <div className="text-[11px] text-slate-400 truncate">{r.reviewer?.email || '—'}</div>
                                        <span
                                            className={`mt-1.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold border ${r.reviewer?.type === 'Seller'
                                                    ? 'bg-purple-50 text-purple-700 border-purple-100'
                                                    : 'bg-blue-50 text-blue-700 border-blue-100'
                                                }`}
                                        >
                                            {r.reviewer?.type || 'Buyer'}
                                        </span>
                                    </td>

                                    {/* rating / comment */}
                                    <td className="px-5 py-4 align-top">
                                        <StarRating rating={r.rating} />
                                        <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                                            {r.comment || <span className="italic text-slate-400">No written comment</span>}
                                        </p>
                                        {r.editedAt && (
                                            <span className="inline-block text-[10px] text-slate-400 italic mt-1">Edited {fmtDate(r.editedAt)}</span>
                                        )}
                                        {r.reply?.text && (
                                            <div className="mt-2 border-l-2 border-amber-300 bg-amber-50/40 py-1 px-2 rounded-r text-[11px] text-slate-600">
                                                <span className="font-semibold text-[#0B1E3D] flex items-center gap-1">
                                                    <CornerDownRight size={11} className="text-[#D97706]" /> Seller reply
                                                </span>
                                                <p className="line-clamp-1 mt-0.5">{r.reply.text}</p>
                                            </div>
                                        )}
                                    </td>

                                    {/* visibility */}
                                    <td className="px-5 py-4 align-top space-y-1.5">
                                        {r.isHidden ? (
                                            <div>
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border border-red-200 bg-red-50 text-red-700">
                                                    <EyeOff size={11} /> Hidden · {HIDDEN_LABEL[r.hiddenReason] || 'Hidden'}
                                                </span>
                                                {r.hiddenByName && <div className="text-[10px] text-slate-400 mt-0.5">By {r.hiddenByName}</div>}
                                            </div>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border border-green-200 bg-green-50 text-green-700">
                                                <Eye size={11} /> Visible
                                            </span>
                                        )}

                                        {r.featured && (
                                            <div>
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border border-amber-200 bg-amber-50 text-[#D97706]">
                                                    <Sparkles size={11} /> Featured
                                                </span>
                                            </div>
                                        )}

                                        {r.editedAfterFeatured && (
                                            <div className="flex items-center gap-1 text-[11px] font-semibold text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded">
                                                <AlertTriangle size={12} className="shrink-0" />
                                                <span>Edited after featured</span>
                                            </div>
                                        )}
                                    </td>

                                    {/* created date */}
                                    <td className="px-5 py-4 align-top text-[13px] leading-tight">
                                        <div className="font-semibold text-slate-800">{fmtDate(r.createdAt)}</div>
                                        <div className="text-[11px] text-slate-400 mt-0.5">{fmtTime(r.createdAt)}</div>
                                    </td>

                                    {/* actions */}
                                    <td className="px-5 py-4 align-top text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedReview(r)}
                                                title="View review"
                                                className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:text-[#0B1E3D] hover:bg-slate-100 transition-colors">
                                                <Eye size={15} />
                                            </button>

                                            <button
                                                type="button"
                                                disabled={r.isHidden || busy}
                                                onClick={() => toggleFeature(r)}
                                                title={r.isHidden ? 'Hidden reviews cannot be featured' : r.featured ? 'Remove from home page' : 'Feature on home page'}
                                                className={`p-2 rounded-lg border transition-colors disabled:cursor-not-allowed
                                                    ${r.isHidden
                                                        ? 'border-slate-100 text-slate-300'
                                                        : r.featured
                                                            ? 'border-amber-300 bg-amber-50 text-[#D97706] hover:bg-amber-100'
                                                            : 'border-slate-200 text-slate-500 hover:text-[#D97706] hover:border-amber-200'}`}>
                                                <Award size={15} />
                                            </button>

                                            <button
                                                type="button"
                                                disabled={busy || (r.isHidden && !canUnhide(r))}
                                                onClick={() => toggleHide(r)}
                                                title={r.isHidden
                                                    ? (canUnhide(r) ? 'Make visible again' : 'Hidden because the order was canceled. Cannot be unhidden.')
                                                    : 'Hide review'}
                                                className={`p-2 rounded-lg border transition-colors disabled:cursor-not-allowed disabled:opacity-50
                                                    ${r.isHidden
                                                        ? 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
                                                        : 'border-slate-200 text-slate-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50'}`}>
                                                {r.isHidden ? <CheckCircle size={15} /> : <EyeOff size={15} />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center">
                                    <p className="text-sm font-medium text-gray-500">No Data Found</p>
                                    <p className="text-xs text-gray-400 mt-1">There are no reviews to display.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between gap-4 px-6 py-4 border-t border-slate-200 bg-white">

                    <p className="hidden sm:block text-xs text-slate-500">
                        Page <span className="font-semibold text-[#0B1E3D]">{page}</span> of{' '}
                        <span className="font-semibold text-[#0B1E3D]">{totalPages}</span>
                        <span className="ml-2 text-slate-400">({total} reviews)</span>
                    </p>

                    <div className="flex items-center gap-1.5 mx-auto sm:mx-0 sm:ml-auto">
                        <button
                            type="button"
                            onClick={() => setPage((p) => p - 1)}
                            disabled={page === 1}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                            Previous
                        </button>

                        {getPaginationRange(page, totalPages).map((num, idx) =>
                            num === '...' ? (
                                <span key={`dot-${idx}`} className="px-2 py-1.5 text-xs font-medium text-slate-400">...</span>
                            ) : (
                                <button
                                    type="button"
                                    key={num}
                                    onClick={() => setPage(num)}
                                    className={`min-w-8 h-8 px-2 rounded-lg text-xs font-semibold border transition-all ${page === num
                                        ? 'bg-[#D97706] text-white border-[#D97706] shadow-sm'
                                        : 'bg-white border-slate-200 text-slate-600 hover:bg-amber-50 hover:text-[#D97706] hover:border-amber-200'}`}>
                                    {num}
                                </button>
                            )
                        )}

                        <button
                            type="button"
                            onClick={() => setPage((p) => p + 1)}
                            disabled={page === totalPages}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* ---------------- detail modal ---------------- */}
            {selectedReview && (
                <div className="fixed inset-0 z-70 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-xl overflow-hidden">

                        <div className="bg-[#0B1E3D] px-6 py-4 flex items-center justify-between text-white">
                            <div>
                                <div className="flex items-center gap-2.5">
                                    <h3 className="text-base font-bold">{selectedReview.reviewId}</h3>
                                    <span className="text-[11px] px-2 py-0.5 rounded bg-white/10 text-amber-300 font-medium">
                                        {selectedReview.orderNumber}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-300 mt-0.5">{selectedReview.vehicle}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedReview(null)}
                                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">

                            {selectedReview.editedAfterFeatured && (
                                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-orange-50 border border-orange-200 text-orange-800 text-xs">
                                    <ShieldAlert size={16} className="text-orange-600 shrink-0 mt-0.5" />
                                    <div>
                                        <span className="font-bold block">Edited after it was featured</span>
                                        The buyer edited this review on {fmtDate(selectedReview.editedAt)}, so it was removed from the home page. Read it again and feature it if you still want it there.
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                        Reviewer ({selectedReview.reviewer?.type})
                                    </span>
                                    <span className="font-bold text-slate-800 text-sm mt-0.5 block">{selectedReview.reviewer?.name}</span>
                                    <span className="text-slate-500">{selectedReview.reviewer?.email}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Seller</span>
                                    <span className="font-bold text-slate-800 text-sm mt-0.5 block">{selectedReview.seller?.name || '—'}</span>
                                    <span className="text-slate-500">{selectedReview.seller?.readableId}</span>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <StarRating rating={selectedReview.rating} />
                                    <span className="text-xs text-slate-400">
                                        {fmtDate(selectedReview.createdAt)}, {fmtTime(selectedReview.createdAt)}
                                    </span>
                                </div>
                                <div className="p-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 leading-relaxed break-words">
                                    {selectedReview.comment || 'No comment provided.'}
                                </div>
                            </div>

                            {selectedReview.reply?.text && (
                                <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-bold text-[#0B1E3D]">Seller reply</span>
                                        <span className="text-slate-400">{fmtDate(selectedReview.reply.at)}</span>
                                    </div>
                                    <p className="text-slate-700 leading-relaxed break-words">{selectedReview.reply.text}</p>
                                </div>
                            )}

                            <div className="text-[11px] text-slate-500 space-y-1 border-t border-slate-100 pt-3">
                                {selectedReview.featured && (
                                    <div>
                                        • Featured on <span className="font-medium">{fmtDate(selectedReview.featuredAt)}</span>
                                        {selectedReview.featuredByName ? ` by ${selectedReview.featuredByName}` : ''}
                                    </div>
                                )}
                                {selectedReview.isHidden && (
                                    <div className="text-red-600">
                                        • Hidden ({HIDDEN_LABEL[selectedReview.hiddenReason] || selectedReview.hiddenReason}) on{' '}
                                        <span className="font-medium">{fmtDate(selectedReview.hiddenAt)}</span>
                                        {selectedReview.hiddenByName ? ` by ${selectedReview.hiddenByName}` : ''}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
                            {!selectedReview.isHidden && (
                                <button
                                    type="button"
                                    disabled={busy}
                                    onClick={() => toggleFeature(selectedReview)}
                                    className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-colors disabled:opacity-50
                                        ${selectedReview.featured
                                            ? 'border-amber-300 bg-amber-100 text-amber-800 hover:bg-amber-200'
                                            : 'border-[#D97706] bg-[#D97706] text-white hover:bg-amber-700'}`}>
                                    <Award size={14} />
                                    {selectedReview.featured ? 'Remove from Home Page' : 'Feature on Home Page'}
                                </button>
                            )}

                            {(!selectedReview.isHidden || canUnhide(selectedReview)) && (
                                <button
                                    type="button"
                                    disabled={busy}
                                    onClick={() => toggleHide(selectedReview)}
                                    className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-colors disabled:opacity-50
                                        ${selectedReview.isHidden
                                            ? 'border-green-600 bg-green-600 text-white hover:bg-green-700'
                                            : 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100'}`}>
                                    {selectedReview.isHidden
                                        ? <><CheckCircle size={14} /> Unhide Review</>
                                        : <><EyeOff size={14} /> Hide Review</>}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Review;
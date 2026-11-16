
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Star, CornerDownRight, MessageSquare, Car, Hash, Pencil, Send, X, Info, Award } from 'lucide-react';
import GivenReviews from '../../SharedComponents/Review/GivenReviews';

import { getPaginationRange } from '../../../utils/getPaginationRange';
import { useGetMyReceivedReviews, useReplyFromList } from '../../../hook/useReview';

const fmt = (d) => (d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Dubai' }) : '');
const pretty = (s) => String(s || '').replace(/[_-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const Stars = ({ value, size = 16 }) => (
    <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => (
            <Star key={n} size={size} className={n <= Math.round(value) ? 'fill-yellow-500 text-yellow-600' : 'text-slate-300'} />
        ))}
    </div>
);

function ReviewItem({ r }) {
    const [replying, setReplying] = useState(false);
    const [text, setText] = useState(r.reply?.text || '');
    const reply = useReplyFromList();

    const submit = () =>
        reply.mutate(
            { id: r._id, text },
            {
                onSuccess: () => {
                    toast.success('Reply saved');
                    setReplying(false);
                },
                onError: (e) => toast.error(e?.response?.data?.message || 'Something went wrong'),
            }
        );

    const reviewerName = r.reviewer?.name || 'Buyer';
    const initials = reviewerName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-slate-300/80 transition-all duration-200 space-y-4">
            {/* Top Row: Reviewer Info + Rating + Date */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3.5">
                    {/* Avatar Initials */}
                    <div className="w-10 h-10 rounded-full bg-[#0B1E3D] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                        {initials}
                    </div>

                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm font-bold text-[#0B1E3D]">{reviewerName}</h3>
                            <span className="text-[11px] font-medium text-slate-400">
                                • {fmt(r.createdAt)}
                                {r.editedAt && ` (Edited ${fmt(r.editedAt)})`}
                            </span>
                        </div>

                        {/* Vehicle & Order Tags */}
                        <div className="mt-1.5 flex flex-wrap items-center gap-2">
                            {r.vehicle && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                                    <Car size={12} className="text-slate-500 shrink-0" />
                                    {pretty(r.vehicle)}
                                </span>
                            )}
                            {r.orderNumber && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-[#D97706] border border-amber-200/60 text-[11px] font-semibold">
                                    <Hash size={11} className="shrink-0" />
                                    {r.orderNumber}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Rating Pill */}
                <div className="flex items-center gap-2 bg-amber-50/70 border border-amber-200/70 px-3 py-1.5 rounded-xl self-start">
                    <Stars value={r.rating} size={15} />
                    <span className="text-xs font-bold text-[#0B1E3D]">{Number(r.rating).toFixed(1)}</span>
                </div>
            </div>

            {/* Review Comment */}
            <div className="pl-0 sm:pl-13">
                {r.comment ? (
                    <p className="text-sm text-slate-700 leading-relaxed break-words">{r.comment}</p>
                ) : (
                    <p className="text-sm italic text-slate-400">No written comment provided.</p>
                )}
            </div>

            {/* Existing Seller Reply */}
            {r.reply && !replying && (
                <div className="ml-0 sm:ml-13 rounded-xl bg-slate-50 border border-slate-200/70 border-l-4 border-l-[#D97706] p-3.5">
                    <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#0B1E3D]">
                            <CornerDownRight size={13} className="text-[#D97706]" />
                            Your Response
                        </span>
                        <span className="text-[11px] text-slate-400">
                            {fmt(r.reply.at)}
                            {r.reply.editedAt && ' · Edited'}
                        </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed break-words">
                        {r.reply.text}
                    </p>
                </div>
            )}

            {/* Reply Form OR Action Trigger */}
            <div className="pl-0 sm:pl-13 pt-1">
                {replying ? (
                    <div className="space-y-2.5 bg-slate-50/70 p-3.5 rounded-xl border border-slate-200">
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            maxLength={500}
                            rows={3}
                            placeholder="Write a polite, helpful response to the buyer..."
                            className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 outline-none focus:border-[#D97706] focus:ring-2 focus:ring-amber-100 transition-all"
                        />
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-[11px] text-slate-400">
                                {text.length} / 500 characters
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setText(r.reply?.text || '');
                                        setReplying(false);
                                    }}
                                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                                >
                                    <X size={13} />
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    disabled={reply.isPending || !text.trim()}
                                    onClick={submit}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#0B1E3D] px-4 py-2 text-xs font-semibold text-white hover:bg-[#132f5c] disabled:opacity-50 transition-colors shadow-xs"
                                >
                                    <Send size={13} />
                                    {reply.isPending ? 'Saving...' : 'Post Reply'}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => setReplying(true)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#D97706] bg-amber-50/70 hover:bg-amber-100/80 border border-amber-200/60 transition-colors"
                        >
                            {r.reply ? (
                                <>
                                    <Pencil size={12} />
                                    Edit Reply
                                </>
                            ) : (
                                <>
                                    <MessageSquare size={12} />
                                    Reply to Review
                                </>
                            )}
                        </button>

                        {!r.reply && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                                <Info size={12} className="text-slate-400 shrink-0" />
                                Once you reply, the buyer can no longer edit this review.
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function ReceivedReviews() {

    const [page, setPage] = useState(1);
    const { data, isLoading, isError, isFetching } = useGetMyReceivedReviews(page, 10);

    if (isLoading) return <p className="p-10 text-center">Loading reviews....</p>;
    if (isError) return <p className="p-10 text-center text-red-500">Could not load reviews</p>;

    const reviews = data?.reviews ?? [];
    const summary = data?.summary ?? {};
    const totalPages = data?.pagination?.totalPages || 1;

    return (
        <div className="pb-8 space-y-6">

            {/* Summary Rating Hero Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-[#0B1E3D] text-white flex flex-col items-center justify-center shrink-0 shadow-sm">
                        <span className="text-2xl font-extrabold leading-none">
                            {summary.ratingCount ? Number(summary.ratingAverage).toFixed(1) : '—'}
                        </span>
                        <span className="text-[10px] text-amber-400 font-semibold mt-1">OUT OF 5</span>
                    </div>

                    <div>
                        <div className="flex items-center gap-2">
                            <Stars value={summary.ratingAverage || 0} size={20} />
                        </div>
                        <p className="mt-1.5 text-xs sm:text-sm font-medium text-slate-600">
                            Based on <span className="font-bold text-[#0B1E3D]">{summary.ratingCount || 0}</span> verified buyer{' '}
                            {summary.ratingCount === 1 ? 'review' : 'reviews'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-amber-50/70 border border-amber-200/70 text-xs text-slate-700">
                    <Award size={18} className="text-[#D97706] shrink-0" />
                    <span>
                        Replying promptly builds buyer trust and locks review edits.
                    </span>
                </div>
            </div>

            {/* Reviews List */}
            <div className={`space-y-4 transition-opacity ${isFetching ? 'opacity-60' : ''}`}>
                {reviews.length > 0 ? (
                    reviews.map((r) => <ReviewItem key={r._id} r={r} />)
                ) : (
                    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-xs">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#D97706] flex items-center justify-center mx-auto mb-3">
                            <Star size={22} />
                        </div>
                        <h3 className="text-sm font-bold text-[#0B1E3D]">No reviews yet</h3>
                        <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                            When buyers leave ratings after completing a purchase, they will appear here.
                        </p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center gap-1.5 justify-end pt-2">
                    <button
                        type="button"
                        onClick={() => setPage((p) => p - 1)}
                        disabled={page === 1}
                        className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        Previous
                    </button>
                    {getPaginationRange(page, totalPages).map((num, idx) =>
                        num === '...' ? (
                            <span key={`dot-${idx}`} className="px-2 text-xs text-slate-400">
                                ...
                            </span>
                        ) : (
                            <button
                                type="button"
                                key={num}
                                onClick={() => setPage(num)}
                                className={`min-w-8 h-8 px-2.5 rounded-lg text-xs font-semibold border transition-colors ${page === num
                                        ? 'bg-[#D97706] text-white border-[#D97706] shadow-xs'
                                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                {num}
                            </button>
                        )
                    )}
                    <button
                        type="button"
                        onClick={() => setPage((p) => p + 1)}
                        disabled={page === totalPages}
                        className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';

function Reviews() {
    const [tab, setTab] = useState('received');

    const tabs = [
        { k: 'received', l: 'Received', sub: 'As Seller', icon: ArrowDownLeft },
        { k: 'given', l: 'Given', sub: 'As Buyer', icon: ArrowUpRight },
    ];

    return (
        <div className="space-y-6">

            {/* heading */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3D]">Reviews & Ratings</h1>
                    <p className="text-xs md:text-sm text-slate-500 mt-1">
                        Reviews buyers left on your sales, and reviews you gave to other sellers.
                    </p>
                </div>

                {/* tabs */}
                <div className="inline-flex p-1 bg-slate-100 border border-slate-200/80 rounded-xl self-start">
                    {tabs.map((t) => {
                        const Icon = t.icon;
                        const isActive = tab === t.k;
                        return (
                            <button
                                key={t.k}
                                type="button"
                                onClick={() => setTab(t.k)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${isActive
                                        ? 'bg-[#D97706] text-white shadow-sm'
                                        : 'text-slate-600 hover:text-[#0B1E3D]'
                                    }`}
                            >
                                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                                <span>{t.l}</span>
                                <span
                                    className={`text-[11px] font-normal hidden sm:inline ${isActive ? 'text-slate-100' : 'text-slate-500'
                                        }`}
                                >
                                    ({t.sub})
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {tab === 'received' ? <ReceivedReviews /> : <GivenReviews />}
        </div>
    );
}

export default Reviews;
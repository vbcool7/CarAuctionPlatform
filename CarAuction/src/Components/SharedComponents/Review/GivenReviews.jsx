
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Star, CornerDownRight, Car, Hash, Pencil, Store } from 'lucide-react';

import { getPaginationRange } from '../../../utils/getPaginationRange';
import { useGetMyGivenReviews, useUpdateFromList } from '../../../hook/useReview';

const fmt = (d) => (d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Dubai' }) : '');
const pretty = (s) => String(s || '').replace(/[_-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

function Stars({ value, onChange, size = 16 }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
                <button
                    key={n}
                    type="button"
                    disabled={!onChange}
                    onClick={() => onChange && onChange(n)}
                    className={onChange ? 'cursor-pointer' : 'cursor-default'}>
                    <Star size={size} className={n <= value ? 'fill-yellow-500 text-yellow-600' : 'text-slate-300'} />
                </button>
            ))}
        </div>
    );
}

function GivenItem({ r }) {

    const [editing, setEditing] = useState(false);
    const [rating, setRating] = useState(r.rating);
    const [comment, setComment] = useState(r.comment || '');

    const update = useUpdateFromList();

    // edit
    const save = () => update.mutate({ id: r._id, rating, comment: comment.trim() }, {
        onSuccess: () => {
            toast.success('Review updated');
            setEditing(false);
        },
        onError: (e) => {
            toast.error(e?.response?.data?.message || 'Something went wrong');
            setEditing(false);
        },
    });

    return (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Store size={14} className="text-slate-400" />
                        <h3 className="text-sm font-bold text-[#0B1E3D]">{r.seller}</h3>
                        <span className="text-[11px] font-medium text-slate-400">
                            • {fmt(r.createdAt)}{r.editedAt && ` (Edited ${fmt(r.editedAt)})`}
                        </span>
                    </div>

                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                        {r.vehicle && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                                <Car size={12} className="text-slate-500 shrink-0" />{pretty(r.vehicle)}
                            </span>
                        )}
                        {r.orderNumber && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-[#D97706] border border-amber-200/60 text-[11px] font-semibold">
                                <Hash size={11} className="shrink-0" />{r.orderNumber}
                            </span>
                        )}
                    </div>
                </div>

                {!editing && (
                    <div className="flex items-center gap-2 bg-amber-50/70 border border-amber-200/70 px-3 py-1.5 rounded-xl self-start">
                        <Stars value={r.rating} size={15} />
                        <span className="text-xs font-bold text-[#0B1E3D]">{Number(r.rating).toFixed(1)}</span>
                    </div>
                )}
            </div>

            {editing ? (
                <div className="space-y-2.5 bg-slate-50/70 p-3.5 rounded-xl border border-slate-200">
                    <Stars value={rating} onChange={setRating} size={22} />

                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        maxLength={500}
                        rows={3}
                        placeholder="Share your experience (optional)"
                        className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 outline-none focus:border-[#D97706] focus:ring-2 focus:ring-amber-100" />

                    <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] text-slate-400">{comment.length} / 500</span>
                        <div className="flex gap-2">

                            <button
                                type="button"
                                onClick={() => {
                                    setRating(r.rating);
                                    setComment(r.comment || '');
                                    setEditing(false);
                                }}
                                className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600">
                                Cancel
                            </button>

                            <button
                                type="button"
                                disabled={update.isPending || !rating}
                                onClick={save}
                                className="rounded-lg bg-[#0B1E3D] px-4 py-2 text-xs font-semibold text-white disabled:opacity-50">
                                {update.isPending ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {r.comment
                        ? <p className="text-sm text-slate-700 leading-relaxed break-words">{r.comment}</p>
                        : <p className="text-sm italic text-slate-400">No written comment.</p>}

                    {r.isHidden && (
                        <p className="text-xs text-amber-700">This review is hidden and is not visible to others.</p>
                    )}

                    {r.reply && (
                        <div className="rounded-xl bg-slate-50 border border-slate-200/70 border-l-4 border-l-[#D97706] p-3.5">
                            <p className="flex items-center gap-1.5 text-[11px] font-bold text-[#0B1E3D] mb-1">
                                <CornerDownRight size={13} className="text-[#D97706]" />
                                Seller reply · {fmt(r.reply.at)}{r.reply.editedAt && ' · Edited'}
                            </p>
                            <p className="text-sm text-slate-600 wrap-break-word">{r.reply.text}</p>
                        </div>
                    )}

                    <div className="pt-1 border-t border-slate-100">
                        {r.canEdit ? (
                            <button
                                type="button"
                                onClick={() => setEditing(true)}
                                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#D97706] bg-amber-50/70 border border-amber-200/60">
                                <Pencil size={12} /> Edit review
                            </button>
                        ) : (
                            <p className="mt-2 text-[11px] text-slate-400">{r.editReason}</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

// showHeader = for buyer. false in seller tab
function GivenReviews({ showHeader = false }) {

    const [page, setPage] = useState(1);
    const { data, isLoading, isError, isFetching } = useGetMyGivenReviews(page, 10);

    if (isLoading) return <p className="p-10 text-center">Loading reviews....</p>;
    if (isError) return <p className="p-10 text-center text-red-500">Could not load reviews</p>;

    const reviews = data?.reviews ?? [];
    const totalPages = data?.pagination?.totalPages || 1;

    return (
        <div className="pb-8 space-y-6">

            {/* show in buyer */}
            {showHeader && (
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3D]">My Reviews</h1>
                    <p className="text-xs md:text-sm text-slate-500 mt-1">View and manage all the ratings and feedback you’ve shared with sellers.</p>
                </div>
            )}

            <div className={`space-y-4 transition-opacity ${isFetching ? 'opacity-60' : ''}`}>
                {reviews.length > 0 ? reviews.map((r) => <GivenItem key={r._id} r={r} />) : (
                    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
                        <h3 className="text-sm font-bold text-[#0B1E3D]">No reviews given yet</h3>
                        <p className="text-xs text-slate-500 mt-1">You can review a seller after the vehicle handover is confirmed.</p>
                    </div>
                )}
            </div>

            {/* pagination */}
            {totalPages > 1 && (
                <div className="flex items-center gap-1.5 justify-end">
                    <button type="button" onClick={() => setPage((p) => p - 1)} disabled={page === 1}
                        className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed">
                        Previous
                    </button>
                    {getPaginationRange(page, totalPages).map((num, idx) =>
                        num === '...' ? (
                            <span key={`dot-${idx}`} className="px-2 text-xs text-slate-400">...</span>
                        ) : (
                            <button type="button" key={num} onClick={() => setPage(num)}
                                className={`min-w-8 h-8 px-2.5 rounded-lg text-xs font-semibold border ${page === num ? 'bg-[#D97706] text-white border-[#D97706]' : 'bg-white border-slate-200 text-slate-600'}`}>
                                {num}
                            </button>
                        )
                    )}
                    <button type="button" onClick={() => setPage((p) => p + 1)} disabled={page === totalPages}
                        className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed">
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

export default GivenReviews;
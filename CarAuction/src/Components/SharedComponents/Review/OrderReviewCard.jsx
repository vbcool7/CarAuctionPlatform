
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Star } from 'lucide-react';

import { useGetOrderReview, useCreateReview, useUpdateReview, useReplyToReview } from '../../../hook/useReview';

const errMsg = (e) => e?.response?.data?.message || 'Something went wrong';
const fmt = (d) => (d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Dubai' }) : '');

function Stars({ value, onChange, size = 18 }) {

    const [hover, setHover] = useState(0);
    const active = hover || value;
    
    return (
        <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
            {[1, 2, 3, 4, 5].map((n) => (
                <button
                    key={n}
                    type="button"
                    disabled={!onChange}
                    onMouseEnter={() => onChange && setHover(n)}
                    onClick={() => onChange && onChange(n)}
                    className={onChange ? 'cursor-pointer' : 'cursor-default'}
                >
                    <Star
                        size={size}
                        className={n <= active ? 'fill-yellow-500 text-yellow-600' : 'text-slate-300'}
                    />
                </button>
            ))}
        </div>
    );
}

function ReviewForm({ initial, busy, onSubmit, onCancel }) {

    const [rating, setRating] = useState(initial?.rating || 0);
    const [comment, setComment] = useState(initial?.comment || '');

    return (
        <div className="space-y-3">
            <Stars value={rating} onChange={setRating} size={24} />
            <div>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    maxLength={500}
                    rows={4}
                    placeholder="Share your experience (optional)"
                    className="w-full rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                />
                <p className="mt-1 text-right text-[11px] text-slate-400">{comment.length}/500</p>
            </div>

            <div className="flex gap-2">
                <button
                    type="button"
                    disabled={busy || !rating}
                    onClick={() => onSubmit({ rating, comment })}
                    className="rounded-lg bg-[#0B1E3D] px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
                >
                    {busy ? 'Saving...' : 'Submit'}
                </button>

                {onCancel && (
                    <button type="button" onClick={onCancel} className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600">
                        Cancel
                    </button>
                )}
            </div>
        </div>
    );
}

function ReplyForm({ initial, busy, onSubmit, onCancel }) {

    const [text, setText] = useState(initial || '');

    return (
        <div className="space-y-2">
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={500}
                rows={3}
                placeholder="Write your reply"
                className="w-full rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            />
            <div className="flex gap-2">
                <button
                    type="button"
                    disabled={busy || !text.trim()}
                    onClick={() => onSubmit(text)}
                    className="rounded-lg bg-[#0B1E3D] px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
                >
                    {busy ? 'Saving...' : 'Post Reply'}
                </button>

                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600">
                        Cancel
                    </button>
                )}
            </div>
        </div>
    );
}

function OrderReviewCard({ orderId }) {

    const [editing, setEditing] = useState(false);
    const [replying, setReplying] = useState(false);

    const { data, isLoading, isError } = useGetOrderReview(orderId);
    
    const create = useCreateReview(orderId);
    const update = useUpdateReview(orderId);
    const reply = useReplyToReview(orderId);

    if (isLoading || isError || !data) return null;

    const { role, review } = data;
    const isSeller = role === 'seller';

    // Do not show anything to the seller until a review is submitted (or if the review is hidden).
    if (isSeller && (!review || review.isHidden)) return null;

    // create
    const onCreate = (body) => create.mutate(body, {
        onSuccess: () => toast.success('Review submitted'),
        onError: (e) => toast.error(errMsg(e)),
    });

    // update
    const onUpdate = (body) => update.mutate({ id: review._id, ...body }, {
        onSuccess: () => {
            toast.success('Review updated');
            setEditing(false);
        },
        onError: (e) => {
            toast.error(errMsg(e));
            setEditing(false);
        },
    });

    // reply
    const onReply = (text) => reply.mutate({ id: review._id, text }, {
        onSuccess: () => {
            toast.success('Reply saved');
            setReplying(false);
        },
        onError: (e) => toast.error(errMsg(e)),
    });

    return (
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-[#0B1E3D] mb-4">
                {isSeller ? 'Buyer Review' : 'Your Review'}
            </h2>

            {/* buyer: not give review yet */}
            {!review && (
                data.canReview ? (
                    <ReviewForm busy={create.isPending} onSubmit={onCreate} />
                ) : (
                    <p className="text-sm text-slate-500">{data.reviewReason || 'You cannot review this order right now.'}</p>
                )
            )}

            {/* buyer: edit form */}
            {review && !isSeller && editing && (
                <ReviewForm initial={review} busy={update.isPending} onSubmit={onUpdate} onCancel={() => setEditing(false)} />
            )}

            {/* show review */}
            {review && !editing && (
                <div className="space-y-3">
                    <Stars value={review.rating} />
                    {review.comment &&
                        <p className="text-sm text-slate-700 wrap-break-word">{review.comment}</p>
                    }
                    <p className="text-[11px] text-slate-400">
                        {fmt(review.createdAt)}
                        {review.editedAt && ` · Edited ${fmt(review.editedAt)}`}
                    </p>

                    {!isSeller && review.isHidden && (
                        <p className="text-xs text-amber-700">This review is hidden and is not visible to others.</p>
                    )}

                    {/* buyer: edit button ya lock ki wajah */}
                    {!isSeller && (
                        data.canEdit ? (
                            <button
                                type="button"
                                onClick={() => setEditing(true)}
                                className="text-xs font-semibold text-[#D97706]">
                                Edit review
                            </button>
                        ) : (
                            data.editReason && <p className="text-xs text-slate-400">{data.editReason}</p>
                        )
                    )}

                    {/* seller reply */}
                    {review.reply && !replying && (
                        <div className="rounded-lg bg-slate-50 p-3">
                            <p className="text-[11px] font-semibold text-slate-500 mb-1">
                                Seller reply · {fmt(review.reply.at)}{review.reply.editedAt && ' · Edited'}
                            </p>
                            <p className="text-sm text-slate-700 wrap-break-word">{review.reply.text}</p>
                        </div>
                    )}

                    {isSeller && data.canReply && (
                        replying ? (
                            <ReplyForm
                                initial={review.reply?.text}
                                busy={reply.isPending}
                                onSubmit={onReply}
                                onCancel={() => setReplying(false)}
                            />
                        ) : (
                            <button
                                type="button"
                                onClick={() => setReplying(true)}
                                className="inline-flex items-center justify-center rounded-lg bg-[#0B1E3D] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#D97706] hover:shadow-md active:scale-95">
                                {review.reply ? 'Edit reply' : 'Reply'}
                            </button>
                        )
                    )}

                    {isSeller && !review.reply && (
                        <p className="text-[11px] text-slate-400">Once you reply, the buyer can no longer edit this review.</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default OrderReviewCard;
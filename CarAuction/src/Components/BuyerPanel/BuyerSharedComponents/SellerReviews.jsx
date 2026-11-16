
import React from 'react';
import { Star, ShieldCheck, CornerDownRight } from 'lucide-react';

import { getPaginationRange } from '../../../utils/getPaginationRange';

const fmt = (d) => (d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Dubai' }) : '');
const pretty = (s) => String(s || '').replace(/[_-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

function StarRow({ rating, size = 12 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          className={n <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'} />
      ))}
    </div>
  );
}

function SellerReviews({ summary, reviews, pagination, page, setPage, isFetching }) {

  const { ratingAverage = 0, ratingCount = 0, distribution = {} } = summary || {};
  const totalPages = pagination?.totalPages || 1;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6 pb-6">

      {/* left: overall rating */}
      <div className="lg:col-span-4">
        <h2 className="font-bold text-base text-[#0B1E3D] mb-2">Overall Rating</h2>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-4xl font-extrabold text-[#0B1E3D]">
            {ratingCount ? Number(ratingAverage).toFixed(1) : '—'}
          </span>
          <Star size={28} className="text-amber-400 fill-amber-400" />
        </div>
        <p className="text-sm text-slate-500 mb-4">
          Based on {ratingCount} {ratingCount === 1 ? 'review' : 'reviews'}
        </p>

        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = distribution[star] || 0;
            return (
              <div
                key={star}
                className="flex items-center gap-2 text-xs">
                <span className="w-10 text-slate-500">{star} Stars</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${ratingCount ? (count / ratingCount) * 100 : 0}%` }} />
                </div>
                <span className="w-6 text-slate-400 text-right">{count}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-5 border border-slate-100 rounded-2xl shadow-sm bg-white">
          <h3 className="font-bold text-sm text-[#0B1E3D] mb-1">How Reviews Work</h3>
          <p className="text-xs text-slate-500 mb-3 leading-relaxed">
            Only buyers who completed a purchase from this seller can leave a review.
          </p>
          <div className="flex items-center gap-2 text-green-700 bg-green-50 p-2.5 rounded-xl border border-green-100 text-xs font-semibold">
            <ShieldCheck size={15} /> Verified reviews only
          </div>
        </div>
      </div>

      {/* right: list */}
      <div className="lg:col-span-8">
        <h2 className="font-bold text-base text-[#0B1E3D] mb-4">Reviews</h2>

        <div className={`transition-opacity ${isFetching ? 'opacity-60' : ''}`}>
          {reviews.length > 0 ? reviews.map((rev) => (
            <div 
            key={rev._id} 
            className="border-b border-slate-100 py-5">
              <div className="flex items-start gap-3 mb-2">
                <div className="w-9 h-9 bg-[#0B1E3D] text-white rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                  {rev.reviewer?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <p className="font-bold text-sm text-[#0B1E3D] truncate">{rev.reviewer?.name}</p>
                      <span className="text-[10px] bg-green-50 text-green-600 border border-green-200 px-1.5 py-0.5 rounded-full shrink-0">
                        Verified Buyer
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 shrink-0">
                      {fmt(rev.createdAt)}{rev.editedAt && ' · Edited'}
                    </span>
                  </div>
                  <StarRow rating={rev.rating} />
                </div>
              </div>

              {rev.comment && <p className="text-sm text-slate-600 mb-1.5 ml-12 wrap-break-word">{rev.comment}</p>}
              {rev.vehicle && <p className="text-xs text-slate-400 ml-12">{pretty(rev.vehicle)}</p>}

              {rev.reply && (
                <div className="ml-12 mt-3 rounded-xl bg-slate-50 border border-slate-200/70 border-l-4 border-l-[#D97706] p-3">
                  <p className="flex items-center gap-1.5 text-[11px] font-bold text-[#0B1E3D] mb-1">
                    <CornerDownRight size={13} className="text-[#D97706]" />
                    Seller reply · {fmt(rev.reply.at)}
                  </p>
                  <p className="text-xs text-slate-600 wrap-break-word">{rev.reply.text}</p>
                </div>
              )}
            </div>
          )) : (
            <p className="py-16 text-center text-sm text-slate-500">No reviews yet.</p>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-1.5 justify-end pt-4">
            <button type="button" onClick={() => setPage((p) => p - 1)} disabled={page === 1}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed">
              Previous
            </button>

            {getPaginationRange(page, totalPages).map((num, idx) =>
              num === '...' ? (
                <span key={`dot-${idx}`} className="px-2 text-xs text-slate-400">...</span>
              ) : (
                <button type="button" key={num} onClick={() => setPage(num)}
                  className={`min-w-8 h-8 px-2 rounded-lg text-xs font-semibold border ${page === num ? 'bg-[#D97706] text-white border-[#D97706]' : 'bg-white border-slate-200 text-slate-600'}`}>
                  {num}
                </button>
              )
            )}

            <button type="button" onClick={() => setPage((p) => p + 1)} disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed">
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SellerReviews;
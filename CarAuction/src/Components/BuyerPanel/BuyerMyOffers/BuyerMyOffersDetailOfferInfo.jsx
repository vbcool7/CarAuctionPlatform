
import React, { useState } from 'react';

function BuyerMyOffersDetailOfferInfo({ vehicle }) {

    const [activeTab, setActiveTab] = useState('timeline');

    const isAccepted = vehicle.offerStatus === 'accepted';
    const isActive = vehicle.offerStatus === 'active';
    const isExpired = vehicle.offerStatus === 'expired';
    const isRejected = vehicle.offerStatus === 'rejected';

    const difference = vehicle.sellerPrice - vehicle.yourOffer;
    const diffAbs = Math.abs(difference).toLocaleString();
    const diffPct = ((Math.abs(difference) / vehicle.sellerPrice) * 100).toFixed(2);

    // ── Timeline definitions ──────────────────────────────────────────
    const timelineAccepted = [
        { label: 'Offer Submitted', sub: `You submitted an offer of AED ${vehicle.yourOffer?.toLocaleString()} for this vehicle.`, state: 'done', badge: null },
        { label: 'Offer Sent to Seller', sub: 'Your offer has been sent to the seller for review.', state: 'done', badge: null },
        { label: 'Offer Accepted', sub: 'Congratulations! The seller has accepted your offer.', state: 'done', badge: { label: 'Accepted', color: 'bg-emerald-100 text-emerald-700' } },
        { label: 'Payment Pending', sub: 'Please complete the payment to confirm your purchase.', state: 'progress', badge: { label: 'Pending', color: 'bg-amber-100 text-amber-700' } },
    ];

    const timelineActive = [
        { label: 'Offer Submitted', sub: `You submitted an offer of AED ${vehicle.yourOffer?.toLocaleString()} for this vehicle.`, state: 'done', badge: null },
        { label: 'Offer Sent to Seller', sub: 'Your offer has been sent to the seller for review.', state: 'done', badge: null },
        { label: 'Seller Reviewing', sub: 'The seller is reviewing your offer.', state: 'active', badge: { label: 'Active', color: 'bg-blue-100 text-blue-700' } },
        { label: 'Seller Response', sub: "You'll be notified once the seller accepts, rejects, or counters your offer.", state: 'pending', badge: null },
    ];

    const timelineExpired = [
        { label: 'Offer Submitted', sub: `You submitted an offer of AED ${vehicle.yourOffer?.toLocaleString()} for this vehicle.`, state: 'done', badge: null },
        { label: 'Offer Sent to Seller', sub: 'Your offer has been sent to the seller for review.', state: 'done', badge: null },
        { label: 'Seller Reviewing', sub: 'The seller reviewed your offer.', state: 'done', badge: null },
        { label: 'Offer Expired', sub: 'This offer has expired.', state: 'expired', badge: { label: 'Expired', color: 'bg-gray-100 text-gray-600' } },
    ];

    const timelineRejected = [
        { label: 'Offer Submitted', sub: `You submitted an offer of AED ${vehicle.yourOffer?.toLocaleString()} for this vehicle.`, state: 'done', badge: null },
        { label: 'Offer Reviewed', sub: 'The seller reviewed your offer.', state: 'rejected', badge: null },
        { label: 'Offer Rejected', sub: 'The seller has rejected your offer.', state: 'rejected', badge: { label: 'Rejected', color: 'bg-red-100 text-red-600' } },
    ];

    const timeline = isAccepted ? timelineAccepted
        : isActive ? timelineActive
            : isExpired ? timelineExpired
                : timelineRejected;

    // ── Timeline icon per state ───────────────────────────────────────
    const TimelineIcon = ({ state }) => {
        if (state === 'done') return (
            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            </div>
        );
        if (state === 'progress') return (
            <div className="w-6 h-6 rounded-full border-2 border-amber-500 flex items-center justify-center shrink-0">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
            </div>
        );
        if (state === 'active') return (
            <div className="w-6 h-6 rounded-full border-2 border-blue-500 flex items-center justify-center shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            </div>
        );
        if (state === 'rejected' || state === 'expired') return (
            <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </div>
        );
        // pending
        return (
            <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
            </div>
        );
    };

    return (
        <div className="w-full bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">

            {/* header */}
            <div className="p-6 border-b border-slate-100">
                <h2 className="text-base font-bold text-[#0B1E3D] mb-4">
                    Your Offer Information
                    </h2>

                {/* 3 stat boxes */}
                <div className="grid grid-cols-3 gap-4 mb-5">
                    <div className="bg-slate-50 rounded-xl p-4">
                        <p className="text-xs text-slate-500 mb-1">Your Offer</p>
                        <p className="text-lg font-bold text-[#0B1E3D]">AED {vehicle.yourOffer?.toLocaleString() || "23,000"}</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4">
                        <p className="text-xs text-slate-500 mb-1">Seller Price</p>
                        <p className="text-lg font-bold text-[#0B1E3D]">AED {vehicle.sellerPrice?.toLocaleString() | "27,000"}</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4">
                        <p className="text-xs text-slate-500 mb-1">Difference</p>
                        {isRejected ? (
                            <p className="text-lg font-bold text-slate-400">—</p>
                        ) : (
                            <p className="text-base font-bold text-emerald-600">
                                {/* AED {diffAbs} */}
                                {/* <span className="text-xs font-normal ml-1">({diffPct}% below)</span> */}
                                AED 9000
                                <span className="text-xs font-normal ml-1">({"1,0000"}% below)</span>
                            </p>
                        )}
                    </div>
                </div>

                {/* row */}
                <div className="grid grid-cols-4 gap-4 pt-4 border-t border-slate-100">

                    {/* Offer Status —show in all */}
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Offer Status</p>
                        {isAccepted && <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full">Accepted</span>}
                        {isActive && <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">Active</span>}
                        {isExpired && <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-full">Expired</span>}
                        {isRejected && <span className="bg-red-100 text-red-600 text-xs font-semibold px-2.5 py-1 rounded-full">Rejected</span>}
                        <p className="text-xs text-slate-400 mt-1">
                            {isAccepted && 'Seller accepted your offer'}
                            {isActive && 'Offer sent'}
                            {isExpired && 'Offer expired'}
                            {isRejected && 'Seller rejected your offer'}
                        </p>
                    </div>

                    {/* Col 2 — date label varies */}
                    <div>
                        <p className="text-xs text-slate-500 mb-1">
                            {isAccepted ? 'Accepted On' : 'Offered On'}
                        </p>
                        <p className="text-sm font-semibold text-[#0B1E3D]">{vehicle.offeredOn || "May 20, 2024 · 10:45 AM GST"}</p>
                    </div>

                    {/* Col 3 — expires / expired on / rejection date */}
                    <div>
                        <p className="text-xs text-slate-500 mb-1">
                            {isAccepted ? 'Offer Expires In' : isExpired ? 'Offer Expires On' : isRejected ? 'Rejection Date' : 'Offer Expires In'}
                        </p>
                        {(isAccepted || isActive) && (
                            <div>
                                <p className="text-sm font-bold text-[#0B1E3D]">{vehicle.offerExpiresIn || "1d 04h 25m"}</p>
                                <p className="text-xs text-slate-400">{vehicle.offerExpiresOn || "May 22, 2024 · 11:00 AM GST"}</p>
                            </div>
                        )}
                        {isExpired && <p className="text-sm font-semibold text-[#0B1E3D]">{vehicle.offerExpiresOn || "May 22, 2024 · 11:00 AM GST"}</p>}
                        {isRejected && <p className="text-sm font-semibold text-[#0B1E3D]">{vehicle.rejectionDate || "May 20, 2024 · 02:30 PM GST"}</p>}
                    </div>

                    {/* Offer ID — all */}
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Offer ID</p>
                        <p className="text-sm font-semibold text-[#0B1E3D]">{vehicle.offerId || "OFF-245678-01"}</p>
                    </div>

                </div>
            </div>

            {/* ── Bottom box: tabs ── */}
            <div className="p-6">

                {/* Tab headers */}
                <div className="flex gap-6 border-b border-slate-100 mb-5">
                    <button
                        onClick={() => setActiveTab('timeline')}
                        className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'timeline' ? 'border-[#0B1E3D] text-[#0B1E3D]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                    >
                        Offer Timeline
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'history' ? 'border-[#0B1E3D] text-[#0B1E3D]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                    >
                        Offer History
                    </button>
                </div>

                {/* Timeline tab */}
                {activeTab === 'timeline' && (
                    <div className="flex flex-col gap-4">
                        {timeline.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-3">
                                <TimelineIcon state={item.state} />
                                <div className="flex-1 flex justify-between items-start gap-4">
                                    <div>
                                        <p className="text-sm font-semibold text-[#0B1E3D]">{item.label}</p>
                                        <p className="text-xs text-slate-400 mt-0.5">{item.sub}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1 shrink-0">
                                        <p className="text-xs text-slate-400">{item.date}</p>
                                        {item.badge && (
                                            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${item.badge.color}`}>
                                                {item.badge.label}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* History tab — placeholder */}
                {activeTab === 'history' && (
                    <div className="py-8 text-center text-slate-400 text-sm">
                        No offer history available.
                    </div>
                )}

            </div>
        </div>
    );
}

export default BuyerMyOffersDetailOfferInfo;
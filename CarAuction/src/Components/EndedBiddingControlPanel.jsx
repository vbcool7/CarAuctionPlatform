
import React from 'react';
import { HiCheckCircle, HiXCircle } from 'react-icons/hi';
import { HiReceiptRefund } from 'react-icons/hi2';

// ─── Sold Panel ───────────────────────────────────────────────
function SoldBidPanel({ vehicle }) {
    return (
        <div className="flex flex-col h-full">

            {/* Auction Completed Bar */}
            <div className="bg-green-50 border-t border-x border-green-200 rounded-t-xl px-5 py-3 text-center">
                <div className="flex items-center justify-center gap-2">
                    <HiCheckCircle className="text-green-500" size={18} />
                    <span className="text-sm font-semibold text-green-700">Auction Completed</span>
                </div>
                <p className="text-xs text-green-600 mt-0.5">
                    This auction ended on {vehicle.endedDate}, {vehicle.endedTime} GST
                </p>
            </div>

            <div className='border-x border-b border-gray-200 rounded-b-xl p-4 flex flex-col gap-4'>
                {/* Winning Bid */}
                <div>
                    <p className="text-sm text-slate-500 mb-1">Winning Bid</p>
                    <p className="text-3xl font-bold text-[#D97706]">{vehicle.soldPrice}</p>
                </div>

                {/* Sold To / Winning Country */}
                <div className="grid grid-cols-2 gap-4 border border-slate-200 rounded-xl p-4">
                    <div>
                        <p className="text-xs text-slate-400 mb-1">Sold To</p>
                        <p className="text-sm font-semibold text-[#0F172A]">{vehicle.winner}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 mb-1">Winning Country</p>
                        <div className="flex items-center gap-1.5">
                            <p className="text-sm font-semibold text-[#0F172A]">UAE</p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="border border-slate-200 rounded-xl p-4">
                        <p className="text-xs text-slate-400 mb-1">Final Bid</p>
                        <p className="text-sm font-semibold text-[#0F172A]">{vehicle.soldPrice}</p>
                    </div>
                    <div className="border border-slate-200 rounded-xl p-4">
                        <p className="text-xs text-slate-400 mb-1">Number Of Bids</p>
                        <p className="text-sm font-semibold text-[#0F172A]">{vehicle.totalBids ?? '—'}</p>
                    </div>
                    <div className="border border-slate-200 rounded-xl p-4">
                        <p className="text-xs text-slate-400 mb-1">Reserve Price</p>
                        <p className="text-sm font-semibold text-[#0F172A]">{vehicle.reservePrice ?? '—'}</p>
                    </div>
                    <div className="border border-slate-200 rounded-xl p-4">
                        <p className="text-xs text-slate-400 mb-1">Auction Type</p>
                        <p className="text-sm font-semibold text-[#0F172A]">{vehicle.source ?? 'Live Auction'}</p>
                    </div>
                </div>

                {/* View Payment Summary */}
                <button className="w-full flex items-center justify-center gap-2 border border-slate-300 text-slate-700 py-3 rounded-xl text-sm font-semibold hover:bg-slate-50 transition cursor-pointer">
                    <HiReceiptRefund size={18} />
                    View Payment Summary
                </button>
            </div>
        </div>
    );
}

// ─── Unsold Panel ─────────────────────────────────────────────
function UnsoldBidPanel({ vehicle }) {

    // Calculate slider position percentage
    const highest = parseInt(vehicle.highestBid?.replace(/[^0-9]/g, '') || 0);
    const reserve = parseInt(vehicle.reservePrice?.replace(/[^0-9]/g, '') || 1);
    const sliderPct = Math.min((highest / reserve) * 100, 100);

    // Difference
    const diff = reserve - highest;
    const diffFormatted = `AED ${diff.toLocaleString()}`;

    return (
        <div className="flex flex-col gap-4 h-full border border-gray-200 p-4 rounded-xl ">

            {/* Auction Outcome Header */}
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#0F172A] text-base">Auction Outcome</h3>
                <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-full">
                    <HiXCircle size={15} />
                    Not Sold
                </div>
            </div>

            {/* Bid / Reserve / Difference */}
            <div className="grid grid-cols-3 gap-3">
                <div>
                    <p className="text-xs text-slate-400 mb-1">Highest Bid</p>
                    <p className="text-xl font-bold text-[#0F172A]">{vehicle.highestBid}</p>
                </div>
                <div>
                    <p className="text-xs text-slate-400 mb-1">Reserve Price</p>
                    <p className="text-sm font-semibold text-[#0F172A] mt-1">{vehicle.reservePrice}</p>
                </div>
                <div>
                    <p className="text-xs text-slate-400 mb-1">Difference</p>
                    <p className="text-sm font-semibold text-red-500 mt-1">{diffFormatted}</p>
                </div>
            </div>

            {/* Total Bids / Auction Duration */}
            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                <div>
                    <p className="text-xs text-slate-400 mb-1">Total Bids</p>
                    <p className="text-sm font-semibold text-[#0F172A]">{vehicle.totalBids ?? '—'}</p>
                </div>
                <div>
                    <p className="text-xs text-slate-400 mb-1">Auction Duration</p>
                    <p className="text-sm font-semibold text-[#0F172A]">{vehicle.estDuration ?? '—'}</p>
                </div>
            </div>

            {/* Why Not Sold */}
            <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                <p className="text-sm font-semibold text-red-700 mb-1">Why This Auction Was Not Sold?</p>
                <p className="text-sm font-medium text-red-500">Reserve Price Not Met</p>

                {/* Slider */}
                <div className="mt-4">
                    <div className="relative h-2 bg-red-200 rounded-full">
                        <div
                            className="absolute left-0 top-0 h-2 bg-[#0F172A] rounded-full"
                            style={{ width: `${sliderPct}%` }}
                        />
                        <div
                            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow"
                            style={{ left: `calc(${sliderPct}% - 8px)` }}
                        />
                    </div>
                    <div className="flex justify-between mt-2">
                        <div>
                            <p className="text-xs font-semibold text-[#0F172A]">
                                {highest.toLocaleString()}
                            </p>
                            <p className="text-xs text-slate-400">Highest Bid</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-semibold text-[#0F172A]">
                                {reserve.toLocaleString()}
                            </p>
                            <p className="text-xs text-slate-400">Reserve Price</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Main Export ──────────────────────────────────────────────
function EndedBiddingControlPanel({ vehicle }) {
    if (vehicle.status === 'sold') return <SoldBidPanel vehicle={vehicle} />;
    return <UnsoldBidPanel vehicle={vehicle} />;
}

export default EndedBiddingControlPanel;
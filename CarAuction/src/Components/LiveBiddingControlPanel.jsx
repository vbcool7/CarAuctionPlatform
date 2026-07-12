
import React from 'react';
import AuctionCountdown from './AuctionCountdown';

function LiveBiddingControlPanel({ vehicle }) {
    const bidderAvatars = [
        { initials: "JM", color: "bg-blue-500" },
        { initials: "AH", color: "bg-green-500" },
        { initials: "SK", color: "bg-purple-500" },
        { initials: "MR", color: "bg-red-500" },
        { initials: "DW", color: "bg-yellow-500" },
    ];

    return (
        <div className="bg-[#0B1E3D] text-white p-4 rounded-2xl shadow-xl">

            {/* Header */}
            <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-medium text-slate-300">Auction Ends In</span>
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#D97706] bg-[#D97706]/10 px-2 py-0.5 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] animate-pulse"></span>
                    LIVE
                </span>
            </div>

            {/* Countdown */}
            <div>
                <AuctionCountdown endTime={vehicle.endTime} />
                <div className="grid grid-cols-3 text-center mt-1">
                    <span className="text-[9px] text-slate-400 uppercase tracking-widest">HRS</span>
                    <span className="text-[9px] text-slate-400 uppercase tracking-widest">MINS</span>
                    <span className="text-[9px] text-slate-400 uppercase tracking-widest">SECS</span>
                </div>
            </div>

            {/* Divider + Bid Info */}
            <div className="space-y-2.5 mt-4 border-t border-slate-600 pt-4">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <p className="text-slate-400 text-[9px] uppercase tracking-wide">Current Highest Bid</p>
                        <p className="text-lg font-bold mt-0.5 text-[#D97706]">{vehicle.bid}</p>
                    </div>
                    <div>
                        <p className="text-slate-400 text-[9px] uppercase tracking-wide">Total Bids</p>
                        <p className="text-lg font-bold mt-0.5">{vehicle.totalBids}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <p className="text-slate-400 text-[9px] uppercase tracking-wide">Maximum Bid Limit</p>
                        <p className="text-xs font-semibold mt-0.5">{vehicle.maxBidLimit || "AED 300,000"}</p>
                    </div>
                    <div>
                        <p className="text-slate-400 text-[9px] uppercase tracking-wide">Minimum Next Bid</p>
                        <p className="text-xs font-semibold mt-0.5">{vehicle.minNextBid || "AED 5,000"}</p>
                    </div>
                </div>
            </div>

            {/* Input & Buttons */}
            <div className="mt-4 space-y-2">
                <div className="relative">
                    <input
                        type="number"
                        placeholder="Enter your bid amount"
                        className="w-full bg-[#142d55] border border-slate-600 rounded-lg py-2.5 px-3 text-sm text-white placeholder-slate-400 outline-none focus:border-[#D97706]"
                    />
                    <span className="absolute right-3 top-2.5 text-xs font-bold text-[#D97706]">AED</span>
                </div>

                <button className="w-full bg-[#D97706] hover:bg-[#b86405] text-white text-sm font-bold py-2.5 rounded-lg transition-all">
                    Place Bid Now
                </button>

                <button className="w-full border border-slate-600 hover:border-[#D97706] hover:text-[#D97706] text-white text-sm font-medium py-2 rounded-lg transition-all">
                    Buy Now AED 420,000
                </button>
            </div>

            {/* Bidders Online */}
            <div className="mt-3 flex items-center gap-2 pt-3 border-t border-slate-700">
                <div className="flex -space-x-1.5">
                    {bidderAvatars.map((b, i) => (
                        <div
                            key={i}
                            className={`w-6 h-6 rounded-full ${b.color} flex items-center justify-center text-[9px] font-bold text-white ring-2 ring-[#0B1E3D]`}
                        >
                            {b.initials}
                        </div>
                    ))}
                    <div className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center text-[9px] font-bold text-white ring-2 ring-[#0B1E3D]">
                        +6
                    </div>
                </div>
                <span className="text-[10px] text-slate-400">{vehicle.biddersOnline || 12} Bidders Online</span>
            </div>

        </div>
    );
}

export default LiveBiddingControlPanel;
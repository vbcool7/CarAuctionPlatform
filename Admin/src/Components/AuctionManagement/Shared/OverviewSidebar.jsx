
import React from "react";
import { formatLabel, formatPrice } from "../../utils/formatter";

function OverviewSidebar({ vehicle, bids, participants, setCurrentPage }) {

    const hasBids = bids?.length > 0;

    // Current highest bid = jo status 'active' ya 'won' hai
    // (withdrawn/outbid/cancelled bids ka amount stale ho sakta hai, unhe count nahi karna)
    const topBid = hasBids
        ? bids.find((b) => b.status === 'active' || b.status === 'won') || null
        : null;

    const recentActiveBids = bids.filter(
        (b) => b.status !== 'withdrawn' && b.status !== 'cancelled'
    );

    return (
        <div className="space-y-6">

            {/* Current Highest Bid */}
            <div className="bg-white border border-slate-200 rounded-xl p-5">

                <h3 className="text-sm font-semibold text-slate-700 mb-3">
                    Current Highest Bid
                </h3>

                {topBid ? (
                    <>
                        <div className="text-2xl font-bold text-green-600">
                            {formatPrice(topBid.amount)}
                        </div>

                        <div className="flex items-center gap-2 mt-2 text-sm text-slate-600">
                            By {topBid.bidder?.name || "Unknown Bidder"}
                        </div>

                        <div className="text-xs text-slate-500 mt-1">
                            {participants.find(
                                (p) =>
                                    p.bidderId?.toString() ===
                                    topBid.bidderId?.toString()
                            )?.totalBids || 0}{" "}
                            bids
                        </div>
                    </>
                ) : (
                    <div className="text-sm text-slate-400">
                        No bids yet
                    </div>
                )}

                <div className="mt-3 text-xs text-slate-500">
                    Reserve Price:{" "}
                    {vehicle.reservePrice
                        ? formatPrice(vehicle.reservePrice)
                        : "—"}
                </div>

            </div>


            {/* Top Bids */}
            <div className="bg-white border border-slate-200 rounded-xl p-5">

                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-[#0B1E3D]">
                        Top Bids
                    </h3>

                    {hasBids && (
                        <button
                            onClick={() => setCurrentPage('bid-management')}
                            className="text-xs text-[#D97706] font-semibold hover:underline"
                        >
                            View All
                        </button>
                    )}
                </div>

                {hasBids ? (
                    <div className="space-y-2">

                        {[...bids]
                            .sort((a, b) => b.amount - a.amount)
                            .slice(0, 5)
                            .map((bid, index) => (

                                <div
                                    key={bid._id}
                                    className="flex items-center justify-between px-3 py-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition"
                                >

                                    {/* Left */}
                                    <div className="flex items-center gap-3 min-w-0">

                                        {/* Rank */}
                                        <div
                                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${index === 0
                                                ? "bg-amber-100 text-amber-700"
                                                : index === 1
                                                    ? "bg-slate-200 text-slate-600"
                                                    : index === 2
                                                        ? "bg-orange-100 text-orange-700"
                                                        : "bg-white text-slate-500 border border-slate-200"
                                                }`}
                                        >
                                            {index + 1}
                                        </div>

                                        {/* Bidder */}
                                        <div className="min-w-0">
                                            <p className="text-[12px] font-medium text-[#0B1E3D] truncate">
                                                {bid.bidder?.name || "Unknown Bidder"}
                                            </p>

                                            <p className="text-[11px] text-slate-400 mt-0.5">
                                                {formatLabel(bid.bidderType)}
                                            </p>
                                        </div>

                                    </div>

                                    {/* Amount */}
                                    <div className="text-right shrink-0 ml-3">
                                        <p className="text-[12px] font-bold text-[#0B1E3D]">
                                            {formatPrice(bid.amount)}
                                        </p>

                                        <p className="text-[10px] text-slate-400 mt-0.5">
                                            {bid.status === "won"
                                                ? "Winning"
                                                : "Bid"}
                                        </p>
                                    </div>

                                </div>

                            ))}

                    </div>
                ) : (
                    <div className="py-6 text-center">
                        <p className="text-sm text-slate-400">
                            No bids placed yet
                        </p>
                    </div>
                )}

            </div>


            {/* Live Activity */}
            <div className="bg-white border border-slate-200 rounded-xl p-5">

                <h3 className="text-sm font-semibold text-slate-700 mb-3">
                    {vehicle.auctionStatus === "live"
                        ? "Live Activity"
                        : "Activity"}
                </h3>

                {hasBids ? (
                    <div className="space-y-3">

                        {recentActiveBids.slice(0, 5).map((bid) => (

                            <div
                                key={bid._id}
                                className="flex justify-between text-sm text-slate-600"
                            >

                                <div>
                                    <p className="font-medium text-[#0B1E3D]">
                                        {bid.bidder?.name || "Unknown Bidder"}
                                    </p>

                                    <p className="text-xs text-slate-400">
                                        {bid.createdAt
                                            ? new Date(
                                                bid.createdAt
                                            ).toLocaleTimeString("en-GB", {
                                                timeZone: "Asia/Dubai",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: true,
                                            })
                                            : "—"}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="font-semibold text-[#0B1E3D]">
                                        {formatPrice(bid.amount)}
                                    </p>

                                    <p
                                        className={`text-[10px] mt-0.5 ${bid.status === "active"
                                                ? "text-green-500"
                                                : bid.status === "won"
                                                    ? "text-purple-500"
                                                    : bid.status === "withdrawn" || bid.status === "cancelled"
                                                        ? "text-red-400"
                                                        : "text-slate-400"
                                            }`}
                                    >
                                        {formatLabel(bid.status)}
                                    </p>
                                </div>

                            </div>

                        ))}

                    </div>
                ) : (
                    <div className="text-sm text-slate-400">
                        No activity yet
                    </div>
                )}

            </div>

        </div>
    );
}

export default OverviewSidebar;
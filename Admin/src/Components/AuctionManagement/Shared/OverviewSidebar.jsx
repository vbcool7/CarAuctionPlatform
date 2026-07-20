
import React from "react";

function OverviewSidebar({ auction }) {

    const hasBids = auction.biddersData && auction.biddersData.length > 0;
    const topBidder = hasBids ? auction.biddersData[0] : null;

    return (
        <div className="space-y-6">

            {/* Current Highest Bid */}
            <div className="bg-white border border-slate-200 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Current Highest Bid</h3>
                {hasBids ? (
                    <>
                        <div className="text-2xl font-bold text-green-600">{topBidder.bidAmount}</div>
                        <div className="flex items-center gap-2 mt-2 text-sm text-slate-600">
                            By {topBidder.bidderName} · {topBidder.totalBids} bids
                        </div>
                    </>
                ) : (
                    <div className="text-sm text-slate-400">No bids yet — auction hasn't started</div>
                )}
                <div className="mt-3 text-xs text-slate-500">Reserve Price: {auction.reserve}</div>
            </div>

            {/* Top Bids */}
            <div className="bg-white border border-slate-200 rounded-xl p-5">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-semibold text-slate-700">
                        Top Bids
                    </h3>
                    {hasBids &&
                        <button className="text-xs text-[#D97706] font-medium">
                            View All
                        </button>
                    }
                </div>
                {hasBids ? (
                    <div className="space-y-3">
                        {auction.biddersData.slice(0, 5).map((b, i) => (
                            <div key={b.id} className="flex justify-between text-sm">
                                <span>{i + 1}. {b.bidderName}</span>
                                <span className="font-semibold">{b.bidAmount}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-sm text-slate-400">No bids placed yet</div>
                )}
            </div>

            {/* Live Activity */}
            <div className="bg-white border border-slate-200 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">
                    {auction.status === 'Live' ? 'Live Activity' : 'Activity'}
                </h3>
                {auction.status === 'Live' && hasBids ? (
                    <div className="space-y-2 text-sm text-slate-600">
                        {/* map real activity feed here once that data shape exists */}
                    </div>
                ) : (
                    <div className="text-sm text-slate-400">
                        {auction.status === 'Upcoming' ? 'Activity will appear once the auction starts' : 'No activity yet'}
                    </div>
                )}
            </div>
        </div>
    );
}

export default OverviewSidebar;
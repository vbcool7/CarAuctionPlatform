
import React from 'react';
import { formatPrice } from '../../utils/formatters';

function LiveBidsPanel({ bids = [] }) {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>

                    <h3 className="text-slate-900 text-sm font-bold">
                        Live Bidding History
                    </h3>
                </div>

                <span className="text-[10px] text-slate-400">
                    {bids.length} Recent Bids
                </span>
            </div>

            {bids.length === 0 ? (
                <div className="px-4 py-8 text-center text-slate-500 text-sm">
                    No bids yet.
                </div>
            ) : (
                <div className="flex flex-col">

                    {/* Header Row */}
                    <div className="grid grid-cols-3 px-4 py-2 text-[10px] uppercase tracking-wider text-slate-400 font-bold bg-slate-50/50">
                        <span>Bidder</span>
                        <span className="text-center">Amount</span>
                        <span className="text-right">Time</span>
                    </div>

                    {/* Bids List */}
                    <div className="max-h-90 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                        {bids.map((bid, i) => (
                            <div
                                key={bid._id || i}
                                className={`grid grid-cols-3 px-4 py-3 items-center border-b border-slate-50 transition-colors ${
                                    i === 0
                                        ? "bg-amber-50/50"
                                        : "hover:bg-slate-50"
                                }`}
                            >
                                {/* Bidder */}
                                <div className="flex items-center gap-2">
                                    {/* <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                                        {bid.label?.charAt(0) || 'B'}
                                    </div> */}

                                    <span className="text-slate-700 text-sm font-medium">
                                        {bid.label || `Bidder`}
                                    </span>
                                </div>

                                {/* Amount */}
                                <span
                                    className={`text-[12px] text-center font-bold ${
                                        i === 0
                                            ? "text-amber-600"
                                            : "text-slate-900"
                                    }`}
                                >
                                    {formatPrice(bid.amount)}
                                </span>

                                {/* Time */}
                                <span className="text-slate-400 text-[11px] text-right font-medium">
                                    {bid.createdAt
                                        ? new Date(bid.createdAt).toLocaleTimeString([], {
                                              hour: '2-digit',
                                              minute: '2-digit'
                                          })
                                        : '--'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default LiveBidsPanel;
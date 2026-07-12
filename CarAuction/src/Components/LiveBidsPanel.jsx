
import React, { useState } from 'react';
import { liveBids } from './Data';

function LiveBidsPanel() {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <h3 className="text-slate-900 text-sm font-bold">Live Bidding History</h3>
                </div>
            </div>

            {liveBids.length === 0 ? (
                <div className="px-4 py-8 text-center text-slate-500 text-sm">No bids yet.</div>
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
                        {liveBids.map((bid, i) => (
                            <div
                                key={bid._id || i}
                                className={`grid grid-cols-3 px-4 py-3 items-center border-b border-slate-50 transition-colors ${i === 0 ? "bg-amber-50/50" : "hover:bg-slate-50"}`}
                            >
                                <div className="flex items-center gap-2">
                                    {/* Simple Avatar Placeholder */}
                                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                                        {bid.bidder.charAt(0)}
                                    </div>
                                    <span className="text-slate-700 text-sm font-medium">{bid.bidder}</span>
                                </div>

                                <span className={`text-sm text-center font-bold ${i === 0 ? "text-amber-600" : "text-slate-900"}`}>
                                    {bid.amount}
                                </span>

                                <span className="text-slate-400 text-xs text-right font-medium">
                                    {bid.time}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default LiveBidsPanel;
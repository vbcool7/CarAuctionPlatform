
import React from 'react';
import { Zap } from 'lucide-react';

function BuyerLostAuctionsDetailBiddingSummary({ vehicle }) {

    const biddingData = [
        { label: 'Starting Bid', value: vehicle?.startingBid || 'AED 60,000' },
        { label: 'Min. Next Bid', value: vehicle?.minNextBid || 'AED 1,000' },
        { label: 'Your Max Bid', value: vehicle?.yourMaxBid || 'AED 118,000' },
        { label: 'Total Bidders', value: vehicle?.totalBidders || '12' },
    ];

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h2 className="text-lg font-bold text-[#0B1E3D] mb-6">
                Bidding Summary
            </h2>

            <div className="space-y-4">
                {biddingData.map((item, index) => (
                    <div
                        key={index}
                        className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                        <span className="text-slate-500 text-sm">{item.label}</span>
                        <span className="font-bold text-[#0B1E3D] text-sm text-right">
                            {item.value}
                        </span>
                    </div>
                ))}

                {/* footer badge */}
                <div className="mt-4 flex items-center gap-2 bg-slate-50 p-3 rounded-lg text-slate-600 text-sm">
                    <Zap size={18} className="text-orange-500 shrink-0" />
                    <p>You were outbid by another bidder.</p>
                </div>
            </div>
        </div>
    );
}

export default BuyerLostAuctionsDetailBiddingSummary;
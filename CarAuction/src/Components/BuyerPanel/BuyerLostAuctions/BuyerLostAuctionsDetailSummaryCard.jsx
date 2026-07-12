
import React from 'react';

function BuyerLostAuctionsDetailSummaryCard({ vehicle }) {

    const auctionData = [
        { label: 'Result', value: 'Outbid', type: 'badge' },
        { label: 'Winning Bid', value: vehicle?.winningBid || 'AED 120,000' },
        { label: 'Winner', value: vehicle?.winnerName || 'Another Bidder' },
        { label: 'Your Final Bid', value: vehicle?.finalBid || 'AED 118,000' },
        { label: 'Total Bids Placed', value: vehicle?.totalBids || '16' },
        { label: 'Auction Ended', value: vehicle?.endDate || 'May 20, 2024 - 11:12 AM GST' },
    ];

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h2 className="text-lg font-bold text-[#0B1E3D] tracking-tighter">
                Auction Results
            </h2>

            <div className="space-y-2">
                {auctionData.map((item, index) => (
                    <div
                        key={index}
                        className="flex justify-between items-center py-1.5 border-b border-slate-50 last:border-0">
                        <span className="text-slate-500 text-sm">{item.label}</span>

                        {item.type === 'badge' ? (
                            <span className="bg-red-50 text-red-500 text-xs font-bold px-3 py-1 rounded-md">
                                {item.value}
                            </span>
                        ) : (
                            <span className="font-semibold text-[#0B1E3D] text-[13px] text-right tracking-tight">
                                {item.value}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BuyerLostAuctionsDetailSummaryCard;
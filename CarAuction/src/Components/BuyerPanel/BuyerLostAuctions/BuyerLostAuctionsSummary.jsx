
import React from 'react';
import { BarChart3 } from 'lucide-react';

function BuyerLostAuctionsSummary() {
    const summaryData = [
        { label: 'Total Lost', value: '8' },
        { label: 'Outbid', value: '8' },
        { label: 'Win Rate', value: '0%' },
        { label: 'Total Bids Placed', value: '16' },
        { label: 'Total Amount Bid', value: 'AED 1,314,500' },
    ];

    return (
        <div className="w-full max-w-sm bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="text-[#0B1E3D]" size={20} />
                <h2 className="text-lg font-bold text-[#0B1E3D]">Summary</h2>
            </div>

            {/* List */}
            <div className="space-y-5">
                {summaryData.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">{item.label}</span>
                        <span className="text-sm font-bold text-[#0B1E3D]">{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BuyerLostAuctionsSummary;
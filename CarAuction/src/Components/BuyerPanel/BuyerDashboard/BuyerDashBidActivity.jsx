
import React from 'react';
import { vehicles } from '../../Data';
import { ArrowRight } from 'lucide-react';

function BuyerDashBidActivity({setCurrentPage}) {

    const bidHistory = vehicles.slice(0, 3);

    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm w-full">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-[#0B1E3D]">
                    Bid Activity
                </h2>
                <button 
                onClick={() => setCurrentPage('bids')}
                className="flex items-center gap-1 text-[12px] md:text-sm font-semibold text-[#D97706] hover:text-[#D97706]/80 transition-colors cursor-pointer">
                    View All <ArrowRight size={16} />
                </button>
            </div>

            {/* List */}
            <div className="space-y-6">
                {bidHistory.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                        {/* Image */}
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 md:w-14 md:h-14 rounded-xl object-cover"
                        />

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-slate-600 truncate">
                                {/* Yahan status logic dynamic rakhein */}
                                <span className="font-medium text-[#0B1E3D] text-[12px] md:text-sm">You placed a bid on</span>
                            </p>
                            <p className="font-semibold text-[#0B1E3D] text-[12px] md:text-sm truncate">{item.name}</p>
                        </div>

                        {/* Price & Time */}
                        <div className="text-right shrink-0">
                            <p className="font-bold text-[#0B1E3D] text-[12px] md:text-sm">{item.soldPrice || item.bid}</p>
                            <p className="text-xs text-slate-400">2 min ago</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BuyerDashBidActivity;
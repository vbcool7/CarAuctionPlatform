
import React from 'react';
import { vehicles } from '../../Data';
import { ArrowRight } from 'lucide-react';

function BuyerDashWatchlist({setCurrentPage}) {

    const watchlistItems = vehicles.slice(3, 6);

    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm w-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-[#0B1E3D]">
                    Watchlist (12)
                </h2>
                <button
                onClick={() => setCurrentPage('watchlist')} 
                className="flex items-center gap-1 text-[12px] md:text-sm font-semibold text-[#D97706] hover:text-[#D97706]/80 transition-colors">
                    View All <ArrowRight size={16} />
                </button>
            </div>

            {/* List */}
            <div className="space-y-6">
                {watchlistItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">

                        {/* Image */}
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 md:w-14 md:h-14 rounded-xl object-cover"
                        />

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-[#0B1E3D] text-[12px] md:text-sm truncate">{item.name}</p>
                        </div>

                        {/* Price & Status */}
                        <div className="text-right shrink-0">
                            <p className="font-bold text-[#0B1E3D] text-[12px] md:text-sm">{item.soldPrice || item.bid}</p>
                            
                            <p className={`text-xs font-medium ${item.status === 'live' ? 'text-green-600' : 'text-slate-500'
                                }`}>
                                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BuyerDashWatchlist;
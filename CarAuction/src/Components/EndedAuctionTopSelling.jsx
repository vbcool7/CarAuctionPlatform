
import React from 'react';

const topMakes = [
    { rank: 1, name: 'BMW', count: 245 },
    { rank: 2, name: 'Mercedes-Benz', count: 210 },
    { rank: 3, name: 'Toyota', count: 165 },
    { rank: 4, name: 'Audi', count: 150 },
    { rank: 5, name: 'Land Rover', count: 120 },
];

function EndedAuctionTopSelling() {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-[#0F172A] mb-4">Top Selling Makes</h3>

            <div className="space-y-3">
                {topMakes.map((make) => (
                    <div key={make.rank} className="flex items-center gap-3">
                        {/* Rank */}
                        <span className="text-sm text-slate-400 w-4 shrink-0">{make.rank}</span>

                        {/* Logo placeholder */}
                        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                            <span className="text-[10px] font-bold text-slate-400">
                                {make.name.slice(0, 1)}
                            </span>
                        </div>

                        {/* Name */}
                        <span className="text-sm text-slate-700 flex-1">{make.name}</span>

                        {/* Count */}
                        <span className="text-sm font-semibold text-[#0F172A]">{make.count}</span>
                    </div>
                ))}
            </div>

            <button className="mt-5 w-full border border-[#D97706] text-[#D97706] py-2.5 rounded-lg text-sm font-semibold hover:bg-[#D97706]/5 transition cursor-pointer">
                View All Makes
            </button>
        </div>
    );
}

export default EndedAuctionTopSelling;
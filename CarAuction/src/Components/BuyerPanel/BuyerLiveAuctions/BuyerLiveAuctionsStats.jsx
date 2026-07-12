
import React from 'react';
import { Gavel, Users, Car, Clock } from 'lucide-react';

const stats = [
    {
        title: 'Live Auctions',
        value: '12',
        color: 'bg-indigo-50',
        iconColor: 'text-indigo-600',
        icon: <Gavel size={24} />
    },
    {
        title: 'Active Bidders',
        value: '342',
        color: 'bg-emerald-50',
        iconColor: 'text-emerald-600',
        icon: <Users size={24} />
    },
    {
        title: 'Vehicles in Auction',
        value: '98',
        color: 'bg-orange-50',
        iconColor: 'text-orange-500',
        icon: <Car size={24} />
    },
    {
        title: 'Average Time Left',
        value: '02:45:18',
        color: 'bg-blue-50',
        iconColor: 'text-blue-600',
        icon: <Clock size={24} />
    },
];

function BuyerLiveAuctionsStats() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 py-8">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className="flex items-center gap-4 p-4 md:p-5 border border-slate-100 rounded-2xl bg-white shadow-sm transition-all hover:shadow-md"
                >
                    <div className={`p-3 rounded-xl ${stat.color} ${stat.iconColor}`}>
                        {stat.icon}
                    </div>

                    {/* Text Container */}
                    <div>
                        <h4 className="text-xl md:text-2xl font-bold text-[#0B1E3D] leading-none mb-1">
                            {stat.value}
                        </h4>
                        <p className="text-[13px] md:text-sm font-medium text-slate-500">
                            {stat.title}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default BuyerLiveAuctionsStats;
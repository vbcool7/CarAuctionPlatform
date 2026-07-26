
import React from 'react';
import { ArrowDown, ArrowUp, CalendarX, Calendar, Clock, User, Tag } from 'lucide-react';

const cancelledAuctionsStats = [
    {
        title: "Total Cancelled Auctions",
        value: "12",
        icon: CalendarX, 
        theme: "text-rose-600 bg-rose-50",
        subTitle: "14.3% from last month",
        subTextColor: "text-rose-500",
        isPositive: false
    },
    {
        title: "Cancelled Before Start",
        value: "7",
        icon: Calendar, 
        theme: "text-amber-600 bg-amber-50",
        subTitle: "16.7% from last month",
        subTextColor: "text-rose-500",
        isPositive: false
    },
    {
        title: "Cancelled In Progress",
        value: "3",
        icon: Clock, 
        theme: "text-purple-600 bg-purple-50",
        subTitle: "25% from last month",
        subTextColor: "text-emerald-500",
        isPositive: true
    },
    {
        title: "Cancelled By Admin",
        value: "9",
        icon: User, 
        theme: "text-blue-600 bg-blue-50",
        subTitle: "10% from last month",
        subTextColor: "text-emerald-500",
        isPositive: true
    },
    {
        title: "Avg. Starting Price",
        value: "$17,820",
        icon: Tag, 
        theme: "text-emerald-600 bg-emerald-50",
        subTitle: "8.2% from last month",
        subTextColor: "text-emerald-500",
        isPositive: true
    }
];

function CancelledAuctionsStats() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
            {cancelledAuctionsStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <div
                        key={index}
                        className="bg-white px-3 py-4 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center"
                    >
                        {/* Left Side: Text */}
                        <div>
                            <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">{stat.title}</p>
                            <h3 className="text-xl font-bold text-slate-900 py-2">{stat.value}</h3>
                            <div className={`flex items-center text-[11px] font-medium mt-1 ${stat.subTextColor}`}>
                                {stat.isPositive ? <ArrowUp size={12} className="mr-0.5" /> : <ArrowDown size={12} className="mr-0.5" />}
                                {stat.subTitle}
                            </div>
                        </div>

                        {/* Right Side: Icon */}
                        <div className={`p-2 rounded-lg ${stat.theme}`}>
                            <Icon size={20} />
                        </div>
                    </div>
                );
            })}
        </div>
    )
}

export default CancelledAuctionsStats;
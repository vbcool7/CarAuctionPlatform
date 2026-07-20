
import React from 'react';
import { ArrowDown, ArrowUp, Gavel, Radio, CalendarDays, CheckCircle, XCircle } from 'lucide-react';

const allAuctionsStats = [
    {
        title: "Total Auctions",
        value: "48",
        icon: Gavel,
        theme: "text-indigo-600 bg-indigo-50",
        subTitle: "12.5% from last month",
        subTextColor: "text-green-600",
        isPositive: true
    },
    {
        title: "Live Auctions",
        value: "8",
        icon: Radio,
        theme: "text-emerald-600 bg-emerald-50",
        subTitle: "23.1% from last month",
        subTextColor: "text-green-600",
        isPositive: true
    },
    {
        title: "Upcoming Auctions",
        value: "15",
        icon: CalendarDays,
        theme: "text-purple-600 bg-purple-50",
        subTitle: "8.7% from last month",
        subTextColor: "text-green-600",
        isPositive: true
    },
    {
        title: "Completed Auctions",
        value: "20",
        icon: CheckCircle,
        theme: "text-emerald-600 bg-emerald-50",
        subTitle: "15.3% from last month",
        subTextColor: "text-green-600",
        isPositive: true
    },
    {
        title: "Cancelled Auctions",
        value: "5",
        icon: XCircle,
        theme: "text-red-500 bg-red-50",
        subTitle: "5.2% from last month",
        subTextColor: "text-red-500",
        isPositive: false
    }
];

function AllAuctionsStats() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
            {allAuctionsStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <div
                        key={index}
                        className="bg-white px-3 py-4 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center"
                    >
                        {/* Left Side: Text */}
                        <div>
                            <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">{stat.title}</p>
                            <h3 className="text-xl font-bold text-slate-900">{stat.value}</h3>
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

export default AllAuctionsStats;
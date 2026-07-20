
import React from 'react';
import { CalendarDays, Clock3, CalendarRange, CalendarCheck, Tag, ArrowUp } from 'lucide-react';

const upcomingAuctionStats = [
    {
        title: "Total Upcoming",
        value: "15",
        trend: "8.7%",
        icon: CalendarDays,
        theme: "bg-violet-100",
        iconColor: "text-violet-600",
    },
    {
        title: "Starting Today",
        value: "3",
        trend: "20%",
        icon: Clock3,
        theme: "bg-green-100",
        iconColor: "text-green-600",
    },
    {
        title: "Starting This Week",
        value: "7",
        trend: "12.5%",
        icon: CalendarRange,
        theme: "bg-amber-100",
        iconColor: "text-amber-600",
    },
    {
        title: "Starting This Month",
        value: "15",
        trend: "15.3%",
        icon: CalendarCheck,
        theme: "bg-blue-100",
        iconColor: "text-blue-600",
    },
    {
        title: "Avg. Starting Price",
        value: "$18,650",
        trend: "5.6%",
        icon: Tag,
        theme: "bg-rose-100",
        iconColor: "text-rose-500",
    },
];

function UpcomingAuctionsStats() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
            {upcomingAuctionStats.map((stat, index) => {

                const Icon = stat.icon;

                return (
                    <div
                        key={index}
                        className="bg-white px-3 py-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex justify-between items-start"
                    >
                        {/* Left */}
                        <div className="flex-1">

                            <p className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold">
                                {stat.title}
                            </p>

                            <div className="flex justify-between items-center gap-2 mt-1">
                                <h3 className="text-2xl font-bold text-[#0B1E3D] leading-none">
                                    {stat.value}
                                </h3>

                                <div
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.theme}`}
                                >
                                    <Icon size={18} className={stat.iconColor} />
                                </div>

                            </div>

                            <p className="text-[12px] text-slate-500 font-medium flex items-center gap-1 mt-2">
                                <span className="text-emerald-600 flex items-center font-bold">
                                    <ArrowUp size={12} /> {stat.trend}
                                </span>
                                from last month
                            </p>
                        </div>

                        {/* Right */}

                    </div>
                );
            })}
        </div>
    )
}

export default UpcomingAuctionsStats;
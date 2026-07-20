
import React from "react";
import {
    Radio,
    Gavel,
    Users,
    DollarSign,
    Clock3,
} from "lucide-react";

const liveAuctionStats = [
    {
        title: "Live Auctions",
        value: 8,
        subTitle: "Currently running",
        badge: "Live",
        icon: Radio,
        theme: "bg-green-50",
        iconColor: "text-green-600",
    },
    {
        title: "Total Bids (All)",
        value: 142,
        subTitle: "Across all live auctions",
        icon: Gavel,
        theme: "bg-violet-50",
        iconColor: "text-violet-600",
    },
    {
        title: "Total Participants",
        value: 96,
        subTitle: "Active in live auctions",
        icon: Users,
        theme: "bg-blue-50",
        iconColor: "text-blue-600",
    },
    {
        title: "Total Value",
        value: "$284,750",
        subTitle: "Combined current bids",
        icon: DollarSign,
        theme: "bg-green-50",
        iconColor: "text-green-600",
    },
    {
        title: "Ending Soon",
        value: 3,
        subTitle: "Ending in next 5 min",
        icon: Clock3,
        theme: "bg-orange-50",
        iconColor: "text-orange-500",
    },
];

function LiveAuctionsStats() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
            {liveAuctionStats.map((stat, index) => {
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

                            <div className="flex items-center gap-2 mt-1">
                                <h3 className="text-xl font-bold text-[#0B1E3D] leading-none">
                                    {stat.value}
                                </h3>

                                {stat.badge && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 text-green-700 px-2 py-0.5 text-[9px] font-semibold">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                        {stat.badge}
                                    </span>
                                )}
                            </div>

                            <p className="text-[11px] text-slate-400 font-medium mt-2">
                                {stat.subTitle}
                            </p>

                        </div>

                        {/* Right */}
                        <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.theme}`}
                        >
                            <Icon size={18} className={stat.iconColor} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default LiveAuctionsStats;
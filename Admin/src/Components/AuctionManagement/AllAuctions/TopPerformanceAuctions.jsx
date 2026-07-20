
import React from 'react';
import { CheckCircle2, XCircle, PlusCircle } from "lucide-react";
import { allAuctionData } from '../../Data';

const activities = [
  {
    id: 1,
    title: "New auction created",
    subtitle: "2021 Chevrolet Camaro LT",
    time: "2 hours ago",
    icon: PlusCircle,
    color: "text-blue-500",
    bg: "bg-blue-100",
  },
  {
    id: 2,
    title: "Auction completed",
    subtitle: "2020 GMC Sierra 1500",
    time: "5 hours ago",
    icon: CheckCircle2,
    color: "text-green-600",
    bg: "bg-green-100",
  },
  {
    id: 3,
    title: "Auction canceled",
    subtitle: "2022 Toyota RAV4 LE",
    time: "1 day ago",
    icon: XCircle,
    color: "text-red-500",
    bg: "bg-red-100",
  },
];

function TopPerformanceAuctions() {
  return (
    <>
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[14px] font-semibold text-[#0B1E3D]">
            Top Auctions
          </h3>

          <button className="text-[11px] font-medium text-[#D97706] hover:underline">
            See All
          </button>
        </div>

        <div className="space-y-3.5">
          {allAuctionData.slice(0, 4).map((auction) => (
            <div
              key={auction.id}
              className="flex items-center gap-3"
            >
              <img
                src={auction.imageUrl}
                alt={auction.title}
                className="w-11 h-9 rounded-lg object-cover shrink-0"
              />

              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-slate-800 truncate">
                  {auction.title}
                </p>

                <p className="text-[10px] text-slate-400 truncate">
                  {auction.id}
                </p>
              </div>

              <div className="text-right shrink-0">
                <p className="text-[12px] font-semibold text-green-600">
                  {auction.currentBid}
                </p>

                <p className="text-[10px] text-slate-500">
                  {auction.bids} bids
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* recent activity */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[14px] font-semibold text-[#0B1E3D]">
            Recent Activity
          </h3>

          <button className="text-[11px] font-medium text-[#D97706] hover:underline">
            View All
          </button>
        </div>

        {/* Activities */}
        <div className="space-y-4">
          {activities.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.id} className="flex items-start gap-3">
                {/* Icon */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center ${item.bg}`}
                >
                  <Icon size={14} className={item.color} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-2">
                    <p className="text-[12px] font-medium text-slate-800">
                      {item.title}
                    </p>

                    <span className="text-[10px] text-slate-400 whitespace-nowrap">
                      {item.time}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default TopPerformanceAuctions;
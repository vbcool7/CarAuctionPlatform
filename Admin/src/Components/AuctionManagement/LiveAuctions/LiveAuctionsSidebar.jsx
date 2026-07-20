
import React from "react";
import {
  ArrowUpRight,
  Trophy,
  Activity,
} from "lucide-react";

const endingSoon = [
  {
    id: 1,
    image: "https://imgd.aeplcdn.com/370x208/n/cw/ec/200003/gravite-exterior-right-front-three-quarter-6.jpeg?isig=0&q=80",
    title: "2019 Ford F-150 XLT",
    time: "Ends in 04:32",
    status: "Live",
  },
  {
    id: 2,
    image: "https://imgd.aeplcdn.com/370x208/n/cw/ec/200003/gravite-exterior-right-front-three-quarter-6.jpeg?isig=0&q=80",
    title: "2021 BMW X5 xDrive30i",
    time: "Ends in 06:15",
    status: "Live",
  },
];

const topBidders = [
  { id: 1, name: "John Smith", bids: 12, avatar: "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg" },
  { id: 2, name: "Michael Davis", bids: 10, avatar: "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg" },
  { id: 3, name: "Sarah Johnson", bids: 9, avatar: "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg" },
  { id: 4, name: "David Lee", bids: 7, avatar: "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg" },
  { id: 5, name: "Emma Wilson", bids: 6, avatar: "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg" },
];

const liveActivity = [
  {
    id: 1,
    title: "New bid of $28,500",
    vehicle: "2021 BMW X5 xDrive30i",
    time: "Just now",
    color: "bg-blue-500",
  },
  {
    id: 2,
    title: "New bid of $22,300",
    vehicle: "2019 Ford F-150 XLT",
    time: "1 min ago",
    color: "bg-amber-500",
  },
  {
    id: 3,
    title: "New bid of $19,750",
    vehicle: "2020 Mercedes C300",
    time: "2 min ago",
    color: "bg-green-500",
  },
];

function LiveAuctionsSidebar() {
  return (
    <div className="space-y-5">

      {/* Ending Soon */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[13px] font-semibold text-[#0B1E3D]">
            Ending Soon
          </h3>
          <button className="text-[11px] font-medium text-[#2563EB]">
            View All
          </button>
        </div>

        <div className="space-y-3">
          {endingSoon.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-12 h-12 rounded-lg object-cover shadow-lg border border-gray-300"
              />

              <div className="flex-1 min-w-0">
                <h4 className="text-[12px] font-medium text-[#0B1E3D] truncate">
                  {item.title}
                </h4>
                <p className="text-[10px] text-slate-500">
                  {item.time}
                </p>
              </div>

              <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-medium">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Bidders */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[13px] font-semibold text-[#0B1E3D]">
            Top Bidders
          </h3>
          <button className="text-[11px] font-medium text-[#2563EB]">
            View All
          </button>
        </div>

        <div className="space-y-3">
          {topBidders.map((bidder, index) => (
            <div
              key={bidder.id}
              className="flex items-center gap-3"
            >
              <div className="w-5 h-5 rounded bg-amber-100 text-amber-700 text-[10px] font-bold flex items-center justify-center">
                {index + 1}
              </div>

              <img
                src={bidder.avatar}
                alt={bidder.name}
                className="w-8 h-8 rounded-full"
              />

              <p className="flex-1 text-[12px] font-medium text-[#0B1E3D]">
                {bidder.name}
              </p>

              <span className="text-[11px] text-slate-500">
                {bidder.bids} Bids
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Live Activity */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[13px] font-semibold text-[#0B1E3D]">
            Live Activity
          </h3>

          <Activity size={15} className="text-[#D97706]" />
        </div>

        <div className="space-y-4">
          {liveActivity.map((item) => (
            <div key={item.id} className="flex gap-3">

              <div
                className={`w-2 h-2 rounded-full mt-1.5 ${item.color}`}
              />

              <div className="flex-1">
                <p className="text-[11px] text-[#0B1E3D] font-medium leading-5">
                  {item.title}
                </p>

                <p className="text-[10px] text-slate-500">
                  {item.vehicle}
                </p>
              </div>

              <span className="text-[10px] text-slate-400 whitespace-nowrap">
                {item.time}
              </span>
            </div>
          ))}
        </div>

        <button className="mt-5 w-full border border-slate-200 rounded-lg py-2 text-[11px] font-medium text-[#D97706] hover:bg-amber-50 transition">
          View All Activity
        </button>
      </div>

    </div>
  );
}

export default LiveAuctionsSidebar;
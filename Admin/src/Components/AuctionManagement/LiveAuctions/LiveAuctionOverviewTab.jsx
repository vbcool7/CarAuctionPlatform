
import React from "react";
import { Check, Info } from "lucide-react";

const statusColors = {
  Live: "bg-green-100 text-green-700",
  Upcoming: "bg-blue-100 text-blue-700",
  Completed: "bg-slate-100 text-slate-600",
  Cancelled: "bg-red-100 text-red-700",
};

function LiveAuctionOverviewTab({ auction }) {
  if (!auction) return null;

  const auctionInfo = [
    { label: "Auction Type", value: `${auction.type || "—"} Auction` },
    { label: "Start Date & Time", value: `${auction.startDate?.trim()} ${auction.startTime}` },
    { label: "End Date & Time", value: `${auction.endDate?.trim()} ${auction.endTime}` },
    { label: "Extension Rule", value: auction.extensionRule || "—" },
    { label: "Starting Bid", value: auction.startingBid || "—" },
    { label: "Reserve Price", value: auction.reserve || "—", info: true },
    { label: "Buy Now Price", value: auction.buyNowPrice || "—" },
    { label: "Bid Increment", value: auction.bidIncrement || "—" },
  ];

  const features = auction.features || [];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2">

        {/* Auction Information */}
        <div className="p-5 lg:border-r border-slate-200">
          <h3 className="text-[15px] font-semibold text-[#0B1E3D] mb-5">
            Auction Information
          </h3>

          <div className="space-y-3">
            {auctionInfo.map((item) => (
              <div
                key={item.label}
                className="grid grid-cols-[170px_1fr] gap-3 items-start"
              >
                <p className="text-[13px] text-slate-500">{item.label}</p>

                <div className="flex items-center gap-1">
                  <span className="text-[13px] font-medium text-[#0B1E3D]">
                    {item.value}
                  </span>

                  {item.info && (
                    <Info size={14} className="text-slate-400 cursor-pointer" />
                  )}
                </div>
              </div>
            ))}

            <div className="grid grid-cols-[170px_1fr] gap-3 items-center">
              <p className="text-[13px] text-slate-500">Status</p>

              <span
                className={`inline-flex w-fit items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium ${statusColors[auction.status] || "bg-slate-100 text-slate-600"
                  }`}
              >
                <span className="w-2 h-2 rounded-full bg-current"></span>
                {auction.status || "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="p-5">
          <h3 className="text-[15px] font-semibold text-[#0B1E3D] mb-4">
            Description
          </h3>

          <p className="text-[13px] text-slate-600 leading-6">
            {auction.description || "No description available."}
          </p>

          {features.length > 0 && (
            <div className="mt-5 space-y-3">
              {features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                    <Check size={12} className="text-green-600" />
                  </div>
                  <span className="text-[13px] text-slate-700">{feature}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default LiveAuctionOverviewTab;
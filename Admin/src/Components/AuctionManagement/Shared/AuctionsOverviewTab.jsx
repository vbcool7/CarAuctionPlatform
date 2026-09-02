
import React from "react";
import { Check, Info } from "lucide-react";
import { formatLabel, formatPrice } from "../../utils/formatter";

const statusColors = {
  live: "bg-green-100 text-green-700",
  upcoming: "bg-blue-100 text-blue-700",
  sold: "bg-purple-100 text-purple-700",
  unsold: "bg-slate-100 text-slate-600",
  "reserve-not-met": "bg-orange-100 text-orange-700",
  canceled: "bg-red-100 text-red-700",
  draft: "bg-gray-100 text-gray-700",
};

function AuctionsOverviewTab({ vehicle }) {
  if (!vehicle) return null;

  const auctionInfo = [
    {
      label: "Auction Type",
      value: `${formatLabel(vehicle.auctionType) || "—"} Auction`
    },
    {
      label: "Price Type",
      value: `${formatLabel(vehicle.priceType) || "—"}`
    },
    {
      label: "Start Date & Time",
      value: vehicle.auctionStartDateTime
        ? new Date(vehicle.auctionStartDateTime).toLocaleString("en-GB", {
          timeZone: "Asia/Dubai",
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
        : "—"
    },

    {
      label: "End Date & Time",
      value: vehicle.auctionEndDateTime
        ? new Date(vehicle.auctionEndDateTime).toLocaleString("en-GB", {
          timeZone: "Asia/Dubai",
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
        : "—"
    },
    {
      label: "Extension Rule",
      value: vehicle.antiSnipingExtension
        ? `${vehicle.antiSnipingExtension} min extension`
        : "—"
    },
    {
      label: "Starting Bid",
      value: formatPrice(vehicle.startingBidPrice)
    },
    ...(vehicle.priceType === "reserve_price"
      ? [
        {
          label: "Reserve Price",
          value: formatPrice(vehicle.reservePrice),
          info: true
        }
      ]
      : vehicle.priceType === "fixed_price"
        ? [
          {
            label: "Buy Now Price",
            value: formatPrice(vehicle.buyNowPrice)
          }
        ]
        : []
    ),
    {
      label: "Current Bid",
      value: formatPrice(vehicle.currentBid)
    },
  ];

  const vehicleDetails = [
    { label: "Title Status", value: vehicle.titleStatus },
    { label: "Accident History", value: vehicle.accidentHistory },
    { label: "Overall Condition", value: vehicle.overallCondition },
    { label: "Mechanical Condition", value: vehicle.mechanicalCondition },
    { label: "Exterior Condition", value: vehicle.exteriorCondition },
    { label: "Interior Condition", value: vehicle.interiorCondition },
    { label: "Engine Size", value: vehicle.engineSize },
    { label: "Tires Condition", value: vehicle.tiresCondition },
    { label: "Seat Material", value: vehicle.seatMaterial },
    { label: "Number Of Keys", value: vehicle.numberOfKeys },
  ];

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
                className={`inline-flex w-fit items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium 
                  ${statusColors[vehicle.auctionStatus] || "bg-slate-100 text-slate-600"
                  }`}
              >
                <span className="w-2 h-2 rounded-full bg-current"></span>
                {formatLabel(vehicle.auctionStatus) || "—"}
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
            {vehicle.vehicleDescription || "No description available."}
          </p>

          <div className="mt-4">
            {vehicleDetails.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3"
              >
                <span className="text-[13px] text-slate-500">
                  {item.label}
                </span>

                <span className="text-[13px] font-medium text-[#0B1E3D] text-right">
                  {formatLabel(item.value) || "—"}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default AuctionsOverviewTab;
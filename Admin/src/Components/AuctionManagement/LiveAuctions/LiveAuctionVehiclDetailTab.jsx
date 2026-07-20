
import React from "react";

const DetailSection = ({ title, data }) => (
  <div>
    <h3 className="text-xs font-semibold uppercase tracking-wide text-[#0B1E3D] mb-3">
      {title}
    </h3>

    <div>
      {data.map((item) => (
        <div
          key={item.label}
          className="flex items-center justify-between py-2 border-b border-slate-100 last:border-b-0"
        >
          <span className="text-[13px] text-slate-500">{item.label}</span>
          <span className="text-[13px] font-semibold text-[#0B1E3D] text-right">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  </div>
);

function LiveAuctionVehiclDetailTab({ auction }) {
  if (!auction) return null;

  const basicDetails = [
    { label: "Make", value: auction.specs?.make || "—" },
    { label: "Model", value: auction.specs?.model || "—" },
    { label: "Year", value: auction.specs?.year || "—" },
    { label: "Body Style", value: auction.specs?.body || "—" },
    { label: "Color", value: auction.specs?.color || "—" },
    { label: "Doors", value: auction.specs?.doors || "—" },
    { label: "Seats", value: auction.specs?.seats || "—" },
    { label: "Vehicle Type", value: auction.specs?.vehicleType || "—" },
  ];

  const technicalDetails = [
    { label: "Engine", value: auction.specs?.engine || "—" },
    { label: "Engine Size", value: auction.specs?.engineSize || "—" },
    { label: "Fuel Type", value: auction.specs?.fuelType || "—" },
    { label: "Cylinder", value: auction.specs?.cylinder || "—" },
    { label: "Transmission", value: auction.specs?.transmission || "—" },
    { label: "Drive Type", value: auction.specs?.driveType || "—" },
    { label: "Mileage", value: auction.specs?.mileage || "—" },
    { label: "VIN", value: auction.vin || "—" },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DetailSection title="Basic Details" data={basicDetails} />
        <DetailSection title="Technical" data={technicalDetails} />
      </div>
    </div>
  );
}

export default LiveAuctionVehiclDetailTab;
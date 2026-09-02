
import React from "react";
import { formatLabel } from "../../utils/formatter";

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

function AuctionsVehicleDetailTab({ vehicle }) {
  if (!vehicle) return null;

  const basicDetails = [
    { label: "Make", value: formatLabel(vehicle.make) || "—" },
    { label: "Model", value: formatLabel(vehicle.model) || "—" },
    { label: "Year", value: vehicle.year || "—" },
    { label: "Body Style", value: formatLabel(vehicle.bodyType) || "—" },
    { label: "Exterior Color", value: formatLabel(vehicle.exteriorColor) || "—" },
    { label: "Doors", value: vehicle.doors || "—" },
    { label: "Seats", value: vehicle.seats || "—" },
    { label: "Vehicle Type", value: formatLabel(vehicle.vehicleType) || "—" },
  ];

  const technicalDetails = [
    { label: "Engine Size", value: vehicle.engineSize || "—" },
    { label: "Fuel Type", value: formatLabel(vehicle.fuelType) || "—" },
    { label: "Cylinders", value: vehicle.cylinders || "—" },
    { label: "Transmission", value: formatLabel(vehicle.transmission) || "—" },
    { label: "Drivetrain", value: formatLabel(vehicle.drivetrain) || "—" },
    { label: "Mileage", value: vehicle.mileage || "—" },
    { label: "Interior Color", value: formatLabel(vehicle.interiorColor) || "—" },
    { label: "VIN", value: vehicle.vin || "—" },
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

export default AuctionsVehicleDetailTab;
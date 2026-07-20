
import React from "react";

function VehicleOverviewTab({ vehicleDetails, status }) {

  const overviewData = [
    { label: "Make", value: "BMW" },
    { label: "Model", value: "5 Series" },
    { label: "Year", value: "2021" },

    { label: "Vehicle Type", value: vehicleDetails?.type || "Sedan" },
    { label: "Exterior Color", value: vehicleDetails?.color || "Black" },
    { label: "Interior Color", value: "Black" },

    { label: "Engine", value: "3.0L I6 Turbo" },
    { label: "Transmission", value: vehicleDetails?.transmission || "Automatic" },
    { label: "Mileage", value: "32,450 km" },

    { label: "Fuel Type", value: "Petrol" },
    { label: "Drive Type", value: "RWD" },
    { label: "Doors", value: "4" },

    { label: "Seats", value: "5" },
    { label: "Registration No.", value: "DEF-4567" },
    { label: "Country", value: "United Arab Emirates" },
  ];

  return (
    <div className="">

      {/* show only on rejection */}
      {status === "Rejected" && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3">
          <h4 className="text-[13px] font-semibold text-red-700 mb-3">
            Rejection Details
          </h4>

          <div className="space-y-2 text-[12px]">
            {/* Reason */}
            <div className="grid grid-cols-[110px_1fr]">
              <span className="text-gray-500 font-medium">Reason</span>
              <span className="font-semibold text-[#0B1E3D]">
                Invalid Document
              </span>
            </div>

            {/* Description */}
            <div className="grid grid-cols-[110px_1fr]">
              <span className="text-gray-500 font-medium">Description</span>
              <p className="text-gray-700 leading-5">
                The vehicle registration document has expired. Please upload valid
                documents.
              </p>
            </div>

            {/* Rejected By */}
            <div className="grid grid-cols-[110px_1fr]">
              <span className="text-gray-500 font-medium">Rejected By</span>
              <span className="font-semibold text-[#0B1E3D]">
                Admin
              </span>
            </div>

            {/* Rejected On */}
            <div className="grid grid-cols-[110px_1fr]">
              <span className="text-gray-500 font-medium">Rejected On</span>
              <span className="font-semibold text-[#0B1E3D]">
                20 May 2026, 11:20 AM
              </span>
            </div>
          </div>
        </div>
      )}

      <h3 className="text-[13px] font-semibold text-[#0B1E3D] my-4">
        Vehicle Information
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-4">
        {overviewData.map((item, index) => (
          <div key={index}>
            <p className="text-[11px] text-gray-500">
              {item.label}
            </p>

            <p className="text-[13px] font-semibold text-[#0B1E3D] leading-5">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VehicleOverviewTab;
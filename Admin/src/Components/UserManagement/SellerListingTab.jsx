
import React from "react";
import { Eye, Pencil, MoreVertical, Plus, Filter, } from "lucide-react";
import { useGetVehiclesBySeller } from "../../hooks/useVehicle";
import { getPaginationRange } from "../utils/getPaginationRange";
import { useState } from "react";

function SellerListingTab({ sellerId, setSelectedVehicleId, setCurrentPage }) {

  const [page, setPage] = useState(1);
  const { data: vehicleData, isLoading, isError } = useGetVehiclesBySeller(sellerId, page);
  const vehicles = vehicleData?.data || [];

  const totalPages = vehicleData?.pagination?.totalPages || 1;

  if (isLoading) return <p className="p-10 text-center">Loading vehicle list....</p>;
  if (isError) return <p className="p-10 text-center text-red-500">Failed to load vehicle list</p>;

  const formatEnumValue = (value) => {
    if (!value) return "--";

    return value
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6">

        {/* Top Row: Title and Add Button */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-[#0B1E3D]">All Listings</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Here are all vehicles listed by this seller.
            </p>
          </div>

          <button className="flex items-center gap-2 bg-[#D97706] hover:bg-[#C66A05] text-white text-sm font-medium px-4 h-9 rounded-xl transition shrink-0">
            <Plus size={16} />
            Add New Listing
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200 my-4"></div>

        {/* Bottom Row Filters */}
        <div className="flex items-center gap-4">
          <select className="h-9 px-3 rounded-xl border border-slate-200 text-sm bg-white text-slate-700 outline-none">
            <option>All Status</option>
            <option>Active</option>
            <option>Pending</option>
            <option>Sold</option>
          </select>

          <button className="h-9 px-3 rounded-xl border border-slate-200 flex items-center gap-1.5 text-sm text-slate-700 hover:bg-slate-50 transition">
            <Filter size={14} />
            Filter
          </button>
        </div>

      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-xs uppercase tracking-wide text-slate-500">

                <th className="px-5 py-4 text-left min-w-70">Vehicle</th>
                <th className="px-4 py-4 text-left min-w-30">Listing ID</th>
                <th className="px-4 py-4 text-left min-w-30">Category</th>
                <th className="px-4 py-4 text-left min-w-40">Price</th>
                <th className="px-4 py-4 text-left min-w-30">Status</th>
                <th className="px-4 py-4 text-left min-w-40">Listed</th>
                <th className="px-4 py-4 text-center min-w-20">Views</th>
                <th className="px-4 py-4 text-center min-w-40">Actions</th>

              </tr>
            </thead>

            <tbody>
              {vehicles.length > 0 ? (
                vehicles.map((vehicle) => (
                  <tr
                    key={vehicle._id}
                    className="border-b border-slate-100 hover:bg-slate-50 transition"
                  >
                    {/* Vehicle */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">

                        <img
                          src={vehicle.images?.[0]?.url || "/placeholder-car.jpg"}
                          alt={`${vehicle.make || ""} ${vehicle.model || ""}`}
                          className="w-14 h-14 rounded-xl object-cover border"
                        />

                        <div>
                          <h4 className="font-semibold text-sm text-[#0B1E3D]">
                            {`${formatEnumValue(vehicle.make)} ${formatEnumValue(vehicle.model)}`}
                          </h4>

                          <p className="text-xs text-slate-500 mt-1">
                            VIN: {vehicle.vin || "--"}
                          </p>
                        </div>

                      </div>
                    </td>

                    <td className="px-4 py-4 text-sm font-medium text-slate-700">
                      {vehicle.listingId || "--"}
                    </td>

                    <td className="px-4 py-4 text-sm text-slate-600">
                      {formatEnumValue(vehicle.bodyType)}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-semibold text-[#0B1E3D]">
                          Bid Price:{" "} {vehicle.startingBidPrice ? `$${vehicle.startingBidPrice}` : "--"}
                        </span>

                        {vehicle.priceType === "fixed_price" && (
                          <span className="text-xs text-slate-500">
                            Buy Now:{" "}
                            <span className="font-medium text-slate-700">
                              {vehicle.buyNowPrice ? `$${vehicle.buyNowPrice}` : "--"}
                            </span>
                          </span>
                        )}

                        {vehicle.priceType === "reserve_price" && (
                          <span className="text-xs text-slate-500">
                            Reserve:{" "}
                            <span className="font-medium text-slate-700">
                              {vehicle.reservePrice ? `$${vehicle.reservePrice}` : "--"}
                            </span>
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${vehicle.adminStatus === "approved"
                          ? "bg-green-100 text-green-700"
                          : vehicle.adminStatus === "rejected"
                            ? "bg-red-100 text-red-700"
                            : vehicle.adminStatus === "pending"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                      >
                        {vehicle.adminStatus
                          ? vehicle.adminStatus.charAt(0).toUpperCase() +
                          vehicle.adminStatus.slice(1)
                          : "--"}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-sm text-slate-600">
                      {vehicle.createdAt
                        ? new Date(vehicle.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                        : "--"}
                    </td>

                    <td className="px-4 py-4 text-center font-medium">
                      --
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex justify-center gap-2">

                        <button
                          onClick={() => {
                            setSelectedVehicleId(vehicle._id);
                            setCurrentPage("seller-vehicle-detail");
                          }}
                          className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center hover:text-amber-600 hover:border-amber-600">
                          <Eye size={16} />
                        </button>

                        <button className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center hover:text-green-600 hover:border-green-600">
                          <MoreVertical size={16} />
                        </button>

                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-10 text-center text-slate-500"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-sm font-semibold text-slate-600">
                        No Data Found
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        No vehicles available to display.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>

          </table>

        </div>

      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-t border-slate-200 bg-white">

          {/* Page Info */}
          <p className="hidden sm:block text-xs text-slate-500">
            Page <span className="font-semibold text-[#0B1E3D]">{page}</span> of{" "}
            <span className="font-semibold text-[#0B1E3D]">{totalPages}</span>
          </p>

          {/* Pagination */}
          <div className="flex items-center gap-1.5 mx-auto sm:mx-0 sm:ml-auto">

            {/* Previous */}
            <button
              type="button"
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600
                      hover:bg-slate-50 hover:border-slate-300
                      disabled:opacity-40 disabled:cursor-not-allowed
                      transition-all"
            >
              Previous
            </button>

            {/* Page Numbers */}
            {getPaginationRange(page, totalPages).map((num, idx) =>
              num === "..." ? (
                <span
                  key={`dot-${idx}`}
                  className="px-2 py-1.5 text-xs font-medium text-slate-400"
                >
                  ...
                </span>
              ) : (
                <button
                  type="button"
                  key={num}
                  onClick={() => setPage(num)}
                  className={`min-w-8 h-8 px-2 rounded-lg text-xs font-semibold border transition-all
                                  ${page === num
                      ? "bg-[#D97706] text-white border-[#D97706] shadow-sm"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-amber-50 hover:text-[#D97706] hover:border-amber-200"
                    }`}
                >
                  {num}
                </button>
              )
            )}

            {/* Next */}
            <button
              type="button"
              onClick={() => setPage((p) => p + 1)}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600
                      hover:bg-slate-50 hover:border-slate-300
                      disabled:opacity-40 disabled:cursor-not-allowed
                      transition-all"
            >
              Next
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

export default SellerListingTab;
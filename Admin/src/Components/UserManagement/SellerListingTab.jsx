import React from "react";
import {
  Eye,
  Pencil,
  MoreVertical,
  Plus,
  Filter,
} from "lucide-react";

const listings = [
  {
    id: 1,
    image: "https://static.vecteezy.com/system/resources/thumbnails/053/733/179/small/every-detail-of-a-sleek-modern-car-captured-in-close-up-photo.jpg",
    vehicle: "Mercedes-Benz G63 AMG 2022",
    vin: "W1N7CY7H5NX123456",
    listingId: "LST-12580",
    category: "SUV",
    price: "AED 850,000",
    status: "Active",
    listedOn: "May 13, 2024",
    views: 1245,
  },
  {
    id: 2,
    image: "https://cdn-s3.autocarindia.com/Mercedes/cla-electric/Mercedes-Benz_CLA_EV_Front_Quarter_Tracking.jpg?w=640&q=75",
    vehicle: "Toyota Land Cruiser 2021",
    vin: "JTMCY7AJ8M4087321",
    listingId: "LST-12579",
    category: "SUV",
    price: "AED 235,000",
    status: "Active",
    listedOn: "May 12, 2024",
    views: 978,
  },
  {
    id: 3,
    image: "https://cdn-s3.autocarindia.com/Mercedes/cla-electric/Mercedes-Benz_CLA_EV_Front_Quarter_Tracking.jpg?w=640&q=75",
    vehicle: "BMW X5 M Sport 2023",
    vin: "WBAXX1200PX456789",
    listingId: "LST-12578",
    category: "Luxury",
    price: "AED 415,000",
    status: "Pending",
    listedOn: "May 10, 2024",
    views: 684,
  },
];

function SellerListingTab() {
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
              {listings.map((item) => (

                <tr
                  key={item.id}
                  className="border-b border-slate-100 hover:bg-slate-50 transition"
                >
                  {/* Vehicle */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">

                      <img
                        src={item.image}
                        alt={item.vehicle}
                        className="w-14 h-14 rounded-xl object-cover border"
                      />

                      <div>

                        <h4 className="font-semibold text-sm text-[#0B1E3D]">
                          {item.vehicle}
                        </h4>

                        <p className="text-xs text-slate-500 mt-1">
                          VIN: {item.vin}
                        </p>

                      </div>

                    </div>

                  </td>

                  <td className="px-4 py-4 text-sm font-medium text-slate-700">
                    {item.listingId}
                  </td>

                  <td className="px-4 py-4 text-sm text-slate-600">
                    {item.category}
                  </td>

                  <td className="px-4 py-4 font-semibold text-[#0B1E3D]">
                    {item.price}
                  </td>

                  <td className="px-4 py-4">

                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${item.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                        }`}
                    >
                      {item.status}
                    </span>

                  </td>

                  <td className="px-4 py-4 text-sm text-slate-600">
                    {item.listedOn}
                  </td>

                  <td className="px-4 py-4 text-center font-medium">
                    {item.views}
                  </td>

                  <td className="px-4 py-4">

                    <div className="flex justify-center gap-2">

                      <button
                        className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center hover:text-amber-600 hover:border-amber-600">
                        <Eye size={16} />
                      </button>

                      <button
                        className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center hover:text-blue-600 hover:border-blue-600">
                        <Pencil size={16} />
                      </button>

                      <button
                        className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center hover:text-green-600 hover:border-green-600">
                        <MoreVertical size={16} />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default SellerListingTab;

import React from 'react';
import { vehicles } from '../../Data';
import { BadgeCheck } from 'lucide-react';

function BuyerMyBidsList({ setCurrentPage, setSelectedVehicleId, setPreviousPage, activeTab, vehicleId }) {

  console.log(vehicleId)

  return (
    <div className='w-full'>

      {/* Top Bar: Results Info and Sorting */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-5">

        <p className="text-[12px] md:text-sm text-slate-500 font-medium">
          Showing 1 - 7 of 7 active bids
        </p>

        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          <span className="text-[12px] md:text-sm text-slate-600 font-medium whitespace-nowrap">Sort by:</span>
          <select
            className="border border-slate-200 rounded-lg px-2 py-1.5 text-[12px] md:text-sm font-semibold text-[#0B1E3D] outline-none hover:border-[#D97706] cursor-pointer w-full md:w-auto"
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="recent-activity">Recent Activity</option>
            <option value="recent-activity">Recent Activity</option>
            <option value="recent-activity">Recent Activity</option>
          </select>
        </div>

      </div>

      {/* table */}
      <div className="w-full overflow-x-auto bg-white border border-gray-200 rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs text-gray-800 uppercase bg-gray-100 border-b border-gray-200">
              <th className="px-6 py-4 font-medium min-w-80">Vehicle Details</th>
              <th className="px-6 py-4 font-medium min-w-60">Auction Info</th>
              <th className="px-6 py-4 font-medium min-w-40">My Bid</th>
              <th className="px-6 py-4 font-medium min-w-40">Status</th>
              <th className="px-6 py-4 font-medium min-w-30">Time Left</th>
              <th className="px-6 py-4 font-medium  min-w-50">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {vehicles.slice(0, 10).map((vehicle) => (
              <tr
                key={vehicle.id}
                className="hover:bg-gray-50">
                {/* Vehicle Details */}
                <td className="px-6 py-4 flex items-center gap-4">
                  <img
                    src={vehicle.image}
                    alt={vehicle.model}
                    className="w-20 h-14 object-cover rounded" />
                  <div>
                    <h3 className="font-bold text-[#0B1E3D] text-sm">{vehicle.year} {vehicle.make} {vehicle.model}</h3>
                    <p className="text-xs text-gray-500">Lot # {vehicle.id}</p>
                    <p className="text-xs text-gray-700">{vehicle.km} KM • {vehicle.transmission} • {vehicle.fuelType}</p>
                  </div>
                </td>

                {/* Auction Info */}
                <td className="px-6 py-4 text-sm text-[#0B1E3D]">
                  <p className="font-semibold flex items-center gap-1">
                    {vehicle.auctioneer || "Al Yousuf Motors"}
                    <BadgeCheck className="text-blue-600" size={16} fill="#2563eb" stroke="white" />
                  </p>
                  <p className="text-xs text-gray-500">{vehicle.location || "Dubai, UAE"}</p>
                  <p className="text-xs text-gray-500">{vehicle.date || "May 20, 2024 • 11:00 AM GST"}</p>
                </td>

                {/* My Bid */}
                <td className="px-6 py-4 text-sm">
                  <p className="font-bold text-[#0B1E3D]">{vehicle.price || "AED 120,000"}</p>
                  <p className="text-xs text-gray-500">{vehicle.bidCount || "2 Bids"}</p>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${vehicle.status === 'live' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                    {vehicle.status === 'live' ? 'Highest Bid' : 'Outbid'}
                  </span>
                </td>

                {/* Time Left */}
                <td className="px-6 py-4 text-sm font-medium text-[#D97706]">
                  {vehicle.timer || "2h 15m 30s"}
                </td>

                {/* actions btn */}
                <td className="px-6 py-2">
                  <button
                    onClick={() => {
                      setSelectedVehicleId(vehicle.id);
                      setPreviousPage('bids');
                      if (vehicle.status === 'live') {
                        setCurrentPage('live-auctions-detail');
                      } else if (vehicle.status === 'upcoming') {
                        setCurrentPage('upcoming-auctions-detail');
                      } else {
                        setCurrentPage('auction-result-detail');
                      }
                    }}
                    className="px-4 py-2 text-[14px] font-semibold text-[#D97706] border border-[#D97706] rounded-lg hover:bg-[#D97706] hover:text-white transition-all duration-300 hover:scale-105 active:scale-95">
                    View Auction
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default BuyerMyBidsList;

import React from 'react';
import { vehicles } from '../../Data';
import { BadgeCheck } from 'lucide-react';

function BuyerLostAuctionsList({setCurrentPage, setSelectedVehicleId}) {
    return (
        <div className='w-full'>

            {/* top heading */}
            <div className="pb-5">
                <p className="text-[12px] md:text-sm text-slate-500 font-medium">
                    Showing 1 - 5 of 5 lost auctions
                </p>
            </div>

            {/* table */}
            <div className="w-full overflow-x-auto bg-white border border-gray-200 rounded-lg">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-xs text-gray-800 uppercase bg-gray-100 border-b border-gray-200">
                            <th className="px-6 py-4 font-medium min-w-80">Vehicle Details</th>
                            <th className="px-6 py-4 font-medium min-w-60">Auction Info</th>
                            <th className="px-6 py-4 font-medium min-w-40">Your Bid</th>
                            <th className="px-6 py-4 font-medium min-w-50">Winning Bid</th>
                            <th className="px-6 py-4 font-medium min-w-40">Result</th>
                            <th className="px-6 py-4 font-medium  min-w-40">Actions</th>
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

                                {/* your bid */}
                                <td className="px-6 py-4 text-sm">
                                    <span className='text-sm text-slate-700 font-bold'>{vehicle.bid || "AED 118,000"}</span>
                                </td>

                                {/* winning bid */}
                                <td className="px-6 py-4">
                                    <p className="font-bold text-[#0B1E3D]">{vehicle.price || "AED 120,000"}</p>
                                    <p className="text-xs text-gray-500 pt-px">by another bidder</p>
                                </td>

                                {/* result */}
                                <td className="px-6 py-4">
                                    <span className="text-[11px] font-bold text-red-500 bg-red-100/80 px-2 py-1 rounded">Outbid</span>
                                    <p className="text-xs text-gray-500 pt-px">You were outbid</p>
                                </td>

                                {/* action btn */}
                                <td className="px-6 py-2">
                                    <button
                                        onClick={() => {
                                            setSelectedVehicleId(vehicle.id)
                                            setCurrentPage('lost-auctions-detail')
                                        }}
                                        className="px-4 py-2 text-[14px] font-semibold text-[#D97706] border border-[#D97706] rounded-lg hover:bg-[#D97706] hover:text-white transition-all duration-300 hover:scale-105 active:scale-95">
                                        View Details
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

export default BuyerLostAuctionsList;
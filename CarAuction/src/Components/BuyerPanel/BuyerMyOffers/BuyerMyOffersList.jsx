
import React from 'react';
import { vehicles } from '../../Data';
import { BadgeCheck } from 'lucide-react';

function BuyerMyOffersList({ activeTab, setCurrentPage, setSelectedVehicleId }) {

    // temporary
    const getBadgeStyles = (status) => {
        switch (status) {
            case 'active':
                return {
                    text: 'Active',
                    color: 'text-blue-600',
                    bg: 'bg-blue-100/80',
                    sub: 'Offer sent'
                };
            case 'accepted':
                return {
                    text: 'Accepted',
                    color: 'text-emerald-600',
                    bg: 'bg-emerald-100/80',
                    sub: 'Offer accepted'
                };
            case 'rejected':
                return {
                    text: 'Rejected',
                    color: 'text-red-600',
                    bg: 'bg-red-100/80',
                    sub: 'Offer declined'
                };
            case 'expired':
                return {
                    text: 'Expired',
                    color: 'text-gray-600',
                    bg: 'bg-gray-100/80',
                    sub: 'Offer expired'
                };
        }
    };

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
                            <th className="px-6 py-4 font-medium min-w-60">Offer Info</th>
                            <th className="px-6 py-4 font-medium min-w-40">My Offer</th>
                            <th className="px-6 py-4 font-medium min-w-50">Seller Price</th>
                            <th className="px-6 py-4 font-medium min-w-40">Status</th>
                            <th className="px-6 py-4 font-medium min-w-40">Offers Expires In</th>
                            <th className="px-6 py-4 font-medium  min-w-40">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {vehicles.slice(0, 8).map((vehicle) => (
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

                                {/* offer Info */}
                                <td className="px-6 py-4 text-sm text-[#0B1E3D]">
                                    <p className="font-semibold flex items-center gap-1">
                                        {vehicle.auctioneer || "Al Yousuf Motors"}
                                        <BadgeCheck className="text-blue-600" size={16} fill="#2563eb" stroke="white" />
                                    </p>
                                    <p className="text-xs text-gray-500">{vehicle.location || "Dubai, UAE"}</p>
                                    <p className="text-xs text-gray-500">{vehicle.date || "May 20, 2024 • 11:00 AM GST"}</p>
                                </td>

                                {/* my offer */}
                                <td className="px-6 py-4 text-sm">
                                    <span className='text-sm text-slate-700 font-bold'>{vehicle.myOffer || "AED 118,000"}</span>
                                </td>

                                {/* seller price */}
                                <td className="px-6 py-4 text-sm">
                                    <span className='text-sm text-slate-700 font-bold'>{vehicle.sellerPrice || "AED 118,000"}</span>
                                </td>

                                {/* status */}
                                <td className="px-6 py-4">
                                    {(() => {
                                        const badge = getBadgeStyles(vehicle.offerStatus);
                                        return (
                                            <>
                                                <span className={`text-[11px] font-bold ${badge.color} ${badge.bg} px-2 py-1 rounded`}>
                                                    {badge.text}
                                                </span>
                                                <p className="text-xs text-gray-500 pt-px">{badge.sub}</p>
                                            </>
                                        );
                                    })()}
                                </td>

                                {/* offer expire in */}
                                <td className="px-6 py-4">
                                    <p className='text-sm font-bold'>{vehicle.endedTime || "1d 04h 25m"}</p>
                                    <p className="text-xs text-gray-500 pt-px">May 24, 2024</p>
                                    <p className="text-xs text-gray-500 pt-px">11:00 AM GST</p>
                                </td>

                                {/* action btn */}
                                <td className="px-6 py-2">
                                    <button
                                        onClick={() => {
                                            setSelectedVehicleId(vehicle.id)
                                            setCurrentPage('offers-detail')
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

export default BuyerMyOffersList;
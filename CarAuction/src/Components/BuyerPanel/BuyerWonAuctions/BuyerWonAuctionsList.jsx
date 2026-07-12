
import React from 'react';
import { vehicles } from '../../Data';
import { BadgeCheck, CreditCard, Truck } from 'lucide-react';

function BuyerWonAuctionsList({ setCurrentPage, activeTab, setSelectedVehicleId }) {
    return (
        <div className='w-full'>

            {/* top heading */}
            <div className="pb-5">
                <p className="text-[12px] md:text-sm text-slate-500 font-medium">
                    Showing 1 - 5 of 5 won auctions
                </p>
            </div>

            {/* table */}
            <div className="w-full overflow-x-auto bg-white border border-gray-200 rounded-lg">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-xs text-gray-800 uppercase bg-gray-100 border-b border-gray-200">
                            <th className="px-6 py-4 font-medium min-w-80">Vehicle Details</th>
                            <th className="px-6 py-4 font-medium min-w-60">Auction Info</th>
                            <th className="px-6 py-4 font-medium min-w-40">Winning Details</th>
                            <th className="px-6 py-4 font-medium min-w-50">Payment Status</th>
                            <th className="px-6 py-4 font-medium min-w-50">Next Step</th>
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

                                {/* winning details */}
                                <td className="px-6 py-4 text-sm">
                                    <span className='text-xs text-gray-500'>Winning Bid</span>
                                    <p className="font-bold text-[#0B1E3D] pb-2">{vehicle.price || "AED 120,000"}</p>
                                    <p className="text-xs text-gray-500 pb-0.5">You won with</p>
                                    <span className={`px-2 py-0,5 text-[12px] font-medium rounded ${vehicle.status === 'live' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                        {vehicle.status === 'live' ? 'Highest Bid' : 'Your Bid'}
                                    </span>
                                </td>

                                {/* payment Status */}
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1.5 items-center">

                                        <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${vehicle.wonStatus === 'payment-completed'
                                            ? 'bg-emerald-50 text-emerald-600'
                                            : 'bg-amber-50 text-[#D97706]'
                                            }`}>
                                            {vehicle.wonStatus === 'payment-completed' ? 'Payment Completed' : 'Payment Pending'}
                                        </span>

                                        <span className='text-xs text-slate-500'>
                                            {vehicle.wonStatus === 'payment-completed' ? 'Paid on May 20, 2024' : 'Due by May 22, 2024'}
                                        </span>

                                        <button className='text-xs font-semibold text-blue-700 hover:text-blue-500 transition-colors'>
                                            {vehicle.wonStatus === 'payment-completed' ? 'View Invoice →' : 'Pay Now →'}
                                        </button>
                                    </div>
                                </td>

                                {/* next step */}
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-4">
                    
                                        <div className="flex items-start gap-3">
                                            <div className="text-[#0B1E3D] mt-0.5">
                                                {vehicle.wonStatus === 'payment-completed' ? (
                                                    <Truck size={20} />
                                                ) : (
                                                    <CreditCard size={20} />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-[13px] font-semibold text-[#0B1E3D] leading-tight">
                                                    {vehicle.wonStatus === 'ready-for-pickup' ? (
                                                        <>Vehicle ready<br />for pickup</>
                                                    ) : (
                                                        <>Complete<br />payment</>
                                                    )}
                                                </p>
                                                <button 
                                                onClick={() =>{
                                        setSelectedVehicleId(vehicle.id)
                                        setCurrentPage('won-auctions-detail')
                                    }}
                                                className="mt-1 text-xs font-semibold text-blue-700 hover:text-blue-500 transition-colors">
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                {/* action btn */}
                                <td className="px-6 py-2">
                                    <button 
                                    onClick={() =>{
                                        setSelectedVehicleId(vehicle.id)
                                        setCurrentPage('won-auctions-detail')
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

export default BuyerWonAuctionsList;

import React from 'react';
import { vehicles } from '../../Data';

function BuyerPaymentsList({ activeTab, setCurrentPage, setSelectedVehicleId }) {

    // temporary
    const getBadgeStyles = (status) => {
        switch (status) {
            case 'payment-completed':
                return {
                    text: 'Payment Completed',
                    color: 'text-blue-600',
                    bg: 'bg-blue-100/80',
                    sub: 'Payment successful'
                };
            case 'payment-pending':
                return {
                    text: 'Payment Pending',
                    color: 'text-red-600',
                    bg: 'bg-red-100/80',
                    sub: 'Awaiting confirmation'
                };
            case 'refunded':
                return {
                    text: 'Refunded',
                    color: 'text-purple-600',
                    bg: 'bg-purple-100/80',
                    sub: 'Refunded Processed'
                };
            default:
                return {
                    text: 'Unknown',
                    color: 'text-gray-600',
                    bg: 'bg-gray-100',
                    sub: 'Status undefined'
                };
        }
    };

    const handleViewDetail = (id) => {
        setSelectedVehicleId(id)
        setCurrentPage('payments-detail')
    }

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
                            <th className="px-6 py-4 font-medium min-w-40">Lot & Auction Date</th>
                            <th className="px-6 py-4 font-medium min-w-40">Amount</th>
                            <th className="px-6 py-4 font-medium min-w-50">Payment Method</th>
                            <th className="px-6 py-4 font-medium min-w-50">Status</th>
                            <th className="px-6 py-4 font-medium min-w-40">Payment Date</th>
                            <th className="px-6 py-4 font-medium  min-w-50">Actions</th>
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
                                        <p className="text-xs text-gray-700">{vehicle.seller || "Al Yousuf Motors"}</p>
                                    </div>
                                </td>

                                {/* lot & auc date */}
                                <td className="px-6 py-4 ">
                                    <p className="text-xs text-gray-500 font-semibold">{vehicle.aucDate || "May 20, 2024"}</p>
                                    <p className="text-xs text-gray-500 font-semibold">{vehicle.aucTime || "11:00 AM GST"}</p>
                                </td>

                                {/* amount */}
                                <td className="px-6 py-4 text-sm">
                                    <p className='text-sm font-bold'>AED 118,000</p>
                                    <p className='text-sm text-blue-700 font-semibold'>view Breakdown</p>
                                </td>

                                {/* pay method */}
                                <td className="px-6 py-4 text-sm">
                                    <span className='text-sm text-slate-700 font-bold'>---</span>
                                </td>

                                {/* status */}
                                <td className="px-6 py-4">
                                    {(() => {
                                        const badge = getBadgeStyles(vehicle.paymentStatus);
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

                                {/* payment date */}
                                <td className="px-6 py-4 ">
                                    <p className="text-xs text-gray-500 font-semibold">{vehicle.aucDate || "May 20, 2024"}</p>
                                    <p className="text-xs text-gray-500 font-semibold">{vehicle.aucTime || "11:00 AM GST"}</p>
                                </td>

                                {/* action btn */}
                                <td className="px-6 py-2">
                                    {vehicle.paymentStatus === 'payment-pending' ? (
                                        <button
                                            onClick={() => handleViewDetail(vehicle.id)}
                                            className="px-4 py-2 text-[14px] font-semibold text-white bg-[#D97706] border border-[#D97706] rounded-lg hover:bg-[#b86505] transition-all"
                                        >
                                            Pay Now
                                        </button>
                                    ) : vehicle.paymentStatus === 'payment-completed' ? (
                                        <button
                                            onClick={() => handleViewDetail(vehicle.id)}
                                            className="px-4 py-2 text-[14px] font-semibold text-[#D97706] border border-[#D97706] rounded-lg hover:bg-[#D97706] hover:text-white transition-all"
                                        >
                                            View Receipt
                                        </button>
                                    ) : vehicle.paymentStatus === 'refunded' ? (
                                        <button
                                            onClick={() => handleViewDetail(vehicle.id)}
                                            className="px-4 py-2 text-[14px] font-semibold text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-all"
                                        >
                                            View Detail
                                        </button>
                                    ) : null}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default BuyerPaymentsList;
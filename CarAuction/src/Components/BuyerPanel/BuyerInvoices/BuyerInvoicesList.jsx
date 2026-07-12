
import React from 'react';
import { vehicles } from '../../Data';
import { FileText, Download, MoreHorizontal } from 'lucide-react';

function BuyerInvoicesList({ activeTab, setCurrentPage, setSelectedVehicleId }) {

    // temporary
    const getBadgeStyles = (status) => {
        switch (status) {
            case 'payment-completed':
                return {
                    text: 'Paid',
                    color: 'text-green-600',
                    bg: 'bg-green-100/80',
                };
            case 'payment-pending':
                return {
                    text: 'Unpaid',
                    color: 'text-amber-600',
                    bg: 'bg-amber-100/80',
                };
            case 'refunded':
                return {
                    text: 'Refunded',
                    color: 'text-purple-600',
                    bg: 'bg-purple-100/80',
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

    return (
        <div className='w-full'>

            {/* top heading */}
            <div className="pb-5">
                <p className="text-[12px] md:text-sm text-slate-500 font-medium">
                    Showing 1 - 5 of 5 invoices
                </p>
            </div>

            {/* table */}
            <div className="w-full overflow-x-auto bg-white border border-gray-200 rounded-lg">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-xs text-gray-800 uppercase bg-gray-100 border-b border-gray-200">
                            <th className="px-6 py-4 font-medium min-w-50">Invoice</th>
                            <th className="px-6 py-4 font-medium min-w-70">Vehicle & Auction Detail</th>
                            <th className="px-6 py-4 font-medium min-w-40">Invoice Date</th>
                            <th className="px-6 py-4 font-medium min-w-40">Due Date</th>
                            <th className="px-6 py-4 font-medium min-w-40">Amount</th>
                            <th className="px-6 py-4 font-medium min-w-30">Status</th>
                            <th className="px-6 py-4 font-medium  min-w-50">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {vehicles.slice(0, 8).map((vehicle) => (
                            <tr
                                key={vehicle.id}
                                className="hover:bg-gray-50">

                                {/* invoice */}
                                <td className="px-6 py-4 text-sm text-[#0B1E3D]">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${vehicle.paymentStatus === 'payment-completed' ? 'bg-green-50 text-green-600' :
                                            vehicle.paymentStatus === 'payment-pending' ? 'bg-orange-50 text-orange-500' :
                                                vehicle.paymentStatus === 'refunded' ? 'bg-purple-50 text-purple-600' :
                                                    'bg-slate-50 text-slate-600'
                                            }`}>
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-[#0B1E3D]">INV {vehicle.inv || "23456"}</p>
                                            <p className="text-xs text-slate-500">Lot # {vehicle.id}</p>
                                        </div>
                                    </div>
                                </td>

                                {/* Vehicle Details */}
                                <td className="px-6 py-4 flex items-center gap-4">
                                    <img
                                        src={vehicle.image}
                                        alt={vehicle.model}
                                        className="w-20 h-14 object-cover rounded" />
                                    <div>
                                        <h3 className="font-bold text-[#0B1E3D] text-sm">{vehicle.year} {vehicle.make} {vehicle.model}</h3>
                                        <p className="text-xs text-gray-700">{vehicle.seller || "AI YouSuf Motors"}</p>
                                    </div>
                                </td>

                                {/* invoice date */}
                                <td className="px-6 py-4 ">
                                    <p className="text-xs text-gray-500 font-semibold">{vehicle.invoiceDate || "May 20, 2024"}</p>
                                    <p className="text-xs text-gray-500 font-semibold">{vehicle.invoiceTime || "11:00 AM GST"}</p>
                                </td>

                                {/* due date */}
                                <td className="px-6 py-4 ">
                                    <p className="text-xs text-gray-500 font-semibold">{vehicle.dueDate || "May 20, 2024"}</p>
                                    <p className="text-xs text-gray-500 font-semibold">{vehicle.dueTime || "11:00 AM GST"}</p>
                                </td>

                                {/* amount */}
                                <td className="px-6 py-4 text-sm">
                                    <p className='text-sm font-bold'>AED 118,000</p>
                                    <p className='text-sm text-blue-700 font-semibold'>view Breakdown</p>
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
                                            </>
                                        );
                                    })()}
                                </td>

                                {/* action btn */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        {vehicle.paymentStatus === 'payment-pending' ? (
                                            <button className="px-4 py-2 text-[14px] font-semibold text-white bg-[#D97706] border border-[#D97706] rounded-lg hover:bg-[#b86505] transition-all">
                                                Pay Now
                                            </button>
                                        ) : (
                                            <button className="p-2 text-[#D97706] border border-slate-200 rounded-lg hover:bg-slate-50 transition-all">
                                                <Download size={18} />
                                            </button>
                                        )}

                                        <button className="p-2 text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all">
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default BuyerInvoicesList;
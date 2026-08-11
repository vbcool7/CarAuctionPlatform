
import React, { useState } from 'react';
import { ArrowLeftRight, CreditCard, Eye, Landmark, MoreHorizontal, MoreVertical } from 'lucide-react';
import { FaPaypal, FaUniversity } from "react-icons/fa";
import { SiWise } from "react-icons/si";
import { payoutsList } from '../../Data';

function PayoutsList({ setCurrentPage, setSelectedPayoutId }) {

    const [activeTab, setActiveTab] = useState("all-payouts");

    // tabs
    const tabs = [
        { id: 'all-payouts', label: 'All Payouts' },
        { id: 'pending', label: 'Pending' },
        { id: 'processing', label: 'Processing' },
        { id: 'completed', label: 'Completed' },
        { id: 'failed', label: 'Failed' },
        { id: 'cancelled', label: 'Cancelled' },
    ];

    return (
        <div>
            {/* tabs */}
            <div className="flex gap-10 border-b border-slate-100 my-6 overflow-x-auto no-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`pb-3 text-[14px] font-medium whitespace-nowrap border-b-2 transition-colors 
                            ${activeTab === tab.id
                                ? 'border-[#D97706] text-[#D97706]'
                                : 'border-transparent text-slate-500 hover:text-slate-700'
                            }`}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* table */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-left table-fixed">
                    <thead className="bg-gray-100 border-b border-gray-200 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                        <tr>
                            <th className="px-6 py-4 w-45">Payout ID</th>
                            <th className="px-6 py-4 w-60">User / Seller</th>
                            <th className="px-6 py-4 w-40">Type</th>
                            <th className="px-6 py-4 w-40">Amount</th>
                            <th className="px-6 py-4 w-45">Method</th>
                            <th className="px-6 py-4 w-40">Account Details</th>
                            <th className="px-6 py-4 w-35">Status</th>
                            <th className="px-6 py-4 w-35">Payout Date</th>
                            <th className="px-6 py-4 w-30">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-amber-50">
                        {payoutsList.map((payout, index) => (
                            <tr
                                key={payout.payoutId || index}
                                className="hover:bg-gray-50/50 transition-colors">

                                {/* bid id */}
                                <td className='px-6 py-4'>
                                    <span className='text-[13px] font-semibold text-gray-500'>
                                        {payout.payoutId || "---"}
                                    </span>
                                </td>

                                {/* user */}
                                <td className="px-6 py-4 flex items-center gap-4">
                                    <img
                                        src={payout.avatarUrl}
                                        alt={payout.userName}
                                        className="w-7 h-7 object-cover rounded-full shrink-0" />
                                    <div className="truncate">
                                        <div className="text-gray-700 font-semibold text-[13px] truncate">{payout.userName}</div>
                                        <div className="text-[11px] text-gray-500">{payout.userEmail}</div>
                                    </div>
                                </td>

                                {/* type */}
                                <td className='px-6 py-4'>
                                    <span className="text-[13px] font-medium text-slate-700">
                                        {payout.payoutType}
                                    </span>
                                </td>

                                {/* amt */}
                                <td className='px-6 py-4'>
                                    <span className="text-[13px] font-bold text-green-600">
                                        ${(payout.breakdown.winningAmount - payout.breakdown.platformFee - payout.breakdown.paymentProcessingFee - payout.breakdown.otherDeductions).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </span>
                                </td>

                                {/* method */}
                                <td className="px-6 py-4 text-[13px] text-slate-700 leading-tight">
                                    <div className="flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-md flex items-center justify-center bg-slate-100 text-slate-600 shrink-0">
                                            {payout.method === "Bank Transfer" && <Landmark className="w-3.5 h-3.5" />}
                                            {payout.method === "Wire Transfer" && <ArrowLeftRight className="w-3.5 h-3.5" />}
                                            {payout.method === "PayPal" && <FaPaypal className="text-blue-600" />}
                                            {payout.method === "Wise" && <SiWise className="text-emerald-600" />}
                                            {!["Bank Transfer", "Wire Transfer", "PayPal", "Wise"].includes(payout.method) && <CreditCard className="w-3.5 h-3.5" />}
                                        </span>
                                        <span className="font-semibold text-slate-800 truncate">{payout.method}</span>
                                    </div>
                                </td>

                                {/* acc detail */}
                                <td className="px-6 py-4 text-[13px] leading-tight">
                                    <div className="font-semibold text-slate-800">{payout.bankDetails.accountNumber}</div>
                                    {payout.bankDetails.bankName && (
                                        <div className="text-[11px] text-slate-400 mt-0.5">{payout.bankDetails.bankName}</div>
                                    )}
                                </td>

                                {/* status */}
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-[11px] font-medium border 
                                        ${payout.status === 'Completed'
                                            ? 'border-green-200 bg-green-50 text-green-700'
                                            : payout.status === 'Failed'
                                                ? 'border-red-200 bg-red-50 text-red-600'
                                                : payout.status === 'Processing'
                                                    ? 'border-blue-200 bg-blue-50 text-blue-600'
                                                    : 'border-amber-200 bg-amber-50 text-amber-600'
                                        }`}>
                                        {payout.status}
                                    </span>
                                </td>

                                {/* pay date / time */}
                                <td className='px-6 py-4 text-[13px] leading-tight'>
                                    <div className="font-semibold text-slate-800">{payout.date}</div>
                                    <div className="text-[11px] text-slate-400 mt-0.5">{payout.time}</div>
                                </td>

                                {/* actions */}
                                <td className="px-6 py-4">
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => {
                                                setSelectedPayoutId(payout.payoutId)
                                                setCurrentPage('payouts-detail')
                                            }}
                                            className="p-1 text-slate-400 hover:text-slate-600">
                                            <Eye size={16} />
                                        </button>

                                        <button
                                            className="p-1 text-slate-400 hover:text-slate-600">
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
    )
}

export default PayoutsList
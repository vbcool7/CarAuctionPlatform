
import React, { useState } from 'react';
import { ArrowLeftRight, CreditCard, Eye, Landmark, MoreHorizontal, MoreVertical } from 'lucide-react';
import { FaPaypal, FaUniversity } from "react-icons/fa";
import { SiWise } from "react-icons/si";
import { allTransactions } from '../../Data';

function TransactionsList({ setCurrentPage, setSelectedTransactionId }) {

    const [activeTab, setActiveTab] = useState("all");

    // tabs
    const tabs = [
        { id: 'all', label: 'All Transactions' },
        { id: 'successful', label: 'Successful' },
        { id: 'pending', label: 'Pending' },
        { id: 'failed', label: 'Failed' },
        { id: 'refunded', label: 'Refunded' },
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

            {/* Transaction Table */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-left table-fixed">
                    <thead className="bg-gray-100 border-b border-gray-200 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                        <tr>
                            <th className="px-6 py-4 w-45">Transaction ID</th>
                            <th className="px-6 py-4 w-60">User</th>
                            <th className="px-6 py-4 w-40">Type</th>
                            <th className="px-6 py-4 w-40">Amount</th>
                            <th className="px-6 py-4 w-45">Payment Method</th>
                            <th className="px-6 py-4 w-35">Status</th>
                            <th className="px-6 py-4 w-40">Transaction Date</th>
                            <th className="px-6 py-4 w-45">Reference ID</th>
                            <th className="px-6 py-4 w-30">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-amber-50">
                        {allTransactions.map((transaction, index) => (
                            <tr
                                key={transaction.transactionId || index}
                                className="hover:bg-gray-50/50 transition-colors"
                            >

                                {/* Transaction ID */}
                                <td className="px-6 py-4 leading-tight">
                                    <div className="text-[13px] font-semibold text-slate-800">
                                        {transaction.transactionId || "---"}
                                    </div>
                                </td>

                                {/* User */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <img
                                            src={transaction.avatarUrl}
                                            alt={transaction.userName}
                                            className="w-7 h-7 object-cover rounded-full shrink-0"
                                        />

                                        <div className="min-w-0">
                                            <div className="text-gray-700 font-semibold text-[13px] truncate">
                                                {transaction.userName || "---"}
                                            </div>

                                            <div className="text-[11px] text-gray-500 truncate">
                                                {transaction.userEmail || "---"}
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                {/* Type */}
                                <td className="px-6 py-4">
                                    <span className="text-[13px] font-medium text-slate-700">
                                        {transaction.transactionType || "---"}
                                    </span>
                                </td>

                                {/* Amount */}
                                <td className="px-6 py-4">
                                    <span
                                        className={`text-[13px] font-bold ${transaction.transactionType === "Refund"
                                                ? "text-red-600"
                                                : "text-green-600"
                                            }`}
                                    >
                                        {transaction.amount || "---"}
                                    </span>
                                </td>

                                {/* Payment Method */}
                                <td className="px-6 py-4 text-[13px] text-slate-700">
                                    <div className="flex items-center gap-2">

                                        <span className="w-6 h-6 rounded-md flex items-center justify-center bg-slate-100 text-slate-600 shrink-0">
                                            {transaction.method === "Bank Transfer" && (
                                                <Landmark className="w-3.5 h-3.5" />
                                            )}

                                            {transaction.method === "Wire Transfer" && (
                                                <ArrowLeftRight className="w-3.5 h-3.5" />
                                            )}

                                            {transaction.method === "PayPal" && (
                                                <FaPaypal className="text-blue-600" />
                                            )}

                                            {transaction.method === "Wise" && (
                                                <SiWise className="text-emerald-600" />
                                            )}

                                            {![
                                                "Bank Transfer",
                                                "Wire Transfer",
                                                "PayPal",
                                                "Wise",
                                            ].includes(transaction.method) && (
                                                    <CreditCard className="w-3.5 h-3.5" />
                                                )}
                                        </span>

                                        <span className="font-semibold text-slate-800 truncate">
                                            {transaction.method || "---"}
                                        </span>
                                    </div>
                                </td>

                                {/* Status */}
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-2 py-1 rounded text-[11px] font-medium border ${transaction.status === "Completed"
                                                ? "border-green-200 bg-green-50 text-green-700"
                                                : transaction.status === "Failed"
                                                    ? "border-red-200 bg-red-50 text-red-600"
                                                    : transaction.status === "Processing"
                                                        ? "border-blue-200 bg-blue-50 text-blue-600"
                                                        : transaction.status === "Refunded"
                                                            ? "border-purple-200 bg-purple-50 text-purple-600"
                                                            : "border-amber-200 bg-amber-50 text-amber-600"
                                            }`}
                                    >
                                        {transaction.status || "---"}
                                    </span>
                                </td>

                                {/* Transaction Date */}
                                <td className="px-6 py-4 text-[13px] leading-tight">
                                    <div className="font-semibold text-slate-800">
                                        {transaction.date || "---"}
                                    </div>

                                    <div className="text-[11px] text-slate-400 mt-0.5">
                                        {transaction.time || "---"}
                                    </div>
                                </td>

                                {/* Reference ID */}
                                <td className="px-6 py-4">
                                    <span className="text-[12px] font-medium text-slate-600">
                                        {transaction.referenceId || "---"}
                                    </span>
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <button
                                        onClick={() => {
                                            setSelectedTransactionId(transaction.transactionId)
                                            setCurrentPage('transactions-detail')
                                        }}
                                            className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                                            title="View Transaction"
                                        >
                                            <Eye size={16} />
                                        </button>

                                        <button
                                            className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                                            title="More Actions"
                                        >
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

export default TransactionsList
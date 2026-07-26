
import React, { useState } from 'react';
import { ArrowLeftRight, CreditCard, Eye, Landmark, Wallet, MoreVertical } from 'lucide-react';
import { FaPaypal, FaUniversity, FaCcVisa, FaCcMastercard } from "react-icons/fa";
import { SiWise } from "react-icons/si";
import { allPayments } from '../../Data';

function AllPaymentsList({ setCurrentPage, setSelectedPaymentId }) {

    const [activeTab, setActiveTab] = useState("all-payments");

    // tabs
    const tabs = [
        { id: 'all-payments', label: 'All Payments' },
        { id: 'completed', label: 'Completed' },
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

            {/* table */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-left table-fixed">
                    <thead className="bg-gray-100 border-b border-gray-200 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                        <tr>
                            <th className="px-6 py-4 w-45">Paymet ID</th>
                            <th className="px-6 py-4 w-60">Invoice / Auction</th>
                            <th className="px-6 py-4 w-50">User / Party</th>
                            <th className="px-6 py-4 w-40">Type</th>
                            <th className="px-6 py-4 w-40">Amount</th>
                            <th className="px-6 py-4 w-45">Method</th>
                            <th className="px-6 py-4 w-45">Account Details</th>
                            <th className="px-6 py-4 w-35">Status</th>
                            <th className="px-6 py-4 w-35">Payout Date</th>
                            <th className="px-6 py-4 w-30">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-amber-50">
                        {allPayments.map((payment, index) => (
                            <tr
                                key={payment.id || index}
                                className="hover:bg-gray-50/50 transition-colors">

                                {/* payment id */}
                                <td className='px-6 py-4'>
                                    <span className='text-[13px] font-semibold text-gray-500'>
                                        {payment.id || "---"}
                                    </span>
                                </td>

                                {/* invoice data */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        {payment.imageUrl ? (
                                            <img
                                                src={payment.imageUrl}
                                                alt="Car"
                                                className="w-16 h-10 object-cover rounded-md border border-slate-100 shrink-0"
                                            />
                                        ) : (
                                            <div className="w-16 h-10 rounded-md bg-slate-100 flex items-center justify-center text-[10px] text-slate-400 shrink-0">
                                                No Img
                                            </div>
                                        )}
                                        <div>
                                            <span className="text-xs font-bold text-indigo-950 block hover:underline cursor-pointer">
                                                {payment.invoiceId}
                                            </span>
                                            <span className="text-[11px] text-slate-500 font-medium block">
                                                {payment.auctionId}
                                            </span>
                                        </div>
                                    </div>
                                </td>

                                {/* user  */}
                                <td className="px-6 py-4 flex items-center gap-4">
                                    <img
                                        src={payment.avatarUrl}
                                        alt={payment.userName}
                                        className="w-7 h-7 object-cover rounded-full shrink-0" />
                                    <div className="role">
                                        <div className="text-[13px] text-gray-700 font-semibold">{payment.name}</div>
                                        <div className="text-[11px] text-gray-500">{payment.role}</div>
                                    </div>
                                </td>

                                {/* type */}
                                <td className="px-6 py-4">
                                    <span className="text-[13px] font-semibold text-slate-800 block">
                                        {payment.title}
                                    </span>
                                    <span className="text-[11px] font-medium text-slate-500 block">
                                        {payment.subtitle}
                                    </span>
                                </td>

                                {/* amt */}
                                <td className="px-6 py-4">
                                    <span className={`text-[13px] font-bold ${payment.status === "Completed" ? "text-green-600" :
                                        payment.status === "Refunded" ? "text-blue-600" :
                                            payment.status === "Pending" ? "text-purple-500" :
                                                payment.status === "Failed" ? "text-red-500" : "text-slate-900"
                                        }`}>
                                        {payment.amount}
                                    </span>
                                </td>

                                {/* method */}
                                <td className="px-6 py-4 text-[13px] text-slate-700 leading-tight">
                                    <div className="flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-md flex items-center justify-center bg-slate-100 text-slate-600 shrink-0">
                                            {payment.method === "Bank Transfer" && <Landmark className="w-3.5 h-3.5" />}
                                            {payment.method === "Wire Transfer" && <ArrowLeftRight className="w-3.5 h-3.5" />}
                                            {payment.method === "PayPal" && <FaPaypal className="text-blue-600" />}
                                            {payment.method === "Wise" && <SiWise className="text-emerald-600" />}
                                            {payment.method === "Visa" && <FaCcVisa className="text-blue-700" />}
                                            {payment.method === "Mastercard" && <FaCcMastercard className="text-orange-600" />}
                                            {!["Bank Transfer", "Wire Transfer", "PayPal", "Wise", "Visa", "Mastercard"].includes(payment.method) && <CreditCard className="w-3.5 h-3.5" />}
                                        </span>
                                        <span className="font-semibold text-slate-800 truncate">{payment.method}</span>
                                    </div>
                                </td>

                                {/* acc detail */}
                                <td className="px-6 py-4 text-[13px] leading-tight">
                                    <div className="font-semibold text-slate-800">{payment.methodDetail || "--"}</div>
                                </td>

                                {/* status */}
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-[11px] font-medium border 
                                        ${payment.status === 'Completed'
                                            ? 'border-green-200 bg-green-50 text-green-700'
                                            : payment.status === 'Failed'
                                                ? 'border-red-200 bg-red-50 text-red-600'
                                                : payment.status === 'Refunded'
                                                    ? 'border-blue-200 bg-blue-50 text-blue-600'
                                                    : 'border-amber-200 bg-amber-50 text-amber-600'
                                        }`}>
                                        {payment.status}
                                    </span>
                                </td>

                                {/* pay date / time */}
                                <td className='px-6 py-4 text-[13px] leading-tight'>
                                    <div className="font-semibold text-slate-800">{payment.date}</div>
                                    <div className="text-[11px] text-slate-400 mt-0.5">{payment.time}</div>
                                </td>

                                {/* actions */}
                                <td className="px-6 py-4">
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => {
                                                setSelectedPaymentId(payment.id);
                                                setCurrentPage('all-payments-detail');
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

export default AllPaymentsList;
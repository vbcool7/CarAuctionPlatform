
import React, { useState } from 'react';
import { allPaymentGateways } from '../../Data';
import { ChevronRight, CreditCard, Download, Eye, File, MoreVertical } from 'lucide-react';
import { FaStripe, FaPaypal, FaMoneyBillWave } from "react-icons/fa";
import { SiRazorpay, SiSquare, SiWise } from "react-icons/si";

const gatewayIcons = {
    Stripe: { icon: FaStripe, color: "text-indigo-600", bg: "bg-indigo-50" }, PayPal: { icon: FaPaypal, color: "text-blue-600", bg: "bg-blue-50" },
    Razorpay: { icon: SiRazorpay, color: "text-cyan-600", bg: "bg-cyan-50" }, Paystack: { icon: FaMoneyBillWave, color: "text-sky-500", bg: "bg-sky-50" },
    Square: { icon: SiSquare, color: "text-slate-900", bg: "bg-slate-100" }, Wise: { icon: SiWise, color: "text-emerald-600", bg: "bg-emerald-50" }
};

function PaymentGatewayDetails({ gatewayId, setCurrentPage }) {

    const gateway = allPaymentGateways.find(g => g.id === gatewayId);

    if(!gateway) return null;

    const [activeTab, setActiveTab] = useState("transaction-history");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [noteText, setNoteText] = useState("");

    // Get icon according to selected gateway
    const Gateway = gatewayIcons[gateway?.name];
    const GatewayIcon = Gateway?.icon;

    // tabs
    const tabs = [
        { id: 'transaction-history', label: 'Transaction History' },
        { id: 'payouts', label: 'Payouts' },
        { id: 'refunds', label: 'Refunds' },
        { id: 'webhook-events', label: 'Webhook Events' },
        { id: 'configuration-history', label: 'Configuration History' },
    ];

    const handleAddNote = (e) => {
        e.preventDefault();
        console.log("Note added:", noteText);
        setIsModalOpen(false);
        setNoteText("");
    };

    return (
        <div className='pb-6'>
            {/* Header */}
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between pb-6">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3D]">Payment Gateway Details</h1>

                    <div className="mt-2 flex items-center text-[11px] md:text-[13px]">
                        <span
                            onClick={() => setCurrentPage("dashboard")}
                            className="cursor-pointer text-slate-500 hover:text-[#D97706] transition-colors">
                            Dashboard
                        </span>

                        <span className="mx-1 text-slate-300"><ChevronRight size={16} /></span>
                        <span className=" text-slate-500">Payment Management</span>

                        <span className="mx-1 text-slate-300"><ChevronRight size={16} /></span>
                        <span
                            onClick={() => setCurrentPage('payment-gateways')}
                            className="cursor-pointer text-slate-500 hover:text-[#D97706] transition-colors">
                            Payment Gateway
                        </span>

                        <span className="mx-1 text-slate-300"><ChevronRight size={16} /></span>
                        <span className="font-medium text-[#D97706]">
                            Payment Gateway Detail
                        </span>
                    </div>
                </div>

                {/* btns */}
                <div className="">
                    <button className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-transparent p-2 font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-[#D97706] hover:text-[#D97706] hover:bg-amber-50">
                        <MoreVertical size={16} />
                        <span className="text-[13px]">More Actions</span>
                    </button>
                </div>
            </div>

            {/* top gateway header */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-4">
                    <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center border border-slate-100 shadow-sm ${Gateway?.bg}`} >
                        {GatewayIcon && (
                            <GatewayIcon
                                size={34}
                                className={Gateway?.color}
                            />
                        )}
                    </div>

                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold text-[#0B1E3D]">
                                {gateway?.name}
                            </h2>

                            <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-semibold">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                {gateway?.status}
                            </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[11px] md:text-[13px] text-slate-500">
                            <span>
                                Gateway ID:{' '}
                                <strong className="text-slate-700">
                                    {gateway?.id}
                                </strong>
                            </span>
                            <span className="text-slate-300 hidden sm:block"> | </span>
                            <span>
                                Created on:{' '}
                                <strong className="text-slate-700">
                                    {gateway?.date}
                                </strong>
                            </span>
                            <span className="text-slate-300 hidden sm:block"> | </span>
                            <span>
                                Last Updated:{' '}
                                <strong className="text-slate-700">
                                    {gateway?.date} {gateway?.time}
                                </strong>
                            </span>
                        </div>
                    </div>
                </div>

            </div>

            {/* box section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mt-5">

                {/* ================= Gateway Overview ================= */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">

                    <h3 className="text-sm font-bold text-[#0B1E3D]">Gateway Overview </h3>

                    <div className="mt-4 space-y-3">

                        <div className="flex justify-between gap-4 text-[13px]">
                            <span className="text-slate-500">Provider Name</span>
                            <span className="font-medium text-slate-700">{gateway?.company}</span>
                        </div>

                        <div className="flex justify-between gap-4 text-[13px]">
                            <span className="text-slate-500">Gateway ID</span>
                            <span className="font-medium text-slate-700">
                                {gateway?.id}
                            </span>
                        </div>

                        <div className="flex justify-between gap-4 text-[13px]">
                            <span className="text-slate-500">Status</span>

                            <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-50 text-emerald-600 font-semibold">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                {gateway?.status}
                            </span>
                        </div>

                        <div className="flex justify-between gap-4 text-[13px]">
                            <span className="text-slate-500">Environment</span>

                            <span className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-600 font-semibold">
                                {gateway?.environment}
                            </span>
                        </div>

                        <div className="text-[13px]">
                            <span className="text-slate-500">
                                Description
                            </span>

                            <p className="mt-1 text-slate-700 font-medium">
                                {gateway?.description}
                            </p>
                        </div>

                        <div className="flex justify-between gap-4 text-[13px]">
                            <span className="text-slate-500">Website</span>

                            <a
                                href={gateway?.website}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                {gateway?.website}
                            </a>
                        </div>

                        <div className="flex justify-between gap-4 text-[13px]">
                            <span className="text-slate-500">
                                Customer Support
                            </span>

                            <span className="text-blue-600 font-medium">
                                {gateway?.customerSupport}
                            </span>
                        </div>

                        <div className="flex justify-between gap-4 text-[13px]">
                            <span className="text-slate-500">Phone</span>

                            <span className="text-slate-700 font-medium">
                                {gateway?.phone}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ================= Middle Column ================= */}
                <div className="flex flex-col gap-4">
                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-[#0B1E3D]">
                                Supported Currency
                            </h3>

                            <span className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-600 text-[11px] font-semibold">
                                Active
                            </span>
                        </div>

                        <div className="mt-4 flex items-center gap-3">

                            <div className="w-8 h-8 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center">
                                <span className="text-xs font-bold text-slate-700">
                                    د.إ
                                </span>
                            </div>

                            <div>
                                <p className="text-[13px] font-semibold text-slate-800">
                                    UAE Dirham
                                </p>

                                <p className="text-[13px] text-slate-500 mt-0.5">
                                    {gateway?.currencies}
                                </p>
                            </div>
                        </div>

                        <div className="border-t border-slate-100 my-3" />
                        <div className="flex items-center justify-between text-[13px]">
                            <span className="text-slate-500">
                                Currency Code
                            </span>

                            <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-600 font-semibold">
                                AED
                            </span>
                        </div>
                    </div>

                    {/* Transaction Summary */}
                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">

                        <h3 className="text-sm font-bold text-[#0B1E3D]">
                            Transaction Summary (This Month)
                        </h3>

                        <div className="grid grid-cols-2 gap-4 mt-4">

                            <div>
                                <p className="text-[13px] text-slate-500">
                                    Total Transactions
                                </p>

                                <p className="mt-1 text-sm font-bold text-[#0B1E3D]">
                                    {gateway?.transactions || '---'}
                                </p>
                            </div>

                            <div>
                                <p className="text-[13px] text-slate-500">
                                    Total Volume
                                </p>

                                <p className="mt-1 text-sm font-bold text-[#0B1E3D]">
                                    {gateway?.totalVolume || '---'}
                                </p>
                            </div>

                            <div>
                                <p className="text-[13px] text-slate-500">
                                    Success Rate
                                </p>

                                <p className="mt-1 text-sm font-bold text-[#0B1E3D]">
                                    {gateway?.successRate || '---'}
                                </p>

                                <div className="mt-2 h-1 rounded-full bg-emerald-500 w-full" />
                            </div>

                            <div>
                                <p className="text-[13px] text-slate-500">
                                    Refunded Amount
                                </p>

                                <p className="mt-1 text-sm font-bold text-[#0B1E3D]">
                                    {gateway?.refundedAmount || '---'}
                                </p>
                            </div>

                        </div>

                    </div>
                </div>

                {/* ================= Configuration ================= */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">

                    <h3 className="text-sm font-bold text-[#0B1E3D]">
                        Configuration
                    </h3>

                    <div className="mt-4 space-y-4">

                        <div className="flex justify-between gap-3 text-[13px]">
                            <span className="text-slate-500">
                                API Key
                            </span>

                            <span className="font-medium text-slate-700">
                                {gateway?.apiKey || '---'}
                            </span>
                        </div>

                        <div className="flex justify-between gap-3 text-[13px]">
                            <span className="text-slate-500">
                                Publishable Key
                            </span>

                            <span className="font-medium text-slate-700">
                                {gateway?.publishableKey || '---'}
                            </span>
                        </div>

                        <div className="text-[13px]">

                            <span className="text-slate-500">
                                Webhook URL
                            </span>

                            <p className="mt-1 text-blue-600 break-all font-medium">
                                {gateway?.webhookUrl || '---'}
                            </p>

                        </div>

                        <div className="flex justify-between gap-3 text-[13px]">

                            <span className="text-slate-500">
                                Webhook Status
                            </span>

                            <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-50 text-emerald-600 font-semibold">

                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />

                                {gateway?.webhookStatus || '---'}

                            </span>

                        </div>

                        <div className="text-[13px]">

                            <span className="text-slate-500">
                                Webhook Events
                            </span>

                            <p className="mt-1 text-slate-700 font-medium leading-relaxed">
                                {gateway?.webhookEvents || '---'}
                            </p>

                        </div>

                        <div className="flex justify-between gap-3 text-[13px]">

                            <span className="text-slate-500">
                                Test Mode
                            </span>

                            <span className="font-medium text-slate-700">
                                {gateway?.testMode || '---'}
                            </span>

                        </div>

                    </div>

                </div>

            </div>

            {/* tabs */}
            <div className="mt-5 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
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

                {activeTab === 'transaction-history' && (
                    <div className="overflow-x-auto no-scrollbar">
                        <table className="w-full text-left table-fixed">
                            <thead>
                                <tr className="border-b border-slate-100 text-[12px] font-semibold text-slate-500">
                                    <th className="pb-3 w-35">Transaction ID</th>
                                    <th className="pb-3 w-40">Date & Time</th>
                                    <th className="pb-3 w-30">Type</th>
                                    <th className="pb-3 w-35">Amount</th>
                                    <th className="pb-3 w-30">Currency</th>
                                    <th className="pb-3 w-30">Status</th>
                                    <th className="pb-3 w-50">Customer</th>
                                    <th className="pb-3 w-45">Description</th>
                                    <th className="pb-3 text-center w-30">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 text-[13px]">
                                {gateway.transactionHistory?.map((tx) => (
                                    <tr
                                        key={tx.id}
                                        className="hover:bg-slate-50/50">
                                        <td className="py-3.5 font-medium text-indigo-600">{tx.id}</td>
                                        <td className="py-3.5 text-slate-600">{tx.dateTime}</td>
                                        <td className="py-3.5">
                                            <span className={`px-2 py-0.5 rounded text-[11px] font-medium 
                                            ${tx.type === 'Payment' ? 'bg-emerald-50 text-emerald-600' :
                                                    tx.type === 'Refund' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                                                }`}>
                                                {tx.type}
                                            </span>
                                        </td>
                                        <td className="py-3.5 font-medium text-slate-800">{tx.amount}</td>
                                        <td className="py-3.5 text-slate-600">{tx.currency}</td>
                                        <td className="py-3.5">
                                            <span className={`px-2 py-0.5 rounded text-[11px] font-medium 
                                            ${tx.status === 'Succeeded' ? 'bg-emerald-50 text-emerald-600' :
                                                    tx.status === 'Refunded' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                                                }`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                        <td className="py-3.5 text-slate-600">{tx.customer}</td>
                                        <td className="py-3.5 text-slate-500 truncate">{tx.desc}</td>
                                        <td className="py-3.5 text-right">
                                            <button className="px-3 py-1 border border-[#D97706] rounded-lg text-[#D97706] active:scale-95 text-[12px] font-medium">
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'payouts' && (
                    <div className="overflow-x-auto no-scrollbar">
                        <table className="w-full text-left table-fixed">
                            <thead>
                                <tr className="border-b border-slate-100 text-[12px] font-semibold text-slate-500">
                                    <th className="pb-3 w-35">Payout ID</th>
                                    <th className="pb-3 w-40">Date & Time</th>
                                    <th className="pb-3 w-40">Recipient</th>
                                    <th className="pb-3 w-40">Method</th>
                                    <th className="pb-3 w-35">Amount</th>
                                    <th className="pb-3 w-30">Fee</th>
                                    <th className="pb-3 w-35">Net Amount</th>
                                    <th className="pb-3 w-30">Status</th>
                                    <th className="pb-3 w-45">Description</th>
                                    <th className="pb-3 text-center w-30">Action</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-50 text-[13px]">
                                {gateway.payouts?.map((payout) => (
                                    <tr
                                        key={payout.id}
                                        className="hover:bg-slate-50/50">
                                        <td className="py-3.5 font-medium text-indigo-600 truncate pr-2">{payout.id}</td>
                                        <td className="py-3.5 text-slate-600 truncate pr-2">{payout.dateTime}</td>
                                        <td className="py-3.5 truncate pr-2">
                                            <div className="font-medium text-slate-800">{payout.recipientName}</div>
                                            <div className="text-[11px] text-slate-400">{payout.recipientEmail}</div>
                                        </td>
                                        <td className="py-3.5 text-slate-600 truncate pr-2">
                                            <div className="font-medium text-slate-800">{payout.method}</div>
                                            <div className="text-[11px] text-slate-400 truncate">{payout.methodDetails}</div>
                                        </td>
                                        <td className="py-3.5 font-medium text-slate-800 truncate pr-2">{payout.amount}</td>
                                        <td className="py-3.5 text-slate-500 truncate pr-2">{payout.fee}</td>
                                        <td className="py-3.5 font-medium text-slate-800 truncate pr-2">{payout.netAmount}</td>
                                        <td className="py-3.5 truncate pr-2">
                                            <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${payout.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                                }`}>
                                                {payout.status}
                                            </span>
                                        </td>
                                        <td className="py-3.5 text-slate-500 truncate pr-2">{payout.description}</td>
                                        <td className="py-3.5 text-right">
                                            <button className="px-3 py-1 border border-[#D97706] rounded-lg text-[#D97706] active:scale-95 text-[12px] font-medium">
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'refunds' && (
                    <div className="overflow-x-auto no-scrollbar">
                        <table className="w-full text-left table-fixed">
                            <thead>
                                <tr className="border-b border-slate-100 text-[12px] font-semibold text-slate-500">
                                    <th className="pb-3 w-35">Refund ID</th>
                                    <th className="pb-3 w-40">Date & Time</th>
                                    <th className="pb-3 w-40">Original Payment ID</th>
                                    <th className="pb-3 w-40">Customer</th>
                                    <th className="pb-3 w-40">Reason</th>
                                    <th className="pb-3 w-35">Amount</th>
                                    <th className="pb-3 w-30">Fee</th>
                                    <th className="pb-3 w-35">Net Amount</th>
                                    <th className="pb-3 w-30">Status</th>
                                    <th className="pb-3 w-45">Description</th>
                                    <th className="pb-3 text-right w-30">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-50 text-[13px]">
                                {gateway.refunds?.map((refund) => (
                                    <tr
                                        key={refund.id}
                                        className="hover:bg-slate-50/50">
                                        <td className="py-3.5 font-medium text-indigo-600 truncate pr-2">{refund.id}</td>
                                        <td className="py-3.5 text-slate-600 truncate pr-2">{refund.dateTime}</td>
                                        <td className="py-3.5 font-medium text-indigo-600 truncate pr-2">{refund.originalPaymentId}</td>
                                        <td className="py-3.5 truncate pr-2">
                                            <div className="font-medium text-slate-800">{refund.customerName}</div>
                                            <div className="text-[11px] text-slate-400">{refund.customerEmail}</div>
                                        </td>
                                        <td className="py-3.5 text-slate-600 truncate pr-2">{refund.reason}</td>
                                        <td className="py-3.5 font-medium text-slate-800 truncate pr-2">{refund.amount}</td>
                                        <td className="py-3.5 text-slate-500 truncate pr-2">{refund.fee}</td>
                                        <td className="py-3.5 font-medium text-slate-800 truncate pr-2">{refund.netAmount}</td>
                                        <td className="py-3.5 truncate pr-2">
                                            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-600">
                                                {refund.status}
                                            </span>
                                        </td>
                                        <td className="py-3.5 text-slate-500 truncate pr-2">{refund.description}</td>
                                        <td className="py-3.5 text-right">
                                            <button className="px-3 py-1 border border-[#D97706] rounded-lg text-[#D97706] active:scale-95 text-[12px] font-medium">
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'webhook-events' && (
                    <div className="overflow-x-auto no-scrollbar">
                        <table className="w-full text-left table-fixed">
                            <thead>
                                <tr className="border-b border-slate-100 text-[12px] font-semibold text-slate-500">
                                    <th className="pb-3 w-50">Event ID</th>
                                    <th className="pb-3 w-50">Event Type</th>
                                    <th className="pb-3 w-28">Status</th>
                                    <th className="pb-3 w-32">Response</th>
                                    <th className="pb-3 w-24">Attempts</th>
                                    <th className="pb-3 w-40">Received At</th>
                                    <th className="pb-3 w-40">Processed At</th>
                                    <th className="pb-3 w-56">Description</th>
                                    <th className="pb-3 text-right w-20">Action</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-50 text-[13px]">
                                {gateway.webhookHistory?.map((event) => (
                                    <tr
                                        key={event.id}
                                        className="hover:bg-slate-50/50">
                                        <td className="py-3.5 font-medium text-indigo-600 truncate pr-2">{event.id}</td>
                                        <td className="py-3.5 text-slate-700 truncate pr-2">{event.eventType}</td>
                                        <td className="py-3.5 truncate pr-2">
                                            <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${event.status === 'Success' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                                }`}>
                                                {event.status}
                                            </span>
                                        </td>
                                        <td className="py-3.5 truncate pr-2">
                                            <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${event.response === '200 OK' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                                                }`}>
                                                {event.response}
                                            </span>
                                        </td>
                                        <td className="py-3.5 text-slate-600 truncate pr-2">{event.attempts}</td>
                                        <td className="py-3.5 text-slate-600 truncate pr-2">{event.receivedAt}</td>
                                        <td className="py-3.5 text-slate-600 truncate pr-2">{event.processedAt}</td>
                                        <td className="py-3.5 text-slate-500 truncate pr-2">{event.description}</td>
                                        <td className="py-3.5 text-right">
                                            <button className="p-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 active:scale-95 inline-flex items-center justify-center">
                                                <Eye className='w-4 h-4' />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'configuration-history' && (
                    <div className="overflow-x-auto no-scrollbar">
                        <table className="w-full text-left table-fixed">
                            <thead>
                                <tr className="border-b border-slate-100 text-[12px] font-semibold text-slate-500">
                                    <th className="pb-3 w-40">Changed At</th>
                                    <th className="pb-3 w-32">Changed By</th>
                                    <th className="pb-3 w-36">Field Changed</th>
                                    <th className="pb-3 w-48">Old Value</th>
                                    <th className="pb-3 w-48">New Value</th>
                                    <th className="pb-3 w-64">Reason / Note</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-50 text-[13px]">
                                {gateway.configurationHistory?.map((item, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-slate-50/50">
                                        <td className="py-3.5 text-slate-600 truncate pr-2">{item.changedAt}</td>
                                        <td className="py-3.5 text-slate-700 truncate pr-2">{item.changedBy}</td>
                                        <td className="py-3.5 font-medium text-slate-800 truncate pr-2">{item.fieldChanged}</td>
                                        <td className="py-3.5 truncate pr-2">
                                            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 truncate inline-block max-w-full">
                                                {item.oldValue}
                                            </span>
                                        </td>
                                        <td className="py-3.5 truncate pr-2">
                                            <span className={`px-2 py-0.5 rounded text-[11px] font-medium truncate inline-block max-w-full ${item.newValue === 'Disabled' || item.newValue === 'Enabled'
                                                ? (item.newValue === 'Disabled' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600')
                                                : 'bg-emerald-50 text-emerald-600'
                                                }`}>
                                                {item.newValue}
                                            </span>
                                        </td>
                                        <td className="py-3.5 text-slate-500 truncate pr-2">{item.reason}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* placeholder if data not available */}
                {((activeTab === 'transaction-history' && (!gateway.transactionHistory || gateway.transactionHistory.length === 0)) ||
                    (activeTab === 'payouts' && (!gateway.payouts || gateway.payouts.length === 0)) ||
                    (activeTab === 'refunds' && (!gateway.refunds || gateway.refunds.length === 0)) ||
                    (activeTab === 'webhook-events' && (!gateway.webhookEvents || gateway.webhookEvents.length === 0)) ||
                    (activeTab === 'configuration-history' && (!gateway.configurationHistory || gateway.configurationHistory.length === 0))) && (
                        <div className="py-12 text-center text-slate-400 text-sm">
                            No data available for {tabs.find(t => t.id === activeTab)?.label}
                        </div>
                    )}
            </div>

            {/* bottom card */}
            <div className="mt-5 ">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Card 1: Recent Payouts */}
                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <h3 className="text-[14px] font-semibold text-slate-800">Recent Payouts</h3>
                            <button className="text-[12px] font-medium text-[#D97706] hover:text-[#D97706] inline-flex items-center gap-1">
                                View All Payouts &rarr;
                            </button>
                        </div>
                        <div className="pt-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                    <File className='w-5 h-5' />
                                </div>
                                <div>
                                    <div className="text-[13px] font-semibold text-slate-800">PO_2024_0619_001</div>
                                    <div className="text-[11px] text-slate-400">Jun 19, 2024 10:30 AM</div>
                                </div>
                            </div>
                            <div className="text-right flex items-center gap-3">
                                <div>
                                    <div className="text-[13px] font-semibold text-slate-800">$15,750.00</div>
                                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-600">
                                        Completed
                                    </span>
                                </div>
                                <ChevronRight className='w-4.5 h-4.5 text-gray-400' />
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Recent Refunds */}
                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <h3 className="text-[14px] font-semibold text-slate-800">Recent Refunds</h3>
                            <button className="text-[12px] font-medium text-[#D97706] hover:text-[#D97706] inline-flex items-center gap-1">
                                View All Refunds &rarr;
                            </button>
                        </div>
                        <div className="pt-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
                                    <CreditCard className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-[13px] font-semibold text-slate-800">RF_2024_0618_002</div>
                                    <div className="text-[11px] text-slate-400">Jun 18, 2024 04:20 PM</div>
                                </div>
                            </div>
                            <div className="text-right flex items-center gap-3">
                                <div>
                                    <div className="text-[13px] font-semibold text-slate-800">$350.00</div>
                                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-600">
                                        Refunded
                                    </span>
                                </div>
                                <ChevronRight className='w-4.5 h-4.5 text-gray-400' />
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Notes */}
                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <h3 className="text-[14px] font-semibold text-slate-800">Notes</h3>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="text-[12px] font-medium text-[#D97706] hover:text-amber-700 inline-flex items-center gap-1">
                                + Add Note
                            </button>
                        </div>
                        <div className="pt-4 flex flex-col justify-center h-full">
                            <div className="text-[13px] font-medium text-slate-800">Gateway activated for live transactions.</div>
                            <div className="text-[11px] text-slate-400 mt-1">Added by Admin User on May 12, 2024 02:30 PM</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* for note */}
            {isModalOpen && (
                <div className="fixed inset-0 z-70 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                            <h3 className="text-[16px] font-semibold text-slate-800">Add New Note</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 text-lg font-bold">
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleAddNote}>
                            <textarea
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                placeholder="Enter your note here..."
                                className="w-full h-32 p-3 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:border-[#D97706]"
                                required
                            />
                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 text-[13px] font-medium hover:bg-slate-50">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-[#D97706] text-white rounded-lg text-[13px] font-medium hover:bg-amber-700">
                                    Save Note
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    )
}

export default PaymentGatewayDetails;
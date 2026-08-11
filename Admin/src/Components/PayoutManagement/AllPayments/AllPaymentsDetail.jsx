
import React from 'react';
import { ChevronRight, Copy, Download, Mail, Phone, FileText, RotateCcw, MessageSquare, Eye, CheckCircle2, Clock, XCircle, Circle, RefreshCcw } from 'lucide-react';
import { FaUniversity, FaPaypal, FaWallet } from "react-icons/fa";
import { FaCcVisa, FaCcMastercard } from "react-icons/fa6";
import { allPayments } from '../../Data';
import ContactSupport from '../../SharedComponents/ContactSupport';
import QuickActionsCard from '../../SharedComponents/QuickActionsCard';

const TIMELINE_TEMPLATES = {
    Completed: (p) => [
        { step: "Payment Initiated", state: "done", date: p.initiatedDate, time: p.initiatedTime, description: `Payment initiated by ${p.initiatedBy}` },
        { step: "Payment Processing", state: "done", date: p.processingDate, time: p.processingTime, description: "Payment is being processed securely" },
        { step: "Payment Successfully Completed", state: "done", date: p.completedDate, time: p.completedTime, description: `Payment completed via ${p.method} •••• ${p.cardLast4 || ""}` },
        { step: "Receipt Generated", state: "done", date: p.receiptDate, time: p.receiptTime, description: "Receipt generated for this payment" },
        { step: "Seller Payout Scheduled", state: "done", date: p.payoutDate, time: p.payoutTime, description: `Payout scheduled to seller via ${p.payoutMethod || p.method}` },
    ],
    Pending: (p) => [
        { step: "Payment Initiated", state: "active", date: p.initiatedDate, time: p.initiatedTime, description: `Payment initiated by ${p.initiatedBy}` },
        { step: "Payment Processing", state: "pending", date: null, time: null, description: "Pending" },
        { step: "Payment Completion", state: "pending", date: null, time: null, description: "Pending" },
        { step: "Receipt Generation", state: "pending", date: null, time: null, description: "Pending" },
        { step: "Seller Payout", state: "pending", date: null, time: null, description: "Pending" },
    ],
    Failed: (p) => [
        { step: "Payment Initiated", state: "done", date: p.initiatedDate, time: p.initiatedTime, description: `Payment initiated by ${p.initiatedBy}` },
        { step: "Payment Processing", state: "done", date: p.processingDate, time: p.processingTime, description: `Processing with ${p.processor || "gateway"}` },
        { step: "Payment Failed", state: "failed", date: p.failedDate, time: p.failedTime, description: `Reason: ${p.failureReason || "Unknown error"}` },
        { step: "Refund (if any)", state: "na", date: null, time: null, description: "Not applicable" },
        { step: "Seller Payout", state: "na", date: null, time: null, description: "Not applicable" },
    ],
    Refunded: (p) => [
        { step: "Payment Initiated", state: "done", date: p.initiatedDate, time: p.initiatedTime, description: `Payment initiated by ${p.initiatedBy}` },
        { step: "Payment Processing", state: "done", date: p.processingDate, time: p.processingTime, description: "Payment captured successfully" },
        { step: "Refund Requested", state: "done", date: p.refundRequestedDate, time: p.refundRequestedTime, description: `Refund requested by ${p.refundRequestedBy || "buyer"}` },
        { step: "Refund Processed", state: "done", date: p.refundProcessedDate, time: p.refundProcessedTime, description: "Refund processed successfully" },
        { step: "Refund Completed", state: "done", date: p.refundCompletedDate, time: p.refundCompletedTime, description: `Amount refunded to card ending ${p.cardLast4 || ""}` },
    ],
};

const SUMMARY_ICON_CONFIG = {
    Completed: { Icon: CheckCircle2, iconColor: "text-green-500", bg: "bg-green-50" },
    Pending: { Icon: Clock, iconColor: "text-orange-500", bg: "bg-orange-50" },
    Failed: { Icon: XCircle, iconColor: "text-red-500", bg: "bg-red-50" },
    Refunded: { Icon: RefreshCcw, iconColor: "text-green-500", bg: "bg-green-50" },
};

const STATUS_TEXT_COLOR = {
    Completed: "text-green-600",
    Pending: "text-orange-500",
    Failed: "text-red-500",
    Refunded: "text-green-600",
};

function AllPaymentsDetail({ setCurrentPage, paymentId }) {

    const payment = allPayments.find((item) => item.id === paymentId);

    function TimelineIcon({ state }) {
        if (state === "done") return <CheckCircle2 size={18} className="text-green-500" />;
        if (state === "active") return <Clock size={18} className="text-orange-500" />;
        if (state === "failed") return <XCircle size={18} className="text-red-500" />;
        return <Circle size={18} className="text-slate-300" />;
    }

    const getPaymentIcon = (methodName) => {
        switch (methodName?.toLowerCase()) {
            case "visa":
                return { icon: FaCcVisa, theme: "bg-blue-50 text-blue-700" };
            case "mastercard":
                return { icon: FaCcMastercard, theme: "bg-orange-50 text-orange-600" };
            case "paypal":
                return { icon: FaPaypal, theme: "bg-blue-50 text-blue-600" };
            case "bank transfer":
                return { icon: FaUniversity, theme: "bg-purple-50 text-purple-600" };
            default:
                return { icon: FaWallet, theme: "bg-slate-50 text-slate-700" };
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between pb-6">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3D]">Payment Details</h1>

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
                            onClick={() => setCurrentPage('all-payments')}
                            className="cursor-pointer text-slate-500 hover:text-[#D97706] transition-colors">
                            All Payments
                        </span>

                        <span className="mx-1 text-slate-300"><ChevronRight size={16} /></span>
                        <span className="font-medium text-[#D97706]">
                            Payment Detail
                        </span>
                    </div>
                </div>

                {/* btns */}
                <div className="">
                    <button className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-transparent p-2 font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-[#D97706] hover:text-[#D97706] hover:bg-amber-50">
                        <Download size={16} />
                        <span className="text-[13px]">Download Receipt</span>
                    </button>
                </div>
            </div>

            {/* payment id / status */}
            <div className="flex items-center gap-2.5 flex-wrap mb-5">
                <span className="text-sm font-medium text-slate-600">
                    Payment ID: <span className="font-bold text-slate-900">{payment.id}</span>
                </span>
                <button
                    onClick={() => navigator.clipboard.writeText("PAY-2024-04578")}
                    className="text-slate-500 hover:text-slate-800 transition-colors p-1"
                    title="Copy ID"
                >
                    <Copy size={14} />
                </button>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${payment.status === "Completed" ? "bg-green-50 text-green-600" :
                    payment.status === "Refunded" ? "bg-blue-50 text-blue-600" :
                        payment.status === "Pending" ? "bg-amber-50 text-amber-500" :
                            payment.status === "Failed" ? "bg-red-50 text-red-500" : "bg-slate-100 text-slate-700"
                    }`}>
                    {payment.status}
                </span>
            </div>

            {/* main */}
            <div className="grid grid-cols-1 xl:grid-cols-3 pb-6 gap-6 items-start">

                {/* left side */}
                <div className="lg:col-span-2 space-y-6">

                    {/* 1st card */}
                    <div className="w-full bg-white rounded-xl border border-slate-100 p-4 md:p-5 shadow-sm">
                        <h3 className="font-bold text-slate-900 text-sm md:text-base mb-4">
                            1. Payment Overview
                        </h3>

                        <div className="grid grid-cols-2 md:flex md:justify-between gap-4">
                            {/* Column 1 */}
                            <div className="space-y-3">
                                <div>
                                    <span className="text-[11px] text-slate-400 font-medium block mb-0.5">Payment ID</span>
                                    <span className="text-xs font-bold text-slate-900">{payment.id || "---"}</span>
                                </div>
                                <div>
                                    <span className="text-[11px] text-slate-400 font-medium block mb-0.5">Payment Type</span>
                                    <span className="text-xs font-semibold text-slate-800">{payment.paymentType || "---"}</span>
                                </div>
                                <div>
                                    <span className="text-[11px] text-slate-400 font-medium block mb-1">Status</span>
                                    {payment.status ? (
                                        <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold ${payment.status === "Completed" ? "bg-green-50 text-green-600" :
                                            payment.status === "Refunded" ? "bg-blue-50 text-blue-600" :
                                                payment.status === "Pending" ? "bg-amber-50 text-amber-500" :
                                                    payment.status === "Failed" ? "bg-red-50 text-red-500" : "bg-slate-100 text-slate-700"
                                            }`}>
                                            {payment.status}
                                        </span>
                                    ) : (
                                        <span className="text-xs font-semibold text-slate-400">---</span>
                                    )}
                                </div>
                            </div>

                            {/* Column 2 */}
                            <div className="space-y-3">
                                <div>
                                    <span className="text-[11px] text-slate-400 font-medium block mb-0.5">Amount</span>
                                    <span className="text-base font-bold text-green-600">{payment.amount || "---"}</span>
                                </div>
                                <div>
                                    <span className="text-[11px] text-slate-400 font-medium block mb-0.5">Payment Date & Time</span>
                                    <span className="text-xs font-semibold text-slate-800">{payment.dateTime || "---"}</span>
                                </div>
                                <div>
                                    <span className="text-[11px] text-slate-400 font-medium block mb-0.5">Currency</span>
                                    <span className="text-xs font-semibold text-slate-800">{payment.currency || "---"}</span>
                                </div>
                            </div>

                            {/* Column 3 */}
                            <div className="space-y-3">
                                <div>
                                    <span className="text-[11px] text-slate-400 font-medium block mb-0.5">Payment Method</span>
                                    <div className="flex items-center gap-1.5">
                                        {payment.method ? (
                                            <>
                                                {(() => {
                                                    const { icon: IconComponent, theme } = getPaymentIcon(payment.method);
                                                    return (
                                                        <div className={`shrink-0 flex items-center justify-center rounded-md ${theme}`}>
                                                            <IconComponent className="w-3 h-3" />
                                                        </div>
                                                    );
                                                })()}
                                                <span className="text-xs font-semibold text-slate-800 truncate">
                                                    {payment.method} • {payment.methodDetail}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-xs font-semibold text-slate-400">---</span>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <span className="text-[11px] text-slate-400 font-medium block mb-0.5">Transaction ID</span>
                                    <span className="text-[11px] font-semibold text-slate-800 break-all">{payment.transactionId || "---"}</span>
                                </div>
                                <div>
                                    <span className="text-[11px] text-slate-400 font-medium block mb-0.5">Gateway</span>
                                    <span className="text-xs font-semibold text-slate-800">{payment.gateway || "---"}</span>
                                </div>
                            </div>

                            {/* Column 4 */}
                            <div className="space-y-3">
                                <div>
                                    <span className="text-[11px] text-slate-400 font-medium block mb-0.5">Gateway Reference</span>
                                    <span className="text-[11px] font-semibold text-slate-800 break-all">{payment.gatewayReference || "---"}</span>
                                </div>
                                <div>
                                    <span className="text-[11px] text-slate-400 font-medium block mb-0.5">Authorization Code</span>
                                    <span className="text-xs font-semibold text-slate-800">{payment.authorizationCode || "---"}</span>
                                </div>
                                <div>
                                    <span className="text-[11px] text-slate-400 font-medium block mb-0.5">Capture ID</span>
                                    <span className="text-[11px] font-semibold text-slate-800 break-all">{payment.captureId || "---"}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2nd card - Buyer Information */}
                    <div className="w-full bg-white rounded-xl border border-slate-200 p-4 shadow-sm">

                        {/* Header */}
                        <div className="flex items-center justify-between gap-3">

                            {/* Buyer Profile */}
                            <div className="flex items-center gap-3 min-w-0">
                                <img
                                    src={payment.buyerAvatar || payment.avatarUrl}
                                    alt="Buyer Avatar"
                                    className="w-11 h-11 rounded-full object-cover border border-slate-200 shrink-0"
                                />

                                <div className="min-w-0">
                                    <div className="flex items-center gap-1.5">
                                        <h4 className="text-sm font-bold text-slate-900 truncate">
                                            {payment.buyerName || payment.name || "---"}
                                        </h4>

                                        {payment.buyerStatus && (
                                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-600 text-[10px] font-semibold shrink-0">
                                                ✓ {payment.buyerStatus}
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-[11px] text-slate-500 mt-0.5">
                                        ID:
                                        <span className="font-semibold text-slate-700 ml-1">
                                            {payment.buyerId || "---"}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {/* View Profile */}
                            <button
                                onClick={() => console.log("View profile", payment.buyerId)}
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#D97706] hover:text-[#B45F04] bg-amber-50 hover:bg-amber-100 px-2.5 py-2 rounded-lg transition-colors shrink-0"
                            >
                                <span>View Profile</span>
                                <span>→</span>
                            </button>
                        </div>


                        {/* Contact Information */}
                        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">

                            {/* Email */}
                            <div className="flex items-center gap-2 min-w-0">
                                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />

                                <span className="text-[10px] text-slate-400 shrink-0">
                                    Email
                                </span>

                                <span
                                    className="text-[11px] font-medium text-slate-700 truncate"
                                    title={payment.buyerEmail || "---"}
                                >
                                    {payment.buyerEmail || "---"}
                                </span>
                            </div>

                            {/* Phone */}
                            <div className="flex items-center gap-2 min-w-0">
                                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />

                                <span className="text-[10px] text-slate-400 shrink-0">
                                    Phone
                                </span>

                                <span className="text-[11px] font-medium text-slate-700 truncate">
                                    {payment.buyerPhone || "---"}
                                </span>
                            </div>

                        </div>
                    </div>

                    {/* 3rd card */}
                    <div className="w-full bg-white rounded-xl border border-slate-100 p-4 md:p-5 shadow-sm">
                        <h3 className="font-bold text-slate-900 text-sm md:text-base mb-4">
                            3. Auction & Vehicle Information
                        </h3>

                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="flex items-start sm:items-center gap-4">
                                <img
                                    src={payment.imageUrl}
                                    alt="Vehicle"
                                    className="w-24 h-20 sm:w-28 sm:h-20 object-cover rounded-lg border border-slate-100 shrink-0"
                                />

                                <div className="space-y-1.5">
                                    <h4 className="font-bold text-slate-900 text-sm md:text-base">
                                        {payment.vehicleName || "--"}
                                    </h4>

                                    <div className="grid grid-cols-1 gap-y-2 text-xs">
                                        <div className='flex gap-2'>
                                            <span className="text-slate-400 font-medium">Auction ID</span>
                                            <span className="text-slate-700 font-semibold">{payment.auctionId || "---"}</span>
                                        </div>
                                        <div className='flex gap-2'>
                                            <span className="text-slate-400 font-medium">Invoice ID</span>
                                            <span className="text-slate-700 font-semibold">{payment.invoiceId || "---"}</span>
                                        </div>
                                        <div className='flex gap-2'>
                                            <span className="text-slate-400 font-medium">Lot Number</span>
                                            <span className="text-slate-700 font-semibold">{payment.lotNumber || "LOT-1123"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row lg:flex-col sm:items-center lg:items-end justify-between gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                                <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-left lg:text-right">
                                    <div>
                                        <span className="text-[11px] text-slate-400 font-medium block">Winning Bid Amount</span>
                                        <span className="text-sm font-bold text-slate-900">{payment.winningBidAmount || payment.amount || "$45,000"}</span>
                                    </div>
                                    <div>
                                        <span className="text-[11px] text-slate-400 font-medium block">Auction Completed</span>
                                        <span className="text-xs font-semibold text-slate-800">{payment.auctionCompletedDate || payment.date || "Jun 19, 2024"}</span>
                                    </div>
                                </div>

                                <div>
                                    <button
                                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D97706] hover:text-[#B45F04] transition-colors bg-amber-50 hover:bg-amber-100/70 px-3.5 py-2 rounded-lg">
                                        <span>View Auction</span>
                                        <span className="text-sm">→</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 4th / 5th card */}
                    <div className='flex flex-col md:flex md:flex-row gap-5'>
                        <div className="w-full bg-white rounded-xl border border-slate-100 p-4 md:p-5 shadow-sm">
                            <h3 className="font-bold text-slate-900 text-sm md:text-base mb-4">
                                4. Payment Breakdown
                            </h3>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-100 text-xs font-bold text-slate-900">
                                            <th className="py-2.5 font-semibold">Description</th>
                                            <th className="py-2.5 font-semibold text-right">Amount (USD)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                                        <tr>
                                            <td className="py-3 text-slate-800 font-medium">Winning Bid</td>
                                            <td className="py-3 text-slate-900 font-semibold text-right">{payment.paymentBreakdown?.winningBid || "$45,000"}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 text-slate-800 font-medium">
                                                Buyer Fee ({payment.paymentBreakdown?.buyerFeePercentage || "1%"})
                                            </td>
                                            <td className="py-3 text-slate-900 font-semibold text-right">{payment.paymentBreakdown?.buyerFee || "$400"}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 text-slate-800 font-medium">Payment Processing Fee</td>
                                            <td className="py-3 text-slate-900 font-semibold text-right">{payment.paymentBreakdown?.processingFee || "$100"}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 text-slate-800 font-medium">
                                                Tax ({payment.paymentBreakdown?.taxPercentage || "0%"})
                                            </td>
                                            <td className="py-3 text-slate-900 font-semibold text-right">{payment.paymentBreakdown?.tax || "$0"}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100">
                                <span className="font-bold text-slate-900 text-sm sm:text-base">Total Paid</span>
                                <span className={`font-bold text-base sm:text-lg 
                                    ${payment.status === "Failed" ? "text-red-600" : "text-green-600"}`}>{payment.paymentBreakdown?.totalPaid || payment.amount || "$45,500"}</span>
                            </div>
                        </div>

                        {/* 5th card */}
                        <div className="w-full bg-white rounded-xl border border-slate-100 p-4 md:p-5 shadow-sm">
                            <h3 className="font-bold text-slate-900 text-sm md:text-base mb-4">
                                5. Transaction Timeline
                            </h3>

                            <div className="space-y-0">
                                {(TIMELINE_TEMPLATES[payment.status]?.(payment) || []).map((item, idx, arr) => (
                                    <div
                                        key={idx}
                                        className="flex gap-3 relative">
                                        <div className="flex flex-col items-center">
                                            <TimelineIcon state={item.state} />
                                            {idx !== arr.length - 1 && (
                                                <div className="w-px flex-1 bg-slate-200 my-1" />
                                            )}
                                        </div>
                                        <div className="pb-5">
                                            <p className={`text-[12px] font-semibold ${item.state === "failed" ? "text-red-600" : "text-slate-900"}`}>
                                                {item.step}
                                            </p>
                                            {item.date && (
                                                <p className="text-xs text-slate-400 mt-0.5">{item.date} {item.time}</p>
                                            )}
                                            <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 6th / 7th card */}
                    <div className='flex flex-col md:flex md:flex-row gap-5'>
                        <div className="w-full bg-white rounded-xl border border-slate-100 p-4 md:p-5 shadow-sm">
                            <h3 className="font-bold text-slate-900 text-sm md:text-base mb-4">
                                6. Payment Gateway Details
                            </h3>

                            {payment.status === "Refunded" ? (
                                <div className="space-y-2.5 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Refund Reference</span>
                                        <span className="font-semibold text-slate-800">{payment.refundReference || '---'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Refund Date & Time</span>
                                        <span className="font-semibold text-slate-800">{payment.refundCompletedDate} {payment.refundCompletedTime}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Refunded Amount</span>
                                        <span className="font-semibold text-slate-800">{payment.refundedAmount || '---'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Refund Method</span>
                                        <span className="font-semibold text-slate-800">{payment.method} •••• {payment.cardLast4 || ''}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Refund Status</span>
                                        <span className="font-semibold text-green-600">{payment.status}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Refund Reason</span>
                                        <span className="font-semibold text-slate-800">{payment.refundReason || '---'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Notes</span>
                                        <span className="font-semibold text-slate-800">{payment.refundNotes || '---'}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2.5 text-sm">
                                    <div className="flex justify-between"><span className="text-slate-500">Gateway</span><span className="font-semibold text-slate-800">{payment.gateway || payment.method}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-500">Transaction Reference</span><span className="font-semibold text-slate-800">{payment.transactionId || '---'}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-500">Payment Method</span><span className="font-semibold text-slate-800">{payment.methodDetail || payment.payPalEmail || '---'}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-500">Account/Card Holder</span><span className="font-semibold text-slate-800">{payment.initiatedBy || '---'}</span></div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Payment Status</span>
                                        <span className={`font-semibold ${payment.status === "Failed" ? "text-red-600" : payment.status === "Pending" ? "text-orange-500" : "text-slate-800"}`}>{payment.status}</span>
                                    </div>
                                    {payment.status === "Failed" && (
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Failure Reason</span>
                                            <span className="font-semibold text-red-600">{payment.failureReason || 'Not Applicable'}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between"><span className="text-slate-500">Processing Fee</span><span className="font-semibold text-slate-800">{payment.processingFee || '---'}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-500">Captured Amount</span><span className="font-semibold text-slate-800">{payment.capturedAmount || '---'}</span></div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* right side */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">

                    {/* summary card */}
                    <div className="w-full bg-white rounded-xl border border-slate-100 p-4 md:p-5 shadow-sm">
                        <h3 className="font-bold text-slate-900 text-sm md:text-base mb-6">
                            Payment Summary
                        </h3>

                        <div className="flex flex-col items-center text-center mb-5">
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${SUMMARY_ICON_CONFIG[payment.status]?.bg}`}>
                                {(() => {
                                    const { Icon, iconColor } = SUMMARY_ICON_CONFIG[payment.status] || {};
                                    return Icon ? <Icon size={28} className={iconColor} /> : null;
                                })()}
                            </div>
                            <p className={`text-sm font-semibold ${STATUS_TEXT_COLOR[payment.status]}`}>{payment.status}</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">{payment.amount}</p>
                            <p className="text-xs text-slate-400">Total Amount</p>
                        </div>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between"><span className="text-slate-500">Payment Method</span><span className="font-semibold text-slate-800">{payment.method} {payment.cardLast4 ? `•••• ${payment.cardLast4}` : ''}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">Payment Date</span><span className="font-semibold text-slate-800">{payment.date} {payment.time}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">Payment Type</span><span className="font-semibold text-slate-800">{payment.paymentType || '---'}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">Gateway</span><span className="font-semibold text-slate-800">{payment.gateway || payment.method}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">Transaction ID</span><span className="font-semibold text-slate-800">{payment.status === "Pending" ? "—" : (payment.transactionId || '---')}</span></div>

                            {payment.status === "Refunded" && (
                                <>
                                    <div className="flex justify-between"><span className="text-slate-500">Refund Date</span><span className="font-semibold text-slate-800">{payment.refundCompletedDate} {payment.refundCompletedTime}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-500">Refunded Amount</span><span className="font-semibold text-slate-800">{payment.refundedAmount || '---'}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-500">Refund Reference</span><span className="font-semibold text-slate-800">{payment.refundReference || '---'}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-500">Refund Reason</span><span className="font-semibold text-slate-800">{payment.refundReason || '---'}</span></div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* relted doc */}
                    <div className="w-full bg-white rounded-xl border border-slate-200 p-4 md:p-5 shadow-sm">
                        <h3 className="font-bold text-slate-900 text-sm md:text-base mb-4">
                            Related Documents
                        </h3>

                        <div className="flex flex-col gap-2.5">
                            {[
                                {
                                    title: "Invoice",
                                    size: "PDF • 98 KB",
                                    onClick: () => console.log("Download Invoice"),
                                },
                                {
                                    title: "Auction Agreement",
                                    size: "PDF • 156 KB",
                                    onClick: () => console.log("Download Agreement"),
                                },
                                {
                                    title: "Payment Receipt",
                                    size: "PDF • 102 KB",
                                    onClick: () => console.log("Download Receipt"),
                                },
                                {
                                    title: "Refund Receipt",
                                    size: "PDF • 97 KB",
                                    onClick: () => console.log("Download Refund Receipt"),
                                },
                            ].map((doc, index) => (
                                <div
                                    key={index}
                                    className="group flex items-center justify-between gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-200 transition-all cursor-pointer hover:shadow-md shadow-sm">
                                    <div className="flex items-center gap-3 min-w-0 ">
                                        <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                                            <FileText className="w-4 h-4 text-red-500" />
                                        </div>

                                        <div className="min-w-0">
                                            <h4 className="text-xs font-semibold text-slate-800 truncate">
                                                {doc.title}
                                            </h4>

                                            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                                                {doc.size}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={doc.onClick}
                                        title={`Download ${doc.title}`}
                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#D97706] hover:bg-amber-50 transition-all shrink-0"
                                    >
                                        <Download className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <QuickActionsCard
                        actions={[
                            { label: "Download Receipt", icon: Download, onClick: () => { } },
                            { label: "Download Invoice", icon: FileText, onClick: () => { } },
                            { label: "Initiate Refund", icon: RotateCcw, onClick: () => { } },
                            { label: "Contact Buyer", icon: MessageSquare, onClick: () => { } },
                            { label: "View Auction", icon: Eye, onClick: () => { } },
                        ]}
                    />

                    <ContactSupport />
                </div>
            </div>
        </div>
    )
}

export default AllPaymentsDetail;
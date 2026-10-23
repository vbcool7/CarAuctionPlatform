
import React, { useState } from 'react';
import { Calendar, Check, CheckCircle, Clock, DollarSign, Download, RotateCcw, XCircle, X, ArrowLeftRight, CreditCard, Eye, Landmark, MoreHorizontal, MoreVertical } from 'lucide-react';
import { FaPaypal, FaUniversity, FaExchangeAlt, FaWallet } from "react-icons/fa";
import { SiWise } from "react-icons/si";
import { allTransactions } from '../../Data';

import SearchBar from '../../SharedComponents/SearchBar';
import FilterDropdown from '../../SharedComponents/FilterDropdown';
import SummaryDonutCard from '../../SharedComponents/SummaryDonutCard';

const allTransactionStats = [
    {
        title: "Total Transactions",
        value: "1,026",
        subTitle: "↑ 18.6% from last month",
        subTextColor: "text-green-600",
        icon: DollarSign,
        theme: "bg-purple-50",
        iconColor: "text-purple-600",
    },
    {
        title: "Successful Transactions",
        value: "812",
        subTitle: "79.2% of total",
        subTextColor: "text-slate-500",
        icon: CheckCircle,
        theme: "bg-green-50",
        iconColor: "text-green-600",
    },
    {
        title: "Pending Transactions",
        value: "124",
        subTitle: "12.1% of total",
        subTextColor: "text-slate-500",
        icon: Clock,
        theme: "bg-amber-50",
        iconColor: "text-amber-500",
    },
    {
        title: "Failed Transactions",
        value: "58",
        subTitle: "5.7% of total",
        subTextColor: "text-slate-500",
        icon: XCircle,
        theme: "bg-red-50",
        iconColor: "text-red-500",
    },
    {
        title: "Refunded Transactions",
        value: "32",
        subTitle: "3.1% of total",
        subTextColor: "text-slate-500",
        icon: RotateCcw,
        theme: "bg-blue-50",
        iconColor: "text-blue-600",
    },
];

const transactionMethods = [
    { id: 1, name: "Bank Transfer", amount: "$214,680.00", percentage: 60, icon: FaUniversity, iconColor: "text-purple-600", theme: "bg-purple-50 text-purple-600", color: "bg-purple-600" },
    { id: 2, name: "PayPal", amount: "$76,540.00", percentage: 21, icon: FaPaypal, iconColor: "text-blue-600", theme: "bg-blue-50 text-blue-600", color: "bg-blue-600" },
    { id: 3, name: "Wire Transfer", amount: "$41,250.00", percentage: 11, icon: FaExchangeAlt, iconColor: "text-orange-600", theme: "bg-orange-50 text-orange-600", color: "bg-orange-500" },
    { id: 4, name: "Wise", amount: "$13,210.50", percentage: 3, icon: SiWise, iconColor: "text-emerald-600", theme: "bg-emerald-50 text-emerald-600", color: "bg-emerald-500" },
    { id: 5, name: "Other", amount: "$7,000.00", percentage: 2, icon: FaWallet, iconColor: "text-slate-600", theme: "bg-slate-50 text-slate-600", color: "bg-slate-400" },
];

const recentActivity = [
    {
        title: "Payout completed",
        desc: "TXN-2024-001026 to Michael Johnson",
        amount: "$45,500.00",
        time: "10:30 AM",
        icon: Check,
        iconBg: "bg-green-600 text-white"
    },
    {
        title: "Payout pending",
        desc: "TXN-2024-001024 to David Brown",
        amount: "$18,200.00",
        time: "11:20 AM",
        icon: Clock,
        iconBg: "bg-amber-500 text-white"
    },
    {
        title: "Payout failed",
        desc: "TXN-2024-001020 to Robert Taylor",
        amount: "$9,750.00",
        time: "12:10 PM",
        icon: X,
        iconBg: "bg-red-500 text-white"
    },
    {
        title: "Refund processed",
        desc: "TXN-2024-001019 to Linda Martinez",
        amount: "$500.00",
        time: "11:05 AM",
        icon: RotateCcw,
        iconBg: "bg-purple-600 text-white"
    },
];

// tabs
const tabs = [
    { id: 'all', label: 'All Transactions' },
    { id: 'successful', label: 'Successful' },
    { id: 'pending', label: 'Pending' },
    { id: 'failed', label: 'Failed' },
    { id: 'refunded', label: 'Refunded' },
];

function Transactions({ setCurrentPage, setSelectedTransactionId }) {

    const [activeTab, setActiveTab] = useState("all");
    const [selectedTransactionType, setSelectedTransactionType] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedMethod, setSelectedMethod] = useState("");

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between pb-6">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3D]">
                        Transactions
                    </h1>

                    <div className="mt-2 flex items-center text-[11px] md:text-[13px]">
                        <span
                            onClick={() => setCurrentPage("dashboard")}
                            className="cursor-pointer text-slate-500 hover:text-[#D97706] transition-colors">
                            Dashboard
                        </span>

                        <span className="mx-2 text-slate-300">/</span>

                        <span className="text-slate-500">Payment Management</span>

                        <span className="mx-2 text-slate-300">/</span>
                        <span className="font-medium text-[#D97706]">Transactions</span>
                    </div>
                </div>

                {/* btns */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <button className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-transparent p-2 font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-[#D97706] hover:text-[#D97706] hover:bg-amber-50">
                        <Download size={16} />
                        <span className="text-[13px]">Export Report</span>
                    </button>

                    <button className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-transparent p-2 font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-[#D97706] hover:text-[#D97706] hover:bg-amber-50">
                        <Download size={16} />
                        <span className="text-[13px]">Download Transactions</span>
                    </button>

                    <button
                        className="flex items-center justify-center gap-1.5 rounded-lg bg-[#D97706] px-4 py-2 font-medium text-white shadow-md shadow-amber-500/20 transition-all duration-200 hover:bg-[#B45F04] hover:scale-[1.02]">
                        <span className="text-sm">More Actions</span>
                    </button>
                </div>
            </div>

            {/* stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-5 gap-4">
                {allTransactionStats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className="group relative bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-300 flex items-center justify-between"
                        >
                            <div className="min-w-0 pr-2">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1 truncate">
                                    {stat.title}
                                </span>
                                <h4 className="text-xl font-bold text-slate-900 tracking-tight truncate">
                                    {stat.value}
                                </h4>
                                <span className={`text-[11px] font-medium mt-1.5 block truncate ${stat.subTextColor}`}>
                                    {stat.subTitle}
                                </span>
                            </div>

                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-sm ${stat.theme} ${stat.iconColor}`}>
                                <Icon className="w-5.5 h-5.5" />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Search / Filter */}
            <div className="my-6 bg-white border border-slate-200 rounded-xl p-4 space-y-4">

                <div className="flex flex-wrap xl:flex-nowrap items-center gap-3">

                    {/* Search */}
                    <div className="flex-1 sm:w-70">
                        <SearchBar />
                    </div>

                    {/* all payment types */}
                    <div className="w-full sm:w-47">
                        <FilterDropdown
                            label="All Transaction Types"
                            options={[
                                { label: "Type A", value: "type-a" },
                                { label: "Type B", value: "type-b" }
                            ]}
                            value={selectedTransactionType}
                            onChange={setSelectedTransactionType}
                        />
                    </div>

                    {/* status */}
                    <div className="w-full sm:w-42">
                        <FilterDropdown
                            label="All Status"
                            options={[
                                { label: "Completed", value: "completed" },
                                { label: "Pending", value: "pending" },
                                { label: "Failed", value: "failed" }
                            ]}
                            value={selectedStatus}
                            onChange={setSelectedStatus}
                        />
                    </div>

                    {/* methods */}
                    <div className="w-full sm:w-42">
                        <FilterDropdown
                            label="All Methods"
                            options={[
                                { label: "Bank Transfer", value: "bank-transfer" },
                                { label: "PayPal", value: "paypal" }
                            ]}
                            value={selectedMethod}
                            onChange={setSelectedMethod}
                        />
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">

                    {/* Date Range */}
                    <div className="w-full sm:w-auto flex items-center gap-2 h-9.5 px-3 md:px-4 border border-slate-300 rounded-lg bg-white text-[13px] md:text-sm text-slate-600">
                        <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                        <span className="truncate">
                            May 01, 2024 - May 31, 2024
                        </span>
                    </div>

                    {/* Clear Filters */}
                    <button className="text-xs md:text-sm font-medium text-[#D97706] hover:underline">
                        Clear Filters
                    </button>
                </div>

            </div>

            {/* main section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 pb-6 gap-6">

                {/* -------------------------- LEFT -------------------------- */}
                <div className="lg:col-span-2 space-y-6">

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

                {/* -------------------------- RIGHT -------------------------- */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">

                    <SummaryDonutCard
                        title="Transaction Overview"
                        centerValue="1,026"
                        centerLabel="Total"
                        showPercentage={true}
                        segments={[
                            { name: 'Successful', value: 812, color: '#00B050' },
                            { name: 'Pending', value: 124, color: '#FF9900' },
                            { name: 'Failed', value: 58, color: '#FF3B30' },
                            { name: 'Refunded', value: 32, color: '#8B5CF6' },
                        ]}
                    />

                    {/* trans methods */}
                    <div className="w-full bg-white rounded-xl border border-slate-100 p-4 md:p-5 shadow-sm">
                        <h3 className="font-bold text-slate-900 text-[13px] md:text-sm mb-5">
                            Transaction Methods
                        </h3>

                        <div className="space-y-4">
                            {transactionMethods.map((payout, index) => {
                                const Icon = payout.icon;
                                return (
                                    <div key={index} className="w-full">

                                        {/* Top Row */}
                                        <div className="flex items-center gap-2 sm:gap-3">

                                            {/* Icon */}
                                            <div
                                                className={`w-7 h-7 sm:w-8 sm:h-8 shrink-0 flex items-center justify-center rounded-lg ${payout.theme}`}>
                                                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                            </div>

                                            {/* Name */}
                                            <span className="flex-1 min-w-0 text-[11px] sm:text-xs font-medium text-slate-700 truncate">
                                                {payout.name}
                                            </span>

                                            {/* Amount */}
                                            <span className="text-[10px] sm:text-xs font-bold text-slate-800 whitespace-nowrap">
                                                {payout.amount}
                                            </span>

                                            {/* Percentage */}
                                            <span className="w-8 sm:w-10 text-right text-[10px] sm:text-xs font-semibold text-slate-600">
                                                {payout.percentage}%
                                            </span>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="ml-9 sm:ml-11 mt-1.5 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${payout.color || "bg-[#D97706]"}`}
                                                style={{
                                                    width: `${payout.percentage}%`,
                                                }}
                                            />
                                        </div>

                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* recent activity */}
                    <div className="w-full bg-white rounded-xl border border-slate-100 p-4 md:p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-900 text-[13px] md:text-sm">
                                Recent Activity
                            </h3>

                            <button className="text-[10px] sm:text-[11px] font-semibold text-[#D97706] transition-colors">
                                View All
                            </button>
                        </div>

                        {/* Activity List */}
                        <div className="divide-y divide-slate-100">
                            {recentActivity.map((activity, idx) => {
                                const Icon = activity.icon;
                                return (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-2.5 sm:gap-3 py-3 first:pt-0 last:pb-0" >
                                        {/* Status Icon */}
                                        <div
                                            className={`w-5 h-5 shrink-0 rounded-full flex items-center justify-center ${activity.iconBg}`} >
                                            <Icon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                                        </div>

                                        {/* Activity Details */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-[10px] sm:text-[11px] md:text-xs font-bold text-slate-900 leading-tight">
                                                {activity.title}
                                            </h4>

                                            <p className="text-[9px] sm:text-[10px] md:text-[11px] text-slate-500 mt-0.5 truncate">
                                                {activity.desc}
                                            </p>
                                        </div>

                                        {/* Amount & Time */}
                                        <div className="shrink-0 text-right">
                                            <p className="text-[9px] sm:text-[10px] md:text-[11px] font-bold text-[#0B1E3D]">
                                                {activity.amount}
                                            </p>

                                            <p className="text-[8px] sm:text-[9px] md:text-[10px] text-slate-500 mt-0.5">
                                                {activity.time}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Transactions
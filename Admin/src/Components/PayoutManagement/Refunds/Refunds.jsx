
import React, { useState } from 'react';
import { Download, Wallet, CheckCircle, Clock, XCircle, RotateCcw, Calendar, Check, X, Circle, FilePlus, ClipboardCheck } from 'lucide-react';
import { FaPaypal, FaUniversity, FaExchangeAlt, FaWallet } from "react-icons/fa";
import { SiWise } from "react-icons/si";
import FilterDropdown from '../../SharedComponents/FilterDropdown';
import SearchBar from '../../SharedComponents/SearchBar';
import SummaryDonutCard from '../../SharedComponents/SummaryDonutCard';
import RefundsList from './RefundsList';

const allRefunds = [
    {
        title: "Total Refunds",
        value: "$68,450.30",
        subTitle: "↑ 15.7% from last month",
        subTextColor: "text-green-600",
        icon: Wallet,
        theme: "bg-purple-50",
        iconColor: "text-purple-600",
    },
    {
        title: "Completed Refunds",
        value: "$53,210.50",
        subTitle: "77.7% of total",
        subTextColor: "text-slate-500",
        icon: CheckCircle,
        theme: "bg-green-50",
        iconColor: "text-green-600",
    },
    {
        title: "Pending Refunds",
        value: "$9,750.00",
        subTitle: "14.2% of total",
        subTextColor: "text-slate-500",
        icon: Clock,
        theme: "bg-amber-50",
        iconColor: "text-amber-500",
    },
    {
        title: "Failed Refunds",
        value: "$3,250.80",
        subTitle: "4.7% of total",
        subTextColor: "text-slate-500",
        icon: XCircle,
        theme: "bg-red-50",
        iconColor: "text-red-500",
    },
    {
        title: "Cancelled Refunds",
        value: "$2,239.00",
        subTitle: "3.4% of total",
        subTextColor: "text-slate-500",
        icon: RotateCcw,
        theme: "bg-blue-50",
        iconColor: "text-blue-600",
    },
];

const refundMethods = [
    { id: 1, name: "Bank Transfer", amount: "$214,680.00", percentage: 60, icon: FaUniversity, iconColor: "text-purple-600", theme: "bg-purple-50 text-purple-600", color: "bg-purple-600" },
    { id: 2, name: "PayPal", amount: "$76,540.00", percentage: 21, icon: FaPaypal, iconColor: "text-blue-600", theme: "bg-blue-50 text-blue-600", color: "bg-blue-600" },
    { id: 3, name: "Wire Transfer", amount: "$41,250.00", percentage: 11, icon: FaExchangeAlt, iconColor: "text-orange-600", theme: "bg-orange-50 text-orange-600", color: "bg-orange-500" },
    { id: 4, name: "Wise", amount: "$13,210.50", percentage: 3, icon: SiWise, iconColor: "text-emerald-600", theme: "bg-emerald-50 text-emerald-600", color: "bg-emerald-500" },
    { id: 5, name: "Other", amount: "$7,000.00", percentage: 2, icon: FaWallet, iconColor: "text-slate-600", theme: "bg-slate-50 text-slate-600", color: "bg-slate-400" },
];

const recentActivity = [
    {
        title: "Refund completed",
        desc: "REFUND-2024-0186 to David Brown",
        amount: "$18,200.00",
        time: "11:20 AM",
        icon: Check,
        iconBg: "bg-green-600 text-white"
    },
    {
        title: "Refund pending",
        desc: "REFUND-2024-0183",
        amount: "$22,275.00",
        time: "02:30 PM",
        icon: Clock,
        iconBg: "bg-amber-500 text-white"
    },
    {
        title: "Refund failed",
        desc: "REFUND-2024-0181 to James Willison",
        amount: "$16,800.00",
        time: "12:25 PM",
        icon: X,
        iconBg: "bg-red-500 text-white"
    },
    {
        title: "Refund cancelled",
        desc: "REFUND-2024-0180",
        amount: "$500.00",
        time: "11:35 AM",
        icon: Circle,
        iconBg: "bg-slate-500 text-white"
    },
];

function Refunds({ setCurrentPage, setSelectedRefundId }) {

    const [selectedRefundType, setSelectedRefundType] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedMethod, setSelectedMethod] = useState("");

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between pb-6">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3D]">
                        Refunds
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
                        <span className="font-medium text-[#D97706]">Refunds</span>
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
                        <span className="text-[13px]">Download Refunds</span>
                    </button>

                    <button
                        className="flex items-center justify-center gap-1.5 rounded-lg bg-[#D97706] px-4 py-2 font-medium text-white shadow-md shadow-amber-500/20 transition-all duration-200 hover:bg-[#B45F04] hover:scale-[1.02]">
                        <span className="text-sm">More Actions</span>
                    </button>
                </div>
            </div>

            {/* stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-5 gap-4">
                {allRefunds.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className="bg-white rounded-xl border border-slate-100 p-4 shadow-md flex items-center justify-between"
                        >
                            <div>
                                <span className="text-xs font-semibold text-slate-500 block mb-0.5">
                                    {stat.title}
                                </span>
                                <h4 className="py-1 text-base font-bold text-slate-900 tracking-tight">
                                    {stat.value}
                                </h4>
                                <span className={`text-[11px] font-medium mt-1 block ${stat.subTextColor}`}>
                                    {stat.subTitle}
                                </span>
                            </div>
                            <div className={`w-11.5 h-11.5 rounded-xl flex items-center justify-center shrink-0 ${stat.theme} ${stat.iconColor}`}>
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
                    <div className="flex-1 sm:w-75">
                        <SearchBar />
                    </div>

                    {/* all payment types */}
                    <div className="w-full sm:w-42">
                        <FilterDropdown
                            label="All Refund Types"
                            options={[
                                { label: "Type A", value: "type-a" },
                                { label: "Type B", value: "type-b" }
                            ]}
                            value={selectedRefundType}
                            onChange={setSelectedRefundType}
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

                {/* left side - section */}
                <div className="lg:col-span-2 space-y-6">
                    <RefundsList setCurrentPage={setCurrentPage} setSelectedRefundId={setSelectedRefundId} />
                </div>

                {/* right side - section */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">

                    <SummaryDonutCard
                        title="Refund Overview"
                        centerValue="$68,450.30"
                        centerLabel="Total Refunds"
                        showPercentage={true}
                        prefix='$'
                        segments={[
                            { name: 'Completed', value: 53210.50, color: '#00B050' },
                            { name: 'Pending', value: 9750.00, color: '#FF9900' },
                            { name: 'Failed', value: 3250.80, color: '#FF3B30' },
                            { name: 'Cancelled', value: 2239.00, color: '#6B7280' },
                        ]}
                    />

                    {/* refund methods */}
                    <div className="w-full bg-white rounded-xl border border-slate-100 p-4 md:p-5 shadow-sm">
                        <h3 className="font-bold text-slate-900 text-[13px] md:text-sm mb-5">
                            Refund Methods
                        </h3>

                        <div className="space-y-4">
                            {refundMethods.map((payout, index) => {
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

                    {/* quick action */}
                    <div className="w-full bg-white rounded-xl border border-slate-100 p-4 md:p-5 shadow-sm">
                        <h3 className="font-bold text-slate-900 text-sm md:text-base mb-4">
                            Quick Actions
                        </h3>

                        {/* Actions Grid */}
                        <div className="grid grid-cols-1 gap-3">
                            <button
                                onClick={() => console.log("Initiate Refund")}
                                className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50 transition-all duration-200 text-left group"
                            >
                                <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
                                    <FilePlus className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="block font-bold text-slate-900 text-xs sm:text-sm">
                                        Initiate Refund
                                    </span>
                                </div>
                            </button>

                            <button
                                onClick={() => console.log("Approve Refunds")}
                                className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50 transition-all duration-200 text-left group"
                            >
                                <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600 shrink-0">
                                    <ClipboardCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="block font-bold text-slate-900 text-xs sm:text-sm">
                                        Approve Refunds
                                    </span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Refunds;

import React, { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { payoutsData } from '../SellerSharedComponents/SellerData';
import { Building2, Calendar, DollarSign, Download, Eye, Hourglass, Landmark, MoreVertical, PieChart, Settings, Wallet } from 'lucide-react';
import SearchBar from '../SellerSharedComponents/SearchBar';
import FilterDropdown from '../SellerSharedComponents/FilterDropdown';

const statsData = [
    {
        id: "total-earnings",
        title: "Total Earnings",
        value: "$48,750",
        subtitle: "All Time",
        subtitleColor: "text-green-600",
        icon: Wallet,
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
    },
    {
        id: "total-payouts",
        title: "Total Payouts",
        value: "$42,500",
        subtitle: "All Time",
        subtitleColor: "text-blue-600",
        icon: DollarSign,
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
    },
    {
        id: "pending-payout",
        title: "Pending Payout",
        value: "$6,250",
        subtitle: "Will be paid soon",
        subtitleColor: "text-amber-500",
        icon: Hourglass,
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
    },
    {
        id: "payouts-this-year",
        title: "Payouts This Year",
        value: "$28,400",
        subtitle: "2024",
        subtitleColor: "text-amber-600",
        icon: Calendar,
        iconBg: "bg-amber-100",
        iconColor: "text-amber-600",
    },
    {
        id: "available-balance",
        title: "Available Balance",
        value: "$6,250",
        subtitle: "Available for payout",
        subtitleColor: "text-green-600",
        icon: PieChart,
        iconBg: "bg-rose-100",
        iconColor: "text-rose-600",
        extraClass: "sm:col-span-2 lg:col-span-1",
    },
];

const statusOptions = [
    { value: "", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "sold", label: "Sold" },
    { value: "pending", label: "Pending Approval" },
    { value: "draft", label: "Draft" },
];

function Payouts({ setSelectedPayoutId, setCurrentPage }) {

    const [search, setSearch] = useState();
    const [status, setStatus] = useState('');
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    return (
        <div className='pb-6 space-y-6'>

            {/* header */}
            <div className='w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0'>
                <div className='flex flex-col'>
                    <h1 className='text-xl md:text-2xl font-bold'>Payouts</h1>
                    <p className='text-xs md:text-sm text-gray-600 p-px'>
                        Track your earning and payout history.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2.5">
                    <button
                        className="group inline-flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50/80 hover:border-amber-500 hover:text-amber-600 active:scale-[0.98] transition-all duration-200"
                    >
                        <Settings className="h-4 w-4 text-slate-500 group-hover:text-amber-600 transition-transform duration-300 group-hover:rotate-45" />
                        Payout Settings
                    </button>

                    <button
                        className="group inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm shadow-amber-600/20 hover:bg-amber-700 active:scale-[0.98] transition-all duration-200"
                    >
                        <Download className="h-4 w-4 text-white/90 transition-transform duration-300 group-hover:-translate-y-0.5" />
                        Export Report
                    </button>
                </div>
            </div>

            {/* stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 my-6">
                {statsData.map((stat) => {
                    const IconComponent = stat.icon;

                    return (
                        <div
                            key={stat.id}
                            className="bg-white p-4 rounded-2xl border border-slate-100 shadow-md flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-amber-200 cursor-pointer"
                        >
                            <div
                                className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${stat.iconBg} flex items-center justify-center shrink-0 transition-transform duration-300 hover:scale-105`}
                            >
                                <IconComponent
                                    className={`w-5 h-5 md:w-6 md:h-6 ${stat.iconColor}`}
                                />
                            </div>

                            <div>
                                <p className="text-xs font-medium text-slate-400">
                                    {stat.title}
                                </p>

                                <h3 className="text-lg md:text-xl font-bold text-[#0B1E3D] my-1">
                                    {stat.value}
                                </h3>

                                <p className={`text-[11px] font-semibold ${stat.subtitleColor}`}>
                                    {stat.subtitle}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* filter */}
            <div className="flex flex-wrap gap-3 py-4 px-4 border border-gray-300 bg-white/80 rounded-xl">
                <div className='flex-1 min-w-50'>
                    <SearchBar value={search} onChange={setSearch} placeholder="Search by payout ID..." />
                </div>

                {/* Date Range */}
                <div className="w-full sm:w-auto relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 z-10 pointer-events-none" />

                    <DatePicker
                        selectsRange
                        startDate={startDate}
                        endDate={endDate}
                        onChange={(dates) => {
                            const [start, end] = dates;
                            setStartDate(start);
                            setEndDate(end);
                        }}
                        placeholderText="Select date range"
                        dateFormat="MMM d, yyyy"
                        className="h-10 w-57.5 pl-9 pr-3 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white outline-none focus:border-gray-400"
                    />
                </div>
                <div className='w-full sm:w-auto'>
                    <FilterDropdown label="All Status" options={statusOptions} value={status} onChange={setStatus} />
                </div>
            </div>

            {/* list */}
            <div className="overflow-x-auto border border-slate-200/80 rounded-xl shadow-xs bg-white">
                <table className="w-full text-left table-fixed">
                    <thead className="bg-white border-b border-slate-200 text-[#0B1E3D] uppercase text-[11px] font-extrabold tracking-wider">
                        <tr>
                            <th className="px-6 py-4.5 w-30">Payout ID</th>
                            <th className="px-6 py-4.5 w-35">Payout Date</th>
                            <th className="px-6 py-4.5 w-45">Earning From</th>
                            <th className="px-6 py-4.5 w-50">Payout Method</th>
                            <th className="px-6 py-4.5 w-40">Amount</th>
                            <th className="px-6 py-4.5 w-42">Status</th>
                            <th className="px-6 py-4.5 w-40">Reference ID</th>
                            <th className="px-6 py-4.5 w-42 ">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {payoutsData.map((payout) => (
                            <tr
                                key={payout.id}
                                className="border-b border-gray-100 last:border-b-0 hover:bg-slate-50/60 transition-colors text-sm text-slate-700"
                            >

                                {/* Payout ID */}
                                <td className="px-5 py-4 ">
                                    <span className="font-semibold text-slate-900">
                                        {payout.id}
                                    </span>
                                </td>

                                {/* Payout Date */}
                                <td className="px-5 py-4 ">
                                    <p className="font-medium text-slate-800">
                                        {payout.payoutDate}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        {payout.payoutTime}
                                    </p>
                                </td>

                                {/* Earning From */}
                                <td className="px-5 py-4 whitespace-nowrap">
                                    <p className="font-medium text-slate-800">
                                        {payout.earningsFrom}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        {payout.salesCount}
                                    </p>
                                </td>

                                {/* Payout Method */}
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 text-slate-600">
                                            <Landmark className="w-4 h-4" />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="font-medium text-slate-900 truncate">
                                                {payout.payoutMethod}
                                            </p>
                                            <p className="text-xs text-slate-400 mt-0.5">
                                                {payout.accountNumber}
                                            </p>
                                        </div>
                                    </div>
                                </td>

                                {/* Amount */}
                                <td className="px-5 py-4 ">
                                    <span className="font-bold text-slate-900">
                                        {payout.amount}
                                    </span>
                                </td>

                                {/* Status */}
                                <td className="px-5 py-4 ">
                                    <div>
                                        {payout.status === "Completed" ? (
                                            <span className="inline-flex px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-600 rounded-md">
                                                Completed
                                            </span>
                                        ) : (
                                            <span className="inline-flex px-2.5 py-1 text-xs font-semibold bg-amber-50 text-amber-600 rounded-md">
                                                Pending
                                            </span>
                                        )}

                                        <p className="text-xs text-slate-400 mt-1">
                                            {payout.statusSubtext}
                                        </p>
                                    </div>
                                </td>

                                {/* Reference ID */}
                                <td className="px-5 py-4 ">
                                    <span className="font-mono text-sm text-slate-600">
                                        {payout.referenceId}
                                    </span>
                                </td>

                                {/* Actions */}
                                <td className="px-5 py-4">
                                    <div className="flex items-center justify-end gap-2">

                                        <button
                                        onClick={() => {
                                            setSelectedPayoutId(payout.id)
                                            setCurrentPage('payouts-detail')
                                        }}
                                            className="inline-flex items-center gap-1.5 px-2 py-1.5 text-[12px] font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                                            View Details
                                        </button>

                                        <button
                                            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                        >
                                            <MoreVertical className="w-4 h-4" />
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

export default Payouts
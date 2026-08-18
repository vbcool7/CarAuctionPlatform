
import React, { useState } from 'react';
import { Calendar, DollarSign, Download, LineChart, Tag, TrendingUp, Wallet } from 'lucide-react';
import { salesHistoryData } from '../SellerSharedComponents/SellerData';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SearchBar from '../SellerSharedComponents/SearchBar';
import FilterDropdown from '../SellerSharedComponents/FilterDropdown';

const statsData = [
    {
        id: "total-sales",
        title: "Total Sales",
        value: "24",
        subtitle: "All Time",
        subtitleColor: "text-green-600",
        icon: TrendingUp,
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
    },
    {
        id: "total-sales-amount",
        title: "Total Sales Amount",
        value: "$118,750",
        subtitle: "All Time",
        subtitleColor: "text-purple-600",
        icon: Tag,
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
    },
    {
        id: "average-selling-price",
        title: "Average Selling Price",
        value: "$24,698",
        subtitle: "All Time",
        subtitleColor: "text-amber-500",
        icon: Wallet,
        iconBg: "bg-amber-100",
        iconColor: "text-amber-600",
    },
    {
        id: "total-commission-paid",
        title: "Total Commission Paid",
        value: "$5,687",
        subtitle: "All Time",
        subtitleColor: "text-blue-600",
        icon: DollarSign,
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
    },
    {
        id: "this-month-sales",
        title: "This Month Sales",
        value: "$12,450",
        subtitle: "May 2024",
        subtitleColor: "text-rose-500",
        icon: LineChart,
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

const paymentTypeOptions = [
    { value: "", label: "All Payment Types" },
    { value: "live-auction", label: "Live Auction" },
    { value: "fixed-price", label: "Fixed Price" },
];

function SalesHistory({ setCurrentPage, setSelectedSalesId }) {

    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [paymentType, setPaymentType] = useState('');
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    return (
        <div className='pb-6 space-y-6'>

            {/* header */}
            <div className='w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0'>
                <div className='flex flex-col'>
                    <h1 className='text-xl md:text-2xl font-bold'>Sales History</h1>
                    <p className='text-xs md:text-sm text-gray-600 p-px'>
                        Track your completed sales and auction transactions.
                    </p>
                </div>

                <button
                    className='inline-flex items-center gap-2 rounded-lg bg-[#D97706] px-3 py-2 sm:px-4 sm:py-2.5 text-sm font-semibold text-white hover:bg-[#B45309] transition-colors'>
                    <Download className='h-4 w-4' />
                    Export Report
                </button>
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
                    <SearchBar value={search} onChange={setSearch} placeholder="Search by vehicle, buyer or Invoice ID..." />
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

                <div className='w-full sm:w-auto'>
                    <FilterDropdown label="All Payment Types" options={paymentTypeOptions} value={paymentType} onChange={setPaymentType} />
                </div>
            </div>

            {/* list */}
            <div className="overflow-x-auto border border-slate-200/80 rounded-xl shadow-xs bg-white">
                <table className="w-full text-left table-fixed">
                    <thead className="bg-white border-b border-slate-200 text-[#0B1E3D] uppercase text-[11px] font-extrabold tracking-wider">
                        <tr>
                            <th className="px-6 py-4.5 w-65">Vehicle</th>
                            <th className="px-6 py-4.5 w-45">Buyer</th>
                            <th className="px-6 py-4.5 w-35">Sale Date</th>
                            <th className="px-6 py-4.5 w-30">Sale Price</th>
                            <th className="px-6 py-4.5 w-30">Commission</th>
                            <th className="px-6 py-4.5 w-40">Payout Amount</th>
                            <th className="px-6 py-4.5 w-40">Payout Date</th>
                            <th className="px-6 py-4.5 w-40">Invoice No.</th>
                            <th className="px-6 py-4.5 w-30">Status</th>
                            <th className="px-6 py-4.5 w-30">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {salesHistoryData.map((sales) => (
                            <tr
                                key={sales.id}
                                className='hover:bg-slate-50/60 transition-colors border-b border-gray-100 last:border-b-0'
                            >
                                {/* Vehicle */}
                                <td className="py-4 px-4">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={sales.vehicleImage}
                                            alt={sales.vehicle}
                                            className="w-15 h-10 object-cover rounded-lg border border-slate-200 shrink-0" />
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">{sales.vehicle}</p>
                                            <p className="text-xs text-slate-400">Stock ID: {sales.stockId}</p>
                                        </div>
                                    </div>
                                </td>

                                {/* Buyer */}
                                <td className="py-4 px-4">
                                    <p className="text-sm font-medium text-slate-900">{sales.buyerName}</p>
                                    <p className="text-xs text-slate-400">{sales.buyerEmail}</p>
                                </td>

                                {/* Sale Date & Time */}
                                <td className="py-4 px-4">
                                    <p className="text-sm text-slate-900">{sales.saleDate}</p>
                                    <p className="text-xs text-slate-400">{sales.saleTime}</p>
                                </td>

                                {/* Sale Price */}
                                <td className="py-4 px-4 text-sm font-semibold text-slate-900">
                                    ${sales.salePrice.toLocaleString()}
                                </td>

                                {/* Commission */}
                                <td className="pl-6 py-4 px-">
                                    <p className="text-sm text-slate-900">${sales.commissionAmount.toLocaleString()}</p>
                                    <p className="text-xs text-slate-400">({sales.commissionRate}%)</p>
                                </td>

                                {/* Payout Amount */}
                                <td className="py-4 px-4 text-sm font-semibold text-slate-900">
                                    {sales.payoutAmount ? `$${sales.payoutAmount.toLocaleString()}` : "—"}
                                </td>

                                {/* payout Date & Time */}
                                <td className="py-4 px-4">
                                    <p className="text-sm text-slate-900">{sales.payoutDate}</p>
                                    <p className="text-xs text-slate-400">{sales.payoutTime}</p>
                                </td>

                                {/* invoice */}
                                <td className="py-4 px-4 text-[13px] font-semibold text-slate-900">
                                    {sales.invoiceNo}
                                </td>

                                {/* status */}
                                <td className="px-6 py-4.5">
                                    <span
                                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${sales.status === 'completed'
                                                ? 'bg-green-100 text-green-700'
                                                : sales.status === 'sold'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : sales.status === 'pending'
                                                        ? 'bg-orange-100 text-orange-700'
                                                        : sales.status === 'overdue'
                                                            ? 'bg-red-100 text-red-700'
                                                            : 'bg-gray-100 text-gray-600' // cancelled
                                                }`}
                                        >
                                            {sales.status === 'sold' && 'Sold'}
                                            {sales.status === 'pending' && 'Pending'}
                                            {sales.status === 'completed' && 'Completed'}
                                            {sales.status === 'overdue' && 'Overdue'}
                                            {sales.status === 'cancelled' && 'Cancelled'}
                                        </span>
                                </td>

                                {/* Action / View Details */}
                                <td className="py-4 px-4 text-right">
                                    <button 
                                    onClick={() => {
                                        setSelectedSalesId(sales.id)
                                        setCurrentPage('sales-history-detail')
                                    }}
                                    className="px-2 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    )
}

export default SalesHistory
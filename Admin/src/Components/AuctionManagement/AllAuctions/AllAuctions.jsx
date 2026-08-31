
import React, { useState } from 'react';
import { Plus, ArrowDown, ArrowUp, Gavel, Radio, CalendarDays, CheckCircle, XCircle, CheckCircle2, PlusCircle, Eye, MoreVertical } from "lucide-react";
import FilterDropdown from '../../SharedComponents/FilterDropdown';
import SearchBar from '../../SharedComponents/SearchBar';
import SummaryDonutCard from '../../SharedComponents/SummaryDonutCard';
import { allAuctionData } from '../../Data';
import { useGetAllAuctions } from '../../../hooks/useAuction';

const allAuctionsStats = [
    {
        title: "Total Auctions",
        value: "48",
        icon: Gavel,
        theme: "text-indigo-600 bg-indigo-50",
        subTitle: "12.5% from last month",
        subTextColor: "text-green-600",
        isPositive: true
    },
    {
        title: "Live Auctions",
        value: "8",
        icon: Radio,
        theme: "text-emerald-600 bg-emerald-50",
        subTitle: "23.1% from last month",
        subTextColor: "text-green-600",
        isPositive: true
    },
    {
        title: "Upcoming Auctions",
        value: "15",
        icon: CalendarDays,
        theme: "text-purple-600 bg-purple-50",
        subTitle: "8.7% from last month",
        subTextColor: "text-green-600",
        isPositive: true
    },
    {
        title: "Completed Auctions",
        value: "20",
        icon: CheckCircle,
        theme: "text-emerald-600 bg-emerald-50",
        subTitle: "15.3% from last month",
        subTextColor: "text-green-600",
        isPositive: true
    },
    {
        title: "Cancelled Auctions",
        value: "5",
        icon: XCircle,
        theme: "text-red-500 bg-red-50",
        subTitle: "5.2% from last month",
        subTextColor: "text-red-500",
        isPositive: false
    }
];

const activities = [
    {
        id: 1,
        title: "New auction created",
        subtitle: "2021 Chevrolet Camaro LT",
        time: "2 hours ago",
        icon: PlusCircle,
        color: "text-blue-500",
        bg: "bg-blue-100",
    },
    {
        id: 2,
        title: "Auction completed",
        subtitle: "2020 GMC Sierra 1500",
        time: "5 hours ago",
        icon: CheckCircle2,
        color: "text-green-600",
        bg: "bg-green-100",
    },
    {
        id: 3,
        title: "Auction canceled",
        subtitle: "2022 Toyota RAV4 LE",
        time: "1 day ago",
        icon: XCircle,
        color: "text-red-500",
        bg: "bg-red-100",
    },
];

function AllAuctions({ setCurrentPage, setSelectedAuction }) {

    const [page, setPage] = useState(1);
    const [activeTab, setActiveTab] = useState("all auctions");
    const [selectedType, setSelectedType] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const {data: allAuctions, isLoading, isError} = useGetAllAuctions();


    const getStatusStyles = (status) => {
        switch (status) {
            case "Live": return "bg-green-50 text-green-600";
            case "Upcoming": return "bg-blue-50 text-blue-600";
            case "Completed": return "bg-emerald-50 text-emerald-600";
            case "Cancelled": return "bg-red-50 text-red-600";
            default: return "bg-gray-50 text-gray-600";
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between pb-6">

                {/* Left */}
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3D]">
                        Auction Management
                    </h1>

                    <div className="mt-2 flex items-center text-[11px] md:text-[13px]">
                        <span
                            onClick={() => setCurrentPage("dashboard")}
                            className="cursor-pointer text-slate-500 hover:text-[#D97706] transition-colors"
                        >
                            Dashboard
                        </span>

                        <span className="mx-2 text-slate-300">/</span>
                        <span className="font-medium text-[#D97706]">
                            All Auctions
                        </span>
                    </div>
                </div>

                {/* btns */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

                    <button className="flex items-center justify-center gap-1.5 rounded-lg bg-[#D97706] px-4 py-2 font-medium text-white shadow-md shadow-amber-500/20 transition-all duration-200 hover:bg-[#B45F04] hover:scale-[1.02]">
                        <Plus size={16} />
                        <span className="text-sm">Create Auction</span>
                    </button>

                    <button className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-[#D97706] hover:text-[#D97706] hover:bg-amber-50">
                        <span className="text-sm">More Auctions</span>
                    </button>
                </div>
            </div>

            {/* stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
                {allAuctionsStats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className="bg-white px-3 py-4 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center"
                        >
                            {/* Left Side: Text */}
                            <div>
                                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">{stat.title}</p>
                                <h3 className="text-xl font-bold text-slate-900">{stat.value}</h3>
                                <div className={`flex items-center text-[11px] font-medium mt-1 ${stat.subTextColor}`}>
                                    {stat.isPositive ? <ArrowUp size={12} className="mr-0.5" /> : <ArrowDown size={12} className="mr-0.5" />}
                                    {stat.subTitle}
                                </div>
                            </div>

                            {/* Right Side: Icon */}
                            <div className={`p-2 rounded-lg ${stat.theme}`}>
                                <Icon size={20} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Search / Filter */}
            <div className="my-6 bg-white border border-slate-200 rounded-xl p-4 space-y-4">

                {/* Row 1 */}
                <div className="flex flex-wrap md:flex-nowrap items-center gap-3">

                    {/* Search */}
                    <div className="flex-1 sm:w-75">
                        <SearchBar />
                    </div>

                    {/* Status */}
                    <div className="w-full sm:w-42.5">
                        <FilterDropdown
                            label="All Status"
                            options={[
                                { label: "NA", value: "na" },
                                { label: "NA", value: "na" }
                            ]}
                            value={selectedType}
                            onChange={setSelectedType}
                        />
                    </div>

                    {/* Type */}
                    <div className="w-full sm:w-42.5">
                        <FilterDropdown
                            label="All Type"
                            options={[
                                { label: "Standard", value: "standard" },
                                { label: "Reserve", value: "reserve" }
                            ]}
                            value={selectedType}
                            onChange={setSelectedType}
                        />
                    </div>

                    {/* Category */}
                    <div className="w-full sm:w-45">
                        <FilterDropdown
                            label="All Categories"
                            options={[
                                { label: "SUV", value: "suv" },
                                { label: "Sedan", value: "sedan" }
                            ]}
                            value={selectedCategory}
                            onChange={setSelectedCategory}
                        />
                    </div>

                </div>

                {/* Row 2 */}
                <div className="flex flex-wrap items-center justify-between gap-3">

                    {/* Date Range */}
                    <div className="flex items-center gap-2 h-11 px-4 border border-slate-300 rounded-lg bg-white text-sm text-slate-600">
                        <span>📅</span>
                        <span>May 01, 2024 - May 31, 2024</span>
                    </div>

                    {/* Clear Filters */}
                    <button className="text-sm font-medium text-[#D97706] hover:underline">
                        Clear Filters
                    </button>

                </div>

            </div>

            {/* main section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 pb-6 gap-6">

                {/* left side - section */}
                <div className="lg:col-span-2 space-y-6">
                    <div>
                        {/* Tabs */}
                        <div className="mb-6 flex items-center gap-6 md:gap-8 border-b border-slate-200 overflow-x-auto scrollbar-hide">
                            {["all auctions", "live", "upcoming", "completed", "cancelled"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-3 text-sm font-medium transition-all whitespace-nowrap capitalize
                                            ${activeTab === tab
                                            ? "border-b-2 border-[#D97706] text-[#D97706]"
                                            : "text-slate-500 hover:text-[#0B1E3D]"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="overflow-x-auto no-scrollbar border border-gray-200 rounded-lg">
                            
                            <table className="w-full text-left table-fixed">
                                <thead className="bg-gray-100 border-b border-gray-200 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4 w-40">Auction ID</th>
                                        <th className="px-6 py-4 w-75">Auction title / Vehicle</th>
                                        <th className="px-6 py-4 w-25">Type</th>
                                        <th className="px-6 py-4 w-38">Start Date & Time</th>
                                        <th className="px-6 py-4 w-38">End Date & Time</th>
                                        <th className="px-6 py-4 w-35 text-center">Current Bid</th>
                                        <th className="px-6 py-4 w-30">Bids</th>
                                        <th className="px-6 py-4 w-30">Status</th>
                                        <th className="px-6 py-4 w-25">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-amber-50">
                                    {allAuctionData.map((auction) => (
                                        <tr key={auction.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 text-[13px] font-medium text-slate-700 truncate">{auction.id}</td>

                                            <td className="px-6 py-4 flex items-center gap-4">
                                                <img src={auction.imageUrl} alt={auction.title} className="w-16 h-10 object-cover rounded-lg shrink-0" />
                                                <div className="truncate">
                                                    <div className="text-gray-900 font-bold text-sm truncate">{auction.title}</div>
                                                    <div className="text-[11px] text-gray-500">VIN: {auction.vin}</div>
                                                    <div className="text-[11px] text-gray-400 truncate">{auction.specs.body} • {auction.specs.color} • {auction.specs.transmission}</div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-[11px] font-medium border 
                                                            ${auction.type === 'Reserve' ? 'border-purple-200 bg-purple-50 text-purple-700' : 'border-blue-200 bg-blue-50 text-blue-600'}`}>
                                                    {auction.type}
                                                </span>
                                            </td>

                                            {/* Start Date & Time */}
                                            <td className="px-6 py-4 text-[13px] text-slate-700 leading-tight">
                                                <div>{auction.startDate}</div>
                                                <div className="font-semibold">{auction.startTime}</div>
                                            </td>

                                            {/* End Date & Time */}
                                            <td className="px-6 py-4 text-[13px] text-slate-700 leading-tight">
                                                <div>{auction.endDate}</div>
                                                <div className="font-semibold">{auction.endTime}</div>
                                            </td>

                                            {/* current bid */}
                                            <td className="px-6 py-4 ">
                                                <div className="font-bold text-green-600 text-sm">{auction.currentBid}</div>
                                                <div className="text-[11px] text-slate-400">Reserve: {auction.reserve}</div>
                                            </td>

                                            {/* bids */}
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-sm text-slate-900">{auction.bids}</div>
                                                <div className="text-[11px] text-slate-500">Bidders: {auction.bidders}</div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-[10px] font-medium flex w-fit items-center gap-1.5 ${getStatusStyles(auction.status)}`}>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                                    {auction.status}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedAuction(auction);
                                                            if (auction.status === 'Live') setCurrentPage('live-auction-detail');
                                                            else if (auction.status === 'Upcoming') setCurrentPage('upcoming-auction-detail');
                                                            else if (auction.status === 'Completed') setCurrentPage('completed-auction-detail');
                                                            else if (auction.status === 'Cancelled') setCurrentPage('cancelled-auction-detail');
                                                        }}
                                                        className="p-1 text-slate-400 hover:text-slate-600">
                                                        <Eye size={16} />
                                                    </button>
                                                    <button className="p-1 text-slate-400 hover:text-slate-600"><MoreVertical size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* right side - section */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">
                    <SummaryDonutCard
                        title="Quick Stats"
                        centerValue="48"
                        centerLabel="Total"
                        showPercentage={true}
                        segments={[
                            { name: 'Live', value: 60, color: '#10B981' },
                            { name: 'Upcoming', value: 6, color: '#3B82F6' },
                            { name: 'Completed', value: 8, color: '#34D399' },
                            { name: 'Cancelled', value: 8, color: '#EF4444' },
                        ]}
                    />

                    {/* top performance */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[14px] font-semibold text-[#0B1E3D]">
                                Top Auctions
                            </h3>

                            <button className="text-[11px] font-medium text-[#D97706] hover:underline">
                                See All
                            </button>
                        </div>

                        <div className="space-y-3.5">
                            {allAuctionData.slice(0, 4).map((auction) => (
                                <div
                                    key={auction.id}
                                    className="flex items-center gap-3"
                                >
                                    <img
                                        src={auction.imageUrl}
                                        alt={auction.title}
                                        className="w-11 h-9 rounded-lg object-cover shrink-0"
                                    />

                                    <div className="flex-1 min-w-0">
                                        <p className="text-[12px] font-semibold text-slate-800 truncate">
                                            {auction.title}
                                        </p>

                                        <p className="text-[10px] text-slate-400 truncate">
                                            {auction.id}
                                        </p>
                                    </div>

                                    <div className="text-right shrink-0">
                                        <p className="text-[12px] font-semibold text-green-600">
                                            {auction.currentBid}
                                        </p>

                                        <p className="text-[10px] text-slate-500">
                                            {auction.bids} bids
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* recent activity */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[14px] font-semibold text-[#0B1E3D]">
                                Recent Activity
                            </h3>

                            <button className="text-[11px] font-medium text-[#D97706] hover:underline">
                                View All
                            </button>
                        </div>

                        {/* Activities */}
                        <div className="space-y-4">
                            {activities.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <div key={item.id} className="flex items-start gap-3">
                                        {/* Icon */}
                                        <div
                                            className={`w-7 h-7 rounded-full flex items-center justify-center ${item.bg}`}
                                        >
                                            <Icon size={14} className={item.color} />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between gap-2">
                                                <p className="text-[12px] font-medium text-slate-800">
                                                    {item.title}
                                                </p>

                                                <span className="text-[10px] text-slate-400 whitespace-nowrap">
                                                    {item.time}
                                                </span>
                                            </div>

                                            <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                                                {item.subtitle}
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

export default AllAuctions;
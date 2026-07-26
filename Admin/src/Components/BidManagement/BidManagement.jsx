
import React, { useState } from 'react';
import { Download, MoreVertical, Calendar, Gavel, TrendingUp, Trophy, XCircle, ArrowUp, ArrowDown, Plus, ArrowUpRight, X, History } from 'lucide-react';
import { bidsList } from '../Data';
import SearchBar from '../AuctionManagement/Shared/Filters/SearchBar';
import FilterDropdown from '../AuctionManagement/Shared/Filters/FilterDropDown';
import SummaryDonutCard from '../SharedComponents/SummaryDonutCard';
import BidManagementList from './BidManagementList';

const bidStats = [
    {
        title: "Total Bids",
        value: "1,248",
        icon: Gavel,
        theme: "text-violet-600 bg-violet-50",
        subTitle: "18.6% from last month",
        subTextColor: "text-green-600",
        isPositive: true
    },
    {
        title: "Active Bids",
        value: "342",
        icon: TrendingUp,
        theme: "text-green-600 bg-green-50",
        subTitle: "16.3% from last month",
        subTextColor: "text-green-600",
        isPositive: true
    },
    {
        title: "Won Bids",
        value: "128",
        icon: Trophy,
        theme: "text-amber-500 bg-amber-50",
        subTitle: "14.8% from last month",
        subTextColor: "text-green-600",
        isPositive: true
    },
    {
        title: "Outbid Bids",
        value: "978",
        icon: XCircle,
        theme: "text-red-500 bg-red-50",
        subTitle: "4.1% from last month",
        subTextColor: "text-red-500",
        isPositive: false
    }
];

function BidManagement({ setCurrentPage }) {

    const [selectedAuction, setSelectedAuction] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedBidder, setSelectedBidder] = useState("");

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between pb-6">

                {/* Left */}
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3D]">
                        Bid Management
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
                            Bid Management
                        </span>
                    </div>
                </div>

                {/* Right */}
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">

                    <button
                        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 sm:px-5 py-2.5 text-sm sm:text-[15px] font-semibold text-[#0B1E3D] shadow-md transition-all duration-200 hover:border-[#D97706] hover:bg-amber-50 hover:text-[#D97706] active:scale-[0.98] whitespace-nowrap"
                    >
                        <Download className="w-4 h-4 shrink-0" />
                        <span>Export</span>
                    </button>

                    <button
                        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 sm:px-5 py-2.5 text-sm sm:text-[15px] font-semibold text-[#0B1E3D] shadow-md transition-all duration-200 hover:border-[#D97706] hover:bg-amber-50 hover:text-[#D97706] active:scale-[0.98] whitespace-nowrap"
                    >
                        <MoreVertical className="w-4 h-4 shrink-0" />
                        <span>More Actions</span>
                    </button>

                </div>
            </div>

            {/* stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {bidStats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className="bg-white px-3 py-4 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center"
                        >
                            {/* Left Side: Text */}
                            <div>
                                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                                    {stat.title}
                                </p>
                                <h3 className="py-2 text-xl font-bold text-slate-900">
                                    {stat.value}
                                </h3>
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

                <div className="flex flex-wrap xl:flex-nowrap items-center gap-3">

                    {/* Search */}
                    <div className="flex-1 sm:w-75">
                        <SearchBar />
                    </div>

                    {/* all auc */}
                    <div className="w-full sm:w-42">
                        <FilterDropdown
                            label="All Auctions"
                            options={[
                                { label: "NA", value: "na" },
                                { label: "NA", value: "na" }
                            ]}
                            value={selectedAuction}
                            onChange={setSelectedAuction}
                        />
                    </div>

                    {/* type */}
                    <div className="w-full sm:w-42">
                        <FilterDropdown
                            label="All Types"
                            options={[
                                { label: "Standard", value: "standard" },
                                { label: "Reserve", value: "reserve" }
                            ]}
                            value={selectedType}
                            onChange={setSelectedType}
                        />
                    </div>

                    {/* status */}
                    <div className="w-full sm:w-42">
                        <FilterDropdown
                            label="All Status"
                            options={[
                                { label: "SUV", value: "suv" },
                                { label: "Sedan", value: "sedan" }
                            ]}
                            value={selectedStatus}
                            onChange={setSelectedStatus}
                        />
                    </div>

                    {/* bidders */}
                    <div className="w-full sm:w-42">
                        <FilterDropdown
                            label="All Bidders"
                            options={[
                                { label: "SUV", value: "suv" },
                                { label: "Sedan", value: "sedan" }
                            ]}
                            value={selectedBidder}
                            onChange={setSelectedBidder}
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
                    <BidManagementList />
                </div>

                {/* right side - section */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">

                    <SummaryDonutCard
                        title="Bid Summary"
                        centerValue="1248"
                        centerLabel="Total Bids"
                        showPercentage={true}
                        segments={[
                            { name: 'Won', value: 128, color: '#00B050' },
                            { name: 'Outbid', value: 978, color: '#FF6B72' },
                            { name: 'Active', value: 342, color: '#2B7FFF' },
                            { name: 'Withdrawn', value: 42, color: '#FF9900' },
                        ]}
                    />

                    {/* top bidders */}
                    <div className="bg-white rounded-xl border border-slate-100 p-4 md:p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-900 text-[13px] md:text-sm">
                                Top Bidders
                            </h3>
                            <button className="text-[11px] md:text-xs font-semibold text-amber-600 hover:underline">
                                View All
                            </button>
                        </div>
                        <div className="space-y-3">
                            {bidsList.map((bidder, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-bold text-slate-700">
                                            {index + 1 || "--"}
                                        </span>
                                        <img
                                            src={bidder.avatarUrl}
                                            alt={bidder.bidderName}
                                            className="w-6 h-6 md:w-8 md:h-8 rounded-full object-cover"
                                        />
                                        <span className="text-[11px] md:text-xs font-semibold text-slate-800">
                                            {bidder.bidderName}
                                        </span>
                                    </div>
                                    <span className="text-[12px] md:text-xs font-medium text-slate-600">{bidder.bids}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* recent activity */}
                    <div className="bg-white rounded-xl border border-slate-100 p-4 md:p-5 shadow-sm">
                        <h3 className="font-bold text-slate-900 text-[13px] md:text-sm mb-4">
                            Recent Activity
                        </h3>

                        <div className="relative pl-6 space-y-5 before:absolute  before:top-2 before:bottom-2  before:bg-slate-100">
                            {[
                                {
                                    title: "New bid placed",
                                    desc: "Michael Johnson placed a bid of $45,500",
                                    time: "May 30, 2024 04:23 PM",
                                    icon: Plus,
                                    iconBg: "bg-green-500 text-white",
                                },
                                {
                                    title: "Bid outbid",
                                    desc: "David Brown outbid with $22,000",
                                    time: "May 28, 2024 03:40 PM",
                                    icon: ArrowUpRight,
                                    iconBg: "bg-blue-600 text-white",
                                },
                                {
                                    title: "Bid withdrawn",
                                    desc: "Daniel Anderson withdrew a bid",
                                    time: "May 23, 2024 09:15 AM",
                                    icon: X,
                                    iconBg: "bg-orange-500 text-white",
                                },
                            ].map((activity, idx) => {
                                const Icon = activity.icon;
                                return (
                                    <div
                                        key={idx}
                                        className="relative">
                                        <div className={`absolute -left-6.5 top-0.5 w-4 h-4 md:w-4.5 md:h-4.5 rounded-full flex items-center justify-center text-xs ${activity.iconBg} ring-3 ring-white`}>
                                            <Icon className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                        </div>
                                        <div>
                                            <h4 className="text-[12px] md:text-xs font-bold text-slate-900">
                                                {activity.title}
                                            </h4>
                                            <p className="text-[11px] md:text-xs text-slate-600 mt-0.5">
                                                {activity.desc}
                                            </p>
                                            <span className="text-[11px] text-slate-400 mt-0.5 block">
                                                {activity.time}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <button className="w-full mt-5 py-2.5 border border-slate-200 rounded-lg text-xs font-semibold text-amber-600 hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors">
                            <History className="w-4 h-4" />
                            View All Activity
                        </button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default BidManagement;
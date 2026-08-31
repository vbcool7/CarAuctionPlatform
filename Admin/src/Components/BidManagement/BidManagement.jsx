
import React, { useState } from 'react';
import { Download, MoreVertical, Calendar, Gavel, TrendingUp, Trophy, XCircle, ArrowUp, ArrowDown, Plus, ArrowUpRight, X, History, Eye } from 'lucide-react';
import { bidsList } from '../Data';
import SearchBar from '../SharedComponents/SearchBar';
import FilterDropdown from '../SharedComponents/FilterDropdown';
import SummaryDonutCard from '../SharedComponents/SummaryDonutCard';

import { useGetAllBids } from '../../hooks/useBid';
import { getPaginationRange } from '../utils/getPaginationRange';

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

// tabs
const tabs = [
    { id: 'all-bids', label: 'All Bids', },
    { id: 'active-bids', label: 'Active Bids', },
    { id: 'won-bids', label: 'Won Bids', },
    { id: 'outbid-bids', label: 'Outbid Bids', },
    { id: 'withdrawn-bids', label: 'Withdrawn Bids', },
];

function BidManagement({ setCurrentPage }) {

    const [page, setPage] = useState(1);
    const { data: allBids, isLoading, isError } = useGetAllBids(page);

    const bids = allBids?.bids || [];

    console.log(allBids?.bids);

    const [activeTab, setActiveTab] = useState("all-bids");

    const [selectedAuction, setSelectedAuction] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedBidder, setSelectedBidder] = useState("");

    const totalPages = allBids?.pagination?.totalPages || 1;

    const filteredBids = bids.filter((bid) => {
        if (activeTab === 'all-bids') return true;
        if (activeTab === 'active-bids') return bid.status === 'active';
        if (activeTab === 'won-bids') return bid.status === 'won';
        if (activeTab === 'outbid-bids') return bid.status === 'outbid';
        // if (activeTab === 'withdrawn-bids') return bid.status === 'withdrawn';  // withdrawn abhi scope mein nahi
        return true;
    }) || [];

    if (isLoading) return <p className="p-10 text-center">Loading bid list....</p>;
    if (isError) return <p className="p-10 text-center text-red-500">Failed to load bid list</p>;

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
                                        <th className="px-6 py-4 w-38">Bid ID</th>
                                        <th className="px-6 py-4 w-75">Auction / Vehicle</th>
                                        <th className="px-6 py-4 w-55">Bidder</th>
                                        <th className="px-6 py-4 w-45">Bid Amount</th>
                                        <th className="px-6 py-4 w-40">Bid Time</th>
                                        <th className="px-6 py-4 w-35">Status</th>
                                        <th className="px-6 py-4 w-35">Bid Type</th>
                                        <th className="px-6 py-4 w-25">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-amber-50">
                                    {filteredBids.length > 0 ? (
                                        filteredBids.map((bid, index) => (
                                            <tr
                                                key={bid._id || index}
                                                className="hover:bg-gray-50/50 transition-colors">

                                                {/* bid id */}
                                                <td className='px-6 py-4'>
                                                    <span className='text-[13px] font-semibold text-gray-500'>
                                                        {bid.bidId || "---"}
                                                    </span>
                                                </td>

                                                {/* vehicle detail */}
                                                <td className="px-6 py-4 flex items-center gap-4">
                                                    <img
                                                        src={bid.vehicleId?.images?.[0]?.url || null}
                                                        alt={bid.model}
                                                        className="w-16 h-10 object-cover rounded-lg shrink-0" />
                                                    <div className="truncate">
                                                        <div className="text-gray-900 font-bold text-sm truncate">{bid.vehicleId?.year} {bid.vehicleId?.make} {bid.vehicleId?.model}</div>
                                                        <div className="text-[11px] text-gray-500">VIN: {bid.vehicleId?.vin}</div>
                                                        <div className="text-[10px] text-gray-400">ID: {bid.vehicleId?.listingId}</div>
                                                    </div>
                                                </td>

                                                {/* bidder */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">

                                                        <img
                                                            src={
                                                                bid.bidderType === 'Buyer'
                                                                    ? bid.bidder?.profileImageUrl || "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg"
                                                                    : bid.bidder?.profileImage || "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg"
                                                            }
                                                            alt="Bidder"
                                                            className="w-8 h-8 rounded-full object-cover"
                                                        />

                                                        <div>
                                                            <div className="font-semibold text-slate-900 text-[14px]">
                                                                {bid.bidderType === 'Buyer'
                                                                    ? `${bid.bidder?.firstName || '---'} ${bid.bidder?.lastName || ''}`.trim()
                                                                    : bid.bidder?.fullName || '---'
                                                                }
                                                            </div>

                                                            <div className="text-xs text-slate-500 font-medium">
                                                                {bid.bidderType === 'Buyer'
                                                                    ? bid.bidder?.buyerId || "NA"
                                                                    : bid.bidder?.sellerId || "NA"
                                                                }
                                                            </div>
                                                        </div>

                                                    </div>
                                                </td>

                                                {/* bid amount */}
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="">
                                                            <span className="text-sm font-bold text-[#0B1E3D]">
                                                                AED {bid.amount?.toLocaleString() || 0}
                                                            </span>
                                                        </div>

                                                        {/* starting bid */}
                                                        <div className="text-[11px] text-slate-400">
                                                            Starting bid:{" "}
                                                            <span className="font-medium text-slate-500">
                                                                AED {bid.vehicleId?.startingBidPrice?.toLocaleString() || 0}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* bid time */}
                                                <td className="px-6 py-4 text-[13px] text-slate-700 leading-tight">
                                                    <div>
                                                        {bid.createdAt
                                                            ? new Date(bid.createdAt).toLocaleDateString('en-GB', {
                                                                day: '2-digit',
                                                                month: 'short',
                                                                year: 'numeric'
                                                            })
                                                            : "---"
                                                        }
                                                    </div>

                                                    <div className="font-semibold">
                                                        {bid.createdAt
                                                            ? new Date(bid.createdAt).toLocaleTimeString([], {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })
                                                            : "---"
                                                        }
                                                    </div>
                                                </td>

                                                {/* status */}
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`px-2 py-1 rounded text-[11px] font-medium border
                                                    ${bid.status === 'active'
                                                                ? 'border-green-200 bg-green-50 text-green-700'
                                                                : 'border-red-200 bg-red-50 text-red-600'
                                                            }`}
                                                    >
                                                        {bid.status === 'active' ? 'Active' : 'Outbid'}
                                                    </span>
                                                </td>

                                                {/* bid type */}
                                                <td className='px-6 py-4'>
                                                    <span className="px-2 py-1 rounded text-[11px] font-medium border border-gray-200 bg-gray-50 text-gray-600">
                                                        {bid.bidderType || "---"}
                                                    </span>
                                                </td>

                                                {/* actions */}
                                                <td className="px-6 py-4">
                                                    <div className="">
                                                        <button
                                                            // onClick={() => onSelectVehicle(auction)}
                                                            className="p-1 text-slate-400 hover:text-slate-600">
                                                            <Eye size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={8} className="py-10 text-center text-sm text-gray-500">
                                                No bids found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between gap-4 px-6 py-4 border-t border-slate-200 bg-white">

                            {/* Page Info */}
                            <p className="hidden sm:block text-xs text-slate-500">
                                Page <span className="font-semibold text-[#0B1E3D]">{page}</span> of{" "}
                                <span className="font-semibold text-[#0B1E3D]">{totalPages}</span>
                            </p>

                            {/* Pagination */}
                            <div className="flex items-center gap-1.5 mx-auto sm:mx-0 sm:ml-auto">

                                {/* Previous */}
                                <button
                                    type="button"
                                    onClick={() => setPage((p) => p - 1)}
                                    disabled={page === 1}
                                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600
                                    hover:bg-slate-50 hover:border-slate-300
                                    disabled:opacity-40 disabled:cursor-not-allowed
                                    transition-all"
                                >
                                    Previous
                                </button>

                                {/* Page Numbers */}
                                {getPaginationRange(page, totalPages).map((num, idx) =>
                                    num === "..." ? (
                                        <span
                                            key={`dot-${idx}`}
                                            className="px-2 py-1.5 text-xs font-medium text-slate-400"
                                        >
                                            ...
                                        </span>
                                    ) : (
                                        <button
                                            type="button"
                                            key={num}
                                            onClick={() => setPage(num)}
                                            className={`min-w-8 h-8 px-2 rounded-lg text-xs font-semibold border transition-all
                                                ${page === num
                                                    ? "bg-[#D97706] text-white border-[#D97706] shadow-sm"
                                                    : "bg-white border-slate-200 text-slate-600 hover:bg-amber-50 hover:text-[#D97706] hover:border-amber-200"
                                                }`}
                                        >
                                            {num}
                                        </button>
                                    )
                                )}

                                {/* Next */}
                                <button
                                    type="button"
                                    onClick={() => setPage((p) => p + 1)}
                                    disabled={page === totalPages}
                                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600
                                    hover:bg-slate-50 hover:border-slate-300
                                    disabled:opacity-40 disabled:cursor-not-allowed
                                    transition-all"
                                >
                                    Next
                                </button>

                            </div>
                        </div>
                    )}
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
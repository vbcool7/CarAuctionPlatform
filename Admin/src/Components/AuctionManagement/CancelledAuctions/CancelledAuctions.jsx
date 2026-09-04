
import React, { useState } from 'react';
import { ArrowDown, ArrowUp, CalendarX, Calendar, Clock, User, Tag, MoreVertical, Eye } from 'lucide-react';

import AuctionsHeader from '../Shared/AuctionsHeader';
import SearchBar from '../../SharedComponents/SearchBar';
import FilterDropdown from '../../SharedComponents/FilterDropdown';
import SummaryDonutCard from '../../SharedComponents/SummaryDonutCard';
import ContactSupport from '../../SharedComponents/ContactSupport';
import CancelledAuctionsCategories from './CancelledAuctionsCategories';

import { useGetAllAuctions } from '../../../hooks/useAuction';
import { getPaginationRange } from '../../utils/getPaginationRange';
import { formatLabel } from '../../utils/formatter';

const cancelledAuctionsStats = [
    {
        title: "Total Cancelled Auctions",
        value: "12",
        icon: CalendarX,
        theme: "text-rose-600 bg-rose-50",
        subTitle: "14.3% from last month",
        subTextColor: "text-rose-500",
        isPositive: false
    },
    {
        title: "Cancelled Before Start",
        value: "7",
        icon: Calendar,
        theme: "text-amber-600 bg-amber-50",
        subTitle: "16.7% from last month",
        subTextColor: "text-rose-500",
        isPositive: false
    },
    {
        title: "Cancelled In Progress",
        value: "3",
        icon: Clock,
        theme: "text-purple-600 bg-purple-50",
        subTitle: "25% from last month",
        subTextColor: "text-emerald-500",
        isPositive: true
    },
    {
        title: "Cancelled By Admin",
        value: "9",
        icon: User,
        theme: "text-blue-600 bg-blue-50",
        subTitle: "10% from last month",
        subTextColor: "text-emerald-500",
        isPositive: true
    },
    {
        title: "Avg. Starting Price",
        value: "$17,820",
        icon: Tag,
        theme: "text-emerald-600 bg-emerald-50",
        subTitle: "8.2% from last month",
        subTextColor: "text-emerald-500",
        isPositive: true
    }
];

const canceledTabsMap = {
    'all-canceled': null,
    'before-start': 'upcoming',   
    'in-progress': 'live',
};

// tabs
const tabs = [
    { id: 'all-canceled', label: 'All Canceled' },
    { id: 'before-start', label: 'Before Start' },
    { id: 'in-progress', label: 'In Progress' },
];

function CanceledAuctionRow({ auction, onSelectVehicle }) {
    return (
        <tr className="hover:bg-gray-50/50 transition-colors">

            {/* auction id */}
            <td className="px-6 py-4 text-[13px] font-medium text-slate-700 truncate">
                {auction.listingId || "N/A"}
            </td>

            {/* vehicle detail */}
            <td className="px-6 py-4 flex items-center gap-4">
                <img
                    src={auction.images?.[0]?.url || null}
                    alt={formatLabel(auction.model) || "Vehicle"}
                    className="w-16 h-10 object-cover rounded-lg shrink-0"
                />

                <div className="truncate">
                    <div className="text-gray-900 font-bold text-sm truncate">
                        {`${auction.year || ""} ${formatLabel(auction.make)} ${formatLabel(auction.model)}`}
                    </div>

                    <div className="text-[11px] text-gray-500">
                        VIN: {auction.vin || "N/A"}
                    </div>

                    <div className="text-[11px] text-gray-400 truncate">
                        {formatLabel(auction.bodyType)} •{" "}
                        {formatLabel(auction.exteriorColor)} •{" "}
                        {formatLabel(auction.transmission)}
                    </div>
                </div>
            </td>

            {/* auction type */}
            <td className="px-6 py-4">
                <span
                    className={`px-2 py-1 rounded text-[11px] font-medium border
                        ${auction.priceType === "reserve_price"
                            ? "border-purple-200 bg-purple-50 text-purple-700"
                            : "border-blue-200 bg-blue-50 text-blue-600"
                        }`}
                >
                    {formatLabel(auction.priceType)}
                </span>
            </td>

            {/* Start Date & Time */}
            <td className="px-6 py-4 text-[13px] text-slate-700 leading-tight">
                <div>
                    {auction.auctionStartDateTime
                        ? new Date(auction.auctionStartDateTime).toLocaleDateString("en-GB", {
                            timeZone: "Asia/Dubai",
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        })
                        : "N/A"}
                </div>

                <div className="font-semibold">
                    {auction.auctionStartDateTime
                        ? new Date(auction.auctionStartDateTime).toLocaleTimeString("en-US", {
                            timeZone: "Asia/Dubai",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                        })
                        : "N/A"}
                </div>
            </td>

            {/* Price / Bid */}
            <td className="px-6 py-4">
                {auction.priceType === "reserve_price" ? (
                    <>
                        <div className="font-bold text-green-600 text-[12px]">
                            Current Bid:{" "}
                            {auction.currentBid != null
                                ? `AED ${auction.currentBid.toLocaleString()}`
                                : "No bids"}
                        </div>

                        <div className="text-[11px] text-slate-400">
                            Starting Bid:{" "}
                            {auction.startingBidPrice != null
                                ? `AED ${auction.startingBidPrice.toLocaleString()}`
                                : "N/A"}
                        </div>

                        <div className="text-[11px] text-slate-400">
                            Reserve:{" "}
                            {auction.reservePrice != null
                                ? `AED ${auction.reservePrice.toLocaleString()}`
                                : "N/A"}
                        </div>
                    </>
                ) : (
                    <>
                        <div className="font-bold text-green-600 text-[12px]">
                            Buy Now:{" "}
                            {auction.buyNowPrice != null
                                ? `AED ${auction.buyNowPrice.toLocaleString()}`
                                : "N/A"}
                        </div>

                        <div className="text-[11px] text-slate-400">
                            Starting Bid:{" "}
                            {auction.startingBidPrice != null
                                ? `AED ${auction.startingBidPrice.toLocaleString()}`
                                : "N/A"}
                        </div>
                    </>
                )}
            </td>

            {/* Bids */}
            <td className="px-6 py-4">
                <div className="font-bold text-sm text-slate-900">
                    {auction.bids ?? 0}
                </div>

                <div className="text-[11px] text-slate-500">
                    Bidders: {auction.bidders ?? 0}
                </div>
            </td>

            {/* cancel date */}
            <td className="px-6 py-4 text-[13px] text-slate-700 leading-tight">
                <div>
                    {auction.canceledAt
                        ? new Date(auction.canceledAt).toLocaleDateString("en-GB", {
                            timeZone: "Asia/Dubai",
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        })
                        : "N/A"}
                </div>

                <div className="font-semibold">
                    {auction.canceledAt
                        ? new Date(auction.canceledAt).toLocaleTimeString("en-US", {
                            timeZone: "Asia/Dubai",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                        })
                        : "N/A"}
                </div>
            </td>

            {/* reason */}
            <td className="px-6 py-4 text-[13px] text-gray-800 line-clamp-2">
                {auction.cancellationReason || "—"}
            </td>

            {/* cancel by */}
            <td className="px-6 py-4 text-sm whitespace-nowrap">
                <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium 
                        ${auction.canceledBy === "admin"
                            ? "bg-blue-50 text-blue-600"
                            : "bg-purple-50 text-purple-600"
                        }`}
                >
                    {formatLabel(auction.canceledBy)}
                </span>
            </td>

            {/* Status */}
            <td className="px-6 py-4">
                <span className="px-2 py-1 rounded-lg text-[11px] text-red-600 bg-red-50 border border-red-100 font-medium flex w-fit items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                    {formatLabel(auction.auctionStatus)}
                </span>
            </td>

            {/* actions */}
            <td className="px-6 py-4">
                <div className="flex gap-2">
                    <button
                        onClick={() => onSelectVehicle(auction)}
                        className="p-1 text-slate-400 hover:text-slate-600">
                        <Eye size={16} />
                    </button>

                    <button className="p-1 text-slate-400 hover:text-slate-600">
                        <MoreVertical size={16} />
                    </button>
                </div>
            </td>
        </tr>
    )
}

function CancelledAuctions({ setCurrentPage, onSelectVehicle }) {

    const [page, setPage] = useState(1);
    const [selectedReason, setSelectedReason] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [activeTab, setActiveTab] = useState("all-canceled");

    const { data: allAuctions, isLoading, isError } = useGetAllAuctions(page, 10, 'canceled', canceledTabsMap[activeTab]);

    const allAuctionData = allAuctions?.vehicles || [];
    const totalPages = allAuctions?.pagination?.totalPages || 1;

    if (isLoading) return <p className="p-10 text-center">Loading canceled auctions list....</p>;
    if (isError) return <p className="p-10 text-center text-red-500">Failed to load canceled auctions list</p>;

    return (
        <div>
            <AuctionsHeader
                setCurrentPage={setCurrentPage}
                pageTitle="Cancelled Auctions"
                breadcrumbLabel="All Cancelled Auctions"
            />

            {/* stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
                {cancelledAuctionsStats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className="bg-white px-3 py-4 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center"
                        >
                            {/* Left Side: Text */}
                            <div>
                                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">{stat.title}</p>
                                <h3 className="text-xl font-bold text-slate-900 py-2">{stat.value}</h3>
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

                    {/* reason */}
                    <div className="w-full sm:w-42.5">
                        <FilterDropdown
                            label="All Reasons"
                            options={[
                                { label: "NA", value: "na" },
                                { label: "NA", value: "na" }
                            ]}
                            value={selectedReason}
                            onChange={setSelectedReason}
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

                {/* left side */}
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

                    {/* table */}
                    <div className="overflow-x-auto border border-gray-200 rounded-lg">
                        <table className="w-full text-left table-fixed">
                            <thead className="bg-gray-100 border-b border-gray-200 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 w-35">Auction ID</th>
                                    <th className="px-6 py-4 w-75">Auction / Vehicle</th>
                                    <th className="px-6 py-4 w-35">Auction Type</th>
                                    <th className="px-6 py-4 w-45">Start Date & time</th>
                                    <th className="px-6 py-4 w-50">Price / Bid</th>
                                    <th className="px-6 py-4 w-30">Bids</th>
                                    <th className="px-6 py-4 w-40">Cancelled Date</th>
                                    <th className="px-6 py-4 w-60">Reason</th>
                                    <th className="px-6 py-4 w-38">Cancelled By</th>
                                    <th className="px-6 py-4 w-32">Status</th>
                                    <th className="px-6 py-4 w-25">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-amber-50">
                                {allAuctionData.length > 0 ? (
                                    allAuctionData.map((auction, index) => {
                                        return (
                                            <CanceledAuctionRow
                                                key={auction._id || index}
                                                auction={auction}
                                                onSelectVehicle={onSelectVehicle}
                                            />
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={11}
                                            className="px-6 py-10 text-center text-sm text-gray-500"
                                        >
                                            No auctions found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
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
                                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all" >
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
                                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300  disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* right side */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">
                    <SummaryDonutCard
                        title="Cancelled Reasons"
                        centerValue="12"
                        centerLabel="Total"
                        showPercentage={false}
                        segments={[
                            { name: 'Not enough participants', value: 5, color: '#3B82F6' },
                            { name: 'Vehicle not available', value: 2, color: '#22C55E' },
                            { name: 'Payment issue', value: 1, color: '#F59E0B' },
                            { name: 'Logistics issue', value: 1, color: '#A855F7' },
                            { name: 'Reserve not met', value: 1, color: '#F97316' },
                            { name: 'Others', value: 2, color: '#94A3B8' }
                        ]}
                    />

                    <CancelledAuctionsCategories />

                    <ContactSupport />
                </div>
            </div>
        </div>
    )
}

export default CancelledAuctions;
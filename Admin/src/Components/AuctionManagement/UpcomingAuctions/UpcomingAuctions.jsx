
import React, { useState } from 'react';
import { CalendarDays, Clock3, CalendarRange, CalendarCheck, Tag, ArrowUp, Eye, MoreVertical } from 'lucide-react';
import AuctionsHeader from '../Shared/AuctionsHeader';
import SearchBar from '../../SharedComponents/SearchBar';
import FilterDropdown from '../../SharedComponents/FilterDropdown';
import UpcomingAuctionsCalender from './UpcomingAuctionsCalender';

import { allAuctionData } from '../../Data';
import { useGetAllAuctions } from '../../../hooks/useAuction';
import { getPaginationRange } from '../../utils/getPaginationRange';
import { formatLabel } from '../../utils/formatter';
import { UseCountDown } from '../../SharedComponents/UseCountDown';


const upcomingAuctionStats = [
    {
        title: "Total Upcoming",
        value: "15",
        trend: "8.7%",
        icon: CalendarDays,
        theme: "bg-violet-100",
        iconColor: "text-violet-600",
    },
    {
        title: "Starting Today",
        value: "3",
        trend: "20%",
        icon: Clock3,
        theme: "bg-green-100",
        iconColor: "text-green-600",
    },
    {
        title: "Starting This Week",
        value: "7",
        trend: "12.5%",
        icon: CalendarRange,
        theme: "bg-amber-100",
        iconColor: "text-amber-600",
    },
    {
        title: "Starting This Month",
        value: "15",
        trend: "15.3%",
        icon: CalendarCheck,
        theme: "bg-blue-100",
        iconColor: "text-blue-600",
    },
    {
        title: "Avg. Starting Price",
        value: "$18,650",
        trend: "5.6%",
        icon: Tag,
        theme: "bg-rose-100",
        iconColor: "text-rose-500",
    },
];

// tabs
const tabs = [
    { id: 'all-upcoming', label: 'All Upcoming' },
    { id: 'starting-today', label: 'Starting Today' },
    { id: 'this-week', label: 'This Week' },
    { id: 'this-month', label: 'This Month' },
];

const dateRangeMap = {
    'all-upcoming': null,
    'starting-today': 'today',
    'this-week': 'week',
    'this-month': 'month',
};

function UpcomingAuctionRow({ auction, onSelectVehicle }) {
    const startsIn = UseCountDown(auction.auctionStartDateTime);
    const startsInDisplay = `${startsIn.days}d ${startsIn.hours}h ${startsIn.mins}m ${startsIn.secs}s`;

    return (
        <tr
            className="hover:bg-gray-50/50 transition-colors">
            {/* auction id */}
            <td className="px-6 py-4 text-[13px] font-medium text-slate-700 truncate">
                {auction.listingId || "N/A"}
            </td>

            {/* vehicle detail */}
            <td className="px-6 py-4 flex items-center gap-4">
                <img
                    src={auction.images?.[0]?.url || null}
                    alt={formatLabel(auction.model) || "Vehicle"}
                    className="w-16 h-10 object-cover rounded-lg shrink-0" />
                <div className="truncate">
                    <div className="text-gray-900 font-bold text-sm truncate">
                        {`${auction.year || ""} ${formatLabel(auction.make)} ${formatLabel(auction.model)}`}
                    </div>
                    <div className="text-[11px] text-gray-500"> VIN: {auction.vin || "N/A"}</div>
                    <div className="text-[11px] text-gray-400 truncate">
                        <div className="text-[11px] text-gray-400 truncate">
                            {formatLabel(auction.bodyType)} •{" "}
                            {formatLabel(auction.exteriorColor)} •{" "}
                            {formatLabel(auction.transmission)}
                        </div>
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

            {/* start date */}
            <td className="px-6 py-4 text-[13px] text-slate-700 leading-tight">
                <div className="font-semibold font-mono">{startsInDisplay}</div>
            </td>

            {/* Status Badge */}
            <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-lg text-[11px] text-green-600 bg-green-50 border border-green-100 font-medium flex w-fit items-center gap-1.5 `}>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
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
    );
}

function UpcomingAuctions({ onSelectVehicle, setCurrentPage }) {

    const [page, setPage] = useState(1);
    const [activeTab, setActiveTab] = useState("all-upcoming");
    const [selectedType, setSelectedType] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    const { data: allAuctions, isLoading, isError } = useGetAllAuctions(page, 10, 'upcoming', dateRangeMap[activeTab]);

    const allAuctionData = allAuctions?.vehicles || [];
    const totalPages = allAuctions?.pagination?.totalPages || 1;

    if (isLoading) return <p className="p-10 text-center">Loading upcoming auctions list....</p>;
    if (isError) return <p className="p-10 text-center text-red-500">Failed to load upcoming auctions list</p>;

    return (
        <div>
            <AuctionsHeader
                setCurrentPage={setCurrentPage}
                pageTitle="Upcoming Auctions"
                breadcrumbLabel="All Upcoming Auctions"
            />

            {/* stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
                {upcomingAuctionStats.map((stat, index) => {

                    const Icon = stat.icon;

                    return (
                        <div
                            key={index}
                            className="bg-white px-3 py-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex justify-between items-start"
                        >
                            {/* Left */}
                            <div className="flex-1">

                                <p className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold">
                                    {stat.title}
                                </p>

                                <div className="flex justify-between items-center gap-2 mt-1">
                                    <h3 className="text-2xl font-bold text-[#0B1E3D] leading-none">
                                        {stat.value}
                                    </h3>

                                    <div
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.theme}`}
                                    >
                                        <Icon size={18} className={stat.iconColor} />
                                    </div>

                                </div>

                                <p className="text-[12px] text-slate-500 font-medium flex items-center gap-1 mt-2">
                                    <span className="text-emerald-600 flex items-center font-bold">
                                        <ArrowUp size={12} /> {stat.trend}
                                    </span>
                                    from last month
                                </p>
                            </div>

                            {/* Right */}

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

                {/* left side */}
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
                                        <th className="px-6 py-4 w-38">Auction ID</th>
                                        <th className="px-6 py-4 w-75">Auction / Vehicle</th>
                                        <th className="px-6 py-4 w-35">Auction Type</th>
                                        <th className="px-6 py-4 w-45">Price / Bid</th>
                                        <th className="px-6 py-4 w-30">Bids</th>
                                        <th className="px-6 py-4 w-40">Start Date & time</th>
                                        <th className="px-6 py-4 w-40">Status</th>
                                        <th className="px-6 py-4 w-25">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-amber-50">
                                    {allAuctionData.length > 0 ? (
                                        allAuctionData.map((auction, index) => {

                                            return (
                                                <UpcomingAuctionRow
                                                    key={auction._id || index}
                                                    auction={auction}
                                                    onSelectVehicle={onSelectVehicle}
                                                />
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-10 text-center text-sm text-gray-500">
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
                </div>

                {/* right side */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">

                    {/* calender + list + notification badge */}
                    <UpcomingAuctionsCalender />
                </div>
            </div>
        </div>
    )
}

export default UpcomingAuctions;
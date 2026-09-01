
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { DollarSign, Gavel, Wallet, TrendingUp, ArrowUp, Trophy, CheckCircle, XCircle, MoreVertical, Eye } from 'lucide-react';
import AuctionsHeader from '../Shared/AuctionsHeader';
import SearchBar from '../../SharedComponents/SearchBar';
import FilterDropdown from '../../SharedComponents/FilterDropdown';
import ContactSupport from '../../SharedComponents/ContactSupport';

import { allAuctionData } from '../../Data';
import { getPaginationRange } from '../../utils/getPaginationRange';
import { useGetAllAuctions } from '../../../hooks/useAuction';
import { formatLabel } from '../../utils/formatter';

const completedAuctionStats = [
    {
        title: "Total Completed Auctions",
        value: "28",
        trend: "21.7%",
        icon: Trophy,
        theme: "bg-violet-100",
        iconColor: "text-violet-600",
    },
    {
        title: "Sold Auctions",
        value: "22",
        trend: "18.6%",
        icon: CheckCircle,
        theme: "bg-green-100",
        iconColor: "text-green-600",
    },
    {
        title: "Unsold Auctions",
        value: "6",
        trend: "14.3%",
        icon: XCircle,
        theme: "bg-red-100",
        iconColor: "text-red-600",
    },
    {
        title: "Reserve Not Met",
        value: "6",
        trend: "14.3%",
        icon: XCircle,
        theme: "bg-red-100",
        iconColor: "text-red-600",
    },
];

const completedHighlights = [
    {
        id: 1,
        date: "2026-05-21",
        status: "highSales",
    },
    {
        id: 2,
        date: "2026-05-22",
        status: "completed",
    },
    {
        id: 3,
        date: "2026-05-23",
        status: "completed",
    },
    {
        id: 4,
        date: "2026-05-23",
        status: "unsold",
    },
    {
        id: 5,
        date: "2026-06-23",
        status: "unsold",
    },
];

// completion highlight
const highlights = [
    {
        title: "Highest Sold Price",
        value: "$45,500",
        date: "May 30, 2024",
        icon: DollarSign,
        theme: "text-emerald-600 bg-emerald-50"
    },
    {
        title: "Most Bids",
        value: "18 Bids",
        date: "May 30, 2024",
        icon: Gavel,
        theme: "text-emerald-600 bg-emerald-50"
    },
    {
        title: "Total Sold Value",
        value: "$612,450",
        date: "This Month",
        icon: Wallet,
        theme: "text-amber-600 bg-amber-50"
    },
    {
        title: "Sell Through Rate",
        value: "78.6%",
        date: "This Month",
        icon: TrendingUp,
        theme: "text-emerald-600 bg-emerald-50"
    }
];

const statusMap = {
    "all completed": "completed",
    "sold": "sold",
    "unsold": "unsold",
    "reserve-not-met": "reserve-not-met",
};

function CompletedAuctionRow({ auction, onSelectVehicle }) {
    return (
        <tr
            className="hover:bg-gray-50/50 transition-colors"
        >
            {/* auction id */}
            <td className="px-6 py-4">
                <span className="text-[13px] font-semibold text-gray-500">
                    {auction.listingId || "N/A"}
                </span>
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

            {/* type */}
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

            {/* Sold To / Winner */}
            <td className="px-6 py-4">
                {auction.soldTo ? (
                    <div className="flex items-center gap-3">
                        <img
                            src={
                                auction.soldTo?.profileImageUrl ||
                                "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg"
                            }
                            alt={auction.soldTo?.name || "Winner"}
                            className="w-9 h-9 rounded-full object-cover shrink-0 border border-gray-200"
                        />

                        <div className="min-w-0">
                            <div className="text-[13px] font-semibold text-slate-700 truncate">
                                {auction.soldTo?.name || "---"}
                            </div>

                            <div className="text-[11px] text-slate-400 truncate">
                                {auction.soldTo?.email || "---"}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        <span className="text-[12px] font-semibold text-slate-500">
                            No Winner
                        </span>

                        <span className="text-[10px] text-slate-400">
                            {auction.auctionStatus === "unsold"
                                ? "No bids received"
                                : auction.auctionStatus === "reserve-not-met"
                                    ? "Reserve price not met"
                                    : "No winner assigned"}
                        </span>
                    </div>
                )}
            </td>

            {/* Sold Price */}
            <td className="px-6 py-4">
                <div className="font-semibold text-[13px]">
                    {auction.auctionStatus === "sold" && auction.currentBid != null ? (
                        <span className="text-green-600 font-bold">
                            AED {auction.currentBid.toLocaleString()}
                        </span>
                    ) : (
                        <span className="text-gray-400 text-[12px]">
                            Not Aplicable
                        </span>
                    )}
                </div>
            </td>

            {/* Reserve / Buy Now Price */}
            <td className="px-6 py-4">
                {auction.priceType === "reserve_price" ? (
                    <>
                        <div className="text-[10px] text-slate-400">Reserve Price</div>
                        <div className="font-bold text-gray-600 text-sm">
                            {auction.reservePrice != null
                                ? `AED ${auction.reservePrice.toLocaleString()}`
                                : "---"}
                        </div>
                    </>
                ) : (
                    <>
                        <div className="text-[10px] text-slate-400">Buy Now Price</div>
                        <div className="font-bold text-gray-600 text-sm">
                            {auction.buyNowPrice != null
                                ? `AED ${auction.buyNowPrice.toLocaleString()}`
                                : "---"}
                        </div>
                    </>
                )}
            </td>

            {/* starting bid Price */}
            <td className="px-6 py-4 font-bold text-gray-600 text-sm">
                {auction.startingBidPrice != null
                    ? `AED ${auction.startingBidPrice.toLocaleString()}`
                    : "---"}
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

            {/* completed date */}
            <td className="px-6 py-4 text-[13px] text-slate-700 leading-tight whitespace-nowrap">
                <div>
                    {auction.auctionEndDateTime
                        ? new Date(auction.auctionEndDateTime).toLocaleDateString(
                            "en-GB",
                            {
                                timeZone: "Asia/Dubai",
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            }
                        )
                        : "---"}
                </div>

                <div className="font-semibold">
                    {auction.auctionEndDateTime
                        ? new Date(auction.auctionEndDateTime).toLocaleTimeString(
                            "en-US",
                            {
                                timeZone: "Asia/Dubai",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                            }
                        )
                        : "---"}
                </div>
            </td>

            {/* Status Badge */}
            <td className="px-6 py-4">
                <span
                    className={`px-2 py-1 rounded-lg text-[11px] font-medium flex w-fit items-center gap-1.5
            ${auction.auctionStatus === "sold"
                            ? "text-green-600 bg-green-50 border border-green-100"
                            : auction.auctionStatus === "unsold"
                                ? "text-red-600 bg-red-50 border border-red-100"
                                : auction.auctionStatus === "reserve-not-met"
                                    ? "text-amber-600 bg-amber-50 border border-amber-100"
                                    : "text-gray-600 bg-gray-50 border border-gray-100"
                        }`}
                >
                    <span
                        className={`w-1.5 h-1.5 rounded-full
                ${auction.auctionStatus === "sold"
                                ? "bg-green-600"
                                : auction.auctionStatus === "unsold"
                                    ? "bg-red-600"
                                    : auction.auctionStatus === "reserve-not-met"
                                        ? "bg-amber-600"
                                        : "bg-gray-600"
                            }`}
                    ></span>

                    {formatLabel(auction.auctionStatus)}
                </span>
            </td>

            {/* actions */}
            <td className="px-6 py-4">
                <div className="flex gap-2">
                    <button
                        onClick={() => onSelectVehicle(auction)}
                        className="p-1 text-slate-400 hover:text-slate-600"
                    >
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

function CompletedAuctions({ onSelectVehicle, setCurrentPage }) {

    const [page, setPage] = useState(1);
    const [activeTab, setActiveTab] = useState("all completed");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date("2026-05-20"));

    const { data: allAuctions, isLoading, isError } = useGetAllAuctions(page, 10, statusMap[activeTab]);

    const allAuctionData = allAuctions?.vehicles || [];
    const totalPages = allAuctions?.pagination?.totalPages || 1;

    if (isLoading) return <p className="p-10 text-center">Loading completed auctions list....</p>;
    if (isError) return <p className="p-10 text-center text-red-500">Failed to load completed auctions list</p>;

    // tabs
    const tabs = [
        { id: 'all completed', label: 'All Completed' },
        { id: 'sold', label: 'Sold' },
        { id: 'unsold', label: 'Unsold' },
        { id: 'reserve-not-met', label: 'Reserve Not Met' },
    ];

    const highlightedDates = [
        {
            "highlight-high-sales": completedHighlights
                .filter(item => item.status === "highSales")
                .map(item => new Date(item.date)),
        },
        {
            "highlight-completed": completedHighlights
                .filter(item => item.status === "completed")
                .map(item => new Date(item.date)),
        },
        {
            "highlight-unsold": completedHighlights
                .filter(item => item.status === "unsold")
                .map(item => new Date(item.date)),
        },
    ];

    return (
        <div>
            <AuctionsHeader
                setCurrentPage={setCurrentPage}
                pageTitle="Completed Auctions"
                breadcrumbLabel="All Completed Auctions"
            />

            {/* stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {completedAuctionStats.map((stat, index) => {

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

                    {/* status */}
                    <div className="w-full sm:w-42.5">
                        <FilterDropdown
                            label="All Status"
                            options={[
                                { label: "NA", value: "na" },
                                { label: "NA", value: "na" }
                            ]}
                            value={selectedStatus}
                            onChange={setSelectedStatus}
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
                                        <th className="px-6 py-4 w-55">Sold To / Winner</th>
                                        <th className="px-6 py-4 w-40">Sold Price</th>
                                        <th className="px-6 py-4 w-40">Price Info</th>
                                        <th className="px-6 py-4 w-40">Starting Bid Price</th>
                                        <th className="px-6 py-4 w-30">Total Bids</th>
                                        <th className="px-6 py-4 w-40">Completed Date</th>
                                        <th className="px-6 py-4 w-43">Status</th>
                                        <th className="px-6 py-4 w-25">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-amber-50">
                                    {allAuctionData.length > 0 ? (
                                        allAuctionData.map((auction, index) => {
                                            return (
                                                <CompletedAuctionRow
                                                    key={auction._id || index}
                                                    auction={auction}
                                                    onSelectVehicle={onSelectVehicle}
                                                />
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={10}
                                                className="px-6 py-10 text-center text-sm text-gray-500"
                                            >
                                                No completed auctions found.
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

                    {/* calender */}
                    <div className=" bg-white border border-slate-200 rounded-2xl p-4">
                        <h3 className="text-sm font-semibold text-[#0B1E3D] mb-4">
                            Auction Completion Calendar
                        </h3>

                        <div className='bg-white border border-slate-200 rounded-2xl p-4 shadow-sm'>
                            <DatePicker
                                inline
                                selected={selectedDate}
                                highlightDates={highlightedDates}
                                onChange={(date) => setSelectedDate(date)}
                                calendarClassName="completed-auction-calendar"
                                openToDate={new Date("2026-05-21")}
                            />

                            <div className="space-y-2 text-[12px] border-t border-gray-200 pt-2.5">
                                <div className="flex items-center gap-2">
                                    <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                                    <span className="text-[#0B1E3D]">High Sales Day</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                                    <span className="text-[#0B1E3D]">Completed Auction</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                                    <span className="text-[#0B1E3D]">Unsold Auction</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* completion highlight */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-[#0B1E3D]">
                                Completion Highlights
                            </h3>
                            <span className="text-xs font-medium text-[#D97706] cursor-pointer hover:underline">
                                View All
                            </span>
                        </div>

                        <div className="space-y-4">
                            {highlights.map((item, index) => {
                                const IconComponent = item.icon;
                                return (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className={`p-2 rounded-xl ${item.theme}`}>
                                                <IconComponent className="w-3.5 h-3.5" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium">{item.title}</p>
                                                <p className="text-sm font-bold text-[#0B1E3D]">{item.value}</p>
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-400 font-medium">{item.date}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* support */}
                    <ContactSupport />
                </div>
            </div>

        </div>
    )
}

export default CompletedAuctions;
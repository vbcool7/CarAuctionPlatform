
import React, { useEffect, useState } from 'react';
import { Plus, ArrowDown, ArrowUp, Gavel, Radio, CalendarDays, CheckCircle, XCircle, CheckCircle2, PlusCircle, Eye, MoreVertical } from "lucide-react";
import FilterDropdown from '../../SharedComponents/FilterDropdown';
import SearchBar from '../../SharedComponents/SearchBar';
import SummaryDonutCard from '../../SharedComponents/SummaryDonutCard';
import DateRangePicker from '../../SharedComponents/DateRangePicker';

import { useGetAllAuctions, useGetAllAuctionStats } from '../../../hooks/useAuction';
import { formatLabel } from '../../utils/formatter';
import { getPaginationRange } from '../../utils/getPaginationRange';

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

const statusMap = {
    "all auctions": "all",
    "live": "live",
    "upcoming": "upcoming",
    "completed": "completed",
    "canceled": "canceled",
};

const getStatusStyles = (status) => {
    switch (status) {
        case "live":
            return "bg-green-50 text-green-600";

        case "upcoming":
            return "bg-blue-50 text-blue-600";

        case "sold":
            return "bg-emerald-50 text-emerald-600";

        case "unsold":
            return "bg-gray-100 text-gray-600";

        case "reserve-not-met":
            return "bg-orange-50 text-orange-600";

        case "canceled":
            return "bg-red-50 text-red-600";

        default:
            return "bg-gray-50 text-gray-600";
    }
};

const filterConfig = [
    {
        label: 'All Vehicle Type',
        key: 'vehicleType',
        options: ['sedan', 'suv', 'hatchback', 'coupe', 'convertible', 'wagon', 'pickup_truck', 'van', 'minivan', 'sports_car', 'luxury_car', 'electric_vehicle', 'motorcycle'],
    },
    {
        label: 'All Categories',
        key: 'fuelType',
        options: ['petrol', 'diesel', 'electric', 'hybrid', 'plug_in_hybrid', 'cng', 'lpg']
    },
];

const mapFiltersToParams = (filters, search, startDate, endDate) => {
    const params = {};
    if (filters.fuelType) params.fuelType = filters.fuelType;
    if (filters.vehicleType) params.vehicleType = filters.vehicleType;

    if (search) params.search = search;
    if (startDate) params.startDate = startDate.toISOString();
    if (endDate) params.endDate = endDate.toISOString();
    return params;
};

function AllAuctions({ setCurrentPage, setSelectedAuction }) {

    const [activeTab, setActiveTab] = useState("all auctions");
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [filters, setFilters] = useState({
        vehicleType: '',
        fuelType: '',
    });

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const params = mapFiltersToParams(filters, debouncedSearch, startDate, endDate);

    const { data: allAuctions, isLoading, isError } = useGetAllAuctions({ page, limit: 10, status: statusMap[activeTab], ...params });
    const { data: allAuctionStats } = useGetAllAuctionStats();

    const allAuctionData = allAuctions?.vehicles || [];
    const totalPages = allAuctions?.pagination?.totalPages || 1;
    const statsData = allAuctionStats?.data;

    useEffect(() => {
        setPage(1);
    }, [filters, search, startDate, endDate]);

    // debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 400);
        return () => clearTimeout(timer);
    }, [search]);

    const updateFilter = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    // stats
    const allAuctionsStats = [
        {
            title: "Total Auctions",
            value: statsData?.totalAuctions ?? 0,
            icon: Gavel,
            theme: "text-indigo-600 bg-indigo-50",
            subTitle: "No data from last month",
            subTextColor: "text-green-600",
            isPositive: true
        },
        {
            title: "Live Auctions",
            value: statsData?.liveAuctions ?? 0,
            icon: Radio,
            theme: "text-emerald-600 bg-emerald-50",
            subTitle: "No data from last month",
            subTextColor: "text-green-600",
            isPositive: true
        },
        {
            title: "Upcoming Auctions",
            value: statsData?.upcomingAuctions ?? 0,
            icon: CalendarDays,
            theme: "text-purple-600 bg-purple-50",
            subTitle: "No data from last month",
            subTextColor: "text-green-600",
            isPositive: true
        },
        {
            title: "Completed Auctions",
            value: statsData?.completedAuctions ?? 0,
            icon: CheckCircle,
            theme: "text-emerald-600 bg-emerald-50",
            subTitle: "No data from last month",
            subTextColor: "text-green-600",
            isPositive: true
        },
        {
            title: "Canceled Auctions",
            value: statsData?.canceledAuctions ?? 0,
            icon: XCircle,
            theme: "text-red-500 bg-red-50",
            subTitle: "No data from last month",
            subTextColor: "text-red-500",
            isPositive: false
        }
    ];

    if (isLoading) return <p className="p-10 text-center">Loading auctions list....</p>;
    if (isError) return <p className="p-10 text-center text-red-500">Failed to load auctions list</p>;

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
                            className="bg-white px-3 py-6 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center"
                        >
                            {/* Left Side: Text */}
                            <div>
                                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">{stat.title}</p>
                                <h3 className="text-xl font-bold text-slate-900 py-1">{stat.value}</h3>
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
                        <SearchBar
                            placeholder="Search by make, model, year or listing ID..."
                            value={search}
                            onChange={(value) => setSearch(value)}
                        />
                    </div>

                    {/* dropdown */}
                    {filterConfig.map(({ label, key, options }) => (
                        <div
                            key={key}
                            className="w-full sm:w-45"
                        >
                            <FilterDropdown
                                label={label}
                                options={options.map((opt) => ({
                                    label: opt,
                                    value: opt,
                                }))}
                                value={filters[key]}
                                onChange={(value) => updateFilter(key, value)}
                            />
                        </div>
                    ))}
                </div>

                {/* Row 2 */}
                <div className="flex flex-wrap items-center justify-between gap-3">

                    {/* Date Range */}
                    <DateRangePicker
                        startDate={startDate}
                        endDate={endDate}
                        onChange={(update) => {
                            setStartDate(update[0]);
                            setEndDate(update[1]);
                        }}
                    />

                    {/* clear btn */}
                    <button
                        type="button"
                        onClick={() => {
                            setSearch("");
                            setFilters({ vehicleType: '', fuelType: '' });
                            setStartDate(null);
                            setEndDate(null);
                        }}
                        className="flex items-center gap-1.5 h-9 px-1.5 text-xs font-semibold text-amber-600 underline underline-offset-4 decoration-amber-300 hover:text-amber-700 hover:decoration-amber-600 transition-all">
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
                            {["all auctions", "live", "upcoming", "completed", "canceled"].map((tab) => (
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
                                        <th className="px-6 py-4 w-35">Auction ID</th>
                                        <th className="px-6 py-4 w-75">Auction title / Vehicle</th>
                                        <th className="px-6 py-4 w-40">Auction Type</th>
                                        <th className="px-6 py-4 w-38">Start Date & Time</th>
                                        <th className="px-6 py-4 w-38">End Date & Time</th>
                                        <th className="px-6 py-4 w-50">Price / Bid</th>
                                        <th className="px-6 py-4 w-30">Bids</th>
                                        <th className="px-6 py-4 w-40">Status</th>
                                        <th className="px-6 py-4 w-25">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-amber-50">
                                    {allAuctionData.length > 0 ? (
                                        allAuctionData.map((auction, index) => {

                                            const status = auction.auctionStatus || auction.status || "Unknown";
                                            const statusStyles = getStatusStyles(status);

                                            return (
                                                <tr
                                                    key={auction._id || index}
                                                    className="hover:bg-gray-50/50 transition-colors"
                                                >
                                                    {/* id */}
                                                    <td className="px-6 py-4 text-[13px] font-medium text-slate-700 truncate">
                                                        {auction.listingId || "N/A"}
                                                    </td>

                                                    {/* auc detail */}
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

                                                    {/* price type */}
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

                                                    {/* End Date & Time */}
                                                    <td className="px-6 py-4 text-[13px] text-slate-700 leading-tight">
                                                        <div>
                                                            {auction.auctionEndDateTime
                                                                ? new Date(auction.auctionEndDateTime).toLocaleDateString("en-GB", {
                                                                    timeZone: "Asia/Dubai",
                                                                    day: "2-digit",
                                                                    month: "short",
                                                                    year: "numeric",
                                                                })
                                                                : "N/A"}
                                                        </div>

                                                        <div className="font-semibold">
                                                            {auction.auctionEndDateTime
                                                                ? new Date(auction.auctionEndDateTime).toLocaleTimeString("en-US", {
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

                                                    {/* Status */}
                                                    <td className="px-6 py-4">
                                                        <span
                                                            className={`px-2 py-1 rounded-full text-[10px] font-medium flex w-fit items-center gap-1.5 
                                                                ${statusStyles}`}
                                                        >
                                                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                                            {formatLabel(status)}
                                                        </span>
                                                    </td>

                                                    {/* Actions */}
                                                    <td className="px-6 py-4">
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedAuction(auction);

                                                                    if (status === "live") {
                                                                        setCurrentPage("live-auction-detail");
                                                                    } else if (status === "upcoming") {
                                                                        setCurrentPage("upcoming-auction-detail");
                                                                    } else if (
                                                                        ["sold", "unsold", "reserve-not-met"].includes(status)
                                                                    ) {
                                                                        setCurrentPage("completed-auction-detail");
                                                                    } else if (status === "canceled") {
                                                                        setCurrentPage("canceled-auction-detail");
                                                                    }
                                                                }}
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
                                        })
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={9}
                                                className="px-6 py-12 text-center"
                                            >
                                                <div className="flex flex-col items-center justify-center">
                                                    <p className="text-sm font-medium text-gray-500">
                                                        No Data Found
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        There are no auctions records available.
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

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
                </div>

                {/* right side - section */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">
                    <SummaryDonutCard
                        title="Quick Stats"
                        centerLabel="Total"
                        showPercentage={true}
                        segments={[
                            { name: 'Live', value: statsData?.liveAuctions?.count ?? 0, color: '#10B981' },
                            { name: 'Upcoming', value: statsData?.upcomingAuctions?.count ?? 0, color: '#3B82F6' },
                            { name: 'Completed', value: statsData?.completedAuctions?.count ?? 0, color: '#34D399' },
                            { name: 'Canceled', value: statsData?.canceledAuctions?.count ?? 0, color: '#EF4444' },
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
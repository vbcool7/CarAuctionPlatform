
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineTruck, HiViewGrid, HiViewList, HiOutlineUser, HiOutlineUserGroup, HiCamera } from 'react-icons/hi';
import { Gavel, Truck, Users, CircleDollarSign, ChevronRight, Settings, Fuel, GitBranch, Gauge } from "lucide-react";
import { MdOutlineMonetizationOn } from 'react-icons/md';
import { PiCarFill } from 'react-icons/pi';
import { formatDateTime, formatLabel, formatPrice } from '../utils/formatters';
import { getPaginationRange } from './utils/getPaginationRange';
import AuctionBottomFeaturesBar from './SharedComponents/AuctionBottomFeaturesBar';
import SearchBar from './SharedComponents/SearchBar';
import FilterDropdown from './SharedComponents/FilterDropdown';

import { useGetPublicAuctions } from '../hook/useAuction';
import AuctionSideFilter from './SharedComponents/AuctionSideFilter';

const stats = [
    { label: "Total Ended Auctions", value: "1,842", icon: <Gavel className="text-blue-600" />, bgColor: 'bg-blue-50' },
    { label: "Sold Vehicles", value: "1,256", icon: <Truck className="text-emerald-600" />, bgColor: 'bg-emerald-50' },
    { label: "Happy Bidders", value: "12,845", icon: <Users className="text-purple-600" />, bgColor: 'bg-purple-50' },
    { label: "Total Sales Value", value: "AED 220M+", icon: <CircleDollarSign className="text-orange-600" />, bgColor: 'bg-orange-50' },
];

const statisticsStats = [
    {
        icon: <PiCarFill className="text-green-500" size={18} />,
        label: 'Sold Vehicles',
        value: '1,256',
    },
    {
        icon: <HiOutlineUser className="text-green-500" size={18} />,
        label: 'Not Sold',
        value: '486',
    },
    {
        icon: <HiOutlineUserGroup className="text-green-500" size={18} />,
        label: 'Reserve Not Met',
        value: '100',
    },
    {
        icon: <MdOutlineMonetizationOn className="text-green-500" size={18} />,
        label: 'Total Sales Value',
        value: 'AED 220M+',
        highlight: true,
    },
];

const topMakes = [
    { rank: 1, name: 'BMW', count: 245 },
    { rank: 2, name: 'Mercedes-Benz', count: 210 },
    { rank: 3, name: 'Toyota', count: 165 },
    { rank: 4, name: 'Audi', count: 150 },
    { rank: 5, name: 'Land Rover', count: 120 },
];

const tabs = [
    { key: 'all', label: 'All Ended', status: 'ended' },
    { key: 'sold', label: 'Sold', status: 'sold' },
    { key: 'unsold', label: 'Not Sold', status: 'unsold' },
    { key: 'not-met', label: 'Reserve Not Met', status: 'reserve-not-met' },
];

const filterConfig = [
    {
        label: 'Sort By',
        key: 'sortBy',
        options: [
            { label: 'Recently Ended', value: 'recently_ended' },
            { label: 'Price: Low to High', value: 'price_low' },
            { label: 'Price: High to Low', value: 'price_high' },
        ],
    },
];

const getStatusBadge = (status) => {
    if (status === 'sold') {
        return {
            bg: 'bg-emerald-600', text: 'Sold'
        };
    }

    if (status === 'unsold') {
        return {
            bg: 'bg-red-600', text: 'Not Sold'
        };
    }

    if (status === 'reserve-not-met') {
        return {
            bg: 'bg-amber-500', text: 'Reserve Not Met'
        };
    }

    if (status === 'canceled') {
        return {
            bg: 'bg-slate-600', text: 'Cancelled'
        };
    }

    return {
        bg: 'bg-slate-500', text: 'Ended'
    };
};

// sidebar filter
const dayRange = (dateStr) => {
    if (!dateStr) return {};
    const from = new Date(dateStr); from.setHours(0, 0, 0, 0);
    const to = new Date(from); to.setDate(to.getDate() + 1);
    return { from: from.toISOString(), to: to.toISOString() };
};

function EndedAuctions() {

    const navigate = useNavigate();

    const [sidebarFilters, setSidebarFilters] = useState({});
    const [view, setView] = useState('list');
    const [activeTab, setActiveTab] = useState('all');
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [filters, setFilters] = useState({ sortBy: 'recently_ended' });

    const status = tabs.find((t) => t.key === activeTab).status;
    const endRange = dayRange(sidebarFilters.endDate);

    const { data, isLoading, isError } = useGetPublicAuctions({
        status, page, limit: 10, search: debouncedSearch, sort: filters.sortBy,
        category: sidebarFilters.vehicleType,
        make: sidebarFilters.make,
        fuelType: sidebarFilters.fuelType,
        emirate: sidebarFilters.emirate,
        minPrice: sidebarFilters.minPrice,
        maxPrice: sidebarFilters.maxPrice,
        endFrom: endRange.from,
        endTo: endRange.to,
    });

    const endedVehicles = data?.data ?? [];
    const totalPages = data?.pagination?.totalPages || 1;

    // debounce search
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 400);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        setPage(1);
    }, [filters, debouncedSearch, activeTab]);

    const updateFilter = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    if (isLoading) return <p className="p-10 text-center">Loading ended auctions....</p>;
    if (isError) return <p className="p-10 text-center text-red-500">Failed to load ended auctions</p>;

    return (
        <section className='w-full'>
            <div className='max-w-6xl mx-auto px-4 md:px-5 lg:px-6 py-8'>

                {/* Heading */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">Ended Auctions</h1>
                    <p className='text-sm text-slate-500'>Browse vehicles from completed auctions.</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="group bg-white border-2 border-slate-200 p-5 rounded-2xl flex items-center gap-4 shadow-md hover:shadow-xl hover:border-slate-300 transition-all duration-300"
                        >
                            <div className={`p-3.5 ${stat.bgColor} rounded-xl text-xl transition-transform duration-300 group-hover:scale-110`}>
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-2xl font-black text-slate-900 tracking-tight">
                                    {stat.value}
                                </p>
                                <p className="text-[11px] uppercase tracking-wider text-slate-600 font-bold mt-0.5">
                                    {stat.label}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Two-column layout */}
                <div className="flex flex-col md:flex-row gap-6 mt-15">

                    {/* =========================== Left =========================== */}
                    <div className="w-full md:w-[70%] space-y-4">

                        {/* Tabs */}
                        <div className="border-b border-slate-200">
                            <div className="flex gap-6">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.key
                                            ? 'border-[#D97706] text-[#D97706]'
                                            : 'border-transparent text-slate-500 hover:text-slate-700'
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Search + Sort + View */}
                        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mt-4">

                            <div className="relative w-full md:grow">
                                <SearchBar
                                    placeholder="Search by make, model, year or listing ID..."
                                    value={search}
                                    onChange={(value) => setSearch(value)}
                                />
                            </div>

                            <div className="flex items-center gap-2 w-full md:w-auto">

                                {filterConfig.map(({ label, key, options }) => (
                                    <div key={key} className="w-full sm:w-auto">
                                        <FilterDropdown
                                            label={label}
                                            options={options}
                                            value={filters[key]}
                                            onChange={(value) => updateFilter(key, value)}
                                        />
                                    </div>
                                ))}

                                <div className="flex border border-slate-200 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => setView('grid')}
                                        className={`px-3 py-2.5 ${view === 'grid' ? 'bg-slate-100 text-[#D97706]' : 'text-slate-500'}`}
                                    >
                                        <HiViewGrid size={20} />
                                    </button>

                                    <button
                                        onClick={() => setView('list')}
                                        className={`px-3 py-2.5 border-l border-slate-200 ${view === 'list' ? 'bg-slate-100 text-[#D97706]' : 'text-slate-500'}`}
                                    >
                                        <HiViewList size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* list */}
                        <div className="space-y-4 mt-2">
                            {endedVehicles.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 px-6 border border-slate-200 rounded-2xl bg-white">
                                    <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mb-4">
                                        <HiOutlineTruck className="text-[#D97706]" size={28} />
                                    </div>

                                    <h3 className="text-base font-bold text-[#0F172A]">
                                        No Ended Auctions Found
                                    </h3>

                                    <p className="text-sm text-slate-500 text-center mt-1">
                                        There are currently no ended auctions available.
                                    </p>
                                </div>
                            ) : (
                                endedVehicles.map((vehicle, index) => {

                                    const statusInfo = getStatusBadge(vehicle.auctionStatus);
                                    const isSold = vehicle.auctionStatus === 'sold';

                                    return (
                                        <div
                                            key={vehicle._id || index}
                                            className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row gap-6 transition-all hover:shadow-lg hover:border-slate-300">

                                            {/* Left: Image Section */}
                                            <div className="relative w-full sm:w-72 h-55 rounded-xl overflow-hidden shrink-0 group">
                                                <img
                                                    src={vehicle.image}
                                                    alt={`${vehicle.year} ${formatLabel(vehicle.make)} ${formatLabel(vehicle.model)}`}
                                                    className="w-full h-full object-cover"
                                                />

                                                {/* Status Badge */}
                                                <div
                                                    className={`absolute top-3 left-3 ${statusInfo.bg} text-white text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider flex items-center gap-1.5`}>
                                                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                                                    {statusInfo.text}
                                                </div>

                                                {/* Photo Count */}
                                                <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-md text-white text-[10px] font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10">
                                                    <HiCamera size={14} /> {vehicle.imageCount ?? 0} Photos
                                                </div>
                                            </div>

                                            {/* Right: Content Section */}
                                            <div className="flex flex-1 flex-col justify-between">
                                                <div>
                                                    <div className="flex justify-between items-start">
                                                        <h3 className="text-xl font-bold text-[#0F172A]">
                                                            {`${vehicle.year} ${formatLabel(vehicle.make)} ${formatLabel(vehicle.model)}`}
                                                        </h3>
                                                        <span className="text-[11px] font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                                                            {vehicle.listingId || 'NA'}
                                                        </span>
                                                    </div>

                                                    {/* Quick Specs */}
                                                    <div className="flex gap-2 text-[11px] text-slate-600 flex-wrap mb-6 mt-2">
                                                        <div className="flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                                            <Settings size={12} className="text-[#D97706]" /> {formatLabel(vehicle.transmission)}
                                                        </div>
                                                        <div className="flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                                            <Gauge size={12} className="text-[#D97706]" /> {formatLabel(vehicle.bodyType)}
                                                        </div>
                                                        <div className="flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                                            <Fuel size={12} className="text-[#D97706]" /> {formatLabel(vehicle.fuelType)}
                                                        </div>
                                                        <div className="flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                                            <GitBranch size={12} className="text-[#D97706]" /> {formatLabel(vehicle.drivetrain)}
                                                        </div>
                                                    </div>

                                                    {/* Meta Info Row */}
                                                    <div className="grid grid-cols-4 gap-4 mb-4">
                                                        <div>
                                                            <p className="text-[9px] uppercase text-slate-400 font-bold tracking-wider">End Date</p>
                                                            <p className="text-xs font-bold text-[#0F172A]">{formatDateTime(vehicle.soldOn || vehicle.auctionEndDateTime)}</p>
                                                            {/* <p className="text-xs font-bold text-gray-500 pt-0.5">{vehicle.endedTime}</p> */}
                                                        </div>
                                                        <div>
                                                            <p className="text-[9px] uppercase text-slate-400 font-bold tracking-wider">Location</p>
                                                            <p className="text-xs font-bold text-[#0F172A] flex items-center gap-1">
                                                                {formatLabel(vehicle.emirate)}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[9px] uppercase text-slate-400 font-bold tracking-wider">Bidders</p>
                                                            <p className="text-xs font-bold text-[#0F172A] flex items-center gap-1">
                                                                {vehicle.totalBids ?? 0}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[9px] uppercase text-slate-400 font-bold tracking-wider">Views</p>
                                                            <p className="text-xs font-bold text-[#0F172A] flex items-center gap-1">
                                                                {vehicle.views ?? 0}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Footer */}
                                                <div className="flex items-center gap-4 mt-2">
                                                    <div className="flex items-center border border-slate-100 rounded-xl bg-slate-50/50 flex-1">
                                                        <div className="p-3 flex-1">
                                                            <p className="text-[9px] uppercase text-slate-400 font-bold tracking-widest">
                                                                {isSold ? 'Sold Price' : 'Highest Bid'}
                                                            </p>
                                                            <p className={`text-sm font-bold ${isSold ? 'text-emerald-600' : 'text-red-600'}`}>
                                                                {isSold
                                                                    ? formatPrice(vehicle.soldPrice)
                                                                    : vehicle.currentBid != null
                                                                        ? formatPrice(vehicle.currentBid)
                                                                        : 'No bids'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() => navigate(`/ended-auctions-detail/${vehicle._id}`)}
                                                        className="bg-[#0B1E3D] text-white px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-1 hover:bg-[#1e3a6a] transition-all"
                                                    >
                                                        View Details <ChevronRight size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            )}

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
                                            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
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
                                            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                        >
                                            Next
                                        </button>

                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* =========================== Right =========================== */}
                    <div className="w-full md:w-[30%] space-y-4">

                        {/* auction filter */}
                        <AuctionSideFilter variant="ended" onApply={setSidebarFilters} />

                        {/* statis card */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                            <h3 className="font-bold text-[#0F172A] mb-4">Auction Statistics</h3>

                            <div className="space-y-3">
                                {statisticsStats.map((stat, idx) => (
                                    <div key={idx} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {stat.icon}
                                            <span className="text-sm text-slate-600">{stat.label}</span>
                                        </div>
                                        <span className={`text-sm font-semibold ${stat.highlight ? 'text-[#D97706]' : 'text-[#0F172A]'}`}>
                                            {stat.value}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <button className="mt-5 w-full border border-[#D97706] text-[#D97706] py-2.5 rounded-lg text-sm font-semibold hover:bg-[#D97706]/5 transition cursor-pointer">
                                View Full Report
                            </button>
                        </div>

                        {/* top selling */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                            <h3 className="font-bold text-[#0F172A] mb-4">Top Selling Makes</h3>

                            <div className="space-y-3">
                                {topMakes.map((make) => (
                                    <div key={make.rank} className="flex items-center gap-3">
                                        {/* Rank */}
                                        <span className="text-sm text-slate-400 w-4 shrink-0">{make.rank}</span>

                                        {/* Logo placeholder */}
                                        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                            <span className="text-[10px] font-bold text-slate-400">
                                                {make.name.slice(0, 1)}
                                            </span>
                                        </div>

                                        {/* Name */}
                                        <span className="text-sm text-slate-700 flex-1">{make.name}</span>

                                        {/* Count */}
                                        <span className="text-sm font-semibold text-[#0F172A]">{make.count}</span>
                                    </div>
                                ))}
                            </div>

                            <button className="mt-5 w-full border border-[#D97706] text-[#D97706] py-2.5 rounded-lg text-sm font-semibold hover:bg-[#D97706]/5 transition cursor-pointer">
                                View All Makes
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            <AuctionBottomFeaturesBar />
        </section>
    )
}

export default EndedAuctions;
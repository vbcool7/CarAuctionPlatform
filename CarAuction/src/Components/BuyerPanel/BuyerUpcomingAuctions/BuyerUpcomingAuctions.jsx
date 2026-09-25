
import React, { useRef, useState, useEffect } from 'react';
import { LayoutGrid, List, Heart, MapPin, User, Calendar, Clock, CheckCircle, Bell, } from 'lucide-react';
import { HiChevronDown } from 'react-icons/hi';

import BuyerUpcomingAuctionsCalender from './BuyerUpcomingAuctionsCalender';
import { useGetAllAuctions } from '../../../hook/useAuction';
import { formatLabel } from '../../../utils/formatters';
import { AuctionCountdown } from '../BuyerLiveAuctions/BuyerLiveAuctions';
import { getPaginationRange } from '../../utils/getPaginationRange';
import FilterDropdown from '../BuyerSharedComponents/FilterDropdown';

// ===== Single Dropdown =====
function CustomDropdown({ label, options, placeholder }) {

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(placeholder);
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="mb-5" ref={ref}>
            <label className="block text-sm font-semibold text-[#0F172A] mb-2">{label}</label>
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setOpen((prev) => !prev)}
                    className="w-full flex items-center justify-between px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#D97706]/20"
                >
                    <span className={selected === placeholder ? 'text-slate-400' : 'text-slate-700'}>
                        {selected}
                    </span>
                    <HiChevronDown
                        className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
                        size={18}
                    />
                </button>

                {open && (
                    <ul className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-56 overflow-y-auto">
                        {options.map((option) => (
                            <li key={option}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelected(option);
                                        setOpen(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-50 ${selected === option ? 'text-[#D97706] font-medium bg-orange-50' : 'text-slate-700'
                                        }`}
                                >
                                    {option}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

// ===== Static option lists =====
const locations = ['All Locations', 'Dubai, UAE', 'Abu Dhabi, UAE', 'Sharjah, UAE'];
const vehicleTypes = ['All Types', 'Luxury Sedan', 'Luxury SUV', 'Luxury Coupe', 'Pickup Truck'];
const years = ['All Years', '2023', '2022', '2021', '2020', '2019'];
const endsWithin = ['Any Time', 'Ending in 15 mins', 'Ending in 1 hour', 'Ending in 3 hours', 'Ending Today'];
const auctionTypes = ['All Types', 'Live Auction', 'Sealed Bid', 'Reserve Auction'];
const makes = ['All Makes', 'BMW', 'Mercedes-Benz', 'Porsche', 'Range Rover', 'Audi'];

const filterConfig = [
    {
        label: 'Sort By',
        key: 'sortBy',
        options: ['price_low_high', 'price_high_low', 'newest',],
    },
];

const mapFiltersToParams = (filters) => {
    const params = {};
    if (filters.sortBy) params.sortBy = filters.sortBy;
    return params;
};

function BuyerUpcomingAuctions({ setCurrentPage, setSelectedVehicleId }) {

    const [activeTab, setActiveTab] = useState('all');
    const [page, setPage] = useState(1);
    const [view, setView] = useState('grid');
    const [filters, setFilters] = useState({
        sortBy: ''
    });

    const params = mapFiltersToParams(filters);
    const dateFilter = activeTab === 'all' ? '' : activeTab;
    const { data: allAuctions, isLoading, isError } = useGetAllAuctions({ tab: 'upcoming', dateFilter, page, limit: 10, ...params });

    const auctions = allAuctions?.data || [];
    const totalPages = allAuctions?.pagination?.totalPages || 1;

    useEffect(() => {
        setPage(1);
    }, [activeTab]);

    const updateFilter = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const tabs = [
        { name: 'all', label: 'All Upcoming', count: 0 },
        { name: 'today', label: 'Today', count: 0 },
        { name: 'this_week', label: 'This Week', count: 0 },
        { name: 'next_week', label: 'Next Week', count: 0 },
    ];

    if (isLoading) return <p className="p-10 text-center">Loading auctions....</p>;
    if (isError) return <p className="p-10 text-center text-red-500">Failed to load auctions list</p>;

    return (
        <div className='pb-6'>

            <div className='pb-7'>
                <h1 className='text-slate-800 text-xl md:text-2xl font-bold'>Upcoming Auctions</h1>
                <p className='pt-1 text-gray-600 text-[12px] md:text-sm font-medium'>View and participate in auctions happening soon.</p>
            </div>

            {/* tabs */}
            <div className="flex justify-between items-end border-b border-slate-200 mb-6 overflow-x-auto no-scrollbar">

                <div className="flex gap-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.name}
                            onClick={() => setActiveTab(tab.name)}
                            className={`pb-4 text-[13px] md:text-sm font-semibold transition-all relative whitespace-nowrap
                                ${activeTab === tab.name
                                    ? 'text-[#0B1E3D]'
                                    : 'text-slate-400 hover:text-[#0B1E3D]'
                                }`}
                        >
                            {tab.label} ({tab.count})
                            {activeTab === tab.name && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#D97706] rounded-t-full" />
                            )}
                        </button>
                    ))}
                </div>

                {/* View Toggle */}
                <div className="hidden md:flex gap-2 border border-slate-200 rounded-lg p-1 mb-2">
                    <button
                        onClick={() => setView('grid')}
                        className={`p-1.5 rounded-md transition-all ${view === 'grid' ? 'bg-[#0B1E3D] text-white' : 'text-slate-400 hover:text-[#0B1E3D]'}`}
                    >
                        <LayoutGrid size={18} />
                    </button>
                    <button
                        onClick={() => setView('list')}
                        className={`p-1.5 rounded-md transition-all ${view === 'list' ? 'bg-[#0B1E3D] text-white' : 'text-slate-400 hover:text-[#0B1E3D]'}`}
                    >
                        <List size={18} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* ============================= LEFT ============================= */}
                <div className="lg:col-span-8">

                    <div className='w-full'>

                        {/* Top Bar */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-5">

                            <p className="text-[12px] md:text-sm text-slate-500 font-medium">
                                {/* Showing {indexOfFirstItem + 1} – {Math.min(indexOfLastItem, upcomingVehicles.length)} of {upcomingVehicles.length} upcoming auctions */}
                            </p>

                            <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
                                <span className="text-[12px] md:text-sm text-slate-600 font-medium whitespace-nowrap">Sort by:</span>
                                {filterConfig.map(({ label, key, options }) => (
                                    <div
                                        key={key}
                                        className="w-full sm:w-41"
                                    >
                                        <FilterDropdown
                                            label={label}
                                            options={options.map((opt) =>
                                                typeof opt === 'string'
                                                    ? { label: opt, value: opt }
                                                    : opt
                                            )}
                                            value={filters[key]}
                                            onChange={(value) => updateFilter(key, value)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* cards */}
                        <div className={`grid gap-6 ${view === 'list' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
                            {auctions?.length > 0 ? (
                                auctions.map((item, index) => (
                                    <div
                                        key={item._id || index}
                                        className={`group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300
                                            ${view === 'list'
                                                ? 'flex flex-col sm:flex-row'
                                                : 'flex flex-col'
                                            }`}
                                    >
                                        {/* IMAGE */}
                                        <div
                                            className={`relative overflow-hidden bg-slate-100 shrink-0
                                                ${view === 'list'
                                                    ? 'w-full sm:w-72 md:w-80 h-52 sm:h-auto'
                                                    : 'w-full h-52'
                                                }`}
                                        >
                                            <img
                                                src={item.images?.[0]?.url || null}
                                                alt={formatLabel(item.model) || 'Vehicle'}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />

                                            {/* Image overlay */}
                                            <div className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-black/10 pointer-events-none" />

                                            {/* Countdown */}
                                            <div className="absolute top-3 left-3">
                                                <div className="inline-flex items-center bg-[#0B1E3D]/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-semibold shadow-md">
                                                    <AuctionCountdown item={item} />
                                                </div>
                                            </div>

                                            {/* Heart */}
                                            <button
                                                className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full text-slate-500 hover:text-red-500 hover:bg-white transition-all duration-200 shadow-sm"
                                            >
                                                <Heart size={17} />
                                            </button>

                                            {/* Listing ID */}
                                            <div className="absolute bottom-3 left-3">
                                                <span className="inline-flex bg-black/65 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wide">
                                                    {item.listingId || '--'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* CONTENT */}
                                        <div
                                            className={`flex flex-col flex-1 min-w-0 ${view === 'list' ? 'p-4 md:p-5' : 'p-4 md:p-5'}`}
                                        >
                                            {/* Top Content */}
                                            <div className="flex-1">

                                                {/* Business Name + Status */}
                                                <div className="flex items-start justify-between gap-3">
                                                    <h3 className="text-base md:text-lg font-bold text-[#0B1E3D] line-clamp-1">
                                                        {item.sellerInfo?.businessName || 'Business Name'}
                                                    </h3>

                                                    {item.status === 'approved' && (
                                                        <div className="shrink-0 flex items-center gap-1 px-2 py-1 rounded-md bg-blue-50 text-blue-600 text-[10px] font-semibold">
                                                            <CheckCircle size={13} />
                                                            Verified
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Seller + Location */}
                                                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2.5 text-xs md:text-sm">

                                                    <div className="flex items-center gap-1.5 text-slate-500">
                                                        <MapPin size={14} className="text-[#D97706]" />
                                                        <span>
                                                            {formatLabel(item.emirate)}, {formatLabel(item.city)}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-1.5 text-slate-500">
                                                        <User size={14} className="text-slate-400" />
                                                        <span className="text-slate-700 font-medium">
                                                            {item.sellerInfo?.fullName || '--'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Description */}
                                                <p className="text-xs md:text-sm text-slate-500 mt-3 line-clamp-2 leading-relaxed">
                                                    {item.sellerInfo?.businessDescription || 'No business description available.'}
                                                </p>
                                            </div>

                                            {/* Divider */}
                                            <div className="border-t border-slate-100 mt-4 pt-4">

                                                <div
                                                    className={`flex gap-4
                                                        ${view === 'list'
                                                            ? 'flex-col sm:flex-row sm:items-center sm:justify-between'
                                                            : 'flex-col sm:flex-row sm:items-center sm:justify-between'
                                                        }`}
                                                >

                                                    {/* Auction Date & Time */}
                                                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg">
                                                        <Calendar size={15} className="text-[#D97706] flex-shrink-0" />

                                                        <div>
                                                            <p className="text-xs font-semibold text-slate-700">
                                                                {new Date(item.auctionStartDateTime).toLocaleDateString(
                                                                    "en-GB",
                                                                    {
                                                                        timeZone: "Asia/Dubai",
                                                                        day: "2-digit",
                                                                        month: "short",
                                                                        year: "numeric",
                                                                    }
                                                                )}
                                                            </p>

                                                            <p className="text-[11px] text-slate-500 mt-0.5">
                                                                {new Date(item.auctionStartDateTime).toLocaleTimeString(
                                                                    "en-US",
                                                                    {
                                                                        timeZone: "Asia/Dubai",
                                                                        hour: "2-digit",
                                                                        minute: "2-digit",
                                                                        hour12: true,
                                                                    }
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Button */}
                                                    <button
                                                        onClick={() => {
                                                            setSelectedVehicleId(item._id);
                                                            setCurrentPage("upcoming-auctions-detail");
                                                        }}
                                                        className={`inline-flex items-center justify-center px-5 py-2.5 bg-[#D97706] text-white text-xs font-bold rounded-lg hover:bg-[#0B1E3D] transition-all duration-200 active:scale-[0.98] shadow-sm
                                                            ${view === 'grid'
                                                                ? 'w-full sm:w-auto'
                                                                : 'w-full sm:w-auto'
                                                            }`}
                                                    >
                                                        View Auction
                                                    </button>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full flex flex-col items-center justify-center py-16 px-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
                                    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 mb-4">
                                        <Calendar size={28} />
                                    </div>

                                    <h3 className="text-md font-bold text-[#0B1E3D]">
                                        No Upcoming Auctions
                                    </h3>

                                    <p className="text-sm text-slate-500 text-center mt-2 max-w-md">
                                        There are currently no upcoming auctions available. Please check back later for new auctions.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {auctions?.length > 0 && totalPages > 1 && (
                            <div className="flex items-center justify-between gap-4 px-5 py-4 mt-5">
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-between gap-4 px-5 py-4 mt-5 ">
                                        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
                                            <span>Page</span>

                                            <span className="inline-flex items-center justify-center min-w-7 h-7 px-2 rounded-lg bg-slate-50 border border-slate-100 font-bold text-[#0B1E3D]">
                                                {page}
                                            </span>

                                            <span>of</span>

                                            <span className="font-semibold text-[#0B1E3D]">
                                                {totalPages}
                                            </span>
                                        </div>

                                        {/* Pagination */}
                                        <div className="flex items-center gap-1.5 mx-auto sm:mx-0 sm:ml-auto">
                                            <button
                                                type="button"
                                                onClick={() => setPage((p) => p - 1)}
                                                disabled={page === 1}
                                                className=" h-9 px-3.5 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-xs font-semibold text-[#0B1E3D] hover:bg-slate-50 hover:border-[#0B1E3D] disabled:opacity-35 disabled:cursor-not-allowed transition-all duration-200"
                                            >
                                                Previous
                                            </button>

                                            <div className="flex items-center gap-1">
                                                {getPaginationRange(page, totalPages).map((num, idx) =>
                                                    num === "..." ? (
                                                        <span
                                                            key={`dot-${idx}`}
                                                            className=" w-8 h-9 flex items-center justify-center text-xs font-semibold text-slate-400"
                                                        >
                                                            ...
                                                        </span>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            key={num}
                                                            onClick={() => setPage(num)}
                                                            className={` w-9 h-9 flex items-center justify-center rounded-lg text-xs font-bold border transition-all duration-200
                                                                                                ${page === num
                                                                    ? "bg-[#0B1E3D] text-white border-[#0B1E3D] shadow-md shadow-slate-200 scale-[1.02]"
                                                                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-[#0B1E3D] hover:text-[#0B1E3D]"
                                                                }`}
                                                        >
                                                            {num}
                                                        </button>
                                                    )
                                                )}
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => setPage((p) => p + 1)}
                                                disabled={page === totalPages}
                                                className=" h-9 px-3.5 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-xs font-semibold text-[#0B1E3D] hover:bg-slate-50 hover:border-[#0B1E3D] disabled:opacity-35 disabled:cursor-not-allowed transition-all duration-200"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </div>

                {/* ============================= RIGHT ============================= */}
                <div className="lg:col-span-4 flex flex-col gap-6">

                    {/* filters */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm h-full">
                        <div className="hidden lg:flex items-center justify-between mb-5">
                            <h3 className="font-bold text-[#0F172A]">Filter Auctions</h3>
                            <button className="text-sm font-medium text-[#D97706] hover:underline">Reset</button>
                        </div>

                        <CustomDropdown label="Location" options={locations} placeholder="All Locations" />
                        <CustomDropdown label="Seller" options={['All Sellers', 'Al Yousuf Motors', 'GCC Auto Traders']} placeholder="All Sellers" />
                        <CustomDropdown label="Vehicle Type" options={vehicleTypes} placeholder="All Vehicle Types" />
                        <CustomDropdown label="Make" options={makes} placeholder="All Makes" />

                        {/* Date Range Section */}
                        <div className="mb-5 grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-sm font-semibold text-[#0F172A] mb-2">Start Date</label>
                                <input
                                    type="date"
                                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#D97706]/20"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#0F172A] mb-2">End Date</label>
                                <input
                                    type="date"
                                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#D97706]/20"
                                />
                            </div>
                        </div>

                        <button
                            className="w-full bg-[#0B1E3D] text-white py-2.5 rounded-lg text-sm font-semibold 
  transition-all duration-200 
  hover:bg-[#1a2d4d] hover:scale-[1.02] 
  active:scale-[0.98]"
                        >
                            Apply Filters
                        </button>
                    </div>

                    {/* calender */}
                    <BuyerUpcomingAuctionsCalender />

                    {/* manage notification card */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

                        <h3 className="font-bold text-[#0B1E3D] text-lg mb-2">
                            Never Miss an Auction
                        </h3>
                        <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                            Get notified about upcoming auctions that match your preferences.
                        </p>

                        <button
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5  bg-white border border-[#0B1E3D] text-[#0B1E3D] font-bold rounded-lg  hover:bg-[#0B1E3D] hover:text-white transition-all duration-300"
                        >
                            <Bell size={18} />
                            Manage Notifications
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default BuyerUpcomingAuctions;
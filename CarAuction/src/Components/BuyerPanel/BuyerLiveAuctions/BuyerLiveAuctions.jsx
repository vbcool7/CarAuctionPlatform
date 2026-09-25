
import React, { useEffect, useState } from 'react';
import { Gavel, Users, Car, Clock, LayoutGrid, List, Heart, MapPin, Gauge, Headset, Award, CreditCard, ArrowRight, ChevronRight, Wifi, Wallet, Zap, Lightbulb, User, Bell } from 'lucide-react';

import SearchBar from '../BuyerSharedComponents/Searchbar';
import FilterDropdown from '../BuyerSharedComponents/FilterDropdown';
import { formatLabel, formatPrice } from '../../../utils/formatters';
import { useGetTopBidders } from '../../../hook/useBid';
import { getPaginationRange } from '../../utils/getPaginationRange';
import { useGetAllAuctions, useGetDistinctMakes, useGetDistinctModel } from '../../../hook/useAuction';
import { UseCountDown } from '../BuyerSharedComponents/UseCountDown';

const stats = [
    {
        title: 'Live Auctions',
        value: '12',
        color: 'bg-indigo-50',
        iconColor: 'text-indigo-600',
        icon: <Gavel size={24} />
    },
    {
        title: 'Active Bidders',
        value: '342',
        color: 'bg-emerald-50',
        iconColor: 'text-emerald-600',
        icon: <Users size={24} />
    },
    {
        title: 'Vehicles in Auction',
        value: '98',
        color: 'bg-orange-50',
        iconColor: 'text-orange-500',
        icon: <Car size={24} />
    },
    {
        title: 'Average Time Left',
        value: '02:45:18',
        color: 'bg-blue-50',
        iconColor: 'text-blue-600',
        icon: <Clock size={24} />
    },
];

// how it work
const steps = [
    { icon: Headset, title: 'Join Live Auction', desc: 'Browse and join any live auction.' },
    { icon: Gavel, title: 'Place Your Bid', desc: 'Bid in real-time and compete with others.' },
    { icon: Award, title: 'Highest Bid Wins', desc: 'If you\'re the highest bidder, you win.' },
    { icon: CreditCard, title: 'Complete Payment', desc: 'Make payment and we\'ll handle the rest.' },
];

// auctions tips
const tipsData = [
    {
        icon: Wifi,
        title: 'Stay connected',
        description: 'Ensure a stable internet connection.',
    },
    {
        icon: Clock,
        title: 'Watch the timer',
        description: 'Keep an eye on the countdown.',
    },
    {
        icon: Wallet,
        title: 'Set your budget',
        description: 'Know your limit and stick to it.',
    },
    {
        icon: Zap,
        title: 'Act fast',
        description: 'Place your bids before time runs out.',
    },
];

// count down 
export const AuctionCountdown = ({ item }) => {
    const timeLeft = UseCountDown(
        item.auctionStatus === 'live'
            ? item.auctionEndDateTime
            : item.auctionStatus === 'upcoming'
                ? item.auctionStartDateTime
                : null
    );

    if (item.auctionStatus === 'live') {
        return (
            <>
                <Clock size={10} className='text-white' />
                <p className="font-bold text-white text-[10px]">
                    {timeLeft.days > 0 && `${timeLeft.days}d `}
                    {timeLeft.hours}h {timeLeft.mins}m {timeLeft.secs}s
                </p>
            </>
        );
    }

    if (item.auctionStatus === 'upcoming') {
        return (
            <>
                <div className='flex items-center gap-1'>
                <Clock size={10} className='text-white' />
                <p className="font-bold text-white text-[10px]">
                    {timeLeft.days > 0 && `${timeLeft.days}d `}
                    {timeLeft.hours}h {timeLeft.mins}m {timeLeft.secs}s
                </p>
                </div>
            </>
        );
    }

    return null;
}

const mapFiltersToParams = (filters) => {
    const params = {};
    if (filters.allMakes && filters.allMakes !== 'all') params.make = filters.allMakes;
    if (filters.allModels && filters.allModels !== 'all') params.model = filters.allModels;
    if (filters.priceRange && filters.priceRange !== 'all') params.priceRange = filters.priceRange;
    if (filters.bodyType && filters.bodyType !== 'all') params.bodyType = filters.bodyType;
    if (filters.sortBy) params.sortBy = filters.sortBy;
    return params;
};

function BuyerLiveAuctions({ setCurrentPage, setSelectedVehicleId }) {

    const [search, setSearch] = useState();
    const [page, setPage] = useState(1);
    const [view, setView] = useState('grid');
    const [bidderLimit, setBidderLimit] = useState(10);

    const [filters, setFilters] = useState({
        allMakes: '',
        allModels: '',
        allYears: '',
        priceRange: '',
        bodyType: '',
        sortBy: '',
    });

    const params = mapFiltersToParams(filters);

    const { data: makesData } = useGetDistinctMakes();
    const { data: modelData } = useGetDistinctModel(filters.allMakes);
    const { data: allAuctions, isLoading, isError } = useGetAllAuctions({ tab: 'live', page, limit: 10, search, ...params });
    const { data: topBiddersData } = useGetTopBidders(bidderLimit);

    const auctions = allAuctions?.data || [];
    const totalPages = allAuctions?.pagination?.totalPages || 1;
    const bidders = topBiddersData?.data || [];
    const hasMore = topBiddersData?.hasMore || false;

    useEffect(() => {
        setPage(1);
    }, [filters.allMakes, filters.allModels, filters.priceRange, filters.bodyType, filters.sortBy, search]);

    const updateFilter = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const filterConfig = [
        {
            label: 'All Makes',
            key: 'allMakes',
            options: makesData?.data || [],
        },
        {
            label: 'All Models',
            key: 'allModels',
            options: modelData?.data || [],
        },
        {
            label: 'Price Range',
            key: 'priceRange',
            options: [
                { label: 'Under 50K', value: '0-50000' },
                { label: '50K - 100K', value: '50000-100000' },
                { label: '100K+', value: '100000-999999999' },
            ],
        },
        {
            label: 'Body Type',
            key: 'bodyType',
            options: ['sedan', 'suv', 'hatchback', 'coupe', 'convertible', 'wagon', 'pickup_truck', 'van', 'minivan', 'roadster', 'crossover'],
        },
        {
            label: 'Sort By',
            key: 'sortBy',
            options: ['price_low_high', 'price_high_low', 'ending_soon', 'newest',],
        },
    ];

    if (isLoading) return <p className="p-10 text-center">Loading auctions....</p>;
    if (isError) return <p className="p-10 text-center text-red-500">Failed to load auctions list</p>;

    return (
        <div className='pb-6'>

            {/* Header */}
            <div className='pb-3'>
                <h1 className='text-slate-800 text-xl md:text-2xl font-bold flex items-center gap-2'>
                    Live Auctions
                </h1>
                <p className='pt-1 text-gray-600 text-[12px] md:text-sm font-medium'>
                    Join live auctions and bid in real-time on vehicles.
                </p>
            </div>

            {/* stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 py-8">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="group relative bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                    >
                        {/* Top Accent */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-[#D97706] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div className="p-5 flex items-center justify-between gap-4">

                            {/* Content */}
                            <div className="min-w-0 flex-1">
                                <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-2 truncate">
                                    {stat.title}
                                </p>

                                <h4 className="text-2xl md:text-3xl font-extrabold text-[#0B1E3D] tracking-tight leading-none truncate">
                                    {stat.value}
                                </h4>
                            </div>

                            {/* Icon */}
                            <div
                                className={`w-12 h-12 rounded-xl ${stat.color} ${stat.iconColor} flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-110 group-hover:rotate-2 transition-all duration-300`}
                            >
                                {stat.icon}
                            </div>
                        </div>

                        {/* Bottom subtle line */}
                        <div className="mx-5 mb-4 h-px bg-slate-100 group-hover:bg-amber-100 transition-colors duration-300" />

                        {/* Footer */}
                        <div className="px-5 pb-4 flex items-center justify-between">
                            <span className="text-[10px] font-medium text-slate-400">
                                Auction Overview
                            </span>

                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                    </div>
                ))}
            </div>

            {/* ========= filters section ========== */}
            <div className="w-full bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
                <div className="mb-4">
                    <SearchBar
                        placeholder="Search by make, model, year or listing ID..."
                        value={search}
                        onChange={(value) => setSearch(value)}
                    />
                </div>

                <div className="flex flex-wrap gap-3 mb-3">
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

                <div className="flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() =>
                            setFilters({
                                allMakes: 'all',
                                allModels: 'all',
                                allYears: 'all',
                                priceRange: 'all',
                                bodyType: 'all',
                                sortBy: 'newest',
                            })
                        }
                        className="flex items-center gap-1.5 h-9 px-1.5 text-xs font-semibold text-amber-600 underline underline-offset-4 decoration-amber-300 hover:text-amber-700 hover:decoration-amber-600 transition-all">
                        Clear Filters
                    </button>

                    <div className="hidden md:flex border border-slate-200 rounded-lg p-1 shrink-0">
                        <button
                            onClick={() => setView('grid')}
                            className={`p-1.5 rounded ${view === 'grid' ? 'bg-[#0B1E3D] text-white' : 'text-slate-400'}`}>
                            <LayoutGrid size={18} />
                        </button>
                        <button
                            onClick={() => setView('list')}
                            className={`p-1.5 rounded ${view === 'list' ? 'bg-[#0B1E3D] text-white' : 'text-slate-400'}`}>
                            <List size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Layout */}
            <div className='grid grid-cols-1 xl:grid-cols-12 gap-8 items-start mt-6'>

                {/* Left */}
                <div className='lg:col-span-8 flex flex-col gap-6'>

                    {/* Cards */}
                    <div
                        className={`grid gap-6 ${view === 'grid'
                                ? 'grid-cols-1 md:grid-cols-2'
                                : 'grid-cols-1'
                            }`}
                    >
                        {auctions?.length > 0 ? (
                            auctions.map((item, index) => (
                                <div
                                    key={item._id || index}
                                    className={`bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex
                    ${view === 'list' ? 'flex-row' : 'flex-col'}`}
                                >
                                    <div
                                        className={`relative ${view === 'list'
                                                ? 'w-70 h-full shrink-0'
                                                : 'w-full h-48'
                                            }`}
                                    >
                                        <img
                                            src={item.images?.[0]?.url || null}
                                            alt={formatLabel(item.model) || 'Vehicle'}
                                            className="w-full h-full object-cover"
                                        />

                                        <div className="absolute top-3 left-3 flex gap-2">
                                            <span className="bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded">
                                                LIVE
                                            </span>
                                        </div>

                                        <div className="absolute top-3 right-3 bg-black/10 backdrop-blur px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1">
                                            <AuctionCountdown item={item} />
                                        </div>
                                    </div>

                                    {/* Content section */}
                                    <div className="py-4 px-3 w-full">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-[#0B1E3D] text-sm">
                                                {`${item.year || ''} ${formatLabel(item.make)} ${formatLabel(item.model)}`}
                                            </h3>

                                            <Heart
                                                size={18}
                                                className="text-slate-400 hover:text-red-500 cursor-pointer"
                                            />
                                        </div>

                                        <div className="flex items-center gap-3 text-[11px] text-slate-500 mb-4">
                                            <span>{item.listingId}</span>

                                            <span className="flex items-center gap-1">
                                                <MapPin size={12} />
                                                {formatLabel(item.emirate)}, {formatLabel(item.city)}
                                            </span>

                                            <span className="flex items-center gap-1">
                                                <Gauge size={12} />
                                                {item.mileage?.toLocaleString()} km
                                            </span>
                                        </div>

                                        {/* Bids / Market Value */}
                                        <div className="grid grid-cols-3 gap-2 mb-4">
                                            <div className="bg-slate-50 p-2 rounded-lg">
                                                <p className="text-[10px] text-slate-500">
                                                    {item.priceType === 'fixed_price'
                                                        ? 'Buy Now'
                                                        : 'Current Bid'}
                                                </p>

                                                <p className="font-bold text-[#0B1E3D] text-sm">
                                                    {item.priceType === 'fixed_price'
                                                        ? item.buyNowPrice
                                                            ? formatPrice(item.buyNowPrice)
                                                            : 'N/A'
                                                        : item.currentBid || item.startingBidPrice
                                                            ? formatPrice(
                                                                item.currentBid ||
                                                                item.startingBidPrice
                                                            )
                                                            : 'N/A'}
                                                </p>
                                            </div>

                                            <div className="bg-slate-50 p-2 rounded-lg">
                                                <p className="text-[10px] text-slate-500">
                                                    Bids
                                                </p>

                                                <p className="font-bold text-[#0B1E3D] text-sm">
                                                    {item.totalBids || 0}
                                                </p>
                                            </div>

                                            <div className="bg-slate-50 p-2 rounded-lg">
                                                <p className="text-[10px] text-slate-500">
                                                    Condition
                                                </p>

                                                <p className="font-bold text-[#0B1E3D] text-sm">
                                                    {formatLabel(item.overallCondition) || 'N/A'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Footer Action */}
                                        <div
                                            className={`flex flex-col ${view === 'list'
                                                    ? 'items-start md:max-w-62 w-full'
                                                    : 'w-full'
                                                }`}
                                        >
                                            <button
                                                onClick={() => {
                                                    setCurrentPage('live-auctions-detail');
                                                    setSelectedVehicleId(item._id);
                                                }}
                                                className="w-full bg-[#0B1E3D] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-[#1a2d4d] transition-colors"
                                            >
                                                {item.priceType === 'fixed_price'
                                                    ? 'Buy Now →'
                                                    : 'Place Bid →'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full flex flex-col items-center justify-center py-16 px-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
                                <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                                    <Car className="w-7 h-7 text-slate-400" />
                                </div>

                                <h3 className="text-md font-bold text-[#0B1E3D]">
                                    No Live Auctions Found
                                </h3>

                                <p className="text-sm text-slate-400 mt-1 text-center">
                                    There are no live auctions available at the moment.
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

                    {/* ========= how it works ========= */}
                    <div className="w-full bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">

                        {/* Header */}
                        <div className="px-5 py-5 md:px-6 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg md:text-xl font-bold text-[#0B1E3D]">
                                    How Live Auctions Work?
                                </h2>
                                <p className="text-xs text-slate-400 mt-1">
                                    A quick guide to bidding and winning your vehicle.
                                </p>
                            </div>

                            <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-xl bg-[#0B1E3D] text-white">
                                <Gavel className="w-5 h-5" />
                            </div>
                        </div>

                        {/* Process */}
                        <div className="px-5 py-6 md:px-8 md:py-7">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                {steps.map((step, index) => (
                                    <div
                                        key={index}
                                        className="relative group"
                                    >
                                        <div className="h-full p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-amber-200 hover:shadow-md transition-all duration-300">

                                            {/* Top */}
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm group-hover:border-amber-200 group-hover:bg-amber-50 transition-all duration-300">
                                                    <step.icon className="w-5 h-5 text-[#0B1E3D] group-hover:text-[#D97706] transition-colors" />
                                                </div>

                                                <span className="text-2xl font-black text-slate-100 group-hover:text-amber-100 transition-colors">
                                                    0{index + 1}
                                                </span>
                                            </div>

                                            {/* Content */}
                                            <h3 className="text-sm font-bold text-[#0B1E3D] mb-1.5">
                                                {step.title}
                                            </h3>

                                            <p className="text-xs text-slate-500 leading-relaxed">
                                                {step.desc}
                                            </p>

                                            {/* Bottom accent */}
                                            <div className="mt-4 flex items-center gap-2">
                                                <div className="h-1 w-8 rounded-full bg-[#D97706] group-hover:w-12 transition-all duration-300" />
                                                <div className="h-1 w-2 rounded-full bg-slate-200" />
                                            </div>
                                        </div>

                                        {/* Connector */}
                                        {index < steps.length - 1 && (
                                            <div className="hidden xl:block absolute top-1/2 -right-3 z-10">
                                                <div className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                                                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}

                            </div>
                        </div>

                        {/* CTA */}
                        <div className="px-5 pb-5 md:px-8 md:pb-6">
                            <div className="rounded-xl bg-[#0B1E3D] px-4 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">

                                <div className="text-center sm:text-left">
                                    <p className="text-sm font-semibold text-white">
                                        Ready to join a live auction?
                                    </p>
                                    <p className="text-[11px] text-slate-300 mt-0.5">
                                        Learn everything before placing your first bid.
                                    </p>
                                </div>

                                <button className="group shrink-0 px-4 py-2 rounded-lg bg-white text-[#0B1E3D] text-xs font-bold flex items-center gap-2 hover:bg-[#D97706] hover:text-white transition-all duration-200">
                                    <span className="hidden md:inline">
                                        Learn More About Live Auctions
                                    </span>

                                    <span className="md:hidden">
                                        Learn More
                                    </span>

                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>

                            </div>
                        </div>

                    </div>
                </div>

                {/* Right */}
                <div className='lg:col-span-4 flex flex-col space-y-6'>

                    {/* auction tips */}
                    <div className="max-w-md bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">

                        {/* Header */}
                        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
                                    <Lightbulb className="w-5 h-5 text-[#D97706]" />
                                </div>

                                <div>
                                    <h2 className="text-base font-bold text-[#0B1E3D]">
                                        Live Auction Tips
                                    </h2>
                                    <p className="text-[10px] text-slate-400 mt-0.5">
                                        Helpful tips for smarter bidding
                                    </p>
                                </div>
                            </div>

                            <span className="text-[9px] font-bold uppercase tracking-wider text-[#D97706] bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full">
                                Tips
                            </span>
                        </div>

                        {/* Tips */}
                        <div className="p-5 space-y-3">
                            {tipsData.map((tip, index) => (
                                <div
                                    key={index}
                                    className="group flex gap-3.5 p-3 rounded-xl border border-transparent hover:border-amber-100 hover:bg-amber-50/40 transition-all duration-200"
                                >
                                    {/* Icon */}
                                    <div className="shrink-0 w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#D97706] group-hover:bg-white group-hover:border-amber-100 transition-all duration-200">
                                        <tip.icon className="w-5 h-5" />
                                    </div>

                                    {/* Content */}
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] font-bold text-slate-300">
                                                0{index + 1}
                                            </span>

                                            <h3 className="text-xs md:text-sm font-bold text-[#0B1E3D]">
                                                {tip.title}
                                            </h3>
                                        </div>

                                        <p className="text-[11px] md:text-xs text-slate-500 leading-relaxed mt-1">
                                            {tip.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Bottom note */}
                        <div className="mx-5 mb-5 p-3 rounded-xl bg-[#0B1E3D] flex items-center gap-3">
                            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />

                            <p className="text-[10px] leading-relaxed text-slate-300">
                                Stay focused, set your budget, and bid responsibly.
                            </p>
                        </div>

                    </div>

                    {/* top bidders */}
                    <div className="max-w-sm p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
                        <h2 className="text-md font-bold mb-6 text-[#0B1E3D]">
                            Top Bidders (All Auctions)
                        </h2>

                        <div className="space-y-4">
                            {bidders.map((bidder, index) => (
                                <div key={bidder.bidderId || index} className="flex items-center gap-4">
                                    <div
                                        className="w-6 h-6 flex items-center justify-center rounded-full text-sm font-semibold"
                                        style={{
                                            backgroundColor: index < 3 ? '#D97706' : '#F3F4F6',
                                            color: index < 3 ? '#FFFFFF' : '#0B1E3D'
                                        }}
                                    >
                                        {index + 1}
                                    </div>

                                    <img
                                        src={bidder.profileImage || 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png'}
                                        alt={bidder.fullName}
                                        className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover" />

                                    <div className="text-[12px] md:text-sm flex-1 font-semibold text-[#0B1E3D]">
                                        {bidder.fullName}
                                    </div>
                                    <div className="text-[13px] md:text-sm font-medium text-[#0B1E3D]">
                                        {bidder.totalBids}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* load more button */}
                        {hasMore && (
                            <button
                                className='w-full mt-6 py-1.5 md:py-2 text-[#D97706] text-[13px] md:text-sm flex items-center justify-center gap-2 rounded-lg border font-semibold transition-colors'
                                onClick={() => setBidderLimit(prev => prev + 10)}>
                                <User className="w-4 h-4" />
                                Load More
                            </button>
                        )}
                    </div>

                    {/* notification card */}
                    <div className="p-4 md:p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
                        <div className="flex gap-4 items-start">
                            <div className="shrink-0 bg-amber-50 rounded-full">
                                <Bell
                                    className="w-8 h-8 md:w-10 md:h-10 text-[#D97706] fill-[#FDE68A]"
                                />
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <h2 className="text-md md:text-lg font-bold text-[#0B1E3D]">
                                    Never Miss an Auction!
                                </h2>
                                <p className="mt-1 text-xs md:text-sm leading-relaxed text-[#0B1E3D]">
                                    Enable notifications and get alerted for your favorite auctions.
                                </p>
                            </div>
                        </div>

                        {/* Button */}
                        <button
                            className="w-full mt-5 py-1.5 md:py-2 text-[#D97706] text-[13px] md:text-sm flex items-center justify-center gap-2 rounded-lg border font-semibold transition-all"
                        >
                            Manage Notifications
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}
export default BuyerLiveAuctions;

import React, { useEffect, useState } from 'react';
import { Heart, Bookmark, LayoutGrid, List, Car } from 'lucide-react';
import FilterDropdown from '../BuyerSharedComponents/FilterDropdown';
import { getPaginationRange } from '../../utils/getPaginationRange';
import { formatLabel, formatPrice } from '../../../utils/formatters';
import { UseCountDown } from '../BuyerSharedComponents/UseCountDown';

import { useGetAllAuctions, useGetDistinctMakes, useGetDistinctModel } from '../../../hook/useAuction';

const getStatusStyles = (status) => {
    switch (status) {
        case "live":
            return "bg-green-50 text-green-700 border border-green-100 shadow-md";

        case "upcoming":
            return "bg-blue-50 text-blue-700 border border-blue-100 shadow-md";

        case "sold":
            return "bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-md";

        case "unsold":
            return "bg-gray-100 text-gray-700 border border-gray-200 shadow-md";

        case "reserve-not-met":
            return "bg-orange-100 text-orange-700 border border-orange-200 shadow-md";

        case "canceled":
            return "bg-red-50 text-red-700 border border-red-100 shadow-md";

        default:
            return "bg-gray-100 text-gray-700 border border-gray-200 shadow-md";
    }
};

const mapFiltersToParams = (filters) => {
    const params = {};
    if (filters.allMakes && filters.allMakes !== 'all') params.make = filters.allMakes;
    if (filters.allModels && filters.allModels !== 'all') params.model = filters.allModels;
    if (filters.priceRange && filters.priceRange !== 'all') params.priceRange = filters.priceRange;
    if (filters.bodyType && filters.bodyType !== 'all') params.bodyType = filters.bodyType;
    if (filters.sortBy) params.sortBy = filters.sortBy;
    return params;
};

// count down timer
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
                <p className="text-[11px] text-slate-400">Time Left</p>
                <p className="font-bold text-red-500 text-sm">
                    {timeLeft.days > 0 && `${timeLeft.days}d `}
                    {timeLeft.hours}h {timeLeft.mins}m {timeLeft.secs}s
                </p>
            </>
        );
    }

    if (item.auctionStatus === 'upcoming') {
        return (
            <>
                <p className="text-[11px] text-slate-400">Starts in</p>
                <p className="font-bold text-[#0B1E3D] text-sm">
                    {timeLeft.days > 0 && `${timeLeft.days}d `}
                    {timeLeft.hours}h {timeLeft.mins}m {timeLeft.secs}s
                </p>
            </>
        );
    }

    return null;
}

function BuyerBrowseAuction({ setCurrentPage, setSelectedVehicleId, setPreviousPage, openBidModal }) {

    const [activeTab, setActiveTab] = useState('all');
    const [filters, setFilters] = useState({
        allMakes: '',
        allModels: '',
        allYears: '',
        priceRange: '',
        bodyType: '',
        sortBy: '',
    });

    const params = mapFiltersToParams(filters);

    const [page, setPage] = useState(1);
    const [view, setView] = useState('grid');

    const { data: makesData } = useGetDistinctMakes();
    const { data: modelData } = useGetDistinctModel(filters.allMakes);
    const { data: allAuctions, isLoading, isError } = useGetAllAuctions({ page, limit: 10, tab: activeTab, ...params });

    const auctions = allAuctions?.data || [];
    const totalPages = allAuctions?.pagination?.totalPages || 1;
    const limit = 10;

    // tabs
    const tabs = [
        { key: 'all', label: 'All Auctions', },
        { key: 'live', label: 'Live Now', },
        { key: 'upcoming', label: 'Upcoming', },
        { key: 'ended', label: 'Ended', },
        { key: 'canceled', label: 'Canceled', },
    ];

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

    useEffect(() => {
        setPage(1);
    }, [activeTab, filters.allMakes, filters.allModels, filters.priceRange, filters.bodyType, filters.sortBy]);

    const updateFilter = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    if (isLoading) return <p className="p-10 text-center">Loading auctions....</p>;
    if (isError) return <p className="p-10 text-center text-red-500">Failed to load auctions list</p>;

    return (
        <div className='w-full pb-6'>

            {/* buyer heading */}
            <div className='pb-7'>
                <h1 className='text-slate-800 text-xl md:text-2xl font-bold'>Browse Auctions</h1>
                <p className='pt-1 text-gray-600 text-[12px] md:text-sm font-medium'>Explore and bid on vehicles from live, upcoming and ended auctions.</p>
            </div>

            {/* tabs + filter */}
            <div className="bg-white p-4 md:p-6 rounded-3xl border border-slate-200 shadow-sm w-full">

                {/* tabs */}
                <div className="flex items-center justify-between border-b border-slate-100 mb-6 overflow-x-auto no-scrollbar">
                    <div className="flex gap-6 md:gap-8 whitespace-nowrap">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`pb-4 text-[13px] md:text-sm font-semibold transition-all relative whitespace-nowrap
                                   ${activeTab === tab.key
                                        ? 'text-[#0B1E3D]'
                                        : 'text-slate-500 hover:text-[#0B1E3D]'
                                    }`}
                            >
                                <span className="flex items-center gap-1.5">
                                    {tab.label}
                                    {/* <span className="text-[11px] text-slate-400">
                                     ({tab.count})
                                   </span> */}
                                </span>

                                {activeTab === tab.key && (
                                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#D97706] rounded-t-full" />
                                )}
                            </button>
                        ))}
                    </div>

                    <button className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#0B1E3D] transition-colors mb-4 ml-4">
                        <Bookmark size={18} /> Saved Searches
                    </button>
                </div>

                {/* filter */}
                <div className="flex flex-wrap gap-3">
                    {filterConfig.map(({ label, key, options }) => (
                        <div
                            key={key}
                            className="w-full sm:w-41"
                        >
                            <FilterDropdown
                                label={label}
                                options={options.map((opt) =>
                                    typeof opt === 'string' ? { label: opt, value: opt } : opt
                                )}
                                value={filters[key]}
                                onChange={(value) => updateFilter(key, value)}
                            />
                        </div>
                    ))}

                    {/* clear btn */}
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

                </div>
            </div>

            {/* list */}
            <div className="w-full">

                {/* Top Status Line */}
                <div className="flex justify-between items-center my-6">
                    <p className="text-[12px] md:text-sm text-slate-500 font-medium">
                        Showing {(page - 1) * limit + 1} – {Math.min(page * limit, allAuctions?.pagination?.total || 0)} of {allAuctions?.pagination?.total || 0} auctions
                    </p>
                    <div className="hidden md:flex gap-2 border border-slate-200 rounded-lg p-1">
                        <button onClick={() => setView('grid')} className={`p-1.5 rounded-md ${view === 'grid' ? 'bg-[#0B1E3D] text-white' : 'text-slate-400'}`}><LayoutGrid size={18} /></button>
                        <button onClick={() => setView('list')} className={`p-1.5 rounded-md ${view === 'list' ? 'bg-[#0B1E3D] text-white' : 'text-slate-400'}`}><List size={18} /></button>
                    </div>
                </div>

                {/* cards */}
                <div className={`grid gap-6 ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                    {auctions?.length > 0 ? (
                        auctions.map((item, index) => {

                            const status = item.auctionStatus || "Unknown";
                            const statusStyles = getStatusStyles(status);

                            const priceLabel = {
                                live: 'Current Bid',
                                upcoming: 'Starting Bid',
                                sold: 'Winning Bid',
                                unsold: 'Starting Bid',
                                'reserve-not-met': 'Highest Bid',
                                canceled: 'Starting Bid',
                            };

                            const priceValue = {
                                live: item.currentBid,
                                upcoming: item.startingBidPrice,
                                sold: item.currentBid,
                                unsold: item.startingBidPrice,
                                'reserve-not-met': item.currentBid,
                                canceled: item.startingBidPrice,
                            };

                            return (
                                <div
                                    key={item.id || index}
                                    className={`bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all overflow-hidden flex ${view === 'list' ? 'flex-row' : 'flex-col'}`}>

                                    <div className={`relative overflow-hidden ${view === 'list' ? 'h-55 w-1/3 min-w-50' : 'h-48 w-full'}`}>
                                        <img
                                            src={item.images?.[0]?.url || null}
                                            alt={formatLabel(item.model) || "Vehicle"}
                                            className="w-full h-full object-cover"
                                        />

                                        {/* Badge */}
                                        <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-xl text-[8px] font-bold uppercase tracking-wider ${statusStyles}`}>
                                            {(item.auctionStatus)}
                                        </span>

                                        {/* Heart Icon */}
                                        <button className="absolute top-3 right-3 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:text-red-500 hover:bg-white transition-all">
                                            <Heart size={18} />
                                        </button>
                                    </div>

                                    <div className="p-5 flex flex-col justify-between flex-1">
                                        <div>
                                            <h3 className="font-bold text-[#0B1E3D] text-md md:text-lg truncate">{`${item.year || ""} ${formatLabel(item.make)} ${formatLabel(item.model)}`}</h3>
                                            <p className="text-xs md:text-sm text-slate-500 mt-1">{item.listingId}</p>
                                            <p className="text-xs md:text-sm text-slate-500 mb-4">{item.mileage} • {formatLabel(item.transmission)} • {formatLabel(item.fuelType)}</p>
                                        </div>

                                        {/* price / time */}
                                        <div className="flex justify-between items-end border-t border-slate-100">
                                            <div>
                                                <p className="text-[11px] text-slate-400 font-bold uppercase">
                                                    {priceLabel[item.auctionStatus] || 'Price'}
                                                </p>
                                                <p className="text-lg font-bold text-[#0B1E3D]">
                                                    {formatPrice(priceValue[item.auctionStatus] || 0, 'AED')}
                                                </p>
                                            </div>

                                            {/* auction timing */}
                                            <div className="text-right">
                                                <AuctionCountdown item={item} />

                                                {['sold', 'unsold', 'reserve-not-met', 'canceled'].includes(item.auctionStatus) && (
                                                    <>
                                                        <p className="text-[10px] text-slate-400 mt-1">
                                                            {item.auctionStatus === 'canceled'
                                                                ? 'Canceled on'
                                                                : 'Ended on'}
                                                        </p>

                                                        <p className="font-semibold text-[#0B1E3D] text-xs mt-0.5">
                                                            {(item.auctionStatus === 'canceled'
                                                                ? item.canceledAt
                                                                : item.auctionEndDateTime)
                                                                ? new Date(
                                                                    item.auctionStatus === 'canceled'
                                                                        ? item.canceledAt
                                                                        : item.auctionEndDateTime
                                                                ).toLocaleDateString('en-AE', {
                                                                    timeZone: 'Asia/Dubai',
                                                                    day: '2-digit',
                                                                    month: 'short',
                                                                    year: 'numeric',
                                                                })
                                                                : 'N/A'}
                                                        </p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Button */}
                                    <div className={`p-5 ${view === 'list' ? 'flex items-center w-48' : 'pt-0'}`}>
                                        <button
                                            onClick={() => {
                                                if (item.auctionStatus === 'live') {
                                                    openBidModal(item.id, 'dashboard');
                                                } else if (item.auctionStatus === 'upcoming') {
                                                    setSelectedVehicleId(item.id);
                                                    setPreviousPage('dashboard');
                                                    setCurrentPage('upcoming-auctions-detail');
                                                } else if (
                                                    ['sold', 'unsold', 'reserve-not-met', 'canceled'].includes(item.auctionStatus)
                                                ) {
                                                    setSelectedVehicleId(item.id);
                                                    setPreviousPage('dashboard');
                                                    setCurrentPage('auction-result-detail');
                                                }
                                            }}
                                            className={`w-full px-5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2
                                                ${item.auctionStatus === 'live'
                                                    ? 'bg-[#0B1E3D] hover:bg-[#D97706] text-white shadow-sm hover:shadow-md'
                                                    : item.auctionStatus === 'upcoming'
                                                        ? 'bg-white border border-[#0B1E3D] text-[#0B1E3D] hover:bg-[#0B1E3D] hover:text-white'
                                                        : item.auctionStatus === 'canceled'
                                                            ? 'bg-white border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300'
                                                            : 'bg-white border border-slate-200 text-[#0B1E3D] hover:border-[#D97706] hover:text-[#D97706]'
                                                }`}
                                        >
                                            {item.auctionStatus === 'live'
                                                ? item.priceType === 'fixed_price'
                                                    ? 'Buy Now'
                                                    : 'Bid Now'
                                                : item.auctionStatus === 'upcoming'
                                                    ? 'View Auction'
                                                    : ['sold', 'unsold', 'reserve-not-met'].includes(item.auctionStatus)
                                                        ? 'View Results'
                                                        : 'View Details'
                                            }
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-16 px-6 bg-white rounded-3xl border border-slate-100">
                            <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                                <Car className="w-7 h-7 text-slate-400" />
                            </div>

                            <h3 className="text-lg font-bold text-[#0B1E3D]">
                                No Auctions Found
                            </h3>

                            <p className="text-sm text-slate-400 mt-1 text-center">
                                There are no auctions available at the moment.
                            </p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between gap-4 px-5 py-4 mt-5 ">

                        {/* Page Info */}
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

                            {/* Previous */}
                            <button
                                type="button"
                                onClick={() => setPage((p) => p - 1)}
                                disabled={page === 1}
                                className=" h-9 px-3.5 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-xs font-semibold text-[#0B1E3D] hover:bg-slate-50 hover:border-[#0B1E3D] disabled:opacity-35 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                Previous
                            </button>

                            {/* Page Numbers */}
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

                            {/* Next */}
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
        </div>
    )
}

export default BuyerBrowseAuction;

import React, { useEffect } from 'react';
import SearchBar from '../SellerSharedComponents/SearchBar';
import FilterDropdown from '../SellerSharedComponents/FilterDropdown';
import { useState } from 'react';
import { useClearWatchlist, useGetMyWatchlist, useToggleWatchlist } from '../../../hook/useWatchlist';
import { getPaginationRange } from '../../../utils/getPaginationRange';
import { formatLabel } from '../../../utils/formatters';
import { UseCountDown } from '../SellerSharedComponents/UseCountDown';
import { Eye, Heart } from 'lucide-react';

const filterConfig = [
    {
        label: 'Auction Types',
        key: 'auctionType',
        options: ['all', 'timed', 'live']
    },
    {
        label: 'Price Type',
        key: 'priceType',
        options: ['all', 'fixed_price', 'reserve_price']
    },
    {
        label: 'Sort By',
        key: 'sortBy',
        options: ['all', 'newest', 'oldest']
    },
];

const mapFiltersToParams = (filters, search) => {
    const params = {};
    if (filters.auctionType) params.auctionType = filters.auctionType;
    if (filters.priceType) params.priceType = filters.priceType;
    if (filters.sortBy) params.sortBy = filters.sortBy;

    if (search) params.search = search;
    return params;
};

const statusStyles = {
    live: 'bg-green-100 text-green-700 border border-green-200',
    upcoming: 'bg-blue-100 text-blue-700 border border-blue-200',
    sold: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    unsold: 'bg-red-100 text-red-700 border border-red-200',
    'reserve-not-met':
        'bg-orange-100 text-orange-700 border border-orange-200',
};

const statusLabels = {
    live: 'Live',
    upcoming: 'Upcoming',
    sold: 'Sold',
    unsold: 'Unsold',
    'reserve-not-met': 'Reserve Not Met',
};

const tabs = [
    { key: 'all', label: 'All' },
    { key: 'live', label: 'Live', },
    { key: 'upcoming', label: 'Upcoming', },
    { key: 'sold', label: 'Sold', },
    { key: 'unsold', label: 'Unsold', },
    { key: 'reserve-not-met', label: 'Reserve Not Met', },
];

const AuctionCountdown = ({ vehicle }) => {
    const countdownTarget =
        vehicle.status === 'upcoming'
            ? vehicle.auctionStartDateTime
            : vehicle.status === 'live'
                ? vehicle.auctionEndDateTime
                : null;

    const timeLeft = UseCountDown(countdownTarget);

    if (vehicle.status === 'live' || vehicle.status === 'upcoming') {
        return (
            <div className="mt-3 p-2.5 bg-slate-50 border border-slate-200 rounded-md">
                <p className="text-[10px] text-slate-500 mb-1">
                    {vehicle.status === 'live'
                        ? 'Auction Ends In'
                        : 'Auction Starts In'}
                </p>

                <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-800">
                        {timeLeft.days}d
                    </span>

                    <span className="text-sm font-bold text-slate-800">
                        {String(timeLeft.hours).padStart(2, '0')}h
                    </span>

                    <span className="text-sm font-bold text-slate-800">
                        {String(timeLeft.mins).padStart(2, '0')}m
                    </span>

                    <span className="text-sm font-bold text-[#D97706]">
                        {String(timeLeft.secs).padStart(2, '0')}s
                    </span>
                </div>
            </div>
        );
    }

    if (['sold', 'unsold', 'reserve-not-met'].includes(vehicle.status)) {
        return (
            <div className="mt-3 p-2.5 bg-slate-50 border border-slate-200 rounded-md">
                <p className="text-[10px] text-slate-500">
                    Auction Ended
                </p>

                <p className="text-xs font-semibold text-slate-700 mt-1">
                    {vehicle.auctionEndDateTime
                        ? new Date(vehicle.auctionEndDateTime).toLocaleString('en-US', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                            timeZone: 'Asia/Dubai',
                        })
                        : 'N/A'}
                </p>
            </div>
        );
    }

    return null;
};

function Watchlist({ setCurrentPage }) {

    const [activeTab, setActiveTab] = useState('all');
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [filters, setFilters] = useState({
        auctionType: '',
        priceType: '',
        sortBy: '',
    });

    const params = mapFiltersToParams(filters, debouncedSearch);

    const { data: watchListData, isLoading, isError } = useGetMyWatchlist({ auctionStatus: activeTab, page, limit: 10, ...params });
    const { mutate: toggleWatchlist } = useToggleWatchlist();
    const { mutate: clearWatchlist, isPending: isClearingWatchlist, } = useClearWatchlist();

    const items = watchListData?.data?.items || [];
    const totalPages = watchListData?.pagination?.totalPages || 1;

    useEffect(() => {
        setPage(1);
    }, [filters, search]);

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

    // handle remove 
    const handleRemove = (vehicleId) => {
        toggleWatchlist(vehicleId); // already watchlisted, toggle = remove
    };

    // handle c;ear btn
    const handleClearWatchlist = () => {
        clearWatchlist();
    };

    if (isLoading) return <p className="p-10 text-center">Loading watchlist vehicles....</p>;
    if (isError) return <p className="p-10 text-center text-red-500">Failed to load watchlist vehicles</p>;

    return (
        <div className='pb-6 space-y-6'>

            {/* header */}
            <div className='w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0'>
                <div className='flex flex-col'>
                    <h1 className='text-xl md:text-2xl font-bold'>Watchlist</h1>

                    <p className='text-xs md:text-sm text-gray-600 p-px'>
                        Keep track of your favourite vehicles and never miss a great opportunity.
                    </p>
                </div>

                {items.length > 0 && (
                    <button
                        type="button"
                        onClick={handleClearWatchlist}
                        disabled={isClearingWatchlist}
                        className="px-3 py-2 text-xs font-semibold text-red-600 border border-red-200 rounded-md hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isClearingWatchlist ? 'Clearing...' : 'Clear Watchlist'}
                    </button>
                )}
            </div>

            {/* search/filter */}
            <div className="flex flex-wrap gap-3 py-4 px-4 border border-gray-300 bg-white/80 rounded-xl">
                <div className='flex-1 min-w-50'>
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
                        className="w-full sm:w-42"
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

                {/* clear btn */}
                <button
                    type="button"
                    onClick={() => {
                        setSearch("");
                        setFilters({ auctionType: '', priceType: '', sortBy: '' });
                    }}
                    className="flex items-center gap-1.5 h-9 px-1.5 text-xs font-semibold text-amber-600 underline underline-offset-4 decoration-amber-300 hover:text-amber-700 hover:decoration-amber-600 transition-all">
                    Clear Filters
                </button>
            </div>

            <div className='space-y-8'>

                {/* tabs */}
                <div className='flex gap-9 border-b border-gray-200 overflow-x-auto no-scrollbar'>
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => {
                                setActiveTab(tab.key);
                                setPage(1);
                            }}
                            className={`py-3 text-xs md:text-sm font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer
                                ${activeTab === tab.key
                                    ? 'border-[#D97706] text-[#D97706]'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab.label} <span className='text-xs'></span>
                        </button>
                    ))}
                </div>

                {/* empty state */}
                {items.length === 0 && (
                    <div className="py-15 flex flex-col items-center justify-center">
                        <p className="text-sm font-medium text-gray-500">
                            Your watchlist is empty.
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            No vehicles have been added to your watchlist yet.
                        </p>
                    </div>
                )}

                {/* list */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {items.map((item) => {
                        const vehicle = { ...item.vehicle, id: item.vehicle._id, status: item.vehicle.auctionStatus };
                        const isFixedPrice = vehicle.priceType === 'fixed_price';

                        return (
                            <div
                                key={vehicle._id}
                                className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm"
                            >
                                {/* Image */}
                                <div className="relative">
                                    <img
                                        src={vehicle.images?.[0]?.url}
                                        alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                                        className="w-full h-44 object-cover"
                                    />

                                    <span
                                        className={`absolute top-2 left-2 px-2 py-1 rounded-md text-[10px] font-semibold ${statusStyles[vehicle.status]}`}
                                    >
                                        {statusLabels[vehicle.status]}
                                    </span>

                                    <span className="absolute bottom-2 right-2 bg-slate-800/80 text-white px-2 py-1 rounded text-[9px]">
                                        {vehicle.listingId}
                                    </span>

                                    <button
                                        onClick={() => handleRemove(vehicle.id)}
                                        className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm text-red-500"
                                    >
                                        ♥
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="p-3">
                                    <h3 className="text-sm font-semibold text-slate-800">
                                        {vehicle.year} {formatLabel(vehicle.make)} {formatLabel(vehicle.model)}
                                    </h3>

                                    <p className="text-[11px] text-slate-500 mt-1">
                                        {formatLabel(vehicle.vehicleType)}
                                        <span className="mx-1">•</span>
                                        {formatLabel(vehicle.fuelType)}
                                        <span className="mx-1">•</span>
                                        {formatLabel(vehicle.transmission)}
                                        <span className="mx-1">•</span>
                                        {formatLabel(vehicle.exteriorColor)}
                                    </p>

                                    {/* Price */}
                                    <div className="flex justify-between items-end mt-3">
                                        <div>
                                            <p className="text-[10px] text-slate-500">
                                                {isFixedPrice
                                                    ? 'Buy Now Price'
                                                    : vehicle.status === 'upcoming'
                                                        ? 'Starting Bid'
                                                        : 'Current Bid'}
                                            </p>
                                            <p className="text-base font-bold text-slate-900">
                                                AED {(isFixedPrice
                                                    ? vehicle.buyNowPrice
                                                    : vehicle.currentBid ?? vehicle.startingBidPrice
                                                )?.toLocaleString()}
                                            </p>
                                        </div>

                                        {!isFixedPrice && (
                                            <div className="text-right">
                                                <p className="text-[10px] text-slate-500">Reserve Price</p>
                                                <p className="text-sm font-semibold text-slate-800">
                                                    AED {vehicle.reservePrice?.toLocaleString()}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Auction Time */}
                                    <AuctionCountdown vehicle={vehicle} />

                                    {/* Actions */}
                                    <div className="flex gap-2 mt-3">
                                        <button
                                            // onClick={() => {
                                            //     setSelectedVehicleId(vehicle.id);
                                            //     setCurrentPage('vehicle-detail');
                                            // }}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:border-slate-300 active:scale-[0.98] transition-all duration-200"
                                        >
                                            <Eye size={14} />
                                            View Details
                                        </button>

                                        <button
                                            onClick={() => handleRemove(vehicle.id)}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md bg-[#D97706] text-white text-xs font-medium hover:bg-[#B45309] active:scale-[0.98] transition-all duration-200 shadow-sm"
                                        >
                                            <Heart size={14} fill="currentColor" />
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
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
    );
}

export default Watchlist;
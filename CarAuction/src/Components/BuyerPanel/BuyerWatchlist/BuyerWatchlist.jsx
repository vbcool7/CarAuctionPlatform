
import React, { useState } from 'react';

import { Eye, Heart, LayoutGrid, List, } from 'lucide-react';
import { UseCountDown } from '../BuyerSharedComponents/UseCountDown';
import { useClearWatchlist, useGetMyWatchlist, useToggleWatchlist } from '../../../hook/useWatchlist';
import { useEffect } from 'react';
import FilterDropdown from '../BuyerSharedComponents/FilterDropdown';
import { formatLabel } from '../../../utils/formatters';
import { getPaginationRange } from '../../utils/getPaginationRange';

const filterConfig = [
    {
        label: 'Sort By',
        key: 'sortBy',
        options: ['all', 'newest', 'oldest']
    },
];

const mapFiltersToParams = (filters, search) => {
    const params = {};
    if (filters.sortBy) params.sortBy = filters.sortBy;
    return params;
};

const statusStyles = {
    live: 'bg-green-100 text-green-700 border border-green-200',
    upcoming: 'bg-blue-100 text-blue-700 border border-blue-200',
    sold: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    unsold: 'bg-red-100 text-red-700 border border-red-200',
    'reserve-not-met':
        'bg-orange-100 text-orange-700 border border-orange-200',
    canceled:
        'bg-slate-100 text-slate-600 border border-slate-200',
};

const statusLabels = {
    live: 'Live',
    upcoming: 'Upcoming',
    sold: 'Sold',
    unsold: 'Unsold',
    'reserve-not-met': 'Reserve Not Met',
    canceled: 'Canceled',
};

const tabs = [
    { key: 'all', label: 'All' },
    { key: 'live', label: 'Live', },
    { key: 'upcoming', label: 'Upcoming', },
    { key: 'sold', label: 'Sold', },
    { key: 'unsold', label: 'Unsold', },
    { key: 'reserve-not-met', label: 'Reserve Not Met', },
    { key: 'canceled', label: 'Canceled' },
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

    if (['sold', 'unsold', 'reserve-not-met', 'canceled'].includes(vehicle.status)) {
        const endDate =
            vehicle.status === 'canceled'
                ? vehicle.canceledAt
                : vehicle.auctionEndDateTime;

        return (
            <div className="mt-3 p-2.5 bg-slate-50 border border-slate-200 rounded-md">
                <p className="text-[10px] text-slate-500">
                    {vehicle.status === 'canceled'
                        ? 'Auction Canceled'
                        : 'Auction Ended'}
                </p>

                <p className="text-xs font-semibold text-slate-700 mt-1">
                    {endDate
                        ? new Date(endDate).toLocaleString('en-US', {
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

function BuyerWatchlist({ setCurrentPage, setSelectedVehicleId, setPreviousPage, openBidModal }) {

    const [activeTab, setActiveTab] = useState('all');
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({
        sortBy: '',
    });

    const params = mapFiltersToParams(filters);
    const { data: watchListData, isLoading, isError } = useGetMyWatchlist({ auctionStatus: activeTab, page, limit: 10, ...params });
    const { mutate: toggleWatchlist } = useToggleWatchlist();
    const { mutate: clearWatchlist, isPending: isClearingWatchlist, } = useClearWatchlist();

    const items = watchListData?.data?.items || [];
    const totalPages = watchListData?.pagination?.totalPages || 1;

    useEffect(() => {
        setPage(1);
    }, [filters]);

    const updateFilter = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    // handle remove 
    const handleRemove = (vehicleId) => {
        toggleWatchlist(vehicleId);
    };

    // handle c;ear btn
    const handleClearWatchlist = () => {
        clearWatchlist();
    };

    if (isLoading) return <p className="p-10 text-center">Loading watchlist vehicles....</p>;
    if (isError) return <p className="p-10 text-center text-red-500">Failed to load watchlist vehicles</p>;

    return (
        <div className='pb-6'>

            <div className='pb-7'>
                <h1 className='text-slate-800 text-xl md:text-2xl font-bold'>Watchlist</h1>
                <p className='pt-1 text-gray-600 text-[12px] md:text-sm font-medium'>Vehicles you've saved to watch and bid on.</p>
            </div>

            <div className="w-full">

                {/* Tabs */}
                <div className="flex gap-8 border-b border-gray-100 mb-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab.key)}
                            className={`pb-4 text-[13px] md:text-sm font-semibold transition-all relative whitespace-nowrap
                                        ${activeTab === tab.key
                                    ? 'text-[#0B1E3D]'
                                    : 'text-slate-400 hover:text-[#0B1E3D]'
                                }`}
                        >
                            {tab.label}
                            {(activeTab === tab.key) && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#D97706] rounded-t-full" />
                            )}
                        </button>
                    ))}
                </div>

                {/* drop down */}
                <div className="flex justify-between items-center mb-8">

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Sort by:</span>
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

                    {items.length > 0 && (
                        <button
                            type="button"
                            onClick={handleClearWatchlist}
                            disabled={isClearingWatchlist}
                            className="inline-flex items-center justify-center px-4 py-2.5 text-xs font-semibold text-red-600 bg-red-50/80 border border-red-200 rounded-xl hover:bg-red-100 hover:border-red-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm shrink-0"
                        >
                            {isClearingWatchlist ? 'Clearing...' : 'Clear Watchlist'}
                        </button>
                    )}
                </div>

                {/* Cards Grid */}
                {items?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {items.map((item) => {
                            const vehicle = {
                                ...item.vehicle,
                                id: item.vehicle._id,
                                status: item.vehicle.auctionStatus
                            };

                            const isFixedPrice = vehicle.priceType === 'fixed_price';

                            return (
                                <div
                                    key={vehicle._id}
                                    className="group bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between"
                                >
                                    <div>
                                        {/* Image Container */}
                                        <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                                            <img
                                                src={vehicle.images?.[0]?.url}
                                                alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />

                                            <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-black/10 pointer-events-none" />

                                            {/* Status Badge */}
                                            <span
                                                className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide shadow-sm ${statusStyles[vehicle.status]}`}
                                            >
                                                {statusLabels[vehicle.status]}
                                            </span>

                                            {/* Listing ID Badge */}
                                            <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded-md text-[10px] font-medium tracking-wider">
                                                {vehicle.listingId}
                                            </span>

                                            {/* Wishlist / Remove Button */}
                                            <button
                                                onClick={() => handleRemove(vehicle.id)}
                                                className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md text-red-500 hover:bg-white hover:scale-110 transition-all"
                                                title="Remove from Watchlist"
                                            >
                                                ♥
                                            </button>
                                        </div>

                                        {/* Content Section */}
                                        <div className="p-4">
                                            <h3 className="text-base font-bold text-[#0B1E3D] truncate">
                                                {vehicle.year} {formatLabel(vehicle.make)} {formatLabel(vehicle.model)}
                                            </h3>

                                            <p className="text-xs text-slate-500 mt-1.5 flex flex-wrap items-center gap-1 font-medium">
                                                <span>{formatLabel(vehicle.vehicleType)}</span>

                                                {vehicle.fuelType && (
                                                    <>
                                                        <span>•</span>
                                                        <span>{formatLabel(vehicle.fuelType)}</span>
                                                    </>
                                                )}

                                                {vehicle.transmission && (
                                                    <>
                                                        <span>•</span>
                                                        <span>{formatLabel(vehicle.transmission)}</span>
                                                    </>
                                                )}

                                                {vehicle.exteriorColor && (
                                                    <>
                                                        <span>•</span>
                                                        <span>{formatLabel(vehicle.exteriorColor)}</span>
                                                    </>
                                                )}
                                            </p>

                                            {/* Price Breakdown */}
                                            <div className="flex justify-between items-end mt-4 pt-3 border-t border-slate-100">
                                                <div>
                                                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                                                        {isFixedPrice
                                                            ? 'Buy Now Price'
                                                            : vehicle.status === 'upcoming'
                                                                ? 'Starting Bid'
                                                                : 'Current Bid'}
                                                    </p>

                                                    <p className="text-base font-extrabold text-[#0B1E3D] mt-0.5">
                                                        AED {(isFixedPrice
                                                            ? vehicle.buyNowPrice
                                                            : vehicle.currentBid ?? vehicle.startingBidPrice
                                                        )?.toLocaleString()}
                                                    </p>
                                                </div>

                                                {!isFixedPrice && vehicle.reservePrice && (
                                                    <div className="text-right">
                                                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                                                            Reserve Price
                                                        </p>

                                                        <p className="text-sm font-bold text-slate-700 mt-0.5">
                                                            AED {vehicle.reservePrice?.toLocaleString()}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Auction Time / Countdown */}
                                            <div className="mt-3">
                                                <AuctionCountdown vehicle={vehicle} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions Footer */}
                                    <div className="p-4 pt-0">
                                        <div className="flex gap-2 pt-3 border-t border-slate-100">
                                            <button
                                                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-[#0B1E3D] hover:bg-slate-100 hover:border-slate-300 active:scale-[0.98] transition-all duration-200 shadow-sm"
                                            >
                                                <Eye size={14} />
                                                View Details
                                            </button>

                                            <button
                                                onClick={() => handleRemove(vehicle.id)}
                                                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#D97706] text-white text-xs font-semibold hover:bg-[#B45309] active:scale-[0.98] transition-all duration-200 shadow-sm"
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
                ) : (
                    <div className='text-center'>
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-50 flex items-center justify-center">
                            <Heart
                                size={28}
                                className="text-[#D97706]"
                            />
                        </div>

                        <h3 className="text-md font-bold text-[#0B1E3D]">
                            Your Watchlist is Empty
                        </h3>

                        <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                            You haven't added any vehicles to your watchlist yet.
                        </p>
                    </div>

                )}
                
                {/* Pagination */}
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
        </div>
    )
}

export default BuyerWatchlist;
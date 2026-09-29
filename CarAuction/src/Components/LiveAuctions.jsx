
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiSearch, HiViewGrid, HiViewList, HiShieldCheck, HiLockClosed, HiLightningBolt, HiTag, HiSupport, HiOutlineRefresh, HiCheckCircle } from 'react-icons/hi';
import { HiCamera, HiLocationMarker, HiClock, HiOutlineHeart, HiOutlineCog, HiOutlineTruck, HiOutlineBeaker, HiOutlineViewGrid } from 'react-icons/hi';
import { IoCalendarNumberOutline, IoCarSportOutline, IoPeopleOutline, IoTimeOutline } from 'react-icons/io5';
import AuctionSideFilter from './SharedComponents/AuctionSideFilter';
import AuctionBottomFeaturesBar from './SharedComponents/AuctionBottomFeaturesBar';
import SearchBar from './SharedComponents/SearchBar';
import FilterDropdown from './SharedComponents/FilterDropdown';


import { getPaginationRange } from './utils/getPaginationRange';
import { useGetPublicAuctions } from '../hook/useAuction';
import { formatLabel, formatPrice } from '../utils/formatters';
import { UseCountdown } from './SharedComponents/UseCountdown';


const stats = [
  { label: 'Live Auctions', value: '32', icon: <IoCalendarNumberOutline className="text-blue-600" />, bgColor: 'bg-blue-50' },
  { label: 'Active Vehicles', value: '1,256', icon: <IoCarSportOutline className="text-emerald-600" />, bgColor: 'bg-emerald-50' },
  { label: 'Active Bidders', value: '845', icon: <IoPeopleOutline className="text-purple-600" />, bgColor: 'bg-purple-50' },
  { label: 'Ending Today', value: '28', icon: <IoTimeOutline className="text-orange-600" />, bgColor: 'bg-orange-50' },
];

const points = [
  {
    title: 'Bid in real time',
    description: 'Place live bids and see updates instantly as the auction progresses.',
  },
  {
    title: 'Never miss a deadline',
    description: 'Track the countdown timer so you never lose out in the final moments.',
  },
  {
    title: 'Transparent bidding',
    description: 'View current bids and bidder activity before you commit.',
  },
  {
    title: 'Free to register and participate',
    description: 'Join any live auction at no cost and start bidding right away.',
  },
];

const filterConfig = [
  {
    label: 'Sort By',
    key: 'sort',
    options: [
      { label: 'Ending Soon', value: 'ending_soon' },
      { label: 'Newest Listed', value: 'newest' },
      { label: 'Price: Low to High', value: 'price_low' },
      { label: 'Price: High to Low', value: 'price_high' },
    ]
  },
];

const mapFiltersToParams = (filters, search) => {
  const params = {};

  if (filters.sort) params.sort = filters.sort;
  if (search) params.search = search;

  return params;
};

const AuctionTimeLeft = ({ auctionEndDateTime }) => {
  const timeLeft = UseCountdown(auctionEndDateTime);

  return (
    <p className="flex items-center gap-1 text-[13px] font-bold text-[#D97706] mt-0.5">
      {timeLeft.days > 0
        ? `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.mins}m ${timeLeft.secs}s`
        : `${timeLeft.hours}h ${timeLeft.mins}m ${timeLeft.secs}s`}
    </p>
  );
};

// sidebar filter
const dayRange = (dateStr) => {
  if (!dateStr) return {};
  const from = new Date(dateStr); from.setHours(0, 0, 0, 0);
  const to = new Date(from); to.setDate(to.getDate() + 1);
  return { from: from.toISOString(), to: to.toISOString() };
};

function LiveAuctions() {

  const navigate = useNavigate();

  const [view, setView] = useState('grid');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFilters] = useState({ sortBy: 'ending_soon' });
  const [sidebarFilters, setSidebarFilters] = useState({});

  const params = mapFiltersToParams(filters, debouncedSearch);

  const { data, isLoading, isError } = useGetPublicAuctions({
    status: 'live', page, limit: 10, ...params, 
    category: sidebarFilters.vehicleType,
    make: sidebarFilters.make,
    fuelType: sidebarFilters.fuelType,
    emirate: sidebarFilters.emirate,
    minPrice: sidebarFilters.minPrice,
    maxPrice: sidebarFilters.maxPrice,
  });

  const liveVehicles = data?.data ?? [];
  const totalPages = data?.pagination?.totalPages || 1;

  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [filters, debouncedSearch, sidebarFilters]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  if (isLoading) return <p className="p-10 text-center">Loading live auctions....</p>;
  if (isError) return <p className="p-10 text-center text-red-500">Failed to load live auctions</p>;

  return (
    <section className='w-full'>
      <div className='max-w-6xl mx-auto px-4 md:px-5 lg:px-6 py-8'>

        {/* ======= heading ======= */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Live Auctions</h1>
          <p className='text-sm text-slate-500'>Explore and bid on vehicles in live auctions.</p>
        </div>

        {/* ===== stats ===== */}
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

        {/* ===== two-column layout ===== */}
        <div className="flex flex-col md:flex-row gap-6 mt-15">

          {/* =========================== Left =========================== */}
          <div className="w-full md:w-[70%] space-y-4">

            {/* Tab */}
            <div className="border-b border-slate-200 mb-6">
              <button className="text-sm text-[#D97706] font-medium pb-3 border-b-2 border-[#D97706] px-1">
                All Lives
              </button>
            </div>

            {/* Search Bar + dropdown */}
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

                {/* View Toggle */}
                <div className="flex border border-slate-200 rounded-lg overflow-hidden h-11.25">
                  <button
                    onClick={() => setView('grid')}
                    className={`px-3 py-2 ${view === 'grid' ? 'bg-slate-100 text-[#D97706]' : 'text-slate-500'}`}
                  >
                    <HiViewGrid size={20} />
                  </button>

                  <button
                    onClick={() => setView('list')}
                    className={`px-3 py-2 border-l border-slate-200 ${view === 'list' ? 'bg-slate-100 text-[#D97706]' : 'text-slate-500'}`}
                  >
                    <HiViewList size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* ====== List ====== */}
            <div className="space-y-4">
              {liveVehicles.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-6 border border-slate-200 rounded-2xl bg-white">
                  <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mb-4">
                    <HiOutlineTruck className="text-[#D97706]" size={28} />
                  </div>

                  <h3 className="text-base font-bold text-[#0F172A]">
                    No Live Auctions Found
                  </h3>

                  <p className="text-sm text-slate-500 text-center mt-1">
                    There are currently no live auctions available.
                  </p>
                </div>
              ) : (
                liveVehicles.map((vehicle, index) => (
                  <div
                    key={vehicle._id || index}
                    className="flex flex-col md:flex-row gap-3 p-4 border border-slate-200 rounded-2xl bg-white w-full transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-300">

                    {/* 1. Image Section */}
                    <div className="relative w-full sm:w-72 h-55 rounded-xl overflow-hidden shrink-0 group">
                      <img
                        src={vehicle.image}
                        alt={`${vehicle.year} ${formatLabel(vehicle.make)} ${formatLabel(vehicle.model)}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Badge */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-[#D97706] backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-lg uppercase tracking-wider">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                        </span>
                        Live
                      </div>

                      <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-md text-white text-[10px] font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10">
                        <HiCamera size={14} /> {vehicle.imageCount ?? 0} Photos
                      </div>
                    </div>

                    {/* 2. Details Section */}
                    <div className="flex flex-col justify-between grow min-w-0">
                      <div>
                        <div className="flex justify-between items-start">
                          <span className="text-[#D97706] text-[10px] font-extrabold uppercase tracking-[0.2em]">Live Auction</span>
                          <span className="text-[11px] font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{vehicle.listingId || 'NA'}</span>
                        </div>

                        <h3 className="text-lg font-bold text-[#0F172A] leading-tight">{`${vehicle.year} ${formatLabel(vehicle.make)} ${formatLabel(vehicle.model)}`}</h3>

                        {/* Quick Specs - Refined Design */}
                        <div className="flex items-center gap-3 mt-4 text-[12px] text-slate-600">
                          {[
                            { icon: HiOutlineCog, val: formatLabel(vehicle.transmission) },
                            { icon: HiOutlineTruck, val: formatLabel(vehicle.bodyType) },
                            { icon: HiOutlineBeaker, val: formatLabel(vehicle.fuelType) },
                            { icon: HiOutlineViewGrid, val: formatLabel(vehicle.drivetrain) }
                          ].map((spec, i) => (
                            <div key={i} className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                              <spec.icon className="text-[#D97706]" size={14} />
                              {spec.val}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Footer: Metadata + Actions */}
                      <div className="flex flex-wrap items-center justify-between pt-3 gap-6">
                        <div className="flex gap-8">
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                              {vehicle.priceType === 'fixed_price'
                                ? 'Buy Now Price'
                                : (vehicle.totalBids ?? 0) > 0
                                  ? 'Current Bid'
                                  : 'Starting Bid'}
                            </p>

                            <p className="font-bold text-[#0F172A] text-md mt-0.5">
                              {formatPrice(
                                vehicle.priceType === 'fixed_price'
                                  ? vehicle.buyNowPrice
                                  : (vehicle.totalBids ?? 0) > 0
                                    ? vehicle.currentBid
                                    : vehicle.startingBidPrice
                              )}
                            </p>
                          </div>

                          <div>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Location</p>
                            <p className="flex items-center gap-1 text-[13px] font-semibold text-[#0F172A] mt-0.5">
                              {formatLabel(vehicle.emirate)}
                            </p>
                          </div>

                          <div>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                              Time Left
                            </p>

                            <AuctionTimeLeft auctionEndDateTime={vehicle.auctionEndDateTime} />
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/live-auction-detail/${vehicle._id}`)}
                            className="bg-[#0B1E3D] text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-[#1e3a6a] active:scale-95 shadow-md hover:shadow-lg">
                            View Details
                          </button>
                          <button className="p-2.5 border border-slate-200 rounded-xl text-slate-400 hover:text-[#D97706] hover:border-[#D97706] transition-colors">
                            <HiOutlineHeart size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
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
            <AuctionSideFilter variant="live" onApply={setSidebarFilters} />

            {/* live auc faqs */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-[#0F172A] mb-4">Why Bid in Live Auctions?</h3>
              <div className="space-y-3">
                {points.map((point, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2">
                    <HiCheckCircle className="text-[#D97706] mt-0.5 shrink-0" size={18} />
                    <div>
                      <p className="text-sm font-semibold text-[#0F172A]">{point.title}</p>
                      <p className="text-[12px] text-slate-500">{point.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ====== auction footer ======= */}
      <AuctionBottomFeaturesBar />
    </section>
  )
}

export default LiveAuctions;
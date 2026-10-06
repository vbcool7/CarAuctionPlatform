
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiCamera, HiOutlineCog, HiOutlineTruck, HiOutlineBeaker, HiOutlineViewGrid, HiOutlineHeart, HiViewGrid, HiViewList } from "react-icons/hi";
import { IoCalendarNumberOutline, IoCarSportOutline, IoPeopleOutline, IoTimeOutline } from 'react-icons/io5';
import AuctionSideFilter from './SharedComponents/AuctionSideFilter';
import UpcomingAuctionCalender from './UpcomingAuctionCalender';
import AuctionBottomFeaturesBar from './SharedComponents/AuctionBottomFeaturesBar';
import SearchBar from './SharedComponents/SearchBar';
import FilterDropdown from './SharedComponents/FilterDropdown';
import { UseCountdown } from './SharedComponents/UseCountdown';
import { formatLabel, formatPrice } from '../utils/formatters';
import { getPaginationRange } from './utils/getPaginationRange';

import { useGetPublicAuctions } from '../hook/useAuction';
import useAuthStore from '../store/useAuthStore';
import { useGetWatchlistIds, useToggleWatchlist } from '../hook/useWatchlist';
import { toast } from 'react-toastify';

const stats = [
  { label: 'Upcoming Auctions', value: '32', icon: <IoCalendarNumberOutline className="text-blue-600" />, bgColor: 'bg-blue-50' },
  { label: 'Vehicles', value: '1,256', icon: <IoCarSportOutline className="text-emerald-600" />, bgColor: 'bg-emerald-50' },
  { label: 'Registered Bidders', value: '845', icon: <IoPeopleOutline className="text-purple-600" />, bgColor: 'bg-purple-50' },
  { label: 'Auctions Today', value: '28', icon: <IoTimeOutline className="text-orange-600" />, bgColor: 'bg-orange-50' },
];

const tabs = [
  { key: 'all', label: 'All Upcoming' },
  { key: 'today', label: 'Today' },
  { key: 'tomorrow', label: 'Tomorrow' },
  { key: 'week', label: 'This Week' },
  { key: 'next', label: 'Next Week' },
];

// tabs filter helper
const getTabRange = (tab) => {
  const day = (n) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + n);
    return d.toISOString();
  };
  switch (tab) {
    case 'today': return { startFrom: day(0), startTo: day(1) };
    case 'tomorrow': return { startFrom: day(1), startTo: day(2) };
    case 'week': return { startFrom: day(0), startTo: day(7) };
    case 'next': return { startFrom: day(7), startTo: day(14) };
    default: return {};
  }
};

const filterConfig = [
  {
    label: 'Sort By',
    key: 'sortBy',
    options: [
      { label: 'Starting Soonest', value: 'starting_soon' },
      { label: 'Newest Listed', value: 'newest' },
      { label: 'Price: Low to High', value: 'price_low' },
      { label: 'Price: High to Low', value: 'price_high' },
    ],
  },
];

const mapFiltersToParams = (filters, search) => {
  const params = {};
  if (filters.sortBy) params.sort = filters.sortBy;
  if (search) params.search = search;
  return params;
};

const AuctionStartsIn = ({ auctionStartDateTime }) => {
  const timeLeft = UseCountdown(auctionStartDateTime);
  return (
    <p className="flex items-center gap-1 text-[13px] font-bold text-blue-600 mt-0.5">
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

function UpcomingAuctions() {

  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);

  const [sidebarFilters, setSidebarFilters] = useState({});
  const [activeTab, setActiveTab] = useState('all');
  const [view, setView] = useState('grid');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFilters] = useState({ sortBy: 'starting_soon' });

  const params = mapFiltersToParams(filters, debouncedSearch);

  const { data, isLoading, isError } = useGetPublicAuctions({
    status: 'upcoming', page, limit: 10, ...params, ...getTabRange(activeTab),
    category: sidebarFilters.vehicleType,
    make: sidebarFilters.make,
    fuelType: sidebarFilters.fuelType,
    emirate: sidebarFilters.emirate,
    minPrice: sidebarFilters.minPrice,
    maxPrice: sidebarFilters.maxPrice,
  });

  const { data: watchlistIds } = useGetWatchlistIds();
  const { mutate: toggleWatchlist, isPending, variables: pendingId } = useToggleWatchlist();

  const upcomingVehicles = data?.data ?? [];
  const totalPages = data?.pagination?.totalPages || 1;

  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [filters, debouncedSearch, activeTab, sidebarFilters]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  if (isLoading) return <p className="p-10 text-center">Loading upcoming auctions....</p>;
  if (isError) return <p className="p-10 text-center text-red-500">Failed to load upcoming auctions</p>;

  // watchlist handler
  const handleWatchlistClick = (e, vehicle) => {
    e.stopPropagation();

    if (!token) {
      toast.info('Please login to add vehicles to your watchlist');
      navigate('/login');
      return;
    }

    toggleWatchlist(vehicle._id, {
      onSuccess: (data) => {
        toast.success(data?.message || 'Watchlist updated successfully');
      },
      onError: (error) => {
        toast.error(
          error?.response?.data?.message || 'Failed to update watchlist'
        );
      },
    });
  };

  return (
    <section className='w-full'>
      <div className='max-w-6xl mx-auto px-4 md:px-5 lg:px-6 py-8'>

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Upcoming Auctions</h1>
          <p className='text-sm text-slate-500'>Explore and bid on vehicles in upcoming auctions.</p>
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
              {upcomingVehicles.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-6 border border-slate-200 rounded-2xl bg-white">
                  <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mb-4">
                    <HiOutlineTruck className="text-[#D97706]" size={28} />
                  </div>

                  <h3 className="text-base font-bold text-[#0F172A]">
                    No Upcoming Auctions Found
                  </h3>

                  <p className="text-sm text-slate-500 text-center mt-1">
                    There are currently no upcoming auctions available.
                  </p>
                </div>
              ) : (
                upcomingVehicles.map((vehicle, index) => {

                  const isWatchlisted = !!watchlistIds?.has(vehicle._id);
                  const isToggling = isPending && pendingId === vehicle._id;

                  return (
                    <div
                      key={vehicle._id || index}
                      className="flex flex-col md:flex-row gap-4 p-3 border border-slate-200 rounded-2xl bg-white w-full transition-all duration-300 hover:shadow-xl hover:border-slate-300">

                      <div className="relative w-full sm:w-72 h-55 rounded-xl overflow-hidden shrink-0 group">
                        <img
                          src={vehicle.image}
                          alt={`${vehicle.year} ${formatLabel(vehicle.make)} ${formatLabel(vehicle.model)}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* Upcoming Badge */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-[#2563EB] text-white text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider">
                          <span className="h-1.5 w-1.5 rounded-full bg-white"></span>
                          Upcoming
                        </div>

                        <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-md text-white text-[10px] font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10">
                          <HiCamera size={14} /> {vehicle.imageCount ?? 0} Photos
                        </div>
                      </div>

                      {/* Details Section */}
                      <div className="flex flex-col justify-between grow min-w-0">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[#D97706] text-[9px] font-extrabold uppercase tracking-widest">Upcoming Auction</span>
                            <span className="text-[10px] font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{vehicle.listingId || 'NA'}</span>
                          </div>

                          <h3 className="text-lg font-bold text-[#0F172A] leading-tight truncate">{`${vehicle.year} ${formatLabel(vehicle.make)} ${formatLabel(vehicle.model)}`}</h3>

                          {/* Compact Specs */}
                          <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-600 flex-wrap">
                            {[
                              { icon: HiOutlineCog, val: formatLabel(vehicle.transmission) },
                              { icon: HiOutlineTruck, val: formatLabel(vehicle.bodyType) },
                              { icon: HiOutlineBeaker, val: formatLabel(vehicle.fuelType) },
                              { icon: HiOutlineViewGrid, val: formatLabel(vehicle.drivetrain) }
                            ].map((spec, i) => (
                              <div key={i} className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                                <spec.icon className="text-[#D97706]" size={12} /> {spec.val}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-3 pt-3 border-t border-slate-100">
                          <div className="grid grid-cols-3 gap-x-4 gap-y-2 mb-3">

                            {/* Location */}
                            <div>
                              <p className="text-[9px] text-slate-400 uppercase font-semibold">
                                Location
                              </p>
                              <p className="text-[11px] text-slate-800 font-semibold mt-0.5">
                                {formatLabel(vehicle.emirate)}
                              </p>
                            </div>

                            {/* Price */}
                            <div className="">
                              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                                {vehicle.priceType === 'fixed_price'
                                  ? 'Buy Now Price'
                                  : 'Starting Bid'}
                              </p>

                              <p className="font-bold text-[#0F172A] text-md mt-0.5">
                                {formatPrice(
                                  vehicle.priceType === 'fixed_price'
                                    ? vehicle.buyNowPrice
                                    : vehicle.startingBidPrice
                                )}
                              </p>
                            </div>

                            {/* Start In */}
                            <div>
                              <p className="text-[9px] text-slate-400 uppercase font-semibold">
                                StartIn:
                              </p>
                              <AuctionStartsIn auctionStartDateTime={vehicle.auctionStartDateTime}
                              />
                            </div>
                          </div>

                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() => navigate(`/upcoming-auction-detail/${vehicle._id}`)}
                              className="bg-[#0B1E3D] text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-[#1e3a6a] active:scale-95 shadow-md hover:shadow-lg">
                              View Details
                            </button>

                            <button
                              onClick={(e) => handleWatchlistClick(e, vehicle)}
                              disabled={isToggling}
                              className={`p-2 border rounded-xl transition-colors 
                                ${isWatchlisted
                                  ? "bg-rose-50 text-rose-500 border-rose-200 hover:bg-rose-100"
                                  : "border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-300"
                                }`}
                            >
                              <HiOutlineHeart
                                size={18}
                                className={isWatchlisted ? "fill-current" : ""}
                              />
                            </button>

                          </div>
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
            <AuctionSideFilter variant="upcoming" onApply={setSidebarFilters} />

            {/* upcoming auction calender */}
            <UpcomingAuctionCalender />

            {/* ── Why Join ── */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <h4 className="text-sm font-bold text-slate-900 mb-3">Why Join Upcoming Auctions?</h4>
              <ul className="space-y-2.5">
                {[
                  'Be the first to bid on newly listed vehicles',
                  'Get alerts when an auction begins',
                  'Set reminders and never miss an auction',
                  'Free to register and participate',
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-[12px] text-slate-600">
                    <span className="text-[#D97706] mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <AuctionBottomFeaturesBar />
    </section>
  )
}

export default UpcomingAuctions;
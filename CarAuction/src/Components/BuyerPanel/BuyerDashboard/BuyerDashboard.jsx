
import React, { useState } from 'react';
import { Navigation } from 'swiper/modules';
import { Gavel, Trophy, Heart, CreditCard, Bookmark, ChevronLeft, ChevronRight, ArrowRight, Plus, ShieldCheck, BadgeCheck, Headset, Award, Car } from 'lucide-react';
import { vehicles } from '../../../Components/Data';
import { formatLabel, formatPrice } from '../../../utils/formatters';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import FilterDropdown from '../BuyerSharedComponents/FilterDropdown';

import useAuthStore from '../../../store/useAuthStore';
import { useGetAllAuctions, useGetDistinctMakes, useGetDistinctModel } from '../../../hook/useAuction';
import { UseCountDown } from '../BuyerSharedComponents/UseCountDown';

// stats
const stats = [
  { title: "Bids Placed", value: "28", icon: Gavel, link: "View all bids", bgColor: "bg-blue-100/80", iconColor: "text-blue-600", },
  { title: "Won Auctions", value: "3", icon: Trophy, link: "View won", bgColor: "bg-green-100/80", iconColor: "text-green-600", page: 'won-auctions' },
  { title: "Watchlisted", value: "12", icon: Heart, link: "View watchlist", bgColor: "bg-orange-100/80", iconColor: "text-orange-600", page: 'watchlist' },
  { title: "Total Spent", value: "AED 285,000", icon: CreditCard, link: "View payments", bgColor: "bg-purple-100/80", iconColor: "text-purple-600" },
];

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

// count down
function AuctionCountdown({ item }) {
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

const features = [
  {
    icon: <ShieldCheck size={28} />,
    title: "Secure & Safe",
    desc: "100% secure bidding and payments"
  },
  {
    icon: <BadgeCheck size={28} />,
    title: "Verified Vehicles",
    desc: "All vehicles are inspected and verified"
  },
  {
    icon: <Headset size={28} />,
    title: "24/7 Support",
    desc: "Our team is always here to help you"
  },
  {
    icon: <Award size={28} />,
    title: "Best Deals",
    desc: "Competitive prices on quality vehicles"
  }
];

function BuyerDashboard({ setCurrentPage, openBidModal, setSelectedVehicleId, setPreviousPage }) {

  const { user } = useAuthStore();
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

  const { data: makesData } = useGetDistinctMakes();
  const { data: modelData } = useGetDistinctModel(filters.allMakes);
  const { data: allAuctions, isLoading, isError } = useGetAllAuctions({ tab: activeTab, ...params, limit: 20 });

  const auctions = allAuctions?.data || [];

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

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  {/* bid activity */ }
  const bidHistory = vehicles.slice(0, 3);

  {/* watchlist */ }
  const watchlistItems = vehicles.slice(3, 6);

  if (isLoading) return <p className="p-10 text-center">Loading all auctions....</p>;
  if (isError) return <p className="p-10 text-center text-red-500">Failed to load all auctions list</p>;

  return (
    <div className='pb-6 space-y-6'>

      {/* buyer heading */}
      <div className='space-y-1'>
        <h1 className='text-xl md:text-2xl font-bold text-slate-800'>Welcome Back, {formatLabel(user.firstName)}!👋</h1>
        <p className=' text-gray-600 text-[13px] md:text-sm font-medium'>Here's what's happening with your account today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="group relative bg-white px-4 py-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md hover:border-slate-200">

            {/* Subtle top accent */}
            <div className="absolute top-0 left-5 right-5 h-px bg-linear-to-r from-transparent via-slate-100 to-transparent" />

            {/* Icon */}
            <div
              className={`shrink-0 w-12 h-12 flex items-center justify-center rounded-xl ${stat.bgColor} ${stat.iconColor} ring-1 ring-inset ring-black/5 transition-all duration-300 group-hover:scale-105`}
            >
              <stat.icon
                size={23}
                strokeWidth={2}
                className="transition-transform duration-300 group-hover:scale-110"
              />
            </div>

            {/* Content */}
            <div className="flex flex-col min-w-0 flex-1">
              <p className="text-xs font-medium text-slate-500 mb-0.5">
                {stat.title}
              </p>

              <h3 className="text-2xl font-bold text-[#0B1E3D] leading-tight tracking-tight">
                {stat.value}
              </h3>

              <button
                type="button"
                onClick={() => setCurrentPage(stat.page)}
                className="mt-1.5 text-[#D97706] text-xs font-semibold flex items-center w-fit gap-1 transition-all duration-200 hover:text-[#B45309]"
              >
                {stat.link}

                <span className="transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* recommended list of auctions */}
      <div className="w-full ">
        <div className="space-y-6 bg-white p-4 md:p-6 rounded-3xl border border-slate-100 shadow-sm w-full">

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

          {/* list */}
          <div className="relative">
            <h2 className="text-lg md:text-xl font-bold text-[#0B1E3D] mb-7">
              Recommended For You
            </h2>

            {auctions?.length > 0 ? (
              <>
                <Swiper
                  modules={[Navigation]}
                  navigation={{
                    nextEl: '.custom-next',
                    prevEl: '.custom-prev',
                  }}
                  spaceBetween={16}
                  slidesPerView={1}
                  breakpoints={{
                    640: { slidesPerView: 2 },
                    1280: { slidesPerView: 3 }
                  }}
                >
                  {auctions.map((item) => {

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
                      <SwiperSlide key={item.id}>
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">

                          {/* Image */}
                          <div className="relative h-48 w-full overflow-hidden bg-slate-100">

                            <img
                              src={item.images?.[0]?.url || null}
                              alt={formatLabel(item.model) || "Vehicle"}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />

                            {/* Image Overlay */}
                            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                            {/* Status */}
                            <span
                              className={`absolute top-3 left-3 px-2.5 py-1 rounded-xl text-[8px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${statusStyles}`}
                            >
                              {item.auctionStatus === 'live' && (
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
                                </span>
                              )}

                              {formatLabel(item.auctionStatus)}
                            </span>

                            {/* Listing ID */}
                            <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-2.5 py-1 rounded-md">
                              {item.listingId || '---'}
                            </span>
                          </div>

                          {/* Details */}
                          <div className="p-4">

                            {/* Vehicle Name */}
                            <div className="mb-3">
                              <h3 className="font-bold text-[#0B1E3D] text-base truncate">
                                {`${item.year || ""} ${formatLabel(item.make)} ${formatLabel(item.model)}`}
                              </h3>

                              <p className="text-xs text-slate-500 mt-1">
                                {item.mileage || "NA"} • {item.transmission} • {item.fuelType}
                              </p>
                            </div>

                            {/* Vehicle Info */}
                            <div className="flex items-center gap-2 mb-4 flex-wrap">
                              {item.transmission && (
                                <span className="px-2 py-1 bg-slate-50 border border-slate-100 rounded-md text-[10px] font-medium text-slate-500">
                                  {item.transmission}
                                </span>
                              )}

                              {item.fuelType && (
                                <span className="px-2 py-1 bg-slate-50 border border-slate-100 rounded-md text-[10px] font-medium text-slate-500">
                                  {item.fuelType}
                                </span>
                              )}
                            </div>

                            {/* Price & Time */}
                            <div className="border-t border-slate-100 pt-3 mb-4">
                              <div className="flex items-end justify-between gap-3">

                                {/* Price */}
                                <div>
                                  <p className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">
                                    {priceLabel[item.auctionStatus] || 'Price'}
                                  </p>

                                  <p className="font-bold text-[#0B1E3D] text-lg mt-0.5">
                                    {formatPrice(priceValue[item.auctionStatus] || 0, 'AED')}
                                  </p>
                                </div>

                                {/* Time / Date */}
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

                            {/* Action Button */}
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
                      </SwiperSlide>
                    );
                  })}
                </Swiper>

                {/* Slider Arrow */}
                <button className="custom-prev absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-lg border border-slate-100 text-[#0B1E3D] hover:bg-[#D97706] hover:text-white transition-all">
                  <ChevronLeft size={22} />
                </button>

                <button className="custom-next absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-lg border border-slate-100 text-[#0B1E3D] hover:bg-[#D97706] hover:text-white transition-all">
                  <ChevronRight size={22} />
                </button>
              </>
            )
              : (
                /* No Data */
                <div className="bg-white border border-slate-100 rounded-3xl shadow-sm py-12 px-6 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-slate-50 flex items-center justify-center">
                    <Car className="text-slate-400" size={26} />
                  </div>

                  <h3 className="text-sm font-bold text-[#0B1E3D]">
                    No Vehicles Available
                  </h3>

                  <p className="text-xs text-slate-400 mt-1">
                    There are no recommended vehicles available right now.
                  </p>
                </div>
              )}
          </div>
        </div>
      </div>

      {/* mid section */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {/* bid activity */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm w-full">

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-[#0B1E3D]">
              Bid Activity
            </h2>
            <button
              onClick={() => setCurrentPage('bids')}
              className="flex items-center gap-1 text-[12px] md:text-sm font-semibold text-[#D97706] hover:text-[#D97706]/80 transition-colors cursor-pointer">
              View All <ArrowRight size={16} />
            </button>
          </div>

          {/* List */}
          <div className="space-y-6">
            {bidHistory.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 md:w-14 md:h-14 rounded-xl object-cover"
                />

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-600 truncate">
                    <span className="font-medium text-[#0B1E3D] text-[12px] md:text-sm">You placed a bid on</span>
                  </p>
                  <p className="font-semibold text-[#0B1E3D] text-[12px] md:text-sm truncate">{item.name}</p>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-bold text-[#0B1E3D] text-[12px] md:text-sm">{item.soldPrice || item.bid}</p>
                  <p className="text-xs text-slate-400">2 min ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* watchlist */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-[#0B1E3D]">
              Watchlist (12)
            </h2>
            <button
              onClick={() => setCurrentPage('watchlist')}
              className="flex items-center gap-1 text-[12px] md:text-sm font-semibold text-[#D97706] hover:text-[#D97706]/80 transition-colors">
              View All <ArrowRight size={16} />
            </button>
          </div>

          {/* List */}
          <div className="space-y-6">
            {watchlistItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 md:w-14 md:h-14 rounded-xl object-cover"
                />

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#0B1E3D] text-[12px] md:text-sm truncate">{item.name}</p>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-bold text-[#0B1E3D] text-[12px] md:text-sm">{item.soldPrice || item.bid}</p>

                  <p className={`text-xs font-medium ${item.status === 'live' ? 'text-green-600' : 'text-slate-500'
                    }`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* account summary */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm w-full h-full">
          <h2 className="text-lg font-bold text-[#0B1E3D] mb-6">
            Account Summary
          </h2>

          {/* Available Balance Box */}
          <div className="bg-gray-50 p-2 rounded-2xl flex items-center justify-between mb-6 border border-gray-100">
            <div>
              <p className="text-sm text-slate-500 font-medium">Available Balance</p>
              <p className="text-lg md:text-xl font-bold text-[#0B1E3D]">AED 50,000</p>
            </div>

            <button className="bg-[#D97706] flex items-center gap- px-4 py-2 rounded-xl text-sm font-semibold text-white border border-[#D97706] hover:bg-[#0B1E3D] hover:text-white transition-colors">
              <Plus size={18} /> Add Funds
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-slate-500">Total Spent</p>
              <p className="text-[14  px] font-bold text-[#0B1E3D] mt-1">AED 285,000</p>
            </div>
            <div className="text-center border-l border-slate-100">
              <p className="text-sm text-slate-500">Won Auctions</p>
              <p className="text-[14px] font-bold text-[#0B1E3D] mt-1">3</p>
            </div>
            <div className="text-center border-l border-slate-100">
              <p className="text-sm text-slate-500">Bids Placed</p>
              <p className="text-[14px] font-bold text-[#0B1E3D] mt-1">28</p>
            </div>
          </div>
        </div>
      </div>

      {/* feature bar */}
      <div className="bg-white p-3 md:p-6 rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex items-start gap-3 md:gap-4">

            <div className="p-2 md:p-3 rounded-2xl bg-amber-50 text-[#D97706]">
              {feature.icon}
            </div>

            {/* Text Content */}
            <div>
              <h3 className="font-bold text-[#0B1E3D] text-sm md:text-md">{feature.title}</h3>
              <p className="text-[13px] md:text-sm text-slate-500 mt-1 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BuyerDashboard;
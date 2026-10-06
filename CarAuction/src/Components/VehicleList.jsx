
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Eye, Clock, ChevronLeft, ChevronRight, X, Gauge, Fuel, MapPin, Zap, Search } from 'lucide-react';
import { UseCountdown } from './SharedComponents/UseCountdown';
import { toast } from 'react-toastify';
import Loader from './Loader';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

import { useGetPublicVehicles } from '../hook/useVehicle';
import { useListingFilters } from '../hook/useListingFilters';
import { formatDateTime, formatLabel, formatPrice } from '../utils/formatters';
import { getPaginationRange } from './utils/getPaginationRange';
import { useGetWatchlistIds, useToggleWatchlist } from '../hook/useWatchlist';
import useAuthStore from '../store/useAuthStore';

const getStatusStyles = (status) => {
  switch (status?.toLowerCase()) {
    case 'live':
      return 'bg-[#D97706]';

    case 'upcoming':
      return 'bg-blue-600';

    case 'sold':
      return 'bg-green-600';

    case 'unsold':
      return 'bg-red-600';

    case 'reserve-not-met':
      return 'bg-amber-500';

    default:
      return 'bg-slate-400';
  }
};

// timer
function AuctionTime({ vehicle }) {
  const targetDate =
    vehicle.auctionStatus === "upcoming"
      ? vehicle.auctionStartDateTime
      : vehicle.auctionEndDateTime;

  const timeLeft = UseCountdown(targetDate);

  const countdown = `${String(timeLeft.days).padStart(2, "0")}d : ${String(timeLeft.hours).padStart(2, "0")}h : ${String(timeLeft.mins).padStart(2, "0")}m : ${String(timeLeft.secs).padStart(2, "0")}s`;

  if (vehicle.auctionStatus === "upcoming") {
    return (
      <>
        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-1">
          Starts In
        </p>

        <div className="flex items-center justify-end gap-1 text-[#D97706]">
          <Clock size={13} />
          <span className="text-xs font-semibold tracking-wide">
            {countdown}
          </span>
        </div>
      </>
    );
  }

  if (vehicle.auctionStatus === "live") {
    return (
      <>
        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-1">
          Time Left
        </p>

        <div className="flex items-center justify-end gap-1 text-[#D97706]">
          <Clock size={13} />
          <span className="text-xs font-semibold tracking-wide">
            {countdown}
          </span>
        </div>
      </>
    );
  }

  return (
    <>
      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-1">
        Ended At
      </p>

      <div className="flex items-center justify-end gap-1 text-gray-600">
        <Clock size={13} className="text-gray-400" />
        <span className="text-xs font-medium">
          {formatDateTime(vehicle.auctionEndDateTime)}
        </span>
      </div>
    </>
  );
}

// btn lable
const getAuctionButtonLabel = (vehicle) => {
  if (["sold", "unsold", "reserve-not-met"].includes(vehicle.auctionStatus)) {
    return "View Details";
  }

  if (vehicle.priceType === "fixed_price") {
    return "Buy Now";
  }

  if (vehicle.auctionStatus === "upcoming") {
    return "Register to Bid";
  }

  return "Bid Now";
};

// navigate to detail page
const getAuctionDetailRoute = (vehicle) => {
  const { auctionStatus, _id } = vehicle;

  if (auctionStatus === "live") {
    return `/live-auction-detail/${_id}`;
  }

  if (auctionStatus === "upcoming") {
    return `/upcoming-auction-detail/${_id}`;
  }

  if (["sold", "unsold", "reserve-not-met"].includes(auctionStatus)) {
    return `/ended-auction-detail/${_id}`;
  }

  return `/live-auction-detail/${_id}`;
};

function VehicleList() {

  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [activeImg, setActiveImg] = useState(0);

  const { params, setPage } = useListingFilters();
  const { data, isLoading, isError, } = useGetPublicVehicles(params);
  const { data: watchlistIds } = useGetWatchlistIds();
  const { mutate: toggleWatchlist, isPending, variables: pendingId } = useToggleWatchlist();

  if (isLoading) {
    return <Loader />
  }
  if (isError) return <p className="p-10 text-center text-red-500">Failed to load vehicles list</p>;

  const vehicles = data?.data || [];
  const page = data?.page || 1;
  const totalPages = data?.pages || 1;

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
  }

  return (
    <div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        {vehicles.length > 0 ? (
          vehicles.map((vehicle, index) => {

            const images = vehicle.images?.map((img) => img.url) || [];
            const isWatchlisted = !!watchlistIds?.has(vehicle._id);
            const isToggling = isPending && pendingId === vehicle._id;

            return (
              <div
                key={vehicle._id || index}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
              >

                {/* Swiper Slider Section */}
                <div className="relative h-56 bg-gray-100 group">
                  <Swiper
                    navigation={{
                      nextEl: `.next-${vehicle._id}`,
                      prevEl: `.prev-${vehicle._id}`
                    }}
                    loop={true}
                    pagination={{ clickable: true }}
                    modules={[Navigation, Pagination]}
                    className="h-full w-full vehicleList"
                  >
                    {images.map((img, idx) => (
                      <SwiperSlide key={idx}>
                        <img
                          src={img}
                          alt={`${vehicle.year} ${formatLabel(vehicle.make)} ${formatLabel(vehicle.model)}`}
                          className="w-full h-full object-cover"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  {/* navigation arrows */}
                  <button
                    className={`prev-${vehicle._id} absolute top-1/2 left-2 z-10 p-1 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-all`}
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <button
                    className={`next-${vehicle._id} absolute top-1/2 right-2 z-10 p-1 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-all`}
                  >
                    <ChevronRight size={20} />
                  </button>

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span
                      className={`text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider text-white ${getStatusStyles(
                        vehicle.auctionStatus
                      )}`}
                    >
                      {formatLabel(vehicle.auctionStatus)}
                    </span>
                  </div>

                  {/* Watchlist/Eye */}
                  <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">

                    <button
                      onClick={(e) => handleWatchlistClick(e, vehicle)}
                      disabled={isToggling}
                      aria-label={isWatchlisted ? 'Remove from watchlist' : 'Add to watchlist'}
                      className={`p-2 rounded-full shadow-md transition-all duration-200 disabled:opacity-60 ${isWatchlisted
                        ? 'bg-[#D97706] text-white'
                        : 'bg-white text-slate-600 hover:bg-[#D97706] hover:text-white'
                        }`}
                    >
                      <Heart size={16} className={isWatchlisted ? 'fill-current' : ''} />
                    </button>

                    <button
                      onClick={() => setSelectedVehicle(vehicle)}
                      className="p-2 bg-white rounded-full shadow-md hover:bg-[#D97706] hover:text-white transition-colors"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </div>

                <div className="px-5 py-4">

                  {/* Vehicle Name */}
                  <h3 className="font-bold text-gray-900 text-lg mb-2 truncate">
                    {vehicle.year} {formatLabel(vehicle.make)} {formatLabel(vehicle.model)}
                  </h3>

                  <div className="space-y-4">

                    {/* Price + Time */}
                    <div className="flex justify-between items-end">

                      {/* Price */}
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-0.5">
                          {vehicle.priceType === "fixed_price"
                            ? "Buy Now Price"
                            : vehicle.auctionStatus === "upcoming"
                              ? "Starting Bid"
                              : "Current Bid"}
                        </p>

                        <p className="text-xl font-bold text-[#D97706]">
                          {vehicle.priceType === "fixed_price"
                            ? formatPrice(vehicle.buyNowPrice)
                            : vehicle.auctionStatus === "upcoming"
                              ? formatPrice(vehicle.startingBidPrice)
                              : formatPrice(vehicle.currentBid)}
                        </p>
                      </div>

                      {/* Time */}
                      <div className="text-right">
                        <AuctionTime vehicle={vehicle} />
                      </div>

                    </div>

                    {/* CTA */}
                    <button
                      onClick={() => navigate(getAuctionDetailRoute(vehicle))}
                      className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-[#D97706] transition-all"
                    >
                      {getAuctionButtonLabel(vehicle)}
                    </button>

                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Search size={26} className="text-[#D97706]" />
            </div>

            <h3 className="text-lg font-bold text-slate-700">
              No vehicles found
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Try adjusting or clearing your filters.
            </p>
          </div>
        )}
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
              onClick={() => setPage(page - 1)}
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
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>

          </div>
        </div>
      )}

      {/* eye modal */}
      {selectedVehicle && (() => {

        const selectedImages = selectedVehicle.images?.map((img) => img.url) || [];

        const isLive = selectedVehicle.auctionStatus === "live";
        const isUpcoming = selectedVehicle.auctionStatus === "upcoming";

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-md">
            <div className="relative w-full max-w-4xl max-h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">

              {/* Close Button */}
              <button
                onClick={() => setSelectedVehicle(null)}
                className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/90 shadow-md hover:bg-gray-100 transition"
              >
                <X size={16} />
              </button>

              <div className="flex flex-col lg:grid lg:grid-cols-[1.1fr_0.9fr] overflow-hidden h-full">

                {/* LEFT SIDE: Images */}
                <div className="bg-gray-50 flex flex-col">
                  <div className="relative h-50 sm:h-62.5 lg:h-full">
                    {selectedImages.length > 0 ? (
                      <img
                        src={selectedImages[activeImg]}
                        alt={`${selectedVehicle.year} ${formatLabel(selectedVehicle.make)} ${formatLabel(selectedVehicle.model)}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
                        No image available
                      </div>
                    )}

                    <div className="absolute top-4 left-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white ${getStatusStyles(
                          selectedVehicle.auctionStatus
                        )}`}>
                        {formatLabel(selectedVehicle.auctionStatus)}
                      </span>
                    </div>

                    {/* Image Counter */}
                    {selectedImages.length > 0 && (
                      <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/60 text-white text-[10px] font-medium">
                        {activeImg + 1} / {selectedImages.length}
                      </div>
                    )}
                  </div>
                </div>

                {/* RIGHT SIDE: Content */}
                <div className="p-4 sm:p-6 flex flex-col overflow-y-auto">
                  <div className="mb-4">
                    <p className="text-[#D97706] text-[10px] font-bold uppercase tracking-[2px] mb-1">Premium Auction</p>
                    <h2 className="text-lg sm:text-xl font-bold text-[#0B1E3D] leading-tight">
                      {selectedVehicle.year}{" "}
                      {formatLabel(selectedVehicle.make)}{" "}
                      {formatLabel(selectedVehicle.model)}
                    </h2>
                    <p className="text-sm text-gray-500">{selectedVehicle.emirate}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {[
                      { icon: Gauge, label: "Mileage", val: selectedVehicle.mileage || '---' },
                      { icon: Zap, label: "Engine", val: formatLabel(selectedVehicle.engineSize) || '---' },
                      { icon: Fuel, label: "Fuel", val: formatLabel(selectedVehicle.fuelType) || '---' },
                      { icon: MapPin, label: "Location", val: formatLabel(selectedVehicle.emirate) || '---' }
                    ].map((spec, i) => (
                      <div key={i} className="p-3 rounded-xl border border-gray-100">
                        <spec.icon size={16} className="text-[#D97706] mb-1" />
                        <p className="text-[10px] text-gray-400">{spec.label}</p>
                        <p className="text-sm font-semibold">{spec.val}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-[#0B1E3D] rounded-xl p-4 mb-5">
                    <p className="text-[10px] text-slate-300 uppercase tracking-widest font-semibold">
                      {selectedVehicle.priceType === "fixed_price"
                        ? "Buy Now Price"
                        : selectedVehicle.auctionStatus === "upcoming"
                          ? "Starting Bid"
                          : "Current Bid"}
                    </p>

                    <p className="text-2xl font-bold text-white mt-1">
                      {selectedVehicle.priceType === "fixed_price"
                        ? formatPrice(selectedVehicle.buyNowPrice)
                        : selectedVehicle.auctionStatus === "upcoming"
                          ? formatPrice(selectedVehicle.startingBidPrice)
                          : formatPrice(selectedVehicle.currentBid)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-auto">
                    <button className="py-2.5 rounded-lg border border-gray-200 text-sm font-semibold hover:bg-gray-50 transition">
                      Watchlist
                    </button>

                    <button
                      onClick={() => navigate(getAuctionDetailRoute(selectedVehicle))}
                      className="py-2.5 rounded-lg bg-[#D97706] text-white text-sm font-bold hover:brightness-110 transition">
                      {getAuctionButtonLabel(selectedVehicle)}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  );
};

export default VehicleList;
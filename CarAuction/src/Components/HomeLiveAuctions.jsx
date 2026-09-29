
import React from 'react';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from "swiper/modules";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { formatLabel, formatPrice } from '../utils/formatters';
import { useNavigate } from 'react-router-dom';
import { useGetHomeLiveAuctions } from '../hook/useAuction';
import { UseCountdown } from './SharedComponents/UseCountdown';

const LiveAuctionCard = ({ vehicle, navigate }) => {

    const timeLeft = UseCountdown(vehicle.auctionEndDateTime);
    const hasBids = (vehicle.totalBids ?? 0) > 0;

    return (
        <div className='bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group flex flex-col justify-between'>

            {/* Image & Badges */}
            <div className='relative w-full h-52 overflow-hidden bg-gray-100'>
                <img
                    src={vehicle.image}
                    alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                    className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                />

                {/* LIVE Badge */}
                <div className="absolute top-3 left-3 bg-[#EA580C] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1.5 tracking-wider">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span> LIVE
                </div>

                {/* Timer */}
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-md tracking-wide">
                    {timeLeft.days > 0 && `${timeLeft.days}d `}
                    {String(timeLeft.hours).padStart(2, "0")}:
                    {String(timeLeft.mins).padStart(2, "0")}:
                    {String(timeLeft.secs).padStart(2, "0")}
                </div>
            </div>

            {/* Content Area */}
            <div className='p-5 flex flex-col grow justify-between'>
                <div>
                    {/* Title & Model */}
                    <div className="mb-3">
                        <h4 className='font-bold text-gray-900 text-base truncate group-hover:text-[#EA580C] transition-colors'>
                            {`${vehicle.year} ${formatLabel(vehicle.make)} ${formatLabel(vehicle.model)}`}
                        </h4>
                        <p className='text-xs text-gray-500 mt-1'>
                            {formatLabel(vehicle.fuelType)} • {formatLabel(vehicle.transmission)} • {formatLabel(vehicle.bodyType)}
                        </p>
                    </div>

                    {/* Price & Bids Info Box */}
                    <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-3.5 mb-4 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] uppercase text-gray-400 font-extrabold tracking-wider mb-0.5">
                                {vehicle.priceType === 'fixed_price'
                                    ? 'Buy Now Price'
                                    : hasBids
                                        ? 'Current Bid'
                                        : 'Starting Bid'
                                }
                            </p>

                            <p className="font-extrabold text-gray-900 text-base">
                                {formatPrice(
                                    vehicle.priceType === 'fixed_price'
                                        ? vehicle.buyNowPrice
                                        : hasBids
                                            ? vehicle.currentBid
                                            : vehicle.startingBidPrice
                                )}
                            </p>
                        </div>

                        <div className="text-right border-l border-gray-200 pl-4">
                            <p className="text-[10px] uppercase text-gray-400 font-extrabold tracking-wider mb-0.5">Total Bids</p>
                            <p className="font-extrabold text-gray-900 text-base">{vehicle.totalBids ?? 0}</p>
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <button
                    onClick={() => navigate(`/live-auctions-detail/${vehicle._id}`)}
                    className="w-full bg-[#0B1E3D] hover:bg-[#132B54] border border-[#D97706]/40 text-white py-3 rounded-xl text-sm font-bold shadow-md transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 group-hover:border-[#D97706]">
                    {vehicle.priceType === 'fixed_price' ? 'Buy Now' : 'Place Bid'}
                </button>
            </div>
        </div>
    );
};

function HomeLiveAuctions() {

    const navigate = useNavigate();

    const { data: liveAuctionsResponse, isLoading, isError } = useGetHomeLiveAuctions();
    const liveAuctions = liveAuctionsResponse?.data || [];
    
    const handleStatusClick = (status) => {
        navigate(`/vehicle-list?status=live`);
    };

    if (isLoading) return <p className="p-10 text-center">Loading live auctions....</p>;
    if (isError) return <p className="p-10 text-center text-red-500">Failed to load live auctions</p>;

    return (
        <section className='w-full bg-white px-4 sm:px-5 lg:px-6 md:py-16 py-10'>
            <div className='max-w-6xl mx-auto'>

                {/* heading */}
                <div className="flex justify-between items-center pb-5 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-7 bg-[#D97706] rounded-full" />

                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3D]">
                                Live Auctions
                            </h1>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Auctions currently live
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => handleStatusClick('live-auctions')}
                        className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#D97706] hover:text-[#B45309] transition-colors whitespace-nowrap"
                    >
                        <span className="sm:hidden">View All</span>
                        <span className="hidden sm:inline">View All Live Auctions</span>
                        <span className="text-base">→</span>
                    </button>
                </div>

                <div className="live-auction-slider relative">

                    {/* Left Arrow */}
                    <button className="auction-prev hidden xl:flex absolute -left-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-xl border border-gray-100 items-center justify-center hover:bg-gray-50 transition">
                        <ChevronLeft size={20} />
                    </button>

                    {/* Right Arrow */}
                    <button className="auction-next hidden xl:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-xl border border-gray-100 items-center justify-center hover:bg-gray-50 transition">
                        <ChevronRight size={20} />
                    </button>

                    <Swiper
                        modules={[Autoplay, Navigation]}
                        navigation={{
                            prevEl: ".auction-prev",
                            nextEl: ".auction-next",
                        }}
                        slidesPerView={1}
                        spaceBetween={20}
                        loop={true}
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 4 },
                        }}
                        className="pb-10"
                    >
                        {liveAuctions.map((vehicle, index) => (
                            <SwiperSlide key={vehicle._id}>
                                <LiveAuctionCard
                                    vehicle={vehicle}
                                    navigate={navigate}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    )
}

export default HomeLiveAuctions;
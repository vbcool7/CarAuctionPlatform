
import React from 'react';
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from "swiper/modules";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { vehicles } from './Data';
import { useNavigate } from 'react-router-dom';

function UpcomingSimilarAuctions() {

    const navigate = useNavigate();

    const upcomingAuctions = vehicles.filter(item => item.status === 'upcoming');

    const handleStatusClick = (status) => {
        navigate(`/vehicle-list?status=${status}`);
    };

    return (
        <section className='w-full bg-white px-4 sm:px-5 lg:px-6 md:py-16 py-10'>
            <div className='max-w-6xl mx-auto'>

                {/* heading */}
                <div className='flex justify-between items-center pb-6'>
                    <h1 className='text-2xl md:text-3xl font-bold'>
                        Upcoming Auctions
                    </h1>

                    <p
                        onClick={() => handleStatusClick('upcoming')}
                        className="text-xs sm:text-sm md:text-base text-[#D97706] font-semibold cursor-pointer whitespace-nowrap">
                        <span className="sm:hidden">View All</span>
                        <span className="hidden sm:inline">
                            View All Upcoming Auctions</span>
                    </p>
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
                        {upcomingAuctions.map((upcoming, index) => (
                            <SwiperSlide key={index}>
                                <div className='bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group'>

                                    {/* Image Section */}
                                    <div className='relative w-full h-48 overflow-hidden'>
                                        <img
                                            src={upcoming.image}
                                            alt={upcoming.name}
                                            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                                        />

                                        {/* Badges */}
                                        <div className="absolute top-3 left-3 bg-[#D97706] text-white text-[9px] px-2 py-1 rounded font-bold uppercase tracking-wider flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span> Upcoming
                                        </div>

                                        {/* Timer - Made more compact */}
                                        <div className="absolute top-3 right-3 bg-black/50 text-white text-[10px] px-2 py-1 rounded-md backdrop-blur-md font-medium">
                                            {upcoming.timer}
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className='p-4'>
                                        <h4 className='font-bold text-slate-900 truncate mb-1'>{upcoming.name}</h4>
                                        <p className="text-[11px] text-slate-400 font-medium mb-4">
                                            {upcoming.biddingDate || "27 June 2026, 01:00 PM"}
                                        </p>

                                        {/* Stats */}
                                        <div className="flex items-center justify-between border-t border-slate-100 pt-3 mb-4">
                                            <div>
                                                <p className="text-[9px] uppercase text-slate-400 font-bold tracking-wider">Starting Bid</p>
                                                <p className="font-bold text-slate-900 text-sm">{upcoming.startingBid}</p>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <button
                                            onClick={() => navigate(`/upcoming-auctions-detail/${upcoming.id}`)}
                                            className="w-full bg-[#0B1E3D] hover:bg-[#132B54] text-white py-2.5 rounded-xl text-sm font-bold transition-all duration-300">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    )
}

export default UpcomingSimilarAuctions;
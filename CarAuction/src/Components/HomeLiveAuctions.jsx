
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

function HomeLiveAuctions() {

    const navigate = useNavigate();

    const liveCars = vehicles.filter(item => item.status === 'live');

    const handleStatusClick = (status) => {
        navigate(`/vehicle-list?status=${status}`);
    };

    return (
        <section className='w-full bg-white px-4 sm:px-5 lg:px-6 md:py-16 py-10'>
            <div className='max-w-6xl mx-auto'>

                {/* heading */}
                <div className='flex justify-between items-center pb-6'>
                    <h1 className='text-2xl md:text-3xl font-bold'>
                        Live Auctions
                    </h1>

                    <p
                        onClick={() => handleStatusClick('live')}
                        className="text-xs sm:text-sm md:text-base text-[#D97706] font-semibold cursor-pointer whitespace-nowrap">
                        <span className="sm:hidden">View All</span>
                        <span className="hidden sm:inline">View All Live Auctions</span>
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
                        {liveCars.map((live, index) => (
                            <SwiperSlide key={index}>
                                <div className='bg-white border border-gray-100 rounded-2xl hover:shadow-xl transition-all duration-300 group'>

                                    {/* Image & Badges */}
                                    <div className='relative w-full h-48 overflow-hidden rounded-t-xl mb-4'>
                                        <img
                                            src={live.image}
                                            alt={live.name}
                                            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                                        />
                                        {/* LIVE Badge */}
                                        <div className="absolute top-3 left-3 bg-[#EA580C] text-white text-[10px] px-2 py-1 rounded font-bold flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span> LIVE
                                        </div>
                                        {/* Timer */}
                                        <div className="absolute top-3 right-3 bg-black/60 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm">
                                            {live.timer}
                                        </div>
                                    </div>

                                    <div className='p-4'>
                                        {/* Title & Model */}
                                        <div className="mb-4">
                                            <h4 className='font-bold text-gray-900 truncate'>{live.name}</h4>
                                            <p className='text-xs text-gray-500'>{live.model}</p>
                                        </div>

                                        {/* Bids Info */}
                                        <div className="flex justify-between border-t border-gray-100 pt-4 mb-4">
                                            <div>
                                                <p className="text-[9px] uppercase text-gray-400 font-bold">Current Bid</p>
                                                <p className="font-bold text-gray-900">{live.bid}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[9px] uppercase text-gray-400 font-bold">Bids</p>
                                                <p className="font-bold text-gray-900">{live.totalBids}</p>
                                            </div>
                                        </div>

                                        {/* Bid Now */}
                                        <button
                                            onClick={() => navigate(`/live-auctions-detail/${live.id}`)}
                                            className="w-full bg-[#0B1E3D] hover:bg-[#132B54] border border-[#D97706] text-white py-2.5 rounded-lg text-sm font-bold transition-all duration-300 cursor-pointer">
                                            Bid Now
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

export default HomeLiveAuctions;
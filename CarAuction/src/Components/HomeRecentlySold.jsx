
import React from 'react';
import { useNavigate } from 'react-router-dom';

import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from "swiper/modules";

import { useGetHomeSoldAuctions } from '../hook/useAuction';
import { formatLabel, formatPrice } from '../utils/formatters';

function HomeRecentlySold() {

    const navigate = useNavigate();

    const { data: soldAuctionsResponse, isLoading, isError } = useGetHomeSoldAuctions();
    const soldAuctions = soldAuctionsResponse?.data || [];

    const handleStatusClick = (status) => {
        navigate(`/vehicle-list?status=${status}`);
    };

    if (isLoading) return <p className="p-10 text-center">Loading sold auctions....</p>;
    if (isError) return <p className="p-10 text-center text-red-500">Failed to load sold auctions</p>;

    return (
        <section className='w-full bg-white px-4 sm:px-5 lg:px-6 py-8'>
            <div className='max-w-6xl mx-auto'>

                {/* Heading */}
                <div className="flex justify-between items-center pb-5 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-7 bg-[#D97706] rounded-full" />

                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3D]">
                                Recently Sold Vehicles
                            </h1>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Recently completed auctions
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => handleStatusClick('/ended-auctions')}
                        className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#D97706] hover:text-[#B45309] transition-colors whitespace-nowrap"
                    >
                        <span className="sm:hidden">View All</span>
                        <span className="hidden sm:inline">View All Sold Auctions</span>
                        <span className="text-base">→</span>
                    </button>
                </div>

                <div className="recently-sold-slider">
                    <Swiper
                        modules={[Autoplay]}
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
                        {soldAuctions.map((vehicle, index) => (
                            <SwiperSlide key={index}>
                                <div
                                    onClick={() => navigate(`/ended-auctions-detail/${vehicle._id}`)}
                                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group flex flex-col justify-between cursor-pointer">

                                    {/* Image & SOLD Badge */}
                                    <div className="relative w-full h-52 overflow-hidden bg-gray-100">
                                        <img
                                            src={vehicle.image || null}
                                            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />

                                        {/* SOLD Badge (Soft Pill Style) */}
                                        <div className="absolute top-3 left-3 bg-emerald-600/95 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1.5 tracking-wider">
                                            <span className="w-1.5 h-1.5 bg-white rounded-full"></span> SOLD
                                        </div>
                                    </div>

                                    {/* Content Area */}
                                    <div className='p-5 flex flex-col flex-grow justify-between'>
                                        <div>
                                            {/* Title */}
                                            <div className="mb-3">
                                                <h4 className='font-bold text-gray-900 text-base truncate group-hover:text-[#EA580C] transition-colors'>
                                                    {`${vehicle.year} ${formatLabel(vehicle.make)} ${formatLabel(vehicle.model)}`}
                                                </h4>
                                            </div>

                                            {/* Details Box */}
                                            <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-3.5 mb-2 space-y-2 text-xs">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-400 font-bold uppercase text-[10px] tracking-wider">Sold Price</span>
                                                    <span className="font-extrabold text-gray-900 text-sm">
                                                        {formatPrice(vehicle.soldPrice)}
                                                    </span>
                                                </div>

                                                <div className="flex justify-between items-center border-t border-gray-200/60 pt-2">
                                                    <span className="text-gray-400 font-bold uppercase text-[10px] tracking-wider">Winner</span>
                                                    <span className="font-semibold text-gray-800 text-right truncate max-w-[120px]">
                                                        {vehicle.winner || 'User'}
                                                    </span>
                                                </div>

                                                <div className="flex justify-between items-center border-t border-gray-200/60 pt-2">
                                                    <span className="text-gray-400 font-bold uppercase text-[10px] tracking-wider">Sold On</span>
                                                    <span className="font-semibold text-gray-800">
                                                        {vehicle.soldOn || 'NA'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
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

export default HomeRecentlySold;

import React from 'react';
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from "swiper/modules";
import { vehicles } from './Data';
import { useNavigate } from 'react-router-dom';

function HomeRecentlySold() {

    const navigate = useNavigate();

    const soldCars = vehicles.filter(item => item.status === 'sold');

    const handleStatusClick = (status) => {
        navigate(`/vehicle-list?status=${status}`);
    };

    return (
        <section className='w-full bg-white px-4 sm:px-5 lg:px-6 py-8'>
            <div className='max-w-6xl mx-auto'>

                {/* heading */}
                <div className='flex justify-between items-center pb-6'>
                    <h1 className='text-2xl md:text-3xl font-bold'>
                        Recently Sold Vehicles
                    </h1>

                    <p
                        onClick={() => handleStatusClick('sold')}
                        className="text-xs sm:text-sm md:text-base text-[#D97706] font-semibold cursor-pointer whitespace-nowrap">
                        <span className="sm:hidden">View All</span>
                        <span className="hidden sm:inline">View All Sold Auctions</span>
                    </p>
                </div>

                {/* Slider Container */}
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
                        {soldCars.map((recent, index) => (
                            <SwiperSlide key={index}>
                                <div 
                                onClick={() => navigate(`/ended-auctions-detail/${recent.id}`)}
                                className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group">

                                    {/* Image */}
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={recent.image}
                                            alt={recent.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />

                                        {/* SOLD Badge */}
                                        <div className="absolute top-3 left-3 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-md">
                                            SOLD
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-4">
                                        <h3 className="font-bold text-gray-900 mb-5 truncate">
                                            {recent.name}
                                        </h3>

                                        <div className="space-y-3 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Sold Price</span>
                                                <span className="font-semibold text-gray-500">
                                                    {recent.soldPrice}
                                                </span>
                                            </div>

                                            <div className="flex justify-between gap-2">
                                                <span className="font-semibold text-gray-800">Winner</span>
                                                <span className="font-semibold text-gray-800 text-right truncate">
                                                    {recent.winner}
                                                </span>
                                            </div>

                                            <div className="flex justify-between">
                                                <span className="font-semibold text-gray-800">Sold On</span>
                                                <span className="font-semibold text-gray-800">
                                                    {recent.soldOn}
                                                </span>
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
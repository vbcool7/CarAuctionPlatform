
import React from 'react';
import { IoIosArrowForward } from "react-icons/io";
import { categories } from './Data';

import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from "swiper/modules";
import { useNavigate } from 'react-router-dom';

function HomeCategory() {

    const navigate = useNavigate();
    
    const handleCategoryClick = (categoryName) => {
    navigate(`/vehicle-list?category=${encodeURIComponent(categoryName)}`);
};

    return (
        <section className='w-full bg-white px-4 sm:px-5 lg:px-6 md:py-16 py-10'>
            <div className='max-w-6xl mx-auto'>

                {/* heading */}
                <div className="mb-8 md:mb-12 flex flex-col items-center text-center">
                    <div className="mb-3 h-1 w-20 rounded-full bg-[#F59E0B] md:h-1.5"></div>
                    <h2 className="text-2xl md:text-4xl font-bold text-gray-800">
                        Shop By Category
                    </h2>
                </div>

                {/* Slider Container */}
                <div className="category-slider">
                    <Swiper
                        modules={[Autoplay]}
                        pagination={{
                            clickable: true,
                            dynamicBullets: true,
                        }}
                        slidesPerView={2}
                        spaceBetween={12}
                        loop={true}
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        breakpoints={{
                            480: {
                                slidesPerView: 2,
                                spaceBetween: 16,
                            },
                            640: {
                                slidesPerView: 3,
                                spaceBetween: 18,
                            },
                            1024: {
                                slidesPerView: 5,
                                spaceBetween: 20,
                            },
                            1280: {
                                slidesPerView: 6,
                                spaceBetween: 20,
                            },
                        }}
                        className="pb-14"
                    >
                        {categories.map((category, index) => (
                            <SwiperSlide key={index}>

                                <div 
                                onClick={() =>handleCategoryClick(category.name)}
                                className='flex flex-col items-center p-3 border border-gray-100 rounded-2xl hover:shadow-xl transition-all cursor-pointer group bg-gray-50/50'>
                                    <div className='w-full h-28 md:h-32 overflow-hidden rounded-xl mb-3'>
                                        <img
                                            src={category.image}
                                            alt={category.name}
                                            className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
                                        />
                                    </div>
                                    <p className='font-semibold text-gray-700 group-hover:text-[#D97706]'>
                                        {category.name}
                                    </p>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* View All link */}
                <div className="flex items-center justify-center text-center mt-4 md:mt-6">
                    <button 
                    onClick={() => navigate('/vehicle-list')}
                    className="text-xs md:text-sm group flex items-center gap-0.5 text-[#D97706] font-semibold hover:underline transition-all duration-300">
                        View All Categories
                        <IoIosArrowForward className="text-lg md:text-xl transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                </div>
            </div>
        </section>
    )
}

export default HomeCategory;
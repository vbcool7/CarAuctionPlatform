
import React from 'react';
import { Star, Quote } from "lucide-react";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from "swiper/modules";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";

const testimonialsData = [
    {
        id: 1,
        name: "Ahmed Al Mansoori",
        role: "Verified Buyer",
        image:
            "https://randomuser.me/api/portraits/men/32.jpg",
        rating: 5,
        review:
            "I sold my BMW within just 3 days at an excellent price. The platform is professional, and the support team was outstanding.",
        vehicle: "2023 Mercedes-Benz G63",
    },
    {
        id: 2,
        name: "Omar Hassan",
        role: "Verified Seller",
        image:
            "https://randomuser.me/api/portraits/men/45.jpg",
        rating: 5,
        review:
            "I sold my BMW within just 3 days at an excellent price. The platform is professional, and the support team was outstanding.",
        vehicle: "2022 BMW M4 Competition",
    },
    {
        id: 3,
        name: "Khalid Al Fahim",
        role: "Premium Member",
        image:
            "https://randomuser.me/api/portraits/men/65.jpg",
        rating: 5,
        review:
            "Best auction platform I've used. Wide selection of vehicles, real-time bidding, and a seamless experience throughout.",
        vehicle: "2021 Porsche 911 Carrera",
    },
    {
        id: 4,
        name: "Sarah Johnson",
        role: "Verified Buyer",
        image:
            "https://randomuser.me/api/portraits/women/44.jpg",
        rating: 5,
        review:
            "The vehicle matched the listing perfectly. Everything from bidding to delivery was handled professionally.",
        vehicle: "2024 Range Rover Sport",
    },
    {
        id: 5,
        name: "David Walker",
        role: "Dealer",
        image:
            "https://randomuser.me/api/portraits/men/22.jpg",
        rating: 5,
        review:
            "BidDrive has become our preferred marketplace. The quality of listings and buyer engagement is exceptional.",
        vehicle: "Multiple Fleet Vehicles",
    },
];

function HomeReviews() {
    return (
        <section className='w-full bg-[#0B1E3D] px-4 sm:px-5 lg:px-6 md:py-16 py-10'>
            <div className='max-w-6xl mx-auto'>

                {/* heading */}
                <div className="text-center mb-14">
                    <div className="w-20 h-1 bg-[#D97706] rounded-full mx-auto mb-4"></div>

                    <h2 className="text-2xl md:text-4xl font-bold text-white">
                        What Our Customers Say
                    </h2>
                </div>

                <div className="">
                    <Swiper
                        modules={[Pagination, Autoplay]}
                        spaceBetween={24}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                        }}
                        loop={true}
                        pagination={{
                            clickable: true,
                        }}
                        breakpoints={{
                            0: {
                                slidesPerView: 1,
                            },
                            768: {
                                slidesPerView: 2,
                            },
                            1024: {
                                slidesPerView: 3,
                            },
                        }}
                        className="testimonialSwiper"
                    >
                        {testimonialsData.map((review) => (
                            <SwiperSlide key={review.id}>
                                <div className="mt-2 group relative h-full rounded-3xl border border-[#D97706]/20 bg-white/5 backdrop-blur-sm p-6 transition-all duration-300 hover:border-[#D97706] hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(217,119,6,0.15)]">

                                    {/* Rating */}
                                    <div className="flex gap-1 mb-5">
                                        {[...Array(review.rating)].map((_, index) => (
                                            <Star
                                                key={index}
                                                size={18}
                                                className="fill-yellow-500 text-yellow-600"
                                            />
                                        ))}
                                    </div>

                                    {/* Review */}
                                    <p className="text-slate-200 leading-7 mb-8 min-h-20 line-clamp-3">
                                        "{review.review}"
                                    </p>

                                    {/* User */}
                                    <div className="flex items-center gap-4 pt-5 border-t border-white/10">
                                        <img
                                            src={review.image}
                                            alt={review.name}
                                            className="w-14 h-14 rounded-full object-cover border-2 border-[#D97706]/40"
                                        />

                                        <div>
                                            <h4 className="font-semibold text-white">
                                                {review.name}
                                            </h4>

                                            <p className="text-sm text-slate-400">
                                                {review.role}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Quote */}
                                    <Quote
                                        size={40}
                                        className="absolute top-6 right-6 text-[#D97706]/20"
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

            </div>
        </section>
    )
}

export default HomeReviews;
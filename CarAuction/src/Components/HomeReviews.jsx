
import React from 'react';
import { Star, Quote } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from "swiper/modules";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";

import { useGetHomeReviews } from '../hook/useReview';

const prettyVehicle = (s) => String(s || '')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

function HomeReviews() {

    const { data: reviews = [] } = useGetHomeReviews();

    // if not featured by admin then null
    if (reviews.length === 0) return null;

    const canLoop = reviews.length > 3;

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

                <div>
                    <Swiper
                        key={reviews.length}
                        modules={[Pagination, Autoplay]}
                        spaceBetween={24}
                        autoplay={canLoop ? { delay: 4000, disableOnInteraction: false } : false}
                        loop={canLoop}
                        pagination={{ clickable: true }}
                        breakpoints={{
                            0: { slidesPerView: 1 },
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                        className="testimonialSwiper"
                    >
                        {reviews.map((review) => (
                            <SwiperSlide key={review._id} className="h-auto!">
                                <div className="mt-2 group relative h-full rounded-3xl border border-[#D97706]/20 bg-white/5 backdrop-blur-sm p-6 transition-all duration-300 hover:border-[#D97706] hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(217,119,6,0.15)]">

                                    {/* Rating */}
                                    <div className="flex gap-1 mb-5">
                                        {[1, 2, 3, 4, 5].map((n) => (
                                            <Star
                                                key={n}
                                                size={18}
                                                className={n <= review.rating ? 'fill-yellow-500 text-yellow-600' : 'text-white/20'}
                                            />
                                        ))}
                                    </div>

                                    {/* Review */}
                                    <p className="text-slate-200 leading-7 mb-8 min-h-20 line-clamp-3">
                                        {review.comment ? `"${review.comment}"` : 'Great experience on BidDrive.'}
                                    </p>

                                    {/* User */}
                                    <div className="flex items-center gap-4 pt-5 border-t border-white/10">

                                        <div className="w-14 h-14 shrink-0 rounded-full overflow-hidden border-2 border-[#D97706]/40">
                                            {review.reviewer?.profileImage ? (
                                                <img
                                                    src={review.reviewer.profileImage}
                                                    alt={review.reviewer?.name || 'Reviewer'}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';
                                                        e.currentTarget.nextElementSibling.style.display = 'flex';
                                                    }}
                                                />
                                            ) : null}

                                            <div
                                                className={`w-full h-full bg-[#D97706]/15 items-center justify-center text-lg font-bold text-[#D97706] 
                                                    ${review.reviewer?.profileImage ? 'hidden' : 'flex'}`}
                                            >
                                                {review.reviewer?.name?.[0]?.toUpperCase() || 'U'}
                                            </div>
                                        </div>

                                        <div className="min-w-0">
                                            <h4 className="font-semibold text-white truncate">
                                                {review.reviewer?.name}
                                            </h4>

                                            <p className="text-sm text-slate-400 truncate">
                                                {review.reviewer?.role}
                                                {review.vehicle ? ` · ${prettyVehicle(review.vehicle)}` : ''}
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

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

function VehicleSimilar() {
  return (
    <section className="w-full bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Heading */}
        <div className="flex justify-between items-center pb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            Similar Vehicles You May Like
          </h1>
          <button
            onClick={() => handleStatusClick('live')}
            className="text-[#D97706] font-semibold hover:text-[#b46405] transition-colors"
          >
            <span className="sm:hidden">View All</span>
            <span className="hidden sm:inline">View All Similar</span>
          </button>
        </div>

        <div className="relative group">
          {/* Navigation Arrows */}
          <button className="auction-prev absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center hover:scale-110 transition-transform">
            <ChevronLeft size={20} className="text-slate-700" />
          </button>
          <button className="auction-next absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center hover:scale-110 transition-transform">
            <ChevronRight size={20} className="text-slate-700" />
          </button>

          <Swiper
            modules={[Autoplay, Navigation]}
            navigation={{ prevEl: ".auction-prev", nextEl: ".auction-next" }}
            slidesPerView={1}
            spaceBetween={24}
            loop={true}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 4 } }}
          >
            {vehicles.slice(0, 8).map((live, index) => (
              <SwiperSlide key={index}>
                {/* CARD CONTAINER */}
                <div className="bg-[#0B1E3D] rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-slate-700/50">

                  {/* Image */}
                  <div className="relative w-full h-48 overflow-hidden">
                    <img
                      src={live.image}
                      alt={live.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <h4 className="font-bold text-white/90 truncate">{live.name}</h4>
                    <p className="text-xs text-slate-400 mb-4">{live.model}</p>

                    {/* Footer Info */}
                    <div className="flex justify-between items-center border-t border-slate-700 pt-4">
                      <div className="text-white/90 font-bold text-lg">{live.bid}</div>
                      <div className="flex items-center gap-1.5 bg-slate-800 px-2 py-1 rounded-md">
                        <span className="text-[10px] uppercase text-slate-400 font-bold">Bids</span>
                        <span className="text-white font-bold text-sm">{live.totalBids}</span>
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
  );
}

export default VehicleSimilar;
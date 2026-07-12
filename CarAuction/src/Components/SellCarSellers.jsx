import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Star } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/pagination';

function SellCarSellers() {

  const testimonials = [
    { name: "Ahmed R.", location: "Dubai, UAE", quote: "AutoBid made selling my car so easy! I received multiple offers and sold it for a great price." },
    { name: "Sarah K.", location: "Abu Dhabi, UAE", quote: "Professional team, smooth inspection and quick payment. Highly recommended!" },
    { name: "Omar H.", location: "Sharjah, UAE", quote: "Got a better price than I expected. The whole process was transparent and stress-free." },
    { name: "Fatima M.", location: "Ajman, UAE", quote: "Excellent platform! I sold my car within 3 days at the best market value." },
  ];

  return (
    <section className="w-full py-16 bg-sla">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <h2 className="text-3xl font-bold text-center text-[#0B1E3D] mb-16">
          Why Sell Your Car on BidDrive?
        </h2>

        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          loop={true}
          grabCursor={true}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true, el: '.custom-pagination' }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-20"
        >
          {testimonials.map((t, index) => (
            <SwiperSlide key={index} className="h-auto">

              {/* Premium Card Design */}
              <div className="group h-full p-8 bg-slate-50 rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(11,30,61,0.1)] transition-all duration-500 hover:-translate-y-2">
                <div className="flex gap-1 mb-6 text-[#F59E0B]">
                  {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="#F59E0B" strokeWidth={0} />)}
                </div>

                <p className="text-slate-700 text-lg mb-8 leading-relaxed italic group-hover:text-[#0B1E3D] transition-colors">
                  "{t.quote}"
                </p>

                <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                  <div className="w-12 h-12 rounded-full bg-[#D97706]/10 flex items-center justify-center text-[#D97706] font-bold text-lg border border-[#D97706]/20">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0B1E3D]">{t.name}</h4>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{t.location}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="custom-pagination flex justify-center gap-3 mt-6" />
      </div>

      <style jsx global>{`
        .custom-pagination .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #CBD5E1;
          transition: all 0.3s ease;
        }
        .custom-pagination .swiper-pagination-bullet-active {
          background: #D97706 !important;
          width: 30px;
          border-radius: 6px;
        }
      `}</style>
    </section>
  );
}

export default SellCarSellers;
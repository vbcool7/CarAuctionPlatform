
import React from 'react';
import HeroImg from '../assets/Images/HeroImg.jpg'

function Hero() {
  return (
    <section className="relative w-full h-150 overflow-hidden">

      <img
        src={HeroImg}
        alt="Hero Image"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] hover:scale-105"
      />
      <div className="absolute inset-0 bg-linear-to-r from-[#0F172A]/90 via-[#0F172A]/60 to-transparent" />

      <div className="relative max-w-6xl mx-auto px-6 h-full flex flex-col justify-center gap-8">

        {/* heading */}
        <div className="max-w-2xl text-white space-y-4 md:space-y-6">
          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
            Bid. Win. Drive. <br />
            Your <span className="text-[#D97706]">Dream Car.</span>
          </h1>

          <p className="text-md md:text-xl text-gray-300 max-w-lg leading-relaxed font-light">
            Join thousands of buyers in the Middle East's most trusted online car auction platform. Experience transparency, ease, and luxury.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4">
          <button className="group relative bg-[#D97706] text-white px-6 md:px-10 py-3 md:py-4 rounded-full font-semibold transition-all hover:shadow-[0_0_20px_rgba(217,119,6,0.5)] active:scale-95">
            Browse Auctions
          </button>

          <button className="border border-white/30 bg-white/10 backdrop-blur-md text-white px-6 md:px-10 py-3 md:py-4 rounded-full font-semibold hover:bg-white hover:text-[#0F172A] transition-all duration-300 active:scale-95">
            Sell Your Car
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
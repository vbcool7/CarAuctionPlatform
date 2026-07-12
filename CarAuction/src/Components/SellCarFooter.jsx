
import React from 'react';

function SellCarFooter() {
  return (
    <section className="w-full py-12 bg-[#0B1E3D]">
      <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-6">
        
        {/* Container: Glassmorphism effect */}
        <div className=" flex flex-col md:flex-row items-center justify-between gap-8 ">
          
          {/* Left Content */}
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-white mb-3">Ready to Sell Your Car?</h2>
            <p className="text-slate-300 text-sm max-w-md">
              Join thousands of satisfied sellers on AutoBid and get the best price for your car today.
            </p>
          </div>

          {/* Right Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <button className="bg-[#D97706] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#b86405] transition-all duration-300 shadow-lg shadow-[#D97706]/20">
              Get My Free Quote →
            </button>
            <button className="text-white px-8 py-3 rounded-xl font-semibold border-2 border-white/20 hover:bg-white/10 transition-all duration-300">
              How It Works →
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}

export default SellCarFooter;

import React from 'react';
import { Trophy, ArrowRight } from 'lucide-react';

function HowWorksFooter() {
  return (
    <section className="w-full py-6 bg-[#0B1E3D]">
      <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-6">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 border border-[#0B1E3D]/10">
          
          {/* Left: Icon and Text */}
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gray-600 rounded-2xl flex items-center justify-center shadow-sm">
              <Trophy size={40} className="text-[#D97706]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Ready to get started?
              </h2>
              <p className="text-gray-400 text-base ">
                Join thousands of happy customers buying and selling cars on AutoBid.
              </p>
            </div>
          </div>

          {/* Right: Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            
            <button className="bg-[#D97706] text-white px-8 py-2 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#b46205] transition-all">
              Browse Auctions <ArrowRight size={20} />
            </button>
        
            <button className="bg-transparent border-2 border-[#D97706] text-[#D97706] px-8 py-2 rounded-xl font-semibold hover:bg-[#D97706] hover:text-white transition-all">
              Sell Your Car
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}

export default HowWorksFooter;
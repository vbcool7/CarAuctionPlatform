
import React from 'react';
import { Zap, Lock } from 'lucide-react';
import { vehicles } from '../../Data';

function BuyerUpcomingAuctionDetailBidPanel ({ vehicleId }){
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6">
      {/* Header Info */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-slate-500 text-sm font-medium">Current Bid</p>
          <h2 className="text-3xl font-bold text-[#0B1E3D] mt-1">AED 120,000</h2>
          <span className="inline-block bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded mt-2 font-medium">
            Floor Price
          </span>
        </div>
        <p className="text-sm text-slate-500 font-medium">0 Bids</p>
      </div>

      {/* Status Message */}
      <p className="text-[#D97706] font-semibold text-sm mb-6">Be the first to bid!</p>

      {/* Next Minimum Bid */}
      <div className="flex justify-between items-center mb-6 py-3 border-y border-slate-100">
        <span className="text-slate-600 font-medium">Next Minimum Bid</span>
        <span className="text-[#0B1E3D] font-bold">AED 121,000</span>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3">
        {/* Place Bid Button */}
        <button 
          className="w-full bg-[#0B1E3D] text-white py-3 rounded-xl font-bold 
          transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          Place Bid
        </button>

        {/* Auto Bid Button */}
        <button 
          className="w-full flex items-center justify-center gap-2 border-2 border-[#0B1E3D] 
          text-[#0B1E3D] py-3 rounded-xl font-bold transition-all duration-200 
          hover:bg-[#0B1E3D] hover:text-white hover:scale-[1.02] active:scale-[0.98]"
        >
          <Zap size={18} />
          Auto Bid
        </button>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-center gap-2 mt-4 text-slate-500 text-xs">
        <Lock size={12} />
        <span>Enter your maximum bid and we'll bid for you.</span>
      </div>
    </div>
  );
};

export default BuyerUpcomingAuctionDetailBidPanel;
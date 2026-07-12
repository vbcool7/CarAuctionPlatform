
import React from 'react';
import { Bell } from 'lucide-react';

const BuyerUpcomingAuctionCard = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      
      <h3 className="font-bold text-[#0B1E3D] text-lg mb-2">
        Never Miss an Auction
      </h3>
      <p className="text-slate-600 text-sm mb-6 leading-relaxed">
        Get notified about upcoming auctions that match your preferences.
      </p>
      
      <button 
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 
        bg-white border border-[#0B1E3D] text-[#0B1E3D] font-bold rounded-lg 
        hover:bg-[#0B1E3D] hover:text-white transition-all duration-300"
      >
        <Bell size={18} />
        Manage Notifications
      </button>
    </div>
  );
};

export default BuyerUpcomingAuctionCard;

import React from 'react';
import { Gavel } from 'lucide-react'; 

function BuyerMyBidsAboutCard() {
  return (
    <div className="bg-white border border-slate-100 rounded-xl p-6 flex items-start gap-4 shadow-sm">

      {/* Icon Section */}
      <div className="p-3 bg-amber-50 rounded-lg shrink-0">
        <Gavel className="text-[#D97706] w-6 h-6" />
      </div>

      <div>
        <h2 className="text-lg font-bold text-[#0B1E3D] mb-1">About Bids</h2>
        <p className="text-sm text-slate-500 leading-relaxed font-semibold">
          Here you can track all your active bids, check if you are the highest bidder, 
          and manage your participation in auctions.
        </p>
      </div>
    </div>
  );
}

export default BuyerMyBidsAboutCard;
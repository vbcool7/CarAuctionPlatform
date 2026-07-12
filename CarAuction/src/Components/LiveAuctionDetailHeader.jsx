
import React from 'react';
import { Share2, Heart, MapPin, Hash, Fingerprint, Cog, Flag, Fuel } from 'lucide-react';

function LiveAuctionDetailHeader({ vehicle }) {

    const metaItems = [
    { icon: <MapPin size={16} />, label: vehicle.location },
    { icon: <Hash size={16} />, label: `Lot # ${vehicle.id}` },
    { icon: <Fingerprint size={16} />, label: `VIN: ${vehicle.vin}` },
    { icon: <Cog size={16} />, label: `${vehicle.engineSize} ${vehicle.engine}` },
    { icon: <Flag size={16} />, label: vehicle.driveType },
    { icon: <Fuel size={16} />, label: vehicle.fuelType }
  ];

  return (
    <div className=" border-b border-slate-100">

      {/* Top Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className='flex gap-3 items-center'>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {vehicle.name}
          </h1>
          
          <div className="flex gap-2 mt-3">
            <span className="bg-orange-50 text-orange-600 border border-orange-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
              Live Auction
            </span>
            <span className="bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
              Featured
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all">
            <Share2 size={18} /> Share
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all">
            <Heart size={18} /> Add to Watchlist
          </button>
        </div>
      </div>

      {/* Metadata Row - Premium Simplified */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-6 text-slate-600 text-sm font-medium">
        {metaItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="opacity-70">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LiveAuctionDetailHeader;
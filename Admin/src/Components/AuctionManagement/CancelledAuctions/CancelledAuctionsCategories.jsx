
import React from 'react';
import { allAuctionData } from '../../Data';
import { Info } from 'lucide-react';

function CancelledAuctionsCategories() {
  return (
    <div className="space-y-4">

      {/* Top Cancelled Categories */}
      <div className=" bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">Top Cancelled Categories</h3>
          <span className="text-xs font-medium text-amber-600 cursor-pointer hover:underline">View All</span>
        </div>
        <div className="space-y-3">
          {allAuctionData.topCancelledCategories?.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div 
              key={index} 
              className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${item.theme}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium text-gray-800">{item.name}</span>
                </div>
                <span className="text-xs font-medium text-gray-600">
                  {item.count} <span className="text-gray-400">({item.percentage})</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Helpful Information */}
      <div className="border border-slate-200 rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Helpful Information</h3>
        <p className="text-xs text-gray-600 mb-1">Cancelled auctions are not visible to regular users.</p>
        <p className="text-xs text-gray-600 mb-4">You can restore an auction to re-schedule it again.</p>
        <button className="inline-flex items-center space-x-2 px-3 py-1.5 bg-white border border-[#E3EBFF] text-amber-600 text-xs font-medium rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
          <Info className="w-3.5 h-3.5" />
          <span>Learn More</span>
        </button>
      </div>
    </div>
  );
}

export default CancelledAuctionsCategories;
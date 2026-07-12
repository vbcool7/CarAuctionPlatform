
import React from 'react';
import { AlertCircle } from 'lucide-react';

function EndedUnsoldMarketInsights() {
  // Static data as requested
  const data = {
    avgMarketPrice: 92000,
    highestBid: 78000,
    difference: -14000,
    hasBelowMarketWarning: true,
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm w-full max-w-sm">
      <h2 className="text-xl font-bold text-[#0B1E3D] mb-6">Market Insights</h2>

      {/* Average Market Price */}
      <div className="mb-6">
        <p className="text-sm text-slate-500 mb-1">Average Market Price</p>
        <p className="text-2xl font-bold text-[#0B1E3D]">AED {data.avgMarketPrice.toLocaleString()}</p>
      </div>

      <div className="border-t border-slate-100 my-6" />

      {/* Highest Bid and Difference */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-slate-500 mb-1">Highest Bid</p>
          <p className="text-lg font-bold text-[#0B1E3D]">AED {data.highestBid.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500 mb-1">Difference</p>
          <p className="text-lg font-bold text-red-600">
            {data.difference > 0 ? '+' : ''}{data.difference.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Warning Notification */}
      {data.hasBelowMarketWarning && (
        <div className="bg-red-50 border border-red-100 p-3 rounded-lg flex items-start gap-2">
          <AlertCircle className="text-red-500 shrink-0" size={18} />
          <p className="text-sm text-red-600 font-medium">
            Vehicle received bids below market value.
          </p>
        </div>
      )}
    </div>
  );
}

export default EndedUnsoldMarketInsights;

import React from 'react';
import { Gavel, Zap, ShieldCheck, Minus, Plus, Info } from 'lucide-react';

function BuyerLiveAuctionDetailBidPanel({ openBidModal, previousPage, vehicleId }) {
  return (
    <div className="w-full max-w-sm p-5 bg-white border border-gray-100 rounded-2xl shadow-sm">
      {/* Current Bid Section */}
      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-1">Current Bid</p>
        <h2 className="text-2xl font-bold text-[#D97706]">AED 126,000</h2>
        <div className="flex justify-between mt-3">
          <div>
            <p className="text-xs text-gray-500">Next Minimum Bid</p>
            <p className="font-bold text-[#0B1E3D]">AED 127,500</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Bid Increment</p>
            <p className="font-bold text-[#0B1E3D]">AED 1,500</p>
          </div>
        </div>
      </div>

      {/* Maximum Bid Input */}
      <div className="mb-6">
        <div className="flex items-center gap-1 mb-2">
          <label className="text-[13px] font-medium text-[#0B1E3D]">Your Maximum Bid <span className="text-gray-400">(Optional)</span></label>
          <Info className="w-4 h-4 text-gray-400" />
        </div>
        <div className="flex border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-3 bg-gray-50 flex items-center font-bold text-[#0B1E3D] border-r">AED</div>
          <input type="text" placeholder="Enter maximum bid" className="w-full p-2 outline-none" />
        </div>
        <p className="text-xs text-gray-500 mt-2">We will bid on your behalf up to your maximum limit.</p>
      </div>

      {/* Manual Bid Adjuster */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4">
        <button className="p-2 hover:bg-gray-200 rounded"><Minus className="w-5 h-5 text-[#0B1E3D]" /></button>
        <span className="font-bold text-lg text-[#0B1E3D]">AED 127,500</span>
        <button className="p-2 hover:bg-gray-200 rounded"><Plus className="w-5 h-5 text-[#0B1E3D]" /></button>
      </div>

      {/* Primary Actions */}
      <button
        onClick={() => openBidModal(vehicleId, 'live-auctions-detail')}
        className="w-full py-2 mb-3 flex items-center justify-center gap-2 bg-[#0B1E3D] text-white rounded-lg font-bold hover:opacity-90">
        <Gavel className="w-5 h-5" /> Bid Now
      </button>

      <button className="w-full py-2 mb-6 flex flex-col items-center justify-center border border-[#0B1E3D] text-[#0B1E3D] rounded-lg font-bold hover:bg-gray-50">
        <div className="flex items-center gap-2 text-[14px]"><Zap className="w-5 h-5" /> Quick Bid</div>
        <span className="text-xs font-medium">Bid next minimum amount</span>
      </button>

      {/* Security Note */}
      <div className="flex gap-3 p-4 bg-green-50 rounded-lg border border-green-100">
        <ShieldCheck className="w-8 h-8 text-green-600 shrink-0" />
        <div>
          <p className="text-sm font-bold text-green-800">You won't be charged now.</p>
          <p className="text-xs text-green-700">Payment is only required if you win the auction.</p>
        </div>
      </div>
    </div>
  );
}

export default BuyerLiveAuctionDetailBidPanel;
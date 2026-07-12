import React from 'react';
import { AlertTriangle, Check } from 'lucide-react';

const noticePoints = [
  "Please review the vehicle and all details carefully before placing a bid.",
  "All bids are binding and cannot be canceled.",
  "A refundable deposit is required to bid.",
];

function BuyerLiveAuctionDetailNotice() {
  return (
    <div className="w-full max-w-lg p-5 bg-orange-50 border border-orange-100 rounded-2xl">

      {/* Notice Header */}
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-orange-500" />
        <h3 className="text-md font-bold text-[#0B1E3D]">
          Important Notice
        </h3>
      </div>

      {/* Notice Points */}
      <ul className="space-y-3 mb-6">
        {noticePoints.map((point, index) => (
          <li 
          key={index} 
          className="flex items-start gap-2 text-[13px] text-[#0B1E3D]">
            <Check className="w-4 h-4 mt-0.5 text-green-600 shrink-0" />
            {point}
          </li>
        ))}
      </ul>

      {/* Footer Link */}
      <a
        className="text-[13px] font-semibold text-blue-600 hover:underline"
      >
        View Auction Terms & Conditions
      </a>
    </div>
  );
}

export default BuyerLiveAuctionDetailNotice;
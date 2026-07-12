
import React from 'react';
import { Circle } from 'lucide-react';

const bidHistory = [
  { status: 'Bid Placed', amount: 'AED 126,000', bidder: 'Bidder #2874', time: '2 min ago' },
  { status: 'Bid Placed', amount: 'AED 124,500', bidder: 'Bidder #1567', time: '4 min ago' },
  { status: 'Bid Placed', amount: 'AED 123,000', bidder: 'Bidder #3411', time: '6 min ago' },
];

function BuyerLiveAuctionDetailBidActivity() {
  return (
    <div className="w-full max-w-2xl bg-white p-6 border border-gray-100 rounded-2xl shadow-sm">
      <h2 className="text-md font-bold text-[#0B1E3D] mb-4">Live Bidding Activity</h2>

      <div className="space-y-4">
        {bidHistory.map((bid, index) => (
          <div
            key={index}
            className="grid grid-cols-4 items-center p-4 border border-gray-100 rounded-lg">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Circle className="w-2 h-2 text-green-500 fill-green-600" />
              {bid.status}
            </div>

            <div className="text-sm font-bold text-[#0B1E3D]">{bid.amount}</div>
            <div className="text-sm text-gray-600">{bid.bidder}</div>
            <div className="text-sm text-gray-500 text-right">{bid.time}</div>
          </div>
        ))}
      </div>

      <button className="w-full mt-6 text-sm font-semibold text-[#D97706] hover:text-[#D97706]/80 transition-colors">
        View All Bids
      </button>
    </div>
  );
}

export default BuyerLiveAuctionDetailBidActivity;
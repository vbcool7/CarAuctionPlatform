import React from 'react';
import { User } from 'lucide-react';

const topBidders = [
  { rank: 1, name: 'Ali Hassan', bids: '156 Bids', img: 'https://i.pravatar.cc/150?u=1' },
  { rank: 2, name: 'Mohammed R.', bids: '142 Bids', img: 'https://i.pravatar.cc/150?u=2' },
  { rank: 3, name: 'Omar Farooq', bids: '128 Bids', img: 'https://i.pravatar.cc/150?u=3' },
  { rank: 4, name: 'Zayd Khan', bids: '112 Bids', img: 'https://i.pravatar.cc/150?u=4' },
  { rank: 5, name: 'Sarah A.', bids: '98 Bids', img: 'https://i.pravatar.cc/150?u=5' },
];

function BuyerLiveAuctionsBidders() {
  return (
    <div className="max-w-sm p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
      {/* Title */}
      <h2 className="text-lg font-bold mb-6 text-[#0B1E3D]">
        Top Bidders (All Auctions)
      </h2>

      {/* List */}
      <div className="space-y-4">
        {topBidders.map((bidder) => (
          <div key={bidder.rank} className="flex items-center gap-4">
            <div
              className="w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded-full text-sm font-bold"
              style={{
                backgroundColor: bidder.rank <= 3 ? '#D97706' : '#F3F4F6',
                color: bidder.rank <= 3 ? '#FFFFFF' : '#0B1E3D'
              }}
            >
              {bidder.rank}
            </div>

            <img
              src={bidder.img}
              alt={bidder.name}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover" />

            <div className="text-[12px] md:text-sm flex-1 font-semibold text-[#0B1E3D]">
              {bidder.name}
            </div>
            <div className="text-[13px] md:text-sm font-medium text-[#0B1E3D]">
              {bidder.bids}
            </div>
          </div>
        ))}
      </div>

      {/* Button */}
      <button
        className="w-full mt-6 py-1.5 md:py-2 text-[#D97706] text-[13px] md:text-sm flex items-center justify-center gap-2 rounded-lg border font-semibold transition-colors"
      >
        <User className="w-4 h-4" />
        View All Bidders
      </button>
    </div>
  );
}

export default BuyerLiveAuctionsBidders;
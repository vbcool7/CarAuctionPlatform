
import React from 'react';

const auctionDetails = [
  { label: 'Auction Type', value: 'Live', valueColor: 'text-[#D97706]' },
  { label: 'Start Time', value: 'May 21, 2024 02:00 PM', valueColor: 'text-[#0B1E3D]' },
  { label: 'End Time', value: 'May 21, 2024 03:00 PM', valueColor: 'text-[#0B1E3D]' },
  { label: 'Time Extension', value: '2 min', valueColor: 'text-[#0B1E3D]' },
  { label: 'Participants', value: '28 Bidders', valueColor: 'text-[#0B1E3D]' },
  { label: 'Views', value: '156', valueColor: 'text-[#0B1E3D]' },
];

function BuyerLiveAuctionDetailAuctionInfo() {
  return (
    <div className="w-full max-w-sm bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-md font-bold text-[#0B1E3D]">Auction Information</h2>
      </div>

      {/* Details List */}
      <div className="px-5 py-4 space-y-4">
        {auctionDetails.map((detail, index) => (
          <div key={index} className="flex justify-between items-center text-[12px]">
            <span className="text-gray-600">{detail.label}</span>
            <span className={`font-semibold ${detail.valueColor}`}>
              {detail.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BuyerLiveAuctionDetailAuctionInfo;
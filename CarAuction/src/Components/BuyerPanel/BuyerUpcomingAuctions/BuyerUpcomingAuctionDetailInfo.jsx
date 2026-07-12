
import React from 'react';
import { Calendar } from 'lucide-react';

function BuyerUpcomingAuctionDetailInfo({ vehicleId }) {
  // Yahan aap vehicleId se data filter kar sakte hain
  const auctionData = {
    starts: "May 20, 2024 • 11:00 AM GST",
    ends: "May 20, 2024 • 12:00 PM GST",
    timeLeft: "2h 15m 30s",
    lotNumber: "245678",
    totalLots: "85",
    bidIncrement: "AED 1,000",
    vat: "5%"
  };

  const InfoRow = ({ label, value, highlight = false }) => (
    <div className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0">
      <span className="text-slate-600 text-sm">{label}</span>
      <span className={`text-sm font-medium ${highlight ? 'text-blue-600 font-bold' : 'text-slate-900'}`}>
        {value}
      </span>
    </div>
  );

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <h3 className="font-bold text-[#0B1E3D] text-lg mb-5">Auction Overview</h3>
      
      <div className="flex flex-col">
        <InfoRow label="Auction Starts" value={auctionData.starts} />
        <InfoRow label="Auction Ends (Est.)" value={auctionData.ends} />
        <InfoRow label="Time Left" value={auctionData.timeLeft} highlight={true} />
        <InfoRow label="Lot Number" value={auctionData.lotNumber} />
        <InfoRow label="Total Lots" value={auctionData.totalLots} />
        <InfoRow label="Bid Increment" value={auctionData.bidIncrement} />
        <InfoRow label="VAT" value={auctionData.vat} />
      </div>

      <button className="flex items-center gap-2 text-[#0B1E3D] font-semibold text-sm mt-6 hover:text-[#D97706] transition-colors">
        <Calendar size={18} />
        Add to Calendar
      </button>
    </div>
  );
}

export default BuyerUpcomingAuctionDetailInfo;
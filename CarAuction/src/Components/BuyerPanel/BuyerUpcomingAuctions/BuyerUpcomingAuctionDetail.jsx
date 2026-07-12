
import React from 'react'
import { Heart, Share2 } from 'lucide-react';
import { vehicles } from '../../Data';
import BuyerUpcomingAuctionDetailInfo from './BuyerUpcomingAuctionDetailInfo';
import BuyerUpcomingAuctionDetailTabs from './BuyerUpcomingAuctionDetailTabs';
import BuyerUpcomingAuctionDetailBidPanel from './BuyerUpcomingAuctionDetailBidPanel';
import BuyerAuctionSellerCard from '../BuyerAuctionSellerCard';
import BuyerVehicleGallery from '../BuyerSharedComponents/BuyerVehicleGallery';

function BuyerUpcomingAuctionDetail({ vehicleId, setCurrentPage, setSelectedSellerId, setPreviousPage }) {

  const vehicle = vehicles.find(v => v.id === vehicleId);

  return (
    <div>
      {/* Back button */}
      <button onClick={() => setCurrentPage("upcoming-auctions")}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-[#0B1E3D] mb-4">
        ← Back to Upcoming Auctions
      </button>

      {/* Header */}
      <div className="flex items-start justify-between mb-4">

        {/* Left */}
        <div >
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-blue-100 text-blue-700 text-[11px] font-bold px-2 py-0.5 rounded">UPCOMING</span>
            <span className="text-slate-500 text-sm">Lot # {vehicle?.id}</span>
          </div>

          <h1 className="text-2xl font-bold text-[#0B1E3D] flex items-center gap-2">
            {vehicle?.name}
          </h1>
          <div className="flex items-center gap-3 text-sm text-slate-500 mt-2">
            <span>⊙ {vehicle?.mileage}</span>
            <span>•</span>
            <span>{vehicle?.transmission}</span>
            <span>•</span>
            <span>{vehicle?.fuelType}</span>
            <span>•</span>
            <span>{vehicle?.bodyStyle}</span>
          </div>
        </div>

        {/* Center - Starts In */}
        <div className="bg-gray-50 border border-slate-200 rounded-xl px-6 py-2 text-start">
          <p className="text-xs text-slate-500 mb-1">Starts in</p>
          <p className="text-xl font-bold text-[#0B1E3D]">2h 15m 30s</p>
          <p className="text-xs text-slate-500 mt-1">{vehicle?.date} • {vehicle?.time}</p>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:border-[#D97706] transition-all">
            <Heart size={16} /> Add to Watchlist
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:border-[#D97706] transition-all">
            <Share2 size={16} /> Share
          </button>
        </div>
      </div>

      {/* 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <BuyerVehicleGallery vehicle={vehicle} />
          <BuyerUpcomingAuctionDetailInfo vehicleId={vehicleId} />
          <BuyerUpcomingAuctionDetailTabs vehicle={vehicle} />
        </div>

        {/* Right */}
        <div className="lg:col-span-4 sticky top-6">
          <BuyerUpcomingAuctionDetailBidPanel vehicleId={vehicleId} setCurrentPage={setCurrentPage} />
          <BuyerAuctionSellerCard
            vehicle={vehicle}
            setCurrentPage={setCurrentPage}
            setSelectedSellerId={setSelectedSellerId}
            setPreviousPage={setPreviousPage}
            currentPageName="upcoming-auctions-detail"
          />
        </div>

      </div>
    </div>
  )
}

export default BuyerUpcomingAuctionDetail;
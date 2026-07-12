
import React from 'react'
import BuyerDashStatsCard from './BuyerDashStatsCard';
import BuyerDashRecommended from './BuyerDashRecommended';
import BuyerDashBidActivity from './BuyerDashBidActivity';
import BuyerDashWatchlist from './BuyerDashWatchlist';
import BuyerDashAccountSummary from './BuyerDashAccountSummary';
import BuyerDashFeatures from './BuyerDashFeatures';

function BuyerDashboard({ setCurrentPage, openBidModal, setSelectedVehicleId, setPreviousPage }) {
  return (
    <>
      {/* buyer heading */}
      <div className=''>
        <h1 className='text-xl md:text-2xl font-bold text-slate-800'>Welcome Back, John!👋</h1>
        <p className='pt-1 text-gray-600 text-[13px] md:text-sm font-medium'>Here's what's happening with your account today.</p>
      </div>

      <BuyerDashStatsCard setCurrentPage={setCurrentPage} />

      <BuyerDashRecommended
        setCurrentPage={setCurrentPage}
        openBidModal={openBidModal}
        setSelectedVehicleId={setSelectedVehicleId}
        setPreviousPage={setPreviousPage}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        
        <BuyerDashBidActivity setCurrentPage={setCurrentPage} />

        <BuyerDashWatchlist setCurrentPage={setCurrentPage} />
        <BuyerDashAccountSummary />
      </div>

      <BuyerDashFeatures />
    </>
  )
}

export default BuyerDashboard;
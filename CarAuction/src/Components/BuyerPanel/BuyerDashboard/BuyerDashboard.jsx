
import React from 'react'
import { Gavel, Trophy, Heart, CreditCard } from 'lucide-react';

import BuyerDashRecommended from './BuyerDashRecommended';
import BuyerDashBidActivity from './BuyerDashBidActivity';
import BuyerDashWatchlist from './BuyerDashWatchlist';
import BuyerDashAccountSummary from './BuyerDashAccountSummary';
import BuyerDashFeatures from './BuyerDashFeatures';

const stats = [
  { title: "Bids Placed", value: "28", icon: Gavel, link: "View all bids", bgColor: "bg-blue-100/80", iconColor: "text-blue-600", },
  { title: "Won Auctions", value: "3", icon: Trophy, link: "View won", bgColor: "bg-green-100/80", iconColor: "text-green-600", page: 'won-auctions' },
  { title: "Watchlisted", value: "12", icon: Heart, link: "View watchlist", bgColor: "bg-orange-100/80", iconColor: "text-orange-600", page: 'watchlist' },
  { title: "Total Spent", value: "AED 285,000", icon: CreditCard, link: "View payments", bgColor: "bg-purple-100/80", iconColor: "text-purple-600" },
];

function BuyerDashboard({ setCurrentPage, openBidModal, setSelectedVehicleId, setPreviousPage }) {
  return (
    <>
      {/* buyer heading */}
      <div className=''>
        <h1 className='text-xl md:text-2xl font-bold text-slate-800'>Welcome Back, John!👋</h1>
        <p className='pt-1 text-gray-600 text-[13px] md:text-sm font-medium'>Here's what's happening with your account today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="group bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4
                       transition-all duration-300 ease-out
                       hover:-translate-y-0.5 hover:shadow-lg hover:border-slate-200"
          >

            {/* Icon */}
            <div
              className={`p-2.5 rounded-2xl ${stat.bgColor} ${stat.iconColor}
                            transition-all duration-300
                            group-hover:scale-105 group-hover:shadow-sm`}
            >
              <stat.icon
                size={25}
                strokeWidth={2}
                className="transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Content */}
            <div className="flex flex-col min-w-0">

              <h3 className="text-2xl font-bold text-[#0B1E3D] leading-tight">
                {stat.value}
              </h3>

              <p className="text-slate-500 text-sm mb-1 mt-0.5">
                {stat.title}
              </p>

              <button
                type="button"
                onClick={() => setCurrentPage(stat.page)}
                className="text-[#D97706] text-xs font-semibold flex items-center
                               w-fit transition-all duration-200
                               hover:text-[#B45309] hover:gap-1.5"
              >
                {stat.link}
                <span className="ml-1 transition-transform duration-200 group-hover:translate-x-0.5">
                  →
                </span>
              </button>

            </div>
          </div>
        ))}
      </div>

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
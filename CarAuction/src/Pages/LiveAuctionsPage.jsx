
import React, { useState } from 'react'
import { HiSearch, HiViewGrid, HiViewList } from 'react-icons/hi';
import { HiOutlineRefresh } from 'react-icons/hi';
import { vehicles } from "../Components/Data";
import LiveAuctionsStats from '../Components/LiveAuctionsStats';
import LiveAuctions from '../Components/LiveAuctions';
import AuctionFooter from '../Components/AuctionFooter';
import AuctionSideFilter from '../Components/AuctionSideFilter';
import LiveAuctionFAQs from '../Components/LiveAuctionFAQs';

function LiveAuctionsPage() {

  const [view, setView] = useState('grid');
  const [visibleCount, setVisibleCount] = useState(5);
  
  const liveVehicles = vehicles.filter((v) => v.status === "live");

  return (
    <section className='w-full'>
      <div className='max-w-6xl mx-auto px-4 md:px-5 lg:px-6 py-8'>

        {/* ======= heading ======= */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Live Auctions</h1>
          <p className='text-sm text-slate-500'>Explore and bid on vehicles in live auctions.</p>
        </div>

        {/* ===== stats ===== */}
        <LiveAuctionsStats vehicle={vehicles} />

        {/* ===== two-column layout ===== */}
        <div className="flex flex-col md:flex-row gap-6 mt-6">

          {/* Left: main content */}
          <div className="w-full md:w-[70%] space-y-4">

            {/* search bar */}
            <div className="w-full mt-6 mb-6">
              <div className="w-full mt-6">

                {/* Tab */}
                <div className="border-b border-slate-200 mb-6">
                  <button className="text-[#D97706] font-medium pb-3 border-b-2 border-blue-[#D97706] px-1">
                    All Lives
                  </button>
                </div>

                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                  {/* Search Bar */}
                  <div className="relative w-full md:grow">
                    <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
                    <input
                      type="text"
                      placeholder="Search by make, model or lot number..."
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  {/* Sort & View Toggle */}
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <select className="w-full md:w-48 px-3 py-2.5 border border-slate-200 rounded-lg text-slate-700 bg-white focus:outline-none">
                      <option>Sort By: Soonest First</option>
                    </select>

                    <div className="flex border border-slate-200 rounded-lg overflow-hidden h-11.25">
                      <button
                        onClick={() => setView('grid')}
                        className={`px-3 py-2 ${view === 'grid' ? 'bg-slate-100 text-[#D97706]' : 'text-slate-500'}`}
                      >
                        <HiViewGrid size={20} />
                      </button>
                      <button
                        onClick={() => setView('list')}
                        className={`px-3 py-2 border-l border-slate-200 ${view === 'list' ? 'bg-slate-100 text-[#D97706]' : 'text-slate-500'}`}
                      >
                        <HiViewList size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ====== List ====== */}
            <div className="space-y-4">
              {liveVehicles.slice(0, visibleCount).map((vehicle) => (
                <LiveAuctions key={vehicle.id} vehicle={vehicle} />
              ))}

              {visibleCount < liveVehicles.length && (
                <button
                  onClick={() => setVisibleCount((prev) => prev + 5)}
                  className="w-60 mx-auto flex items-center justify-center gap-2 border border-[#D97706] text-[#D97706] py-2.5 rounded-lg text-sm font-semibold hover:bg-[#D97706]/5 transition cursor-pointer"
                >
                  <HiOutlineRefresh size={16} /> Load More Auctions
                </button>
              )}
            </div>
          </div>

          {/* Right: filter sidebar */}
          <div className="w-full md:w-[30%] space-y-4">
            <AuctionSideFilter />
            <LiveAuctionFAQs />
          </div>

        </div>
      </div>

      {/* ====== auction footer ======= */}
      <AuctionFooter />
    </section>
  )
}

export default LiveAuctionsPage;
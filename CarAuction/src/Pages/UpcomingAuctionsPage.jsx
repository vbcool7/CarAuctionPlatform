
import React, { useState } from 'react';
import { HiSearch, HiViewGrid, HiViewList } from 'react-icons/hi';
import { HiOutlineRefresh } from 'react-icons/hi';
import { vehicles } from "../Components/Data";
import UpcomingAuctionStats from '../Components/UpcomingAuctionStats';
import AuctionFooter from '../Components/AuctionFooter';
import UpcomingAuctions from '../Components/UpcomingAuctions';
import AuctionSideFilter from '../Components/AuctionSideFilter';
import UpcomingAuctionCalender from '../Components/UpcomingAuctionCalender';
import UpcomingAuctionFAQs from '../Components/UpcomingAuctionFAQs';

function UpcomingAuctionsPage() {

  const [view, setView] = useState('list');
  const [visibleCount, setVisibleCount] = useState(5);
  const [activeTab, setActiveTab] = useState('all');

  const upcomingVehicles = vehicles.filter((v) => v.status === "upcoming");

  const tabs = [
    { key: 'all', label: 'All Upcoming' },
    { key: 'today', label: 'Today' },
    { key: 'tomorrow', label: 'Tomorrow' },
    { key: 'week', label: 'This Week' },
    { key: 'next', label: 'Next Week' },
  ];

  const filteredVehicles = upcomingVehicles.filter((v) => {
    if (activeTab === 'all') return true;

    const start = new Date(v.startTime);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
    const weekEnd = new Date(today); weekEnd.setDate(today.getDate() + 7);
    const nextWeekEnd = new Date(today); nextWeekEnd.setDate(today.getDate() + 14);

    if (activeTab === 'today') return start >= today && start < tomorrow;
    if (activeTab === 'tomorrow') return start >= tomorrow && start < new Date(tomorrow.getTime() + 86400000);
    if (activeTab === 'week') return start >= today && start < weekEnd;
    if (activeTab === 'next') return start >= weekEnd && start < nextWeekEnd;
    return true;
  });

  return (
    <section className='w-full'>
      <div className='max-w-6xl mx-auto px-4 md:px-5 lg:px-6 py-8'>

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Upcoming Auctions</h1>
          <p className='text-sm text-slate-500'>Explore and bid on vehicles in upcoming auctions.</p>
        </div>

        {/* Stats */}
        <UpcomingAuctionStats vehicles={upcomingVehicles} />

        {/* Two-column layout */}
        <div className="flex flex-col md:flex-row gap-6 mt-6">

          {/* Left: main content */}
          <div className="w-full md:w-[70%] space-y-4">

            {/* Tabs */}
            <div className="border-b border-slate-200">
              <div className="flex gap-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.key
                      ? 'border-[#D97706] text-[#D97706]'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search + Sort + View */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center mt-4">
              <div className="relative w-full md:grow">
                <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
                <input
                  type="text"
                  placeholder="Search by make, model or lot number..."
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D97706]/20"
                />
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <select className="w-full md:w-48 px-3 py-2.5 border border-slate-200 rounded-lg text-slate-700 bg-white focus:outline-none">
                  <option>Sort By: Soonest First</option>
                  <option>Sort By: Starting Bid (Low)</option>
                  <option>Sort By: Starting Bid (High)</option>
                </select>
                <div className="flex border border-slate-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setView('grid')}
                    className={`px-3 py-2.5 ${view === 'grid' ? 'bg-slate-100 text-[#D97706]' : 'text-slate-500'}`}
                  >
                    <HiViewGrid size={20} />
                  </button>
                  <button
                    onClick={() => setView('list')}
                    className={`px-3 py-2.5 border-l border-slate-200 ${view === 'list' ? 'bg-slate-100 text-[#D97706]' : 'text-slate-500'}`}
                  >
                    <HiViewList size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Cards */}
            <div className="space-y-4 mt-2">
              {filteredVehicles.length === 0 ? (
                <div className="text-center py-16 text-slate-400 text-sm">
                  No upcoming auctions found for this period.
                </div>
              ) : (
                filteredVehicles.slice(0, visibleCount).map((vehicle) => (
                  <UpcomingAuctions key={vehicle.id} vehicle={vehicle} />
                ))
              )}

              {visibleCount < filteredVehicles.length && (
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
            <AuctionSideFilter variant="upcoming"/>
            <UpcomingAuctionCalender />
            <UpcomingAuctionFAQs />
          </div>
        </div>
      </div>

      <AuctionFooter />
    </section>
  )
}

export default UpcomingAuctionsPage;
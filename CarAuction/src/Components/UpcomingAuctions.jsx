
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiSearch, HiViewGrid, HiViewList, HiOutlineRefresh } from 'react-icons/hi';
import { HiCamera, HiOutlineCog, HiOutlineTruck, HiOutlineBeaker, HiOutlineViewGrid, HiLocationMarker, HiClock, HiOutlineBell, HiOutlineTag, HiChevronRight, HiOutlineHeart } from "react-icons/hi";
import { IoCalendarNumberOutline, IoCarSportOutline, IoPeopleOutline, IoTimeOutline } from 'react-icons/io5';
import { vehicles } from "./Data";
import AuctionSideFilter from './SharedComponents/AuctionSideFilter';
import UpcomingAuctionCalender from './UpcomingAuctionCalender';
import AuctionBottomFeaturesBar from './SharedComponents/AuctionBottomFeaturesBar';

const stats = [
  { label: 'Upcoming Auctions', value: '32', icon: <IoCalendarNumberOutline className="text-blue-600" />, bgColor: 'bg-blue-50' },
  { label: 'Vehicles', value: '1,256', icon: <IoCarSportOutline className="text-emerald-600" />, bgColor: 'bg-emerald-50' },
  { label: 'Registered Bidders', value: '845', icon: <IoPeopleOutline className="text-purple-600" />, bgColor: 'bg-purple-50' },
  { label: 'Auctions Today', value: '28', icon: <IoTimeOutline className="text-orange-600" />, bgColor: 'bg-orange-50' },
];

function UpcomingAuctions() {

  const navigate = useNavigate();

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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center gap-4 shadow-sm">
              <div className={`p-3 ${stat.bgColor} rounded-xl text-xl`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>

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

            {/* list */}
            <div className="space-y-4 mt-2">
              {filteredVehicles.length === 0 ? (
                <div className="text-center py-16 text-slate-400 text-sm">
                  No upcoming auctions found for this period.
                </div>
              ) : (
                filteredVehicles.slice(0, visibleCount).map((vehicle) => (
                  <div className="flex flex-col md:flex-row gap-4 p-3 border border-slate-200 rounded-2xl bg-white w-full transition-all duration-300 hover:shadow-xl hover:border-slate-300">

                    {/* Image Section */}
                    <div className="relative w-full md:w-60 md:self-stretch min-h-50 rounded-xl overflow-hidden shrink-0 group">
                      <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 bg-[#D97706]/95 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-white rounded-full" /> Featured
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-md text-white text-[9px] px-2 py-1 rounded-lg">
                        {vehicle.images.length} Photos
                      </div>
                    </div>

                    {/* Details Section */}
                    <div className="flex flex-col justify-between grow min-w-0">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[#D97706] text-[9px] font-extrabold uppercase tracking-widest">Upcoming Auction</span>
                          <span className="text-[10px] font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">Lot # {vehicle.id}</span>
                        </div>

                        <h3 className="text-lg font-bold text-[#0F172A] leading-tight truncate">{vehicle.name}</h3>
                        <p className="text-[11px] text-slate-500 font-medium">VIN: {vehicle.vin}</p>

                        {/* Compact Specs */}
                        <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-600 flex-wrap">
                          {[
                            { icon: HiOutlineCog, val: vehicle.engine },
                            { icon: HiOutlineTruck, val: vehicle.bodyStyle },
                            { icon: HiOutlineBeaker, val: vehicle.fuelType },
                            { icon: HiOutlineViewGrid, val: vehicle.driveType }
                          ].map((spec, i) => (
                            <div key={i} className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                              <spec.icon className="text-[#D97706]" size={12} /> {spec.val}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-3">
                          <p className="text-[9px] text-slate-400 uppercase font-semibold">Start: <span className="text-slate-800">{vehicle.startTime ? new Date(vehicle.startTime).toLocaleDateString('en-AE') : '—'}</span></p>
                          <p className="text-[9px] text-slate-400 uppercase font-semibold">Loc: <span className="text-slate-800">{vehicle.location}</span></p>
                          <p className="text-[9px] text-slate-400 uppercase font-semibold">Duration: <span className="text-slate-800">{vehicle.estDuration || '—'}</span></p>
                          <p className="text-[9px] text-slate-400 uppercase font-semibold">Bids: <span className="text-slate-800">{vehicle.totalBids ?? 0}</span></p>
                        </div>

                        <div className="flex items-center border border-slate-100 rounded-xl bg-slate-50/50">
                          <div className="flex-1 py-2 px-3">
                            <p className="text-[9px] text-slate-400 uppercase font-bold">Starting Bid</p>
                            <p className="text-sm font-bold text-[#0F172A]">{vehicle.startingBid || '—'}</p>
                          </div>
                          <div className="w-px h-8 bg-slate-200" />
                          <div className="flex-1 py-2 px-3 text-right">
                            <p className="text-[9px] text-slate-400 uppercase font-bold">Est. Value</p>
                            <p className="text-sm font-bold text-[#0F172A]">{vehicle.estValue || '—'}</p>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => navigate(`/upcoming-auctions-detail/${vehicle.id}`)}
                            className="bg-[#0B1E3D] text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-[#1e3a6a] active:scale-95 shadow-md hover:shadow-lg">
                            View Details
                          </button>
                          <button className="p-2.5 border border-slate-200 rounded-xl text-slate-400 hover:text-[#D97706] hover:border-[#D97706] transition-colors">
                            <HiOutlineHeart size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
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
            <AuctionSideFilter variant="upcoming" />
            <UpcomingAuctionCalender />

            {/* ── Why Join ── */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <h4 className="text-sm font-bold text-slate-900 mb-3">Why Join Upcoming Auctions?</h4>
              <ul className="space-y-2.5">
                {[
                  'Be the first to bid on newly listed vehicles',
                  'Get alerts when an auction begins',
                  'Set reminders and never miss an auction',
                  'Free to register and participate',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-[12px] text-slate-600">
                    <span className="text-[#D97706] mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <AuctionBottomFeaturesBar />
    </section>
  )
}

export default UpcomingAuctions;
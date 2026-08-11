
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiSearch, HiViewGrid, HiViewList, HiShieldCheck, HiLockClosed, HiLightningBolt, HiTag, HiSupport, HiOutlineRefresh, HiCheckCircle } from 'react-icons/hi';
import { HiCamera, HiLocationMarker, HiClock, HiOutlineHeart, HiOutlineCog, HiOutlineTruck, HiOutlineBeaker, HiOutlineViewGrid } from 'react-icons/hi';
import { IoCalendarNumberOutline, IoCarSportOutline, IoPeopleOutline, IoTimeOutline } from 'react-icons/io5';
import { vehicles } from "./Data";
import AuctionSideFilter from './SharedComponents/AuctionSideFilter';
import AuctionBottomFeaturesBar from './SharedComponents/AuctionBottomFeaturesBar';

const stats = [
  { label: 'Live Auctions', value: '32', icon: <IoCalendarNumberOutline className="text-blue-600" />, bgColor: 'bg-blue-50' },
  { label: 'Active Vehicles', value: '1,256', icon: <IoCarSportOutline className="text-emerald-600" />, bgColor: 'bg-emerald-50' },
  { label: 'Active Bidders', value: '845', icon: <IoPeopleOutline className="text-purple-600" />, bgColor: 'bg-purple-50' },
  { label: 'Ending Today', value: '28', icon: <IoTimeOutline className="text-orange-600" />, bgColor: 'bg-orange-50' },
];

const points = [
  {
    title: 'Bid in real time',
    description: 'Place live bids and see updates instantly as the auction progresses.',
  },
  {
    title: 'Never miss a deadline',
    description: 'Track the countdown timer so you never lose out in the final moments.',
  },
  {
    title: 'Transparent bidding',
    description: 'View current bids and bidder activity before you commit.',
  },
  {
    title: 'Free to register and participate',
    description: 'Join any live auction at no cost and start bidding right away.',
  },
];

function LiveAuctions() {

  const navigate = useNavigate();
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
                <div className="flex flex-col md:flex-row gap-6 p-4 border border-slate-200 rounded-2xl bg-white w-full transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-300">

                  {/* 1. Image Section */}
                  <div className="relative w-full md:w-72 md:self-stretch min-h-52 rounded-xl overflow-hidden shrink-0 group">
                    <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />

                    {/* Premium Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-[#D97706]/95 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg border border-white/10 uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 bg-white rounded-full" />
                      Featured
                    </div>

                    <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-md text-white text-[10px] font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10">
                      <HiCamera size={14} /> {vehicle.images.length} Photos
                    </div>
                  </div>

                  {/* 2. Details Section */}
                  <div className="flex flex-col justify-between grow min-w-0">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[#D97706] text-[10px] font-extrabold uppercase tracking-[0.2em]">Live Auction</span>
                        <span className="text-[11px] font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">Lot # {vehicle.id}</span>
                      </div>

                      <h3 className="text-xl font-bold text-[#0F172A] mt-1 mb-2 leading-tight">{vehicle.name}</h3>

                      <div className="flex items-center gap-2 text-[12px] text-slate-500 font-medium">
                        <span>VIN: {vehicle.vin}</span>
                      </div>

                      {/* Quick Specs - Refined Design */}
                      <div className="flex items-center gap-3 mt-4 text-[12px] text-slate-600">
                        {[
                          { icon: HiOutlineCog, val: vehicle.engine },
                          { icon: HiOutlineTruck, val: vehicle.bodyStyle },
                          { icon: HiOutlineBeaker, val: vehicle.fuelType },
                          { icon: HiOutlineViewGrid, val: vehicle.driveType }
                        ].map((spec, i) => (
                          <div key={i} className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                            <spec.icon className="text-[#D97706]" size={14} />
                            {spec.val}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer: Metadata + Actions */}
                    <div className="flex flex-wrap items-center justify-between mt-6 pt-5 border-t border-slate-100 gap-6">
                      <div className="flex gap-8">
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Current Bid</p>
                          <p className="font-bold text-[#0F172A] text-lg mt-0.5">{vehicle.bid}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Location</p>
                          <p className="flex items-center gap-1 text-[13px] font-semibold text-[#0F172A] mt-0.5">
                            <HiLocationMarker className="text-[#D97706]" /> {vehicle.location}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Time Left</p>
                          <p className="flex items-center gap-1 text-[13px] font-bold text-[#D97706] mt-0.5">
                            <HiClock size={14} /> {vehicle.timer}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/live-auctions-detail/${vehicle.id}`)}
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

            {/* live auc faqs */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-[#0F172A] mb-4">Why Bid in Live Auctions?</h3>
              <div className="space-y-3">
                {points.map((point, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <HiCheckCircle className="text-[#D97706] mt-0.5 shrink-0" size={18} />
                    <div>
                      <p className="text-sm font-semibold text-[#0F172A]">{point.title}</p>
                      <p className="text-[12px] text-slate-500">{point.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ====== auction footer ======= */}
      <AuctionBottomFeaturesBar />
    </section>
  )
}

export default LiveAuctions;
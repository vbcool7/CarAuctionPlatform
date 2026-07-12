
import React, { useState } from 'react';
import { vehicles } from '../../Data';
import { LayoutGrid, List, ChevronLeft, ChevronRight, Heart, MapPin, User, Calendar, Clock, CheckCircle } from 'lucide-react';

import { getPaginationRange } from '../../utils/getPaginationRange';

function BuyerUpcomingAuctionsList({ activeTab, view, setCurrentPage, setSelectedVehicleId }) {

  const [sortOption, setSortOption] = useState('start-time');

  const [currPage, setCurrPage] = useState(1);
  const itemsPerPage = 9;
  const totalPages = Math.ceil(vehicles.length / itemsPerPage);

  const paginationRange = getPaginationRange(currPage, totalPages);

  const indexOfLastItem = currPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVehicles = vehicles.slice(indexOfFirstItem, indexOfLastItem);

  const upcomingVehicles = vehicles.filter((item) => item.status === "upcoming");

  const filteredAuctions = vehicles.filter((item) => {
    const isUpcoming = item.status === "upcoming";
    if (activeTab === "All") return isUpcoming;
    return isUpcoming && item.timeCategory === activeTab.toLowerCase().replace(" ", "-");
  });

  return (
    <div className='w-full'>

      {/* Top Bar: Results Info and Sorting */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-5">

        <p className="text-[12px] md:text-sm text-slate-500 font-medium">
          Showing {indexOfFirstItem + 1} – {Math.min(indexOfLastItem, upcomingVehicles.length)} of {upcomingVehicles.length} upcoming auctions
        </p>

        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          <span className="text-[12px] md:text-sm text-slate-600 font-medium whitespace-nowrap">Sort by:</span>
          <select
            className="border border-slate-200 rounded-lg px-2 py-1.5 text-[12px] md:text-sm font-semibold text-[#0B1E3D] outline-none hover:border-[#D97706] cursor-pointer w-full md:w-auto"
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="start-time">Start Time</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      {/* cards */}
      <div className={`grid gap-6 ${view === 'list' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
        {filteredAuctions.map((item) => (
          <div
            key={item.id}
            className={`bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all overflow-hidden flex ${view === 'list' ? 'flex-row' : 'flex-col'}`}
          >
            {/* Left/Top: Image Box */}
            <div className={`relative overflow-hidden ${view === 'list' ? 'h-auto w-1/3 min-w-50' : 'h-48 w-full'}`}>
              <img
                src={item.image}
                alt={item.shopName}
                className="w-full h-full object-cover"
              />

              {/* Heart Icon Button */}
              <button className="absolute top-3 right-3 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:text-red-500 hover:bg-white transition-all">
                <Heart size={18} />
              </button>

              <div className="absolute top-3 left-3 bg-[#0B1E3D]/80 backdrop-blur-sm text-white px-2 py-1 rounded text-[10px] md:text-xs font-bold">
                Starts in {item.startsIn}
              </div>
              <div className="absolute bottom-3 left-3 bg-black/50 text-white px-2 py-1 rounded text-[10px] md:text-xs font-semibold">
                {item.lots}
              </div>
            </div>

            {/* Right/Bottom: Content & Button */}
            <div className="flex flex-col justify-between flex-1 p-4">
              <div>
                <h3 className="text-md md:text-lg font-bold text-[#0B1E3D] line-clamp-1">{item.shopName}</h3>

                <div className="flex flex-col gap-1 text-xs md:text-sm text-slate-500 mt-2">
                  <p className="flex items-center gap-1 ">
                    <MapPin size={16} /> {item.location}
                  </p>
                  <div className="flex items-center gap-1">
                    <User size={16} /> {item.seller}
                    {item.isVerified && <CheckCircle size={16} className="text-blue-700" />}
                  </div>
                </div>

                <p className="text-[13px] md:text-sm text-slate-600 mt-3 line-clamp-2">{item.description}</p>
              </div>

              {/* Bottom Section */}
              <div className="flex flex-wrap items-end justify-between gap-4 md:mt-4 pt-3 md:pt-4 border-t border-slate-100">
                <div className="text-xs md:text-sm text-slate-600 flex flex-col gap-1">
                  <p className="flex items-center gap-2">
                    <Calendar size={14} /> {item.date}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock size={14} /> {item.time}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSelectedVehicleId(item.id);
                    setCurrentPage("upcoming-auctions-detail");
                  }}
                  className={`px-6 py-2 border border-[#D97706] text-[#D97706] font-bold rounded-lg 
  hover:bg-[#0B1E3D] hover:text-white hover:border-[#0B1E3D]
  transition-all duration-200 
  hover:scale-[1.02] active:scale-[0.98]
  ${view === 'grid' ? 'w-full' : 'w-auto'}`}
                >
                  View Auction
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default BuyerUpcomingAuctionsList;

import React, { useState } from 'react';
import { Share2, Settings, Heart, Gauge, MapPin, LayoutGrid, List, SlidersHorizontal } from 'lucide-react';
import { vehicles } from '../../Data';

function BuyerWatchlistList({ setCurrentPage, setSelectedVehicleId, setPreviousPage, openBidModal }) {

    const [activeTab, setActiveTab] = useState('All');
    const [view, setView] = useState('grid');

    const tabs = ['All', 'Upcoming', 'Live Now', 'Ended'];

    return (
        <div className="w-full">

            {/* Tabs */}
            <div className="flex gap-8 border-b border-gray-100 mb-8">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-4 text-[13px] md:text-sm font-semibold transition-all relative whitespace-nowrap
                            ${activeTab === tab
                                ? 'text-[#0B1E3D]'
                                : 'text-slate-400 hover:text-[#0B1E3D]'
                            }`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#D97706] rounded-t-full" />
                        )}
                    </button>
                ))}
            </div>

            {/* drop down */}
            <div className="flex justify-between items-center mb-6">
                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Sort by:</span>
                    <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold text-[#0B1E3D] outline-none">
                        <option>Recently Added</option>
                        <option>Price: Low to High</option>
                        <option>Price: High to Low</option>
                    </select>
                </div>

                {/* View Toggle */}
                <div className="hidden md:flex gap-2 border border-slate-200 rounded-lg p-1 mb-2">
                    <button
                        onClick={() => setView('grid')}
                        className={`p-1.5 rounded-md transition-all ${view === 'grid' ? 'bg-[#0B1E3D] text-white' : 'text-slate-400 hover:text-[#0B1E3D]'}`}
                    >
                        <LayoutGrid size={18} />
                    </button>
                    <button
                        onClick={() => setView('list')}
                        className={`p-1.5 rounded-md transition-all ${view === 'list' ? 'bg-[#0B1E3D] text-white' : 'text-slate-400 hover:text-[#0B1E3D]'}`}
                    >
                        <List size={18} />
                    </button>
                </div>
            </div>

            {/* Cards Grid */}
            <div className={`${
    view === 'grid' 
      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
      : 'flex flex-col gap-4'
}`}>
                {vehicles.map((vehicle) => (
                    <div
                        key={vehicle.id}
                        className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow bg-white">
                        {/* Image Container */}
                        <div className="relative">
                            <img src={vehicle.image} alt={vehicle.model} className="w-full h-48 object-cover" />
                            <span className={`absolute top-3 left-3 text-[8px] font-bold px-2 py-1 rounded text-white uppercase
                                ${vehicle.status === 'upcoming' ? 'bg-blue-600' :
                                    vehicle.status === 'live' ? 'bg-red-600' : 'bg-gray-600'}`}>
                                {vehicle.status}
                            </span>
                            <button className="absolute top-3 right-3 text-white hover:text-red-500">
                                <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                            </button>
                        </div>

                        {/* Card Body */}
                        <div className="p-4">
                            <h3 className="font-bold text-[#0B1E3D] truncate">{vehicle.year} {vehicle.make} {vehicle.model}</h3>
                            <p className="text-xs text-gray-500 mt-1">Lot # {vehicle.id}</p>
                            <p className="text-xs text-gray-700 mt-3">{vehicle.km} KM • {vehicle.transmission} • {vehicle.fuelType}</p>

                            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase">

                                        {vehicle.status === 'upcoming' ? 'Starts in' :
                                            vehicle.status === 'live' ? 'Time Left' : 'Auction Date'}
                                    </p>
                                    <p className="text-sm font-bold text-[#0B1E3D]">{vehicle.timer || vehicle.estDuration || vehicle.endedTime || "2h 40min"}</p>
                                </div>

                                <div className="text-right">
                                    <p className="text-[10px] text-gray-500 uppercase">
                                        {/* Price label logic */}
                                        {['sold', 'unsold'].includes(vehicle.status) ? 'Final Price' : 'Current Bid'}
                                    </p>
                                    <p className="text-sm font-bold text-[#0B1E3D]">{vehicle.price || "NA"}</p>
                                </div>
                            </div>

                            {/* button */}
<button
    onClick={() => {
        if (vehicle.status === 'live') {
            openBidModal(vehicle.id, 'watchlist');
        } else if (vehicle.status === 'upcoming') {
            setSelectedVehicleId(vehicle.id);
            setPreviousPage('watchlist');
            setCurrentPage('upcoming-auctions-detail');
        } else {
            setSelectedVehicleId(vehicle.id);
            setPreviousPage('watchlist');
            setCurrentPage('auction-result-detail');
        }
    }}
    className={`w-full mt-4 py-2 text-sm font-semibold rounded-lg border transition-all duration-200
        ${vehicle.status === 'live'
            ? 'bg-[#0B1E3D] text-white border-[#0B1E3D] hover:bg-transparent hover:text-[#0B1E3D]'
            : vehicle.status === 'upcoming'
                ? 'bg-transparent text-[#0B1E3D] border-[#0B1E3D] hover:bg-[#0B1E3D] hover:text-white'
                : 'bg-transparent text-gray-500 border-gray-300 hover:bg-gray-50'
        }`}
>
    {vehicle.status === 'live'
        ? 'Bid Now'
        : vehicle.status === 'upcoming'
            ? 'View Details'
            : 'View Results'}
</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BuyerWatchlistList;

import React, { useState } from 'react';
import { vehicles } from '../../Data';
import { Search, LayoutGrid, List, SlidersHorizontal, ChevronDown, Heart, Clock, MapPin, Gauge } from 'lucide-react';

function BuyerLiveAuctionsList({setCurrentPage, setSelectedVehicleId}) {

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [view, setView] = useState('grid');

    const liveVehicles = vehicles.filter((item) => item.status === "live");

    return (
        <div className='w-full'>

            {/* ========= filters section ========== */}
            <div className="w-full bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">

                {/* Top Row: Search and Sort */}
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="relative grow">
                        <input
                            type="text"
                            placeholder="Search by make, model, VIN or lot #"
                            className="w-full pl-4 pr-10 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D97706]/20"
                        />
                        <Search className="absolute right-3 top-2.5 text-slate-400" size={18} />
                    </div>

                    <button className="flex items-center justify-between px-4 py-2.5 border border-slate-200 rounded-lg text-[13px] md:text-sm font-medium text-[#0B1E3D] min-w-45">
                        Sort by: Ending Soon <ChevronDown size={16} />
                    </button>
                </div>

                {/* drop down */}
                <div className="flex items-center justify-between gap-4 overflow-x-auto pb-1 no-scrollbar">
                    <div className="flex gap-2">
                        {['All Makes', 'All Body Types', 'All Locations'].map((filter) => (
                            <button 
                            key={filter} 
                            className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-[13px] md:text-sm text-[#0B1E3D] font-medium whitespace-nowrap hover:border-[#D97706]">
                                {filter} <ChevronDown size={16} />
                            </button>
                        ))}
                        <button
                            onClick={() => setIsDrawerOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-[13px] md:text-sm font-medium text-[#0B1E3D] hover:border-[#D97706] whitespace-nowrap"
                        >
                            <SlidersHorizontal size={16} /> More Filters
                        </button>
                    </div>
                    
                    {/* layout - hide on mob */}
                    <div className="hidden md:flex border border-slate-200 rounded-lg p-1 shrink-0">
                        <button
                            onClick={() => setView('grid')}
                            className={`p-1.5 rounded ${view === 'grid' ? 'bg-[#0B1E3D] text-white' : 'text-slate-400'}`}>
                            <LayoutGrid size={18} />
                        </button>

                        <button
                            onClick={() => setView('list')}
                            className={`p-1.5 rounded ${view === 'list' ? 'bg-[#0B1E3D] text-white' : 'text-slate-400'}`}>
                            <List size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* ========= filters drawer ========== */}
            {isDrawerOpen && (
                <div className="fixed inset-0 z-60">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setIsDrawerOpen(false)}></div>
                    <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl p-6 transition-transform">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-[#0B1E3D]">Advanced Filters</h2>
                            <button onClick={() => setIsDrawerOpen(false)} className="text-2xl text-slate-500">×</button>
                        </div>
                        {/* Filter Content Goes Here */}
                        <p className="text-slate-500">Filters will be implemented here...</p>
                        <div className="absolute bottom-0 left-0 w-full p-6 border-t">
                            <button onClick={() => setIsDrawerOpen(false)} className="w-full bg-[#0B1E3D] text-white py-3 rounded-lg font-semibold">
                                Show Results
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ========= cards ========== */}
            <div className={`grid gap-6 mt-8 ${view === 'grid'
                ? 'grid-cols-1 md:grid-cols-2 '
                : 'grid-cols-1'
                }`}>
                {liveVehicles.map((car) => (
                    <div 
                    key={car.id} 
                    className={`bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex ${view === 'list' ? 'flex-row' : 'flex-col'
                        }`}>

                        <div className={`relative ${view === 'list' ? 'w-70 h-full shrink-0' : 'w-full h-48'}`}>
                            <img
                                src={car.image}
                                alt={car.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-3 left-3 flex gap-2">
                                <span className="bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded">LIVE</span>
                            </div>
                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1">
                                <Clock size={12} className="text-red-500" /> {car.timer}
                            </div>
                        </div>


                        {/* Content section */}
                        <div className="p-4 w-full">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-[#0B1E3D] text-sm">{car.name}</h3>
                                <Heart size={18} className="text-slate-400 hover:text-red-500 cursor-pointer" />
                            </div>

                            <div className="flex items-center gap-4 text-[11px] text-slate-500 mb-4">
                                <span className="flex items-center gap-1"><MapPin size={12} /> {car.location}</span>
                                <span className="flex items-center gap-1"><Gauge size={12} /> 45,000 km</span>
                            </div>

                            {/* Bids aur Market Value Section */}
                            <div className="grid grid-cols-2 gap-2 mb-4">

                                <div className="bg-slate-50 p-2 rounded-lg">
                                    <p className="text-[10px] text-slate-500">Current Bid</p>
                                    <p className="font-bold text-[#0B1E3D] text-sm">{car.bid}</p>
                                </div>
                                <div className="bg-slate-50 p-2 rounded-lg">
                                    <p className="text-[10px] text-slate-500">Bids</p>
                                    <p className="font-bold text-[#0B1E3D] text-sm">{car.totalBids}</p>
                                </div>

                                <div className="bg-slate-50 p-2 rounded-lg">
                                    <p className="text-[10px] text-slate-500">Market Value</p>
                                    <p className="font-bold text-[#0B1E3D] text-sm">{car.marketValue || 'N/A'}</p>
                                </div>
                                <div className="bg-slate-50 p-2 rounded-lg">
                                    <p className="text-[10px] text-slate-500">Buy Now</p>
                                    <p className="font-bold text-[#0B1E3D] text-sm">{car.buyNow || 'N/A'}</p>
                                </div>
                            </div>

                            {/* Footer Action */}
                            <div className={`flex flex-col ${view === 'list' ? 'items-start md:max-w-62 w-full' : 'w-full'}`}>
                                <button 
                                onClick={() => {
                                    setCurrentPage("live-auctions-detail")
                                    setSelectedVehicleId(car.id)
                                }}
                                className="w-full bg-[#0B1E3D] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-[#1a2d4d] transition-colors">
                                    Place Bid →
                                </button>

                                <p className="text-[10px] text-center w-full text-slate-400 mt-2">
                                    Min. Next Bid: AED 96,000
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BuyerLiveAuctionsList;
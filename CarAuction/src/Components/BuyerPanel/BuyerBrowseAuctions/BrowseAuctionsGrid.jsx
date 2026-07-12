
import React, { useState } from 'react';
import { vehicles } from '../../Data';
import { Heart, LayoutGrid, List, ChevronLeft, ChevronRight } from 'lucide-react';

import { getPaginationRange } from '../../utils/getPaginationRange';

function BrowseAuctionsGrid({ setCurrentPage, setSelectedVehicleId, setPreviousPage, openBidModal }) {

    const [view, setView] = useState('grid');
    const [currPage, setCurrPage] = useState(1);
    const itemsPerPage = 9;
    const totalPages = Math.ceil(vehicles.length / itemsPerPage);

    const paginationRange = getPaginationRange(currPage, totalPages);

    const indexOfLastItem = currPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentVehicles = vehicles.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="w-full">

            {/* Top Status Line */}
            <div className="flex justify-between items-center mb-6">
                <p className="text-[12px] md:text-sm text-slate-500 font-medium">
                    Showing {indexOfFirstItem + 1} – {Math.min(indexOfLastItem, vehicles.length)} of {vehicles.length} auctions
                </p>
                <div className="hidden md:flex gap-2 border border-slate-200 rounded-lg p-1">
                    <button onClick={() => setView('grid')} className={`p-1.5 rounded-md ${view === 'grid' ? 'bg-[#0B1E3D] text-white' : 'text-slate-400'}`}><LayoutGrid size={18} /></button>
                    <button onClick={() => setView('list')} className={`p-1.5 rounded-md ${view === 'list' ? 'bg-[#0B1E3D] text-white' : 'text-slate-400'}`}><List size={18} /></button>
                </div>
            </div>

            {/* cards */}
            <div className={`grid gap-6 ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                {currentVehicles.map((item) => (
                    <div
                        key={item.id}
                        className={`bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all overflow-hidden flex ${view === 'list' ? 'flex-row' : 'flex-col'}`}>

                        <div className={`relative overflow-hidden ${view === 'list' ? 'h-auto w-1/3 min-w-50' : 'h-48 w-full'}`}>
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                            />

                            {/* Badge */}
                            <span className={`absolute top-3 left-3 px-3 py-1 rounded-md text-[8px] md:text-[10px] font-bold text-white uppercase tracking-wider
                            ${item.status === 'live' ? 'bg-[#EF4444]' : item.status === 'upcoming' ? 'bg-blue-600' : 'bg-[#0B1E3D]'}`}>
                                {item.status}
                            </span>

                            {/* Heart Icon */}
                            <button className="absolute top-3 right-3 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:text-red-500 hover:bg-white transition-all">
                                <Heart size={18} />
                            </button>
                        </div>

                        <div className="p-5 flex flex-col justify-between flex-1">
                            <div>
                                <h3 className="font-bold text-[#0B1E3D] text-md md:text-lg truncate">{item.name}</h3>
                                <p className="text-xs md:text-sm text-slate-500 mt-1">Lot # {item.id}</p>
                                <p className="text-xs md:text-sm text-slate-500 mb-4">{item.mileage} • {item.transmission} • {item.fuelType}</p>
                            </div>

                            <div className="flex justify-between items-end border-t border-slate-100">
                                <div>
                                    <p className="text-[11px] text-slate-400 font-bold uppercase">
                                        {item.status === 'live' ? 'Current Bid' : item.status === 'upcoming' ? 'Starting Bid' : 'Winning Bid'}
                                    </p>
                                    <p className="text-lg font-bold text-[#0B1E3D]">{item.soldPrice || item.bid}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[11px] text-slate-400 font-bold uppercase">
                                        {item.status === 'live' ? 'Time Left' : item.status === 'upcoming' ? 'Starts in' : 'Ended on'}
                                    </p>
                                    <p className={`font-bold text-sm ${item.status === 'live' ? 'text-red-500' : 'text-[#0B1E3D]'}`}>
                                        {item.timeRemaining || item.startsIn || item.endedDate}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Button */}
                        <div className={`p-5 ${view === 'list' ? 'flex items-center w-48' : 'pt-0'}`}>
                            <button
                                onClick={() => {
                                    if (item.status === 'live') {
                                        openBidModal(item.id, 'browse-auctions');
                                    } else if (item.status === 'upcoming') {
                                        setSelectedVehicleId(item.id);
                                        setPreviousPage('browse-auctions');
                                        setCurrentPage('upcoming-auctions-detail');
                                    } else {
                                        setSelectedVehicleId(item.id);
                                        setPreviousPage('browse-auctions');
                                        setCurrentPage('auction-result-detail');
                                    }
                                }}
                                className={`w-full py-2 md:py-3 rounded-xl font-bold text-sm transition-all border
                                    ${item.status === 'live'
                                        ? 'bg-[#0B1E3D] text-white hover:bg-[#D97706] border-[#0B1E3D] hover:border-[#D97706]'
                                        : 'bg-white text-[#0B1E3D] border-[#0B1E3D] hover:bg-[#0B1E3D] hover:text-white'}`}>
                                {item.status === 'live' ? 'Bid Now' : item.status === 'upcoming' ? 'View Details' : 'View Results'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* pagination */}
            <div className="flex justify-center items-center gap-2 mt-8">
                <button
                    disabled={currPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className="p-2 rounded-full border hover:border-[#D97706] disabled:opacity-50"
                >
                    <ChevronLeft className='shrink-0 w-3 h-3 md:w-4.5 md:h-4.5' />
                </button>

                {/* 2. Yahan 'paginationRange' (array) ko map karein, function ko nahi */}
                {paginationRange.map((page, index) => (
                    <button
                        key={index}
                        onClick={() => typeof page === 'number' && setCurrPage(page)}
                        className={`w-8 h-8 md:w-10 md:h-10 rounded-full font-semibold transition-all
                    ${page === currPage
                                ? 'bg-[#0B1E3D] text-white'
                                : page === '...'
                                    ? 'cursor-default'
                                    : 'hover:bg-slate-100'
                            }`}
                    >
                        {page}
                    </button>
                ))}

                <button
                    disabled={currPage === totalPages}
                    onClick={() => setCurrPage(prev => Math.min(prev + 1, totalPages))}
                    className="p-2 rounded-full border hover:border-[#D97706] disabled:opacity-50"
                >
                    <ChevronRight className='shrink-0 w-3 h-3 md:w-4.5 md:h-4.5' />
                </button>
            </div>
        </div>
    );
}

export default BrowseAuctionsGrid;
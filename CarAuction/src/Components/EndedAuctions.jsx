
import React from 'react';
import { Camera, MapPin, Tag, Eye, Users, ChevronRight, Settings, Fuel, GitBranch, Gauge } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function EndedAuctions({ vehicle }) {

    const navigate = useNavigate();

    const getStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case 'sold':
                return {
                    bg: 'bg-emerald-600',
                    text: 'Sold'
                };
            case 'unsold':
                return {
                    bg: 'bg-red-600',
                    text: 'Unsold'
                };
            case 'not met':
                return {
                    bg: 'bg-amber-500',
                    text: 'Reserve Not Met'
                };
            default:
                return {
                    bg: 'bg-slate-500',
                    text: status
                };
        }
    };

    const statusInfo = getStatusBadge(vehicle.status);

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row gap-6 transition-all hover:shadow-lg hover:border-slate-300">

            {/* Left: Image Section */}
            <div className="relative w-full md:w-80 h-64 rounded-xl overflow-hidden shrink-0">
                <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-full object-cover"
                />

                {/* Status Badge */}
                <div className={`absolute top-3 left-3 ${statusInfo.bg} text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider flex items-center gap-1`}>
                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span> {statusInfo.text}
                </div>

                {/* Photo Count */}
                <div className="absolute bottom-3 left-3 bg-black/60 text-white text-[10px] px-2 py-1 rounded flex items-center gap-1">
                    {vehicle.images.length} Photos
                </div>
            </div>

            {/* Right: Content Section */}
            <div className="flex flex-1 flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold text-[#0F172A]">{vehicle.name}</h3>
                        <span className="text-[11px] font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                            Lot # {vehicle.id}
                        </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mb-4">VIN: {vehicle.vin}</p>

                    {/* Quick Specs */}
                    <div className="flex gap-2 text-[11px] text-slate-600 flex-wrap mb-6">
                        <div className="flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                            <Settings size={12} className="text-[#D97706]" /> {vehicle.engine}
                        </div>
                        <div className="flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                            <Gauge size={12} className="text-[#D97706]" /> {vehicle.transmission}
                        </div>
                        <div className="flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                            <Fuel size={12} className="text-[#D97706]" /> {vehicle.fuelType}
                        </div>
                        <div className="flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                            <GitBranch size={12} className="text-[#D97706]" /> {vehicle.driveType}
                        </div>
                    </div>

                    {/* Meta Info Row */}
                    <div className="grid grid-cols-4 gap-4 mb-4">
                        <div>
                            <p className="text-[9px] uppercase text-slate-400 font-bold tracking-wider">End Date</p>
                            <p className="text-xs font-bold text-[#0F172A]">{vehicle.endedDate}</p>
                            {/* <p className="text-xs font-bold text-gray-500 pt-0.5">{vehicle.endedTime}</p> */}
                        </div>
                        <div>
                            <p className="text-[9px] uppercase text-slate-400 font-bold tracking-wider">Location</p>
                            <p className="text-xs font-bold text-[#0F172A] flex items-center gap-1">
                                {vehicle.location}
                            </p>
                        </div>
                        <div>
                            <p className="text-[9px] uppercase text-slate-400 font-bold tracking-wider">Bidders</p>
                            <p className="text-xs font-bold text-[#0F172A] flex items-center gap-1">
                                {vehicle.totalBids || "NA"}</p>
                        </div>
                        <div>
                            <p className="text-[9px] uppercase text-slate-400 font-bold tracking-wider">Views</p>
                            <p className="text-xs font-bold text-[#0F172A] flex items-center gap-1">
                                {vehicle.views}</p>
                        </div>
                    </div>
                </div>


                {/* Footer: Dynamic Bid Section */}
                <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center border border-slate-100 rounded-xl bg-slate-50/50 flex-1">

                        {vehicle.status?.toLowerCase() === 'sold' ? (
                            <>
                                <div className="p-3 border-r border-slate-100 flex-1">
                                    <p className="text-[9px] uppercase text-slate-400 font-bold tracking-widest">Winning Bid</p>
                                    <p className="text-sm font-bold text-emerald-600">{vehicle.winningBid || "AED 440,000"}</p>
                                </div>
                                <div className="p-3 flex-1">
                                    <p className="text-[9px] uppercase text-slate-400 font-bold tracking-widest">Sold To</p>
                                    <p className="text-sm font-bold text-[#0F172A]">{vehicle.buyerName || "John Hassan"}</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="p-3 border-r border-slate-100 flex-1">
                                    <p className="text-[9px] uppercase text-slate-400 font-bold tracking-widest">Highest Bid</p>
                                    <p className="text-sm font-bold text-red-600">{vehicle.highestBid}</p>
                                </div>
                                <div className="p-3 flex-1">
                                    <p className="text-[9px] uppercase text-slate-400 font-bold tracking-widest">Reserve Price</p>
                                    <p className="text-sm font-bold text-[#0F172A]">{vehicle.reservePrice}</p>
                                </div>
                            </>
                        )}

                    </div>

                    <button
                        onClick={() => navigate(`/ended-auctions-detail/${vehicle.id}`)}
                        className="bg-[#0B1E3D] text-white px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-1 hover:bg-[#1e3a6a] transition-all">
                        View Details <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EndedAuctions;
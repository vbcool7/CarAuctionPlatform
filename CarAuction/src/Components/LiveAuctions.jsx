
import { HiCamera, HiLocationMarker, HiClock, HiOutlineHeart } from 'react-icons/hi';
import {
    HiOutlineCog,
    HiOutlineTruck,
    HiOutlineBeaker,
    HiOutlineViewGrid
} from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

function LiveAuctions({ vehicle }) {
    const navigate = useNavigate();

    return (
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
    );
}

export default LiveAuctions;
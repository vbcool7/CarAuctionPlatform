
import {
    HiCamera,
    HiOutlineCog,
    HiOutlineTruck,
    HiOutlineBeaker,
    HiOutlineViewGrid,
    HiLocationMarker,
    HiClock,
    HiOutlineBell,
    HiOutlineTag,
    HiChevronRight
} from "react-icons/hi";
import { HiOutlineHeart } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

function UpcomingAuctions({ vehicle }) {

    const navigate = useNavigate();

    return (
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
    );
}

export default UpcomingAuctions;
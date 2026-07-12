
import React from 'react';
import { Heart, BadgeCheck } from "lucide-react";

function BuyerMyOffersDetailVehicleInfo({ vehicle }) {
    return (
        <div className="border border-slate-200 rounded-xl p-4">

            {/* Title */}
            <div className="flex items-center justify-between mb-1">
                <h2 className="text-xl font-bold text-[#0B1E3D]">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                </h2>
                <button className="text-slate-400 hover:text-red-400 transition-colors">
                    <Heart size={18} />
                </button>
            </div>

            {/* Lot + specs pills */}
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-5">
                <span>Lot # {vehicle.id}</span>
                <span>•</span>
                <span>{vehicle.mileage} KM</span>
                <span>•</span>
                <span>{vehicle.transmission}</span>
                <span>•</span>
                <span>{vehicle.fuelType}</span>
                <span>•</span>
                <span>{vehicle.bodyStyle}</span>
            </div>

            {/* vehicle content - Organized in 2 columns */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">

                <div className="flex flex-col">
                    <p className="text-slate-400 text-xs mb-0.5">Seller</p>
                    <div className="flex items-center gap-1 font-semibold text-[#0B1E3D]">
                        {vehicle.seller || "Al Yousuf Motors"}
                        <BadgeCheck size={14} className="text-blue-600" />
                    </div>
                </div>

                <div className="flex flex-col">
                    <p className="text-slate-400 text-xs mb-0.5">Title Status</p>
                    <span className="w-fit px-2 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-600 rounded-full">
                        Clean Title
                    </span>
                </div>

                <div className="flex flex-col">
                    <p className="text-slate-400 text-xs mb-0.5">Location</p>
                    <p className="font-semibold text-[#0B1E3D]">{vehicle.location || "Dubai"}</p>
                </div>

                <div className="flex flex-col">
                    <p className="text-slate-400 text-xs mb-0.5">Damage</p>
                    <p className="font-bold text-[#0B1E3D] text-base">{vehicle.damageStatus || "No Damage"}</p>
                </div>

                <div className="flex flex-col">
                    <p className="text-slate-400 text-xs mb-0.5">Auction Date</p>
                    <p className="font-semibold text-[#0B1E3D]">{vehicle.auctionDate || "May 20, 2024"}</p>
                </div>

                <div className="flex flex-col">
                    <p className="text-slate-400 text-xs mb-0.5">Keys</p>
                    <p className="font-semibold text-[#0B1E3D]">Yes</p>
                </div>

                <div className="flex flex-col">
                    <p className="text-slate-400 text-xs mb-0.5">Lot Number</p>
                    <p className="font-semibold text-[#0B1E3D]">{vehicle.id || "0"}</p>
                </div>

                <div className="flex flex-col">
                    <p className="text-slate-400 text-xs mb-0.5">Run & Drive</p>
                    <p className="font-semibold text-[#0B1E3D]">Yes</p>
                </div>
            </div>
        </div>
    )
}

export default BuyerMyOffersDetailVehicleInfo;
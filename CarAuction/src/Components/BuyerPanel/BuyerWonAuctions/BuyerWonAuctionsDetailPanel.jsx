
import { Heart, BadgeCheck, Clock, CheckCircle } from "lucide-react";
import BuyerWonAuctionDetailStatusBanner from "./BuyerWonAuctionsStatusBanner";

function BuyerWonAuctionDetailPanel({ vehicle }) {

    const isPending = vehicle.wonStatus === "payment-pending";
    const isCompleted = vehicle.wonStatus === "payment-completed";
    const isPickup = vehicle.wonStatus === "ready-for-pickup";

    return (
        <>
        <div className="border border-slate-200 rounded-xl p-6">

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
            <p className="text-sm text-slate-500 mb-3">Lot # {vehicle.id}</p>
            <div className="flex items-center gap-3 text-xs text-slate-500 mb-5">
                <span>{vehicle.mileage} KM</span>
                <span>•</span>
                <span>{vehicle.transmission}</span>
                <span>•</span>
                <span>{vehicle.fuelType}</span>
                <span>•</span>
                <span>{vehicle.bodyStyle}</span>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                <div className="flex justify-between items-center">
                    <p className="text-slate-400 text-xs mb-0.5">Winning Bid</p>
                    <p className="font-bold text-[#0B1E3D] text-base">{vehicle.bid?.toLocaleString()}</p>
                </div>
                <div className="flex justify-between items-center">
                    <p className="text-slate-400 text-xs mb-0.5">Seller</p>
                    <div className="flex items-center gap-1 font-semibold text-[#0B1E3D]">
                        {vehicle.seller || "Al Yousuf Motors"}
                        <BadgeCheck size={14} className="text-blue-600" />
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <p className="text-slate-400 text-xs mb-0.5">You won with</p>
                    <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-600 rounded-full">
                        Highest Bid
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <p className="text-slate-400 text-xs mb-0.5">Location</p>
                    <p className="font-semibold text-[#0B1E3D]">{vehicle.location}</p>
                </div>

                <div className="flex justify-between items-center">
                    <p className="text-slate-400 text-xs mb-0.5">Auction Date</p>
                    <p className="font-semibold text-[#0B1E3D]">{vehicle.auctionDate || "May 20, 2024"}</p>
                </div>
                <div className="flex justify-between items-center">
                    <p className="text-slate-400 text-xs mb-0.5">Auction Type</p>
                    <p className="font-semibold text-[#0B1E3D]">Live Auction</p>
                </div>

                {/* Payment Completed + Pickup only */}
                {(isCompleted || isPickup) && (
                    <>
                        <div className="flex justify-between items-center">
                            <p className="text-slate-400 text-xs mb-0.5">Payment Status</p>
                            <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-600 rounded-full">
                                Payment Completed
                            </span>
                        </div>
                       <div className="flex justify-between items-center">
                            <p className="text-slate-400 text-xs mb-0.5">Paid on</p>
                            <p className="font-semibold text-[#0B1E3D]">{vehicle.paidOn || "May 24, 2024"}</p>
                        </div>
                    </>
                )}

                {/* Pickup only */}
                {isPickup && (
                    <div className="flex justify-between items-center">
                        <p className="text-slate-400 text-xs mb-0.5">Pickup Status</p>
                        <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-600 rounded-full">
                            Ready for Pickup
                        </span>
                    </div>
                )}
            </div>
        </div>

        <div className="mt-3">
            <BuyerWonAuctionDetailStatusBanner vehicle={vehicle} />
        </div>
        </>
    );
};

export default BuyerWonAuctionDetailPanel;
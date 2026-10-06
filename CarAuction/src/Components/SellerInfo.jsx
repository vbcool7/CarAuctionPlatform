import React from "react";
import { BadgeCheck, Star } from "lucide-react";

function SellerInfo({ vehicle }) {
    const seller = vehicle?.sellerInfo;

    const memberSince = seller?.memberSince
        ? new Date(seller.memberSince).toLocaleDateString("en-GB", {
            month: "short",
            year: "numeric",
        })
        : "—";

    const InfoRow = ({ label, value }) => (
        <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">{label}</span>
            <span className="font-semibold text-slate-900">{value}</span>
        </div>
    );

    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6">

            {/* Header */}
            <h2 className="text-xl font-bold text-slate-900">
                Seller Information
            </h2>

            {/* Seller */}
            <div className="flex gap-4 items-center">
                <div className="h-16 w-16 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-xl font-bold text-[#D97706]">
                    {seller?.profileImage ? (
                        <img
                            src={seller.profileImage}
                            alt={seller?.name || "Seller"}
                            className="h-16 w-16 rounded-full object-cover border border-slate-200"
                        />
                    ) : (
                        <div className="h-16 w-16 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-xl font-bold text-[#D97706]">
                            {seller?.name?.charAt(0)?.toUpperCase() || "S"}
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-bold text-slate-900">
                        {seller?.name || "Seller"}
                    </h3>

                    <span className="w-fit flex items-center gap-1 text-emerald-700 text-[10px] uppercase font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        <BadgeCheck size={12} />
                        Verified Seller
                    </span>
                </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-amber-500">
                    <Star size={15} fill="currentColor" />
                    <span className="text-sm font-bold text-slate-900">
                        0
                    </span>
                </div>

                <span className="text-xs text-slate-400">
                    (0 Reviews)
                </span>
            </div>

            {/* Seller Stats */}
            <div className="border-t border-slate-100 pt-4 space-y-3">
                <InfoRow
                    label="Total Vehicles Sold"
                    value="---"
                />

                <InfoRow
                    label="Member Since"
                    value={memberSince}
                />

                <InfoRow
                    label="Response Rate"
                    value="0%"
                />
            </div>

            {/* View Profile */}
            <button
                type="button"
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all"
            >
                View Seller Profile
            </button>

        </div>
    );
}

export default SellerInfo;
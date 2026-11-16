
import React from "react";
import { useNavigate } from "react-router-dom";
import { BadgeCheck, Star } from "lucide-react";

const pretty = (s) => String(s || '').replace(/[_-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

function SellerInfo({ vehicle }) {
    const navigate = useNavigate();
    const seller = vehicle?.sellerInfo;

    if (!seller) return null;

    const memberSince = seller.memberSince
        ? new Date(seller.memberSince).toLocaleDateString("en-GB", { month: "short", year: "numeric" })
        : "—";

    const location = [pretty(seller.city), pretty(seller.emirate)].filter(Boolean).join(', ') || '—';
    const count = seller.ratingCount || 0;

    const InfoRow = ({ label, value }) => (
        <div className="flex justify-between items-center text-sm gap-4">
            <span className="text-slate-500 shrink-0">{label}</span>
            <span className="font-semibold text-slate-900 text-right">{value}</span>
        </div>
    );

    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6">

            <h2 className="text-xl font-bold text-slate-900">Seller Information</h2>

            <div className="flex gap-4 items-center">
                {seller.profileImage ? (
                    <img src={seller.profileImage} alt={seller.name || "Seller"}
                        className="h-16 w-16 rounded-full object-cover border border-slate-200 shrink-0" />
                ) : (
                    <div className="h-16 w-16 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-xl font-bold text-[#D97706] shrink-0">
                        {seller.name?.charAt(0)?.toUpperCase() || "S"}
                    </div>
                )}

                <div className="flex flex-col gap-1 min-w-0">
                    <h3 className="text-lg font-bold text-slate-900 truncate">{seller.name || "Seller"}</h3>
                    <span className="w-fit flex items-center gap-1 text-emerald-700 text-[10px] uppercase font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        <BadgeCheck size={12} />
                        Verified Seller
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Star size={16} className="text-amber-500 fill-amber-500" />
                {count > 0 ? (
                    <>
                        <span className="text-sm font-bold text-slate-900">{Number(seller.ratingAverage).toFixed(1)}</span>
                        <span className="text-xs text-slate-400">({count} {count === 1 ? 'Review' : 'Reviews'})</span>
                    </>
                ) : (
                    <span className="text-xs text-slate-400">No reviews yet</span>
                )}
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-3">
                <InfoRow label="Location" value={location} />
                <InfoRow label="Member Since" value={memberSince} />
            </div>

            {seller._id && (
                <button
                    type="button"
                    onClick={() => navigate(`/seller/${seller._id}`)}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all">
                    View Seller Profile
                </button>
            )}
        </div>
    );
}

export default SellerInfo;
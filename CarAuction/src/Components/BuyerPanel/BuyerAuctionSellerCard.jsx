
import React from 'react';
import { Star } from 'lucide-react';

const initialsOf = (name) => String(name || 'S').split(/\s+/).map((n) => n[0]).slice(0, 2).join('').toUpperCase();

function BuyerAuctionSellerCard({ seller, setCurrentPage, setSelectedSellerId, setPreviousPage, currentPageName }) {

    if (!seller || typeof seller !== 'object') return null;

    const name = seller.businessName || seller.fullName || 'Seller';
    const count = seller.ratingCount || 0;
    const canOpen = seller._id && setCurrentPage && setSelectedSellerId;

    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6">

            <h2 className="text-xl font-bold text-slate-900">Seller Information</h2>

            <div className="flex gap-4 items-center">
                <div className="h-16 w-16 rounded-full bg-[#0B1E3D] text-white flex items-center justify-center text-xl font-bold shrink-0">
                    {initialsOf(name)}
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                    <h3 className="text-lg font-bold text-slate-900 truncate">{name}</h3>
                    <span className="w-fit text-emerald-700 text-[10px] uppercase font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        Verified Seller
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Star size={20} className="text-amber-400 fill-amber-400" />
                {count > 0 ? (
                    <>
                        <span className="text-slate-900 font-bold text-lg">{Number(seller.ratingAverage).toFixed(1)}</span>
                        <p className="text-sm text-slate-500">({count} {count === 1 ? 'review' : 'reviews'})</p>
                    </>
                ) : (
                    <p className="text-sm text-slate-500">No reviews yet</p>
                )}
            </div>

            {canOpen && (
                <button
                    onClick={() => {
                        setSelectedSellerId(seller._id);
                        setPreviousPage(currentPageName);
                        setCurrentPage('seller-profile');
                    }}
                    className="w-full py-2 text-sm bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all">
                    View Seller Profile
                </button>
            )}
        </div>
    );
}

export default BuyerAuctionSellerCard;
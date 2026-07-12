
import React from 'react';

function BuyerMyOffersDetailSummaryCard({ vehicle }) {

    const isAccepted = vehicle.offerStatus === 'accepted';
    const isActive   = vehicle.offerStatus === 'active';
    const isRejected = vehicle.offerStatus === 'rejected';
    const isExpired  = vehicle.offerStatus === 'expired';

    const difference = vehicle.sellerPrice - vehicle.yourOffer;
    const diffText   = `AED ${Math.abs(difference).toLocaleString()} (${((Math.abs(difference) / vehicle.sellerPrice) * 100).toFixed(2)}% below)`;
    const diffColor  = difference > 0 ? 'text-red-500' : 'text-emerald-600';

    return ( 
        <div className="w-full bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">

            <h2 className="text-lg font-bold text-[#0B1E3D] mb-4">Offer Summary</h2>

            <div className="space-y-4">

                {/* Seller Price — all states */}
                <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Seller Price</span>
                    <span className="font-semibold text-[#0B1E3D]">AED {vehicle.sellerPrice?.toLocaleString() || "25000"}</span>
                </div>

                {/* Your Offer — all states */}
                <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Your Offer</span>
                    <span className="font-semibold text-[#D97706]">AED {vehicle.yourOffer?.toLocaleString() || "25000"}</span>
                </div>

                {/* Difference — active, expired, accepted */}
                {(isActive || isExpired || isAccepted) && (
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Difference</span>
                        <span className={`font-semibold ${diffColor}`}>-{"AED 30,000"}</span>
                    </div>
                )}

                {/* Offer Accepted On — accepted only */}
                {isAccepted && (
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Offer Accepted On</span>
                        <span className="font-semibold text-[#0B1E3D] text-right">{vehicle.offerAcceptedOn || "May 25, 2024"}</span>
                    </div>
                )}

                {/* Offer Expires In — active only */}
                {isActive && (
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Offer Expires In</span>
                        <span className="font-semibold text-[#0B1E3D]">{vehicle.offerExpiresIn || "May 25, 2024"}</span>
                    </div>
                )}

                {/* Offer Expired On — expired only */}
                {isExpired && (
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Offer Expired On</span>
                        <span className="font-semibold text-[#0B1E3D]">{vehicle.offerExpiredOn || "May 25, 2024"}</span>
                    </div>
                )}

                {/* Offer Date — rejected only */}
                {isRejected && (
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Offer Date</span>
                        <span className="font-semibold text-[#0B1E3D]">{vehicle.offerDate || "May 25, 2024"}</span>
                    </div>
                )}

                {/* Rejection Date — rejected only */}
                {isRejected && (
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Rejection Date</span>
                        <span className="font-semibold text-[#0B1E3D]">{vehicle.rejectionDate || "May 25, 2024"}</span>
                    </div>
                )}

                {/* Rejection Reason — rejected only */}
                {isRejected && (
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Rejection Reason</span>
                        <span className="font-semibold text-[#0B1E3D] text-right max-w-[55%]">{vehicle.rejectionReason}</span>
                    </div>
                )}

                {/* Divider before status */}
                <div className="border-t border-slate-100 pt-3 space-y-3">

                    {/* Offer Status — all states */}
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Offer Status</span>
                        {isAccepted && <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full">Accepted</span>}
                        {isActive   && <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">Active</span>}
                        {isExpired  && <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-full">Expired</span>}
                        {isRejected && <span className="bg-red-100 text-red-600 text-xs font-semibold px-2.5 py-1 rounded-full">Rejected</span>}
                    </div>

                    {/* Next Step — accepted only */}
                    {isAccepted && (
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">Next Step</span>
                            <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full">Payment Pending</span>
                        </div>
                    )}

                </div>

            </div>
        </div>
    );
}

export default BuyerMyOffersDetailSummaryCard;
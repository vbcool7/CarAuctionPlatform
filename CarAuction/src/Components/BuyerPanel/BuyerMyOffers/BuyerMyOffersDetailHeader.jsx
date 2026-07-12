
import React from 'react';
import { ArrowLeft, FileText } from 'lucide-react';

function BuyerMyOffersDetailHeader({ vehicle, setCurrentPage }) {

    const isActive = vehicle.offerStatus === "active";
    const isAccepted = vehicle.offerStatus === "accepted";
    const isExpired = vehicle.offerStatus === "expired";
    const isRejected = vehicle.offerStatus === "rejected";

    const title = isAccepted ? "Accepted Offer Details"
        : isActive ? "Active Offer Details"
            : isExpired ? "Expired Offer Details"
                : "Rejected Offer Details";

    const subtitle = isAccepted ? "Congratulations! Your offer has been accepted by the seller."
        : isActive ? "Your offer has been sent to the seller and is currently active."
            : isExpired ? "This offer has expired. You can make a new offer if the vehicle is still available."
                : "Unfortunately, your offer was not accepted.";

    const badgeStyle = isAccepted ? "bg-emerald-100 text-emerald-700"
        : isActive ? "bg-blue-100 text-blue-700"
            : isExpired ? "bg-gray-100 text-gray-600"
                : "bg-red-100 text-red-600";

    const badgeLabel = isAccepted ? "Accepted"
        : isActive ? "Active"
            : isExpired ? "Expired"
                : "Rejected";

    return (
        <div className='mb-6'>

            {/* Back link */}
            <button
                onClick={() => setCurrentPage("my-offers")}
                className="flex items-center gap-1.5 text-sm text-[#0B1E3D] font-medium hover:opacity-70 transition-opacity mb-3"
            >
                <ArrowLeft size={15} />
                Back to My Offers
            </button>

            {/* Title row */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-[#0B1E3D]">{title}</h1>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badgeStyle}`}>
                            {badgeLabel}
                        </span>
                    </div>
                    <p className="text-sm text-gray-500">{subtitle}</p>
                </div>

                {/* Action button */}
                {isAccepted && (
                    <button className="flex items-center gap-2 text-sm font-medium text-[#0B1E3D] border border-[#0B1E3D] rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors">
                        <FileText className="w-4 h-4" />
                        View Invoice
                    </button>
                )}
                {isActive && (
                    <button className="text-sm font-medium text-red-600 border border-red-600 rounded-lg px-4 py-2 hover:bg-red-50 transition-colors">
                        Withdraw Offer
                    </button>
                )}
                {isExpired && (
                    <button className="text-sm font-medium text-[#0B1E3D] border border-[#0B1E3D] rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors">
                        View Similar Vehicles
                    </button>
                )}
                {isRejected && (
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 text-sm font-medium text-[#0B1E3D] border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                            Share
                        </button>
                        <button className="flex items-center gap-2 text-sm font-medium text-[#0B1E3D] border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            Add to Watchlist
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default BuyerMyOffersDetailHeader;
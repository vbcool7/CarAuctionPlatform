import React from 'react';

function LiveAuctionProgressCard({ vehicle }) {

    // 1. Safety check for the vehicle object
    if (!vehicle) return <div className="p-6 bg-slate-50 rounded-2xl animate-pulse h-64" />;

    // 2. Safely cast to numbers, default to 0 to prevent crashes
    const currentBid = Number(vehicle.currentBid) || 0;
    const reservePrice = Number(vehicle.reservePrice) || 0;
    const buyNowPrice = Number(vehicle.buyNowPrice) || 0;
    const totalBids = vehicle.totalBids || 0;
    const biddersOnline = vehicle.biddersOnline || 0;
    const views = vehicle.views || 0;

    // 3. Define the progress variable before return (The source of your ReferenceError)
    const progress = buyNowPrice > 0 ? Math.min(((currentBid / buyNowPrice) * 100), 100) : 0;

    return (
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-6">Auction Progress</h3>

            {/* Bid Metrics */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <p className="text-slate-500 text-sm">Current Bid</p>
                    <p className="text-2xl font-extrabold text-blue-600">
                        AED {currentBid.toLocaleString()}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-slate-500 text-sm">Reserve Price</p>
                    <p className="font-bold text-slate-900">
                        AED {reservePrice.toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                <div
                    className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-8">
                <span>AED {reservePrice.toLocaleString()} Reserve</span>
                <span>AED {buyNowPrice.toLocaleString()} Buy Now</span>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y border-slate-100 mb-6">
                {[
                    { label: "Total Bids", value: totalBids },
                    { label: "Bidders Online", value: biddersOnline },
                    { label: "Views", value: views }
                ].map((stat, i) => (
                    <div key={i} className="text-center">
                        <p className="text-lg font-bold text-slate-900">{stat.value.toLocaleString()}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">{stat.label}</p>
                    </div>
                ))}
            </div>

            <p className="font-bold text-[#0F172A] mb-4">Bid Trend</p>

            <div className="h-24 w-full bg-linear-to-b from-[#D97706]/10 to-transparent rounded-lg border-b-2 border-[#D97706] flex items-end px-2">

                <p className="text-[10px] text-[#D97706] font-bold mb-2">Trend data visualization...</p>

            </div>
        </div>
    );
}

export default LiveAuctionProgressCard;
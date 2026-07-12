
import React from 'react';
import { IoIosStar } from "react-icons/io";

function BuyerAuctionSellerCard({ vehicle, setCurrentPage, setSelectedSellerId, setPreviousPage, currentPageName }) {

    // Sub-component for clean rows
    const InfoRow = ({ label, value }) => (
        <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">{label}</span>
            <span className="font-semibold text-slate-900">{value}</span>
        </div>
    );

    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6">

            {/* Header */}
            <h2 className="text-xl font-bold text-slate-900">Seller Information</h2>

            {/* Profile Section */}
            <div className="flex gap-4 items-center">
                <img
                    src="https://img.magnific.com/premium-vector/men-icon-trendy-avatar-character-cheerful-happy-people-flat-vector-illustration-round-frame-male-portraits-group-team-adorable-guys-isolated-white-background_275421-286.jpg?semt=ais_hybrid&w=740&q=80"
                    alt="Seller Avatar"
                    className="h-16 w-16 rounded-full object-cover border border-slate-100"
                />
                <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-bold text-slate-900">{"NA"}</h3>
                    <span className="w-fit text-emerald-700 text-[10px] uppercase font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        Verified Seller
                    </span>
                </div>
            </div>

            {/* Ratings */}
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-amber-400">
                    <span className="text-slate-900 font-bold text-lg">4.8</span>
                    <div className="flex text-lg">
                        {[...Array(5)].map((_, i) => <IoIosStar key={i} />)}
                    </div>
                </div>
                <p className="text-sm text-slate-500">(128 Reviews)</p>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-100 pt-4 space-y-3">
                <InfoRow label="Total Vehicles Sold" value="256" />
                <InfoRow label="Member Since" value="Jan 2020" />
                <InfoRow label="Response Rate" value="95%" />
            </div>

            {/* Button */}
            <button
                onClick={() => {
                    setSelectedSellerId(vehicle.sellerId);
                    setPreviousPage(currentPageName);
                    setCurrentPage('seller-profile');
                }}
                className="w-full py-2 text-sm bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all">
                View Seller Profile
            </button>
        </div>
    );
}

export default BuyerAuctionSellerCard;
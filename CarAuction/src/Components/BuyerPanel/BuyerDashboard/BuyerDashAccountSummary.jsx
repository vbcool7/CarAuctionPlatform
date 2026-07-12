import React from 'react';
import { Plus } from 'lucide-react';

function BuyerDashAccountSummary() {
    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm w-full h-full">

            {/* Header */}
            <h2 className="text-lg font-bold text-[#0B1E3D] mb-6">
                Account Summary
            </h2>

            {/* Available Balance Box */}
            <div className="bg-gray-50 p-2 rounded-2xl flex items-center justify-between mb-6 border border-gray-100">
                <div>
                    <p className="text-sm text-slate-500 font-medium">Available Balance</p>
                    <p className="text-lg md:text-xl font-bold text-[#0B1E3D]">AED 50,000</p>
                </div>
                
                <button className="bg-[#D97706] flex items-center gap- px-4 py-2 rounded-xl text-sm font-semibold text-white border border-[#D97706] hover:bg-[#0B1E3D] hover:text-white transition-colors">
                    <Plus size={18} /> Add Funds
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                    <p className="text-sm text-slate-500">Total Spent</p>
                    <p className="text-[14  px] font-bold text-[#0B1E3D] mt-1">AED 285,000</p>
                </div>
                <div className="text-center border-l border-slate-100">
                    <p className="text-sm text-slate-500">Won Auctions</p>
                    <p className="text-[14px] font-bold text-[#0B1E3D] mt-1">3</p>
                </div>
                <div className="text-center border-l border-slate-100">
                    <p className="text-sm text-slate-500">Bids Placed</p>
                    <p className="text-[14px] font-bold text-[#0B1E3D] mt-1">28</p>
                </div>
            </div>
        </div>
    );
}

export default BuyerDashAccountSummary;

import React, { useState } from 'react';
import { Filter, Download } from 'lucide-react';

function VehicleApprovalsHeader({ activeTab, setActiveTab, setCurrentPage }) {
    return (
        <>
            {/* Header */}
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between pb-6">

                {/* Left */}
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3D]">
                        Vehicle Approvals
                    </h1>

                    <div className="mt-2 flex items-center text-[11px] md:text-[13px]">
                        <span
                            onClick={() => setCurrentPage("dashboard")}
                            className="cursor-pointer text-slate-500 hover:text-[#D97706] transition-colors"
                        >
                            Dashboard
                        </span>
                        <span className="mx-2 text-slate-300">/</span>
                        <span className="font-medium text-[#D97706]">
                           Vehicle Approvals
                        </span>
                    </div>
                </div>

                {/* Right */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <button
                        className="flex justify-center items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2 md:py-2.5 font-medium text-[#0B1E3D] shadow-sm transition-all duration-300 hover:border-[#D97706] hover:bg-amber-50"
                    >
                        <Filter size={18} />
                        Filter
                    </button>

                    <button
                        className="flex justify-center items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2 md:py-2.5 font-medium text-[#0B1E3D] shadow-sm transition-all duration-300 hover:border-[#D97706] hover:bg-amber-50"
                    >
                        <Download size={18} />
                        Export
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="mb-6 flex items-center gap-6 md:gap-8 border-b border-slate-200 overflow-x-auto scrollbar-hide">
                {["all requests", "pending", "approved", "rejected"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-3 text-sm font-medium transition-all whitespace-nowrap capitalize
                        ${activeTab === tab
                                ? "border-b-2 border-[#D97706] text-[#D97706]"
                                : "text-slate-500 hover:text-[#0B1E3D]"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
        </>
    );
}

export default VehicleApprovalsHeader;
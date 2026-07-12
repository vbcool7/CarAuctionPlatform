
import React, { useState } from 'react';
import { Plus, Download } from 'lucide-react';

function UserManagementHeader({ activeTab, setCurrentPage, onAddNew }) {
    return (
        <>
            {/* Header */}
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between pb-6">

                {/* Left */}
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3D]">
                        User Management
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
                            User Management
                        </span>
                    </div>
                </div>

                {/* Right */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <button
                        onClick={onAddNew}
                        className="flex justify-center items-center gap-2 rounded-xl bg-[#D97706] px-5 py-2 md:py-2.5 font-medium text-white shadow-lg shadow-amber-500/20 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                    >
                        <Plus size={18} />
                        Add New User
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
                {["buyers", "sellers", "staffs"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setCurrentPage(tab)}
                        className={`pb-3 text-sm font-medium transition-all whitespace-nowrap capitalize
                        ${activeTab === tab
                                ? "border-b-2 border-[#D97706] text-[#D97706]"
                                : "text-slate-500 hover:text-[#0B1E3D]"
                            }`}
                    >
                        {tab === "staffs" ? "Staff" : tab}
                    </button>
                ))}
            </div>
        </>
    );
}

export default UserManagementHeader;
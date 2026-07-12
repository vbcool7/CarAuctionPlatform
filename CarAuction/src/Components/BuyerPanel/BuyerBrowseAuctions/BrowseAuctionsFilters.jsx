
import React, { useState } from 'react';
import { vehicles } from '../../../Components/Data';
import { Filter, ChevronDown, Bookmark, ChevronLeft, ChevronRight } from 'lucide-react';

const tabs = ['All Auctions', 'Live Now', 'Upcoming', 'Ended'];

function BrowseAuctionsFilters() {

    const [activeTab, setActiveTab] = useState('All Auctions');

    return (
        <div className='w-full'>

            {/* buyer heading */}
            <div className='pb-7'>
                <h1 className='text-slate-800 text-xl md:text-2xl font-bold'>Browse Auctions</h1>
                <p className='pt-1 text-gray-600 text-[12px] md:text-sm font-medium'>Explore and bid on vehicles from live, upcoming and ended auctions.</p>
            </div>

            <div className="bg-white p-4 md:p-6 rounded-3xl border border-slate-200 shadow-sm w-full">

                {/* tabs */}
                <div className="flex items-center justify-between border-b border-slate-100 mb-6 overflow-x-auto no-scrollbar">
                    <div className="flex gap-6 md:gap-8 whitespace-nowrap">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-4 text-[13px] md:text-sm font-semibold transition-all relative whitespace-nowrap ${activeTab === tab ? 'text-[#0B1E3D]' : 'text-slate-400 hover:text-[#0B1E3D]'}`}
                            >
                                {tab}
                                {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#D97706] rounded-t-full" />}
                            </button>
                        ))}
                    </div>

                    {/* Saved Searches hidden on very small screens or styled smaller */}
                    <button className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#0B1E3D] transition-colors mb-4 ml-4">
                        <Bookmark size={18} /> Saved Searches
                    </button>
                </div>

                {/* drop down */}
                <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
                    {['All Makes', 'All Models', 'Year', 'Price Range', 'Body Type'].map((filter) => (
                        <button 
                        key={filter} 
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-[13px] md:text-sm font-medium text-slate-600 hover:border-[#D97706] transition-colors whitespace-nowrap">
                            {filter} <ChevronDown size={14} />
                        </button>
                    ))}

                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:border-[#D97706] transition-colors whitespace-nowrap">
                        <Filter size={14} /> More
                    </button>

                    {/* Sort: Pushing to the end or keeping it visible */}
                    <div className="flex items-center gap-2 text-sm ml-auto whitespace-nowrap pl-4">
                        <span className="text-slate-500 hidden sm:inline">Sort by:</span>
                        <button className="font-semibold text-[#0B1E3D] flex items-center gap-1">
                            Newest <ChevronDown size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BrowseAuctionsFilters;
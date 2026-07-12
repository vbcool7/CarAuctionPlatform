
import React from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { vehicles } from '../../Data';

function BuyerUpcomingAuctionsTabs({ activeTab, setActiveTab, view, setView }) {

    const upcomingVehicles = vehicles.filter((v) => v.status === "upcoming");

    const tabs = [
        { name: 'All', label: 'All Upcoming', count: upcomingVehicles.length },
        { name: 'Today', label: 'Today', count: upcomingVehicles.filter(v => v.timeCategory === 'today').length },
        { name: 'This Week', label: 'This Week', count: upcomingVehicles.filter(v => v.timeCategory === 'this-week').length },
        { name: 'Next Week', label: 'Next Week', count: upcomingVehicles.filter(v => v.timeCategory === 'next-week').length },
    ];

    return (
        <div className="flex justify-between items-end border-b border-slate-200 mb-6 overflow-x-auto no-scrollbar">
            
            {/* Tabs */}
            <div className="flex gap-8">
                {tabs.map((tab) => (
                    <button
                        key={tab.name}
                        onClick={() => setActiveTab(tab.name)}
                        className={`pb-4 text-[13px] md:text-sm font-semibold transition-all relative whitespace-nowrap
                            ${activeTab === tab.name
                                ? 'text-[#0B1E3D]'
                                : 'text-slate-400 hover:text-[#0B1E3D]'
                            }`}
                    >
                        {tab.label} ({tab.count})
                        {activeTab === tab.name && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#D97706] rounded-t-full" />
                        )}
                    </button>
                ))}
            </div>

            {/* View Toggle */}
            <div className="hidden md:flex gap-2 border border-slate-200 rounded-lg p-1 mb-2">
                <button
                    onClick={() => setView('grid')}
                    className={`p-1.5 rounded-md transition-all ${view === 'grid' ? 'bg-[#0B1E3D] text-white' : 'text-slate-400 hover:text-[#0B1E3D]'}`}
                >
                    <LayoutGrid size={18} />
                </button>
                <button
                    onClick={() => setView('list')}
                    className={`p-1.5 rounded-md transition-all ${view === 'list' ? 'bg-[#0B1E3D] text-white' : 'text-slate-400 hover:text-[#0B1E3D]'}`}
                >
                    <List size={18} />
                </button>
            </div>
        </div>
    );
}

export default BuyerUpcomingAuctionsTabs;

import React, { useState } from 'react';
import { HiSearch, HiViewGrid, HiViewList } from 'react-icons/hi';
import { HiOutlineRefresh } from 'react-icons/hi';
import { vehicles } from "../Components/Data";
import EndedAuctionStats from '../Components/EndedAuctionStats';
import EndedAuctions from '../Components/EndedAuctions';
import AuctionFooter from '../Components/AuctionFooter';
import EndedAuctionSideFilter from '../Components/EndedAuctionSideFilter';
import EndedAuctionStatistics from '../Components/EndedAuctionStatistics';
import EndedAuctionTopSelling from '../Components/EndedAuctionTopSelling';

function EndedAuctionsPage() {

    const [view, setView] = useState('list');
    const [visibleCount, setVisibleCount] = useState(5);
    const [activeTab, setActiveTab] = useState('all');

    const soldUnsoldVehicles = vehicles.filter(
        (v) => v.status === "sold" || v.status === "unsold"
    );

    const tabs = [
        { key: 'all', label: 'All Ended' },
        { key: 'sold', label: 'Sold' },
        { key: 'unsold', label: 'Not Sold' },
        { key: 'not-met', label: 'Reserve Not Met' },
    ];

    const filteredVehicles = soldUnsoldVehicles.filter((v) => {
        if (activeTab === 'all') return true;
        if (activeTab === 'sold') return v.status === 'sold';
        if (activeTab === 'unsold') return v.status === 'unsold';
        if (activeTab === 'not-met') return v.status === 'unsold' && v.reserveMet === false;
        return true;
    });

    return (
        <section className='w-full'>
            <div className='max-w-6xl mx-auto px-4 md:px-5 lg:px-6 py-8'>

                {/* Heading */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">Ended Auctions</h1>
                    <p className='text-sm text-slate-500'>Browse vehicles from completed auctions.</p>
                </div>

                {/* Stats */}
                <EndedAuctionStats vehicles={soldUnsoldVehicles} />

                {/* Two-column layout */}
                <div className="flex flex-col md:flex-row gap-6 mt-6">

                    {/* Left: main content */}
                    <div className="w-full md:w-[70%] space-y-4">

                        {/* Tabs */}
                        <div className="border-b border-slate-200">
                            <div className="flex gap-6">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.key
                                            ? 'border-[#D97706] text-[#D97706]'
                                            : 'border-transparent text-slate-500 hover:text-slate-700'
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Search + Sort + View */}
                        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mt-4">
                            <div className="relative w-full md:grow">
                                <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
                                <input
                                    type="text"
                                    placeholder="Search by make, model or lot number..."
                                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D97706]/20"
                                />
                            </div>
                            <div className="flex items-center gap-2 w-full md:w-auto">
                                <select className="w-full md:w-48 px-3 py-2.5 border border-slate-200 rounded-lg text-slate-700 bg-white focus:outline-none">
                                    <option>Sort By: Soonest First</option>
                                    <option>Sort By: Starting Bid (Low)</option>
                                    <option>Sort By: Starting Bid (High)</option>
                                </select>
                                <div className="flex border border-slate-200 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => setView('grid')}
                                        className={`px-3 py-2.5 ${view === 'grid' ? 'bg-slate-100 text-[#D97706]' : 'text-slate-500'}`}
                                    >
                                        <HiViewGrid size={20} />
                                    </button>
                                    <button
                                        onClick={() => setView('list')}
                                        className={`px-3 py-2.5 border-l border-slate-200 ${view === 'list' ? 'bg-slate-100 text-[#D97706]' : 'text-slate-500'}`}
                                    >
                                        <HiViewList size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Cards */}
                        <div className="space-y-4 mt-2">
                            {filteredVehicles.length === 0 ? (
                                <div className="text-center py-16 text-slate-400 text-sm">
                                    No ended auctions found for this period.
                                </div>
                            ) : (
                                filteredVehicles.slice(0, visibleCount).map((vehicle) => (
                                    <EndedAuctions key={vehicle.id} vehicle={vehicle} />
                                ))
                            )}

                            {visibleCount < filteredVehicles.length && (
                                <button
                                    onClick={() => setVisibleCount((prev) => prev + 5)}
                                    className="w-60 mx-auto flex items-center justify-center gap-2 border border-[#D97706] text-[#D97706] py-2.5 rounded-lg text-sm font-semibold hover:bg-[#D97706]/5 transition cursor-pointer"
                                >
                                    <HiOutlineRefresh size={16} /> Load More Auctions
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Right: filter sidebar */}
                    <div className="w-full md:w-[30%] space-y-4">
                        <EndedAuctionSideFilter />
                        <EndedAuctionStatistics />
                        <EndedAuctionTopSelling />
                    </div>
                </div>

            </div>

            <AuctionFooter />
        </section>
    )
}

export default EndedAuctionsPage;

import React, { useState } from 'react';
import { Download } from 'lucide-react';

import BuyerMyBidsTabs from './BuyerMyBidsTabs';
import BuyerMyBidsList from './BuyerMyBidsList';
import BuyerMyBidsAboutCard from './BuyerMyBidsAboutCard';
import BuyerMyBidsFilter from './BuyerMyBidsFilter';

const tabs = [
    { name: 'Active Bids', label: 'Active Bids', },
    { name: 'Outbid', label: 'Outbid', },
    { name: 'Won', label: 'Won', },
    { name: 'Not Won', label: 'Not Won', },
    { name: 'Withdraw', label: 'Withdraw', },
];

function BuyerMyBids({ setCurrentPage, setSelectedVehicleId, setPreviousPage }) {

    const [activeTab, setActiveTab] = useState('Active Bids');

    return (
        <div>
            <div className='pb-7'>
                <h1 className='text-slate-800 text-xl md:text-2xl font-bold'>My Bids</h1>
                <p className='pt-1 text-gray-600 text-[12px] md:text-sm font-medium'>Track and manage all the auctions you've placed ids on.</p>
            </div>

            {/* tabs */}
            <div className="flex justify-between items-end border-b border-slate-200 mb-6 overflow-x-auto no-scrollbar">

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
                            {tab.label}
                            {activeTab === tab.name && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#D97706] rounded-t-full" />
                            )}
                        </button>
                    ))}
                </div>

                <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#0B1E3D] hover:bg-slate-50 rounded-md transition-colors border border-slate-200">
                    <Download className="w-4 h-4" />
                    Export
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                
                {/* left */}
                <div className="lg:col-span-8">
                    <BuyerMyBidsList
                        setCurrentPage={setCurrentPage}
                        setSelectedVehicleId={setSelectedVehicleId}
                        setPreviousPage={setPreviousPage}
                        activeTab={activeTab}
                    />
                </div>

                {/* right */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <BuyerMyBidsFilter />
                    <BuyerMyBidsAboutCard />
                </div>

            </div>
        </div>
    )
}

export default BuyerMyBids
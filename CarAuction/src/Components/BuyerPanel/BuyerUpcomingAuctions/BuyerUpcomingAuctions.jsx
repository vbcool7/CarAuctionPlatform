
import React, { useState } from 'react'
import BuyerUpcomingAuctionsList from './BuyerUpcomingAuctionsList';
import BuyerUpcomingAuctionsFilters from './BuyerUpcomingAuctionsFilters';
import BuyerUpcomingAuctionsCalender from './BuyerUpcomingAuctionsCalender';
import BuyerUpcomingAuctionCard from './BuyerUpcomingAuctionsCard';
import BuyerUpcomingAuctionsTabs from './BuyerUpcomingAuctionsTabs';

function BuyerUpcomingAuctions({ setCurrentPage, setSelectedVehicleId }) {

    const [activeTab, setActiveTab] = useState('All');
    const [view, setView] = useState('grid');

    return (
        <div>
            <div className='pb-7'>
                <h1 className='text-slate-800 text-xl md:text-2xl font-bold'>Upcoming Auctions</h1>
                <p className='pt-1 text-gray-600 text-[12px] md:text-sm font-medium'>View and participate in auctions happening soon.</p>
            </div>

            {/* tabs */}
            <BuyerUpcomingAuctionsTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                view={view}
                setView={setView} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* left */}
                <div className="lg:col-span-8">
                    <BuyerUpcomingAuctionsList
                        setCurrentPage={setCurrentPage}
                        setSelectedVehicleId={setSelectedVehicleId}
                        activeTab={activeTab}
                        view={view} />
                </div>

                {/* right */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <BuyerUpcomingAuctionsFilters />
                    <BuyerUpcomingAuctionsCalender />
                    <BuyerUpcomingAuctionCard />
                </div>

            </div>
        </div>
    )
}

export default BuyerUpcomingAuctions;
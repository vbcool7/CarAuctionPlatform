
import React, { useState } from 'react';
import BuyerWonAuctionsTabs from './BuyerWonAuctionsTabs';
import BuyerWonAuctionsList from './BuyerWonAuctionsList';
import BuyerWonAuctionsSummary from './BuyerWonAuctionsSummary';
import BuyerWonAuctionsNeedCard from './BuyerWonAuctionsNeedCard';

function BuyerWonAuctions({ setSelectedVehicleId, setCurrentPage }) {

    const [activeTab, setActiveTab] = useState('All Won');

    return (
        <div>
            <div className='pb-7'>
                <h1 className='text-slate-800 text-xl md:text-2xl font-bold'>Won Auctions</h1>
                <p className='pt-1 text-gray-600 text-[12px] md:text-sm font-medium'>Auctions you've won and ready for the next steps.</p>
            </div>

            {/* tabs */}
            <BuyerWonAuctionsTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                <div className="lg:col-span-8">
                    <BuyerWonAuctionsList
                        setCurrentPage={setCurrentPage}
                        setSelectedVehicleId={setSelectedVehicleId}
                        activeTab={activeTab}
                    />
                </div>

                <div className="lg:col-span-4 flex flex-col gap-6">
                    <BuyerWonAuctionsSummary />
                    <BuyerWonAuctionsNeedCard />
                </div>

            </div>

        </div>
    )
}

export default BuyerWonAuctions;

import React, { useState } from 'react';
import BuyerLostAuctionsTabs from './BuyerLostAuctionsTabs';
import BuyerLostAuctionsList from './BuyerLostAuctionsList';
import BuyerLostAuctionsSummary from './BuyerLostAuctionsSummary';
import BuyerLostAuctionsImprovingCard from './BuyerLostAuctionsImprovingCard';

function BuyerLostAuctions({ setSelectedVehicleId, setCurrentPage }) {

    const [activeTab, setActiveTab] = useState('All Lost');

    return (
        <div>
            <div className='pb-7'>
                <h1 className='text-slate-800 text-xl md:text-2xl font-bold'>Lost Auctions</h1>
                <p className='pt-1 text-gray-600 text-[12px] md:text-sm font-medium'>Auctions you didn't win, keep watching and bid again.</p>
            </div>

            <BuyerLostAuctionsTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab} />

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                <div className="lg:col-span-8">
                    <BuyerLostAuctionsList
                        setCurrentPage={setCurrentPage}
                        setSelectedVehicleId={setSelectedVehicleId}
                        activeTab={activeTab}
                    />
                </div>

                <div className="lg:col-span-4 flex flex-col gap-6">
                    <BuyerLostAuctionsSummary />
                    <BuyerLostAuctionsImprovingCard />
                </div>

            </div>
        </div>
    )
}

export default BuyerLostAuctions;
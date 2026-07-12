
import React, { useState } from 'react'
import BuyerLiveAuctionsStats from './BuyerLiveAuctionsStats';
import BuyerLiveAuctionsList from './BuyerLiveAuctionsList';
import BuyerLiveAuctionsTips from './BuyerLiveAuctionsTips';
import BuyerLiveAuctionsBidders from './BuyerLiveAuctionsBidders';
import BuyerLiveAuctionsNotification from './BuyerLiveAuctionsNotification';
import BuyerLiveAuctionsHowWorks from './BuyerLiveAuctionsHowWorks';

function BuyerLiveAuctions({ setCurrentPage, setSelectedVehicleId }) {

    return (
        <div>
            {/* Header */}
            <div className='pb-3'>
                <h1 className='text-slate-800 text-xl md:text-2xl font-bold flex items-center gap-2'>
                    Live Auctions 
                </h1>
                <p className='pt-1 text-gray-600 text-[12px] md:text-sm font-medium'>
                    Join live auctions and bid in real-time on vehicles.
                </p>
            </div>

            {/* stats */}
            <BuyerLiveAuctionsStats />

            {/* Two-column layout */}
            <div className='grid grid-cols-1 xl:grid-cols-12 gap-8 items-start mt-6'>

                {/* Left — main content */}
                <div className='lg:col-span-8 flex flex-col gap-6'>
                    <BuyerLiveAuctionsList
                        setCurrentPage={setCurrentPage}
                        setSelectedVehicleId={setSelectedVehicleId}
                    />
                    <BuyerLiveAuctionsHowWorks />
                </div>

                {/* Right — sticky sidebar */}
                <div className='lg:col-span-4 flex flex-col gap-6'>
                    <BuyerLiveAuctionsTips />
                    <BuyerLiveAuctionsBidders />
                    <BuyerLiveAuctionsNotification />
                </div>

            </div>
        </div>
    )
}
export default BuyerLiveAuctions;
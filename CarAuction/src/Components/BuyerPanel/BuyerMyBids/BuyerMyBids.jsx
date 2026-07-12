
import React, { useState } from 'react'
import BuyerMyBidsTabs from './BuyerMyBidsTabs';
import BuyerMyBidsList from './BuyerMyBidsList';
import BuyerMyBidsAboutCard from './BuyerMyBidsAboutCard';
import BuyerMyBidsFilter from './BuyerMyBidsFilter';

function BuyerMyBids({ setCurrentPage, setSelectedVehicleId, setPreviousPage }) {

    const [activeTab, setActiveTab] = useState('Active Bids');

    return (
        <div>
            <div className='pb-7'>
                <h1 className='text-slate-800 text-xl md:text-2xl font-bold'>My Bids</h1>
                <p className='pt-1 text-gray-600 text-[12px] md:text-sm font-medium'>Track and manage all the auctions you've placed ids on.</p>
            </div>

            {/* tabs */}
            <BuyerMyBidsTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab} />

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
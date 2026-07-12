
import React, { useState } from 'react'
import BuyerMyOffersTabs from './BuyerMyOffersTabs';
import BuyerMyOffersList from './BuyerMyOffersList';
import BuyerMyOffersSummary from './BuyerMyOffersSummary';
import BuyerMyOffersHowWorks from './BuyerMyOffersHowWorks';

function BuyerMyOffers({setSelectedVehicleId, setCurrentPage}) {

 const [activeTab, setActiveTab] = useState('All Offers');

    return (
        <div>
            <div className='pb-7'>
                <h1 className='text-slate-800 text-xl md:text-2xl font-bold'>My Offers</h1>
                <p className='pt-1 text-gray-600 text-[12px] md:text-sm font-medium'>Track all the offers you've made on vehicles.</p>
            </div>

            <BuyerMyOffersTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab} />

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                <div className="lg:col-span-8 space-y-6">
                    <BuyerMyOffersList
                        setCurrentPage={setCurrentPage}
                        setSelectedVehicleId={setSelectedVehicleId}
                        activeTab={activeTab}
                    />
                    <BuyerMyOffersHowWorks />
                </div>

                <div className="lg:col-span-4 flex flex-col gap-6">
                    <BuyerMyOffersSummary />
                </div>

            </div>
        </div>
    )
}

export default BuyerMyOffers;

import React, { useState } from 'react'
import BuyerPaymentsTabs from './BuyerPaymentsTabs';
import BuyerPaymentsList from './BuyerPaymentsList';
import BuyerPaymentsSummary from './BuyerPaymentsSummary';

function BuyerPayments({ setSelectedVehicleId, setCurrentPage }) {

    const [activeTab, setActiveTab] = useState('All Payments');

    return (
        <div>
            <div className='pb-7'>
                <h1 className='text-slate-800 text-xl md:text-2xl font-bold'>Payments</h1>
                <p className='pt-1 text-gray-600 text-[12px] md:text-sm font-medium'>Track and manage your payments for won vehicles.</p>
            </div>

            {/* tabs */}
            <BuyerPaymentsTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                <div className="lg:col-span-8 space-y-6">
                    <BuyerPaymentsList
                        setCurrentPage={setCurrentPage}
                        setSelectedVehicleId={setSelectedVehicleId}
                        activeTab={activeTab}
                    />
                </div>

                <div className="lg:col-span-4 flex flex-col gap-6">
                    <BuyerPaymentsSummary />
                </div>

            </div>

        </div>
    )
}

export default BuyerPayments;
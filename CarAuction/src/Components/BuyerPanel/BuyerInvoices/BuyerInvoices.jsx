
import React, { useState } from 'react';
import BuyerInvoicesTabs from './BuyerInvoicesTabs';
import BuyerInvoicesSummary from './BuyerInvoicesSummary';
import BuyerInvoicesList from './BuyerInvoicesList';

function BuyerInvoices({ setSelectedVehicleId, setCurrentPage }) {

    const [activeTab, setActiveTab] = useState('All Invoices');

     return (
        <div>
            <div className='pb-7'>
                <h1 className='text-slate-800 text-xl md:text-2xl font-bold'>Invoices</h1>
                <p className='pt-1 text-gray-600 text-[12px] md:text-sm font-medium'>View and download all your invoices.</p>
            </div>

            <BuyerInvoicesTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab} />

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                <div className="lg:col-span-8 space-y-6">
                    <BuyerInvoicesList
                        setCurrentPage={setCurrentPage}
                        setSelectedVehicleId={setSelectedVehicleId}
                        activeTab={activeTab}
                    />
                </div>

                <div className="lg:col-span-4 flex flex-col gap-6">
                    <BuyerInvoicesSummary />
                </div>

            </div>
        </div>
    )
}

export default BuyerInvoices;
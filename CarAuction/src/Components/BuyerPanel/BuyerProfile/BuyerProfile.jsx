
import React, { useState } from 'react';
import BuyerProfileTabs from './BuyerProfileTabs';
import BuyerProfilePersonalInfo from './BuyerProfilePersonalInfo';
import BuyerProfilePersonalInfoSidebar from './BuyerProfilePersonalInfoSidebar';
import BuyerProfileSecurity from './BuyerProfileSecurity';
import BuyerProfileSecuritySidebar from './BuyerProfileSecuritySidebar';
import BuyerProfileNotification from './BuyerProfileNotification';
import BuyerProfileNotificationSidebar from './BuyerProfileNotificationSidebar';
import BuyerProfilePaymentSidebar from './BuyerProfilePaymentSidebar';
import BuyerProfileAddressSidebar from './BuyerProfileAddressSidebar';
import BuyerProfilePayment from './BuyerProfilePayment';
import BuyerProfileAddress from './BuyerProfileAddress';

function BuyerProfile({ setSelectedVehicleId, setCurrentPage }) {

    const [activeTab, setActiveTab] = useState('My Profile');

    return (
        <div>
            <div className='pb-7'>
                <h1 className='text-slate-800 text-xl md:text-2xl font-bold'>
                    Profile Settings
                </h1>
                <p className='pt-1 text-gray-600 text-[12px] md:text-sm font-medium'>
                    Manage your account information and preference.
                </p>
            </div>

            <BuyerProfileTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6">

                {/* Left col */}
                 <div className="w-full lg:col-span-8 mb-6">
                    {activeTab === 'My Profile' && <BuyerProfilePersonalInfo />}
                    {activeTab === 'Security' && <BuyerProfileSecurity />}
                    {activeTab === 'Notification Preferences' && <BuyerProfileNotification />}
                    {activeTab === 'Payment Methods' && <BuyerProfilePayment />}
                    {activeTab === 'Address Book' && <BuyerProfileAddress />}
                </div>

                {/* Right col */}
                <div className="w-full lg:col-span-4">
                    {activeTab === 'My Profile' && <BuyerProfilePersonalInfoSidebar />}
                    {activeTab === 'Security' && <BuyerProfileSecuritySidebar />}
                    {activeTab === 'Notification Preferences' && <BuyerProfileNotificationSidebar />}
                    {activeTab === 'Payment Methods' && <BuyerProfilePaymentSidebar />}
                    {activeTab === 'Address Book' && <BuyerProfileAddressSidebar />}
                </div>
            </div>
        </div>
    )
}

export default BuyerProfile;
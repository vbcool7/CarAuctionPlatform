
import React from 'react';

function BuyerProfileTabs({ activeTab, setActiveTab }) {

    const tabs = [
        { name: 'My Profile', label: 'My Profile', },
        { name: 'Security', label: 'Security', },
        { name: 'Notification Preferences', label: 'Notification Preferences', },
        { name: 'Payment Methods', label: 'Payment Methods', },
        { name: 'Address Book', label: 'Address Book', },
    ];

    return (
        <div className="flex justify-between items-end border-b border-slate-200 mb-6 overflow-x-auto no-scrollbar">

            {/* Tabs */}
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
        </div>
    )
}

export default BuyerProfileTabs

import React from 'react';
import { Download } from 'lucide-react';
import { vehicles } from '../../Data';

function BuyerMyBidsTabs({ activeTab, setActiveTab }) {

  const tabs = [
    { name: 'Active Bids', label: 'Active Bids', },
    { name: 'Outbid', label: 'Outbid', },
    { name: 'Won', label: 'Won', },
    { name: 'Not Won', label: 'Not Won', },
    { name: 'Withdraw', label: 'Withdraw', },
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

      <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#0B1E3D] hover:bg-slate-50 rounded-md transition-colors border border-slate-200">
        <Download className="w-4 h-4" />
        Export
      </button>
    </div>
  );
}

export default BuyerMyBidsTabs
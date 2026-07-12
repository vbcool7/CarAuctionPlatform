
import React from 'react';
import { Trophy } from 'lucide-react';

function BuyerWonAuctionsSummary() {
  
  const summaryData = [
    { label: 'Total Won', value: '5' },
    { label: 'Payment Completed', value: '3' },
    { label: 'Payment Pending', value: '2' },
    { label: 'Ready for Pickup', value: '1' },
    { label: 'Picked Up', value: '0' },
  ];

  const financialData = [
    { label: 'Total Amount Won', value: 'AED 605,000' },
    { label: 'Total Paid', value: 'AED 295,000' },
    { label: 'Pending Amount', value: 'AED 310,000' },
  ];

  return (
    <div className="w-full max-w-sm bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#D97706]/10 rounded-lg">
          <Trophy className="text-[#D97706]" size={20} />
        </div>
        <h2 className="text-lg font-bold text-[#0B1E3D]">Summary</h2>
      </div>

      {/* Main List */}
      <div className="space-y-4 mb-6">
        {summaryData.map((item, index) => (
          <div key={index} className="flex justify-between items-center text-sm">
            <span className="text-slate-600">{item.label}</span>
            <span className="font-semibold text-[#0B1E3D]">{item.value}</span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-slate-100 my-4" />

      {/* Financials */}
      <div className="space-y-4 mb-6">
        {financialData.map((item, index) => (
          <div key={index} className="flex justify-between items-center text-sm">
            <span className="text-slate-600 font-medium">{item.label}</span>
            <span className="font-bold text-[#0B1E3D]">{item.value}</span>
          </div>
        ))}
      </div>

      {/* Action Button */}
      <button className="w-full py-2 rounded-xl border-2 border-[#D97706] text-sm text-[#D97706] font-bold hover:bg-[#0B1E3D] hover:text-white transition-all duration-300">
        View Payments
      </button>
    </div>
  );
}

export default BuyerWonAuctionsSummary;
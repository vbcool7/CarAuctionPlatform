
import React from 'react';
import { ShieldCheck, CheckCircle } from 'lucide-react';
import BuyerContactSupport from '../BuyerSharedComponents/BuyerContactSupport';

function BuyerProfilePaymentSidebar() {
    
  const paymentDetails = [
    { label: 'Total Payment Methods', value: '4' },
    { label: 'Default Payment Method', value: 'Visa **** 4242' },
    { label: 'Last Payment', value: 'AED 120,000' },
    { label: 'Last Payment Date', value: 'May 20, 2024' },
  ];

  const securityFeatures = [
    'All payments are SSL encrypted',
    'Your card details are never stored',
    'PCI DSS compliant',
    'Secure 3D Secure authentication'
  ];

  return (
    <div className="space-y-6">

      {/* 1. Payment Overview */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
        <h3 className="font-bold text-[#0B1E3D] mb-6">Payment Overview</h3>
        <div className="space-y-4">
          {paymentDetails.map((item, i) => (
            <div key={i} className="flex justify-between items-center text-sm">
              <span className="text-slate-500">{item.label}</span>
              <span className="font-semibold text-[#0B1E3D]">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Secure Payments */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <ShieldCheck className="text-[#D97706]" size={20} />
          <h3 className="font-bold text-[#0B1E3D]">Secure Payments</h3>
        </div>
        <div className="space-y-3">
          {securityFeatures.map((feature, i) => (
            <div key={i} className="flex items-center gap-3 text-sm text-slate-700">
              <CheckCircle size={16} className="text-green-500 shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Contact Support */}
      <BuyerContactSupport />
    </div>
  );
}

export default BuyerProfilePaymentSidebar;
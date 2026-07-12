
import React from 'react';
import { Gauge, User, CalendarDays, ShieldCheck, Shield } from 'lucide-react';

function BuyerLostAuctionsDetailFeaturebar({ vehicle }) {

  const features = [
    { icon: <Gauge size={24} />, title: 'Low Mileage', value: vehicle?.mileage || '45,200 KM' },
    { icon: <User size={24} />, title: 'One Owner', value: vehicle?.usage || 'Personal Use' },
    { icon: <CalendarDays size={24} />, title: 'Full Service History', value: vehicle?.serviceHistory || 'Available' },
    { icon: <ShieldCheck size={24} />, title: 'Accident Free', value: vehicle?.accidentStatus || 'Verified' },
    { icon: <Shield size={24} />, title: 'GCC Spec', value: vehicle?.spec || 'Built for GCC' },
  ];

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-bold text-[#0B1E3D] mb-6">Vehicle Highlights</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {features.map((feature, index) => (
          <div 
          key={index} 
          className="flex items-center gap-4">
            
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#D97706]/10 text-[#D97706] shrink-0">
              {feature.icon}
            </div>
            
            {/* Text Content */}
            <div>
              <p className="text-sm font-bold text-[#0B1E3D]">{feature.title}</p>
              <p className="text-xs text-slate-500">{feature.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BuyerLostAuctionsDetailFeaturebar;
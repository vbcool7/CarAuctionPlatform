
import React from 'react';
import { ShieldCheck, ShieldAlert, FileText, User, BadgeCheck, MapPin } from 'lucide-react';

function AuctionFeaturesBar({ vehicle }) {
    
  const features = [
    { icon: <ShieldCheck className="text-emerald-600" />, label: "Inspection Score", value: vehicle.inspectionScore || "9.2/10" },
    { icon: <ShieldAlert className="text-blue-600" />, label: "Accident Free", value: "Verified" },
    { icon: <FileText className="text-blue-600" />, label: "Service History", value: "Available" },
    { icon: <User className="text-purple-600" />, label: "Ownership", value: "1 Owner" },
    { icon: <BadgeCheck className="text-emerald-600" />, label: "Certified Vehicle", value: "Yes" },
    { icon: <MapPin className="text-blue-500" />, label: "Location", value: vehicle.location },
  ];

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 my-8 shadow-sm">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {features.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div className="p-2 bg-slate-50 rounded-xl">
                {React.cloneElement(item.icon, { size: 20 })}
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">{item.label}</p>
              <p className="text-sm font-bold text-slate-900">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AuctionFeaturesBar;
import React from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  FileText,
  Car,
  BadgeCheck,
  MapPin
} from 'lucide-react';

const formatLabel = (value) => {
  if (!value) return "—";

  return String(value)
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

function AuctionFeaturesBar({ vehicle }) {
  const features = [
    {
      icon: <ShieldCheck className="text-emerald-600" />,
      label: "Overall Condition",
      value: formatLabel(vehicle?.overallCondition),
    },
    {
      icon: <ShieldAlert className="text-rose-500" />,
      label: "Accident History",
      value: formatLabel(vehicle?.accidentHistory),
    },
    {
      icon: <FileText className="text-blue-600" />,
      label: "Title Status",
      value: formatLabel(vehicle?.titleStatus),
    },
    {
      icon: <Car className="text-indigo-600" />,
      label: "Mechanical",
      value: formatLabel(vehicle?.mechanicalCondition),
    },
    {
      icon: <BadgeCheck className="text-emerald-600" />,
      label: "Exterior",
      value: formatLabel(vehicle?.exteriorCondition),
    },
    {
      icon: <MapPin className="text-sky-500" />,
      label: "Location",
      value: vehicle?.city
        ? `${formatLabel(vehicle?.emirate)}, ${vehicle.city}`
        : formatLabel(vehicle?.emirate),
    },
  ];

  return (
    <div className="bg-linear-to-br from-white via-slate-50/60 to-white border border-slate-200/80 rounded-3xl px-2 py-6 my-8 shadow-xl shadow-slate-200/50 backdrop-blur-md">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
        {features.map((item, idx) => (
          <div 
            key={idx} 
            className="group flex items-center gap-3.5 p-3 rounded-2xl transition-all duration-300 hover:bg-white hover:shadow-md hover:border-slate-100 border border-transparent"
          >
            <div className="p-2.5 bg-white shadow-sm border border-slate-100 rounded-xl group-hover:scale-105 transition-transform duration-300 shrink-0">
              {React.cloneElement(item.icon, { size: 20, strokeWidth: 2.2 })}
            </div>

            <div className="min-w-0">
              <p className="text-[10px] tracking-wider text-slate-400 uppercase font-bold truncate">
                {item.label}
              </p>
              <p className="text-sm font-bold text-slate-900 tracking-tight truncate mt-0.5">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AuctionFeaturesBar;

import React from 'react';
import { Gavel, Eye, Heart, Users } from 'lucide-react';

const stats = [
  { label: 'Total Bids', value: '12', icon: Gavel, colorClass: 'bg-blue-50 text-blue-600' },
  { label: 'Total Views', value: '643', icon: Eye, colorClass: 'bg-emerald-50 text-emerald-600' },
  { label: 'Watchlisted', value: '87', icon: Heart, colorClass: 'bg-purple-50 text-purple-600' },
  { label: 'Interested Buyers', value: '26', icon: Users, colorClass: 'bg-orange-50 text-orange-600' },
];

function EndedNotSoldFeatureBar() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 my-8 bg-white border border-slate-100 rounded-2xl shadow-sm">
      {stats.map((stat, index) => (
        <div key={index} className="flex items-center gap-4 px-2">
          {/* Icon Container */}
          <div className={`p-3 rounded-xl ${stat.colorClass}`}>
            <stat.icon size={24} strokeWidth={2} />
          </div>
          
          {/* Text Content */}
          <div className="flex flex-col">
            <span className="text-xl font-bold text-[#0B1E3D]">{stat.value}</span>
            <span className="text-xs text-slate-500 font-medium">{stat.label}</span>
          </div>

          {/* Vertical Divider (Hidden on last item) */}
          {index < stats.length - 1 && (
            <div className="hidden md:block w-px h-8 bg-slate-200 ml-auto" />
          )}
        </div>
      ))}
    </div>
  );
}

export default EndedNotSoldFeatureBar;
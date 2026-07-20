
import React from 'react';
import { Eye, MapPin, Edit3, Target } from 'lucide-react';

const stats = [
  { label: 'Total Views', value: '7,132', icon: <Eye size={18} /> },
  { label: 'Total Inquiries', value: '512', icon: <MapPin size={18} /> },
  { label: 'Total Bids', value: '1,258', icon: <Edit3 size={18} /> },
  { label: 'Conversion Rate', value: '14.7%', icon: <Target size={18} /> },
];

function ListingPerformanceSummary() {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <h3 className="font-bold text-slate-900 mb-6">Performance Summary</h3>
      
      <div className="space-y-6">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-slate-600">
              {stat.icon}
              <span className="text-sm font-medium">{stat.label}</span>
            </div>
            <span className="text-sm font-bold text-slate-900">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListingPerformanceSummary;
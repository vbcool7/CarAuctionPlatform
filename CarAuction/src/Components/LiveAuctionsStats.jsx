
import React from 'react';
import { 
  IoCalendarNumberOutline, 
  IoCarSportOutline, 
  IoPeopleOutline, 
  IoTimeOutline 
} from 'react-icons/io5';

const LiveAuctionStats = () => {
  const stats = [
    { label: 'Live Auctions', value: '32', icon: <IoCalendarNumberOutline className="text-blue-600" />, bgColor: 'bg-blue-50' },
    { label: 'Active Vehicles', value: '1,256', icon: <IoCarSportOutline className="text-emerald-600" />, bgColor: 'bg-emerald-50' },
    { label: 'Active Bidders', value: '845', icon: <IoPeopleOutline className="text-purple-600" />, bgColor: 'bg-purple-50' },
    { label: 'Ending Today', value: '28', icon: <IoTimeOutline className="text-orange-600" />, bgColor: 'bg-orange-50' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className={`p-3 ${stat.bgColor} rounded-xl text-xl`}>
            {stat.icon}
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">
              {stat.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LiveAuctionStats ;
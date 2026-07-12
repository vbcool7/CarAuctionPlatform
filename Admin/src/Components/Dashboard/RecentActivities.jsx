
import React from 'react';
import { User, Gavel, Wallet, Car, ShieldCheck } from 'lucide-react';

const activities = [
  { id: 1, icon: User, theme: "bg-blue-50 text-blue-600", title: "New user registered", time: "2 mins ago" },
  { id: 2, icon: Gavel, theme: "bg-purple-50 text-purple-600", title: "Auction #AU-1256 created", time: "15 mins ago" },
  { id: 3, icon: Wallet, theme: "bg-green-50 text-green-600", title: "Payment received from John Doe", time: "25 mins ago" },
  { id: 4, icon: Car, theme: "bg-blue-50 text-blue-600", title: "Vehicle #VH-245 approved", time: "1 hour ago" },
  { id: 5, icon: ShieldCheck, theme: "bg-orange-50 text-orange-600", title: "Bid placed on Auction #AU-1254", time: "2 hours ago" }
];

function RecentActivities() {
  return (
    <div className="bg-white p-4 md:p-5 rounded-2xl border border-gray-100 shadow-sm w-full max-w-md">

      <h2 className="text-[15px] md:text-lg font-bold text-gray-900 mb-5 md:mb-6">
        Recent Activities
      </h2>

      <div className="space-y-3 md:space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div 
            key={activity.id} 
            className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${activity.theme}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <p className="text-[13px] md:text-sm font-medium text-gray-700">{activity.title}</p>
              </div>
              <span className="text-[12px] text-gray-400 text-end">{activity.time}</span>
            </div>
          );
        })}
      </div>

      <button className="w-full mt-4 py-3 text-[13px] md:text-sm font-semibold text-[#D97706] border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
        View All Activities
      </button>
    </div>
  );
}

export default RecentActivities;
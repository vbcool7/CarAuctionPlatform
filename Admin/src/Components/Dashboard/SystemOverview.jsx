
import React from 'react';
import { Server, CreditCard, Mail, Database, Activity } from 'lucide-react';

const overview = [
  { id: 1, icon: Server, title: "Server Status", status: "Healthy", theme: "bg-green-50 text-green-700", },
  { id: 2, icon: CreditCard, title: "Payment Gateway", status: "Online", theme: "bg-yellow-50 text-yellow-700", },
  { id: 3, icon: Mail, title: "Email Service", status: "Operational", theme: "bg-blue-50 text-blue-700", },
  { id: 4, icon: Database, title: "Storage Usage", status: "72%", theme: "bg-orange-50 text-orange-700", },
  { id: 5, icon: Activity, title: "Active Sessions", status: "1,234", theme: "bg-red-50 text-red-700", }
];

function SystemOverview() {
  return (
    <div className="bg-white p-4 md:p-5 rounded-2xl border border-gray-100 shadow-sm w-full max-w-md">

      <h2 className="text-[15px] md:text-lg font-bold text-gray-900 mb-5 md:mb-6">
        System Overview
        </h2>
      
      <div className="space-y-3 md:space-y-4">
        {overview.map((item) => {
          const Icon = item.icon;
          return (
            <div 
            key={item.id} 
            className="flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-4">
                <div className={`p-2 rounded-full ${item.theme}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[13px] md:text-sm font-medium text-gray-700">{item.title}</span>
              </div>
              <span className={`px-3 py-1 rounded-md text-[11px] md:text-xs font-semibold ${item.theme}`}>
                {item.status}
              </span>
            </div>
          );
        })}
      </div>

      <button className="w-full mt-6 py-3 text-[13px] md:text-sm font-semibold text-[#D97706] border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
        View System Logs
      </button>
    </div>
  );
}

export default SystemOverview;
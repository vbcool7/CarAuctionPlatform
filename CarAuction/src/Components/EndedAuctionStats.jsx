
import { Gavel, Truck, Users, CircleDollarSign } from "lucide-react";

const stats = [
  { title: "Total Ended Auctions", value: "1,842", icon: Gavel, color: "text-blue-600", bg: "bg-blue-50" },
  { title: "Sold Vehicles", value: "1,256", icon: Truck, color: "text-emerald-600", bg: "bg-emerald-50" },
  { title: "Happy Bidders", value: "12,845", icon: Users, color: "text-violet-600", bg: "bg-violet-50" },
  { title: "Total Sales Value", value: "AED 220M+", icon: CircleDollarSign, color: "text-orange-600", bg: "bg-orange-50" },
];

function EndedAuctionStats () {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
      {stats.map((stat, index) => (
        <div key={index} className="flex items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          {/* Icon Container */}
          <div className={`p-3 rounded-full ${stat.bg}`}>
            <stat.icon className={`w-6 h-6 ${stat.color}`} />
          </div>
          
          {/* Text Content */}
          <div>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-sm text-slate-500 font-medium">{stat.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EndedAuctionStats;
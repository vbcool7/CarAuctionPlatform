
import React from 'react';
import { Gavel, Trophy, Heart, CreditCard } from 'lucide-react';

const stats = [
  { title: "Bids Placed", value: "28", icon: Gavel, link: "View all bids", bgColor: "bg-blue-100/80", iconColor: "text-blue-600", },
  { title: "Won Auctions", value: "3", icon: Trophy, link: "View won", bgColor: "bg-green-100/80", iconColor: "text-green-600", page: 'won-auctions' },
  { title: "Watchlisted", value: "12", icon: Heart, link: "View watchlist", bgColor: "bg-orange-100/80", iconColor: "text-orange-600", page: 'watchlist' },
  { title: "Total Spent", value: "AED 285,000", icon: CreditCard, link: "View payments", bgColor: "bg-purple-100/80", iconColor: "text-purple-600" },
];

function BuyerDashStatsCard({ setCurrentPage }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">

          <div className={`p-3 rounded-2xl ${stat.bgColor} ${stat.iconColor}`}>
            <stat.icon size={28} strokeWidth={2} />
          </div>

          <div className="flex flex-col">
            <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
            <p className="text-slate-500 text-sm mb-1">{stat.title}</p>

            <button
              onClick={() => setCurrentPage(stat.page)}
              className="text-blue-600 text-xs font-semibold flex items-center hover:underline">
              {stat.link} <span className="ml-1">→</span>
            </button>
          </div>

        </div>
      ))}
    </div>
  );
}

export default BuyerDashStatsCard;
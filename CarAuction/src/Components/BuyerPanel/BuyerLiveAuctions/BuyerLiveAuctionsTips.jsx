
import React from 'react';
import { Lightbulb, Wifi, Clock, Wallet, Zap } from 'lucide-react';

const tipsData = [
  {
    icon: Wifi,
    title: 'Stay connected',
    description: 'Ensure a stable internet connection.',
  },
  {
    icon: Clock,
    title: 'Watch the timer',
    description: 'Keep an eye on the countdown.',
  },
  {
    icon: Wallet,
    title: 'Set your budget',
    description: 'Know your limit and stick to it.',
  },
  {
    icon: Zap,
    title: 'Act fast',
    description: 'Place your bids before time runs out.',
  },
];

function BuyerLiveAuctionsTips() {
  return (
    <div className="max-w-md p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <Lightbulb className="w-6 h-6 text-yellow-500" />
        <h2 className="text-lg font-bold text-gray-900">Live Auction Tips</h2>
      </div>

      <div className="space-y-6">
        {tipsData.map((tip, index) => (
          <div key={index} className="flex gap-4">
            <div className="shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-amber-100/40 text-[#D97706]">
              <tip.icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">{tip.title}</h3>
              <p className="text-[13px] text-gray-500">{tip.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BuyerLiveAuctionsTips;
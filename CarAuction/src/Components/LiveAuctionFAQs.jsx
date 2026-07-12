
import React from 'react';
import { HiCheckCircle } from 'react-icons/hi';

const points = [
  {
    title: 'Bid in real time',
    description: 'Place live bids and see updates instantly as the auction progresses.',
  },
  {
    title: 'Never miss a deadline',
    description: 'Track the countdown timer so you never lose out in the final moments.',
  },
  {
    title: 'Transparent bidding',
    description: 'View current bids and bidder activity before you commit.',
  },
  {
    title: 'Free to register and participate',
    description: 'Join any live auction at no cost and start bidding right away.',
  },
];

function LiveAuctionFAQs () {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
      <h3 className="font-bold text-[#0F172A] mb-4">Why Bid in Live Auctions?</h3>
      <div className="space-y-3">
        {points.map((point, index) => (
          <div key={index} className="flex items-start gap-2">
            <HiCheckCircle className="text-[#D97706] mt-0.5 shrink-0" size={18} />
            <div>
              <p className="text-sm font-semibold text-[#0F172A]">{point.title}</p>
              <p className="text-[12px] text-slate-500">{point.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveAuctionFAQs; 
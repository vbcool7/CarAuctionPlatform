
import React from 'react';
import { HiShieldCheck, HiLockClosed, HiLightningBolt, HiTag, HiSupport } from 'react-icons/hi';

const features = [
  {
    icon: <HiShieldCheck size={22} />,
    title: 'Verified Vehicles',
    description: 'All vehicles are inspected and verified',
  },
  {
    icon: <HiLockClosed size={22} />,
    title: 'Secure Payments',
    description: '100% secure payments with escrow protection',
  },
  {
    icon: <HiLightningBolt size={22} />,
    title: 'Real-Time Bidding',
    description: 'Live updates and instant notifications',
  },
  {
    icon: <HiTag size={22} />,
    title: 'Best Deals',
    description: 'Competitive prices and great savings',
  },
  {
    icon: <HiSupport size={22} />,
    title: '24/7 Support',
    description: 'Expert support anytime you need',
  },
];

function AuctionFooter() {
  return (
    <div className="w-full bg-amber-50 border-t border-amber-100 py-10">
      <div className="max-w-6xl mx-auto px-4 md:px-5 lg:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="bg-[#D97706]/10 text-[#D97706] p-2.5 rounded-full shrink-0">
              {feature.icon}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0F172A]">{feature.title}</p>
              <p className="text-[12px] text-slate-500 mt-0.5">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuctionFooter;
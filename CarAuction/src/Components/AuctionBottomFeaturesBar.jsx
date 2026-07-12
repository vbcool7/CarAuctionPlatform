
import React from 'react';
import { ShieldCheck, Lock, Gavel, Tag, Headphones } from 'lucide-react';

const FeatureItem = ({ icon: Icon, title, description }) => (
  <div className="flex items-center space-x-4">
    <div className="bg-[#0B1E3D] p-3 rounded-full border border-[#D97706]/30">
      <Icon className="w-6 h-6 text-[#D97706]" />
    </div>
    <div>
      <h3 className="text-white font-semibold text-sm">{title}</h3>
      <p className="text-gray-400 text-xs">{description}</p>
    </div>
  </div>
);

const AuctionBottomFeaturesBar = () => {
  const features = [
    { icon: ShieldCheck, title: "Verified Vehicles", description: "All vehicles are inspected and verified" },
    { icon: Lock, title: "Secure Payments", description: "100% secure payments with escrow protection" },
    { icon: Gavel, title: "Real-Time Bidding", description: "Live updates and instant notifications" },
    { icon: Tag, title: "Best Deals", description: "Competitive prices and great savings" },
    { icon: Headphones, title: "24/7 Support", description: "Expert support anytime you need" },
  ];

  return (
    <section className="bg-[#0B1E3D] py-8 px-6">
      <div className="max-w-6xl mx-auto px-4 md:px-5 lg:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
        {features.map((feature, index) => (
          <FeatureItem key={index} {...feature} />
        ))}
      </div>
    </section>
  );
};

export default AuctionBottomFeaturesBar;
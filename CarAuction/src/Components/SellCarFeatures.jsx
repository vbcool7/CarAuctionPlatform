import React from 'react';
import { Globe, TrendingUp, ShieldCheck, Zap, FileText } from 'lucide-react';

function SellCarFeatures() {

  const features = [
    {
      icon: Globe,
      title: "Wide Network",
      desc: "Your car is seen by thousands of serious, verified buyers across the UAE and beyond.",
      bg: "bg-blue-50",
      color: "text-blue-600"
    },
    {
      icon: TrendingUp,
      title: "Best Market Price",
      desc: "Competitive bidding ensures you get the highest possible price for your car.",
      bg: "bg-green-50",
      color: "text-green-600"
    },
    {
      icon: ShieldCheck,
      title: "Safe & Secure",
      desc: "We verify buyers and handle everything securely so you can sell with peace of mind.",
      bg: "bg-purple-50",
      color: "text-purple-600"
    },
    {
      icon: Zap,
      title: "Fast & Convenient",
      desc: "From inspection to payment, the entire process is quick, easy, and hassle-free.",
      bg: "bg-orange-50",
      color: "text-orange-600"
    },
    {
      icon: FileText,
      title: "No Hidden Fees",
      desc: "100% transparent process with no hidden charges or surprises.",
      bg: "bg-emerald-50",
      color: "text-emerald-600"
    },
  ];

  return (
    <section className="w-full py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-6">
        
        {/* Header */}
        <h2 className="text-3xl font-bold text-center text-[#0B1E3D] mb-16">
          Why Sell Your Car on BidDrive?
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {features.map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center p-4">
              
              <div className={`w-20 h-20 rounded-full ${item.bg} flex items-center justify-center mb-6`}>
                <item.icon size={32} className={item.color} />
              </div>
              
              <h3 className="font-bold text-[#0B1E3D] mb-2">{item.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SellCarFeatures;
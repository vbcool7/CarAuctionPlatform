import React from 'react';
import { Gavel, Lock, Car, Tag, Headset } from 'lucide-react';

const features = [
  { icon: Gavel, title: "Trusted Platform", desc: "Transparent auctions and verified vehicles." },
  { icon: Lock, title: "Secure Payments", desc: "100% safe and secure payment processing." },
  { icon: Car, title: "Wide Selection", desc: "Thousands of vehicles across all categories." },
  { icon: Tag, title: "Best Deals", desc: "Competitive prices and great savings." },
  { icon: Headset, title: "Customer Support", desc: "24/7 support to assist you at every step." },
];

function HowWorkFeaturebar() {
  return (
    <section className="w-full py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-6">
        
        <h2 className="text-3xl font-bold text-center text-[#0B1E3D] mb-16">
          Why Choose AutoBid?
        </h2>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {features.map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center group">
              
              <div className="w-20 h-20 rounded-full bg-[#D97706]/10 flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-[#D97706]">
                <item.icon size={32} className="text-[#D97706] group-hover:text-white transition-colors duration-300" />
              </div>

              {/* Text Content */}
              <h3 className="font-bold text-[#0B1E3D] mb-1">{item.title}</h3>
              <p className="text-sm text-slate-500 leading-tight">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowWorkFeaturebar;
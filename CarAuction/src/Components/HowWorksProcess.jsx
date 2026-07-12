
import React from 'react';
import { Search, Gavel, ClipboardCheck, FileText, Truck, CheckCircle } from 'lucide-react';

function HowWorksProcess() {

  const steps = [
    { id: 1, icon: Search, title: "Browse & Find", desc: "Explore thousands of vehicles and find the perfect one.", bg: "bg-blue-50", color: "text-blue-600" },
    { id: 2, icon: Gavel, title: "Bid & Win", desc: "Place your bids and win the auction at the best price.", bg: "bg-green-50", color: "text-green-600" },
    { id: 3, icon: ClipboardCheck, title: "Complete Payment", desc: "Securely complete your payment through our trusted systems.", bg: "bg-purple-50", color: "text-purple-600" },
    { id: 4, icon: FileText, title: "Vehicle Processing", desc: "We verify your payment and prepare your vehicle for delivery.", bg: "bg-orange-50", color: "text-orange-600" },
    { id: 5, icon: Truck, title: "Delivery or Pickup", desc: "Choose home delivery or pick up your vehicle from our location.", bg: "bg-sky-50", color: "text-sky-600" },
    { id: 6, icon: CheckCircle, title: "Enjoy Your Car", desc: "Take ownership and enjoy your new vehicle with confidence.", bg: "bg-emerald-50", color: "text-emerald-600" },
  ];

  return (
    <section className="w-full py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-6">

        {/* Header */}
        <h2 className="text-3xl font-bold text-center text-[#0B1E3D] mb-16">
          The Simple <span className="text-[#D97706]">6-Step</span> Process
        </h2>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center text-center group">
              <div className="relative mb-10">
                
                {/* Colorful Circle Background */}
                <div className={`w-20 h-20 rounded-full ${step.bg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                  <step.icon size={32} className={`${step.color}`} />
                </div>
                
                {/* Step Number Badge */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-[#D97706] text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  {step.id}
                </div>
              </div>

              <h3 className="font-bold text-[#0B1E3D] mb-2">{step.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed px-2">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowWorksProcess;
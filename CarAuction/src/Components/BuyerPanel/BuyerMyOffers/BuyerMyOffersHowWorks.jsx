
import React from 'react';
import { Info, ChevronRight } from 'lucide-react';

function BuyerMyOffersHowWorks() {

  const steps = [
    { number: '1', title: 'Make an Offer', desc: 'Submit your offer on the vehicle you\'re interested in.' },
    { number: '2', title: 'Seller Reviews', desc: 'The seller will review your offer and respond.' },
    { number: '3', title: 'Offer Response', desc: 'You\'ll be notified if your offer is accepted, rejected, or countered.' },
  ];

  return (
    <div className="bg-gray-50 border border-slate-200 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Info className="text-[#D97706]" size={20} />
        <h2 className="text-sm font-bold text-[#0B1E3D]">How It Works?</h2>
      </div>

      {/* Steps Container */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            {/* Step Item */}
            <div className="flex items-start gap-4 flex-1">
              <div className="shrink-0 w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-[#D97706] font-bold text-sm">
                {step.number}
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0B1E3D]">{step.title}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{step.desc}</p>
              </div>
            </div>

            {/* Chevron Divider - Hidden on mobile */}
            {index < steps.length - 1 && (
              <ChevronRight className="hidden md:block text-slate-300 shrink-0" size={20} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default BuyerMyOffersHowWorks;
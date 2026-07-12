
import React from 'react';
import { UserCheck, FileCheck, ShieldCheck, CheckCircle2, Headset, Clock3, Mail, Gavel } from 'lucide-react';

function Step6_SidePanel() {

  const summaryItems = [
    { title: "Account Verification", icon: UserCheck, color: "text-emerald-500", bg: "bg-emerald-50" },
    { title: "Identity Verification", icon: FileCheck, color: "text-indigo-500", bg: "bg-indigo-50" },
    { title: "Payment Verification", icon: ShieldCheck, color: "text-orange-500", bg: "bg-orange-50" },
  ];

  const nextSteps = [
    { text: "We will review your information", sub: "Usually completed within a few minutes", icon: Clock3 },
    { text: "Your account will be activated", sub: "You will receive a confirmation email", icon: Mail },
    { text: "Start bidding on your favorite vehicles", sub: "Explore auctions and place your bids", icon: Gavel },
  ];

  return (
    <section className='w-full py-10'>
      <div className="w-full space-y-6">

        {/* 1. Verification Summary */}
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
          <h2 className="text-lg font-bold text-[#0B1E3D] mb-6">Your Verification Summary</h2>
          <div className="space-y-4">
            {summaryItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${item.bg} ${item.color}`}>
                    <item.icon size={20} />
                  </div>
                  <span className="text-sm font-semibold text-[#0B1E3D]">{item.title}</span>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">Completed</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. What Happens Next */}
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
          <h2 className="text-lg font-bold text-[#0B1E3D] mb-6">What Happens Next?</h2>
          <div className="relative space-y-8 pl-2">
            {/* Connector Line */}
            <div className="absolute left-4.75 top-2 bottom-8 w-0.5 bg-amber-100" />

            {nextSteps.map((step, index) => (
              <div key={index} className="relative flex gap-4">
                <div className="shrink-0 w-6 h-6 rounded-full bg-[#D97706] flex items-center justify-center text-white z-10">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0B1E3D]">{step.text}</h4>
                  <p className="text-xs text-slate-500 mt-1">{step.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Need Help Section */}
        <div className="p-6 rounded-2xl border border-slate-100 bg-white">
          <h4 className="font-bold text-[#0B1E3D] mb-2">Need Help?</h4>
          <p className="text-sm text-slate-500 mb-4">Our support team is here to help you with any questions or concerns.</p>
          <button className="flex items-center gap-2 border border-[#D97706] text-[#D97706] font-semibold py-2 px-4 rounded-lg hover:bg-slate-50 transition">
            <Headset size={18} /> Contact Support
          </button>
        </div>

      </div>
    </section>
  );
}

export default Step6_SidePanel;
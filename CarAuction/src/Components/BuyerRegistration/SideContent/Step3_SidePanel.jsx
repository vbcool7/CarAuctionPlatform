
import React from 'react';
import { UserCheck, ShieldCheck, Gavel, Lock, Headset } from 'lucide-react';

function Step3_SidePanel() {

  const infoPoints = [
    { icon: UserCheck, title: "Know Your Customer (KYC)", desc: "Helps us verify your identity and comply with legal requirements.", color: "text-emerald-500", bg: "bg-emerald-50" },
    { icon: ShieldCheck, title: "Secure Marketplace", desc: "Ensures a safe and trusted environment for all buyers and sellers.", color: "text-indigo-500", bg: "bg-indigo-50" },
    { icon: Gavel, title: "Better Bidding Experience", desc: "Enables us to provide relevant auctions and support.", color: "text-orange-500", bg: "bg-orange-50" },
    { icon: Lock, title: "Data Protection", desc: "Your information is encrypted and never shared with third parties.", color: "text-blue-500", bg: "bg-blue-50" },
  ];

  return (
    <section className='w-full py-10'>
      <div className="w-full space-y-6">

        {/* 1st section */}
        <div className="bg-[#F8FAFC] p-8 rounded-2xl border border-slate-100">
          <h2 className="text-xl font-bold text-[#0B1E3D] mb-6">
            Why we need this information?
          </h2>
          <div className="space-y-6">
            {infoPoints.map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className={`w-12 h-12 ${item.bg} ${item.color} rounded-full flex items-center justify-center shrink-0`}>
                  <item.icon size={22} />
                </div>
                <div>
                  <h4 className="font-bold text-[#0B1E3D]">{item.title}</h4>
                  <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2nd section */}
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

export default Step3_SidePanel;
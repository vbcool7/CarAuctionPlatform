
import React from 'react';
import { ShieldCheck, Gavel, Bell, MessageSquareText, Headset, Bookmark } from 'lucide-react';

function Step2_SidePanel() {

  const benefits = [
    { icon: ShieldCheck, title: "Secure Account", desc: "Verification helps us keep your account safe and secure.", color: "text-emerald-500", bg: "bg-emerald-50" },
    { icon: Gavel, title: "Fair Bidding", desc: "Only verified users can place bids on our platform.", color: "text-indigo-500", bg: "bg-indigo-50" },
    { icon: Bell, title: "Important Updates", desc: "Receive auction updates, notifications and account alerts.", color: "text-blue-500", bg: "bg-blue-50" },
    { icon: MessageSquareText, title: "24/7 Support", desc: "Verified contact helps our support team assist you faster.", color: "text-[#D97706]", bg: "bg-orange-50" },
  ];

  return (
    <section className='w-full py-10'>
      <div className="w-full space-y-4">

        {/* 1st section */}
        <div className="bg-[#F8FAFC] p-8 rounded-2xl border border-slate-100">

          <h2 className="text-xl font-bold text-[#0B1E3D] mb-6">
            Why Verify?
          </h2>
          <div className="space-y-6">
            {benefits.map((item, index) => (
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
          <h4 className="font-bold text-[#0B1E3D] mb-2">
            Having trouble?
            </h4>
          <p className="text-sm text-slate-500 mb-4">
            Contact our support team and we'll help you verify your account.
            </p>
          <button className="flex items-center gap-2 border border-[#D97706] text-[#D97706] font-semibold py-2 px-4 rounded-lg hover:bg-slate-50 transition">
            <Headset size={18} /> Contact Support
          </button>
        </div>

        {/* 3rd section */}
        <div className="flex flex-col items-start gap-4 text-xs p-6 rounded-2xl border border-slate-100 bg-white">
          <p>You can close this page and come back later.</p>
          <button className="flex items-center gap-2 border border-[#D97706] text-[#D97706] font-semibold py-2 px-4 rounded-lg hover:bg-slate-50 transition">
            Save & Continue Later <Bookmark size={14} />
          </button>
        </div>

      </div>
    </section>
  );
}

export default Step2_SidePanel;
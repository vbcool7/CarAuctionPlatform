
import React from 'react';
import { ShieldCheck, Gavel, Award, Headset, Lock } from 'lucide-react';

function Step1_SidePanel() {

  const benefits = [
    { icon: ShieldCheck, title: "Secure Bidding", desc: "Your account is protected with industry-standard security." },
    { icon: Gavel, title: "Easy Bidding", desc: "Bid on thousands of vehicles with just a few clicks." },
    { icon: Award, title: "Verified Platform", desc: "We verify all users to ensure a safe and trusted marketplace." },
    { icon: Headset, title: "24/7 Support", desc: "Our support team is available around the clock to help you." },
  ];

  return (
    <section className='w-full py-10'>
      <div className="w-full space-y-4">

        {/* 1st section */}
        <div className="bg-[#F8FAFC] p-8 rounded-2xl border border-slate-100">
          <h2 className="text-xl font-bold text-[#0B1E3D] mb-6">
            Why Create an Account?
          </h2>

          <div className="space-y-6">
            {benefits.map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 border border-slate-100 shadow-sm">
                  <item.icon className="text-[#D97706]" size={22} />
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
        <div className="p-6 rounded-2xl border border-slate-100">
          <h4 className="font-bold text-[#0B1E3D] mb-4">
            Trusted by Thousands
          </h4>
          <div className="flex -space-x-3 mb-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white overflow-hidden">
                <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
              </div>
            ))}
            <div className="w-10 h-10 rounded-full bg-[#D97706] border-2 border-white flex items-center justify-center text-[10px] font-bold text-white">
              20K+
            </div>
          </div>
          <p className="text-xs text-slate-500">
            Join over 20,000+ verified buyers on BidDrive
          </p>
        </div>

        {/* 3rd section */}
        <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-100">
          <Lock className="text-emerald-500" size={20} />
          <div>
            <p className="text-xs font-bold text-[#0B1E3D]">
              256-bit SSL Encryption
            </p>
            <p className="text-[10px] text-slate-400">
              We protect your data with bank-level security.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Step1_SidePanel;
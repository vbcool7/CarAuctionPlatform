
import React from 'react';
import { ShieldCheck, Lock, Smartphone, Monitor, SmartphoneNfc, LogOut, MoreVertical, Laptop } from 'lucide-react';

const SessionItem = ({ icon, title, details, time }) => (
  <div className="flex justify-between items-start border-t border-slate-50 pt-4">
    <div className="flex gap-3">
      <div className="text-slate-400 mt-1">{icon}</div>
      <div>
        <p className="text-sm font-semibold text-[#0B1E3D]">{title}</p>
        <p className="text-xs text-slate-500 mt-0.5">{details}</p>
        <p className="text-[10px] text-slate-400 mt-0.5">{time}</p>
      </div>
    </div>
    <MoreVertical size={16} className="text-slate-400 cursor-pointer" />
  </div>
);

function BuyerProfileSecuritySidebar() {

  const securityTips = [
    { icon: <Lock size={16} />, text: 'Use a strong password and change it regularly' },
    { icon: <Smartphone size={16} />, text: 'Enable two-factor authentication for added security' },
    { icon: <Lock size={16} />, text: 'Never share your login details with anyone' },
    { icon: <Monitor size={16} />, text: 'Log out from shared or public devices' },
  ];

  return (
    <div className="w-full max-w-sm space-y-6">
      
      {/* 1. Security Tips Section */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <ShieldCheck className="text-[#D97706]" size={20} />
          <h3 className="font-bold text-[#0B1E3D]">Security Tips</h3>
        </div>
        <div className="space-y-4">
          {securityTips.map((tip, i) => (
            <div key={i} className="flex items-start gap-3 text-sm">
              <div className="mt-0.5 text-slate-400">{tip.icon}</div>
              <span className="text-[13px] text-slate-600 leading-tight">{tip.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Active Sessions Section */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Monitor className="text-[#D97706]" size={20} />
          <h3 className="font-bold text-[#0B1E3D]">Active Sessions</h3>
        </div>

        <div className="space-y-6">
          {/* Current Session */}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-green-600">Current Session (This Device)</p>
              <p className="text-xs text-slate-500 mt-1">Dubai, UAE • Chrome on macOS</p>
              <p className="text-[10px] text-slate-400 mt-1">May 20, 2024 - 02:30 PM</p>
            </div>
            <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[10px] font-bold rounded">Current</span>
          </div>

          {/* Other Sessions */}
          <SessionItem icon={<Laptop size={18} />} title="Windows PC" details="Sharjah, UAE • Chrome on Windows" time="May 19, 2024 - 09:45 AM" />
          <SessionItem icon={<SmartphoneNfc size={18} />} title="iPhone 14" details="Dubai, UAE • Safari on iOS" time="May 18, 2024 - 08:15 PM" />
        </div>

        <button className="w-full mt-8 flex items-center justify-center gap-2 text-red-500 border border-red-200 py-2.5 rounded-lg text-[13px] font-semibold hover:bg-red-50 transition-colors">
          <LogOut size={16} /> Log Out All Other Sessions
        </button>
      </div>
    </div>
  );
}

export default BuyerProfileSecuritySidebar;
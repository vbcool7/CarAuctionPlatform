
import React from 'react'
import BuyerContactSupport from '../BuyerSharedComponents/BuyerContactSupport';
import { Mail, Bell, Smartphone, MessageSquare, Moon, HelpCircle } from 'lucide-react';

function BuyerProfileNotificationSidebar() {

  const channels = [
    { icon: <Mail size={20} />, title: 'Email', desc: 'Receive notifications via email.', bg: "bg-purple-100", text: "text-purple-600" },
    { icon: <Bell size={20} />, title: 'Push', desc: 'Receive push notifications on your device.', bg: "bg-red-100", text: "text-red-600" },
    { icon: <Smartphone size={20} />, title: 'SMS', desc: 'Receive text messages on your phone.', bg: "bg-green-100", text: "text-green-600" },
    { icon: <MessageSquare size={20} />, title: 'In-App', desc: 'Receive notifications within the app.', bg: "bg-blue-100", text: "text-blue-600" },
  ];

  return (
    <div className="space-y-6">

      {/* 1st Sec: Delivery Channels */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
        <h3 className="font-bold text-[#0B1E3D] mb-6">Delivery Channels</h3>
        <div className="space-y-5">
          {channels.map((ch, i) => (
            <div 
            key={i} 
            className="flex gap-4">
              <div className={`w-10 h-10  p-2 ${ch.bg} rounded-xl border border-slate-100 ${ch.text}`}>
                {ch.icon}
              </div>
              <div>
                <p className="text-sm font-bold text-[#0B1E3D]">{ch.title}</p>
                <p className="text-xs text-slate-500">{ch.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2nd Sec: Quiet Hours  */}
      <div className="space-y-6">
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Moon className="text-indigo-600" size={20} />
            <h3 className="font-bold text-[#0B1E3D]">Quiet Hours</h3>
          </div>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            Use quiet hours to pause non-essential notifications during your rest time.
          </p>
          <p className="text-sm font-bold text-[#0B1E3D] mb-4">10:00 PM - 7:00 AM (Daily)</p>
          <button className="w-full py-2.5 border border-[#D97706] rounded-lg text-sm font-semibold text-[#D97706] hover:bg-amber-50 transition-colors">
            Edit Quiet Hours
          </button>
        </div>
      </div>

       {/* 3rd Sec */}
      <BuyerContactSupport />
    </div>
  );
}

export default BuyerProfileNotificationSidebar;
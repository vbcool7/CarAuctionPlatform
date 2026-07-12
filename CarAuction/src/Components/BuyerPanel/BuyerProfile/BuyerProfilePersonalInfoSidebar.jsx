
import React from 'react';
import { Lock, CreditCard, MapPin, Bell, ChevronRight } from 'lucide-react';
import { ShieldCheck } from 'lucide-react';

function BuyerProfilePersonalIndoSidebar() {

    const LinkItem = ({ icon, label }) => (
        <div className="flex justify-between items-center cursor-pointer group">
            <div className="flex items-center gap-3 text-slate-600 group-hover:text-[#D97706] transition-colors">
                {icon}
                <span className="text-[13px] font-medium text-[#0B1E3D] group-hover:text-[#D97706]">
                    {label}
                </span>
            </div>
            <ChevronRight size={18} className="text-slate-400 group-hover:text-[#D97706]" />
        </div>
    );

    return (
        <div className="space-y-6">

            {/* 1. Profile Completion Section */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                <h3 className="font-bold text-[#0B1E3D] mb-4">Profile Completion</h3>
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full border-4 border-slate-100 flex items-center justify-center">
                        <span className="text-xs font-bold text-[#0B1E3D]">80%</span>
                    </div>
                    <p className="text-xs text-slate-500">Your profile is 80% complete. Complete your profile to get the best experience.</p>
                </div>
                <div className="space-y-3">
                    {['Personal Information', 'Verify Email', 'Add Phone Number', 'Add Payment Method', 'Add Address'].map((item, i) => (
                        <div key={i} className="flex justify-between items-center text-sm">
                            <span className={`text-[13px] ${i === 4 ? 'text-slate-400' : 'text-slate-700'}`}>{item}</span>
                            <span className={i === 4 ? 'text-slate-400' : 'text-green-600'}>✓</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. Quick Links Section */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                <h3 className="font-bold text-[#0B1E3D] mb-4">Quick Links</h3>
                <div className="space-y-4">
                    {/* Links with Icons */}
                    <LinkItem icon={<Lock size={18} />} label="Change Password" />
                    <LinkItem icon={<CreditCard size={18} />} label="Manage Payment Methods" />
                    <LinkItem icon={<MapPin size={18} />} label="Manage Addresses" />
                    <LinkItem icon={<Bell size={18} />} label="Notification Preferences" />
                </div>
            </div>

            {/* 3. Account Status Section */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                {/* Shield Icon aur Heading */}
                <div className="flex items-center gap-2 mb-">
                    <ShieldCheck className="text-green-600" size={20} />
                    <h3 className="font-bold text-[#0B1E3D]">Account Status</h3>
                </div>

                <div className="ml-7 flex items-center gap-2 text-green-600 font-semibold text-sm mb-2">
                    <span>Verified Account</span>
                </div>
                <p className="ml-7 text-xs text-slate-500 leading-relaxed">
                    Your account is verified. You have full access to all features.
                </p>
                <p className="ml-7 text-[10px] text-slate-400 mt-3">Last login: May 20, 2024 10:30 AM GST</p>
            </div>

        </div>
    );
}

export default BuyerProfilePersonalIndoSidebar;

import React from 'react';
import { Link } from 'react-router-dom';
import { Headset, ShieldCheck } from 'lucide-react';

function RegistrationNavbar() {
    return (
        <div className="w-full bg-white border-b border-gray-100 py-5">
            <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-6 flex items-center justify-between">

                {/* Left: Logo Section */}
                <div className="flex items-center gap-2">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 cursor-pointer">
                        <div className="bg-[#D97706] p-0.5 md:p-1 rounded-lg">🚗</div>
                        <span className="text-xl md:text-2xl font-bold text-[#0B1E3D]">Bid<span className="text-[#D97706]">Drive</span></span>
                    </Link>
                </div>

                {/* Right: Support & Security */}
                <div className="flex items-center gap-6 md:gap-8">

                    {/* Contact Support */}
                    <div className="flex items-center gap-2 text-[#D97706] cursor-pointer">
                        <Headset size={20} />
                        <div className="hidden md:block">
                            <p className="text-[10px] text-gray-400 font-medium uppercase">Need Help?</p>
                            <p className="text-xs font-bold">Contact Support</p>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-8 w-px bg-gray-200" />

                    {/* Secure & Safe */}
                    <div className="flex items-center gap-2 text-emerald-600">
                        <ShieldCheck size={20} />
                        <div className="hidden md:block">
                            <p className="text-xs font-bold text-gray-900">Secure & Safe</p>
                            <p className="text-[10px] text-gray-400">Your data is encrypted</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default RegistrationNavbar;
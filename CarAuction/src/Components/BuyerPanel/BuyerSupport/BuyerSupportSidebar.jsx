
import React from 'react';
import { Headset, MessageCircle, Mail, Phone, ChevronRight, ExternalLink, ShieldCheck } from 'lucide-react';

function BuyerSupportSidebar({ supportPage, setSupportPage }) {

    const helpLinks = [
        "How to Place a Bid",
        "Payment & Invoices",
        "Shipping & Pickup",
        "Refunds & Returns",
        "Account & Verification"
    ];

    return (
        <div className="space-y-6 w-full max-w-sm">

            {/* 1. Contact Support Section */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <Headset className="text-[#D97706]" size={24} />
                    <h3 className="font-bold text-[#0B1E3D] text-lg">Contact Support</h3>
                </div>

                <p className="text-sm text-slate-500 mb-6">Our support team is available <br /> Monday – Friday 9:00 AM – 6:00 PM GST</p>

                <div className="space-y-5">
                    <div className="flex items-center gap-3 text-sm">
                        <MessageCircle size={18} className="text-[#D97706]" />
                        <span className="font-medium text-[#0B1E3D]">Live Chat</span>
                        <span className="ml-auto bg-green-50 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Online</span>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                        <Mail size={18} className="text-[#D97706]" />
                        <div className="flex flex-col">
                            <span className="font-medium text-[#0B1E3D]">Email Support</span>
                            <span className="text-slate-500 text-xs">support@autobid.ae</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                        <Phone size={18} className="text-[#D97706]" />
                        <div className="flex flex-col">
                            <span className="font-medium text-[#0B1E3D]">+971 50 123 4567</span>
                            <span className="text-slate-500 text-xs">Mon - Fri, 9:00 AM – 6:00 PM GST</span>
                        </div>
                    </div>
                </div>

                {supportPage !== 'request-call' && (
                    <button
                        onClick={() => setSupportPage('request-call')}
                        className="w-full mt-6 border border-[#D97706] text-[#D97706] bg-transparent 
                   hover:bg-amber-50 hover:border-[#B45309] hover:text-[#B45309] 
                   py-2.5 rounded-lg font-bold text-sm 
                   transition-all duration-300 ease-in-out 
                   hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Request a Call
                    </button>
                )}

            </div>

            {/* 2. Help Center Section */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-[#0B1E3D] mb-4">Help Center</h3>
                <p className="text-sm text-slate-500 mb-4">Browse our guides and get quick answers.</p>

                <div className="space-y-1 mb-6">
                    {helpLinks.map((link, i) => (
                        <div key={i} className="flex justify-between items-center py-2 text-sm text-[#0B1E3D] hover:text-[#D97706] cursor-pointer group">
                            <span>{link}</span>
                            <ChevronRight size={16} className="text-slate-400 group-hover:text-[#D97706]" />
                        </div>
                    ))}
                </div>

                <button
                    className="w-full flex items-center justify-center gap-2 bg-slate-50 border border-slate-200 py-2.5 rounded-lg font-bold text-sm text-[#0B1E3D] 
             transition-all duration-200 ease-in-out
             hover:bg-slate-100 hover:border-slate-300 hover:shadow-sm
             active:scale-[0.98] active:bg-slate-200 active:shadow-inner"
                >
                    Visit Help Center <ExternalLink size={14} />
                </button>
            </div>

            {/* 3. Satisfaction Banner */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex items-start gap-4">
                <div className="p-2 bg-blue-50 rounded-full">
                    <ShieldCheck className="text-[#D97706]" size={24} />
                </div>
                <div>
                    <h4 className="font-bold text-[#0B1E3D] text-sm">Your satisfaction is our priority!</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">We're committed to providing you the best support experience.</p>
                </div>
            </div>
        </div>
    );
}

export default BuyerSupportSidebar;
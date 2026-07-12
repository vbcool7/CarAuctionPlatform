
import React from 'react';
import BuyerContactSupport from '../BuyerSharedComponents/BuyerContactSupport';
import VISAiconimg from '../../../assets/Images/VISAiconimg.png';
import MasterCardiconImg from '../../../assets/Images/MasterCardiconImg.png';
import { CreditCard, Headphones, ShieldCheck, Download, Apple, Landmark } from 'lucide-react';

function BuyerPaymentsSummary() {
    return (
        <div className="w-full max-w-sm space-y-6">

            {/* 1. Payment Summary Section */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <CreditCard className="text-[#D97706]" size={20} />
                    <h2 className="text-lg font-bold text-[#0B1E3D]">Payment Summary</h2>
                </div>

                <div className="space-y-4 mb-6">
                    {[
                        { label: 'Total Payments', value: '8' },
                        { label: 'Completed Payments', value: '5' },
                        { label: 'Pending Payments', value: '2' },
                        { label: 'Refunds', value: '1' },
                    ].map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm font-medium text-[#0B1E3D]">
                            <span className="text-slate-600">{item.label}</span>
                            <span className="font-bold">{item.value}</span>
                        </div>
                    ))}
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-100">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-600 font-medium">Total Paid</span>
                        <span className="font-bold text-emerald-600">AED 520,000</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-600 font-medium">Total Pending</span>
                        <span className="font-bold text-orange-600">AED 153,000</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-600 font-medium">Total Refunded</span>
                        <span className="font-bold text-purple-600">AED 10,000</span>
                    </div>
                </div>
            </div>

            {/* 2. Need Help Section */}
            <BuyerContactSupport />

            {/* 3. Secure Payments Section */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <ShieldCheck className="text-[#D97706]" size={20} />
                    <h2 className="text-sm font-bold text-[#0B1E3D]">Secure Payments</h2>
                </div>
                <p className="text-xs text-slate-500 mb-4">All payments are secure and encrypted.</p>
                <div className="flex items-center gap-3 text-slate-400">
                    {/* Images */}
                    <img src={VISAiconimg} alt="Visa" className="h-5" />
                    <img src={MasterCardiconImg} alt="MasterCard" className="h-5" />

                    {/* Icons */}
                    <div className="flex items-center gap-1 text-xs font-semibold">
                        <Apple size={16} /> Apple Pay
                    </div>
                    <div className="flex items-center gap-1 text-xs font-semibold">
                        <Landmark size={14} /> Bank Transfer
                    </div>
                </div>
            </div>

            {/* 4. Download Statement Section */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <Download className="text-[#D97706]" size={20} />
                    <h2 className="text-sm font-bold text-[#0B1E3D]">Download Statement</h2>
                </div>
                <p className="text-xs text-slate-500 mb-4">Download your payment history statement.</p>
                <button className="w-full py-2.5 px-4 border border-[#D97706] text-[#D97706] rounded-lg text-sm font-bold hover:bg-amber-50 transition-colors flex items-center justify-center gap-2">
                    <Download size={16} />
                    Download Statement
                </button>
            </div>

        </div>
    );
}

export default BuyerPaymentsSummary;
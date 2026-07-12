
import React from 'react';
import VISAiconimg from '../../../assets/Images/VISAiconimg.png'
import { ShieldCheck, Lock, Headphones, CreditCard, Landmark, Monitor } from 'lucide-react';

function BuyerWonAuctionsDetailPenPayment({ vehicle }) {
    return (
        <div className="w-full">

            {/* Top Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Payment Summary */}
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                    <h2 className="text-lg font-bold text-[#0B1E3D] mb-6">Payment Summary</h2>
                    <div className="space-y-4">
                        {[
                            { label: 'Winning Bid', value: 'AED 120,000' },
                            { label: 'Buyer Premium (5%)', value: 'AED 6,000' },
                            { label: 'VAT (5% on Buyer Premium)', value: 'AED 300' },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="flex justify-between text-[#0B1E3D]">
                                <span className='text-[14px] text-gray-600 font-semibold'>{item.label}</span>
                                <span className="text-[15px] text-gray-800 font-medium">{item.value}</span>
                            </div>
                        ))}

                        <div className="border-t border-slate-100 pt-4 space-y-4">
                            <div className="flex justify-between text-[#0B1E3D]">
                                <span className='text-[14px] text-gray-600 font-semibold'>Subtotal</span>
                                <span className="text-[15px] text-gray-800 font-medium">AED 126,300</span>
                            </div>

                            <div className="flex justify-between text-[#0B1E3D]">
                                <span className='text-[14px] text-gray-600 font-semibold'>Shipping & Handling</span>
                                <span className="text-[15px] text-gray-800 font-medium">AED 2,500</span>
                            </div>
                        </div>

                        <div className="border-t border-slate-300 pt-4 flex justify-between items-center text-xl font-bold text-[#0B1E3D]">
                            <span className='text-[20px] text-slate-900 font-bold'>Total Amount Due</span>
                            <span className='text-[20px] text-slate-900 font-bold'>AED 128,800</span>
                        </div>
                    </div>
                </div>

                {/* Payment Instructions */}
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                    <h2 className="text-lg font-bold text-[#0B1E3D] mb-6">Payment Instructions</h2>
                    <div className="space-y-6">
                        {[
                            { step: '1', title: 'Make Payment', desc: 'Complete the payment using one of the available payment methods.' },
                            { step: '2', title: 'Payment Confirmation', desc: 'Once your payment is received, you will get a confirmation email.' },
                            { step: '3', title: 'Vehicle Ready for Pickup', desc: 'After payment confirmation, the vehicle will be ready as per the schedule.' },
                        ].map((item, i) => (
                            <div key={i} className="flex gap-4">
                                <div className="shrink-0 w-8 h-8 rounded-full bg-amber-50 text-[#D97706] flex items-center justify-center font-bold text-sm">
                                    {item.step}
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-[#0B1E3D]">{item.title}</h3>
                                    <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Section - Full Width & Clean Layout */}
            <div className="w-full mt-8">
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                    <h2 className="text-sm font-bold text-[#0B1E3D] mb-5 uppercase tracking-wide">
                        Accepted Payment Methods
                    </h2>

                    <div className="flex flex-wrap gap-4">
                        {/* VISA */}
                        <div className="flex-1 min-w-30 flex items-center justify-center gap-3 border border-slate-200 rounded-xl p-4 hover:border-[#D97706] transition-colors">
                            <img src={VISAiconimg} alt="VISA" className="h-6 w-auto object-contain" />
                            <span className="text-xs font-semibold text-[#0B1E3D]">VISA</span>
                        </div>

                        {/* Bank Transfer (With BG) */}
                        <div className="flex-1 min-w-30 flex items-center justify-center gap-3 border border-slate-200 bg-slate-50 rounded-xl p-4 transition-colors">
                            <div className="p-1.5 bg-[#0B1E3D] rounded-md">
                                <Landmark className="text-white" size={16} />
                            </div>
                            <span className="text-xs font-semibold text-[#0B1E3D]">Bank Transfer</span>
                        </div>

                        {/* Online (With BG) */}
                        <div className="flex-1 min-w-30 flex items-center justify-center gap-3 border border-slate-200 bg-green-50 rounded-xl p-4 transition-colors">
                            <div className="p-1.5 bg-green-600 rounded-md">
                                <Monitor className="text-white" size={16} />
                            </div>
                            <span className="text-xs font-semibold text-[#0B1E3D]">Online</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BuyerWonAuctionsDetailPenPayment;

import React from 'react';
import { TrendingUp, Bell, Briefcase, FileText, Headphones } from 'lucide-react';
import BuyerContactSupport from '../BuyerSharedComponents/BuyerContactSupport';

function BuyerLostAuctionsImprovingCard() {
    const tips = [
        { icon: Bell, title: 'Set Higher Alerts', desc: 'Get notified for similar vehicles.' },
        { icon: Briefcase, title: 'Research Market Value', desc: 'Know the right price range.' },
        { icon: FileText, title: 'Bid at the Right Time', desc: 'Last-minute bids can increase your chances.' },
    ];

    return (
        <div className="w-full max-w-sm space-y-6">

            {/* Top Card: Keep Improving */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="text-[#0B1E3D]" size={24} />
                    <h2 className="text-lg font-bold text-[#0B1E3D]">Keep Improving!</h2>
                </div>
                <p className="text-sm text-slate-500 mb-6">
                    You're getting there! Here are some tips to help you win more auctions.
                </p>

                <div className="space-y-6">
                    {tips.map((tip, index) => (
                        <div key={index} className="flex gap-4">
                            <div className="shrink-0 w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                                <tip.icon className="text-[#D97706]" size={20} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-[#0B1E3D]">{tip.title}</h3>
                                <p className="text-xs text-slate-500 mt-0.5">{tip.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Card: Need Help */}
            <BuyerContactSupport />
        </div>
    );
}

export default BuyerLostAuctionsImprovingCard;
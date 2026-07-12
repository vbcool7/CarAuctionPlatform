
import React from 'react';
import { BarChart3, TrendingUp, Briefcase, FileText, Headphones } from 'lucide-react';
import BuyerContactSupport from '../BuyerSharedComponents/BuyerContactSupport';

function BuyerMyOffersSummary() {
    return (
        <div className="w-full max-w-sm space-y-6">

            {/* 1. Offers Summary Section */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <BarChart3 className="text-[#0B1E3D]" size={20} />
                    <h2 className="text-lg font-bold text-[#0B1E3D]">Offers Summary</h2>
                </div>
                <div className="space-y-4">
                    {[
                        { label: 'Total Offers', value: '9' },
                        { label: 'Active Offers', value: '3' },
                        { label: 'Accepted Offers', value: '1' },
                        { label: 'Rejected Offers', value: '1' },
                        { label: 'Expired Offers', value: '5' },
                    ].map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm font-medium text-[#0B1E3D]">
                            <span>{item.label}</span>
                            <span className="font-bold">{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. Tips Section */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <TrendingUp className="text-[#0B1E3D]" size={20} />
                    <h2 className="text-lg font-bold text-[#0B1E3D]">Tips to Make Better Offers</h2>
                </div>
                <div className="space-y-6">
                    {[
                        { icon: Briefcase, title: 'Research Market Value', desc: 'Know the fair market price before making an offer.' },
                        { icon: FileText, title: 'Be Competitive', desc: 'Make a fair offer that stands out to the seller.' },
                        { icon: FileText, title: 'Act Fast', desc: 'Quick offers have a higher chance of acceptance.' },
                    ].map((tip, idx) => (
                        <div key={idx} className="flex gap-4">
                            <div className="shrink-0 w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                                <tip.icon className="text-[#D97706]" size={20} />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-[#0B1E3D]">{tip.title}</h3>
                                <p className="text-xs text-slate-500 mt-0.5">{tip.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. Need Help Section */}
            <BuyerContactSupport />

        </div>
    );
}

export default BuyerMyOffersSummary;
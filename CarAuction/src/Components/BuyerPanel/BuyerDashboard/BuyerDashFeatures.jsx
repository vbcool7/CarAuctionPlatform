
import React from 'react';
import { ShieldCheck, BadgeCheck, Headset, Award } from 'lucide-react';

function BuyerDashFeatures() {

    const features = [
        {
            icon: <ShieldCheck size={28} />,
            title: "Secure & Safe",
            desc: "100% secure bidding and payments"
        },
        {
            icon: <BadgeCheck size={28} />,
            title: "Verified Vehicles",
            desc: "All vehicles are inspected and verified"
        },
        {
            icon: <Headset size={28} />,
            title: "24/7 Support",
            desc: "Our team is always here to help you"
        },
        {
            icon: <Award size={28} />,
            title: "Best Deals",
            desc: "Competitive prices on quality vehicles"
        }
    ];

    return (
        <div className="bg-white p-3 md:p-6 rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {features.map((feature, index) => (
                <div
                    key={index}
                    className="flex items-start gap-3 md:gap-4">

                    <div className="p-2 md:p-3 rounded-2xl bg-amber-50 text-[#D97706]">
                        {feature.icon}
                    </div>

                    {/* Text Content */}
                    <div>
                        <h3 className="font-bold text-[#0B1E3D] text-sm md:text-md">{feature.title}</h3>
                        <p className="text-[13px] md:text-sm text-slate-500 mt-1 leading-relaxed">
                            {feature.desc}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default BuyerDashFeatures;
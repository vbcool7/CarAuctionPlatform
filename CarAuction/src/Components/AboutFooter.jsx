import React from 'react';
import { Lock, UserCheck, CreditCard, ClipboardCheck } from 'lucide-react';

function AboutFooter() {

    const securityFeatures = [
        { icon: Lock, title: "256-bit", desc: "Encryption" },
        { icon: UserCheck, title: "Verified", desc: "Sellers & Buyers" },
        { icon: CreditCard, title: "Secure Payment", desc: "Gateway" },
        { icon: ClipboardCheck, title: "Strict Vehicle", desc: "Inspections" },
    ];

    return (
        <section className="w-full py-16 bg-[#0B1E3D]">
            <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-6">

                {/* Container */}
                <div className="rounded-3xl flex flex-col lg:flex-row items-center justify-between gap-5">

                    {/* Left Text */}
                    <div className="max-w-sm">
                        <h2 className="text-2xl font-bold text-white mb-3">Built on Trust & Security</h2>
                        <p className="text-white/70 text-sm leading-relaxed">
                            We use advanced technology and industry best practices to ensure a safe and secure experience for all our users.
                        </p>
                    </div>

                    {/* Right Security Features */}
                    <div className="flex flex-wrap justify-center gap-4">
                        {securityFeatures.map((feature, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md text-[#D97706] hover:scale-105 hover:shadow-xl transition-all duration-300">
                                    <feature.icon size={24} />
                                </div>
                                <div className="text-left">
                                    <h4 className="font-bold text-white text-sm">{feature.title}</h4>
                                    <p className="text-white/70 text-xs font-medium">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}

export default AboutFooter;
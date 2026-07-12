
import React from 'react';
import { FileEdit, Search, Megaphone, Gavel, CheckCircle2 } from 'lucide-react';

function SellCarSteps() {

    const steps = [
        {
            id: 1,
            icon: FileEdit,
            title: "Submit Details",
            desc: "Fill out the form with your car details and upload photos.",
            bg: "bg-blue-50",
            color: "text-blue-600"
        },
        {
            id: 2,
            icon: Search,
            title: "Vehicle Inspection",
            desc: "Our experts inspect your car and verify its condition.",
            bg: "bg-green-50",
            color: "text-green-600"
        },
        {
            id: 3,
            icon: Megaphone,
            title: "Go Live for Auction",
            desc: "Your car is listed in our auction and promoted to thousands of buyers.",
            bg: "bg-purple-50",
            color: "text-purple-600"
        },
        {
            id: 4,
            icon: Gavel,
            title: "Receive Bids",
            desc: "Buyers place bids and compete to offer you the best price.",
            bg: "bg-orange-50",
            color: "text-orange-600"
        },
        {
            id: 5,
            icon: CheckCircle2,
            title: "Sell & Get Paid",
            desc: "Accept the best offer, complete the sale, and get paid securely.",
            bg: "bg-emerald-50",
            color: "text-emerald-600"
        },
    ];

    return (
        <section className="w-full py-16 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-6">

                {/* Header */}
                <h2 className="text-3xl font-bold text-center text-[#0B1E3D] mb-16">
                    How It Works - <span className="text-[#D97706]">5 Simple Steps</span>
                </h2>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
                    {steps.map((step) => (
                        <div key={step.id} className="flex flex-col items-center text-center group">
                           
                            <div className="relative mb-10 mt-4">

                                <div className={`w-20 h-20 rounded-full ${step.bg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                                    <step.icon size={32} className={`${step.color}`} />
                                </div>

                                <div className={`absolute -top-3 -left-3 w-8 h-8 ${step.bg} ${step.color} text-sm font-bold rounded-full flex items-center justify-center border-4 border-white shadow-md z-20`}>
                                    {step.id}
                                </div>
                            </div>

                            <h3 className="font-bold text-[#0B1E3D] mb-2">{step.title}</h3>
                            <p className="text-xs text-slate-500 leading-relaxed px-2">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default SellCarSteps
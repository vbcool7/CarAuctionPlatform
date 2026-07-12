
import React from 'react';
import { Headset, Gavel, Award, CreditCard, ArrowRight, ChevronRight } from 'lucide-react';

const steps = [
    { icon: Headset, title: 'Join Live Auction', desc: 'Browse and join any live auction.' },
    { icon: Gavel, title: 'Place Your Bid', desc: 'Bid in real-time and compete with others.' },
    { icon: Award, title: 'Highest Bid Wins', desc: 'If you\'re the highest bidder, you win.' },
    { icon: CreditCard, title: 'Complete Payment', desc: 'Make payment and we\'ll handle the rest.' },
];

function BuyerLiveAuctionsHowWorks() {
    return (
        <div className="w-full p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
            <h2 className="text-lg md:text-xl font-bold mb-2 md:mb-8 text-[#0B1E3D] ">
                How Live Auctions Work?
            </h2>

            {/* Main feature bar container */}
            <div className="flex flex-wrap lg:flex-nowrap items-center justify-between mb-4">
                {steps.map((step, index) => (
                    <React.Fragment key={index}>
                        <div className="flex flex-col items-center text-center flex-1 min-w-37.5">
                            <div className="mt-2 md:mt-0 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-blue-50 mb-3">
                                <step.icon className="w-6 h-6 md:w-7 md:h-7 text-[#0B1E3D]" />
                            </div>
                            <h3 className="font-bold text-sm mb-1 text-[#0B1E3D]">{step.title}</h3>
                            <p className="text-xs text-gray-500 leading-tight px-2">{step.desc}</p>
                        </div>

                        {/* Conditional separator visible only on large screens */}
                        {index < steps.length - 1 && (
                            <ChevronRight className="w-6 h-6 text-gray-300 hidden lg:block" />
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* btn */}
            <div className="flex justify-center border-t border-gray-100 md:pt-6">
                <button className="px-6 py-2 flex items-center gap-2 rounded-lg text-[#D97706] border font-semibold hover:bg-gray-50 transition-colors">
                    <span className="hidden md:inline">Learn More About Live Auctions</span>
                    <span className="md:hidden text-sm">Learn More</span>

                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

export default BuyerLiveAuctionsHowWorks;
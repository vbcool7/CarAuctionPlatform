
import React from 'react';
import { FaUserPlus, FaShieldAlt, FaSearch, FaGavel, FaTrophy, FaCreditCard } from 'react-icons/fa';
import { HiOutlineArrowNarrowRight } from "react-icons/hi";

const steps = [
    { id: "1", title: "Register", desc: "Create your free account in minutes", icon: <FaUserPlus /> },
    { id: "2", title: "Verify Account", desc: "Verify your identity for secure bidding", icon: <FaShieldAlt /> },
    { id: "3", title: "Browse Auctions", desc: "Find the perfect car and check details", icon: <FaSearch /> },
    { id: "4", title: "Place Bids", desc: "Bid in real-time and compete to win", icon: <FaGavel /> },
    { id: "5", title: "Win Auction", desc: "Congratulations! You are the highest bidder", icon: <FaTrophy /> },
    { id: "6", title: "Complete Payment", desc: "Secure payment and vehicle delivery", icon: <FaCreditCard /> },
];

function HowItWorks() {
    return (
        <section className='w-full bg-white px-4 sm:px-5 lg:px-6 md:py-16 py-10'>
            <div className='max-w-6xl mx-auto'>

                {/* heading */}
                <div className="mb-8 md:mb-12 flex flex-col items-center text-center">
                    <div className="mb-3 h-1 w-20 rounded-full bg-[#F59E0B] md:h-1.5"></div>
                    <h2 className="text-2xl md:text-4xl font-bold text-gray-800">How It Works</h2>
                </div>

                {/* Replace the flex container with this grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8">
                    {steps.map((step, index) => (
                        <div key={step.id} className="flex flex-col items-center text-center">

                            {/* Icon Container */}
                            <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-orange-50 text-[#D97706] text-4xl mb-4 border border-orange-100">
                                {step.icon}
                                <span className="absolute -top-1 -left-1 bg-[#D97706] text-white text-[10px] w-6 h-6 rounded-full flex items-center justify-center font-bold shadow-md">
                                    {step.id}
                                </span>
                            </div>

                            <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed max-w-62.5">
                                {step.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default HowItWorks;
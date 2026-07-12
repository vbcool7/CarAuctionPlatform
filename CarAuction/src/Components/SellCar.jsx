
import React from 'react';
import Breadcrumbs from '../Components/Breadcrumbs';
import SellCarMainImg from '../assets/Images/SellCarMainImg.png';
import { CheckCircle2, Lock, ArrowRight } from 'lucide-react';

function SellCar() {
    const breadcrumbItems = [
        { label: 'Home', path: '/' },
        { label: 'Sell Your Car', path: '/sell-your-car' }
    ];

    const benefits = [
        "Reach Thousands of Verified Buyers",
        "Competitive Bidding Gets You the Best Price",
        "Fast, Secure & Hassle-Free Process",
        "No Hidden Fees - 100% Transparent"
    ];

    return (
        <section className="relative overflow-hidden  flex items-center">

            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src={SellCarMainImg}
                    alt="Sell Your Car"
                    className="w-full h-full object-cover object-[60%_center]"
                />

                {/* Content Visibility Overlay */}
                <div className="absolute inset-0 bg-linear-to-r from-white via-white/70 to-white/20" />
            </div>

            {/* Main Content */}
            <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-5 lg:px-6 w-full py-4">

                <div className="flex flex-col lg:flex-row items-center justify-between gap-12">

                    {/* Left Content */}
                    <div className="w-full lg:max-w-xl">

                        

                        <h1 className="text-5xl font-extrabold leading-tight">
                            <span className="text-[#0B1E3D] block">
                                Sell Your Car
                            </span>

                            <span className="text-[#D97706] block">
                                The Smart Way
                            </span>
                        </h1>

                        <p className="mt-4 text-slate-700 text-[17px]">
                            Get the best value for your car by selling to thousands
                            of verified buyers on BidDrive. Fast, secure and
                            completely hassle-free.
                        </p>

                        {/* Benefits */}
                        <div className="space-y-3 mt-4">

                            {benefits.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-3"
                                >
                                    <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                                        <CheckCircle2
                                            size={16}
                                            className="text-[#D97706]"
                                        />
                                    </div>

                                    <p className="text-slate-700 font-medium">
                                        {item}
                                    </p>
                                </div>
                            ))}

                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-8 mt-10">

                            <div>
                                <h3 className="text-4xl font-bold text-[#0B1E3D]">
                                    20K+
                                </h3>

                                <p className="text-slate-500 text-sm mt-1">
                                    Cars Sold
                                </p>
                            </div>

                            <div className="w-px h-12 bg-slate-300" />

                            <div>
                                <h3 className="text-4xl font-bold text-[#0B1E3D]">
                                    4.8/5
                                </h3>

                                <p className="text-slate-500 text-sm mt-1">
                                    Seller Rating
                                </p>
                            </div>

                        </div>
                    </div>

                    {/* Right Form */}
                    <div className="w-full max-w-md ml-auto">

                        <div className="bg-white/95 backdrop-blur-md border border-white shadow-2xl rounded-3xl p-7">

                            <h2 className="text-2xl font-bold text-[#0B1E3D] pb-2">
                                Get Started — It's Free!
                            </h2>

                            {/* <p className="text-slate-500 text-sm mt-2 mb-6">
                                Fill out the form and we'll help you get the
                                highest value for your vehicle.
                            </p> */}

                            <form className="space-y-3">

                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    className="w-full h-12 px-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#D97706]"
                                />

                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    className="w-full h-12 px-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#D97706]"
                                />

                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    className="w-full h-12 px-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#D97706]"
                                />

                                <select className="w-full h-12 px-4 border border-slate-200 rounded-xl text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#D97706]">
                                    <option>Select Make</option>
                                </select>

                                <select className="w-full h-12 px-4 border border-slate-200 rounded-xl text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#D97706]">
                                    <option>Select Model</option>
                                </select>

                                <select className="w-full h-12 px-4 border border-slate-200 rounded-xl text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#D97706]">
                                    <option>Select Year</option>
                                </select>

                                <input
                                    type="text"
                                    placeholder="Mileage (KM)"
                                    className="w-full h-12 px-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#D97706]"
                                />

                                <button
                                    type="submit"
                                    className="w-full h-12 bg-[#D97706] hover:bg-[#c46b05] text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    Get My Free Quote
                                    <ArrowRight size={18} />
                                </button>

                            </form>

                            <div className="flex items-center justify-center gap-2 mt-5 text-xs text-slate-500">
                                <Lock size={12} />
                                <span>Your information is safe and secure</span>
                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </section>
    );
}

export default SellCar;
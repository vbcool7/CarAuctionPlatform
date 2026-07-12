
import React from 'react';
import { Search } from 'lucide-react';
import CarImg from '../assets/Images/CarImg.png';

function FAQsTopBanner() {
    return (
        <section className="w-full bg-linear-to-br from-slate-50 to-white overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-6 py-">
                <div className="grid lg:grid-cols-2 gap-10 items-center">

                    {/* Left Content */}
                    <div>

                        <h1 className="text-4xl md:text-5xl font-bold text-[#0B1E3D] leading-tight">
                            Frequently Asked
                            <span className="block text-[#D97706]">
                                Questions
                            </span>
                        </h1>

                        <p className="mt-5 text-slate-600 text-lg max-w-xl leading-relaxed">
                            Find answers to the most common questions about
                            buying, bidding, payments, auctions and account
                            management on BidDrive.
                        </p>

                        {/* Search */}
                        <div className="mt-8 relative max-w-2xl">
                            <input
                                type="text"
                                placeholder="Search for questions, topics or keywords..."
                                className="w-full h-14 pl-5 pr-14 rounded-2xl border border-slate-200 bg-white text-slate-700 outline-none focus:border-[#D97706] focus:ring-4 focus:ring-orange-100 transition-all"
                            />

                            <button
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-[#0B1E3D] hover:bg-[#142b52] flex items-center justify-center transition-all"
                            >
                                <Search
                                    size={18}
                                    className="text-white"
                                />
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap gap-6 mt-8">
                            <div>
                                <h3 className="text-2xl font-bold text-[#0B1E3D]">
                                    100+
                                </h3>
                                <p className="text-sm text-slate-500">
                                    FAQs Available
                                </p>
                            </div>

                            <div>
                                <h3 className="text-2xl font-bold text-[#0B1E3D]">
                                    24/7
                                </h3>
                                <p className="text-sm text-slate-500">
                                    Customer Support
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="relative flex justify-center lg:justify-end">

                        <img
                            src={CarImg}
                            alt="FAQ Banner"
                            className="relative z-10 w-full max-w-md lg:max-w-lg object-contain "
                        />
                    </div>

                </div>
            </div>
        </section>
    );
}

export default FAQsTopBanner;
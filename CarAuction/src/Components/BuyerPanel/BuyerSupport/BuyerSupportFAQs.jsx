
import React, { useState } from 'react';
import { faqData } from '../../Data';
import { Gavel, CreditCard, Truck, User, RotateCcw, MoreHorizontal, ArrowLeft, Search, ChevronDown, ChevronUp, Plus, Minus, } from 'lucide-react';

const topics = [
    { title: 'Bidding & Auctions', count: '12 Questions', icon: Gavel },
    { title: 'Payments & Fees', count: '10 Questions', icon: CreditCard },
    { title: 'Shipping & Pickup', count: '8 Questions', icon: Truck },
    { title: 'Account & Profile', count: '9 Questions', icon: User },
    { title: 'Returns & Refunds', count: '7 Questions', icon: RotateCcw },
    { title: 'Other Topics', count: '6 Questions', icon: MoreHorizontal },
];

function BuyerSupportFAQs({ setSupportPage }) {

    const [openIndex, setOpenIndex] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const currentCategoryData = faqData[activeIndex];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="w-full space-y-8 mb-6">

            {/* search */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search FAQs"
                        className="w-full py-2.5 pl-4 pr-12 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
                    />
                    <Search className="absolute right-4 top-2.5 text-slate-400" size={20} />
                </div>
            </div>

            {/* cards */}
            <div>
                <h2 className="text-lg font-bold text-[#0B1E3D] mb-4">
                    Browse By Category
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {topics.map((topic, index) => {

                        const Icon = topic.icon;
                        const categoryData = faqData.find(cat => cat.category === topic.title);
                        const count = categoryData ? categoryData.questions.length : 0;

                        return (
                            <div
                                key={index}
                                onClick={() => {
                                setActiveIndex(index);
                                setOpenIndex(null);
                            }}
                                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer 
                                    ${activeIndex === index
                                        ? 'bg-amber-50/30 border-[#D97706] shadow-sm'
                                        : 'bg-white border-slate-100 hover:border-amber-200 hover:shadow-sm'
                                    }`}
                            >
                                <div className={`p-3 rounded-full mb-3 ${activeIndex === index ? 'bg-amber-50' : 'bg-slate-50'}`}>
                                    <Icon size={24} className={activeIndex === index ? 'text-[#D97706]' : 'text-slate-600'} />
                                </div>
                                <h3 className={`font-bold text-sm mb-1 ${activeIndex === index ? 'text-[#D97706]' : 'text-[#0B1E3D]'}`}>
                                    {topic.title}
                                </h3>
                                <p className="text-xs text-slate-500">
                                    {count} Questions
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* faqs */}
            <div>
                <div className="py-5 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-[#0B1E3D]">
                        {currentCategoryData.category}
                    </h2>
                </div>

                {currentCategoryData.questions.map((item, index) => (
                    <div
                        key={index}
                        className="border-b border-[#DFE0E1]">

                        <div
                            onClick={() => toggleFAQ(index)}
                            className={`flex justify-between items-center px-4 py-5 cursor-pointer transition-all duration-300
                           ${openIndex === index ? "bg-slate-50" : "hover:bg-gray-50"}`}
                        >
                            {/* Left Side: +/- Icon + Question */}
                            <div className="flex items-center gap-4">
                                <div className={`p-1 rounded-full border ${openIndex === index ? 'border-[#D97706]' : 'border-slate-300'}`}>
                                    {openIndex === index ? (
                                        <Minus size={14} className="text-[#D97706]" />
                                    ) : (
                                        <Plus size={14} className="text-slate-500" />
                                    )}
                                </div>
                                <h1 className={`text-[16px] font-semibold transition-colors ${openIndex === index ? "text-[#D97706]" : "text-[#1F2933]"}`}>
                                    {item.q}
                                </h1>
                            </div>

                            {/* Right Side: Arrow Icon */}
                            <div className="text-slate-400">
                                {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </div>
                        </div>

                        {/* Answer (Screenshot ke hisaab se plain background) */}
                        {openIndex === index && (
                            <div className="px-14 py-4 text-[#555] text-[15px] leading-relaxed animate-in slide-in-from-top-2">
                                {item.a}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default BuyerSupportFAQs;
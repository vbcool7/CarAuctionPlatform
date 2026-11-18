
import React, { useState, useMemo } from 'react';
import CarImg from '../assets/Images/CarImg.png';
import { ShieldCheck, Headphones, BadgeHelp, Clock3, Search, Headset, MessageSquare } from "lucide-react";
import { LayoutGrid, Gavel, CreditCard, Truck, User, RefreshCw, FileText, Ellipsis, Car, DollarSign } from "lucide-react";
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa6";
import { useGetPublicFaqs } from '../hook/useFaq';

const supportItems = [
    {
        icon: BadgeHelp,
        title: "Find Quick Answers",
        description: "Browse our FAQs to get instant solutions.",
    },
    {
        icon: Headphones,
        title: "Still Need Help?",
        description: "Our support team is here to assist you.",
    },
    {
        icon: ShieldCheck,
        title: "Safe & Secure",
        description: "We're committed to providing a safe bidding experience.",
    },
    {
        icon: Clock3,
        title: "24/7 Support",
        description: "Reach out anytime via chat, email or phone.",
    },
];

// backend ke FAQ_ICON_KEYS -> lucide icon
const ICON_MAP = {
    'gavel': Gavel,
    'credit-card': CreditCard,
    'truck': Truck,
    'user': User,
    'refresh': RefreshCw,
    'file': FileText,
    'shield': ShieldCheck,
    'car': Car,
    'dollar': DollarSign,
    'message': MessageSquare,
    'help': BadgeHelp,
    'more': Ellipsis,
};

const countLabel = (n) => `${n} ${n === 1 ? 'Question' : 'Questions'}`;

function FAQs() {

    const { data, isLoading, isError, refetch } = useGetPublicFaqs();

    const [selectedCat, setSelectedCat] = useState('all');
    const [openId, setOpenId] = useState(null);
    const [searchInput, setSearchInput] = useState('');

    const apiCategories = data?.categories || [];
    const allFaqs = data?.faqs || [];
    const total = data?.total || 0;

    const allCategories = useMemo(() => [
        { id: 'all', title: 'All Categories', icon: LayoutGrid, count: total },
        ...apiCategories.map((c) => ({
            id: String(c._id),
            title: c.name,
            icon: ICON_MAP[c.icon] || BadgeHelp,
            count: c.count,
        })),
    ], [apiCategories, total]);

    const query = searchInput.trim().toLowerCase();
    const isSearching = query.length > 0;

    // if search then find in all cat
    const getFilteredFaqs = useMemo(() => {
        if (isSearching) {
            return allFaqs.filter((f) =>
                f.question.toLowerCase().includes(query) || f.answer.toLowerCase().includes(query)
            );
        }
        if (selectedCat === 'all') return allFaqs;
        return allFaqs.filter((f) => String(f.categoryId) === selectedCat);
    }, [allFaqs, selectedCat, query, isSearching]);

    // selected cat
    const handleSelectCat = (id) => {
        setSelectedCat(id);
        setSearchInput('');
        setOpenId(null);
    };

    // search
    const handleSearch = (value) => {
        setSearchInput(value);
        setOpenId(null);
    };

    // toggle
    const toggleFAQ = (id) => {
        setOpenId(openId === id ? null : id);
    };

    return (
        <section>

            {/* top section */}
            <div className="w-full bg-linear-to-br from-slate-50 to-white overflow-hidden">
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
                                Find answers to the most common questions about buying, bidding, payments, auctions and account management on BidDrive.
                            </p>

                            {/* Search */}
                            <div className="mt-8 relative max-w-2xl">
                                <input
                                    type="text"
                                    value={searchInput}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    placeholder="Search for questions, topics or keywords..."
                                    className="w-full h-14 pl-5 pr-14 rounded-2xl border border-slate-200 bg-white text-slate-700 outline-none focus:border-[#D97706] focus:ring-4 focus:ring-orange-100 transition-all"
                                />

                                <button
                                    type="button"
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
                                        {isLoading ? '...' : total}
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
            </div>

            {/* features */}
            <div className="py-12">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="border border-slate-200 rounded-3xl bg-white shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
                            {supportItems.map((item, index) => {
                                const Icon = item.icon;

                                return (
                                    <div
                                        key={index}
                                        className={`flex items-start gap-4 p-6 ${index !== supportItems.length - 1
                                            ? "xl:border-r border-slate-100"
                                            : ""
                                            }`}
                                    >
                                        {/* Icon */}
                                        <div className="shrink-0">
                                            <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center">
                                                <Icon
                                                    size={26}
                                                    className="text-[#D97706]"
                                                    strokeWidth={2}
                                                />
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div>
                                            <h3 className="font-semibold text-[#0B1E3D] text-[17px]">
                                                {item.title}
                                            </h3>

                                            <p className="mt-2 text-sm leading-relaxed text-slate-500">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* faqs */}
            <div className='bg-gray-50/30'>
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 px-4 sm:px-5 lg:px-6 py-10">

                    {/* left section */}
                    <div className='w-full md:w-1/3 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible no-scrollbar md:sticky md:top-24 h-fit pb-4 md:pb-0'>

                        <h3 className="hidden md:block text-md font-bold text-gray-700 uppercase tracking-widest mb-6 ml-4">
                            Browse All Categories
                        </h3>

                        {isLoading ? (
                            [1, 2, 3, 4, 5].map((n) => (
                                <div key={n} className="h-18 w-full min-w-45 rounded-2xl bg-slate-100 animate-pulse" />
                            ))
                        ) : (
                            allCategories.map((tab) => {
                                const Icon = tab.icon;
                                const isSelected = !isSearching && selectedCat === tab.id;

                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => handleSelectCat(tab.id)}
                                        className={`flex items-center gap-4 w-full p-4 rounded-2xl transition-all duration-300 border ${isSelected
                                            ? 'bg-[#D97706]/3 border-[#D97706]'
                                            : 'bg-transparent border-transparent hover:bg-slate-50'
                                            }`}
                                    >
                                        {/* Icon Container */}
                                        <span className={`text-xl ${isSelected ? 'text-[#D97706]' : 'text-slate-400'}`}>
                                            <Icon />
                                        </span>

                                        {/* Title & Count */}
                                        <div className="text-left">
                                            <h4 className={`font-bold ${isSelected ? 'text-[#D97706]' : 'text-slate-700'}`}>
                                                {tab.title}
                                            </h4>
                                            <p className="text-xs text-slate-500">{countLabel(tab.count)}</p>
                                        </div>

                                        {isSelected && (
                                            <div className="ml-auto text-[#D97706]">
                                                →
                                            </div>
                                        )}
                                    </button>
                                );
                            })
                        )}
                    </div>

                    {/* right section */}
                    <div className='w-full md:w-2/3  py-2 md:py-6'>

                        {isSearching && !isLoading && (
                            <p className="text-sm text-slate-500 px-2 md:px-5">
                                {countLabel(getFilteredFaqs.length)} found for "{searchInput.trim()}"
                            </p>
                        )}

                        {/* faqs section */}
                        <div className='my-4 md:my-8 space-y-2 md:space-y-4'>
                            {isLoading ? (
                                [1, 2, 3, 4, 5].map((n) => (
                                    <div key={n} className="h-14 rounded-xl bg-slate-100 animate-pulse" />
                                ))
                            ) : isError ? (
                                <div className="text-center py-12 md:py-16 bg-white rounded-3xl border border-gray-100 shadow-sm px-4">
                                    <h2 className="text-lg md:text-xl font-bold text-gray-500 mb-1">Could not load FAQs</h2>
                                    <p className="text-gray-400 text-sm max-w-xs mx-auto">Please check your connection and try again.</p>
                                    <button
                                        onClick={() => refetch()}
                                        className="mt-4 px-5 py-2 rounded-xl bg-[#0B1E3D] text-white text-sm font-semibold hover:bg-[#142b52] transition"
                                    >
                                        Try again
                                    </button>
                                </div>
                            ) : getFilteredFaqs.length > 0 ? (
                                getFilteredFaqs.map((item) => (
                                    <div
                                        key={item._id}
                                        className='border-b border-gray-100 last:border-none'
                                    >
                                        {/* question section */}
                                        <div
                                            onClick={() => toggleFAQ(item._id)}
                                            className={`flex justify-between items-center px-2 md:px-5 py-4 cursor-pointer transition-all duration-300 group rounded-xl
                                                ${openId === item._id ? "bg-pink-50/30" : "hover:bg-gray-50"}`}
                                        >

                                            <h2 className={`text-[15px] md:text-[18px] font-semibold pr-4 transition-colors duration-300
                                                ${openId === item._id ? "text-[#D97706]" : "text-[#1F2933]"}`}>
                                                {item.question}
                                            </h2>

                                            <div className="shrink-0">
                                                {openId === item._id
                                                    ? (<FaMinus className="text-sm md:text-lg text-[#D97706]" />)
                                                    : (<FaPlus className="text-sm md:text-lg text-gray-400 group-hover:text-[#1F2933]" />)}
                                            </div>
                                        </div>

                                        {/* answer section */}
                                        {openId === item._id && (
                                            <div className='overflow-hidden transition-all duration-300'>

                                                <div className="text-[#555] text-[14px] md:text-[16px] px-4 md:px-6 py-4 bg-gray-50/50 leading-relaxed rounded-b-xl whitespace-pre-line">
                                                    {item.answer}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 md:py-16 bg-white rounded-3xl border border-gray-100 shadow-sm px-4">
                                    <h2 className="text-lg md:text-xl font-bold text-gray-400 mb-1">
                                        {isSearching ? 'No results found' : 'No FAQs yet'}
                                    </h2>
                                    <p className="text-gray-400 text-xs max-w-xs mx-auto">
                                        {isSearching
                                            ? 'Try different keywords, or browse a category.'
                                            : 'Please check back soon.'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* footer */}
            <section className="w-full py-8 bg-[#0B1E3D] ">
                <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-6">

                    <div className="py-4 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">

                        {/* Left Content */}
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                                <Headset size={32} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-1">Can't find what you're looking for?</h2>
                                <p className="text-slate-300 text-sm">
                                    Our support team is ready to help you with any other questions you may have.
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            <button className="px-6 py-3 rounded-xl font-semibold border border-white text-white hover:bg-white/10 transition flex items-center justify-center gap-2">
                                <Headset size={18} />
                                Contact Support
                            </button>

                            <button className="bg-[#D97706] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#b86405] transition flex items-center justify-center gap-2">
                                <MessageSquare size={18} />
                                Live Chat
                            </button>
                        </div>

                    </div>
                </div>
            </section>
        </section>
    );
}

export default FAQs;
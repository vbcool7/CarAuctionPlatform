
import React, { useState } from 'react';
import {
    LayoutGrid,
    Gavel,
    CreditCard,
    Truck,
    User,
    RefreshCw,
    FileText,
    Ellipsis
} from "lucide-react";
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa6";

function FAQs() {

    const [selectedCat, setSelectedCat] = useState(0);
    const [openIndex, setOpenIndex] = useState(null);

    const allCategories = [
        {
            id: 1,
            title: "All Categories",
            icon: LayoutGrid,
            count: "48 Questions"
        },
        {
            id: 2,
            title: "Bidding & Auctions",
            icon: Gavel,
            count: "12 Questions"
        },
        {
            id: 3,
            title: "Payments & Fees",
            icon: CreditCard,
            count: "10 Questions"
        },
        {
            id: 4,
            title: "Shipping & Pickup",
            icon: Truck,
            count: "8 Questions"
        },
        {
            id: 5,
            title: "Account & Profile",
            icon: User,
            count: "9 Questions"
        },
        {
            id: 6,
            title: "Returns & Refunds",
            icon: RefreshCw,
            count: "7 Questions"
        },
        {
            id: 7,
            title: "Invoices & Documents",
            icon: FileText,
            count: "5 Questions"
        },
        {
            id: 8,
            title: "Other Topics",
            icon: Ellipsis,
            count: "6 Questions"
        },
    ];

    const allFaqs = [
        // 2. Bidding & Auctions
        { categoryId: 2, q: "How do I place a bid?", a: "Go to the car listing and enter your amount in the bid box." },
        { categoryId: 2, q: "What is a proxy bid?", a: "It allows the system to bid automatically up to your maximum limit." },
        { categoryId: 2, q: "Can I cancel a bid?", a: "Bids are binding and cannot be canceled once placed." },
        { categoryId: 2, q: "How do I know if I won?", a: "You will receive an email and notification in your dashboard." },
        { categoryId: 2, q: "What is the reserve price?", a: "It is the minimum price the seller is willing to accept." },
        { categoryId: 2, q: "Are inspections allowed?", a: "Yes, you can schedule an inspection before bidding." },

        // 3. Payment & Fee
        { categoryId: 3, q: "What are the payment methods?", a: "We accept Credit/Debit cards, Bank Transfer, and Wire transfers." },
        { categoryId: 3, q: "Are there any hidden fees?", a: "No, all fees are clearly listed in the invoice." },
        { categoryId: 3, q: "When is the payment due?", a: "Payment must be cleared within 48 hours of winning the auction." },
        { categoryId: 3, q: "Can I pay in installments?", a: "Currently, we do not offer installment plans." },
        { categoryId: 3, q: "Is VAT included?", a: "VAT is calculated based on local regulations at checkout." },
        { categoryId: 3, q: "Is online payment secure?", a: "Yes, we use encrypted payment gateways for security." },

        // 4. Shipping and Pickup
        { categoryId: 4, q: "How do I schedule pickup?", a: "Use the 'Schedule Pickup' button in your won items section." },
        { categoryId: 4, q: "Do you offer international shipping?", a: "Yes, we ship to major international ports." },
        { categoryId: 4, q: "What documents are needed for pickup?", a: "Please bring your ID and the winning notification." },
        { categoryId: 4, q: "Can someone else pick up for me?", a: "Yes, with a signed authorization letter from you." },
        { categoryId: 4, q: "What are the storage charges?", a: "Storage fees apply after 7 days of non-pickup." },
        { categoryId: 4, q: "Is vehicle insurance included?", a: "Transport insurance is optional during checkout." },

        // 5. Account & Profile
        { categoryId: 5, q: "How do I reset my password?", a: "Click 'Forgot Password' on the login page." },
        { categoryId: 5, q: "Can I change my email?", a: "Yes, go to Account Settings > Profile." },
        { categoryId: 5, q: "How do I verify my account?", a: "Upload your Emirates ID or Passport in the verification tab." },
        { categoryId: 5, q: "Is my data private?", a: "We strictly adhere to data protection laws." },
        { categoryId: 5, q: "How to delete my account?", a: "Contact support for permanent account closure." },
        { categoryId: 5, q: "Can I have multiple accounts?", a: "No, one verified user per account." },

        // 6. Returns & Refunds
        { categoryId: 6, q: "What is the return policy?", a: "All auction sales are 'as-is' and generally non-returnable." },
        { categoryId: 6, q: "How do I request a refund?", a: "Contact support if the car condition is misrepresented." },
        { categoryId: 6, q: "How long for a refund?", a: "Refunds typically take 7-10 working days." },
        { categoryId: 6, q: "What if the car is damaged?", a: "Report it immediately upon delivery with photos." },
        { categoryId: 6, q: "Are deposits refundable?", a: "Deposits are refundable if you haven't won any bid." },
        { categoryId: 6, q: "Can I exchange a vehicle?", a: "Exchanges are not supported in auction sales." },

        // 7. Invoices & Documents
        { categoryId: 7, q: "Where can I download invoices?", a: "In your Dashboard under 'My Invoices'." },
        { categoryId: 7, q: "How do I get the car registration?", a: "We provide the ownership transfer documents post-payment." },
        { categoryId: 7, q: "Is the invoice tax-deductible?", a: "Please consult your tax advisor." },
        { categoryId: 7, q: "Can I get a copy of the contract?", a: "Contracts are available upon request." },
        { categoryId: 7, q: "Are documents digital?", a: "Most are digital, but originals will be handed over." },
        { categoryId: 7, q: "How to correct invoice info?", a: "Contact support before the final payment." },

        // 8. Other Topics
        { categoryId: 8, q: "How to contact support?", a: "Use Live Chat, email, or call our hotline." },
        { categoryId: 8, q: "Are you open on weekends?", a: "Yes, we are open as per our contact page timings." },
        { categoryId: 8, q: "Do you have a mobile app?", a: "Yes, available on iOS and Android stores." },
        { categoryId: 8, q: "How to become a partner?", a: "Visit the 'Partner with Us' page at the footer." },
        { categoryId: 8, q: "Where is your office?", a: "Our HQ is in Business Bay, Dubai." },
        { categoryId: 8, q: "How to report a bug?", a: "Use the 'Feedback' link in the footer." }
    ];

    const getFilteredFaqs = allFaqs.filter((faq) => {
        if (selectedCat === 0) return true;

        return faq.categoryId === allCategories[selectedCat].id;
    });

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className='bg-gray-50/30'>
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 px-4 sm:px-5 lg:px-6 py-10">

                {/* left section */}
                <div className='w-full md:w-1/3 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible no-scrollbar md:sticky md:top-24 h-fit pb-4 md:pb-0'>

                    <h3 className="hidden md:block text-md font-bold text-gray-700 uppercase tracking-widest mb-6 ml-4">
                        Browse All Categories
                    </h3>

                    {allCategories.map((tab, index) => {
                        const Icon = tab.icon;
                        const isSelected = selectedCat === index;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => setSelectedCat(index)}
                                className={`flex items-center gap-4 w-full p-4 rounded-2xl transition-all duration-300 border ${isSelected
                                    ? 'bg-[#D97706]/3 border-[#D97706]'
                                    : 'bg-transparent border-transparent hover:bg-slate-50'
                                    }`}
                            >
                                {/* Icon Container - Active hone par theme color */}
                                <span className={`text-xl ${isSelected ? 'text-[#D97706]' : 'text-slate-400'}`}>
                                    <Icon />
                                </span>

                                {/* Title & Count */}
                                <div className="text-left">
                                    <h4 className={`font-bold ${isSelected ? 'text-[#D97706]' : 'text-slate-700'}`}>
                                        {tab.title}
                                    </h4>
                                    <p className="text-xs text-slate-500">{tab.count}</p>
                                </div>

                                {isSelected && (
                                    <div className="ml-auto text-[#D97706]">
                                        →
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* right section */}
                <div className='w-full md:w-2/3  py-2 md:py-6'>

                    {/* faqs section */}
                    <div className='my-4 md:my-8 space-y-2 md:space-y-4'>
                        {getFilteredFaqs.length > 0 ? (
                            getFilteredFaqs.map((item, index) => (
                                <div
                                    key={index}
                                    className='border-b border-gray-100 last:border-none'
                                >
                                    {/* question section */}
                                    <div
                                        onClick={() => toggleFAQ(index)}
                                        className={`flex justify-between items-center px-2 md:px-5 py-4 cursor-pointer transition-all duration-300 group rounded-xl
                                    ${openIndex === index ? "bg-pink-50/30" : "hover:bg-gray-50"}`}
                                    >

                                        <h1 className={`text-[15px] md:text-[18px] font-semibold pr-4 transition-colors duration-300
                                            ${openIndex === index ? "text-[#D97706]" : "text-[#1F2933]"}`}>
                                            {item.q}
                                        </h1>

                                        <div className="shrink-0">
                                            {openIndex === index
                                                ? (<FaMinus className="text-sm md:text-lg text-[#D97706]" />)
                                                : (<FaPlus className="text-sm md:text-lg text-gray-400 group-hover:text-[#1F2933]" />)}
                                        </div>
                                    </div>

                                    {/* answer section */}
                                    {openIndex === index && (
                                        <div className='overflow-hidden transition-all duration-300'>

                                            <div className="text-[#555] text-[14px] md:text-[16px] px-4 md:px-6 py-4 bg-gray-50/50 leading-relaxed rounded-b-xl">
                                                {item.a}
                                            </div>
                                        </div>
                                    )}

                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 md:py-16 bg-white rounded-3xl border border-gray-100 shadow-sm px-4">
                                <h2 className="text-lg md:text-xl font-bold text-gray-400 mb-1">Not Found</h2>
                                <p className="text-gray-400 text-xs max-w-xs mx-auto">Could not found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default FAQs;
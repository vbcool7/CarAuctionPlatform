
import React, { useState } from 'react';
import Breadcrumbs from '../Components/Breadcrumbs';
import ContactMainImg from '../assets/Images/ContactMainImg.png';
import { Headset, Clock, Mail, MessageCircle, User, Phone, BookOpen, MessageSquare, MapPin, ParkingCircle, Lock, ChevronDown, ChevronUp } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';
import { useNavigate } from 'react-router-dom';

const contactMethods = [
    { icon: Phone, title: "Call Us", info: "+971 4 123 4567", sub: "Mon - Sun: 9:00 AM - 8:00 PM (GST)" },
    { icon: Mail, title: "Email Us", info: "support@autobid.ae", sub: "We reply within 24 hours" },
    { icon: MessageSquare, title: "Live Chat", info: "Chat with our support team", sub: "Available 9:00 AM - 8:00 PM (GST)" },
    { icon: SiWhatsapp, title: "WhatsApp", info: "+971 50 123 4567", sub: "Mon - Sun: 9:00 AM - 8:00 PM (GST)" },
];

const faqs = [
    { q: "How do I register on AutoBid?", a: "Click on the 'Sign Up' button on the top right, provide your details, and verify your account via email." },
    { q: "How do I place a bid?", a: "Once registered and logged in, go to the car listing page and enter your bid amount in the bidding field." },
    { q: "What payment methods do you accept?", a: "We accept all major credit/debit cards, bank transfers, and secure digital wallet payments." },
    { q: "How do I sell my car on AutoBid?", a: "Visit the 'Sell Your Car' page, fill in your vehicle details, and our team will get in touch for an inspection." },
    { q: "How long does delivery take?", a: "Delivery typically takes 3-5 business days depending on your location after the final payment is cleared." },
    { q: "How can I contact support?", a: "You can reach us via live chat, email at support@autobid.ae, or by calling our support helpline." }
];

function ContactUs() {

    const navigate = useNavigate();
    const [openIndex, setOpenIndex] = useState(null);

    const breadcrumbItems = [
        { label: 'Home', path: '/' },
        { label: 'Contact Us', path: '/contact-us' }
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section>

            {/* top banner */}
            <div className='relative w-full flex items-center overflow-hidden'>
                <div className='absolute inset-0 z-0'>
                    <img
                        src={ContactMainImg}
                        alt="Contact Us BidDrive"
                        className='w-full h-full object-cover'
                    />
                </div>

                {/* Content Overlay */}
                <div className='relative z-10 max-w-6xl mx-auto px-4 sm:px-5 lg:px-6 w-full py-3'>
                    <div className='flex flex-col lg:flex-row items-center justify-between gap-12'>

                        {/* Content */}
                        <div className='flex-1'>
                            <div className='mb-6'>
                                <Breadcrumbs items={breadcrumbItems} />
                            </div>

                            <h1 className="text-5xl font-bold text-[#0B1E3D] mb-4">Contact Us</h1>
                            <h3 className="text-xl font-semibold text-[#D97706] mb-4">We're here to help!</h3>
                            <p className="text-slate-700 text-md mb-8 max-w-lg">
                                Have a question or need assistance? Our team is ready to help you with anything you need.
                            </p>

                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-[#0B1E3D]/10 rounded-xl text-[#D97706]">
                                        <Headset size={28} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#0B1E3D]">Quick Support</h4>
                                        <p className="text-slate-600 text-sm">Get fast and helpful responses from our team.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-[#0B1E3D]/10 rounded-xl text-[#D97706]">
                                        <Clock size={28} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#0B1E3D]">We're Here for You</h4>
                                        <p className="text-slate-600 text-sm">Available 7 days a week to assist you.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* features */}
            <div className="w-full py-12">
                <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-white p-8 rounded-2xl border border-slate-100 shadow-md">
                        {contactMethods.map((method, index) => (
                            <div key={index} className={`flex items-start gap-4 ${index !== contactMethods.length - 1 ? 'lg:border-r border-slate-100' : ''}`}>
                                <div className="w-12 h-12 rounded-full bg-[#0B1E3D]/5 flex items-center justify-center text-[#0B1E3D] shrink-0">
                                    <method.icon size={22} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#0B1E3D] mb-1">{method.title}</h4>
                                    <p className="text-[#D97706] font-semibold text-sm mb-1">{method.info}</p>
                                    <p className="text-slate-500 text-xs">{method.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* form */}
            <div className="w-full py-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-6 flex flex-col md:flex-row gap-8">

                    {/* Form Section */}
                    <div className='w-full md:w-1/2 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm'>
                        <h2 className="text-2xl font-bold text-[#0B1E3D] mb-6">
                            Send Us a Message
                        </h2>

                        <form className="space-y-4">

                            <div className="relative">
                                <User className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input type="text" placeholder="Full Name" className="w-full pl-10 p-2.5 border border-gray-400 rounded-lg focus:ring-2 focus:ring-[#D97706] outline-none" />
                            </div>

                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input type="email" placeholder="Email Address" className="w-full pl-10 p-2.5 border border-gray-400 rounded-lg focus:ring-2 focus:ring-[#D97706] outline-none" />
                            </div>

                            <div className="relative">
                                <Phone className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input type="tel" placeholder="Phone Number" className="w-full pl-10 p-2.5 border border-gray-400 rounded-lg focus:ring-2 focus:ring-[#D97706] outline-none" />
                            </div>

                            <div className="relative">
                                <BookOpen className="absolute left-3 top-3 text-slate-400" size={18} />
                                <select className="w-full pl-10 p-2.5 border border-gray-400 rounded-lg text-slate-500 focus:ring-2 focus:ring-[#D97706] outline-none">
                                    <option>Subject</option>
                                </select>
                            </div>

                            <div className="relative">
                                <MessageSquare className="absolute left-3 top-3 text-slate-400" size={18} />
                                <textarea placeholder="Your Message" rows="4" className="w-full pl-10 p-2.5 border border-gray-400 rounded-lg focus:ring-2 focus:ring-[#D97706] outline-none resize-none"></textarea>
                            </div>

                            <label className="flex items-center gap-2 text-sm text-slate-600">
                                <input type="checkbox" className="accent-[#D97706]" /> I agree to the <span className="text-[#D97706] font-semibold">Privacy Policy</span>
                            </label>

                            <button className="w-full bg-[#0B1E3D] text-white py-3 rounded-lg font-semibold hover:bg-[#0B1E3D]/90 transition flex items-center justify-center gap-2">
                                Send Message →
                            </button>
                        </form>

                        <p className="flex items-center justify-center gap-2 text-xs text-slate-400 mt-4">
                            <Lock size={12} /> Your information is safe with us and will never be shared.
                        </p>
                    </div>

                    {/* Map & Office Info Section */}
                    <div className='w-full md:w-1/2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col'>
                        <h2 className="text-2xl font-bold text-[#0B1E3D] p-8 pb-4">Our Headquarters</h2>
                        <div className="h-64 bg-slate-200 w-full relative">
                            {/* Replace this div with your actual Map component */}
                            <div className="absolute inset-0 flex items-center justify-center text-slate-500">Google Maps Placeholder</div>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="flex gap-4">
                                <MapPin className="text-[#D97706] shrink-0" size={24} />
                                <div>
                                    <h4 className="font-bold text-[#0B1E3D]">AutoBid Car Auctions FZ-LLC</h4>
                                    <p className="text-slate-600 text-sm">Business Bay, Dubai, United Arab Emirates</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <ParkingCircle className="text-[#D97706] shrink-0" size={24} />
                                <div>
                                    <h4 className="font-bold text-[#0B1E3D]">Free Parking Available</h4>
                                    <p className="text-slate-600 text-sm">Visitor parking is available at our office.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* faqs */}
            <div className="w-full py-16 bg-slate-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-6">

                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-[#0B1E3D]">Frequently Asked Questions</h2>

                        <button
                            onClick={() => navigate('/faq')}
                            className="text-[#0B1E3D] font-semibold flex items-center gap-1 hover:text-[#D97706] transition">
                            View All FAQs →
                        </button>
                    </div>

                    {/* FAQ Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full flex justify-between items-center text-[#0B1E3D] font-semibold"
                                >
                                    {faq.q}
                                    {openIndex === index ? <ChevronUp size={20} className="text-[#D97706]" /> : <ChevronDown size={20} />}
                                </button>

                                {openIndex === index && (
                                    <p className="mt-3 text-slate-600 text-sm border-t border-slate-100 pt-3">
                                        {faq.a}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* footer */}
            <div className="w-full py-8 bg-[#0B1E3D]">
                <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-6">

                    {/* Main Footer Container */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">

                        {/* Left Content */}
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                                <Headset size={32} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-1">Still Need Help?</h2>
                                <p className="text-slate-300 text-sm">
                                    Our support team is ready to assist you with any questions.
                                </p>
                            </div>
                        </div>

                        {/* Action Button */}
                        <button className="bg-[#D97706] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#b86405] transition flex items-center justify-center gap-2 w-full md:w-auto">
                            <MessageSquare size={18} />
                            Start Live Chat
                        </button>

                    </div>
                </div>
            </div>

        </section>
    );
}

export default ContactUs;
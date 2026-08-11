
import React from 'react';
import Breadcrumbs from './Breadcrumbs';
import SellCarMainImg from '../assets/Images/SellCarMainImg.png';
import { CheckCircle2, Lock, ArrowRight, Globe, TrendingUp, ShieldCheck, Zap, FileText } from 'lucide-react';
import { FileEdit, Search, Megaphone, Gavel, Star } from 'lucide-react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

const benefits = [
    "Reach Thousands of Verified Buyers",
    "Competitive Bidding Gets You the Best Price",
    "Fast, Secure & Hassle-Free Process",
    "No Hidden Fees - 100% Transparent"
];

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

const features = [
    {
        icon: Globe,
        title: "Wide Network",
        desc: "Your car is seen by thousands of serious, verified buyers across the UAE and beyond.",
        bg: "bg-blue-50",
        color: "text-blue-600"
    },
    {
        icon: TrendingUp,
        title: "Best Market Price",
        desc: "Competitive bidding ensures you get the highest possible price for your car.",
        bg: "bg-green-50",
        color: "text-green-600"
    },
    {
        icon: ShieldCheck,
        title: "Safe & Secure",
        desc: "We verify buyers and handle everything securely so you can sell with peace of mind.",
        bg: "bg-purple-50",
        color: "text-purple-600"
    },
    {
        icon: Zap,
        title: "Fast & Convenient",
        desc: "From inspection to payment, the entire process is quick, easy, and hassle-free.",
        bg: "bg-orange-50",
        color: "text-orange-600"
    },
    {
        icon: FileText,
        title: "No Hidden Fees",
        desc: "100% transparent process with no hidden charges or surprises.",
        bg: "bg-emerald-50",
        color: "text-emerald-600"
    },
];

const testimonials = [
    { name: "Ahmed R.", location: "Dubai, UAE", quote: "AutoBid made selling my car so easy! I received multiple offers and sold it for a great price." },
    { name: "Sarah K.", location: "Abu Dhabi, UAE", quote: "Professional team, smooth inspection and quick payment. Highly recommended!" },
    { name: "Omar H.", location: "Sharjah, UAE", quote: "Got a better price than I expected. The whole process was transparent and stress-free." },
    { name: "Fatima M.", location: "Ajman, UAE", quote: "Excellent platform! I sold my car within 3 days at the best market value." },
];

function SellYourCar() {
    const breadcrumbItems = [
        { label: 'Home', path: '/' },
        { label: 'Sell Your Car', path: '/sell-your-car' }
    ];

    // slider pagination style
    <style jsx global>{`
        .custom-pagination .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #CBD5E1;
          transition: all 0.3s ease;
        }
        .custom-pagination .swiper-pagination-bullet-active {
          background: #D97706 !important;
          width: 30px;
          border-radius: 6px;
        }
      `}
    </style>

    return (
        <section>
            {/* top section */}
            <div className="relative overflow-hidden  flex items-center">

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
            </div>

            <div className="w-full bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-6">

                    {/* steps */}
                    <div className='py-16'>
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

                    {/* features */}
                    <div className='py-16'>
                        {/* Header */}
                        <h2 className="text-3xl font-bold text-center text-[#0B1E3D] mb-16">
                            Why Sell Your Car on BidDrive?
                        </h2>

                        {/* Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                            {features.map((item, index) => (
                                <div key={index} className="flex flex-col items-center text-center p-4">

                                    <div className={`w-20 h-20 rounded-full ${item.bg} flex items-center justify-center mb-6`}>
                                        <item.icon size={32} className={item.color} />
                                    </div>

                                    <h3 className="font-bold text-[#0B1E3D] mb-2">{item.title}</h3>
                                    <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* why sell */}
                    <div className='py-16'>
                        <h2 className="text-3xl font-bold text-center text-[#0B1E3D] mb-16">
                            Why Sell Your Car on BidDrive?
                        </h2>

                        <Swiper
                            modules={[Autoplay, Pagination]}
                            spaceBetween={30}
                            slidesPerView={1}
                            loop={true}
                            grabCursor={true}
                            autoplay={{ delay: 4000, disableOnInteraction: false }}
                            pagination={{ clickable: true, el: '.custom-pagination' }}
                            breakpoints={{
                                768: { slidesPerView: 2 },
                                1024: { slidesPerView: 3 },
                            }}
                            className="pb-20"
                        >
                            {testimonials.map((t, index) => (
                                <SwiperSlide key={index} className="h-auto">

                                    {/* Premium Card Design */}
                                    <div className="group h-full p-8 bg-slate-50 rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(11,30,61,0.1)] transition-all duration-500 hover:-translate-y-2">
                                        <div className="flex gap-1 mb-6 text-[#F59E0B]">
                                            {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="#F59E0B" strokeWidth={0} />)}
                                        </div>

                                        <p className="text-slate-700 text-lg mb-8 leading-relaxed italic group-hover:text-[#0B1E3D] transition-colors">
                                            "{t.quote}"
                                        </p>

                                        <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                                            <div className="w-12 h-12 rounded-full bg-[#D97706]/10 flex items-center justify-center text-[#D97706] font-bold text-lg border border-[#D97706]/20">
                                                {t.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-[#0B1E3D]">{t.name}</h4>
                                                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{t.location}</p>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        <div className="custom-pagination flex justify-center gap-3 mt-6" />
                    </div>
                </div>
            </div>

            {/* footer */}
            <div className="w-full py-12 bg-[#0B1E3D]">
                <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-6">

                    {/* Container: Glassmorphism effect */}
                    <div className=" flex flex-col md:flex-row items-center justify-between gap-8 ">

                        {/* Left Content */}
                        <div className="text-center md:text-left">
                            <h2 className="text-3xl font-bold text-white mb-3">Ready to Sell Your Car?</h2>
                            <p className="text-slate-300 text-sm max-w-md">
                                Join thousands of satisfied sellers on AutoBid and get the best price for your car today.
                            </p>
                        </div>

                        {/* Right Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                            <button className="bg-[#D97706] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#b86405] transition-all duration-300 shadow-lg shadow-[#D97706]/20">
                                Get My Free Quote →
                            </button>
                            <button className="text-white px-8 py-3 rounded-xl font-semibold border-2 border-white/20 hover:bg-white/10 transition-all duration-300">
                                How It Works →
                            </button>
                        </div>

                    </div>
                </div>
            </div>

        </section>
    );
}

export default SellYourCar;

import React from 'react';
import AboutMainImg from '../assets/Images/AboutMainImg.png';
import AboutImg from '../assets/Images/AboutImg.png';
import { IoIosArrowRoundForward } from "react-icons/io";
import Breadcrumbs from '../Components/Breadcrumbs';
import { Car, Users, Gavel, Globe, ShieldCheck } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { Target, Eye, Gem, CheckCircle2 } from 'lucide-react';
import { Flag, TrendingUp, Trophy } from 'lucide-react';
import { FaLinkedinIn } from "react-icons/fa";
import { Lock, UserCheck, CreditCard, ClipboardCheck } from 'lucide-react';

const stats = [
    { icon: Car, count: "50K+", label: "Vehicles Sold", bg: "bg-blue-50", color: "text-blue-600" },
    { icon: Users, count: "25K+", label: "Happy Customers", bg: "bg-green-50", color: "text-green-600" },
    { icon: Gavel, count: "15K+", label: "Auctions Completed", bg: "bg-purple-50", color: "text-purple-600" },
    { icon: Globe, count: "6+", label: "Countries Served", bg: "bg-orange-50", color: "text-orange-600" },
    { icon: ShieldCheck, count: "4.8/5", label: "Average Rating", bg: "bg-emerald-50", color: "text-emerald-600" },
];

const cards = [
    {
        title: "Our Mission",
        desc: "To simplify the car buying and selling process by providing a transparent, secure, and innovative auction platform that delivers maximum value to our customers.",
        icon: Target,
        bg: "bg-blue-50",
        color: "text-blue-600"
    },
    {
        title: "Our Vision",
        desc: "To become the most trusted and preferred online car auction platform in the region, setting new standards for transparency, trust, and customer satisfaction.",
        icon: Eye,
        bg: "bg-green-50",
        color: "text-green-600"
    },
    {
        title: "Our Values",
        list: ["Transparency in Everything We Do", "Customer First Approach", "Integrity and Fairness", "Innovation and Excellence"],
        icon: Gem,
        bg: "bg-purple-50",
        color: "text-purple-600"
    }
];

const storyEvents = [
    { year: "2019", desc: "AutoBid was founded in Dubai, UAE.", icon: Flag, bg: "bg-blue-50", color: "text-blue-600" },
    { year: "2020", desc: "Launched our platform with the first online auctions.", icon: Users, bg: "bg-green-50", color: "text-green-600" },
    { year: "2021", desc: "Expanded to more categories and partnered with trusted inspection centers.", icon: Car, bg: "bg-purple-50", color: "text-purple-600" },
    { year: "2022", desc: "Grew internationally and served customers across the GCC.", icon: Globe, bg: "bg-orange-50", color: "text-orange-600" },
    { year: "2023", desc: "Reached 10,000+ auctions and 20,000+ happy customers.", icon: TrendingUp, bg: "bg-sky-50", color: "text-sky-600" },
    { year: "2024 & Beyond", desc: "Continuing to innovate and deliver the best auction experience.", icon: Trophy, bg: "bg-emerald-50", color: "text-emerald-600" },
];

const team = [
    { name: "Omar Al Mansoori", role: "CEO & Co-Founder", bio: "Over 15 years of experience in automotive and digital marketplaces.", img: 'https://img.magnific.com/free-photo/cheerful-indian-businessman-smiling-closeup-portrait-jobs-career-campaign_53876-129417.jpg?semt=ais_hybrid&w=740&q=80' },
    { name: "Sara Al Zaabi", role: "COO", bio: "Operations leader with expertise in scaling platforms and customer experience.", img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTivbsbyo8aPjn7FjlLmMFb8otwI7Zg4s1jgA&s' },
    { name: "Michael Johnson", role: "CTO", bio: "Tech enthusiast focused on building secure and scalable digital solutions.", img: 'https://img.magnific.com/free-photo/cheerful-indian-businessman-smiling-closeup-portrait-jobs-career-campaign_53876-129417.jpg?semt=ais_hybrid&w=740&q=80' },
    { name: "Khaled Hassan", role: "Head of Sales", bio: "Automotive industry expert passionate about building strong partnerships.", img: 'https://img.magnific.com/free-photo/cheerful-indian-businessman-smiling-closeup-portrait-jobs-career-campaign_53876-129417.jpg?semt=ais_hybrid&w=740&q=80' },
];

const securityFeatures = [
    { icon: Lock, title: "256-bit", desc: "Encryption" },
    { icon: UserCheck, title: "Verified", desc: "Sellers & Buyers" },
    { icon: CreditCard, title: "Secure Payment", desc: "Gateway" },
    { icon: ClipboardCheck, title: "Strict Vehicle", desc: "Inspections" },
];

function AboutUs() {

    const breadcrumbItems = [
        { label: 'Home', path: '/' },
        { label: 'About Us', path: '/about-us' }
    ];

    return (
        <section>

            {/* top section */}
            <div className='relative w-full'>
                <img
                    src={AboutMainImg}
                    alt="About AutoBid"
                    className='h-full w-full object-cover'
                />

                {/* Overlay Content */}
                <div className='absolute inset-0 z-10 flex items-center bg-white/10'>
                    <div className='max-w-6xl mx-auto px-4 sm:px-5 lg:px-6 w-full'>

                        {/* Breadcrumbs */}
                        <div className='mb-4'>
                            <Breadcrumbs items={breadcrumbItems} />
                        </div>

                        {/* Main Text Content */}
                        <div className='max-w-xl'>
                            <h1 className='text-4xl md:text-5xl font-bold text-[#0B1E3D] mb-4'>
                                About BidDrive
                            </h1>

                            {/* Subtitle with Orange accent */}
                            <p className='text-[#D97706] font-semibold text-lg mb-4'>
                                The Middle East's Most Trusted Online Car Auction Platform
                            </p>

                            <p className='text-slate-700 text-base md:text-md mb-8 leading-relaxed'>
                                At BidDrive, we make buying and selling cars simple, transparent, and rewarding.
                                Our platform connects thousands of verified buyers and sellers across the UAE
                                and beyond through secure auctions and innovative technology.
                            </p>

                            {/* Button */}
                            <div className='flex'>
                                <button className='bg-[#D97706] text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 
                                transition-all duration-300 ease-out 
                                hover:scale-105 hover:bg-[#b46205] 
                                active:scale-95 shadow-lg'>
                                    Explore Auctions <IoIosArrowRoundForward size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-6">

                    {/* feature bar */}
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 flex flex-wrap justify-between items-center gap-8">

                        {stats.map((stat, index) => (
                            <div key={index} className="flex items-center gap-4 flex-1">
                                <div className={`w-14 h-14 rounded-full ${stat.bg} flex items-center justify-center`}>
                                    <stat.icon size={24} className={`${stat.color}`} />
                                </div>

                                {/* Text Content */}
                                <div>
                                    <h3 className="text-2xl font-bold text-[#0B1E3D]">{stat.count}</h3>
                                    <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                                </div>
                            </div>
                        ))}

                    </div>

                    {/* who we are */}
                    <div className="py-16 flex flex-col lg:flex-row items-center gap-12">

                        <div className="w-full lg:w-1/2 space-y-4">
                            <h2 className="text-3xl font-bold text-[#0B1E3D]">Who We Are</h2>
                            <div className="space-y-4 text-slate-600 leading-relaxed">
                                <p>
                                    <span className='text-[#D97706] font-semibold'>BidDrive</span> is a leading online car auction platform in the Middle East,
                                    dedicated to delivering a secure, reliable, and user-friendly
                                    experience for car buyers and sellers.
                                </p>
                                <p>
                                    We leverage advanced technology and industry expertise to offer a
                                    wide selection of quality vehicles, competitive prices, and
                                    complete transparency at every step.
                                </p>
                            </div>

                            <a href="#" className="inline-flex items-center gap-2 text-[#D97706] font-semibold hover:gap-3 transition-all">
                                Learn More About Our Platform <ArrowRight size={18} />
                            </a>
                        </div>

                        <div className="w-full lg:w-1/2">
                            <img
                                src={AboutImg}
                                alt="AutoBid Office"
                                className="w-full h-auto rounded-xl shadow-lg object-cover"
                            />
                        </div>

                    </div>

                    {/* stats */}
                    <div className="py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                        {cards.map((card, index) => (
                            <div
                                key={index}
                                className="p-4 border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex gap-5"
                            >
                                {/* Column 1 - Icon */}
                                <div className="shrink-0">
                                    <div
                                        className={`w-14 h-14 rounded-full ${card.bg} flex items-center justify-center`}
                                    >
                                        <card.icon size={28} className={card.color} />
                                    </div>
                                </div>

                                {/* Column 2 - Content */}
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-[#0B1E3D] mb-4">
                                        {card.title}
                                    </h3>

                                    {card.list ? (
                                        <ul className="space-y-3">
                                            {card.list.map((item, i) => (
                                                <li
                                                    key={i}
                                                    className="flex items-center gap-3 text-slate-600"
                                                >
                                                    <CheckCircle2
                                                        size={18}
                                                        className="text-blue-600 shrink-0"
                                                    />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-slate-600 leading-relaxed">
                                            {card.desc}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Our Story */}
                    <div className='py-16'>
                        <div className="mb-16">
                            <h2 className="text-3xl font-bold text-[#0B1E3D] mb-4">Our Story</h2>
                            <p className="text-slate-600  font-medium max-w-2xl text-[15px]">
                                AutoBid was founded with a simple idea - to create a better way to buy and sell cars online.
                                From a small team with a big vision to the region's leading car auction platform.
                            </p>
                        </div>

                        {/* Timeline Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 relative">
                            {storyEvents.map((event, index) => (
                                <div key={index} className="flex flex-col items-center text-center relative">

                                    {/* Icon Circle */}
                                    <div className={`w-16 h-16 rounded-full ${event.bg} flex items-center justify-center mb-6 z-10`}>
                                        <event.icon size={28} className={event.color} />
                                    </div>

                                    {/* Text */}
                                    <h3 className="font-bold text-[#0B1E3D] mb-2">{event.year}</h3>
                                    <p className="text-sm text-slate-600 leading-relaxed px-1">{event.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Leadership */}
                    <div className='py-16'>
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-[#0B1E3D] mb-2">Leadership Team</h2>
                            <p className="text-slate-600  font-medium max-w-2xl text-[15px]">
                                Meet the experienced team behind AutoBid's success.
                            </p>
                        </div>

                        {/* Team Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {team.map((member, index) => (
                                <div key={index} className="p-4 border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all">
                                    {/* Image & LinkedIn */}
                                    <div className="relative mb-4">
                                        <img src={member.img} alt={member.name} className="w-full h-48 object-cover rounded-xl" />
                                        <a href="#" className="absolute top-2 right-2 bg-blue-600 p-1.5 rounded text-white hover:bg-blue-700">
                                            <FaLinkedinIn size={16} />
                                        </a>
                                    </div>

                                    {/* Info */}
                                    <h3 className="font-bold text-[#0B1E3D] mb-1">{member.name}</h3>
                                    <p className="text-sm font-semibold text-blue-600 mb-2">{member.role}</p>
                                    <p className="text-sm text-slate-500 leading-relaxed">{member.bio}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* footer */}
            <div className="w-full py-16 bg-[#0B1E3D]">
                <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-6">

                    {/* Container */}
                    <div className="rounded-3xl flex flex-col lg:flex-row items-center justify-between gap-5">

                        {/* Left Text */}
                        <div className="max-w-sm">
                            <h2 className="text-2xl font-bold text-white mb-3">Built on Trust & Security</h2>
                            <p className="text-white/70 text-sm leading-relaxed">
                                We use advanced technology and industry best practices to ensure a safe and secure experience for all our users.
                            </p>
                        </div>

                        {/* Right Security Features */}
                        <div className="flex flex-wrap justify-center gap-4">
                            {securityFeatures.map((feature, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md text-[#D97706] hover:scale-105 hover:shadow-xl transition-all duration-300">
                                        <feature.icon size={24} />
                                    </div>
                                    <div className="text-left">
                                        <h4 className="font-bold text-white text-sm">{feature.title}</h4>
                                        <p className="text-white/70 text-xs font-medium">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </section>
    )
}

export default AboutUs;
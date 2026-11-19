
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import MasterCardiconImg from '../assets/Images/MasterCardiconImg.png';
import RupayiconImg from '../assets/Images/RupayiconImg.png'
import UPIiconImg from '../assets/Images/UPIiconImg.png';
import VISAiconimg from '../assets/Images/VISAiconimg.png';
import { TfiEmail } from "react-icons/tfi";
import { FiPhone, FiClock } from "react-icons/fi";
import { MdOutlineEmail, MdOutlineLocationOn } from "react-icons/md";
import { FaFacebook, FaInstagram, FaYoutube, FaTwitter } from "react-icons/fa6";
import FooterColumn from './FooterColumn';

import { useGetPublicSettings } from '../hook/useSiteSetting';
import { useGetPublicFooterPages } from '../hook/usePage';

// show hardcoded links first, then admin-added CMS pages in each column.
const HARDCODED_LINKS = {
    support: [
        { to: '/about-us', label: 'About Us' },
        { to: '/blog', label: 'Blog' },
        { to: '/faq', label: 'FAQ' },
    ],
    buyers: [],
    sellers: [],
};

const FALLBACK = {
    tagline: "The Middle East's most trusted online car auction platform.",
    phone: '+97141234567',
    email: 'support@biddrive.ae',
    address: 'Business Bay, Dubai, United Arab Emirates',
    supportHours: '',
    social: { facebook: '', instagram: '', twitter: '', youtube: '' },
};

const SOCIALS = [
    { key: 'facebook', label: 'Facebook', Icon: FaFacebook },
    { key: 'instagram', label: 'Instagram', Icon: FaInstagram },
    { key: 'twitter', label: 'Twitter', Icon: FaTwitter },
    { key: 'youtube', label: 'YouTube', Icon: FaYoutube },
];

function Footer() {

    const { data } = useGetPublicSettings();
    const { data: cmsPages } = useGetPublicFooterPages();

    const s = { ...FALLBACK, ...data, social: { ...FALLBACK.social, ...data?.social } };
    const socials = SOCIALS.filter(({ key }) => s.social[key]);

    const withCms = (key) => [
        ...HARDCODED_LINKS[key],
        ...(cmsPages?.[key] || []).map((pg) => ({ to: `/page/${pg.slug}`, label: pg.title })),
    ];
    const supportLinks = withCms('support');
    const buyersLinks = withCms('buyers');
    const sellersLinks = withCms('sellers');

    return (
        <section className='w-full'>

            {/* ---------- 1st section ------------- */}
            <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-6 md:py-10">
                <div className="bg-white rounded-3xl p-5 sm:p-8 ">
                    <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">

                        {/* Left Content */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left flex-1">

                            <div className="bg-[#D97706] p-4 sm:p-5 rounded-2xl shrink-0">
                                <TfiEmail className="text-2xl sm:text-3xl text-white" />
                            </div>

                            <div>
                                <h2 className="font-bold text-lg sm:text-xl lg:text-2xl text-[#0B1E3D] leading-tight">
                                    Stay Updated With Our Latest Auctions
                                </h2>

                                <p className="text-sm sm:text-base text-slate-500 mt-2 max-w-2xl">
                                    Subscribe to get notified about new listings and exclusive deals.
                                </p>
                            </div>

                        </div>

                        {/* Right Form */}
                        <div className="w-full xl:w-auto xl:min-w-105">
                            <div className="flex flex-col sm:flex-row items-stretch bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 focus-within:border-[#D97706] focus-within:ring-2 focus-within:ring-[#D97706]/20 transition-all">

                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 min-w-0 px-4 py-3.5 text-sm text-gray-700 bg-transparent outline-none"
                                />

                                <button className="bg-[#D97706] hover:bg-[#b86405] text-white text-sm font-semibold px-6 py-3.5 transition-colors whitespace-nowrap">
                                    Subscribe
                                </button>

                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* --------- 2nd section ---------- */}
            <div className='bg-[#0B1E3D]'>
                <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-6 mb-5 grid grid-cols-1 gap-10 border-b border-gray-700/50 py-8 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">

                    {/* logo */}
                    <div>
                        <Link to="/" className="flex items-center gap-2 cursor-pointer">
                            <div className="bg-[#D97706] p-0.5 md:p-1 rounded-lg">🚗</div>
                            <span className="text-xl md:text-2xl font-bold text-[#F8FAFC]">
                                Bid<span className="text-[#D97706]">Drive</span>
                            </span>
                        </Link>

                        {s.tagline && (
                            <p className="max-w-xs text-sm leading-relaxed text-gray-300 py-5">{s.tagline}</p>
                        )}

                        {/* Social icons */}
                        {socials.length > 0 && (
                            <div className="flex gap-2.5">
                                {socials.map(({ key, label, Icon }) => (
                                    <a
                                        key={key}
                                        href={s.social[key]}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={label}
                                        className="w-8 h-8 rounded-full bg-[#D97706]/90 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                                    >
                                        <Icon size={17} />
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Quick Links */}
                    <div className="min-w-0 space-y-6">
                        <h1 className="text-xl font-bold leading-tight text-gray-200">
                            Quick Links
                        </h1>

                        <div className="text-[15px] flex min-w-0 flex-col gap-3 ">
                            <NavLink
                                to="/"
                                className={({ isActive }) => `wrap-break-word transition-all duration-300  ${isActive ? 'text-gray-300' : 'text-[#94A3B8] hover:text-[#F8FAFC]'}`}>
                                Home
                            </NavLink>
                            <NavLink
                                to="/live-auctions"
                                className={({ isActive }) => `wrap-break-word transition-all duration-300  ${isActive ? 'text-gray-300' : 'text-[#94A3B8] hover:text-[#F8FAFC]'}`}>
                                Live Auctions
                            </NavLink>
                            <NavLink
                                to="/upcoming-auctions"
                                className={({ isActive }) => `wrap-break-word transition-all duration-300  ${isActive ? 'text-gray-300' : 'text-[#94A3B8] hover:text-[#F8FAFC]'}`}>
                                Upcoming Auctions
                            </NavLink>
                            <NavLink
                                to="/how-it-work"
                                className={({ isActive }) => `wrap-break-word transition-all duration-300  ${isActive ? 'text-gray-300' : 'text-[#94A3B8] hover:text-[#F8FAFC]'}`}>
                                How It Works
                            </NavLink>
                            <NavLink
                                to="/sell-your-car"
                                className={({ isActive }) => `wrap-break-word transition-all duration-300  ${isActive ? 'text-gray-300' : 'text-[#94A3B8] hover:text-[#F8FAFC]'}`}>
                                Sell Your Car
                            </NavLink>
                            <NavLink
                                to="/contact"
                                className={({ isActive }) => `wrap-break-word transition-all duration-300  ${isActive ? 'text-gray-300' : 'text-[#94A3B8] hover:text-[#F8FAFC]'}`}>
                                Contact Us
                            </NavLink>
                        </div>
                    </div>

                    <FooterColumn title="Support" links={supportLinks} />
                    {buyersLinks.length > 0 && <FooterColumn title="For Buyers" links={buyersLinks} />}
                    {sellersLinks.length > 0 && <FooterColumn title="For Sellers" links={sellersLinks} />}

                    {/* Contact */}
                    <div className="min-w-0 space-y-6">
                        <h1 className="text-xl font-bold leading-tight text-gray-200">
                            Contact US
                        </h1>

                        <div className="flex min-w-0 flex-col gap-3 text-[14px] text-gray-300">
                            <a
                                href={`tel:${s.phone.replace(/[^\d+]/g, '')}`}
                                className="flex items-center gap-2 break-all hover:text-white transition-colors">
                                <FiPhone size={16} className="shrink-0" />
                                {s.phone}
                            </a>

                            <a
                                href={`mailto:${s.email}`}
                                className="flex items-center gap-2 break-all hover:text-white transition-colors">
                                <MdOutlineEmail size={16} className="shrink-0" />
                                {s.email}
                            </a>

                            {s.supportHours && (
                                <p className="flex items-center gap-2">
                                    <FiClock size={16} className="shrink-0" />
                                    {s.supportHours}
                                </p>
                            )}
                        </div>

                        <div className="flex min-w-0 gap-2 text-gray-300">
                            <MdOutlineLocationOn size={16} className="shrink-0 mt-0.5" />
                            <p className="text-[14px]">{s.address}</p>
                        </div>
                    </div>

                </div>

                {/* Copyright Bar */}
                <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 pb-2">
                    <p className="text-xs md:text-sm text-gray-400">
                        © {new Date().getFullYear()} BidDrive Car Auctions
                    </p>

                    <div className="flex items-center gap-3">
                        <img src={VISAiconimg} alt="Visa" className="h-6 object-contain" />
                        <img src={MasterCardiconImg} alt="Mastercard" className="h-6 object-contain" />
                        <img src={RupayiconImg} alt="Rupay" className="h-6 object-contain" />
                        <img src={UPIiconImg} alt="UPI" className="h-6 object-contain" />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Footer;
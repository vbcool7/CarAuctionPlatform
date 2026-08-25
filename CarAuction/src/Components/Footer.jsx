
import React from 'react';
import MasterCardiconImg from '../assets/Images/MasterCardiconImg.png';
import RupayiconImg from '../assets/Images/RupayiconImg.png'
import UPIiconImg from '../assets/Images/UPIiconImg.png';
import VISAiconimg from '../assets/Images/VISAiconimg.png';
import { TfiEmail } from "react-icons/tfi";
import { Link, NavLink } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaYoutube, FaTwitter } from "react-icons/fa6";
import { FiPhone } from "react-icons/fi";
import { MdOutlineEmail, MdOutlineLocationOn } from "react-icons/md";

function Footer() {
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

                        <p className="max-w-xs text-sm leading-relaxed text-gray-300 py-5">
                            The Middle East's most trusted online car auction platform.
                        </p>

                        {/* Social icons */}
                        <div className="flex gap-2.5">
                            {[
                                { label: "Facebook", icon: <FaFacebook size={17} /> },
                                { label: "Instagram", icon: <FaInstagram size={17} /> },
                                { label: "Twitter", icon: <FaTwitter size={17} /> },
                                { label: "YouTube", icon: <FaYoutube size={17} /> },
                            ].map(({ label, icon }) => (
                                <div
                                    key={label}
                                    aria-label={label}
                                    className="w-8 h-8 rounded-full bg-[#D97706]/90 flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer"
                                >
                                    {icon}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="min-w-0 space-y-6">
                        <h1 className="text-xl font-bold leading-tight text-gray-200">
                            Quick Links
                        </h1>

                        <div className="flex min-w-0 flex-col gap-3 ">
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

                    {/* Support */}
                    <div className="min-w-0 space-y-6">
                        <h1 className="text-xl font-bold leading-tight text-gray-200">
                            Support
                        </h1>

                        <div className="flex min-w-0 flex-col gap-3 ">
                            <NavLink
                                to="/about-us"
                                className={({ isActive }) => `wrap-break-word transition-all duration-300  ${isActive ? 'text-gray-300' : 'text-[#94A3B8] hover:text-[#F8FAFC]'}`}>
                                About Us
                            </NavLink>
                            <NavLink
                                to="/faq"
                                className={({ isActive }) => `wrap-break-word transition-all duration-300  ${isActive ? 'text-gray-300' : 'text-[#94A3B8] hover:text-[#F8FAFC]'}`}>
                                FAQ
                            </NavLink>
                            <NavLink
                                to="/terms-conditions"
                                className={({ isActive }) => `wrap-break-word transition-all duration-300  ${isActive ? 'text-gray-300' : 'text-[#94A3B8] hover:text-[#F8FAFC]'}`}>
                                Terms & Conditions
                            </NavLink>
                            <NavLink
                                to="/privacy-policy"
                                className={({ isActive }) => `wrap-break-word transition-all duration-300  ${isActive ? 'text-gray-300' : 'text-[#94A3B8] hover:text-[#F8FAFC]'}`}>
                                Privacy Policy
                            </NavLink>
                            <NavLink
                                to="/shipping-delivery"
                                className={({ isActive }) => `wrap-break-word transition-all duration-300  ${isActive ? 'text-gray-300' : 'text-[#94A3B8] hover:text-[#F8FAFC]'}`}>
                                Shipping & Delivery
                            </NavLink>
                            <NavLink
                                to="/payment-policy"
                                className={({ isActive }) => `wrap-break-word transition-all duration-300  ${isActive ? 'text-gray-300' : 'text-[#94A3B8] hover:text-[#F8FAFC]'}`}>
                                Payment Policy
                            </NavLink>
                        </div>
                    </div>

                    {/* Buyers */}
                    <div className="min-w-0 space-y-6">
                        <h1 className="text-xl font-bold leading-tight text-gray-200">
                            For Buyers
                        </h1>

                        <div className="flex min-w-0 flex-col gap-3 ">
                            <NavLink
                                to="/buyer-guide"
                                className={({ isActive }) => `wrap-break-word transition-all duration-300  ${isActive ? 'text-gray-300' : 'text-[#94A3B8] hover:text-[#F8FAFC]'}`}>
                                Buyer Guide
                            </NavLink>
                            <NavLink
                                to="/na"
                                className={({ isActive }) => `wrap-break-word transition-all duration-300  ${isActive ? 'text-gray-300' : 'text-[#94A3B8] hover:text-[#F8FAFC]'}`}>
                                NA
                            </NavLink>
                            <NavLink
                                to="/bidding-tips"
                                className={({ isActive }) => `wrap-break-word transition-all duration-300  ${isActive ? 'text-gray-300' : 'text-[#94A3B8] hover:text-[#F8FAFC]'}`}>
                                Bidding Tips
                            </NavLink>
                            <NavLink
                                to="/payment-methods"
                                className={({ isActive }) => `wrap-break-word transition-all duration-300  ${isActive ? 'text-gray-300' : 'text-[#94A3B8] hover:text-[#F8FAFC]'}`}>
                                Payments Methods
                            </NavLink>
                            <NavLink
                                to="/buyer-protection"
                                className={({ isActive }) => `wrap-break-word transition-all duration-300  ${isActive ? 'text-gray-300' : 'text-[#94A3B8] hover:text-[#F8FAFC]'}`}>
                                Buyer Protection
                            </NavLink>
                        </div>
                    </div>

                    {/* sellers */}
                    <div className="min-w-0 space-y-6">
                        <h1 className="text-xl font-bold leading-tight text-gray-200">
                            For Sellers
                        </h1>

                        <div className="flex min-w-0 flex-col gap-3 ">
                            <NavLink
                                to="/seller-guide"
                                className={({ isActive }) => `wrap-break-word transition-all duration-300  ${isActive ? 'text-gray-300' : 'text-[#94A3B8] hover:text-[#F8FAFC]'}`}>
                                Seller Guide
                            </NavLink>
                            <NavLink
                                to="/na"
                                className={({ isActive }) => `wrap-break-word transition-all duration-300  ${isActive ? 'text-gray-300' : 'text-[#94A3B8] hover:text-[#F8FAFC]'}`}>
                                NA
                            </NavLink>
                            <NavLink
                                to="/start-selling"
                                className={({ isActive }) => `wrap-break-word transition-all duration-300  ${isActive ? 'text-gray-300' : 'text-[#94A3B8] hover:text-[#F8FAFC]'}`}>
                                Start Selling
                            </NavLink>
                            <NavLink
                                to="/manage-auctions"
                                className={({ isActive }) => `wrap-break-word transition-all duration-300  ${isActive ? 'text-gray-300' : 'text-[#94A3B8] hover:text-[#F8FAFC]'}`}>
                                Manage Auctions
                            </NavLink>
                            <NavLink
                                to="/payouts"
                                className={({ isActive }) => `wrap-break-word transition-all duration-300  ${isActive ? 'text-gray-300' : 'text-[#94A3B8] hover:text-[#F8FAFC]'}`}>
                                Payouts
                            </NavLink>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="min-w-0 space-y-6">
                        <h1 className="text-xl font-bold leading-tight text-gray-200">
                            Contact US
                        </h1>

                        <div className="flex min-w-0 flex-col gap-3 text-gray-300">
                            <p className="flex items-center gap-2 wrap-break-words transition-all duration-300">
                                <FiPhone size={16} className="shrink-0" />
                                97141234567
                            </p>
                            <p className="flex items-center gap-2 wrap-break-words transition-all duration-300">
                                <MdOutlineEmail size={16} className="shrink-0" />
                                support@biddrive.ae
                            </p>
                        </div>

                        <div className="flex min-w-0 gap-2 text-gray-300">
                            <MdOutlineLocationOn size={16} className="shrink-0 mt-0.5" />
                            <div className="flex flex-col gap-1">
                                <p className="text-[14px]">Business Bey Dubai</p>
                                <p className="text-[14px]">United Arab Emirates</p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Copyright Bar */}
                <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 pb-2">
                    <p className="text-xs md:text-sm text-gray-400">
                        © 2024 BidDrive Car Auctions. All rights reserved.
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
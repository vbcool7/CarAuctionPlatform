
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { IoHeartOutline, IoMenu, IoClose, IoPersonOutline } from 'react-icons/io5';
import { IoChevronDown } from "react-icons/io5";
import useAuthStore from '../store/useAuthStore';
import { Car, ChevronDown, Gavel, Heart, LayoutDashboard, LogOut, User } from 'lucide-react';

function Navbar() {

    const navigate = useNavigate();

    const { user, logout } = useAuthStore();

    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isAuctionOpen, setIsAuctionOpen] = useState(false);
    const [isAccOpen, setIsAccOpen] = useState(false);
    const [isMobileAuctionOpen, setIsMobileAuctionOpen] = useState(false);

    // Reusable styles for links
    const navLinkClass = ({ isActive }) =>
        `wrap-break-word transition-all duration-300 
    ${isActive ? 'text-white' : 'text-[#94A3B8] hover:text-[#F8FAFC]'}`;

    const navLinks = [
        { to: "/", name: "Home" },
        { to: "/auction", name: "Auctions" },
        { to: "/how-it-work", name: "How It Works" },
        { to: "/sell-your-car", name: "Sell your car" },
        { to: "/about-us", name: "About Us" },
        { to: "/faq", name: "FAQ" },
        { to: "/contact", name: "Contact" },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-[#0F172A] border-b border-[#334155] py-5">
            <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-6 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 cursor-pointer">
                    <div className="bg-[#D97706] p-0.5 md:p-1 rounded-lg">🚗</div>
                    <span className="text-xl md:text-2xl font-bold text-[#F8FAFC]">Bid<span className="text-[#D97706]">Drive</span></span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden lg:flex items-center gap-6 relative">

                    {/* home */}
                    <NavLink to="/" className={navLinkClass}>Home</NavLink>

                    {/* auction */}
                    <div className="relative">
                        <button
                            onClick={() => setIsAuctionOpen(!isAuctionOpen)}
                            className="flex items-center gap-1 text-[#94A3B8] hover:text-white transition-colors"
                        >
                            Auctions <IoChevronDown size={16} />
                        </button>

                        {isAuctionOpen && (
                            <div className="absolute top-full left-0 mt-2 w-48 bg-[#1E293B] border border-[#334155] rounded-lg shadow-xl z-50 p-2">
                                <Link to="/live-auctions"
                                    onClick={() => setIsAuctionOpen(false)}
                                    className="block p-2 text-[#94A3B8] hover:bg-[#334155] hover:text-white rounded">
                                    Live Auctions
                                </Link>
                                <Link to="/upcoming-auctions"
                                    onClick={() => setIsAuctionOpen(false)}
                                    className="block p-2 text-[#94A3B8] hover:bg-[#334155] hover:text-white rounded">
                                    Upcoming Auctions
                                </Link>
                                <Link to="/ended-auctions"
                                    onClick={() => setIsAuctionOpen(false)}
                                    className="block p-2 text-[#94A3B8] hover:bg-[#334155] hover:text-white rounded">
                                    Ended Auctions
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* how it works */}
                    <NavLink to="/how-it-work" className={navLinkClass}>How It Works</NavLink>
                    <NavLink to="/sell-your-car" className={navLinkClass}>Sell your car</NavLink>
                    <NavLink to="/about-us" className={navLinkClass}>About Us</NavLink>
                    <NavLink to="/faq" className={navLinkClass}>FAQ</NavLink>
                    <NavLink to="/contact" className={navLinkClass}>Contact Us</NavLink>
                </div>

                {/* Right Side Actions (Heart + Auth Buttons) */}
                <div className="flex items-center gap-3">

                    <button className='text-white text-xl hover:text-amber-400  transition-colors'>
                        <IoHeartOutline />
                    </button>

                    {user ? (
                        <div className="relative">
                            {/* Profile Button */}
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
                            >
                                {/* Profile Image / Initial */}
                                {(
                                    user?.role === 'buyer'
                                        ? user?.profileImageUrl
                                        : user?.profileImage
                                ) ? (
                                    <img
                                        src={
                                            user?.role === 'buyer'
                                                ? user?.profileImageUrl
                                                : user?.profileImage
                                        }
                                        alt="Profile"
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-[#D97706] flex items-center justify-center text-white text-xs font-semibold">
                                        {(user?.role === 'buyer'
                                            ? user?.firstName
                                            : user?.fullName
                                        )?.charAt(0)?.toUpperCase()}
                                    </div>
                                )}

                                {/* Name */}
                                <span className="text-sm font-semibold text-white">
                                    {user?.role === 'buyer'
                                        ? `${user?.firstName || ''} ${user?.lastName || ''}`
                                        : user?.fullName || ''
                                    }
                                </span>

                                <ChevronDown
                                    size={15}
                                    className={`text-slate-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''
                                        }`}
                                />
                            </button>

                            {/* Dropdown */}
                            {isProfileOpen && (
                                <div className="absolute right-0 top-full mt-3 w-56 bg-[#0B1E3D] border border-slate-700 rounded-xl shadow-xl overflow-hidden z-50">

                                    {/* User Info */}
                                    <div className="px-4 py-3 border-b border-slate-700">
                                        <p className="text-sm font-semibold text-white">
                                            {user?.role === 'buyer'
                                                ? `${user?.firstName} ${user?.lastName}`
                                                : user?.fullName
                                            }
                                        </p>

                                        <p className="text-xs text-slate-400 mt-0.5 capitalize">
                                            {user?.role}
                                        </p>
                                    </div>

                                    {/* Buyer Menu */}
                                    {user?.role === 'buyer' && (
                                        <div className="py-2">

                                            <button
                                                onClick={() => {
                                                    navigate('/buyer-dashboard');
                                                    setIsProfileOpen(false);
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-200 hover:bg-white/5 hover:text-white transition-colors"
                                            >
                                                <LayoutDashboard size={17} />
                                                Dashboard
                                            </button>

                                            <button
                                                // onClick={() => {
                                                //     navigate('/my-bids');
                                                //     setIsProfileOpen(false);
                                                // }}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-200 hover:bg-white/5 hover:text-white transition-colors"
                                            >
                                                <Gavel size={17} />
                                                My Bids
                                            </button>

                                            <button
                                                // onClick={() => {
                                                //     navigate('/watchlist');
                                                //     setIsProfileOpen(false);
                                                // }}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-200 hover:bg-white/5 hover:text-white transition-colors"
                                            >
                                                <Heart size={17} />
                                                Watchlist
                                            </button>

                                        </div>
                                    )}

                                    {/* Seller Menu */}
                                    {user?.role === 'seller' && (
                                        <div className="py-2">

                                            <button
                                                onClick={() => {
                                                    navigate('/seller-dashboard');
                                                    setIsProfileOpen(false);
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-200 hover:bg-white/5 hover:text-white transition-colors"
                                            >
                                                <LayoutDashboard size={17} />
                                                Dashboard
                                            </button>

                                            <button
                                                // onClick={() => {
                                                //     navigate('/my-vehicles');
                                                //     setIsProfileOpen(false);
                                                // }}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-200 hover:bg-white/5 hover:text-white transition-colors"
                                            >
                                                <Car size={17} />
                                                My Vehicles
                                            </button>

                                            <button
                                                // onClick={() => {
                                                //     navigate('/my-auctions');
                                                //     setIsProfileOpen(false);
                                                // }}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-200 hover:bg-white/5 hover:text-white transition-colors"
                                            >
                                                <Gavel size={17} />
                                                My Auctions
                                            </button>

                                        </div>
                                    )}

                                    {/* Common Items */}
                                    <div className="border-t border-slate-700 py-2">

                                        <button
                                            onClick={() => {
                                                logout();
                                                setIsProfileOpen(false);
                                                navigate('/login');
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                                        >
                                            <LogOut size={17} />
                                            Logout
                                        </button>

                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="hidden sm:flex items-center gap-3">
                                <button
                                    onClick={() => navigate('/login')}
                                    className="px-4 py-2 text-sm font-semibold text-white border border-slate-600 hover:border-amber-500 hover:text-amber-400 rounded-lg transition-all duration-200 cursor-pointer">
                                    Login
                                </button>

                                <button
                                    onClick={() => navigate(`/signup`)}
                                    className="px-4 py-2 text-sm font-semibold text-white bg-[#D97706] hover:bg-[#B45309] rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
                                    Register
                                </button>
                            </div>
                        </>
                    )}

                    {/* Mobile User Icon */}
                    <div className="relative sm:hidden">
                        <button
                            onClick={() => setIsAccOpen(!isOpen)}
                            className="text-white text-xl p-2"
                        >
                            <IoPersonOutline />
                        </button>

                        {/* Dropdown Menu */}
                        {isAccOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setIsAccOpen(false)}
                                />

                                <div className="absolute right-0 top-10 w-40 bg-white rounded-2xl shadow-xl z-50 py-2 border border-slate-100 animate-in fade-in zoom-in duration-200">
                                    <a
                                        href="/login"
                                        className="block px-4 py-3 text-sm font-semibold text-[#0B1E3D] hover:bg-slate-50 transition"
                                    >
                                        Login
                                    </a>
                                    <div className="h-px bg-slate-100 mx-2" />
                                    <a
                                        href="/signup"
                                        className="block px-4 py-3 text-sm font-semibold text-[#D97706] hover:bg-orange-50 transition"
                                    >
                                        Sign Up
                                    </a>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Hamburger Icon */}
                    <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-white text-2xl ml-2">
                        {isOpen ? <IoClose /> : <IoMenu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="lg:hidden bg-[#0F172A] border-t border-[#334155] p-4 flex flex-col gap-4">
                    {navLinks.map((link) => (
                        <div key={link.to}>
                            {link.name === "Auctions" ? (
                                <div>
                                    <button
                                        onClick={() => setIsMobileAuctionOpen(!isMobileAuctionOpen)}
                                        className="flex justify-between w-full text-[#94A3B8]"
                                    >
                                        Auctions <IoChevronDown className={isMobileAuctionOpen ? "rotate-180" : ""} />
                                    </button>
                                    {isMobileAuctionOpen && (
                                        <div className="flex flex-col ml-4 mt-2 gap-2 border-l border-[#334155] pl-4 text-sm text-[#94A3B8] hover:text-white transition-colors">
                                            <Link to="/live-auctions" onClick={() => setIsOpen(false)}>Live Auctions</Link>
                                            <Link to="/upcoming-auctions" onClick={() => setIsOpen(false)}>Upcoming Auctions</Link>
                                            <Link to="/ended-auctions" onClick={() => setIsOpen(false)}>Ended Auctions</Link>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* Regular Links */
                                <NavLink to={link.to} className={navLinkClass} onClick={() => setIsOpen(false)}>
                                    {link.name}
                                </NavLink>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </nav>
    );
}

export default Navbar;
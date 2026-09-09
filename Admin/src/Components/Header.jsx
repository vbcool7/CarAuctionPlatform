
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, Heart, Bell, ChevronDown, User, LogOut, Settings, Mail } from 'lucide-react';

import { useAdminGet, useAdminLogout } from '../hooks/useAdmin';
import useAdminAuthStore from '../store/useAdminAuthStore';
import toast from 'react-hot-toast';
import NotificationDropdown from './NotificationDropdown';

function Header({ onToggleSideBar, setCurrentPage }) {

    const navigate = useNavigate();

    const { data: getAdmin, isError } = useAdminGet();
    const { mutate: logoutAdmin, isPending } = useAdminLogout();

    const clearStore = useAdminAuthStore((state) => state.logout);

    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        logoutAdmin(null, {
            onSuccess: (res) => {
                clearStore();
                navigate('/admin-login');
                toast.success(res.message || "Logout successful!")
            },
            onError: (error) => {
                clearStore();
            }
        });
    };

    // close dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div className='bg-white shadow-sm border-b border-amber-100 px-3 lg:px-6 py-5 sticky top-0 z-40'>
            <div className='flex items-center justify-between gap-2 lg:gap-4'>

                {/* Left — hamburger + search */}
                <div className='flex items-center gap-2 lg:gap-3 flex-1 min-w-0'>
                    {/* Hamburger */}
                    <button
                        onClick={onToggleSideBar}
                        className='p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-[#0B1E3D] transition-all shrink-0'
                    >
                        <Menu size={20} />
                    </button>

                    <div className='flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2.5 flex-1 max-w-50 sm:max-w-md border border-gray-200'>
                        <input
                            type='text'
                            placeholder='Search by make, model, VIN or lot #'
                            className='w-full text-xs sm:text-sm text-slate-700 placeholder-slate-400 outline-none bg-transparent truncate'
                        />
                        <Search className='text-slate-400 shrink-0 w-3.5 h-3.5 md:w-4 md:h-4' />
                    </div>
                </div>

                {/* Right — icons + user */}
                <div className='flex items-center gap-2 sm:gap-4 shrink-0'>

                    {/* Notifications */}
                    <NotificationDropdown setCurrentPage={setCurrentPage} />

                    {/* mail */}
                    <button
                        onClick={() => setCurrentPage('mails')}
                        className='relative p-1 text-slate-700 hover:text-slate-400 transition-colors'
                    >
                        <Mail size={20} />
                        <span className='absolute -top-1 -right-1 w-4 h-4 bg-linear-to-r from-amber-500 to-orange-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center'>
                            12
                        </span>
                    </button>

                    {/* User */}
                    <div className='relative' ref={dropdownRef}>
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className='flex items-center gap-1 sm:gap-2 hover:bg-amber-50 px-1 sm:px-2 py-1 rounded-lg transition-all'
                        >
                            <div className='w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-slate-200 bg-amber-100 overflow-hidden shrink-0'>
                                {getAdmin?.profilePhoto ? (
                                    <img
                                        src={getAdmin.profilePhoto}
                                        alt="User"
                                        className='w-full h-full object-cover'
                                    />
                                ) : (
                                    <User className='w-7 h-7 sm:w-8 sm:h-8 text-white' />
                                )}
                            </div>

                            {/* Name hidden on very small screens, visible on sm */}
                            <div className='text-left hidden sm:block'>
                                <p className='text-xs font-semibold text-[#0B1E3D] leading-tight'>
                                    {getAdmin?.name || "Loading..."}
                                </p>
                                <p className='text-[10px] text-slate-400 leading-tight capitalize'>
                                    {getAdmin?.role || "System"}
                                </p>
                            </div>

                            <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown menu */}
                        {showDropdown && (
                            <div className='absolute right-0 top-full mt-2 w-30 md:w-40 sm:w-48 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden z-50'>
                                {/* Dropdown content remains same */}
                                <div className='px-3 md:px-4 py-2 md:py-3 border-b border-slate-100'>
                                    <p className='text-[14px] md:text-sm font-semibold text-[#0B1E3D]'>
                                        {getAdmin?.name || "Loading..."}
                                    </p>
                                </div>

                                <div className='border-t border-slate-100 py-1'>
                                    <button
                                        onClick={handleLogout}
                                        className='w-full flex items-center gap-3 px-3 md:px-4 py-2 md:py-2.5 text-[14px] md:text-sm text-red-500 hover:bg-red-50 transition-colors'
                                    >
                                        <LogOut className="h-4 w-4 shrink-0" />
                                        <span className="wrap-break-words">
                                            {isPending ? "LoggingOut..." : "Logout"}
                                        </span>
                                    </button>

                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header
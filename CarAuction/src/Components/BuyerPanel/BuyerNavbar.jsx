
import React, { useState, useRef, useEffect } from 'react';
import { Menu, Search, Heart, Bell, ChevronDown, User, LogOut, Settings } from 'lucide-react';

function BuyerNavbar({ onToggleSideBar, setCurrentPage }) {

    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

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
        <div className='bg-[#0B1E3D] border-b border-slate-700 px-3 lg:px-6 py-3 sticky top-0 z-40'>
            <div className='flex items-center justify-between gap-2 lg:gap-4'>

                {/* Left — hamburger + search */}
                <div className='flex items-center gap-2 lg:gap-3 flex-1 min-w-0'>
                    {/* Hamburger */}
                    <button
                        onClick={onToggleSideBar}
                        className='p-1.5 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-all shrink-0'
                    >
                        <Menu size={20} />
                    </button>

                    <div className='flex items-center gap-2 bg-white rounded-lg px-3 py-1.5 flex-1 max-w-50 sm:max-w-md'>
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

                    {/* Watchlist */}
                    <button
                        onClick={() => setCurrentPage('Watchlist')}
                        className='relative p-1 text-slate-300 hover:text-white transition-colors'
                    >
                        <Heart size={20} />
                        <span className='absolute -top-1 -right-1 w-4 h-4 bg-[#D97706] text-white text-[9px] font-bold rounded-full flex items-center justify-center'>
                            12
                        </span>
                    </button>

                    {/* Notifications */}
                    <button
                        onClick={() => setCurrentPage('Notifications')}
                        className='relative p-1 text-slate-300 hover:text-white transition-colors'
                    >
                        <Bell size={20} />
                        <span className='absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center'>
                            4
                        </span>
                    </button>

                    {/* User dropdown */}
                    <div className='relative' ref={dropdownRef}>
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className='flex items-center gap-1 sm:gap-2 hover:bg-slate-700 px-1 sm:px-2 py-1 rounded-lg transition-all'
                        >
                            <div className='w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white bg-amber-100 overflow-hidden shrink-0'>
                                <img
                                    src="https://i.pravatar.cc/32"
                                    alt="User"
                                    className='w-full h-full object-cover'
                                />
                            </div>

                            {/* Name hidden on very small screens, visible on sm */}
                            <div className='text-left hidden sm:block'>
                                <p className='text-xs font-semibold text-white leading-tight'>John Doe</p>
                                <p className='text-[10px] text-slate-400 leading-tight'>Buyer</p>
                            </div>

                            <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown menu */}
                        {showDropdown && (
                            <div className='absolute right-0 top-full mt-2 w-40 sm:w-48 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden z-50'>
                                {/* Dropdown content remains same */}
                                <div className='px-4 py-3 border-b border-slate-100'>
                                    <p className='text-sm font-semibold text-[#0B1E3D]'>John Doe</p>
                                </div>
                                <div className='py-1'>
                                    {[
                                        { icon: User, label: 'Profile', page: 'Profile' },
                                        { icon: Settings, label: 'Settings', page: 'Settings' },
                                    ].map(({ icon: Icon, label, page }) => (
                                        <button
                                            key={label}
                                            onClick={() => { setCurrentPage(page); setShowDropdown(false); }}
                                            className='w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50'
                                        >
                                            <Icon size={14} />
                                            {label}
                                        </button>
                                    ))}
                                </div>

                                <div className='border-t border-slate-100 py-1'>

                                    <button

                                        className='w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors'

                                    >

                                        <LogOut size={16} />

                                        Log Out

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

export default BuyerNavbar;
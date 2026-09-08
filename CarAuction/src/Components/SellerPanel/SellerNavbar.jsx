
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Loader2, LogOut, Mail, Menu, Search, User } from 'lucide-react';
import { toast } from 'react-toastify';
import SellerNotificationDropdown from './SellerNotificationDropdown';

import { useSellerGet, useSellerLogout } from '../../hook/useSeller';
import useAuthStore from '../../store/useAuthStore';

function SellerNavbar({ onToggleSideBar, setCurrentPage }) {

    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const [showDropdown, setShowDropdown] = useState(false);

    const { data: getSeller, isError } = useSellerGet();

    const { mutate: logoutSeller, isPending: isLoggingOut } = useSellerLogout();
    const clearStore = useAuthStore((state) => state.logout);

    // logout
    const handleLogout = () => {
        logoutSeller(null, {
            onSuccess: (res) => {
                clearStore();
                navigate('/login');
                toast.success(res.message || "Logout successful!");
            },
            onError: (err) => {
                clearStore();
                navigate('/login');
                toast.error(err.response?.data?.message || "Logout failed, but you've been signed out locally");
            }
        })
    }

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
                    <button
                        onClick={onToggleSideBar}
                        className='p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-[#0B1E3D] transition-all shrink-0 cursor-pointer'
                    >
                        <Menu size={20} />
                    </button>

                    <div className='flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2.5 flex-1 max-w-50 sm:max-w-md border border-gray-200 focus-within:border-amber-500 transition-colors'>
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
                    <SellerNotificationDropdown setCurrentPage={setCurrentPage}/>

                    {/* User */}
                    <div className='relative' ref={dropdownRef}>
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className='flex items-center gap-1 sm:gap-2 hover:bg-amber-50 px-1 sm:px-2 py-1 rounded-lg transition-all cursor-pointer'
                        >
                            {/* Fixed: changed text-white to text-amber-700 so it's visible on bg-amber-100 */}
                            <div className='w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-slate-200 bg-amber-100 flex items-center justify-center overflow-hidden shrink-0'>
                                {getSeller?.profileImage ? (
                                    <img
                                        src={getSeller.profileImage}
                                        alt="User"
                                        className='w-full h-full object-cover'
                                    />
                                ) : (
                                    <User className='w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-700' />
                                )}
                            </div>

                            {/* Name hidden on very small screens, visible on sm */}
                            <div className='text-left hidden sm:block'>
                                <p className='text-xs font-semibold text-[#0B1E3D] leading-tight'>
                                    {getSeller?.fullName}
                                </p>
                                <p className='text-[10px] text-slate-400 leading-tight capitalize'>
                                    Verified Seller
                                </p>
                            </div>

                            <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown menu */}
                        {showDropdown && (
                            <div className='absolute right-0 top-full mt-2 w-40 sm:w-48 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden z-50'>
                                <div className='px-3 md:px-4 py-2.5 border-b border-slate-100'>
                                    <p className='text-xs font-semibold text-slate-400 uppercase tracking-wider'>Signed in as</p>
                                    <p className='text-sm font-semibold text-[#0B1E3D] truncate'>
                                        {getSeller?.fullName}
                                    </p>
                                </div>

                                <div className="py-1">
                                    <button
                                        onClick={handleLogout}
                                        disabled={isLoggingOut}
                                        className={`w-full flex items-center gap-3 px-3 md:px-4 py-2 md:py-2.5 text-sm text-red-600 transition-colors ${isLoggingOut
                                            ? "cursor-not-allowed opacity-70"
                                            : "cursor-pointer hover:bg-red-50"
                                            }`}
                                    >
                                        {isLoggingOut ? (
                                            <>
                                                <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                                                <span>Logging out...</span>
                                            </>
                                        ) : (
                                            <>
                                                <LogOut className="h-4 w-4 shrink-0" />
                                                <span>Logout</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SellerNavbar
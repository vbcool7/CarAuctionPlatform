
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Car, Gavel, FileText, History, Wallet, Heart, MessageSquare, UserCog, HelpCircle, LogOut, CarFront, ChevronDown, Plus } from "lucide-react";

import { useSellerGet } from '../../hook/useSeller';

const menuItems = [
    {
        id: "dashboard",
        icon: LayoutDashboard,
        label: "Dashboard",
        active: true,
    },
    {
        id: "my-vehicles",
        icon: Car,
        label: "My Vehicles",
        active: false,
    },
    {
        id: "my-auctions",
        icon: Gavel,
        label: "My Auctions",
        active: false,
    },
    {
        id: "bids-offers",
        icon: FileText,
        label: "Bids & Offers",
        active: false,
    },
    {
        id: "sales-history",
        icon: History,
        label: "Sales History",
        active: false,
    },
    {
        id: "payouts",
        icon: Wallet,
        label: "Payouts",
        active: false,
    },
    {
        id: "watchlist",
        icon: Heart,
        label: "Watchlist",
        active: false,
    },
    {
        id: "messages",
        icon: MessageSquare,
        label: "Messages",
        badge: 3,
        active: false,
    },
    {
        id: "profile-settings",
        icon: UserCog,
        label: "Profile Settings",
        active: false,
    },
    {
        id: "support",
        icon: HelpCircle,
        label: "Support",
        active: false,
    },
];

function SellerSidebar({ collapsed, onToggle, currentPage, onPageChange, mobileOpen, onCloseMobile, openLogoutModal }) {

    const { data: getSeller, isError } = useSellerGet();

    const [expandedItems, setExpandedItems] = useState(new Set(['dashboard']));

    const toggleEcpanded = (itemid) => {
        const newExpanded = new Set(expandedItems);
        if (newExpanded.has(itemid)) {
            newExpanded.delete(itemid);
        } else {
            newExpanded.add(itemid);
        }
        setExpandedItems(newExpanded);
    };

    return (
        <>
            <div
                className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10
                        bg-linear-to-b from-[#0B132B] via-[#0A1128] to-[#040814]
                        shadow-xl transition-transform duration-300 ease-in-out
                        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
                        lg:sticky lg:top-0 lg:h-screen lg:translate-x-0
                        ${collapsed ? 'lg:w-20' : 'lg:w-68'}`}>

                {/* Logo */}
                <div className={`flex items-center p-4.5
                    ${collapsed ? 'justify-center' : 'justify-between'}`}>
                    <Link
                        to="/"
                        className="flex items-center gap-3 transition-opacity hover:opacity-90"
                    >
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-amber-400 to-orange-500">
                            <CarFront size={18} className="text-white" />
                        </div>

                        {!collapsed && (
                            <div className="leading-tight">
                                <h1 className="text-lg font-semibold tracking-wide text-white">
                                    Bid<span className="text-amber-500">Drive</span>
                                </h1>
                                <p className="text-[11px] text-amber-400/80 font-medium">
                                    Seller Panel
                                </p>
                            </div>
                        )}
                    </Link>

                    <button
                        onClick={onCloseMobile}
                        className="rounded-xl p-2 text-slate-200 hover:bg-white/10 transition-all lg:hidden"
                    >
                        ✕
                    </button>
                </div>

                {/* seller profile */}
                {!collapsed && (
                    <div className="mx-4 mb-3 p-3 rounded-2xl bg-linear-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 flex items-center gap-3">
                        <div className="relative shrink-0">
                            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center text-amber-400 justify-center font-bold border border-amber-500/40">
                               {getSeller?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </div>
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0A1128] rounded-full"></span>
                        </div>
                        <div className="overflow-hidden space-y-0.5">
                            <h4 className="text-xs font-semibold text-white truncate">{getSeller?.fullName}</h4>
                            <p className="text-[11px] text-slate-300 truncate">Seller ID: {getSeller?._id?.slice(-10).toUpperCase()}</p>
                            <p className="text-[10px] text-emerald-400 font-medium truncate">Verified Seller</p>
                        </div>
                    </div>
                )}

                {/* Nav */}
                <nav className='flex-1 p-4 space-y-1 overflow-y-auto no-scrollbar'>
                    {menuItems.map((item) => {
                        const isActive = currentPage === item.id;
                        const isExpanded = expandedItems.has(item.id);
                        const Icon = item.icon;

                        return (
                            <div key={item.id}>
                                <button
                                    className={`w-full flex items-center ${collapsed ? "justify-center" : "justify-between"} 
                                px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer
                                        ${isActive
                                            ? "bg-linear-to-r from-amber-500 via-amber-600 to-orange-600 text-white shadow-lg shadow-amber-500/20"
                                            : "text-slate-300 hover:bg-white/10 hover:text-white"
                                        }`}
                                    onClick={() => {
                                        if (collapsed) { onToggle(); return; }
                                        if (item.id === "logout") {
                                            openLogoutModal();
                                            return;
                                        }
                                        if (item.submenu) {
                                            toggleEcpanded(item.id);
                                        } else {
                                            onPageChange(item.id);
                                        }
                                    }}>
                                    <div className='flex items-center gap-3'>
                                        {/* Icon */}
                                        <div className={`shrink-0
                                        ${isActive ? "text-white" : "text-amber-400/80"}`}>
                                            <Icon size={18} />
                                        </div>

                                        {/* Label + Badge */}
                                        {!collapsed && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium">
                                                    {item.label}
                                                </span>

                                                {item.badge && (
                                                    <span
                                                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold
                                                            ${isActive
                                                                ? "bg-white/20 text-white"
                                                                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                                            }`}
                                                    >
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Chevron */}
                                    {!collapsed && item.submenu && (
                                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200
                                        ${isExpanded ? 'rotate-180' : ''}`} />
                                    )}
                                </button>

                                {/* Submenu */}
                                {!collapsed && item.submenu && isExpanded && (
                                    <div className="ml-10 mt-2 space-y-1 border-l border-amber-500/20 pl-4">
                                        {item.submenu.map((subitem, index) => (
                                            <button
                                                key={index}
                                                onClick={() => onPageChange(subitem.id)}
                                                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-all duration-200 cursor-pointer
                                                    ${currentPage === subitem.id
                                                        ? "bg-white/10 text-amber-400 font-medium"
                                                        : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-5">
                                                    {subitem.label}

                                                    {/* sub menu badge */}
                                                    {subitem.badge && (
                                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase transition-colors
                                                            ${currentPage === subitem.id
                                                                ? "bg-amber-600 text-white"
                                                                : "bg-transparent text-slate-500 border border-slate-500"
                                                            }`}
                                                        >
                                                            {subitem.badge}
                                                        </span>
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>

                {/* add new vehicle / Logout */}
                <div className="border-t border-white/10 p-4 space-y-2">

                    <button
                        onClick={() => onPageChange("add-new-vehicle")}
                        className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 bg-linear-to-r from-amber-500 to-orange-500 text-white font-medium shadow-lg shadow-amber-500/20 hover:opacity-95 transition-all cursor-pointer 
                            ${collapsed ? "justify-center" : ""}`}
                    >
                        <Plus size={18} className="shrink-0" />
                        {!collapsed && <span className="text-sm">Add New Vehicle</span>}
                    </button>

                    <button
                        onClick={openLogoutModal}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-slate-300 transition-all duration-300 hover:bg-white/10 hover:text-white cursor-pointer ${collapsed ? "justify-center" : ""}`}
                    >
                        <LogOut size={18} className="text-amber-400/80 shrink-0" />

                        {!collapsed && (
                            <span className="text-sm font-medium">
                                Logout
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </>
    )
}

export default SellerSidebar
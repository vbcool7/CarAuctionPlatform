
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    LayoutDashboard, Gavel, Radio, CalendarDays, Heart,
    Trophy, XCircle, Tag, MessageSquareText, CreditCard,
    FileText, User, Headset, LogOut, ChevronDown
} from 'lucide-react';

const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", active: true },
    { id: "browse-auctions", icon: Gavel, label: "Browse Auctions", active: false },
    { id: "live-auctions", icon: Radio, label: "Live Auctions", active: false, badge: "LIVE" },
    { id: "upcoming-auctions", icon: CalendarDays, label: "Upcoming Auctions", active: false },
    { id: "watchlist", icon: Heart, label: "Watchlist", active: false, badge: 12 },
    { id: "bids", icon: Gavel, label: "Bids", active: false },
    { id: "won-auctions", icon: Trophy, label: "Won Auctions", active: false },
    { id: "lost-auctions", icon: XCircle, label: "Lost Auctions", active: false },
    { id: "my-offers", icon: Tag, label: "My Offers", active: false },
    { id: "messages", icon: MessageSquareText, label: "Messages", active: false, badge: 3 },
    { id: "payments", icon: CreditCard, label: "Payments", active: false },
    { id: "invoices", icon: FileText, label: "Invoices", active: false },
    { id: "profile", icon: User, label: "Profile Settings", active: false },
    { id: "support", icon: Headset, label: "Support", active: false },
    { id: "logout", icon: LogOut, label: "Log Out", active: false },
];

function BuyerSidebar({ collapsed, onToggle, currentPage, onPageChange, mobileOpen, onCloseMobile, openLogoutModal }) {

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
                className={`fixed inset-y-0 left-0 z-60 flex w-72 flex-col border-r border-slate-200 bg-white shadow-lg transition-transform duration-300 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:sticky lg:top-0 lg:h-screen lg:translate-x-0
        ${collapsed ? 'lg:w-20' : 'lg:w-72'}
    `}>

                {/* Logo */}
                <div className={`flex items-center border-b border-slate-100 p-6
            ${collapsed ? 'justify-center' : 'justify-between'}`}>
                    <Link to="/" className='flex items-center gap-2 hover:opacity-80 transition-opacity'>
                        <div className="bg-[#D97706] p-1 rounded-lg">🚗</div>
                        {!collapsed && (
                            <span className="text-xl font-bold text-[#0B1E3D]">
                                Bid<span className="text-[#D97706]">Drive</span>
                            </span>
                        )}
                    </Link>

                    <button
                        onClick={onCloseMobile}
                        className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 transition-all lg:hidden"
                    >
                        ✕
                    </button>
                </div>

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
                                            ? "bg-[#0B1E3D] text-white"
                                            : "text-slate-600 hover:bg-slate-100 hover:text-[#0B1E3D]"
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
                                    }}
                                >
                                    <div className='flex items-center gap-3'>
                                        {/* Icon */}
                                        <div className={`shrink-0
                                    ${isActive ? "text-white" : "text-slate-400"}`}>
                                            <Icon size={18} />
                                        </div>

                                        {/* Label + Badge */}
                                        {!collapsed && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium">
                                                    {item.label}
                                                </span>

                                                {item.badge && (
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold
                                                        ${item.id === 'live-auctions'
                                                            ? 'bg-red-500 text-white'
                                                            : isActive
                                                                ? 'bg-white/20 text-white'
                                                                : 'bg-amber-100 text-[#D97706]'
                                                        }`}>
                                                        {item.id === 'messages'
                                                            ? (0 || 0)
                                                            : item.badge}
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
                                    <div className='ml-10 mt-1 space-y-1 border-l-2 border-slate-100 pl-3'>
                                        {item.submenu.map((subitem, index) => (
                                            <button
                                                key={index}
                                                onClick={() => onPageChange(subitem.id)}
                                                className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-all cursor-pointer
                                            ${currentPage === subitem.id
                                                        ? "text-[#D97706] bg-amber-50 font-medium"
                                                        : "text-slate-500 hover:text-[#0B1E3D] hover:bg-slate-50"
                                                    }`}
                                            >
                                                {subitem.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>

                {/* Footer support section */}
                {/* <div className='mt-auto p-4 border-t border-[#E2E8F0]'>
                    {collapsed ? (
                        <div className="flex justify-center p-2 rounded-xl bg-[#0B1E3D]/5 text-[#D97706]">
                            <Headset size={24} />
                        </div>
                    ) : (
                        <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0] flex flex-col items-center text-center">
                            <div className="p-2 bg-white rounded-lg shadow-sm text-[#0B1E3D] mb-3">
                                <Headset size={24} />
                            </div>
                            <h4 className="font-bold text-[#0B1E3D] text-sm">Need Help?</h4>
                            <p className="text-[11px] text-slate-500 mt-1 mb-3">Our support team is here to help you.</p>

                            <button className="w-full py-2 text-xs font-semibold text-[#0B1E3D] bg-white border border-[#D97706] rounded-lg hover:bg-[#D97706] hover:text-white transition-colors">
                                Contact Support
                            </button>
                        </div>
                    )}
                </div> */}
            </div>
        </>
    );
}

export default BuyerSidebar;
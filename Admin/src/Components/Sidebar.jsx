
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, LogOut, CarFront } from 'lucide-react';
import { RiDashboardLine, RiUserLine, RiCarLine, RiAuctionLine, RiHandCoinLine, RiBankCardLine, RiShieldCheckLine, RiFileList3Line, RiBarChartGroupedLine, RiSparklingLine, RiSettings3Line, RiVerifiedBadgeLine, RiMessage2Line } from "react-icons/ri";

const menuItems = [
    {
        id: "dashboard",
        icon: RiDashboardLine,
        label: "Dashboard",
        active: true,
    },
    {
        id: "user-management",
        icon: RiUserLine,
        label: "User Management",
        submenu: [
            { id: "buyers", label: "Buyers" },
            { id: "sellers", label: "Sellers" },
            { id: "staffs", label: "Staff" },
        ]
    },
    {
        id: "vehicle-approvals",
        icon: RiCarLine,
        label: "Vehicle Approvals",
        active: false,
    },
    {
        id: "auction-management",
        icon: RiAuctionLine,
        label: "Auction Management",
        active: false,
        submenu: [
            { id: "all-auctions", label: "All Auctions" },
            { id: "live-auctions", label: "Live Auctions", badge: "Live" },
            { id: "upcoming-auctions", label: "Upcoming Auctions" },
            { id: "completed-auctions", label: "Completed Auctions" },
            { id: "canceled-auctions", label: "Cancelled Auctions" },
        ]
    },
    {
        id: "bid-management",
        icon: RiHandCoinLine,
        label: "Bid Management",
        active: false,
    },
    {
        id: "payment-management",
        icon: RiBankCardLine,
        label: "Payment Management",
        active: false,
        submenu: [
            { id: "all-payments", label: "All Payments" },
            { id: "payouts", label: "Payouts" },
            { id: "refunds", label: "Refunds" },
            { id: "transactions", label: "Transactions" },
            { id: "payment-gateways", label: "Payment Gateways" },
        ]
    },
    {
        id: "dispute-management",
        icon: RiShieldCheckLine,
        label: "Dispute Management",
        active: false,
        submenu: [
            { id: "all-disputes", label: "All Disputes" },
            { id: "dispute-categories", label: "Dispute Categories" },
        ]
    },
    {
        id: "cms-management",
        icon: RiFileList3Line,
        label: "CMS Management",
        active: false,
        submenu: [
            { id: "all-pages", label: "All Pages" },
            { id: "all-blogs", label: "Blog post" },
        ]
    },
    {
        id: "reports-analytics",
        icon: RiBarChartGroupedLine,
        label: "Reports & Analytics",
        active: false,
    },
    {
        id: "ai-features",
        icon: RiSparklingLine,
        label: "AI & Advanced Features",
        active: false,
        badge: "New",
    },
    {
        id: "system-settings",
        icon: RiSettings3Line,
        label: "System Settings",
        active: false,
    },
    {
        id: "kyc-verification",
        icon: RiVerifiedBadgeLine,
        label: "KYC Verification",
        active: false,
        submenu: [
            { id: "buyer-kyc", label: "Buyers" },
            { id: "seller-kyc", label: "Sellers" },
        ]
    },
    {
        id: "live-chat",
        icon: RiMessage2Line,
        label: "Live Chat",
        active: false,
    },
];

function Sidebar({ collapsed, onToggle, currentPage, onPageChange, mobileOpen, onCloseMobile, openLogoutModal }) {

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
                className={`fixed inset-y-0 left-0 z-60 flex w-72 flex-col border-r border-white/10
                    bg-linear-to-b from-[#06101F] via-[#0B1E3D] to-[#132A52]
                    shadow-xl transition-transform duration-300 ease-in-out
                ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:sticky lg:top-0 lg:h-screen lg:translate-x-0
                ${collapsed ? 'lg:w-20' : 'lg:w-68'}
                `}>

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
                                <p className="text-[11px] text-slate-400">
                                    Admin Panel
                                </p>
                            </div>
                        )}
                    </Link>

                    <button
                        onClick={onCloseMobile}
                        className="rounded-xl p-2 text-slate-200 hover:bg-slate-100 transition-all lg:hidden"
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
                                            ? "bg-linear-to-r from-[#FBBF24] via-amber-600 to-amber-700 text-white shadow-lg shadow-amber-600/20"
                                            : "text-slate-300 hover:bg-white/10  hover:text-white"
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
                                                    <span
                                                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold
                                                            ${isActive
                                                                ? "bg-white/20 text-white"
                                                                : "bg-linear-to-r from-amber-100 to-orange-100 text-[#B45309] border border-amber-200"
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
                                    <div className="ml-10 mt-2 space-y-1 border-l border-slate-700 pl-4">
                                        {item.submenu.map((subitem, index) => (
                                            <button
                                                key={index}
                                                onClick={() => onPageChange(subitem.id)}
                                                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-all duration-200 cursor-pointer
                                                    ${currentPage === subitem.id
                                                        ? "bg-white/10 text-[#FBBF24] font-medium"
                                                        : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-5">
                                                    {subitem.label}

                                                    {/* sub menu badge */}
                                                    {subitem.badge && (
                                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase transition-colors
                                                            ${currentPage === subitem.id
                                                                ? "bg-green-600 text-white"
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

                {/* logout */}
                <div className="border-t border-white/10 p-4">
                    <button
                        onClick={openLogoutModal}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-slate-300 transition-all duration-300 hover:bg-white/10 hover:text-white cursor-pointer "
                    >
                        <LogOut size={18} className="text-slate-300 hover:text-white" />

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

export default Sidebar;
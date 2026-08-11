
import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, BadgeCheck, BadgeInfo, Bell, CalendarDays, CarFront, CheckCircle, ChevronRight, Clock3, CreditCard, Database, DatabaseBackup, DollarSign, FileText, Gavel, Globe, HeartPulse, ImageIcon, KeyRound, Mail, MessageCircle, Save, ScrollText, Send, Server, Shield, ShieldAlert, ShieldCheck, Trash2, User, UserPlus } from 'lucide-react';
import CustomDropdown from '../SharedComponents/CustomDropDown';
import SummaryDonutCard from '../SharedComponents/SummaryDonutCard';
import { notificationPrefrences } from '../Data';
import { auditLogsData } from '../Data';
import FilterDropdown from '../SharedComponents/FilterDropdown';

const featureSettings = [
    {
        id: "userRegistration",
        title: "User Registration",
        description: "Allow new users to register on the platform.",
        icon: UserPlus,
        iconBg: "bg-blue-50",
        iconColor: "text-blue-600",
    },
    {
        id: "vehicleBidding",
        title: "Vehicle Bidding",
        description: "Allow users to place bids on vehicles.",
        icon: Gavel,
        iconBg: "bg-green-50",
        iconColor: "text-green-600",
    },
    {
        id: "emailVerification",
        title: "Email Verification",
        description: "Require email verification for new users.",
        icon: BadgeCheck,
        iconBg: "bg-blue-50",
        iconColor: "text-blue-600",
    },
    {
        id: "autoApproveVehicles",
        title: "Auto Approve Vehicles",
        description: "Automatically approve vehicle listings.",
        icon: CarFront,
        iconBg: "bg-green-50",
        iconColor: "text-green-600",
    },
    {
        id: "twoFactorAuth",
        title: "Two-Factor Authentication",
        description: "Allow users to enable 2FA for their accounts.",
        icon: ShieldCheck,
        iconBg: "bg-blue-50",
        iconColor: "text-blue-600",
    },
    {
        id: "chatSystem",
        title: "Chat System",
        description: "Enable real-time chat for users.",
        icon: MessageCircle,
        iconBg: "bg-green-50",
        iconColor: "text-green-600",
    },
    {
        id: "liveAuctions",
        title: "Live Auctions",
        description: "Enable live auction functionality.",
        icon: Gavel,
        iconBg: "bg-blue-50",
        iconColor: "text-blue-600",
    },
    {
        id: "disputeSystem",
        title: "Dispute System",
        description: "Enable dispute management system.",
        icon: ShieldAlert,
        iconBg: "bg-green-50",
        iconColor: "text-green-600",
    },
];

const systemInfo = [
    {
        id: 1,
        label: "System Version",
        value: "1.0.0",
        icon: BadgeInfo,
        iconBg: "bg-blue-50",
        iconColor: "text-blue-600",
    },
    {
        id: 2,
        label: "Environment",
        value: "Production",
        icon: ShieldCheck,
        iconBg: "bg-green-50",
        iconColor: "text-green-600",
        badge: true,
    },
    {
        id: 3,
        label: "Last Updated",
        value: "May 20, 2024",
        icon: CalendarDays,
        iconBg: "bg-blue-50",
        iconColor: "text-blue-600",
    },
    {
        id: 4,
        label: "Database",
        value: "MongoDB 6.0",
        icon: Database,
        iconBg: "bg-blue-50",
        iconColor: "text-blue-600",
    },
    {
        id: 5,
        label: "Server",
        value: "Ubuntu 22.04 LTS",
        icon: Server,
        iconBg: "bg-blue-50",
        iconColor: "text-blue-600",
    },
    {
        id: 6,
        label: "Uptime",
        value: "15d 6h 32m",
        icon: Clock3,
        iconBg: "bg-blue-50",
        iconColor: "text-blue-600",
    },
];

const quickActions = [
    {
        id: 1,
        title: "Clear Cache",
        description: "Clear system cache and temporary files.",
        icon: Trash2,
        iconBg: "bg-green-50",
        iconColor: "text-green-600",
    },
    {
        id: 2,
        title: "Backup Database",
        description: "Create a backup of your database.",
        icon: DatabaseBackup,
        iconBg: "bg-amber-50",
        iconColor: "text-amber-600",
    },
    {
        id: 3,
        title: "System Health Check",
        description: "Check system health and performance.",
        icon: HeartPulse,
        iconBg: "bg-violet-50",
        iconColor: "text-violet-600",
    },
    {
        id: 4,
        title: "View Activity Logs",
        description: "View all system activity logs.",
        icon: ScrollText,
        iconBg: "bg-blue-50",
        iconColor: "text-blue-600",
    },
];

const notificationStats = [
    {
        id: "emailNotifications",
        title: "Email",
        description: "Send notifications via email to users.",
        icon: Mail,
        iconBg: "bg-blue-50",
        iconColor: "text-blue-600",
    },
    {
        id: "smsNotifications",
        title: "SMS",
        description: "Send notifications via SMS to users.",
        icon: MessageCircle,
        iconBg: "bg-green-50",
        iconColor: "text-green-600",
    },
    {
        id: "pushNotifications",
        title: "Push Notification",
        description: "Send push notifications in the browser.",
        icon: Bell,
        iconBg: "bg-violet-50",
        iconColor: "text-violet-600",
    },
    {
        id: "inAppNotifications",
        title: "In-App Notification",
        description: "Show notifications within the application.",
        icon: Send,
        iconBg: "bg-orange-50",
        iconColor: "text-orange-500",
    },
];

const emailTemplates = [
    {
        id: 1,
        title: "User Templates",
        description: "Manage user related email templates.",
        icon: User,
        iconBg: "bg-blue-50",
        iconColor: "text-blue-600",
    },
    {
        id: 2,
        title: "Auction Templates",
        description: "Manage auction related email templates.",
        icon: Gavel,
        iconBg: "bg-orange-50",
        iconColor: "text-orange-600",
    },
    {
        id: 3,
        title: "Payment Templates",
        description: "Manage payment related email templates.",
        icon: CreditCard,
        iconBg: "bg-green-50",
        iconColor: "text-green-600",
    },
    {
        id: 4,
        title: "System Templates",
        description: "Manage system and admin email templates.",
        icon: Shield,
        iconBg: "bg-violet-50",
        iconColor: "text-violet-600",
    }
];

const logSummaryData = [
    {
        id: 'total',
        label: 'Total Logs',
        count: 248,
        icon: <FileText className="w-4 h-4" />,
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-600'
    },
    {
        id: 'success',
        label: 'Successful Actions',
        count: 210,
        icon: <CheckCircle className="w-4 h-4" />,
        bgColor: 'bg-emerald-50',
        textColor: 'text-emerald-600'
    },
    {
        id: 'failed',
        label: 'Failed Actions',
        count: 18,
        icon: <AlertCircle className="w-4 h-4" />,
        bgColor: 'bg-rose-50',
        textColor: 'text-rose-600'
    },
    {
        id: 'warning',
        label: 'Warning',
        count: 20,
        icon: <AlertTriangle className="w-4 h-4" />,
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-600'
    }
];

const topModulesData = [
    { id: 'user-mgmt', name: 'User Management', count: 72 },
    { id: 'auction-mgmt', name: 'Auction Management', count: 58 },
    { id: 'payment-mgmt', name: 'Payment Management', count: 35 },
    { id: 'kyc-verif', name: 'KYC Verification', count: 28 },
    { id: 'system-settings', name: 'System Settings', count: 22 },
];

const securityAlertsData = [
    {
        id: '1',
        title: 'Failed Login Attempt',
        description: '5 failed login attempts detected',
        time: 'May 20, 2024 10:20 AM',
        icon: <ShieldAlert className="w-4 h-4" />,
        bgColor: 'bg-rose-50',
        textColor: 'text-rose-600'
    },
    {
        id: '2',
        title: 'Permission Change',
        description: 'User role updated for Admin User',
        time: 'May 20, 2024 09:15 AM',
        icon: <KeyRound className="w-4 h-4" />,
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-600'
    }
];

const NotificationsRow = ({ item, settings, onToggle }) => {

    const channels = settings[item.id];
    if (!channels) return null;

    return (
        <div className="grid grid-cols-12 items-center py-4 border-b border-slate-200 last:border-0">

            {/* notification prefernces */}
            <div className="col-span-8 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">{item.icon}</div>
                <div>
                    <p className="text-sm font-semibold text-[#0B1E3D]">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.description}</p>
                </div>
            </div>

            {/* email */}
            <div className="col-span-1 flex items-center justify-center">
                {channels.email !== null ? (
                    <input
                        type="checkbox"
                        checked={channels.email}
                        onChange={() => onToggle(item.id, "email")}
                        className="w-3.5 h-3.5 accent-[#D97706] cursor-pointer"
                    />
                ) : (
                    <span className="text-slate-300">—</span>
                )}
            </div>

            {/* sms */}
            <div className="col-span-1 flex items-center justify-center">
                {channels.sms !== null ? (
                    <input
                        type="checkbox"
                        checked={channels.sms}
                        onChange={() => onToggle(item.id, "sms")}
                        className="w-3.5 h-3.5 accent-[#D97706] cursor-pointer"
                    />
                ) : (
                    <span className="text-slate-300">—</span>
                )}
            </div>

            {/* push */}
            <div className="col-span-1 flex items-center justify-center">
                {channels.push !== null ? (
                    <input
                        type="checkbox"
                        checked={channels.push}
                        onChange={() => onToggle(item.id, "push")}
                        className="w-3.5 h-3.5 accent-[#D97706] cursor-pointer"
                    />
                ) : (
                    <span className="text-slate-300">—</span>
                )}
            </div>

            {/* in app */}
            <div className="col-span-1 flex items-center justify-center">
                {channels.inApp !== null ? (
                    <input
                        type="checkbox"
                        checked={channels.inApp}
                        onChange={() => onToggle(item.id, "inApp")}
                        className="w-3.5 h-3.5 accent-[#D97706] cursor-pointer"
                    />
                ) : (
                    <span className="text-slate-300">—</span>
                )}
            </div>
        </div>
    );
};

const ActionListCard = ({ title, description, items, footerText, onFooterClick, onItemClick }) => {
    return (
        <div className="">

            {/* Header */}
            <div className="mb-4">
                <h2 className="text-base font-semibold text-[#0B1E3D]">{title}</h2>
                {description && (
                    <p className="mt-1 text-sm text-slate-500">{description}</p>
                )}
            </div>

            {/* List */}
            <div className="space-y-2">
                {items.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onItemClick?.(item)}
                            className="group flex w-full items-center justify-between rounded-lg py-3 transition hover:bg-slate-50">
                            <div className="flex items-center gap-3">

                                <div
                                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${item.iconBg}`}>
                                    <Icon
                                        size={17}
                                        className={item.iconColor} />
                                </div>

                                <div className="text-left">
                                    <h4 className="text-[13px] font-medium text-[#0B1E3D]">{item.title}</h4>
                                    <p className="mt-0.5 text-xs text-slate-500">{item.description}</p>
                                </div>
                            </div>
                            <ChevronRight
                                size={16}
                                className="text-slate-400 transition group-hover:translate-x-1" />
                        </button>
                    );
                })}
            </div>
            {footerText && (
                <button
                    onClick={onFooterClick}
                    className="mt-4 w-full rounded-lg bg-blue-50 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-100">
                    {footerText}
                </button>
            )}
        </div>
    );
};

function SystemSetting({ setCurrentPage }) {

    const [activeTab, setActiveTab] = useState('general-settings');
    const [formData, setFormData] = useState({
        userRegistration: true,
        vehicleBidding: true,
        emailVerification: true,
        autoApproveVehicles: false,
        twoFactorAuth: true,
        chatSystem: true,
        liveAuctions: true,
        disputeSystem: true,

        emailNotifications: true,
        smsNotifications: true,
        pushNotifications: true,
        inAppNotifications: true,
    });

    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [maintenanceMessage, setMaintenanceMessage] = useState(
        "We are currently under maintenance. Please check back later."
    );

    const [notificationSettings, setNotificationSettings] = useState(() => {
        return notificationPrefrences.reduce((acc, item) => {
            acc[item.id] = { ...item.channels };
            return acc;
        }, {});
    });

    const [selectedTestUser, setSelectedTestUser] = useState('');
    const [selectedTestChannel, setSelectedTestChannel] = useState('Email');

    const [selectedModule, setSelectedModule] = useState();
    const [selectedAction, setSelectedAction] = useState();

    // tabs
    const tabs = [
        { id: 'general-settings', label: 'General Settings', },
        { id: 'notification-settings', label: 'Notification Settings', },
        { id: 'system-logs', label: 'System Logs', },
    ];

    // feature - toggle
    const updateField = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleToggle = (field) => {
        updateField(field, !formData[field]);
    };

    // notification checkbox toggle
    const handleNotificationToggle = (notificationId, channel) => {
        setNotificationSettings(prev => ({
            ...prev,
            [notificationId]: {
                ...prev[notificationId],
                [channel]: !prev[notificationId][channel]
            }
        }));
    };

    // notification - test
    const handleSendTest = () => {
        console.log("Sending test notification to:", selectedUser, "via", selectedChannel);
    };

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between pb-6">
                <div className="flex-1">
                    <h1 className="text-xl font-bold text-[#0B1E3D] sm:text-2xl">
                        System Settings
                    </h1>

                    <p className="mt-2 text-xs text-slate-500 sm:text-sm">
                        Manage and configure system preferences and global settings.
                    </p>
                </div>

                {/* buttons */}
                <div className="">
                    <button
                        className="flex py-2.5 items-center justify-center gap-2 rounded-lg bg-[#D97706] px-4 text-sm font-medium text-white shadow-md transition-all duration-200 hover:bg-amber-700 active:scale-[0.98]">
                        <Save size={16} />
                        <span>Save Changes</span>
                    </button>
                </div>
            </div>

            {/* tabs */}
            <div className="flex gap-10 border-b border-slate-100 my-6 overflow-x-auto no-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`pb-3 text-[14px] font-medium whitespace-nowrap border-b-2 transition-colors 
                            ${activeTab === tab.id
                                ? 'border-[#D97706] text-[#D97706]'
                                : 'border-transparent text-slate-500 hover:text-slate-700'
                            }`}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === 'system-logs' && (
                <div className="w-full my-6 bg-white border border-slate-200 rounded-xl p-4 space-y-4">

                    <div className="flex flex-wrap xl:flex-nowrap items-center gap-3">

                        {/* heading */}
                        <div className="flex-1 sm:w-75">
                            <h1 className="text-base font-semibold text-[#0B1E3D]">System Logs</h1>
                            <p className="mt-1 text-sm text-slate-500">View and monitor all system activities and events.</p>
                        </div>

                        {/* module */}
                        <div className="w-full sm:w-46">
                            <FilterDropdown
                                label="All Modules"
                                options={[
                                    { label: "Vehicle Approvals", value: "vehicle-approvals" },
                                    { label: "Payment Management", value: "payment-management" },
                                    { label: "KYC Verification", value: "kyc-verification" }
                                ]}
                                value={selectedModule}
                                onChange={setSelectedModule}
                            />
                        </div>

                        {/* actions */}
                        <div className="w-full sm:w-42">
                            <FilterDropdown
                                label="All Actions"
                                options={[
                                    { label: "Approved Vehicle", value: "approved-vehicle" },
                                    { label: "Processed Payment", value: "processed-payment" },
                                    { label: "Rejected Document", value: "rejected-document" }
                                ]}
                                value={selectedAction}
                                onChange={setSelectedAction}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* content */}
            <div className='w-full flex justify-between gap-6 pb-6'>

                {activeTab === 'general-settings' && (
                    <>
                        {/* -------------- left -------------- */}
                        <div className='w-[70%] space-y-6'>

                            {/* 1st section */}
                            <div className='bg-white rounded-xl border border-slate-100 p-4 md:p-5 shadow-sm'>
                                {/* Header */}
                                <div className="mb-5 border-b border-slate-100 pb-4">
                                    <h2 className="text-base font-semibold text-[#0B1E3D]">
                                        General Settings
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Configure your platform's basic information and preferences.
                                    </p>
                                </div>

                                <div className="flex flex-col space-y-6">

                                    {/* Site Name */}
                                    <div className="grid grid-cols-[250px_1fr] gap-4">
                                        <div className="flex gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100">
                                                <Globe size={18} className="text-slate-600" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-[#0B1E3D]">Site Name </h4>
                                                <p className="mt-1 text-xs text-slate-500">The name of your platform.</p>
                                            </div>
                                        </div>

                                        <input
                                            type="text"
                                            defaultValue="BidDrive"
                                            className="h-11 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none focus:border-[#D97706]"
                                        />
                                    </div>

                                    {/* Site Description */}
                                    <div className="grid grid-cols-[250px_1fr] gap-4">
                                        <div className="flex gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50">
                                                <FileText size={18} className="text-blue-600" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-[#0B1E3D]">Site Description</h4>
                                                <p className="mt-1 text-xs text-slate-500">A short description of your platform.</p>
                                            </div>
                                        </div>

                                        <textarea
                                            rows={3}
                                            defaultValue="BidDrive is a premium online car auction platform connecting buyers and sellers worldwide."
                                            className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#D97706]"
                                        />
                                    </div>

                                    {/* Site Logo */}
                                    <div className="grid grid-cols-[250px_1fr] gap-4">
                                        <div className="flex gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50">
                                                <ImageIcon size={18} className="text-indigo-600" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-[#0B1E3D]">Site Logo</h4>
                                                <p className="mt-1 text-xs text-slate-500">Upload your platform logo.</p>
                                            </div>
                                        </div>

                                        <div className="rounded-lg border border-dashed border-slate-300 p-5 text-center">
                                            <img
                                                src="/logo.png"
                                                alt="Logo"
                                                className="mx-auto h-10 object-contain" />

                                            <button
                                                type="button"
                                                className="mt-4 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-[#D97706] transition hover:bg-amber-50">
                                                Change Logo
                                            </button>
                                            <p className="mt-2 text-xs text-slate-400">PNG, JPG or SVG. Max size 2MB.</p>
                                        </div>
                                    </div>

                                    {/* Currency */}
                                    <div className="grid grid-cols-[250px_1fr] gap-4">
                                        <div className="flex gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50">
                                                <DollarSign size={18} className="text-green-600" />
                                            </div>

                                            <div>
                                                <h4 className="text-sm font-medium text-[#0B1E3D]">Default Currency</h4>
                                                <p className="mt-1 text-xs text-slate-500">Select the default currency.</p>
                                            </div>
                                        </div>

                                        <input
                                            type="text"
                                            readOnly
                                            defaultValue="AED (United Arab Emirates Dirham)"
                                            className="h-11 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none focus:border-[#D97706]"
                                        />
                                    </div>

                                    {/* Timezone */}
                                    <div className="grid grid-cols-[250px_1fr] gap-4">
                                        <div className="flex gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50">
                                                <Clock3 size={18} className="text-orange-600" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-[#0B1E3D]">Default Timezone</h4>
                                                <p className="mt-1 text-xs text-slate-500">Select the default timezone.</p>
                                            </div>
                                        </div>

                                        <input
                                            type="text"
                                            readOnly
                                            defaultValue="(GMT+04:00) Asia/Dubai"
                                            className="h-11 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none focus:border-[#D97706]"
                                        />
                                    </div>

                                    {/* Date Format */}
                                    <div className="grid grid-cols-[250px_1fr] gap-4">
                                        <div className="flex gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                                                <CalendarDays size={18} className="text-blue-600" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-[#0B1E3D]">Date Format</h4>
                                                <p className="mt-1 text-xs text-slate-500">Select the date format.</p>
                                            </div>
                                        </div>

                                        <input
                                            type="text"
                                            readOnly
                                            defaultValue="DD MMM YYYY (20 May 2024)"
                                            className="h-11 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none focus:border-[#D97706]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* 2nd section */}
                            <div className='bg-white rounded-xl border border-slate-100 p-4 md:p-5 shadow-sm'>
                                <div className="mb-5 border-b border-slate-100 pb-4">
                                    <h2 className="text-base font-semibold text-[#0B1E3D]">
                                        Features Settings
                                    </h2>
                                </div>
                                <div className="grid gap-x-12 gap-y-5 lg:grid-cols-2">
                                    {featureSettings.map((feature) => {
                                        const Icon = feature.icon;

                                        return (
                                            <div
                                                key={feature.id}
                                                className="flex items-center justify-between">

                                                <div className="flex items-start gap-3">
                                                    <div
                                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${feature.iconBg}`}>
                                                        <Icon
                                                            size={18}
                                                            className={feature.iconColor} />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-[12px] font-medium text-[#0B1E3D]">
                                                            {feature.title}
                                                        </h4>

                                                        <p className="w-46 mt-1 text-xs leading-5 text-slate-500">
                                                            {feature.description}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Toggle */}
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggle(feature.id)}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300
                                                        ${formData[feature.id]
                                                            ? "bg-[#D97706]"
                                                            : "bg-slate-300"
                                                        }`}
                                                >
                                                    <span
                                                        className={`inline-block h-4 w-4 rounded-full bg-white transition-transform duration-300
                                                            ${formData[feature.id]
                                                                ? "translate-x-6"
                                                                : "translate-x-1"
                                                            }`}
                                                    />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>

                            </div>
                        </div>

                        {/* -------------- right -------------- */}
                        <div className='w-[30%] space-y-6'>

                            {/* 1st section */}
                            <div className='bg-white rounded-xl border border-slate-100 p-4 md:p-5 shadow-sm'>
                                <div className="mb-5 pb-2">
                                    <h2 className="text-base font-semibold text-[#0B1E3D]">
                                        System Information
                                    </h2>
                                </div>

                                <div className="space-y-4">
                                    {systemInfo.map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <div
                                                key={item.id}
                                                className="flex items-center justify-between">

                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`flex h-8 w-8 items-center justify-center rounded-full ${item.iconBg}`}>
                                                        <Icon
                                                            size={16}
                                                            className={item.iconColor}
                                                        />
                                                    </div>

                                                    <span className="text-sm font-medium text-slate-600">
                                                        {item.label}
                                                    </span>
                                                </div>

                                                {item.badge ? (
                                                    <span className="rounded-md bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                                                        {item.value}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs font-semibold text-[#0B1E3D]">
                                                        {item.value}
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 2nd section */}
                            <div className='bg-white rounded-xl border border-slate-100 p-4 md:p-5 shadow-sm'>
                                <div className="mb-5 flex items-start justify-between border-b border-slate-100 pb-4">

                                    <div>
                                        <h2 className="text-base font-semibold text-[#0B1E3D]">Maintenance Mode</h2>
                                        <p className="w-55 mt-1 text-xs leading-5 text-slate-500">When enabled, the system will be temporarily unavailable for regular users.</p>
                                    </div>

                                    {/* Toggle */}
                                    <button
                                        type="button"
                                        onClick={() => setMaintenanceMode(!maintenanceMode)}
                                        className={`relative inline-flex h-6 w-10 items-center rounded-full transition-colors duration-300
                                            ${maintenanceMode ? "bg-[#D97706]" : "bg-slate-300"}`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 rounded-full bg-white transition-transform duration-300
                                            ${maintenanceMode ? "translate-x-6" : "translate-x-1"}`}
                                        />
                                    </button>
                                </div>

                                {/* Message */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-[#0B1E3D]">Maintenance Message</label>

                                    <textarea
                                        rows={4}
                                        value={maintenanceMessage}
                                        onChange={(e) => setMaintenanceMessage(e.target.value)}
                                        placeholder="Enter maintenance message..."
                                        className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition-colors focus:border-[#D97706]"
                                    />
                                </div>

                                {/* Save Button */}
                                <button
                                    className="mt-4 w-full rounded-lg bg-blue-50 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-100">
                                    Save Maintenance Settings
                                </button>

                            </div>

                            {/* 3rd section */}
                            <div className='bg-white rounded-xl border border-slate-100 p-4 md:p-5 shadow-sm'>
                                <ActionListCard
                                    title="Quick Actions"
                                    items={quickActions}
                                    onItemClick={(item) => console.log(item)}
                                />
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'notification-settings' && (
                    <>
                        {/* -------------- left -------------- */}
                        <div className='w-[70%] space-y-6'>

                            {/* 1st section */}
                            <div className='bg-white rounded-xl border border-slate-100 p-4 md:p-5 shadow-sm'>
                                {/* Header */}
                                <div className="mb-5">
                                    <h2 className="text-base font-semibold text-[#0B1E3D]">Notification Settings</h2>
                                    <p className="mt-1 text-sm text-slate-500">Configure how and when system notifications are sent.</p>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                                    {notificationStats.map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <div
                                                key={item.id}
                                                className="rounded-xl border border-slate-200 bg-white py-4 px-2 transition-all hover:border-slate-300 hover:shadow-sm">
                                                <div className="mb-3 flex items-start justify-between">
                                                    <div
                                                        className={`flex h-10 w-10 items-center justify-center rounded-full ${item.iconBg}`}>
                                                        <Icon
                                                            size={18}
                                                            className={item.iconColor} />
                                                    </div>
                                                </div>

                                                <h3 className="text-sm font-semibold text-[#0B1E3D]">{item.title}</h3>
                                                <p className="mt-1 text-xs leading-5 text-slate-500">{item.description}</p>

                                                <button
                                                    type="button"
                                                    onClick={() => handleToggle(item.id)}
                                                    className={`mt-2 relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300
                                                        ${formData[item.id] ? "bg-[#D97706]" : "bg-slate-300"}`}>

                                                    <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform duration-300
                                                        ${formData[item.id] ? "translate-x-6" : "translate-x-1"}`} />
                                                </button>
                                            </div>
                                        );
                                    })}

                                </div>

                            </div>

                            {/* 2nd section */}
                            <div className='bg-white rounded-xl border border-slate-100 p-4 md:p-5 shadow-sm'>
                                {/* Header */}
                                <div className="mb-5 border-b border-slate-100 pb-4">
                                    <h2 className="text-base font-semibold text-[#0B1E3D]">Notification Preferences</h2>
                                    <p className="mt-1 text-sm text-slate-500">Manage notification types and frequency.</p>
                                </div>

                                <div className=''>
                                    {/* table header */}
                                    <div className="grid grid-cols-12 items-center py-3 border-b border-slate-200 bg-slate-50">

                                        <div className="col-span-8 px-4">
                                            <span className="text-[11px] font-bold text-slate-500 uppercase">Notification Type</span>
                                        </div>

                                        <div className="col-span-1 px-4">
                                            <span className="text-[11px] font-bold text-slate-500 uppercase">Email</span>
                                        </div>

                                        <div className="col-span-1 flex justify-center">
                                            <span className="text-[11px] font-bold text-slate-500 uppercase">SMS</span>
                                        </div>

                                        <div className="col-span-1 flex justify-center">
                                            <span className="text-[11px] font-bold text-slate-500 uppercase">Push</span>
                                        </div>

                                        <div className="col-span-1 flex justify-center">
                                            <span className="text-[11px] font-bold text-slate-500 uppercase">In App</span>
                                        </div>
                                    </div>

                                    {/* content */}
                                    {notificationPrefrences.map((item) => (
                                        <React.Fragment key={item.id}>
                                            <NotificationsRow
                                                item={item}
                                                settings={notificationSettings}
                                                onToggle={handleNotificationToggle}
                                            />
                                        </React.Fragment>
                                    ))}

                                </div>
                            </div>
                        </div>

                        {/* -------------- right -------------- */}
                        <div className='w-[30%] space-y-6'>

                            {/* 1st sec */}
                            <div>
                                <SummaryDonutCard
                                    title="Notification Summary"
                                    centerValue="28"
                                    centerLabel="Total Types"
                                    showPercentage={false}
                                    segments={[
                                        { name: 'Email Enabled', value: 20, color: '#3B82F6' },
                                        { name: 'SMS Enabled', value: 18, color: '#10B981' },
                                        { name: 'Push Enabled', value: 24, color: '#8B5CF6' },
                                        { name: 'In-App Enabled', value: 26, color: '#F59E0B' },
                                    ]}
                                />
                            </div>

                            {/* 2nd sec */}
                            <div className='bg-white rounded-xl border border-slate-100 p-4 md:p-5 shadow-sm'>
                                <ActionListCard
                                    title="Email Templates"
                                    description="Manage and customize email templates."
                                    items={emailTemplates}
                                    footerText="Manage Email Templates"
                                // onFooterClick={() => setCurrentPage("email-templates")}
                                />
                            </div>

                            {/* 3rd sec */}
                            <div className='bg-white rounded-xl border border-slate-100 p-4 md:p-5 shadow-sm'>
                                <div className="mb-3 border-b border-slate-100">
                                    <h2 className="text-base font-semibold text-[#0B1E3D]">Test Notification</h2>
                                    <p className="mt-1 text-sm text-slate-500">Send a test notification to verify your settings.</p>
                                </div>

                                <div className="space-y-3 ">

                                    {/* Send Test To */}
                                    <div className="flex items-center justify-between gap-8">
                                        <label className="shrink-0 text-[13px] font-medium text-slate-700">
                                            Send Test To
                                        </label>

                                        <select
                                            value={selectedTestUser}
                                            onChange={(e) => setSelectedTestUser(e.target.value)}
                                            className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-[13px] text-slate-700 focus:border-[#D97706] focus:outline-none">
                                            <option value="" disabled>Select User</option>
                                            <option value="user1">John Doe</option>
                                            <option value="user2">Sara Ahmed</option>
                                        </select>
                                    </div>

                                    {/* Select Channel */}
                                    <div className="flex items-center justify-between gap-8">
                                        <label className="shrink-0 text-[13px] font-medium text-slate-700">
                                            Select Channel
                                        </label>

                                        <select
                                            value={selectedTestChannel}
                                            onChange={(e) => setSelectedTestChannel(e.target.value)}
                                            className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-[13px] text-slate-700 focus:border-[#D97706] focus:outline-none"
                                        >
                                            <option value="Email">Email</option>
                                            <option value="SMS">SMS</option>
                                            <option value="Push">Push</option>
                                            <option value="In-App">In-App</option>
                                        </select>
                                    </div>

                                </div>

                                <button
                                    onClick={handleSendTest}
                                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-50 py-2.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100"
                                >
                                    <Send className="h-4 w-4" />
                                    <span>Send Test Notification</span>
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'system-logs' && (
                    <>
                        {/* -------------- left -------------- */}
                        <div className='w-[70%] space-y-6'>
                            <div className='bg-white rounded-xl border border-slate-100 shadow-sm'>
                                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                                    <table className="w-full text-left table-fixed">
                                        <thead className="bg-gray-100 border-b border-gray-200 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                                            <tr>
                                                <th className="px-6 py-4 w-40">Time and Date</th>
                                                <th className="px-6 py-4 w-45">User</th>
                                                <th className="px-6 py-4 w-45">Module</th>
                                                <th className="px-6 py-4 w-45">Action</th>
                                                <th className="px-6 py-4 w-50">Details</th>
                                                <th className="px-6 py-4 w-40">Ip Address</th>
                                                <th className="px-6 py-4 w-30">Status</th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-slate-100">
                                            {auditLogsData.map((audit, index) => (
                                                <tr
                                                    key={index}
                                                    className="hover:bg-slate-50/50 transition-colors text-[13px]">

                                                    {/* date */}
                                                    <td className="py-4 px-4">
                                                        <div className="flex flex-col">
                                                            <span className="font-medium text-slate-900 text-sm">{audit.date}</span>
                                                            <span className="text-xs text-slate-500">{audit.time}</span>
                                                        </div>
                                                    </td>

                                                    {/* user */}
                                                    <td className="py-4 px-4">
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-[11px] font-semibold text-purple-700">
                                                                <img
                                                                    src={audit.user.avatarUrl}
                                                                    alt='Image user'
                                                                    className='w-8 h-8 object-cover rounded-full'
                                                                />
                                                            </span>
                                                            <div>
                                                                <div className="font-medium text-slate-800">{audit.user.name}</div>
                                                                <div className="text-[11px] text-slate-400">{audit.user.role}</div>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* module */}
                                                    <td className="py-4 px-4 font-medium text-slate-800">
                                                        {audit.category}
                                                    </td>

                                                    {/* action */}
                                                    <td className="py-4 px-4 font-medium text-slate-800">
                                                        {audit.action}
                                                    </td>

                                                    {/* details */}
                                                    <td className="py-4 px-4 font-medium text-slate-800">
                                                        {audit.description}
                                                    </td>

                                                    {/* ip add */}
                                                    <td className="py-4 px-4 font-medium text-slate-500">
                                                        {audit.ipAddress}
                                                    </td>

                                                    {/* status */}
                                                    <td className="py-4 px-4">
                                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${audit.status === "Success"
                                                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                            : "bg-rose-50 text-rose-700 border border-rose-200"
                                                            }`}>
                                                            {audit.status}
                                                        </span>
                                                    </td>

                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* -------------- right -------------- */}
                        <div className='w-[30%] space-y-6'>

                            {/* 1st section */}
                            <div className='bg-white rounded-xl border border-slate-100 p-4 md:p-5 shadow-sm'>
                                <div className="mb-3 border-b border-slate-100">
                                    <h2 className="text-base font-semibold text-[#0B1E3D]">Log Summary</h2>
                                    <p className="mt-0.5 text-[13px] text-slate-500">Overview of system logs.</p>
                                </div>
                                <div className="space-y-3">
                                    {logSummaryData.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-7 h-7 rounded-lg ${item.bgColor} flex items-center justify-center ${item.textColor}`}>
                                                    {item.icon}
                                                </div>
                                                <span className="text-sm font-medium text-slate-700">{item.label}</span>
                                            </div>
                                            <span className="text-sm font-semibold text-slate-900">{item.count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 2nd section */}
                            <div className='bg-white rounded-xl border border-slate-100 p-4 md:p-5 shadow-sm'>
                                <div className="mb-3 border-b border-slate-100">
                                    <h2 className="text-base font-semibold text-[#0B1E3D]">Top Modules</h2>
                                    <p className="mt-0.5 text-[13px] text-slate-500">Most active modules.</p>

                                    <div className="space-y-3 my-5">
                                        {topModulesData.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center justify-between">
                                                <span className="text-[13px] font-medium text-slate-700">{item.name}</span>
                                                <span className="text-[13px] font-semibold text-slate-900">{item.count}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <button className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium text-sm rounded-lg transition-colors">
                                        View All Modules
                                    </button>
                                </div>
                            </div>

                            {/* 3rd section */}
                            <div className='bg-white rounded-xl border border-slate-100 p-4 md:p-5 shadow-sm'>
                                <div className="mb-3 border-b border-slate-100">
                                    <h2 className="text-base font-semibold text-[#0B1E3D]">Security Alerts</h2>
                                    <p className="mt-0.5 text-[13px] text-slate-500">Recent critical activities.</p>
                                </div>

                                <div className="space-y-4 my-5">
                                    {securityAlertsData.map((alert) => (
                                        <div key={alert.id} className="flex items-start gap-3">
                                            <div className={`w-7 h-7 rounded-lg ${alert.bgColor} flex items-center justify-center ${alert.textColor} shrink-0`}>
                                                {alert.icon}
                                            </div>
                                            <div>
                                                <h4 className="text-[13px] font-semibold text-slate-900">{alert.title}</h4>
                                                <p className="text-xs text-slate-600 mt-0.5">{alert.description}</p>
                                                <span className="text-[11px] text-slate-400 mt-1 block">{alert.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* View All Alerts Button */}
                                <button className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium text-sm rounded-lg transition-colors">
                                    View All Alerts
                                </button>
                            </div>
                        </div>
                    </>
                )}

            </div>
        </div>
    )
}

export default SystemSetting;
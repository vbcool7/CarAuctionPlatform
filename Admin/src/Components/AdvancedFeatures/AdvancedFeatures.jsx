
import React from 'react';
import { Sparkles, MessageSquare, Gavel, ShieldCheck, FileText, Car, ArrowRight, MessageCircleMore, TimerReset, Clock3, History, ChevronRight, FileClock, FileCheck2, FileX2, Building2, ClipboardCheck, BadgeCheck, UserRoundCheck, UserCheck, UserRoundX, CarFront, ShieldAlert, BadgeDollarSign, TriangleAlert, Brain, Settings2, MessageCircle } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, Cell } from 'recharts';

const statsCardsData = [
    {
        id: 'ai-predictions',
        title: 'AI Price Predictions',
        value: '1,247',
        change: '12.5% from last week',
        isPositive: true,
        icon: <Sparkles className="w-5 h-5" />,
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-600'
    },
    {
        id: 'active-convos',
        title: 'Active Conversations',
        value: '156',
        change: '8.3% from last week',
        isPositive: true,
        icon: <MessageSquare className="w-5 h-5" />,
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-600'
    },
    {
        id: 'auctions-extended',
        title: 'Auctions Extended',
        value: '28',
        change: '5.6% from last week',
        isPositive: true,
        icon: <Gavel className="w-5 h-5" />,
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-600'
    },
    {
        id: 'kyc-pending',
        title: 'KYC Pending',
        value: '42',
        change: '4.2% from last week',
        isPositive: false,
        icon: <ShieldCheck className="w-5 h-5" />,
        bgColor: 'bg-emerald-50',
        textColor: 'text-emerald-600'
    },
    {
        id: 'inspection-pending',
        title: 'Inspection Pending',
        value: '19',
        change: '3.1% from last week',
        isPositive: true,
        icon: <FileText className="w-5 h-5" />,
        bgColor: 'bg-orange-50',
        textColor: 'text-orange-600'
    }
];

const priceTrendData = [
    { date: "May 14", value: 72000 },
    { date: "May 15", value: 79000 },
    { date: "May 16", value: 71000 },
    { date: "May 17", value: 81000 },
    { date: "May 18", value: 76000 },
    { date: "May 19", value: 79000 },
    { date: "May 20", value: 75000 },
];

const liveChatStats = [
    {
        id: 1,
        label: "Buyer ↔ Seller",
        value: 128,
        color: "bg-emerald-500",
    },
    {
        id: 2,
        label: "Buyer ↔ Support",
        value: 42,
        color: "bg-blue-500",
    },
    {
        id: 3,
        label: "Seller ↔ Support",
        value: 18,
        color: "bg-violet-500",
    },
    {
        id: 4,
        label: "Unread Messages",
        value: 15,
        color: "bg-amber-500",
    },
];

const auctionExtensionStats = [
    {
        id: 1,
        label: "Auto Extension Rules",
        icon: ShieldCheck,
        iconBg: "bg-emerald-50",
        iconColor: "text-emerald-600",
        action: "Manage",
    },
    {
        id: 2,
        label: "Auctions Extended Today",
        icon: Sparkles,
        iconBg: "bg-violet-50",
        iconColor: "text-violet-600",
        value: 28,
    },
    {
        id: 3,
        label: "Last-Minute Bids",
        icon: Clock3,
        iconBg: "bg-amber-50",
        iconColor: "text-amber-600",
        value: 134,
    },
    {
        id: 4,
        label: "Extension History",
        icon: History,
        iconBg: "bg-indigo-50",
        iconColor: "text-indigo-600",
        action: "View",
    },
];

const inspectionStats = [
    {
        id: 1,
        label: "Pending Reports",
        value: 19,
        icon: FileClock,
        iconBg: "bg-amber-50",
        iconColor: "text-amber-600",
    },
    {
        id: 2,
        label: "Approved Reports",
        value: 128,
        icon: FileCheck2,
        iconBg: "bg-emerald-50",
        iconColor: "text-emerald-600",
    },
    {
        id: 3,
        label: "Rejected Reports",
        value: 6,
        icon: FileX2,
        iconBg: "bg-red-50",
        iconColor: "text-red-600",
    },
    {
        id: 4,
        label: "Inspection Providers",
        value: 3,
        icon: Building2,
        iconBg: "bg-slate-100",
        iconColor: "text-slate-600",
    },
];

const kycStats = [
    {
        id: 1,
        label: "Buyer Verification Queue",
        value: 23,
        valueColor: "text-orange-600",
        icon: UserRoundCheck,
        iconBg: "bg-orange-50",
        iconColor: "text-orange-600",
    },
    {
        id: 2,
        label: "Seller Verification Queue",
        value: 19,
        valueColor: "text-amber-600",
        icon: UserCheck,
        iconBg: "bg-amber-50",
        iconColor: "text-amber-600",
    },
    {
        id: 3,
        label: "Verified Users",
        value: "1,256",
        valueColor: "text-emerald-600",
        icon: BadgeCheck,
        iconBg: "bg-emerald-50",
        iconColor: "text-emerald-600",
    },
    {
        id: 4,
        label: "Rejected Users",
        value: 12,
        valueColor: "text-red-600",
        icon: UserRoundX,
        iconBg: "bg-red-50",
        iconColor: "text-red-600",
    },
];

const aiInsightStats = [
    {
        id: 1,
        label: "Vehicles Requiring Review",
        value: 14,
        valueColor: "text-orange-600",
        icon: CarFront,
        iconBg: "bg-orange-50",
        iconColor: "text-orange-600",
    },
    {
        id: 2,
        label: "Suspicious Bidding Detected",
        value: 7,
        valueColor: "text-red-600",
        icon: ShieldAlert,
        iconBg: "bg-red-50",
        iconColor: "text-red-600",
    },
    {
        id: 3,
        label: "Recommended Price Updates",
        value: 9,
        valueColor: "text-blue-600",
        icon: BadgeDollarSign,
        iconBg: "bg-blue-50",
        iconColor: "text-blue-600",
    },
    {
        id: 4,
        label: "High Risk Users",
        value: 5,
        valueColor: "text-red-600",
        icon: TriangleAlert,
        iconBg: "bg-red-50",
        iconColor: "text-red-600",
    },
];

const aiQuickActions = [
    {
        id: 1,
        title: "Run Price Estimation",
        icon: Sparkles,
        iconBg: "bg-violet-50",
        iconColor: "text-violet-600",
    },
    {
        id: 2,
        title: "Verify KYC Documents",
        icon: BadgeCheck,
        iconBg: "bg-emerald-50",
        iconColor: "text-emerald-600",
    },
    {
        id: 3,
        title: "Open Live Chat",
        icon: MessageCircle,
        iconBg: "bg-blue-50",
        iconColor: "text-blue-600",
    },
    {
        id: 4,
        title: "View Inspection Reports",
        icon: ClipboardCheck,
        iconBg: "bg-amber-50",
        iconColor: "text-amber-600",
    },
    {
        id: 5,
        title: "Configure Extension Rules",
        icon: TimerReset,
        iconBg: "bg-indigo-50",
        iconColor: "text-indigo-600",
    },
];

const recentAIActivities = [
    {
        id: 1,
        activity: "Price Estimation Generated",
        details: "Vehicle ID: VHC-1256",
        user: "AI Engine",
        date: "May 20, 2024 10:24 AM",
        status: "Completed",
    },
    {
        id: 2,
        activity: "Suspicious Bidding Alert",
        details: "Auction ID: AUC-7845",
        user: "AI Engine",
        date: "May 20, 2024 09:15 AM",
        status: "Flagged",
    },
    {
        id: 3,
        activity: "KYC Document Verified",
        details: "User ID: USR-5623",
        user: "System",
        date: "May 20, 2024 08:47 AM",
        status: "Verified",
    },
    {
        id: 4,
        activity: "Inspection Report Uploaded",
        details: "Vehicle ID: VHC-8421",
        user: "Inspector",
        date: "May 19, 2024 06:30 PM",
        status: "Completed",
    },
];

const aiPerformanceData = [
    {
        name: "Price Predictions",
        value: 1247,
        color: "#7C3AED",
    },
    {
        name: "Chat Resolutions",
        value: 600,
        color: "#3B82F6",
    },
    {
        name: "Auctions Extended",
        value: 280,
        color: "#F59E0B",
    },
    {
        name: "Risks Detected",
        value: 150,
        color: "#EF4444",
    },
];

const InfoListCard = ({ title, description, icon: HeaderIcon, headerIconBg, headerIconColor, items, buttonText, }) => {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 md:p-5 shadow-sm">
            <div className="flex items-start gap-3 ">
                <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${headerIconBg}`}>
                    <HeaderIcon
                        size={20}
                        className={headerIconColor}
                    />
                </div>

                <div>
                    <h3 className=" text-[15px] sm:text-base font-semibold text-[#0B1E3D]">{title}</h3>
                    <p className="mt-0.5 text-[11px] sm:text-xs text-slate-500">{description}</p>
                </div>
            </div>

            {/* List */}
            <div className="mt-2 md:mt-4 divide-y divide-slate-100">
                {items.map((item) => {
                    const Icon = item.icon;
                    return (
                        <div
                            key={item.id}
                            className="flex items-center justify-between py-1.5">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`flex h-8 w-8 items-center justify-center rounded-full ${item.iconBg}`}>
                                    <Icon
                                        size={15}
                                        className={item.iconColor}
                                    />
                                </div>
                                <span className="text-[13px] md:text-sm font-medium text-slate-700">{item.label}</span>
                            </div>

                            <span
                                className={` text-[13px] md:text-sm font-semibold ${item.valueColor}`}>
                                {item.value}
                            </span>
                        </div>
                    );
                })}
            </div>

            <button
                className="mt-4 w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 text-xs font-semibold text-blue-600 transition hover:bg-slate-100">
                {buttonText}
            </button>

        </div>
    );
};

function AdvancedFeatures({ setCurrentPage }) {
    return (
        <div className='space-y-6'>
            {/* Header */}
            <div className="flex-1">
                <h1 className="text-xl sm:text-2xl font-bold text-[#0B1E3D]">AI & Advanced Features</h1>
                <p className="mt-2 text-xs sm:text-sm text-slate-500">Manage AI-powered tools and advanced platform features.</p>
            </div>

            {/* stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-5 gap-3">
                {statsCardsData.map((stat) => (
                    <div
                        key={stat.id}
                        className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm flex items-center gap-3.5">
                        <div className={`w-11 h-11 rounded-full ${stat.bgColor} flex items-center justify-center ${stat.textColor} shrink-0`}>
                            {stat.icon}
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-slate-500 truncate">{stat.title}</p>
                            <h3 className="text-lg font-bold text-slate-900 leading-tight my-1.5">{stat.value}</h3>
                            <p className={`text-[11px] font-medium flex items-center gap-0.5 ${stat.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                                <span>{stat.isPositive ? '↑' : '↓'}</span>
                                <span className="truncate">{stat.change}</span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* 2 cards */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                {/* AI Vehicle Price Estimation Card */}
                <div className="rounded-xl border border-slate-200 bg-white p-4 md:p-5 shadow-sm">

                    {/* Header */}
                    <div className="flex items-start gap-3 pb-1">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50">
                            <Car className="h-5 w-5 text-violet-600" />
                        </div>

                        <div>
                            <h3 className="text-[15px] sm:text-base font-semibold text-[#0B1E3D]">AI Vehicle Price Estimation</h3>
                            <p className="mt-0.5 text-[11px] sm:text-xs text-slate-500">Get AI-powered market value and price suggestions.</p>
                        </div>
                    </div>

                    {/* Top Content */}
                    <div className="mt-2 md:mt-4 grid grid-cols-12 gap-4 items-center">

                        {/* Vehicle Image */}
                        <div className="col-span-12 md:col-span-4 p-2">
                            <img
                                src="https://static.vecteezy.com/system/resources/thumbnails/053/733/179/small/every-detail-of-a-sleek-modern-car-captured-in-close-up-photo.jpg"
                                alt="Vehicle"
                                className="h-28 w-full rounded-lg object-cover"
                            />
                        </div>

                        {/* Price Details */}
                        <div className="col-span-12 md:col-span-5 rounded-xl border border-slate-100 bg-slate-50 p-4 grid grid-cols-2 md:grid-cols-1 gap-4">
                            <div>
                                <p className="text-xs font-medium text-slate-500">Estimated Market Value</p>
                                <h4 className="mt-1 text-[16px] sm:text-[18px] font-bold text-emerald-600">AED 86,500</h4>
                            </div>

                            <div className="border-t md:border-t md:border-slate-200 md:pt-2 border-slate-200/0 pt-0">
                                <p className="text-xs font-medium text-slate-500">Suggested Reserve Price</p>
                                <h4 className="mt-1 text-[16px] sm:text-[18px] font-bold text-amber-600">AED 82,000</h4>
                            </div>
                        </div>

                        {/* AI Confidence section */}
                        <div className="col-span-12 md:col-span-3 flex flex-col items-center justify-center bg-white p- rounded-xl">
                            <div className="flex flex-col items-center">
                                <div className="relative flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full border-[5px] md:border-[6px] border-violet-100 shrink-0">
                                    <span className="text-base md:text-lg font-bold text-slate-900">87%</span>
                                </div>
                                <p className="mt-2 text-xs text-slate-500 text-center">AI Confidence</p>
                            </div>

                            <button className="mt-3 w-full rounded-lg border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-800 transition hover:bg-slate-50 shadow-sm">
                                View Details
                            </button>
                        </div>

                    </div>
                    {/* Chart */}
                    <div className="mt-3 sm:mt-2">
                        <h4 className="mb-1.5 text-xs font-semibold text-[#0B1E3D]">Predicted Price Trend</h4>

                        <div className="h-32 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={priceTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25} />
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>

                                    <XAxis
                                        dataKey="date"
                                        tick={{ fontSize: 10, fill: '#64748b' }}
                                        axisLine={false}
                                        tickLine={false}
                                    />

                                    <YAxis
                                        ticks={[60000, 80000, 100000]}
                                        tickFormatter={(value) => `${value / 1000}K`}
                                        tick={{ fontSize: 10, fill: '#64748b' }}
                                        axisLine={false}
                                        tickLine={false}
                                        domain={[50000, 110000]}
                                    />

                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                                        formatter={(value) => [`AED ${value.toLocaleString()}`, 'Price']}
                                    />

                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#8b5cf6"
                                        strokeWidth={2.5}
                                        fill="url(#priceGradient)"
                                        dot={{ r: 3.5, fill: "#8b5cf6", stroke: "#fff", strokeWidth: 1.5 }}
                                        activeDot={{ r: 5 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>

                {/* live chat center */}
                <div className="rounded-xl border border-slate-200 bg-white p-4 md:p-5 shadow-sm">
                    <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                            <MessageCircleMore className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-[15px] sm:text-base font-semibold text-[#0B1E3D]">Live Chat Center</h3>
                            <p className="mt-0.5 text-[11px] sm:text-xs text-slate-500">Monitor active conversations and support chats.</p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="mt-2 md:mt-5 space-y-3">
                        {liveChatStats.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-2 md:px-4 md:py-3">

                                <div className="flex items-center gap-3">
                                    <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                                    <span className="text-[13px] md:text-sm font-medium text-slate-700">{item.label}</span>
                                </div>

                                <span className="text-[13px] md:text-base font-bold text-[#0B1E3D]">{item.value}</span>
                            </div>
                        ))}
                    </div>

                    <button
                        className="mt-5 text-[13px] md:text-sm flex w-full items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 py-2.5 text-sm font-medium text-blue-600 transition hover:bg-blue-50">
                        Open Chat Center
                        <ArrowRight className="h-4 w-4" />
                    </button>

                </div>
            </div>

            {/* 3 cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                {/* Auction Extension */}
                <div className="rounded-xl border border-slate-200 bg-white p-4 md:p-5 shadow-sm">
                    <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50">
                            <TimerReset className="h-5 w-5 text-violet-600" />
                        </div>
                        <div>
                            <h3 className="text-[15px] sm:text-base font-semibold text-[#0B1E3D]">Auction Extension</h3>
                            <p className="mt-0.5 text-[11px] sm:text-xs text-slate-500">Automatically extend auctions via AI bidding.</p>
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className="mt-2 md:mt-4 divide-y divide-slate-100">
                        {auctionExtensionStats.map((item) => {
                            const Icon = item.icon;

                            return (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between py-1.5">
                                    <div className="flex items-center gap-3">

                                        <div
                                            className={`flex h-8 w-8 items-center justify-center rounded-full ${item.iconBg}`}>
                                            <Icon
                                                size={15}
                                                className={item.iconColor}
                                            />
                                        </div>

                                        <span className="text-[13px] md:text-sm font-medium text-slate-700">{item.label}</span>
                                    </div>

                                    {item.action ? (
                                        <button className="rounded-md border border-slate-200 bg-white px-1.5 md:px-3 py-1 text-[10px] md:text-[11px] font-medium text-slate-600 hover:bg-slate-50">
                                            {item.action}
                                        </button>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <span className="text-[13px] md:text-base font-semibold text-[#0B1E3D]">
                                                {item.value}
                                            </span>

                                            <ChevronRight
                                                size={15}
                                                className="hidden md:flex text-slate-400" />
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                    </div>

                    {/* Footer */}
                    <button className="mt-4 flex w-full items-center justify-center rounded-lg border border-slate-200 bg-slate-50 py-2.5 text-xs font-semibold text-blue-600 transition hover:bg-slate-100">
                        View Extension Rules
                    </button>
                </div>

                {/* Vehicle Inspection */}
                <InfoListCard
                    title="Vehicle Inspection Integration"
                    description="Track inspection reports from providers."
                    icon={ClipboardCheck}
                    headerIconBg="bg-blue-50"
                    headerIconColor="text-blue-600"
                    items={inspectionStats}
                    buttonText="View All Reports"
                />

                {/* KYC Verification */}
                <InfoListCard
                    title="KYC Verification"
                    description="Verify buyer and seller identities."
                    icon={BadgeCheck}
                    headerIconBg="bg-violet-50"
                    headerIconColor="text-violet-600"
                    items={kycStats}
                    buttonText="Go to KYC Verification"
                />

            </div>

            {/* 4 cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">

                {/* AI Insights */}
                <InfoListCard
                    title="AI Insights"
                    description="AI-generated insights and alerts."
                    icon={Brain}
                    headerIconBg="bg-purple-50"
                    headerIconColor="text-purple-600"
                    items={aiInsightStats}
                    buttonText="View All Insights"
                />

                {/* Quick Actions */}
                <div className="rounded-xl border border-slate-200 bg-white p-4 md:p-5 shadow-sm">

                    {/* Header */}
                    <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                            <Settings2 className="h-5 w-5 text-slate-600" />
                        </div>

                        <div>
                            <h3 className="text-[15px] sm:text-base font-semibold text-[#0B1E3D]">Quick Actions</h3>
                            <p className="mt-0.5 text-[11px] sm:text-xs text-slate-500">Frequently used AI & advanced tools.</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-3 divide-y divide-slate-100">
                        {aiQuickActions.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    className="group flex w-full items-center justify-between py-2">
                                    <div className="flex items-center gap-3">

                                        <div
                                            className={`flex h-7 w-7 items-center justify-center rounded-md ${item.iconBg}`}>
                                            <Icon
                                                size={14}
                                                className={item.iconColor} />
                                        </div>

                                        <span className="text-[13px] md:text-sm font-medium text-slate-700 group-hover:text-[#0B1E3D]">
                                            {item.title}
                                        </span>
                                    </div>
                                    <ChevronRight
                                        size={16}
                                        className="text-slate-400 transition group-hover:translate-x-1"
                                    />
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Recent AI Activity Logs */}
                <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
                    <div className="mb-4">
                        <h3 className=" text-[15px] sm:text-base font-semibold text-[#0B1E3D] px-4 pt-2">
                            Recent AI Activity Logs
                        </h3>
                    </div>

                    <div className="overflow-x-auto border border-gray-200 rounded-lg">
                        <table className="w-full text-left table-fixed">
                            <thead className="bg-gray-100 border-b border-gray-200 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 w-50">Activity</th>
                                    <th className="px-6 py-4 w-50">Details</th>
                                    <th className="px-6 py-4 w-30">User</th>
                                    <th className="px-6 py-4 w-50">Date & Time</th>
                                    <th className="px-6 py-4 w-30">Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {recentAIActivities.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50">

                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {item.activity}
                                        </td>

                                        <td className="px-4 py-3 text-[13px] text-gray-600">
                                            {item.details}
                                        </td>

                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {item.user}
                                        </td>

                                        <td className="px-4 py-3 text-[13px] text-gray-600 whitespace-nowrap">
                                            {item.date}
                                        </td>

                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${item.status === "Completed"
                                                    ? "bg-emerald-50 text-emerald-600"
                                                    : item.status === "Verified"
                                                        ? "bg-blue-50 text-blue-600"
                                                        : "bg-red-50 text-red-600"
                                                    }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>

                {/* Ai performance */}
                <div className="rounded-xl border border-slate-200 bg-white p-4 md:p-5 shadow-sm">
                    <div className='flex flex-col md:flex md:flex-row justify-between'>
                        <h3 className=" text-[15px] sm:text-base font-semibold text-[#0B1E3D]">AI Performance Overview</h3>

                        <select name="" id="" className='mt-3 md:mt-0 border border-gray-300 text-gray-600 text-[13px] sm:text-sm p-2 md:p-1 rounded-lg md:rounded-xl outline-none cursor-pointer'>
                            <option value="this-week">This Week</option>
                            <option value="this-week">This Week</option>
                            <option value="this-week">This Week</option>
                        </select>
                    </div>

                    <div className="mt-6 h-60">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={aiPerformanceData}
                                margin={{
                                    top: 10,
                                    right: 10,
                                    left: -20,
                                    bottom: 10,
                                }}>

                                <XAxis
                                    dataKey="name"
                                    tick={{ fontSize: 10, fill: "#64748B" }}
                                    tickLine={false}
                                    axisLine={false} />

                                <YAxis
                                    tick={{ fontSize: 11, fill: "#94A3B8" }}
                                    tickLine={false}
                                    axisLine={false} />

                                <Tooltip
                                    cursor={{ fill: "#F8FAFC" }}
                                    formatter={(value) => [value, "Count"]}
                                    contentStyle={{
                                        borderRadius: "10px",
                                        border: "1px solid #E2E8F0",
                                        fontSize: "12px",
                                    }} />

                                <Bar
                                    dataKey="value"
                                    radius={[6, 6, 0, 0]}
                                    barSize={40}>

                                    {aiPerformanceData.map((entry, index) => (
                                        <Cell
                                            key={index}
                                            fill={entry.color}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default AdvancedFeatures
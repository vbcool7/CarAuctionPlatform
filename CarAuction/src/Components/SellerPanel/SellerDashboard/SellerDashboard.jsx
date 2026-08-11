
import React from 'react';
import { IoIosStar } from "react-icons/io";
import { CarFront, Gavel, CheckCircle2, Wallet, Clock, Plus, ChevronDown, Eye, MoreVertical, Calendar, ShieldCheck, Zap, Star, Check, DollarSign } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { recentVehiclesData } from '../SellerSharedComponents/SellerData';
import SummaryDonutCard from '../SellerSharedComponents/SummaryDonutCard';

const statsData = [
    {
        id: "total-vehicles",
        title: "Total Vehicles",
        value: "12",
        subtitle: "Active Listings",
        subtitleColor: "text-green-600",
        icon: CarFront,
        iconBg: "bg-slate-100",
        iconColor: "text-slate-700",
    },
    {
        id: "active-auctions",
        title: "Active Auctions",
        value: "5",
        subtitle: "Live Now",
        subtitleColor: "text-green-600",
        icon: Gavel,
        iconBg: "bg-amber-50",
        iconColor: "text-amber-900",
    },
    {
        id: "total-sold",
        title: "Total Sold",
        value: "8",
        subtitle: "Items Sold",
        subtitleColor: "text-green-600",
        icon: CheckCircle2,
        iconBg: "bg-emerald-50",
        iconColor: "text-emerald-600",
    },
    {
        id: "total-earnings",
        title: "Total Earnings",
        value: "$48,750",
        subtitle: "All Time",
        subtitleColor: "text-green-600",
        icon: Wallet,
        iconBg: "bg-amber-50/80",
        iconColor: "text-amber-600",
    },
    {
        id: "pending-payout",
        title: "Pending Payout",
        value: "$6,250",
        subtitle: "Will be paid soon",
        subtitleColor: "text-amber-500",
        icon: Clock,
        iconBg: "bg-purple-50",
        iconColor: "text-purple-600",
        extraClass: "sm:col-span-2 lg:col-span-1",
    },
];

const earningsData = [
    { date: 'May 1', earnings: 2000 },
    { date: 'May 3', earnings: 4600 },
    { date: 'May 6', earnings: 3000 },
    { date: 'May 9', earnings: 4000 },
    { date: 'May 12', earnings: 3000 },
    { date: 'May 15', earnings: 5100 },
    { date: 'May 17', earnings: 7000 }, // Peak point near tooltip example
    { date: 'May 20', earnings: 3700 },
    { date: 'May 25', earnings: 6200 },
    { date: 'May 28', earnings: 3000 },
    { date: 'May 31', earnings: 4900 },
];

const recentActivityData = [
    {
        id: "1",
        title: "Your vehicle 2021 BMW X5 received a new bid",
        description: "New bid: $28,500",
        time: "10m ago",
        icon: Check,
        iconBg: "bg-emerald-100",
        iconColor: "text-emerald-600",
    },
    {
        id: "2",
        title: "Your vehicle 2019 Audi A6 is live for auction",
        description: "Auction started",
        time: "2h ago",
        icon: Gavel,
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
    },
    {
        id: "3",
        title: "Payout of $4,250 has been initiated",
        description: "Expected in your account in 2-3 business days",
        time: "1d ago",
        icon: DollarSign,
        iconBg: "bg-amber-100",
        iconColor: "text-amber-600",
    },
    {
        id: "4",
        title: "You received a new review",
        description: "Rating:",
        rating: 5,
        time: "2d ago",
        icon: Star,
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
    },
];

// Badge style function
const getBadgeStyle = (statusType) => {
    switch (statusType) {
        case 'live':
            return "bg-emerald-50 text-emerald-600 border-emerald-200";
        case 'upcoming':
            return "bg-blue-50 text-blue-600 border-blue-200";
        case 'sold':
            return "bg-emerald-50 text-emerald-600 border-emerald-200";
        case 'draft':
            return "bg-slate-100 text-slate-700 border-slate-200";
        default:
            return "bg-slate-100 text-slate-700 border-slate-200";
    }
};

function SellerDashboard({ setCurrentPage }) {
    return (
        <div className='pb-6'>

            {/* header */}
            <div className='w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0'>
                <div className='flex flex-col'>
                    <h1 className='text-xl md:text-2xl font-bold'>Seller Dashboard</h1>
                    <p className='text-xs md:text-sm text-gray-600 p-px'>
                        Welcome back, Michael Johnson
                    </p>
                </div>
                <div className='flex flex-col md:flex-row w-full md:w-auto gap-3'>
                    <button
                        onClick={() => setCurrentPage('add-new-vehicle')}
                        className='flex flex-1 md:flex-none items-center justify-center gap-2 px-4 py-2.5 font-medium text-white rounded-xl text-xs sm:text-sm bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-md shadow-amber-500/20 transition-all duration-200 whitespace-nowrap cursor-pointer active:scale-95'>
                        <Plus className='w-4 h-4 shrink-0' />
                        Add New Vehicle
                    </button>
                </div>
            </div>

            {/* stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 my-6">
                {statsData.map((stat) => {
                    const IconComponent = stat.icon;

                    return (
                        <div
                            key={stat.id}
                            className="bg-white p-4 md:p-5 rounded-2xl border border-slate-100 shadow-md flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-amber-200 cursor-pointer"
                        >
                            <div
                                className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${stat.iconBg} flex items-center justify-center shrink-0 transition-transform duration-300 hover:scale-105`}
                            >
                                <IconComponent
                                    className={`w-5 h-5 md:w-6 md:h-6 ${stat.iconColor}`}
                                />
                            </div>

                            <div>
                                <p className="text-xs font-medium text-slate-400">
                                    {stat.title}
                                </p>

                                <h3 className="text-lg md:text-xl font-bold text-[#0B1E3D] my-1">
                                    {stat.value}
                                </h3>

                                <p className={`text-[11px] font-semibold ${stat.subtitleColor}`}>
                                    {stat.subtitle}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* left */}
                <div className="lg:col-span-7 space-y-6">

                    {/* earning overview */}
                    <div className="w-full bg-white rounded-2xl border border-slate-200 p-4 md:p-5 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                            <h3 className="text-sm sm:text-base font-bold text-slate-900">
                                Earnings Overview
                            </h3>

                            {/* Responsive buttons wrapper */}
                            <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
                                <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">
                                    This Month
                                    <ChevronDown size={14} className="text-slate-400" />
                                </button>

                                <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">
                                    USD
                                    <ChevronDown size={14} className="text-slate-400" />
                                </button>
                            </div>
                        </div>

                        {/* Chart Container - Responsive height for mobile & desktop */}
                        <div className="w-full h-64 sm:h-74">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={earningsData}
                                    margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                                >
                                    <defs>
                                        <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748B', fontSize: 11 }}
                                        dy={10}
                                        interval="preserveStartEnd"
                                        padding={{ left: 10, right: 10 }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748B', fontSize: 12 }}
                                        ticks={[0, 2000, 4000, 6000, 8000, 10000]}
                                        tickFormatter={(value) => value === 0 ? '0' : `${value / 1000}K`}
                                    />
                                    <Tooltip
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <div className="bg-white px-3 py-2 border border-slate-200 shadow-md rounded-xl text-center">
                                                        <p className="text-[10px] text-slate-500 font-medium">May 17, 2024</p>
                                                        <p className="text-sm font-semibold text-slate-900">${payload[0].value.toLocaleString()}</p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="earnings"
                                        stroke="#F59E0B"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#earningsGradient)"
                                        activeDot={{ r: 6, fill: '#F59E0B', stroke: '#fff', strokeWidth: 2 }}
                                        dot={{
                                            stroke: '#F59E0B',
                                            strokeWidth: 2,
                                            r: 3,
                                            fill: '#fff'
                                        }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* recents vehicles */}
                    <div className="w-full bg-white rounded-2xl border border-slate-200 p-4 md:p-5 shadow-sm">
                        <div className="flex flex-row items-center justify-between gap-3 mb-4">
                            <h3 className="text-sm sm:text-base font-bold text-slate-900">
                                Recent Vehicles
                            </h3>

                            <button className="text-xs font-semibold text-amber-600 hover:text-amber-700 hover:outline-amber-700
                             transition-colors cursor-pointer self-start sm:self-auto">
                                View All
                            </button>
                        </div>

                        {/* List / Table container */}
                        <div className="overflow-x-auto">
                            <div className="min-w-175 divide-y divide-slate-100">
                                {recentVehiclesData.map((item) => {
                                    return (
                                        <div key={item.id} className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/50 px-2 rounded-xl transition-colors">

                                            {/* Left: Image & Title/Stock ID */}
                                            <div className="flex items-center gap-3.5 min-w-55">
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    className="w-14 h-10 sm:w-16 sm:h-11 rounded-xl object-cover border border-slate-200 shrink-0"
                                                />
                                                <div className="min-w-0">
                                                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                                                        {item.title}
                                                    </h4>
                                                    <p className="text-[11px] text-slate-400 font-medium truncate">
                                                        Stock ID: {item.stockId}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Status Badge */}
                                            <div className="w-27.5 shrink-0">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] md:text-[11px] font-semibold border ${getBadgeStyle(item.statusType)}`}>
                                                    {item.status}
                                                </span>
                                            </div>

                                            {/* Price Column */}
                                            <div className="w-25 shrink-0">
                                                <p className="text-[10px] sm:text-[11px] font-medium text-slate-400">
                                                    {item.priceLabel}
                                                </p>
                                                <p className="text-xs sm:text-sm font-semibold text-slate-900">
                                                    {item.price}
                                                </p>
                                            </div>

                                            {/* Time Column */}
                                            <div className="w-28 shrink-0">
                                                <p className="text-[10px] sm:text-[11px] font-medium text-slate-400">
                                                    {item.timeLabel}
                                                </p>
                                                <p className={`text-xs sm:text-sm font-semibold ${item.statusType === 'live' ? 'text-red-500' : 'text-slate-900'}`}>
                                                    {item.timeValue}
                                                </p>
                                            </div>

                                            {/* Views Column */}
                                            <div className="w shrink-0 flex items-center gap-1.5 text-slate-500">
                                                <Eye size={14} className="text-slate-400 shrink-0" />
                                                <span className="text-xs sm:text-sm font-medium text-slate-700">
                                                    {item.views} <span className='text-xs pl-1 text-gray-500'>Views</span>
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* right */}
                <div className="lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">

                    {/* donut */}
                    <SummaryDonutCard
                        title="Vehicle Status"
                        centerValue="12"
                        centerLabel="Total"
                        showPercentage={true}
                        segments={[
                            { name: 'Live Auctions', value: 5, color: '#22C55E' },
                            { name: 'Upcoming Auctions', value: 3, color: '#3B82F6' },
                            { name: 'Sold', value: 2, color: '#F59E0B' },
                            { name: 'Draft', value: 2, color: '#9CA3AF' },
                        ]}
                    />

                    {/* acc summary */}
                    <div className="w-full bg-white rounded-2xl border border-slate-200 p-4 md:p-5 shadow-sm">
                        <h3 className="text-sm sm:text-base font-bold text-slate-900">
                            Account Summary
                        </h3>

                        <div className='mt-4 space-y-3'>
                            <div className='flex justify-between items-center'>
                                <div className='flex gap-2'>
                                    <Calendar className='w-4 h-4 text-gray-400' />
                                    <h1 className='text-slate-700 text-[13px] md:text-sm'>Seller Since</h1>
                                </div>
                                <p className='text-[13px] md:text-sm font-semibold text-slate-900'>14 Feb 2024</p>
                            </div>

                            <div className='flex justify-between items-center'>
                                <div className='flex gap-2'>
                                    <ShieldCheck className='w-4 h-4 text-gray-400' />
                                    <h1 className='text-slate-700 text-[13px] md:text-sm'>Verification Status</h1>
                                </div>
                                <p className='text-[11px] md:text-[12px] font-semibold text-green-600'>Verified</p>
                            </div>

                            <div className='flex justify-between items-center'>
                                <div className='flex gap-2'>
                                    <Zap className='w-4 h-4 text-gray-400' />
                                    <h1 className='text-slate-700 text-[13px] md:text-sm'>Response Rate</h1>
                                </div>
                                <p className='text-[13px] md:text-sm font-semibold text-slate-900'>98%</p>
                            </div>

                            <div className='flex justify-between items-center'>
                                <div className='flex gap-2'>
                                    <Star className='w-4 h-4 text-gray-400' />
                                    <h1 className='text-slate-700 text-[13px] md:text-sm'>Total Reviews</h1>
                                </div>

                                <div className='px-2 py-0.5 bg-orange-50 border border-orange-100 rounded-lg flex items-center gap-1'>
                                    <IoIosStar className='h-3 w-3 text-yellow-600' />
                                    <p className='text-[13px] md:text-sm font-semibold text-yellow-600'>4.8</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* recent activity */}
                    <div className="w-full bg-white rounded-2xl border border-slate-200 p-4 md:p-5 shadow-sm">
                        <div className="flex flex-row items-center justify-between gap-3 mb-4">
                            <h3 className="text-sm sm:text-base font-bold text-slate-900">
                                Recent Activity
                            </h3>

                            <button className="text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors cursor-pointer self-start sm:self-auto">
                                View All
                            </button>
                        </div>

                        {/* Timeline List */}
                        <div className="relative divide-y divide-slate-100">
                            {recentActivityData.map((item) => {
                                const IconComponent = item.icon;
                                return (
                                    <div key={item.id} className="py-3.5 flex items-start justify-between gap-4 relative z-10">

                                        {/* Left: Icon & Text content */}
                                        <div className="flex items-start gap-3.5 min-w-0">
                                            <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full ${item.iconBg} flex items-center justify-center shrink-0`}>
                                                <IconComponent className={`w-3.5 h-3.5 md:w-4 md:h-4 ${item.iconColor}`} />
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-[11px] sm:text-[12px] font-bold text-slate-900">
                                                    {item.title}
                                                </h4>

                                                {/* Description / Rating */}
                                                <div className="flex items-center gap-1.5 mt-0.5 text-[10px] sm:text-xs text-slate-500 font-medium">
                                                    <span>{item.description}</span>
                                                    {item.rating && (
                                                        <div className="flex items-center gap-0.5 text-amber-400">
                                                            {[...Array(item.rating)].map((_, i) => (
                                                                <Star key={i} size={13} fill="currentColor" />
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right: Time */}
                                        <div className="shrink-0 text-right">
                                            <span className="text-[11px] sm:text-xs font-medium text-slate-400">
                                                {item.time}
                                            </span>
                                        </div>

                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default SellerDashboard;
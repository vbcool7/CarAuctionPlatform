
import React, { useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, Download, Users, Gavel, Wallet, TrendingUp, ArrowUp, Info, User, Car, ShieldCheck, Truck, Shield, Server, CreditCard, Mail, Database, Activity } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, AreaChart, Area, YAxis, XAxis, CartesianGrid, Tooltip, } from 'recharts';
import CustomDropdown from '../SharedComponents/CustomDropDown';

import { useGetAllAuctionStats } from '../../hooks/useAuction';
import SummaryDonutCard from '../SharedComponents/SummaryDonutCard';
import { useGetAdminDashboardStats } from '../../hooks/useAdmin';
import { formatLabel, formatPrice } from '../utils/formatter';

// Data for each sparkline
const data = [
    { value: 10 }, { value: 15 }, { value: 8 }, { value: 20 },
    { value: 12 }, { value: 25 }, { value: 18 }, { value: 30 }
];

// stats fun
const StatCard = ({ title, value, trend, icon: Icon, color, chartColor }) => (
    <div className="bg-white p-5 md:px-5 md:py-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
        <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${color}`}>
                <Icon className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
                <p className="text-gray-500 text-sm font-medium">{title}</p>
                <h3 className="text-xl font-bold">{value}</h3>
            </div>
        </div>

        <div className="mt-4">
            <p className="text-green-600 text-xs font-semibold flex items-center gap-1">
                <ArrowUp className="w-3 h-3" /> {trend}
            </p>
            <div className="hidden md:flex h-10 w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke={chartColor}
                            strokeWidth={2}
                            dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>
);

const RANGE_MAP = {
    "This Week": "this_week",
    "One Week Ago": "last_week",
    "Two Weeks Ago": "two_weeks_ago",
};

// system
const overview = [
    { id: 1, icon: Server, title: "Server Status", status: "Healthy", theme: "bg-green-50 text-green-700", },
    { id: 2, icon: CreditCard, title: "Payment Gateway", status: "Online", theme: "bg-yellow-50 text-yellow-700", },
    { id: 3, icon: Mail, title: "Email Service", status: "Operational", theme: "bg-blue-50 text-blue-700", },
    { id: 4, icon: Database, title: "Storage Usage", status: "72%", theme: "bg-orange-50 text-orange-700", },
    { id: 5, icon: Activity, title: "Active Sessions", status: "1,234", theme: "bg-red-50 text-red-700", }
];

const getActivityStyle = (type) => {
    if (type?.includes("payment") || type?.includes("payout")) {
        return { icon: Wallet, theme: "bg-green-50 text-green-600" };
    }

    if (type?.includes("auction") || type?.includes("bid")) {
        return { icon: Gavel, theme: "bg-purple-50 text-purple-600" };
    }

    if (type?.includes("vehicle")) {
        return { icon: Car, theme: "bg-blue-50 text-blue-600" };
    }

    return { icon: User, theme: "bg-orange-50 text-orange-600" };
};

const getCategoryStyle = (name) => {
    const category = name?.toLowerCase();

    if (category === "suv" || category === "sedan") {
        return { icon: Car, color: "bg-blue-500", theme: "bg-blue-50 text-blue-700" };
    }

    if (category?.includes("truck") || category === "van" || category === "pickup_truck") {
        return { icon: Truck, color: "bg-green-500", theme: "bg-green-50 text-green-700" };
    }

    return { icon: Shield, color: "bg-purple-500", theme: "bg-purple-50 text-purple-700" };
};

const formatActivityTime = (date) => {
    if (!date) return "";

    return new Intl.DateTimeFormat("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Dubai",
    }).format(new Date(date));
};

function Dashboard() {

    const [selectedWeek, setSelectedWeek] = useState("This Week");
    const options = Object.keys(RANGE_MAP);

    const range = RANGE_MAP[selectedWeek];

    const dashboardQuery = useGetAdminDashboardStats(range);
    const dashboard = dashboardQuery.data?.data;

    const { data: allAuctionStats } = useGetAllAuctionStats();
    const statsData = allAuctionStats?.data;
    const summary = dashboard?.summary;

    if (dashboardQuery.isLoading) {
        return <p className="p-10 text-center">Loading dashboard data....</p>;
    }

    if (dashboardQuery.isError) {
        return (
            <p className="p-10 text-center text-red-500">
                Failed to load dashboard data
            </p>
        );
    }

    return (
        <div className='space-y-8 pb-6'>

            {/* header */}
            <div className='w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0'>

                <div className='flex flex-col'>
                    <h1 className='text-xl md:text-2xl font-bold'>Dashboard</h1>
                    <p className='text-xs md:text-sm text-gray-600 p-px'>
                        Welcome back, Admin! Here's what's happening with BidDrive today.
                    </p>
                </div>

                <div className='flex flex-col md:flex md:flex-row w-full md:w-auto gap-3'>
                    <div className='flex flex-1 md:flex-none items-center justify-center gap-2 px-3 py-2 font-semibold border border-gray-300 text-gray-700 rounded-lg text-[13px] bg-white hover:bg-gray-50 transition-colors cursor-pointer'>
                        <Calendar className='w-4 h-4' />
                        <span className='whitespace-nowrap'>May 14 - May 20, 2024</span>
                    </div>

                    <button className='flex flex-1 md:flex-none items-center justify-center gap-2 px-3 py-2 font-semibold border border-gray-300 text-gray-700 rounded-lg text-[13px] bg-white hover:bg-gray-50 transition-colors whitespace-nowrap'>
                        <Download className='w-4 h-4' />
                        Export
                    </button>
                </div>
            </div>

            {/* stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <StatCard title="Total Users" value={summary?.totalUsers ?? 0} trend="Registered buyers & sellers" icon={Users} color="bg-blue-50 text-blue-600" chartColor="#2563eb" />
                <StatCard title="Total Auctions" value={summary?.totalAuctions ?? 0} trend="Approved vehicle listings" icon={Gavel} color="bg-purple-50 text-purple-600" chartColor="#7c3aed" />
                <StatCard title="Revenue (AED)" value={formatPrice(summary?.revenue) ?? 0} trend={`${summary?.trends?.revenuePercent ?? 0}% from previous week`} icon={Wallet} color="bg-green-50 text-green-600" chartColor="#059669" />
                <StatCard title="Active Bids" value={summary?.activeBids ?? 0} trend="Currently active bids" icon={TrendingUp} color="bg-orange-50 text-orange-600" chartColor="#d97706" />
            </div>

            {/* charts */}
            <div className='grid grid-cols-1 xl:grid-cols-2 gap-5'>

                {/* =============== sales graph  =============== */}
                <div className="w-full bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col">

                    {/* Sales Overview header */}
                    <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                        <div className="flex items-center gap-1.5">
                            <h2 className="text-base font-bold text-gray-900">
                                Sales Overview
                            </h2>
                            <Info size={14} className="text-gray-400" />
                        </div>

                        <div className="mt-3 md:mt-0">
                            <CustomDropdown
                                selected={selectedWeek}
                                onChange={setSelectedWeek}
                                options={options}
                            />
                        </div>
                    </div>

                    <div className="relative w-full h-50 shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={dashboard?.salesOverview ?? []}
                                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                                    </linearGradient>
                                </defs>

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="#f3f4f6"
                                />

                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: "#9ca3af" }}
                                    dy={8}
                                />

                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    width={45}
                                    tickMargin={4}
                                    tickFormatter={(value) =>
                                        value >= 1_000_000
                                            ? `${(value / 1_000_000).toFixed(1)}M`
                                            : value >= 1_000
                                                ? `${(value / 1_000).toFixed(0)}K`
                                                : value
                                    }
                                    tick={{ fontSize: 12, fill: "#9ca3af" }}
                                />

                                <Tooltip
                                    content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-xl text-xs border border-gray-800">
                                                    <p className="text-gray-400 mb-1 font-medium">{label}</p>
                                                    <div className="flex items-center gap-1.5 font-semibold">
                                                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                                        <span>AED {Number(payload[0].value).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />

                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#2563eb"
                                    strokeWidth={2.5}
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                    dot={false}
                                    activeDot={{
                                        r: 6,
                                        fill: "#2563eb",
                                        strokeWidth: 2.5,
                                        stroke: "#ffffff",
                                    }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                </div>

                {/* =============== auction performance =============== */}
                <SummaryDonutCard
                    title="Auction Performance"
                    centerLabel="Total"
                    showPercentage={true}
                    segments={[
                        {
                            name: "Live",
                            value: statsData?.liveAuctions ?? 0,
                            color: "#10B981",
                        },
                        {
                            name: "Upcoming",
                            value: statsData?.upcomingAuctions ?? 0,
                            color: "#3B82F6",
                        },
                        {
                            name: "Completed",
                            value: statsData?.completedAuctions ?? 0,
                            color: "#34D399",
                        },
                        {
                            name: "Canceled",
                            value: statsData?.canceledAuctions ?? 0,
                            color: "#EF4444",
                        },
                    ]}
                />
            </div>

            {/* bottom section */}
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'>

                {/* Recent Activities */}
                <div className="w-full bg-white p-4 md:p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <h2 className="text-[14px] md:text-base font-bold text-gray-900 mb-5 md:mb-6">
                        Recent Activities
                    </h2>

                    <div className="space-y-3 md:space-y-4">
                        {dashboard?.recentActivities?.length ? (
                            dashboard.recentActivities.map((activity) => {

                                const { icon: Icon, theme } = getActivityStyle(activity.type);

                                return (
                                    <div
                                        key={activity.id}
                                        className="flex items-center justify-between gap-3"
                                    >
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div className={`shrink-0 p-2 rounded-full ${theme}`}>
                                                <Icon className="w-4 h-4" />
                                            </div>

                                            <div className="min-w-0">
                                                <p className="text-[13px] font-medium text-gray-700 truncate">
                                                    {activity.title}
                                                </p>
                                                {activity.message && (
                                                    <p className="text-[11px] text-gray-500 truncate">
                                                        {activity.message}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <span className="shrink-0 text-[10px] text-gray-500 text-end">
                                            {formatActivityTime(activity.createdAt)}
                                        </span>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-sm text-gray-500">No recent activities.</p>
                        )}
                    </div>
                </div>

                {/* Top Performing Categories */}
                <div className="w-full max-w-md bg-white p-4 md:p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <h2 className="text-[15px] md:text-lg font-bold text-gray-900 mb-5 md:mb-6">
                        Top Performing Categories
                    </h2>

                    <div className="space-y-7">
                        {dashboard?.categories?.length ? (
                            dashboard.categories.map((category) => {
                                const { icon: Icon, color, theme } = getCategoryStyle(category.name);

                                return (
                                    <div
                                        key={category.name}
                                        className="flex items-center gap-2 md:gap-4"
                                    >
                                        <div className={`p-2 rounded-full ${theme}`}>
                                            <Icon className="w-4 h-4" />
                                        </div>

                                        <span className="w-16 truncate font-medium text-[13px] md:text-sm">
                                            {formatLabel(category.name)}
                                        </span>

                                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${color}`}
                                                style={{ width: `${category.percentage}%` }}
                                            />
                                        </div>

                                        <span className="w-10 text-right text-[13px] md:text-sm font-bold">
                                            {category.percentage}%
                                        </span>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-sm text-gray-500">No category data available.</p>
                        )}
                    </div>
                </div>

                {/* =============== system overview =============== */}
                <div className="bg-white p-4 md:p-5 rounded-2xl border border-gray-100 shadow-sm w-full max-w-md">

                    <h2 className="text-[15px] md:text-lg font-bold text-gray-900 mb-5 md:mb-6">
                        System Overview
                    </h2>

                    <div className="space-y-3 md:space-y-4">
                        {overview.map((item) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 md:gap-4">
                                        <div className={`p-2 rounded-full ${item.theme}`}>
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <span className="text-[13px] md:text-sm font-medium text-gray-700">{item.title}</span>
                                    </div>
                                    <span className={`px-3 py-1 rounded-md text-[11px] md:text-xs font-semibold ${item.theme}`}>
                                        {item.status}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    <button className="w-full mt-6 py-3 text-[13px] md:text-sm font-semibold text-[#D97706] border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                        View System Logs
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;
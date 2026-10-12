
import React, { useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, Download, Users, Gavel, Wallet, TrendingUp, ArrowUp, Info, User, Car, ShieldCheck, Truck, Shield, Server, CreditCard, Mail, Database, Activity } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, AreaChart, Area, YAxis, XAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';
import CustomDropdown from '../SharedComponents/CustomDropDown';

import { useGetAllAuctionStats } from '../../hooks/useAuction';
import SummaryDonutCard from '../SharedComponents/SummaryDonutCard';

// Data for each sparkline
const data = [
    { value: 10 }, { value: 15 }, { value: 8 }, { value: 20 },
    { value: 12 }, { value: 25 }, { value: 18 }, { value: 30 }
];

// stats fun
const StatCard = ({ title, value, trend, icon: Icon, color, chartColor }) => (
    <div className="bg-white p-5 md:px-6 md:py-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
        <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${color}`}>
                <Icon className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
                <p className="text-gray-500 text-sm font-medium">{title}</p>
                <h3 className="text-xl md:text-2xl font-bold">{value}</h3>
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

// sales graph
const salesData = [
    { name: 'May 14', value: 200000 },
    { name: 'May 15', value: 500000 },
    { name: 'May 16', value: 400000 },
    { name: 'May 17', value: 800000 },
    { name: 'May 18', value: 550000 },
    { name: 'May 19', value: 750000 },
    { name: 'May 20', value: 950000 },
];

const RANGE_MAP = {
    "This Week": "this_week",
    "One Week Ago": "last_week",
    "Two Weeks Ago": "two_weeks_ago",
};

// recent acti
const activities = [
    { id: 1, icon: User, theme: "bg-blue-50 text-blue-600", title: "New user registered", time: "2 mins ago" },
    { id: 2, icon: Gavel, theme: "bg-purple-50 text-purple-600", title: "Auction #AU-1256 created", time: "15 mins ago" },
    { id: 3, icon: Wallet, theme: "bg-green-50 text-green-600", title: "Payment received from John Doe", time: "25 mins ago" },
    { id: 4, icon: Car, theme: "bg-blue-50 text-blue-600", title: "Vehicle #VH-245 approved", time: "1 hour ago" },
    { id: 5, icon: ShieldCheck, theme: "bg-orange-50 text-orange-600", title: "Bid placed on Auction #AU-1254", time: "2 hours ago" }
];

// cat
const categories = [
    { id: 1, name: "SUV", percentage: 45, icon: Car, color: "bg-blue-500", theme: "bg-blue-50 text-blue-700", },
    { id: 2, name: "Sedan", percentage: 30, icon: Gavel, color: "bg-purple-500", theme: "bg-purple-50 text-purple-700", },
    { id: 3, name: "Trucks", percentage: 15, icon: Truck, color: "bg-green-500", theme: "bg-green-50 text-green-700", },
    { id: 4, name: "Others", percentage: 10, icon: Shield, color: "bg-orange-500", theme: "bg-orange-50 text-orange-700", },
];

// system
const overview = [
    { id: 1, icon: Server, title: "Server Status", status: "Healthy", theme: "bg-green-50 text-green-700", },
    { id: 2, icon: CreditCard, title: "Payment Gateway", status: "Online", theme: "bg-yellow-50 text-yellow-700", },
    { id: 3, icon: Mail, title: "Email Service", status: "Operational", theme: "bg-blue-50 text-blue-700", },
    { id: 4, icon: Database, title: "Storage Usage", status: "72%", theme: "bg-orange-50 text-orange-700", },
    { id: 5, icon: Activity, title: "Active Sessions", status: "1,234", theme: "bg-red-50 text-red-700", }
];

function Dashboard() {

    const [dateRange, setDateRange] = useState([new Date(), new Date()]);
    const [startDate, endDate] = dateRange;

    const [selectedWeek, setSelectedWeek] = useState("This Week");
    const options = Object.keys(RANGE_MAP);

    // auction graph
    const { data: allAuctionStats } = useGetAllAuctionStats();
    const statsData = allAuctionStats?.data;

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
                <StatCard
                    title="Total Users"
                    value="12,458"
                    trend="12.5% from last week"
                    icon={Users}
                    color="bg-blue-50 text-blue-600"
                    chartColor="#2563eb" />

                <StatCard title="Total Auctions" value="1,245" trend="8.7% from last week" icon={Gavel} color="bg-purple-50 text-purple-600" chartColor="#7c3aed" />
                <StatCard title="Revenue (AED)" value="1,234,567" trend="15.4% from last week" icon={Wallet} color="bg-green-50 text-green-600" chartColor="#059669" />
                <StatCard title="Active Bids" value="3,456" trend="10.2% from last week" icon={TrendingUp} color="bg-orange-50 text-orange-600" chartColor="#d97706" />
            </div>

            {/* charts */}
            <div className='grid grid-cols-1 xl:grid-cols-2 gap-5'>

                {/* =============== sales graph  =============== */}
                <div className="w-full bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col">

                    {/* header */}
                    <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                        <div className="flex items-center gap-1.5">
                            <h2 className="text-base font-bold text-gray-900">
                                Sales Overview
                            </h2>
                            <Info size={14} className="text-gray-400" />
                        </div>

                        {/* drop down */}
                        <div className='mt-3 md:mt-0'>
                            <CustomDropdown
                                selected={selectedWeek}
                                onChange={setSelectedWeek}
                                options={options}
                            />
                        </div>
                    </div>

                    <div className="relative w-full h-50 shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={salesData} margin={{ top: 0, right: 0, left: 8, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                </defs>

                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#6b7280' }}
                                    padding={{ left: 10 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    width={38}
                                    tickMargin={4}
                                    tickFormatter={(value) => value >= 1000000 ? `${value / 1000000}M` : `${value / 1000}K`}
                                    tick={{ fontSize: 12 }}
                                />
                                <Tooltip />
                                <Area
                                    type="linear"
                                    dataKey="value"
                                    stroke="#2563eb"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                    dot={{ r: 4, fill: '#2563eb', strokeWidth: 0 }}
                                    activeDot={{ r: 6, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
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

                {/* =============== recent activities =============== */}
                <div className="w-full bg-white p-4 md:p-5 rounded-2xl border border-gray-100 shadow-sm ">

                    <h2 className="text-[14px] md:text-base font-bold text-gray-900 mb-5 md:mb-6">
                        Recent Activities
                    </h2>

                    <div className="space-y-3 md:space-y-4">
                        {activities.map((activity) => {
                            const Icon = activity.icon;
                            return (
                                <div
                                    key={activity.id}
                                    className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${activity.theme}`}>
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <p className="text-[13px] md:text-sm font-medium text-gray-700">{activity.title}</p>
                                    </div>
                                    <span className="text-[12px] text-gray-400 text-end">{activity.time}</span>
                                </div>
                            );
                        })}
                    </div>

                    <button
                        className="w-full mt-4 py-2 md:py-3 text-[13px] md:text-sm font-semibold text-[#D97706] border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                        View All Activities
                    </button>
                </div>

                {/* =============== top categories =============== */}
                <div className="bg-white p-4 md:p-5 rounded-2xl border border-gray-100 shadow-sm w-full max-w-md">

                    <h2 className="text-[15px] md:text-lg font-bold text-gray-900 mb-5 md:mb-6">
                        Top Performing categories
                    </h2>

                    <div className="space-y-7">
                        {categories.map((cat) => {
                            const Icon = cat.icon;
                            return (
                                <div
                                    key={cat.id}
                                    className="flex items-center gap-2 md:gap-4">

                                    <div className={`p-2 rounded-full ${cat.theme}`}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <span className="w-10 md:w-16 font-medium text-[13px] md:text-sm">
                                        {cat.name}
                                    </span>

                                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${cat.color}`}
                                            style={{ width: `${cat.percentage}%` }}
                                        />
                                    </div>

                                    <span className="w-10 text-right text-[13px] md:text-sm font-bold">
                                        {cat.percentage}%
                                    </span>
                                </div>
                            )
                        })}
                    </div>

                    <button className="w-full mt-8 py-3 text-[13px] md:text-sm font-semibold text-[#D97706] border border-gray-100 rounded-lg hover:bg-gray-50">
                        View All Categories
                    </button>
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
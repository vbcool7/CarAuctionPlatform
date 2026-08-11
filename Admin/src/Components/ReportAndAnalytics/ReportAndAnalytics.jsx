
import React, { useState } from 'react';
import { BadgeDollarSign, BadgePercent, Calendar, CarFront, ChartNoAxesCombined, ChevronDown, CircleCheck, Clock3, Info, Timer } from 'lucide-react';
import { Users, Gavel, Wallet, TrendingUp, ArrowUp } from 'lucide-react';
import { FaFileExcel, FaFilePdf } from 'react-icons/fa';
import { LineChart, Line, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

// Data for each sparkline
const data = [
    { value: 10 }, { value: 15 }, { value: 8 }, { value: 20 },
    { value: 12 }, { value: 25 }, { value: 18 }, { value: 30 }
];

// helper - stats
const StatCard = ({ title, value, trend, icon: Icon, color, chartColor }) => (
    <div className="bg-white p-4 md:px-5 md:py-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
        <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-lg ${color}`}>
                <Icon className="w-5 h-5" />
            </div>

            <div>
                <p className="text-gray-500 text-xs font-medium">
                    {title}
                </p>

                <h3 className="text-[15px] md:text-xl font-bold text-[#0B1E3D]">
                    {value}
                </h3>
            </div>
        </div>

        <div className="mt-3">
            <p className="flex items-center gap-1 text-[11px] font-semibold text-green-600">
                <ArrowUp className="h-3 w-3" />
                {trend}
            </p>

            <div className="mt-2 hidden h-8 w-full md:flex">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} accessibilityLayer={false}>
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke={chartColor}
                            strokeWidth={2}
                            strokeDasharray="4 3"
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>
);

// revenue
const revenueData = [
    { date: 'May 14', revenue: 250000 },
    { date: 'May 15', revenue: 420000 },
    { date: 'May 16', revenue: 380000 },
    { date: 'May 17', revenue: 860430 },
    { date: 'May 18', revenue: 620000 },
    { date: 'May 19', revenue: 950000 },
    { date: 'May 20', revenue: 1150000 },
];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-md">
                <p className="text-xs font-semibold text-[#0B1E3D]">{label}, 2024</p>
                <p className="text-xs text-slate-500">
                    Revenue: <span className="font-semibold text-orange-600">AED {payload[0].value.toLocaleString()}</span>
                </p>
            </div>
        );
    }
    return null;
};

// helper - donut
const DonutCard = ({ title, centerValue, centerLabel, segments = [], showPercentage = true, }) => {

    const total = segments.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">

            {/* Header */}
            <h3 className="lg:mb-5 text-[13px] md:text-base font-bold text-[#0B1E3D]">
                {title}
            </h3>

            <div className="flex flex-col lg:flex-row items-center justify-center xl:justify-start lg:gap-8">

                {/* Donut */}
                <div className="relative w-40 h-50 shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={segments}
                                dataKey="value"
                                innerRadius={55}
                                outerRadius={75}
                                startAngle={90}
                                endAngle={-270}
                                paddingAngle={2}
                                stroke="none"
                            >
                                {segments.map((item, index) => (
                                    <Cell
                                        key={index}
                                        fill={item.color}
                                    />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>

                    {/* Center */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-xl md:text-2xl font-bold text-[#0B1E3D]">
                            {centerValue}
                        </span>

                        <span className="text-xs text-slate-500">
                            {centerLabel}
                        </span>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex flex-col gap-2 w-full sm:w-50">
                    {segments.map((item) => (
                        <div
                            key={item.name}
                            className="flex items-center gap-3"
                        >
                            <span
                                className="h-2.5 w-2.5 rounded-full"
                                style={{ backgroundColor: item.color }}
                            />

                            <span className="flex-1 text-[13px] md:text-sm text-slate-700">
                                {item.name}
                            </span>

                            <span className="text-[13px] md:text-sm font-medium text-slate-500">
                                {item.value}

                                {showPercentage && (
                                    <span className="ml-1 text-slate-400">
                                        ({((item.value / total) * 100).toFixed(1)}%)
                                    </span>
                                )}
                            </span>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

// bid activity
const bidActivityData = [
    { date: "May 14", bids: 1400 },
    { date: "May 15", bids: 2600 },
    { date: "May 16", bids: 3800 },
    { date: "May 17", bids: 4300 },
    { date: "May 19", bids: 2900 },
    { date: "May 20", bids: 3100 },
];

// user growth
const userGrowthData = [
    { date: 'May 14', users: 3000 },
    { date: '', users: 4500 },
    { date: 'May 15', users: 6000 },
    { date: '', users: 6500 },
    { date: 'May 16', users: 7500 },
    { date: '', users: 9500 },
    { date: 'May 17', users: 10200 },
    { date: '', users: 8300 },
    { date: 'May 18', users: 8600 },
    { date: '', users: 9800 },
    { date: 'May 19', users: 10500 },
    { date: '', users: 11200 },
    { date: 'May 20', users: 12000 },
];

const UserGrowthTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length && label) {
        return (
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-md">
                <p className="text-xs font-semibold text-[#0B1E3D]">{label}, 2024</p>
                <p className="text-xs text-slate-500">
                    Users: <span className="font-semibold text-blue-600">{payload[0].value.toLocaleString()}</span>
                </p>
            </div>
        );
    }
    return null;
};

// seller , buyer
const sellersData = [
    { rank: 1, name: 'John Motors', sales: 890450, auctions: 45, color: 'bg-slate-500' },
    { rank: 2, name: 'Auto Hub', sales: 670230, auctions: 38, color: 'bg-indigo-500' },
    { rank: 3, name: 'Premium Cars', sales: 456780, auctions: 29, color: 'bg-neutral-600' },
    { rank: 4, name: 'Speed Auto', sales: 345120, auctions: 22, color: 'bg-amber-600' },
    { rank: 5, name: 'CarZone', sales: 234890, auctions: 18, color: 'bg-red-500' },
];

const buyersData = [
    { rank: 1, name: 'Ahmed Khan', spent: 234567, bids: 45, color: 'bg-blue-500' },
    { rank: 2, name: 'Sarah Johnson', spent: 189450, bids: 38, color: 'bg-pink-400' },
    { rank: 3, name: 'Ali Hassan', spent: 156780, bids: 29, color: 'bg-emerald-600' },
    { rank: 4, name: 'Michael Brown', spent: 125340, bids: 22, color: 'bg-orange-500' },
    { rank: 5, name: 'David Wilson', spent: 98760, bids: 18, color: 'bg-teal-600' },
];

const getInitials = (name) =>
    name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

const RankedListCard = ({ title, columns, userData, valueKey, countKey }) => (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm md:p-5">
        <div className="mb-3 flex items-center justify-between">
            <h3 className="text-[13px] font-semibold text-[#0B1E3D] md:text-base">{title}</h3>
            <button className="text-xs font-medium text-[#D97706] hover:underline hover:text-amber-700">View All</button>
        </div>

        {/* column */}
        <div className="mb-2 flex items-center justify-between px-1 text-[11px] font-medium text-slate-400">
            <span>{columns[0]}</span>
            <div className="flex gap-8">
                <span>{columns[1]}</span>
                <span>{columns[2]}</span>
            </div>
        </div>

        <div className="divide-y divide-slate-100">
            {userData.map((item) => (
                <div key={item.rank} className="flex items-center justify-between py-2.5">
                    <div className="flex items-center gap-3">
                        {/* <span className="w-3 text-xs font-medium text-slate-400">{item.rank}</span> */}
                        <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold text-white ${item.color}`}>
                            {getInitials(item.name)}
                        </div>
                        <span className="text-[13px] font-medium text-[#0B1E3D]">{item.name}</span>
                    </div>

                    <div className="flex gap-8 text-sm">
                        <span className="w-20 text-right font-medium text-[#0B1E3D]">
                            {item[valueKey].toLocaleString()}
                        </span>
                        <span className="w-10 text-right font-medium text-[#0B1E3D]">
                            {item[countKey]}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// selling vehicle 
const vehiclesData = [
    { id: 1, name: 'Range Rover 2023', image: 'https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_640.jpg', price: 320000, date: 'May 20, 2024' },
    { id: 2, name: 'Mercedes S-Class 2023', image: 'https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_640.jpg', price: 285000, date: 'May 19, 2024' },
    { id: 3, name: 'BMW X5 2023', image: 'https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_640.jpg', price: 275000, date: 'May 18, 2024' },
    { id: 4, name: 'Porsche Cayenne 2023', image: 'https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_640.jpg', price: 260000, date: 'May 17, 2024' },
    { id: 5, name: 'Audi Q7 2023', image: 'https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_640.jpg', price: 245000, date: 'May 16, 2024' },
];

const VehicleSalesCard = () => (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm md:p-5">
        <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#0B1E3D] md:text-base">Highest Selling Vehicles</h3>
            <button className="text-xs font-medium text-[#D97706] hover:underline hover:text-amber-700">View All</button>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="text-[11px] font-medium text-slate-400">
                        <th className="px-1 py- text-left">Vehicle</th>
                        <th className="px-1 py- text-right">Sold Price (AED)</th>
                        <th className="px-1 py- text-right">Date</th>
                    </tr>
                </thead>

                <tbody>
                    {vehiclesData.map((item) => (
                        <tr
                            key={item.id}
                            className=""
                        >
                            <td className="py-2">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="h-8 w-11 rounded-md object-cover bg-slate-100"
                                    />
                                    <span className="text-[13px] font-medium text-[#0B1E3D]">
                                        {item.name}
                                    </span>
                                </div>
                            </td>

                            <td className="px-6 py-3 text-right text-[13px] font-medium text-[#0B1E3D]">
                                {item.price.toLocaleString()}
                            </td>

                            <td className="py-3 text-right text-[13px] text-slate-500 whitespace-nowrap">
                                {item.date}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

// transaction
const transactionsData = [
    { id: 'TXN-124578', type: 'Payment', amount: 12450, status: 'Completed' },
    { id: 'TXN-124577', type: 'Payout', amount: 8750, status: 'Completed' },
    { id: 'TXN-124576', type: 'Payment', amount: 15600, status: 'Completed' },
    { id: 'TXN-124575', type: 'Refund', amount: 2450, status: 'Completed' },
    { id: 'TXN-124574', type: 'Payment', amount: 9850, status: 'Completed' },
];

const statusColors = {
    Completed: 'bg-green-50 text-green-700',
    Pending: 'bg-amber-50 text-amber-700',
    Failed: 'bg-red-50 text-red-700',
};

const RecentTransactionsCard = () => (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm md:p-5">
        <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#0B1E3D] md:text-base">Recent Transactions</h3>
            <button className="text-xs font-medium text-[#D97706] hover:underline hover:text-amber-700">View All</button>
        </div>

        <div className="mb-2 flex items-center justify-between px-1 text-[11px] font-medium text-slate-400">
            <span>Transaction ID</span>
            <div className="flex gap-6">
                <span className="w-16">Type</span>
                <span className="w-20 text-right">Amount (AED)</span>
                <span className="w-20 text-right">Status</span>
            </div>
        </div>

        <div className="divide-y divide-slate-100">
            {transactionsData.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2.5">
                    <span className="text-[13px] font-medium text-[#0B1E3D]">{item.id}</span>

                    <div className="flex items-center gap-6 text-sm">
                        <span className="w-16 text-slate-600 text-[13px]">{item.type}</span>
                        <span className="w-20 text-right font-medium text-[#0B1E3D] text-[13px]">
                            {item.amount.toLocaleString()}
                        </span>
                        <span className="w-20 text-right">
                            <span className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-medium ${statusColors[item.status] || 'bg-gray-50 text-gray-600'}`}>
                                {item.status}
                            </span>
                        </span>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// key insights
const insights = [
    {
        id: 1,
        title: "AI Revenue Forecast",
        value: "AED 5.2M",
        change: "+16.3%",
        positive: true,
        icon: BadgeDollarSign,
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
    },
    {
        id: 2,
        title: "Best Performing Category",
        value: "SUV",
        change: "+18.6%",
        positive: true,
        icon: CarFront,
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
    },
    {
        id: 3,
        title: "Peak Bidding Hours",
        value: "8 PM - 11 PM",
        change: "",
        positive: true,
        icon: Clock3,
        iconBg: "bg-violet-100",
        iconColor: "text-violet-600",
    },
    {
        id: 4,
        title: "Average Auction Duration",
        value: "2h 45m",
        change: "-5.2%",
        positive: false,
        icon: Timer,
        iconBg: "bg-red-100",
        iconColor: "text-red-500",
    },
    {
        id: 5,
        title: "Conversion Rate",
        value: "23.4%",
        change: "+3.8%",
        positive: true,
        icon: BadgePercent,
        iconBg: "bg-amber-100",
        iconColor: "text-amber-500",
    },
    {
        id: 6,
        title: "Buyer Success Rate",
        value: "91.8%",
        change: "+4.2%",
        positive: true,
        icon: Users,
        iconBg: "bg-cyan-100",
        iconColor: "text-cyan-600",
    },
];

export { VehicleSalesCard, RecentTransactionsCard };

function ReportAndAnalytics({ setCurrentPage }) {

    const [range, setRange] = useState('This Week');
    const [auction, setAuction] = useState('This Week');
    const [bidActivity, setBidActivity] = useState('This Week');
    const [userGrowth, setUserGrowth] = useState('This Week');

    return (
        <div className='space-y-'>
            {/* Header */}
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                    <h1 className="text-xl font-bold text-[#0B1E3D] sm:text-2xl">
                        Report & Analytics
                    </h1>

                    <p className="mt-2 text-xs text-slate-500 sm:text-sm">
                        Comprehensive insights and analytics for your auction platform.
                    </p>
                </div>

                {/* buttons */}
                <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:flex lg:w-auto lg:flex-wrap lg:justify-end">
                    <button className="flex py-2.5 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-[#D97706] hover:bg-amber-50 hover:text-[#D97706] active:scale-[0.98]">
                        <FaFilePdf size={16} className="text-red-600" />
                        <span>Export PDF</span>
                    </button>

                    <button className="flex py-2.5 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-[#D97706] hover:bg-amber-50 hover:text-[#D97706] active:scale-[0.98]">
                        <FaFileExcel size={16} className="text-green-600" />
                        <span>Export Excel</span>
                    </button>

                    <button className="flex py-2.5 items-center justify-center gap-2 rounded-lg bg-[#D97706] px-4 text-sm font-medium text-white shadow-md transition-all duration-200 hover:bg-amber-700 active:scale-[0.98]">
                        <Calendar size={16} />
                        <span>Schedule Report</span>
                    </button>
                </div>
            </div>

            {/* stats */}
            <div className="mt-5 md:mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <StatCard title="Auction Success Rate" value="68.4%" trend="6.2% from last week" icon={CircleCheck} color="bg-blue-50 text-blue-600" chartColor="#2563eb" />
                <StatCard title="Platform Profit" value="AED 234,567" trend="12.8% from last week" icon={BadgeDollarSign} color="bg-orange-50 text-orange-600" chartColor="#ea580c" />
                <StatCard title="Active Users" value="12,458" trend="9.3% from last week" icon={Users} color="bg-blue-50 text-blue-600" chartColor="#2563eb" />
                <StatCard title="Average Bid Value" value="AED 3,456" trend="7.1% from last week" icon={ChartNoAxesCombined} color="bg-violet-50 text-violet-600" chartColor="#7c3aed" />
            </div>

            {/* charts */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">

                {/* left */}
                <div className='space-y-6'>

                    {/* ============== Revenue Overview ============= */}
                    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm md:p-5">

                        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <h3 className="text-[13px] font-bold text-[#0B1E3D] sm:text-base">
                                Revenue Overview (AED)
                            </h3>

                            <button className="flex w-full items-center justify-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 sm:w-auto sm:justify-start sm:py-1.5">
                                <span>{range}</span>
                                <ChevronDown className="h-3.5 w-3.5" />
                            </button>
                        </div>
                        {/* Chart */}
                        <div className="h-56 w-full md:h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ea580c" stopOpacity={0.25} />
                                            <stop offset="95%" stopColor="#ea580c" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>

                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />

                                    <XAxis
                                        dataKey="date"
                                        tick={{ fontSize: 11, fill: '#94a3b8' }}
                                        axisLine={false}
                                        tickLine={false}
                                    />

                                    <YAxis
                                        tick={{ fontSize: 11, fill: '#94a3b8' }}
                                        axisLine={false}
                                        tickLine={false}
                                        tickFormatter={(val) => `${val / 1000}K`}
                                    />

                                    <Tooltip content={<CustomTooltip />} />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#ea580c"
                                        strokeWidth={2}
                                        fill="url(#revenueGradient)"
                                        dot={{ r: 3, fill: '#ea580c', strokeWidth: 0 }}
                                        activeDot={{ r: 5, fill: '#ea580c', strokeWidth: 2, stroke: '#fff' }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* ============== Vehicle Cat Performance ============= */}
                    <DonutCard
                        title="Vehicle Category Performance"
                        showPercentage={true}
                        segments={[
                            { name: "SUV", value: 35, color: "#2563EB" },
                            { name: "Sedan", value: 28, color: "#10B981" },
                            { name: "Truck", value: 18, color: "#F59E0B" },
                            { name: "Coupe", value: 10, color: "#6D28D9" },
                            { name: "Others", value: 9, color: "#94A3B8" },
                        ]}
                    />

                    {/* ============== User Growth ============= */}
                    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm md:p-5">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-base font-bold text-[#0B1E3D]">
                                User Growth
                            </h3>

                            <button className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
                                <span>{range}</span>
                                <ChevronDown className="h-3.5 w-3.5" />
                            </button>
                        </div>

                        <div className="h-56 md:h-60 w-full lg:h-47">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={userGrowthData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="userGrowthGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>

                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />

                                    <XAxis
                                        dataKey="date"
                                        tick={{ fontSize: 11, fill: '#94a3b8' }}
                                        axisLine={false}
                                        tickLine={false}
                                        interval={0}
                                    />

                                    <YAxis
                                        tick={{ fontSize: 11, fill: '#94a3b8' }}
                                        axisLine={false}
                                        tickLine={false}
                                        tickFormatter={(val) => `${val / 1000}K`}
                                    />

                                    <Tooltip content={<UserGrowthTooltip />} />

                                    <Area
                                        type="monotone"
                                        dataKey="users"
                                        stroke="#2563eb"
                                        strokeWidth={2}
                                        fill="url(#userGrowthGradient)"
                                        dot={{ r: 3, fill: '#2563eb', strokeWidth: 0 }}
                                        activeDot={{ r: 5, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>

                {/* right */}
                <div className='space-y-6'>

                    {/* ============== Auction Performance ============= */}
                    <DonutCard
                        title="Approval Summary"
                        centerValue="32"
                        centerLabel="Total Requests"
                        showPercentage={true}
                        segments={[
                            { name: 'Approved', value: 60, color: '#10B981' },
                            { name: 'Pending', value: 6, color: '#F59E0B' },
                            { name: 'Rejected', value: 8, color: '#FF0000' },
                        ]}
                    />

                    {/* ============== Bid Activity ============= */}
                    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm md:p-5">
                        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <h3 className="text-[13px] font-bold text-[#0B1E3D] sm:text-base">
                                Bid Activity
                            </h3>

                            <button className="flex w-full items-center justify-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 sm:w-auto sm:justify-start sm:py-1.5">
                                <span>{bidActivity}</span>
                                <ChevronDown className="h-3.5 w-3.5" />
                            </button>
                        </div>
                        <div className="h-63 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={bidActivityData}
                                    margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                                >
                                    <CartesianGrid
                                        vertical={false}
                                        stroke="#E5E7EB"
                                        strokeDasharray="3 3"
                                    />

                                    <XAxis
                                        dataKey="date"
                                        tick={{ fontSize: 11, fill: "#64748B" }}
                                        axisLine={false}
                                        tickLine={false}
                                    />

                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 11, fill: "#64748B" }}
                                        domain={[0, 5000]}
                                        ticks={[0, 1000, 2000, 3000, 4000, 5000]}
                                        tickFormatter={(v) => (v === 0 ? "0" : `${v / 1000}K`)}
                                    />

                                    <Tooltip
                                        cursor={{ fill: "#F8FAFC" }}
                                        formatter={(value) => [`${value} Bids`, "Bid Activity"]}
                                        contentStyle={{
                                            fontSize: "12px",
                                            borderRadius: "10px",
                                            border: "1px solid #E2E8F0",
                                        }}
                                        labelStyle={{
                                            fontSize: "11px",
                                            fontWeight: 600,
                                        }}
                                        itemStyle={{
                                            fontSize: "11px",
                                        }}
                                    />

                                    <Bar
                                        dataKey="bids"
                                        radius={[6, 6, 0, 0]}
                                        fill="#7C3AED"
                                        barSize={28}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* ============== Payment Method Distribution ============= */}
                    <DonutCard
                        title="Payment Method Distribution"
                        showPercentage={true}
                        segments={[
                            { name: 'Credit Card', value: 45, color: '#2563eb' },
                            { name: 'Bank Transfer', value: 25, color: '#10b981' },
                            { name: 'Wallets', value: 15, color: '#f97316' },
                            { name: 'Cash', value: 10, color: '#8b5cf6' },
                            { name: 'Others', value: 5, color: '#94a3b8' },
                        ]}
                    />
                </div>

            </div>

            {/* tables */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
                <RankedListCard
                    title="Top Buyers"
                    columns={['Buyer', 'Total Spent (AED)', 'Bids']}
                    userData={buyersData}
                    valueKey="spent"
                    countKey="bids"
                />

                <RankedListCard
                    title="Top Sellers"
                    columns={['Seller', 'Total Sales (AED)', 'Auctions']}
                    userData={sellersData}
                    valueKey="sales"
                    countKey="auctions"
                />

                <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm md:p-5">
                    <h3 className="text-sm font-semibold text-[#0B1E3D] md:text-base">
                        Key Insights
                    </h3>

                    <div className="mt-4 space-y-4">
                        {insights.map((item) => {
                            const Icon = item.icon;

                            return (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`flex h-8 w-8 items-center justify-center rounded-full ${item.iconBg}`}
                                        >
                                            <Icon className={`h-4 w-4 ${item.iconColor}`} />
                                        </div>

                                        <span className="text-[13px] font-medium text-slate-600">
                                            {item.title}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="text-[13px] font-semibold text-[#0B1E3D]">
                                            {item.value}
                                        </span>

                                        {item.change && (
                                            <span
                                                className={`text-[11px] font-semibold ${item.positive
                                                    ? "text-green-600"
                                                    : "text-red-500"
                                                    }`}
                                            >
                                                {item.change}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <VehicleSalesCard />
                <RecentTransactionsCard />
            </div>
        </div>
    )
}

export default ReportAndAnalytics
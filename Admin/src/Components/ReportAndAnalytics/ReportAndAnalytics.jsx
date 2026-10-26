
import React, { useState } from 'react';
import { BadgeDollarSign, BadgePercent, Calendar, CarFront, ChartNoAxesCombined, Users, ArrowUp, ChevronDown, CircleCheck, Clock3, Timer } from 'lucide-react';
import { FaFileExcel, FaFilePdf } from 'react-icons/fa';
import { LineChart, Line, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

import { formatDateTime, formatLabel, formatPrice } from '../utils/formatter'
import { useGetReportAnalytics } from '../../hooks/useReportAnalytics';
import { useGetAllTransactions } from '../../hooks/useTransaction';

const RANGE_MAP = {
    'This Week': 'this_week',
    'One Week Ago': 'last_week',
    'Two Weeks Ago': 'two_weeks_ago',
};

// Data for each sparkline
const data = [
    { value: 10 }, { value: 15 }, { value: 8 }, { value: 20 },
    { value: 12 }, { value: 25 }, { value: 18 }, { value: 30 }
];

// helper - stats
const StatCard = ({ title, value, trend, icon: Icon, color, chartColor }) => (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:translate-y-0 cursor-pointer flex flex-col justify-between group">
        <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl transition-transform duration-300 group-hover:scale-105 ${color}`}>
                <Icon className="w-5 h-5" />
            </div>

            <div>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                    {title}
                </p>

                <h3 className="text-[15px] md:text-xl font-bold text-[#0B1E3D] tracking-tight mt-1">
                    {value}
                </h3>
            </div>
        </div>

        <div className="mt-3">
            <p className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50/80 w-fit px-2 py-0.5 rounded-md">
                <ArrowUp className="h-3 w-3" />
                {trend}
            </p>

            <div className="mt-2 hidden h-8 w-full md:flex transition-opacity duration-300 opacity-90 group-hover:opacity-100">
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

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    return (
        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-md">
            <p className="text-xs font-semibold text-[#0B1E3D]">{label}</p>
            <p className="text-xs text-slate-500">
                Revenue:{" "}
                <span className="font-semibold text-orange-600">
                    AED {Number(payload[0].value ?? 0).toLocaleString()}
                </span>
            </p>
        </div>
    );
};

// user growth
const UserGrowthTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    return (
        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-md">
            <p className="text-xs font-semibold text-[#0B1E3D]">{label}</p>
            <p className="text-xs text-slate-500">
                New users:{" "}
                <span className="font-semibold text-blue-600">
                    {Number(payload[0].value ?? 0).toLocaleString()}
                </span>
            </p>
        </div>
    );
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

// seller , buyer
const avatarColors = [
    'bg-amber-500',
    'bg-emerald-600',
    'bg-violet-600',
    'bg-sky-600',
    'bg-rose-500',
    'bg-teal-600',
    'bg-orange-600',
    'bg-indigo-600',
];

const getInitials = (name) =>
    name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

const RankedListCard = ({ title, columns, userData, valueKey, countKey, onViewAll }) => (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm md:p-5">
        <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[13px] font-semibold text-[#0B1E3D] md:text-base">
                {title}
            </h3>
            <button
                onClick={onViewAll}
                className="text-xs font-medium text-[#D97706] hover:text-amber-700 hover:underline">
                View All
            </button>
        </div>

        <div className="overflow-x-auto no-scrollbar">
            <table className="w-full min-w-100 table-fixed text-left ">
                <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-medium text-slate-400">
                        <th className="w-[50%] px-3 py-3">{columns[0]}</th>
                        <th className="w-[32%] px-3 py-3 text-left">{columns[1]}</th>
                        <th className="w-[18%] px-3 py-3 text-left">{columns[2]}</th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                    {userData.map((item) => {
                        const avatarColor =
                            avatarColors[(item.rank - 1) % avatarColors.length];

                        return (
                            <tr
                                key={item.rank}
                                className="transition-colors hover:bg-slate-50">
                                <td className="px-3 py-3">
                                    <div className="flex min-w-0 items-center gap-2.5">
                                        <div
                                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white ${avatarColor}`}
                                        >
                                            {getInitials(item.name)}
                                        </div>

                                        <span className="truncate text-[13px] font-medium text-[#0B1E3D]">
                                            {item.name}
                                        </span>
                                    </div>
                                </td>

                                <td className="whitespace-nowrap px-3 py-3 text-left text-sm font-medium text-[#0B1E3D]">
                                    {item[valueKey].toLocaleString()}
                                </td>

                                <td className="whitespace-nowrap px-3 py-3 text-left text-sm font-medium text-[#0B1E3D]">
                                    {item[countKey]}
                                </td>
                            </tr>
                        );
                    })}

                    {userData.length === 0 && (
                        <tr>
                            <td colSpan={3} className="px-3 py-8 text-center text-sm text-slate-400">
                                No data available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
);

// selling vehicle 
const VehicleSalesCard = ({ vehicles = [], onViewAll }) => (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm md:p-5">

        <div className="mb-5 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#0B1E3D] md:text-base">
                Highest Selling Vehicles
            </h3>

            <button
                onClick={onViewAll}
                className="text-xs font-medium text-[#D97706] hover:text-amber-700 hover:underline">
                View All
            </button>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className=''>
                    <tr className="text-[11px] font-medium text-slate-400">
                        <th className="px-1 text-left">Vehicle</th>
                        <th className="px-1 text-right">Sold Price (AED)</th>
                        <th className="px-1 text-right">Date</th>
                    </tr>
                </thead>

                <tbody>
                    {vehicles.length ? (
                        vehicles.map((item) => (
                            <tr
                                key={item.id}
                                className="border-b border-slate-100 last:border-0">
                                <td className="py-3">
                                    <div className="flex items-center gap-3">
                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="h-8 w-11 rounded-md bg-slate-100 object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-8 w-11 items-center justify-center rounded-md bg-slate-100 text-slate-400">
                                                <CarFront className="h-4 w-4" />
                                            </div>
                                        )}

                                        <span className="text-[13px] font-medium text-[#0B1E3D]">
                                            {item.name}
                                        </span>
                                    </div>
                                </td>

                                <td className="px-6 py-3 text-right text-[13px] font-medium text-[#0B1E3D]">
                                    {formatPrice(item.price ?? 0)}
                                </td>

                                <td className="whitespace-nowrap py-3 text-right text-[12px] text-slate-500">
                                    {formatDateTime(item.date)}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={3} className="py-6 text-center text-sm text-slate-500">
                                No paid vehicle sales in this period.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
);

// transaction
const getTransactionStatusStyle = (status) => {
    if (status === "Completed") return "bg-green-50 text-green-700";
    if (/fail|mismatch/i.test(status)) return "bg-red-50 text-red-700";
    if (/pending|requested|received|session/i.test(status)) {
        return "bg-amber-50 text-amber-700";
    }
    return "bg-gray-50 text-gray-600";
};

const formatTransactionStatus = (status = "Unknown") =>
    status
        .replaceAll("_", " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());

const RecentTransactionsCard = ({ onViewAll }) => {
    const { data, isLoading, isError } = useGetAllTransactions({
        page: 1,
        limit: 5,
        sortBy: "newest",
    });

    const transactions = data?.transactions ?? [];

    if (isLoading) return <p>Loading transactions...</p>;
    if (isError) return <p>Could not load transactions.</p>;

    return (
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm md:p-5">
            <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#0B1E3D] md:text-base">
                    Recent Transactions
                </h3>

                <button
                    onClick={onViewAll}
                    className="text-xs font-medium text-[#D97706] hover:text-amber-700 hover:underline">
                    View All
                </button>
            </div>

            <div className="overflow-x-auto">
                <div className="min-w-133">
                    <div className="mb-2 grid grid-cols-[minmax(180px,1fr)_100px_130px_100px] items-center border-b border-slate-100 px-2 py-3 text-[11px] font-medium text-slate-400">
                        <span>Transaction ID</span>
                        <span>Type</span>
                        <span>Amount (AED)</span>
                        <span>Status</span>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {transactions.length ? (
                            transactions.map((item) => (
                                <div
                                    key={item.key}
                                    className="grid grid-cols-[minmax(180px,1fr)_100px_130px_100px] items-center px-2 py-3 transition-colors hover:bg-slate-50"
                                >
                                    <span className="truncate pr-3 text-[13px] font-medium text-[#0B1E3D]">
                                        {item.kind === "payout"
                                            ? item.payoutCode || "---"
                                            : item.orderId || "---"}
                                    </span>

                                    <span className="text-[13px] text-slate-600">
                                        {item.kind}
                                    </span>

                                    <span className="whitespace-nowrap text-[13px] font-medium text-[#0B1E3D]">
                                        {(item.amount ?? 0).toLocaleString()}
                                    </span>

                                    <span>
                                        <span
                                            className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium ${getTransactionStatusStyle(item.status)}`}
                                        >
                                            {formatTransactionStatus(item.status)}
                                        </span>
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="py-6 text-center text-sm text-slate-500">
                                No transactions found.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export { VehicleSalesCard, RecentTransactionsCard };

function ReportAndAnalytics({ setCurrentPage }) {

    const [range, setRange] = useState('This Week');
    const { data, isLoading, isError } = useGetReportAnalytics(RANGE_MAP[range]);

    const report = data?.data;

    if (isLoading) return <p className="p-8 text-center">Loading report...</p>;
    if (isError) return <p className="p-8 text-center text-red-600">Failed to load report.</p>;

    // key insights
    const insightItems = [
        {
            id: "category",
            title: "Most Listed Category",
            value: (report?.insights?.bestCategory ?? "Not enough data")
                .replaceAll("_", " ")
                .replace(/\b\w/g, (letter) => letter.toUpperCase()),
            icon: CarFront,
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
        },
        {
            id: "peak-hours",
            title: "Peak Bidding Hours",
            value: report?.insights?.peakBiddingHours ?? "Not enough data",
            icon: Clock3,
            iconBg: "bg-violet-100",
            iconColor: "text-violet-600",
        },
        {
            id: "duration",
            title: "Average Auction Duration",
            value: report?.insights?.averageAuctionDurationHours == null
                ? "Not enough data"
                : `${report.insights.averageAuctionDurationHours} hours`,
            icon: Timer,
            iconBg: "bg-red-100",
            iconColor: "text-red-500",
        },
        {
            id: "conversion",
            title: "Conversion Rate",
            value: `${Number(report?.insights?.conversionRate ?? 0).toFixed(1)}%`,
            icon: BadgePercent,
            iconBg: "bg-amber-100",
            iconColor: "text-amber-500",
        },
        {
            id: "buyer-success",
            title: "Buyer Success Rate",
            value: `${Number(report?.insights?.buyerSuccessRate ?? 0).toFixed(1)}%`,
            icon: Users,
            iconBg: "bg-cyan-100",
            iconColor: "text-cyan-600",
        },
    ];

    return (
        <div className='pb-6'>

            {/* Header */}
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                    <h1 className="text-xl font-bold text-[#0B1E3D] sm:text-2xl">Report & Analytics</h1>
                    <p className="mt-2 text-xs text-slate-500 sm:text-sm">Comprehensive insights and analytics for your auction platform.</p>
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
                <StatCard title="Auction Success Rate" value={report?.summary?.auctionSuccessRate ?? "0%"} trend="Successful auction sales" icon={CircleCheck} color="bg-blue-50 text-blue-600" chartColor="#2563eb" />
                <StatCard title="Platform Profit" value={`AED ${(report?.summary?.platformProfit ?? 0).toLocaleString()}`} trend="Commission earned" icon={BadgeDollarSign} color="bg-orange-50 text-orange-600" chartColor="#ea580c" />
                <StatCard title="Active Users" value={(report?.summary?.activeUsers ?? 0).toLocaleString()} trend="Active buyers and sellers" icon={Users} color="bg-blue-50 text-blue-600" chartColor="#2563eb" />
                <StatCard title="Average Bid Value" value={`AED ${(report?.summary?.averageBidValue ?? 0).toLocaleString()}`} trend="Average amount per bid" icon={ChartNoAxesCombined} color="bg-violet-50 text-violet-600" chartColor="#7c3aed" />
            </div>

            {/* ------------------------ CHARTS ------------------------ */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">

                {/* left */}
                <div className='space-y-6'>

                    {/* ============== Revenue Overview ============= */}
                    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm md:p-5">
                        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <h3 className="text-[13px] font-bold text-[#0B1E3D] sm:text-base">
                                Revenue Overview (AED)
                            </h3>

                            <select
                                value={range}
                                onChange={(event) => setRange(event.target.value)}
                                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 sm:w-auto sm:py-1.5"
                            >
                                {Object.keys(RANGE_MAP).map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="h-56 w-full md:h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={report?.revenueOverview ?? []}
                                    margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                                >
                                    <defs>
                                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ea580c" stopOpacity={0.25} />
                                            <stop offset="95%" stopColor="#ea580c" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>

                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        stroke="#f1f5f9"
                                    />

                                    <XAxis
                                        dataKey="name"
                                        tick={{ fontSize: 11, fill: "#94a3b8" }}
                                        axisLine={false}
                                        tickLine={false}
                                    />

                                    <YAxis
                                        tick={{ fontSize: 11, fill: "#94a3b8" }}
                                        axisLine={false}
                                        tickLine={false}
                                        tickFormatter={(value) =>
                                            value >= 1_000_000
                                                ? `${(value / 1_000_000).toFixed(1)}M`
                                                : value >= 1_000
                                                    ? `${(value / 1_000).toFixed(0)}K`
                                                    : value
                                        }
                                    />

                                    <Tooltip content={<CustomTooltip />} />

                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#ea580c"
                                        strokeWidth={2}
                                        fill="url(#revenueGradient)"
                                        dot={{ r: 3, fill: "#ea580c", strokeWidth: 0 }}
                                        activeDot={{
                                            r: 5,
                                            fill: "#ea580c",
                                            strokeWidth: 2,
                                            stroke: "#fff",
                                        }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* ============== Vehicle Cat Performance ============= */}
                    <DonutCard
                        title="Vehicle Category Performance"
                        showPercentage={true}
                        segments={(report?.vehicleCategories ?? []).map((category) => ({
                            ...category,
                            name: formatLabel(category.name)
                        }))}
                    />

                    {/* ============== User Growth ============= */}
                    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm md:p-5">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-base font-bold text-[#0B1E3D]">New Users</h3>

                            <select
                                value={range}
                                onChange={(event) => setRange(event.target.value)}
                                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600"
                            >
                                {Object.keys(RANGE_MAP).map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="h-56 w-full md:h-60 lg:h-47">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={report?.userGrowth ?? []}
                                    margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                                >
                                    <defs>
                                        <linearGradient id="userGrowthGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>

                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        stroke="#f1f5f9"
                                    />

                                    <XAxis
                                        dataKey="dateLabel"
                                        tick={{ fontSize: 11, fill: "#94a3b8" }}
                                        axisLine={false}
                                        tickLine={false}
                                    />

                                    <YAxis
                                        tick={{ fontSize: 11, fill: "#94a3b8" }}
                                        axisLine={false}
                                        tickLine={false}
                                        tickFormatter={(value) =>
                                            value >= 1000 ? `${(value / 1000).toFixed(0)}K` : value
                                        }
                                    />

                                    <Tooltip content={<UserGrowthTooltip />} />

                                    <Area
                                        type="monotone"
                                        dataKey="users"
                                        stroke="#2563eb"
                                        strokeWidth={2}
                                        fill="url(#userGrowthGradient)"
                                        dot={{ r: 3, fill: "#2563eb", strokeWidth: 0 }}
                                        activeDot={{
                                            r: 5,
                                            fill: "#2563eb",
                                            strokeWidth: 2,
                                            stroke: "#fff",
                                        }}
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
                        title="Vehicle Approval Status"
                        centerValue={report?.approvalSummary?.total ?? 0}
                        centerLabel="Total Vehicles"
                        showPercentage={true}
                        segments={[
                            { name: 'Approved', value: report?.approvalSummary?.approved ?? 0, color: '#10B981' },
                            { name: 'Pending', value: report?.approvalSummary?.pending ?? 0, color: '#F59E0B' },
                            { name: 'Rejected', value: report?.approvalSummary?.rejected ?? 0, color: '#FF0000' },
                        ]}
                    />

                    {/* ============== Bid Activity ============= */}
                    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm md:p-5">
                        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <h3 className="text-[13px] font-bold text-[#0B1E3D] sm:text-base">
                                Bid Activity
                            </h3>

                            <select
                                value={range}
                                onChange={(event) => setRange(event.target.value)}
                                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 sm:w-auto sm:py-1.5"
                            >
                                {Object.keys(RANGE_MAP).map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="h-63 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={report?.bidActivity ?? []}
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
                                        domain={[0, "dataMax"]}
                                        allowDecimals={false}
                                        tickFormatter={(value) =>
                                            value >= 1000 ? `${(value / 1000).toFixed(0)}K` : value
                                        }
                                    />

                                    <Tooltip
                                        cursor={{ fill: "#F8FAFC" }}
                                        formatter={(value) => [`${value} Bids`, "Bid Activity"]}
                                        contentStyle={{
                                            fontSize: "12px",
                                            borderRadius: "10px",
                                            border: "1px solid #E2E8F0",
                                        }}
                                        labelStyle={{ fontSize: "11px", fontWeight: 600 }}
                                        itemStyle={{ fontSize: "11px" }}
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
                    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-[13px] font-bold text-[#0B1E3D] sm:text-base">
                                Payment Gateway
                            </h3>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Active
                            </span>
                        </div>

                        <div className="group relative flex items-center gap-4 rounded-xl border border-slate-100 bg-gradient-to-r from-slate-50/80 via-white to-slate-50/80 p-4 transition-all duration-300 hover:border-slate-200 hover:shadow-md">
                            <div className="absolute left-0 top-3 bottom-3 w-1 bg-blue-600 rounded-r-full" />

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shadow-2xs group-hover:scale-105 transition-transform duration-300 shrink-0">
                                <BadgeDollarSign className="h-5 w-5" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <p className="font-bold text-[#0B1E3D] text-sm md:text-base">
                                        {report?.paymentProviders?.[0]?.name ?? "Stripe"}
                                    </p>
                                    <span className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                                        Primary Provider
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                    All online transactions are securely processed through this gateway.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-4 mt-6 border-t border-slate-100">
                            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                                <p className="text-[10px] uppercase font-semibold text-slate-400">Environment</p>
                                <p className="text-sm font-bold text-[#0B1E3D] mt-0.5">Production (Live)</p>
                            </div>
                            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                                <p className="text-[10px] uppercase font-semibold text-slate-400">Settlement Type</p>
                                <p className="text-sm font-bold text-emerald-600 mt-0.5">Automatic</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* ------------------------ TABLES ------------------------ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">

                {/* buyers */}
                <RankedListCard
                    title="Top Buyers"
                    columns={['Buyer', 'Total Spent (AED)', 'Bids']}
                    userData={report?.topBuyers ?? []}
                    valueKey="spent"
                    countKey="bids"
                    onViewAll={() => setCurrentPage('buyers')}
                />

                {/* sellers */}
                <RankedListCard
                    title="Top Sellers"
                    columns={['Seller', 'Total Sales (AED)', 'Auctions']}
                    userData={report?.topSellers ?? []}
                    valueKey="sales"
                    countKey="auctions"
                    onViewAll={() => setCurrentPage('sellers')}
                />

                {/* key insights */}
                <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm md:py-5 md:px-4">
                    <h3 className="text-sm font-semibold text-[#0B1E3D] md:text-base">Key Insights</h3>

                    <div className="mt-4 space-y-4">
                        {insightItems.map((item) => {
                            const Icon = item.icon;

                            return (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`flex h-7 w-7 items-center justify-center rounded-full ${item.iconBg}`}>
                                            <Icon className={`h-3.5 w-3.5 ${item.iconColor}`} />
                                        </div>

                                        <span className="text-[12px] font-medium text-slate-600">
                                            {item.title}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="text-[13px] font-semibold text-[#0B1E3D]">{item.value}</span>
                                        {item.change && (
                                            <span
                                                className={`text-[11px] font-semibold 
                                                ${item.positive
                                                        ? "text-green-600"
                                                        : "text-red-500"
                                                    }`}>
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

            {/* ------------------------ SALES/TRANSACTION CARD ------------------------ */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                {/* sales vehicles */}
                <VehicleSalesCard
                    vehicles={report?.highestSellingVehicles ?? []}
                    onViewAll={() => setCurrentPage('sales')}
                />

                {/* transaction */}
                <RecentTransactionsCard onViewAll={() => setCurrentPage('transactions')} />
            </div>
        </div>
    )
}

export default ReportAndAnalytics
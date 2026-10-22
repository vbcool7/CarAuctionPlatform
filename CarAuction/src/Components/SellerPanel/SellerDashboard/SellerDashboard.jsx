
import React from 'react';
import { CarFront, Gavel, CheckCircle2, Wallet, Clock, Plus, Calendar, ShieldCheck, Bell } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import SummaryDonutCard from '../SellerSharedComponents/SummaryDonutCard';

import { getIcon, getIconStyle } from '../SellerNotificationMeta';
import {formatLabel} from '../../../utils/formatters';
import { useGetSellerDashboard } from '../../../hook/useSales';
import { useGetAllNotifications } from '../../../hook/useNotification';
import { money, fmtDate, fmtDateTime, imgOf } from '../../../utils/salesUtils';

const VEHICLE_STATUS = {
    live: { label: 'Live', cls: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
    upcoming: { label: 'Upcoming', cls: 'bg-blue-50 text-blue-600 border-blue-200' },
    sold: { label: 'Sold', cls: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
    draft: { label: 'Draft', cls: 'bg-slate-100 text-slate-700 border-slate-200' },
    pending_payment: { label: 'Awaiting Payment', cls: 'bg-orange-50 text-orange-600 border-orange-200' },
    unsold: { label: 'Unsold', cls: 'bg-slate-100 text-slate-700 border-slate-200' },
    'reserve-not-met': { label: 'Reserve Not Met', cls: 'bg-amber-50 text-amber-600 border-amber-200' },
    canceled: { label: 'Canceled', cls: 'bg-red-50 text-red-600 border-red-200' },
};

const ACCOUNT_STATUS = {
    approved: { label: 'Verified', cls: 'text-green-600' },
    pending: { label: 'Pending Review', cls: 'text-amber-600' },
    rejected: { label: 'Rejected', cls: 'text-red-600' },
};

const getRelativeTime = (dateString) => {
    const diffMin = Math.floor((Date.now() - new Date(dateString).getTime()) / 60000);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    return `${Math.floor(diffHr / 24)}d ago`;
};

// recent vehicle row: price + time
const priceInfo = (v) => {
    if (v.priceType === 'fixed_price') return { label: 'Buy Now Price', value: v.buyNowPrice };
    if (v.currentBid != null) return { label: 'Current Bid', value: v.currentBid };
    return { label: 'Starting Bid', value: v.startingBidPrice };
};

const timeInfo = (v) => {
    if (v.auctionStatus === 'live') return { label: 'Ends', value: fmtDateTime(v.auctionEndDateTime) };
    if (v.auctionStatus === 'upcoming') return { label: 'Starts', value: fmtDateTime(v.auctionStartDateTime) };
    if (v.auctionStatus === 'draft') return { label: 'Status', value: 'Not submitted' };
    return { label: 'Ended', value: fmtDate(v.auctionEndDateTime) };
};

const chartDate = (d) =>
    new Date(`${d}T00:00:00`).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });

function SellerDashboard({ setCurrentPage }) {

    const { data, isLoading, isError } = useGetSellerDashboard();
    const { data: notificationData } = useGetAllNotifications(1);

    const sm = data?.summary;
    const bs = sm?.vehicles?.byStatus || {};
    const totalVehicles = sm?.vehicles?.total || 0;
    const recentVehicles = sm?.recentVehicles || [];
    const series = sm?.earningsSeries || [];
    const account = sm?.account || {};
    const activity = (notificationData?.data || []).slice(0, 4);

    const accountMeta = account.accountStatus === 'suspended'
        ? { label: 'Suspended', cls: 'text-red-600' }
        : ACCOUNT_STATUS[account.status] || { label: '—', cls: 'text-slate-500' };

    // stats
    const statsData = [
        {
            id: 'total-vehicles',
            title: 'Total Vehicles',
            value: totalVehicles,
            subtitle: 'All listings',
            subtitleColor: 'text-green-600',
            icon: CarFront,
            iconBg: 'bg-slate-100',
            iconColor: 'text-slate-700',
        },
        {
            id: 'active-auctions',
            title: 'Active Auctions',
            value: bs.live || 0,
            subtitle: 'Live Now',
            subtitleColor: 'text-green-600',
            icon: Gavel,
            iconBg: 'bg-amber-50',
            iconColor: 'text-amber-900',
        },
        {
            id: 'total-sold',
            title: 'Total Sold',
            value: bs.sold || 0,
            subtitle: 'Paid by buyer',
            subtitleColor: 'text-green-600',
            icon: CheckCircle2,
            iconBg: 'bg-emerald-50',
            iconColor: 'text-emerald-600',
        },
        {
            id: 'total-earnings',
            title: 'Total Earnings',
            value: money(sm?.earnings?.total),
            subtitle: 'After commission',
            subtitleColor: 'text-green-600',
            icon: Wallet,
            iconBg: 'bg-amber-50/80',
            iconColor: 'text-amber-600',
        },
        {
            id: 'pending-payout',
            title: 'Pending Payout',
            value: money(sm?.earnings?.pending),
            subtitle: 'Not yet transferred to you',
            subtitleColor: 'text-amber-500',
            icon: Clock,
            iconBg: 'bg-purple-50',
            iconColor: 'text-purple-600',
            extraClass: 'sm:col-span-2 lg:col-span-1',
        },
    ];

    const otherCount = Math.max(
        totalVehicles - ['live', 'upcoming', 'pending_payment', 'sold', 'draft'].reduce((s, k) => s + (bs[k] || 0), 0),
        0
    );

    return (
        <div className='pb-6'>

            {/* header */}
            <div className='w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0'>
                <div className='flex flex-col'>
                    <h1 className='text-xl md:text-2xl font-bold'>Seller Dashboard</h1>
                    <p className='text-xs md:text-sm text-gray-600 p-px'>
                        Welcome back, {account.fullName || 'Seller'}
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

            {isError && (
                <p className='mt-4 text-sm text-red-600'>Could not load dashboard data. Please refresh the page.</p>
            )}

            {/* stats */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 my-6 transition-opacity ${isLoading ? 'opacity-60' : ''}`}>
                {statsData.map((stat) => {
                    const IconComponent = stat.icon;
                    return (
                        <div
                            key={stat.id}
                            className={`bg-white p-5 rounded-2xl border border-slate-100 shadow-md flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-amber-200 ${stat.extraClass || ''}`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-xs font-medium text-slate-400">{stat.title}</p>
                                <div className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center shrink-0`}>
                                    <IconComponent className={`w-5 h-5 ${stat.iconColor}`} />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl  font-bold text-[#0B1E3D] my-1">{stat.value}</h3>
                                <p className={`text-[11px] font-semibold ${stat.subtitleColor}`}>{stat.subtitle}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* ---------------------- LEFT ---------------------- */}
                <div className="lg:col-span-7 space-y-6">

                    {/* earning overview */}
                    <div className="w-full bg-white rounded-2xl border border-slate-200 p-4 md:p-5 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-6">
                            <h3 className="text-sm sm:text-base font-bold text-slate-900">Earnings Overview</h3>
                            <p className="text-xs text-slate-500">Last 30 days · AED (after commission)</p>
                        </div>

                        <div className="w-full h-64 sm:h-74">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={series} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
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
                                        minTickGap={30}
                                        tickFormatter={chartDate}
                                        padding={{ left: 10, right: 10 }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        allowDecimals={false}
                                        tick={{ fill: '#64748B', fontSize: 12 }}
                                        tickFormatter={(value) => (value >= 1000 ? `${value / 1000}K` : value)}
                                    />
                                    <Tooltip
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <div className="bg-white px-3 py-2 border border-slate-200 shadow-md rounded-xl text-center">
                                                        <p className="text-[10px] text-slate-500 font-medium">{chartDate(payload[0].payload.date)}</p>
                                                        <p className="text-sm font-semibold text-slate-900">{money(payload[0].value)}</p>
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
                                        dot={false}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* recents vehicles */}
                    <div className="w-full bg-white rounded-2xl border border-slate-200 p-4 md:p-5 shadow-sm">
                        <div className="flex flex-row items-center justify-between gap-3 mb-4">
                            <h3 className="text-sm sm:text-base font-bold text-slate-900">Recent Vehicles</h3>

                            <button
                                onClick={() => setCurrentPage('my-vehicles')}
                                className="text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors cursor-pointer">
                                View All
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <div className="min-w-165 divide-y divide-slate-100">
                                {recentVehicles.length === 0 && (
                                    <p className="py-8 text-center text-xs text-slate-400">No vehicles yet.</p>
                                )}

                                {recentVehicles.map((item) => {

                                    const title = [item.year, formatLabel(item.make), formatLabel(item.model)].filter(Boolean).join(' ') || 'Vehicle';
                                    const image = imgOf(item);
                                    const st = VEHICLE_STATUS[item.auctionStatus] || VEHICLE_STATUS.draft;
                                    const price = priceInfo(item);
                                    const time = timeInfo(item);

                                    return (
                                        <div 
                                        key={item._id} 
                                        className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/50 px-2 rounded-xl transition-colors">

                                            <div className="flex items-center gap-3.5 min-w-60">
                                                {image ? (
                                                    <img 
                                                    src={image} 
                                                    alt={title} 
                                                    className="w-14 h-10 sm:w-16 sm:h-11 rounded-xl object-cover border border-slate-200 shrink-0" />
                                                ) : (
                                                    <div className="w-14 h-10 sm:w-16 sm:h-11 rounded-xl bg-slate-100 border border-slate-200 shrink-0" />
                                                )}

                                                <div className="min-w-0">
                                                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{title}</h4>
                                                    <p className="text-[11px] text-slate-400 font-medium truncate">Listing ID: {item.listingId || '—'}</p>
                                                </div>

                                            </div>

                                            <div className="w-34 shrink-0">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] md:text-[11px] font-semibold border ${st.cls}`}>
                                                    {st.label}
                                                </span>
                                            </div>

                                            <div className="w-28 shrink-0">
                                                <p className="text-[10px] sm:text-[11px] font-medium text-slate-400">{price.label}</p>
                                                <p className="text-xs sm:text-sm font-semibold text-slate-900">{money(price.value)}</p>
                                            </div>

                                            <div className="w-36 shrink-0">
                                                <p className="text-[10px] sm:text-[11px] font-medium text-slate-400">{time.label}</p>
                                                <p className={`text-xs sm:text-sm font-semibold ${item.auctionStatus === 'live' ? 'text-red-500' : 'text-slate-900'}`}>
                                                    {time.value}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ---------------------- RIGHT ---------------------- */}
                <div className="lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">

                    {/* donut */}
                    <SummaryDonutCard
                        title="Vehicle Status"
                        centerValue={String(totalVehicles)}
                        centerLabel="Total"
                        showPercentage={true}
                        segments={[
                            { name: 'Live Auctions', value: bs.live || 0, color: '#22C55E' },
                            { name: 'Upcoming Auctions', value: bs.upcoming || 0, color: '#3B82F6' },
                            { name: 'Awaiting Payment', value: bs.pending_payment || 0, color: '#F97316' },
                            { name: 'Sold', value: bs.sold || 0, color: '#F59E0B' },
                            { name: 'Draft', value: bs.draft || 0, color: '#9CA3AF' },
                            { name: 'Unsold / Other', value: otherCount, color: '#CBD5E1' },
                        ]}
                    />

                    {/* acc summary */}
                    <div className="w-full bg-white rounded-2xl border border-slate-200 p-4 md:p-5 shadow-sm">
                        <h3 className="text-sm sm:text-base font-bold text-slate-900">Account Summary</h3>

                        <div className='mt-4 space-y-3'>
                            <div className='flex justify-between items-center'>
                                <div className='flex gap-2'>
                                    <Calendar className='w-4 h-4 text-gray-400' />
                                    <h1 className='text-slate-700 text-[13px] md:text-sm'>Seller Since</h1>
                                </div>
                                <p className='text-[13px] md:text-sm font-semibold text-slate-900'>{fmtDate(account.since)}</p>
                            </div>

                            <div className='flex justify-between items-center'>
                                <div className='flex gap-2'>
                                    <ShieldCheck className='w-4 h-4 text-gray-400' />
                                    <h1 className='text-slate-700 text-[13px] md:text-sm'>Verification Status</h1>
                                </div>
                                <p className={`text-[11px] md:text-[12px] font-semibold ${accountMeta.cls}`}>{accountMeta.label}</p>
                            </div>
                        </div>
                    </div>

                    {/* recent activity (real notifications) */}
                    <div className="w-full bg-white rounded-2xl border border-slate-200 p-4 md:p-5 shadow-sm">
                        <div className="flex flex-row items-center justify-between gap-3 mb-4">
                            <h3 className="text-sm sm:text-base font-bold text-slate-900">Recent Activity</h3>

                            <button
                                onClick={() => setCurrentPage('notifications')}
                                className="text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors cursor-pointer">
                                View All
                            </button>
                        </div>

                        <div className="relative divide-y divide-slate-100">
                            {activity.length === 0 && (
                                <div className="py-8 text-center">
                                    <Bell size={20} className="mx-auto text-slate-300" />
                                    <p className="mt-2 text-xs text-slate-400">No recent activity.</p>
                                </div>
                            )}

                            {activity.map((item) => (
                                <div 
                                key={item._id} 
                                className="py-3.5 flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-3.5 min-w-0">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${getIconStyle(item.type)}`}>
                                            {getIcon(item.type)}
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="text-[11px] sm:text-[12px] font-bold text-slate-900">{item.title}</h4>
                                            <p className="mt-0.5 text-[10px] sm:text-xs text-slate-500 font-medium line-clamp-2">{item.message}</p>
                                        </div>
                                    </div>

                                    <span className="shrink-0 text-[11px] sm:text-xs font-medium text-slate-400">
                                        {getRelativeTime(item.createdAt)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default SellerDashboard;
import React, { useEffect, useState } from 'react';
import { Check, CheckCircle, Clock, Eye, FileText, RefreshCw, RotateCcw, TimerOff, AlertTriangle, X } from 'lucide-react';

import SearchBar from '../../SharedComponents/SearchBar';
import FilterDropdown from '../../SharedComponents/FilterDropdown';
import SummaryDonutCard from '../../SharedComponents/SummaryDonutCard';
import DateRangePicker from '../../SharedComponents/DateRangePicker';
import { formatLabel, formatPrice, toYMD, fmtDate, fmtTime } from '../../utils/formatter';

import { getPaginationRange } from '../../utils/getPaginationRange';
import { useGetAllPayments } from '../../../hooks/usePayment';

// order status -> UI
const STATUS_META = {
    paid: { label: 'Completed', style: 'border-green-200 bg-green-50 text-green-700', amount: 'text-green-600' },
    pending_payment: { label: 'Pending', style: 'border-amber-200 bg-amber-50 text-amber-600', amount: 'text-slate-800' },
    expired: { label: 'Expired', style: 'border-slate-200 bg-slate-50 text-slate-600', amount: 'text-slate-500' },
    canceled: { label: 'Refunded', style: 'border-blue-200 bg-blue-50 text-blue-600', amount: 'text-blue-600' },
};

const ALERT_LABEL = {
    refunded_late: 'Auto-refunded (late)',
    refunded_duplicate: 'Auto-refunded (duplicate)',
    amount_mismatch: 'Auto-refunded (amount mismatch)',
    refund_failed: 'Refund failed',
};

const ACTIVITY_META = {
    paid: { title: 'Payment received', icon: Check, iconBg: 'bg-green-500' },
    pending_payment: { title: 'Payment pending', icon: Clock, iconBg: 'bg-orange-500' },
    expired: { title: 'Order expired', icon: X, iconBg: 'bg-slate-500' },
    canceled: { title: 'Order refunded', icon: RefreshCw, iconBg: 'bg-blue-600' },
};

// tabs 
const tabs = [
    { id: 'all-payments', label: 'All Payments', status: '' },
    { id: 'completed', label: 'Completed', status: 'paid' },
    { id: 'pending', label: 'Pending', status: 'pending_payment' },
    { id: 'expired', label: 'Expired', status: 'expired' },
    { id: 'refunded', label: 'Refunded', status: 'canceled' },
];

const filterConfig = [
    {
        label: 'All Payment Types',
        key: 'saleType',
        options: [
            { label: 'All Payment Types', value: '' },
            { label: 'Auction', value: 'auction' },
            { label: 'Buy Now', value: 'buy_now' },
        ],
    },
    {
        label: 'Sort By',
        key: 'sortBy',
        options: [
            { label: 'Newest', value: 'newest' },
            { label: 'Oldest', value: 'oldest' },
        ],
    },
];

function AllPayments({ setCurrentPage, setSelectedPaymentId }) {

    const [page, setPage] = useState(1);
    const [status, setStatus] = useState('');
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [filters, setFilters] = useState({ saleType: '', sortBy: 'newest' });

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const { data, isLoading, isError, isPlaceholderData } = useGetAllPayments({
        page,
        limit: 10,
        search: debouncedSearch,
        status,
        saleType: filters.saleType,
        sortBy: filters.sortBy,
        startDate: startDate ? toYMD(startDate) : '',
        endDate: endDate ? toYMD(endDate) : '',
    });

    const payments = data?.payments ?? [];
    const stats = data?.stats ?? {};
    const sources = data?.sources ?? {};
    const recent = data?.recent ?? [];
    const totalPages = data?.pagination?.totalPages || 1;

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 400);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        setPage(1);
    }, [status, filters, debouncedSearch, startDate, endDate]);

    const updateFilter = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    if (isLoading) return <p className="p-10 text-center">Loading payments....</p>;
    if (isError) return <p className="p-10 text-center text-red-500">Failed to load payments</p>;

    // stats
    const statsData = [
        {
            title: 'Total Orders',
            value: Number(stats.total?.count || 0).toLocaleString(),
            subTitle: 'All payment attempts',
            icon: FileText,
            theme: 'bg-purple-50',
            iconColor: 'text-purple-600',
        },
        {
            title: 'Completed Payments',
            value: Number(stats.paid?.count || 0).toLocaleString(),
            subTitle: `${formatPrice(stats.paid?.amount)} received`,
            icon: CheckCircle,
            theme: 'bg-green-50',
            iconColor: 'text-green-600',
        },
        {
            title: 'Pending Payments',
            value: Number(stats.pending_payment?.count || 0).toLocaleString(),
            subTitle: `${formatPrice(stats.pending_payment?.amount)} awaiting`,
            icon: Clock,
            theme: 'bg-amber-50',
            iconColor: 'text-amber-500',
        },
        {
            title: 'Expired Orders',
            value: Number(stats.expired?.count || 0).toLocaleString(),
            subTitle: `${formatPrice(stats.expired?.amount)} not collected`,
            icon: TimerOff,
            theme: 'bg-slate-50',
            iconColor: 'text-slate-500',
        },
        {
            title: 'Refunded Payments',
            value: Number(stats.canceled?.count || 0).toLocaleString(),
            subTitle: `${formatPrice(stats.canceled?.amount)} refunded`,
            icon: RotateCcw,
            theme: 'bg-blue-50',
            iconColor: 'text-blue-600',
        },
    ];

    const collected = Number(sources.auction?.amount || 0) + Number(sources.buy_now?.amount || 0);
    const sourceRows = [
        { name: 'Auction', ...sources.auction, color: 'bg-purple-600', theme: 'bg-purple-50 text-purple-600' },
        { name: 'Buy Now', ...sources.buy_now, color: 'bg-blue-600', theme: 'bg-blue-50 text-blue-600' },
    ].map((r) => ({
        ...r,
        count: r.count || 0,
        amount: r.amount || 0,
        percentage: collected ? Math.round((r.amount / collected) * 100) : 0,
    }));

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between pb-6">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3D]">All Payments</h1>
                    <div className="mt-2 flex items-center text-[11px] md:text-[13px]">
                        <span
                            onClick={() => setCurrentPage("dashboard")}
                            className="cursor-pointer text-slate-500 hover:text-[#D97706] transition-colors">
                            Dashboard
                        </span>

                        <span className="mx-2 text-slate-300">/</span>
                        <span className="text-slate-500">Payment Management</span>

                        <span className="mx-2 text-slate-300">/</span>
                        <span className="font-medium text-[#D97706]">All Payments</span>
                    </div>
                </div>
            </div>

            {/* stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-5 gap-4">
                {statsData.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className="group relative bg-white rounded-2xl border border-slate-100 px-4 py-5 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-300 flex items-center justify-between overflow-hidden"
                        >
                            <div className="min-w-0 pr-2">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1 truncate">
                                    {stat.title}
                                </span>
                                <h4 className="text-xl font-bold text-slate-900 tracking-tight truncate">
                                    {stat.value}
                                </h4>
                                <span className="text-[11px] font-medium mt-1.5 block text-slate-500 truncate">
                                    {stat.subTitle}
                                </span>
                            </div>

                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-sm ${stat.theme} ${stat.iconColor}`}>
                                <Icon className="w-5 h-5" />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Search / Filter */}
            <div className="my-6 bg-white border border-slate-200 rounded-xl p-4 space-y-4">

                <div className="flex flex-wrap xl:flex-nowrap items-center gap-3">

                    {/* Search */}
                    <div className="flex-1 sm:w-75">
                        <SearchBar
                            placeholder="Search by order ID, listing ID, vehicle, buyer or seller..."
                            value={search}
                            onChange={(value) => setSearch(value)}
                        />
                    </div>

                    {/* dropdowns */}
                    {filterConfig.map(({ label, key, options }) => (
                        <div key={key} className="w-full sm:w-45">
                            <FilterDropdown
                                label={label}
                                options={options}
                                value={filters[key]}
                                onChange={(value) => updateFilter(key, value)}
                            />
                        </div>
                    ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">

                    {/* Date Range (order date) */}
                    <DateRangePicker
                        startDate={startDate}
                        endDate={endDate}
                        onChange={(update) => {
                            setStartDate(update[0]);
                            setEndDate(update[1]);
                        }}
                    />

                    {/* clear btn */}
                    <button
                        type="button"
                        onClick={() => {
                            setSearch('');
                            setDebouncedSearch('');
                            setStatus('');
                            setFilters({ saleType: '', sortBy: 'newest' });
                            setStartDate(null);
                            setEndDate(null);
                            setPage(1);
                        }}
                        className="flex items-center gap-1.5 h-9 px-1.5 text-xs font-semibold text-amber-600 underline underline-offset-4 decoration-amber-300 hover:text-amber-700 hover:decoration-amber-600 transition-all">
                        Clear Filters
                    </button>
                </div>

            </div>

            {/* main section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 pb-6 gap-6">

                {/* -------------------------- LEFT -------------------------- */}
                <div className="xl:col-span-2 space-y-6">

                    {/* tabs */}
                    <div className="flex gap-10 border-b border-slate-100 my-6 overflow-x-auto no-scrollbar">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setStatus(tab.status)}
                                className={`pb-3 text-[14px] font-medium whitespace-nowrap border-b-2 transition-colors
                                    ${status === tab.status
                                        ? 'border-[#D97706] text-[#D97706]'
                                        : 'border-transparent text-slate-500 hover:text-slate-700'
                                    }`}>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* table */}
                    <div className="overflow-x-auto border border-gray-200 rounded-lg">
                        <table className="w-full text-left table-fixed">
                            <thead className="bg-gray-100 border-b border-gray-200 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 w-40">Payment ID</th>
                                    <th className="px-6 py-4 w-65">Vehicle</th>
                                    <th className="px-6 py-4 w-55">Buyer</th>
                                    <th className="px-6 py-4 w-32">Type</th>
                                    <th className="px-6 py-4 w-40">Amount</th>
                                    <th className="px-6 py-4 w-44">Status</th>
                                    <th className="px-6 py-4 w-36">Order Date</th>
                                    <th className="px-6 py-4 w-24">Actions</th>
                                </tr>
                            </thead>

                            <tbody
                                className={`divide-y divide-amber-50 transition-opacity ${isPlaceholderData ? 'opacity-50 pointer-events-none' : ''}`}>
                                {payments.length > 0 ? (
                                    payments.map((p) => {
                                        const meta = STATUS_META[p.status] || STATUS_META.pending_payment;
                                        const refundPending = p.status === 'canceled' && p.refundStatus && p.refundStatus !== 'succeeded';

                                        return (
                                            <tr
                                                key={p._id}
                                                className="hover:bg-gray-50/50 transition-colors">

                                                {/* payment id */}
                                                <td className="px-6 py-4">
                                                    <div className="text-[13px] font-semibold text-gray-700">{p.orderId || '---'}</div>
                                                    <div className="text-[11px] text-slate-400 mt-0.5">{p.listingId || '---'}</div>
                                                </td>

                                                {/* vehicle */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                                                            {p.vehicle?.image ? (
                                                                <img
                                                                    src={p.vehicle.image}
                                                                    alt={`${p.vehicle.make || ''} ${p.vehicle.model || ''}`}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : null}
                                                        </div>
                                                        <div className="min-w-0 flex flex-col">
                                                            <div className="text-[13px] font-semibold text-slate-800 truncate">
                                                                {p.vehicle
                                                                    ? `${p.vehicle.year || ''} ${formatLabel(p.vehicle.make)} ${formatLabel(p.vehicle.model)}`.trim()
                                                                    : '—'}
                                                            </div>
                                                            <span className="text-xs text-slate-500 truncate">
                                                                {p.vehicle
                                                                    ? [
                                                                        formatLabel(p.vehicle.fuelType),
                                                                        formatLabel(p.vehicle.transmission),
                                                                        formatLabel(p.vehicle.drivetrain),
                                                                    ].filter(Boolean).join(' • ') || '—'
                                                                    : '—'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* user info */}
                                                <td className="px-6 py-4">
                                                    <div className="text-[13px] font-semibold text-gray-700 truncate">
                                                        {p.buyer?.name || 'Deleted user'}
                                                    </div>
                                                    <div className="text-[11px] text-gray-500 truncate">
                                                        {p.buyer?.email || '—'}
                                                    </div>
                                                    <span
                                                        className={`mt-1 w-fit rounded-full px-2 py-0.5 text-[10px] font-semibold 
                                                            ${p.buyer?.type?.toLowerCase() === 'buyer'
                                                                ? 'bg-blue-100 text-blue-700'
                                                                : 'bg-purple-100 text-purple-700'
                                                            }`}
                                                    >
                                                        {formatLabel(p.buyer?.type) || 'Buyer'}
                                                    </span>
                                                </td>

                                                {/* type */}
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${p.source === 'auction'
                                                            ? 'bg-purple-50 text-purple-600'
                                                            : 'bg-blue-50 text-blue-600'
                                                            }`}>
                                                        {p.source === 'auction' ? 'Auction' : 'Buy Now'}
                                                    </span>
                                                </td>

                                                {/* amount */}
                                                <td className="px-6 py-4">
                                                    <span className={`text-[13px] font-bold ${meta.amount}`}>
                                                        {formatPrice(p.amount)}
                                                    </span>
                                                </td>

                                                {/* status */}
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded text-[11px] font-medium border ${meta.style}`}>
                                                        {refundPending ? 'Refund Pending' : meta.label}
                                                    </span>

                                                    {p.status === 'paid' && (
                                                        <div className="text-[11px] text-slate-400 mt-1">
                                                            Handover: {p.handoverStatus === 'confirmed' ? 'Confirmed' : 'Pending'}
                                                        </div>
                                                    )}

                                                    {p.alert && (
                                                        <div className="mt-1 flex items-center gap-1 text-[11px] font-medium text-red-600">
                                                            <AlertTriangle size={12} className="shrink-0" />
                                                            <span>{ALERT_LABEL[p.alert] || p.alert}</span>
                                                        </div>
                                                    )}
                                                </td>

                                                {/* order date */}
                                                <td className="px-6 py-4 text-[13px] leading-tight">
                                                    <div className="font-semibold text-slate-800">{fmtDate(p.createdAt)}</div>
                                                    <div className="text-[11px] text-slate-400 mt-0.5">{fmtTime(p.createdAt)}</div>
                                                </td>

                                                {/* actions */}
                                                <td className="px-6 py-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedPaymentId(p._id);
                                                            setCurrentPage('all-payments-detail');
                                                        }}
                                                        title="View payment"
                                                        className="p-1 text-slate-400 hover:text-slate-600">
                                                        <Eye size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <p className="text-sm font-medium text-gray-500">No Data Found</p>
                                                <p className="text-xs text-gray-400 mt-1">There are no payments to display.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between gap-4 px-6 py-4 border-t border-slate-200 bg-white">

                            <p className="hidden sm:block text-xs text-slate-500">
                                Page <span className="font-semibold text-[#0B1E3D]">{page}</span> of{" "}
                                <span className="font-semibold text-[#0B1E3D]">{totalPages}</span>
                            </p>

                            <div className="flex items-center gap-1.5 mx-auto sm:mx-0 sm:ml-auto">

                                <button
                                    type="button"
                                    onClick={() => setPage((p) => p - 1)}
                                    disabled={page === 1}
                                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                >
                                    Previous
                                </button>

                                {getPaginationRange(page, totalPages).map((num, idx) =>
                                    num === "..." ? (
                                        <span key={`dot-${idx}`} className="px-2 py-1.5 text-xs font-medium text-slate-400">...</span>
                                    ) : (
                                        <button
                                            type="button"
                                            key={num}
                                            onClick={() => setPage(num)}
                                            className={`min-w-8 h-8 px-2 rounded-lg text-xs font-semibold border transition-all ${page === num
                                                ? "bg-[#D97706] text-white border-[#D97706] shadow-sm"
                                                : "bg-white border-slate-200 text-slate-600 hover:bg-amber-50 hover:text-[#D97706] hover:border-amber-200"
                                                }`}
                                        >
                                            {num}
                                        </button>
                                    )
                                )}

                                <button
                                    type="button"
                                    onClick={() => setPage((p) => p + 1)}
                                    disabled={page === totalPages}
                                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                >
                                    Next
                                </button>

                            </div>
                        </div>
                    )}
                </div>

                {/* -------------------------- RIGHT -------------------------- */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">

                    <SummaryDonutCard
                        title="Payment Overview"
                        centerValue={String(stats.total?.count || 0)}
                        centerLabel="Total Orders"
                        showPercentage={true}
                        segments={[
                            { name: 'Completed', value: stats.paid?.count || 0, color: '#00B050' },
                            { name: 'Pending', value: stats.pending_payment?.count || 0, color: '#FF9900' },
                            { name: 'Expired', value: stats.expired?.count || 0, color: '#6B7280' },
                            { name: 'Refunded', value: stats.canceled?.count || 0, color: '#2B7FFF' },
                        ]}
                    />

                    {/* collected by type */}
                    <div className="w-full bg-white rounded-xl border border-slate-100 p-4 md:p-5 shadow-sm">
                        <h3 className="font-bold text-slate-900 text-[13px] md:text-sm mb-1">
                            Collected by Type
                        </h3>
                        <p className="text-[11px] text-slate-400 mb-5">Completed payments only</p>

                        <div className="space-y-4">
                            {sourceRows.map((row) => (
                                <div key={row.name} className="w-full">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <span className="flex-1 min-w-0 text-[11px] sm:text-xs font-medium text-slate-700 truncate">
                                            {row.name} <span className="text-slate-400">({row.count})</span>
                                        </span>
                                        <span className="text-[10px] sm:text-xs font-bold text-slate-800 whitespace-nowrap">
                                            {formatPrice(row.amount)}
                                        </span>
                                        <span className="w-8 sm:w-10 text-right text-[10px] sm:text-xs font-semibold text-slate-600">
                                            {row.percentage}%
                                        </span>
                                    </div>

                                    <div className="mt-1.5 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${row.color}`}
                                            style={{ width: `${row.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* recent activity */}
                    <div className="w-full bg-white rounded-xl border border-slate-100 p-4 md:p-5 shadow-sm">
                        <h3 className="font-bold text-slate-900 text-[13px] md:text-sm mb-4">
                            Recent Activity
                        </h3>

                        {recent.length > 0 ? (
                            <div className="divide-y divide-slate-100">
                                {recent.map((r) => {
                                    const meta = ACTIVITY_META[r.status] || ACTIVITY_META.pending_payment;
                                    const Icon = meta.icon;
                                    return (
                                        <div
                                            key={r._id}
                                            className="flex items-center gap-2.5 sm:gap-3 py-3 first:pt-0 last:pb-0">
                                            <div className={`w-5 h-5 shrink-0 rounded-full flex items-center justify-center ${meta.iconBg}`}>
                                                <Icon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-[10px] sm:text-[11px] md:text-xs font-bold text-slate-900 leading-tight">
                                                    {meta.title}
                                                </h4>
                                                <p className="text-[9px] sm:text-[10px] md:text-[11px] text-slate-500 mt-0.5 truncate">
                                                    {r.orderId} · {r.listingId}
                                                </p>
                                            </div>

                                            <div className="shrink-0 text-right">
                                                <p className="text-[9px] sm:text-[10px] md:text-[11px] font-bold text-[#0B1E3D]">
                                                    {formatPrice(r.amount)}
                                                </p>
                                                <p className="text-[8px] sm:text-[9px] md:text-[10px] text-slate-500 mt-0.5">
                                                    {fmtDate(r.updatedAt)} · {fmtTime(r.updatedAt)}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-xs text-slate-400">No activity yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AllPayments;

import React, { useEffect, useState } from 'react';
import { Check, Clock, Eye, Wallet, X, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

import SearchBar from '../../SharedComponents/SearchBar';
import FilterDropdown from '../../SharedComponents/FilterDropdown';
import SummaryDonutCard from '../../SharedComponents/SummaryDonutCard';
import DateRangePicker from '../../SharedComponents/DateRangePicker';
import { formatLabel, formatPrice, toYMD, fmtDate, fmtTime } from '../../utils/formatter';

import { getPaginationRange } from '../../utils/getPaginationRange';
import { useGetAllRefunds } from '../../../hooks/useRefund';

const STATUS_META = {
    completed: { label: 'Completed', style: 'border-green-200 bg-green-50 text-green-700', amount: 'text-green-600' },
    pending: { label: 'Pending', style: 'border-amber-200 bg-amber-50 text-amber-600', amount: 'text-amber-600' },
    failed: { label: 'Failed', style: 'border-red-200 bg-red-50 text-red-600', amount: 'text-slate-400' },
};

const KIND_META = {
    admin: { label: 'Admin Cancel', style: 'bg-purple-50 text-purple-600', bar: 'bg-purple-600' },
    late: { label: 'Late Payment', style: 'bg-blue-50 text-blue-600', bar: 'bg-blue-600' },
    duplicate: { label: 'Duplicate Payment', style: 'bg-orange-50 text-orange-600', bar: 'bg-orange-500' },
    mismatch: { label: 'Amount Mismatch', style: 'bg-pink-50 text-pink-600', bar: 'bg-pink-500' },
    auto_failed: { label: 'Auto-Refund Failed', style: 'bg-red-50 text-red-600', bar: 'bg-red-500' },
};

const ACTIVITY_META = {
    completed: { title: 'Refund completed', icon: Check, iconBg: 'bg-green-600' },
    pending: { title: 'Refund pending', icon: Clock, iconBg: 'bg-amber-500' },
    failed: { title: 'Refund failed', icon: X, iconBg: 'bg-red-500' },
};

const tabs = [
    { id: 'all-refunds', label: 'All Refunds', status: '' },
    { id: 'completed', label: 'Completed', status: 'completed' },
    { id: 'pending', label: 'Pending', status: 'pending' },
    { id: 'failed', label: 'Failed', status: 'failed' },
];

const filterConfig = [
    {
        label: 'All Refund Types',
        key: 'kind',
        options: [
            { label: 'All Refund Types', value: '' },
            { label: 'Admin Cancel', value: 'admin' },
            { label: 'Late Payment', value: 'late' },
            { label: 'Duplicate Payment', value: 'duplicate' },
            { label: 'Amount Mismatch', value: 'mismatch' },
            { label: 'Auto-Refund Failed', value: 'auto_failed' },
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

function Refunds({ setCurrentPage, setSelectedRefundId }) {

    const [page, setPage] = useState(1);
    const [status, setStatus] = useState('');
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [filters, setFilters] = useState({ kind: '', sortBy: 'newest' });

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const { data, isLoading, isError, isPlaceholderData } = useGetAllRefunds({
        page,
        limit: 10,
        search: debouncedSearch,
        status,
        kind: filters.kind,
        sortBy: filters.sortBy,
        startDate: startDate ? toYMD(startDate) : '',
        endDate: endDate ? toYMD(endDate) : '',
    });

    const refunds = data?.refunds ?? [];
    const stats = data?.stats ?? {};
    const kinds = data?.kinds ?? {};
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

    if (isLoading) return <p className="p-10 text-center">Loading refunds....</p>;
    if (isError) return <p className="p-10 text-center text-red-500">Failed to load refunds</p>;

    const statsData = [
        {
            title: 'Total Refunds',
            value: Number(stats.total?.count || 0).toLocaleString(),
            subTitle: `${formatPrice(stats.total?.amount)} refunded`,
            icon: Wallet,
            theme: 'bg-purple-50',
            iconColor: 'text-purple-600',
        },
        {
            title: 'Completed Refunds',
            value: Number(stats.completed?.count || 0).toLocaleString(),
            subTitle: formatPrice(stats.completed?.amount),
            icon: CheckCircle,
            theme: 'bg-green-50',
            iconColor: 'text-green-600',
        },
        {
            title: 'Pending Refunds',
            value: Number(stats.pending?.count || 0).toLocaleString(),
            subTitle: `${formatPrice(stats.pending?.amount)} awaiting gateway`,
            icon: Clock,
            theme: 'bg-amber-50',
            iconColor: 'text-amber-500',
        },
        {
            title: 'Failed Refunds',
            value: Number(stats.failed?.count || 0).toLocaleString(),
            subTitle: stats.failed?.resolved
                ? `${formatPrice(stats.failed?.amount)} open · ${stats.failed.resolved} resolved`
                : `${formatPrice(stats.failed?.amount)} not refunded`,
            icon: XCircle,
            theme: 'bg-red-50',
            iconColor: 'text-red-500',
        },
    ];

    const kindTotal = Object.values(kinds).reduce((sum, k) => sum + Number(k?.amount || 0), 0);
    const kindRows = Object.keys(KIND_META)
        .map((key) => ({
            key,
            ...KIND_META[key],
            count: kinds[key]?.count || 0,
            amount: kinds[key]?.amount || 0,
            percentage: kindTotal ? Math.round((Number(kinds[key]?.amount || 0) / kindTotal) * 100) : 0,
        }))
        .filter((r) => r.count > 0);

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between pb-6">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3D]">Refunds</h1>

                    <div className="mt-2 flex items-center text-[11px] md:text-[13px]">
                        <span
                            onClick={() => setCurrentPage("dashboard")}
                            className="cursor-pointer text-slate-500 hover:text-[#D97706] transition-colors">
                            Dashboard
                        </span>

                        <span className="mx-2 text-slate-300">/</span>
                        <span className="text-slate-500">Payment Management</span>

                        <span className="mx-2 text-slate-300">/</span>
                        <span className="font-medium text-[#D97706]">Refunds</span>
                    </div>
                </div>
            </div>

            {/* stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
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

                    <div className="flex-1 sm:w-75">
                        <SearchBar
                            placeholder="Search by order ID, listing ID, vehicle, buyer, seller or Stripe refund ID..."
                            value={search}
                            onChange={(value) => setSearch(value)}
                        />
                    </div>

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

                    <DateRangePicker
                        startDate={startDate}
                        endDate={endDate}
                        onChange={(update) => {
                            setStartDate(update[0]);
                            setEndDate(update[1]);
                        }}
                    />

                    <button
                        type="button"
                        onClick={() => {
                            setSearch('');
                            setDebouncedSearch('');
                            setStatus('');
                            setFilters({ kind: '', sortBy: 'newest' });
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
                                    <th className="px-6 py-4 w-44">Order / Refund ID</th>
                                    <th className="px-6 py-4 w-52">Buyer</th>
                                    <th className="px-6 py-4 w-40">Type</th>
                                    <th className="px-6 py-4 w-36">Amount</th>
                                    <th className="px-6 py-4 w-48">Reason</th>
                                    <th className="px-6 py-4 w-36">Status</th>
                                    <th className="px-6 py-4 w-36">Date</th>
                                    <th className="px-6 py-4 w-24">Actions</th>
                                </tr>
                            </thead>

                            <tbody
                                className={`divide-y divide-amber-50 transition-opacity ${isPlaceholderData ? 'opacity-50 pointer-events-none' : ''}`}>
                                {refunds.length > 0 ? (
                                    refunds.map((r) => {
                                        const meta = STATUS_META[r.status] || STATUS_META.pending;
                                        const kindMeta = KIND_META[r.kind] || KIND_META.auto_failed;

                                        return (
                                            <tr 
                                            key={r._id} 
                                            className="hover:bg-gray-50/50 transition-colors">

                                                {/* ids */}
                                                <td className="px-6 py-4">
                                                    <div className="text-[13px] font-semibold text-slate-800">{r.orderId || '---'}</div>
                                                    <div className="text-[11px] text-slate-400 mt-0.5 truncate" title={r.stripeRefundId || ''}>
                                                        {r.stripeRefundId || r.listingId || '---'}
                                                    </div>
                                                </td>

                                                {/* buyer */}
                                                <td className="px-6 py-4">
                                                    <div className="text-[13px] font-semibold text-gray-700 truncate">
                                                        {r.buyer?.name || 'Deleted user'}
                                                    </div>
                                                    <div className="text-[11px] text-gray-500 truncate">
                                                        {r.buyer?.email || '—'}
                                                    </div>
                                                    {r.vehicle && (
                                                        <div className="text-[11px] text-slate-400 truncate">
                                                            {`${r.vehicle.year || ''} ${formatLabel(r.vehicle.make)} ${formatLabel(r.vehicle.model)}`.trim()}
                                                        </div>
                                                    )}
                                                </td>

                                                {/* type */}
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${kindMeta.style}`}>
                                                        {kindMeta.label}
                                                    </span>
                                                </td>

                                                {/* amount */}
                                                <td className="px-6 py-4">
                                                    <span className={`text-[13px] font-bold ${meta.amount} ${r.status === 'failed' ? 'line-through' : ''}`}>
                                                        {r.amount != null ? formatPrice(r.amount) : '—'}
                                                    </span>
                                                </td>

                                                {/* reason */}
                                                <td className="px-6 py-4 text-[13px] leading-tight">
                                                    <div className="text-slate-700 line-clamp-2" title={r.reason || r.failureNote || ''}>
                                                        {r.reason || r.failureNote || '—'}
                                                    </div>
                                                </td>

                                                {/* status */}
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded text-[11px] font-medium border ${meta.style}`}>
                                                        {meta.label}
                                                    </span>
                                                    {r.resolved && (
                                                        <div className="mt-1 text-[11px] font-medium text-green-600">Resolved on retry</div>
                                                    )}
                                                    {r.status === 'failed' && !r.resolved && (
                                                        <div className="mt-1 flex items-center gap-1 text-[11px] font-medium text-red-600">
                                                            <AlertTriangle size={12} className="shrink-0" />
                                                            <span>Needs attention</span>
                                                        </div>
                                                    )}
                                                </td>

                                                {/* date */}
                                                <td className="px-6 py-4 text-[13px] leading-tight">
                                                    <div className="font-semibold text-slate-800">{fmtDate(r.createdAt)}</div>
                                                    <div className="text-[11px] text-slate-400 mt-0.5">{fmtTime(r.createdAt)}</div>
                                                </td>

                                                {/* actions */}
                                                <td className="px-6 py-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedRefundId(r._id);
                                                            setCurrentPage('refunds-detail');
                                                        }}
                                                        title="View refund"
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
                                                <p className="text-xs text-gray-400 mt-1">There are no refunds to display.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <p className="text-[11px] text-slate-400">
                        Auto-refunds (late / duplicate / mismatch) show as Completed once the refund is created. Their final Stripe status is not synced yet.
                    </p>

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
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6 content-start">

                    <SummaryDonutCard
                        title="Refund Overview"
                        centerValue={String(stats.total?.count || 0)}
                        centerLabel="Total Refunds"
                        showPercentage={true}
                        segments={[
                            { name: 'Completed', value: stats.completed?.count || 0, color: '#00B050' },
                            { name: 'Pending', value: stats.pending?.count || 0, color: '#FF9900' },
                            { name: 'Failed', value: (stats.failed?.count || 0) + (stats.failed?.resolved || 0), color: '#FF3B30' },
                        ]}
                    />

                    {/* refunded by type */}
                    <div className="w-full bg-white rounded-xl border border-slate-100 p-4 md:p-5 shadow-sm">
                        <h3 className="font-bold text-slate-900 text-[13px] md:text-sm mb-1">Refunded by Type</h3>
                        <p className="text-[11px] text-slate-400 mb-5">Completed + pending only</p>

                        {kindRows.length > 0 ? (
                            <div className="space-y-4">
                                {kindRows.map((row) => (
                                    <div key={row.key} className="w-full">
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <span className="flex-1 min-w-0 text-[11px] sm:text-xs font-medium text-slate-700 truncate">
                                                {row.label} <span className="text-slate-400">({row.count})</span>
                                            </span>
                                            <span className="text-[10px] sm:text-xs font-bold text-slate-800 whitespace-nowrap">
                                                {formatPrice(row.amount)}
                                            </span>
                                            <span className="w-8 sm:w-10 text-right text-[10px] sm:text-xs font-semibold text-slate-600">
                                                {row.percentage}%
                                            </span>
                                        </div>

                                        <div className="mt-1.5 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full ${row.bar}`} style={{ width: `${row.percentage}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-slate-400">No refunds yet.</p>
                        )}
                    </div>

                    {/* recent activity */}
                    <div className="w-full bg-white rounded-xl border border-slate-100 p-4 md:p-5 shadow-sm">
                        <h3 className="font-bold text-slate-900 text-[13px] md:text-sm mb-4">Recent Activity</h3>

                        {recent.length > 0 ? (
                            <div className="divide-y divide-slate-100">
                                {recent.map((r) => {
                                    const meta = ACTIVITY_META[r.status] || ACTIVITY_META.pending;
                                    const Icon = meta.icon;
                                    return (
                                        <div key={r._id} className="flex items-center gap-2.5 sm:gap-3 py-3 first:pt-0 last:pb-0">
                                            <div className={`w-5 h-5 shrink-0 rounded-full flex items-center justify-center ${meta.iconBg}`}>
                                                <Icon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-[10px] sm:text-[11px] md:text-xs font-bold text-slate-900 leading-tight">
                                                    {meta.title}
                                                </h4>
                                                <p className="text-[9px] sm:text-[10px] md:text-[11px] text-slate-500 mt-0.5 truncate">
                                                    {r.orderId || '—'} · {KIND_META[r.kind]?.label || r.kind}
                                                </p>
                                            </div>

                                            <div className="shrink-0 text-right">
                                                <p className="text-[9px] sm:text-[10px] md:text-[11px] font-bold text-[#0B1E3D]">
                                                    {r.amount != null ? formatPrice(r.amount) : '—'}
                                                </p>
                                                <p className="text-[8px] sm:text-[9px] md:text-[10px] text-slate-500 mt-0.5">
                                                    {fmtDate(r.createdAt)} · {fmtTime(r.createdAt)}
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

export default Refunds;
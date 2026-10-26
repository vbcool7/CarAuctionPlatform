
import React, { useEffect, useState } from 'react';
import {
    AlertTriangle, ArrowDownLeft, ArrowUpRight, Check, CheckCircle, Clock, CreditCard, DollarSign,
    Eye, Landmark, RotateCcw, X, Wallet,
} from 'lucide-react';

import SearchBar from '../../SharedComponents/SearchBar';
import FilterDropdown from '../../SharedComponents/FilterDropdown';
import SummaryDonutCard from '../../SharedComponents/SummaryDonutCard';
import DateRangePicker from '../../SharedComponents/DateRangePicker';
import { formatLabel, formatPrice, toYMD, fmtDate, fmtTime } from '../../utils/formatter';

import { getPaginationRange } from '../../utils/getPaginationRange';
import { useGetAllTransactions } from '../../../hooks/useTransaction';

const STATUS_META = {
    completed: { label: 'Completed', style: 'border-green-200 bg-green-50 text-green-700' },
    pending: { label: 'Pending', style: 'border-amber-200 bg-amber-50 text-amber-600' },
    failed: { label: 'Failed', style: 'border-red-200 bg-red-50 text-red-600' },
};

const KIND_META = {
    payment: { label: 'Payment Received', style: 'bg-green-50 text-green-700', bar: 'bg-green-600', sign: '+', amountCls: 'text-green-600', method: 'Card (Stripe)', Icon: CreditCard, DirIcon: ArrowDownLeft },
    refund: { label: 'Refund', style: 'bg-purple-50 text-purple-600', bar: 'bg-purple-600', sign: '-', amountCls: 'text-red-600', method: 'Card (Stripe)', Icon: CreditCard, DirIcon: ArrowUpRight },
    payout: { label: 'Seller Payout', style: 'bg-blue-50 text-blue-600', bar: 'bg-blue-600', sign: '-', amountCls: 'text-blue-600', method: 'Bank Transfer', Icon: Landmark, DirIcon: ArrowUpRight },
};

const ACTIVITY_TITLE = {
    payment: { completed: 'Payment received', pending: 'Payment processing', failed: 'Payment failed' },
    refund: { completed: 'Refund processed', pending: 'Refund pending', failed: 'Refund failed' },
    payout: { completed: 'Payout completed', pending: 'Payout requested', failed: 'Payout failed' },
};

const ACTIVITY_ICON = {
    completed: { icon: Check, iconBg: 'bg-green-600' },
    pending: { icon: Clock, iconBg: 'bg-amber-500' },
    failed: { icon: X, iconBg: 'bg-red-500' },
};

const tabs = [
    { id: 'all', label: 'All Transactions', status: '' },
    { id: 'completed', label: 'Completed', status: 'completed' },
    { id: 'pending', label: 'Pending', status: 'pending' },
    { id: 'failed', label: 'Failed', status: 'failed' },
];

const filterConfig = [
    {
        label: 'All Transaction Types',
        key: 'kind',
        options: [
            { label: 'All Transaction Types', value: '' },
            { label: 'Payment Received', value: 'payment' },
            { label: 'Refund', value: 'refund' },
            { label: 'Seller Payout', value: 'payout' },
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

function Transactions({ setCurrentPage, setSelectedTransactionId }) {

    const [page, setPage] = useState(1);
    const [status, setStatus] = useState('');
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [filters, setFilters] = useState({ kind: '', sortBy: 'newest' });

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const { data, isLoading, isError, isPlaceholderData } = useGetAllTransactions({
        page,
        limit: 10,
        search: debouncedSearch,
        status,
        kind: filters.kind,
        sortBy: filters.sortBy,
        startDate: startDate ? toYMD(startDate) : '',
        endDate: endDate ? toYMD(endDate) : '',
    });

    const transactions = data?.transactions ?? [];
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

    if (isLoading) return <p className="p-10 text-center">Loading transactions....</p>;
    if (isError) return <p className="p-10 text-center text-red-500">Failed to load transactions</p>;

    // stats
    const statsData = [
        {
            title: 'Total Transactions',
            value: Number(stats.total?.count || 0).toLocaleString(),
            subTitle: stats.failed?.open ? `${stats.failed.open} need attention` : 'No open failures',
            icon: DollarSign,
            theme: 'bg-purple-50',
            iconColor: 'text-purple-600',
        },
        {
            title: 'Money Received',
            value: formatPrice(stats.received?.amount),
            subTitle: `${stats.received?.count || 0} payments`,
            icon: CheckCircle,
            theme: 'bg-green-50',
            iconColor: 'text-green-600',
        },
        {
            title: 'Refunded',
            value: formatPrice(stats.refunded?.amount),
            subTitle: `${stats.refunded?.count || 0} refunds`,
            icon: RotateCcw,
            theme: 'bg-blue-50',
            iconColor: 'text-blue-600',
        },
        {
            title: 'Paid to Sellers',
            value: formatPrice(stats.paidOut?.amount),
            subTitle: `${stats.paidOut?.count || 0} payouts`,
            icon: Wallet,
            theme: 'bg-indigo-50',
            iconColor: 'text-indigo-600',
        },
        {
            title: 'Pending',
            value: Number(stats.pending?.count || 0).toLocaleString(),
            subTitle: `${formatPrice(stats.pending?.amount)} in transit`,
            icon: Clock,
            theme: 'bg-amber-50',
            iconColor: 'text-amber-500',
        },
    ];

    const volumeTotal = Object.values(kinds).reduce((sum, k) => sum + Number(k?.amount || 0), 0);
    const kindRows = Object.keys(KIND_META)
        .map((key) => ({
            key,
            ...KIND_META[key],
            count: kinds[key]?.count || 0,
            amount: kinds[key]?.amount || 0,
            percentage: volumeTotal ? Math.round((Number(kinds[key]?.amount || 0) / volumeTotal) * 100) : 0,
        }))
        .filter((r) => r.count > 0);

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between pb-6">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3D]">Transactions</h1>

                    <div className="mt-2 flex items-center text-[11px] md:text-[13px]">
                        <span
                            onClick={() => setCurrentPage("dashboard")}
                            className="cursor-pointer text-slate-500 hover:text-[#D97706] transition-colors">
                            Dashboard
                        </span>

                        <span className="mx-2 text-slate-300">/</span>
                        <span className="text-slate-500">Payment Management</span>

                        <span className="mx-2 text-slate-300">/</span>
                        <span className="font-medium text-[#D97706]">Transactions</span>
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
                                <h4 className="text-lg font-bold text-slate-900 tracking-tight truncate">
                                    {stat.value}
                                </h4>
                                <span className="text-[11px] font-medium mt-1.5 block text-slate-500 truncate">
                                    {stat.subTitle}
                                </span>
                            </div>

                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-sm ${stat.theme} ${stat.iconColor}`}>
                                <Icon className="w-4.5 h-4.5" />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Search / Filter */}
            <div className="my-6 bg-white border border-slate-200 rounded-xl p-4 space-y-4">

                <div className="flex flex-wrap xl:flex-nowrap items-center gap-3">
                    <div className="flex-1 sm:w-70">
                        <SearchBar
                            placeholder="Search by order ID, payout ID, listing ID, buyer, seller or reference..."
                            value={search}
                            onChange={(value) => setSearch(value)}
                        />
                    </div>

                    {filterConfig.map(({ label, key, options }) => (
                        <div key={key} className="w-full sm:w-47">
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
                                    <th className="px-6 py-4 w-48">Transaction</th>
                                    <th className="px-6 py-4 w-56">Party</th>
                                    <th className="px-6 py-4 w-46">Type</th>
                                    <th className="px-6 py-4 w-40">Amount</th>
                                    <th className="px-6 py-4 w-40">Method</th>
                                    <th className="px-6 py-4 w-36">Status</th>
                                    <th className="px-6 py-4 w-36">Date</th>
                                    <th className="px-6 py-4 w-24">Actions</th>
                                </tr>
                            </thead>

                            <tbody
                                className={`divide-y divide-amber-50 transition-opacity ${isPlaceholderData ? 'opacity-50 pointer-events-none' : ''}`}>
                                {transactions.length > 0 ? (
                                    transactions.map((t) => {
                                        const meta = STATUS_META[t.status] || STATUS_META.pending;
                                        const kindMeta = KIND_META[t.kind] || KIND_META.payment;
                                        const MethodIcon = kindMeta.Icon;
                                        const DirIcon = kindMeta.DirIcon;

                                        return (
                                            <tr 
                                            key={t.key} 
                                            className="hover:bg-gray-50/50 transition-colors">

                                                {/* id + reference */}
                                                <td className="px-6 py-4">
                                                    <div className="text-[13px] font-semibold text-slate-800 truncate">
                                                        {t.kind === 'payout' ? (t.payoutCode || '---') : (t.orderId || '---')}
                                                    </div>
                                                    <div className="text-[11px] text-slate-400 mt-0.5 truncate" title={t.reference || ''}>
                                                        {t.reference || t.listingId || '---'}
                                                    </div>
                                                </td>

                                                {/* party */}
                                                <td className="px-6 py-4">
                                                    <div className="text-[13px] font-semibold text-gray-700 truncate">
                                                        {t.party?.name || 'Unknown user'}
                                                    </div>
                                                    <div className="text-[11px] text-gray-500 truncate">
                                                        {t.party?.email || '—'}
                                                    </div>
                                                    {t.vehicle && (
                                                        <div className="text-[11px] text-slate-400 truncate">
                                                            {`${t.vehicle.year || ''} ${formatLabel(t.vehicle.make)} ${formatLabel(t.vehicle.model)}`.trim()}
                                                        </div>
                                                    )}
                                                </td>

                                                {/* type */}
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${kindMeta.style}`}>
                                                        <DirIcon size={12} />
                                                        {kindMeta.label}
                                                    </span>
                                                </td>

                                                {/* amount */}
                                                <td className="px-6 py-4">
                                                    <span className={`text-[13px] font-bold ${t.status === 'failed' ? 'text-slate-400 line-through' : kindMeta.amountCls}`}>
                                                        {t.status === 'failed' ? '' : kindMeta.sign}{formatPrice(t.amount)}
                                                    </span>
                                                </td>

                                                {/* method */}
                                                <td className="px-6 py-4 text-[13px] text-slate-700">
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-6 h-6 rounded-md flex items-center justify-center bg-slate-100 text-slate-600 shrink-0">
                                                            <MethodIcon className="w-3.5 h-3.5" />
                                                        </span>
                                                        <span className="font-semibold text-slate-800 truncate">{kindMeta.method}</span>
                                                    </div>
                                                </td>

                                                {/* status */}
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded text-[11px] font-medium border ${meta.style}`}>
                                                        {meta.label}
                                                    </span>
                                                    {t.resolved && (
                                                        <div className="mt-1 text-[11px] font-medium text-green-600">Resolved on retry</div>
                                                    )}
                                                    {t.status === 'failed' && !t.resolved && (
                                                        <div className="mt-1 flex items-center gap-1 text-[11px] font-medium text-red-600">
                                                            <AlertTriangle size={12} className="shrink-0" />
                                                            <span>Needs attention</span>
                                                        </div>
                                                    )}
                                                </td>

                                                {/* date */}
                                                <td className="px-6 py-4 text-[13px] leading-tight">
                                                    <div className="font-semibold text-slate-800">{fmtDate(t.at)}</div>
                                                    <div className="text-[11px] text-slate-400 mt-0.5">{fmtTime(t.at)}</div>
                                                </td>

                                                {/* actions */}
                                                <td className="px-6 py-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedTransactionId(t.key);
                                                            setCurrentPage('transactions-detail');
                                                        }}
                                                        title="View transaction"
                                                        className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
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
                                                <p className="text-xs text-gray-400 mt-1">There are no transactions to display.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <p className="text-[11px] text-slate-400">
                        Auto-refunds show as Completed once the refund is created; their final Stripe status is not synced yet. Gateway fees are not recorded.
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
                        title="Transaction Overview"
                        centerValue={String(stats.total?.count || 0)}
                        centerLabel="Total"
                        showPercentage={true}
                        segments={[
                            { name: 'Completed', value: stats.completed?.count || 0, color: '#00B050' },
                            { name: 'Pending', value: stats.pending?.count || 0, color: '#FF9900' },
                            { name: 'Failed', value: stats.failed?.count || 0, color: '#FF3B30' },
                        ]}
                    />

                    {/* volume by type */}
                    <div className="w-full bg-white rounded-xl border border-slate-100 p-4 md:p-5 shadow-sm">
                        <h3 className="font-bold text-slate-900 text-[13px] md:text-sm mb-1">Volume by Type</h3>
                        <p className="text-[11px] text-slate-400 mb-5">Completed + pending only</p>

                        {kindRows.length > 0 ? (
                            <div className="space-y-4">
                                {kindRows.map((row) => {
                                    const RowIcon = row.Icon;
                                    return (
                                        <div key={row.key} className="w-full">
                                            <div className="flex items-center gap-2 sm:gap-3">
                                                <div className={`w-7 h-7 sm:w-8 sm:h-8 shrink-0 flex items-center justify-center rounded-lg ${row.style}`}>
                                                    <RowIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                </div>
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

                                            <div className="ml-9 sm:ml-11 mt-1.5 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full ${row.bar}`} style={{ width: `${row.percentage}%` }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-xs text-slate-400">No transactions yet.</p>
                        )}
                    </div>

                    {/* recent activity */}
                    <div className="w-full bg-white rounded-xl border border-slate-100 p-4 md:p-5 shadow-sm">
                        <h3 className="font-bold text-slate-900 text-[13px] md:text-sm mb-4">Recent Activity</h3>

                        {recent.length > 0 ? (
                            <div className="divide-y divide-slate-100">
                                {recent.map((r) => {
                                    const act = ACTIVITY_ICON[r.status] || ACTIVITY_ICON.pending;
                                    const Icon = act.icon;
                                    const title = ACTIVITY_TITLE[r.kind]?.[r.status] || 'Transaction';
                                    return (
                                        <div 
                                        key={r.key} 
                                        className="flex items-center gap-2.5 sm:gap-3 py-3 first:pt-0 last:pb-0">
                                            <div className={`w-5 h-5 shrink-0 rounded-full flex items-center justify-center ${act.iconBg}`}>
                                                <Icon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-[10px] sm:text-[11px] md:text-xs font-bold text-slate-900 leading-tight">
                                                    {title}
                                                </h4>
                                                <p className="text-[9px] sm:text-[10px] md:text-[11px] text-slate-500 mt-0.5 truncate">
                                                    {r.ref || '—'}
                                                </p>
                                            </div>

                                            <div className="shrink-0 text-right">
                                                <p className="text-[9px] sm:text-[10px] md:text-[11px] font-bold text-[#0B1E3D]">
                                                    {formatPrice(r.amount)}
                                                </p>
                                                <p className="text-[8px] sm:text-[9px] md:text-[10px] text-slate-500 mt-0.5">
                                                    {fmtDate(r.at)} · {fmtTime(r.at)}
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

export default Transactions;
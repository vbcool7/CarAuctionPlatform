
import React, { useState } from 'react';
import { Wallet, CheckSquare, Clock, X, Download, Check, Eye, XCircle, CheckCircle } from "lucide-react";
import DateRangePicker from '../../SharedComponents/DateRangePicker';
import { toast } from 'react-hot-toast';

import SearchBar from '../../SharedComponents/SearchBar';
import FilterDropdown from '../../SharedComponents/FilterDropdown';
import SummaryDonutCard from '../../SharedComponents/SummaryDonutCard';
import { formatLabel } from '../../utils/formatter';

import useAdminAuthStore from '../../../store/useAdminAuthStore';
import { useAdminPayoutAction, useGetAllPayouts } from '../../../hooks/usePayout';
import { getPaginationRange } from '../../utils/getPaginationRange';
import { useEffect } from 'react';

const recentActivity = [
    { title: "Payout completed", desc: "PAYOUT-2024-0243 to Michael Johnson", amount: "$45,500.00", time: "10:30 AM", icon: Check, iconBg: "bg-green-500" },
    { title: "Payout pending", desc: "PAYOUT-2024-041 to David Brown", amount: "$18,200.00", time: "11:20 AM", icon: Clock, iconBg: "bg-orange-500" },
    { title: "Payout failed", desc: "PAYOUT-2024-0237 to Robert Taylor", amount: "$9,750.00", time: "12:10 PM", icon: X, iconBg: "bg-red-500" },
    { title: "Payout completed", desc: "PAYOUT-2024-0231 to Sarah Williams", amount: "$24,750.00", time: "09:45 AM", icon: Check, iconBg: "bg-green-500" },
];

// tabs
const tabs = [
    { id: 'all-payouts', label: 'All Payouts', status: '' },
    { id: 'on_hold', label: 'On Hold', status: 'on_hold' },
    { id: 'available', label: 'Available', status: 'available' },
    { id: 'requested', label: 'Requested', status: 'requested' },
    { id: 'paid', label: 'Paid', status: 'paid' },
    { id: 'canceled', label: 'Canceled', status: 'canceled' },
];

const STATUS_STYLES = {
    on_hold: 'border-gray-200 bg-gray-50 text-gray-600',
    available: 'border-blue-200 bg-blue-50 text-blue-600',
    requested: 'border-amber-200 bg-amber-50 text-amber-600',
    paid: 'border-green-200 bg-green-50 text-green-700',
    canceled: 'border-red-200 bg-red-50 text-red-600',
};

const filterConfig = [
    {
        label: 'All Payout Amounts',
        key: 'amountRange',
        options: [
            { label: 'All Amounts', value: '' },
            { label: 'Under AED 1,000', value: 'under1000' },
            { label: 'AED 1,000–10,000', value: '1000to10000' },
            { label: 'AED 10,000–50,000', value: '10000to50000' },
            { label: 'Above AED 50,000', value: 'above50000' },
        ],
    },
];

const toYMD = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const mapFiltersToParams = (filters, search, startDate, endDate) => {
    const params = {};

    if (filters.amountRange) params.amountRange = filters.amountRange;
    if (search) params.search = search;
    if (startDate) params.startDate = toYMD(startDate);
    if (endDate) params.endDate = toYMD(endDate);

    return params;
};

function Payouts({ setCurrentPage, setSelectedPayoutId }) {

    const [page, setPage] = useState(1);
    const [status, setStatus] = useState('');
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [filters, setFilters] = useState({
        amountRange: ''
    });

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const fmtMoney = (n, cur = 'AED') =>
        `${cur} ${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
    const fmtDate = (d) => (d ? new Date(d) : null);

    const params = mapFiltersToParams(filters, debouncedSearch, startDate, endDate);

    const { admin } = useAdminAuthStore();
    const { data, isLoading, isError } = useGetAllPayouts({ page, limit: 10, status, ...params });
    const { mutate: run, isPending } = useAdminPayoutAction();

    const isAdmin = admin?.role === 'admin';
    const payoutsList = data?.payouts ?? [];
    const summary = data?.summary ?? {};
    const totalPages = data?.pagination?.totalPages || 1;

    useEffect(() => {
        setPage(1);
    }, [filters, search, startDate, endDate]);

    // debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 400);
        return () => clearTimeout(timer);
    }, [search]);

    const updateFilter = (key, value) => {
        if (key === 'status') {
            setStatus(value);
        } else {
            setFilters((prev) => ({ ...prev, [key]: value }));
        }
        setPage(1);
    };

    if (isLoading) return <p className="p-10 text-center">Loading payout list....</p>;
    if (isError) return <p className="p-10 text-center text-red-500">Failed to load payout list</p>;

    // stats
    const payoutStats = [
        {
            title: "On Hold",
            value: fmtMoney(summary.on_hold?.total),
            subTitle: `${summary.on_hold?.count ?? 0} payouts`,
            subTextColor: "text-slate-500",
            icon: Clock,
            theme: "bg-slate-50",
            iconColor: "text-slate-600",
        },
        {
            title: "Available",
            value: fmtMoney(summary.available?.total),
            subTitle: `${summary.available?.count ?? 0} payouts`,
            subTextColor: "text-slate-500",
            icon: Wallet,
            theme: "bg-blue-50",
            iconColor: "text-blue-600",
        },
        {
            title: "Requested",
            value: fmtMoney(summary.requested?.total),
            subTitle: `${summary.requested?.count ?? 0} payouts`,
            subTextColor: "text-slate-500",
            icon: Clock,
            theme: "bg-amber-50",
            iconColor: "text-amber-600",
        },
        {
            title: "Paid",
            value: fmtMoney(summary.paid?.total),
            subTitle: `${summary.paid?.count ?? 0} payouts`,
            subTextColor: "text-slate-500",
            icon: CheckSquare,
            theme: "bg-green-50",
            iconColor: "text-green-600",
        },
    ];

    // payout hand over
    const handleConfirmHandover = (p) => {
        if (!p.orderId?._id) return;

        const note = window.prompt('Enter handover verification note:');

        if (!note || note.trim().length < 3) return;

        run(
            {
                type: 'handover',
                id: p.orderId._id,
                body: { note: note.trim() },
            },
            {
                onSuccess: () => toast.success('Handover confirmed successfully'),
                onError: (error) =>
                    toast.error(error.response?.data?.message || 'Failed to confirm handover'),
            }
        );
    };

    // payout mark paid
    const handleMarkPaid = (p) => {
        const transferReference = window.prompt('Enter bank transfer reference:');

        if (!transferReference || transferReference.trim().length < 3) return;

        if (!window.confirm('Have you completed the bank transfer to the seller?')) return;

        run(
            {
                type: 'paid',
                id: p._id,
                body: { transferReference: transferReference.trim() },
            },
            {
                onSuccess: () => toast.success('Payout marked as paid'),
                onError: (error) =>
                    toast.error(error.response?.data?.message || 'Failed to mark payout as paid'),
            }
        );
    };

    // payout reject
    const handleReject = (p) => {
        const reason = window.prompt('Enter reason for rejecting this payout:');

        if (!reason || reason.trim().length < 3) return;

        run(
            {
                type: 'reject',
                id: p._id,
                body: { reason: reason.trim() },
            },
            {
                onSuccess: () => toast.success('Payout request rejected'),
                onError: (error) =>
                    toast.error(error.response?.data?.message || 'Failed to reject payout'),
            }
        );
    };

    // payout refund
    const handleRefund = (p) => {
        if (!p.orderId?._id) return;

        if (!window.confirm('Are you sure you want to cancel this order and initiate a refund?')) {
            return;
        }

        const reason = window.prompt('Enter reason for cancellation and refund:');

        if (!reason || reason.trim().length < 3) return;

        run(
            {
                type: 'refund',
                id: p.orderId._id,
                body: { reason: reason.trim() },
            },
            {
                onSuccess: () => toast.success('Cancellation and refund processed'),
                onError: (error) =>
                    toast.error(error.response?.data?.message || 'Failed to process refund'),
            }
        );
    };

    return (
        <div>

            {/* Header */}
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between pb-6">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3D]">Payouts</h1>
                    <div className="mt-2 flex items-center text-[11px] md:text-[13px]">
                        <span
                            onClick={() => setCurrentPage("dashboard")}
                            className="cursor-pointer text-slate-500 hover:text-[#D97706] transition-colors">
                            Dashboard
                        </span>

                        <span className="mx-2 text-slate-300">/</span>
                        <span className="text-slate-500">Payment Management</span>

                        <span className="mx-2 text-slate-300">/</span>
                        <span className="font-medium text-[#D97706]"> Payouts</span>
                    </div>
                </div>

                {/* btns */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <button className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-transparent p-2 font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-[#D97706] hover:text-[#D97706] hover:bg-amber-50">
                        <Download size={16} />
                        <span className="text-[13px]">Export Report</span>
                    </button>

                    <button className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-transparent p-2 font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-[#D97706] hover:text-[#D97706] hover:bg-amber-50">
                        <Download size={16} />
                        <span className="text-[13px]">Download Payouts</span>
                    </button>

                    <button
                        onClick={() => setCurrentPage('create-payout')}
                        className="flex items-center justify-center gap-1.5 rounded-lg bg-[#D97706] px-4 py-2 font-medium text-white shadow-md shadow-amber-500/20 transition-all duration-200 hover:bg-[#B45F04] hover:scale-[1.02]">
                        <span className="text-sm">Create Payouts</span>
                    </button>
                </div>
            </div>

            {/* stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {payoutStats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm flex items-center justify-between"
                        >
                            <div>
                                <span className="text-xs font-semibold text-slate-500 block mb-0.5">
                                    {stat.title}
                                </span>
                                <h4 className="py-1 text-base font-bold text-slate-900 tracking-tight">
                                    {stat.value}
                                </h4>
                                <span className={`text-[11px] font-medium mt-1 block ${stat.subTextColor}`}>
                                    {stat.subTitle}
                                </span>
                            </div>
                            <div className={`w-11.5 h-11.5 rounded-xl flex items-center justify-center shrink-0 ${stat.theme} ${stat.iconColor}`}>
                                <Icon className="w-5.5 h-5.5" />
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
                            placeholder="Search by payout ID, order ID, seller or vehicle..."
                            value={search}
                            onChange={(value) => setSearch(value)}
                        />
                    </div>

                    {/* dropdown */}
                    {filterConfig.map(({ label, key, options }) => (
                        <div key={key} className="w-full sm:w-45">
                            <FilterDropdown
                                label={label}
                                options={options}
                                value={key === 'status' ? status : filters[key]}
                                onChange={(value) => updateFilter(key, value)}
                            />
                        </div>
                    ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">

                    {/* Date Range */}
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
                            setFilters({ amountRange: '' });
                            setStartDate(null);
                            setEndDate(null);
                            setPage(1);
                        }}
                        className="flex items-center gap-1.5 h-9 px-1.5 text-xs font-semibold text-amber-600 underline underline-offset-4 decoration-amber-300 hover:text-amber-700 hover:decoration-amber-600 transition-all"
                    >
                        Clear Filters
                    </button>

                </div>
            </div>

            {/* main section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 pb-6 gap-6">

                {/* left side - section */}
                <div className="lg:col-span-2 space-y-6">
                    <div>

                        {/* Tabs */}
                        <div className="flex gap-10 border-b border-slate-100 my-6 overflow-x-auto no-scrollbar">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => {
                                        setStatus(tab.status);
                                        setPage(1);
                                    }}
                                    className={`pb-3 text-[14px] font-medium whitespace-nowrap border-b-2 transition-colors ${status === tab.status
                                        ? 'border-[#D97706] text-[#D97706]'
                                        : 'border-transparent text-slate-500 hover:text-slate-700'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* table */}
                        <div className="overflow-x-auto border border-gray-200 rounded-lg">
                            <table className="w-full text-left table-fixed">
                                <thead className="bg-gray-100 border-b border-gray-200 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4 w-35">Payout ID</th>
                                        <th className="px-6 py-4 w-60">Seller</th>
                                        <th className="px-6 py-4 w-65">Vehicle</th>
                                        <th className="px-6 py-4 w-40">Net Amount</th>
                                        <th className="px-6 py-4 w-45">Commission</th>
                                        <th className="px-6 py-4 w-55">Bank</th>
                                        <th className="px-6 py-4 w-35">Status</th>
                                        <th className="px-6 py-4 w-35">Payout Date</th>
                                        <th className="px-6 py-4 w-30">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-amber-50">
                                    {payoutsList.length > 0 ? (
                                        payoutsList.map((p, index) => {

                                            const seller = p.sellerId;
                                            const vehicle = p.vehicleId;
                                            const date = fmtDate(p.paidAt || p.requestedAt || p.createdAt);

                                            return (
                                                <tr
                                                    key={p._id || index}
                                                    className="hover:bg-gray-50/50 transition-colors">

                                                    {/* payout id & order id */}
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-[12px] font-semibold text-gray-700">
                                                                {p.payoutId || "---"}
                                                            </span>

                                                            <span className="text-[11px] text-gray-500">
                                                                Order: {p.orderId?.orderId || p.orderId || "---"}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    {/* seller */}
                                                    <td className="px-6 py-4 ">
                                                        <div className="flex items-center gap-2">
                                                            <img
                                                                src={seller?.profileImage}
                                                                alt={seller?.fullName}
                                                                className="w-10 h-10 object-cover rounded-full shrink-0" />
                                                            <div className="truncate">
                                                                <div className="text-gray-700 font-semibold text-[13px] truncate">
                                                                    {seller?.businessName || seller?.fullName || 'Deleted seller'}
                                                                </div>
                                                                <div className="text-[11px] text-gray-500 truncate">{seller?.email || '—'}</div>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* vehicle */}
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                                                                {vehicle?.images?.[0]?.url ? (
                                                                    <img
                                                                        src={vehicle.images[0].url}
                                                                        alt={`${vehicle?.make || ''} ${vehicle?.model || ''}`}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center bg-slate-100">
                                                                        <div className="w-8 h-6 rounded border border-slate-300" />
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="min-w-0">
                                                                <div className="text-[13px] font-semibold text-slate-800 truncate">
                                                                    {vehicle
                                                                        ? `${vehicle.year} ${formatLabel(vehicle.make)} ${formatLabel(vehicle.model)}`
                                                                        : '—'}
                                                                </div>

                                                                <div className="text-[11px] text-slate-500 mt-1 truncate">
                                                                    {p.listingId || vehicle?.listingId || 'No Listing ID'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* net amt */}
                                                    <td className="px-6 py-4">
                                                        <div className="text-[13px] font-bold text-green-600">{fmtMoney(p.netAmount, p.currency)}</div>
                                                        <div className="text-[11px] text-slate-400 mt-0.5">
                                                            Gross {fmtMoney(p.grossAmount, p.currency)}
                                                        </div>
                                                    </td>

                                                    {/* commission */}
                                                    <td className="px-6 py-4">
                                                        <div className="text-[13px] font-bold text-slate-800">
                                                            {fmtMoney(p.commissionAmount, p.currency)}
                                                        </div>
                                                    </td>

                                                    {/* bank */}
                                                    <td className="px-6 py-4 text-[12px] leading-relaxed">
                                                        {p.bankSnapshot && p.status === 'requested' ? (
                                                            <>
                                                                <div className="font-semibold text-slate-800 break-all">
                                                                    {p.bankSnapshot.ibanNumber || '—'}
                                                                </div>

                                                                <div className="text-slate-500 mt-1">
                                                                    Bank: {p.bankSnapshot.bankName || '—'}
                                                                </div>

                                                                <div className="text-slate-500">
                                                                    Account Holder: {p.bankSnapshot.accountHolderName || '—'}
                                                                </div>

                                                                <div className="text-slate-500">
                                                                    SWIFT: {p.bankSnapshot.swiftCode || '—'}
                                                                </div>
                                                            </>
                                                        ) : p.bankSnapshot ? (
                                                            <>
                                                                <div className="font-semibold text-slate-800 break-all">
                                                                    {p.bankSnapshot.ibanNumber || '—'}
                                                                </div>
                                                                <div className="text-slate-500 mt-1">
                                                                    {p.bankSnapshot.bankName || '—'}
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <span className="text-[11px] text-slate-400">
                                                                Not requested yet
                                                            </span>
                                                        )}
                                                    </td>

                                                    {/* status */}
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded text-[11px] font-medium border ${STATUS_STYLES[p.status] || STATUS_STYLES.on_hold}`}>
                                                            {formatLabel(p.status)}
                                                        </span>
                                                    </td>

                                                    {/* pay date / time */}
                                                    <td className="px-6 py-4 text-[13px] leading-tight">
                                                        {date ? (
                                                            <>
                                                                <div className="font-semibold text-slate-800">
                                                                    {date.toLocaleDateString('en-GB', {
                                                                        day: '2-digit',
                                                                        month: 'short',
                                                                        year: 'numeric',
                                                                        timeZone: 'Asia/Dubai',
                                                                    })}
                                                                </div>

                                                                <div className="text-[11px] text-slate-500 mt-0.5">
                                                                    {date.toLocaleTimeString('en-GB', {
                                                                        hour: '2-digit',
                                                                        minute: '2-digit',
                                                                        hour12: true,
                                                                        timeZone: 'Asia/Dubai',
                                                                    })}{' '}
                                                                    · {p.paidAt ? 'Paid' : p.requestedAt ? 'Requested' : 'Created'}
                                                                </div>
                                                            </>
                                                        ) : '—'}
                                                    </td>

                                                    {/* actions */}
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col items-start gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setSelectedPayoutId(p._id);
                                                                    setCurrentPage('payouts-detail');
                                                                }}
                                                                className="flex items-center gap-1 text-slate-500 hover:text-amber-600"
                                                            >
                                                                <Eye size={16} />
                                                                <span className="text-xs">Details</span>
                                                            </button>

                                                            {p.status === 'on_hold' && (
                                                                <button
                                                                    type="button"
                                                                    disabled={isPending}
                                                                    onClick={() => handleConfirmHandover(p)}
                                                                    className="text-xs font-medium text-amber-700 hover:text-amber-800 disabled:opacity-50"
                                                                >
                                                                    Confirm Handover
                                                                </button>
                                                            )}

                                                            {p.status === 'requested' && (
                                                                <>
                                                                    <button
                                                                        type="button"
                                                                        disabled={isPending}
                                                                        onClick={() => handleMarkPaid(p)}
                                                                        className="text-xs font-medium text-green-700 hover:text-green-800 disabled:opacity-50"
                                                                    >
                                                                        Mark Paid
                                                                    </button>

                                                                    <button
                                                                        type="button"
                                                                        disabled={isPending}
                                                                        onClick={() => handleReject(p)}
                                                                        className="text-xs font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
                                                                    >
                                                                        Reject
                                                                    </button>
                                                                </>
                                                            )}

                                                            {isAdmin &&
                                                                ['on_hold', 'available', 'requested'].includes(p.status) && (
                                                                    <button
                                                                        type="button"
                                                                        disabled={isPending}
                                                                        onClick={() => handleRefund(p)}
                                                                        className="text-xs font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
                                                                    >
                                                                        Cancel &amp; Refund
                                                                    </button>
                                                                )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={9} className="px-6 py-16 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mb-3">
                                                        <Wallet size={22} className="text-[#D97706]" />
                                                    </div>
                                                    <h3 className="text-sm font-semibold text-slate-700">No Payouts Found</h3>
                                                    <p className="text-xs text-slate-500 mt-1">There are no payouts to display for this status.</p>
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

                                {/* Page Info */}
                                <p className="hidden sm:block text-xs text-slate-500">
                                    Page <span className="font-semibold text-[#0B1E3D]">{page}</span> of{" "}
                                    <span className="font-semibold text-[#0B1E3D]">{totalPages}</span>
                                </p>

                                {/* Pagination */}
                                <div className="flex items-center gap-1.5 mx-auto sm:mx-0 sm:ml-auto">

                                    {/* Previous */}
                                    <button
                                        type="button"
                                        onClick={() => setPage((p) => p - 1)}
                                        disabled={page === 1}
                                        className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600
                                                            hover:bg-slate-50 hover:border-slate-300
                                                            disabled:opacity-40 disabled:cursor-not-allowed
                                                            transition-all"
                                    >
                                        Previous
                                    </button>

                                    {/* Page Numbers */}
                                    {getPaginationRange(page, totalPages).map((num, idx) =>
                                        num === "..." ? (
                                            <span
                                                key={`dot-${idx}`}
                                                className="px-2 py-1.5 text-xs font-medium text-slate-400"
                                            >
                                                ...
                                            </span>
                                        ) : (
                                            <button
                                                type="button"
                                                key={num}
                                                onClick={() => setPage(num)}
                                                className={`min-w-8 h-8 px-2 rounded-lg text-xs font-semibold border transition-all
                                                                        ${page === num
                                                        ? "bg-[#D97706] text-white border-[#D97706] shadow-sm"
                                                        : "bg-white border-slate-200 text-slate-600 hover:bg-amber-50 hover:text-[#D97706] hover:border-amber-200"
                                                    }`}
                                            >
                                                {num}
                                            </button>
                                        )
                                    )}

                                    {/* Next */}
                                    <button
                                        type="button"
                                        onClick={() => setPage((p) => p + 1)}
                                        disabled={page === totalPages}
                                        className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600
                                                            hover:bg-slate-50 hover:border-slate-300
                                                            disabled:opacity-40 disabled:cursor-not-allowed
                                                            transition-all"
                                    >
                                        Next
                                    </button>

                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* right side - section */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">

                    {/* summary */}
                    <SummaryDonutCard
                        title="Payout Summary"
                        centerValue={fmtMoney(
                            Object.entries(summary || {}).reduce(
                                (total, [status, item]) =>
                                    status === 'canceled'
                                        ? total
                                        : total + Number(item?.total || 0),
                                0
                            )
                        )}
                        centerLabel="Total Payouts"
                        showPercentage={true}
                        segments={[
                            { name: 'On Hold', value: summary?.on_hold?.total || 0, color: '#64748B' },
                            { name: 'Available', value: summary?.available?.total || 0, color: '#2563EB' },
                            { name: 'Requested', value: summary?.requested?.total || 0, color: '#F59E0B' },
                            { name: 'Paid', value: summary?.paid?.total || 0, color: '#16A34A' },
                        ]}
                    />

                    {/* recent activity */}
                    <div className="w-full bg-white rounded-xl border border-slate-100 p-4 md:p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-900 text-[13px] md:text-sm">Recent Activity</h3>
                        </div>

                        {/* Activity List */}
                        <div className="divide-y divide-slate-100">
                            {(data?.recent || []).map((activity) => {
                                const status = activity.status?.toLowerCase();

                                const statusConfig = {
                                    paid: {
                                        icon: CheckCircle,
                                        iconBg: 'bg-green-500',
                                        title: 'Payout Completed',
                                    },
                                    completed: {
                                        icon: CheckCircle,
                                        iconBg: 'bg-green-500',
                                        title: 'Payout Completed',
                                    },
                                    pending: {
                                        icon: Clock,
                                        iconBg: 'bg-amber-500',
                                        title: 'Payout Pending',
                                    },
                                    processing: {
                                        icon: Clock,
                                        iconBg: 'bg-blue-500',
                                        title: 'Payout Processing',
                                    },
                                    failed: {
                                        icon: XCircle,
                                        iconBg: 'bg-red-500',
                                        title: 'Payout Failed',
                                    },
                                    cancelled: {
                                        icon: XCircle,
                                        iconBg: 'bg-slate-500',
                                        title: 'Payout Cancelled',
                                    },
                                };

                                const config = statusConfig[status] || {
                                    icon: Clock,
                                    iconBg: 'bg-slate-400',
                                    title: `Payout ${status || 'Updated'}`,
                                };

                                const Icon = config.icon;

                                const sellerName =
                                    activity.sellerId?.businessName ||
                                    activity.sellerId?.fullName ||
                                    'Unknown Seller';

                                const time = activity.updatedAt
                                    ? new Date(activity.updatedAt).toLocaleString('en-AE', {
                                        timeZone: 'Asia/Dubai',
                                        day: '2-digit',
                                        month: 'short',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })
                                    : '—';

                                return (
                                    <div
                                        key={activity._id || activity.payoutId}
                                        className="flex items-center gap-2.5 sm:gap-3 py-3 first:pt-0 last:pb-0"
                                    >
                                        {/* Status Icon */}
                                        <div
                                            className={`w-5 h-5 shrink-0 rounded-full flex items-center justify-center ${config.iconBg}`}
                                        >
                                            <Icon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                                        </div>

                                        {/* Activity Details */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-[10px] sm:text-[11px] md:text-xs font-bold text-slate-900 leading-tight">
                                                {config.title}
                                            </h4>

                                            <p className="text-[9px] sm:text-[10px] md:text-[11px] text-slate-500 mt-0.5 truncate">
                                                {sellerName} · {activity.payoutId || 'Payout'}
                                            </p>
                                        </div>

                                        {/* Amount & Time */}
                                        <div className="shrink-0 text-right">
                                            <p className="text-[9px] sm:text-[10px] md:text-[11px] font-bold text-[#0B1E3D]">
                                                {fmtMoney(activity.netAmount, activity.currency || 'AED')}
                                            </p>

                                            <p className="text-[8px] sm:text-[9px] md:text-[10px] text-slate-500 mt-0.5">
                                                {time}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}

                            {(!data?.recent || data.recent.length === 0) && (
                                <p className="py-6 text-center text-xs text-slate-500">
                                    No recent activity found.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Payouts;
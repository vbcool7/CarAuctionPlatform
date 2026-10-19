
import React, { useState } from 'react';
import { ArrowUpRight, CheckCircle2, Download, PauseCircle, Wallet } from 'lucide-react';
import { toast } from 'react-toastify';
import { useGetMyPayouts, useRequestPayout } from '../../../hook/usePayout';
import { formatDateTime, formatLabel, formatPrice } from '../../../utils/formatters';
import { getPaginationRange } from '../../../utils/getPaginationRange';

const BADGE = {
    on_hold: 'bg-slate-100 text-slate-600 border-slate-200',
    available: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    requested: 'bg-amber-50 text-amber-700 border-amber-200',
    paid: 'bg-blue-50 text-blue-700 border-blue-200',
    canceled: 'bg-red-50 text-red-600 border-red-200',
};

const HINT = {
    on_hold: 'Waiting for vehicle handover confirmation by our team.',
    available: 'Ready. You can request this payout now.',
    requested: 'Request sent. Our team will transfer to your bank account.',
    canceled: 'Order was canceled and the buyer refunded.',
};

const tabs = [
    { key: '', label: 'All' },
    { key: 'on_hold', label: 'On Hold' },
    { key: 'available', label: 'Available' },
    { key: 'requested', label: 'Requested' },
    { key: 'paid', label: 'Paid' },
];

function Payouts({ setSelectedPayoutId, setCurrentPage }) {

    const [activeTab, setActiveTab] = useState('');
    const [page, setPage] = useState(1);

    const { data, isLoading, isError } = useGetMyPayouts(page, 10, activeTab);
    const { mutate: requestPayout, isPending, variables: payingId } = useRequestPayout();

    const s = data?.summary || {};
    const payouts = data?.payouts || [];
    const totalPages = data?.pagination?.totalPages || 1;

    // handle payout request
    const handleRequest = (p) => {
        if (!window.confirm(`Request payout of ${formatPrice(p.netAmount)} to your registered bank account?`)) return;
        requestPayout(p._id, {
            onSuccess: () => toast.success('Payout requested'),
            onError: (err) => toast.error(err.response?.data?.message || 'Could not request payout'),
        });
    };

    // stats
    const statsData = [
        {
            id: "on-hold",
            title: "On Hold",
            value: s.on_hold,
            subtitle: "All Time",
            subtitleColor: "text-green-600",
            icon: PauseCircle,
            iconBg: "bg-green-100",
            iconColor: "text-green-600",
        },
        {
            id: "available",
            title: "Available",
            value: s.available,
            subtitle: "All Time",
            subtitleColor: "text-blue-600",
            icon: Wallet,
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
        },
        {
            id: "requested",
            title: "Requested Payout",
            value: s.requested,
            subtitle: "Will be paid soon",
            subtitleColor: "text-purple-500",
            icon: ArrowUpRight,
            iconBg: "bg-purple-100",
            iconColor: "text-purple-600",
        },
        {
            id: "paid",
            title: "Paid",
            value: s.paid,
            subtitle: "2024",
            subtitleColor: "text-amber-600",
            icon: CheckCircle2,
            iconBg: "bg-amber-100",
            iconColor: "text-amber-600",
        },
    ];

    return (
        <div className="pb-6 space-y-6">

            {/* header */}
            <div className='w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0'>
                <div className='flex flex-col'>
                    <h1 className='text-xl md:text-2xl font-bold'>Payouts</h1>
                    <p className='text-xs md:text-sm text-gray-600 p-px'>
                        Track your earning and payout history.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2.5">
                    <button
                        className="group inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm shadow-amber-600/20 hover:bg-amber-700 active:scale-[0.98] transition-all duration-200">
                        <Download className="h-4 w-4 text-white/90 transition-transform duration-300 group-hover:-translate-y-0.5" />
                        Export Report
                    </button>
                </div>
            </div>

            {/* stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 my-6">
                {statsData.map((stat) => {
                    const IconComponent = stat.icon;

                    return (
                        <div
                            key={stat.id}
                            className="bg-white p-4 rounded-2xl border border-slate-100 shadow-md flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-amber-200 cursor-pointer"
                        >
                            <div
                                className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${stat.iconBg} flex items-center justify-center shrink-0 transition-transform duration-300 hover:scale-105`}>
                                <IconComponent
                                    className={`w-5 h-5 md:w-6 md:h-6 ${stat.iconColor}`}
                                />
                            </div>

                            <div>
                                <p className="text-xs font-medium text-slate-400">{stat.title}</p>
                                <h3 className="text-lg md:text-xl font-bold text-[#0B1E3D] my-1">{formatPrice(stat.value)}</h3>
                                <p className={`text-[11px] font-semibold ${stat.subtitleColor}`}>{stat.subtitle}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* tabs */}
            <div className='flex gap-9 border-b border-gray-200 overflow-x-auto no-scrollbar'>
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => {
                            setActiveTab(tab.key);
                            setPage(1);
                        }}
                        className={`py-3 text-xs md:text-sm font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer
                                ${activeTab === tab.key
                                ? 'border-[#D97706] text-[#D97706]'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {tab.label} <span className='text-xs'></span>
                    </button>
                ))}
            </div>

            {isLoading && <p className="text-sm">Loading payouts...</p>}
            {isError && <p className="text-sm text-red-500">Failed to load payouts</p>}
            {!isLoading && !isError && payouts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 px-4 bg-white border border-slate-100 rounded-2xl text-center">
                    <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mb-4">
                        <Wallet className="w-7 h-7 text-amber-600" />
                    </div>

                    <h3 className="text-sm font-bold text-[#0B1E3D] mb-1">
                        No Payouts Yet
                    </h3>

                    <p className="text-xs text-slate-500 max-w-sm">
                        Your payout records will appear here once a payout is generated for your sold vehicles.
                    </p>
                </div>
            )}

            {/* list */}
            {payouts.map((p) => {
                const v = p.vehicleId;
                const name = v
                    ? `${v.year ?? ''} ${formatLabel(v.make)} ${formatLabel(v.model)}`.trim()
                    : p.listingId;

                return (
                    <div
                        key={p._id}
                        className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all space-y-4"
                    >
                        {/* 1. Header: Vehicle Name & Status Badge */}
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h3 className="font-bold text-slate-900 text-base leading-snug">
                                    {name}
                                </h3>
                                <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-1.5">
                                    <span className="font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[11px]">
                                        {p.payoutId}
                                    </span>
                                    <span>·</span>
                                    <span>{p.listingId}</span>
                                    <span>·</span>
                                    <span>{formatDateTime(p.createdAt)}</span>
                                </p>
                            </div>

                            <span
                                className={`px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase border shrink-0 ${BADGE[p.status] || 'bg-slate-100 text-slate-600 border-slate-200'
                                    }`}
                            >
                                {formatLabel(p.status)}
                            </span>
                        </div>

                        {/* 2. Financial Breakdown Box */}
                        <div className="grid grid-cols-3 gap-3 p-3.5 bg-slate-50/80 rounded-xl border border-slate-100 text-sm">

                            {/* Sale Amount */}
                            <div>
                                <p className="text-xs text-slate-500 font-medium mb-0.5">Sale Amount</p>
                                <p className="font-semibold text-slate-800">
                                    {formatPrice(p.grossAmount)}
                                </p>
                            </div>

                            {/* Commission */}
                            <div>
                                <p className="text-xs text-slate-500 font-medium mb-0.5">
                                    Commission ({p.commissionPercent}%)
                                </p>
                                <p className="font-semibold text-slate-700">
                                    {formatPrice(p.commissionAmount)}
                                </p>
                            </div>

                            {/* You Receive */}
                            <div>
                                <p className="text-xs text-slate-500 font-medium mb-0.5">You Receive</p>
                                <p className="font-extrabold text-[#D97706] text-base">
                                    {formatPrice(p.netAmount)}
                                </p>
                            </div>
                        </div>

                        {/* 3. Footer Info & Action */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                            {/* Reference / Hints */}
                            <div className="text-xs text-slate-500 space-y-0.5">
                                {HINT[p.status] && <p>{HINT[p.status]}</p>}

                                {p.status === 'paid' && (
                                    <p className="text-emerald-600 font-medium flex items-center gap-1">
                                        <span>✓ Paid on {formatDateTime(p.paidAt)}</span>
                                        {p.transferReference && (
                                            <span className="text-slate-400 font-normal">
                                                (Ref: {p.transferReference})
                                            </span>
                                        )}
                                    </p>
                                )}
                            </div>

                            {/* Action Button */}
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <button
                                    onClick={() => {
                                        setSelectedPayoutId(p._id)
                                        setCurrentPage('payouts-detail')
                                    }}
                                    className="flex-1 sm:flex-initial text-slate-700 hover:bg-slate-100 border border-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl transition"
                                >
                                    View Details
                                </button>

                                {p.status === 'available' && (
                                    <button
                                        onClick={() => handleRequest(p)}
                                        disabled={isPending}
                                        className="flex-1 sm:flex-initial bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition shadow-sm disabled:opacity-50"
                                    >
                                        {isPending && payingId === p._id ? 'Requesting...' : 'Request Payout'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}

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
                            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
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
                            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            Next
                        </button>

                    </div>
                </div>
            )}
        </div>
    );
}

export default Payouts;
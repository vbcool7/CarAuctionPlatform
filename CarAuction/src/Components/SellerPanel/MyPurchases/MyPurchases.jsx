
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
    Search, ShoppingBag, CarFront, Wallet, CheckCircle2, Clock3, PackageCheck, ChevronDown, ChevronUp,
    CalendarDays, Hash, CreditCard, XCircle, Loader2, Download,
} from 'lucide-react';
import { useGetMyOrders, useGetMyOrdersSummary, useCreateCheckoutSession } from '../../../hook/usePayment';
import { getPaginationRange } from '../../../utils/getPaginationRange';
import { formatLabel } from '../../../utils/formatters';
import { useDownloadBuyerInvoice } from '../../../hook/useInvoice';

const LIMIT = 10;

const tabs = [
    { label: 'All Purchases', key: 'all', status: '', handover: '' },
    { label: 'Payment Pending', key: 'pending', status: 'pending_payment', handover: '' },
    { label: 'Paid', key: 'paid', status: 'paid', handover: '' },
    { label: 'Completed', key: 'completed', status: 'paid', handover: 'confirmed' },
];

const TZ = 'Asia/Dubai';
const money = (n) => `AED ${Number(n || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: TZ }) : '—';
const fmtDateTime = (d) =>
    d
        ? `${fmtDate(d)}, ${new Date(d).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: TZ })}`
        : '—';
const pretty = (s) => (s ? String(s).replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : '');
const imgOf = (v) => {
    const first = v?.images?.[0];
    if (!first) return '';
    return typeof first === 'string' ? first : first.url || first.secure_url || '';
};

const paymentMeta = {
    paid: { label: 'Paid', cls: 'bg-emerald-50 text-emerald-700', Icon: CheckCircle2 },
    pending_payment: { label: 'Payment Pending', cls: 'bg-amber-50 text-amber-700', Icon: Clock3 },
    expired: { label: 'Expired', cls: 'bg-slate-100 text-slate-600', Icon: XCircle },
    canceled: { label: 'Cancelled & Refunded', cls: 'bg-red-50 text-red-600', Icon: XCircle },
};

const SOURCE_LABEL = { auction: 'Auction Won', buy_now: 'Buy Now' };

function MyPurchases() {

    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [page, setPage] = useState(1);
    const [expandedId, setExpandedId] = useState(null);
    const [payingId, setPayingId] = useState(null);

    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedSearch(search.trim());
            setPage(1);
        }, 400);
        return () => clearTimeout(t);
    }, [search]);

    const tab = tabs.find((t) => t.key === activeTab);

    const { data, isLoading, isError, isFetching } = useGetMyOrders(page, LIMIT, tab.status, '', tab.handover, debouncedSearch);
    const { data: summaryData } = useGetMyOrdersSummary();
    const { mutate: startCheckout } = useCreateCheckoutSession();
    const { mutate: downloadInvoice, isPending: isDownloadingInvoice, variables: downloadingInvoiceId, } = useDownloadBuyerInvoice();

    const orders = data?.orders || [];
    const pagination = data?.pagination || { page: 1, totalPages: 1, total: 0 };

    const s = summaryData?.summary || {};
    const totalPurchases = Object.values(s).reduce((sum, r) => sum + (r?.count || 0), 0);
    const totalPaid = s.paid?.total || 0;
    const pendingCount = s.pending_payment?.count || 0;

    // handle pay
    const handlePay = (order) => {
        setPayingId(order._id);
        startCheckout(order._id, {
            onSuccess: (res) => {
                if (res?.url) {
                    window.location.href = res.url;
                } else {
                    toast.error('Could not start payment');
                    setPayingId(null);
                }
            },
            onError: (err) => {
                toast.error(err.response?.data?.message || 'Could not start payment');
                setPayingId(null);
            },
        });
    };

    return (
        <div className="pb-6 space-y-6">

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold">My Purchases</h1>
                    <p className='text-xs md:text-sm text-gray-600 p-px'>Track your purchased vehicles, payments and handovers.</p>
                </div>

                <div className="flex items-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600">
                    <CarFront size={16} className="text-amber-600" />
                    {totalPurchases} Total Purchases
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white p-5">
                    <div className="flex items-center justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                            <ShoppingBag size={20} />
                        </div>
                        <span className="text-xs font-medium text-slate-400">All orders</span>
                    </div>
                    <p className="mt-4 text-2xl font-bold text-[#0B1E3D]">{totalPurchases}</p>
                    <p className="mt-1 text-sm text-slate-500">Total Purchases</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5">
                    <div className="flex items-center justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                            <Wallet size={20} />
                        </div>
                        <span className="text-xs font-medium text-slate-400">Successful payments</span>
                    </div>
                    <p className="mt-4 text-2xl font-bold text-[#0B1E3D]">{money(totalPaid)}</p>
                    <p className="mt-1 text-sm text-slate-500">Total Amount Paid</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 sm:col-span-2 xl:col-span-1">
                    <div className="flex items-center justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                            <Clock3 size={20} />
                        </div>
                        <span className="text-xs font-medium text-slate-400">Action required</span>
                    </div>
                    <p className="mt-4 text-2xl font-bold text-[#0B1E3D]">{pendingCount}</p>
                    <p className="mt-1 text-sm text-slate-500">Pending Payments</p>
                </div>
            </div>

            {/* Purchase List */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="border-b border-slate-100 p-4 sm:p-5">

                    {/* search */}
                    <div className="pb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h2 className="text-base font-bold text-[#0B1E3D]">Purchase History</h2>
                            <p className="mt-1 text-xs text-slate-500">View your orders and payment details.</p>
                        </div>

                        <div className="relative w-full lg:max-w-sm">
                            <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by order ID or listing ID..."
                                className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                            />
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className='flex gap-9 border-b border-gray-200 overflow-x-auto no-scrollbar'>
                        {tabs.map((t) => (
                            <button
                                key={t.key}
                                onClick={() => {
                                    setActiveTab(t.key);
                                    setPage(1);
                                    setExpandedId(null);
                                }}
                                className={`py-3 text-xs md:text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === t.key
                                    ? 'border-[#D97706] text-[#D97706]'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Orders */}
                <div className={`divide-y divide-slate-100 transition-opacity ${isFetching ? 'opacity-60' : ''}`}>
                    {isLoading ? (
                        <div className="flex items-center justify-center gap-2 px-5 py-16 text-sm text-slate-500">
                            <Loader2 size={18} className="animate-spin" /> Loading purchases...
                        </div>
                    ) : isError ? (
                        <div className="px-5 py-16 text-center text-sm text-red-600">
                            Could not load your purchases. Please refresh the page.
                        </div>
                    ) : orders.length > 0 ? (
                        orders.map((order) => {

                            const v = order.vehicleId || {};
                            const meta = paymentMeta[order.status] || paymentMeta.expired;
                            const MetaIcon = meta.Icon;
                            const isPaid = order.status === 'paid';
                            const isPending = order.status === 'pending_payment';
                            const handoverDone = order.handover?.status === 'confirmed';
                            const isExpanded = expandedId === order._id;
                            const title = [v.year, formatLabel(v.make), formatLabel(v.model)].filter(Boolean).join(' ') || 'Vehicle';
                            const image = imgOf(v);
                            const subtitle = [
                                v.year,
                                v.mileage != null ? `${Number(v.mileage).toLocaleString('en-US')} km` : null,
                                v.emirate ? pretty(v.emirate) : null,
                            ].filter(Boolean).join(' · ');

                            return (
                                <div key={order._id} className="p-4 sm:p-5">
                                    <div className="flex flex-col gap-4 sm:flex-row">

                                        {/* img */}
                                        {image ? (
                                            <img
                                                src={image}
                                                alt={title}
                                                className="h-44 w-full rounded-lg object-cover sm:h-28 sm:w-40"
                                            />
                                        ) : (
                                            <div className="flex h-44 w-full items-center justify-center rounded-lg bg-slate-100 text-slate-400 sm:h-28 sm:w-40">
                                                <CarFront size={28} />
                                            </div>
                                        )}

                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                <div>
                                                    <h3 className="text-sm font-bold text-[#0B1E3D]">{title}</h3>
                                                    <p className="mt-1 text-xs text-slate-500">{subtitle}</p>

                                                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                                                        <span className="inline-flex items-center gap-1.5">
                                                            <Hash size={13} />
                                                            {order.orderId}
                                                        </span>
                                                        <span className="inline-flex items-center gap-1.5">
                                                            <CalendarDays size={13} />
                                                            {fmtDate(order.paidAt || order.createdAt)}
                                                        </span>
                                                    </div>

                                                    {isPending && (
                                                        <p className="mt-2 text-xs font-medium text-amber-700">
                                                            Pay before {fmtDateTime(order.paymentDueAt)} (UAE time)
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="sm:text-right">
                                                    <p className="text-lg font-bold text-[#0B1E3D]">{money(order.amount)}</p>
                                                    <p className="mt-1 text-xs text-slate-500">
                                                        {SOURCE_LABEL[order.source] || order.source}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
                                                <div className="flex flex-wrap gap-2">
                                                    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold ${meta.cls}`}>
                                                        <MetaIcon size={13} />
                                                        {meta.label}
                                                    </span>

                                                    {isPaid && (
                                                        <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold ${handoverDone
                                                            ? 'bg-emerald-50 text-emerald-700'
                                                            : 'bg-slate-100 text-slate-600'
                                                            }`}>
                                                            <PackageCheck size={13} />
                                                            {handoverDone ? 'Completed' : 'Pending Handover'}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* action btns */}
                                                <div className="flex items-center gap-3">

                                                    {/* ---- pay now ---- */}
                                                    {isPending && (
                                                        <button
                                                            type="button"
                                                            disabled={payingId === order._id}
                                                            onClick={() => handlePay(order)}
                                                            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#0B1E3D] px-3 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                                                        >
                                                            {payingId === order._id
                                                                ? <Loader2 size={14} className="animate-spin" />
                                                                : <CreditCard size={14} />}
                                                            Pay Now
                                                        </button>
                                                    )}
                                                    
                                                    {/* ---- invoice ---- */}
                                                    {isPaid && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                downloadInvoice(order.orderId, {
                                                                    onError: (error) => {
                                                                        toast.error(
                                                                            error.response?.data?.message || 'Could not download invoice'
                                                                        );
                                                                    },
                                                                })
                                                            }
                                                            disabled={
                                                                isDownloadingInvoice &&
                                                                downloadingInvoiceId === order.orderId
                                                            }
                                                            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-[#D97706] transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-60"
                                                        >
                                                            {isDownloadingInvoice && downloadingInvoiceId === order.orderId
                                                                ? <Loader2 size={14} className="animate-spin" />
                                                                : <Download size={14} />}
                                                            {isDownloadingInvoice && downloadingInvoiceId === order.orderId
                                                                ? 'Preparing...'
                                                                : 'Invoice PDF'}
                                                        </button>
                                                    )}
                                                    
                                                    {/* ---- detail ---- */}
                                                    <button
                                                        type="button"
                                                        onClick={() => setExpandedId(isExpanded ? null : order._id)}
                                                        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 transition hover:border-amber-300 hover:text-amber-700"
                                                    >
                                                        {isExpanded ? 'Hide Details' : 'Details'}
                                                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                                    </button>
                                                </div>
                                            </div>
                                             
                                            {/* expanded details */}
                                            {isExpanded && (
                                                <div className="mt-4 grid grid-cols-1 gap-3 rounded-lg bg-slate-50 p-4 sm:grid-cols-3">
                                                    <div>
                                                        <p className="text-[11px] text-slate-500">Listing ID</p>
                                                        <p className="mt-1 text-xs font-semibold text-[#0B1E3D]">{order.listingId || '—'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[11px] text-slate-500">Payment Status</p>
                                                        <p className="mt-1 text-xs font-semibold text-[#0B1E3D]">{meta.label}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[11px] text-slate-500">Handover Status</p>
                                                        <p className="mt-1 text-xs font-semibold text-[#0B1E3D]">
                                                            {isPaid ? (handoverDone ? 'Completed' : 'Pending Handover') : '—'}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[11px] text-slate-500">Order Created</p>
                                                        <p className="mt-1 text-xs font-semibold text-[#0B1E3D]">{fmtDateTime(order.createdAt)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[11px] text-slate-500">Paid On</p>
                                                        <p className="mt-1 text-xs font-semibold text-[#0B1E3D]">{fmtDateTime(order.paidAt)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[11px] text-slate-500">Handover Confirmed On</p>
                                                        <p className="mt-1 text-xs font-semibold text-[#0B1E3D]">{fmtDateTime(order.handover?.confirmedAt)}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="px-5 py-16 text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                                <ShoppingBag size={22} />
                            </div>
                            <h3 className="mt-3 text-sm font-semibold text-slate-700">No Purchases Found</h3>
                            <p className="mt-1 text-xs text-slate-500">Try another search or change the selected filter.</p>
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch('');
                                    setActiveTab('all');
                                    setPage(1);
                                }}
                                className="mt-4 text-xs font-semibold text-amber-700 hover:text-amber-800"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer / pagination */}
                <div className="flex flex-col gap-2 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-slate-500">
                        Showing {orders.length} of {pagination.total} purchases
                    </p>

                    {pagination.totalPages > 1 && (
                        <div className="flex items-center justify-between gap-4 px-6 py-4 border-t border-slate-200 bg-white">

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
            </div>
        </div>
    );
}

export default MyPurchases;
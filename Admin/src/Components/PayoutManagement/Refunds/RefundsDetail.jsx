
import React from 'react';
import { ChevronRight, ArrowLeft, CheckCircle, XCircle, Clock, Circle, AlertTriangle, ExternalLink } from 'lucide-react';

import { formatLabel, formatPrice, fmtDate, fmtTime } from '../../utils/formatter';
import { useGetRefundDetail } from '../../../hooks/useRefund';;

const STATUS_META = {
    completed: { label: 'Completed', cls: 'bg-green-100 text-green-700' },
    pending: { label: 'Pending', cls: 'bg-amber-100 text-amber-700' },
    failed: { label: 'Failed', cls: 'bg-red-100 text-red-700' },
};

const KIND_LABEL = {
    admin: 'Admin Cancel',
    late: 'Late Payment',
    duplicate: 'Duplicate Payment',
    mismatch: 'Amount Mismatch',
    auto_failed: 'Auto-Refund Failed',
};  

const humanize = (s) => String(s || '').replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());

const FAILED_STATUSES = ['refund_failed'];

function Row({ label, value }) {
    return (
        <div className="flex justify-between gap-4">
            <span className="text-slate-500 shrink-0">{label}</span>
            <span className="font-medium text-slate-700 text-right break-all">{value || '—'}</span>
        </div>
    );
}

function RefundsDetail({ refundId, setCurrentPage, setSelectedPaymentId }) {

    const { data, isLoading, isError } = useGetRefundDetail(refundId);
    const record = data?.refund;

    const backBtn = (
        <button
            onClick={() => setCurrentPage('refunds')}
            className="mt-3 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:border-[#D97706] hover:bg-amber-50 hover:text-[#D97706]"
        >
            <ArrowLeft size={16} />
            <span>Back to Refunds</span>
        </button>
    );

    if (isLoading) return <p className="p-10 text-center">Loading refund....</p>;

    if (isError || !record) {
        return (
            <div className="p-6">
                <p className="text-sm text-slate-500">Refund not found.</p>
                {backBtn}
            </div>
        );
    }

    const status = STATUS_META[record.status] || STATUS_META.pending;
    const order = record.order;

    const openPayment = () => {
        if (!order?._id) return;
        setSelectedPaymentId(order._id);
        setCurrentPage('all-payments-detail');
    };

    return (
        <div className='pb-6'>

            {/* Header */}
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between pb-6">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3D]">Refund Details</h1>

                    <div className="mt-2 flex items-center text-[11px] md:text-[13px]">
                        <span
                            onClick={() => setCurrentPage("dashboard")}
                            className="cursor-pointer text-slate-500 hover:text-[#D97706] transition-colors">
                            Dashboard
                        </span>

                        <span className="mx-1 text-slate-300"><ChevronRight size={16} /></span>
                        <span className="text-slate-500">Payment Management</span>

                        <span className="mx-1 text-slate-300"><ChevronRight size={16} /></span>
                        <span
                            onClick={() => setCurrentPage('refunds')}
                            className="cursor-pointer text-slate-500 hover:text-[#D97706] transition-colors">
                            Refunds
                        </span>

                        <span className="mx-1 text-slate-300"><ChevronRight size={16} /></span>
                        <span className="font-medium text-[#D97706]">Refund Detail</span>
                    </div>
                </div>

                {order?._id && (
                    <button
                        onClick={openPayment}
                        className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-transparent p-2 font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-[#D97706] hover:text-[#D97706] hover:bg-amber-50">
                        <ExternalLink size={16} />
                        <span className="text-[13px]">View Payment</span>
                    </button>
                )}
            </div>

            {/* Failed alert */}
            {record.status === 'failed' && !record.resolved && (
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                    <AlertTriangle size={18} className="mt-0.5 text-red-500 shrink-0" />
                    <div className="text-sm text-red-700">
                        <p className="font-semibold">This refund did not go through. The buyer has not been refunded.</p>
                        {record.failureNote && <p className="mt-1 text-[13px]">Gateway: {record.failureNote}</p>}
                        {record.retryable
                            ? <p className="mt-1 text-[13px]">The order is still paid. Open the payment and use Cancel &amp; Refund to try again.</p>
                            : <p className="mt-1 text-[13px]">Check this payment in the Stripe dashboard and handle it manually.</p>}
                    </div>
                </div>
            )}

            {record.resolved && (
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
                    <CheckCircle size={18} className="mt-0.5 text-green-600 shrink-0" />
                    <p className="text-sm text-green-700">This attempt failed, but the order was later canceled and refunded on retry.</p>
                </div>
            )}

            {/* Summary strip */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                <div>
                    <p className="text-[11px] text-slate-500">Order ID</p>
                    <p className="text-sm font-semibold text-[#0B1E3D]">{order?.orderId || '—'}</p>
                    <span className={`mt-1 inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${status.cls}`}>{status.label}</span>
                </div>
                <div>
                    <p className="text-[11px] text-slate-500">Refund Type</p>
                    <p className="text-sm font-semibold text-[#0B1E3D]">{KIND_LABEL[record.kind] || record.kind}</p>
                    <p className="mt-2 text-[11px] text-slate-500">Refund Amount</p>
                    <p className="text-sm font-semibold text-green-600">
                        {record.amount != null ? formatPrice(record.amount) : '—'}
                    </p>
                </div>
                <div>
                    <p className="text-[11px] text-slate-500">Original Payment</p>
                    <p className="text-sm font-semibold text-[#0B1E3D]">{order ? formatPrice(order.amount) : '—'}</p>
                    <p className="mt-2 text-[11px] text-slate-500">Paid On</p>
                    <p className="text-sm font-semibold text-[#0B1E3D]">
                        {order?.paidAt ? `${fmtDate(order.paidAt)}, ${fmtTime(order.paidAt)}` : '—'}
                    </p>
                </div>
                <div>
                    <p className="text-[11px] text-slate-500">Refund Date</p>
                    <p className="text-sm font-semibold text-[#0B1E3D]">{fmtDate(record.createdAt)}, {fmtTime(record.createdAt)}</p>
                    <p className="mt-2 text-[11px] text-slate-500">Stripe Refund ID</p>
                    <p className="text-sm font-semibold text-[#0B1E3D] break-all">{record.stripeRefundId || '—'}</p>
                </div>
            </div>

            {/* 3-column grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left */}
                <div className="space-y-6">
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="mb-4 text-sm font-semibold text-[#0B1E3D]">Buyer Information</h3>
                        {record.buyer ? (
                            <>
                                <div className="flex items-center gap-3">
                                    {record.buyer.image ? (
                                        <img src={record.buyer.image} alt="" className="h-12 w-12 rounded-full object-cover" />
                                    ) : (
                                        <div className="h-12 w-12 rounded-full bg-slate-100" />
                                    )}
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-[#0B1E3D] truncate">{record.buyer.name || '—'}</p>
                                        <p className="text-[11px] text-slate-500 truncate">{record.buyer.email || '—'}</p>
                                        <p className="text-[11px] text-slate-500">{record.buyer.phone || '—'}</p>
                                    </div>
                                </div>

                                <div className="mt-4 space-y-2 text-[12px]">
                                    <Row label="User ID" value={record.buyer.readableId} />
                                    <Row label="User Type" value={formatLabel(record.buyer.type)} />
                                </div>
                            </>
                        ) : (
                            <p className="text-sm text-slate-400">Buyer record not found.</p>
                        )}
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="mb-4 text-sm font-semibold text-[#0B1E3D]">Refund Amount</h3>
                        <div className="space-y-2 text-sm">
                            <Row label="Original Payment" value={order ? formatPrice(order.amount) : null} />
                            <Row label="Refunded" value={record.amount != null ? formatPrice(record.amount) : null} />
                        </div>
                        <p className="mt-3 text-[11px] text-slate-400">Refunds are always for the full order amount. No fees are deducted.</p>
                    </div>
                </div>

                {/* Middle */}
                <div className="space-y-6">
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="mb-4 text-sm font-semibold text-[#0B1E3D]">Timeline</h3>
                        {record.timeline.length > 0 ? (
                            <div className="space-y-4">
                                {record.timeline.map((t, i) => {
                                    const bad = FAILED_STATUSES.includes(t.status);
                                    const good = ['refunded_admin', 'refunded_late', 'refunded_duplicate', 'amount_mismatch', 'paid', 'canceled', 'handover_confirmed'].includes(t.status);
                                    return (
                                        <div key={`${t.source}-${i}`} className="flex items-start gap-3">
                                            {bad ? <XCircle size={18} className="text-red-500 mt-0.5 shrink-0" />
                                                : good ? <CheckCircle size={18} className="text-green-500 mt-0.5 shrink-0" />
                                                    : <Clock size={18} className="text-slate-400 mt-0.5 shrink-0" />}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[14px] font-medium text-[#0B1E3D]">
                                                    {humanize(t.status)}
                                                    <span className="ml-2 text-[10px] font-semibold uppercase text-slate-400">{t.source === 'gateway' ? 'Gateway' : humanize(t.by)}</span>
                                                </p>
                                                <p className="text-[11px] text-slate-500">{fmtDate(t.at)}, {fmtTime(t.at)}</p>
                                                {t.note && <p className="text-[12px] text-slate-500 mt-0.5 break-words">{t.note}</p>}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 text-slate-400">
                                <Circle size={18} />
                                <p className="text-sm">No timeline available.</p>
                            </div>
                        )}
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="mb-4 text-sm font-semibold text-[#0B1E3D]">Reason for Refund</h3>
                        <div className="space-y-3 text-sm">
                            <div>
                                <p className="text-[11px] text-slate-500">Reason</p>
                                <p className="text-[#0B1E3D] break-words">{record.reason || '—'}</p>
                            </div>
                            {record.refundedByName && (
                                <div>
                                    <p className="text-[11px] text-slate-500">Refunded By</p>
                                    <p className="text-[#0B1E3D]">{record.refundedByName}</p>
                                </div>
                            )}
                            {record.failureNote && (
                                <div>
                                    <p className="text-[11px] text-slate-500">Gateway Error</p>
                                    <p className="text-red-600 break-words">{record.failureNote}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right */}
                <div className="space-y-6">
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="text-sm font-semibold text-[#0B1E3D] mb-4">Payment Details (Original)</h3>
                        {order ? (
                            <div className="space-y-2 text-sm">
                                <Row label="Order ID" value={order.orderId} />
                                <Row label="Listing ID" value={order.listingId} />
                                <Row label="Sale Type" value={order.source === 'auction' ? 'Auction' : 'Buy Now'} />
                                <Row label="Order Status" value={formatLabel(order.status)} />
                                <Row label="Payment Intent" value={record.stripePaymentIntentId} />
                            </div>
                        ) : (
                            <p className="text-sm text-slate-400">No order is linked to this refund event.</p>
                        )}
                    </div>

                    {record.vehicle && (
                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                            <h3 className="text-sm font-semibold text-[#0B1E3D] mb-4">Vehicle</h3>
                            <div className="flex items-center gap-3">
                                <div className="w-20 h-14 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                                    {record.vehicle.image && (
                                        <img src={record.vehicle.image} alt="" className="w-full h-full object-cover" />
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-[#0B1E3D] truncate">
                                        {`${record.vehicle.year || ''} ${formatLabel(record.vehicle.make)} ${formatLabel(record.vehicle.model)}`.trim()}
                                    </p>
                                    <p className="text-[11px] text-slate-500">{record.vehicle.listingId}</p>
                                </div>
                            </div>
                            {record.seller && (
                                <div className="mt-4 text-[12px]">
                                    <Row label="Seller" value={record.seller.name} />
                                </div>
                            )}
                        </div>
                    )}

                    {record.retryable && order?._id && (
                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                            <h3 className="text-sm font-semibold text-[#0B1E3D] mb-4">Actions</h3>
                            <button
                                onClick={openPayment}
                                className="flex items-center justify-center gap-2 w-full rounded-lg border border-[#D97706] text-[#D97706] py-2 text-sm font-medium hover:bg-amber-50">
                                <ExternalLink size={16} /> Open Payment to Retry Refund
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default RefundsDetail;
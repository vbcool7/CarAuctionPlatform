
import React from 'react';
import { ChevronRight, Copy, Mail, Phone, CheckCircle2, Clock, XCircle, Circle, RefreshCcw, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatLabel, formatDateTime, formatPrice } from '../../utils/formatter';

import useAdminAuthStore from '../../../store/useAdminAuthStore';
import { useGetPaymentDetail, useAdminOrderAction } from '../../../hooks/usePayment';

// order status
const STATUS_META = {
    paid: { label: 'Completed', pill: 'bg-green-50 text-green-600', Icon: CheckCircle2, iconColor: 'text-green-500', iconBg: 'bg-green-50', text: 'text-green-600' },
    pending_payment: { label: 'Pending', pill: 'bg-amber-50 text-amber-500', Icon: Clock, iconColor: 'text-orange-500', iconBg: 'bg-orange-50', text: 'text-orange-500' },
    expired: { label: 'Expired', pill: 'bg-slate-100 text-slate-600', Icon: XCircle, iconColor: 'text-slate-500', iconBg: 'bg-slate-100', text: 'text-slate-600' },
    canceled: { label: 'Refunded', pill: 'bg-blue-50 text-blue-600', Icon: RefreshCcw, iconColor: 'text-blue-500', iconBg: 'bg-blue-50', text: 'text-blue-600' },
};

// timeline labels
const ORDER_STEP = {
    pending_payment: { label: 'Order Created', state: 'done', desc: 'Awaiting payment' },
    paid: { label: 'Payment Received', state: 'done' },
    handover_confirmed: { label: 'Handover Confirmed', state: 'done' },
    expired: { label: 'Payment Window Expired', state: 'failed' },
    canceled: { label: 'Order Cancelled & Refunded', state: 'failed' },
};

const PAYOUT_STEP = {
    on_hold: { label: 'Payout On Hold', state: 'done' },
    available: { label: 'Payout Available', state: 'done' },
    requested: { label: 'Payout Requested', state: 'done' },
    paid: { label: 'Payout Paid', state: 'done' },
    canceled: { label: 'Payout Cancelled', state: 'failed' },
};

const BY_LABEL = {
    system: 'System',
    gateway: 'Stripe',
    buyer: 'Buyer',
    seller: 'Seller',
    admin: 'Admin',
    auctionManager: 'Manager',
};

// PaymentEvent.outcome -> badge
const OUTCOME_META = {
    received: { label: 'Received', style: 'bg-slate-100 text-slate-600' },
    session_created: { label: 'Checkout Created', style: 'bg-slate-100 text-slate-600' },
    paid: { label: 'Paid', style: 'bg-green-50 text-green-700' },
    amount_mismatch: { label: 'Amount Mismatch · Refunded', style: 'bg-red-50 text-red-600' },
    refunded_late: { label: 'Late Payment · Refunded', style: 'bg-red-50 text-red-600' },
    refunded_duplicate: { label: 'Duplicate · Refunded', style: 'bg-red-50 text-red-600' },
    refund_failed: { label: 'Refund Failed', style: 'bg-red-50 text-red-600' },
    refunded_admin: { label: 'Refunded by Admin', style: 'bg-blue-50 text-blue-600' },
    ignored: { label: 'Ignored', style: 'bg-slate-100 text-slate-600' },
};

const ALERT_REASON = {
    refunded_late: 'a late payment',
    refunded_duplicate: 'a duplicate payment',
    amount_mismatch: 'an amount mismatch',
};

function TimelineIcon({ state }) {
    if (state === 'done') return <CheckCircle2 size={18} className="text-green-500" />;
    if (state === 'active') return <Clock size={18} className="text-orange-500" />;
    if (state === 'failed') return <XCircle size={18} className="text-red-500" />;
    return <Circle size={18} className="text-slate-300" />;
}

function Field({ label, value, breakAll = false }) {
    return (
        <div className="min-w-0">
            <span className="text-[11px] text-slate-400 font-medium block mb-0.5">{label}</span>
            <span className={`text-xs font-semibold text-slate-800 ${breakAll ? 'break-all' : ''}`}>
                {value || '---'}
            </span>
        </div>
    );
}

function Row({ label, value, valueClass = 'text-slate-800' }) {
    return (
        <div className="flex justify-between gap-4">
            <span className="text-slate-500 shrink-0">{label}</span>
            <span className={`font-semibold text-right break-words min-w-0 ${valueClass}`}>{value || '---'}</span>
        </div>
    );
}

function PartyCard({ title, party, badge }) {
    const initial = (party?.name || '?').trim().charAt(0).toUpperCase();

    return (
        <div className="w-full bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm md:text-base mb-4">{title}</h3>

            {party ? (
                <>
                    <div className="flex items-center gap-3 min-w-0">
                        {party.image ? (
                            <img
                                src={party.image}
                                alt={party.name || title}
                                className="w-11 h-11 rounded-full object-cover border border-slate-200 shrink-0"
                            />
                        ) : (
                            <div className="w-11 h-11 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-sm font-bold text-slate-500 shrink-0">
                                {initial}
                            </div>
                        )}

                        <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                                <h4 className="text-sm font-bold text-slate-900 truncate">{party.name || '---'}</h4>

                                {badge && (
                                    <span className="px-1.5 py-0.5 rounded-md bg-purple-50 text-purple-600 text-[10px] font-semibold shrink-0">
                                        {badge}
                                    </span>
                                )}

                                {party.accountStatus === 'suspended' && (
                                    <span className="px-1.5 py-0.5 rounded-md bg-red-50 text-red-600 text-[10px] font-semibold shrink-0">
                                        Suspended
                                    </span>
                                )}
                            </div>

                            <p className="text-[11px] text-slate-500 mt-0.5">
                                ID: <span className="font-semibold text-slate-700 ml-1">{party.readableId || '---'}</span>
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-1 gap-y-2">
                        <div className="flex items-center gap-2 min-w-0">
                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="text-[11px] font-medium text-slate-700 truncate" title={party.email || ''}>
                                {party.email || '---'}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 min-w-0">
                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="text-[11px] font-medium text-slate-700 truncate">
                                {party.phone || '---'}
                            </span>
                        </div>
                    </div>
                </>
            ) : (
                <p className="text-xs text-slate-400">Account not found (deleted).</p>
            )}
        </div>
    );
}

function AllPaymentsDetail({ setCurrentPage, paymentId, setSelectedPayoutId }) {

    const { data, isLoading, isError } = useGetPaymentDetail(paymentId);
    const { admin } = useAdminAuthStore();
    const { mutate: run, isPending } = useAdminOrderAction();

    const payment = data?.payment;

    const isAdmin = admin?.role === 'admin';
    const canHandover = isAdmin || !!admin?.permissions?.managePayouts;

    const goBack = () => setCurrentPage('all-payments');

    if (!paymentId) {
        return (
            <div className="p-10 text-center">
                <p className="text-sm text-slate-500 mb-3">No payment selected.</p>
                <button onClick={goBack} className="text-sm font-semibold text-[#D97706] hover:underline">Back to All Payments</button>
            </div>
        );
    }

    if (isLoading) return <p className="p-10 text-center">Loading payment....</p>;

    if (isError || !payment) {
        return (
            <div className="p-10 text-center">
                <p className="text-sm text-red-500 mb-3">Failed to load payment detail</p>
                <button onClick={goBack} className="text-sm font-semibold text-[#D97706] hover:underline">Back to All Payments</button>
            </div>
        );
    }

    const meta = STATUS_META[payment.status] || STATUS_META.pending_payment;
    const SummaryIcon = meta.Icon;
    const refundPending = payment.status === 'canceled' && payment.refund?.status && payment.refund.status !== 'succeeded';
    const statusLabel = refundPending ? 'Refund Pending' : meta.label;

    const payout = payment.payout;
    const vehicleName = payment.vehicle
        ? `${payment.vehicle.year || ''} ${formatLabel(payment.vehicle.make)} ${formatLabel(payment.vehicle.model)}`.trim()
        : '---';

    // ---------- actions
    const showHandover = payment.status === 'paid' && payment.handover.status !== 'confirmed' && canHandover && !payment.alert;
    const showRefund = isAdmin && payment.status === 'paid' && payout?.status !== 'paid';
    const showViewPayout = !!payout && typeof setSelectedPayoutId === 'function';
    const showActions = showHandover || showRefund || showViewPayout;

    const handleConfirmHandover = () => {
        const note = window.prompt('Enter handover verification note:');
        if (!note || note.trim().length < 3) return;

        run(
            { type: 'handover', id: payment._id, body: { note: note.trim() } },
            {
                onSuccess: () => toast.success('Handover confirmed successfully'),
                onError: (error) => toast.error(error.response?.data?.message || 'Failed to confirm handover'),
            }
        );
    };

    const handleRefund = () => {
        if (!window.confirm('Are you sure you want to cancel this order and initiate a refund?')) return;

        const reason = window.prompt('Enter reason for cancellation and refund:');
        if (!reason || reason.trim().length < 3) return;

        run(
            { type: 'refund', id: payment._id, body: { reason: reason.trim() } },
            {
                onSuccess: () => toast.success('Cancellation and refund processed'),
                onError: (error) => toast.error(error.response?.data?.message || 'Failed to process refund'),
            }
        );
    };

    // ---------- timeline (order + payout history)
    const timeline = payment.timeline.map((t) => {
        const step = (t.source === 'payout' ? PAYOUT_STEP : ORDER_STEP)[t.status];
        return {
            key: `${t.source}-${t.status}-${t.at}`,
            label: step?.label || formatLabel(t.status),
            state: step?.state || 'done',
            source: t.source,
            at: t.at,
            by: BY_LABEL[t.by] || t.by,
            desc: t.note || step?.desc || null,
        };
    });

    if (payment.status === 'pending_payment') {
        timeline.push({
            key: 'awaiting',
            label: 'Awaiting Payment',
            state: 'active',
            source: 'order',
            at: null,
            by: null,
            desc: payment.paymentDueAt ? `Due by ${formatDateTime(payment.paymentDueAt)} (UAE time)` : 'Pending',
        });
    }

    // ---------- breakdown
    const totalLabel =
        payment.status === 'paid' || payment.status === 'canceled' ? 'Total Paid'
            : payment.status === 'pending_payment' ? 'Amount Due'
                : 'Order Amount';

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between pb-6">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3D]">Payment Details</h1>

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
                            onClick={goBack}
                            className="cursor-pointer text-slate-500 hover:text-[#D97706] transition-colors">
                            All Payments
                        </span>

                        <span className="mx-1 text-slate-300"><ChevronRight size={16} /></span>
                        <span className="font-medium text-[#D97706]">Payment Detail</span>
                    </div>
                </div>
            </div>

            {/* payment id / status */}
            <div className="flex items-center gap-2.5 flex-wrap mb-5">
                <span className="text-sm font-medium text-slate-600">
                    Payment ID: <span className="font-bold text-slate-900">{payment.orderId}</span>
                </span>
                <button
                    type="button"
                    onClick={() => {
                        navigator.clipboard?.writeText(payment.orderId);
                        toast.success('Payment ID copied');
                    }}
                    className="text-slate-500 hover:text-slate-800 transition-colors p-1"
                    title="Copy ID">
                    <Copy size={14} />
                </button>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${meta.pill}`}>
                    {statusLabel}
                </span>
            </div>

            {/* gateway alert */}
            {payment.alert && (
                <div
                    className={`mb-5 flex items-start gap-3 rounded-xl border p-4 
                        ${payment.status === 'paid'
                            ? 'border-red-200 bg-red-50 text-red-700'
                            : 'border-amber-200 bg-amber-50 text-amber-700'
                        }`}>
                    <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                    <div className="text-xs leading-relaxed">
                        {payment.alert === 'refund_failed' ? (
                            <>
                                <p className="font-bold">A refund for this order failed at the payment gateway.</p>
                                <p className="mt-1">See Gateway Events below. If the buyer was not refunded, refund them manually in Stripe.</p>
                            </>
                        ) : payment.status === 'paid' ? (
                            <>
                                <p className="font-bold">The gateway auto-refunded a payment for this order ({ALERT_REASON[payment.alert] || payment.alert}), but the order is still marked paid.</p>
                                <p className="mt-1">Do not confirm handover or pay out the seller. Check Gateway Events below, then use Cancel &amp; Refund to close this order.</p>
                            </>
                        ) : (
                            <>
                                <p className="font-bold">The gateway auto-refunded a payment for this order ({ALERT_REASON[payment.alert] || payment.alert}).</p>
                                <p className="mt-1">No action needed. See Gateway Events below.</p>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* main */}
            <div className="grid grid-cols-1 xl:grid-cols-3 pb-6 gap-6 items-start">

                {/* ------------------------------ LEFT ------------------------------ */}
                <div className="xl:col-span-2 space-y-6">

                    {/* 1st card */}
                    <div className="w-full bg-white rounded-xl border border-slate-100 p-4 md:p-5 shadow-sm">
                        <h3 className="font-bold text-slate-900 text-sm md:text-base mb-4">
                            1. Payment Overview
                        </h3>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-5">
                            <Field label="Payment ID" value={payment.orderId} />
                            <Field label="Payment Type" value={payment.source === 'auction' ? 'Auction' : 'Buy Now'} />
                            <Field label="Status" value={statusLabel} />
                            <Field label="Gateway" value="Stripe" />

                            <div className="min-w-0">
                                <span className="text-[11px] text-slate-400 font-medium block mb-0.5">Amount</span>
                                <span className="text-base font-bold text-green-600">{formatPrice(payment.amount, payment.currency)}</span>
                            </div>
                            <Field label="Currency" value={payment.currency} />
                            <Field label="Order Created" value={formatDateTime(payment.createdAt)} />
                            <Field label="Paid At" value={formatDateTime(payment.paidAt)} />

                            <Field label="Payment Window Ends" value={formatDateTime(payment.paymentDueAt)} />
                            {payment.expiredAt && <Field label="Expired At" value={formatDateTime(payment.expiredAt)} />}
                            {payment.canceledAt && <Field label="Cancelled At" value={formatDateTime(payment.canceledAt)} />}
                            <Field label="Payment Intent" value={payment.stripePaymentIntentId} breakAll />
                            <Field label="Checkout Session" value={payment.stripeSessionId} breakAll />
                        </div>
                    </div>

                    {/* 2nd / 3rd card - parties */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <PartyCard
                            title="2. Buyer Information"
                            party={payment.buyer}
                            badge={payment.buyer?.type === 'Seller' ? 'Seller account' : null}
                        />
                        <PartyCard title="3. Seller Information" party={payment.seller} />
                    </div>

                    {/* 4th card - vehicle */}
                    <div className="w-full bg-white rounded-xl border border-slate-100 p-4 md:p-5 shadow-sm">
                        <h3 className="font-bold text-slate-900 text-sm md:text-base mb-4">
                            4. Vehicle &amp; Order Information
                        </h3>

                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="flex items-start sm:items-center gap-4">
                                <div className="w-24 h-20 sm:w-28 rounded-lg border border-slate-100 bg-slate-100 overflow-hidden shrink-0">
                                    {payment.vehicle?.image ? (
                                        <img src={payment.vehicle.image} alt="Vehicle" className="w-full h-full object-cover" />
                                    ) : null}
                                </div>

                                <div className="space-y-1.5 min-w-0">
                                    <h4 className="font-bold text-slate-900 text-sm md:text-base">{vehicleName}</h4>

                                    <div className="grid grid-cols-1 gap-y-2 text-xs">
                                        <div className="flex gap-2">
                                            <span className="text-slate-400 font-medium">Listing ID</span>
                                            <span className="text-slate-700 font-semibold">{payment.listingId || '---'}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="text-slate-400 font-medium">Order ID</span>
                                            <span className="text-slate-700 font-semibold">{payment.orderId}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="text-slate-400 font-medium">Sold Via</span>
                                            <span className="text-slate-700 font-semibold">{payment.source === 'auction' ? 'Auction' : 'Buy Now'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-left lg:text-right pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                                <div>
                                    <span className="text-[11px] text-slate-400 font-medium block">Sale Amount</span>
                                    <span className="text-sm font-bold text-slate-900">{formatPrice(payment.amount, payment.currency)}</span>
                                </div>
                                <div>
                                    <span className="text-[11px] text-slate-400 font-medium block">Handover</span>
                                    <span className={`text-xs font-semibold ${payment.handover.status === 'confirmed' ? 'text-green-600' : 'text-slate-800'}`}>
                                        {payment.handover.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {payment.handover.status === 'confirmed' && (
                            <div className="mt-4 pt-3 border-t border-slate-100 text-xs space-y-1.5">
                                <Row label="Confirmed At" value={formatDateTime(payment.handover.confirmedAt)} />
                                <Row
                                    label="Confirmed By"
                                    value={`${payment.handover.confirmedByName || '---'}${payment.handover.confirmedByRole ? ` (${BY_LABEL[payment.handover.confirmedByRole] || payment.handover.confirmedByRole})` : ''}`}
                                />
                                <Row label="Note" value={payment.handover.note} />
                            </div>
                        )}
                    </div>

                    {/* 5th card */}
                    <div className="flex flex-col md:flex-row gap-5">

                        {/* breakdown */}
                        <div className="w-full bg-white rounded-xl border border-slate-100 p-4 md:p-5 shadow-sm">
                            <h3 className="font-bold text-slate-900 text-sm md:text-base mb-4">
                                5. Payment Breakdown
                            </h3>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-100 text-xs font-bold text-slate-900">
                                            <th className="py-2.5 font-semibold">Description</th>
                                            <th className="py-2.5 font-semibold text-right">Amount ({payment.currency})</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                                        <tr>
                                            <td className="py-3 text-slate-800 font-medium">
                                                {payment.source === 'auction' ? 'Winning Bid' : 'Buy Now Price'}
                                            </td>
                                            <td className="py-3 text-slate-900 font-semibold text-right">
                                                {Number(payment.amount).toLocaleString()}
                                            </td>
                                        </tr>

                                        {payout && (
                                            <>
                                                <tr>
                                                    <td className="py-3 text-slate-800 font-medium">
                                                        Platform Commission ({payout.commissionPercent}%)
                                                    </td>
                                                    <td className="py-3 text-slate-900 font-semibold text-right">
                                                        {Number(payout.commissionAmount).toLocaleString()}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="py-3 text-slate-800 font-medium">Seller Net Payout</td>
                                                    <td className="py-3 text-slate-900 font-semibold text-right">
                                                        {Number(payout.netAmount).toLocaleString()}
                                                    </td>
                                                </tr>
                                            </>
                                        )}

                                        {payment.refund && (
                                            <tr>
                                                <td className="py-3 text-blue-700 font-medium">Refunded to Buyer</td>
                                                <td className="py-3 text-blue-700 font-semibold text-right">
                                                    - {Number(payment.refund.amount ?? payment.amount).toLocaleString()}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {payment.status === 'paid' && !payout && (
                                <p className="mt-3 text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                                    No payout record exists for this order.
                                </p>
                            )}

                            <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100">
                                <span className="font-bold text-slate-900 text-sm sm:text-base">{totalLabel}</span>
                                <span className={`font-bold text-base sm:text-lg ${payment.status === 'paid' || payment.status === 'canceled' ? 'text-green-600' : 'text-slate-700'}`}>
                                    {formatPrice(payment.amount, payment.currency)}
                                </span>
                            </div>
                        </div>

                    </div>

                    {/* 6th card - gateway events */}
                    <div className="w-full min-w-0 bg-white rounded-xl border border-slate-100 p-4 md:p-5 shadow-sm">
                        <h3 className="font-bold text-slate-900 text-sm md:text-base mb-4">
                            6. Gateway Events
                        </h3>

                        {payment.events.length > 0 ? (
                            <div className="w-full min-w-0 overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead>
                                        <tr className="border-b border-slate-100 text-slate-500 font-semibold">
                                            <th className="py-2 pr-4">Event</th>
                                            <th className="py-2 pr-4">Outcome</th>
                                            <th className="py-2 pr-4">Amount</th>
                                            <th className="py-2 pr-4">Time</th>
                                            <th className="py-2">Note</th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-slate-100">
                                        {payment.events.map((e) => {
                                            const om = OUTCOME_META[e.outcome] || {
                                                label: formatLabel(e.outcome),
                                                style: 'bg-slate-100 text-slate-600',
                                            };

                                            return (
                                                <tr key={e._id} className="align-top">
                                                    <td className="py-3 pr-4 font-medium text-slate-700 whitespace-nowrap">
                                                        {e.type}
                                                    </td>

                                                    <td className="py-3 pr-4">
                                                        <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-medium whitespace-nowrap ${om.style}`}>
                                                            {om.label}
                                                        </span>
                                                    </td>

                                                    <td className="py-3 pr-4 font-semibold text-slate-800 whitespace-nowrap">
                                                        {e.amount != null
                                                            ? formatPrice(e.amount, e.currency || 'AED')
                                                            : '---'}
                                                    </td>

                                                    <td className="py-3 pr-4 text-slate-500 whitespace-nowrap">
                                                        {formatDateTime(e.createdAt)}
                                                    </td>

                                                    <td className="py-3 text-slate-500 min-w-62.5 wrap-break-word ">
                                                        {e.note || '---'}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-xs text-slate-400">
                                No gateway events recorded for this order.
                            </p>
                        )}
                    </div>
                </div>

                {/* ------------------------------ RIGHT ------------------------------ */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">

                    {/* summary card */}
                    <div className="w-full bg-white rounded-xl border border-slate-100 p-4 md:p-5 shadow-sm">
                        <h3 className="font-bold text-slate-900 text-sm md:text-base mb-6">
                            Payment Summary
                        </h3>

                        <div className="flex flex-col items-center text-center mb-5">
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${meta.iconBg}`}>
                                <SummaryIcon size={28} className={meta.iconColor} />
                            </div>
                            <p className={`text-sm font-semibold ${meta.text}`}>{statusLabel}</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">{formatPrice(payment.amount, payment.currency)}</p>
                            <p className="text-xs text-slate-400">Total Amount</p>
                        </div>

                        <div className="space-y-3 text-sm">
                            <Row label="Payment Type" value={payment.source === 'auction' ? 'Auction' : 'Buy Now'} />
                            <Row label="Gateway" value="Stripe" />
                            <Row label="Order Date" value={formatDateTime(payment.createdAt)} />
                            <Row label="Paid At" value={formatDateTime(payment.paidAt)} />
                            {payout && <Row label="Payout" value={`${payout.payoutId} · ${formatLabel(payout.status)}`} />}

                            {payment.refund && (
                                <>
                                    <Row label="Refund Date" value={formatDateTime(payment.refund.refundedAt)} />
                                    <Row label="Refunded Amount" value={formatPrice(payment.refund.amount ?? payment.amount, payment.currency)} />
                                    <Row label="Refund Status" value={formatLabel(payment.refund.status)} />
                                    <Row label="Refund Reason" value={payment.refund.reason} />
                                    <Row label="Refunded By" value={payment.refund.refundedByName} />
                                    <Row label="Refund Reference" value={payment.refund.stripeRefundId} />
                                </>
                            )}
                        </div>
                    </div>

                    {/* actions */}
                    {showActions && (
                        <div className="w-full bg-white rounded-xl border border-slate-100 p-4 md:p-5 shadow-sm">
                            <h3 className="font-bold text-slate-900 text-sm md:text-base mb-4">Actions</h3>

                            <div className="flex flex-col gap-3">
                                {showHandover && (
                                    <button
                                        type="button"
                                        disabled={isPending}
                                        onClick={handleConfirmHandover}
                                        className="w-full rounded-lg bg-[#D97706] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#B45F04] disabled:opacity-50">
                                        Confirm Handover
                                    </button>
                                )}

                                {showViewPayout && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedPayoutId(payout._id);
                                            setCurrentPage('payouts-detail');
                                        }}
                                        className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition-all hover:border-[#D97706] hover:text-[#D97706] hover:bg-amber-50">
                                        View Payout
                                    </button>
                                )}

                                {showRefund && (
                                    <button
                                        type="button"
                                        disabled={isPending}
                                        onClick={handleRefund}
                                        className="w-full rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition-all hover:bg-red-50 disabled:opacity-50">
                                        Cancel &amp; Refund
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* timeline */}
                    <div className="w-full bg-white rounded-xl border border-slate-100 p-4 md:p-5 shadow-sm">
                        <h3 className="font-bold text-slate-900 text-sm md:text-base mb-4">
                            Transaction Timeline
                        </h3>

                        <div className="space-y-0">
                            {timeline.map((item, idx, arr) => (
                                <div key={item.key} className="flex gap-3 relative">
                                    <div className="flex flex-col items-center">
                                        <TimelineIcon state={item.state} />
                                        {idx !== arr.length - 1 && <div className="w-px flex-1 bg-slate-200 my-1" />}
                                    </div>
                                    <div className="pb-5 min-w-0">
                                        <p className={`text-[12px] font-semibold ${item.state === 'failed' ? 'text-red-600' : 'text-slate-900'}`}>
                                            {item.label}
                                            {item.source === 'payout' && (
                                                <span className="ml-1.5 px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 text-[9px] font-semibold align-middle">
                                                    PAYOUT
                                                </span>
                                            )}
                                        </p>
                                        {item.at && (
                                            <p className="text-xs text-slate-400 mt-0.5">
                                                {formatDateTime(item.at)}{item.by ? ` · ${item.by}` : ''}
                                            </p>
                                        )}
                                        {item.desc && <p className="text-xs text-slate-500 mt-0.5 break-words">{item.desc}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AllPaymentsDetail;
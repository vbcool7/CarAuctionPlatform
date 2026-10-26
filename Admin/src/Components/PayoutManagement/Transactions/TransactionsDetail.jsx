import React from 'react';
import { ArrowLeft, AlertTriangle, CheckCircle, ChevronRight, Circle, Clock, CreditCard, ExternalLink, Landmark, XCircle } from 'lucide-react';

import { formatLabel, formatPrice, fmtDate, fmtTime } from '../../utils/formatter';
import { useGetTransactionDetail } from '../../../hooks/useTransaction';

const STATUS_META = {
    completed: { label: 'Completed', cls: 'bg-green-100 text-green-700' },
    pending: { label: 'Pending', cls: 'bg-amber-100 text-amber-700' },
    failed: { label: 'Failed', cls: 'bg-red-100 text-red-700' },
};

const KIND_META = {
    payment: { label: 'Payment Received', sign: '+', amountCls: 'text-green-600', partyLabel: 'Received From', method: 'Card (Stripe)', Icon: CreditCard },
    refund: { label: 'Refund', sign: '-', amountCls: 'text-red-600', partyLabel: 'Refunded To', method: 'Card (Stripe)', Icon: CreditCard },
    payout: { label: 'Seller Payout', sign: '-', amountCls: 'text-blue-600', partyLabel: 'Paid To', method: 'Bank Transfer', Icon: Landmark },
};

const humanize = (s) => String(s || '').replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());

const BAD_STATUSES = ['refund_failed', 'canceled'];
const GOOD_STATUSES = ['paid', 'refunded_admin', 'refunded_late', 'refunded_duplicate', 'amount_mismatch', 'handover_confirmed', 'available', 'requested', 'on_hold'];

function Row({ label, value }) {
    return (
        <div className="flex justify-between gap-4">
            <span className="text-slate-500 shrink-0">{label}</span>
            <span className="text-[13px] font-semibold text-slate-700 text-right break-all">{value || '—'}</span>
        </div>
    );
}

function TransactionsDetail({ transactionId, setCurrentPage, setSelectedPaymentId, setSelectedPayoutId, setSelectedRefundId }) {

    const { data, isLoading, isError } = useGetTransactionDetail(transactionId);
    const txn = data?.transaction;

    const backBtn = (
        <button
            onClick={() => setCurrentPage('transactions')}
            className="mt-3 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:border-[#D97706] hover:bg-amber-50 hover:text-[#D97706]"
        >
            <ArrowLeft size={16} />
            <span>Back to Transactions</span>
        </button>
    );

    if (isLoading) return <p className="p-10 text-center">Loading transaction....</p>;

    if (isError || !txn) {
        return (
            <div className="p-6">
                <p className="text-sm text-slate-500">Transaction not found.</p>
                {backBtn}
            </div>
        );
    }

    const status = STATUS_META[txn.status] || STATUS_META.pending;
    const kindMeta = KIND_META[txn.kind] || KIND_META.payment;
    const MethodIcon = kindMeta.Icon;

    const order = txn.order;
    const payout = txn.payout;
    const party = txn.kind === 'payout' ? txn.seller : txn.buyer;

    // is transaction ka apna detail page (refund / payout) aur order ka payment page
    const goPayment = () => {
        setSelectedPaymentId(order._id);
        setCurrentPage('all-payments-detail');
    };
    const goRefund = () => {
        setSelectedRefundId(txn.refundId);
        setCurrentPage('refunds-detail');
    };
    const goPayout = () => {
        setSelectedPayoutId(payout._id);
        setCurrentPage('payouts-detail');
    };

    const linkBtn = 'flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-transparent p-2 font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-[#D97706] hover:text-[#D97706] hover:bg-amber-50';

    return (
        <div className='pb-6'>

            {/* Header */}
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between pb-6">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3D]">Transaction Details</h1>

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
                            onClick={() => setCurrentPage('transactions')}
                            className="cursor-pointer text-slate-500 hover:text-[#D97706] transition-colors">
                            Transactions
                        </span>

                        <span className="mx-1 text-slate-300"><ChevronRight size={16} /></span>
                        <span className="font-medium text-[#D97706]">Transaction Detail</span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    {txn.kind === 'refund' && txn.refundId && (
                        <button onClick={goRefund} className={linkBtn}>
                            <ExternalLink size={16} />
                            <span className="text-[13px]">View Refund</span>
                        </button>
                    )}
                    {txn.kind === 'payout' && payout?._id && (
                        <button onClick={goPayout} className={linkBtn}>
                            <ExternalLink size={16} />
                            <span className="text-[13px]">View Payout</span>
                        </button>
                    )}
                    {order?._id && (
                        <button onClick={goPayment} className={linkBtn}>
                            <ExternalLink size={16} />
                            <span className="text-[13px]">View Payment</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Failed alert */}
            {txn.status === 'failed' && !txn.resolved && (
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                    <AlertTriangle size={18} className="mt-0.5 text-red-500 shrink-0" />
                    <div className="text-sm text-red-700">
                        <p className="font-semibold">This transaction did not go through. No money moved.</p>
                        {txn.failureNote && <p className="mt-1 text-[13px]">Gateway: {txn.failureNote}</p>}
                        <p className="mt-1 text-[13px]">Check this payment in the Stripe dashboard if the buyer still needs to be refunded.</p>
                    </div>
                </div>
            )}

            {txn.resolved && (
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
                    <CheckCircle size={18} className="mt-0.5 text-green-600 shrink-0" />
                    <p className="text-sm text-green-700">This attempt failed, but the order was later canceled and refunded on retry.</p>
                </div>
            )}

            {/* Summary strip */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm grid grid-cols-2 md:grid-cols-5 gap-6 mb-6">
                <div className="space-y-4 border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-4">
                    <div>
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1">{txn.kind === 'payout' ? 'Payout ID' : 'Order ID'}</p>
                        <p className="text-sm font-bold text-[#0B1E3D] tracking-tight">
                            {txn.kind === 'payout' ? (payout?.payoutId || '—') : (order?.orderId || '—')}
                        </p>
                    </div>
                    <div>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wide shadow-sm ${status.cls}`}>
                            {status.label}
                        </span>
                    </div>
                </div>

                {/* Column 2: Type & Reference ID */}
                <div className="space-y-4 border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-4">
                    <div>
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1">Type</p>
                        <p className="text-sm font-semibold text-[#0B1E3D]">{kindMeta.label}</p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1">Reference ID</p>
                        <p className="text-sm font-medium text-slate-700 bg-slate-100/70 px-2 py-0.5 rounded font-mono break-all inline-block">{txn.reference || '—'}</p>
                    </div>
                </div>

                {/* Column 3: Date & Time */}
                <div className="space-y-4 border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-4">
                    <div>
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1">Date &amp; Time</p>
                        <p className="text-sm font-semibold text-[#0B1E3D]">{fmtDate(txn.at)}, <span className="text-slate-500 font-normal">{fmtTime(txn.at)}</span></p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1">Completed On</p>
                        <p className="text-sm font-semibold text-[#0B1E3D]">
                            {txn.status === 'completed' ? `${fmtDate(txn.at)}, ${fmtTime(txn.at)}` : <span className="text-slate-400 font-normal">—</span>}
                        </p>
                    </div>
                </div>

                {/* Column 4: Party Details & User Role */}
                <div className="space-y-4 border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-4">
                    <div>
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1">{kindMeta.partyLabel}</p>
                        {party ? (
                            <div className="flex items-center gap-2.5 mt-1">
                                {party.image ? (
                                    <img src={party.image} alt="" className="w-7 h-7 rounded-full object-cover ring-2 ring-slate-100 flex-shrink-0" />
                                ) : (
                                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs flex-shrink-0">
                                        {party.name ? party.name[0].toUpperCase() : '—'}
                                    </div>
                                )}
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-[#0B1E3D] leading-tight truncate">{party.name || '—'}</p>
                                    <p className="text-[11px] text-slate-400 leading-tight truncate mt-0.5">{party.email || '—'}</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-slate-400 mt-1 italic">Deleted user</p>
                        )}
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1">User Role</p>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                            {txn.kind === 'payout' ? 'Seller' : formatLabel(txn.buyer?.type) || '—'}
                        </span>
                    </div>
                </div>

                {/* Column 5: Amount & Currency */}
                <div className="space-y-4">
                    <div>
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1">Amount</p>
                        <p className={`text-base font-bold ${txn.status === 'failed' ? 'text-slate-400 line-through' : kindMeta.amountCls}`}>
                            {txn.status === 'failed' ? '' : kindMeta.sign}{txn.amount != null ? formatPrice(txn.amount) : '—'}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1">Currency</p>
                        <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded uppercase tracking-wider">
                            {txn.currency}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* ------------------------- LEFT ------------------------- */}
                <div className="space-y-6">
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="text-sm font-semibold text-[#0B1E3D] mb-4">Payment Method</h3>
                        <div className="flex items-center gap-2 mb-3">
                            <MethodIcon size={16} className="text-[#D97706]" />
                            <span className="font-semibold text-slate-800">{kindMeta.method}</span>
                        </div>

                        {txn.kind === 'payout' ? (
                            payout?.bank ? (
                                <div className="space-y-2 text-sm">
                                    <Row label="Bank Name" value={payout.bank.bankName} />
                                    <Row label="Account Holder" value={payout.bank.accountHolderName} />
                                    <Row label="IBAN" value={payout.bank.iban} />
                                    <Row label="Account Number" value={payout.bank.accountNumber} />
                                    <Row label="SWIFT" value={payout.bank.swiftCode} />
                                </div>
                            ) : (
                                <p className="text-sm text-slate-400">No bank details captured for this payout.</p>
                            )
                        ) : (
                            <div className="space-y-2 text-sm">
                                <Row label="Payment Intent" value={txn.gateway?.paymentIntentId} />
                                {txn.kind === 'refund' && <Row label="Stripe Refund ID" value={txn.gateway?.stripeRefundId} />}
                                <Row label="Checkout Session" value={txn.gateway?.sessionId} />
                            </div>
                        )}
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="text-sm font-semibold text-[#0B1E3D] mb-4">Description</h3>
                        <p className="text-sm text-[#0B1E3D] mb-2">{txn.description || '—'}</p>
                        {order?.listingId && (
                            <span className="inline-block text-[12px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md">{order.listingId}</span>
                        )}
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="text-sm font-semibold text-[#0B1E3D] mb-4">Notes</h3>
                        {txn.note || txn.failureNote || txn.gateway?.refundedByName ? (
                            <div className="space-y-3 text-sm">
                                {txn.note && (
                                    <div>
                                        <p className="text-[11px] text-slate-500">{txn.kind === 'refund' ? 'Reason' : 'Note'}</p>
                                        <p className="text-[#0B1E3D] wrap-break-word">{txn.note}</p>
                                    </div>
                                )}
                                {txn.gateway?.refundedByName && (
                                    <div>
                                        <p className="text-[11px] text-slate-500">Refunded By</p>
                                        <p className="text-[#0B1E3D]">{txn.gateway.refundedByName}</p>
                                    </div>
                                )}
                                {txn.failureNote && (
                                    <div>
                                        <p className="text-[11px] text-slate-500">Gateway Error</p>
                                        <p className="text-red-600 wrap-break-word">{txn.failureNote}</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-400">No additional notes for this transaction.</p>
                        )}
                    </div>
                </div>

                {/* ------------------------- MIDDLE ------------------------- */}
                <div className="space-y-6">
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="text-sm font-semibold text-[#0B1E3D] mb-4">Transaction Summary</h3>

                        {txn.kind === 'payout' && payout ? (
                            <>
                                <div className="space-y-2 text-sm">
                                    <Row label="Sale Amount" value={formatPrice(payout.grossAmount)} />
                                    <div className="flex justify-between gap-4">
                                        <span className="text-slate-500">Commission ({payout.commissionPercent}%)</span>
                                        <span className="font-medium text-red-500">-{formatPrice(payout.commissionAmount)}</span>
                                    </div>
                                </div>
                                <div className="border-t border-slate-100 mt-3 pt-3 flex justify-between">
                                    <span className="text-sm font-semibold text-[#0B1E3D]">Net Paid to Seller</span>
                                    <span className="text-sm font-semibold text-blue-600">{formatPrice(payout.netAmount)}</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="space-y-2 text-sm">
                                    <Row label="Amount" value={txn.amount != null ? formatPrice(txn.amount) : null} />
                                    {order && <Row label="Order Amount" value={formatPrice(order.amount)} />}
                                </div>
                                <div className="border-t border-slate-100 mt-3 pt-3 flex justify-between">
                                    <span className="text-sm font-semibold text-[#0B1E3D]">{txn.kind === 'refund' ? 'Total Refunded' : 'Total Received'}</span>
                                    <span className={`text-sm font-semibold ${kindMeta.amountCls}`}>
                                        {txn.status === 'failed' ? formatPrice(0) : (txn.amount != null ? formatPrice(txn.amount) : '—')}
                                    </span>
                                </div>
                            </>
                        )}
                        <p className="mt-3 text-[11px] text-slate-400">Stripe processing fees are not recorded, so no fee or tax is shown.</p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="text-sm font-semibold text-[#0B1E3D] mb-4">Transaction Timeline</h3>
                        {txn.timeline.length > 0 ? (
                            <div className="space-y-4">
                                {txn.timeline.map((t, i) => {
                                    const bad = BAD_STATUSES.includes(t.status);
                                    const good = GOOD_STATUSES.includes(t.status);
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
                </div>

                {/* ------------------------- RIGHT ------------------------- */}
                <div className="space-y-6">
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="text-sm font-semibold text-[#0B1E3D] mb-4">Related Information</h3>
                        {order ? (
                            <div className="space-y-2 text-sm">
                                <Row label="Order ID" value={order.orderId} />
                                <Row label="Listing ID" value={order.listingId} />
                                <Row label="Sale Type" value={order.source === 'auction' ? 'Auction' : 'Buy Now'} />
                                <Row label="Order Status" value={formatLabel(order.status)} />
                                <Row label="Buyer" value={txn.buyer?.name} />
                                <Row label="Seller" value={txn.seller?.name} />
                                {payout && <Row label="Payout Status" value={formatLabel(payout.status)} />}
                                {payout?.transferReference && <Row label="Transfer Ref" value={payout.transferReference} />}
                                {payout?.paidByName && <Row label="Paid By" value={payout.paidByName} />}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-400 italic">No order is linked to this transaction.</p>
                        )}
                    </div>

                    {/* vehicle info */}
                    {txn.vehicle && (
                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                            <h3 className="text-sm font-semibold text-[#0B1E3D] mb-4">Vehicle Details</h3>

                            <div className="flex items-center gap-4 mb-5">
                                <div className="w-20 h-14 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                                    {txn.vehicle.image && (
                                        <img src={txn.vehicle.image} alt="" className="w-full h-full object-cover" />
                                    )}
                                </div>

                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-[#0B1E3D] truncate">
                                        {`${txn.vehicle.year || ''} ${formatLabel(txn.vehicle.make)} ${formatLabel(txn.vehicle.model)}`.trim()}
                                    </p>
                                    <p className="text-[11px] text-slate-500">VIN: {txn.vehicle.vin}</p>
                                    <p className="text-[11px] text-slate-500">{txn.vehicle.listingId}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4">
                                {[
                                    { label: 'Trim', value: formatLabel(txn.vehicle.trim) },
                                    { label: 'Mileage', value: txn.vehicle.mileage != null ? `${Number(txn.vehicle.mileage).toLocaleString()} km` : null },
                                    { label: 'Fuel Type', value: formatLabel(txn.vehicle.fuelType) },
                                    { label: 'Transmission', value: formatLabel(txn.vehicle.transmission) },
                                    { label: 'Body Type', value: formatLabel(txn.vehicle.bodyType) },
                                    { label: 'Exterior Color', value: formatLabel(txn.vehicle.exteriorColor) },
                                    { label: 'Interior Color', value: formatLabel(txn.vehicle.interiorColor) },
                                    { label: 'Condition', value: formatLabel(txn.vehicle.condition) },
                                ].map(({ label, value }) => (
                                    <div
                                        key={label}
                                        className="min-w-0">
                                        <p className="text-xs text-slate-500 mb-1">{label}</p>
                                        <p className="text-[12px] font-medium text-slate-800 wrap-break-word">
                                            {value != null && value !== '' ? value : '—'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default TransactionsDetail;
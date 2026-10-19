
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useGetMyOrders } from '../../../hook/usePayment';
import { useCheckout } from '../../../hook/useBuy';
import { formatDateTime, formatLabel, formatPrice } from '../../../utils/formatters';

const FILTERS = [
    { key: '', label: 'All' },
    { key: 'pending_payment', label: 'Awaiting Payment' },
    { key: 'paid', label: 'Paid' },
    { key: 'expired', label: 'Expired' },
    { key: 'canceled', label: 'Canceled' },
];

const BADGE = {
    pending_payment: 'bg-amber-50 text-amber-700 border-amber-200',
    paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    expired: 'bg-slate-100 text-slate-600 border-slate-200',
    canceled: 'bg-red-50 text-red-600 border-red-200',
};
const BADGE_LABEL = { pending_payment: 'Awaiting Payment' };

const MIN_PAY_MS = 31 * 60 * 1000;   // backend 31 min se kam bachne par checkout block karta hai

function BuyerOrdersList() {
    const [status, setStatus] = useState('');
    const [page, setPage] = useState(1);
    const { data, isLoading, isError } = useGetMyOrders(page, 10, status);
    const { mutate: startCheckout, isPending, variables: payingId } = useCheckout();

    const handlePay = (orderId) => {
        startCheckout(orderId, {
            onSuccess: (res) => { window.location.href = res.url; },
            onError: (err) => toast.error(err.response?.data?.message || 'Could not start payment'),
        });
    };

    const orders = data?.orders || [];
    const pagination = data?.pagination;

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
                {FILTERS.map((f) => (
                    <button
                        key={f.key}
                        onClick={() => { setStatus(f.key); setPage(1); }}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${status === f.key
                            ? 'bg-[#0B1E3D] text-white border-[#0B1E3D]'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {isLoading && <p className="text-sm ">Loading details</p>}
            {isError && <p className="text-sm text-red-500">Failed to load payments</p>}
            {!isLoading && !isError && orders.length === 0 && (
                <p className="text-sm text-slate-500 py-8 text-center">No payments found.</p>
            )}

            {orders.map((o) => {
                const v = o.vehicleId;
                const name = v ? `${v.year ?? ''} ${formatLabel(v.make)} ${formatLabel(v.model)}`.trim() : o.listingId;
                const img = v?.images?.[0]?.url;
                const msLeft = new Date(o.paymentDueAt).getTime() - Date.now();
                const canPay = o.status === 'pending_payment' && msLeft >= MIN_PAY_MS;
                const closing = o.status === 'pending_payment' && msLeft < MIN_PAY_MS;

                return (
                    <div key={o._id} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-4">
                        {img && <img src={img} alt={name} className="w-full sm:w-36 h-28 object-cover rounded-xl" />}
                        <div className="flex-1 space-y-1.5">
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <p className="font-bold text-slate-900">{name}</p>
                                    <p className="text-xs text-slate-500">{o.orderId} · {o.listingId} · {o.source === 'buy_now' ? 'Buy Now' : 'Auction'}</p>
                                </div>
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${BADGE[o.status] || ''}`}>
                                    {BADGE_LABEL[o.status] || formatLabel(o.status)}
                                </span>
                            </div>

                            <p className="text-lg font-extrabold text-[#D97706]">{formatPrice(o.amount)}</p>

                            {o.status === 'pending_payment' && (
                                <p className="text-xs text-slate-500">Pay before {formatDateTime(o.paymentDueAt)} (UAE time)</p>
                            )}
                            {o.status === 'paid' && <p className="text-xs text-slate-500">Paid on {formatDateTime(o.paidAt)}</p>}
                            {o.status === 'expired' && <p className="text-xs text-slate-500">Expired on {formatDateTime(o.expiredAt)}</p>}

                            {canPay && (
                                <button
                                    onClick={() => handlePay(o._id)}
                                    disabled={isPending}
                                    className="mt-2 bg-[#D97706] hover:bg-[#b86405] text-white text-sm font-bold px-5 py-2 rounded-lg transition-all disabled:opacity-50"
                                >
                                    {isPending && payingId === o._id ? 'Opening...' : 'Pay now'}
                                </button>
                            )}
                            {closing && (
                                <p className="text-xs text-red-500 mt-2">Payment window closes in under 30 minutes, so a new payment cannot be started. Contact support.</p>
                            )}
                        </div>
                    </div>
                );
            })}

            {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between pt-2">
                    <button onClick={() => setPage((p) => p - 1)} disabled={page <= 1}
                        className="px-4 py-2 text-sm border border-slate-200 rounded-lg disabled:opacity-40">Previous</button>
                    <span className="text-xs text-slate-500">Page {pagination.page} of {pagination.totalPages}</span>
                    <button onClick={() => setPage((p) => p + 1)} disabled={page >= pagination.totalPages}
                        className="px-4 py-2 text-sm border border-slate-200 rounded-lg disabled:opacity-40">Next</button>
                </div>
            )}
        </div>
    );
}

export default BuyerOrdersList;
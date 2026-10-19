
import React from 'react';
import { toast } from 'react-toastify';
import { useGetMyOrders } from '../../../hook/usePayment';
import { useCheckout } from '../../../hook/useBuy';
import { formatDateTime, formatLabel, formatPrice } from '../../../utils/formatters';

const MIN_PAY_MS = 31 * 60 * 1000;

function PendingPaymentsBanner({ setCurrentPage }) {
    const { data } = useGetMyOrders(1, 5, 'pending_payment');
    const { mutate: startCheckout, isPending, variables: payingId } = useCheckout();

    const orders = data?.orders || [];
    if (orders.length === 0) return null;

    const handlePay = (id) => {
        startCheckout(id, {
            onSuccess: (res) => { window.location.href = res.url; },
            onError: (err) => toast.error(err.response?.data?.message || 'Could not start payment'),
        });
    };

    return (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-bold text-[#0B1E3D]">
                Payment pending ({orders.length})
            </p>
            <div className="mt-3 space-y-3">
                {orders.map((o) => {
                    const v = o.vehicleId;
                    const name = v ? `${v.year ?? ''} ${formatLabel(v.make)} ${formatLabel(v.model)}`.trim() : o.listingId;
                    const canPay = new Date(o.paymentDueAt).getTime() - Date.now() >= MIN_PAY_MS;
                    return (
                        <div key={o._id} className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-xl p-3 border border-amber-100">
                            <div>
                                <p className="text-sm font-semibold text-slate-900">{name}</p>
                                <p className="text-xs text-slate-500">
                                    {o.orderId} · {formatPrice(o.amount)} · Pay before {formatDateTime(o.paymentDueAt)}
                                </p>
                            </div>
                            {canPay ? (
                                <button
                                    onClick={() => handlePay(o._id)}
                                    disabled={isPending}
                                    className="bg-[#D97706] hover:bg-[#b86405] text-white text-sm font-bold px-5 py-2 rounded-lg disabled:opacity-50"
                                >
                                    {isPending && payingId === o._id ? 'Opening...' : 'Pay now'}
                                </button>
                            ) : (
                                <span className="text-xs text-red-500">Window closing, contact support</span>
                            )}
                        </div>
                    );
                })}
            </div>
            <button
                onClick={() => setCurrentPage('payments')}
                className="mt-3 text-xs font-semibold text-[#0B1E3D] hover:text-[#D97706]"
            >
                View all payments →
            </button>
        </div>
    );
}

export default PendingPaymentsBanner;
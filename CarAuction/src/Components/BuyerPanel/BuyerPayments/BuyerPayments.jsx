
import React, { useState } from 'react';
import { ShieldCheck, Lock, CreditCard, Award, Receipt } from "lucide-react";
import { toast } from 'react-toastify';
import BuyerContactSupport from '../BuyerSharedComponents/BuyerContactSupport';

import { useGetMyOrders, useGetMyOrdersSummary } from '../../../hook/usePayment';
import { useCheckout } from '../../../hook/useBuy';
import { getPaginationRange } from '../../utils/getPaginationRange';
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

function BuyerPayments({ setSelectedVehicleId, setCurrentPage }) {

    const [status, setStatus] = useState('');
    const [page, setPage] = useState(1);

    const { data, isLoading, isError } = useGetMyOrders(page, 10, status);
    const { mutate: startCheckout, isPending, variables: payingId } = useCheckout();
    const { data: sumData } = useGetMyOrdersSummary();

    // handle pay
    const handlePay = (orderId) => {
        startCheckout(orderId, {
            onSuccess: (res) => { window.location.href = res.url; },
            onError: (err) => toast.error(err.response?.data?.message || 'Could not start payment'),
        });
    };

    const orders = data?.orders || [];
    const totalPages = data?.pagination?.totalPages || 1;
    const s = sumData?.summary || {};
    const count = (k) => s[k]?.count || 0;
    const total = (k) => s[k]?.total || 0;

    if (isLoading) return <p className="p-10 text-center">Loading payment list....</p>;
    if (isError) return <p className="p-10 text-center text-red-500">Failed to load payment list</p>;

    return (
        <div className='pb-6'>
            <div className='pb-7'>
                <h1 className='text-slate-800 text-xl md:text-2xl font-bold'>Payments</h1>
                <p className='pt-1 text-gray-600 text-[12px] md:text-sm font-medium'>Track and manage your payments for won vehicles.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                {/* list */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            {FILTERS.map((f) => (
                                <button
                                    key={f.key}
                                    onClick={() => {
                                        setStatus(f.key);
                                        setPage(1);
                                    }}
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
                            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-3 border border-slate-200/60 shadow-sm">
                                    <Receipt size={24} />
                                </div>
                                <h3 className="text-sm font-bold text-[#0B1E3D] mb-1">No payments found</h3>
                                <p className="text-xs text-slate-500 max-w-xs">
                                    You haven't made any transactions or payment history yet.
                                </p>
                            </div>
                        )}

                        {orders.map((o) => {

                            const v = o.vehicleId;
                            const name = v ? `${v.year ?? ''} ${formatLabel(v.make)} ${formatLabel(v.model)}`.trim() : o.listingId;
                            const img = v?.images?.[0]?.url;
                            const msLeft = new Date(o.paymentDueAt).getTime() - Date.now();
                            const canPay = o.status === 'pending_payment' && msLeft >= MIN_PAY_MS;
                            const closing = o.status === 'pending_payment' && msLeft < MIN_PAY_MS;

                            return (
                                <div
                                    key={o._id}
                                    className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-4">
                                    {img &&
                                        <img
                                            src={img}
                                            alt={name}
                                            className="w-full sm:w-36 h-28 object-cover rounded-xl" />}
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
                                        {o.status === 'canceled' && <p className="text-xs text-slate-500">Refunded {formatPrice(o.refund?.amount)} on {formatDateTime(o.refund?.refundedAt)}</p>}

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

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between gap-4 px-5 py-4 mt-5 ">
                                <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
                                    <span>Page</span>

                                    <span className="inline-flex items-center justify-center min-w-7 h-7 px-2 rounded-lg bg-slate-50 border border-slate-100 font-bold text-[#0B1E3D]">
                                        {page}
                                    </span>

                                    <span>of</span>

                                    <span className="font-semibold text-[#0B1E3D]">
                                        {totalPages}
                                    </span>
                                </div>

                                {/* Pagination */}
                                <div className="flex items-center gap-1.5 mx-auto sm:mx-0 sm:ml-auto">
                                    <button
                                        type="button"
                                        onClick={() => setPage((p) => p - 1)}
                                        disabled={page === 1}
                                        className=" h-9 px-3.5 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-xs font-semibold text-[#0B1E3D] hover:bg-slate-50 hover:border-[#0B1E3D] disabled:opacity-35 disabled:cursor-not-allowed transition-all duration-200"
                                    >
                                        Previous
                                    </button>

                                    <div className="flex items-center gap-1">
                                        {getPaginationRange(page, totalPages).map((num, idx) =>
                                            num === "..." ? (
                                                <span
                                                    key={`dot-${idx}`}
                                                    className=" w-8 h-9 flex items-center justify-center text-xs font-semibold text-slate-400"
                                                >
                                                    ...
                                                </span>
                                            ) : (
                                                <button
                                                    type="button"
                                                    key={num}
                                                    onClick={() => setPage(num)}
                                                    className={` w-9 h-9 flex items-center justify-center rounded-lg text-xs font-bold border transition-all duration-200
                                                                                                                                                                                ${page === num
                                                            ? "bg-[#0B1E3D] text-white border-[#0B1E3D] shadow-md shadow-slate-200 scale-[1.02]"
                                                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-[#0B1E3D] hover:text-[#0B1E3D]"
                                                        }`}
                                                >
                                                    {num}
                                                </button>
                                            )
                                        )}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setPage((p) => p + 1)}
                                        disabled={page === totalPages}
                                        className=" h-9 px-3.5 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-xs font-semibold text-[#0B1E3D] hover:bg-slate-50 hover:border-[#0B1E3D] disabled:opacity-35 disabled:cursor-not-allowed transition-all duration-200"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* summary */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="w-full max-w-sm space-y-6">

                        {/* 1. Payment Summary */}
                        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <CreditCard className="text-[#D97706]" size={20} />
                                <h2 className="text-lg font-bold text-[#0B1E3D]">Payment Summary</h2>
                            </div>

                            <div className="space-y-4 mb-6">
                                {[
                                    { label: 'Total Payments', value: count('paid') + count('pending_payment') + count('canceled') },
                                    { label: 'Completed Payments', value: count('paid') },
                                    { label: 'Pending Payments', value: count('pending_payment') },
                                    { label: 'Refunds', value: count('canceled') },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-sm font-medium text-[#0B1E3D]">
                                        <span className="text-slate-600">{item.label}</span>
                                        <span className="font-bold">{item.value}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 pt-4 border-t border-slate-100">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-600 font-medium">Total Paid</span>
                                    <span className="font-bold text-emerald-600">{formatPrice(total('paid'))}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-600 font-medium">Total Pending</span>
                                    <span className="font-bold text-orange-600">{formatPrice(total('pending_payment'))}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-600 font-medium">Total Refunded</span>
                                    <span className="font-bold text-purple-600">{formatPrice(total('canceled'))}</span>
                                </div>
                            </div>
                        </div>

                        {/* 2. Need Help */}
                        <BuyerContactSupport />

                        {/* 3. Secure Payments */}
                        <div className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-100 text-[#D97706]">
                                        <ShieldCheck size={22} />
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-bold text-[#0B1E3D]">Secure & Protected Payments</h2>
                                        <p className="text-xs text-slate-500 mt-0.5">Encrypted with industry-standard SSL</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                                <div className="flex items-center gap-1.5">
                                    <Lock size={14} className="text-amber-600" />
                                    <span>Private & Encrypted</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Award size={14} className="text-blue-600" />
                                    <span>Buyer Protection</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BuyerPayments;
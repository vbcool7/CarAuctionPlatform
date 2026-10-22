
import React from 'react';
import { ArrowLeft, ChevronRight, CheckCircle2, Landmark, XCircle, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useGetPayoutDetail, useAdminPayoutAction } from '../../../hooks/usePayout';
import { formatLabel } from '../../utils/formatter';
import useAdminAuthStore from '../../../store/useAdminAuthStore';

const STATUS_STYLES = {
    on_hold: 'bg-gray-100 text-gray-600',
    available: 'bg-blue-100 text-blue-700',
    requested: 'bg-amber-100 text-amber-700',
    paid: 'bg-green-100 text-green-700',
    canceled: 'bg-red-100 text-red-700',
};

const money = (n, cur = 'AED') => `${cur} ${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
const when = (d) => (d ? new Date(d).toLocaleString('en-AE', { timeZone: 'Asia/Dubai', dateStyle: 'medium', timeStyle: 'short' }) : '—');
const Row = ({ label, value }) => (
    <div className="flex justify-between gap-4">
        <span className="text-slate-500">{label}</span>
        <span className="font-medium text-slate-700 text-right break-all">{value || '—'}</span>
    </div>
);
const askText = (msg) => {
    const v = window.prompt(msg);
    return v && v.trim().length >= 3 ? v.trim() : null;
};

function PayoutsDetail({ setCurrentPage, payoutId }) {

    const { admin } = useAdminAuthStore();
    const { data, isLoading, isError } = useGetPayoutDetail(payoutId);
    const { mutate: act, isPending: acting } = useAdminPayoutAction();

    const isAdmin = admin?.role === 'admin';

    if (isLoading) return <p className="p-10 text-center">Loading payout...</p>;
    if (isError || !data?.payout) {
        return (
            <div className="p-6">
                <p className="text-sm text-red-500">Payout not found.</p>
                <button
                    onClick={() => setCurrentPage('payouts')}
                    className="mt-3 inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm">
                    <ArrowLeft size={16} /> Back to Payouts
                </button>
            </div>
        );
    }

    const p = data.payout;
    const seller = p.sellerId;
    const vehicle = p.vehicleId;
    const order = p.orderId;
    const bank = p.bankSnapshot;

    const run = (type, id, body, okMsg) =>
        act({ type, id, body }, {
            onSuccess: () => toast.success(okMsg),
            onError: (e) => toast.error(e.response?.data?.message || 'Action failed'),
        });

    const onHandover = () => {
        const note = askText('How was the handover verified? (min 3 characters)');
        if (note) run('handover', order._id, { note }, 'Handover confirmed');
    };
    const onPaid = () => {
        const transferReference = askText('Bank transfer reference');
        if (transferReference) run('paid', p._id, { transferReference }, 'Marked as paid');
    };
    const onReject = () => {
        const reason = askText('Reason for rejecting the request');
        if (reason) run('reject', p._id, { reason }, 'Request rejected');
    };
    const onRefund = () => {
        if (!window.confirm(`Refund ${money(order.amount)} to the buyer and cancel this sale? This cannot be undone.`)) return;
        const reason = askText('Reason for cancel & refund');
        if (reason) run('refund', order._id, { reason }, 'Order canceled and refunded');
    };

    const canRefund = isAdmin && ['on_hold', 'available', 'requested'].includes(p.status);
    const hasActions = p.status === 'on_hold' || p.status === 'requested' || canRefund;
    const vehicleName = vehicle ? `${vehicle.year} ${formatLabel(vehicle.make)} ${formatLabel(vehicle.model)}` : '—';

    return (
        <div className="pb-10 max-w-7xl mx-auto space-y-6">

            {/* header */}
            <div className="pb-2">
                <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3D]">Payout Details</h1>
                <div className="mt-2 flex items-center text-[11px] md:text-[13px]">
                    <span
                        onClick={() => setCurrentPage('dashboard')}
                        className="cursor-pointer text-slate-500 hover:text-[#D97706] transition-colors">Dashboard</span>
                    <ChevronRight size={16} className="mx-1 text-slate-300" />

                    <span
                        onClick={() => setCurrentPage('payouts')}
                        className="cursor-pointer text-slate-500 hover:text-[#D97706] transition-colors">Payouts</span>
                    <ChevronRight size={16} className="mx-1 text-slate-300" />

                    <span className="font-medium text-[#D97706]">{p.payoutId}</span>
                </div>
            </div>

            {/* summary hero card */}
            <div className="rounded-2xl border border-slate-200/80 bg-linear-to-r from-slate-50/50 via-white to-white p-6 shadow-sm">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                    <div className="space-y-1 pt-3 md:pt-0">
                        <p className="text-[11px] font-medium tracking-wide uppercase text-slate-400">Payout ID & Status</p>
                        <p className="text-sm font-bold text-[#0B1E3D]">{p.payoutId}</p>
                        <div>
                            <span className={`mt-1.5 inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide 
                            ${STATUS_STYLES[p.status] || ''}`}>
                                {formatLabel(p.status)}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-1 pt-3 md:pt-0 md:pl-6">
                        <p className="text-[11px] font-medium tracking-wide uppercase text-slate-400">Net payout to seller</p>
                        <p className="text-lg font-extrabold text-green-600">{money(p.netAmount, p.currency)}</p>
                        <div className="pt-1">
                            <p className="text-[11px] text-slate-400">Order: <span className="font-semibold text-[#0B1E3D]">{order?.orderId}</span></p>
                            <span className="inline-block text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded mt-0.5">
                                {order?.source === 'buy_now' ? 'Buy Now' : 'Auction'}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-1 pt-3 md:pt-0 md:pl-6">
                        <p className="text-[11px] font-medium tracking-wide uppercase text-slate-400">Vehicle</p>
                        <p className="text-sm font-bold text-[#0B1E3D] truncate" title={vehicleName}>{vehicleName}</p>
                        <p className="text-[11px] font-mono text-slate-500 pt-1">{p.listingId}</p>
                    </div>
                    <div className="space-y-1 pt-3 md:pt-0 md:pl-6">
                        <p className="text-[11px] font-medium tracking-wide uppercase text-slate-400">Timeline</p>
                        <div>
                            <p className="text-[11px] text-slate-500">Created</p>
                            <p className="text-xs font-semibold text-[#0B1E3D]">{when(p.createdAt)}</p>
                        </div>
                        {p.status === 'paid' && (
                            <div className="pt-1">
                                <p className="text-[11px] text-slate-500">Paid on</p>
                                <p className="text-xs font-semibold text-green-700">{when(p.paidAt)}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* main grid content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* ------------------------ LEFT ------------------------ */}
                <div className="lg:col-span-2 space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Seller Card */}
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm flex flex-col justify-between">
                            <div>
                                <h3 className="mb-4 text-sm font-bold text-[#0B1E3D] flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-[#D97706]"></span> Seller Information
                                </h3>
                                <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
                                    {seller?.profileImage ? (
                                        <img src={seller.profileImage} alt="" className="h-12 w-12 rounded-full object-cover ring-2 ring-slate-100" />
                                    ) : (
                                        <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-sm">
                                            {seller?.fullName?.[0] || 'S'}
                                        </div>
                                    )}
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-[#0B1E3D] truncate">{seller?.fullName || 'Deleted seller'}</p>
                                        <p className="text-[11px] text-slate-500 truncate">{seller?.email}</p>
                                        <p className="text-[11px] text-slate-500">{seller?.phone}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 space-y-2.5 text-[12px]">
                                <Row label="Seller ID" value={seller?.sellerId} />
                                <Row label="Business Name" value={seller?.businessName} />
                                <Row label="Trade License No." value={seller?.licenseNumber} />
                                <Row label="Joined On" value={when(seller?.createdAt)} />
                            </div>
                        </div>

                        {/* Bank Details Card */}
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm flex flex-col justify-between">
                            <div>
                                <h3 className="mb-4 text-sm font-bold text-[#0B1E3D] flex items-center gap-2">
                                    <Landmark size={16} className="text-[#D97706]" /> Bank Account Details
                                </h3>
                                {bank?.ibanNumber ? (
                                    <div className="space-y-2.5 text-[12px]">
                                        <Row label="Account Holder" value={bank.accountHolderName} />
                                        <Row label="Bank Name" value={bank.bankName} />
                                        <Row label="Account Number" value={bank.accountNumber} />
                                        <Row label="IBAN" value={bank.ibanNumber} />
                                        <Row label="SWIFT" value={bank.swiftCode} />
                                        <Row label="Currency" value={p.currency} />
                                    </div>
                                ) : (
                                    <div className="py-8 text-center">
                                        <p className="text-[12px] text-slate-400">Seller has not requested this payout yet. Bank details are saved upon request.</p>
                                    </div>
                                )}
                            </div>
                            {p.status === 'paid' && (
                                <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-100 px-3.5 py-2.5 text-[11px] text-emerald-800 flex items-center gap-2">
                                    <span className="font-semibold">Transfer Ref:</span> <span className="font-mono font-bold">{p.transferReference}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Payout Breakdown */}
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                            <h3 className="mb-4 text-sm font-bold text-[#0B1E3D] flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-[#D97706]"></span> Payout Breakdown
                            </h3>
                            <div className="space-y-3 text-[12px]">
                                <Row label="Sale amount (buyer paid)" value={money(p.grossAmount, p.currency)} />
                                <div className="flex justify-between items-center py-1">
                                    <span className="text-slate-500">Commission ({p.commissionPercent}%)</span>
                                    <span className="font-medium text-red-600">-{money(p.commissionAmount, p.currency)}</span>
                                </div>
                                <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-sm font-bold text-[#0B1E3D]">
                                    <span>Net payout</span>
                                    <span className="text-green-600 text-base">{money(p.netAmount, p.currency)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Handover Details */}
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                            <h3 className="mb-4 text-sm font-bold text-[#0B1E3D] flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-[#D97706]"></span> Handover Details
                            </h3>
                            <div className="space-y-2.5 text-[12px]">
                                <Row label="Order status" value={formatLabel(order?.status)} />
                                <Row label="Paid on" value={when(order?.paidAt)} />
                                <Row label="Handover" value={formatLabel(order?.handover?.status)} />
                                {order?.handover?.status === 'confirmed' && (
                                    <>
                                        <Row label="Confirmed on" value={when(order.handover.confirmedAt)} />
                                        <Row label="Note" value={order.handover.note} />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                </div>

                {/* ------------------------ RIGHT ------------------------ */}
                <div className="space-y-6">

                    {/* Actions Box */}
                    {hasActions && (
                        <div className="rounded-2xl border border-amber-200/80 bg-linear-to-b from-amber-50/30 to-white p-6 shadow-sm space-y-3">
                            <h3 className="text-sm font-bold text-[#0B1E3D] flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-amber-500"></span> Actions Required
                            </h3>
                            <div className="space-y-2.5 pt-1">
                                {p.status === 'on_hold' && (
                                    <button onClick={onHandover} disabled={acting}
                                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 hover:bg-green-700 transition-colors px-4 py-2.5 text-sm font-semibold text-white shadow-sm disabled:opacity-50">
                                        <CheckCircle2 size={16} /> Confirm handover
                                    </button>
                                )}
                                {p.status === 'requested' && (
                                    <>
                                        <button onClick={onPaid} disabled={acting}
                                            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 hover:bg-green-700 transition-colors px-4 py-2.5 text-sm font-semibold text-white shadow-sm disabled:opacity-50">
                                            <CheckCircle2 size={16} /> Mark as paid
                                        </button>
                                        <button onClick={onReject} disabled={acting}
                                            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-700 transition-colors px-4 py-2.5 text-sm font-semibold text-white shadow-sm disabled:opacity-50">
                                            <XCircle size={16} /> Reject request
                                        </button>
                                    </>
                                )}
                                {canRefund && (
                                    <button onClick={onRefund} disabled={acting}
                                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 transition-colors px-4 py-2.5 text-sm font-semibold text-white shadow-sm disabled:opacity-50">
                                        <RotateCcw size={16} /> Cancel & refund buyer
                                    </button>
                                )}
                                <p className="text-[11px] text-slate-500 pt-1 leading-relaxed">
                                    Mark as paid sirf record karta hai. Bank transfer aapko apne bank se alag karna hai.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* History Timeline Box */}
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                        <h3 className="mb-5 text-sm font-bold text-[#0B1E3D] flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-[#D97706]"></span> History & Activity
                        </h3>
                        <div className="relative pl-4 space-y-6 before:absolute before:left-1.75 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                            {[...(p.history || [])].reverse().map((h, i) => (
                                <div key={i} className="relative flex items-start gap-3.5 group">
                                    <div className="absolute -left-4 mt-1.5 h-3 w-3 rounded-full border-2 border-white bg-[#D97706] shadow-sm" />
                                    <div className="min-w-0 space-y-0.5">
                                        <p className="text-[12px] font-semibold text-[#0B1E3D]">
                                            {formatLabel(h.status)} <span className="text-slate-400 font-normal">· {h.by}</span>
                                        </p>
                                        <p className="text-[11px] text-slate-400">{when(h.at)}</p>
                                        {h.note && <p className="text-[11px] text-slate-600 bg-slate-50 rounded-lg p-2 mt-1 border border-slate-100">{h.note}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default PayoutsDetail;
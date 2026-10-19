
import React from 'react';
import { ArrowLeft, Circle, CircleHelp, Download, Hourglass, Info, Landmark, MessageCircle, CheckCircle2, Wallet, Car, Clock, XCircle, } from 'lucide-react';
import { toast } from 'react-toastify';

import { formatDateTime, formatLabel, formatPrice, } from '../../../utils/formatters';
import { useGetMyPayoutById, useRequestPayout, } from '../../../hook/usePayout';

const STATUS_STYLES = {
    on_hold: 'bg-amber-50 text-amber-700 border-amber-200',
    available: 'bg-blue-50 text-blue-700 border-blue-200',
    requested: 'bg-purple-50 text-purple-700 border-purple-200',
    paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    canceled: 'bg-red-50 text-red-600 border-red-200',
};

const STATUS_ICONS = {
    on_hold: Hourglass,
    available: Wallet,
    requested: Clock,
    paid: CheckCircle2,
    canceled: XCircle,
};

const getDate = (date) => {
    if (!date) return '—';

    const parsed = new Date(date);

    return Number.isNaN(parsed.getTime())
        ? '—'
        : formatDateTime(parsed);
};

const maskAccount = (account) => {
    if (!account) return '—';
    return `•••• ${String(account).slice(-4)}`;
};

function PayoutDetails({ payoutId, setCurrentPage }) {

    const { data, isLoading, isError, } = useGetMyPayoutById(payoutId);
    const { mutate: requestPayout, isPending, variables: payingId, } = useRequestPayout();

    const payout = data?.payout;
    const vehicle = payout?.vehicleId;
    const order = payout?.orderId;
    const bank = payout?.bankSnapshot;

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="w-9 h-9 border-4 border-amber-100 border-t-amber-600 rounded-full animate-spin" />
                <p className="text-sm text-slate-500 mt-4">
                    Loading payout details...
                </p>
            </div>
        );
    }

    if (isError || !payout) {
        return (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
                <Wallet className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h2 className="text-lg font-bold text-[#0B1E3D]">Payout Not Found</h2>
                <p className="text-sm text-slate-500 mt-2">Unable to load this payout. Please try again.</p>
                <button
                    type="button"
                    onClick={() => setCurrentPage('payouts')}
                    className="mt-5 px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700">
                    Back to Payouts
                </button>
            </div>
        );
    }

    // handle payout request 
    const handleRequest = () => {
        if (
            !window.confirm(`Request payout of ${formatPrice(payout.netAmount)} to your registered bank account?`)
        ) {
            return;
        }

        requestPayout(payout._id, {
            onSuccess: () => {
                toast.success('Payout requested');
            },
            onError: (err) => {
                toast.error(
                    err.response?.data?.message || 'Could not request payout'
                );
            },
        });
    };

    const status = payout.status;
    const StatusIcon = STATUS_ICONS[status] || Clock;

    const vehicleName = vehicle
        ? `${vehicle.year ?? ''} ${formatLabel(vehicle.make)} ${formatLabel(vehicle.model)}`.trim()
        : 'Vehicle details unavailable';

    const vehicleImage = vehicle?.images?.[0]?.url;

    const history = [...(payout.history || [])].sort(
        (a, b) => new Date(a.at || 0) - new Date(b.at || 0)
    );

    return (
        <div className="pb-6 space-y-6">

            {/* Back link */}
            <button
                type="button"
                onClick={() => setCurrentPage('payouts')}
                className="flex items-center gap-1.5 text-xs md:text-sm text-gray-500 hover:text-[#0B1E3D]">
                <ArrowLeft className="w-4 h-4" />
                Back to Payouts
            </button>

            {/* Header */}
            <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3D]">Payout Details</h1>
                    <p className="text-xs md:text-sm text-gray-600 mt-1">View your payout information, payment breakdown and status history.</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {status === 'available' && (
                        <button
                            type="button"
                            onClick={handleRequest}
                            disabled={isPending}
                            className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-xs md:text-sm font-semibold text-white hover:bg-amber-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Wallet className="h-4 w-4" />
                            {isPending && payingId === payout._id
                                ? 'Requesting...'
                                : 'Request Payout'}
                        </button>
                    )}

                    <button
                        type="button"
                        disabled
                        title="Receipt export is not available yet"
                        className="flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-medium text-slate-400 bg-white border border-slate-200 rounded-lg cursor-not-allowed"
                    >
                        <Download className="h-4 w-4" />
                        Export Receipt
                    </button>
                </div>
            </div>

            {/* Main grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* -------------------- LEFT -------------------- */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Payout Summary */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5">

                        <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
                            <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                                <Landmark className="w-7 h-7 text-emerald-600" />
                            </div>

                            <div className="min-w-0">
                                <p className="text-xs font-medium text-gray-600 mb-1">
                                    Payout ID
                                </p>

                                <div className="flex flex-wrap items-center gap-3">
                                    <h2 className="text-lg md:text-xl font-bold text-[#0B1E3D] break-all">
                                        {payout.payoutId || '—'}
                                    </h2>

                                    <span
                                        className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-md border ${STATUS_STYLES[status] || 'bg-slate-50 text-slate-600 border-slate-200'
                                            }`}
                                    >
                                        {formatLabel(status)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-5">
                            <div>
                                <p className="text-xs font-medium text-gray-500 mb-2">
                                    Created At
                                </p>
                                <p className="text-sm font-semibold text-[#0B1E3D]">
                                    {getDate(payout.createdAt)}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium text-gray-500 mb-2">
                                    Listing ID
                                </p>
                                <p className="text-sm font-semibold text-[#0B1E3D] break-all">
                                    {payout.listingId || vehicle?.listingId || '—'}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium text-gray-500 mb-2">
                                    Payout Method
                                </p>
                                <div className="flex items-center gap-2">
                                    <Landmark className="w-4 h-4 text-slate-600" />
                                    <p className="text-sm font-semibold text-[#0B1E3D]">
                                        Bank Transfer
                                    </p>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-medium text-gray-500 mb-2">
                                    Payout Amount
                                </p>
                                <p className="text-xl font-bold text-[#0B1E3D]">
                                    {formatPrice(payout.netAmount)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Information */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

                        <div className="px-4 py-3 border-b border-gray-100">
                            <h3 className="text-sm font-semibold text-[#0B1E3D]">
                                Payment Information
                            </h3>
                        </div>

                        <div className="px-4 py-3">

                            {[
                                ['Payout ID', payout.payoutId],
                                ['Order ID', order?.orderId],
                                ['Listing ID', payout.listingId],
                                ['Created At', getDate(payout.createdAt)],
                                ['Requested At', getDate(payout.requestedAt)],
                                ['Paid At', getDate(payout.paidAt)],
                                ['Payout Method', 'Bank Transfer'],
                                ['Bank Name', bank?.bankName],
                                ['Account Holder Name', bank?.accountHolderName],
                                ['Account Number', maskAccount(bank?.accountNumber)],
                                ['IBAN', bank?.ibanNumber ? maskAccount(bank.ibanNumber) : null],
                                ['SWIFT Code', bank?.swiftCode],
                                ['Transfer Reference', payout.transferReference],
                            ].map(([label, value]) => (
                                <div
                                    key={label}
                                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 py-2.5 border-b border-gray-100 last:border-b-0"
                                >
                                    <span className="text-[13px] text-gray-600">
                                        {label}
                                    </span>

                                    <span className="text-[13px] font-medium text-gray-800 sm:text-right break-all">
                                        {value || '—'}
                                    </span>
                                </div>
                            ))}

                            <div className="flex items-center justify-between gap-3 py-2.5">
                                <span className="text-[13px] text-gray-600">
                                    Status
                                </span>

                                <span
                                    className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-md border ${STATUS_STYLES[status] || 'bg-slate-50 text-slate-600 border-slate-200'
                                        }`}
                                >
                                    {formatLabel(status)}
                                </span>
                            </div>

                        </div>
                    </div>

                    {/* Vehicle / Sale Information */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

                        <div className="px-5 py-4 border-b border-gray-100">
                            <h3 className="text-base font-semibold text-[#0B1E3D]">
                                Sale Included in This Payout
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">
                                Vehicle and sale amount associated with this payout.
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-138">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-gray-100">
                                        {['Vehicle', 'Sale Amount', 'Commission', 'Payout Amount'].map((heading) => (
                                            <th
                                                key={heading}
                                                className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500"
                                            >
                                                {heading}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr className="hover:bg-slate-50/50">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                {vehicleImage ? (
                                                    <img
                                                        src={vehicleImage}
                                                        alt={vehicleName}
                                                        className="w-14 h-10 object-cover rounded-md shrink-0"
                                                    />
                                                ) : (
                                                    <div className="w-14 h-10 bg-slate-100 rounded-md flex items-center justify-center shrink-0">
                                                        <Car className="w-5 h-5 text-slate-400" />
                                                    </div>
                                                )}

                                                <div>
                                                    <p className="text-xs font-semibold text-[#0B1E3D]">
                                                        {vehicleName}
                                                    </p>
                                                    <p className="text-[10px] text-gray-400 mt-0.5">
                                                        {payout.listingId || '—'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-4 py-3 text-xs font-semibold text-[#0B1E3D]">
                                            {formatPrice(payout.grossAmount)}
                                        </td>

                                        <td className="px-4 py-3">
                                            <p className="text-xs font-semibold text-slate-700">
                                                - {formatPrice(payout.commissionAmount)}
                                            </p>
                                            <p className="text-[10px] text-gray-400 mt-1">
                                                {payout.commissionPercent ?? 0}% commission
                                            </p>
                                        </td>

                                        <td className="px-4 py-3 text-xs font-bold text-emerald-600">
                                            {formatPrice(payout.netAmount)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="px-5 py-3 border-t border-gray-100 flex flex-wrap justify-between gap-2">
                            <span className="text-xs text-gray-500">
                                Order: {order?.orderId || '—'}
                            </span>
                            <span className="text-xs font-semibold text-[#0B1E3D]">
                                Total: {formatPrice(payout.netAmount)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* -------------------- RIGHT -------------------- */}
                <div className="space-y-5">

                    {/* Payout Status History */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5">

                        <h3 className="text-md font-semibold text-[#0B1E3D] mb-5">
                            Payout Status History
                        </h3>

                        {history.length > 0 ? (
                            <div className="relative">
                                <div className="absolute left-3 top-3 bottom-3 w-px bg-gray-200" />

                                <div className="space-y-5">
                                    {history.map((item, index) => {
                                        const isLatest = index === history.length - 1;
                                        const itemStatus = item.status;
                                        const HistoryIcon = STATUS_ICONS[itemStatus] || Circle;

                                        return (
                                            <div
                                                key={`${item.status}-${item.at}-${index}`}
                                                className="relative flex gap-3"
                                            >
                                                <div
                                                    className={`w-7 h-7 rounded-full border flex items-center justify-center z-10 shrink-0 ${isLatest
                                                        ? 'bg-amber-50 border-amber-200'
                                                        : 'bg-slate-50 border-slate-200'
                                                        }`}
                                                >
                                                    <HistoryIcon
                                                        className={`w-3.5 h-3.5 ${isLatest ? 'text-amber-600' : 'text-slate-400'
                                                            }`}
                                                    />
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="text-[13px] font-semibold text-[#0B1E3D]">
                                                        {formatLabel(itemStatus)}
                                                    </p>

                                                    <p className="text-[11px] text-gray-500 mt-0.5">
                                                        {getDate(item.at)}
                                                    </p>

                                                    {item.note && (
                                                        <p className="text-[11px] text-gray-500 mt-1">
                                                            {item.note}
                                                        </p>
                                                    )}

                                                    {item.by && (
                                                        <p className="text-[10px] text-gray-400 mt-1">
                                                            Updated by: {formatLabel(item.by)}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className="py-6 text-center">
                                <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                <p className="text-sm font-medium text-slate-600">
                                    No status history yet
                                </p>
                                <p className="text-xs text-slate-400 mt-1">
                                    Payout status updates will appear here.
                                </p>
                            </div>
                        )}

                        <div className="flex items-start gap-2 mt-5 pt-3 border-t border-gray-100">
                            <Info className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                            <p className="text-[11px] text-gray-500">
                                Payout status and timestamps reflect the information recorded by BidDrive.
                            </p>
                        </div>
                    </div>

                    {/* Amount Breakdown */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5">

                        <h3 className="text-md font-semibold text-[#0B1E3D] mb-4">
                            Amount Breakdown
                        </h3>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-xs text-gray-500">
                                    Sale Amount
                                </span>
                                <span className="text-sm font-semibold text-[#0B1E3D]">
                                    {formatPrice(payout.grossAmount)}
                                </span>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <span className="text-xs text-gray-500">
                                    Platform Commission ({payout.commissionPercent ?? 0}%)
                                </span>
                                <span className="text-sm font-semibold text-red-500">
                                    - {formatPrice(payout.commissionAmount)}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-gray-200">
                            <span className="text-sm font-semibold text-[#0B1E3D]">
                                Net Payout
                            </span>
                            <span className="text-sm font-bold text-emerald-600">
                                {formatPrice(payout.netAmount)}
                            </span>
                        </div>
                    </div>

                    {/* Need Help */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5">

                        <h3 className="text-md font-semibold text-[#0B1E3D] mb-4">
                            Need Help?
                        </h3>

                        <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                                <CircleHelp className="w-4 h-4 text-blue-500" />
                            </div>

                            <p className="text-[12px] leading-5 text-gray-500">
                                If you have questions about this payout, contact the BidDrive support team.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setCurrentPage('support')}
                            className="mt-4 flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-md text-[12px] font-medium text-[#0B1E3D] hover:bg-gray-50"
                        >
                            <MessageCircle className="w-4 h-4 text-[#D97706]" />
                            Contact Support
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default PayoutDetails;
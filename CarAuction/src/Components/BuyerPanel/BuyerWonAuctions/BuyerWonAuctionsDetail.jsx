
import React from 'react';
import { ArrowLeft, Download, Printer, FileText, BadgeCheck, CheckCircle, ArrowRight, Lock, ShieldCheck } from "lucide-react";
import BuyerAuctionSellerCard from '../BuyerAuctionSellerCard';
import BuyerContactSupport from '../BuyerSharedComponents/BuyerContactSupport';
import VehicleInfoTab from '../../VehicleInfoTab';
import AuctionDetailsTab from '../../AuctionDetailsTab';
import DocumentsTab from '../../DocumentsTab';
import DetailTabs from '../../DetailTabs';
import ConditionTab from '../../ConditionTab';
import { UseCountDown } from '../BuyerSharedComponents/UseCountDown';

import BuyerWonAuctionDetailStatusBanner from './BuyerWonAuctionsStatusBanner';

import { useGetMyOrderDetail } from '../../../hook/usePayment';
import { useCheckout } from '../../../hook/useBuy';
import { formatDateTime, formatLabel, formatPrice } from '../../../utils/formatters';
import VehicleGallery from '../../VehicleGallery';
import ActivityTimelineTab from '../../ActivityTimelineTab';

const statusConfig = {
    "payment-completed": {
        title: "Payment Completed",
        badge: { label: "Payment Completed", classes: "bg-emerald-50 text-emerald-600" },
        subtitle: "Your payment has been successfully completed. Thank you!",
        actions: [
            { label: "Download Invoice", icon: <Download size={15} />, onClick: () => { } },
            { label: "Print", icon: <Printer size={15} />, onClick: () => { } },
        ],
    },
    "payment-pending": {
        title: "Payment Pending",
        badge: { label: "Payment Pending", classes: "bg-amber-50 text-[#D97706]" },
        subtitle: "Complete your payment to secure your vehicle.",
        actions: [],
    },
    "handed-over": {
        title: "Vehicle Handed Over",
        badge: { label: "Handed Over", classes: "bg-emerald-50 text-emerald-600" },
        subtitle: "The vehicle handover has been confirmed.",
        actions: [],
    },
    "expired": {
        title: "Payment Expired",
        badge: { label: "Expired", classes: "bg-slate-100 text-slate-600" },
        subtitle: "The payment window ended and this order is closed.",
        actions: [],
    },
};

function BuyerWonAuctionsDetail({ vehicleId: orderId, setCurrentPage }) {

    const { data, isLoading, isError } = useGetMyOrderDetail(orderId);
    const { mutate: startCheckout, isPending: isPaying } = useCheckout();

    const order = data?.order;
    const paymentDeadline = order?.paymentDueAt ?? null;

    const { days, hours, mins, secs } = UseCountDown(paymentDeadline);

    const isPaymentExpired = paymentDeadline
        ? new Date(paymentDeadline).getTime() <= Date.now()
        : false;

    if (isLoading) return <p className="p-10 text-center">Loading details....</p>;
    if (isError || !order) return <p className="p-10 text-center text-red-500">Failed to load detail</p>;

    const vehicle = order.vehicleId;

    const wonStatus =
        order.status === 'pending_payment' ? 'payment-pending'
            : order.status === 'paid' ? (order.handover?.status === 'confirmed' ? 'handed-over' : 'payment-completed')
                : 'expired';

    // handle pay            
    const handlePay = () => startCheckout(order._id, {
        onSuccess: (r) => { window.location.href = r.url; },
        onError: (e) => toast.error(e.response?.data?.message || 'Could not start payment'),
    });

    const isPending = wonStatus === 'payment-pending';
    const isCompleted = wonStatus === 'payment-completed';
    const isHandedOver = wonStatus === 'handed-over';
    const isExpired = wonStatus === 'expired';
    const isBuyNow = order.source === 'buy_now';
    const config = statusConfig[wonStatus];

    const pendingTabs = [
        { key: "vehicle-details", label: "Vehicle Details", content: <VehicleInfoTab vehicle={vehicle} /> },
        { key: "invoices", label: "Invoices", content: <div /> },
        { key: "documents", label: "Documents", content: <DocumentsTab vehicle={vehicle} /> },
        { key: "activity-timeline", label: "Activity Timeline", content: <ActivityTimelineTab order={order} /> },
    ];

    const completedTabs = [
        { key: "specifications", label: "Vehicle Details", content: <VehicleInfoTab vehicle={vehicle} /> },
        { key: "auction-info", label: "Auction Info", content: <AuctionDetailsTab vehicle={vehicle} /> },
        { key: "invoices", label: "Invoices", content: <div /> },
        { key: "documents", label: "Documents", content: <DocumentsTab vehicle={vehicle} /> },
        { key: "activity-timeline", label: "Activity Timeline", content: <ActivityTimelineTab order={order} /> },
    ];

    const tabMap = {
        "payment-pending": {
            tabs: pendingTabs,
            defaultTab: "vehicle-details",
        },
        "payment-completed": {
            tabs: completedTabs,
            defaultTab: "specifications",
        },
        "handed-over": {
            tabs: completedTabs,
            defaultTab: "specifications",
        },
    };

    const configTab = tabMap[wonStatus];

    if (!configTab) return null;

    return (
        <div>
            {/* header */}
            <div className="mb-6">
                <button
                    onClick={() => setCurrentPage("won-auctions")}
                    className="flex items-center gap-1.5 text-sm text-[#0B1E3D] font-medium hover:opacity-70 transition-opacity mb-3">
                    <ArrowLeft size={15} />
                    Back to Won Auctions
                </button>

                {/* Title row */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-2xl font-bold text-[#0B1E3D]">{config.title}</h1>
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${config.badge.classes}`}>
                                {config.badge.label}
                            </span>
                        </div>
                        <p className="text-sm text-slate-500">{config.subtitle}</p>
                    </div>

                    {/* Action buttons */}
                    {config.actions.length > 0 && (
                        <div className="flex items-center gap-3">
                            {config.actions.map((action, i) => (
                                <button
                                    key={i}
                                    onClick={action.onClick}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#0B1E3D] border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    {action.icon}
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <hr className="mt-4 border-slate-200" />
            </div>

            {/* ----------------------- TOP SECTION ----------------------- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* left */}
                <div className="lg:col-span-6 flex flex-col gap-6">
                    <VehicleGallery
                        images={vehicle.images?.map(img => img.url) || []}
                        video={vehicle.video || null}
                    />
                </div>

                {/* right */}
                <div className="lg:col-span-6">

                    {/* panel */}
                    <div className="border border-slate-200 rounded-xl p-6">

                        {/* Title */}
                        <div className="mb-1">
                            <h2 className="text-xl font-bold text-[#0B1E3D]">
                                {vehicle.year} {formatLabel(vehicle.make)} {formatLabel(vehicle.model)}
                            </h2>
                        </div>

                        {/* Lot + specs pills */}
                        <p className="text-sm text-slate-500 mb-3">{order.listingId} · {order.orderId}</p>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mb-5">
                            <span>{vehicle.mileage?.toLocaleString()} KM</span>
                            <span>•</span>
                            <span>{formatLabel(vehicle.transmission)}</span>
                            <span>•</span>
                            <span>{formatLabel(vehicle.fuelType)}</span>
                            <span>•</span>
                            <span>{formatLabel(vehicle.bodyType)}</span>
                        </div>

                        {/* Info grid */}
                        <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                            <div className="flex justify-between items-center">
                                <p className="text-slate-400 text-xs mb-0.5">{isBuyNow ? 'Purchase Price' : 'Winning Bid'}</p>
                                <p className="font-bold text-[#0B1E3D] text-base">{formatPrice(order.amount)}</p>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-slate-400 text-xs mb-0.5">Seller</p>
                                <div className="flex items-center gap-1 font-semibold text-[#0B1E3D]">
                                    {order.sellerId?.fullName || "Al Yousuf Motors"}
                                    <BadgeCheck size={14} className="text-blue-600" />
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <p className="text-slate-400 text-xs mb-0.5">Location</p>
                                <p className="font-semibold text-[#0B1E3D]">{formatLabel(vehicle.emirate)}</p>
                            </div>

                            <div className="flex justify-between items-center">
                                <p className="text-slate-400 text-xs mb-0.5">Order Date</p>
                                <p className="font-semibold text-[#0B1E3D]">{formatDateTime(order.createdAt)}</p>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-slate-400 text-xs mb-0.5">Auction Type</p>
                                <p className="font-semibold text-[#0B1E3D]">{isBuyNow ? 'Buy Now' : 'Auction'}</p>
                            </div>

                            {/* Payment Completed */}
                            {(isCompleted || isHandedOver) && (
                                <>
                                    <div className="flex justify-between items-center">
                                        <p className="text-slate-400 text-xs mb-0.5">Payment Status</p>
                                        <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-600 rounded-full">
                                            Payment Completed
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className="text-slate-400 text-xs mb-0.5">Paid on</p>
                                        <p className="font-semibold text-[#0B1E3D]">{formatDateTime(order.paidAt)}</p>
                                    </div>
                                </>
                            )}

                            {isPending && (
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">Pay before</span>
                                    <span className="text-xs font-semibold text-[#D97706]">
                                        {formatDateTime(order.paymentDueAt)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* status banner */}
                    <div className="mt-3">
                        <BuyerWonAuctionDetailStatusBanner order={order} wonStatus={wonStatus} onPay={handlePay} paying={isPaying} />
                    </div>
                </div>
            </div>

            {/* ----------------------- BOTTOM SECTION ----------------------- */}
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* left */}
                <div className="lg:col-span-8 flex flex-col gap-6">

                    {/* Vehicle Detail Tabs */}
                    <div>
                        <DetailTabs
                            key={wonStatus}
                            tabs={configTab.tabs}
                            defaultTab={configTab.defaultTab}
                        />

                        {(isCompleted || isHandedOver) && (
                            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm my-6">
                                <ConditionTab vehicle={vehicle} />
                            </div>
                        )}
                    </div>
                </div>

                {/* right */}
                <div className="lg:col-span-4">
                    <div className="w-full">

                        {/* ── PENDING: Auction Details ── */}
                        {isPending && (
                            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm mb-6">
                                <h2 className="text-base font-bold text-[#0B1E3D] mb-4">Auction Details</h2>

                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Listing ID</span>
                                        <span className="font-medium text-[#0B1E3D]">{vehicle.listingId}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Year / Model</span>
                                        <span className="font-medium text-[#0B1E3D]">{vehicle.year} | {formatLabel(vehicle.model)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Auction Date</span>
                                        <span className="font-medium text-[#0B1E3D] text-right max-w-[55%]">{formatDateTime(vehicle.auctionStartDateTime)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500">Seller</span>
                                        <span className="font-medium text-[#0B1E3D] flex items-center gap-1">
                                            {order?.sellerId?.fullName || order?.sellerId?.businessName}
                                            <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Location</span>
                                        <span className="font-medium text-[#0B1E3D]">{formatLabel(vehicle.emirate)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setCurrentPage('browse-auctions')}
                                    className="mt-4 text-xs font-medium text-[#D97706] hover:text-amber-700 flex items-center gap-1">
                                    View Auction Details <ArrowRight className="w-3 h-3" />
                                </button>
                            </div>
                        )}

                        {/* ── PENDING: Next Step + Countdown ── */}
                        {isPending && (
                            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm mb-6">
                                <h2 className="text-base font-bold text-[#0B1E3D] mb-3">
                                    Next Step
                                </h2>

                                <p className="text-xs text-slate-500">Complete payment by</p>

                                <p className="text-sm font-semibold text-[#0B1E3D] mt-1">
                                    {paymentDeadline
                                        ? new Date(paymentDeadline).toLocaleString('en-GB', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: true,
                                            timeZone: 'Asia/Dubai',
                                        })
                                        : 'Deadline unavailable'}
                                </p>

                                <p className="text-xs text-slate-500 mt-4 mb-1">
                                    Time Remaining
                                </p>

                                <p
                                    className={`text-lg font-bold ${isPaymentExpired ? 'text-red-600' : 'text-[#D97706]'
                                        }`}
                                >
                                    {!paymentDeadline
                                        ? 'Timer unavailable'
                                        : isPaymentExpired
                                            ? 'Payment deadline expired'
                                            : `${days > 0 ? `${days}d ` : ''}${hours}h ${mins}m ${secs}s`}
                                </p>

                                <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                                    {isPaymentExpired
                                        ? 'Your payment deadline has passed. Please check your order status.'
                                        : 'Complete your payment within 48 hours. After the deadline, your order may expire according to the auction payment policy.'}
                                </p>
                            </div>
                        )}

                        {isPending && (
                            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm mb-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <ShieldCheck className="text-blue-500" />
                                    <h2 className="font-bold text-[#0B1E3D]">Secure Payment</h2>
                                </div>
                                <p className="text-sm text-slate-500 mb-4">Your payment information is secure with us.</p>
                                <div className="space-y-2 text-sm text-slate-600">
                                    <p className="flex items-center gap-2"><Lock size={14} /> Encrypted & Secure Transactions</p>
                                    <p className="flex items-center gap-2"><ShieldCheck size={14} /> 100% Safe and Reliable</p>
                                </div>
                            </div>
                        )}

                        {/* ── COMPLETED: Payment Summary ── */}
                        {isCompleted && (
                            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm mb-6">
                                <div className="flex items-center justify-between mb-5">
                                    <h2 className="text-base font-bold text-[#0B1E3D]">
                                        Payment Summary
                                    </h2>

                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                        <CheckCircle className="w-3.5 h-3.5" />
                                        Paid
                                    </span>
                                </div>

                                {/* Total Paid */}
                                <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 mb-5">
                                    <p className="text-xs text-slate-500 mb-1">Total Amount Paid</p>

                                    <p className="text-2xl font-bold text-[#0B1E3D]">
                                        {formatPrice(order?.amount ?? 0)}
                                    </p>

                                    <p className="text-xs text-slate-400 mt-1">
                                        Order ID: {order?.orderId || order?._id || 'N/A'}
                                    </p>
                                </div>

                                {/* Transaction Details */}
                                <h3 className="text-sm font-semibold text-[#0B1E3D] mb-3">
                                    Transaction Details
                                </h3>

                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between gap-4">
                                        <span className="text-slate-500">Vehicle</span>
                                        <span className="font-medium text-[#0B1E3D] text-right">
                                            {[vehicle?.year, vehicle?.make, vehicle?.model]
                                                .filter(Boolean)
                                                .join(' ') || 'N/A'}
                                        </span>
                                    </div>

                                    <div className="flex justify-between gap-4">
                                        <span className="text-slate-500">Lot Number</span>
                                        <span className="font-medium text-[#0B1E3D]">
                                            {vehicle?.listingId || order?.listingId || 'N/A'}
                                        </span>
                                    </div>

                                    <div className="flex justify-between gap-4">
                                        <span className="text-slate-500">Payment Type</span>
                                        <span className="font-medium text-[#0B1E3D]">
                                            {order?.source === 'buy_now' ? 'Buy Now' : 'Auction Win'}
                                        </span>
                                    </div>

                                    <div className="flex justify-between gap-4">
                                        <span className="text-slate-500">Payment Status</span>
                                        <span className="font-medium text-emerald-700">Completed</span>
                                    </div>

                                    <div className="flex justify-between gap-4">
                                        <span className="text-slate-500">Currency</span>
                                        <span className="font-medium text-[#0B1E3D]">
                                            {order?.currency || 'AED'}
                                        </span>
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 mt-5 pt-4">
                                    <button
                                        type="button"
                                        disabled
                                        title="Invoice feature is not connected yet"
                                        className="w-full py-2.5 border border-slate-200 text-slate-400 rounded-lg text-sm font-medium cursor-not-allowed"
                                    >
                                        <span className="inline-flex items-center justify-center gap-2">
                                            <FileText className="w-4 h-4" />
                                            Invoice Unavailable
                                        </span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ── COMPLETED: Next Step ── */}
                        {isCompleted && (
                            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm mb-6">
                                <h2 className="text-base font-bold text-[#0B1E3D] mb-3">Next Step</h2>
                                <div className="flex items-start gap-3">
                                    <div className="p-1.5 bg-emerald-50 rounded-full shrink-0">
                                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-[#0B1E3D]">Vehicle Ready for Pickup</p>
                                        <p className="text-xs text-slate-500 mt-0.5">The vehicle is ready for pickup.</p>
                                        <button className="mt-2 text-xs text-white font-medium bg-[#0B1E3D] border border-[#0B1E3D] rounded-md px-3 py-1.5 hover:scale-95 active:scale-95 transition-all duration-300">
                                            View Pickup Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── HANDED OVER: Handover Summary ── */}
                        {isHandedOver && (
                            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm mb-6">
                                {/* Header */}
                                <div className="flex items-center justify-between gap-3 mb-5">
                                    <h2 className="text-base font-bold text-[#0B1E3D]">
                                        Vehicle Handover
                                    </h2>

                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                        <CheckCircle className="w-3.5 h-3.5" />
                                        Completed
                                    </span>
                                </div>

                                {/* Confirmation Banner */}
                                <div className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4 mb-5">
                                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />

                                    <div>
                                        <p className="text-sm font-semibold text-[#0B1E3D]">
                                            Vehicle Handover Confirmed
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                            The handover has been confirmed by the admin. Your
                                            purchase process is complete.
                                        </p>
                                    </div>
                                </div>

                                {/* Vehicle Details */}
                                <h3 className="text-sm font-semibold text-[#0B1E3D] mb-3">
                                    Vehicle Details
                                </h3>

                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between gap-4">
                                        <span className="text-slate-500">Vehicle</span>
                                        <span className="font-medium text-[#0B1E3D] text-right">
                                            {[vehicle?.year, vehicle?.make, vehicle?.model]
                                                .filter(Boolean)
                                                .join(' ') || 'N/A'}
                                        </span>
                                    </div>

                                    <div className="flex justify-between gap-4">
                                        <span className="text-slate-500">Lot Number</span>
                                        <span className="font-medium text-[#0B1E3D]">
                                            {vehicle?.listingId || order?.listingId || 'N/A'}
                                        </span>
                                    </div>

                                    <div className="flex justify-between gap-4">
                                        <span className="text-slate-500">Order ID</span>
                                        <span className="font-medium text-[#0B1E3D] text-right break-all">
                                            {order?.orderId || 'N/A'}
                                        </span>
                                    </div>

                                    <div className="flex justify-between gap-4">
                                        <span className="text-slate-500">Payment Status</span>
                                        <span className="font-medium text-emerald-700">
                                            Paid
                                        </span>
                                    </div>

                                    <div className="flex justify-between gap-4">
                                        <span className="text-slate-500">Amount Paid</span>
                                        <span className="font-bold text-[#0B1E3D]">
                                            {formatPrice(order?.amount ?? 0)}
                                        </span>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="border-t border-slate-100 mt-5 pt-4">
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        Keep your order details for future reference.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* ── EXPIRED: Order Summary ── */}
                        {isExpired && (
                            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm mb-6">
                                {/* Header */}
                                <div className="flex items-center justify-between gap-3 mb-5">
                                    <h2 className="text-base font-bold text-[#0B1E3D]">
                                        Order Summary
                                    </h2>

                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
                                        <icon name="clock-alert" size="14px" />
                                        Expired
                                    </span>
                                </div>

                                {/* Expired Notice */}
                                <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50/60 p-4 mb-5">
                                    <icon
                                        name="alert-circle"
                                        size="20px"
                                        color="#DC2626"
                                    />

                                    <div>
                                        <p className="text-sm font-semibold text-[#0B1E3D]">
                                            Payment Window Expired
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                            The payment deadline for this order has passed.
                                            Please contact support if you need assistance.
                                        </p>
                                    </div>
                                </div>

                                {/* Vehicle Details */}
                                <h3 className="text-sm font-semibold text-[#0B1E3D] mb-3">
                                    Vehicle Details
                                </h3>

                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between gap-4">
                                        <span className="text-slate-500">Vehicle</span>
                                        <span className="font-medium text-[#0B1E3D] text-right">
                                            {[vehicle?.year, vehicle?.make, vehicle?.model]
                                                .filter(Boolean)
                                                .join(' ') || 'N/A'}
                                        </span>
                                    </div>

                                    <div className="flex justify-between gap-4">
                                        <span className="text-slate-500">Lot Number</span>
                                        <span className="font-medium text-[#0B1E3D]">
                                            {vehicle?.listingId || order?.listingId || 'N/A'}
                                        </span>
                                    </div>

                                    <div className="flex justify-between gap-4">
                                        <span className="text-slate-500">Order ID</span>
                                        <span className="font-medium text-[#0B1E3D] text-right break-all">
                                            {order?.orderId || 'N/A'}
                                        </span>
                                    </div>

                                    <div className="flex justify-between gap-4">
                                        <span className="text-slate-500">Order Amount</span>
                                        <span className="font-bold text-[#0B1E3D]">
                                            {formatPrice(order?.amount ?? 0)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between gap-4">
                                        <span className="text-slate-500">Payment Status</span>
                                        <span className="font-medium text-red-600">
                                            {order?.status === 'expired'
                                                ? 'Expired'
                                                : 'Payment Not Completed'}
                                        </span>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="border-t border-slate-100 mt-5 pt-4">
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        If you believe this order expired incorrectly, please
                                        contact the BidDrive support team.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* ── COMPLETED + PICKUP: Seller Info ── */}
                        {(isCompleted || isHandedOver) && (
                            <div className="mb-6">
                                <BuyerAuctionSellerCard vehicle={vehicle} />
                            </div>
                        )}

                        {/* ── Need Help ── */}
                        {(isCompleted || isHandedOver) && (
                            <BuyerContactSupport />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BuyerWonAuctionsDetail;
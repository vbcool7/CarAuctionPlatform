
import React from 'react';
import { ArrowLeft, File, FileText, Calendar, Truck, CheckCircle, Clock } from 'lucide-react';
import { TbRefresh } from "react-icons/tb";
import { vehicles } from '../../Data';

import BuyerAuctionSellerCard from '../BuyerAuctionSellerCard';
import BuyerMyOffersDetailVehicleInfo from '../BuyerMyOffers/BuyerMyOffersDetailVehicleInfo';
import VehicleGallery from '../../VehicleGallery';

// Helper 
function Step({ icon, title, desc }) {
    return (
        <div className="flex gap-4">
            <div className="text-blue-600 mt-1">{icon}</div>
            <div>
                <h3 className="font-bold text-[#0B1E3D] text-sm">{title}</h3>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}

function BuyerPaymentsDetail({ vehicleId, setCurrentPage, setSelectedSellerId, setPreviousPage }) {

    const vehicle = vehicles.find(v => v.id === vehicleId);

    const isPending = vehicle.paymentStatus === 'payment-pending';
    const isCompleted = vehicle.paymentStatus === 'payment-completed';
    const isRefunded = vehicle.paymentStatus === 'refunded';

    const title = isCompleted ? "Payment Completed Details"
        : isPending ? "Payment Pending Details"
            : "Refunds Details";

    const subtitle = isCompleted ? "Your payment has been received and your order is confirmed."
        : isPending ? "Complete the payment to confirm your purchase and processed with vehicle pickup."
            : "View and track all your refunded transactions.";

    const badgeStyle = isCompleted ? "bg-emerald-100 text-emerald-700"
        : isPending ? "bg-amber-100 text-amber-700"
            : "bg-purple-100 text-purple-600";

    const badgeLabel = isCompleted ? "Completed"
        : isPending ? "Pending"
            : "Refunded";

    // timeline
    const timelineSteps = [
        {
            icon: 'ti-trophy',
            title: 'Auction Won',
            desc: 'You won the auction for this vehicle.',
            date: vehicle.auctionWonDate,
            status: 'done',
        },
        {
            icon: 'ti-file-invoice',
            title: 'Invoice Generated',
            desc: 'Invoice has been generated for your purchase.',
            date: vehicle.invoiceGeneratedDate,
            status: 'done',
        },
        {
            icon: 'ti-clock',
            title: 'Payment Pending',
            desc: isPending
                ? 'Your payment is pending. Please complete the payment before the due date.'
                : 'Your payment is pending.',
            date: isPending ? null : vehicle.paymentPendingDate,
            status: isPending ? 'active' : 'done',
            badge: isPending ? vehicle.paymentDueCountdown : null,
        },
        {
            icon: 'ti-circle-check',
            title: 'Payment Completed',
            desc: 'Once payment is completed, your order will be confirmed.',
            date: isCompleted ? vehicle.paymentCompletedDate : null,
            status: isCompleted ? 'done' : 'pending',
        },
    ];

    // refund
    const refundSteps = [
        {
            icon: 'ti-file-invoice',
            title: 'Refund Requested',
            date: vehicle.refundRequestedDate,
            desc: 'Refund requested by system.',
            status: 'done',
        },
        {
            icon: 'ti-refresh',
            title: 'Processing',
            date: vehicle.processingDate,
            desc: 'Refund is being processed.',
            status: 'done',
        },
        {
            icon: 'ti-building-bank',
            title: 'Refund Processed',
            date: vehicle.refundProcessedDate,
            desc: 'Refund has been processed.',
            status: 'done',
        },
        {
            icon: 'ti-circle-check',
            title: 'Refund Completed',
            date: vehicle.refundCompletedDate,
            desc: 'Amount refunded to your original payment method.',
            status: 'done',
        },
    ];

    return (
        <div>
            {/* header */}
            <div className='mb-6'>
                <button
                    onClick={() => setCurrentPage("payments")}
                    className="flex items-center gap-1.5 text-sm text-[#0B1E3D] font-medium hover:opacity-70 transition-opacity mb-3">
                    <ArrowLeft size={15} />
                    Back to Payments
                </button>

                <div className="flex items-start justify-between gap-4">

                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-[#0B1E3D]">{title}</h1>
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badgeStyle}`}>
                                {badgeLabel}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500">{subtitle}</p>
                    </div>

                    {isCompleted && (
                        <button className="flex items-center gap-2 text-sm font-medium text-[#0B1E3D] border border-[#0B1E3D] rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors">
                            <FileText className="w-4 h-4" />
                            View Invoice
                        </button>
                    )}

                    {isPending && (
                        <button className="flex items-center gap-2 text-sm font-medium text-[#0B1E3D] border border-[#0B1E3D] rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors">
                            <File className="w-4 h-4" />
                            Pay Now
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* ----------------------------- LEFT ----------------------------- */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <VehicleGallery
                        images={vehicle.images}
                        video={vehicle.video}
                    />
                </div>

                {/* ----------------------------- RIGHT ----------------------------- */}
                <div className="lg:col-span-5">
                    <BuyerMyOffersDetailVehicleInfo vehicle={vehicle} />
                </div>

                <div className="lg:col-span-3">
                    <div className="border border-slate-100 rounded-2xl p-4 shadow-sm">

                        {/* Heading */}
                        <h2 className="text-lg font-bold text-[#0B1E3D] mb-4">
                            {isCompleted || isPending ? "Payment Summary" : "Refund Summary"}
                        </h2>

                        <div className="space-y-3">

                            {/* Section: Bid & Fees (Only for Payment) */}
                            {(isCompleted || isPending) && (
                                <>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500">Winning Bid</span>
                                        <span className="font-semibold text-[#0B1E3D]">AED {vehicle.winningBid?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500">Buyer Fee (5%)</span>
                                        <span className="font-semibold text-[#0B1E3D]">AED {vehicle.buyerFee?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500">VAT (5%)</span>
                                        <span className="font-semibold text-[#0B1E3D]">AED {vehicle.vat?.toLocaleString()}</span>
                                    </div>
                                    <div className="border-t border-slate-100 pt- flex justify-between items-center text-sm">
                                        <span className="text-slate-600 font-bold">Total Amount</span>
                                        <span className="font-bold text-blue-600">AED {vehicle.totalAmount?.toLocaleString()}</span>
                                    </div>
                                </>
                            )}

                            {/* Section: Refund Details */}
                            {isRefunded && (
                                <>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500">Refund Amount</span>
                                        <span className="font-semibold text-purple-600">AED {vehicle.refundAmount?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500">Refund Fee (0%)</span>
                                        <span className="font-semibold text-purple-600">AED 0</span>
                                    </div>
                                    <div className="flex justify-between items-start text-sm">
                                        <span className="text-slate-500">Refund Date</span>

                                        <div className="flex flex-col items-end text-[#0B1E3D]">
                                            <span className="font-semibold text-sm">
                                                {vehicle.refundDate || "12 May, 2026"}
                                            </span>
                                            <span className="text-xs text-slate-500">
                                                {vehicle.refundTime || "11:00 AM GST"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-slate-200 pt flex justify-between items-center text-sm">
                                        <span className="text-slate-600 font-bold">Total Refund</span>
                                        <span className="font-bold text-purple-600">AED {vehicle.refundAmount?.toLocaleString() || "125,00"}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500">Refund Method</span>
                                        <span className="font-semibold text-[#0B1E3D]">Original Payment Method</span>
                                    </div>
                                </>
                            )}

                            {/* Section: Status Specific Amount (Paid/Pending) */}
                            {isCompleted && (
                                <div className="border-t border-slate-100 flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Amount Paid</span>
                                    <span className="font-bold text-emerald-600">AED {vehicle.totalAmount?.toLocaleString()}</span>
                                </div>
                            )}

                            {isCompleted && (
                                <div className="border-t border-slate-100 flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Payment Date</span>
                                    <div className="flex flex-col items-end text-[#0B1E3D]">
                                        <span className="font-semibold text-sm">
                                            {vehicle.refundDate || "12 May, 2026"}
                                        </span>
                                        <span className="text-xs text-slate-500">
                                            {vehicle.refundTime || "11:00 AM GST"}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {isCompleted && (
                                <div className="border-t border-slate-100 flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Payment Method</span>
                                    <span className="font-bold text-[#0B1E3D] text-xs">VISA</span>
                                </div>
                            )}

                            {isPending && (
                                <div className="border-t border-slate-100 flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Amount Paid</span>
                                    <span className="font-bold text-[#0B1E3D]">AED {vehicle.totalAmount?.toLocaleString() || "0"}</span>
                                </div>
                            )}

                            {isPending && (
                                <div className="border-t border-slate-100 flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Amount Pending</span>
                                    <span className="font-bold text-orange-600">AED {vehicle.totalAmount?.toLocaleString() || "2000"}</span>
                                </div>
                            )}
                        </div>

                        {/* Footer Badge for Success/Refund Status */}
                        {/* {(isCompleted || isRefunded) && (
                <div className={`mt-6 p-4 rounded-xl text-sm ${isCompleted ? 'bg-green-50 text-green-700' : 'bg-green-50 text-green-700'}`}>
                    <p className="font-bold">{isCompleted ? "Payment Completed" : "Refund Processed"}</p>
                    <p className="text-xs mt-1">
                        {isCompleted ? "Your payment has been received successfully." : "Your refund has been processed and successfully credited."}
                    </p>
                </div>
            )} */}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-8">

                {/* ----------------------------- LEFT ----------------------------- */}
                <div className="lg:col-span-9 flex flex-col gap-6">

                    {/* ── Payment Information ── */}
                    {(isPending || isCompleted) && (
                        <div className="flex flex-col gap-4">
                            <div className="bg-white rounded-xl border border-slate-200 p-6">
                                <h2 className="text-[16px] font-semibold text-[#0B1E3D] mb-4">
                                    {isPending ? 'Payment Information' : 'Payment Information'}
                                </h2>

                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
                                    {/* Payment Status */}
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[12px] text-slate-500">Payment Status</span>
                                        {isPending && (
                                            <>
                                                <span className="inline-flex items-center w-fit px-2.5 py-0.5 rounded-md text-[12px] font-semibold bg-amber-100 text-amber-700">
                                                    Payment Pending
                                                </span>
                                                <span className="text-[12px] text-slate-400 mt-0.5">Awaiting your payment.</span>
                                            </>
                                        )}
                                        {isCompleted && (
                                            <>
                                                <span className="inline-flex items-center w-fit px-2.5 py-0.5 rounded-md text-[12px] font-semibold bg-green-100 text-green-700">
                                                    Completed
                                                </span>
                                                <span className="text-[12px] text-slate-400 mt-0.5">Payment successful</span>
                                            </>
                                        )}
                                    </div>

                                    {/* Date field */}
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[12px] text-slate-500">
                                            {isPending ? 'Payment Due Date' : 'Payment Date'}
                                        </span>
                                        <span className="text-[14px] font-semibold text-[#0B1E3D]">
                                            {isPending ? vehicle.paymentDueDate : vehicle.paymentCompletedDate}
                                        </span>
                                    </div>

                                    {/* Payment ID */}
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[12px] text-slate-500">Payment ID</span>
                                        <span className="text-[14px] font-semibold text-[#0B1E3D]">{vehicle.paymentId}</span>
                                    </div>

                                    {/* Invoice Number — completed only */}
                                    {isCompleted && (
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[12px] text-slate-500">Invoice Number</span>
                                            <span className="text-[14px] font-semibold text-[#0B1E3D]">{vehicle.invoiceNumber}</span>
                                            <a href="#" className="text-[12px] text-[#D97706] font-medium hover:underline mt-0.5">
                                                View Invoice ↗
                                            </a>
                                        </div>
                                    )}
                                </div>

                                {/* Banner */}
                                {isPending && (
                                    <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-lg px-4 py-3">
                                        <svg className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-[13px] text-blue-700">
                                            Please complete the payment before the due date to confirm your purchase. Failure to do so may result in order cancellation.
                                        </span>
                                    </div>
                                )}

                                {isCompleted && (
                                    <div className="flex items-start gap-2 bg-green-50 border border-green-100 rounded-lg px-4 py-3">
                                        <svg className="w-4 h-4 text-green-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-[13px] text-green-700">
                                            Thank you! Your payment has been completed. Your order is confirmed and the vehicle is ready for the next steps.
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* ── Payment Timeline ── */}
                            <div className="bg-white rounded-xl border border-slate-200 p-6">
                                <h2 className="text-[16px] font-semibold text-[#0B1E3D] mb-5">Payment Timeline</h2>

                                <div className="flex flex-col">
                                    {timelineSteps.map((step, idx) => {
                                        const isDone = step.status === 'done';
                                        const isActive = step.status === 'active';
                                        const isPendingStep = step.status === 'pending';
                                        const isLast = idx === timelineSteps.length - 1;

                                        return (
                                            <div key={idx} className="flex gap-4">
                                                {/* connector column */}
                                                <div className="flex flex-col items-center">
                                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${isDone ? 'bg-[#0B1E3D] text-white' :
                                                        isActive ? 'bg-[#D97706] text-white' :
                                                            'bg-slate-100 text-slate-400'
                                                        }`}>
                                                        {isDone ? (
                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        ) : (
                                                            <i className={`ti ${step.icon} text-[16px]`} aria-hidden="true" />
                                                        )}
                                                    </div>
                                                    {!isLast && (
                                                        <div className={`w-0.5 flex-1 my-1 ${isDone ? 'bg-[#0B1E3D]' : 'bg-slate-200'}`} style={{ minHeight: '24px' }} />
                                                    )}
                                                </div>

                                                {/* content */}
                                                <div className={`flex-1 flex items-start justify-between pb-5 ${isLast ? '' : ''}`}>
                                                    <div>
                                                        <p className={`text-[14px] font-semibold ${isDone || isActive ? 'text-[#0B1E3D]' : 'text-slate-400'}`}>
                                                            {step.title}
                                                        </p>
                                                        <p className={`text-[13px] mt-0.5 ${isDone || isActive ? 'text-slate-500' : 'text-slate-400'}`}>
                                                            {step.desc}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 shrink-0 ml-4">
                                                        {step.badge && (
                                                            <span className="px-2.5 py-1 rounded-md text-[12px] font-semibold bg-amber-100 text-amber-700">
                                                                Due in {step.badge}
                                                            </span>
                                                        )}
                                                        {step.date && (
                                                            <span className={`text-[12px] ${isDone ? 'text-[#0B1E3D] font-medium' : 'text-slate-400'}`}>
                                                                {step.date}
                                                            </span>
                                                        )}
                                                        {!step.date && !step.badge && isPendingStep && (
                                                            <span className="text-[12px] text-slate-300">—</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {/* Schedule Pickup row — completed only */}
                                    {isCompleted && (
                                        <div className="flex items-center justify-between mt-2 pt-4 border-t border-slate-100">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
                                                    <i className="ti ti-calendar text-[16px] text-slate-500" aria-hidden="true" />
                                                </div>
                                                <div>
                                                    <p className="text-[14px] font-semibold text-[#0B1E3D]">Schedule Pickup</p>
                                                    <p className="text-[13px] text-slate-500">Your vehicle is ready for pickup. Choose a convenient date and time.</p>
                                                </div>
                                            </div>
                                            <button className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-[#0B1E3D] border border-slate-300 rounded-lg hover:bg-slate-50 transition-all">
                                                <i className="ti ti-calendar text-[15px]" aria-hidden="true" />
                                                Schedule Pickup
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Refund Information ── */}
                    {isRefunded && (
                        <div className="flex flex-col gap-4">
                            <div className="bg-white rounded-xl border border-slate-200 p-6">
                                <h2 className="text-[16px] font-semibold text-[#0B1E3D] mb-4">Refund Information</h2>

                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[12px] text-slate-500">Refund Status</span>
                                        <span className="inline-flex items-center w-fit px-2.5 py-0.5 rounded-md text-[12px] font-semibold bg-purple-100 text-purple-700">
                                            Refunded
                                        </span>
                                        <span className="text-[12px] text-slate-400 mt-0.5">Refund has been processed.</span>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <span className="text-[12px] text-slate-500">Refund ID</span>
                                        <span className="text-[14px] font-semibold text-[#0B1E3D]">{vehicle.refundId}</span>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <span className="text-[12px] text-slate-500">Refund Date</span>
                                        <span className="text-[14px] font-semibold text-[#0B1E3D]">{vehicle.refundDate}</span>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <span className="text-[12px] text-slate-500">Refund Amount</span>
                                        <span className="text-[14px] font-semibold text-[#0B1E3D]">AED {vehicle.refundAmount?.toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Banner */}
                                <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-lg px-4 py-3">
                                    <svg className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-[13px] text-blue-700">
                                        Refund will reflect in your original payment method within 3-5 business days depending on your bank or payment provider.
                                    </span>
                                </div>
                            </div>

                            {/* ── Refund Breakdown ── */}
                            <div className="bg-white rounded-xl border border-slate-200 p-6">
                                <h2 className="text-[16px] font-semibold text-[#0B1E3D] mb-4">Refund Breakdown</h2>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Left — breakdown table */}
                                    <div className="flex flex-col gap-2">
                                        {[
                                            { label: 'Winning Bid', value: vehicle.winningBid, normal: true },
                                            { label: `Buyer Fee (${vehicle.buyerFeePercent ?? 5}%)`, value: vehicle.buyerFee, normal: true },
                                            { label: `VAT (${vehicle.vatPercent ?? 5}%)`, value: vehicle.vat, normal: true },
                                            { label: 'Total Paid', value: vehicle.totalPaid, bold: true },
                                            { label: 'Refund Amount', value: vehicle.refundAmount, bold: true, amber: true },
                                        ].map((row, idx) => (
                                            <div key={idx} className={`flex items-center justify-between py-1.5 ${idx === 3 ? 'border-t border-slate-200 mt-1 pt-2.5' : ''}`}>
                                                <span className={`text-[13px] ${row.bold ? 'font-semibold text-[#0B1E3D]' : 'text-slate-500'}`}>
                                                    {row.label}
                                                </span>
                                                <span className={`text-[13px] ${row.amber ? 'font-semibold text-[#D97706]' : row.bold ? 'font-semibold text-[#0B1E3D]' : 'text-[#0B1E3D]'}`}>
                                                    AED {row.value?.toLocaleString()}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Right — Refund Reason */}
                                    <div className="flex items-start gap-4 bg-slate-50 border border-slate-200 rounded-xl p-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                                            <i className="ti ti-refresh text-[18px] text-slate-500" aria-hidden="true" />
                                        </div>
                                        <div>
                                            <p className="text-[13px] font-semibold text-[#0B1E3D] mb-1">Refund Reason</p>
                                            <p className="text-[13px] font-medium text-slate-700">{vehicle.refundReason}</p>
                                            <p className="text-[12px] text-slate-500 mt-1">{vehicle.refundReasonDesc}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── Refund Timeline ── */}
                            <div className="bg-white rounded-xl border border-slate-200 p-6">
                                <h2 className="text-[16px] font-semibold text-[#0B1E3D] mb-6">Refund Timeline</h2>

                                <div className="relative flex items-start justify-between">
                                    {refundSteps.map((step, idx) => {
                                        const isDone = step.status === 'done';
                                        const isLast = idx === refundSteps.length - 1;

                                        return (
                                            <div key={idx} className="relative flex flex-col items-center flex-1">
                                                {/* connector line — between steps */}
                                                {!isLast && (
                                                    <div className="absolute top-4.5 left-1/2 w-full h-0.5 bg-[#0B1E3D] z-0" />
                                                )}

                                                {/* circle */}
                                                <div className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${isDone ? 'bg-[#0B1E3D] text-white' : 'bg-slate-100 text-slate-400'
                                                    }`}>
                                                    {isDone ? (
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    ) : (
                                                        <i className={`ti ${step.icon} text-[16px]`} aria-hidden="true" />
                                                    )}
                                                </div>

                                                {/* text below */}
                                                <div className="flex flex-col items-center text-center mt-3 px-2">
                                                    <p className={`text-[13px] font-semibold ${isDone ? 'text-[#0B1E3D]' : 'text-slate-400'}`}>
                                                        {step.title}
                                                    </p>
                                                    {step.date && (
                                                        <p className="text-[11px] text-slate-500 mt-0.5">{step.date}</p>
                                                    )}
                                                    <p className="text-[11px] text-slate-400 mt-0.5">{step.desc}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* ----------------------------- RIGHT ----------------------------- */}
                <div className="lg:col-span-3">
                    <div className="space-y-6">

                        {/* 1. Seller Information Card */}
                        <BuyerAuctionSellerCard
                            vehicle={vehicle}
                            setCurrentPage={setCurrentPage}
                            setSelectedSellerId={setSelectedSellerId}
                            setPreviousPage={setPreviousPage}
                            currentPageName="payments-detail"
                        />

                        {/* 2. What Happens Next / What Happened Section */}
                        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                            <h2 className="text-lg font-bold text-[#0B1E3D] mb-6">
                                {isPending ? "What Happens Next?" : isCompleted ? "What's Next?" : "What Happened?"}
                            </h2>

                            <div className="space-y-6">
                                {/* Status Content */}
                                {isPending && (
                                    <>
                                        <Step icon={<FileText size={20} />} title="Payment Pending" desc="Complete the payment to confirm your purchase." />
                                        <Step icon={<Truck size={20} />} title="Vehicle Ready" desc="Once payment is completed, the vehicle will be ready for pickup." />
                                        <Step icon={<Calendar size={20} />} title="Pickup" desc="Schedule a pickup time and collect your vehicle." />
                                    </>
                                )}

                                {isCompleted && (
                                    <>
                                        <Step icon={<CheckCircle size={20} />} title="Vehicle Ready" desc="Once payment is completed, the vehicle will be ready for pickup." />
                                        <Step icon={<Truck size={20} />} title="Pickup" desc="Schedule a pickup time and collect your vehicle." />
                                        <Step icon={<FileText size={20} />} title="View Invoice" desc="Download your invoice and payment receipt for your records." />
                                        <button className="w-full mt-2 py-3 border border-blue-600 text-blue-600 rounded-lg font-bold hover:bg-blue-50">
                                            Download Invoice
                                        </button>
                                    </>
                                )}

                                {isRefunded && (
                                    <Step icon={<Clock size={20} />} title="Your offer has expired." desc="The seller didn't accept your offer before it expired." />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BuyerPaymentsDetail;
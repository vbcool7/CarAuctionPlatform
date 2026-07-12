
import React, { useState } from 'react';

function BuyerPaymentDetailPaymentInfo({ vehicle }) {
    
    const isPending = vehicle.paymentStatus === 'payment-pending';
    const isCompleted = vehicle.paymentStatus === 'payment-completed';

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

    return (
        <div className="flex flex-col gap-4">

            {/* ── Payment Information ── */}
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
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                                        isDone ? 'bg-[#0B1E3D] text-white' :
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
    );
}

export default BuyerPaymentDetailPaymentInfo;

import React from 'react';
import { TbRefresh } from "react-icons/tb";

function BuyerPaymentDetailRefundPaymentInfo({ vehicle }) {

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
        <div className="flex flex-col gap-4">

            {/* ── Refund Information ── */}
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
                                <div className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                                    isDone ? 'bg-[#0B1E3D] text-white' : 'bg-slate-100 text-slate-400'
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
    );
}

export default BuyerPaymentDetailRefundPaymentInfo;
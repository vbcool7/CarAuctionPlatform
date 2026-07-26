
import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ChevronRight, Wallet, Info, Check } from 'lucide-react';
import PayoutFormStep1 from './PayoutFormStep1';
import PayoutFormStep2 from './PayoutFormStep2';
import PayoutFormStep3 from './PayoutFormStep3';
import PayoutFormStep4 from './PayoutFormStep4';
import PayoutFormStep5 from './PayoutFormStep5';

const steps = [
    { icon: 1, label: "Payout Details", sub: "Basic Information" },
    { icon: 2, label: "Recipient Details", sub: "Select user or seller" },
    { icon: 3, label: "Payout Method", sub: "Choose payment method" },
    { icon: 4, label: "Review & Confirm", sub: "Review and submit" },
    { icon: 5, label: "Payout Created", sub: "Successfully created" },
];

function CreatePayoutForm({ setCurrentPage, payoutDraft, setPayoutDraft, payoutStep, setPayoutStep }) {

    const updateDraft = (fields) => setPayoutDraft(prev => ({ ...prev, ...fields }));

    const handleNext = () => setPayoutStep(prev => Math.min(prev + 1, 5));
    const handleBack = () => setPayoutStep(prev => Math.max(prev - 1, 1));

    const nextLabel =
        payoutStep === 1 ? "Next: Recipient Details" :
            payoutStep === 2 ? "Next: Payout Method" :
                payoutStep === 3 ? "Next: Review & Confirm" :
                    payoutStep === 4 ? "Confirm & Create Payout" : null;

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between pb-6">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3D]">
                        Payouts
                    </h1>

                    <div className="mt-2 flex items-center flex-wrap text-[11px] md:text-[13px]">
                        <span
                            onClick={() => setCurrentPage("dashboard")}
                            className="cursor-pointer text-slate-500 hover:text-[#D97706] transition-colors">
                            Dashboard
                        </span>
                        <ChevronRight className="mx-1 w-3 h-3 text-slate-300 shrink-0" />

                        <span className="text-slate-500">Payment Management</span>
                        <ChevronRight className="mx-1 w-3 h-3 text-slate-300 shrink-0" />

                        <span
                            onClick={() => setCurrentPage("payouts")}
                            className="cursor-pointer text-slate-500 hover:text-[#D97706] transition-colors">Payouts</span>
                        <ChevronRight className="mx-1 w-3 h-3 text-slate-300 shrink-0" />

                        <span className="font-medium text-[#D97706]">Create Payouts </span>
                    </div>
                </div>

                {/* btns */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    {payoutStep === 1 &&
                        <button
                            onClick={() => setCurrentPage("payouts")}
                            className="w-full sm:w-auto h-10 px-5 flex items-center justify-center rounded-lg border border-[#D97706] bg-white text-[12px] sm:text-[13px] font-semibold text-[#D97706] transition-all duration-200 hover:bg-amber-50 active:scale-[0.98]">
                            Cancel
                        </button>
                    }

                    {(payoutStep === 2 || payoutStep === 3 || payoutStep === 4 || payoutStep === 5) &&
                        <button
                            onClick={handleBack}
                            className="w-full sm:w-auto h-10 px-4 inline-flex items-center justify-center gap-2 rounded-lg border border-[#D97706] bg-white text-xs sm:text-sm font-medium text-[#D97706] transition-colors duration-200 hover:bg-amber-50 active:scale-[0.98]"
                        >
                            <ArrowLeft className="w-4 h-4 shrink-0" />
                            <span>Back</span>
                        </button>
                    }

                    {(payoutStep === 1 || payoutStep === 2 || payoutStep === 3 || payoutStep === 4) &&
                        <button
                            onClick={handleNext}
                            className="w-full sm:w-auto h-10 px-5 flex items-center justify-center gap-3 rounded-lg bg-[#D97706] text-[12px] sm:text-[13px] font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#B45F04] active:scale-[0.98]" >
                            <span>{nextLabel}</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    }

                </div>
            </div>

            {/* stepper */}
            <div className="w-full overflow-x-auto no-scrollbar my-4">
                <div className="min-w-max bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-sm">
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => {
                            const stepNumber = index + 1;
                            return (
                                <div
                                    key={stepNumber}
                                    className="flex items-center">
                                    {/* Step */}
                                    <div className="relative flex items-center gap-3 px-4 py-3 rounded-xl min-w-45">
                                        {/* Icon Circle */}
                                        <div className="shrink-0">
                                            <div className="w-9 h-9 rounded-full flex items-center justify-center border-2 bg-white border-slate-300 text-slate-500">
                                                <span className="text-sm font-bold">{stepNumber}</span>
                                            </div>
                                        </div>

                                        {/* Text */}
                                        <div className="min-w-0">
                                            <h4 className="text-[13px] font-semibold whitespace-nowrap text-slate-700">
                                                {step.label}
                                            </h4>
                                            <p className="text-xs text-slate-500 whitespace-nowrap mt-0.5">
                                                {step.sub}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Arrow */}
                                    {index !== steps.length - 1 && (
                                        <div className="mx-2 shrink-0">
                                            <ChevronRight size={18} className="text-slate-300" />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* form */}
            <div className="grid grid-cols-1 xl:grid-cols-3 pb-6 gap-6">

                {/* left side - form */}
                <div className="lg:col-span-2 space-y-6">
                    {payoutStep === 1 && <PayoutFormStep1 draft={payoutDraft} updateDraft={updateDraft} />}
                    {payoutStep === 2 && <PayoutFormStep2 draft={payoutDraft} updateDraft={updateDraft} />}
                    {payoutStep === 3 && <PayoutFormStep3 draft={payoutDraft} updateDraft={updateDraft} />}
                    {payoutStep === 4 && <PayoutFormStep4 draft={payoutDraft} updateDraft={updateDraft} />}
                    {payoutStep === 5 && <PayoutFormStep5 draft={payoutDraft} updateDraft={updateDraft} setPayoutDraft={setPayoutDraft} setPayoutStep={setPayoutStep} />}
                </div>

                {/* right side - cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">

                    {/* payout summary - in all steps */}
                    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm max-w-sm w-full space-y-4">
                        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                <Wallet size={20} />
                            </div>
                            <h3 className="font-bold text-slate-900 text-base">Payout Summary</h3>
                        </div>

                        {/* Details Rows */}
                        <div className="space-y-3 text-[13px]">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500 font-medium">Payout Type</span>
                                <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-semibold text-xs">
                                    Winning Payout
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-slate-500 font-medium">Recipient</span>
                                <span className="text-slate-800 font-medium">-</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-slate-500 font-medium">Payout Method</span>
                                <span className="text-slate-800 font-medium">-</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-slate-500 font-medium">Payout Amount</span>
                                <span className="text-slate-900 font-bold">$0.00</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-slate-500 font-medium">Transaction Fees</span>
                                <span className="text-slate-900 font-bold">$0.00</span>
                            </div>

                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <span className="text-slate-500 font-medium">Gateway Charges</span>
                                <span className="text-slate-900 font-bold">$0.00</span>
                            </div>

                            <div className="flex items-center justify-between pt-1">
                                <span className="text-slate-800 font-bold">Total Deductions</span>
                                <span className="text-rose-600 font-bold">$0.00</span>
                            </div>
                        </div>

                        {/* Net Payout Box */}
                        <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50 text-emerald-900 mt-2">
                            <span className="font-bold text-sm">Net Payout Amount</span>
                            <span className="font-bold text-base text-emerald-700">
                                {payoutDraft.amount ? `$${payoutDraft.amount}` : '$0.00'}
                            </span>
                        </div>
                    </div>

                    {/* Payout eligibility - in 1 step */}

                    {/* Recipient summary - in 2/3/4/5 steps */}
                    {(payoutStep === 2 || payoutStep === 3 || payoutStep === 4 || payoutStep === 5) && (
                        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm max-w-sm w-full space-y-3">
                            <h3 className="font-bold text-slate-900 text-base pb-3 border-b border-slate-100">
                                Recipient Balance Summary
                            </h3>

                            <div className="space-y-3 text-[13px]">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500 font-medium">
                                        Available Balance
                                    </span>
                                    <span className="text-emerald-600 font-bold">
                                        $12,500
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500 font-medium">
                                        Pending Payouts
                                    </span>
                                    <span className="text-slate-900 font-bold">
                                        $2,500
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500 font-medium">
                                        Total Lifetime Payouts
                                    </span>
                                    <span className="text-slate-900 font-bold">
                                        $45,000
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Recent Payouts - in 1/2/3/4 step */}
                    {(payoutStep === 1 || payoutStep === 2 || payoutStep === 3 || payoutStep === 4) && (
                        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm max-w-sm w-full space-y-3">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <h3 className="font-bold text-slate-900 text-base">
                                    Recent Payouts to This User
                                </h3>

                                <button className="text-xs font-semibold text-amber-600 hover:underline">
                                    View All
                                </button>
                            </div>

                            <div className="space-y-2.5">
                                {/* Payout 1 */}
                                <div className="flex items-center justify-between text-[13px]">
                                    <span className="text-slate-900 font-bold">
                                        $5,000
                                    </span>

                                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700">
                                        Completed
                                    </span>

                                    <span className="text-slate-500 text-xs">
                                        May 15, 2024
                                    </span>
                                </div>

                                {/* Payout 2 */}
                                <div className="flex items-center justify-between text-[13px]">
                                    <span className="text-slate-900 font-bold">
                                        $2,500
                                    </span>

                                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-600">
                                        Pending
                                    </span>

                                    <span className="text-slate-500 text-xs">
                                        May 10, 2024
                                    </span>
                                </div>

                                {/* Payout 3 */}
                                <div className="flex items-center justify-between text-[13px]">
                                    <span className="text-slate-900 font-bold">
                                        $3,200
                                    </span>

                                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700">
                                        Completed
                                    </span>

                                    <span className="text-slate-500 text-xs">
                                        Apr 28, 2024
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Payout timeline - in 5 step */}
                    {payoutStep === 5 && (
                        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm max-w-sm w-full space-y-3">
                            <h3 className="font-bold text-slate-900 text-base pb-3 border-b border-slate-100">
                                Payout Timeline
                            </h3>
                            <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
                                {[
                                    { label: "Payout Created", time: "May 20 2026 02:32 PM", done: true },
                                    { label: "Processing", time: "In progress", done: true },
                                    { label: "Sent to Bank", time: "Pending", done: false },
                                    { label: "Completed", time: "Pending", done: false },
                                ].map((item, idx) => (
                                    <div key={idx} className="relative">
                                        <div className={`absolute -left-6.5 top-0.5 w-4 h-4 rounded-full flex items-center justify-center ring-3 ring-white ${item.done ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'
                                            }`}>
                                            {item.done && <Check size={10} strokeWidth={3} />}
                                        </div>
                                        <h4 className={`text-[13px] font-semibold ${item.done ? 'text-slate-900' : 'text-slate-400'}`}>
                                            {item.label}
                                        </h4>
                                        <span className="text-[11px] text-slate-400">{item.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* bottom buttons */}
            <div className="grid grid-cols-1 xl:grid-cols-3 pb-6 gap-6">

                <div className="lg:col-span-2 space-y-6">
                    {payoutStep === 1 &&
                        <div className="w-full flex items-start gap-3 px-4 py-3.5 border border-[#D97706]/20 border-l-2 border-l-[#D97706] bg-[#FFFDF8] rounded-lg">
                            <div className="pt-0.5 shrink-0"><Info className="w-5 h-5 text-[#D97706]" /></div>
                            <div>
                                <h4 className="text-[13px] font-semibold text-[#0B1E3D]"> Important Note</h4>

                                <p className="mt-1 text-xs text-slate-600 leading-5">
                                    Payouts once processed cannot be cancelled or reversed.
                                    Please verify all details before proceeding.
                                </p>
                            </div>
                        </div>
                    }

                    {(payoutStep === 2 || payoutStep === 3 || payoutStep === 4) && (
                        <button
                            onClick={() => setCurrentPage("payouts")}
                            className="w-full sm:w-auto h-10 px-4 flex items-center justify-center rounded-lg border border-[#D97706] bg-white text-[12px] sm:text-[13px] font-semibold text-[#D97706] transition-all duration-200 hover:bg-amber-50 active:scale-[0.98]">
                            Save as draft
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        {payoutStep === 1 &&
                            <button
                                onClick={() => setCurrentPage("payouts")}
                                className="w-full sm:w-auto h-10 px-4 flex items-center justify-center rounded-lg border border-[#D97706] bg-white text-[12px] sm:text-[13px] font-semibold text-[#D97706] transition-all duration-200 hover:bg-amber-50 active:scale-[0.98]">
                                Save as draft
                            </button>
                        }

                        {(payoutStep === 2 || payoutStep === 3 || payoutStep === 4) &&
                            <button
                                onClick={handleBack}
                                className="w-full sm:w-auto h-10 px-4 inline-flex items-center justify-center gap-2 rounded-lg border border-[#D97706] bg-white text-xs sm:text-sm font-medium text-[#D97706] transition-colors duration-200 hover:bg-amber-50 active:scale-[0.98]"
                            >
                                <ArrowLeft className="w-4 h-4 shrink-0" />
                                <span>Back</span>
                            </button>
                        }

                        {(payoutStep === 1 || payoutStep === 2 || payoutStep === 3 || payoutStep === 4) &&
                            <button
                                onClick={handleNext}
                                className="w-full sm:w-auto h-10 px-5 flex items-center justify-center gap-3 rounded-lg bg-[#D97706] text-[12px] sm:text-[13px] font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#B45F04] active:scale-[0.98]" >
                                <span>{nextLabel}</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        }

                        {payoutStep === 5 &&
                            <button
                                onClick={() => setCurrentPage('payouts')}
                                className="w-full sm:w-auto h-10 px-5 flex items-center justify-center gap-3 rounded-lg bg-[#D97706] text-[12px] sm:text-[13px] font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#B45F04] active:scale-[0.98]" >
                                <span>Go to payouts List</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        }

                    </div>
                </div>

            </div>
        </div>
    )
}

export default CreatePayoutForm
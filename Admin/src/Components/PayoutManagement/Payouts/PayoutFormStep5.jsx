
import React, { useEffect } from 'react';
import { FiAlertTriangle } from "react-icons/fi";
import { Check, Clipboard, CalendarDays, Clock3, Copy, Info, Eye, Download, PlusCircle, } from "lucide-react";
import confetti from 'canvas-confetti';

function PayoutFormStep5({ draft, updateDraft, setPayoutDraft, setPayoutStep }) {

    useEffect(() => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.8 }
        });
    }, []);

    return (
        <div className="w-full bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm">

            {/* success message */}
            <div className="flex flex-col items-center text-center space-y-2.5">
                <div className="w-18 h-18 rounded-full bg-green-50 border border-green-100 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-green-600 flex items-center justify-center shadow-xl">
                        <Check className="w-7 h-7 text-white" />
                    </div>
                </div>

                <h1 className="text-lg sm:text-xl font-bold text-[#0B1E3D]">
                    Payout Created Successfully!
                </h1>

                <p className="text-xs sm:text-[13px] text-slate-500">
                    The payout has been created and is being processed.
                </p>
            </div>

            {/* summry */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                {/* Payout ID */}
                <div className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-lg">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                        <Clipboard className="w-5 h-5 text-indigo-600" />
                    </div>

                    <div className="min-w-0">
                        <p className="text-[11px] text-slate-500 mb-1">
                            Payout ID
                        </p>

                        <div className="flex items-center gap-2">
                            <p className="text-xs font-semibold text-emerald-600 truncate">
                                PAYOUT-2024-0243
                            </p>

                            <button
                                type="button"
                                className="text-slate-500 hover:text-[#D97706] transition-colors"
                            >
                                <Copy className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Created Date */}
                <div className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-lg">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                        <CalendarDays className="w-5 h-5 text-indigo-600" />
                    </div>

                    <div className="min-w-0">
                        <p className="text-[11px] text-slate-500 mb-1">
                            Created Date
                        </p>

                        <p className="text-xs font-semibold text-[#0B1E3D] truncate">
                            May 20, 2024 02:32 PM
                        </p>
                    </div>
                </div>


                {/* Status */}
                <div className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-lg">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                        <Clock3 className="w-5 h-5 text-indigo-600" />
                    </div>

                    <div>
                        <p className="text-[11px] text-slate-500 mb-1">
                            Status
                        </p>

                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-emerald-50 text-[10px] font-semibold text-emerald-700">
                            Processing
                        </span>
                    </div>
                </div>

            </div>

            {/* notific. */}
            <div className="mt-6 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-blue-100 bg-blue-50/40">
                <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />

                <p className="text-[11px] sm:text-xs font-medium text-[#0B1E3D] text-center">
                    You will receive an email notification once the payout is processed successfully.
                </p>
            </div>

            {/* btns */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8 pt-5 border-t border-slate-100">

                <button
                    type="button"
                    className="w-full sm:w-auto h-10 px-5 flex items-center justify-center gap-2 rounded-lg border border-[#D97706]/50 bg-white text-xs font-semibold text-[#D97706] transition-all duration-200 hover:bg-amber-50 active:scale-[0.98]"
                >
                    <Eye className="w-4 h-4" />
                    View Payout Details
                </button>

                <button
                    type="button"
                    className="w-full sm:w-auto h-10 px-5 flex items-center justify-center gap-2 rounded-lg border border-[#D97706]/50 bg-white text-xs font-semibold text-[#D97706] transition-all duration-200 hover:bg-amber-50 active:scale-[0.98]"
                >
                    <Download className="w-4 h-4" />
                    Download Receipt
                </button>

                <button
                    type="button"
                    onClick={() => {
                        setPayoutDraft({});
                        setPayoutStep(1);
                    }}
                    className="w-full sm:w-auto h-10 px-5 flex items-center justify-center gap-2 rounded-lg bg-[#D97706] text-xs font-semibold text-white transition-all duration-200 hover:bg-amber-700 active:scale-[0.98]"
                >
                    <PlusCircle className="w-4 h-4" />
                    Create Another Payout
                </button>

            </div>

            {/* note */}
            <div className="w-full flex items-start gap-3 px-4 py-3.5 mt-12 border border-[#D97706]/20 border-l-2 border-l-[#D97706] bg-[#FFFDF8] rounded-lg">
                <div className="pt-0.5 shrink-0"><FiAlertTriangle className="w-5 h-5 text-[#D97706]" /></div>
                <div>
                    <h4 className="text-[13px] font-semibold text-[#0B1E3D]">Please Note</h4>
                    <p className="mt-1 text-xs text-slate-600 leading-5">
                        Payouts are usually processed within 1-3 business days depending on the selected payment method and bank processing times.
                        You can track the status of this payout from the Payout Details Page.
                    </p>
                </div>
            </div>

        </div>
    )
}

export default PayoutFormStep5;
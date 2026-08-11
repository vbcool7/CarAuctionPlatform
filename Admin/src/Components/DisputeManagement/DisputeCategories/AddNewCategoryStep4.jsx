
import React from 'react';
import { Edit2, CreditCard, Settings as SettingsIcon, Clock } from "lucide-react";

function AddNewCategoryStep4({ setStep }) {
    return (
        <div className="w-full bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">

            {/* Header */}
            <div>
                <h3 className="text-base font-bold text-[#0B1E3D]">
                    Review & Confirm
                </h3>

                <p className="mt-1 text-xs sm:text-sm text-slate-500">
                    Please review all the details below. You can go back to make change.
                </p>
            </div>

            {/* Card 1: Category Details */}
            <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <CreditCard className="w-4 h-4" />
                        </div>
                        <h4 className="text-sm font-bold text-[#0B1E3D]">Category Details</h4>
                    </div>

                    <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-[#0B1E3D] shadow-sm hover:border-[#D97706] hover:bg-amber-50 hover:text-[#D97706] transition-all duration-200"
                    >
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-slate-500">Category Name</span>
                            <span className="font-semibold text-[#0B1E3D]">Payment Not Received</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-500">Category</span>
                            <span className="font-semibold text-[#0B1E3D]">Payment Not Received</span>
                        </div>
                        <div className="flex items-start justify-between">
                            <span className="text-slate-500">Description</span>
                            <span className="font-semibold text-[#0B1E3D] text-right max-w-50">
                                Buyer claims payment was debited but not received.
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-500">Icon</span>
                            <span className="p-1.5 rounded-md bg-rose-50 text-rose-600 border border-rose-100">
                                <CreditCard className="w-4 h-4" />
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-slate-500">Priority Level</span>
                            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-rose-50 text-rose-600 border border-rose-100">
                                High
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-500">Display Order</span>
                            <span className="font-semibold text-[#0B1E3D]">1</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-500">Status</span>
                            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                                Active
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="border-t border-slate-200 my-4" />

            {/* Card 2: Settings */}
            <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <SettingsIcon className="w-4 h-4" />
                        </div>
                        <h4 className="text-sm font-bold text-[#0B1E3D]">Settings</h4>
                    </div>
                    <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-[#0B1E3D] shadow-sm hover:border-[#D97706] hover:bg-amber-50 hover:text-[#D97706] transition-all duration-200"
                    >
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-slate-500">Category Type</span>
                            <span className="font-semibold text-[#0B1E3D]">Standard</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-500">Allow Sub-Categories</span>
                            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                                Yes
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-500">Enable for Disputes</span>
                            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                                Yes
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-500">Default Priority</span>
                            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-rose-50 text-rose-600 border border-rose-100">
                                High
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-500">Allow Priority Override</span>
                            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                                Yes
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-500">Visible To</span>
                            <span className="font-semibold text-[#0B1E3D] text-right">
                                Buyers, Sellers, Admins, Support Agents
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-500">Default Status</span>
                            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-600 border border-blue-100">
                                Open
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex flex-col gap-1">
                            <span className="text-slate-500 font-medium">Category Rules / Notes</span>
                            <p className="text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                Disputes under this category will be reviewed based on payment proof and bank statement.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="border-t border-slate-200 my-4" />

            {/* Card 3: Auto Close & SLA */}
            <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <Clock className="w-4 h-4" />
                        </div>
                        <h4 className="text-sm font-bold text-[#0B1E3D]">Auto Close & SLA</h4>
                    </div>
                    <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-[#0B1E3D] shadow-sm hover:border-[#D97706] hover:bg-amber-50 hover:text-[#D97706] transition-all duration-200"
                    >
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-slate-500">Auto Close</span>
                            <span className="font-semibold text-[#0B1E3D]">7 Days</span>
                        </div>

                        <div className="pt-2">
                            <h5 className="font-bold text-[#0B1E3D] mb-2.5">SLA Time Limits</h5>
                            <div className="space-y-2.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500">Initial Response Time</span>
                                    <span className="font-semibold text-[#0B1E3D]">24 Hours</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500">Resolution Time</span>
                                    <span className="font-semibold text-[#0B1E3D]">7 Days</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500">Final Response Time</span>
                                    <span className="font-semibold text-[#0B1E3D]">24 Hours</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="pt-2 sm:pt-0">
                            <h5 className="font-bold text-[#0B1E3D] mb-2.5">SLA Breach Actions</h5>
                            <div className="space-y-2.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500">Initial Response</span>
                                    <span className="font-semibold text-[#0B1E3D]">Send Reminder</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500">Resolution</span>
                                    <span className="font-semibold text-[#0B1E3D]">Escalate to Admin</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500">Final Response</span>
                                    <span className="font-semibold text-[#0B1E3D]">Send Reminder</span>
                                </div>
                                <div className="flex items-center justify-between pt-1">
                                    <span className="text-slate-500">Auto Close</span>
                                    <span className="font-semibold text-[#0B1E3D]">Enabled</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default AddNewCategoryStep4;
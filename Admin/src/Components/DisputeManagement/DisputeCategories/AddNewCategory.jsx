
import React, { useState } from 'react'
import { ArrowLeft, ArrowRight, Check, ChevronRight, CreditCard, Info, Zap } from 'lucide-react';
import AddNewCategoryStep1 from './AddNewCategoryStep1';
import AddNewCategoryStep2 from './AddNewCategoryStep2';
import AddNewCategoryStep3 from './AddNewCategoryStep3';
import AddNewCategoryStep4 from './AddNewCategoryStep4';
import AddNewCategorySuccessModal from './AddNewCategorySuccessModal';

const steps = [
    { icon: 1, label: "Category Details", sub: "Basic information" },
    { icon: 2, label: "Settings", sub: "Configure behavior" },
    { icon: 3, label: "Auto Close & SLA", sub: "Set time limits" },
    { icon: 4, label: "Review & Confirm", sub: "Verify details" },
];

function AddNewCategory({ setCurrentPage }) {

    const [step, setStep] = useState(1);
    const [isGatewayActivated, setIsGatewayActivated] = useState(false);

    const handleNext = () => setStep(prev => Math.min(prev + 1, 5));
    const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

    const nextLabel =
        step === 1 ? "Next: Settings" :
            step === 2 ? "Next: Auto Close & SLA" :
                step === 3 ? "Next: Review & Confirm" : null;

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between pb-6">
                <div className="min-w-0 w-full">
                    <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3D]">
                        Create New Dispute Category
                    </h1>

                    <div className="mt-2 w-full min-w-0 overflow-x-auto no-scrollbar">
                        <div className="flex items-center flex-nowrap whitespace-nowrap w-max text-[11px] md:text-[13px]">

                            <span
                                onClick={() => setCurrentPage("dashboard")}
                                className="shrink-0 cursor-pointer text-slate-500 hover:text-[#D97706] transition-colors">
                                Dashboard
                            </span>

                            <ChevronRight className="mx-1 w-3 h-3 text-slate-300 shrink-0" />
                            <span className="shrink-0 text-slate-500">
                                Dispute Management
                            </span>

                            <ChevronRight className="mx-1 w-3 h-3 text-slate-300 shrink-0" />
                            <span
                                onClick={() => setCurrentPage("dispute-categories")}
                                className="shrink-0 cursor-pointer text-slate-500 hover:text-[#D97706] transition-colors">
                                Dispute Categories
                            </span>

                            <ChevronRight className="mx-1 w-3 h-3 text-slate-300 shrink-0" />
                            <span className="shrink-0 font-medium text-[#D97706]">
                                Add New Category
                            </span>
                        </div>
                    </div>
                </div>

                {/* Button */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                    <button
                        onClick={() => setCurrentPage("dispute-categories")}
                        className="w-full sm:w-auto h-10 px-4 inline-flex items-center justify-center gap-2 rounded-lg border border-[#D97706] bg-white text-xs sm:text-sm font-medium text-[#D97706] transition-colors duration-200 hover:bg-amber-50 active:scale-[0.98]"
                    >
                        <ArrowLeft className="w-4 h-4 shrink-0" />
                        <span>Back to Categories</span>
                    </button>
                </div>

            </div>

            {isGatewayActivated ? (
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4 pb-6">

                    {/* left side */}
                    <div className="space-y-6">
                        <AddNewCategorySuccessModal setCurrentPage={setCurrentPage} setStep={setStep} />
                    </div>
                
                    {/* right side */}
                    <div className="bg-gray-50/30 rounded-xl border border-gray-100 shadow-sm p-5">
                        <div className="text-center">
                            <h3 className="text-sm font-bold text-[#0B1E3D]">
                                Category Preview
                            </h3>

                            <div className="mt-5 mx-auto w-18 h-18 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center">
                                <CreditCard className="w-9 h-9 text-rose-500" />
                            </div>

                            <h4 className="mt-4 text-sm font-bold text-[#0B1E3D]">
                                Payment Not Received
                            </h4>

                            <span className="inline-flex mt-3 px-2.5 py-1 rounded-md bg-rose-50 text-rose-600 text-[10px] font-semibold">
                                High Priority
                            </span>

                            <p className="mt-4 text-xs leading-5 text-slate-600 max-w-60 mx-auto">
                                Buyer claims payment was debited
                                <br />
                                but not received.
                            </p>
                        </div>

                        <div className="mt-5 pt-5 border-t border-slate-200">
                            <div className="space-y-3 text-xs">

                                {/* Category Type */}
                                <div className="flex items-center justify-between">
                                    <span className="text-[#0B1E3D]">
                                        Category Type
                                    </span>
                                    <span className="font-medium text-[#0B1E3D]">
                                        Standard
                                    </span>
                                </div>

                                {/* Status */}
                                <div className="flex items-center justify-between">
                                    <span className="text-[#0B1E3D]">
                                        Status
                                    </span>
                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                                        Active
                                    </span>
                                </div>

                                {/* Priority Level */}
                                <div className="flex items-center justify-between">
                                    <span className="text-[#0B1E3D]">
                                        Priority Level
                                    </span>
                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-600 border border-rose-100">
                                        High
                                    </span>
                                </div>

                                {/* Auto Close */}
                                <div className="flex items-center justify-between">
                                    <span className="text-[#0B1E3D]">
                                        Auto Close
                                    </span>
                                    <span className="font-medium text-[#0B1E3D]">
                                        7 Days
                                    </span>
                                </div>

                                {/* Initial Response SLA */}
                                <div className="flex items-center justify-between">
                                    <span className="text-[#0B1E3D]">
                                        Initial Response SLA
                                    </span>
                                    <span className="font-medium text-[#0B1E3D]">
                                        24 Hours
                                    </span>
                                </div>

                                {/* Resolution SLA */}
                                <div className="flex items-center justify-between">
                                    <span className="text-[#0B1E3D]">
                                        Resolution SLA
                                    </span>
                                    <span className="font-medium text-[#0B1E3D]">
                                        7 Days
                                    </span>
                                </div>

                                {/* Final Response SLA */}
                                <div className="flex items-center justify-between">
                                    <span className="text-[#0B1E3D]">
                                        Final Response SLA
                                    </span>
                                    <span className="font-medium text-[#0B1E3D]">
                                        24 Hours
                                    </span>
                                </div>

                                {/* Visible To */}
                                <div className="flex items-start justify-between gap-4">
                                    <span className="text-[#0B1E3D] shrink-0">
                                        Visible To
                                    </span>

                                    <span className="font-medium text-[#0B1E3D] text-right max-w-45 leading-4">
                                        Buyers, Sellers, Admins, Agents
                                    </span>
                                </div>

                                {/* Default Status */}
                                <div className="flex items-center justify-between">
                                    <span className="text-[#0B1E3D]">
                                        Default Status
                                    </span>

                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-600 border border-blue-100">
                                        Open
                                    </span>
                                </div>

                                {/* Created By */}
                                <div className="flex items-center justify-between">
                                    <span className="text-[#0B1E3D]">
                                        Created By
                                    </span>

                                    <span className="font-medium text-[#0B1E3D]">
                                        Admin User
                                    </span>
                                </div>

                                {/* Created On */}
                                <div className="flex items-center justify-between">
                                    <span className="text-[#0B1E3D]">
                                        Created On
                                    </span>

                                    <div className="text-right">
                                        <div className="font-medium text-[#0B1E3D]">
                                            May 20, 2024
                                        </div>

                                        <div className="mt-0.5 text-[10px] text-slate-400">
                                            10:30 AM
                                        </div>
                                    </div>
                                </div>

                            </div>


                            {/* Info Notice */}
                            <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-violet-200 bg-violet-50/70 px-3.5 py-3">
                                <div className="w-7 h-7 shrink-0 rounded-lg bg-violet-100 flex items-center justify-center">
                                    <Info className="w-4 h-4 text-violet-600" />
                                </div>

                                <p className="text-[11px] leading-4 text-violet-700 pt-0.5">
                                    You can edit this category details anytime from the dispute categories list.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_300px] gap-4">

                        {/* col: 1stepper */}
                        <div className="w-full">
                            <div className="bg-white px-4 py-4">
                                <div className="flex flex-col">
                                    {steps.map((stepData, index) => {

                                        const stepNumber = index + 1;

                                        const isCompleted = stepNumber < step;
                                        const isCurrent = stepNumber === step;
                                        const isUpcoming = stepNumber > step;

                                        return (
                                            <div key={stepNumber} className="flex items-start">

                                                <div className="flex flex-col items-center">
                                                    {/* Icon Circle */}
                                                    <div className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center border
                                    ${isCompleted
                                                            ? "bg-emerald-500 border-emerald-500 text-white"
                                                            : isCurrent
                                                                ? "bg-[#D97706] border-[#D97706] text-white"
                                                                : "bg-white border-slate-300 text-slate-500"
                                                        }
                            `}>
                                                        {isCompleted ? (
                                                            <Check className="w-4 h-4" />
                                                        ) : (
                                                            <span className="text-sm font-bold">{stepNumber}</span>
                                                        )}
                                                    </div>

                                                    {/* Connecting vertical line */}
                                                    {index !== steps.length - 1 && (
                                                        <div className={`w-0.5 flex-1 min-h-8 my-1 transition-colors duration-200
                                        ${isCompleted ? "bg-emerald-500" : "bg-slate-200"}
                                `} />
                                                    )}
                                                </div>

                                                {/* Text */}
                                                <div className="min-w-0 pb-6 pl-3 pt-1.5">
                                                    <h4 className={`text-[13px] font-semibold whitespace-nowrap transition-colors
                                    ${isCompleted
                                                            ? "text-emerald-600"
                                                            : isCurrent
                                                                ? "text-[#D97706]"
                                                                : "text-slate-700"
                                                        }
                            `}>
                                                        {stepData.label}
                                                    </h4>

                                                    <p className={`text-xs whitespace-nowrap mt-0.5
                                    ${isCompleted
                                                            ? "text-emerald-500"
                                                            : isCurrent
                                                                ? "text-[#D97706]/70"
                                                                : "text-slate-500"
                                                        }
                            `}>
                                                        {stepData.sub}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Column 2: Form */}
                        <div className="space-y-6">
                            {step === 1 && <AddNewCategoryStep1 setStep={setStep} />}
                            {step === 2 && <AddNewCategoryStep2 setStep={setStep} />}
                            {step === 3 && <AddNewCategoryStep3 setStep={setStep} />}
                            {step === 4 && <AddNewCategoryStep4 setStep={setStep} />}
                        </div>

                        {/* Column 3: Preview */}
                        <div className="bg-gray-50/30 rounded-xl border border-gray-100 shadow-sm p-5">

                            <div className="text-center">
                                <h3 className="text-sm font-bold text-[#0B1E3D]">
                                    Category Preview
                                </h3>

                                {/* Icon */}
                                <div className="mt-5 mx-auto w-18 h-18 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center">
                                    <CreditCard className="w-9 h-9 text-rose-500" />
                                </div>

                                {/* Category Name */}
                                <h4 className="mt-4 text-sm font-bold text-[#0B1E3D]">
                                    Payment Not Received
                                </h4>

                                {/* Priority */}
                                <span className="inline-flex mt-3 px-2.5 py-1 rounded-md bg-rose-50 text-rose-600 text-[10px] font-semibold">
                                    High Priority
                                </span>

                                {/* Description */}
                                <p className="mt-4 text-xs leading-5 text-slate-600 max-w-60 mx-auto">
                                    Buyer claims payment was debited
                                    <br />
                                    but not received.
                                </p>
                            </div>

                            {/* Category Info */}
                            {step === 1 && (
                                <div>
                                    <div className="mt-5 pt-5 border-t border-slate-200">

                                        <h4 className="text-sm font-bold text-[#0B1E3D] mb-4">Category Info</h4>

                                        <div className="space-y-3 text-xs">

                                            <div className="flex items-center justify-between">
                                                <span className="text-[#0B1E3D]">Auto Close</span>
                                                <span className="font-medium text-[#0B1E3D]">7 Days</span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="text-[#0B1E3D]">Resolution Time (Avg.)</span>
                                                <span className="font-medium text-[#0B1E3D]">2.4 Days</span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="text-[#0B1E3D]">Status</span>
                                                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 font-semibold">
                                                    Active
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="text-[#0B1E3D]">Created By</span>
                                                <span className="font-medium text-slate-500">—</span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="text-[#0B1E3D]">Created On</span>
                                                <span className="font-medium text-slate-500">—</span>
                                            </div>

                                        </div>
                                    </div>

                                    <div className="mt-5 p-3 rounded-lg bg-violet-50 flex items-start gap-2">
                                        <Info className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />

                                        <p className="text-[10px] leading-4 text-violet-700">
                                            This category will be available for selection when creating new disputes.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* seting summary */}
                            {step === 2 && (
                                <>
                                    <div className="mt-5 pt-5 border-t border-slate-200">
                                        <h4 className="text-sm font-bold text-[#0B1E3D] mb-4">Setting Summary</h4>

                                        <div className="space-y-3 text-xs">

                                            <div className="flex items-center justify-between">
                                                <span className="text-[#0B1E3D]">Category Type</span>
                                                <span className="font-medium text-[#0B1E3D]">Standard</span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="text-[#0B1E3D]">Allow Sub-Categories</span>
                                                <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                                                    Yes
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="text-[#0B1E3D]">Enable for Disputes</span>
                                                <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                                                    Yes
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="text-[#0B1E3D]">Default Priority</span>
                                                <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-100">
                                                    Medium
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="text-[#0B1E3D]">Allow Priority Override</span>
                                                <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                                                    Yes
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="text-[#0B1E3D]">Visible To</span>
                                                <span className="font-medium text-[#0B1E3D] text-right max-w-50">
                                                    Buyers, Sellers, Admins, Agents
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="text-[#0B1E3D]">Default Status</span>
                                                <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100">
                                                    Open
                                                </span>
                                            </div>

                                        </div>
                                    </div>

                                    <div className="mt-5 p-3 rounded-lg bg-violet-50 flex items-start gap-2">
                                        <Info className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />

                                        <p className="text-[10px] leading-4 text-violet-700">
                                            This setting can be update later from category setting.
                                        </p>
                                    </div>
                                </>
                            )}

                            {step === 3 && (
                                <>
                                    <div className="mt-5 pt-5 border-t border-slate-200">
                                        <h4 className="text-sm font-bold text-[#0B1E3D] mb-4">Auto Close SLA Summary</h4>

                                        <div className="space-y-3 text-xs mb-5">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[#0B1E3D]">Auto Close</span>
                                                <span className="font-medium text-[#0B1E3D]">7 Days</span>
                                            </div>
                                        </div>
                                        <div className="mb-5">
                                            <h4 className="text-xs font-bold text-[#0B1E3D] mb-3">
                                                SLA Time Limits
                                            </h4>
                                            <div className="space-y-3 text-xs">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[#0B1E3D]">Initial Response Time</span>
                                                    <span className="font-medium text-[#0B1E3D]">24 Hours</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[#0B1E3D]">Resolution Time</span>
                                                    <span className="font-medium text-[#0B1E3D]">7 Days</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[#0B1E3D]">Final Response Time</span>
                                                    <span className="font-medium text-[#0B1E3D]">24 Hours</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <h4 className="text-xs font-bold text-[#0B1E3D] mb-3">
                                                SLA Breach Actions
                                            </h4>
                                            <div className="space-y-3 text-xs">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[#0B1E3D]">Initial Response</span>
                                                    <span className="font-medium text-[#0B1E3D]">Send Reminder</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[#0B1E3D]">Resolution</span>
                                                    <span className="font-medium text-[#0B1E3D]">Escalate to Admin</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[#0B1E3D]">Final Response</span>
                                                    <span className="font-medium text-[#0B1E3D]">Send Reminder</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-5 p-3 rounded-lg bg-violet-50 flex items-start gap-2">
                                            <Info className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />

                                            <p className="text-[10px] leading-4 text-violet-700">
                                                This time limits help ensure timely resolution and better user experience.
                                            </p>
                                        </div>
                                    </div>
                                </>
                            )}

                            {step === 4 && (
                                <>
                                    <div className="mt-5 pt-5 border-t border-slate-200">
                                        <h4 className="text-sm font-bold text-[#0B1E3D] mb-4">Summary</h4>

                                        {/* Summary Items List */}
                                        <div className="space-y-3 text-xs mb-6">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[#0B1E3D]">Category Type</span>
                                                <span className="font-medium text-[#0B1E3D]">Standard</span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="text-[#0B1E3D]">Status</span>
                                                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                                                    Active
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="text-[#0B1E3D]">Auto Close</span>
                                                <span className="font-medium text-[#0B1E3D]">7 Days</span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="text-[#0B1E3D]">Initial Response SLA</span>
                                                <span className="font-medium text-[#0B1E3D]">24 Hours</span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="text-[#0B1E3D]">Resolution SLA</span>
                                                <span className="font-medium text-[#0B1E3D]">7 Days</span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="text-[#0B1E3D]">Final Response SLA</span>
                                                <span className="font-medium text-[#0B1E3D]">24 Hours</span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="text-[#0B1E3D]">Default Status</span>
                                                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-600 border border-blue-100">
                                                    Open
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="text-[#0B1E3D]">Visible To</span>
                                                <span className="font-medium text-[#0B1E3D] text-right max-w-45">
                                                    Buyers, Sellers, Admins, Agents
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="text-[#0B1E3D]">Created By</span>
                                                <span className="font-medium text-[#0B1E3D]">Admin User</span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="text-[#0B1E3D]">Created On</span>
                                                <div className="text-right">
                                                    <div className="font-medium text-[#0B1E3D]">May 20, 2024</div>
                                                    <div className="text-[10px] text-slate-400">10:30 AM</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Info Box */}
                                        <div className="mt-5 p-3 rounded-lg bg-violet-50 flex items-start gap-2">
                                            <Info className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />

                                            <p className="text-[10px] leading-4 text-violet-700">
                                                Once created, you can manage this category and make changes anytime.
                                            </p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* footer buttons */}
                    <div>
                        <div className="flex items-center justify-end gap-3 pt-5 mt-6 pb-6">
                            {step === 1 && (
                                <button
                                    type="button"
                                    onClick={() => setCurrentPage("dispute-categories")}
                                    className="px-5 py-2.5 rounded-lg border border-[#D97706] bg-white text-[#D97706] text-sm font-semibold hover:bg-amber-50 transition-colors"
                                >
                                    Cancel
                                </button>
                            )}

                            {(step === 2 || step === 3 || step === 4) && (
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#D97706] bg-white text-[#D97706] text-sm font-semibold hover:bg-amber-50 transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Previous
                                </button>
                            )}

                            {(step === 1 || step === 2 || step === 3) && (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#D97706] text-white text-sm font-semibold hover:bg-amber-700 transition-colors shadow-sm"
                                >
                                    {nextLabel}
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            )}

                            {step === 4 && (
                                <button
                                    type="button"
                                    onClick={() => setIsGatewayActivated(true)}
                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#D97706] text-white text-sm font-semibold hover:bg-amber-700 transition-colors shadow-sm"
                                >
                                    Create Category
                                    <Zap className="w-4 h-4" />
                                </button>
                            )}

                        </div>
                    </div>
                </>
            )}
        </div >
    )
}

export default AddNewCategory;
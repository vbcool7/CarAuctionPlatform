
import React from 'react';
import { ArrowLeft, Check, CheckCircle2, ChevronRight, Download, FileText, RefreshCw, X } from 'lucide-react';
import { payoutsList } from '../../Data';

const PAYOUT_STEPS = ['Initiated', 'Under Review', 'Approved', 'Completed'];

const STATUS_STEP_INDEX = {
    Pending: 0,      // only "Initiated" done
    Processing: 2,   // "Initiated", "Under Review", "Approved" done
    Completed: 3,    // all done
    Failed: -1       // special-cased separately, shows failure at current stage
};

function PayoutsDetail({ setCurrentPage, payoutId }) {

    const record = payoutsList.find((p) => p.payoutId === payoutId);

    if (!record) {
        return (
            <div className="p-6">
                <p className="text-sm text-slate-500">Payout not found.</p>
                <button
                    onClick={() => setCurrentPage('payouts')}
                    className="mt-3 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:border-[#D97706] hover:bg-amber-50 hover:text-[#D97706]"
                >
                    <ArrowLeft size={16} />
                    <span>Back to Payouts</span>
                </button>
            </div>
        );
    }

    const { breakdown } = record;
    const totalPayout = breakdown.winningAmount - breakdown.platformFee - breakdown.paymentProcessingFee - breakdown.otherDeductions;

    const statusClasses = {
        Completed: "bg-green-100 text-green-700",
        Pending: "bg-amber-100 text-amber-700",
        Processing: "bg-blue-100 text-blue-700",
        Failed: "bg-red-100 text-red-700"
    }[record.status] || "bg-slate-100 text-slate-600";

    const currency = (n) => `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const handleAction = () => {
        // No backend yet — stub only
        console.log(`Action for ${record.status}`, record.payoutId);
    };

    const actionConfig = {
        Pending: { label: 'Approve Payout', icon: CheckCircle2, classes: 'bg-green-600 hover:bg-green-700' },
        Failed: { label: 'Retry Payout', icon: RefreshCw, classes: 'bg-amber-600 hover:bg-amber-700' },
        Completed: { label: 'Initiate Refund', icon: RefreshCw, classes: 'bg-slate-700 hover:bg-slate-800' }
        // Processing → no action, intentionally omitted
    }[record.status];

    return (
        <div className='pb-6'>
            {/* Header */}
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between pb-6">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3D]">Payout Details</h1>

                    <div className="mt-2 flex items-center text-[11px] md:text-[13px]">
                        <span
                            onClick={() => setCurrentPage("dashboard")}
                            className="cursor-pointer text-slate-500 hover:text-[#D97706] transition-colors">
                            Dashboard
                        </span>

                        <span className="mx-1 text-slate-300"><ChevronRight size={16} /></span>
                        <span className=" text-slate-500">Payment Management</span>

                        <span className="mx-1 text-slate-300"><ChevronRight size={16} /></span>
                        <span
                            onClick={() => setCurrentPage('payouts')}
                            className="cursor-pointer text-slate-500 hover:text-[#D97706] transition-colors">
                            All Payouts
                        </span>

                        <span className="mx-1 text-slate-300"><ChevronRight size={16} /></span>
                        <span className="font-medium text-[#D97706]">
                            Payout Detail
                        </span>
                    </div>
                </div>

                {/* btns */}
                <div className="">
                    <button className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-transparent p-2 font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-[#D97706] hover:text-[#D97706] hover:bg-amber-50">
                        <Download size={16} />
                        <span className="text-[13px]">Download Receipt</span>
                    </button>
                </div>
            </div>

            {/* Summary strip */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                    <p className="text-[11px] text-slate-500">Payout ID</p>
                    <p className="text-sm font-semibold text-[#0B1E3D]">{record.payoutId}</p>
                    <span className={`mt-1 inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${statusClasses}`}>{record.status}</span>
                </div>
                <div>
                    <p className="text-[11px] text-slate-500">Payout Type</p>
                    <p className="text-sm font-semibold text-[#0B1E3D]">{record.payoutType}</p>
                    <p className="mt-2 text-[11px] text-slate-500">Amount</p>
                    <p className="text-sm font-semibold text-green-600">{currency(totalPayout)} USD</p>
                </div>
                <div>
                    <p className="text-[11px] text-slate-500">Payout Method</p>
                    <p className="text-sm font-semibold text-[#0B1E3D]">{record.method}</p>
                    <p className="mt-2 text-[11px] text-slate-500">Reference ID</p>
                    <p className="text-sm font-semibold text-[#0B1E3D]">{record.referenceId}</p>
                </div>
                <div>
                    <p className="text-[11px] text-slate-500">Payout Date & Time</p>
                    <p className="text-sm font-semibold text-[#0B1E3D]">{record.date}, {record.time}</p>
                    {record.status === 'Completed' && (
                        <>
                            <p className="mt-2 text-[11px] text-slate-500">Completed On</p>
                            <p className="text-sm font-semibold text-[#0B1E3D]">{record.completedDate}, {record.completedTime}</p>
                        </>
                    )}
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left column */}
                <div className="space-y-6">

                    {/* User/Seller Info */}
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="mb-4 text-sm font-semibold text-[#0B1E3D]">User / Seller Information</h3>
                        <div className="flex items-center gap-3">
                            <img
                                src={record.avatarUrl}
                                alt={record.userName}
                                className="h-12 w-12 rounded-full object-cover" />
                            <div>
                                <p className="text-sm font-semibold text-[#0B1E3D]">{record.userName}</p>
                                <p className="text-[11px] text-slate-500">{record.userEmail}</p>
                                <p className="text-[11px] text-slate-500">{record.userPhone}</p>
                            </div>
                        </div>
                        <div className="mt-4 space-y-2 text-[12px]">
                            <div className="flex justify-between"><span className="text-slate-500">User Type</span><span className="font-medium text-slate-700">{record.userType}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">Business Name</span><span className="font-medium text-slate-700">{record.businessName}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">Trade License No.</span><span className="font-medium text-slate-700">{record.tradeLicenseNo}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">Joined On</span><span className="font-medium text-slate-700">{record.joinedOn}</span></div>
                        </div>
                    </div>

                    {/* Payout Breakdown */}
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="mb-4 text-sm font-semibold text-[#0B1E3D]">Payout Breakdown</h3>
                        <div className="space-y-2 text-[12px]">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Winning Amount</span>
                                <span className="font-medium text-slate-700">{currency(breakdown.winningAmount)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Platform Fee ({breakdown.platformFeePercent}%)</span>
                                <span className="font-medium text-red-600">-{currency(breakdown.platformFee)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Payment Processing Fee</span>
                                <span className="font-medium text-red-600">-{currency(breakdown.paymentProcessingFee)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Other Deductions</span>
                                <span className="font-medium text-red-600">-{currency(breakdown.otherDeductions)}</span>
                            </div>
                            <div className="pt-2 border-t border-slate-200 flex justify-between font-semibold text-[#0B1E3D]">
                                <span>Total Payout</span><span>{currency(totalPayout)}</span>
                            </div>
                        </div>
                        {record.status === 'Completed' && (
                            <div className="mt-4 rounded-lg bg-indigo-50 px-3 py-2 text-[11px] text-indigo-700">
                                The payout has been processed successfully.
                            </div>
                        )}
                    </div>
                </div>

                {/* Middle column */}
                <div className="space-y-6">

                    {/* Bank Details */}
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="mb-4 text-sm font-semibold text-[#0B1E3D]">Bank Details</h3>
                        <div className="space-y-2 text-[12px]">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Account Holder Name</span>
                                <span className="font-medium text-slate-700">{record.bankDetails.accountHolderName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Bank Name</span>
                                <span className="font-medium text-slate-700">{record.bankDetails.bankName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Account Number</span>
                                <span className="font-medium text-slate-700">{record.bankDetails.accountNumber}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">IBAN</span>
                                <span className="font-medium text-slate-700">{record.bankDetails.iban}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Swift Code</span>
                                <span className="font-medium text-slate-700">{record.bankDetails.swiftCode}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Currency</span>
                                <span className="font-medium text-slate-700">{record.bankDetails.currency}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payout Timeline */}
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="mb-4 text-sm font-semibold text-[#0B1E3D]">Payout Timeline</h3>
                        <div className="space-y-4">
                            {PAYOUT_STEPS.map((step, i) => {
                                const failedHere = record.status === 'Failed' && i === 0; // Failed always shown failing at first incomplete step
                                const completedIndex = record.status === 'Failed' ? 0 : STATUS_STEP_INDEX[record.status];
                                const isDone = i <= completedIndex && record.status !== 'Failed';
                                const isFailedStep = record.status === 'Failed' && i === 1; // fails at "Under Review" stage — adjust if wrong
                                return (
                                    <div 
                                    key={step} 
                                    className="flex items-start gap-3">
                                        <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full 
                                            ${isFailedStep ? 'bg-red-100' : isDone ? 'bg-green-100' : 'bg-slate-100'}`}>
                                            {isFailedStep ? <X size={12} className="text-red-600" /> : isDone ? <Check size={12} className="text-green-600" /> : null}
                                        </div>
                                        <div>
                                            <p className={`text-[12px] font-medium ${isFailedStep ? 'text-red-700' : isDone ? 'text-[#0B1E3D]' : 'text-slate-400'}`}>{step}</p>
                                            {i === 0 && <p className="text-[11px] text-slate-400">{record.date}, {record.time}</p>}
                                            {i === 3 && isDone && <p className="text-[11px] text-slate-400">{record.completedDate}, {record.completedTime}</p>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right column */}
                <div className="space-y-6">
                    
                    {/* Documents */}
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="mb-4 text-sm font-semibold text-[#0B1E3D]">Documents</h3>
                        <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                            <div className="flex items-center gap-3">
                                <FileText size={20} className="text-red-500" />
                                <div>
                                    <p className="text-[12px] font-medium text-slate-700">{record.document.name}</p>
                                    <p className="text-[11px] text-slate-400">{record.document.type} • {record.document.size}</p>
                                </div>
                            </div>
                            <button onClick={() => console.log('Download document')} className="text-slate-400 hover:text-[#D97706]">
                                <Download size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="mb-2 text-sm font-semibold text-[#0B1E3D]">Notes</h3>
                        <p className="text-[12px] text-slate-500">{record.notes}</p>
                        <p className="mt-2 text-[11px] text-slate-400">Created by {record.createdBy}</p>
                    </div>

                    {/* Actions */}
                    {actionConfig && (
                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                            <h3 className="mb-3 text-sm font-semibold text-[#0B1E3D]">Actions</h3>
                            <button
                                onClick={handleAction}
                                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm transition-all active:scale-95 ${actionConfig.classes}`}
                            >
                                <actionConfig.icon size={16} />
                                <span>{actionConfig.label}</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default PayoutsDetail;
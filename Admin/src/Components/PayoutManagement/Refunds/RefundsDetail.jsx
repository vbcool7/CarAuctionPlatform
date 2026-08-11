
import React from 'react';
import { ChevronRight, Download, CheckCircle, RefreshCw, Mail, User, Clock, FileText, XCircle, Circle } from 'lucide-react';
import { allRefunds } from '../../Data';
import { payoutsList } from '../../Data';

function RefundBreakdown({ record, total }) {
    const { winningAmount, platformFeePercent, platformFee, paymentProcessingFee, otherDeductions } = record.breakdown;
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold text-[#0B1E3D]">Refund Breakdown</h3>
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-slate-500">Winning Amount</span>
                    <span className="font-medium text-slate-700">${winningAmount.toLocaleString()}.00</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-500">Platform Fee ({platformFeePercent}%)</span>
                    <span className="font-medium text-red-500">-${platformFee.toLocaleString()}.00</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-500">Payment Processing Fee</span>
                    <span className="font-medium text-red-500">-${paymentProcessingFee.toLocaleString()}.00</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-500">Other Deductions</span>
                    <span className="text-red-500 font-medium">-${otherDeductions.toLocaleString()}.00</span>
                </div>
            </div>
            <div className="border-t border-slate-100 mt-3 pt-3 flex justify-between">
                <span className="text-sm font-semibold text-[#0B1E3D]">Total Refund</span>
                <span className="text-sm font-semibold text-green-600">${total.toLocaleString()}.00</span>
            </div>
        </div>
    )
}

function RefundsDetail({ refundId, setCurrentPage }) {

    const record = allRefunds.find(r => r.refundId === refundId);

    if (!record) {
        return (
            <div className="p-6">
                <p className="text-sm text-slate-500">Refund not found.</p>
                <button
                    onClick={() => setCurrentPage('refunds')}
                    className="mt-3 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:border-[#D97706] hover:bg-amber-50 hover:text-[#D97706]"
                >
                    <ArrowLeft size={16} />
                    <span>Back to Refunds</span>
                </button>
            </div>
        );
    }

    const originalPayout = payoutsList.find(p => p.payoutId === record.payoutId);
    const total = record.breakdown.winningAmount - record.breakdown.platformFee - record.breakdown.paymentProcessingFee - record.breakdown.otherDeductions;

    const statusClasses = {
        Completed: "bg-green-100 text-green-700",
        Pending: "bg-amber-100 text-amber-700",
        Cancelled: "bg-purple-100 text-purple-700",
        Failed: "bg-red-100 text-red-700"
    }[record.status] || "bg-slate-100 text-slate-600";

    const ACTION_CONFIG = {
        Pending: { label: "Approve Refund", icon: CheckCircle, onClick: () => console.log("Approve refund", record.refundId) },
        Failed: { label: "Retry Refund", icon: RefreshCw, onClick: () => console.log("Retry refund", record.refundId) },
        Cancelled: null,
        Completed: { label: record.userType === "Buyer" ? "Contact Buyer" : "Contact Seller", icon: Mail, onClick: () => console.log("Contact", record.userName) }
    };
    const action = ACTION_CONFIG[record.status];

    const REFUND_STEPS = ["Refund Requested", "Under Review", "Approved", "Refund Processed", "Completed"];
    const reachedCount = record.timeline.length;

    return (
        <div className='pb-6'>
            {/* Header */}
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between pb-6">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3D]">Refund Details</h1>

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
                            onClick={() => setCurrentPage('refunds')}
                            className="cursor-pointer text-slate-500 hover:text-[#D97706] transition-colors">
                            Refunds
                        </span>

                        <span className="mx-1 text-slate-300"><ChevronRight size={16} /></span>
                        <span className="font-medium text-[#D97706]">
                            Refund Detail
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
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm grid grid-cols-2 md:grid-cols-5 gap-6 mb-6">
                <div>
                    <p className="text-[11px] text-slate-500">Refund ID</p>
                    <p className="text-sm font-semibold text-[#0B1E3D]">{record.refundId}</p>
                    <span className={`mt-1 inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${statusClasses}`}>{record.status}</span>
                </div>
                <div>
                    <p className="text-[11px] text-slate-500">Refund Type</p>
                    <p className="text-sm font-semibold text-[#0B1E3D]">{record.refundType}</p>
                    <p className="mt-2 text-[11px] text-slate-500">Refund Amount</p>
                    <p className="text-sm font-semibold text-green-600">${total.toLocaleString()}.00 USD</p>
                </div>
                <div>
                    <p className="text-[11px] text-slate-500">Original Payment Id</p>
                    <p className="text-sm font-semibold text-[#0B1E3D]">{record.payoutId}</p>
                    <p className="mt-2 text-[11px] text-slate-500">Payment Date</p>
                    <p className="text-sm font-semibold text-[#0B1E3D]">{record.date}, {record.time}</p>
                </div>
                <div>
                    <p className="text-[11px] text-slate-500">Refund Method</p>
                    <p className="text-sm font-semibold text-[#0B1E3D]">{record.method}</p>
                    <p className="mt-2 text-[11px] text-slate-500">Transaction ID</p>
                    <p className="text-sm font-semibold text-[#0B1E3D]">{record.transactionId || '—'}</p>
                </div>
                <div>
                    <p className="text-[11px] text-slate-500">Status</p>
                    <span className={`mt-1 inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${statusClasses}`}>{record.status}</span>
                    <p className="mt-2 text-[11px] text-slate-500">Completed Date</p>
                    <p className="text-sm font-semibold text-[#0B1E3D]">{record.status === 'Completed' ? `${record.completedDate}, ${record.completedTime}` : '—'}</p>
                </div>

            </div>

            {/* 3-column grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left column */}
                <div className="space-y-6">
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="mb-4 text-sm font-semibold text-[#0B1E3D]">User / Seller Information</h3>
                        <div className="flex items-center gap-3">
                            <img
                                src={record.avatarUrl}
                                className="h-12 w-12 rounded-full object-cover" />

                            <div>
                                <p className="text-sm font-semibold text-[#0B1E3D]">{record.userName}</p>
                                <p className="text-[11px] text-slate-500">{record.userEmail}</p>
                                <p className="text-[11px] text-slate-500">{record.userPhone}</p>
                            </div>
                        </div>

                        <div className="mt-4 space-y-2 text-[12px]">
                            <div className="flex justify-between">
                                <span className="text-slate-500">User ID</span>
                                <span className='font-medium text-slate-700'>{record.userId}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">User Type</span>
                                <span className='font-medium text-slate-700'>{record.userType}</span>
                            </div>
                            {record.businessName &&
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Business Name</span>
                                    <span className='font-medium text-slate-700'>{record.businessName}</span>
                                </div>
                            }
                            {record.tradeLicenseNo &&
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Trade License No.</span>
                                    <span className='font-medium text-slate-700'>{record.tradeLicenseNo}</span>
                                </div>
                            }
                            <div className="flex justify-between">
                                <span className="text-slate-500">Joined On</span>
                                <span className='font-medium text-slate-700'>{record.joinedOn}</span>
                            </div>
                        </div>
                    </div>
                    <RefundBreakdown record={record} total={total} />
                </div>

                {/* Middle column */}
                <div className="space-y-6">
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="mb-4 text-sm font-semibold text-[#0B1E3D]">
                            Refund Timeline
                        </h3>
                        <div className="space-y-4">
                            {REFUND_STEPS.map((stepLabel, i) => {
                                const done = i < reachedCount;
                                const stuckHere = (record.status === 'Failed' || record.status === 'Cancelled') && i === record.stoppedAtStep;
                                const entry = record.timeline[i];
                                return (
                                    <div
                                        key={stepLabel}
                                        className="flex items-start gap-3">
                                        {stuckHere ? <XCircle size={18} className="text-red-500 mt-0.5" />
                                            : done ? <CheckCircle size={18} className="text-green-500 mt-0.5" />
                                                : <Circle size={18} className="text-slate-300 mt-0.5" />}
                                        <div className="flex-1">
                                            <p className={`text-[14px] font-medium ${done || stuckHere ? 'text-[#0B1E3D]' : 'text-slate-400'}`}>
                                                {stepLabel}
                                            </p>
                                            {entry && <p className="text-[11px] text-slate-500">{entry.date}, {entry.time}</p>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="mb-4 text-sm font-semibold text-[#0B1E3D]">
                            Reason for Refund
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div><p className="text-[11px] text-slate-500">Reason</p><p className="text-[#0B1E3D]">{record.reason || '—'}</p></div>
                            <div><p className="text-[11px] text-slate-500">Details</p><p className="text-[#0B1E3D]">{record.details || '—'}</p></div>
                            <div><p className="text-[11px] text-slate-500">Notes</p><p className="text-[#0B1E3D]">{record.notes || '—'}</p></div>
                        </div>
                    </div>
                </div>

                {/* Right column */}
                <div className="space-y-6">
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="text-sm font-semibold text-[#0B1E3D] mb-4">Payment Details (Original)</h3>
                        {originalPayout ? (
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Payment ID</span>
                                    <span className="font-medium text-slate-700">{originalPayout.payoutId}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Type</span>
                                    <span className="font-medium text-slate-700">{originalPayout.payoutType}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Method</span>
                                    <span className="font-medium text-slate-700">{originalPayout.method}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Paid On</span>
                                    <span className="font-medium text-slate-700">{originalPayout.date}, {originalPayout.time}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Transaction ID</span>
                                    <span className="font-medium text-slate-700">{originalPayout.referenceId}</span>
                                </div>
                            </div>
                        ) : <p className="text-sm text-slate-400">Original payout record not found.</p>}
                    </div>

                    {/* document */}
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="text-sm font-semibold text-[#0B1E3D] mb-4">Documents</h3>
                        <div className="flex items-center gap-3 border border-slate-200 rounded-lg p-3">
                            <FileText size={20} className="text-red-500" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-[#0B1E3D]">{record.document.name}</p>
                                <p className="text-[11px] text-slate-500">{record.document.type} • {record.document.size}</p>
                            </div>
                            <Download size={16} className="text-slate-400 cursor-pointer" />
                        </div>
                    </div>
                    
                    {/* action button */}
                    {action && (
                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                            <h3 className="text-sm font-semibold text-[#0B1E3D] mb-4">Actions</h3>
                            <button onClick={action.onClick} className="flex items-center justify-center gap-2 w-full rounded-lg border border-[#D97706] text-[#D97706] py-2 text-sm font-medium hover:bg-amber-50">
                                <action.icon size={16} /> {action.label}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default RefundsDetail;
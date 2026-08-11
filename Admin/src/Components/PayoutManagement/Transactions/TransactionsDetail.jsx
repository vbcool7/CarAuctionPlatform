
import React from 'react';
import { CheckCircle, ChevronRight, Circle, Download, Landmark, XCircle } from 'lucide-react';
import { allTransactions } from '../../Data';

function TransactionsDetail({ transactionId, setCurrentPage }) {

    const record = allTransactions.find(t => t.transactionId === transactionId);

    if (!record) {
        return (
            <div className="p-6 text-sm text-slate-500">
                Transaction not found.
                <span onClick={() => setCurrentPage('transactions')} className="ml-2 text-[#D97706] cursor-pointer">Back to Transactions</span>
            </div>
        );
    }

    const netAmount = record.amount - record.fees - record.tax;

    const statusClasses = {
        Completed: "bg-green-100 text-green-700",
        Pending: "bg-amber-100 text-amber-700",
        Processing: "bg-blue-100 text-blue-700",
        Failed: "bg-red-100 text-red-700",
        Refunded: "bg-purple-100 text-purple-700"
    }[record.status] || "bg-slate-100 text-slate-600";

    const TXN_STEPS = ["Transaction Initiated", "Payment Processing", "Payment Completed"];
    // Refunded status has no distinct step-set in the mockup — treating as fully completed
    // through all 3 steps for timeline purposes. FLAGGED ASSUMPTION, confirm later.
    const reachedCount =
        record.status === "Completed" || record.status === "Refunded" ? 3 :
            record.status === "Processing" ? 2 :
                record.status === "Failed" ? (record.stoppedAtStep ?? 1) + 1 :
                    1; // Pending

    const stepDescriptions = {
        "Transaction Initiated": "Payout request created",
        "Payment Processing": "Payment is being processed",
        "Payment Completed": "Amount transferred successfully"
    };

    return (
        <div className='pb-6'>
            {/* Header */}
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between pb-6">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3D]">Transaction Details</h1>

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
                            onClick={() => setCurrentPage('transactions')}
                            className="cursor-pointer text-slate-500 hover:text-[#D97706] transition-colors">
                            Transaction
                        </span>

                        <span className="mx-1 text-slate-300"><ChevronRight size={16} /></span>
                        <span className="font-medium text-[#D97706]">
                            Transaction Detail
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
                    <p className="text-[11px] text-slate-500">Transaction ID</p>
                    <p className="text-sm font-semibold text-[#0B1E3D]">{record.transactionId}</p>
                    <span className={`mt-2 inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${statusClasses}`}>{record.status}</span>
                </div>
                <div>   
                    <p className="text-[11px] text-slate-500">Reference ID</p>
                    <p className="text-sm font-semibold text-[#0B1E3D]">{record.referenceId}</p>
                    <p className="mt-2 text-[11px] text-slate-500">Type</p>
                    <p className="text-sm font-semibold text-[#0B1E3D]">{record.transactionType}</p>
                </div>
                <div>
                    <p className="text-[11px] text-slate-500">Date & Time</p>
                    <p className="text-sm font-semibold text-[#0B1E3D]">{record.date}, {record.time}</p>
                    <p className="mt-2 text-[11px] text-slate-500">Completed On</p>
                    <p className="text-sm font-semibold text-[#0B1E3D]">
                        {record.status === 'Completed' ? `${record.completedDate}, ${record.completedTime}` : '—'}
                    </p>
                </div>
                <div>
                    <p className="text-[11px] text-slate-500">Initiated By</p>
                    <div className="flex items-center gap-2 mt-1">
                        <img src={record.avatarUrl} className="w-6 h-6 rounded-full object-cover" />
                        <div>
                            <p className="text-sm font-semibold text-[#0B1E3D] leading-tight">{record.initiatedBy?.name || record.userName}</p>
                            <p className="text-[10px] text-slate-500 leading-tight">{record.initiatedBy?.email || record.userEmail}</p>
                        </div>
                    </div>
                    <p className="mt-2 text-[11px] text-slate-500">User Role</p>
                    <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-100 text-blue-700">{record.userRole || '—'}</span>
                </div>
                <div>
                    <p className="text-[11px] text-slate-500">Amount</p>
                    <p className="text-sm font-semibold text-green-600">${record.amount.toLocaleString()}.00</p>
                    <p className="mt-2 text-[11px] text-slate-500">Fees</p>
                    <p className="text-sm text-[#0B1E3D]">${record.fees.toLocaleString()}.00</p>
                    <p className="mt-2 text-[11px] text-slate-500">Net Amount</p>
                    <p className="text-sm font-semibold text-[#0B1E3D]">${netAmount.toLocaleString()}.00</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left */}
                <div className="space-y-6">
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="text-sm font-semibold text-[#0B1E3D] mb-4">Payment Method</h3>
                        <div className="flex items-center gap-2 mb-3">
                            <Landmark size={16} className="text-[#D97706]" />
                            <span className="font-semibold text-slate-800">{record.method}</span>
                            {record.bankDetails?.accountType && (
                                <span className="ml-auto text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{record.bankDetails.accountType}</span>
                            )}
                        </div>
                        {record.bankDetails ? (
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between"><span className="text-slate-500">Bank Name</span><span>{record.bankDetails.bankName}</span></div>
                                <div className="flex justify-between"><span className="text-slate-500">Account Number</span><span>{record.bankDetails.accountNumber}</span></div>
                                <div className="flex justify-between"><span className="text-slate-500">Account Holder Name</span><span>{record.bankDetails.accountHolderName}</span></div>
                                <div className="flex justify-between"><span className="text-slate-500">IFSC Code</span><span>{record.bankDetails.ifscCode}</span></div>
                                <div className="flex justify-between"><span className="text-slate-500">Branch</span><span>{record.bankDetails.branch}</span></div>
                            </div>
                        ) : <p className="text-sm text-slate-400">No bank account details for this method.</p>}
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="text-sm font-semibold text-[#0B1E3D] mb-4">Description</h3>
                        <p className="text-sm text-[#0B1E3D] mb-2">{record.description || '—'}</p>
                        {record.linkedAuctionLabel && (
                            <span className="inline-block text-[12px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md">{record.linkedAuctionLabel}</span>
                        )}
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-[#0B1E3D]">Notes</h3>
                            <button onClick={() => console.log('add note', record.transactionId)} className="text-[12px] font-medium text-[#D97706] border border-[#D97706] rounded-lg px-2 py-1">Add Note</button>
                        </div>
                        {record.notes?.length ? (
                            <ul className="space-y-2 text-sm">
                                {record.notes.map((n, i) => <li key={i} className="text-[#0B1E3D]">{n}</li>)}
                            </ul>
                        ) : <p className="text-sm text-slate-400">No additional notes for this transaction.</p>}
                    </div>
                </div>

                {/* Middle */}
                <div className="space-y-6">
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="text-sm font-semibold text-[#0B1E3D] mb-4">Transaction Summary</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-slate-500">Amount</span><span>${record.amount.toLocaleString()}.00</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">Fees</span><span>${record.fees.toLocaleString()}.00</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">Tax</span><span>${record.tax.toLocaleString()}.00</span></div>
                        </div>
                        <div className="border-t border-slate-100 mt-3 pt-3 flex justify-between">
                            <span className="text-sm font-semibold text-[#0B1E3D]">Net Amount</span>
                            <span className="text-sm font-semibold text-green-600">${netAmount.toLocaleString()}.00</span>
                        </div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="text-sm font-semibold text-[#0B1E3D] mb-4">Transaction Timeline</h3>
                        <div className="space-y-4">
                            {TXN_STEPS.map((label, i) => {
                                const done = i < reachedCount;
                                const stuckHere = record.status === 'Failed' && i === (record.stoppedAtStep ?? 0);
                                return (
                                    <div key={label} className="flex items-start gap-3">
                                        {stuckHere ? <XCircle size={18} className="text-red-500 mt-0.5" />
                                            : done ? <CheckCircle size={18} className="text-green-500 mt-0.5" />
                                                : <Circle size={18} className="text-slate-300 mt-0.5" />}
                                        <div className="flex-1">
                                            <p className={`text-sm font-medium ${done || stuckHere ? 'text-[#0B1E3D]' : 'text-slate-400'}`}>{label}</p>
                                            <p className="text-[11px] text-slate-500">{stepDescriptions[label]}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right */}
                <div>
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="text-sm font-semibold text-[#0B1E3D] mb-4">Related Information</h3>
                        {record.relatedInfo ? (
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between"><span className="text-slate-500">Auction ID</span><span className="text-[#D97706] flex items-center gap-1">{record.relatedInfo.auctionId} <ExternalLink size={12} /></span></div>
                                <div className="flex justify-between"><span className="text-slate-500">Winning Bid</span><span>${record.relatedInfo.winningBid.toLocaleString()}.00</span></div>
                                <div className="flex justify-between"><span className="text-slate-500">Buyer</span><span className="text-[#D97706] flex items-center gap-1">{record.relatedInfo.buyer} <ExternalLink size={12} /></span></div>
                                <div className="flex justify-between"><span className="text-slate-500">Seller</span><span className="text-[#D97706] flex items-center gap-1">{record.relatedInfo.seller} <ExternalLink size={12} /></span></div>
                                <div className="flex justify-between"><span className="text-slate-500">Vehicle</span><span className="text-[#D97706] flex items-center gap-1">{record.relatedInfo.vehicle} <ExternalLink size={12} /></span></div>
                            </div>
                        ) : (
                            <p className="text-sm text-slate-400 italic">Related information not available — auction data source pending.</p>
                        )}
                    </div>
                </div>
            </div>

        </div>
    )
}

export default TransactionsDetail;
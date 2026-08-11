
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import DatePicker from 'react-datepicker';
import { disputesData } from '../../Data';
import FilterDropdown from '../../SharedComponents/FilterDropdown';

function EditAllDisputes({ allDisputeId, setCurrentPage }) {

    const dispute = disputesData.find(item => item.disputeId === allDisputeId);

    const [selectedPriority, setSelectedPriority] = useState(dispute?.priority);
    const [selectedStatus, setSelectedStatus] = useState(dispute?.status);
    const [assignedTo, setAssignedTo] = useState(dispute?.assignedTo);
    const [slaDeadline, setSlaDeadline] = useState(dispute?.slaDeadline);
    const [refundRequested, setRefundRequested] = useState(dispute?.refundRequested);
    const [department, setDepartment] = useState(dispute?.department);
    const [evidenceRequested, setEvidenceRequested] = useState(dispute?.evidenceRequested);
    const [notes, setNotes] = useState(dispute?.notes || '');
    const [description, setDescription] = useState(dispute?.description || '');


    if (!dispute) return null;

    const statusColors = {
        Open: "bg-blue-50 text-blue-700 border-blue-200",
        "In Review": "bg-amber-50 text-amber-700 border-amber-200",
        Resolved: "bg-green-50 text-green-700 border-green-200",
        Closed: "bg-gray-100 text-gray-600 border-gray-200",
    };

    return (
        <div className="w-full bg-white border border-slate-100 rounded-2xl p-4 sm:p-5 shadow-sm">

            {/* Header */}
            <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <div
                        onClick={() => setCurrentPage("all-disputes")}
                        className="mb-3 inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-slate-600 transition-colors duration-200 hover:text-[#D97706]"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back to Disputes</span>
                    </div>

                    <h3 className="text-xl font-bold text-[#0B1E3D]">
                        Edit Dispute
                    </h3>

                    <p className="mt-1 text-xs sm:text-sm text-gray-600">
                        Update dispute information and details.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <span
                        className={`rounded-full border px-2.5 py-1 text-xs font-medium 
                            ${statusColors[dispute.status] || "border-gray-200 bg-gray-50 text-gray-600"}`}>
                        {dispute.status}
                    </span>

                    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                        <p className="text-[11px] text-gray-500">Dispute ID</p>
                        <p className="text-sm font-semibold text-[#0B1E3D]">
                            {dispute.disputeId}
                        </p>
                    </div>
                </div>
            </div>

            {/* not editable */}
            <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50/60 p-5">

                <div className="mb-4 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-[#D97706]"></div>
                    <h4 className="text-sm font-semibold text-[#0B1E3D]">
                        Dispute Information
                    </h4>
                </div>

                <div className="grid grid-cols-2 gap-x-8 gap-y-5 lg:grid-cols-3">

                    <div>
                        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                            Dispute Type
                        </p>
                        <p className="mt-1 text-[13px] font-semibold text-[#0B1E3D]">
                            {dispute.disputeType || "---"}
                        </p>
                    </div>

                    <div>
                        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                            Order ID
                        </p>
                        <p className="mt-1 font-mono text-[13px] font-semibold text-[#0B1E3D]">
                            {dispute.orderId || "---"}
                        </p>
                    </div>

                    {dispute.auctionId && (
                        <div>
                            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                Auction ID
                            </p>
                            <p className="mt-1 font-mono text-[13px] font-semibold text-[#0B1E3D]">
                                {dispute.auctionId}
                            </p>
                        </div>
                    )}

                    {dispute.vehicle && (
                        <div>
                            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                Vehicle
                            </p>
                            <p className="mt-1 text-[13px] font-semibold text-[#0B1E3D]">
                                {dispute.vehicle}
                            </p>
                        </div>
                    )}

                    <div>
                        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                            Transaction ID
                        </p>
                        <p className="mt-1 font-mono text-[13px] font-semibold text-[#0B1E3D]">
                            {dispute.transactionId || "---"}
                        </p>
                    </div>

                    <div>
                        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                            Payment Method
                        </p>
                        <p className="mt-1 text-[13px] font-semibold text-[#0B1E3D]">
                            {dispute.paymentMethod || "---"}
                        </p>
                    </div>

                    {dispute.finalBidAmount && (
                        <div>
                            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                Final Bid Amount
                            </p>
                            <p className="mt-1 text-[14px] font-bold text-[#0B1E3D]">
                                ${dispute.finalBidAmount}
                            </p>
                        </div>
                    )}

                    <div>
                        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                            Amount
                        </p>
                        <p className="mt-1 text-[14px] font-bold text-[#0B1E3D]">
                            {dispute.amount || "---"}
                        </p>
                    </div>

                    <div>
                        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                            Raised On
                        </p>
                        <p className="mt-1 text-[13px] font-semibold text-[#0B1E3D]">
                            {dispute.raisedOn || "---"}
                        </p>
                    </div>

                </div>
            </div>

            {/* editable fields */}
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6'>

                <div>
                    <label className="block text-[11px] sm:text-[14px] font-semibold text-[#0B1E3D] mb-2">
                        Priority <span className="text-red-600">*</span>
                    </label>
                    <FilterDropdown
                        label="Select Priority"
                        options={[
                            { label: "Low", value: "Low" },
                            { label: "Medium", value: "Medium" },
                            { label: "High", value: "High" },
                        ]}
                        value={selectedPriority}
                        onChange={setSelectedPriority}
                    />
                </div>

                <div>
                    <label className="block text-[11px] sm:text-[14px] font-semibold text-[#0B1E3D] mb-2">
                        Current Status <span className="text-red-600">*</span>
                    </label>
                    <FilterDropdown
                        label="Select Status"
                        options={[
                            { label: "Open", value: "Open" },
                            { label: "Under Review", value: "Under Review" },
                            { label: "Resolved", value: "Resolved" },
                            { label: "Closed", value: "Closed" },
                        ]}
                        value={selectedStatus}
                        onChange={setSelectedStatus}
                    />
                </div>

                <div>
                    <label className="block text-[11px] sm:text-[14px] font-semibold text-[#0B1E3D] mb-2">
                        Assigned To
                    </label>
                    <FilterDropdown
                        label="Select Assign"
                        options={[
                            { label: "Michael Johnson", value: "Michael Johnson" },
                            { label: "Priya Sharma", value: "Priya Sharma" },
                            { label: "Unassigned", value: "Unassigned" },
                        ]}
                        value={assignedTo}
                        onChange={setAssignedTo}
                    />
                </div>

                {/* <div>
                    <label className="block text-[11px] sm:text-[14px] font-semibold text-[#0B1E3D] mb-2">
                        SLA Deadline
                    </label>
                    <input
                        type="datetime-local"
                        value={slaDeadline}
                        onChange={(e) => setSlaDeadline(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0B1E3D] focus:outline-none focus:ring-2 focus:ring-[#D97706]/30"
                    />
                </div> */}

                <div>
                    <label className="block text-[11px] sm:text-[14px] font-semibold text-[#0B1E3D] mb-2">
                        Refund Requested
                    </label>
                    <FilterDropdown
                        label="Select"
                        options={[
                            { label: "Yes", value: "yes" },
                            { label: "No", value: "no" },
                        ]}
                        value={refundRequested}
                        onChange={setRefundRequested}
                    />
                </div>

                <div>
                    <label className="block text-[11px] sm:text-[14px] font-semibold text-[#0B1E3D] mb-2">
                        Department
                    </label>
                    <FilterDropdown
                        label="Select Department"
                        options={[
                            { label: "Payment Team", value: "payment_team" },
                            { label: "Auction Team", value: "auction_team" },
                            { label: "Escalations", value: "escalations" },
                        ]}
                        value={department}
                        onChange={setDepartment}
                    />
                </div>

                <div>
                    <label className="block text-[11px] sm:text-[14px] font-semibold text-[#0B1E3D] mb-2">
                        Evidence Requested
                    </label>
                    <FilterDropdown
                        label="Select"
                        options={[
                            { label: "Yes", value: "Yes" },
                            { label: "No", value: "No" },
                        ]}
                        value={evidenceRequested}
                        onChange={setEvidenceRequested}
                    />
                </div>
            </div>

            {/* sla deadline */}
            <div className='mb-6'>
                <label className="block mb-2 text-[11px] sm:text-[14px] font-semibold text-[#0B1E3D]">
                    SLA Deadline
                </label>
                <div className='grid grid-cols-3 gap-6'>

                    {/* Date */}
                    <div>
                        <label className="mb-1 block text-[11px] font-medium text-slate-500">
                            Date
                        </label>

                        <input
                            type="date"
                            className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm text-[#0B1E3D] focus:border-[#D97706] focus:outline-none focus:ring-2 focus:ring-amber-100"
                        />
                    </div>

                    {/* Time */}
                    <div>
                        <label className="mb-1 block text-[11px] font-medium text-slate-500">
                            Time
                        </label>

                        <input
                            type="time"
                            className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm text-[#0B1E3D] focus:border-[#D97706] focus:outline-none focus:ring-2 focus:ring-amber-100"
                        />
                    </div>
                </div>
            </div>

            {/* Dispute Description */}
            <div className="mb-6">
                <div className="mb-2 flex items-center justify-between">
                    <label className="text-[11px] sm:text-[14px] font-semibold text-[#0B1E3D]">
                        Dispute Description <span className="text-red-600">*</span>
                    </label>

                    <span className="text-[11px] text-slate-400">
                        {description.length}/1000
                    </span>
                </div>

                <p className="mb-2 text-xs text-slate-500">
                    Describe the dispute in detail.
                </p>

                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={1000}
                    rows={4}
                    placeholder="Enter dispute description..."
                    className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-[#0B1E3D] placeholder:text-slate-400 focus:border-[#D97706] focus:outline-none focus:ring-2 focus:ring-amber-100"
                />
            </div>

            {/* Internal Notes */}
            <div className="mb-6">
                <div className="mb-2 flex items-center justify-between">
                    <label className="text-[11px] sm:text-[14px] font-semibold text-[#0B1E3D]">
                        Internal Notes
                    </label>

                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                        Internal Only
                    </span>
                </div>

                <p className="mb-2 text-xs text-slate-500">
                    These notes are visible only to administrators.
                </p>

                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    maxLength={1000}
                    rows={3}
                    className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-[#0B1E3D] placeholder:text-slate-400 focus:border-[#D97706] focus:outline-none focus:ring-2 focus:ring-amber-100"
                    placeholder="Add internal notes..."
                />
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3">
                <button
                    onClick={() => setCurrentPage("all-disputes")}
                    className="py-2 px-5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                    Cancel
                </button>
                <button
                    onClick={() => {
                        setCurrentPage("all-disputes");
                    }}
                    className="py-2 px-5 rounded-lg bg-[#D97706] text-sm font-medium text-white hover:bg-amber-700"
                >
                    Save Changes
                </button>
            </div>
        </div>
    )
}

export default EditAllDisputes;
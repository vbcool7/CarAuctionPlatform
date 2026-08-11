
import React, { useState } from 'react';
import { ArrowLeft, ChevronRight, FileText, ArrowUp, CalendarDays, Check, Upload, Download, Calendar, Eye, AlertCircle, Paperclip, RefreshCw } from 'lucide-react';
import { disputesData } from '../../Data';
import { FaFilePdf } from 'react-icons/fa';
import FilterDropdown from '../../SharedComponents/FilterDropdown';

const getDisputeTimeline = (dispute) => {
    const { status, raisedOn, reviewedDate, respondedDate, resolvedOn } = dispute;

    return [
        {
            id: 'raised',
            label: 'Dispute Raised',
            date: raisedOn,
            description: dispute.raisedDescription || 'Buyer raised a dispute.',
            state: 'done',
        },
        {
            id: 'under_review',
            label: 'Under Review',
            date: reviewedDate || null,
            description: 'Dispute is assigned to support team for review.',
            state: status === 'Open' ? 'pending' : 'done',
        },
        {
            id: 'awaiting_response',
            label: 'Awaiting Response',
            date: respondedDate || null,
            description: dispute.awaitingDescription || 'Waiting for response from the other party.',
            state:
                status === 'Open' ? 'na' :
                    status === 'Under Review' ? 'active' : 'done',
        },
        {
            id: 'resolved',
            label: 'Resolved',
            date: resolvedOn || null,
            description: dispute.resolutionDescription || '',
            state: status === 'Resolved' ? 'done' : 'pending',
        },
    ];
};

const DisputeTimeline = ({ dispute }) => {
    const steps = getDisputeTimeline(dispute);

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-sm font-bold text-[#0B1E3D]">Dispute Timeline</h3>
                    <p className="text-xs text-slate-500 mt-1">Track the progress and status of this dispute</p>
                </div>

                <button className="text-xs font-semibold text-[#D97706] hover:text-[#B45309] transition-colors">
                    View Full Timeline
                </button>
            </div>

            <div className="space-y-0">
                {steps
                    .filter(step => step.state !== 'na')
                    .map((step, idx, arr) => (
                        <div
                            key={step.id}
                            className="flex gap-4 relative">

                            {/* Connector */}
                            {idx !== arr.length - 1 && (
                                <div className="absolute left-2.25 top-6 w-px h-[calc(100%-4px)] bg-slate-200" />
                            )}

                            {/* Status Icon */}
                            <div className="relative z-10 shrink-0">
                                {step.state === 'done' && (
                                    <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center ring-4 ring-emerald-50">
                                        <Check size={11} className="text-white" strokeWidth={3} />
                                    </div>
                                )}

                                {step.state === 'active' && (
                                    <div className="w-5 h-5 rounded-full bg-[#D97706] ring-4 ring-amber-50" />
                                )}

                                {step.state === 'pending' && (
                                    <div className="w-5 h-5 rounded-full border-2 border-slate-300 bg-white ring-4 ring-slate-50" />
                                )}
                            </div>

                            {/* Content */}
                            <div className={`flex-1 ${idx !== arr.length - 1 ? 'pb-7' : 'pb-1'}`}>
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className={`text-sm font-semibold ${step.state === 'pending'
                                        ? 'text-slate-400'
                                        : 'text-[#0B1E3D]'
                                        }`}>
                                        {step.label}
                                    </span>

                                    {step.date && (
                                        <span className="text-[11px] text-slate-400">{step.date}</span>
                                    )}

                                    {!step.date && step.state === 'active' && (
                                        <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-[10px] font-semibold">Pending</span>
                                    )}
                                </div>

                                {step.description && (
                                    <p className="text-xs text-slate-500 mt-1.5 leading-5">{step.description}</p>
                                )}
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

const DisputeMessagesTab = ({ dispute }) => {
    const [message, setMessage] = useState('');

    const avatarStyle = (senderType) => {
        if (senderType === 'buyer') return 'bg-violet-100 text-violet-700';
        if (senderType === 'seller') return 'bg-emerald-100 text-emerald-700';
        return 'bg-amber-100 text-amber-700';
    };

    const senderLabel = (senderType) => {
        if (senderType === 'buyer') return 'Buyer';
        if (senderType === 'seller') return 'Seller';
        return 'Support';
    };

    const initials = (name) => name.split(' ').map(w => w[0]).join('').slice(0, 2);

    const handleSend = () => {
        if (!message.trim()) return;
        console.log('New message from Support Agent:', message);
        setMessage('');
    };

    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

            {/* Header */}
            <div className="p-5 border-b border-slate-100">
                <h3 className="text-sm font-bold text-[#0B1E3D]">
                    Dispute Messages
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                    Communication between the buyer, seller and support team
                </p>
            </div>

            {/* Messages */}
            <div className="p-5">
                <div className="space-y-5 max-h-80 overflow-y-auto pr-2 no-scrollbar">
                    {dispute.messages?.map((msg) => (
                        <div key={msg.id} className="flex gap-3">

                            {/* Avatar */}
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${avatarStyle(msg.senderType)}`}>
                                {initials(msg.senderName)}
                            </div>

                            {/* Message */}
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-[13px] font-semibold text-[#0B1E3D]">
                                        {msg.senderName}
                                    </span>

                                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${avatarStyle(msg.senderType)}`}>
                                        {senderLabel(msg.senderType)}
                                    </span>

                                    <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                                </div>

                                <div className="mt-1.5 rounded-lg bg-slate-50 border border-slate-100 px-3 py-2.5">
                                    <p className="text-xs leading-5 text-slate-600">{msg.text}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Send Message */}
                <div className="mt-5 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type your message..."
                            className="flex-1 min-w-0 border border-slate-200 rounded-lg px-3 py-2.5 text-xs text-slate-700 outline-none transition focus:border-[#D97706] focus:ring-2 focus:ring-amber-100"
                        />

                        <button
                            onClick={handleSend}
                            className="px-4 py-2.5 rounded-lg bg-[#D97706] text-white text-xs font-semibold hover:bg-[#B45309] transition-colors">
                            Send
                        </button>
                    </div>

                    <p className="text-[10px] text-slate-400 mt-2">Press Enter to send your message</p>
                </div>
            </div>
        </div>
    );
};

// helper - dispute info
const Row = ({ label, value, link = false, badge = false }) => {
    if (value === undefined || value === null || value === '') return null;

    return (
        <div className="flex items-center text-[12px]">
            <span className="w-36 shrink-0 text-slate-500">{label}</span>
            <span className="mr-2 text-slate-400">:</span>

            {badge ? (
                <span className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold 
                    ${value === 'High' || value === 'Open'
                        ? 'bg-red-50 text-red-600'
                        : value === 'Medium' || value === 'Under Review'
                            ? 'bg-amber-50 text-amber-600'
                            : value === 'Low' || value === 'Resolved'
                                ? 'bg-emerald-50 text-emerald-600'
                                : 'bg-slate-50 text-slate-600'
                    }`}>
                    {value}
                </span>
            ) : link ? (
                <span className="font-medium text-[#D97706] hover:underline cursor-pointer truncate">
                    {value}
                </span>
            ) : (
                <span className="font-medium text-slate-800 truncate">{value}</span>
            )}
        </div>
    );
};

const DisputeInformationTab = ({ dispute }) => {
    return (
        <div className="space-y-6">

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">

                <div className='mb-8'>
                    <h3 className="text-sm font-bold text-[#0B1E3D] mb-2">Dispute Summary</h3>
                    <p className="text-xs text-slate-600 leading-5">{dispute.summary || '---'}</p>
                </div>

                <h3 className="text-sm font-bold text-[#0B1E3D] mb-4">Dispute Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                    <div className="space-y-3">
                        <Row label="Dispute ID" value={dispute.disputeId} />
                        <Row label="Order ID" value={dispute.orderId} link />
                        <Row label="Auction ID" value={dispute.auctionId} link />
                        <Row label="Vehicle" value={dispute.vehicle} />
                        <Row label="Final Bid Amount" value={dispute.finalBidAmount} />
                        <Row label="Transaction ID" value={dispute.transactionId} link />
                        <Row label="Payment Method" value={dispute.paymentMethod} />
                        <Row label="Payment Date" value={dispute.paymentDate} />
                        <Row label="Dispute Type" value={dispute.disputeType} />
                        <Row label="Refund Requested" value={dispute.refundRequested} />
                    </div>
                    <div className="space-y-3">
                        <Row label="Current Status" value={dispute.status} badge />
                        <Row label="Priority" value={dispute.priority} badge />
                        <Row label="Department" value={dispute.department} />
                        <Row label="Assigned To" value={dispute.assignedTo?.name} />
                        <Row label="SLA Deadline" value={dispute.slaDeadline} />
                        <Row label="Last Updated" value={`${dispute.date} ${dispute.time}`} />
                    </div>
                </div>
            </div>

            {/* Dispute Description */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <h3 className="text-sm font-bold text-[#0B1E3D] mb-2">Dispute Description</h3>
                <p className="text-xs text-slate-600 leading-5">"{dispute.description}"</p>
                <p className="text-xs text-slate-400 mt-2">— {dispute.buyer?.name} (Buyer)</p>
            </div>
        </div>
    );
};

// helper - evidence
const EvidenceSection = ({ title, initials, files, colorClass, bgClass, internalOnly = false }) => {
    if (!files || files.length === 0) return null;

    return (
        <div className={`${bgClass} border border-slate-200 rounded-xl p-4`}>
            <div className='flex items-center gap-2 mb-3'>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${colorClass}`}>
                    {initials}
                </div>
                <h3 className='text-sm font-bold text-[#0B1E3D]'>{title} ({files.length})</h3>
            </div>

            <div className='space-y-2'>
                {files.map((file) => (
                    <div
                        key={file.id}
                        className='flex justify-between items-center bg-white p-3 shadow-sm border border-slate-100 rounded-lg hover:scale-102 transition-all duration-300'>
                        <div className='flex gap-2 items-center min-w-0 '>
                            <FaFilePdf className='text-xl text-red-500 shrink-0' />
                            <div className='min-w-0'>
                                <h4 className='text-sm text-slate-800 truncate'>{file.name}</h4>
                                <p className='text-xs text-gray-500'>Uploaded on {file.uploadedOn}</p>
                            </div>
                        </div>

                        <div className='flex items-center gap-4 shrink-0'>
                            <span className='text-xs text-gray-500'>{file.size}</span>
                            <button onClick={() => console.log('download', file.name)}>
                                <Download className='w-4 h-4 text-gray-600 hover:text-[#D97706]' />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {internalOnly && (
                <div className='mt-3 flex items-center gap-2'>
                    <span className='px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-[10px] font-semibold'>Internal use only</span>
                    <span className='text-[11px] text-slate-500'>Visible only to admin and dispute team</span>
                </div>
            )}
        </div>
    );
};

const DisputeEvidenceTab = ({ dispute }) => {
    return (
        <div className='space-y-6 p-5 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden'>
            <div className='flex justify-between items-center'>
                <div>
                    <h3 className="text-sm font-bold text-[#0B1E3D]">Evidence</h3>
                    <p className="text-xs text-slate-600 leading-5 mt-1">All documents and files submitted as evidence for this dispute.</p>
                </div>
                <button className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-transparent px-2 py-1.5 font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-[#D97706] hover:text-[#D97706] hover:bg-amber-50">
                    <Upload size={16} />
                    <span className="text-[13px]">Upload Evidence</span>
                </button>
            </div>

            <EvidenceSection
                title="Buyer Evidence"
                initials={dispute.buyer?.name.split(' ').map(w => w[0]).join('')}
                files={dispute.evidence?.buyer}
                colorClass="bg-violet-100 text-violet-700"
                bgClass="bg-violet-50/40"
            />

            <EvidenceSection
                title="Seller Evidence"
                initials={dispute.seller?.name.split(' ').map(w => w[0]).join('')}
                files={dispute.evidence?.seller}
                colorClass="bg-emerald-100 text-emerald-700"
                bgClass="bg-emerald-50/40"
            />

            <EvidenceSection
                title="Admin / Internal Evidence"
                initials={dispute.assignedTo?.name.split(' ').map(w => w[0]).join('') || 'A'}
                files={dispute.evidence?.admin}
                colorClass="bg-amber-100 text-amber-700"
                bgClass="bg-amber-50/40"
                internalOnly
            />
        </div>
    );
};

const DisputeResolutionTab = ({ dispute }) => {

    const [selectedStatus, setSelectedStatus] = useState();
    const [selectedType, setSelectedType] = useState();
    const [selectedOutcome, setSelectedOutCome] = useState();
    const [selectedResolved, setSelectedResolved] = useState();

    const [form, setForm] = useState({
        status: '',
        type: '',
        summary: '',
        amount: '',
        outcome: '',
        notes: '',
        resolvedBy: '',
        resolutionDate: '',
    });

    const update = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

    return (
        <div className='space-y-6 p-5 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden'>
            <div>
                <h3 className="text-sm font-bold text-[#0B1E3D]">Resolution</h3>
                <p className="text-xs text-slate-600 leading-5 mt-1">Update resolution details and final outcome of this dispute.</p>
            </div>

            {/* status / type */}
            <div className='grid grid-cols-2 gap-6'>
                <div>
                    <label className="block text-[11px] sm:text-[14px] font-semibold text-[#0B1E3D] mb-2">
                        Resolution Status <span className="text-red-600">*</span>
                    </label>
                    <FilterDropdown
                        label="Select Resolution Status"
                        options={[
                            { label: "Pending", value: "pending" },
                            { label: "Resolved", value: "resolved" },
                            { label: "Rejected", value: "rejected" },
                        ]}
                        value={selectedStatus}
                        onChange={setSelectedStatus}
                    />
                </div>

                <div>
                    <label className="block text-[11px] sm:text-[14px] font-semibold text-[#0B1E3D] mb-2">
                        Resolution Type <span className="text-red-600">*</span>
                    </label>
                    <FilterDropdown
                        label="Select Resolution Type"
                        options={[
                            { label: "Refund", value: "refund" },
                            { label: "Partial Refund", value: "partial_refund" },
                            { label: "No Action", value: "no_action" },
                        ]}
                        value={selectedType}
                        onChange={setSelectedType}
                    />
                </div>
            </div>

            {/* summary */}
            <div>
                <label className="block text-[11px] sm:text-[14px] font-semibold text-[#0B1E3D] mb-2">
                    Resolution Summary <span className="text-red-600">*</span>
                </label>
                <p className="text-xs text-slate-500 mb-2">Provide a brief summary of how this dispute was resolved.</p>

                <textarea
                    rows="4"
                    maxLength={1000}
                    value={form.summary}
                    onChange={update('summary')}
                    placeholder="Enter resolution summary..."
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none resize-none transition-all focus:border-[#D97706] focus:ring-2 focus:ring-amber-100"
                />
                <div className="flex justify-end mt-1">
                    <span className="text-[11px] text-slate-400">{form.summary.length} / 1000</span>
                </div>
            </div>

            {/* amount / outcome */}
            <div className='grid grid-cols-2 gap-6'>
                <div>
                    <label className="block text-[11px] sm:text-[14px] font-semibold text-[#0B1E3D] mb-2">
                        Resolution Amount (if any)
                    </label>
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden focus-within:border-[#D97706] focus-within:ring-2 focus-within:ring-amber-100">
                        <span className="px-3 text-slate-400 text-[13px]">$</span>
                        <input
                            type="number"
                            value={form.amount}
                            onChange={update('amount')}
                            placeholder="0.00"
                            className="flex-1 h-10 text-[13px] text-slate-700 outline-none pr-2"
                        />
                        <span className="px-3 text-slate-400 text-[11px] border-l border-slate-200 h-full flex items-center">USD</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">Amount to be refunded or paid (if applicable)</p>
                </div>

                <div>
                    <label className="block text-[11px] sm:text-[14px] font-semibold text-[#0B1E3D] mb-2">
                        Outcome <span className="text-red-600">*</span>
                    </label>
                    <FilterDropdown
                        label="Select Outcome"
                        options={[
                            { label: "In Favor of Buyer", value: "buyer_favor" },
                            { label: "In Favor of Seller", value: "seller_favor" },
                            { label: "Mutual Agreement", value: "mutual" },
                        ]}
                        value={selectedOutcome}
                        onChange={setSelectedOutCome}
                    />

                    <p className="text-[11px] text-slate-400 mt-1">Final outcome for this dispute</p>
                </div>
            </div>

            {/* notes */}
            <div>
                <label className="block text-[11px] sm:text-[14px] font-semibold text-[#0B1E3D] mb-2">
                    Resolution Notes
                </label>
                <p className="text-xs text-slate-500 mb-2">Add internal notes or remarks about this resolution.</p>

                <textarea
                    rows="3"
                    maxLength={1000}
                    value={form.notes}
                    onChange={update('notes')}
                    placeholder="Enter internal notes..."
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none resize-none transition-all focus:border-[#D97706] focus:ring-2 focus:ring-amber-100"
                />
                <div className="flex justify-end mt-1">
                    <span className="text-[11px] text-slate-400">{form.notes.length} / 1000</span>
                </div>
            </div>

            {/* resolved by / date */}
            <div className='grid grid-cols-2 gap-6'>
                <div>
                    <label className="block text-[11px] sm:text-[14px] font-semibold text-[#0B1E3D] mb-2">
                        Resolved By <span className="text-red-600">*</span>
                    </label>
                    <FilterDropdown
                        label="Select Admin"
                        options={[
                            { label: "Admin User", value: "admin_user" },
                            { label: "Michael Johnson", value: "michael_johnson" },
                            { label: "Sarah Wilson", value: "sarah_wilson" },
                            { label: "Emily Carter", value: "emily_carter" },
                        ]}
                        value={selectedResolved}
                        onChange={setSelectedResolved}
                    />
                </div>

                <div>
                    <label className="block text-[11px] sm:text-[14px] font-semibold text-[#0B1E3D] mb-2">
                        Resolution Date <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type="datetime-local"
                            value={form.resolutionDate}
                            onChange={update('resolutionDate')}
                            className="w-full h-10 rounded-lg border border-slate-200 pl-9 pr-3 text-[13px] text-slate-700 outline-none transition-all focus:border-[#D97706] focus:ring-2 focus:ring-amber-100"
                        />
                        <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                </div>
            </div>
        </div>
    );
};

// helper - history
const activityIconMap = {
    created: { icon: FileText, bg: 'bg-emerald-100', color: 'text-emerald-600' },
    under_review: { icon: Eye, bg: 'bg-blue-100', color: 'text-blue-600' },
    evidence_requested: { icon: AlertCircle, bg: 'bg-amber-100', color: 'text-amber-600' },
    evidence_submitted: { icon: Paperclip, bg: 'bg-violet-100', color: 'text-violet-600' },
    awaiting_response: { icon: RefreshCw, bg: 'bg-amber-100', color: 'text-amber-600' },
    status_updated: { icon: Check, bg: 'bg-emerald-100', color: 'text-emerald-600' },
};

const DisputeHistoryTab = ({ dispute }) => {
    const log = dispute.activityLog || [];

    return (
        <div className='space-y-6 bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 p-5'>
            <div>
                <h3 className="text-sm font-bold text-[#0B1E3D]">History</h3>
                <p className="text-xs text-slate-600 leading-5 mt-1">Complete log of all activities and updates related to this dispute.</p>
            </div>

            <div className=''>
                {log.map((entry) => {
                    const cfg = activityIconMap[entry.type] || activityIconMap.status_updated;
                    const Icon = cfg.icon;

                    return (
                        <div key={entry.id} className='flex items-start justify-between gap-4 py-4'>
                            <div className='flex items-start gap-3 min-w-0'>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${cfg.bg} ${cfg.color}`}>
                                    <Icon size={15} />
                                </div>
                                <div className='min-w-0'>
                                    <p className='text-sm font-semibold text-[#0B1E3D]'>{entry.title}</p>
                                    <p className='text-xs text-slate-500 mt-0.5'>{entry.description}</p>
                                </div>
                            </div>

                            <div className='text-right shrink-0'>
                                <p className='text-xs text-slate-500'>{entry.timestamp}</p>
                                <p className='text-[11px] text-slate-400 mt-0.5'>by {entry.actor}</p>
                            </div>
                        </div>
                    );
                })}

                {log.length === 0 && (
                    <p className='text-xs text-slate-400 p-4 text-center'>No activity recorded yet.</p>
                )}
            </div>
        </div>
    );
};

function AllDisputesDetail({ allDisputeId, setCurrentPage }) {

    const dispute = disputesData.find(item => item.disputeId === allDisputeId);

    if (!dispute) return null;

    const [activeTab, setActiveTab] = useState("dispute-information");

    // tabs
    const tabs = [
        { id: 'dispute-information', label: 'Dispute Information' },
        { id: 'communication', label: 'Communication' },
        { id: 'evidence', label: 'Evidence' },
        { id: 'resolution', label: 'Resolution' },
        { id: 'history', label: 'History' },
    ];

    return (
        <div className='space-y-6'>
            {/* Header */}
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3D]">Dispute Details</h1>

                    <div className="mt-2 flex items-center text-[11px] md:text-[13px]">
                        <span
                            onClick={() => setCurrentPage("dashboard")}
                            className="cursor-pointer text-slate-500 hover:text-[#D97706] transition-colors">
                            Dashboard
                        </span>

                        <span className="mx-1 text-slate-300"><ChevronRight size={16} /></span>
                        <span className=" text-slate-500">Dispute Management</span>

                        <span className="mx-1 text-slate-300"><ChevronRight size={16} /></span>
                        <span
                            onClick={() => setCurrentPage('all-disputes')}
                            className="cursor-pointer text-slate-500 hover:text-[#D97706] transition-colors">
                            All Disputes
                        </span>

                        <span className="mx-1 text-slate-300"><ChevronRight size={16} /></span>
                        <span className="font-medium text-[#D97706]">
                            Dispute Detail
                        </span>
                    </div>
                </div>

                {/* btns */}
                <div className="">
                    <button
                        onClick={() => setCurrentPage('all-disputes')}
                        className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-transparent p-2 font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-[#D97706] hover:text-[#D97706] hover:bg-amber-50">
                        <ArrowLeft size={16} />
                        <span className="text-[13px]">Back to Disputes</span>
                    </button>
                </div>
            </div>

            {/* top gateway header */}
            <div className="bg-white border border-slate-200 rounded-xl px-5 py-3 shadow-sm">
                <div className='flex gap-6 items-center'>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[11px] md:text-[13px] text-slate-500">
                        <span>
                            Dispute ID:{' '}
                            <strong className="text-slate-700">
                                {dispute?.disputeId}
                            </strong>
                        </span>

                        <span className="text-slate-300 hidden sm:block">|</span>

                        <span>
                            Raised on:{' '}
                            <strong className="text-slate-700">
                                {dispute?.raisedOn}
                            </strong>
                        </span>

                        {dispute?.status === "Resolved" && (
                            <>
                                <span className="text-slate-300 hidden sm:block">|</span>
                                <span>
                                    Resolved on:{' '}
                                    <strong className="text-slate-700">
                                        {dispute?.resolveOn}
                                    </strong>
                                </span>
                            </>
                        )}

                        <span className="text-slate-300 hidden sm:block">|</span>

                        <span>
                            Last Updated:{' '}
                            <strong className="text-slate-700">
                                {dispute?.date} {dispute?.time}
                            </strong>
                        </span>
                    </div>

                    <div className="flex items-center gap-2">

                        <span className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-semibold ${dispute?.status === "Under Review"
                            ? "bg-blue-50 text-blue-600"
                            : dispute?.status === "Open"
                                ? "bg-amber-50 text-amber-600"
                                : "bg-emerald-50 text-emerald-600"
                            }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${dispute?.status === "Under Review"
                                ? "bg-blue-500"
                                : dispute?.status === "Open"
                                    ? "bg-amber-500"
                                    : "bg-emerald-500"
                                }`} />
                            {dispute?.status}
                        </span>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:grid-cols-5">

                {/* Dispute Type */}
                <div className="flex items-center gap-3 border-b border-slate-200 p-4 md:border-b-0 md:border-r">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                        <FileText size={18} />
                    </div>
                    <div>
                        <p className="text-[11px] font-medium text-slate-500">Dispute Type</p>

                        <div className="mt-1 flex items-center gap-1.5">
                            <p className="text-[13px] font-semibold text-[#0B1E3D]">{dispute.disputeType || '---'}</p>
                        </div>
                    </div>
                </div>

                {/* Priority */}
                <div className="flex items-center gap-3 border-b border-slate-100 p-4 md:border-b-0 md:border-r">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-500">
                        <ArrowUp size={18} />
                    </div>
                    <div>
                        <p className="text-[11px] font-medium text-slate-500">Priority</p>
                        <span className={`mt-1 inline-flex rounded-md py-0.5 text-[12px] font-semibold 
                        ${dispute.priority === 'High' ? 'bg-red-50 text-red-600' :
                                dispute.priority === 'Medium' ? 'bg-amber-50 text-amber-600' :
                                    'bg-slate-50 text-slate-600'
                            }`}>
                            {dispute.priority}
                        </span>

                    </div>
                </div>

                {/* Raised By */}
                <div className="flex items-center gap-3 border-b border-slate-100 p-4 md:border-b-0 md:border-r">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-[12px] font-bold text-violet-600">JD</div>
                    <div>
                        <p className="text-[11px] font-medium text-slate-500">Raised By</p>
                        <p className="text-[13px] font-semibold text-[#0B1E3D]">John Doe</p>
                        <p className="text-[11px] font-medium text-violet-600">Buyer</p>
                    </div>
                </div>

                {/* Against */}
                <div className="flex items-center gap-3 border-b border-slate-100 p-4 md:border-b-0 md:border-r">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-[12px] font-bold text-green-700">SB</div>
                    <div>
                        <p className="text-[11px] font-medium text-slate-500">Against</p>
                        <p className="text-[13px] font-semibold text-[#0B1E3D]">Sarah Brown</p>
                        <p className="text-[11px] font-medium text-green-600">Seller</p>
                    </div>
                </div>

                {/* Amount */}
                <div className="flex flex-col justify-center p-4">
                    <p className="text-[11px] font-medium text-slate-500">Amount</p>
                    <p className="mt-1 text-lg font-bold text-[#0B1E3D]">{dispute.amount}</p>
                    <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500">
                        <CalendarDays size={14} />
                        <span>{dispute.date} • {dispute.time}</span>
                    </div>
                </div>
            </div>

            {/* main section */}
            <div className="mt-5 grid grid-cols-1 xl:grid-cols-3 pb-6 gap-6 items-start">

                {/* left side */}
                <div className="lg:col-span-2 space-y-6">

                    {/* tabs */}
                    <div className="flex gap-10 border-b border-slate-100 my-6 overflow-x-auto no-scrollbar">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`pb-3 text-[14px] font-medium whitespace-nowrap border-b-2 transition-colors 
                            ${activeTab === tab.id
                                        ? 'border-[#D97706] text-[#D97706]'
                                        : 'border-transparent text-slate-500 hover:text-slate-700'
                                    }`}>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="">
                        {activeTab === 'dispute-information' && <DisputeInformationTab dispute={dispute} />}
                        {activeTab === 'communication' && <DisputeMessagesTab dispute={dispute} />}
                        {activeTab === 'evidence' && <DisputeEvidenceTab dispute={dispute} />}
                        {activeTab === 'resolution' && <DisputeResolutionTab dispute={dispute} />}
                        {activeTab === 'history' && <DisputeHistoryTab dispute={dispute} />}
                    </div>

                </div>

                {/* right side */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">

                    {/* timeline */}
                    <DisputeTimeline dispute={dispute} />

                    {/* Parties Involved */}
                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                        <h3 className="text-sm font-semibold text-slate-800 mb-4">Parties Involved</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-semibold shrink-0">
                                    {dispute.buyer?.name.split(' ').map(w => w[0]).join('')}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 ">
                                        <span className="text-[13px] font-medium text-slate-800">{dispute.buyer?.name}</span>
                                        <span className="text-[11px] bg-violet-50 text-violet-600 px-2 py-0.5 rounded-full font-medium">Buyer</span>
                                    </div>
                                    <div className="text-xs text-slate-500">{dispute.buyer?.email}</div>
                                    <div className="text-xs text-slate-500">{dispute.buyer?.phone}</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-semibold shrink-0">
                                    {dispute.seller?.name.split(' ').map(w => w[0]).join('')}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[13px] font-medium text-slate-800">{dispute.seller?.name}</span>
                                        <span className="text-[11px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-medium">Seller</span>
                                    </div>
                                    <div className="text-xs text-slate-500">{dispute.seller?.email}</div>
                                    <div className="text-xs text-slate-500">{dispute.seller?.phone}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* footer buttons */}
            <div className="w-full flex justify-between items-center gap-4 font-sans pb-6">
                <button
                    type="button"
                    className="cursor-pointer px-5 py-2.5 text-sm font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition-all duration-200"
                >
                    Close Dispute
                </button>

                <div className="flex gap-6">
                    <button
                        type="button"
                        className="cursor-pointer px-5 py-2.5 text-sm font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition-all duration-200"
                    >
                        Request More Info
                    </button>

                    <button
                        type="button"
                        className="cursor-pointer px-5 py-2.5 text-sm font-semibold text-white bg-[#D97706] rounded-lg shadow-md shadow-blue-600/20 hover:bg-amber-700 active:scale-95 transition-all duration-200"
                    >
                        Resolve Dispute
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AllDisputesDetail;
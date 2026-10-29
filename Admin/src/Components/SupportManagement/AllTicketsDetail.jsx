
import React from 'react';
import { ChevronRight, ArrowLeft, UserRound, Mail, Phone, CalendarDays, Ticket, Tag, Clock, CheckCircle2, AlertCircle, Paperclip, FileText, Image as ImageIcon, ExternalLink, Download, LoaderCircle, RefreshCw, Save } from 'lucide-react';
import toast from 'react-hot-toast';

import { formatLabel, formatDateTime } from '../utils/formatter';
import { useGetSupportTicketById, useUpdateSupportTicketStatus } from '../../hooks/useSupport';
import { useState } from 'react';

const statusStyles = {
    open: 'bg-blue-50 text-blue-700 border-blue-200',
    in_progress: 'bg-amber-50 text-amber-700 border-amber-200',
    resolved: 'bg-green-50 text-green-700 border-green-200',
    closed: 'bg-slate-100 text-slate-600 border-slate-200',
};

const priorityStyles = {
    high: 'bg-red-50 text-red-600 border-red-200',
    medium: 'bg-amber-50 text-amber-700 border-amber-200',
    low: 'bg-green-50 text-green-700 border-green-200',
};

function AllTicketsDetail({ ticketId, setCurrentPage }) {

    const [selectedStatus, setSelectedStatus] = useState('');

    const { data: ticketData, isLoading, isError, refetch, } = useGetSupportTicketById(ticketId);
    const updateStatusMutation = useUpdateSupportTicketStatus();

    const ticket = ticketData?.ticket;

    const userName = ticket?.userType === 'Buyer'
        ? `${ticket?.userId?.firstName || ''} ${ticket?.userId?.lastName || ''}`.trim()
        : ticket?.userId?.fullName || '';

    const userEmail = ticket?.userId?.email || '—';

    const userPhone = ticket?.userType === 'Buyer'
        ? ticket?.userId?.mobile
        : ticket?.userId?.phone;

    const userImage = ticket?.userType === 'Buyer'
        ? ticket?.userId?.profileImageUrl
        : ticket?.userId?.profileImage;

    const attachments = Array.isArray(ticket?.attachment)
        ? ticket.attachment
        : [];

    const isImage = (file) => {
        const type = file?.fileType?.toLowerCase() || '';
        const fileName = file?.fileName || file?.url || '';

        return type.startsWith('image/') ||
            /\.(png|jpe?g|webp|gif|bmp|svg|avif)(\?.*)?$/i.test(fileName);
    };

    const isPdf = (file) => {
        const type = file?.fileType?.toLowerCase() || '';
        const fileName = file?.fileName || file?.url || '';

        return type.includes('pdf') || /\.pdf(\?.*)?$/i.test(fileName);
    };

    // handle update status
    const handleStatusUpdate = () => {
        if (!ticket?.supportId) return;

        updateStatusMutation.mutate(
            {
                supportId: ticket.supportId,
                status: selectedStatus || ticket.status,
            },
            {
                onSuccess: (data) => {
                    toast.success(data?.message || 'Ticket status updated successfully.');
                    setSelectedStatus('');
                },
                onError: (error) => {
                    toast.error(error?.response?.data?.message || 'Failed to update ticket status.');
                },
            }
        );
    };

    // Loading
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-24">
                <LoaderCircle size={32} className="animate-spin text-[#D97706]" />
                <p className="mt-3 text-sm text-slate-500">
                    Loading ticket details...
                </p>
            </div>
        );
    }

    // Error
    if (isError || !ticket) {
        return (
            <div className="space-y-6">
                <button
                    type="button"
                    onClick={() => setCurrentPage('support')}
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#D97706]"
                >
                    <ArrowLeft size={16} />
                    Back to Support
                </button>

                <div className="rounded-xl border border-red-200 bg-white px-6 py-14 text-center">
                    <AlertCircle size={36} className="mx-auto text-red-500" />

                    <h2 className="mt-3 text-lg font-semibold text-[#0B1E3D]">
                        Unable to load ticket
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        The ticket could not be found or an error occurred.
                    </p>

                    <button
                        type="button"
                        onClick={() => refetch()}
                        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#0B1E3D] px-4 py-2 text-sm font-medium text-white hover:bg-[#16345f]"
                    >
                        <RefreshCw size={15} />
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-8">

            {/* Header */}
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3D]">Ticket Detail</h1>

                    <div className="mt-2 flex items-center text-[11px] md:text-[13px]">
                        <span
                            onClick={() => setCurrentPage("dashboard")}
                            className="cursor-pointer text-slate-500 hover:text-[#D97706] transition-colors">
                            Dashboard
                        </span>

                        <span className="mx-1 text-slate-300"><ChevronRight size={16} /></span>
                        <span className=" text-slate-500">Support Management</span>

                        <span className="mx-1 text-slate-300"><ChevronRight size={16} /></span>
                        <span
                            onClick={() => setCurrentPage('all-tickets')}
                            className="cursor-pointer text-slate-500 hover:text-[#D97706] transition-colors">
                            All Tickets
                        </span>

                        <span className="mx-1 text-slate-300"><ChevronRight size={16} /></span>
                        <span className="font-medium text-[#D97706]">
                            Ticket Detail
                        </span>
                    </div>
                </div>

                {/* btns */}
                <button
                    type="button"
                    onClick={() => setCurrentPage('all-tickets')}
                    className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-amber-300 hover:text-[#D97706]"
                >
                    <ArrowLeft size={16} />
                    Back to Tickets
                </button>
            </div>

            {/* Ticket Overview */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Ticket ID
                        </p>

                        <h2 className="mt-1 text-lg font-bold text-[#0B1E3D]">
                            {ticket.supportId || '—'}
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                            Created {formatDateTime(ticket.createdAt)}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${statusStyles[ticket.status] ||
                                'border-slate-200 bg-slate-50 text-slate-600'
                                }`}
                        >
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                            {formatLabel(ticket.status)}
                        </span>

                        <span
                            className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold ${priorityStyles[ticket.priority] ||
                                'border-slate-200 bg-slate-50 text-slate-600'
                                }`}
                        >
                            {formatLabel(ticket.priority)} Priority
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-amber-50 p-2.5 text-[#D97706]">
                            <Ticket size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Ticket ID</p>
                            <p className="mt-1 break-all text-sm font-semibold text-[#0B1E3D]">
                                {ticket.supportId || '—'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-blue-50 p-2.5 text-blue-600">
                            <Tag size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Category</p>
                            <p className="mt-1 text-sm font-semibold text-[#0B1E3D]">
                                {formatLabel(ticket.category)}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-green-50 p-2.5 text-green-600">
                            <UserRound size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Submitted By</p>
                            <p className="mt-1 text-sm font-semibold text-[#0B1E3D]">
                                {ticket.userType || '—'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-slate-100 p-2.5 text-slate-600">
                            <Clock size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Last Updated</p>
                            <p className="mt-1 text-sm font-semibold text-[#0B1E3D]">
                                {formatDateTime(ticket.updatedAt)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-3">

                {/* ------------------------ LEFT ------------------------- */}
                <div className="space-y-6 xl:col-span-2">

                    {/* Issue Details */}
                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-200 px-5 py-4">
                            <h3 className="font-semibold text-[#0B1E3D]">Ticket Information</h3>
                            <p className="mt-1 text-xs text-slate-500">
                                Issue submitted by the {ticket.userType || 'user'}
                            </p>
                        </div>

                        <div className="space-y-5 p-5">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Subject
                                </p>
                                <h2 className="mt-2 wrap-break-word text-base font-semibold text-[#0B1E3D]">
                                    {ticket.subject || 'No subject provided'}
                                </h2>
                            </div>

                            <div className="border-t border-slate-100 pt-5">
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Description
                                </p>
                                <p className="mt-3 whitespace-pre-wrap wrap-break-word text-sm leading-7 text-slate-600">
                                    {ticket.description || 'No description provided.'}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2">
                                <div>
                                    <p className="text-xs text-slate-500">
                                        Created On
                                    </p>
                                    <p className="mt-1.5 flex items-center gap-2 text-sm font-medium text-slate-700">
                                        <CalendarDays size={15} className="text-[#D97706]" />
                                        {formatDateTime(ticket.createdAt)}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-slate-500">
                                        Last Updated
                                    </p>
                                    <p className="mt-1.5 flex items-center gap-2 text-sm font-medium text-slate-700">
                                        <RefreshCw size={15} className="text-[#D97706]" />
                                        {formatDateTime(ticket.updatedAt)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Attachments */}
                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                            <div>
                                <h3 className="flex items-center gap-2 font-semibold text-[#0B1E3D]">
                                    <Paperclip size={17} className="text-[#D97706]" />
                                    Attachments
                                </h3>
                                <p className="mt-1 text-xs text-slate-500">
                                    Files submitted with this support ticket
                                </p>
                            </div>

                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                                {attachments.length} {attachments.length === 1 ? 'File' : 'Files'}
                            </span>
                        </div>

                        <div className="p-5">
                            {attachments.length === 0 ? (
                                <div className="rounded-lg border border-dashed border-slate-200 px-4 py-10 text-center">
                                    <Paperclip size={28} className="mx-auto text-slate-300" />
                                    <p className="mt-3 text-sm font-medium text-slate-600">
                                        No attachments
                                    </p>
                                    <p className="mt-1 text-xs text-slate-400">
                                        No files were uploaded with this ticket.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {attachments.map((file, index) => {
                                        const imageFile = isImage(file);
                                        const pdfFile = isPdf(file);

                                        return (
                                            <div
                                                key={file.publicId || file.url || index}
                                                className="overflow-hidden rounded-xl border border-slate-200 bg-white transition-colors hover:border-amber-300"
                                            >
                                                {/* Image Preview */}
                                                {imageFile && file.url ? (
                                                    <a
                                                        href={file.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="group relative block h-48 bg-slate-50"
                                                        title="Open full image"
                                                    >
                                                        <img
                                                            src={file.url}
                                                            alt={file.fileName || `Attachment ${index + 1}`}
                                                            loading="lazy"
                                                            className="h-full w-full object-contain p-2"
                                                        />
                                                        <span className="absolute inset-0 flex items-center justify-center bg-[#0B1E3D]/0 text-white transition-colors group-hover:bg-[#0B1E3D]/20">
                                                            <ExternalLink size={22} className="opacity-0 group-hover:opacity-100" />
                                                        </span>
                                                    </a>
                                                ) : (
                                                    <div className="flex h-32 items-center justify-center bg-slate-50">
                                                        <div className={`rounded-xl p-4 ${pdfFile
                                                            ? 'bg-red-50 text-red-500'
                                                            : 'bg-amber-50 text-[#D97706]'
                                                            }`}>
                                                            {imageFile
                                                                ? <ImageIcon size={34} />
                                                                : <FileText size={34} />
                                                            }
                                                        </div>
                                                    </div>
                                                )}

                                                {/* File Information */}
                                                <div className="p-3.5">
                                                    <p
                                                        className="truncate text-sm font-semibold text-[#0B1E3D]"
                                                        title={file.fileName || `Attachment ${index + 1}`}
                                                    >
                                                        {file.fileName || `Attachment ${index + 1}`}
                                                    </p>

                                                    <p className="mt-1 text-xs text-slate-500">
                                                        {file.fileType || (imageFile ? 'Image' : pdfFile ? 'PDF Document' : 'Attachment')}
                                                    </p>

                                                    {file.url && (
                                                        <div className="mt-3 flex flex-wrap gap-2">
                                                            <a
                                                                href={file.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:border-amber-300 hover:text-[#D97706]"
                                                            >
                                                                <ExternalLink size={13} />
                                                                Open
                                                            </a>

                                                            <a
                                                                href={file.url}
                                                                download={file.fileName || true}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1.5 rounded-lg bg-[#0B1E3D] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#16345f]"
                                                            >
                                                                <Download size={13} />
                                                                Download
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ------------------------ RIGHT ------------------------- */}
                <div className="space-y-6">

                    {/* User Details */}
                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-200 px-5 py-4">
                            <h3 className="font-semibold text-[#0B1E3D]">
                                Submitted By
                            </h3>
                        </div>

                        <div className="p-5">
                            <div className="flex items-center gap-3">
                                {userImage ? (
                                    <img
                                        src={userImage}
                                        alt={userName || 'User'}
                                        className="h-12 w-12 rounded-full border border-slate-200 object-cover"
                                    />
                                ) : (
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-[#D97706]">
                                        <UserRound size={22} />
                                    </div>
                                )}

                                <div className="min-w-0">
                                    <p className="truncate font-semibold text-[#0B1E3D]">
                                        {userName || 'Unknown User'}
                                    </p>
                                    <span className="mt-1 inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                                        {ticket.userType || 'User'}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-5 space-y-4 border-t border-slate-100 pt-5">
                                <div className="flex items-start gap-3">
                                    <Mail size={16} className="mt-0.5 shrink-0 text-slate-400" />
                                    <div className="min-w-0">
                                        <p className="text-xs text-slate-500">Email Address</p>
                                        <p className="mt-1 break-all text-sm font-medium text-slate-700">
                                            {userEmail}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Phone size={16} className="mt-0.5 shrink-0 text-slate-400" />
                                    <div className="min-w-0">
                                        <p className="text-xs text-slate-500">Phone Number</p>
                                        <p className="mt-1 break-all text-sm font-medium text-slate-700">
                                            {userPhone || '—'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-slate-400" />
                                    <div>
                                        <p className="text-xs text-slate-500">User Type</p>
                                        <p className="mt-1 text-sm font-medium text-slate-700">
                                            {ticket.userType || '—'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Current Status */}
                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-200 px-5 py-4">
                            <h3 className="font-semibold text-[#0B1E3D]">
                                Current Status
                            </h3>
                        </div>

                        <div className="space-y-4 p-5">
                            <div>
                                <p className="mb-2 text-xs text-slate-500">
                                    Ticket Status
                                </p>
                                <span
                                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${statusStyles[ticket.status] ||
                                        'border-slate-200 bg-slate-50 text-slate-600'
                                        }`}
                                >
                                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                    {formatLabel(ticket.status)}
                                </span>

                                <select
                                    value={selectedStatus || ticket.status}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="mt-3 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706]"
                                >
                                    <option value="open">Open</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="resolved">Resolved</option>
                                    <option value="closed">Closed</option>
                                </select>

                                <button
                                    type="button"
                                    onClick={handleStatusUpdate}
                                    disabled={
                                        updateStatusMutation.isPending ||
                                        (selectedStatus || ticket.status) === ticket.status
                                    }
                                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0B1E3D] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#16345f] disabled:cursor-not-allowed disabled:opacity-50">
                                    <Save size={16} />
                                    {updateStatusMutation.isPending
                                        ? 'Updating...'
                                        : 'Update Status'}
                                </button>
                            </div>

                            <div className="border-t border-slate-100 pt-4">
                                <p className="mb-2 text-xs text-slate-500">
                                    Priority
                                </p>
                                <span
                                    className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold ${priorityStyles[ticket.priority] ||
                                        'border-slate-200 bg-slate-50 text-slate-600'
                                        }`}
                                >
                                    {formatLabel(ticket.priority)}
                                </span>
                            </div>

                            <div className="border-t border-slate-100 pt-4">
                                <p className="text-xs text-slate-500">
                                    Ticket Category
                                </p>
                                <p className="mt-1.5 text-sm font-semibold text-[#0B1E3D]">
                                    {formatLabel(ticket.category)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AllTicketsDetail;
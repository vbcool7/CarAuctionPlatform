
import React, { useEffect, useState } from 'react';
import {
    ChevronRight,
    ArrowLeft,
    PhoneCall,
    UserRound,
    CalendarDays,
    Clock,
    FileText,
    CheckCircle,
    LoaderCircle,
    Mail,
    Hash,
    Tag,
    RefreshCw,
} from 'lucide-react';
import toast from 'react-hot-toast';

import {
    useGetCallRequestById,
    useUpdateCallRequestStatus,
} from '../../hooks/useSupport';

const statusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'Contacted', value: 'contacted' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
];

const statusStyles = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    contacted: 'bg-blue-50 text-blue-700 border-blue-200',
    completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
};

const formatDate = (date) => {
    if (!date) return '—';

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return '—';

    return parsedDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: 'Asia/Dubai',
    });
};

const formatDateTime = (date) => {
    if (!date) return '—';

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return '—';

    return parsedDate.toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Dubai',
    });
};

const formatPhone = (phone) => {
    if (!phone) return '—';

    const value = String(phone).trim();

    if (value.startsWith('+971')) return value;

    if (value.startsWith('971')) return `+${value}`;

    if (value.startsWith('0')) {
        return `+971 ${value.slice(1)}`;
    }

    return `+971 ${value}`;
};

const DetailItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-[#D97706] shadow-sm">
            <Icon size={19} />
        </div>

        <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-slate-500">{label}</p>
            <p className="mt-1 break-words text-sm font-semibold text-[#0B1E3D]">
                {value || '—'}
            </p>
        </div>
    </div>
);

function CallRequestsDetail({ callRequestId, setCurrentPage }) {
    const [selectedStatus, setSelectedStatus] = useState('');
    const [isStatusChanged, setIsStatusChanged] = useState(false);

    const {
        data,
        isLoading,
        isError,
        refetch,
        isFetching,
    } = useGetCallRequestById(callRequestId);

    const updateStatusMutation = useUpdateCallRequestStatus();

    const request = data?.callRequest;

    useEffect(() => {
        if (request?.status) {
            setSelectedStatus(request.status);
            setIsStatusChanged(false);
        }
    }, [request?.status, request?._id]);

    const handleStatusChange = (value) => {
        setSelectedStatus(value);
        setIsStatusChanged(value !== request?.status);
    };

    const handleUpdateStatus = async () => {
        if (!callRequestId || !selectedStatus) {
            toast.error('Call request details are missing.');
            return;
        }

        if (selectedStatus === request?.status) {
            toast.error('Please select a different status.');
            return;
        }

        try {
            const response = await updateStatusMutation.mutateAsync({
                id: callRequestId,
                status: selectedStatus,
            });

            if (response?.success === false) {
                toast.error(response.message || 'Failed to update status.');
                return;
            }

            toast.success(response?.message || 'Call request status updated.');
            setIsStatusChanged(false);
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                    'Failed to update call request status.'
            );
        }
    };

    const user = request?.userId;
    const userName =
        request?.fullName ||
        user?.fullName ||
        [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
        '—';

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-xl font-bold text-[#0B1E3D] md:text-2xl">
                        Call Request Detail
                    </h1>

                    <div className="mt-2 flex flex-wrap items-center text-[11px] md:text-[13px]">
                        <span
                            onClick={() => setCurrentPage('dashboard')}
                            className="cursor-pointer text-slate-500 transition-colors hover:text-[#D97706]"
                        >
                            Dashboard
                        </span>

                        <span className="mx-1 text-slate-300">
                            <ChevronRight size={16} />
                        </span>

                        <span className="text-slate-500">
                            Support Management
                        </span>

                        <span className="mx-1 text-slate-300">
                            <ChevronRight size={16} />
                        </span>

                        <span
                            onClick={() => setCurrentPage('call')}
                            className="cursor-pointer text-slate-500 transition-colors hover:text-[#D97706]"
                        >
                            Call Requests
                        </span>

                        <span className="mx-1 text-slate-300">
                            <ChevronRight size={16} />
                        </span>

                        <span className="font-medium text-[#D97706]">
                            Call Request Detail
                        </span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => setCurrentPage('call')}
                    className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-amber-300 hover:text-[#D97706]"
                >
                    <ArrowLeft size={16} />
                    Back to Call Requests
                </button>
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-slate-200 bg-white">
                    <div className="flex flex-col items-center gap-3">
                        <LoaderCircle
                            size={32}
                            className="animate-spin text-[#D97706]"
                        />
                        <p className="text-sm text-slate-500">
                            Loading call request details...
                        </p>
                    </div>
                </div>
            )}

            {/* Error */}
            {!isLoading && (isError || !request) && (
                <div className="flex min-h-[260px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-[#D97706]">
                        <PhoneCall size={26} />
                    </div>

                    <h2 className="mt-4 text-lg font-semibold text-[#0B1E3D]">
                        Unable to load call request
                    </h2>

                    <p className="mt-2 max-w-md text-sm text-slate-500">
                        The request may not exist or something went wrong while
                        fetching its details.
                    </p>

                    <div className="mt-5 flex gap-3">
                        <button
                            type="button"
                            onClick={() => refetch()}
                            className="inline-flex items-center gap-2 rounded-lg bg-[#0B1E3D] px-4 py-2 text-sm font-medium text-white hover:bg-[#142b4e]"
                        >
                            <RefreshCw size={15} />
                            Retry
                        </button>

                        <button
                            type="button"
                            onClick={() => setCurrentPage('call')}
                            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                        >
                            Back to Calls
                        </button>
                    </div>
                </div>
            )}

            {/* Details */}
            {!isLoading && !isError && request && (
                <>
                    {/* Request Summary */}
                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-[#D97706]">
                                    <PhoneCall size={23} />
                                </div>

                                <div>
                                    <p className="text-xs font-medium text-slate-500">
                                        Request ID
                                    </p>
                                    <h2 className="mt-1 text-lg font-bold text-[#0B1E3D]">
                                        {request.callRequestId || '—'}
                                    </h2>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <span
                                    className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold capitalize ${
                                        statusStyles[request.status] ||
                                        'border-slate-200 bg-slate-50 text-slate-600'
                                    }`}
                                >
                                    {request.status || 'Unknown'}
                                </span>

                                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
                                    {request.userType || 'User'}
                                </span>
                            </div>
                        </div>

                        <div className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3">
                            <DetailItem
                                icon={CalendarDays}
                                label="Request Created At"
                                value={formatDateTime(request.createdAt)}
                            />

                            <DetailItem
                                icon={Tag}
                                label="Topic"
                                value={request.topic}
                            />

                            <DetailItem
                                icon={Clock}
                                label="Preferred Call Date"
                                value={formatDate(request.preferredDate)}
                            />
                        </div>
                    </div>

                    {/* User Information */}
                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-[#D97706]">
                                <UserRound size={19} />
                            </div>

                            <div>
                                <h2 className="font-semibold text-[#0B1E3D]">
                                    User Information
                                </h2>
                                <p className="mt-0.5 text-xs text-slate-500">
                                    Contact details of the requester
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3">
                            <DetailItem
                                icon={UserRound}
                                label="Full Name"
                                value={userName}
                            />

                            <DetailItem
                                icon={PhoneCall}
                                label="Contact Number"
                                value={formatPhone(request.contactNumber)}
                            />

                            <DetailItem
                                icon={Mail}
                                label="Email Address"
                                value={user?.email}
                            />

                            <DetailItem
                                icon={Hash}
                                label="User Type"
                                value={request.userType}
                            />
                        </div>
                    </div>

                    {/* Call Schedule */}
                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-[#D97706]">
                                <CalendarDays size={19} />
                            </div>

                            <div>
                                <h2 className="font-semibold text-[#0B1E3D]">
                                    Preferred Call Schedule
                                </h2>
                                <p className="mt-0.5 text-xs text-slate-500">
                                    Requested date and time for the call
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-4 p-5 sm:grid-cols-2">
                            <DetailItem
                                icon={CalendarDays}
                                label="Preferred Date"
                                value={formatDate(request.preferredDate)}
                            />

                            <DetailItem
                                icon={Clock}
                                label="Preferred Time Slot"
                                value={request.preferredTimeSlot}
                            />
                        </div>
                    </div>

                    {/* Request Description */}
                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-[#D97706]">
                                <FileText size={19} />
                            </div>

                            <div>
                                <h2 className="font-semibold text-[#0B1E3D]">
                                    Request Description
                                </h2>
                                <p className="mt-0.5 text-xs text-slate-500">
                                    Details shared by the user
                                </p>
                            </div>
                        </div>

                        <div className="p-5">
                            <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-600">
                                {request.description || 'No description provided.'}
                            </p>
                        </div>
                    </div>

                    {/* Update Status */}
                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-[#D97706]">
                                <CheckCircle size={19} />
                            </div>

                            <div>
                                <h2 className="font-semibold text-[#0B1E3D]">
                                    Manage Request Status
                                </h2>
                                <p className="mt-0.5 text-xs text-slate-500">
                                    Update the current status of this call request
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-end">
                            <div className="w-full sm:max-w-sm">
                                <label
                                    htmlFor="call-request-status"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Request Status
                                </label>

                                <select
                                    id="call-request-status"
                                    value={selectedStatus}
                                    onChange={(e) =>
                                        handleStatusChange(e.target.value)
                                    }
                                    disabled={updateStatusMutation.isPending}
                                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-[#0B1E3D] outline-none transition focus:border-[#D97706] focus:ring-2 focus:ring-amber-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                                >
                                    {statusOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button
                                type="button"
                                onClick={handleUpdateStatus}
                                disabled={
                                    !isStatusChanged ||
                                    updateStatusMutation.isPending
                                }
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0B1E3D] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#142b4e] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {updateStatusMutation.isPending ? (
                                    <>
                                        <LoaderCircle
                                            size={16}
                                            className="animate-spin"
                                        />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle size={16} />
                                        Save Status
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default CallRequestsDetail;
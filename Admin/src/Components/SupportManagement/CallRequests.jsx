
import React, { useState, useEffect } from 'react';
import { PhoneCall, Clock, CheckCircle, LoaderCircle, XCircle, } from 'lucide-react';
import toast from 'react-hot-toast';

import SearchBar from '../SharedComponents/SearchBar';
import FilterDropdown from '../SharedComponents/FilterDropdown';
import DateRangePicker from '../SharedComponents/DateRangePicker';
import { getPaginationRange } from '../utils/getPaginationRange';

import { useGetAllCallRequests, useUpdateCallRequestStatus, } from '../../hooks/useSupport';
import { formatDateTime } from '../utils/formatter';

const filterConfig = [
    {
        label: 'All Request Status',
        key: 'status',
        options: ['all', 'pending', 'contacted', 'completed', 'cancelled'],
    },
    {
        label: 'All User Types',
        key: 'userType',
        options: ['all', 'buyer', 'seller'],
    },
];

const mapFiltersToParams = (filters, search, startDate, endDate) => {
    const params = {};

    if (filters.status && filters.status !== 'all') {
        params.status = filters.status;
    }

    if (filters.userType && filters.userType !== 'all') {
        params.userType = filters.userType;
    }

    if (search) params.search = search;
    if (startDate) params.startDate = startDate.toISOString();
    if (endDate) params.endDate = endDate.toISOString();

    return params;
};

function CallRequests({ setSelectedCallRequestId, setCurrentPage, }) {

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [filters, setFilters] = useState({
        status: 'all',
        userType: 'all',
    });
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [selectedStatuses, setSelectedStatuses] = useState({});

    const params = mapFiltersToParams(filters, debouncedSearch, startDate, endDate);

    const { data: callRequestsData, isLoading, isError, } = useGetAllCallRequests(
        page,
        10,
        params.search || '',
        params.status || '',
        params.userType || '',
        params.startDate || '',
        params.endDate || '',
        'newest'
    );

    const updateStatusMutation = useUpdateCallRequestStatus();

    const callRequests = callRequestsData?.callRequests || [];
    const totalPages = callRequestsData?.pagination?.totalPages || 1;
    const stats = callRequestsData?.stats;

    const statsData = [
        {
            id: 'total',
            title: 'Total Requests',
            value: stats?.totalCallRequests ?? 0,
            subtitle: 'All call requests',
            icon: PhoneCall,
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
        },
        {
            id: 'pending',
            title: 'Pending',
            value: stats?.pendingRequests ?? 0,
            subtitle: 'Awaiting contact',
            icon: Clock,
            iconBg: 'bg-amber-50',
            iconColor: 'text-[#D97706]',
        },
        {
            id: 'contacted',
            title: 'Contacted',
            value: stats?.contactedRequests ?? 0,
            subtitle: 'Contact initiated',
            icon: LoaderCircle,
            iconBg: 'bg-sky-50',
            iconColor: 'text-sky-600',
        },
        {
            id: 'completed',
            title: 'Completed',
            value: stats?.completedRequests ?? 0,
            subtitle: 'Successfully handled',
            icon: CheckCircle,
            iconBg: 'bg-emerald-50',
            iconColor: 'text-emerald-600',
        },
        {
            id: 'cancelled',
            title: 'Cancelled',
            value: stats?.cancelledRequests ?? 0,
            subtitle: 'Cancelled requests',
            icon: XCircle,
            iconBg: 'bg-slate-100',
            iconColor: 'text-slate-600',
        },
    ];

    useEffect(() => {
        setPage(1);
    }, [filters, search, startDate, endDate]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 400);

        return () => clearTimeout(timer);
    }, [search]);

    const updateFilter = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleStatusUpdate = (request) => {
        const status =
            selectedStatuses[request._id] ?? request.status;

        if (status === request.status) return;

        updateStatusMutation.mutate(
            {
                id: request.callRequestId,
                status,
            },
            {
                onSuccess: (data) => {
                    toast.success(
                        data?.message ||
                        'Call request status updated successfully.'
                    );

                    setSelectedStatuses((prev) => {
                        const updated = { ...prev };
                        delete updated[request._id];
                        return updated;
                    });
                },
                onError: (error) => {
                    toast.error(
                        error?.response?.data?.message ||
                        'Failed to update call request status.'
                    );
                },
            }
        );
    };

    if (isLoading) {
        return (
            <p className="p-10 text-center">
                Loading call requests...
            </p>
        );
    }

    if (isError) {
        return (
            <p className="p-10 text-center text-red-500">
                Failed to load call requests.
            </p>
        );
    }

    return (
        <div className="space-y-6 pb-6">
            {/* Header */}
            <div>
                <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3D]">
                    Call Requests
                </h1>

                <div className="mt-2 flex items-center text-[11px] md:text-[13px]">
                    <span
                        onClick={() => setCurrentPage('dashboard')}
                        className="cursor-pointer text-slate-500 hover:text-[#D97706] transition-colors"
                    >
                        Dashboard
                    </span>

                    <span className="mx-2 text-slate-300">/</span>

                    <span className="text-slate-500">
                        Support Management
                    </span>

                    <span className="mx-2 text-slate-300">/</span>

                    <span className="font-medium text-[#D97706]">
                        Call Requests
                    </span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {statsData.map((stat) => {
                    const Icon = stat.icon;

                    return (
                        <div
                            key={stat.id}
                            className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:border-amber-200"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div
                                    className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center shrink-0`}
                                >
                                    <Icon
                                        size={20}
                                        className={stat.iconColor}
                                    />
                                </div>
                            </div>

                            <div className="min-w-0">
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 truncate">
                                    {stat.title}
                                </p>

                                <h3 className="text-2xl font-bold text-[#0B1E3D] mt-1 tracking-tight truncate">
                                    {stat.value}
                                </h3>

                                <p className="text-xs text-slate-500 mt-1 truncate">
                                    {stat.subtitle}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Search / Filters */}
            <div className="my-6 bg-white border border-slate-200 rounded-xl p-4 space-y-4">
                <div className="flex flex-wrap xl:flex-nowrap items-center gap-3">
                    <div className="flex-1 min-w-50">
                        <SearchBar
                            placeholder="Search by request ID, name, phone or topic..."
                            value={search}
                            onChange={setSearch}
                        />
                    </div>

                    {filterConfig.map(({ label, key, options }) => (
                        <div key={key} className="w-full sm:w-45">
                            <FilterDropdown
                                label={label}
                                options={options.map((opt) => ({
                                    label:
                                        opt === 'all'
                                            ? label
                                            : opt.replace(/_/g, ' '),
                                    value: opt,
                                }))}
                                value={filters[key]}
                                onChange={(value) =>
                                    updateFilter(key, value)
                                }
                            />
                        </div>
                    ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                    <DateRangePicker
                        startDate={startDate}
                        endDate={endDate}
                        onChange={(update) => {
                            setStartDate(update[0]);
                            setEndDate(update[1]);
                        }}
                    />

                    <button
                        type="button"
                        onClick={() => {
                            setSearch('');
                            setDebouncedSearch('');
                            setStartDate(null);
                            setEndDate(null);
                            setFilters({
                                status: 'all',
                                userType: 'all',
                            });
                            setPage(1);
                        }}
                        disabled={
                            !search &&
                            !debouncedSearch &&
                            !startDate &&
                            !endDate &&
                            filters.status === 'all' &&
                            filters.userType === 'all'
                        }
                        className="flex items-center gap-1.5 h-9 px-1.5 text-xs font-semibold text-amber-600 underline underline-offset-4 decoration-amber-300 hover:text-amber-700 hover:decoration-amber-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-left table-fixed">
                    <thead className="bg-gray-100 border-b border-gray-200 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                        <tr>
                            <th className="px-6 py-4 w-35">Request ID</th>
                            <th className="px-6 py-4 w-40">User</th>
                            <th className="px-6 py-4 w-40">Phone</th>
                            <th className="px-6 py-4 w-44">Topic</th>
                            <th className="px-6 py-4 w-40">Preferred Date</th>
                            <th className="px-6 py-4 w-44">Time Slot</th>
                            <th className="px-6 py-4 w-35">User Type</th>
                            <th className="px-4 py-3 w-42">Created At</th>
                            <th className="px-6 py-4 w-48">Status</th>
                            <th className="px-6 py-4 w-28">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 bg-white">
                        {callRequests.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={9}
                                    className="px-6 py-12 text-center text-sm text-slate-500"
                                >
                                    No call requests found.
                                </td>
                            </tr>
                        ) : (
                            callRequests.map((request) => {
                                const userName =
                                    request.fullName ||
                                    request.userId?.fullName ||
                                    `${request.userId?.firstName || ''} ${request.userId?.lastName || ''}`.trim();

                                const statusStyles = {
                                    pending: 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20',
                                    contacted: 'bg-sky-50 text-sky-700 ring-1 ring-sky-600/20',
                                    completed: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20',
                                    cancelled: 'bg-slate-100 text-slate-600 ring-1 ring-slate-500/20',
                                };

                                const selectedStatus = selectedStatuses[request._id] ?? request.status;

                                return (
                                    <tr
                                        key={request._id}
                                        className="hover:bg-slate-50/80 transition-all duration-150"
                                    >
                                        {/* Request ID */}
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 text-xs font-mono">
                                                {request.callRequestId || '—'}
                                            </span>
                                        </td>

                                        {/* User */}
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-slate-900 truncate">
                                                    {userName || 'Unknown User'}
                                                </span>

                                                <span className="text-xs text-slate-500 truncate mt-0.5">
                                                    {request.userId?.email || '—'}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Phone */}
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            <span className="font-mono text-xs font-medium text-slate-700">
                                                {request.contactNumber
                                                    ? request.contactNumber.startsWith('+971')
                                                        ? request.contactNumber
                                                        : `+971 ${request.contactNumber.replace(/^0/, '')}`
                                                    : '—'}
                                            </span>
                                        </td>

                                        {/* Topic */}
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span
                                                    className="text-sm font-medium text-slate-900 truncate"
                                                    title={request.topic}
                                                >
                                                    {request.topic || '—'}
                                                </span>

                                                <span
                                                    className="text-xs text-slate-500 truncate mt-0.5"
                                                    title={request.description}
                                                >
                                                    {request.description || 'No description'}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Preferred Date */}
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            <span className="font-medium text-slate-800">
                                                {request.preferredDate
                                                    ? new Date(
                                                        request.preferredDate
                                                    ).toLocaleDateString('en-GB', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric',
                                                        timeZone: 'Asia/Dubai',
                                                    })
                                                    : '—'}
                                            </span>
                                        </td>

                                        {/* Time Slot */}
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {request.preferredTimeSlot ? (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200/60 text-xs font-medium text-slate-700 capitalize">
                                                    {request.preferredTimeSlot.replace(/_/g, ' ')}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400">—</span>
                                            )}
                                        </td>

                                        {/* User Type */}
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                                                {request.userType || '—'}
                                            </span>
                                        </td>

                                        {/* Created At */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                            <span className="font-medium text-slate-700 text-xs">
                                                {formatDateTime(request.createdAt) || '—'}
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td className="px-4 py-4">
                                            <div className="flex min-w-40 flex-col gap-2">
                                                <div className="flex items-center">
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize 
                                                            ${statusStyles[request.status] || 'bg-slate-100 text-slate-600'}`}>
                                                        {request.status || '—'}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-1.5">
                                                    <select
                                                        value={selectedStatus}
                                                        onChange={(e) =>
                                                            setSelectedStatuses(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    [request._id]:
                                                                        e.target.value,
                                                                })
                                                            )
                                                        }
                                                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs font-medium text-slate-700 outline-none transition-all focus:border-[#D97706] focus:bg-white focus:ring-2 focus:ring-[#D97706]/10">
                                                        <option value="pending">Pending</option>
                                                        <option value="contacted">Contacted</option>
                                                        <option value="completed">Completed</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>

                                                    <button
                                                        type="button"
                                                        onClick={() =>handleStatusUpdate(request)}
                                                        disabled={
                                                            updateStatusMutation.isPending ||
                                                            selectedStatus === request.status
                                                        }
                                                        className="inline-flex shrink-0 items-center justify-center rounded-lg bg-[#0B1E3D] px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#16345f] focus:outline-none focus:ring-2 focus:ring-[#0B1E3D]/20 disabled:cursor-not-allowed disabled:opacity-40">
                                                        {updateStatusMutation.isPending ? '...' : 'Save'}
                                                    </button>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedCallRequestId(request._id);
                                                    setCurrentPage('call-detail');
                                                }}
                                                className="inline-flex items-center justify-center px-3 py-1.5 border border-slate-200 shadow-sm text-xs font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 hover:text-amber-600 focus:outline-none transition-all"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between gap-4 px-6 py-4 border-t border-slate-200 bg-white">
                    <p className="hidden sm:block text-xs text-slate-500">
                        Page{' '}
                        <span className="font-semibold text-[#0B1E3D]">
                            {page}
                        </span>{' '}
                        of{' '}
                        <span className="font-semibold text-[#0B1E3D]">
                            {totalPages}
                        </span>
                    </p>

                    <div className="flex items-center gap-1.5 mx-auto sm:mx-0 sm:ml-auto">
                        <button
                            type="button"
                            onClick={() =>
                                setPage((p) => Math.max(1, p - 1))
                            }
                            disabled={page === 1}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            Previous
                        </button>

                        {getPaginationRange(page, totalPages).map(
                            (num, idx) =>
                                num === '...' ? (
                                    <span
                                        key={`dot-${idx}`}
                                        className="px-2 py-1.5 text-xs font-medium text-slate-400"
                                    >
                                        ...
                                    </span>
                                ) : (
                                    <button
                                        type="button"
                                        key={num}
                                        onClick={() => setPage(num)}
                                        className={`min-w-8 h-8 px-2 rounded-lg text-xs font-semibold border transition-all ${page === num
                                            ? 'bg-[#D97706] text-white border-[#D97706] shadow-sm'
                                            : 'bg-white border-slate-200 text-slate-600 hover:bg-amber-50 hover:text-[#D97706] hover:border-amber-200'
                                            }`}
                                    >
                                        {num}
                                    </button>
                                )
                        )}

                        <button
                            type="button"
                            onClick={() =>
                                setPage((p) =>
                                    Math.min(totalPages, p + 1)
                                )
                            }
                            disabled={page === totalPages}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CallRequests;
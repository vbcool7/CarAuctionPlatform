
import React, { useState, useEffect } from 'react';
import { Ticket, Clock, CheckCircle, LoaderCircle, Archive } from 'lucide-react';
import SearchBar from '../SharedComponents/SearchBar';
import FilterDropdown from '../SharedComponents/FilterDropdown';
import toast from 'react-hot-toast';

import { getPaginationRange } from '../utils/getPaginationRange';
import { useGetAllSupportTickets, useUpdateSupportTicketStatus } from '../../hooks/useSupport';
import DateRangePicker from '../SharedComponents/DateRangePicker';

const filterConfig = [
    {
        label: 'All Ticket Status',
        key: 'status',
        options: ['all', 'open', 'in_progress', 'resolved', 'closed'],
    },
    {
        label: 'All Priority',
        key: 'priority',
        options: ['all', 'high', 'medium', 'low'],
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

    if (filters.priority && filters.priority !== 'all') {
        params.priority = filters.priority;
    }

    if (filters.userType && filters.userType !== 'all') {
        params.userType = filters.userType;
    }

    if (search) params.search = search;
    if (startDate) params.startDate = startDate.toISOString();
    if (endDate) params.endDate = endDate.toISOString();

    return params;
};

function AllTickets({ setSelectedTicketId, setCurrentPage }) {

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState();
    const [debouncedSearch, setDebouncedSearch] = useState();
    const [filters, setFilters] = useState({
        status: 'all',
        priority: 'all',
        userType: 'all',
    });
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [selectedStatuses, setSelectedStatuses] = useState({});

    const params = mapFiltersToParams(filters, debouncedSearch, startDate, endDate);

    const { data: ticketsData, isLoading, isError } = useGetAllSupportTickets({ page, limit: 10, sortBy: 'newest', ...params });
    const updateStatusMutation = useUpdateSupportTicketStatus();

    const tickets = ticketsData?.tickets || [];
    const totalPages = ticketsData?.pagination?.totalPages || 1;
    const stats = ticketsData?.stats;

    // stats
    const statsData = [
        {
            id: 'total',
            title: 'Total Tickets',
            value: stats?.totalTickets ?? 0,
            subtitle: 'All time',
            icon: Ticket,
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
        },
        {
            id: 'open',
            title: 'Open Tickets',
            value: stats?.openTickets ?? 0,
            subtitle: 'Need attention',
            icon: Clock,
            iconBg: 'bg-rose-50',
            iconColor: 'text-rose-600',
        },
        {
            id: 'progress',
            title: 'In Progress',
            value: stats?.inProgressTickets ?? 0,
            subtitle: 'Being reviewed',
            icon: LoaderCircle,
            iconBg: 'bg-amber-50',
            iconColor: 'text-[#D97706]',
        },
        {
            id: 'resolved',
            title: 'Resolved Tickets',
            value: stats?.resolvedTickets ?? 0,
            subtitle: 'Successfully handled',
            icon: CheckCircle,
            iconBg: 'bg-emerald-50',
            iconColor: 'text-emerald-600',
        },
        {
            id: 'closed',
            title: 'Closed Tickets',
            value: stats?.closedTickets ?? 0,
            subtitle: 'Tickets closed',
            icon: Archive,
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

    // update status
    const handleStatusUpdate = (ticket) => {
        const status = selectedStatuses[ticket._id] || ticket.status;

        if (status === ticket.status) return;

        updateStatusMutation.mutate(
            {
                supportId: ticket.supportId,
                status,
            },
            {
                onSuccess: (data) => {
                    toast.success(data?.message || 'Ticket status updated successfully.');

                    setSelectedStatuses((prev) => ({
                        ...prev,
                        [ticket._id]: status,
                    }));
                },
                onError: (error) => {
                    toast.error(error?.response?.data?.message || 'Failed to update ticket status.');
                },
            }
        );
    };

    if (isLoading) return <p className="p-10 text-center">Loading tickets list....</p>;
    if (isError) return <p className="p-10 text-center text-red-500">Failed to load tickets list</p>;

    return (
        <div className="space-y-6 pb-6">
            
            <div>
                <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3D]">
                    All Tickets
                </h1>

                <div className="mt-2 flex items-center text-[11px] md:text-[13px]">
                    <span
                        onClick={() => setCurrentPage("dashboard")}
                        className="cursor-pointer text-slate-500 hover:text-[#D97706] transition-colors">
                        Dashboard
                    </span>

                    <span className="mx-2 text-slate-300">/</span>

                    <span className="text-slate-500">Support Management</span>

                    <span className="mx-2 text-slate-300">/</span>
                    <span className="font-medium text-[#D97706]">All Tickets</span>
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
                            {/* Header: Icon & Optional Badge/Status */}
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

                            {/* Content: Title, Value & Subtitle */}
                            <div className="min-w-0">
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 truncate">
                                    {stat.title}
                                </p>

                                <h3 className="text-2xl font-bold text-[#0B1E3D] mt-1 tracking-tight truncate">
                                    {stat.value}
                                </h3>

                                {stat.subtitle && (
                                    <p className="text-xs text-slate-500 mt-1 truncate">
                                        {stat.subtitle}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Search / Filter */}
            <div className="my-6 bg-white border border-slate-200 rounded-xl p-4 space-y-4">
                <div className="flex flex-wrap xl:flex-nowrap items-center gap-3">

                    <div className="flex-1 min-w-50">
                        <SearchBar
                            placeholder="Search by ticket ID, subject or category..."
                            value={search}
                            onChange={setSearch}
                        />
                    </div>

                    {filterConfig.map(({ label, key, options }) => (
                        <div key={key} className="w-full sm:w-45">
                            <FilterDropdown
                                label={label}
                                options={options.map((opt) => ({
                                    label: opt === 'all'
                                        ? label
                                        : opt.replace(/_/g, ' '),
                                    value: opt,
                                }))}
                                value={filters[key]}
                                onChange={(value) => updateFilter(key, value)}
                            />
                        </div>
                    ))}
                </div>

                {/* <div className="flex flex-wrap items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => {
                            setSearch('');
                            setDebouncedSearch('');
                            setFilters({
                                status: 'all',
                                priority: 'all',
                                userType: 'all',
                            });
                            setPage(1);
                        }}
                        disabled={
                            !search &&
                            filters.status === 'all' &&
                            filters.priority === 'all' &&
                            filters.userType === 'all'
                        }
                        className="flex items-center gap-1.5 h-9 px-1.5 text-xs font-semibold text-amber-600 underline underline-offset-4 decoration-amber-300 hover:text-amber-700 hover:decoration-amber-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Clear Filters
                    </button>
                </div> */}

                <div className="flex flex-wrap items-center justify-between gap-3">

                    {/* Date Range */}
                    <DateRangePicker
                        startDate={startDate}
                        endDate={endDate}
                        onChange={(update) => {
                            setStartDate(update[0]);
                            setEndDate(update[1]);
                        }}
                    />

                    {/* clear btn */}
                    <button
                        type="button"
                        onClick={() => {
                            setSearch('');
                            setDebouncedSearch('');
                            setStartDate('');
                            setEndDate('');
                            setFilters({
                                status: 'all',
                                priority: 'all',
                                userType: 'all',
                            });
                            setPage(1);
                        }}
                        disabled={
                            !search &&
                            !startDate &&
                            !endDate &&
                            filters.status === 'all' &&
                            filters.priority === 'all' &&
                            filters.userType === 'all'
                        }
                        className="flex items-center gap-1.5 h-9 px-1.5 text-xs font-semibold text-amber-600 underline underline-offset-4 decoration-amber-300 hover:text-amber-700 hover:decoration-amber-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* table */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-left table-fixed">
                    <thead className="bg-gray-100 border-b border-gray-200 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                        <tr>
                            <th className="px-6 py-4 w-38">Ticket ID</th>
                            <th className="px-6 py-4 w-45">User</th>
                            <th className="px-6 py-4 w-35">Category</th>
                            <th className="px-6 py-4 w-48">Subject</th>
                            <th className="px-6 py-4 w-35">Priority</th>
                            <th className="px-6 py-4 w-35">User Type</th>
                            <th className="px-6 py-4 w-40">Status</th>
                            <th className="px-6 py-4 w-30">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 bg-white">
                        {tickets.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={9}
                                    className="px-6 py-12 text-center text-sm text-slate-500"
                                >
                                    No support tickets found.
                                </td>
                            </tr>
                        ) : (
                            tickets.map((ticket) => {
                                const userName =
                                    ticket.userType === 'Buyer'
                                        ? `${ticket.userId?.firstName || ''} ${ticket.userId?.lastName || ''}`.trim()
                                        : ticket.userId?.fullName || '';

                                const userEmail = ticket.userId?.email || '—';

                                const priorityStyles = {
                                    high: 'bg-rose-50 text-rose-700 ring-1 ring-rose-600/2og',
                                    medium: 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20',
                                    low: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20',
                                };

                                const statusStyles = {
                                    open: 'bg-sky-50 text-sky-700 ring-1 ring-sky-600/20',
                                    in_progress: 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20',
                                    resolved: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20',
                                    closed: 'bg-slate-100 text-slate-600 ring-1 ring-slate-500/20',
                                };

                                return (
                                    <tr
                                        key={ticket._id}
                                        className="hover:bg-slate-50/80 transition-all duration-150"
                                    >
                                        {/* Ticket ID */}
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 text-xs font-mono">
                                                {ticket.supportId || '—'}
                                            </span>
                                        </td>

                                        {/* User */}
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-slate-900 truncate">
                                                    {userName || 'Unknown User'}
                                                </span>
                                                <span className="text-xs text-slate-500 truncate mt-0.5">
                                                    {userEmail}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Category */}
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            <span className="capitalize font-medium text-slate-700">
                                                {ticket.category?.replace(/_/g, ' ') || '—'}
                                            </span>
                                        </td>

                                        {/* subject / description */}
                                        <td className="px-6 py-4 max-w-xs">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-slate-900 truncate" title={ticket.subject}>
                                                    {ticket.subject || '—'}
                                                </span>
                                                <span className="text-xs text-slate-500 truncate mt-0.5" title={ticket.description}>
                                                    {ticket.description || 'No description provided'}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Priority */}
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize 
                                                    ${priorityStyles[ticket.priority] || 'bg-slate-100 text-slate-600'}`}>
                                                {ticket.priority || '—'}
                                            </span>
                                        </td>

                                        {/* User Type */}
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                                                {ticket.ticketType || ticket.userType || '—'}
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td className="px-4 py-4">
                                            <div className="flex min-w-40 flex-col gap-2">
                                                {/* Current Status Badge */}
                                                <div className="flex items-center">
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusStyles[ticket.status] || 'bg-slate-100 text-slate-600'
                                                            }`}
                                                    >
                                                        {ticket.status?.replace(/_/g, ' ') || '—'}
                                                    </span>
                                                </div>

                                                {/* Change Status Controls */}
                                                <div className="flex items-center gap-1.5">
                                                    <select
                                                        value={selectedStatuses[ticket._id] ?? ticket.status}
                                                        onChange={(e) =>
                                                            setSelectedStatuses((prev) => ({
                                                                ...prev,
                                                                [ticket._id]: e.target.value,
                                                            }))
                                                        }
                                                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs font-medium text-slate-700 outline-none transition-all focus:border-[#D97706] focus:bg-white focus:ring-2 focus:ring-[#D97706]/10"
                                                    >
                                                        <option value="open">Open</option>
                                                        <option value="in_progress">In Progress</option>
                                                        <option value="resolved">Resolved</option>
                                                        <option value="closed">Closed</option>
                                                    </select>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleStatusUpdate(ticket)}
                                                        disabled={
                                                            updateStatusMutation.isPending ||
                                                            (selectedStatuses[ticket._id] ?? ticket.status) === ticket.status
                                                        }
                                                        className="inline-flex shrink-0 items-center justify-center rounded-lg bg-[#0B1E3D] px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#16345f] focus:outline-none focus:ring-2 focus:ring-[#0B1E3D]/20 disabled:cursor-not-allowed disabled:opacity-40"
                                                    >
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
                                                    setSelectedTicketId(ticket._id);
                                                    setCurrentPage('all-tickets-detail')
                                                }}
                                                className="inline-flex items-center justify-center px-3 py-1.5 border border-slate-200 shadow-sm text-xs font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 hover:text-amber-600 focus:outline-none transition-all">
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

                    {/* Page Info */}
                    <p className="hidden sm:block text-xs text-slate-500">
                        Page <span className="font-semibold text-[#0B1E3D]">{page}</span> of{" "}
                        <span className="font-semibold text-[#0B1E3D]">{totalPages}</span>
                    </p>

                    {/* Pagination */}
                    <div className="flex items-center gap-1.5 mx-auto sm:mx-0 sm:ml-auto">

                        {/* Previous */}
                        <button
                            type="button"
                            onClick={() => setPage((p) => p - 1)}
                            disabled={page === 1}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600
                                                hover:bg-slate-50 hover:border-slate-300
                                                disabled:opacity-40 disabled:cursor-not-allowed
                                                transition-all"
                        >
                            Previous
                        </button>

                        {/* Page Numbers */}
                        {getPaginationRange(page, totalPages).map((num, idx) =>
                            num === "..." ? (
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
                                    className={`min-w-8 h-8 px-2 rounded-lg text-xs font-semibold border transition-all
                                                            ${page === num
                                            ? "bg-[#D97706] text-white border-[#D97706] shadow-sm"
                                            : "bg-white border-slate-200 text-slate-600 hover:bg-amber-50 hover:text-[#D97706] hover:border-amber-200"
                                        }`}
                                >
                                    {num}
                                </button>
                            )
                        )}

                        {/* Next */}
                        <button
                            type="button"
                            onClick={() => setPage((p) => p + 1)}
                            disabled={page === totalPages}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600
                                                hover:bg-slate-50 hover:border-slate-300
                                                disabled:opacity-40 disabled:cursor-not-allowed
                                                transition-all"
                        >
                            Next
                        </button>

                    </div>
                </div>
            )}
        </div>
    );
}

export default AllTickets;
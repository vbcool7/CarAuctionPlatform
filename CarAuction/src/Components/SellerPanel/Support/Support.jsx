
import React, { useState } from 'react';
import { Plus, Ticket, Clock, CheckCircle, Headphones, MessageSquare, Phone, Mail, ChevronRight, ShieldAlert, Edit, PhoneCall, Hourglass, PhoneForwarded, CheckCircle2 } from 'lucide-react';
import FilterDropdown from '../SellerSharedComponents/FilterDropdown';
import SearchBar from '../SellerSharedComponents/SearchBar';

import { getPaginationRange } from '../../../utils/getPaginationRange';
import { useGetMySupportTickets, useGetMyCallRequests } from '../../../hook/useSupport';
import { useEffect } from 'react';

// ticket stats
const statsData = [
    {
        id: "total-tickets",
        title: "Total Tickets",
        valueKey: "totalTickets",
        subtitle: "All time",
        subtitleColor: "text-slate-500",
        icon: Ticket,
        iconBg: "bg-slate-100",
        iconColor: "text-[#0B1E3D]",
    },
    {
        id: "open-tickets",
        title: "Open Tickets",
        valueKey: "openTickets",
        subtitle: "Need attention",
        subtitleColor: "text-rose-600",
        icon: Clock,
        iconBg: "bg-rose-50",
        iconColor: "text-rose-600",
    },
    {
        id: "resolved-tickets",
        title: "Resolved Tickets",
        valueKey: "resolvedTickets",
        subtitle: "Successfully closed",
        subtitleColor: "text-emerald-600",
        icon: CheckCircle,
        iconBg: "bg-emerald-50",
        iconColor: "text-emerald-600",
    },
    {
        id: "in-progress-tickets",
        title: "In Progress",
        valueKey: "inProgressTickets",
        subtitle: "Being reviewed",
        subtitleColor: "text-amber-600",
        icon: Clock,
        iconBg: "bg-amber-50",
        iconColor: "text-[#D97706]",
    },
];

// call request Stats
const callStatsData = [
    {
        id: "total-requests",
        title: "Total Requests",
        valueKey: "totalRequests",
        subtitle: "All time",
        subtitleColor: "text-slate-500",
        icon: PhoneCall,
        iconBg: "bg-slate-100",
        iconColor: "text-[#0B1E3D]",
    },
    {
        id: "pending-requests",
        title: "Pending Requests",
        valueKey: "pendingRequests",
        subtitle: "Need attention",
        subtitleColor: "text-rose-600",
        icon: Hourglass,
        iconBg: "bg-rose-50",
        iconColor: "text-rose-600",
    },
    {
        id: "contacted-requests",
        title: "Contacted",
        valueKey: "contactedRequests",
        subtitle: "Contact initiated",
        subtitleColor: "text-amber-600",
        icon: PhoneForwarded,
        iconBg: "bg-amber-50",
        iconColor: "text-[#D97706]",
    },
    {
        id: "completed-requests",
        title: "Completed",
        valueKey: "completedRequests",
        subtitle: "Successfully completed",
        subtitleColor: "text-emerald-600",
        icon: CheckCircle2,
        iconBg: "bg-emerald-50",
        iconColor: "text-emerald-600",
    },
];

const badgeColors = [
    { bg: "bg-blue-100", text: "text-blue-600" },
    { bg: "bg-purple-100", text: "text-purple-600" },
    { bg: "bg-green-100", text: "text-green-600" },
    { bg: "bg-amber-100", text: "text-amber-600" },
    { bg: "bg-rose-100", text: "text-rose-600" },
];

const statusColorMap = {
    Open: { bg: "bg-red-100", text: "text-red-600" },
    "In Progress": { bg: "bg-amber-100", text: "text-amber-600" },
    Resolved: { bg: "bg-emerald-100", text: "text-emerald-600" },
    Closed: { bg: "bg-slate-100", text: "text-slate-600" },
};

const filterConfig = [
    {
        label: "Status",
        key: "status",
        options: ["all", "open", "in_progress", "resolved", "closed"],
    },
    {
        label: "Sort By",
        key: "sortBy",
        options: ["newest", "oldest"],
    },
];

const mapFiltersToParams = (filters, search) => {
    const params = {};

    if (filters.status && filters.status !== "all") {
        params.status = filters.status;
    }

    if (filters.sortBy) {
        params.sortBy = filters.sortBy;
    }

    if (search.trim()) {
        params.search = search.trim();
    }

    return params;
};

function Support({ setCurrentPage, setSelectedTicketId }) {

    const [page, setPage] = useState(1);
    const [activeList, setActiveList] = useState('tickets');
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [filters, setFilters] = useState({
        status: "all",
        sortBy: "newest",
    });

    const [callPage, setCallPage] = useState(1);
    const [callSearch, setCallSearch] = useState("");
    const [debouncedCallSearch, setDebouncedCallSearch] = useState("");
    const [callFilters, setCallFilters] = useState({
        status: "all",
        sortBy: "newest",
    });

    const params = mapFiltersToParams(filters, debouncedSearch);

    const { data, isLoading, isError } = useGetMySupportTickets({ page, limit: 10, ...params });
    const { data: callRequestsData, isLoading: callRequestsLoading, isError: callRequestsError, } = useGetMyCallRequests({
        page: callPage,
        limit: 10,
        search: debouncedCallSearch,
        status: callFilters.status === "all" ? "" : callFilters.status,
        sortBy: callFilters.sortBy,
    });

    const tickets = data?.tickets || [];
    const totalPages = data?.pagination?.totalPages || 1;

    const callRequests = callRequestsData?.callRequests || [];
    const callRequestsTotalPages = callRequestsData?.pagination?.totalPages || 1;

    useEffect(() => {
        setPage(1);
    }, [filters, search]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 400);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedCallSearch(callSearch);
            setCallPage(1);
        }, 400);

        return () => clearTimeout(timer);
    }, [callSearch]);

    const updateFilter = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setPage(1);
    };

    const updateCallFilter = (key, value) => {
        setCallFilters((prev) => ({ ...prev, [key]: value }));
        setCallPage(1);
    };

    return (
        <div className='pb-6 space-y-6'>

            {/* header */}
            <div className='w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0'>
                <div className='flex flex-col'>
                    <h1 className='text-xl md:text-2xl font-bold text-slate-900'>Support</h1>
                    <p className='text-xs md:text-sm text-slate-500 p-px mt-0.5'>
                        Get help, track requests, and find quick answers.
                    </p>
                </div>

                {/* Actions */}
                <div className='flex items-center gap-2.5 w-full md:w-auto'>
                    <button
                        onClick={() => setCurrentPage('request-call')}
                        className="group flex-1 md:flex-none inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] transition-all duration-200">
                        Request a Call
                    </button>

                    <button
                        onClick={() => setCurrentPage('create-ticket')}
                        className="group flex-1 md:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm shadow-amber-600/20 hover:bg-amber-700 active:scale-[0.98] transition-all duration-200">
                        <Plus className="h-4 w-4 text-white/90 transition-transform duration-300 group-hover:rotate-90" />
                        New Support Ticket
                    </button>
                </div>
            </div>

            {/* tabs */}
            <div className="flex gap-2 border-b border-slate-200">
                <button
                    type="button"
                    onClick={() => setActiveList("tickets")}
                    className={`px-4 py-2 text-sm font-semibold transition-colors ${activeList === "tickets" ? "border-b-2 border-[#D97706] text-[#D97706]" : "text-slate-500 hover:text-slate-700"}`}>
                    Support Tickets
                </button>
                <button
                    type="button"
                    onClick={() => setActiveList("calls")}
                    className={`px-4 py-2 text-sm font-semibold transition-colors ${activeList === "calls" ? "border-b-2 border-[#D97706] text-[#D97706]" : "text-slate-500 hover:text-slate-700"}`}>
                    Call Requests
                </button>
            </div>

            {activeList === "tickets" && (
                <>
                    {/* stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 my-6">
                        {statsData.map((stat) => {
                            const IconComponent = stat.icon;

                            return (
                                <div
                                    key={stat.id}
                                    className="bg-white p-4 rounded-2xl border border-slate-100 shadow-md flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-amber-200 cursor-pointer"
                                >
                                    <div
                                        className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${stat.iconBg} flex items-center justify-center shrink-0 transition-transform duration-300 hover:scale-105`}
                                    >
                                        <IconComponent
                                            className={`w-5 h-5 md:w-6 md:h-6 ${stat.iconColor}`}
                                        />
                                    </div>

                                    <div>
                                        <p className="text-xs font-medium text-slate-400">
                                            {stat.title}
                                        </p>

                                        <h3 className="text-lg md:text-xl font-bold text-[#0B1E3D] my-1">
                                            {data?.stats?.[stat.valueKey] ?? 0}
                                        </h3>

                                        <p className={`text-[11px] font-semibold ${stat.subtitleColor}`}>
                                            {stat.subtitle}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Filter */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-4 px-4 border border-gray-300 bg-white/80 rounded-xl">

                        <div className="flex items-center">
                            <h1 className="text-lg font-semibold text-gray-800">
                                My Support Tickets
                            </h1>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

                            <div className="w-full sm:w-72">
                                <SearchBar
                                    placeholder="Search by ticket ID, subject..."
                                    value={search}
                                    onChange={(value) => setSearch(value)}
                                />
                            </div>

                            {/* dropdown */}
                            {filterConfig.map(({ label, key, options }) => (
                                <div
                                    key={key}
                                    className="w-full sm:w-42"
                                >
                                    <FilterDropdown
                                        label={label}
                                        options={options.map((opt) => ({
                                            label: opt,
                                            value: opt,
                                        }))}
                                        value={filters[key]}
                                        onChange={(value) => updateFilter(key, value)}
                                    />
                                </div>
                            ))}

                        </div>
                    </div>

                    {/* main section */}
                    <div className='grid grid-cols-1 xl:grid-cols-3 gap-6 items-start'>

                        {/* ------------------------- LEFT ------------------------- */}
                        <div className='xl:col-span-2 space-y-6'>

                            {/* list */}
                            <div className="overflow-x-auto border border-slate-200/80 rounded-xl shadow-xs bg-white">
                                <table className="w-full text-left table-fixed">
                                    <thead className="bg-white border-b border-slate-200 text-[#0B1E3D] uppercase text-[11px] font-extrabold tracking-wider">
                                        <tr>
                                            <th className="px-6 py-4.5 w-35">Support ID</th>
                                            <th className="px-6 py-4.5 w-50">Subject</th>
                                            <th className="px-6 py-4.5 w-35">Category</th>
                                            <th className="px-6 py-4.5 w-40">Status</th>
                                            <th className="px-6 py-4.5 w-40">Last Updated</th>
                                            <th className="px-6 py-4.5 w-35 ">Action</th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-slate-100 transition-opacity">
                                        {isLoading ? (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                                    Loading tickets...
                                                </td>
                                            </tr>
                                        ) : isError ? (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-8 text-center text-red-500">
                                                    Tickets load nahi ho sake.
                                                </td>
                                            </tr>
                                        ) : tickets.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                                    No support tickets found.
                                                </td>
                                            </tr>
                                        ) : (
                                            tickets.map((ticket, index) => {
                                                const statusLabel = {
                                                    open: "Open",
                                                    in_progress: "In Progress",
                                                    resolved: "Resolved",
                                                    closed: "Closed",
                                                }[ticket.status] || ticket.status;

                                                const ticketStatusStyle = statusColorMap[statusLabel] || {
                                                    bg: "bg-slate-100",
                                                    text: "text-slate-600",
                                                };

                                                const categoryStyle = badgeColors[index % badgeColors.length];

                                                return (
                                                    <tr key={ticket._id} className="hover:bg-slate-50/50 transition-colors">
                                                        <td className="px-6 py-4 font-semibold text-slate-800 text-sm">
                                                            {ticket.supportId}
                                                        </td>

                                                        <td className="px-6 py-4 truncate">
                                                            <div className="font-medium text-slate-900 text-sm truncate">
                                                                {ticket.subject}
                                                            </div>
                                                            <div className="text-xs text-slate-400 truncate mt-0.5">
                                                                {ticket.description}
                                                            </div>
                                                        </td>

                                                        <td className="px-6 py-4">
                                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${categoryStyle.bg} ${categoryStyle.text}`}>
                                                                {ticket.category}
                                                            </span>
                                                        </td>

                                                        <td className="px-6 py-4">
                                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${ticketStatusStyle.bg} ${ticketStatusStyle.text}`}>
                                                                {statusLabel}
                                                            </span>
                                                        </td>

                                                        <td className="px-6 py-4 text-xs text-slate-500">
                                                            {new Date(ticket.updatedAt || ticket.createdAt).toLocaleString("en-GB", {
                                                                timeZone: "Asia/Dubai",
                                                                dateStyle: "medium",
                                                                timeStyle: "short",
                                                            })}
                                                        </td>

                                                        <td className="px-6 py-4">
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setCurrentPage("support-detail");
                                                                    setSelectedTicketId(ticket._id);
                                                                }}
                                                                className="px-4 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-slate-50"
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
                                            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
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
                                            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                        >
                                            Next
                                        </button>

                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ------------------------- RIGHT ------------------------- */}
                        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6'>

                            {/* 1. Need Immediate Help Box */}
                            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
                                <div className="flex items-start space-x-4 mb-5">
                                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0 text-blue-600">
                                        <Headphones className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-base">Need immediate help?</h3>
                                        <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                                            Our support team is here to assist you with any issue.
                                        </p>
                                    </div>
                                </div>
                                <button className="w-full bg-[#D97706] hover:bg-amber-500 text-white font-medium py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2 shadow-sm cursor-pointer">
                                    <Headphones className="w-4 h-4" />
                                    <span>Contact Support</span>
                                </button>
                            </div>

                            {/* 2. Quick Actions Box */}
                            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
                                <h3 className="font-bold text-slate-900 text-base mb-4">Quick Actions</h3>
                                <div className="space-y-1">
                                    {/* Create New Ticket */}
                                    <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                                        <div className="flex items-center space-x-3.5">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                                <Edit className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-slate-900 text-sm">Create New Ticket</div>
                                                <div className="text-xs text-slate-400 mt-0.5">Get help with your issue</div>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                                    </div>

                                    {/* Live Chat */}
                                    <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                                        <div className="flex items-center space-x-3.5">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                                <MessageSquare className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-slate-900 text-sm">Live Chat</div>
                                                <div className="text-xs text-slate-400 mt-0.5">Chat with our support team</div>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                                    </div>

                                    {/* Call Us */}
                                    <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                                        <div className="flex items-center space-x-3.5">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                                <Phone className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-slate-900 text-sm">Call Us</div>
                                                <div className="text-xs text-slate-400 mt-0.5">+971 4 123 4567 (Mon - Fri, 9AM - 6PM)</div>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                                    </div>

                                    {/* Email Us */}
                                    <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                                        <div className="flex items-center space-x-3.5">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                                <Mail className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-slate-900 text-sm">Email Us</div>
                                                <div className="text-xs text-slate-400 mt-0.5">support@biddrive.ae</div>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                                    </div>
                                </div>
                            </div>

                            {/* 3. We're here to help Box */}
                            <div className="bg-amber-50/60 border border-amber-200/60 rounded-2xl p-6 shadow-sm flex items-start space-x-4">
                                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 text-amber-600">
                                    <ShieldAlert className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm">We're here to help!</h4>
                                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                        If you can't find what you're looking for, feel free to reach out to our support team.
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>

                </>
            )}

            {activeList === "calls" && (
                <>
                    {/* stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 my-6">
                        {callStatsData.map((stat) => {
                            const IconComponent = stat.icon;

                            return (
                                <div
                                    key={stat.id}
                                    className="bg-white p-4 rounded-2xl border border-slate-100 shadow-md flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-amber-200 cursor-pointer"
                                >
                                    <div
                                        className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${stat.iconBg} flex items-center justify-center shrink-0 transition-transform duration-300 hover:scale-105`}
                                    >
                                        <IconComponent
                                            className={`w-5 h-5 md:w-6 md:h-6 ${stat.iconColor}`}
                                        />
                                    </div>

                                    <div>
                                        <p className="text-xs font-medium text-slate-400">
                                            {stat.title}
                                        </p>

                                        <h3 className="text-lg md:text-xl font-bold text-[#0B1E3D] my-1">
                                            {callRequestsData?.stats?.[stat.valueKey] ?? 0}
                                        </h3>

                                        <p className={`text-[11px] font-semibold ${stat.subtitleColor}`}>
                                            {stat.subtitle}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center p-4 border border-gray-300 bg-white/80 rounded-xl">
                        {/* Search */}
                        <div className="w-full min-w-0 sm:flex-1">
                            <SearchBar
                                placeholder="Search by request ID or topic..."
                                value={callSearch}
                                onChange={setCallSearch}
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="w-full sm:w-44 sm:shrink-0">
                            <FilterDropdown
                                label="Status"
                                options={[
                                    { label: "All Status", value: "all" },
                                    { label: "Pending", value: "pending" },
                                    { label: "Contacted", value: "contacted" },
                                    { label: "Completed", value: "completed" },
                                    { label: "Cancelled", value: "cancelled" },
                                ]}
                                value={callFilters.status}
                                onChange={(value) => updateCallFilter("status", value)}
                            />
                        </div>

                        {/* Sort Filter */}
                        <div className="w-full sm:w-40 sm:shrink-0">
                            <FilterDropdown
                                label="Sort By"
                                options={[
                                    { label: "Newest", value: "newest" },
                                    { label: "Oldest", value: "oldest" },
                                ]}
                                value={callFilters.sortBy}
                                onChange={(value) => updateCallFilter("sortBy", value)}
                            />
                        </div>
                    </div>

                    {/* call req table */}
                    <div className="overflow-x-auto border border-slate-200/80 rounded-xl shadow-xs bg-white">
                        <div className="border-b border-slate-200 px-6 py-4">
                            <h2 className="text-lg font-semibold text-[#0B1E3D]">My Call Requests</h2>
                            <p className="mt-1 text-xs text-slate-500">Your submitted callback requests and their current status.</p>
                        </div>

                        <table className="w-full text-left table-fixed">
                            <thead className="bg-white border-b border-slate-200 text-[#0B1E3D] uppercase text-[11px] font-extrabold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 w-35">Request ID</th>
                                    <th className="px-6 py-4 w-50">Topic</th>
                                    <th className="px-6 py-4 w-40">Preferred Date</th>
                                    <th className="px-6 py-4 w-50">Time Slot</th>
                                    <th className="px-6 py-4 w-35">Status</th>
                                    <th className="px-6 py-4 w-40">Submitted</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {callRequestsLoading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                            Loading call requests...
                                        </td>
                                    </tr>
                                ) : callRequestsError ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-red-500">
                                            Call requests could not be loaded.
                                        </td>
                                    </tr>
                                ) : callRequests.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                            You have no call requests yet.
                                        </td>
                                    </tr>
                                ) : (
                                    callRequests.map((request) => {
                                        const requestStatus = {
                                            pending: { label: "Pending", bg: "bg-amber-100", text: "text-amber-700" },
                                            contacted: { label: "Contacted", bg: "bg-blue-100", text: "text-blue-700" },
                                            completed: { label: "Completed", bg: "bg-emerald-100", text: "text-emerald-700" },
                                            cancelled: { label: "Cancelled", bg: "bg-slate-100", text: "text-slate-600" },
                                        }[request.status] || { label: request.status, bg: "bg-slate-100", text: "text-slate-600" };

                                        return (
                                            <tr key={request._id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4 font-semibold text-slate-800 text-sm">
                                                    {request.callRequestId}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-800 truncate">
                                                    {request.topic}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600">
                                                    {request.preferredDate}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600">
                                                    {request.preferredTimeSlot}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${requestStatus.bg} ${requestStatus.text}`}>
                                                        {requestStatus.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-xs text-slate-500">
                                                    {new Date(request.createdAt).toLocaleString("en-GB", {
                                                        timeZone: "Asia/Dubai",
                                                        dateStyle: "medium",
                                                        timeStyle: "short",
                                                    })}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>

                        {callRequestsTotalPages > 1 && (
                            <div className="flex items-center justify-between gap-4 px-6 py-4 border-t border-slate-200">
                                <p className="hidden sm:block text-xs text-slate-500">
                                    Page <span className="font-semibold text-[#0B1E3D]">{callPage}</span> of{" "}
                                    <span className="font-semibold text-[#0B1E3D]">{callRequestsTotalPages}</span>
                                </p>
                                <div className="flex items-center gap-2 ml-auto">
                                    <button
                                        type="button"
                                        onClick={() => setCallPage((current) => current - 1)}
                                        disabled={callPage === 1}
                                        className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setCallPage((current) => current + 1)}
                                        disabled={callPage >= callRequestsTotalPages}
                                        className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

export default Support
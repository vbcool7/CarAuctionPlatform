
import React, { useState } from 'react';
import { HelpCircle, FileText, MessageCircle, Phone, ArrowRight, Search, Eye } from 'lucide-react';

import { getPaginationRange } from '../../utils/getPaginationRange';
import { useGetMySupportTickets } from '../../../hook/useSupport';

const tabs = ['All Tickets', 'Open', 'In Progress', 'Resolved', 'Closed'];
const tabKeys = ['all tickets', 'open', 'in progress', 'resolved', 'closed'];

const supportOptions = [
    {
        title: 'FAQs',
        desc: 'Find answers to common questions',
        icon: <HelpCircle size={26} className="text-amber-600" />,
        bgColor: 'bg-amber-50',
        page: 'faqs',
    },
    {
        title: 'Submit a Ticket',
        desc: 'Contact our support team',
        icon: <FileText size={26} className="text-[#0B1E3D]" />,
        bgColor: 'bg-slate-100',
        page: 'submit-ticket',
    },
    {
        title: 'Live Chat',
        desc: 'Chat with our support team',
        icon: <MessageCircle size={26} className="text-amber-600" />,
        bgColor: 'bg-amber-50',
        page: 'live-chat',
    },
    {
        title: 'Request a Call',
        desc: 'Request a callback from us',
        icon: <Phone size={26} className="text-[#0B1E3D]" />,
        bgColor: 'bg-slate-100',
        page: 'request-call',
    },
];

const statusStyle = {
    Open: 'bg-green-100 text-green-700',
    'In Progress': 'bg-amber-100 text-amber-700',
    Resolved: 'bg-blue-100 text-blue-700',
    Closed: 'bg-slate-100 text-slate-500',
};

const formatStatus = (status) => {
    const labels = {
        open: 'Open',
        in_progress: 'In Progress',
        resolved: 'Resolved',
        closed: 'Closed',
    };

    return labels[status] || status;
};

const formatDate = (date) => {
    if (!date) return '—';

    return new Date(date).toLocaleString('en-IN', {
        timeZone: 'Asia/Dubai',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
};

function BuyerSupportStats({ setSupportPage }) {

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState();
    const [sortBy, setSortBy] = useState("newest");
    const [activeTab, setActiveTab] = useState(0);

    const status = tabKeys[activeTab];

    const { data, isLoading, isError } = useGetMySupportTickets({ page, limit: 10, status, search, sortBy, });

    const tickets = data?.tickets || [];
    const totalPages = data?.pagination?.totalPages || 1;

    if (isLoading) return <p className="p-10 text-center">Loading support ticket list....</p>;
    if (isError) return <p className="p-10 text-center text-red-500">Failed to load support ticket list</p>;

    return (
        <div className="w-full space-y-8">

            {/* cards */}
            <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {supportOptions.map((opt, i) => (
                        <div
                            key={i}
                            onClick={() => setSupportPage(opt.page)}
                            className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all group cursor-pointer"
                        >
                            <div className={`w-11 h-11 ${opt.bgColor} rounded-full flex items-center justify-center mb-4`}>
                                {opt.icon}
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <h3 className="font-bold text-[#0B1E3D] text-sm mb-0.5">{opt.title}</h3>
                                    <p className="text-slate-500 text-xs">{opt.desc}</p>
                                </div>
                                <ArrowRight size={18} className="text-slate-300 group-hover:text-[#D97706] transition-colors shrink-0" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* search */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="relative">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        placeholder="Search tickets by subject, category, or ticket ID..."
                        className="w-full py-2.5 pl-4 pr-12 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
                    />
                    <Search className="absolute right-4 top-2.5 text-slate-400" size={20} />
                </div>
            </div>

            {/* ticket list */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="p-5 pb-0">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-[#0B1E3D]">My Support Tickets</h2>
                        <select
                            value={sortBy}
                            onChange={(e) => {
                                setSortBy(e.target.value);
                                setPage(1);
                            }}
                            className="text-sm text-slate-600 border border-slate-200 rounded-lg px-3 py-1.5"
                        >
                            <option value="newest">Newest first</option>
                            <option value="oldest">Oldest first</option>
                        </select>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-6 border-b border-slate-100">
                        {tabs.map((tab, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    setActiveTab(i);
                                    setPage(1);
                                }}
                                className={`pb-2.5 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === i
                                    ? 'text-[#D97706] border-b-2 border-[#D97706]'
                                    : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-sm mt-4">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 text-slate-500 uppercase tracking-wider text-[11px] font-bold border-b border-slate-200/80">
                                <th className="px-5 py-3.5 min-w-30">Support ID</th>
                                <th className="px-4 py-3.5 min-w-60">Subject & Details</th>
                                <th className="px-4 py-3.5 min-w-35">Category</th>
                                <th className="px-4 py-3.5 min-w-30">Status</th>
                                <th className="px-4 py-3.5 min-w-35">Last Update</th>
                                <th className="px-4 py-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {tickets.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-5 py-12 text-center text-slate-400 font-medium text-sm">
                                        No support tickets found.
                                    </td>
                                </tr>
                            ) : (
                                tickets.map((ticket) => {
                                    const displayStatus = formatStatus(ticket.status);

                                    return (
                                        <tr
                                            key={ticket._id}
                                            className="hover:bg-slate-50/80 transition-all duration-150 group"
                                        >
                                            <td className="px-5 py-4 font-bold text-[#0B1E3D] whitespace-nowrap text-xs">
                                                <span className="px-2 py-1 bg-slate-100 rounded-md border border-slate-200/60">
                                                    {ticket.supportId}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-[#0B1E3D] tracking-tight group-hover:text-[#D97706] transition-colors">
                                                        {ticket.subject}
                                                    </span>
                                                    <span className="text-xs text-slate-400 font-medium line-clamp-1 mt-0.5">
                                                        {ticket.description || 'No description provided'}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-4 py-4 text-slate-600 font-medium text-xs capitalize">
                                                <span className="px-2.5 py-1 bg-slate-50 border border-slate-200/60 rounded-md">
                                                    {ticket.category}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold shadow-2xs ${statusStyle[displayStatus] || "bg-slate-100 text-slate-600"
                                                        }`}
                                                >
                                                    {displayStatus}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4 text-slate-500 whitespace-nowrap text-xs font-medium">
                                                {formatDate(ticket.updatedAt || ticket.createdAt)}
                                            </td>

                                            <td className="px-4 py-4 text-right">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center gap-1.5 text-slate-700 bg-white border border-slate-200 text-xs font-semibold rounded-xl px-3 py-1.5 hover:bg-amber-50 hover:text-[#D97706] hover:border-amber-200 transition-all shadow-2xs cursor-pointer"
                                                >
                                                    <Eye size={13} /> View
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
                    <div className="flex items-center justify-between gap-4 px-5 py-4 mt-5 ">
                        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
                            <span>Page</span>

                            <span className="inline-flex items-center justify-center min-w-7 h-7 px-2 rounded-lg bg-slate-50 border border-slate-100 font-bold text-[#0B1E3D]">
                                {page}
                            </span>

                            <span>of</span>

                            <span className="font-semibold text-[#0B1E3D]">
                                {totalPages}
                            </span>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center gap-1.5 mx-auto sm:mx-0 sm:ml-auto">
                            <button
                                type="button"
                                onClick={() => setPage((p) => p - 1)}
                                disabled={page === 1}
                                className=" h-9 px-3.5 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-xs font-semibold text-[#0B1E3D] hover:bg-slate-50 hover:border-[#0B1E3D] disabled:opacity-35 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                Previous
                            </button>

                            <div className="flex items-center gap-1">
                                {getPaginationRange(page, totalPages).map((num, idx) =>
                                    num === "..." ? (
                                        <span
                                            key={`dot-${idx}`}
                                            className=" w-8 h-9 flex items-center justify-center text-xs font-semibold text-slate-400"
                                        >
                                            ...
                                        </span>
                                    ) : (
                                        <button
                                            type="button"
                                            key={num}
                                            onClick={() => setPage(num)}
                                            className={` w-9 h-9 flex items-center justify-center rounded-lg text-xs font-bold border transition-all duration-200
                                                                                                                                                    ${page === num
                                                    ? "bg-[#0B1E3D] text-white border-[#0B1E3D] shadow-md shadow-slate-200 scale-[1.02]"
                                                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-[#0B1E3D] hover:text-[#0B1E3D]"
                                                }`}
                                        >
                                            {num}
                                        </button>
                                    )
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={() => setPage((p) => p + 1)}
                                disabled={page === totalPages}
                                className=" h-9 px-3.5 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-xs font-semibold text-[#0B1E3D] hover:bg-slate-50 hover:border-[#0B1E3D] disabled:opacity-35 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
}

export default BuyerSupportStats;
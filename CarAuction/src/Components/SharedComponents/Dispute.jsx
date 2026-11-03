
import React, { useEffect, useState } from 'react';
import { Eye, Search } from 'lucide-react';

import { useGetMyDisputes } from '../../hook/useDispute';
import { getPaginationRange } from '../../utils/getPaginationRange';
import { formatDateTime, formatPrice } from '../../utils/formatters';
import { STATUS_META } from '../../utils/disputeIcons';

const STATUS_TABS = [
    { key: '', label: 'All', count: 'all' },
    { key: 'open', label: 'Open', count: 'open' },
    { key: 'under_review', label: 'Under Review', count: 'under_review' },
    { key: 'closed', label: 'Closed', count: 'closed' },
];

const VIEW_TABS = [
    { key: '', label: 'All' },
    { key: 'raised', label: 'Raised by me' },
    { key: 'against', label: 'Against me' },
];

const roleLabel = (r) => (r === 'seller' ? 'Seller' : 'Buyer');

function Dispute({ setCurrentPage, setSelectedDisputeId, detailPage = 'disputes-detail' }) {

    const [page, setPage] = useState(1);
    const [status, setStatus] = useState('');
    const [view, setView] = useState('');
    const [search, setSearch] = useState('');
    const [debounced, setDebounced] = useState('');

    const { data, isLoading, isError, isPlaceholderData } = useGetMyDisputes({ page, limit: 10, status, view, search: debounced });

    const disputes = data?.disputes || [];
    const summary = data?.summary || {};
    const totalPages = data?.pagination?.totalPages || 1;

    useEffect(() => {
        const t = setTimeout(() => setDebounced(search.trim()), 400);
        return () => clearTimeout(t);
    }, [search]);

    useEffect(() => {
        setPage(1);
    }, [status, view, debounced]);

    if (isLoading) return <p className="p-10 text-center">Loading disputes....</p>;
    if (isError) return <p className="p-10 text-center text-red-500">Failed to load disputes</p>;

    return (
        <div className="pb-6 space-y-6">

            {/* header */}
            <div>
                <h1 className="text-xl md:text-2xl font-bold">Disputes</h1>
                <p className="text-xs md:text-sm text-gray-600 p-px">
                    Disputes you raised, or that were raised against you, on paid orders.
                </p>
            </div>
            
            {/* search / tabs */}
            <div className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                <div className="relative w-full md:max-w-md">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                        <Search size={16} />
                    </span>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by dispute ID, order ID or listing ID..."
                        className="w-full rounded-lg border border-gray-200 bg-gray-50/50 pl-9 pr-4 py-2 text-sm text-gray-800 outline-none transition-all focus:border-[#D97706] focus:ring-2 focus:ring-[#D97706]/10"
                    />
                </div>

                <div className="inline-flex items-center rounded-lg border border-gray-200 bg-gray-50 p-1 self-start md:self-auto overflow-x-auto max-w-full">
                    {VIEW_TABS.map((t) => (
                        <button
                            key={t.key}
                            type="button"
                            onClick={() => setView(t.key)}
                            className={`px-5 py-2 rounded-md text-xs font-medium transition-all whitespace-nowrap ${view === t.key
                                    ? 'bg-[#D97706] text-white shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
                                }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

            </div>

            {/* tabs */}
            <div className="flex gap-8 border-b border-gray-100 overflow-x-auto">
                {STATUS_TABS.map((t) => (
                    <button
                        key={t.key}
                        type="button"
                        onClick={() => setStatus(t.key)}
                        className={`pb-3 text-[14px] font-medium whitespace-nowrap border-b-2 transition-colors ${status === t.key
                            ? 'border-[#D97706] text-[#D97706]'
                            : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                        {t.label}
                        <span className="ml-1.5 text-[11px] text-gray-400">({summary[t.count] ?? 0})</span>
                    </button>
                ))}
            </div>

            {/* table */}
            <div className={`overflow-x-auto border border-slate-200/80 rounded-xl shadow-xs bg-white transition-opacity ${isPlaceholderData ? 'opacity-50' : ''}`}>
                <table className="w-full text-left table-fixed">
                    <thead className="bg-white border-b border-slate-200 text-[#0B1E3D] uppercase text-[11px] font-extrabold tracking-wider">
                        <tr>
                            <th className="px-4 py-3  w-30">Dispute</th>
                            <th className="px-4 py-3 w-45">Order / Vehicle</th>
                            <th className="px-4 py-3 w-40">Category</th>
                            <th className="px-4 py-3 w-45">Other Party</th>
                            <th className="px-4 py-3 w-30">Amount</th>
                            <th className="px-4 py-3 w-30">Status</th>
                            <th className="px-4 py-3 w-38">Raised On</th>
                            <th className="px-4 py-3 w-20">View</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {disputes.length > 0 ? disputes.map((d) => {
                            const meta = STATUS_META[d.status] || STATUS_META.closed;
                            return (
                                <tr
                                    key={d._id}
                                    className="text-[13px] hover:bg-gray-50/50">

                                    {/* dispute id */}
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-indigo-600">{d.disputeId}</div>
                                        <div className="text-[11px] text-gray-400">{d.iRaised ? 'Raised by me' : 'Against me'}</div>
                                    </td>

                                    {/* order id / vehicle */}
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-gray-800">{d.orderNumber}</div>
                                        <div className="text-[11px] text-gray-400 truncate max-w-48" title={d.vehicleTitle}>{d.vehicleTitle || d.listingId}</div>
                                    </td>

                                    {/* category */}
                                    <td className="px-4 py-3 text-gray-700">{d.categoryName || '—'}</td>

                                    {/* party */}
                                    <td className="px-4 py-3">
                                        <div className="text-gray-800">{d.counterparty?.name || '—'}</div>
                                        <div className="text-[11px] text-gray-400">{roleLabel(d.counterparty?.role)}</div>
                                    </td>

                                    {/* amt */}
                                    <td className="px-4 py-3 font-semibold text-gray-800">{formatPrice(d.amount)}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded border text-[11px] font-medium ${meta.cls}`}>{meta.label}</span>
                                    </td>

                                    {/* dispute created date */}
                                    <td className="px-4 py-3 text-[12px] text-gray-600">{formatDateTime(d.createdAt)}</td>

                                    {/* action */}
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            type="button"
                                            title="View dispute"
                                            onClick={() => {
                                                setSelectedDisputeId(d._id);
                                                setCurrentPage(detailPage);
                                            }}
                                            className="p-1.5 text-gray-400 hover:text-gray-700">
                                            <Eye size={16} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        }) : (
                            <tr>
                                <td colSpan={8} className="px-4 py-12 text-center">
                                    <p className="text-sm font-medium text-gray-500">No disputes found</p>
                                    <p className="text-xs text-gray-400 mt-1">You can raise a dispute from a paid order’s detail page.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

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
                            className=" h-9 px-3.5 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-xs font-semibold text-[#0B1E3D] hover:bg-slate-50 hover:border-[#0B1E3D] disabled:opacity-35 disabled:cursor-not-allowed transition-all duration-200">
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
                            className=" h-9 px-3.5 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-xs font-semibold text-[#0B1E3D] hover:bg-slate-50 hover:border-[#0B1E3D] disabled:opacity-35 disabled:cursor-not-allowed transition-all duration-200">
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dispute;
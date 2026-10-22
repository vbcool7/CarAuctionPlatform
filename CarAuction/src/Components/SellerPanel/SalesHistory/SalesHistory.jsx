
import React, { useEffect, useState } from 'react';
import { Percent, Tag, TrendingUp, Wallet, LineChart, ChevronLeft, ChevronRight } from 'lucide-react';
import SearchBar from '../SellerSharedComponents/SearchBar';
import FilterDropdown from '../SellerSharedComponents/FilterDropdown';
import { useGetMySales, useGetMySalesSummary } from '../../../hook/useSales';
import { money, fmtDate, fmtTime, imgOf, STATUS_META, SOURCE_LABEL } from '../../../utils/salesUtils';
import { getPaginationRange } from '../../../utils/getPaginationRange';

const LIMIT = 10;

const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'pending', label: 'Pending Payment' },
    { value: 'sold', label: 'Sold' },
    { value: 'completed', label: 'Completed' },
    { value: 'expired', label: 'Expired' },
    { value: 'cancelled', label: 'Cancelled' },
];

const paymentTypeOptions = [
    { value: '', label: 'All Payment Types' },
    { value: 'auction', label: 'Live Auction' },
    { value: 'buy_now', label: 'Fixed Price' },
];

function SalesHistory({ setCurrentPage, setSelectedSalesId }) {

    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [status, setStatus] = useState('');
    const [paymentType, setPaymentType] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedSearch(search.trim());
            setPage(1);
        }, 400);
        return () => clearTimeout(t);
    }, [search]);

    const { data, isLoading, isError, isFetching } = useGetMySales(page, LIMIT, status, paymentType, debouncedSearch);
    const { data: summaryData } = useGetMySalesSummary();

    const sales = data?.sales || [];
    const pagination = data?.pagination || { page: 1, totalPages: 1, total: 0 };
    const sm = summaryData?.summary || {};

    const monthLabel = new Date().toLocaleString('en-GB', { month: 'long', year: 'numeric', timeZone: 'Asia/Dubai' });

    const statsData = [
        {
            id: 'total-sales', title: 'Total Sales', value: sm.totalSales ?? 0, subtitle: 'All Time',
            subtitleColor: 'text-green-600', icon: TrendingUp, iconBg: 'bg-green-100', iconColor: 'text-green-600',
        },
        {
            id: 'total-sales-amount', title: 'Total Sales Amount', value: money(sm.totalSalesAmount), subtitle: 'All Time',
            subtitleColor: 'text-purple-600', icon: Tag, iconBg: 'bg-purple-100', iconColor: 'text-purple-600',
        },
        {
            id: 'average-selling-price', title: 'Average Selling Price', value: money(sm.averageSellingPrice), subtitle: 'All Time',
            subtitleColor: 'text-amber-500', icon: Wallet, iconBg: 'bg-amber-100', iconColor: 'text-amber-600',
        },
        {
            id: 'total-commission', title: 'Total Commission', value: money(sm.totalCommission), subtitle: 'All Time',
            subtitleColor: 'text-blue-600', icon: Percent, iconBg: 'bg-blue-100', iconColor: 'text-blue-600',
        },
        {
            id: 'this-month-sales', title: 'This Month Sales', value: money(sm.thisMonthSalesAmount),
            subtitle: `${monthLabel} · ${sm.thisMonthSalesCount ?? 0} sold`,
            subtitleColor: 'text-rose-500', icon: LineChart, iconBg: 'bg-rose-100', iconColor: 'text-rose-600',
            extraClass: 'sm:col-span-2 lg:col-span-1',
        },
    ];

    return (
        <div className='pb-6 space-y-6'>

            {/* header */}
            <div className='flex flex-col'>
                <h1 className='text-xl md:text-2xl font-bold'>Sales History</h1>
                <p className='text-xs md:text-sm text-gray-600 p-px'>
                    Track your sold vehicles, payments and payouts.
                </p>
            </div>

            {/* stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 my-6">
                {statsData.map((stat) => {
                    const IconComponent = stat.icon;
                    return (
                        <div
                            key={stat.id}
                            className={`bg-white p-4 rounded-2xl border border-slate-100 shadow-md flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-amber-200 ${stat.extraClass || ''}`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-xs font-medium text-slate-400">{stat.title}</p>
                                <div className={`w-9 h-9 rounded-full ${stat.iconBg} flex items-center justify-center shrink-0`}>
                                    <IconComponent className={`w-4 h-4 ${stat.iconColor}`} />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl md:text-2xl font-bold text-[#0B1E3D] my-0.5">{stat.value}</h3>
                                <p className={`text-[11px] font-semibold ${stat.subtitleColor}`}>{stat.subtitle}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* filter */}
            <div className="flex flex-wrap gap-3 py-4 px-4 border border-gray-300 bg-white/80 rounded-xl">
                <div className='flex-1 min-w-50'>
                    <SearchBar value={search} onChange={setSearch} placeholder="Search by order ID or listing ID..." />
                </div>

                <div className='w-full sm:w-auto'>
                    <FilterDropdown
                        label="All Status"
                        options={statusOptions}
                        value={status}
                        onChange={(v) => { setStatus(v); setPage(1); }}
                    />
                </div>

                <div className='w-full sm:w-auto'>
                    <FilterDropdown
                        label="All Payment Types"
                        options={paymentTypeOptions}
                        value={paymentType}
                        onChange={(v) => { setPaymentType(v); setPage(1); }}
                    />
                </div>
            </div>

            {/* list */}
            <div className={`overflow-x-auto border border-slate-200/80 rounded-xl shadow-xs bg-white transition-opacity ${isFetching ? 'opacity-60' : ''}`}>
                <table className="w-full text-left table-fixed">
                    <thead className="bg-white border-b border-slate-200 text-[#0B1E3D] uppercase text-[11px] font-extrabold tracking-wider">
                        <tr>
                            <th className="px-6 py-4.5 w-65">Vehicle</th>
                            <th className="px-6 py-4.5 w-40">Buyer</th>
                            <th className="px-6 py-4.5 w-35">Sale Date</th>
                            <th className="px-6 py-4.5 w-35">Sale Price</th>
                            <th className="px-6 py-4.5 w-35">Commission</th>
                            <th className="px-6 py-4.5 w-40">Payout Amount</th>
                            <th className="px-6 py-4.5 w-40">Payout Date</th>
                            <th className="px-6 py-4.5 w-30">Type</th>
                            <th className="px-6 py-4.5 w-35">Status</th>
                            <th className="px-6 py-4.5 w-30">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan={10} className="px-6 py-14 text-center text-sm text-slate-500">Loading sales...</td></tr>
                        ) : isError ? (
                            <tr><td colSpan={10} className="px-6 py-14 text-center text-sm text-red-600">Could not load sales. Please refresh the page.</td></tr>
                        ) : sales.length === 0 ? (
                            <tr><td colSpan={10} className="px-6 py-14 text-center text-sm text-slate-500">No sales found.</td></tr>
                        ) : (
                            sales.map((sale) => {
                                const v = sale.vehicle || {};
                                const title = [v.year, v.make, v.model].filter(Boolean).join(' ') || 'Vehicle';
                                const image = imgOf(v);
                                const meta = STATUS_META[sale.status] || STATUS_META.cancelled;
                                const saleDate = sale.paidAt || sale.createdAt;

                                return (
                                    <tr key={sale._id} className='hover:bg-slate-50/60 transition-colors border-b border-gray-100 last:border-b-0'>
                                        {/* Vehicle */}
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                {image ? (
                                                    <img src={image} alt={title} className="w-15 h-10 object-cover rounded-lg border border-slate-200 shrink-0" />
                                                ) : (
                                                    <div className="w-15 h-10 rounded-lg border border-slate-200 bg-slate-100 shrink-0" />
                                                )}
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900">{title}</p>
                                                    <p className="text-xs text-slate-400">Stock ID: {sale.listingId || '—'}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Buyer (sirf naam) */}
                                        <td className="py-4 px-4">
                                            <p className="text-sm font-medium text-slate-900">{sale.buyerName}</p>
                                        </td>

                                        {/* Sale Date */}
                                        <td className="py-4 px-4">
                                            <p className="text-sm text-slate-900">{fmtDate(saleDate)}</p>
                                            <p className="text-xs text-slate-400">
                                                {sale.paidAt ? fmtTime(saleDate) : 'Awaiting payment'}
                                            </p>
                                        </td>

                                        {/* Sale Price */}
                                        <td className="py-4 px-4 text-sm font-semibold text-slate-900">{money(sale.amount)}</td>

                                        {/* Commission */}
                                        <td className="py-4 px-4">
                                            {sale.payout ? (
                                                <>
                                                    <p className="text-sm text-slate-900">{money(sale.payout.commissionAmount)}</p>
                                                    <p className="text-xs text-slate-400">({sale.payout.commissionPercent}%)</p>
                                                </>
                                            ) : (
                                                <span className="text-sm text-slate-400">—</span>
                                            )}
                                        </td>

                                        {/* Payout Amount */}
                                        <td className="py-4 px-4 text-sm font-semibold text-slate-900">
                                            {sale.payout ? money(sale.payout.netAmount) : '—'}
                                        </td>

                                        {/* Payout Date (transfer hone ke baad) */}
                                        <td className="py-4 px-4">
                                            {sale.payout?.paidAt ? (
                                                <>
                                                    <p className="text-sm text-slate-900">{fmtDate(sale.payout.paidAt)}</p>
                                                    <p className="text-xs text-slate-400">{fmtTime(sale.payout.paidAt)}</p>
                                                </>
                                            ) : (
                                                <span className="text-sm text-slate-400">—</span>
                                            )}
                                        </td>

                                        {/* Type */}
                                        <td className="py-4 px-4 text-[13px] font-semibold text-slate-900">
                                            {SOURCE_LABEL[sale.source] || sale.source}
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4.5">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${meta.cls}`}>
                                                {meta.label}
                                            </span>
                                        </td>

                                        {/* Action */}
                                        <td className="py-4 px-4 text-right">
                                            <button
                                                onClick={() => {
                                                    setSelectedSalesId(sale._id);
                                                    setCurrentPage('sales-history-detail');
                                                }}
                                                className="px-2 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between gap-4 px-6 py-4 border-t border-slate-200 bg-white">

                        {/* Page Info */}
                        <p className="hidden sm:block text-xs text-slate-500">
                            Page <span className="font-semibold text-[#0B1E3D]">{page}</span> of{" "}
                            <span className="font-semibold text-[#0B1E3D]">{pagination.totalPages}</span>
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
        </div>
    );
}

export default SalesHistory;
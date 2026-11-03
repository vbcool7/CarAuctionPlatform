
import React, { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, Eye, FileText, FolderOpen } from 'lucide-react';

import SearchBar from '../../SharedComponents/SearchBar';
import FilterDropdown from '../../SharedComponents/FilterDropdown';
import DateRangePicker from '../../SharedComponents/DateRangePicker';
import { formatPrice, toYMD, fmtDate, fmtTime } from '../../utils/formatter';

import { getPaginationRange } from '../../utils/getPaginationRange';
import { useGetAllDisputes, useGetDisputeCategories } from '../../../hooks/useDispute';

const STATUS_META = {
  open: { label: 'Open', style: 'bg-blue-50 text-blue-600' },
  under_review: { label: 'Under Review', style: 'bg-amber-50 text-amber-600' },
  resolved: { label: 'Resolved', style: 'bg-emerald-50 text-emerald-600' },
  rejected: { label: 'Rejected', style: 'bg-rose-50 text-rose-600' },
  closed: { label: 'Closed', style: 'bg-slate-100 text-slate-600' },
  withdrawn: { label: 'Withdrawn', style: 'bg-slate-100 text-slate-500' },
};

const OUTCOME_LABEL = {
  refund_buyer: 'Buyer refunded',
  release_seller: 'Seller released',
};

const tabs = [
  { id: 'all', label: 'All', status: '' },
  { id: 'open', label: 'Open', status: 'open' },
  { id: 'under_review', label: 'Under Review', status: 'under_review' },
  { id: 'resolved', label: 'Resolved', status: 'resolved' },
  { id: 'rejected', label: 'Rejected', status: 'rejected' },
  { id: 'closed', label: 'Closed', status: 'closed' },
  { id: 'withdrawn', label: 'Withdrawn', status: 'withdrawn' },
];

const initials = (name) =>
  String(name || '?')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

const roleLabel = (role) => (role === 'seller' ? 'Seller' : 'Buyer');

function AllDisputes({ setCurrentPage, setSelectedAllDisputeId }) {

  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFilters] = useState({ categoryId: '', raisedByRole: '', sortBy: 'newest' });

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const { data, isLoading, isError, isPlaceholderData } = useGetAllDisputes({
    page,
    limit: 10,
    search: debouncedSearch,
    status,
    categoryId: filters.categoryId,
    raisedByRole: filters.raisedByRole,
    sortBy: filters.sortBy,
    startDate: startDate ? toYMD(startDate) : '',
    endDate: endDate ? toYMD(endDate) : '',
  });

  const { data: catData } = useGetDisputeCategories({ page: 1, limit: 50 });

  const disputes = data?.disputes ?? [];
  const stats = data?.stats ?? {};
  const staleAfterDays = data?.staleAfterDays ?? 7;
  const totalPages = data?.pagination?.totalPages || 1;

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [status, filters, debouncedSearch, startDate, endDate]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  if (isLoading) return <p className="p-10 text-center">Loading disputes....</p>;
  if (isError) return <p className="p-10 text-center text-red-500">Failed to load disputes</p>;

  const filterConfig = [
    {
      label: 'All Categories',
      key: 'categoryId',
      options: [
        { label: 'All Categories', value: '' },
        ...(catData?.categories ?? []).map((c) => ({ label: c.name, value: c._id })),
      ],
    },
    {
      label: 'Raised By',
      key: 'raisedByRole',
      options: [
        { label: 'Raised By (All)', value: '' },
        { label: 'Buyer', value: 'buyer' },
        { label: 'Seller', value: 'seller' },
      ],
    },
    {
      label: 'Sort By',
      key: 'sortBy',
      options: [
        { label: 'Newest', value: 'newest' },
        { label: 'Oldest', value: 'oldest' },
      ],
    },
  ];

  const pct = (n) => (stats.total ? `${((Number(n || 0) / stats.total) * 100).toFixed(1)}% of total` : '0% of total');

  // stats data
  const statsData = [
    {
      title: 'Total Disputes',
      value: Number(stats.total || 0).toLocaleString(),
      subTitle: 'All time',
      icon: FileText,
      theme: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Open',
      value: Number(stats.open || 0).toLocaleString(),
      subTitle: pct(stats.open),
      icon: FolderOpen,
      theme: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Under Review',
      value: Number(stats.under_review || 0).toLocaleString(),
      subTitle: pct(stats.under_review),
      icon: Clock,
      theme: 'bg-amber-50',
      iconColor: 'text-amber-500',
    },
    {
      title: 'Resolved',
      value: Number(stats.resolved || 0).toLocaleString(),
      subTitle: pct(stats.resolved),
      icon: CheckCircle,
      theme: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      title: 'Overdue',
      value: Number(stats.stale || 0).toLocaleString(),
      subTitle: `Open for ${staleAfterDays}+ days`,
      icon: AlertTriangle,
      theme: 'bg-red-50',
      iconColor: 'text-red-500',
    },
  ];

  return (
    <div className='pb-6'>

      {/* Header */}
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between pb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3D]">All Disputes</h1>

          <div className="mt-2 flex items-center text-[11px] md:text-[13px]">
            <span
              onClick={() => setCurrentPage("dashboard")}
              className="cursor-pointer text-slate-500 hover:text-[#D97706] transition-colors">
              Dashboard
            </span>

            <span className="mx-2 text-slate-300">/</span>
            <span className="text-slate-500">Dispute Management</span>

            <span className="mx-2 text-slate-300">/</span>
            <span className="font-medium text-[#D97706]">All Disputes</span>
          </div>
        </div>
      </div>

      {/* stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-5 gap-4">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl border border-slate-100 p-4 shadow-md flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-semibold text-slate-500 block mb-0.5">{stat.title}</span>
                <h4 className="py-1 text-base font-bold text-slate-900 tracking-tight">{stat.value}</h4>
                <span className="text-[11px] font-medium mt-1 block text-slate-500">{stat.subTitle}</span>
              </div>
              <div className={`w-11.5 h-11.5 rounded-xl flex items-center justify-center shrink-0 ${stat.theme} ${stat.iconColor}`}>
                <Icon className="w-5.5 h-5.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Search / Filter */}
      <div className="my-6 bg-white border border-slate-200 rounded-xl p-4 space-y-4">

        <div className="flex flex-wrap xl:flex-nowrap items-center gap-3">
          <div className="flex-1 sm:w-75">
            <SearchBar
              placeholder="Search by dispute ID, order ID, listing ID, vehicle, buyer or seller..."
              value={search}
              onChange={(value) => setSearch(value)}
            />
          </div>

          {filterConfig.map(({ label, key, options }) => (
            <div
              key={key}
              className="w-full sm:w-45">
              <FilterDropdown
                label={label}
                options={options}
                value={filters[key]}
                onChange={(value) => updateFilter(key, value)}
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
              setStatus('');
              setFilters({ categoryId: '', raisedByRole: '', sortBy: 'newest' });
              setStartDate(null);
              setEndDate(null);
              setPage(1);
            }}
            className="flex items-center gap-1.5 h-9 px-1.5 text-xs font-semibold text-amber-600 underline underline-offset-4 decoration-amber-300 hover:text-amber-700 hover:decoration-amber-600 transition-all">
            Clear Filters
          </button>
        </div>
      </div>

      {/* tabs */}
      <div className="flex gap-8 border-b border-slate-100 mb-6 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setStatus(tab.status)}
            className={`pb-3 text-[14px] font-medium whitespace-nowrap border-b-2 transition-colors
              ${status === tab.status
                ? 'border-[#D97706] text-[#D97706]'
                : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}>
            {tab.label}
            <span className="ml-1.5 text-[11px] text-slate-400">
              ({tab.status ? (stats[tab.status] ?? 0) : (stats.total ?? 0)})
            </span>
          </button>
        ))}
      </div>

      {/* table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full text-left table-fixed">
          <thead className="bg-gray-100 border-b border-gray-200 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4 w-40">Dispute ID</th>
              <th className="px-6 py-4 w-48">Order / Vehicle</th>
              <th className="px-6 py-4 w-44">Category</th>
              <th className="px-6 py-4 w-48">Raised By</th>
              <th className="px-6 py-4 w-48">Against</th>
              <th className="px-6 py-4 w-36">Amount</th>
              <th className="px-6 py-4 w-40">Status</th>
              <th className="px-6 py-4 w-32">Raised On</th>
              <th className="px-6 py-4 w-20 text-center">Actions</th>
            </tr>
          </thead>

          <tbody
            className={`divide-y divide-slate-100 transition-opacity ${isPlaceholderData ? 'opacity-50 pointer-events-none' : ''}`}>
            {disputes.length > 0 ? (
              disputes.map((d) => {
                const meta = STATUS_META[d.status] || STATUS_META.closed;

                return (
                  <tr
                    key={d._id}
                    className="hover:bg-slate-50/50 transition-colors text-[13px]">

                    {/* dispute id */}
                    <td className="py-4 px-6">
                      <div className="font-medium text-indigo-600">{d.disputeId}</div>
                      {d.daysOpen != null && (
                        <div className={`mt-0.5 flex items-center gap-1 text-[11px] font-medium ${d.isStale ? 'text-red-600' : 'text-slate-400'}`}>
                          {d.isStale && <AlertTriangle size={12} className="shrink-0" />}
                          <span>{d.isStale ? `Overdue · ${d.daysOpen}d open` : `${d.daysOpen}d open`}</span>
                        </div>
                      )}
                    </td>

                    {/* order / vehicle */}
                    <td className="py-4 px-6">
                      <div className="font-medium text-slate-800">{d.orderNumber || '---'}</div>
                      <div className="text-[11px] text-slate-400 truncate" title={d.vehicleTitle || ''}>
                        {d.vehicleTitle || d.listingId || '---'}
                      </div>
                    </td>

                    {/* category */}
                    <td className="py-4 px-6 text-slate-700 font-medium truncate" title={d.category?.name}>
                      {d.category?.name || '---'}
                    </td>

                    {/* raised by */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 shrink-0 rounded-full bg-purple-100 flex items-center justify-center text-[11px] font-semibold text-purple-700">
                          {initials(d.raisedBy?.name)}
                        </span>
                        <div className="min-w-0">
                          <div className="font-medium text-slate-800 truncate">{d.raisedBy?.name || '---'}</div>
                          <div className="text-[11px] text-slate-400">{roleLabel(d.raisedBy?.role)}</div>
                        </div>
                      </div>
                    </td>

                    {/* against */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-[11px] font-semibold text-blue-700">
                          {initials(d.against?.name)}
                        </span>
                        <div className="min-w-0">
                          <div className="font-medium text-slate-800 truncate">{d.against?.name || '---'}</div>
                          <div className="text-[11px] text-slate-400">
                            {roleLabel(d.against?.role)}
                            {d.isStale || d.status === 'open' || d.status === 'under_review'
                              ? (d.hasResponse ? ' · Responded' : ' · No response')
                              : ''}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* amount */}
                    <td className="py-4 px-6 font-semibold text-slate-800">{formatPrice(d.amount)}</td>

                    {/* status */}
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium inline-block ${meta.style}`}>
                        {meta.label}
                      </span>
                      {d.outcome && (
                        <div className="mt-1 text-[11px] font-medium text-slate-500">{OUTCOME_LABEL[d.outcome]}</div>
                      )}
                    </td>

                    {/* raised date */}
                    <td className="py-4 px-6 text-[12px] leading-tight">
                      <div className="font-semibold text-slate-800">{fmtDate(d.createdAt)}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{fmtTime(d.createdAt)}</div>
                    </td>

                    {/* actions */}
                    <td className="py-4 px-6 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedAllDisputeId(d._id);
                          setCurrentPage('all-disputes-detail');
                        }}
                        title="View dispute"
                        className="p-1.5 text-slate-400 hover:text-slate-600 rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-sm font-medium text-gray-500">No Data Found</p>
                    <p className="text-xs text-gray-400 mt-1">There are no disputes to display.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-t border-slate-200 bg-white">

          <p className="hidden sm:block text-xs text-slate-500">
            Page <span className="font-semibold text-[#0B1E3D]">{page}</span> of{" "}
            <span className="font-semibold text-[#0B1E3D]">{totalPages}</span>
          </p>

          <div className="flex items-center gap-1.5 mx-auto sm:mx-0 sm:ml-auto">

            <button
              type="button"
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              Previous
            </button>

            {getPaginationRange(page, totalPages).map((num, idx) =>
              num === "..." ? (
                <span key={`dot-${idx}`} className="px-2 py-1.5 text-xs font-medium text-slate-400">...</span>
              ) : (
                <button
                  type="button"
                  key={num}
                  onClick={() => setPage(num)}
                  className={`min-w-8 h-8 px-2 rounded-lg text-xs font-semibold border transition-all 
                    ${page === num
                      ? "bg-[#D97706] text-white border-[#D97706] shadow-sm"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-amber-50 hover:text-[#D97706] hover:border-amber-200"
                    }`}>
                  {num}
                </button>
              )
            )}

            <button
              type="button"
              onClick={() => setPage((p) => p + 1)}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AllDisputes;
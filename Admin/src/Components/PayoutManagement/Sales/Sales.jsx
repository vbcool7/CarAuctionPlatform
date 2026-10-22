import React, { useEffect, useState } from 'react';
import { ShoppingBag, CircleDollarSign, BadgeDollarSign, ChartNoAxesColumnIncreasing } from "lucide-react";
import SearchBar from '../../SharedComponents/SearchBar';
import FilterDropdown from '../../SharedComponents/FilterDropdown';
import DateRangePicker from '../../SharedComponents/DateRangePicker';
import { useGetAllSales } from '../../../hooks/useSales';
import { getPaginationRange } from '../../utils/getPaginationRange';

const fmtMoney = (n, cur = 'AED') =>
  `${cur} ${Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

// local date -> YYYY-MM-DD (backend isko UAE time me kaat'ta hai)
const toYMD = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const STATUS_LABEL = {
  on_hold: 'On Hold',
  available: 'Available',
  requested: 'Payout Requested',
  paid: 'Payout Paid',
  refunded: 'Refunded',
  no_payout: 'No Payout Record',
};

const STATUS_STYLE = {
  on_hold: 'bg-slate-100 text-slate-600',
  available: 'bg-blue-50 text-blue-600',
  requested: 'bg-amber-50 text-amber-600',
  paid: 'bg-green-50 text-green-600',
  refunded: 'bg-red-50 text-red-600',
  no_payout: 'bg-red-50 text-red-600',
};

const filterConfig = [
  {
    label: 'All Sale Types',
    key: 'saleType',
    options: [
      { label: 'All Sale Types', value: '' },
      { label: 'Auction', value: 'auction' },
      { label: 'Buy Now', value: 'buy_now' },
    ],
  },
  {
    label: 'All Status',
    key: 'status',
    options: [
      { label: 'All Status', value: '' },
      { label: 'On Hold', value: 'on_hold' },
      { label: 'Available', value: 'available' },
      { label: 'Payout Requested', value: 'requested' },
      { label: 'Payout Paid', value: 'paid' },
      { label: 'Refunded', value: 'refunded' },
      { label: 'No Payout Record', value: 'no_payout' }
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

function Sales({ setCurrentPage }) {

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFilters] = useState({ saleType: '', status: '', sortBy: 'newest' });

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const { data, isLoading, isError, isPlaceholderData } = useGetAllSales({
    page,
    limit: 10,
    search: debouncedSearch,
    saleType: filters.saleType,
    status: filters.status,
    sortBy: filters.sortBy,
    startDate: startDate ? toYMD(startDate) : '',
    endDate: endDate ? toYMD(endDate) : '',
  });

  const sales = data?.sales ?? [];
  const stats = data?.stats ?? {};
  const totalPages = data?.pagination?.totalPages || 1;

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [filters, debouncedSearch, startDate, endDate]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  if (isLoading) return <p className="p-10 text-center">Loading sales....</p>;
  if (isError) return <p className="p-10 text-center text-red-500">Failed to load sales</p>;

  // stats 
  const salesStats = [
    {
      title: "Total Sales",
      value: Number(stats.totalSales || 0).toLocaleString(),
      subTitle: `${stats.refundedCount ?? 0} refunded`,
      subTextColor: "text-slate-500",
      icon: ShoppingBag,
      theme: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "Total Sales Amount",
      value: fmtMoney(stats.totalAmount),
      subTitle: "Paid orders only",
      subTextColor: "text-slate-500",
      icon: CircleDollarSign,
      theme: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Platform Commission",
      value: fmtMoney(stats.totalCommission),
      subTitle: "Excludes refunded sales",
      subTextColor: "text-slate-500",
      icon: BadgeDollarSign,
      theme: "bg-amber-50",
      iconColor: "text-amber-500",
    },
    {
      title: "Average Sale Value",
      value: fmtMoney(stats.averageSale),
      subTitle: "Per paid order",
      subTextColor: "text-slate-500",
      icon: ChartNoAxesColumnIncreasing,
      theme: "bg-blue-50",
      iconColor: "text-blue-600",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between pb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3D]">Sales</h1>

          <div className="mt-2 flex items-center text-[11px] md:text-[13px]">
            <span
              onClick={() => setCurrentPage("dashboard")}
              className="cursor-pointer text-slate-500 hover:text-[#D97706] transition-colors">
              Dashboard
            </span>

            <span className="mx-2 text-slate-300">/</span>

            <span className="text-slate-500">Payment Management</span>

            <span className="mx-2 text-slate-300">/</span>
            <span className="font-medium text-[#D97706]">Sales</span>
          </div>
        </div>
      </div>

      {/* stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {salesStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-semibold text-slate-500 block mb-0.5">
                  {stat.title}
                </span>
                <h4 className="py-1 text-base font-bold text-slate-900 tracking-tight">
                  {stat.value}
                </h4>
                <span className={`text-[11px] font-medium mt-1 block ${stat.subTextColor}`}>
                  {stat.subTitle}
                </span>
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

          {/* Search */}
          <div className="flex-1 sm:w-75">
            <SearchBar
              placeholder="Search by order ID, listing ID, vehicle, seller or buyer..."
              value={search}
              onChange={(value) => setSearch(value)}
            />
          </div>

          {/* dropdown */}
          {filterConfig.map(({ label, key, options }) => (
            <div key={key} className="w-full sm:w-45">
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

          {/* Date Range (paid date) */}
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
              setFilters({ saleType: '', status: '', sortBy: 'newest' });
              setStartDate(null);
              setEndDate(null);
              setPage(1);
            }}
            className="flex items-center gap-1.5 h-9 px-1.5 text-xs font-semibold text-amber-600 underline underline-offset-4 decoration-amber-300 hover:text-amber-700 hover:decoration-amber-600 transition-all">
            Clear Filters
          </button>
        </div>

      </div>

      {/* table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full text-left table-fixed">
          <thead className="bg-gray-100 border-b border-gray-200 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4 w-40">Order ID</th>
              <th className="px-6 py-4 w-65">Vehicle</th>
              <th className="px-6 py-4 w-32">Sale Type</th>
              <th className="px-6 py-4 w-48">Seller</th>
              <th className="px-6 py-4 w-48">Buyer</th>
              <th className="px-6 py-4 w-40">Sale Amount</th>
              <th className="px-6 py-4 w-40">Commission</th>
              <th className="px-6 py-4 w-40">Seller Payout</th>
              <th className="px-6 py-4 w-36">Paid On</th>
              <th className="px-6 py-4 w-42">Status</th>
            </tr>
          </thead>

          <tbody
            className={`divide-y divide-slate-100 transition-opacity ${isPlaceholderData ? 'opacity-50 pointer-events-none' : ''}`}>
            {sales.length > 0 ? (
              sales.map((sale) => {
                const paidDate = sale.paidAt ? new Date(sale.paidAt) : null;

                return (
                  <tr key={sale._id} className="hover:bg-gray-50/50 transition-colors">

                    {/* Order ID */}
                    <td className="px-6 py-4">
                      <div className="text-[13px] font-semibold text-slate-700">{sale.orderId || '—'}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{sale.listingId || '—'}</div>
                    </td>

                    {/* Vehicle */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                          {sale.vehicle?.image ? (
                            <img
                              src={sale.vehicle.image}
                              alt={`${sale.vehicle.make || ''} ${sale.vehicle.model || ''}`}
                              className="w-full h-full object-cover"
                            />
                          ) : null}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold text-slate-700 truncate">
                            {sale.vehicle
                              ? `${sale.vehicle.year || ''} ${sale.vehicle.make || ''} ${sale.vehicle.model || ''}`.trim()
                              : '—'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Sale Type */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${sale.source === 'auction'
                          ? 'bg-purple-50 text-purple-600'
                          : 'bg-blue-50 text-blue-600'
                          }`}
                      >
                        {sale.source === 'auction' ? 'Auction' : 'Buy Now'}
                      </span>
                    </td>

                    {/* Seller */}
                    <td className="px-6 py-4">
                      <p className="text-[13px] font-medium text-slate-700 truncate">
                        {sale.seller?.name || 'Deleted seller'}
                      </p>
                      {sale.seller?.email && (
                        <p className="text-[11px] text-slate-400 mt-0.5 truncate">{sale.seller.email}</p>
                      )}
                    </td>

                    {/* Buyer */}
                    <td className="px-6 py-4">
                      <p className="text-[13px] font-medium text-slate-700 truncate">
                        {sale.buyer?.name || 'Deleted user'}
                      </p>
                      {sale.buyer?.email && (
                        <p className="text-[11px] text-slate-400 mt-0.5 truncate">{sale.buyer.email}</p>
                      )}
                    </td>

                    {/* Sale Amount */}
                    <td className="px-6 py-4 text-[13px] font-semibold text-slate-700">
                      {fmtMoney(sale.saleAmount, sale.currency)}
                    </td>

                    {/* Commission */}
                    <td className="px-6 py-4">
                      {sale.commissionAmount != null ? (
                        <>
                          <p className="text-[13px] font-medium text-slate-700">
                            {fmtMoney(sale.commissionAmount, sale.currency)}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{sale.commissionPercent}%</p>
                        </>
                      ) : (
                        <span className="text-[11px] text-slate-400">No payout record</span>
                      )}
                    </td>

                    {/* Seller payout */}
                    <td className="px-6 py-4 text-[13px] font-semibold text-green-600">
                      {sale.payoutAmount != null ? fmtMoney(sale.payoutAmount, sale.currency) : '—'}
                      {sale.payoutId && (
                        <div className="text-[11px] font-normal text-slate-400 mt-0.5">{sale.payoutId}</div>
                      )}
                    </td>

                    {/* Paid on */}
                    <td className="px-6 py-4 text-[13px] leading-tight">
                      {paidDate ? (
                        <>
                          <div className="font-semibold text-slate-800">
                            {paidDate.toLocaleDateString('en-GB', {
                              day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Dubai',
                            })}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {paidDate.toLocaleTimeString('en-GB', {
                              hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Dubai',
                            })}
                          </div>
                        </>
                      ) : '—'}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLE[sale.status] || STATUS_STYLE.on_hold}`}
                      >
                        {STATUS_LABEL[sale.status] || sale.status}
                      </span>
                      <div className="text-[11px] text-slate-400 mt-1">
                        Handover: {sale.handoverStatus === 'confirmed' ? 'Confirmed' : 'Pending'}
                      </div>
                    </td>

                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={10} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-sm font-medium text-gray-500">No Data Found</p>
                    <p className="text-xs text-gray-400 mt-1">There are no sales records available.</p>
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
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
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
                  className={`min-w-8 h-8 px-2 rounded-lg text-xs font-semibold border transition-all ${page === num
                    ? "bg-[#D97706] text-white border-[#D97706] shadow-sm"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-amber-50 hover:text-[#D97706] hover:border-amber-200"
                    }`}
                >
                  {num}
                </button>
              )
            )}

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
  )
}

export default Sales;
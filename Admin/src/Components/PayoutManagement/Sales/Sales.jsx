
import React, { useState } from 'react';
import { ShoppingBag, CircleDollarSign, BadgeDollarSign, ChartNoAxesColumnIncreasing, Download, Calendar } from "lucide-react";
import SearchBar from '../../SharedComponents/SearchBar';
import FilterDropdown from '../../SharedComponents/FilterDropdown';
import { useGetAllSales } from '../../../hooks/useSales';
import { useEffect } from 'react';
import DateRangePicker from '../../SharedComponents/DateRangePicker';
import { getPaginationRange } from '../../utils/getPaginationRange';

const salesStats = [
  {
    title: "Total Sales",
    value: "10",
    subTitle: "↑ 18.6% from last month",
    subTextColor: "text-green-600",
    icon: ShoppingBag,
    theme: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    title: "Total Sales Amount",
    value: "$289,450.30",
    subTitle: "82.1% of total",
    subTextColor: "text-slate-500",
    icon: CircleDollarSign,
    theme: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    title: "Platform Commission",
    value: "$41,780.00",
    subTitle: "11.8% of total",
    subTextColor: "text-slate-500",
    icon: BadgeDollarSign,
    theme: "bg-amber-50",
    iconColor: "text-amber-500",
  },
  {
    title: "Average Sale Value",
    value: "$8,250.20",
    subTitle: "2.3% of total",
    subTextColor: "text-slate-500",
    icon: ChartNoAxesColumnIncreasing,
    theme: "bg-red-50",
    iconColor: "text-red-500",
  },
];

const filterConfig = [
  {
    label: 'All Sale Type',
    key: 'saleType',
    options: ['all', 'auction', 'fixed'],
  },
  {
    label: 'All Status',
    key: 'status',
    options: ['all', 'pending', 'processing', 'paid']
  },
  {
    label: 'Sort By',
    key: 'sortBy',
    options: ['newest', 'oldest']
  },
];

const mapFiltersToParams = (filters, search, startDate, endDate) => {
  const params = {};
  if (filters.saleType) params.saleType = filters.saleType;
  if (filters.status) params.status = filters.status;
  if (filters.sortBy) params.sortBy = filters.sortBy;

  if (search) params.search = search;
  if (startDate) params.startDate = startDate.toISOString();
  if (endDate) params.endDate = endDate.toISOString();
  return params;
};

function Sales({ setCurrentPage }) {

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFilters] = useState({
    saleType: '',
    status: '',
    sortBy: '',
  });

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const params = mapFiltersToParams(filters, debouncedSearch, startDate, endDate);

  const { data: allSales, isLoading, isError, isPlaceholderData } = useGetAllSales({ page, limit: 10, ...params });

  const allSalesData = allSales?.sales || [];
  const totalPages = allSales?.pagination?.totalPages || 1;

  useEffect(() => {
    setPage(1);
  }, [filters, debouncedSearch, startDate, endDate]);

  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  if (isLoading) return <p className="p-10 text-center">Loading live auctions list....</p>;
  if (isError) return <p className="p-10 text-center text-red-500">Failed to load live auctions list</p>;

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

        {/* btns */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-transparent p-2 font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-[#D97706] hover:text-[#D97706] hover:bg-amber-50">
            <Download size={16} />
            <span className="text-[13px]">Export Report</span>
          </button>

          <button className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-transparent p-2 font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-[#D97706] hover:text-[#D97706] hover:bg-amber-50">
            <Download size={16} />
            <span className="text-[13px]">Download Payouts</span>
          </button>
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
              placeholder="Search by make, model, year or listing ID..."
              value={search}
              onChange={(value) => setSearch(value)}
            />
          </div>

          {/* dropdown */}
          {filterConfig.map(({ label, key, options }) => (
            <div
              key={key}
              className="w-full sm:w-45"
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

        <div className="flex flex-wrap items-center justify-between gap-3">

          {/* Date Range */}
          <div className="">
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => {
                setStartDate(update[0]);
                setEndDate(update[1]);
              }}
            />
          </div>

          {/* clear btn */}
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setFilters({ saleType: '', status: '', sortBy: '' });
              setStartDate(null);
              setEndDate(null);
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
              <th className="px-6 py-4 w-45">Invoice Number</th>
              <th className="px-6 py-4 w-60">Vehicle</th>
              <th className="px-6 py-4 w-40">Sale Type</th>
              <th className="px-6 py-4 w-40">Seller</th>
              <th className="px-6 py-4 w-45">Buyer</th>
              <th className="px-6 py-4 w-35">Sale Amount</th>
              <th className="px-6 py-4 w-35">Commission</th>
              <th className="px-6 py-4 w-30">Payout Amount</th>
              <th className="px-6 py-4 w-30">Sale Date</th>
              <th className="px-6 py-4 w-30">Status</th>
              <th className="px-6 py-4 w-30">Action</th>
            </tr>
          </thead>

          <tbody
            className={`divide-y divide-slate-100 transition-opacity ${isPlaceholderData ? 'opacity-50 pointer-events-none' : ''}`}>
            {allSalesData.length > 0 ? (
              allSalesData.map((sale, index) => {

                const sellerName =
                  sale.seller?.businessName ||
                  sale.seller?.fullName ||
                  'N/A';

                const buyerName =
                  sale.buyer?.businessName ||
                  `${sale.buyer?.firstName || ''} ${sale.buyer?.lastName || ''}`.trim() ||
                  'N/A';

                return (
                  <tr key={sale._id || index}>

                    {/* Invoice Number */}
                    <td className="px-6 py-4 text-sm font-medium text-slate-700">
                      {sale.invoiceNumber || 'N/A'}
                    </td>

                    {/* Vehicle */}
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-slate-700">
                          {sale.vehicle?.make || ''}{' '}
                          {sale.vehicle?.model || ''}
                        </p>

                        <p className="text-xs text-slate-400 mt-1">
                          {sale.vehicle?.year || 'N/A'}
                        </p>
                      </div>
                    </td>

                    {/* Sale Type */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${sale.saleType === 'Bid'
                          ? 'bg-purple-50 text-purple-600'
                          : 'bg-blue-50 text-blue-600'
                          }`}
                      >
                        {sale.saleType === 'Bid' ? 'Auction' : 'Buy Now'}
                      </span>
                    </td>

                    {/* Seller */}
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-slate-700">
                          {sellerName}
                        </p>

                        {sale.seller?.email && (
                          <p className="text-xs text-slate-400 mt-1 truncate">
                            {sale.seller.email}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Buyer */}
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-slate-700">
                          {buyerName}
                        </p>

                        {sale.buyer?.email && (
                          <p className="text-xs text-slate-400 mt-1 truncate">
                            {sale.buyer.email}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Sale Amount */}
                    <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                      AED {Number(sale.saleAmount || 0).toLocaleString()}
                    </td>

                    {/* Commission */}
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-slate-700">
                          AED {Number(sale.commissionAmount || 0).toLocaleString()}
                        </p>

                        <p className="text-xs text-slate-400 mt-1">
                          {sale.commissionRate || 0}%
                        </p>
                      </div>
                    </td>

                    {/* Payout Amount */}
                    <td className="px-6 py-4 text-sm font-semibold text-green-600">
                      AED {Number(sale.payoutAmount || 0).toLocaleString()}
                    </td>

                    {/* Sale Date */}
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {sale.createdAt
                        ? new Date(sale.createdAt).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })
                        : 'N/A'}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize ${sale.status === 'paid'
                            ? 'bg-green-50 text-green-600'
                            : sale.status === 'processing'
                              ? 'bg-blue-50 text-blue-600'
                              : 'bg-amber-50 text-amber-600'
                          }`}
                      >
                        {sale.status || 'N/A'}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => handleViewSale(sale)}
                        className="text-sm font-medium text-amber-600 hover:text-amber-700"
                      >
                        View
                      </button>
                    </td>

                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={11}
                  className="px-6 py-12 text-center"
                >
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-sm font-medium text-gray-500">
                      No Data Found
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      There are no sales records available.
                    </p>
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
  )
}

export default Sales;
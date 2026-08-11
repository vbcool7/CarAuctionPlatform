
import React, { useState } from 'react';
import { Archive, Calendar, CheckCircle, Clock, Download, EllipsisVertical, Eye, FileText, FolderOpen, Pencil } from 'lucide-react';
import { FiEdit } from "react-icons/fi";
import FilterDropdown from '../../SharedComponents/FilterDropdown';
import SearchBar from '../../SharedComponents/SearchBar';
import { disputesData } from '../../Data';

const allDisputesStats = [
  {
    title: "Total Disputes",
    value: "128",
    subTitle: "All time",
    subTextColor: "text-slate-500",
    icon: FileText,
    theme: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    title: "Open",
    value: "32",
    subTitle: "25.0% of total",
    subTextColor: "text-slate-500",
    icon: FolderOpen,
    theme: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    title: "Under Review",
    value: "28",
    subTitle: "21.9% of total",
    subTextColor: "text-slate-500",
    icon: Clock,
    theme: "bg-amber-50",
    iconColor: "text-amber-500",
  },
  {
    title: "Resolved",
    value: "58",
    subTitle: "45.3% of total",
    subTextColor: "text-slate-500",
    icon: CheckCircle,
    theme: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    title: "Closed",
    value: "10",
    subTitle: "7.8% of total",
    subTextColor: "text-slate-500",
    icon: Archive,
    theme: "bg-slate-100",
    iconColor: "text-slate-600",
  },
];

function AllDisputes({ setCurrentPage, setSelectedAllDisputeId }) {

  const [selectedDisputeType, setSelectedDisputeType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between pb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3D]">
            All Disputes
          </h1>

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

        {/* btns */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-transparent p-2 font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-[#D97706] hover:text-[#D97706] hover:bg-amber-50">
            <Download size={16} />
            <span className="text-[13px]">Export</span>
          </button>

          <button
            className="flex items-center justify-center gap-1.5 rounded-lg bg-[#D97706] px-4 py-2 font-medium text-white shadow-md shadow-amber-500/20 transition-all duration-200 hover:bg-[#B45F04] hover:scale-[1.02]">
            <span className="text-sm">+ Create Dispute</span>
          </button>
        </div>
      </div>

      {/* stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-5 gap-4">
        {allDisputesStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl border border-slate-100 p-4 shadow-md flex items-center justify-between"
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
            <SearchBar />
          </div>

          {/* status */}
          <div className="w-full sm:w-42">
            <FilterDropdown
              label="All Status"
              options={[
                { label: "Completed", value: "completed" },
                { label: "Pending", value: "pending" },
                { label: "Failed", value: "failed" }
              ]}
              value={selectedStatus}
              onChange={setSelectedStatus}
            />
          </div>

          {/* dispute type */}
          <div className="w-full sm:w-42">
            <FilterDropdown
              label="All Dispute Types"
              options={[
                { label: "Type A", value: "type-a" },
                { label: "Type B", value: "type-b" }
              ]}
              value={selectedDisputeType}
              onChange={setSelectedDisputeType}
            />
          </div>

          {/* Priority */}
          <div className="w-full sm:w-42">
            <FilterDropdown
              label="All Priorities"
              options={[
                { label: "Bank Transfer", value: "bank-transfer" },
                { label: "PayPal", value: "paypal" }
              ]}
              value={selectedPriority}
              onChange={setSelectedPriority}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">

          {/* Date Range */}
          <div className="w-full sm:w-auto flex items-center gap-2 h-9.5 px-3 md:px-4 border border-slate-300 rounded-lg bg-white text-[13px] md:text-sm text-slate-600">
            <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
            <span className="truncate">
              May 01, 2024 - May 31, 2024
            </span>
          </div>

          {/* Clear Filters */}
          <button className="text-xs md:text-sm font-medium text-[#D97706] hover:underline">
            Clear Filters
          </button>
        </div>

      </div>

      {/* table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full text-left table-fixed">
          <thead className="bg-gray-100 border-b border-gray-200 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4 w-45">Dispute ID</th>
              <th className="px-6 py-4 w-45">Order ID</th>
              <th className="px-6 py-4 w-40">Type</th>
              <th className="px-6 py-4 w-45">Raised By</th>
              <th className="px-6 py-4 w-50">Against</th>
              <th className="px-6 py-4 w-40">Amount</th>
              <th className="px-6 py-4 w-35">Priority</th>
              <th className="px-6 py-4 w-35">Status</th>
              <th className="px-6 py-4 w-28">Raised On</th>
              <th className="px-6 py-4 w-40 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {disputesData.map((dispute, index) => (
              <tr
                key={index}
                className="hover:bg-slate-50/50 transition-colors text-[13px]">

                {/* dispute id */}
                <td className="py-4 px-4 font-medium text-indigo-600">{dispute.disputeId}</td>

                {/* order id */}
                <td className="py-4 px-4 font-medium text-slate-800">{dispute.orderId}</td>

                {/* type */}
                <td className="py-4 px-4">
                  <span className="inline-flex items-center gap-1.5 text-slate-700 font-medium">
                    <span className={`w-2 h-2 rounded-full 
                    ${dispute.disputeType === 'Payment Not Received' ? 'bg-blue-500' :
                        dispute.disputeType === 'Item Not as Described' ? 'bg-amber-500' :
                          dispute.disputeType === 'Damaged Item' ? 'bg-rose-500' : 'bg-purple-500'
                      }`} />
                    {dispute.disputeType}
                  </span>
                </td>

                {/* raised by */}
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-[11px] font-semibold text-purple-700">
                      {dispute.buyer.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)}
                    </span>
                    <div>
                      <div className="font-medium text-slate-800">{dispute.buyer.name}</div>
                      <div className="text-[11px] text-slate-400">Buyer</div>
                    </div>
                  </div>
                </td>

                {/* against */}
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-[11px] font-semibold text-blue-700">
                      {dispute.seller.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)}
                    </span>
                    <div>
                      <div className="font-medium text-slate-800">{dispute.seller.name}</div>
                      <div className="text-[11px] text-slate-400">Seller</div>
                    </div>
                  </div>
                </td>

                {/* amount */}
                <td className="py-4 px-4 font-semibold text-slate-800">{dispute.amount}</td>

                {/* priority */}
                <td className="py-4 px-4">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-medium inline-block ${dispute.priority === 'High' ? 'bg-rose-50 text-rose-600' :
                    dispute.priority === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                    {dispute.priority}
                  </span>
                </td>

                {/* status */}
                <td className="py-4 px-4">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium inline-block ${dispute.status === 'Open' ? 'bg-blue-50 text-blue-600' :
                    dispute.status === 'Under Review' ? 'bg-amber-50 text-amber-600' :
                      dispute.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'
                    }`}>
                    {dispute.status}
                  </span>
                </td>

                {/* raised date */}
                <td className="py-4 px-4 text-slate-500 text-[12px] flex flex-col">
                  {dispute.date}
                  <span>{dispute.time}</span>
                </td>

                {/* actions */}
                <td className="py-4 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => {
                        setSelectedAllDisputeId(dispute.disputeId)
                        setCurrentPage('all-disputes-detail')
                      }}
                      className="p-1.5 text-slate-400 hover:text-slate-600 rounded">
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        setSelectedAllDisputeId(dispute.disputeId)
                        setCurrentPage('edit-all-dispute')
                      }}
                      className="p-1.5 text-slate-400 hover:text-slate-600 rounded">
                      <FiEdit className="w-4 h-4" />
                    </button>

                    <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded">
                      <EllipsisVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}

export default AllDisputes;
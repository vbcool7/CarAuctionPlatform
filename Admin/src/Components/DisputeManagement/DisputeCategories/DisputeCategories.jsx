
import React, { useState } from 'react';
import { Layers, CheckCircle2, Ban, Zap, Timer, Check, X, Pencil, MoreVertical } from 'lucide-react';
import SearchBar from '../../SharedComponents/SearchBar';
import FilterDropdown from '../../SharedComponents/FilterDropdown';
import { disputeCategoriesData } from '../../Data';

const disputeCategoriesStats = [
  {
    title: "Total Categories",
    value: "12",
    subTitle: "All time",
    subTextColor: "text-slate-500",
    icon: Layers,
    theme: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    title: "Active Categories",
    value: "10",
    subTitle: "83.3% of total",
    subTextColor: "text-slate-500",
    icon: CheckCircle2,
    theme: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    title: "Inactive Categories",
    value: "2",
    subTitle: "16.7% of total",
    subTextColor: "text-slate-500",
    icon: Ban,
    theme: "bg-amber-50",
    iconColor: "text-amber-500",
  },
  {
    title: "Auto Close Enabled",
    value: "6",
    subTitle: "50.0% of total",
    subTextColor: "text-slate-500",
    icon: Zap,
    theme: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    title: "Avg. Resolution Time",
    value: "2.4 Days",
    subTitle: "All categories",
    subTextColor: "text-slate-500",
    icon: Timer,
    theme: "bg-rose-50",
    iconColor: "text-rose-600",
  },
];

function DisputeCategories({ setCurrentPage, setSelectedCategoryId }) {

  const [selectedAutoClose, setSelectedAutoClose] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between pb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3D]">
            Dispute Categories
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
            <span className="font-medium text-[#D97706]">Dispute Categories</span>
          </div>
        </div>

        {/* btns */}
        <div className="">
          <button
            onClick={() => setCurrentPage('add-new-category')}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-[#D97706] px-4 py-2 font-medium text-white shadow-md shadow-amber-500/20 transition-all duration-200 hover:bg-[#B45F04] hover:scale-[1.02]">
            <span className="text-sm">+ Add New Category</span>
          </button>
        </div>
      </div>

      {/* stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-5 gap-4">
        {disputeCategoriesStats.map((stat, index) => {
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
      <div className="my-6 bg-white border border-slate-200 rounded-xl p-4">
        <div className="flex flex-wrap xl:flex-nowrap items-center gap-3">

          {/* Search */}
          <div className="flex-1 sm:w-75">
            <SearchBar />
          </div>

          {/* Status */}
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

          {/* Auto Close */}
          <div className="w-full sm:w-42">
            <FilterDropdown
              label="Auto Close"
              options={[
                { label: "Yes", value: "yes" },
                { label: "No", value: "no" }
              ]}
              value={selectedAutoClose}
              onChange={setSelectedAutoClose}
            />
          </div>

          {/* Priority */}
          <div className="w-full sm:w-42">
            <FilterDropdown
              label="All Priorities"
              options={[
                { label: "Low", value: "low" },
                { label: "Medium", value: "medium" },
                { label: "High", value: "high" }
              ]}
              value={selectedPriority}
              onChange={setSelectedPriority}
            />
          </div>

          {/* Clear Filters */}
          <button
            type="button"
            className="w-full sm:w-auto pl-5 text-xs md:text-sm font-medium text-[#D97706] transition"
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
              <th className="px-6 py-4 w-60">Category Name</th>
              <th className="px-6 py-4 w-60">Description</th>
              <th className="px-6 py-4 w-35">Priority</th>
              <th className="px-6 py-4 w-40">Auto Close</th>
              <th className="px-6 py-4 w-35">Auto Close Duration</th>
              <th className="px-6 py-4 w-35">Status</th>
              <th className="px-6 py-4 w-31">Created On</th>
              <th className="px-6 py-4 w-30 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {disputeCategoriesData.map((dispute, index) => (
              <tr
                key={index}
                className="hover:bg-slate-50/50 transition-colors text-[13px]"
              >
                {/* Category Title & Icon */}
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${dispute.theme || 'bg-purple-50'} ${dispute.iconColor || 'text-purple-600'}`}>
                      {/* Yaha aap apna dynamic icon render kar sakte hain */}
                      <span className="font-bold text-sm">Icon</span>
                    </div>
                    <span className="font-semibold text-slate-800">{dispute.title}</span>
                  </div>
                </td>

                {/* Description */}
                <td className="py-4 px-4 text-slate-500 max-w-xs">
                  <p className="line-clamp-2">{dispute.description}</p>
                </td>

                {/* Priority Badge */}
                <td className="py-4 px-4">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-semibold 
                  ${dispute.priority === 'High'
                      ? 'bg-rose-50 text-rose-600 border border-rose-100'
                      : dispute.priority === 'Medium'
                        ? 'bg-amber-50 text-amber-600 border border-amber-100'
                        : 'bg-green-50 text-green-600 border border-green-100'
                    }`}>
                    {dispute.priority}
                  </span>
                </td>

                {/* Auto Close */}
                <td className="py-4 px-4">
                  <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
                    {dispute.autoClose ? (
                      <>
                        <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        </span>
                        {dispute.autoCloseLabel}
                      </>
                    ) : (
                      <>
                        <span className="w-5 h-5 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
                          <X className="w-3.5 h-3.5 stroke-[2.5]" />
                        </span>
                        {dispute.autoCloseLabel}
                      </>
                    )}
                  </span>
                </td>

                {/* 5. SLA */}
                <td className="py-4 px-4 font-medium text-slate-700">
                  {dispute.sla}
                </td>

                {/* 6. Status */}
                <td className="py-4 px-4">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-medium border 
                  ${dispute.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                    {dispute.status}
                  </span>
                </td>

                {/* 7. Date & Time */}
                <td className="py-4 px-4 text-slate-500">
                  <div className="font-medium text-slate-700">{dispute.date}</div>
                  <div className="text-[11px] text-slate-400">{dispute.time}</div>
                </td>

                {/* 8. Action Buttons */}
                <td className="py-4 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategoryId(dispute.id)
                        setCurrentPage('edit-dispute-category')
                      }}
                      className="p-1.5 text-slate-400 hover:text-[#D97706] rounded border border-slate-200 bg-white shadow-xs transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    {/* More */}
                    <button
                      type="button"
                      className="p-1.5 text-slate-400 hover:text-slate-600 rounded border border-slate-200 bg-white shadow-xs transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
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

export default DisputeCategories;
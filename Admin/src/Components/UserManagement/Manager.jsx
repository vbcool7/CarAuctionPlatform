
import React, { useState, useEffect } from 'react';
import { ArrowDown, ArrowUp, Download, Plus, ShieldCheck, UserCheck, Users, UserX } from 'lucide-react';
import { useGetAllManagers, useToggleManagerStatus } from '../../hooks/useManager';
import { getPaginationRange } from '../utils/getPaginationRange';

import FilterDropdown from '../SharedComponents/FilterDropdown';
import SearchBar from '../SharedComponents/SearchBar';
import toast from 'react-hot-toast';

const filterConfig = [
  {
    label: 'Status',
    key: 'status',
    options: ['all', 'active', 'inactive'],
  },
];

const mapFiltersToParams = (filters, search) => {
  const params = {};
  if (filters.status) params.status = filters.status;
  if (search.trim()) params.search = search.trim();

  return params;
};

function Manager({ setCurrentPage, setSelectedManagerId }) {

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFilters] = useState({ status: '' });

  const params = mapFiltersToParams(filters, debouncedSearch);

  const { data: managersData, isLoading, isError } = useGetAllManagers({ page, limit: 10, ...params });
  const { mutate: toggleStatus, isPending: isUpdating } = useToggleManagerStatus();

  const managers = managersData?.data || [];
  const totalPages = managersData?.pagination?.totalPages || 1;

  useEffect(() => {
    setPage(1);
  }, [filters, search]);

  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // filter drop-down updater
  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // stats
  const managerStats = [
    {
      title: "Total Managers",
      value: managers.length ?? 0,
      icon: Users,
      theme: "text-blue-600 bg-blue-50",
      subTitle: "Registered managers",
      subTextColor: "text-slate-500",
      isPositive: true
    },
    {
      title: "Active Managers",
      value: managers.filter(manager => manager.isActive).length ?? 0,
      icon: UserCheck,
      theme: "text-emerald-600 bg-emerald-50",
      subTitle: "Currently active",
      subTextColor: "text-green-600",
      isPositive: true
    },
    {
      title: "Inactive Managers",
      value: managers.filter(manager => !manager.isActive).length ?? 0,
      icon: UserX,
      theme: "text-red-500 bg-red-50",
      subTitle: "Currently inactive",
      subTextColor: "text-red-500",
      isPositive: false
    },
    {
      title: "Assigned Permissions",
      value: new Set(
        managers
          .filter(manager => manager.isActive)
          .flatMap(manager => manager.permissions || [])
      ).size,
      icon: ShieldCheck,
      theme: "text-amber-600 bg-amber-50",
      subTitle: "Currently assigned",
      subTextColor: "text-amber-600",
      isPositive: true
    }
  ];

  // handle toggle status
  const toggleManagerStatus = (manager) => {
    toggleStatus({ id: manager._id, isActive: !manager.isActive },
      {
        onSuccess: (res) => {
          toast.success(res.message || "Manager status updated");
        },
        onError: (err) => {
          toast.error(err.response?.data?.message || 'Failed to update status');
        }
      });
  };

  if (isLoading) return <p className="p-10 text-center">Loading manager list....</p>;
  if (isError) return <p className="p-10 text-center text-red-500">Failed to load manager list</p>;

  return (
    <div>

      {/* Header */}
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between pb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3D]">User Management</h1>
          <div className="mt-2 flex items-center text-[11px] md:text-[13px]">
            <span
              onClick={() => setCurrentPage("dashboard")}
              className="cursor-pointer text-slate-500 hover:text-[#D97706] transition-colors"
            >
              Dashboard
            </span>
            <span className="mx-2 text-slate-300">/</span>
            <span className="text-slate-500">
              User Management
            </span>
            <span className="mx-2 text-slate-300">/</span>
            <span className="font-medium text-[#D97706]">
              Manager
            </span>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={() => setCurrentPage('add-new-manager')}
            className="flex justify-center items-center gap-2 rounded-xl bg-[#D97706] px-5 py-2 md:py-2.5 font-medium text-white shadow-lg shadow-amber-500/20 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
          >
            <Plus size={18} />
            Add New Manager
          </button>

          <button
            className="flex justify-center items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2 md:py-2.5 font-medium text-[#0B1E3D] shadow-sm transition-all duration-300 hover:border-[#D97706] hover:bg-amber-50"
          >
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      {/* stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {managerStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white p-4 md:p-5 rounded-2xl border border-slate-100 shadow-md flex items-start gap-4">

              <div className={`p-3 rounded-full ${stat.theme}`}>
                <Icon className="w-5 h-5 md:w-6 md:h-6" />
              </div>

              {/* Content */}
              <div>
                <p className="text-[13px] md:text-sm text-slate-500 font-medium">{stat.title}</p>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
                <div className={`flex items-center text-[12px] md:text-xs font-medium mt-1 ${stat.subTextColor}`}>
                  {stat.isPositive
                    ? <ArrowUp size={14} className="mr-1" />
                    : <ArrowDown size={14} className="mr-1" />}
                  {stat.subTitle}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search / Filter */}
      <div className="my-8 bg-white border border-slate-200 rounded-xl p-4 space-y-4">

        {/* Row 1 */}
        <div className="flex flex-wrap md:flex-nowrap items-center gap-3">

          {/* Search */}
          <div className="flex-1 sm:w-75">
            <SearchBar
              placeholder="Search by name, email..."
              value={search}
              onChange={(value) => setSearch(value)}
            />
          </div>

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

          {/* clear btn */}
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setFilters({ status: '' });
            }}
            className="flex items-center gap-1.5 h-9 px-1.5 text-xs font-semibold text-amber-600 underline underline-offset-4 decoration-amber-300 hover:text-amber-700 hover:decoration-amber-600 transition-all">
            Clear Filters
          </button>
        </div>
      </div>

      {/* table */}
      <div className="mt-6 w-full overflow-x-auto bg-white border border-gray-200 rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs text-gray-800 uppercase bg-gray-100 border-b border-gray-200">
              <th className="px-6 py-4 font-semibold min-w-20">SN</th>
              <th className="px-6 py-4 font-semibold min-w-50">Manager</th>
              <th className="px-6 py-4 font-medium min-w-30">Role</th>
              <th className="px-6 py-4 font-medium min-w-40">Joined On</th>
              <th className="px-6 py-4 font-medium min-w-40">Permissions</th>
              <th className="px-6 py-4 font-medium min-w-30">Status</th>
              <th className="px-6 py-4 font-medium min-w-40">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {managers?.length > 0 ? (
              managers.map((manager, index) => (
                <tr
                  key={manager._id || index}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  {/* SN */}
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-gray-50 text-xs font-medium text-gray-500">
                      {index + 1}
                    </span>
                  </td>

                  {/* Manager */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                        {manager.profilePhoto ? (
                          <img
                            src={manager.profilePhoto}
                            alt={manager.name || "Manager"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-semibold text-gray-500">
                            {manager.name?.charAt(0).toUpperCase() || "M"}
                          </span>
                        )}
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {manager.name || "N/A"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {manager.email || "N/A"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-lg text-xs  border
                        ${manager.role === "admin"
                          ? "bg-blue-50 text-blue-600 border-blue-100"
                          : "bg-amber-50 text-amber-600 border-amber-100"
                        }`}
                    >
                      {manager.role
                        ?.replace(/([a-z])([A-Z])/g, "$1 $2")
                        .replace(/^./, (char) => char.toUpperCase())}
                    </span>
                  </td>

                  {/* Joined On */}
                  <td className="px-6 py-4">
                    {manager.createdAt ? (
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          {new Date(manager.createdAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              timeZone: "Asia/Dubai"
                            }
                          )}
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(manager.createdAt).toLocaleTimeString(
                            "en-GB",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                              timeZone: "Asia/Dubai"
                            }
                          )}
                        </p>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">N/A</span>
                    )}
                  </td>

                  {/* Permissions */}
                  <td className="px-6 py-4">
                    {(() => {
                      const permissionCount = Object.values(manager.permissions || {}).filter(Boolean).length;

                      return (
                        <span className="inline-flex items-center justify-center min-w-8 h-7 px-2 rounded-md bg-purple-50 text-purple-700 text-xs font-semibold">
                          {permissionCount} Access Rights
                        </span>
                      );
                    })()}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium 
                        ${manager.isActive
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-500"
                        }`}
                    >
                      {manager.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedManagerId(manager._id);
                          setCurrentPage('manager-detail')
                        }}
                        className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-100 hover:bg-gray-100 rounded-md transition-colors">
                        View
                      </button>

                      <button
                        onClick={() => toggleManagerStatus(manager)}
                        disabled={isUpdating}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors 
                          ${manager.isActive
                            ? "text-red-500 bg-red-50 hover:bg-red-100 border border-red-100"
                            : "text-green-600 bg-green-50 hover:bg-green-100 border border-green-100"
                          }`}
                      >
                        {isUpdating
                          ? "Updating..."
                          : manager.isActive
                            ? "Deactivate"
                            : "Activate"
                        }
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-sm text-gray-500"
                >
                  No managers found matching your criteria.
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

export default Manager;
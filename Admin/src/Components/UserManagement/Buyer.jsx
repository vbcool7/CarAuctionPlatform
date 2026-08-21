
import React from 'react';
import { useState } from 'react';
import { Users, CheckCircle2, UserCheck, UserX, ArrowUp, ArrowDown, SlidersHorizontal, Edit2, PauseCircle, Trash2, ShieldCheck, X, } from 'lucide-react';
import UserManagementHeader from './UserManagementHeader';
import DeleteModal from './Shared/DeleteModal';
import SearchBar from '../SharedComponents/SearchBar';
import FilterDropdown from '../SharedComponents/FilterDropdown';
import DateRangePicker from '../SharedComponents/DateRangePicker';
import { useGetAllBuyers, useToggleBuyerVerification } from '../../hooks/useBuyer';
import { getPaginationRange } from '../utils/getPaginationRange';

const buyerStats = [
  {
    title: "Total Buyers",
    value: "12,458",
    icon: Users,
    theme: "text-blue-600 bg-blue-50",
    subTitle: "12.5% from last week",
    subTextColor: "text-green-600",
    isPositive: true
  },
  {
    title: "Verified Buyers",
    value: "10,245",
    icon: CheckCircle2,
    theme: "text-emerald-600 bg-emerald-50",
    subTitle: "9.3% from last week",
    subTextColor: "text-green-600",
    isPositive: true
  },
  {
    title: "Active Buyers",
    value: "8,756",
    icon: UserCheck,
    theme: "text-blue-600 bg-blue-50",
    subTitle: "10.8% from last week",
    subTextColor: "text-green-600",
    isPositive: true
  },
  {
    title: "Suspended Buyers",
    value: "320",
    icon: UserX,
    theme: "text-red-500 bg-red-50",
    subTitle: "2.6% from last week",
    subTextColor: "text-red-500",
    isPositive: false
  }
];

const filterConfig = [
  {
    label: 'Verification Status',
    key: 'verificationStatus',
    options: ['All Verification Status', 'Verified', 'Unverified', 'Pending'],
  },
  {
    label: 'Status',
    key: 'status',
    options: ['All Status', 'Active', 'Inactive', 'Suspended'],
  },
  {
    label: 'KYC Status',
    key: 'kycStatus',
    options: ['All KYC Status', 'Verified', 'Pending', 'Rejected'],
  },
];

function Buyer({ setCurrentPage, onViewBuyer }) {

  const [page, setPage] = useState(1);
  const { data: buyerList, isLoading, isError } = useGetAllBuyers(page);
  const { mutate: toggleVerification, isPending: isTogglingVerification } = useToggleBuyerVerification();

  const [verificationTarget, setVerificationTarget] = useState(null);
  const [verificationError, setVerificationError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const totalPages = buyerList?.pagination?.totalPages || 1;

  const handleVerifyClick = (buyer) => {
    setVerificationTarget(buyer);
    setVerificationError("");
  };

  const handleVerifyConfirm = () => {
    setVerificationError("");
    toggleVerification(
      { buyerId: verificationTarget._id, isVerified: !verificationTarget.isEmailVerified },
      {
        onSuccess: () => setVerificationTarget(null),
        onError: (err) => setVerificationError(err?.response?.data?.message || "Something went wrong"),
      }
    );
  };

  // filter drop down
  const [filters, setFilters] = useState({
    verificationStatus: 'All',
    status: 'All',
    kycStatus: 'All',
  });

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // delete 
  const handleDeleteClick = (buyer) => {
    setDeleteTarget(buyer);
  };

  const handleDeleteConfirm = () => {
    console.log('deleting buyer:', deleteTarget.id);
    setDeleteTarget(null);
  };

  const handleDeleteCancel = () => {
    setDeleteTarget(null);
  };

  if (isLoading) return <p className="p-10 text-center">Loading buyer list....</p>;
  if (isError) return <p className="p-10 text-center text-red-500">Failed to load buyer list</p>;

  return (
    <div>
      {/* heading */}
      <UserManagementHeader
        onAddNew={() => setCurrentPage('add-new-buyer')}
        activeTab="buyers"
        setCurrentPage={setCurrentPage} />

      {/* stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {buyerStats.map((stat, index) => {
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

      <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm mt-6">

        {/* Search / Filter */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4">

          {/* Search */}
          <div className="w-full">
            <SearchBar placeholder="Search by name, email, phone or user ID..." />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">

            {/* Dynamic Filters */}
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

            {/* Join Date */}
            <div className="flex-1 min-w-40">
              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => {
                  setStartDate(update[0]);
                  setEndDate(update[1]);
                }}
              />
            </div>

            {/* Filters Button */}
            <button
              type="button"
              className="flex items-center justify-center gap-2 h-9.5 px-4 border border-slate-300 rounded-lg text-sm font-medium text-[#0B1E3D] bg-white hover:bg-slate-50 transition-colors"
            >
              <SlidersHorizontal size={16} />
              Filters
            </button>

          </div>

        </div>

        {/* table */}
        <div className="mt-6 w-full overflow-x-auto bg-white border border-gray-200 rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs text-gray-800 uppercase bg-gray-100 border-b border-gray-200">
                <th className="px-6 py-4 font-semibold ">Select</th>
                <th className="px-6 py-4 font-medium min-w-30">User ID</th>
                <th className="px-6 py-4 font-semibold min-w-50">User</th>
                <th className="px-6 py-4 font-medium min-w-50">Email/Phone</th>
                <th className="px-6 py-4 font-medium min-w-35">Buyer Type</th>
                <th className="px-6 py-4 font-medium min-w-40">Joined On</th>
                <th className="px-6 py-4 font-medium min-w-40">Last Login</th>
                <th className="px-6 py-4 font-medium min-w-30">Created By</th>
                <th className="px-6 py-4 font-medium min-w-30">Status</th>
                <th className="px-6 py-4 font-medium  min-w-40 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {buyerList?.buyers?.length > 0 ? (
                buyerList?.buyers?.map((buyer, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    {/* check box */}
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="h-3.5 w-3.5 rounded"
                      />
                    </td>

                    {/* user id */}
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                      {buyer.buyerId || '---'}
                    </td>

                    {/* user */}
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img
                        src={buyer.profileImageUrl || "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg"}
                        alt="buyer avatar"
                        className="w-8 h-8 rounded-full bg-gray-200"
                      />
                      <div>
                        <p className="text-sm font-bold text-gray-900">{buyer.firstName} {buyer.lastName}</p>
                      </div>
                    </td>

                    {/* email / phone */}
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-800 font-semibold">{buyer.email}</p>
                      <p className="text-xs text-gray-500">{buyer.mobile}</p>
                    </td>

                    {/* Buyer Type */}
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${buyer.buyerType === "individual"
                          ? "bg-slate-50 text-slate-700 border-slate-200"
                          : buyer.buyerType === "dealer"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : buyer.buyerType === "business"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-slate-50 text-slate-500 border-slate-200"
                          }`}
                      >
                        {buyer.buyerType
                          ? buyer.buyerType
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (char) => char.toUpperCase())
                          : "--"}
                      </span>
                    </td>

                    {/* joined on */}
                    <td className="px-6 py-4 text-xs text-gray-600">
                      {buyer.createdAt ? (
                        <>
                          <p>
                            {new Date(buyer.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "2-digit",
                              year: "numeric",
                            })}
                          </p>
                          <p className="pt-0.5 text-slate-400">
                            {new Date(buyer.createdAt).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </p>
                        </>
                      ) : (
                        "--"
                      )}
                    </td>

                    {/* last active */}
                    <td className="px-6 py-4 text-xs text-gray-600">
                      {buyer.lastLoginAt || '----'}
                    </td>

                    {/* created by */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border
                          ${buyer.createdBy === "admin"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          }`}
                      >
                        {buyer.createdBy === "admin" ? "Admin" : "Self"}
                      </span>
                    </td>

                    {/* status */}
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[12px] font-semibold
                        ${buyer.status === "approved" ? "bg-emerald-50 text-emerald-600 border-green-200"
                            : buyer.status === "pending" ? "bg-amber-50 text-amber-600 border-amber-200"
                              : "bg-red-50 text-red-600 border-red-200"}`}
                      >
                        {buyer.status || "---"}
                      </span>
                    </td>

                    {/* actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">

                        <button
                          onClick={() => onViewBuyer(buyer)}
                          className="rounded-lg border border-gray-200 p-1.5 text-blue-700 hover:text-blue-500">
                          <Edit2 size={16} />
                        </button>

                        <button
                          onClick={() => handleVerifyClick(buyer)}
                          className="rounded-lg border border-gray-200 p-1.5 text-blue-600 hover:text-blue-400"
                        >
                          <ShieldCheck size={16} />
                        </button>

                        <button
                          onClick={() => handleDeleteClick(buyer)}
                          className="rounded-lg border border-gray-200 p-1.5 text-red-700 hover:text-red-500">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={10}
                    className="px-6 py-10 text-center text-sm text-gray-500"
                  >
                    No buyers found matching your criteria.
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

        {/* toggle verification */}
        {verificationTarget && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-70 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-amber-600" />
                  Manage Verification
                </h3>
                <button onClick={() => setVerificationTarget(null)} className="text-gray-400 hover:text-gray-600">
                  <X size={18} />
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-1">
                Buyer: <span className="font-semibold text-gray-900">{verificationTarget.firstName} {verificationTarget.lastName}</span>
              </p>
              <p className="text-xs text-gray-500 mb-4">{verificationTarget.email}</p>

              <div className="rounded-lg border border-gray-200 p-3 mb-4">
                <p className="text-sm text-gray-700">
                  Current status:{" "}
                  <span className={verificationTarget.isEmailVerified ? "text-emerald-600 font-semibold" : "text-amber-600 font-semibold"}>
                    {verificationTarget.isEmailVerified ? "Verified" : "Unverified"}
                  </span>
                </p>

                {!verificationTarget.isEmailVerified && (
                  <p className="text-xs text-gray-500 mt-1">
                    Marking this verified will generate a new password and email full login credentials to the buyer.
                  </p>
                )}
                {verificationTarget.isEmailVerified && (
                  <p className="text-xs text-red-500 mt-1">
                    Marking this unverified will immediately block the buyer's login access.
                  </p>
                )}
              </div>

              {verificationError && <p className="text-xs text-red-500 mb-3">{verificationError}</p>}

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setVerificationTarget(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
                  disabled={isTogglingVerification}
                >
                  Cancel
                </button>
                
                <button
                  onClick={handleVerifyConfirm}
                  disabled={isTogglingVerification}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg text-white ${verificationTarget.isEmailVerified ? "bg-red-600 hover:bg-red-500" : "bg-emerald-600 hover:bg-emerald-500"
                    } disabled:opacity-50`}
                >
                  {isTogglingVerification ? "Processing..." : verificationTarget.isEmailVerified ? "Mark Unverified" : "Mark Verified"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* delete modal */}
        <DeleteModal
          isOpen={!!deleteTarget}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          itemName="Buyer"
        />
      </div>
    </div>
  )
}

export default Buyer
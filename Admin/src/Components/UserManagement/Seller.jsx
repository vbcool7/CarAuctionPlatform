
import React, { useState } from 'react'
import { Store, UserCheck, Zap, ShieldAlert, ArrowUp, ArrowDown, Edit2, PauseCircle, SlidersHorizontal, ShieldCheck, X } from 'lucide-react';
import UserManagementHeader from './UserManagementHeader';
import SearchBar from '../SharedComponents/SearchBar';
import FilterDropdown from '../SharedComponents/FilterDropdown';

import { useGetAllSellers, useToggleSellerVerification } from '../../hooks/useSeller';
import DateRangePicker from '../SharedComponents/DateRangePicker';
import { getPaginationRange } from '../utils/getPaginationRange';
import SuspendModal from './Shared/SuspendModal';

const sellerStats = [
  {
    title: "Total Sellers",
    value: "24",
    icon: Store,
    theme: "text-blue-600 bg-blue-50",
    subTitle: "12.5% from last week",
    subTextColor: "text-green-600",
    isPositive: true
  },
  {
    title: "Verified Sellers",
    value: "20",
    icon: UserCheck,
    theme: "text-emerald-600 bg-emerald-50",
    subTitle: "9.3% from last week",
    subTextColor: "text-green-600",
    isPositive: true
  },
  {
    title: "Active Sellers",
    value: "3",
    icon: Zap,
    theme: "text-amber-500 bg-amber-50",
    subTitle: "10.8% from last week",
    subTextColor: "text-green-600",
    isPositive: true
  },
  {
    title: "Suspended Sellers",
    value: "1",
    icon: ShieldAlert,
    theme: "text-red-500 bg-red-50",
    subTitle: "2.6% from last week",
    subTextColor: "text-red-500",
    isPositive: false
  }
];

const sellerTypeConfig = {
  car_dealership: { label: "Dealership", classes: "bg-blue-50 text-blue-700 border-blue-200" },
  individual_seller: { label: "Individual", classes: "bg-amber-50 text-amber-700 border-amber-200" },
  vehicle_importer: { label: "Importer", classes: "bg-purple-50 text-purple-700 border-purple-200" },
  fleet_company: { label: "Fleet", classes: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  rental_company: { label: "Rental", classes: "bg-teal-50 text-teal-700 border-teal-200" },
  auction_house: { label: "Auction", classes: "bg-orange-50 text-orange-700 border-orange-200" },
  other: { label: "Other", classes: "bg-gray-50 text-gray-700 border-gray-200" },
};

function Seller({ onViewSeller, setCurrentPage }) {

  const [page, setPage] = useState(1);
  const [verificationTarget, setVerificationTarget] = useState(null);
  const [verificationError, setVerificationError] = useState("");
  const [selectedSellerType, setSelectedSellerType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedTradeLicense, setSelectedTradeLicense] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [suspendTarget, setSuspendTarget] = useState(null);

  const { data: sellerList, isLoading, isError } = useGetAllSellers(page);
  const { mutate: toggleVerification, isPending: isTogglingVerification } = useToggleSellerVerification();

  const handleVerifyClick = (seller) => {
    setVerificationTarget(seller);
    setVerificationError("");
  };

  const handleVerifyConfirm = () => {
    setVerificationError("");
    toggleVerification(
      { sellerId: verificationTarget._id, isVerified: !verificationTarget.isEmailVerified },
      {
        onSuccess: () => setVerificationTarget(null),
        onError: (err) => setVerificationError(err?.response?.data?.message || "Something went wrong"),
      }
    );
  };

  const totalPages = sellerList?.pagination?.totalPages || 1;

  // suspend seller
  const handleSuspendClick = (seller) => {
    setSuspendTarget(seller);
  };

  const handleSuspendConfirm = (reason) => {
    console.log('suspending seller:', suspendTarget._id, 'reason:', reason);

    suspendSeller({
      id: suspendTarget._id,
      reason,
    });

    setSuspendTarget(null);
  };

  const handleSuspendCancel = () => {
    setSuspendTarget(null);
  };

  if (isLoading) return <p className="p-10 text-center">Loading seller list....</p>;
  if (isError) return <p className="p-10 text-center text-red-500">Failed to load seller list</p>;

  return (
    <div>
      <UserManagementHeader
        onAddNew={() => setCurrentPage('add-new-seller')}
        activeTab="sellers"
        setCurrentPage={setCurrentPage} />

      {/* stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {sellerStats.map((stat, index) => {
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
        <div className="my- bg-white border border-slate-200 rounded-xl p-4 space-y-4">

          {/* Search */}
          <div className="w-full">
            <SearchBar placeholder="Search by name, email, phone or user ID..." />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">

            {/* Seller Type */}
            <div className="w-full sm:w-45">
              <FilterDropdown
                label="All Seller Types"
                options={[
                  { label: "Car Dealership", value: "car_dealership" },
                  { label: "Individual Seller", value: "individual_seller" },
                  { label: "Vehicle Importer", value: "vehicle_importer" },
                  { label: "Fleet Company", value: "fleet_company" },
                  { label: "Rental Company", value: "rental_company" },
                  { label: "Auction House", value: "auction_house" },
                  { label: "Other", value: "other" },
                ]}
                value={selectedSellerType}
                onChange={setSelectedSellerType}
              />
            </div>

            {/* Status */}
            <div className="w-full sm:w-45">
              <FilterDropdown
                label="All Status"
                options={[
                  { label: "Active", value: "active" },
                  { label: "Pending", value: "pending" },
                  { label: "Suspended", value: "suspended" },
                  { label: "Inactive", value: "inactive" },
                ]}
                value={selectedStatus}
                onChange={setSelectedStatus}
              />
            </div>

            {/* Trade License */}
            <div className="w-full sm:w-45">
              <FilterDropdown
                label="All Trade License"
                options={[
                  { label: "Verified", value: "verified" },
                  { label: "Pending", value: "pending" },
                  { label: "Expired", value: "expired" },
                  { label: "Rejected", value: "rejected" },
                ]}
                value={selectedTradeLicense}
                onChange={setSelectedTradeLicense}
              />
            </div>

            {/* date selector */}
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
                <th className="px-6 py-4 font-semibold min-w-40">Seller ID</th>
                <th className="px-6 py-4 font-semibold min-w-50">Seller</th>
                <th className="px-6 py-4 font-medium min-w-55">Company Name</th>
                <th className="px-6 py-4 font-medium min-w-35 pl-3">Business Type</th>
                <th className="px-6 py-4 font-medium min-w-50">Email/Phone</th>
                <th className="px-6 py-4 font-medium min-w-40 pr-0.5">Trade License No.</th>
                <th className="px-6 py-4 font-medium min-w-35">Status</th>
                <th className="px-6 py-4 font-medium min-w-30">Last Login</th>
                <th className="px-6 py-4 font-medium min-w-30">Joined On</th>
                <th className="px-6 py-4 font-medium min-w-30">Created By</th>
                <th className="px-6 py-4 font-medium min-w-40 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {sellerList?.sellers?.length > 0 ? (
                sellerList.sellers.map((seller, index) => (
                  <tr
                    key={seller._id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    {/* check box */}
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="h-3.5 w-3.5 rounded"
                      />
                    </td>

                    {/* seller id */}
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                      SLR - {seller._id ? seller._id.slice(-6).toUpperCase() : "--"}
                    </td>

                    {/* seller */}
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img
                        src={seller.profileImage || "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg"}
                        alt="seller avatar"
                        className="w-8 h-8 rounded-full bg-gray-200"
                      />
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          {seller.fullName}
                        </p>
                      </div>
                    </td>

                    {/* company name */}
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                      {seller.businessName || "--"}
                    </td>

                    {/* business type */}
                    <td>
                      <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold border w-max ${sellerTypeConfig[seller.businessType]?.classes || sellerTypeConfig.other.classes}`}>
                        {sellerTypeConfig[seller.businessType]?.label || seller.businessType}
                      </span>
                    </td>

                    {/* email */}
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-800 font-semibold">
                        {seller.email || "---"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {seller.phone || "---"}
                      </p>
                    </td>

                    {/* trade license num */}
                    <td className="px-6 py-4 text-sm">
                      {seller.licenseNumber || "---"}
                    </td>

                    {/* status */}
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[12px] font-semibold
                        ${seller.status === "approved" ? "bg-emerald-50 text-emerald-600 border-green-200"
                            : seller.status === "pending" ? "bg-amber-50 text-amber-600 border-amber-200"   // naya case add karna hoga — pehle "inactive" tha, jo exist hi nahi karta
                              : "bg-red-50 text-red-600 border-red-200"}`}
                      >
                        {seller.status || "---"}
                      </span>
                    </td>

                    {/* last login */}
                    <td className="px-6 py-4 text-xs text-gray-600">
                      {seller.lastLoginAt ? new Date(seller.lastLoginAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : "Never"}
                    </td>

                    {/* joined on */}
                    <td className="px-6 py-4 text-xs text-gray-600">
                      {seller.createdAt ? (
                        <>
                          <p>
                            {new Date(seller.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "2-digit",
                              year: "numeric",
                            })}
                          </p>
                          <p className="pt-0.5 text-slate-400">
                            {new Date(seller.createdAt).toLocaleTimeString("en-US", {
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

                    {/* created by */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border
                          ${seller.createdBy === "admin"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          }`}
                      >
                        {seller.createdBy === "admin" ? "Admin" : "Self"}
                      </span>
                    </td>

                    {/* actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onViewSeller(seller)}
                          className="rounded-lg border border-gray-200 p-1.5 text-amber-600 hover:text-amber-400"
                        >
                          <Edit2 size={16} />
                        </button>

                        <button
                          onClick={() => handleVerifyClick(seller)}
                          className="rounded-lg border border-gray-200 p-1.5 text-blue-600 hover:text-blue-400"
                        >
                          <ShieldCheck size={16} />
                        </button>

                        <button
                          onClick={() => handleSuspendClick(seller)}
                          className="rounded-lg border border-gray-200 p-1.5 text-red-600 hover:text-red-400"
                        >
                          <PauseCircle size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={12}
                    className="px-6 py-16 text-center"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-sm font-semibold text-slate-600">
                        No Data Found
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        No sellers available to display.
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
                Seller: <span className="font-semibold text-gray-900">{verificationTarget.fullName}</span>
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
                    Marking this verified will generate a new password and email full login credentials to the seller.
                  </p>
                )}
                {verificationTarget.isEmailVerified && (
                  <p className="text-xs text-red-500 mt-1">
                    Marking this unverified will immediately block the seller's login access.
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
        <SuspendModal
          isOpen={!!suspendTarget}
          onClose={handleSuspendCancel}
          onConfirm={handleSuspendConfirm}
          itemName="Seller"
        />
      </div>
    </div>
  )
}

export default Seller;
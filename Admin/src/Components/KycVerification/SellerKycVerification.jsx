
import React from 'react';
import { BadgeCheck, Calendar, CheckCircle2, ChevronRight, ClipboardCheck, Clock3, Download, Eye, FileText, Info, LayoutGrid, ShieldCheck, XCircle, Clock } from 'lucide-react';
import FilterDropdown from '../SharedComponents/FilterDropdown';
import { verificationData } from '../Data';
import { useState } from 'react';
import { useGetAllSellers } from '../../hooks/useSeller';
import { getPaginationRange } from '../utils/getPaginationRange';

const sellerKycStats = [
    {
        title: "Total Seller Applications",
        value: "318",
        icon: LayoutGrid,
        theme: "text-blue-600 bg-blue-50",
        subTitle: "All time",
        subTextColor: "text-slate-500",
        isPositive: null,
    },
    {
        title: "Pending Verification",
        value: "41",
        icon: Clock3,
        theme: "text-amber-600 bg-amber-50",
        subTitle: "12.9% of all",
        subTextColor: "text-slate-500",
        isPositive: null,
    },
    {
        title: "Verified",
        value: "251",
        icon: BadgeCheck,
        theme: "text-green-600 bg-green-50",
        subTitle: "78.9% of all",
        subTextColor: "text-slate-500",
        isPositive: null,
    },
    {
        title: "Rejected",
        value: "26",
        icon: XCircle,
        theme: "text-red-600 bg-red-50",
        subTitle: "8.2% of all",
        subTextColor: "text-slate-500",
        isPositive: null,
    },
];

const VerificationBadge = ({ status, label }) => {
    const config = {
        verified: { icon: CheckCircle2, classes: "bg-emerald-50/50 border-emerald-200 text-emerald-700" },
        rejected: { icon: XCircle, classes: "bg-rose-50/50 border-rose-200 text-rose-700" },
        pending: { icon: Clock, classes: "bg-amber-50/50 border-amber-200 text-amber-700" },
    };
    const { icon: Icon, classes } = config[status] || config.pending;
    return (
        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[11px] font-medium ${classes}`}>
            <FileText className="w-3 h-3" />
            <span>{label}</span>
            <Icon className="w-3 h-3" />
        </div>
    );
};

function SellerKycVerification({ setSelectedSellerKycId, setCurrentPage }) {

    const [page, setPage] = useState(1);
    const { data: sellerList, isLoading, isError } = useGetAllSellers(page);
    const [activeTab, setActiveTab] = useState("all");

    const totalPages = sellerList?.pagination?.totalPages || 1;

    // tabs
    const tabs = [
        { id: 'all', label: 'All' },
        { id: 'pending', label: 'Pending' },
        { id: 'verified', label: 'Verified' },
        { id: 'rejected', label: 'Rejected' },
    ];

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between pb-6">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3D]">
                        KYC Verification
                    </h1>

                    <div className="mt-2 flex items-center text-[11px] md:text-[13px]">
                        <span
                            onClick={() => setCurrentPage("dashboard")}
                            className="cursor-pointer text-slate-500 hover:text-[#D97706] transition-colors"
                        >
                            Dashboard
                        </span>
                        <span className="mx-2 text-slate-300">/</span>
                        <span className="font-medium text-[#D97706]">
                            Seller KYC Verification
                        </span>
                    </div>
                </div>

                <div className="">
                    <button
                        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 sm:px-5 py-2.5 text-sm sm:text-[15px] font-semibold text-[#0B1E3D] shadow-md transition-all duration-200 hover:border-[#D97706] hover:bg-amber-50 hover:text-[#D97706] active:scale-[0.98] whitespace-nowrap">
                        <Download className="w-4 h-4 shrink-0" />
                        <span>Export</span>
                    </button>
                </div>
            </div>

            {/* stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {sellerKycStats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className="bg-white px-3 py-4 rounded-xl border border-slate-100 shadow-md flex justify-between items-center"
                        >
                            {/* Left Side: Text */}
                            <div>
                                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                                    {stat.title}
                                </p>
                                <h3 className="py-2 text-xl font-bold text-slate-900">
                                    {stat.value}
                                </h3>
                                <div className={`flex items-center text-[11px] font-medium mt-1 ${stat.subTextColor}`}>
                                    {/* {stat.isPositive ? <ArrowUp size={12} className="mr-0.5" /> : <ArrowDown size={12} className="mr-0.5" />} */}
                                    {stat.subTitle}
                                </div>
                            </div>

                            {/* Right Side: Icon */}
                            <div className={`p-2 rounded-lg ${stat.theme}`}>
                                <Icon size={20} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* tabs/drop-down */}
            <div className="flex items-center justify-between gap-4 mt-6 p-4">
                {/* Tabs */}
                <div className="flex items-center gap-10 shrink-0">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`pb-3 text-[14px] font-medium whitespace-nowrap border-b-2 transition-colors 
                                ${activeTab === tab.id
                                    ? 'border-[#D97706] text-[#D97706]'
                                    : 'border-transparent text-slate-500 hover:text-slate-700'
                                }`}>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Filters and Date Range */}
                <div className="flex items-center gap-3 shrink-0 pb-3">

                    {/* Date Range */}
                    <div className="flex items-center gap-2 h-9.5 px-3 md:px-4 border border-slate-300 rounded-lg bg-white text-[13px] md:text-sm text-slate-600 shrink-0">
                        <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                        <span className="truncate">
                            May 01, 2024 - May 31, 2024
                        </span>
                    </div>
                </div>
            </div>

            {/* table */}
            <div className="mt-6 w-full overflow-x-auto bg-white border border-gray-200 rounded-lg">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-xs text-gray-800 uppercase bg-gray-100 border-b border-gray-200">
                            <th className="px-6 py-4 font-semibold min-w-65">
                                User Details
                            </th>

                            <th className="px-6 py-4 font-medium min-w-55">
                                Business Name
                            </th>

                            <th className="px-6 py-4 font-medium min-w-40">
                                Business Type
                            </th>

                            <th className="px-6 py-4 font-medium min-w-35">
                                Documents
                            </th>

                            <th className="px-6 py-4 font-medium min-w-40">
                                Submitted On
                            </th>

                            <th className="px-6 py-4 font-medium min-w-35">
                                Status
                            </th>

                            <th className="px-6 py-4 font-medium min-w-34 text-center">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {sellerList?.sellers?.length > 0 ? (
                            sellerList.sellers.map((seller, index) => (
                                <tr
                                    key={seller._id || index}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    {/* User Details */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {/* Avatar */}
                                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0">
                                                {seller.profileImage ? (
                                                    <img
                                                        src={seller.profileImage}
                                                        alt={`${seller.firstName || ""} ${seller.lastName || ""}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-sm font-semibold text-gray-600">
                                                        {seller.firstName?.charAt(0)?.toUpperCase() || "S"}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Email + Phone */}
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {seller.email || "-"}
                                                </p>

                                                <p className="text-xs text-gray-500 mt-1">
                                                    {seller.phone || "-"}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Business Name */}
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-medium text-gray-800">
                                            {seller.businessName || "-"}
                                        </p>
                                    </td>

                                    {/* Business Type */}
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-600 capitalize">
                                            {seller.businessType
                                                ? seller.businessType.replace(/_/g, " ")
                                                : "-"}
                                        </span>
                                    </td>

                                    {/* Documents */}
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-medium text-gray-700">
                                            {seller.documentVerification?.verifiedCount || 0}/4 verified
                                        </span>
                                    </td>

                                    {/* Submitted On */}
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-gray-700">
                                            {seller.submittedAt
                                                ? new Date(seller.submittedAt).toLocaleDateString("en-GB")
                                                : "-"}
                                        </p>

                                        {seller.submittedAt && (
                                            <p className="text-xs text-gray-400 mt-1">
                                                {new Date(seller.submittedAt).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </p>
                                        )}
                                    </td>

                                    {/* Status */}
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${seller.status === "approved"
                                                ? "bg-green-50 text-green-700"
                                                : seller.status === "pending"
                                                    ? "bg-yellow-50 text-yellow-700"
                                                    : seller.status === "rejected"
                                                        ? "bg-red-50 text-red-700"
                                                        : "bg-gray-50 text-gray-600"
                                                }`}
                                        >
                                            {seller.status || "-"}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedSellerKycId(seller._id);
                                                setCurrentPage('seller-kyc-detail')
                                            }}
                                            className="inline-flex items-center justify-center px-2 py-1.5 rounded-md border border-slate-200 bg-white text-xs font-medium text-[#0B1E3D] hover:bg-slate-50 hover:border-slate-300 transition-colors"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="px-6 py-10 text-center text-sm text-gray-500"
                                >
                                    No sellers found
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

            {/* bottom bar */}
            <div className="w-full mt-6 pb-6 flex justify-between gap-6 ">
                <div className="w-full rounded-xl border border-slate-200 bg-white p-5 shadow-md">
                    <h3 className="mb-5 text-sm font-semibold text-[#0B1E3D]">
                        KYC Process Overview
                    </h3>

                    <div className="grid grid-cols-4 gap-4">

                        {/* Step 1 */}
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                                <FileText size={18} className="text-blue-600" />
                            </div>

                            <div>
                                <p className="text-xs font-semibold text-slate-800">
                                    1. Submission
                                </p>

                                <p className="mt-1 text-[11px] text-slate-500">
                                    User submits KYC documents
                                </p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                                <ClipboardCheck size={18} className="text-blue-600" />
                            </div>

                            <div>
                                <p className="text-xs font-semibold text-slate-800">
                                    2. Review
                                </p>

                                <p className="mt-1 text-[11px] text-slate-500">
                                    Admin reviews documents
                                </p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50">
                                <ShieldCheck size={18} className="text-green-600" />
                            </div>

                            <div>
                                <p className="text-xs font-semibold text-slate-800">
                                    3. Verification
                                </p>

                                <p className="mt-1 text-[11px] text-slate-500">
                                    Documents are verified
                                </p>
                            </div>
                        </div>

                        {/* Step 4 */}
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
                                <BadgeCheck size={18} className="text-red-500" />
                            </div>

                            <div>
                                <p className="text-xs font-semibold text-slate-800">
                                    4. Approval
                                </p>

                                <p className="mt-1 text-[11px] text-slate-500">
                                    KYC is approved or rejected
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    )
}

export default SellerKycVerification
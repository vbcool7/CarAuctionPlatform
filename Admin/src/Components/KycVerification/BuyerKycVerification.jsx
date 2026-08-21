
import React from 'react';
import { BadgeCheck, Calendar, CheckCircle2, ChevronRight, ClipboardCheck, Clock3, Download, Eye, FileText, Info, LayoutGrid, ShieldCheck, XCircle, Clock } from 'lucide-react';
import { useState } from 'react';
import { useGetAllBuyers } from '../../hooks/useBuyer';
import { getPaginationRange } from '../utils/getPaginationRange';

const buyerKycStats = [
    {
        title: "Total Buyer Applications",
        value: "624",
        icon: LayoutGrid,
        theme: "text-blue-600 bg-blue-50",
        subTitle: "All time",
        subTextColor: "text-slate-500",
        isPositive: null,
    },
    {
        title: "Pending Verification",
        value: "82",
        icon: Clock3,
        theme: "text-amber-600 bg-amber-50",
        subTitle: "13.1% of all",
        subTextColor: "text-slate-500",
        isPositive: null,
    },
    {
        title: "Verified",
        value: "490",
        icon: BadgeCheck,
        theme: "text-green-600 bg-green-50",
        subTitle: "78.5% of all",
        subTextColor: "text-slate-500",
        isPositive: null,
    },
    {
        title: "Rejected",
        value: "52",
        icon: XCircle,
        theme: "text-red-600 bg-red-50",
        subTitle: "8.3% of all",
        subTextColor: "text-slate-500",
        isPositive: null,
    },
];

function BuyerKycVerification({ setSelectedBuyerKycId, setCurrentPage }) {

    const [page, setPage] = useState(1);
    const { data: buyerList, isLoading, isError } = useGetAllBuyers(page);

    const totalPages = buyerList?.pagination?.totalPages || 1;

    const [activeTab, setActiveTab] = useState("all");

    // tabs
    const tabs = [
        { id: 'all', label: 'All' },
        { id: 'pending', label: 'Pending' },
        { id: 'verified', label: 'Verified' },
        { id: 'rejected', label: 'Rejected' },
    ];

    if (isLoading) return <p className="p-10 text-center">Loading buyer list....</p>;
    if (isError) return <p className="p-10 text-center text-red-500">Failed to load buyer list</p>;

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
                            Buyer KYC Verification
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
                {buyerKycStats.map((stat, index) => {
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
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-left table-fixed">
                    <thead className="bg-gray-100 border-b border-gray-200 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                        <tr>
                            <th className="px-6 py-4 w-28">ID</th>
                            <th className="px-6 py-4 w-60">User Details</th>
                            <th className="px-6 py-4 w-35">User Type</th>
                            <th className="px-6 py-4 w-35">Identity Verification</th>
                            <th className="px-6 py-4 w-35">Address Verification</th>
                            <th className="px-6 py-4 w-32">Submitted On</th>
                            <th className="px-6 py-4 w-35">Status</th>
                            <th className="px-6 py-4 w-35">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-amber-50">
                        {buyerList?.buyers?.map((buyer) => (
                            <tr
                                key={buyer._id}
                                className="hover:bg-slate-50 transition-colors"
                            >
                                {/* ID */}
                                <td className="px-6 py-4 text-xs font-medium text-[#0B1E3D]">
                                    {buyer.buyerId || '---'}
                                </td>

                                {/* User Details */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">

                                        {/* Avatar */}
                                        {buyer.profileImageUrl ? (
                                            <img
                                                src={buyer.profileImageUrl}
                                                alt={`${buyer.firstName} ${buyer.lastName}`}
                                                className="w-9 h-9 rounded-full object-cover border border-slate-200"
                                            />
                                        ) : (
                                            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-600">
                                                {buyer.firstName?.charAt(0)}
                                                {buyer.lastName?.charAt(0)}
                                            </div>
                                        )}

                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-[#0B1E3D] truncate">
                                                {buyer.firstName} {buyer.lastName}
                                            </p>

                                            <p className="text-xs text-slate-500 truncate">
                                                {buyer.email}
                                            </p>

                                            <p className="text-xs text-slate-400 truncate">
                                                {buyer.mobile || "N/A"}
                                            </p>
                                        </div>

                                    </div>
                                </td>

                                {/* User Type */}
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                                        {buyer.buyerType || "Buyer"}
                                    </span>
                                </td>

                                {/* Identity Verification */}
                                <td className="px-6 py-4">
                                    <span
                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${buyer.identityVerification?.status === "approved"
                                            ? "bg-green-50 text-green-600"
                                            : buyer.identityVerification?.status === "rejected"
                                                ? "bg-red-50 text-red-600"
                                                : "bg-amber-50 text-amber-600"
                                            }`}
                                    >
                                        {buyer.identityVerification?.status === "approved"
                                            ? "✓"
                                            : buyer.identityVerification?.status === "rejected"
                                                ? "✕"
                                                : "●"
                                        }

                                        {buyer.identityVerification?.status || "Pending"}
                                    </span>
                                </td>

                                {/* Address Verification */}
                                <td className="px-6 py-4">
                                    <span
                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium 
                                            ${buyer.addressVerification?.status === "approved"
                                                ? "bg-green-50 text-green-600"
                                                : buyer.addressVerification?.status === "rejected"
                                                    ? "bg-red-50 text-red-600"
                                                    : "bg-amber-50 text-amber-600"
                                            }`}
                                    >
                                        {buyer.addressVerification?.status === "approved"
                                            ? "✓"
                                            : buyer.addressVerification?.status === "rejected"
                                                ? "✕"
                                                : "●"
                                        }

                                        {buyer.addressVerification?.status || "Pending"}
                                    </span>
                                </td>

                                {/* Submitted On */}
                                <td className="px-6 py-4 text-xs text-slate-600">
                                    {buyer.createdAt
                                        ? new Date(buyer.createdAt).toLocaleDateString(
                                            "en-GB",
                                            {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            }
                                        )
                                        : "N/A"
                                    }
                                </td>

                                {/* Status */}
                                <td className="px-6 py-4">
                                    <span
                                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${buyer.status === "approved"
                                            ? "bg-green-50 text-green-600"
                                            : buyer.status === "rejected"
                                                ? "bg-red-50 text-red-600"
                                                : "bg-amber-50 text-amber-600"
                                            }`}
                                    >
                                        {buyer.status || "Pending"}
                                    </span>
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => {
                                            setSelectedBuyerKycId(buyer._id);
                                            setCurrentPage('buyer-kyc-detail')
                                        }}
                                        type="button"
                                        className="inline-flex items-center justify-center px-2 py-1.5 rounded-md border border-slate-200 bg-white text-xs font-medium text-[#0B1E3D] hover:bg-slate-50 hover:border-slate-300 transition-colors"
                                    >
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
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

export default BuyerKycVerification

import React, { useState } from 'react';
import { BadgeCheck, Calendar, CheckCircle2, ChevronRight, ClipboardCheck, Clock3, Download, Eye, FileText, Info, LayoutGrid, ShieldCheck, XCircle, Clock } from 'lucide-react';
import FilterDropdown from '../SharedComponents/FilterDropdown';
import { verificationData } from '../Data';

const kycStats = [
    {
        title: "Total Applications",
        value: "1,248",
        icon: LayoutGrid,
        theme: "text-blue-600 bg-blue-50",
        subTitle: "All time",
        subTextColor: "text-slate-500",
        isPositive: null,
    },
    {
        title: "Pending Verification",
        value: "156",
        icon: Clock3,
        theme: "text-amber-600 bg-amber-50",
        subTitle: "12.5% of all",
        subTextColor: "text-slate-500",
        isPositive: null,
    },
    {
        title: "Verified",
        value: "982",
        icon: BadgeCheck,
        theme: "text-green-600 bg-green-50",
        subTitle: "78.8% of all",
        subTextColor: "text-slate-500",
        isPositive: null,
    },
    {
        title: "Rejected",
        value: "110",
        icon: XCircle,
        theme: "text-red-600 bg-red-50",
        subTitle: "8.8% of all",
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

function KycVerification({ setCurrentPage, setSelectedKycId }) {

    const [activeTab, setActiveTab] = useState("all");
    const [selectedUserType, setSelectedUserType] = useState();

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
                            KYC Verification
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
                {kycStats.map((stat, index) => {
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
                    <div>
                        <FilterDropdown
                            label="All User Types"
                            options={[
                                { label: "All Users", value: "all" },
                                { label: "Buyer", value: "buyer" },
                                { label: "Seller", value: "seller" }
                            ]}
                            value={selectedUserType}
                            onChange={setSelectedUserType}
                        />
                    </div>

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
                            <th className="px-6 py-4 w-20">ID</th>
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
                        {verificationData.map((row, index) => {

                            const identityStatus = row.identityVerification.status;
                            const addressStatus = row.addressVerification.status;
                            const overallStatus =
                                identityStatus === "rejected" || addressStatus === "rejected"
                                    ? "Rejected"
                                    : identityStatus === "verified" && addressStatus === "verified"
                                        ? "Verified"
                                        : "Pending";

                            const overallStatusClasses = {
                                Verified: "border-emerald-200 bg-emerald-50 text-emerald-700",
                                Rejected: "border-rose-200 bg-rose-50 text-rose-700",
                                "Pending": "border-amber-200 bg-amber-50 text-amber-700",
                            }[overallStatus];

                            const fullName = `${row.firstName} ${row.lastName}`;
                            const userTypeLabel = row.role === "seller" ? "Seller" : "Buyer";
                            const submitted = new Date(row.submittedAt);
                            const dateStr = submitted.toLocaleDateString();
                            const timeStr = submitted.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });


                            return (
                                <tr
                                    key={row.id || index}
                                    className="hover:bg-gray-50/50 transition-colors">

                                    {/* row id */}
                                    <td className='px-6 py-4'>
                                        <span className='text-[13px] font-semibold text-gray-500'>
                                            {row.id || "---"}
                                        </span>
                                    </td>

                                    {/* user detail */}
                                    <td className="px-6 py-4 flex items-center gap-4">
                                        <img
                                            src={row.avatarUrl}
                                            alt={row.fullName}
                                            className="w-10 h-10 object-cover rounded-full shrink-0" />
                                        <div className="truncate">
                                            <div className="text-gray-900 font-semibold text-[13px] truncate">{row.fullName}</div>
                                            <div className="text-[11px] text-gray-500">{row.email}</div>
                                            <div className="text-[11px] text-gray-500">{row.mobile}</div>
                                        </div>
                                    </td>

                                    {/* user type */}
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-[11px] font-medium border 
                            ${row.role === 'seller'
                                                ? 'border-blue-200 bg-blue-50 text-blue-700'
                                                : "border-purple-200 bg-purple-50 text-purple-700"
                                            }`}>
                                            {userTypeLabel}
                                        </span>
                                    </td>

                                    {/* identity verification */}
                                    <td className="px-6 py-4">
                                        <VerificationBadge status={identityStatus} label="Identity" />
                                    </td>

                                    {/* address verification */}
                                    <td className="px-6 py-4">
                                        <VerificationBadge status={addressStatus} label="Address" />
                                    </td>

                                    {/* submitted on */}
                                    <td className="px-6 py-4 text-[13px] text-slate-700 leading-tight">
                                        <div>{dateStr}</div>
                                        <div className="font-semibold">{timeStr}</div>
                                    </td>

                                    {/* overall status */}
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-[11px] font-medium border ${overallStatusClasses}`}>
                                            {overallStatus}
                                        </span>
                                    </td>

                                    {/* review */}
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => {
                                                setSelectedKycId(row.id)
                                                setCurrentPage('kyc-verification-detail')
                                            }}
                                            className="inline-flex items-center gap-2 rounded-lg text-[12px] font-medium text-slate-700 transition hover:border-[#D97706] hover:bg-amber-50 hover:text-[#D97706]">
                                            <Eye size={16} className="shrink-0" />
                                            <span className="whitespace-nowrap">View Details</span>
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

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

export default KycVerification;
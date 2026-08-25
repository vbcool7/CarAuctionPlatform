
import React, { useState } from 'react';
import { CheckCircle2, XCircle, Download, Filter, Calendar, Clock, Eye, Check, X, MoreHorizontal } from 'lucide-react';
import SummaryDonutCard from '../SharedComponents/SummaryDonutCard';
import QuickActionsCard from '../SharedComponents/QuickActionsCard';
import NotesSection from '../SharedComponents/NotesSection';
import SearchBar from '../SharedComponents/SearchBar';
import FilterDropdown from '../SharedComponents/FilterDropdown';
import { toast } from 'react-hot-toast';

import { useGetAllVehicles, useGetVehicleApprovalSummary, useReviewVehicle } from '../../hooks/useVehicle.js';
import { getPaginationRange } from '../utils/getPaginationRange.js';

const columnConfig = {
    "all-requests": {
        columns: [
            { key: "vehicleDetails", label: "Vehicle Details", width: "min-w-[305px]" },
            { key: "ownerSeller", label: "Owner / Seller", width: "min-w-[230px]" },
            { key: "submittedOn", label: "Submitted On", width: "min-w-[150px]" },
            { key: "status", label: "Status", width: "min-w-[150px]" },
            { key: "actions", label: "Actions", width: "min-w-[150px]" },
        ],
        actions: ["view", "approve", "reject"]
    },
    "pending": {
        columns: [
            { key: "vehicleDetails", label: "Vehicle Details", width: "min-w-[305px]" },
            { key: "ownerSeller", label: "Owner / Seller", width: "min-w-[230px]" },
            { key: "submittedOn", label: "Submitted On", width: "min-w-[150px]" },
            { key: "actions", label: "Actions", width: "min-w-[120px]" },
        ],
        actions: ["view", "approve", "reject"]
    },
    "approved": {
        columns: [
            { key: "vehicleDetails", label: "Vehicle Details", width: "min-w-[305px]" },
            { key: "ownerSeller", label: "Owner / Seller", width: "min-w-[200px]" },
            { key: "approvedOn", label: "Approved On", width: "min-w-[150px]" },
            { key: "approvedBy", label: "Approved By", width: "min-w-[150px]" },
            { key: "actions", label: "Actions", width: "min-w-[100px]" },
        ],
        actions: ["view", "more"]
    },
    "rejected": {
        columns: [
            { key: "vehicleDetails", label: "Vehicle Details", width: "min-w-[305px]" },
            { key: "ownerSeller", label: "Owner / Seller", width: "min-w-[200px]" },
            { key: "rejectedOn", label: "Rejected On", width: "min-w-[150px]" },
            { key: "rejectedBy", label: "Rejected By", width: "min-w-[150px]" },
            { key: "rejectedReason", label: "Reason", width: "min-w-[200px]" },
            { key: "actions", label: "Actions", width: "min-w-[100px]" },
        ],
        actions: ["view"]
    }
};

function VehicleApprovals({ setCurrentPage, setSelectedVehicleAppId }) {

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState();
    const [activeTab, setActiveTab] = useState("all-requests");
    const { data: vehiclesList, isLoading, isError } = useGetAllVehicles(page, limit, activeTab);
    const { mutate: reviewVehicle } = useReviewVehicle();
    const { data: approvalSummary } = useGetVehicleApprovalSummary();

    const [selectedMake, setSelectedMake] = useState("");
    const [selectedVehicleType, setSelectedVehicleType] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");

    const [pendingId, setPendingId] = useState(null);
    const [rejectModal, setRejectModal] = useState({ open: false, vehicle: null });
    const [rejectReason, setRejectReason] = useState('');

    const vehicles = vehiclesList?.vehicles || [];
    const totalPages = vehiclesList?.pagination?.totalPages || 1;

    const summary = approvalSummary?.data || {
        total: 0,
        approved: 0,
        pending: 0,
        rejected: 0,
    };

    const config = columnConfig[activeTab];


    const handleApprove = (vehicleId) => {
        setPendingId(vehicleId);
        reviewVehicle(
            { id: vehicleId, action: 'approve' },
            {
                onSettled: () => setPendingId(null),
                onSuccess: (res) => {
                    toast.success(res?.message || "Vehicle approved successfully");
                },
                onError: (err) => {
                    toast.error(err?.response?.data?.message || "Failed to approve vehicle")
                },
            }
        );
    };

    const openRejectModal = (vehicle) => {
        setRejectReason('');
        setRejectModal({ open: true, vehicle });
    };

    const submitReject = () => {
        if (!rejectReason.trim()) return;

        const vehicleId = rejectModal.vehicle._id;
        setPendingId(vehicleId);

        reviewVehicle(
            { id: vehicleId, action: 'reject', rejectionReason: rejectReason.trim() },
            {
                onSettled: () => setPendingId(null),
                onSuccess: (res) => {
                    setRejectModal({ open: false, vehicleId: null });
                    toast.success(res?.message || "Vehicle rejected successfully!");
                },
                onError: (err) => {
                    toast.error(err?.response?.data?.message || "Failed to reject vehicle")
                },
            }
        );
    };

    if (isLoading) return <p className="p-10 text-center">Loading vehicles list....</p>;
    if (isError) return <p className="p-10 text-center text-red-500">Failed to load vehicles list</p>;

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between pb-6">

                {/* Left */}
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3D]">
                        Vehicle Approvals
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
                            Vehicle Approvals
                        </span>
                    </div>
                </div>

                {/* Right */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <button
                        className="text-sm md:text-[16px] flex justify-center items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2 md:py-2.5 font-medium text-[#0B1E3D] shadow-sm transition-all duration-300 hover:border-[#D97706] hover:bg-amber-50"
                    >
                        <Filter className='w-4 h-4 md:w-5 md:h-5' />
                        Filter
                    </button>

                    <button
                        className="text-sm md:text-[16px] flex justify-center items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2 md:py-2.5 font-medium text-[#0B1E3D] shadow-sm transition-all duration-300 hover:border-[#D97706] hover:bg-amber-50"
                    >
                        <Download className='w-4 h-4 md:w-5 md:h-5' />
                        Export
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="mb-6 flex items-center gap-6 md:gap-8 border-b border-slate-200 overflow-x-auto scrollbar-hide">
                {["all-requests", "pending", "approved", "rejected"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => {
                            setActiveTab(tab);
                            setPage(1);
                        }}
                        className={`pb-3 text-sm font-medium transition-all whitespace-nowrap capitalize
                        ${activeTab === tab
                                ? "border-b-2 border-[#D97706] text-[#D97706]"
                                : "text-slate-500 hover:text-[#0B1E3D]"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Search / Filter */}
            <div className="my-6 bg-white border border-slate-200 rounded-xl p-4 space-y-4">

                {/* Row 1 */}
                <div className="flex flex-wrap md:flex-nowrap items-center gap-3">

                    {/* Search */}
                    <div className="flex-1 sm:w-75">
                        <SearchBar />
                    </div>

                    {/* makes */}
                    <div className="w-full sm:w-42.5">
                        <FilterDropdown
                            label="All Makes"
                            options={[
                                { label: "NA", value: "na" },
                                { label: "NA", value: "na" }
                            ]}
                            value={selectedMake}
                            onChange={setSelectedMake}
                        />
                    </div>

                    {/* vehicle */}
                    <div className="w-full sm:w-42.5">
                        <FilterDropdown
                            label="All Vehicle Types"
                            options={[
                                { label: "Standard", value: "standard" },
                                { label: "Reserve", value: "reserve" }
                            ]}
                            value={selectedVehicleType}
                            onChange={setSelectedVehicleType}
                        />
                    </div>

                    {/* status */}
                    <div className="w-full sm:w-45">
                        <FilterDropdown
                            label="All Status"
                            options={[
                                { label: "SUV", value: "suv" },
                                { label: "Sedan", value: "sedan" }
                            ]}
                            value={selectedStatus}
                            onChange={setSelectedStatus}
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

            {/* main section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 pb-6 gap-6">

                {/* left side - section */}
                <div className="lg:col-span-2 space-y-6">

                    {/* table */}
                    <div className="w-full overflow-x-auto bg-white border border-gray-200 rounded-lg">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-xs text-gray-800 uppercase bg-gray-100 border-b border-gray-200">
                                    {config.columns.map((col, index) => (
                                        <th
                                            key={index}
                                            className={`px-6 py-4 font-medium ${col.width}`}
                                        >
                                            {col.label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {vehiclesList?.vehicles?.length > 0 ? (
                                    vehiclesList.vehicles.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                {config.columns.map((col) => (
                                                    <td
                                                        key={col.key}
                                                        className="px-6 py-4 whitespace-nowrap"
                                                    >
                                                        {/* vehicle details */}
                                                        {col.key === "vehicleDetails" && (
                                                            <div className="flex items-center gap-4">

                                                                <img
                                                                    src={item.images?.[0]?.url}
                                                                    alt={`${item.year} ${item.model}`}
                                                                    className="w-20 h-14 object-cover rounded-lg"
                                                                />

                                                                <div className="flex flex-col">
                                                                    <span className="text-gray-700 font-bold text-[12px] md:text-sm">{item.year} {item.make} {item.model}</span>
                                                                    <span className="text-[10px] md:text-[11px] pt-1 text-gray-500 font-medium">VIN: {item.vin}</span>
                                                                    <div className="text-[10px] md:text-xs text-gray-400 mt-1 flex gap-2">
                                                                        <span>{item.bodyType}</span>
                                                                        <span>•</span>
                                                                        <span>{item.exteriorColor}</span>
                                                                        <span>•</span>
                                                                        <span>{item.transmission}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* owner/seller */}
                                                        {col.key === "ownerSeller" && (
                                                            <div className="flex items-center gap-2">
                                                                <img
                                                                    src={item.sellerId?.profileImage || "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg"}
                                                                    alt={item.sellerId?.fullName}
                                                                    className="w-8 h-8 rounded-full object-cover"
                                                                />
                                                                <div className="flex flex-col truncate">
                                                                    <span className="text-xs font-semibold text-gray-900 truncate">
                                                                        {item.sellerId?.fullName}
                                                                    </span>
                                                                    <span className="text-[12px] text-gray-500">
                                                                        {item.sellerId?.phone}
                                                                    </span>
                                                                    <span className="text-[12px] text-gray-500">
                                                                        {item.sellerId?.email}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* submitted On */}
                                                        {col.key === "submittedOn" && (
                                                            <div className="flex flex-col text-sm">
                                                                {item.createdAt ? (
                                                                    <>
                                                                        <p>
                                                                            {new Date(item.createdAt).toLocaleDateString("en-US", {
                                                                                month: "short",
                                                                                day: "2-digit",
                                                                                year: "numeric",
                                                                            })}
                                                                        </p>
                                                                        <p className="pt-0.5 text-slate-400">
                                                                            {new Date(item.createdAt).toLocaleTimeString("en-US", {
                                                                                hour: "2-digit",
                                                                                minute: "2-digit",
                                                                                hour12: true,
                                                                            })}
                                                                        </p>
                                                                    </>
                                                                ) : (
                                                                    "--"
                                                                )}
                                                            </div>
                                                        )}

                                                        {/* status */}
                                                        {col.key === "status" && (
                                                            <span
                                                                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border
                                                                ${item.adminStatus === "pending"
                                                                        ? "bg-amber-50 text-amber-600 border-amber-100"
                                                                        : item.adminStatus === "approved"
                                                                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                                                            : "bg-rose-50 text-rose-600 border-red-100"
                                                                    }`}
                                                            >
                                                                {item.adminStatus.charAt(0).toUpperCase() +
                                                                    item.adminStatus.slice(1)}

                                                                {item.adminStatus === "pending" && <Clock size={12} />}
                                                                {item.adminStatus === "approved" && <CheckCircle2 size={12} />}
                                                                {item.adminStatus === "rejected" && <XCircle size={12} />}
                                                            </span>
                                                        )}

                                                        {/* approved On */}
                                                        {col.key === "approvedOn" && (
                                                            <div className="flex flex-col">
                                                                {item.reviewedAt ? (
                                                                    <>
                                                                        <span className="text-[13px] text-gray-700">
                                                                            {new Date(item.reviewedAt).toLocaleDateString("en-US", {
                                                                                month: "short",
                                                                                day: "2-digit",
                                                                                year: "numeric",
                                                                            })}
                                                                        </span>
                                                                        <span className="text-[13px] text-gray-400">
                                                                            {new Date(item.reviewedAt).toLocaleTimeString("en-US", {
                                                                                hour: "2-digit",
                                                                                minute: "2-digit",
                                                                                hour12: true,
                                                                            })}
                                                                        </span>
                                                                    </>
                                                                ) : (
                                                                    "--"
                                                                )}
                                                            </div>
                                                        )}

                                                        {/* approved by or rejected by */}
                                                        {(col.key === "approvedBy" || col.key === "rejectedBy") && (
                                                            <div className="flex items-center gap-2">
                                                                <img
                                                                    src={item.reviewedBy?.profilePhoto || "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg"}
                                                                    alt={item.reviewedBy?.name || "Admin"}
                                                                    className="w-7 h-7 rounded-full object-cover"
                                                                />
                                                                <span className="text-xs font-semibold text-gray-900 truncate">
                                                                    {item.reviewedBy?.name || "—"}
                                                                </span>
                                                            </div>
                                                        )}

                                                        {/* rejected On */}
                                                        {col.key === "rejectedOn" && (
                                                            <div className="flex flex-col">
                                                                {item.reviewedAt ? (
                                                                    <>
                                                                        <span className="text-[13px] text-gray-700">
                                                                            {new Date(item.reviewedAt).toLocaleDateString("en-US", {
                                                                                month: "short",
                                                                                day: "2-digit",
                                                                                year: "numeric",
                                                                            })}
                                                                        </span>
                                                                        <span className="text-[13px] text-gray-400">
                                                                            {new Date(item.reviewedAt).toLocaleTimeString("en-US", {
                                                                                hour: "2-digit",
                                                                                minute: "2-digit",
                                                                                hour12: true,
                                                                            })}
                                                                        </span>
                                                                    </>
                                                                ) : (
                                                                    "--"
                                                                )}
                                                            </div>
                                                        )}

                                                        {/* rejected reason */}
                                                        {col.key === "rejectedReason" && (
                                                            <span className='text-[13px] font-semibold text-red-600 truncate block'>
                                                                {item.rejectionReason || "---"}
                                                            </span>
                                                        )}

                                                        {/* actions */}
                                                        {col.key === 'actions' && (
                                                            <div className="flex gap-2">
                                                                {config.actions.map((action, index) => {
                                                                    if (action === "view") {
                                                                        return (
                                                                            <button
                                                                                key="view"
                                                                                onClick={() => {
                                                                                    setSelectedVehicleAppId(item._id);
                                                                                    setCurrentPage("vehicle-approvals-detail");
                                                                                }}
                                                                                className="p-1 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer">
                                                                                <Eye size={18} />
                                                                            </button>
                                                                        );
                                                                    }
                                                                    if (action === "approve" && item.adminStatus === "pending") {
                                                                        return (
                                                                            <button
                                                                                key="approve"
                                                                                disabled={pendingId === item._id}
                                                                                onClick={() => handleApprove(item._id)}
                                                                                className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors disabled:opacity-40"
                                                                            >
                                                                                <Check size={18} />
                                                                            </button>
                                                                        );
                                                                    }
                                                                    if (action === "reject" && item.adminStatus === "pending") {
                                                                        return (
                                                                            <button
                                                                                key="reject"
                                                                                disabled={pendingId === item._id}
                                                                                onClick={() => openRejectModal(item)}
                                                                                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-40"
                                                                            >
                                                                                <X size={18} />
                                                                            </button>
                                                                        );
                                                                    }
                                                                    if (action === "more") {
                                                                        return (
                                                                            <button key="more" className="p-1 text-gray-400 hover:text-gray-600">
                                                                                <MoreHorizontal size={18} />
                                                                            </button>
                                                                        );
                                                                    }
                                                                    return null;
                                                                })}
                                                            </div>
                                                        )}
                                                    </td>
                                                ))}
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={config.columns.length}
                                            className="px-6 py-12 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center">
                                                <p className="text-sm font-medium text-gray-500">
                                                    No Data Found
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    There are no vehicle records available.
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

                {/* right side - section */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">
                    <>
                        <SummaryDonutCard
                            title="Approval Summary"
                            centerValue={summary.total}
                            centerLabel="Total"
                            showPercentage={true}
                            segments={[
                                { name: 'Approved', value: summary.approved, color: '#10B981' },
                                { name: 'Pending', value: summary.pending, color: '#F59E0B' },
                                { name: 'Rejected', value: summary.rejected, color: '#FF0000' },
                            ]}
                        />

                        <QuickActionsCard
                            actions={[
                                { label: "Approve All Pending", icon: CheckCircle2, onClick: () => { } },
                                { label: "Reject All Pending", icon: XCircle, onClick: () => { }, variant: 'danger' },
                                { label: "Download Report", icon: Download, onClick: () => { }, },
                            ]}
                        />

                        <NotesSection
                            message="Review all vehicle details and documents carefully before approving or rejecting the request. Approved vehicles will be visible to buyers."
                        />
                    </>
                </div>
            </div>

            {rejectModal.open && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-70">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
                        <div className="mb-5">
                            <h3 className="text-lg font-bold text-[#0B1E3D] mb-2">
                                Reject Vehicle
                            </h3>

                            <p className="text-sm font-semibold text-gray-800 leading-5">
                                {rejectModal.vehicle?.year} {rejectModal.vehicle?.make}{" "}
                                {rejectModal.vehicle?.model}
                            </p>

                            <p className="text-xs text-gray-500 mt-1.5">
                                <span className="font-medium text-gray-600">VIN:</span>{" "}
                                {rejectModal.vehicle?.vin}
                            </p>
                        </div>
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Enter rejection reason..."
                            rows={4}
                            className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:border-[#D97706]"
                        />
                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                onClick={() => setRejectModal({ open: false, vehicle: null })}
                                className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitReject}
                                disabled={!rejectReason.trim()}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-40"
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default VehicleApprovals;
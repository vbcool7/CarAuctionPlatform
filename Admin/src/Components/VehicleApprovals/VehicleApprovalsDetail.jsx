
import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, ChevronRight, FileText, XCircle, Circle } from 'lucide-react';
import NotesSection from '../SharedComponents/NotesSection';
import DocumentPreviewModal from "./DocumentPreviewModal";
import AddNoteModal from './AddNoteModal';
import { useGetVehicleById, useReviewVehicle } from '../../hooks/useVehicle';
import toast from 'react-hot-toast';


function VehicleApprovalsDetail({ setCurrentPage, vehicleAppId }) {

    const { data: vehicleData, isLoading, isError } = useGetVehicleById(vehicleAppId);
    const { mutate: reviewVehicle } = useReviewVehicle();

    const [rejectModal, setRejectModal] = useState({ open: false, vehicle: null });
    const [rejectReason, setRejectReason] = useState("");
    const [pendingId, setPendingId] = useState(null);

    const vehicle = vehicleData?.data;

    const [activeTab, setActiveTab] = useState('overview');
    const [previewDoc, setPreviewDoc] = useState(null);
    const [showAddNote, setShowAddNote] = useState(false);

    const vehicleStatus = vehicle?.adminStatus?.toLowerCase() || "pending";

    const overviewData = [
        { label: "Make", value: vehicle?.make || "---" },
        { label: "Model", value: vehicle?.model || "---" },
        { label: "Year", value: vehicle?.year || "---" },

        { label: "Vehicle Type", value: vehicle?.vehicleType || "---" },
        { label: "Exterior Color", value: vehicle?.exteriorColor || "---" },
        { label: "Interior Color", value: vehicle?.interiorColor || "---" },

        { label: "Engine", value: vehicle?.engineSize || "---" },
        { label: "Transmission", value: vehicle?.transmission || "---" },
        { label: "Mileage", value: vehicle?.mileage ? `${vehicle.mileage} km` : "---" },

        { label: "Fuel Type", value: vehicle?.fuelType || "---" },
        { label: "Drive Type", value: vehicle?.drivetrain || "---" },
        { label: "Doors", value: vehicle?.doors || "---" },

        { label: "Seats", value: vehicle?.seats || "---" },
        { label: "Country", value: vehicle?.country || "---" },
        { label: "City", value: vehicle?.city || "---" },
    ];

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
                onSuccess: () => {
                    setRejectModal({ open: false, vehicleId: null });
                    toast.success("Vehicle rejected successfully!");
                },
                onError: (err) => console.error(err),
            }
        );
    };

    if (isLoading) return <p className="p-10 text-center">Loading vehicle details....</p>;
    if (isError) return <p className="p-10 text-center text-red-500">Failed to load vehicle details</p>;

    return (
        <div className="w-full pb-6">

            {/* Header */}
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between pb-6">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3D]">
                        Vehicle Approval
                    </h1>

                    <div className="mt-2 flex items-center text-[11px] md:text-[13px]">
                        <span
                            onClick={() => setCurrentPage("dashboard")}
                            className="cursor-pointer text-slate-500 hover:text-[#D97706] transition-colors"
                        >
                            Dashboard
                        </span>

                        <span className="mx-1 text-slate-300"><ChevronRight size={16} /></span>
                        <span
                            onClick={() => setCurrentPage('vehicle-approvals')}
                            className="cursor-pointer text-slate-500 hover:text-[#D97706] transition-colors">
                            Vehicle Approvals
                        </span>

                        <span className="mx-1 text-slate-300"><ChevronRight size={16} /></span>
                        <span className="font-medium text-[#D97706]">
                            Vehicle Approval Details
                        </span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <button
                        onClick={() => setCurrentPage('vehicle-approvals')}
                        className="flex items-center justify-center gap-1.5 rounded-lg bg-[#D97706] px-4 py-2 font-medium text-white shadow-md shadow-amber-500/20 transition-all duration-200 hover:bg-[#B45F04] hover:scale-[1.02]">
                        <ArrowLeft size={16} />
                        <span className="text-sm">Back to Auctions</span>
                    </button>

                    <button className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-[#D97706] hover:text-[#D97706] hover:bg-amber-50">
                        <span className="text-sm">More Auctions</span>
                    </button>
                </div>
            </div>

            {/* Vehicle Summary */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm mb-6">
                <div className="flex flex-col lg:flex-row gap-6">

                    <div className="w-full lg:w-72 shrink-0">
                        <img
                            src={vehicle?.images?.[0]?.url || null}
                            alt={`${vehicle?.make || ""} ${vehicle?.model || ""}`}
                            className="w-full h-48 lg:h-40 object-cover rounded-xl border border-slate-100"
                        />
                    </div>

                    <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div>
                                <p className="text-xs text-slate-400 mb-1">
                                    Vehicle : {vehicle.listingId}
                                </p>

                                <h2 className="text-lg md:text-xl font-bold text-[#0B1E3D]">
                                    {vehicle?.year} {vehicle?.make} {vehicle?.model}
                                </h2>

                                <p className="mt-2 text-sm text-slate-500">
                                    VIN:{" "}
                                    <span className="font-medium text-slate-700">
                                        {vehicle?.vin || "---"}
                                    </span>
                                </p>
                            </div>

                        </div>

                        {/* Vehicle Attributes */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">

                            <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                                <p className="text-[11px] text-slate-400 mb-1">
                                    Type
                                </p>
                                <p className="text-sm font-semibold text-[#0B1E3D]">
                                    {vehicle?.vehicleType || "---"}
                                </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                                <p className="text-[11px] text-slate-400 mb-1">
                                    Color
                                </p>
                                <p className="text-sm font-semibold text-[#0B1E3D]">
                                    {vehicle?.exteriorColor || "---"}
                                </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                                <p className="text-[11px] text-slate-400 mb-1">
                                    Transmission
                                </p>
                                <p className="text-sm font-semibold text-[#0B1E3D]">
                                    {vehicle?.transmission || "---"}
                                </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                                <p className="text-[11px] text-slate-400 mb-1">
                                    Submitted On
                                </p>
                                <p className="text-sm font-semibold text-[#0B1E3D]">
                                    {vehicle?.createdAt
                                        ? new Date(vehicle.createdAt).toLocaleDateString(
                                            "en-GB",
                                            {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            }
                                        )
                                        : "---"}
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">

                {/* Tabs */}
                <div className="border-b border-slate-200 px-5 md:px-6">
                    <div className="flex items-center gap-6 md:gap-8 overflow-x-auto scrollbar-hide">
                        {["overview", "documents", "history", "notes"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`py-4 text-sm font-medium capitalize whitespace-nowrap transition-all border-b-2
                                ${activeTab === tab
                                        ? "border-[#D97706] text-[#D97706]"
                                        : "border-transparent text-slate-500 hover:text-[#0B1E3D]"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>


                {/* Tab Content */}
                <div className="p-5 md:p-6">

                    {activeTab === "overview" && (
                        <div className="">

                            {/* show only on rejection */}
                            {vehicleStatus === "rejected" && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                                    <h4 className="text-[12px] md:text-[13px] font-semibold text-red-700 mb-3">
                                        Rejection Details
                                    </h4>

                                    <div className="space-y-2 text-[11px] md:text-[12px]">

                                        {/* Reason */}
                                        <div className="grid grid-cols-[110px_1fr]">
                                            <span className="text-gray-500 font-medium">Reason</span>
                                            <span className="font-semibold text-[#0B1E3D]">
                                                {vehicle?.rejectionReason || "---"}
                                            </span>
                                        </div>

                                        {/* Rejected By */}
                                        <div className="grid grid-cols-[110px_1fr]">
                                            <span className="text-gray-500 font-medium">Rejected By</span>
                                            <span className="font-semibold text-[#0B1E3D]">
                                                {vehicle?.reviewedBy?.name || "Admin"}
                                            </span>
                                        </div>

                                        {/* Rejected On */}
                                        <div className="grid grid-cols-[110px_1fr]">
                                            <span className="text-gray-500 font-medium">Rejected On</span>
                                            <span className="font-semibold text-[#0B1E3D]">
                                                {vehicle?.reviewedAt
                                                    ? new Date(vehicle.reviewedAt).toLocaleString(
                                                        "en-GB",
                                                        {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                            hour12: true,
                                                        }
                                                    )
                                                    : "---"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <h3 className="text-[13px] font-semibold text-[#0B1E3D] my-4">
                                Vehicle Information
                            </h3>

                            <div className="grid grid-cols-3 lg:grid-cols-3 gap-x-10 gap-y-3 md:gap-y-4">
                                {overviewData.map((item, index) => (
                                    <div key={index}>
                                        <p className="text-[11px] text-gray-500">
                                            {item.label}
                                        </p>

                                        <p className="text-[12px] md:text-[13px] font-semibold text-[#0B1E3D] leading-5">
                                            {item.value}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === "documents" && (
                        <div>
                            <h3 className="text-[13px] font-semibold text-[#0B1E3D] mb-3">
                                Vehicle Documents
                            </h3>

                            <div className="space-y-2">
                                {vehicle?.documents?.length > 0 ? (
                                    vehicle.documents.map((doc) => (
                                        <div
                                            key={doc._id}
                                            className="flex items-center justify-between p-2 md:p-3 border border-slate-200 rounded-xl"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <FileText className="w-4 h-4 text-slate-400 shrink-0" />

                                                <div className="min-w-0">
                                                    <p className="text-[11px] md:text-[12px] font-semibold text-[#0B1E3D] truncate">
                                                        {doc.name || "Vehicle Document"}
                                                    </p>

                                                    <p className="text-[10px] md:text-[11px] text-gray-500">
                                                        {doc.resourceType === "image"
                                                            ? "Image"
                                                            : "Document"}
                                                    </p>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => {
                                                    console.log("Selected document:", doc);
                                                    setPreviewDoc(doc);
                                                }}
                                                className="text-[11px] font-medium border border-gray-400 text-gray-600 rounded-lg px-2 py-1 hover:bg-slate-50 cursor-pointer"
                                            >
                                                View
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl">
                                        <p className="text-xs text-gray-500">
                                            No documents uploaded
                                        </p>
                                    </div>
                                )}
                            </div>

                            {previewDoc && (
                                <DocumentPreviewModal
                                    doc={previewDoc}
                                    onClose={() => setPreviewDoc(null)}
                                />
                            )}
                        </div>
                    )}

                    {activeTab === "history" && (
                        <div>
                            <h3 className="text-[13px] font-semibold text-[#0B1E3D] mb-1.5 md:mb-3">
                                Approval History
                            </h3>

                            <p className="text-[11px] text-gray-500 mb-4">
                                Track all actions and updates made on this vehicle approval request.
                            </p>

                            <div className="space-y-4">

                                {/* Submitted */}
                                {vehicle?.createdAt && (
                                    <div className="flex gap-3">
                                        <div className="flex flex-col items-center">
                                            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center bg-slate-100 text-slate-500">
                                                <Circle className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                            </div>

                                            <div className="w-px flex-1 bg-slate-200 mt-1" />
                                        </div>

                                        <div className="pb-4 flex-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className="text-[12px] font-semibold text-[#0B1E3D]">
                                                    Vehicle Submitted
                                                </p>

                                                <span className="text-[9px] text-gray-400 whitespace-nowrap">
                                                    {new Date(vehicle.createdAt).toLocaleString(
                                                        "en-GB",
                                                        {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                            hour12: true,
                                                        }
                                                    )}
                                                </span>
                                            </div>

                                            <p className="text-[11px] text-gray-600 mt-0.5">
                                                Vehicle approval request was submitted for admin review.
                                            </p>

                                            <span className="inline-block text-[9px] md:text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 mt-1.5">
                                                Submitted
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Reviewed */}
                                {vehicle?.reviewedAt && (
                                    <div className="flex gap-3">
                                        <div className="flex flex-col items-center">
                                            <div
                                                className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center 
                                                    ${vehicleStatus === "approved"
                                                        ? "bg-emerald-100 text-emerald-600"
                                                        : vehicleStatus === "rejected"
                                                            ? "bg-rose-100 text-rose-600"
                                                            : "bg-amber-100 text-amber-600"
                                                    }`}
                                            >
                                                {vehicleStatus === "approved" ? (
                                                    <CheckCircle2 className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                                ) : vehicleStatus === "rejected" ? (
                                                    <XCircle className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                                ) : (
                                                    <Circle className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                                )}
                                            </div>
                                        </div>

                                        <div className="pb-4 flex-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className="text-[12px] font-semibold text-[#0B1E3D]">
                                                    Vehicle{" "}
                                                    {vehicleStatus === "approved"
                                                        ? "Approved"
                                                        : vehicleStatus === "rejected"
                                                            ? "Rejected"
                                                            : "Reviewed"}
                                                </p>

                                                <span className="text-[9px] text-gray-400 whitespace-nowrap">
                                                    {new Date(vehicle.reviewedAt).toLocaleString(
                                                        "en-GB",
                                                        {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                            hour12: true,
                                                        }
                                                    )}
                                                </span>
                                            </div>

                                            <p className="text-[11px] text-gray-600 mt-0.5">
                                                Vehicle approval request was reviewed by admin.
                                            </p>

                                            <div className="flex items-center gap-2 mt-1.5">
                                                <span className="text-[10px] text-gray-500">
                                                    Admin
                                                </span>

                                                <span
                                                    className={`text-[9px] md:text-[10px] font-medium px-2 py-0.5 rounded-full 
                                                        ${vehicleStatus === "approved"
                                                            ? "bg-emerald-100 text-emerald-600"
                                                            : vehicleStatus === "rejected"
                                                                ? "bg-rose-100 text-rose-600"
                                                                : "bg-amber-100 text-amber-600"
                                                        }`}
                                                >
                                                    {vehicleStatus
                                                        ?.charAt(0)
                                                        .toUpperCase() +
                                                        vehicleStatus?.slice(1)}
                                                </span>
                                            </div>

                                            {/* Rejection reason */}
                                            {vehicleStatus === "rejected" &&
                                                vehicle.rejectionReason && (
                                                    <p className="text-[11px] text-gray-500 italic mt-1">
                                                        Reason: {vehicle.rejectionReason}
                                                    </p>
                                                )}
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    )}

                    {activeTab === "notes" && (
                        <div className="text-center py-10">
                            <p className="text-sm font-medium text-[#0B1E3D]">
                                No notes available
                            </p>

                            <p className="text-xs text-gray-500 mt-1">
                                No internal notes have been added for this vehicle yet.
                            </p>
                        </div>
                    )}

                </div>
            </div>

            {/* Owner Information */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm mt-6">

                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h3 className="text-base md:text-lg font-semibold text-[#0B1E3D]">
                            Owner Information
                        </h3>

                        <p className="text-xs text-slate-400 mt-1">
                            Seller details associated with this vehicle
                        </p>
                    </div>

                    <span
                        className={`px-3 py-1 rounded-full text-[11px] font-medium 
                            ${vehicle?.sellerId?.status === "approved"
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-amber-50 text-amber-600"
                            }`}
                    >
                        {vehicle?.sellerId?.status
                            ? vehicle.sellerId.status.charAt(0).toUpperCase() +
                            vehicle.sellerId.status.slice(1)
                            : "Verified"}
                    </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4">

                    <img
                        src={vehicle?.sellerId?.profileImage || "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg"}
                        alt={vehicle?.sellerId?.fullName || "Seller"}
                        className="w-14 h-14 rounded-full object-cover border border-slate-200"
                    />

                    <div className="flex-1">
                        <h4 className="text-sm md:text-base font-semibold text-[#0B1E3D]">
                            {vehicle?.sellerId?.fullName || "---"}
                        </h4>

                        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-xs md:text-sm text-slate-500">
                            {/* <span>
                                {selectedVehicle?.ownerSeller?.bid}
                            </span> */}

                            <span>
                                {vehicle?.sellerId?.email || "---"}
                            </span>

                            <span>
                                {vehicle?.sellerId?.phone || "---"}
                            </span>
                        </div>
                    </div>
                </div>


                {/* Approval Information */}
                {vehicleStatus === "approved" && (
                    <div className="mt-6 pt-6 border-t border-slate-100">

                        <h4 className="text-sm font-semibold text-[#0B1E3D] mb-4">
                            Approval Information
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                                <p className="text-xs text-slate-400 mb-1">
                                    Approved By
                                </p>

                                <p className="text-sm font-semibold text-[#0B1E3D]">
                                    {vehicle?.reviewedBy?.name || "Admin"}
                                </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                                <p className="text-xs text-slate-400 mb-1">
                                    Approved On
                                </p>

                                <p className="text-sm font-semibold text-[#0B1E3D]">
                                    {vehicle?.reviewedAt
                                        ? new Date(vehicle.reviewedAt).toLocaleString(
                                            "en-GB",
                                            {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: true,
                                            }
                                        )
                                        : "---"}
                                </p>
                            </div>

                        </div>
                    </div>
                )}

                {/* Rejection Information */}
                {vehicleStatus === "rejected" && (
                    <div className="mt-6 pt-6 border-t border-slate-100">

                        <h4 className="text-sm font-semibold text-[#0B1E3D] mb-4">
                            Rejection Information
                        </h4>

                        <div className="rounded-xl bg-rose-50 border border-rose-100 p-4">
                            <p className="text-xs text-rose-500 mb-1">
                                Reason
                            </p>

                            <p className="text-sm font-medium text-rose-700">
                                {vehicle?.rejectionReason || "No reason provided"}
                            </p>
                        </div>

                    </div>
                )}

            </div>

            {/* Information Note */}
            <div className="mt-6">

                {activeTab === "overview" && (
                    <NotesSection
                        message="The vehicle approval information is displayed here. Review all vehicle details carefully before taking any action."
                    />
                )}

                {activeTab === "documents" && (
                    <NotesSection
                        message="Please review all documents carefully. All required documents must be verified before approving this vehicle."
                    />
                )}

                {activeTab === "history" && (
                    <NotesSection
                        message="The history log shows all actions performed on this vehicle approval request."
                    />
                )}

                {activeTab === "notes" && (
                    <NotesSection
                        message="Internal notes are visible only to admin users. Sellers will not be able to see admin notes."
                    />
                )}

            </div>

            {/* Actions */}
            {vehicleStatus === "pending" && (
                <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-4 md:p-5 shadow-sm">

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                        <div>
                            <p className="text-sm font-semibold text-[#0B1E3D]">
                                Review Vehicle Approval
                            </p>

                            <p className="text-xs text-slate-400 mt-1">
                                Approve or reject this vehicle after reviewing all information.
                            </p>
                        </div>

                        <div className="flex gap-3">

                            <button
                                onClick={() => openRejectModal(item)}
                                className="px-5 py-2.5 border border-rose-200 bg-rose-50 text-rose-600 rounded-xl text-sm font-medium hover:bg-rose-100 transition-colors">
                                Reject
                            </button>

                            <button
                                onClick={() => handleApprove(vehicle._id)}
                                className="px-5 py-2.5 bg-[#D97706] text-white rounded-xl text-sm font-medium hover:bg-[#B45309] transition-colors shadow-sm">
                                Approve
                            </button>

                        </div>
                    </div>
                </div>
            )}

            {/* reject modal - show only on pending status */}
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
    );
}

export default VehicleApprovalsDetail;
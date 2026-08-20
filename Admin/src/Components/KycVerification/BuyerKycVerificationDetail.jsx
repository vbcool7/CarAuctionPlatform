
import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, ChevronRight, XCircle, Check, X, FileText, Info, ZoomIn, X as CloseIcon } from 'lucide-react';
import { verificationData } from '../Data';
import { useGetBuyerById, useVerifyBuyerDoc } from '../../hooks/useBuyer';
import toast from 'react-hot-toast';

// Predefined rejection reasons per doc-level reject
const REJECTION_REASONS = [
    "Document is unclear / Blurry",
    "Document expired",
    "Document type mismatch",
    "Details do not match records",
    "Address proof older than 3 months",
    "Other"
];

const VERIFICATION_GROUPS = [
    { key: 'identity', label: 'Identity Verification', sourceField: 'identityVerification' },
    { key: 'address', label: 'Address Verification', sourceField: 'addressVerification' }
];

function BuyerKycVerificationDetail({ buyerKycId, setCurrentPage }) {

    const { data: buyerData, isLoading, isError } = useGetBuyerById(buyerKycId);
    const { mutate: verifyBuyerDoc, isPending: isUpdating } = useVerifyBuyerDoc();

    const record = buyerData?.data;

    const [docStatuses, setDocStatuses] = useState({
        identity: {
            status: record?.identityVerification?.status || 'pending',
            rejectionReason:
                record?.identityVerification?.rejectionReason || null,
            rejectionNotes: null,
        },

        address: {
            status: record?.addressVerification?.status || 'pending',
            rejectionReason:
                record?.addressVerification?.rejectionReason || null,
            rejectionNotes: null,
        },
    });

    // Reject modal state
    const [rejectModalDoc, setRejectModalDoc] = useState(null); // doc type string or null
    const [reasonInput, setReasonInput] = useState(REJECTION_REASONS[0]);
    const [notesInput, setNotesInput] = useState('');

    const [previewImage, setPreviewImage] = useState(null);

    if (isLoading) {
        return (
            <div className="p-6">
                <p className="text-sm text-slate-500">
                    Loading buyer details...
                </p>
            </div>
        );
    }

    if (isError || !record) {
        return (
            <div className="p-6">
                <p className="text-sm text-red-500">
                    Buyer details not found.
                </p>

                <button
                    onClick={() => setCurrentPage("kyc-verification")}
                    className="mt-3 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-[#D97706] hover:bg-amber-50 hover:text-[#D97706]"
                >
                    <ArrowLeft size={16} />
                    Back to List
                </button>
            </div>
        );
    }

    const submittedDate = new Date(record.createdAt);

    const submittedDateStr = submittedDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

    const submittedTimeStr = submittedDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });

    // approve handler
    const handleAccept = (docType) => {
        verifyBuyerDoc(
            { id: record._id, group: docType, action: 'approve', rejectionReason: undefined },
            {
                onSuccess: () => {
                    setDocStatuses((prev) => ({
                        ...prev,
                        [docType]: { status: 'approved', rejectionReason: null, rejectionNotes: null }
                    }));

                    toast.success("Status Approved");
                }
            }
        )
    };
    
    // reject handler
    const confirmReject = () => {
        verifyBuyerDoc(
            { id: record._id, group: rejectModalDoc, action: 'reject', rejectionReason: reasonInput },
            {
                onSuccess: () => {
                    setDocStatuses((prev) => ({
                        ...prev,
                        [rejectModalDoc]: {
                            status: 'rejected',
                            rejectionReason: reasonInput,
                            rejectionNotes: notesInput
                        }
                    }));
                    setRejectModalDoc(null);

                    toast.success("Status Rejected");
                }
            }
        )
    };

    const openRejectModal = (docType) => {
        setRejectModalDoc(docType);
        setReasonInput(REJECTION_REASONS[0]);
        setNotesInput('');
    };

    const handleTopApprove = () => {
        if (approveDisabled) return;
        // No backend yet — stub only
        console.log('Approve application', record.id, docStatuses);
    };

    const handleTopReject = () => {
        // No backend yet — stub only
        console.log('Reject application', record.id, docStatuses);
    };

    const statusBadge = (status) => {
        if (status === 'approved') {
            return (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-700">
                    <Check size={12} />
                    Approved
                </span>
            );
        }

        if (status === 'rejected') {
            return (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-medium text-red-700">
                    <X size={12} />
                    Rejected
                </span>
            );
        }

        return (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                Pending
            </span>
        );
    };


    // reject popup modal
    const groupLabel = { identity: 'Identity Verification', address: 'Address Verification' }[rejectModalDoc];

    const DocumentPlaceholder = ({ text }) => (
        <div className="flex h-full items-center justify-center text-[11px] text-slate-400">
            <div className="flex flex-col items-center gap-1">
                <FileText size={18} />
                <span>{text}</span>
            </div>
        </div>
    );

    return (
        <div className='pb-6'>
            {/* Header */}
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3D]">KYC Verification Details</h1>

                    <div className="mt-2 flex items-center text-[11px] md:text-[13px]">
                        <span
                            onClick={() => setCurrentPage("dashboard")}
                            className="cursor-pointer text-slate-500 hover:text-[#D97706] transition-colors">
                            Dashboard
                        </span>

                        <span className="mx-1 text-slate-300"><ChevronRight size={16} /></span>
                        <span className=" text-slate-500">KYC Verification</span>

                        <span className="mx-1 text-slate-300"><ChevronRight size={16} /></span>
                        <span
                            onClick={() => setCurrentPage('buyer-kyc')}
                            className="cursor-pointer text-slate-500 hover:text-[#D97706] transition-colors">
                            Buyer KYC List
                        </span>

                        <span className="mx-1 text-slate-300"><ChevronRight size={16} /></span>
                        <span className="font-medium text-[#D97706]">
                            KYC Verification Details
                        </span>
                    </div>
                </div>

                {/* btns */}
                <div className="flex">
                    <button
                        onClick={() => setCurrentPage('buyer-kyc')}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-[#D97706] hover:bg-amber-50 hover:text-[#D97706]"
                    >
                        <ArrowLeft size={16} />
                        <span>Back to List</span>
                    </button>
                </div>
            </div>

            {/* Main content */}
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">

                {/* Left: user summary */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-col items-center text-center">
                        <img
                            src={record.profileImageUrl || "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg"}
                            alt={`${record.firstName} ${record.lastName}`}
                            className="h-20 w-20 rounded-full object-cover"
                        />
                        <span className="mt-2 inline-block rounded-full bg-slate-100 px-3 py-0.5 text-[11px] font-medium text-slate-600">
                            {record.role || "NA"}
                        </span>
                        <h2 className="mt-2 text-base font-semibold text-[#0B1E3D]">{record.firstName} {record.lastName}</h2>
                        <p className="text-[12px] text-slate-500">{record.email}</p>
                        <p className="text-[12px] text-slate-500">{record.mobile}</p>
                    </div>

                    <div className="mt-5 space-y-3 text-[12px]">
                        <div className="flex justify-between">
                            <span className="text-slate-500">Buyer ID</span>
                            <span className="font-medium text-slate-700">{record.buyerId}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Registration Date</span>
                            <span className="font-medium text-slate-700">{submittedDateStr}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">KYC Submitted On</span>
                            <span className="font-medium text-slate-700">{submittedDateStr} {submittedTimeStr}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Created By</span>
                            <span className="font-medium text-slate-700">{record.createdBy}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Account Status</span>
                            {record.status}
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Current KYC Status</span>
                            {statusBadge(record.status?.toLowerCase())}
                        </div>
                    </div>
                </div>

                {/* Right: documents */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Documents Submitted */}
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="mb-4 text-sm font-semibold text-[#0B1E3D]">
                            Documents Submitted
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {VERIFICATION_GROUPS.map((group) => {
                                const current = docStatuses[group.key];
                                const source = record[group.sourceField];

                                return (
                                    <div
                                        key={group.key}
                                        className="rounded-lg border border-slate-200 p-3"
                                    >
                                        {/* Header */}
                                        <div className="flex items-center justify-between my-4">
                                            <span className="text-[12px] font-medium text-slate-700 truncate">
                                                {group.label}
                                            </span>

                                            {statusBadge(current.status)}
                                        </div>

                                        {/* Document Type */}
                                        <div className="text-[11px] text-slate-500 mb-2">
                                            Document type:
                                            <span className="ml-1 font-medium text-slate-700">
                                                {source?.documentType || "N/A"}
                                            </span>
                                        </div>

                                        {/* Documents */}
                                        <div
                                            className={`grid ${group.key === "identity"
                                                ? "grid-cols-2"
                                                : "grid-cols-1"
                                                } gap-2`}
                                        >
                                            {/* IDENTITY */}
                                            {group.key === "identity" ? (
                                                <>
                                                    {/* Front */}
                                                    <div
                                                        onClick={() =>
                                                            source?.frontImageUrl &&
                                                            setPreviewImage({
                                                                url: source.frontImageUrl,
                                                                title: "Identity Document - Front",
                                                            })
                                                        }
                                                        className={`group relative h-28 overflow-hidden rounded-md border border-slate-200 bg-slate-50 ${source?.frontImageUrl
                                                            ? "cursor-zoom-in"
                                                            : ""
                                                            }`}
                                                    >
                                                        {source?.frontImageUrl ? (
                                                            <>
                                                                <img
                                                                    src={source.frontImageUrl}
                                                                    alt="Identity document front"
                                                                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                                                                />

                                                                {/* Hover Overlay */}
                                                                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-200 group-hover:bg-black/40">
                                                                    <div className="rounded-full bg-white/90 p-2 opacity-0 shadow-sm transition-opacity duration-200 group-hover:opacity-100">
                                                                        <ZoomIn
                                                                            size={16}
                                                                            className="text-[#0B1E3D]"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                {/* Label */}
                                                                <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[9px] text-white">
                                                                    Front
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <DocumentPlaceholder text="Front image N/A" />
                                                        )}
                                                    </div>

                                                    {/* Selfie */}
                                                    <div
                                                        onClick={() =>
                                                            source?.selfieImageUrl &&
                                                            setPreviewImage({
                                                                url: source.selfieImageUrl,
                                                                title: "Identity Selfie",
                                                            })
                                                        }
                                                        className={`group relative h-28 overflow-hidden rounded-md border border-slate-200 bg-slate-50 ${source?.selfieImageUrl
                                                            ? "cursor-zoom-in"
                                                            : ""
                                                            }`}
                                                    >
                                                        {source?.selfieImageUrl ? (
                                                            <>
                                                                <img
                                                                    src={source.selfieImageUrl}
                                                                    alt="Identity selfie"
                                                                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                                                                />

                                                                {/* Hover Overlay */}
                                                                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-200 group-hover:bg-black/40">
                                                                    <div className="rounded-full bg-white/90 p-2 opacity-0 shadow-sm transition-opacity duration-200 group-hover:opacity-100">
                                                                        <ZoomIn
                                                                            size={16}
                                                                            className="text-[#0B1E3D]"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[9px] text-white">
                                                                    Selfie
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <DocumentPlaceholder text="Selfie N/A" />
                                                        )}
                                                    </div>

                                                    {/* Back */}
                                                    {source?.backImageUrl && (
                                                        <div
                                                            onClick={() =>
                                                                setPreviewImage({
                                                                    url: source.backImageUrl,
                                                                    title: "Identity Document - Back",
                                                                })
                                                            }
                                                            className="group relative col-span-2 h-28 cursor-zoom-in overflow-hidden rounded-md border border-slate-200 bg-slate-50"
                                                        >
                                                            <img
                                                                src={source.backImageUrl}
                                                                alt="Identity document back"
                                                                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                                                            />

                                                            {/* Hover Overlay */}
                                                            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-200 group-hover:bg-black/40">
                                                                <div className="rounded-full bg-white/90 p-2 opacity-0 shadow-sm transition-opacity duration-200 group-hover:opacity-100">
                                                                    <ZoomIn
                                                                        size={16}
                                                                        className="text-[#0B1E3D]"
                                                                    />
                                                                </div>
                                                            </div>

                                                            <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[9px] text-white">
                                                                Back
                                                            </span>
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    {/* Address Document */}
                                                    <div
                                                        onClick={() =>
                                                            source?.documentUrl &&
                                                            setPreviewImage({
                                                                url: source.documentUrl,
                                                                title: "Address Verification Document",
                                                            })
                                                        }
                                                        className={`group relative h-28 overflow-hidden rounded-md border border-slate-200 bg-slate-50 ${source?.documentUrl
                                                            ? "cursor-zoom-in"
                                                            : ""
                                                            }`}
                                                    >
                                                        {source?.documentUrl ? (
                                                            <>
                                                                <img
                                                                    src={source.documentUrl}
                                                                    alt="Address verification document"
                                                                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                                                                />

                                                                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-200 group-hover:bg-black/40">
                                                                    <div className="rounded-full bg-white/90 p-2 opacity-0 shadow-sm transition-opacity duration-200 group-hover:opacity-100">
                                                                        <ZoomIn
                                                                            size={16}
                                                                            className="text-[#0B1E3D]"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[9px] text-white">
                                                                    Document
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <DocumentPlaceholder text="Document N/A" />
                                                        )}
                                                    </div>

                                                    {/* Landlord ID */}
                                                    {source?.documentType === "rental_agreement" &&
                                                        source?.landlordIdUrl && (
                                                            <div
                                                                onClick={() =>
                                                                    setPreviewImage({
                                                                        url: source.landlordIdUrl,
                                                                        title: "Landlord ID",
                                                                    })
                                                                }
                                                                className="group relative h-28 cursor-zoom-in overflow-hidden rounded-md border border-slate-200 bg-slate-50"
                                                            >
                                                                <img
                                                                    src={source.landlordIdUrl}
                                                                    alt="Landlord ID"
                                                                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                                                                />

                                                                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-200 group-hover:bg-black/40">
                                                                    <div className="rounded-full bg-white/90 p-2 opacity-0 shadow-sm transition-opacity duration-200 group-hover:opacity-100">
                                                                        <ZoomIn
                                                                            size={16}
                                                                            className="text-[#0B1E3D]"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[9px] text-white">
                                                                    Landlord ID
                                                                </span>
                                                            </div>
                                                        )}
                                                </>
                                            )}
                                        </div>

                                        {/* Rejection Reason */}
                                        {current.status === "rejected" && (
                                            <p className="mt-2 text-[11px] text-red-600">
                                                {current.rejectionReason}
                                            </p>
                                        )}

                                        {/* Actions */}
                                        <div className="mt-4 flex gap-2">
                                            <button
                                                onClick={() => handleAccept(group.key)}
                                                disabled={isUpdating}
                                                className={`flex-1 inline-flex items-center justify-center gap-1 rounded-md border px-2 py-1.5 text-[11px] font-medium transition ${current.status === "approved"
                                                    ? "border-green-600 bg-green-50 text-green-700"
                                                    : "border-slate-200 text-slate-600 hover:border-green-500 hover:bg-green-50 hover:text-green-700"
                                                    }`}
                                            >
                                                <Check size={12} />
                                                Accept
                                            </button>

                                            <button
                                                onClick={() => openRejectModal(group.key)}
                                                disabled={isUpdating}
                                                className={`flex-1 inline-flex items-center justify-center gap-1 rounded-md border px-2 py-1.5 text-[11px] font-medium transition ${current.status === "rejected"
                                                    ? "border-red-600 bg-red-50 text-red-700"
                                                    : "border-slate-200 text-slate-600 hover:border-red-500 hover:bg-red-50 hover:text-red-700"
                                                    }`}
                                            >
                                                <X size={12} />
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* =====================================================
        FULL SIZE DOCUMENT PREVIEW MODAL
    ===================================================== */}
                    {previewImage && (
                        <div
                            className="fixed inset-0 z-70 flex items-center justify-center bg-black/80 p-4"
                            onClick={() => setPreviewImage(null)}
                        >
                            {/* Modal Content */}
                            <div
                                className="relative flex h-full w-full max-w-6xl items-center justify-center"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Header */}
                                <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between px-2 py-3 sm:px-4">
                                    <h3 className="rounded-md bg-black/50 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
                                        {previewImage.title}
                                    </h3>

                                    <button
                                        onClick={() => setPreviewImage(null)}
                                        className="rounded-full bg-white/90 p-2 text-slate-700 shadow-md transition hover:bg-white"
                                        aria-label="Close preview"
                                    >
                                        <CloseIcon size={20} />
                                    </button>
                                </div>

                                {/* Full Image */}
                                <div className="max-h-[90vh] max-w-full overflow-auto rounded-lg bg-black/30 p-2">
                                    <img
                                        src={previewImage.url}
                                        alt={previewImage.title}
                                        className="max-h-[85vh] max-w-full rounded-md object-contain"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* bottom */}
            <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5">

                <h3 className="mb-5 text-sm font-semibold text-[#0B1E3D]">
                    Document Guidelines
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

                    {/* ID Proof */}
                    <div className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100">
                            <Info size={15} className="text-blue-600" />
                        </div>

                        <div>
                            <p className="text-xs font-semibold text-[#0B1E3D]">
                                ID Proof
                            </p>
                            <p className="mt-1 text-[11px] leading-5 text-slate-500">
                                Passport, Emirates ID or Driver's License
                            </p>
                        </div>
                    </div>

                    {/* Address Proof */}
                    <div className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100">
                            <Info size={15} className="text-amber-600" />
                        </div>

                        <div>
                            <p className="text-xs font-semibold text-[#0B1E3D]">
                                Address Proof
                            </p>
                            <p className="mt-1 text-[11px] leading-5 text-slate-500">
                                Utility Bill or Bank Statement (within 3 months)
                            </p>
                        </div>
                    </div>

                    {/* Selfie */}
                    <div className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100">
                            <Info size={15} className="text-green-600" />
                        </div>

                        <div>
                            <p className="text-xs font-semibold text-[#0B1E3D]">
                                Selfie
                            </p>
                            <p className="mt-1 text-[11px] leading-5 text-slate-500">
                                Clear selfie holding the uploaded ID document
                            </p>
                        </div>
                    </div>

                    {/* Documents */}
                    <div className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100">
                            <Info size={15} className="text-red-600" />
                        </div>

                        <div>
                            <p className="text-xs font-semibold text-[#0B1E3D]">
                                Document Quality
                            </p>
                            <p className="mt-1 text-[11px] leading-5 text-slate-500">
                                All documents must be valid, clear and fully visible.
                            </p>
                        </div>
                    </div>

                </div>

            </div>

            {/* Reject reason modal */}
            {rejectModalDoc && (
                <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-[#0B1E3D]">Reject Document</h3>
                            <button onClick={() => setRejectModalDoc(null)} className="text-slate-400 hover:text-slate-600">
                                <X size={18} />
                            </button>
                        </div>
                        <p className="mt-1 text-[12px] text-slate-500">
                            You are about to reject <span className="font-medium text-slate-700">{groupLabel}</span>.
                        </p>

                        <div className="mt-4">
                            <label className="mb-1 block text-[12px] font-medium text-slate-600">Reason for Rejection *</label>
                            <select
                                value={reasonInput}
                                onChange={(e) => setReasonInput(e.target.value)}
                                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-[13px] focus:border-[#D97706] focus:outline-none"
                            >
                                {REJECTION_REASONS.map((r) => (
                                    <option key={r} value={r}>{r}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mt-3">
                            <label className="mb-1 block text-[12px] font-medium text-slate-600">Additional Notes (Optional)</label>
                            <textarea
                                value={notesInput}
                                onChange={(e) => setNotesInput(e.target.value.slice(0, 500))}
                                rows={3}
                                maxLength={500}
                                className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-[13px] focus:border-[#D97706] focus:outline-none"
                                placeholder="Add any extra detail for the user..."
                            />
                            <div className="mt-1 text-right text-[11px] text-slate-400">{notesInput.length}/500 characters</div>
                        </div>

                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                onClick={() => setRejectModalDoc(null)}
                                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmReject}
                                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                            >
                                Reject Document
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default BuyerKycVerificationDetail
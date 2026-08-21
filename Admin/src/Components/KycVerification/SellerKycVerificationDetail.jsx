
import React, { useState } from 'react';
import { ArrowLeft, ChevronRight, Check, X, Info, ZoomIn, X as CloseIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useGetSellerById, useVerifySellerDoc } from '../../hooks/useSeller';

// Predefined rejection reasons per doc-level reject
const REJECTION_REASONS = [
  "Document is unclear / Blurry",
  "Document expired",
  "Document type mismatch",
  "Details do not match records",
  "Address proof older than 3 months",
  "Other"
];

const VERIFICATION_DOCUMENTS = [
  {
    key: 'tradeLicense',
    label: 'Trade License',
    sourceField: 'tradeLicense'
  },
  {
    key: 'emiratesId',
    label: 'Emirates ID',
    sourceField: 'emiratesId'
  },
  {
    key: 'bankStatement',
    label: 'Bank Statement',
    sourceField: 'bankStatement'
  },
  {
    key: 'vatCertificate',
    label: 'VAT Certificate',
    sourceField: 'vatCertificate'
  }
];

function SellerKycVerificationDetail({ sellerKycId, setCurrentPage }) {

  const { data: sellerData, isLoading, isError } = useGetSellerById(sellerKycId);
  const record = sellerData?.data;

  const { mutate: verifySellerDoc, isPending: isUpdating } = useVerifySellerDoc();

  // Reject modal state
  const [rejectModalDoc, setRejectModalDoc] = useState(null); // doc type string or null
  const [reasonInput, setReasonInput] = useState(REJECTION_REASONS[0]);
  const [notesInput, setNotesInput] = useState('');

  const [previewImage, setPreviewImage] = useState(null);

  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-sm text-slate-500">
          Loading seller details...
        </p>
      </div>
    );
  }

  if (isError || !record) {
    return (
      <div className="p-6">
        <p className="text-sm text-red-500">
          Seller details not found.
        </p>

        <button
          onClick={() => setCurrentPage("seller-kyc")}
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
    verifySellerDoc(
      { id: record._id, document: docType, action: 'approve', rejectionReason: undefined },
      {
        onSuccess: () => {
          toast.success("Status Approved");
        }
      }
    )
  };

  // reject handler
  const confirmReject = () => {
    verifySellerDoc(
      { id: record._id, document: rejectModalDoc, action: 'reject', rejectionReason: reasonInput },
      {
        onSuccess: () => {
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
  const groupLabel = VERIFICATION_DOCUMENTS.find((doc) => doc.key === rejectModalDoc)?.label;

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
              onClick={() => setCurrentPage('seller-kyc')}
              className="cursor-pointer text-slate-500 hover:text-[#D97706] transition-colors">
              Seller KYC List
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
            onClick={() => setCurrentPage('seller-kyc')}
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
              src={record.profileImage || "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg"}
              alt={record.fullName}
              className="h-20 w-20 rounded-full object-cover"
            />
            <span className="mt-2 inline-block rounded-full bg-slate-100 px-3 py-0.5 text-[11px] font-medium text-slate-600">
              {record.role || "NA"}
            </span>
            <h2 className="mt-2 text-base font-semibold text-[#0B1E3D]">{record.fullName}</h2>
            <p className="text-[12px] text-slate-500">{record.email}</p>
            <p className="text-[12px] text-slate-500">{record.phone}</p>
          </div>

          <div className="mt-5 space-y-3 text-[12px]">
            <div className="flex justify-between">
              <span className="text-slate-500">Seller ID</span>
              <span className="font-medium text-slate-700">{record.sellerId || '---'}</span>
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
              <span className="text-slate-500">Trade License Document</span>
              {statusBadge(record.tradeLicense?.status)}
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Emirates ID Document</span>
              {statusBadge(record.emiratesId?.status)}
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Bank Statement Document</span>
              {statusBadge(record.bankStatement?.status)}
            </div>

            {record.vatCertificate?.url && (
              <div className="flex justify-between">
                <span className="text-slate-500">VAT Certificate Document</span>
                {statusBadge(record.vatCertificate.status)}
              </div>
            )}
          </div>
        </div>

        {/* Right: documents */}
        <div className="lg:col-span-2 space-y-6">

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold text-[#0B1E3D]">
              Documents Submitted
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {VERIFICATION_DOCUMENTS.map((doc) => {

                const source = record?.[doc.sourceField];
                const current = source || { status: 'pending', rejectionReason: null };

                return (
                  <div
                    key={doc.key}
                    className="rounded-lg border border-slate-200 p-3"
                  >
                    {/* Header */}
                    <div className="my-4 flex items-center justify-between">
                      <span className="truncate text-[12px] font-medium text-slate-700">
                        {doc.label}
                      </span>

                      {source?.url ? (
                        statusBadge(current.status)
                      ) : (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                          Not Uploaded
                        </span>
                      )}
                    </div>

                    <div
                      onClick={() =>
                        source?.url &&
                        setPreviewImage({
                          url: source.url,
                          title: doc.label,
                        })
                      }
                      className={`group relative h-40 overflow-hidden rounded-md border border-slate-200 bg-slate-50 ${source?.url ? "cursor-zoom-in" : ""
                        }`}
                    >
                      {source?.url ? (
                        <>
                          <img
                            src={source.url}
                            alt={doc.label}
                            className="h-40 w-full rounded-lg bg-slate-50 object-contain"
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
                            {doc.label}
                          </span>
                        </>
                      ) : (
                        <div className="flex h-28 items-center justify-center rounded-lg bg-slate-50">
                          <span className="text-xs text-slate-400">
                            Document not uploaded
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Rejection Reason */}
                    {source?.url && current.status === "rejected" && (
                      <p className="mt-2 text-[11px] text-red-600">
                        {current.rejectionReason || "Document rejected"}
                      </p>
                    )}

                    {/* Actions */}
                    {source?.url && (
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => handleAccept(doc.key)}
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
                          onClick={() => openRejectModal(doc.key)}
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
                    )}
                  </div>
                );
              })}
            </div>

            {/* FULL SIZE DOCUMENT PREVIEW MODAL */}
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
            )
            }
          </div>
        </div>
      </div>

      {/* bottom */}
      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

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

export default SellerKycVerificationDetail
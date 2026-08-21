
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FileText, AlertCircle, UploadCloud, Upload } from 'lucide-react';

import { useReuploadBuyerDoc } from '../hook/useBuyer';

function ReUploadBuyerDocs() {

    const { buyer_id, token, group } = useParams();

    const { mutate: reuplodDoc, isPending: isUpdating } = useReuploadBuyerDoc();

    const [identityFiles, setIdentityFiles] = useState({ front: null, back: null, selfie: null });
    const [addressFiles, setAddressFiles] = useState({ document: null, landlord: null });
    const [documentType, setDocumentType] = useState('');
    const [isSubmitted, setIsSubmitted] = useState();

    const handleIdentityChange = (key, file) => {
        setIdentityFiles(prev => ({ ...prev, [key]: file }));
    };

    const handleAddressChange = (key, file) => {
        setAddressFiles(prev => ({ ...prev, [key]: file }));
    };

    // helper
    const UploadField = ({ label, onChange, file }) => (
        <div className="mb-4">
            <label className="block text-[10px] font-medium uppercase tracking-wide text-slate-500 mb-1">
                {label}
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3 transition hover:border-[#D97706]">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white border border-slate-200">
                    <UploadCloud size={16} className="text-[#D97706]" />
                </div>
                <div className="flex-1 truncate">
                    <p className="text-xs font-medium text-slate-700 truncate">
                        {file ? file.name : "Choose file"}
                    </p>
                </div>
                <input
                    type="file"
                    className="hidden"
                    onChange={(e) => onChange(e.target.files[0])}
                    accept=".jpg,.jpeg,.png,.pdf"
                />
            </label>
        </div>
    );

    const handleSubmit = () => {
        const files = group === 'identity' ? identityFiles : addressFiles;

        reuplodDoc(
            { buyer_id, group, token, files, documentType },
            {
                onSuccess: () => {
                    setIsSubmitted(true);
                    toast.success("Document submitted for review");
                }
            }
        );
    };

    if (isSubmitted) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-lg font-semibold text-green-700">Submitted!</h2>
                <p className="text-sm text-slate-500 mt-2">
                    Your document has been resubmitted. Our team will review it shortly.
                </p>
            </div>
        );
    }

    return (
        <section className="w-full min-h-screen bg-slate-50">
            <div className="mx-auto max-w-5xl px-4 py-8">

                <div className="mb-6">
                    <h1 className="text-xl font-bold text-[#0B1E3D]">
                        Re-upload Documents
                    </h1>
                    <p className="mt-1 text-xs text-slate-500">
                        Please replace the rejected document and submit it again for verification.
                    </p>
                </div>

                {group === 'identity' && (
                    <div className="mb-6 rounded-xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50">
                                    <FileText size={17} className="text-[#D97706]" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-semibold text-[#0B1E3D]">Identity Verification</h2>
                                    <p className="text-[11px] text-slate-400">Required: Front, Back, and Selfie</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-5">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <UploadField label="Front Side" file={identityFiles.front} onChange={(f) => handleIdentityChange('front', f)} />
                                <UploadField label="Back Side" file={identityFiles.back} onChange={(f) => handleIdentityChange('back', f)} />
                                <UploadField label="Selfie" file={identityFiles.selfie} onChange={(f) => handleIdentityChange('selfie', f)} />
                            </div>
                            <div className="flex justify-end mt-2">
                                <button
                                    onClick={handleSubmit}
                                    disabled={isUpdating}
                                    className="bg-[#D97706] text-white px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2 disabled:opacity-50"
                                >
                                    <Upload size={14} /> {isUpdating ? "Submitting..." : "Submit Identity Docs"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {group === 'address' && (
                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50">
                                    <FileText size={17} className="text-[#D97706]" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-semibold text-[#0B1E3D]">Address Verification</h2>
                                    <p className="text-[11px] text-slate-400">Required: Document & Landlord ID (if rental)</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <UploadField label="Main Document" file={addressFiles.document} onChange={(f) => handleAddressChange('document', f)} />
                                <UploadField label="Landlord ID" file={addressFiles.landlord} onChange={(f) => handleAddressChange('landlord', f)} />
                            </div>
                            <div className="flex justify-end mt-2">
                                <button
                                    onClick={handleSubmit}
                                    disabled={isUpdating}
                                    className="bg-[#D97706] text-white px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2 disabled:opacity-50"
                                >
                                    <Upload size={14} /> {isUpdating ? "Submitting..." : "Submit Address Docs"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </section>
    );
};

export default ReUploadBuyerDocs;
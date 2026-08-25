
import { useParams } from "react-router-dom";
import { useState } from "react";
import { Upload, UploadCloud } from "lucide-react";
import { toast } from "react-toastify";

import { useReuploadSellerDoc } from "../hook/useSeller";

const DOC_LABELS = {
    tradeLicense: 'Trade License',
    emiratesId: 'Emirates ID',
    bankStatement: 'Bank Statement',
    vatCertificate: 'VAT Certificate'
};

function ReUploadSellerDocs() {

    const { seller_id, token, document } = useParams();
    const { mutate: reuploadDoc, isPending: isUpdating } = useReuploadSellerDoc();

    const [file, setFile] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = () => {
        if (!file) {
            toast.error("Please select a file first");
            return;
        }

        reuploadDoc(
            { seller_id, document, token, file },
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
            <div className="mx-auto max-w-2xl px-4 py-8">

                <div className="mb-6">
                    <h1 className="text-xl font-bold text-[#0B1E3D]">Re-upload Document</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Please replace the rejected document and submit it again for verification.
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
                    <h2 className="text-sm font-semibold text-[#0B1E3D] mb-4">
                        {DOC_LABELS[document] || document}
                    </h2>

                    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-5 transition hover:border-[#D97706]">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white border border-slate-200">
                            <UploadCloud size={23} className="text-[#D97706]" />
                        </div>
                        <div className="flex-1 truncate">
                            <p className="text-[13px] font-medium text-slate-700 truncate">
                                {file ? file.name : "Choose file"}
                            </p>
                        </div>
                        <input
                            type="file"
                            className="hidden"
                            onChange={(e) => setFile(e.target.files[0])}
                            accept=".jpg,.jpeg,.png,.pdf"
                        />
                    </label>

                    <div className="flex justify-end mt-4">
                        <button
                            onClick={handleSubmit}
                            disabled={isUpdating}
                            className="bg-[#D97706] text-white px-4 py-3 rounded-lg text-[13px] font-medium flex items-center gap-2 disabled:opacity-50"
                        >
                            <Upload size={14} /> {isUpdating ? "Submitting..." : "Submit Document"}
                        </button>
                    </div>
                </div>

            </div>
        </section>
    );
}

export default ReUploadSellerDocs;
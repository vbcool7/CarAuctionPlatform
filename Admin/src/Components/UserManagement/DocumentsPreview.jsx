
import React from 'react';
import { FileText, Eye, Download } from 'lucide-react';

function DocumentsPreview({ documents = [] }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="text-lg font-bold text-[#0B1E3D]">
                    Documents
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                    Uploaded verification documents
                </p>
            </div>

            {/* Body */}
            <div className="p-5 space-y-3">
                {documents.length ? (
                    documents.map((doc, index) => (
                        <DocumentItem
                            key={index}
                            title={doc.label}
                            status={doc.status}
                        />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-10">
                        <FileText
                            size={40}
                            className="text-slate-300 mb-3"
                        />
                        <p className="text-sm text-slate-400">
                            No documents uploaded.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

const DocumentItem = ({ title, status }) => {

    const statusStyles = {
        verified: "bg-green-50 text-green-700 border-green-100",
        pending: "bg-amber-50 text-amber-700 border-amber-100",
        rejected: "bg-red-50 text-red-700 border-red-100",
        expired: "bg-slate-100 text-slate-600 border-slate-200",
    };

    const badgeClass =
        statusStyles[status?.toLowerCase()] ||
        "bg-slate-100 text-slate-600 border-slate-200";

    return (
        <div className="flex items-center justify-between gap-4 p-3 rounded-xl border border-slate-200 hover:border-[#D97706]/40 hover:bg-slate-50 transition-all">

            {/* Left */}
            <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-[#D97706] shrink-0">
                    <FileText size={18} />
                </div>

                <p className="text-sm font-semibold text-slate-800 truncate">
                    {title}
                </p>
            </div>

            {/* Status */}
            <span
                className={`px-3 py-1 rounded-full border text-xs font-semibold capitalize whitespace-nowrap ${badgeClass}`}
            >
                {status}
            </span>
        </div>
    );
};

export default DocumentsPreview;
import { FileText, Download, ExternalLink } from "lucide-react";

function DocumentsTab({ vehicle }) {
    const { documents = [] } = vehicle || {};

    if (documents.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-slate-500 text-sm">
                    No documents available.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc, index) => (
                <div
                    key={doc.publicId || index}
                    className="border border-slate-200 rounded-2xl p-4 bg-white hover:border-[#D97706]/30 transition-all"
                >
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex gap-3 min-w-0">
                            <div className="w-11 h-11 shrink-0 rounded-xl bg-[#D97706]/10 flex items-center justify-center">
                                <FileText
                                    size={20}
                                    className="text-[#D97706]"
                                />
                            </div>

                            <div className="min-w-0">
                                <h4 className="font-semibold text-slate-900 text-sm truncate">
                                    {doc.name || "Document"}
                                </h4>

                                <p className="text-slate-500 text-xs mt-1">
                                    {doc.resourceType === "raw"
                                        ? "Document"
                                        : doc.resourceType || "File"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                            {/* View */}
                            <button
                                type="button"
                                onClick={() => window.open(doc.url, "_blank")}
                                className="flex items-center gap-1 text-[#D97706] text-sm font-medium hover:text-[#b86405] transition-colors"
                            >
                                <ExternalLink size={15} />
                                View
                            </button>

                            {/* Download */}
                            <a
                                href={doc.url}
                                download
                                className="flex items-center gap-1 text-slate-600 text-sm font-medium hover:text-slate-900 transition-colors"
                            >
                                <Download size={15} />
                                Download
                            </a>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default DocumentsTab;
import { FileText, Download, ExternalLink, FolderOpen } from "lucide-react";

function DocumentsTab({ vehicle }) {
    const documents = (vehicle?.documents || []).filter(
        (doc) => doc?.url
    );

    if (documents.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                    <FolderOpen size={25} className="text-slate-400" />
                </div>

                <h3 className="text-sm font-semibold text-slate-800">
                    No Documents Available
                </h3>

                <p className="text-slate-500 text-sm mt-1 max-w-sm">
                    Documents uploaded for this vehicle will appear here.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                        Vehicle Documents
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                        View or download the documents associated with this vehicle.
                    </p>
                </div>

                <span className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full shrink-0">
                    {documents.length} {documents.length === 1 ? "File" : "Files"}
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documents.map((doc, index) => (
                    <div
                        key={doc.publicId || doc.url || index}
                        className="border border-slate-200 rounded-2xl p-4 bg-white hover:border-[#D97706]/40 hover:shadow-sm transition-all"
                    >
                        <div className="flex items-start gap-3">
                            <div className="w-11 h-11 shrink-0 rounded-xl bg-[#D97706]/10 flex items-center justify-center">
                                <FileText
                                    size={20}
                                    className="text-[#D97706]"
                                />
                            </div>

                            <div className="min-w-0 flex-1">
                                <h4
                                    className="font-semibold text-slate-900 text-sm break-words"
                                    title={doc.name || "Vehicle Document"}
                                >
                                    {doc.name || `Document ${index + 1}`}
                                </h4>

                                <p className="text-slate-500 text-xs mt-1">
                                    {doc.resourceType === "raw"
                                        ? "Document File"
                                        : doc.resourceType
                                            ? `${doc.resourceType.charAt(0).toUpperCase()}${doc.resourceType.slice(1)} File`
                                            : "Uploaded File"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-4 mt-5 pt-3 border-t border-slate-100">
                            <a
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-[#D97706] text-sm font-medium hover:text-[#b86405] transition-colors"
                            >
                                <ExternalLink size={15} />
                                View
                            </a>

                            <a
                                href={doc.url}
                                download={doc.name || `document-${index + 1}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-slate-600 text-sm font-medium hover:text-slate-900 transition-colors"
                            >
                                <Download size={15} />
                                Download
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DocumentsTab;
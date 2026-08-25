
import React, { useState } from "react";
import { Download, X } from "lucide-react";

function DocumentPreviewModal({ doc, onClose }) {
    if (!doc) return null;

    const [zoom, setZoom] = useState(100);

    const isPdf =
        doc.resourceType === "raw" ||
        doc.resourceType === "pdf" ||
        doc.name?.toLowerCase().endsWith(".pdf");

    return (
        <div className="fixed inset-0 bg-black/50 z-70 flex items-center justify-center p-6">

            <div className="bg-white rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col">

                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <div>
                        <h4 className="font-semibold text-[#0B1E3D]">
                            {doc.name || "Vehicle Document"}
                        </h4>

                        <p className="text-[10px] text-gray-500 mt-1">
                            {isPdf ? "PDF Document" : "Image"}
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg hover:bg-slate-100"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Preview */}
                <div className="flex-1 overflow-auto p-4 bg-slate-50">

                    {isPdf ? (
                        <iframe
                            src={doc.url}
                            title={doc.name || "PDF Document"}
                            className="w-full h-full min-h-[500px] rounded-xl border border-slate-200 bg-white"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center overflow-auto">
                            <img
                                src={doc.url}
                                alt={doc.name || "Document"}
                                style={{ width: `${zoom}%` }}
                                className="max-w-none object-contain rounded-lg"
                            />
                        </div>
                    )}

                </div>

                {/* Footer */}
                <div className="flex justify-between items-center p-4 border-t">

                    {/* Zoom only for images */}
                    {!isPdf ? (
                        <div className="flex items-center gap-2">

                            <button
                                onClick={() =>
                                    setZoom((z) => Math.max(50, z - 10))
                                }
                                className="w-7 h-7 rounded-md border border-slate-200 hover:bg-slate-50"
                            >
                                −
                            </button>

                            <span className="text-sm text-gray-600 min-w-[45px] text-center">
                                {zoom}%
                            </span>

                            <button
                                onClick={() =>
                                    setZoom((z) => Math.min(200, z + 10))
                                }
                                className="w-7 h-7 rounded-md border border-slate-200 hover:bg-slate-50"
                            >
                                +
                            </button>

                        </div>
                    ) : (
                        <div />
                    )}

                    {/* Download */}
                    <a
                        href={doc.url}
                        download={doc.name || "vehicle-document"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-medium text-[#D97706] hover:text-[#B45309]"
                    >
                        <Download className="w-4 h-4" />
                        Download
                    </a>

                </div>

            </div>
        </div>
    );
}

export default DocumentPreviewModal;
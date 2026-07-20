
import React, { useState } from "react";
import { Download, X } from "lucide-react";

function DocumentPreviewModal({ doc, onClose }) {

    const [zoom, setZoom] = useState(100);

    return (
        <div className="fixed inset-0 bg-black/50 z-70 flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                    <h4 className="font-semibold text-[#0B1E3D]">
                        {doc.name}
                    </h4>
                    <button
                        onClick={onClose}>
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-auto p-4">
                    <img
                        src={doc.fileUrl}
                        alt={doc.name}
                        style={{ width: `${zoom}%` }}
                    />
                </div>

                <div className="flex justify-between items-center p-4 border-t">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setZoom(z => Math.max(50, z - 10))}>−</button>

                        <span>{zoom}%</span>
                        
                        <button
                            onClick={() => setZoom(z => Math.min(200, z + 10))}>+</button>
                    </div>
                    <a
                        href={doc.fileUrl}
                        download className="flex items-center gap-2 text-sm font-medium">
                        <Download className="w-4 h-4" /> Download
                    </a>
                </div>
            </div>
        </div>
    );
}

export default DocumentPreviewModal;
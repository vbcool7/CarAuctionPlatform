
import React, { useState } from "react";
import { FileText } from "lucide-react";
import DocumentPreviewModal from "./DocumentPreviewModal";

function DocStatusBadge({ status }) {

  const styles = {
    Pending: "bg-amber-50 text-amber-600",
    Uploaded: "bg-green-50 text-green-600",
    "Not Applicable": "bg-slate-100 text-slate-500",
  };
  return (
    <span className={`text-[11px] font-medium px-2 py-1 rounded-full ${styles[status]}`}>
      {status}
    </span>
  );
}

function VehicleDocumentTab({ documents }) {

  const [previewDoc, setPreviewDoc] = useState(null);

  return (
    <div>
      <h3 className="text-[13px] font-semibold text-[#0B1E3D] mb-3">
        Required Documents
      </h3>

      <div className="space-y-2">
        {documents.map(doc => (
          <div 
          key={doc.id} 
          className="flex items-center justify-between p-3 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-[12px] font-semibold text-[#0B1E3D]">{doc.name}</p>
                <p className="text-[11px] text-gray-500">{doc.description}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <DocStatusBadge status={doc.status} />
              {doc.status !== "Not Applicable" && (
                <button
                  onClick={() => setPreviewDoc(doc)}
                  className="text-[11px] font-medium border rounded-lg px-2 py-1 hover:bg-slate-50 cursor-pointer"
                >
                  View
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {previewDoc && (
        <DocumentPreviewModal
        doc={previewDoc} 
        onClose={() => setPreviewDoc(null)} />
      )}
    </div>
  );
}

export default VehicleDocumentTab;
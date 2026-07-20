
import React from "react";
import {
  Download,
  Filter,
  Eye,
  MoreVertical,
  FileText,
  Image,
} from "lucide-react";

const statusColors = {
  Verified: "bg-green-100 text-green-700",
  "Pending Review": "bg-orange-100 text-orange-700",
  Rejected: "bg-red-100 text-red-700",
  Expired: "bg-slate-100 text-slate-500",
};

function LiveAuctionsDocumentsTab({ auction }) {

  if (!auction) return null;

  const documents = auction.documents || [];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-5 py-4 border-b border-slate-200">
        <h3 className="text-[15px] font-semibold text-[#0B1E3D]">
          Uploaded Documents ({documents.length})
        </h3>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-xs font-medium border border-slate-200 rounded-lg hover:bg-slate-50">
            <Download size={14} />
            Download All
          </button>

          <button className="flex items-center gap-2 px-3 py-2 text-xs font-medium border border-slate-200 rounded-lg hover:bg-slate-50">
            <Filter size={14} />
            Filter
          </button>
        </div>
      </div>

      {/* Table */}
      {documents.length === 0 ? (
        <div className="px-5 py-10 text-center text-sm text-slate-400">
          No documents uploaded yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px]">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="px-5 py-3 font-medium">Document Name</th>
                <th className="px-4 py-3 font-medium min-w-40">Document Type</th>
                <th className="px-4 py-3 font-medium min-w-40">Uploaded By</th>
                <th className="px-4 py-3 font-medium min-w-40">Uploaded On</th>
                <th className="px-4 py-3 font-medium min-w-30">File Size</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-center min-w-40">Actions</th>
              </tr>
            </thead>

            <tbody>
              {documents.map((doc) => (
                <tr
                  key={doc.id}
                  className="border-b last:border-0 border-slate-100 hover:bg-slate-50"
                >
                  {/* Name */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          doc.fileType === "pdf" ? "bg-red-100" : "bg-green-100"
                        }`}
                      >
                        {doc.fileType === "pdf" ? (
                          <FileText size={16} className="text-red-600" />
                        ) : (
                          <Image size={16} className="text-green-600" />
                        )}
                      </div>

                      <span className="font-medium text-[#0B1E3D] whitespace-nowrap">
                        {doc.name}
                      </span>
                    </div>
                  </td>

                  {/* Type */}
                  <td className="px-4 py-4">
                    <span className="px-2 py-1 rounded-md bg-slate-100 text-[11px] text-slate-700">
                      {doc.type}
                    </span>
                  </td>

                  {/* Uploaded By */}
                  <td className="px-4 py-4">
                    <p className="font-medium text-[#0B1E3D]">{doc.uploadedBy}</p>
                    <p className="text-slate-500 text-[11px]">{doc.company}</p>
                  </td>

                  {/* Date */}
                  <td className="px-4 py-4">
                    <p>{doc.date}</p>
                    <p className="text-slate-500 text-[11px]">{doc.time}</p>
                  </td>

                  {/* Size */}
                  <td className="px-4 py-4">{doc.size}</td>

                  {/* Status */}
                  <td className="px-4 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${
                        statusColors[doc.status] || "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {doc.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-100">
                        <Eye size={15} />
                      </button>

                      <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-100">
                        <Download size={15} />
                      </button>

                      <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-100">
                        <MoreVertical size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default LiveAuctionsDocumentsTab;
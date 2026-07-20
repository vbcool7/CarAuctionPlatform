
import React from 'react';
import { FileText, Image as ImageIcon, Download, MoreVertical } from "lucide-react";

const documents = [
  {
    id: 1,
    name: "Passport Copy.pdf",
    size: "2.4 MB",
    category: "Identity Documents",
    uploadedOn: "May 12, 2024",
    expiryDate: "May 12, 2034",
    status: "Verified",
    type: "pdf",
  },
  {
    id: 2,
    name: "Emirates ID Front.pdf",
    size: "1.1 MB",
    category: "Identity Documents",
    uploadedOn: "May 12, 2024",
    expiryDate: "May 12, 2026",
    status: "Verified",
    type: "pdf",
  },
  {
    id: 3,
    name: "Profile Photo.jpg",
    size: "456 KB",
    category: "Other Documents",
    uploadedOn: "May 12, 2024",
    expiryDate: "-",
    status: "Verified",
    type: "image",
  },
];

function StaffDocumentTab() {
  return (
    <div>
      {/* header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-bold text-slate-900">Staff Documents</h2>
          <p className="text-[13px] text-slate-500 mt-1">View and manage documents uploaded by this staff member.</p>
        </div>

        <div className="flex justify-between">
          <button
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#D97706] border border-slate-200 rounded-lg hover:bg-amber-700 transition-all active:scale-95"
          >
            + Assign New
          </button>
        </div>
      </div>
      
      {/* table */}
     <div className="overflow-x-auto rounded-2xl">
        <table className="w-full text-sm">

          <thead className="border-b border-slate-200 bg-slate-50">
            <tr className="text-[11px] font-bold uppercase text-slate-500">

              <th className="px-5 py-4 text-left font-semibold min-w-68">
                Document Name
              </th>

              <th className="px-4 py-4 text-left min-w-45">
                Category
              </th>

              <th className="px-4 py-4 text-left min-w-40">
                Uploaded On
              </th>

              <th className="px-4 py-4 text-left min-w-40">
                Expiry Date
              </th>

              <th className="px-4 py-4 text-center min-w-33">
                Status
              </th>

              <th className="px-4 py-4 text-center min-w-30">
                Actions
              </th>

            </tr>
          </thead>

          {/* Body */}
          <tbody>

            {documents.map((doc) => (

              <tr
                key={doc.id}
                className="border-b border-slate-100 hover:bg-slate-50 transition"
              >

                {/* Document */}
                <td className="px-5 py-4">

                  <div className="flex items-center gap-3">

                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${doc.type === "pdf"
                          ? "bg-red-50 text-red-500"
                          : "bg-green-50 text-green-600"
                        }`}
                    >
                      {doc.type === "pdf" ? (
                        <FileText size={20} />
                      ) : (
                        <ImageIcon size={20} />
                      )}
                    </div>

                    <div>

                      <p className="font-semibold text-slate-900">
                        {doc.name}
                      </p>

                      <p className="text-xs text-slate-500">
                        {doc.size}
                      </p>

                    </div>

                  </div>

                </td>

                {/* Category */}
                <td className="px-4 py-4 text-slate-700">
                  {doc.category}
                </td>

                {/* Uploaded */}
                <td className="px-4 py-4 text-slate-700">
                  {doc.uploadedOn}
                </td>

                {/* Expiry */}
                <td className="px-4 py-4 text-slate-700">
                  {doc.expiryDate}
                </td>

                {/* Status */}
                <td className="px-4 py-4 text-center">

                  <span className="inline-flex items-center gap-1 rounded-md bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-600">

                    ✓ Verified

                  </span>

                </td>

                {/* Actions */}
                <td className="px-4 py-4">

                  <div className="flex justify-center gap-2">

                    <button className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#0B1E3D] hover:border-slate-300 transition">
                      <Download size={16} />
                    </button>

                    <button className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#0B1E3D] hover:border-slate-300 transition">
                      <MoreVertical size={16} />
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>
      </div>
    </div>
  )
}

export default StaffDocumentTab;
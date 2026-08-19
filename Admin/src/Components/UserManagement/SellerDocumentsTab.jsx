
import React from 'react';
import { Eye, Download, FileText, User, ShieldCheck, Upload } from 'lucide-react';

const documentConfig = [
  { key: 'tradeLicense', type: 'Trade License', description: 'Company trade license copy', icon: <User className="text-indigo-500" /> },
  { key: 'emiratesId', type: 'Emirates ID', description: 'Identity proof document', icon: <ShieldCheck className="text-green-500" /> },
  { key: 'bankStatement', type: 'Bank Statement', description: 'Bank account statement', icon: <FileText className="text-blue-500" /> },
  { key: 'vatCertificate', type: 'VAT Certificate', description: 'VAT registration certificate (optional)', icon: <ShieldCheck className="text-slate-400" /> },
];

function SellerDocumentsTab({ data }) {

  const documents = documentConfig.map((cfg) => ({
    ...cfg,
    url: data?.[cfg.key]?.url,
    status: data?.[cfg.key]?.status || 'not_uploaded',
    rejectionReason: data?.[cfg.key]?.rejectionReason,
  }));

  const statusStyles = {
    approved: 'bg-green-100 text-green-700',
    pending: 'bg-amber-100 text-amber-700',
    rejected: 'bg-red-100 text-red-700',
    not_uploaded: 'bg-slate-100 text-slate-500',
  };

  return (
    <div>

      {/* header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 bg-white">

        {/* Left Content */}
        <div className="flex-1 max-w-3xl">
          <h2 className="font-bold text-slate-900">
            Required Documents
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            All documents are required for seller verification. Ensure all documents are valid and up to date.
          </p>
        </div>

        {/* Right Button */}
        {/* <div className="flex justify-start lg:justify-end">
          <button
            className="inline-flex items-center justify-center gap-2 text-sm px-4 py-2.5 rounded-xl bg-[#D97706] text-white font-medium transition-all duration-200 hover:bg-[#b86505] active:scale-95"
          >
            <Upload size={18} />
            Upload New Document
          </button>
        </div> */}
      </div>

      {/* Documents Table */}
      <div className="mt-6 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 z-10">
              <tr className="text-sm text-slate-600">
                <th className="px-6 py-4 text-left font-semibold whitespace-nowrap">Document Type</th>
                <th className="px-6 py-4 text-left font-semibold whitespace-nowrap">Status</th>
                <th className="px-6 py-4 text-center font-semibold whitespace-nowrap">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {documents.map((doc) => (
                <tr key={doc.key} className="hover:bg-slate-50 transition-colors duration-200">
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-[#D97706]">
                        {doc.icon}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{doc.type}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{doc.description}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[doc.status]}`}>
                      {doc.status.replace('_', ' ')}
                    </span>
                    {doc.status === 'rejected' && doc.rejectionReason && (
                      <p className="text-xs text-red-500 mt-1">{doc.rejectionReason}</p>
                    )}
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex justify-center gap-2">
                      <button
                        disabled={!doc.url}
                        onClick={() => window.open(doc.url, '_blank')}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-[#D97706] hover:bg-amber-50 hover:text-[#D97706] disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Eye size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default SellerDocumentsTab;
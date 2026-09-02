
import React from 'react'
import ContactSupport from '../../SharedComponents/ContactSupport';
import { formatLabel } from '../../utils/formatter';
import { Check, FileText } from 'lucide-react';

function DocumentSidebar({ vehicle }) {

    const docCount = vehicle?.documents?.length || 0;

    return (
        <div className="space-y-6">

            {/* Document summary — no per-doc status exists in schema,  only whole-vehicle adminStatus */}
            <div className="bg-white border border-slate-200 rounded-xl p-5">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-sm font-semibold text-[#0B1E3D]">
                            Documents
                        </h3>

                        <p className="text-xs text-slate-500 mt-1">
                            Uploaded vehicle documents
                        </p>
                    </div>

                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                        <FileText size={17} className="text-slate-600" />
                    </div>
                </div>

                <div className="mt-5 flex items-end justify-between">
                    <div>
                        <div className="text-2xl font-bold text-[#0B1E3D]">
                            {docCount}
                        </div>

                        <p className="text-xs text-slate-500 mt-1">
                            document{docCount !== 1 ? 's' : ''} uploaded
                        </p>
                    </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                        <span className="text-[13px] text-slate-500">
                            Vehicle Review Status
                        </span>

                        <span
                            className={`text-[12px] font-semibold px-2.5 py-1 rounded-full 
                                ${vehicle?.adminStatus === 'approved'
                                    ? 'bg-green-50 text-green-600'
                                    : vehicle?.adminStatus === 'rejected'
                                        ? 'bg-red-50 text-red-600'
                                        : 'bg-amber-50 text-amber-600'
                                }`}
                        >
                            {formatLabel(vehicle?.adminStatus) || '—'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Document Guidelines */}
            <div className="bg-white border border-slate-200 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-[#0B1E3D] mb-4">
                    Document Guidelines
                </h3>

                <div className="space-y-3">
                    <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0 mt-0.5">
                            <Check size={12} />
                        </div>

                        <p className="text-xs text-slate-500 leading-5">
                            Ensure all documents are clear and legible.
                        </p>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0 mt-0.5">
                            <Check size={12} />
                        </div>

                        <p className="text-xs text-slate-500 leading-5">
                            Vehicle registration and ownership proof are typically required.
                        </p>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0 mt-0.5">
                            <Check size={12} />
                        </div>

                        <p className="text-xs text-slate-500 leading-5">
                            Documents are reviewed as part of the overall vehicle approval process.
                        </p>
                    </div>
                </div>
            </div>

            {/* support */}
            <ContactSupport />
        </div>
    );
}

export default DocumentSidebar;
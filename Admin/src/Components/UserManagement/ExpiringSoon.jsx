
import React from 'react';
import { AlertTriangle } from 'lucide-react';

function ExpiringSoon({ documents = [] }) {
    return (
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm w-full max-w-md">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-slate-900">Expiring Soon</h2>
                <button className="text-[#D97706] text-xs font-medium hover:underline">
                    View All
                </button>
            </div>

            {/* Documents List */}
            <div className="space-y-4">
                {documents.map((doc, index) => (
                    <div key={index} className="flex justify-between items-start">
                        <div className="flex items-start gap-2">

                            <AlertTriangle
                                className={`w-4 h-4 mt-0.5 ${doc.urgency === 'high' ? 'text-red-500' : 'text-amber-500'}`}
                            />
                            <div>
                                <p className="text-sm text-gray-800 font-medium">{doc.name}</p>
                                <p className="text-[10px] text-gray-500">{doc.expiryMessage}</p>
                            </div>
                        </div>
                        <span className="text-xs text-gray-600 font-medium mt-0.5">
                            {doc.date}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ExpiringSoon;
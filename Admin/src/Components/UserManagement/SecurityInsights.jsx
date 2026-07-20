
import React from 'react';
import { ShieldCheck, AlertTriangle, Info, ShieldAlert } from 'lucide-react';

function SecurityInsights({ insights = [] }) {
    return (
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm w-full max-w-md">

            {/* Header */}
            <h2 className="font-bold text-slate-900 mb-4">
                Security Insights
            </h2>

            {/* List */}
            <div className="space-y-4">
                {insights.map((item, index) => (
                    <div
                        key={index}
                        className="flex justify-between items-center">
                        <div className="flex items-center gap-2">

                            {item.type === 'success' && <ShieldCheck className="w-4 h-4 text-emerald-500" />}
                            {item.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                            {item.type === 'info' && <Info className="w-4 h-4 text-blue-500" />}

                            <span className="text-sm text-gray-800">{item.message}</span>
                        </div>

                        {/* Action text */}
                        {item.action && (
                            <span className="text-xs font-semibold text-[#D97706] cursor-pointer hover:underline">
                                {item.action}
                            </span>
                        )}

                        {/* Status text (if no action) */}
                        {item.status && (
                            <span className="text-xs font-semibold text-emerald-600">
                                {item.status}
                            </span>
                        )}
                    </div>
                ))}
            </div>

            {/* Footer Button */}
            <button className="flex items-center justify-center gap-2 w-full mt-5 py-2 border border-gray-200 rounded-lg text-[#D97706] text-xs font-semibold hover:bg-gray-50 transition-colors">
                <ShieldAlert className="w-3.5 h-3.5" />
                View Security Report
            </button>
        </div>
    );
}

export default SecurityInsights;
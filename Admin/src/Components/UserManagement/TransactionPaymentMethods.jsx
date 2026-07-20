
import React from 'react'

function TransactionPaymentMethods({ title, rows }) {
    return (
        <div className="w-full bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">{title}</h3>
            <div className="space-y-4">
                {rows.map((row) => (
                    <div key={row.title} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <row.icon size={18} className="text-slate-400" />
                            <div>
                                <div className="text-sm font-medium text-slate-900">{row.title}</div>
                                <div className="text-xs text-slate-400">{row.subtitle}</div>
                            </div>
                        </div>
                        <span className="text-sm text-slate-600">{row.count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TransactionPaymentMethods;
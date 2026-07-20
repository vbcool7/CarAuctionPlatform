
import { Info } from "lucide-react";

function SummaryTransactionCard({ title, headerRight, rows, highlightRow }) {
    return (
        <div className="w-full bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900">{title}</h3>
                {headerRight}
            </div>
            <div className="space-y-3">
                {rows.map((row) => (
                    <div key={row.label} className={`flex items-center justify-between ${row.highlight ? 'pt-3 mt-1 border-t border-slate-200' : ''}`}>
                        <span className="text-sm text-slate-500 flex items-center gap-1">
                            {row.label}
                            {row.info && <Info size={14} className="text-slate-400" />}
                        </span>
                        <span className={`text-sm font-semibold ${row.color || 'text-slate-900'}`}>
                            {row.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SummaryTransactionCard;
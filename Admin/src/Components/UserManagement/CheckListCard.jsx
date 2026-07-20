
import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

function CheckListCard({ title, items, iconColor = 'green' }) {
  
  const Icon = iconColor === 'green' ? CheckCircle2 : XCircle;
  const colorClass = iconColor === 'green' ? 'text-green-600' : 'text-red-500';

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <h3 className="font-bold text-slate-900 text-lg mb-4">{title}</h3>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <Icon size={18} className={`${colorClass} shrink-0 mt-0.5`} />
              <p className="text-sm text-slate-700">{item.label}</p>
            </div>
            {item.value !== undefined && (
              <span className="text-sm font-semibold text-slate-900 shrink-0">{item.value}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CheckListCard;
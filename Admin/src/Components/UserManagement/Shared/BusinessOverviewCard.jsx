
import React from 'react';
import { Star } from 'lucide-react';

function BusinessOverviewCard({ fields }) {
    return (
        <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-[14px] md:text-base  font-bold text-slate-900 mb-4">Business Overview</h3>
            <div className="space-y-1 md:space-y-3">
                {fields.map((item, i) => (
                    <div 
                    key={i} 
                    className="flex justify-between py-2">
                        <span className="text-[13px] md:text-sm text-slate-500">{item.label}</span>
                        {item.isRating ? (
                            <span className="flex items-center gap-1 text-[13px] md:text-sm font-semibold text-slate-900">
                                <Star className="w-3.5 h-3.5 text-yellow-400" fill="#FACC15" />
                                {item.value} ({item.count})
                            </span>
                        ) : (
                            <span className="text-[13px] md:text-sm font-semibold text-slate-900">{item.value || '--'}</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default BusinessOverviewCard;

import React from 'react';
import { Headphones } from 'lucide-react';

function BuyerContactSupport() {
    return (
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
                <div className="shrink-0 w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                    <Headphones className="text-[#D97706]" size={20} />
                </div>
                <h2 className="text-sm font-bold text-[#0B1E3D]">Need Help?</h2>
            </div>
            <p className="text-xs text-slate-500 mb-4">
                If you have any questions or need assistance, our support team is here to help.
            </p>
            <button className="text-sm font-bold text-[#D97706] flex items-center gap-1 hover:underline">
                Contact Support →
            </button>
        </div>
    )
}

export default BuyerContactSupport;
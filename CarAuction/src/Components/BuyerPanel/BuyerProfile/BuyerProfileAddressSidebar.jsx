
import React from 'react';
import { Lightbulb, Home, CheckCircle } from 'lucide-react';
import BuyerContactSupport from '../BuyerSharedComponents/BuyerContactSupport';

function BuyerProfileAddressSidebar() {
    const quickTips = [
        'Set a default address for faster checkout.',
        'Add multiple addresses for shipping and billing.',
        'Keep your addresses updated to avoid delivery issues.',
        'You can edit or delete any address anytime.'
    ];

    return (
        <div className="space-y-6">
            {/* 1. Quick Tips Section */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                    <Lightbulb className="text-blue-500" size={20} />
                    <h3 className="font-bold text-[#0B1E3D]">Quick Tips</h3>
                </div>
                <div className="space-y-4">
                    {quickTips.map((tip, i) => (
                        <div key={i} className="flex items-start gap-3 text-sm text-slate-700">
                            <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" />
                            <span>{tip}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. Default Address Section */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <Home className="text-green-600" size={20} />
                    <h3 className="font-bold text-[#0B1E3D]">Default Address</h3>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                    This address will be used as your primary address.
                </p>
                <div className="text-sm text-[#0B1E3D] font-medium leading-relaxed">
                    <p>Villa 23, Al Wasl Road</p>
                    <p>Al Safa 2, Dubai</p>
                    <p>United Arab Emirates - 12345</p>
                </div>
                <span className="inline-block mt-4 px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-md">
                    Default
                </span>
            </div>

            {/* 3. Need Help Section */}
            <BuyerContactSupport />
        </div>
    );
}

export default BuyerProfileAddressSidebar;
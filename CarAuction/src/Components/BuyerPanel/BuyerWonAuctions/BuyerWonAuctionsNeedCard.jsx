
import React from 'react';
import { ClipboardList, CreditCard, Truck, FileText, Headphones } from 'lucide-react';
import BuyerContactSupport from '../BuyerSharedComponents/BuyerContactSupport';

const actions = [
    {
        icon: CreditCard,
        title: 'Pending Payments',
        desc: 'You have 2 payments pending.',
        link: 'Pay Now',
        badge: '2',
        color: 'bg-amber-50 text-[#D97706]',
    },
    {
        icon: Truck,
        title: 'Ready for Pickup',
        desc: '1 vehicle is ready for pickup.',
        link: 'View Details',
        badge: '1',
        color: 'bg-emerald-50 text-emerald-600',
    },
    {
        icon: FileText,
        title: 'Download Documents',
        desc: 'Download invoices and sale documents.',
        link: 'View All Documents',
        color: 'bg-blue-50 text-blue-600',
    },
];

function BuyerWonAuctionsNeedCard() {
    return (
        <div className="w-full">

            {/* Action List */}
            <div className='bg-white border border-slate-100 rounded-2xl p-6 shadow-sm'>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-[#0B1E3D]/5 rounded-lg">
                        <ClipboardList className="text-[#0B1E3D]" size={20} />
                    </div>
                    <h2 className="text-lg font-bold text-[#0B1E3D]">Need to Do</h2>
                </div>

                <div className="space-y-6">
                    {actions.map((action, idx) => (
                        <div key={idx} className="flex gap-4">
                            <div className={`p-2.5 rounded-full h-fit ${action.color}`}>
                                <action.icon size={20} />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-sm font-bold text-[#0B1E3D]">{action.title}</h3>
                                    {action.badge && (
                                        <span className="bg-[#D97706]/10 text-[#D97706] text-[10px] font-bold px-2 py-0.5 rounded-full">
                                            {action.badge}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-slate-500 mt-1">{action.desc}</p>
                                <button className="text-xs font-semibold text-[#0B1E3D] hover:text-[#D97706] mt-2 flex items-center gap-1 transition-colors">
                                    {action.link} →
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Help Section */}
            <div className='mt-5'>
                <BuyerContactSupport />
            </div>

        </div>
    );
}

export default BuyerWonAuctionsNeedCard;
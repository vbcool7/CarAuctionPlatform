
import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Check, Eye, File, CreditCard, BarChart3, Settings, ShieldCheck, ArrowRight } from 'lucide-react';

const cards = [
    {
        title: "Start Accepting Payments",
        desc: "Your gateway is live and ready.",
        icon: <CreditCard className="w-5 h-5 text-emerald-600" />,
        bg: "bg-emerald-100/60",
    },
    {
        title: "Monitor Transactions",
        desc: "Track payments in real-time.",
        icon: <BarChart3 className="w-5 h-5 text-indigo-600" />,
        bg: "bg-indigo-100/60",
    },
    {
        title: "Manage Settings",
        desc: "Update gateway settings anytime.",
        icon: <Settings className="w-5 h-5 text-amber-600" />,
        bg: "bg-amber-100/60",
    },
];

function PaymentGatewaySuccessModal({ setCurrentPage }) {

    useEffect(() => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.8 }
        });
    }, []);

    return (
        <>
            <div className="w-full bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm">
                {/* success message */}
                <div className="flex flex-col items-center text-center space-y-2.5">
                    <div className="w-18 h-18 rounded-full bg-green-50 border border-green-100 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-green-600 flex items-center justify-center shadow-xl">
                            <Check className="w-7 h-7 text-white" />
                        </div>
                    </div>

                    <h1 className="text-lg sm:text-xl font-bold text-[#0B1E3D]">
                        <span className='text-blue-600'>Stripe</span> Gateway is Active
                    </h1>

                    <p className="text-xs sm:text-[13px] text-slate-500">
                        You can now start accepting payments securly using this gateway.
                    </p>
                </div>

                {/* btns */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8 pt-5 border-t border-slate-100">

                    <button
                        type="button"
                        onClick={() => setCurrentPage('payment-gateways')}
                        className="w-full sm:w-auto h-10 px-5 flex items-center justify-center gap-2 rounded-lg border border-[#D97706]/50 bg-white text-xs font-semibold text-[#D97706] transition-all duration-200 hover:bg-amber-50 active:scale-[0.98]"
                    >
                        <Eye className="w-4 h-4" />
                        View Gateways
                    </button>

                    <button
                        type="button"
                        onClick={() => setCurrentPage('transactions')}
                        className="w-full sm:w-auto h-10 px-5 flex items-center justify-center gap-2 rounded-lg border border-[#D97706]/50 bg-white text-xs font-semibold text-[#D97706] transition-all duration-200 hover:bg-amber-50 active:scale-[0.98]" >
                        <File className="w-4 h-4" />
                        Go to transactions
                    </button>
                </div>

                {/* stats */}
                <div className="mt-8 pt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {cards.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center gap-5 shadow-sm hover:border-slate-300 transition-all"
                        >
                            {/* Colored Icon Circle */}
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${item.bg}`}>
                                {item.icon}
                            </div>

                            {/* Text Content */}
                            <div>
                                <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                                <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            {/* note */}
            <div className="w-full bg-[#EBF8F2] border border-[#D1EFE3] rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="shrink-0">
                        <ShieldCheck className="w-8 h-8 text-[#10B981]" />
                    </div>

                    <div>
                        <h4 className="text-sm font-bold text-[#065F46]">
                            Your Stripe gateway has been activated successfully.
                        </h4>
                        <p className="text-xs text-[#047857] mt-0.5">
                            You will receive email notifications for any important updates.
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => setCurrentPage('payment-gateways')}
                    className="shrink-0 px-4 py-2 bg-white border border-[#A7F3D0] rounded-lg text-xs font-semibold text-[#047857]  transition-all flex items-center gap-2 shadow-sm"
                >
                    <span>View Gateway Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                </button>
            </div>
        </>
    )
}

export default PaymentGatewaySuccessModal;
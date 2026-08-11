
import { Info } from 'lucide-react';
import React from 'react'

function PaymentGatewayFormStep2() {
    return (
        <div className="w-full bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm">

            {/* Header */}
            <div>
                <h3 className="text-base font-bold text-[#0B1E3D]">
                    Configuration
                </h3>

                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Enter API credentials and endpoints for Stripe.
                </p>
            </div>


            {/* API Credentials */}
            <div className="mt-9 mb-4">
                <h3 className="text-base font-bold text-[#0B1E3D]">
                    API Credentials
                </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">

                {/* Publishable Key */}
                <div>
                    <label className="block text-[11px] sm:text-[14px] font-semibold text-[#0B1E3D] mb-2">
                        Publishable Key <span className="text-red-600">*</span>
                    </label>

                    <input
                        type="text"
                        placeholder="pk_test_51XXXXXXXXXXXXXX"
                        className="w-full h-10 rounded-lg border border-slate-200 px-3 text-[10px] sm:text-[13px] text-slate-700 placeholder:text-slate-400 outline-none transition-all focus:border-[#D97706] focus:ring-2 focus:ring-amber-100"
                    />

                    <p className="text-[9px] sm:text-[12px] text-slate-500 mt-1">
                        Enter your Stripe publishable key
                    </p>
                </div>


                {/* Secret Key */}
                <div>
                    <label className="block text-[11px] sm:text-[14px] font-semibold text-[#0B1E3D] mb-2">
                        Secret Key <span className="text-red-600">*</span>
                    </label>

                    <input
                        type="password"
                        placeholder="sk_test_51XXXXXXXXXXXXXX"
                        className="w-full h-10 rounded-lg border border-slate-200 px-3 text-[10px] sm:text-[13px] text-slate-700 placeholder:text-slate-400 outline-none transition-all focus:border-[#D97706] focus:ring-2 focus:ring-amber-100"
                    />

                    <p className="text-[9px] sm:text-[12px] text-slate-500 mt-1">
                        Enter your Stripe secret key
                    </p>
                </div>


                {/* Webhook Secret */}
                <div>
                    <label className="block text-[11px] sm:text-[14px] font-semibold text-[#0B1E3D] mb-2">
                        Webhook Secret
                    </label>

                    <input
                        type="password"
                        placeholder="whsec_XXXXXXXXXXXXXX"
                        className="w-full h-10 rounded-lg border border-slate-200 px-3 text-[10px] sm:text-[13px] text-slate-700 placeholder:text-slate-400 outline-none transition-all focus:border-[#D97706] focus:ring-2 focus:ring-amber-100"
                    />

                    <p className="text-[9px] sm:text-[12px] text-slate-500 mt-1">
                        Enter your Stripe webhook secret (optional)
                    </p>
                </div>

            </div>


            {/* API Endpoints */}
            <div className="mt-9 mb-4">
                <h3 className="text-base font-bold text-[#0B1E3D]">
                    API Endpoints
                </h3>

                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Use Stripe default endpoints or customize if needed.
                </p>
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">

                {/* API Base URL */}
                <div>
                    <label className="block text-[11px] sm:text-[14px] font-semibold text-[#0B1E3D] mb-2">
                        API Base URL
                    </label>

                    <input
                        type="text"
                        placeholder="https://api.stripe.com"
                        className="w-full h-10 rounded-lg border border-slate-200 px-3 text-[10px] sm:text-[13px] text-slate-700 placeholder:text-slate-400 outline-none transition-all focus:border-[#D97706] focus:ring-2 focus:ring-amber-100"
                    />

                    <p className="text-[9px] sm:text-[12px] text-slate-500 mt-1">
                        Stripe API base URL
                    </p>
                </div>


                {/* Webhook Endpoint URL */}
                <div>
                    <label className="block text-[11px] sm:text-[14px] font-semibold text-[#0B1E3D] mb-2">
                        Webhook Endpoint URL
                    </label>

                    <input
                        type="text"
                        placeholder="https://yourdomain.com/api/webhooks/stripe"
                        className="w-full h-10 rounded-lg border border-slate-200 px-3 text-[10px] sm:text-[13px] text-slate-700 placeholder:text-slate-400 outline-none transition-all focus:border-[#D97706] focus:ring-2 focus:ring-amber-100"
                    />

                    <p className="text-[9px] sm:text-[12px] text-slate-500 mt-1">
                        This is the endpoint where Stripe will send events
                    </p>
                </div>

            </div>

            {/* Test Mode */}
            <div className="mt-6 rounded-xl bg-gray-50/70 p-4">

                <h3 className="text-sm font-bold text-[#0B1E3D]">Test Mode</h3>

                {/* Toggle */}
                <div className="flex items-center gap-3 mt-3">

                    <button
                        type="button"
                        className="relative w-9 h-5 rounded-full bg-[#D97706] transition-colors"
                    >
                        <span className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm" />
                    </button>

                    <div>
                        <p className="text-xs font-semibold text-[#0B1E3D]">
                            Enable Test Mode
                        </p>

                        <p className="text-[11px] text-slate-500 mt-0.5">
                            Use Stripe test environment for safe testing
                        </p>
                    </div>

                </div>


                {/* Info */}
                <div className="flex items-center gap-2 mt-4 text-[#D97706]">
                    <Info className='w-4 h-4' />
                    <p className="text-[11px]">
                        In test mode, you can use Stripe test cards to simulate transactions.
                    </p>

                </div>

            </div>

        </div>
    )
}

export default PaymentGatewayFormStep2;
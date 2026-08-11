
import React, { useState } from 'react';
import { Pencil, CreditCard, Settings, Globe, Check } from "lucide-react";

function PaymentGatewayFormStep4({ setStep }) {

    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="w-full bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm">

            {/* Header */}
            <div>
                <h3 className="text-base font-bold text-[#0B1E3D]">Review & Confirm</h3>

                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Please review all details before activating the payment gateway.
                </p>
            </div>

            {/* basic info */}
            <div className="my-6">
                <div className="flex items-center justify-between gap-4 mb-5">

                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-[#D97706]" />
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-[#0B1E3D]"> Basic Information </h3>
                    </div>

                    {/* Edit Button */}
                    <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-[#0B1E3D] hover:bg-slate-50 transition-colors"
                    >
                        <Pencil className="w-4 h-4" />
                        Edit
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">

                    {/* Gateway Name */}
                    <div>
                        <p className="text-xs font-semibold text-slate-500 mb-1">Gateway Name</p>
                        <p className="text-sm font-semibold text-[#0B1E3D]">Stripe</p>
                    </div>

                    {/* Provider */}
                    <div>
                        <p className="text-xs font-semibold text-slate-500 mb-1"> Provider </p>
                        <p className="text-sm font-semibold text-[#0B1E3D]">Stripe, Inc. </p>
                    </div>

                    {/* Description */}
                    <div className="sm:col-span-2">
                        <p className="text-xs font-semibold text-slate-500 mb-1"> Description</p>
                        <p className="text-sm font-medium text-slate-700">Stripe payment gateway for secure transactions. </p>
                    </div>

                    {/* Environment */}
                    <div>
                        <p className="text-xs font-semibold text-slate-500 mb-1">Environment</p>
                        <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">Live</span>
                    </div>

                    {/* Status */}
                    <div>
                        <p className="text-xs font-semibold text-slate-500 mb-1">Status</p>
                        <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100"> Active </span>
                    </div>

                </div>

            </div>

            <hr className="border-t border-slate-200 my-4" />

            {/* configuration */}
            <div className="my-6">
                <div className="flex items-center justify-between gap-4 mb-5">

                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
                            <Settings className="w-5 h-5 text-[#D97706]" />
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-[#0B1E3D]">Configuration</h3>
                    </div>

                    {/* Edit Button */}
                    <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-[#0B1E3D] hover:bg-slate-50 transition-colors"
                    >
                        <Pencil className="w-4 h-4" />
                        Edit
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">

                    {/* publish key */}
                    <div>
                        <p className="text-xs font-semibold text-slate-500 mb-1">Publishable Key</p>
                        <p className="text-sm font-semibold text-[#0B1E3D]">pk_test_52XXXXXXXXXX</p>
                    </div>

                    {/* secret key */}
                    <div>
                        <p className="text-xs font-semibold text-slate-500 mb-1">Secret Key</p>
                        <p className="text-sm font-semibold text-[#0B1E3D]">sk_test_52XXXXXXXXXX</p>
                    </div>

                    {/* webhook key */}
                    <div>
                        <p className="text-xs font-semibold text-slate-500 mb-1">Webhook Secret</p>
                        <p className="text-sm font-semibold text-[#0B1E3D]">whsec_test_52XXXXXXXXXX</p>
                    </div>

                    {/* api base url */}
                    <div>
                        <p className="text-xs font-semibold text-slate-500 mb-1">API Base URL</p>
                        <p className="text-sm font-semibold text-[#0B1E3D]">https://api.stripe.com</p>
                    </div>

                    {/* webhook url */}
                    <div>
                        <p className="text-xs font-semibold text-slate-500 mb-1">Webhook Endpoint URL</p>
                        <p className="text-sm font-semibold text-[#0B1E3D]">https://api.stripe.com</p>
                    </div>

                    {/* test mode */}
                    <div>
                        <p className="text-xs font-semibold text-slate-500 mb-1">Test Mode</p>
                        <p className="text-sm font-semibold text-[#0B1E3D]">Disabled</p>
                    </div>
                </div>
            </div>

            <hr className="border-t border-slate-200 my-4" />

            {/* support currencies */}
            <div className="my-6">
                <div className="flex items-center justify-between gap-4 mb-5">

                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
                            <Globe className="w-5 h-5 text-[#D97706]" />
                        </div>

                        <h3 className="text-sm sm:text-base font-bold text-[#0B1E3D]">
                            Supported Currency
                        </h3>
                    </div>
                </div>

                {/* Currency Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">

                    <div
                        className="flex items-center justify-between gap-3 p-3.5 rounded-lg border border-slate-200 bg-white" >

                        {/* Currency Info */}
                        <div className="flex items-center gap-3">

                            {/* Name */}
                            <div>
                                <p className="text-sm font-bold text-[#0B1E3D]">
                                    AED
                                </p>

                                <p className="text-xs text-slate-500 mt-0.5">
                                    UAE Dirham
                                </p>
                            </div>
                        </div>

                        <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 text-white stroke-3" />
                        </div>

                    </div>
                </div>

            </div>

        </div>
    )
}

export default PaymentGatewayFormStep4;
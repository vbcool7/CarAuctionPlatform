
import React, { useState } from 'react';
import { FaStripe, FaPaypal, FaMoneyBillWave, FaCreditCard } from "react-icons/fa";
import { SiRazorpay, SiSquare, } from "react-icons/si";
import CustomDropdown from '../../SharedComponents/CustomDropDown';

const initialProviders = [
    {
        name: "Stripe",
        icon: FaStripe,
        iconColor: "text-indigo-600",
    },
    {
        name: "PayPal",
        icon: FaPaypal,
        iconColor: "text-blue-600",
    },
    {
        name: "Razorpay",
        icon: SiRazorpay,
        iconColor: "text-blue-600",
    },
    {
        name: "Paystack",
        icon: FaMoneyBillWave,
        iconColor: "text-sky-500",
    },
    {
        name: "Square",
        icon: SiSquare,
        iconColor: "text-slate-900",
    },
    {
        name: "Flutterwave",
        icon: FaMoneyBillWave,
        iconColor: "text-orange-500",
    },
];

const additionalProviders = [
    {
        name: "Instamojo",
        icon: FaMoneyBillWave,
        iconColor: "text-indigo-600",
    },
    {
        name: "Authorize.Net",
        icon: FaCreditCard,
        iconColor: "text-blue-600",
    },
    {
        name: "2Checkout",
        icon: FaCreditCard,
        iconColor: "text-orange-500",
    },
];

function PaymentGatewayFormStep1({ setCurrentPage }) {

    const [selectedProvider, setSelectedProvider] = useState("Stripe");
    const [showMoreProviders, setShowMoreProviders] = useState(false);

    return (
        <div className="w-full bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm">

            {/* Header */}
            <div>
                <h3 className="text-base font-bold text-[#0B1E3D]">
                    Basic Information
                </h3>

                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Provide basic details about the payment gateway.
                </p>
            </div>

            {/* Gateway Name */}
            <div className="mt-6">
                <label className="block text-[11px] sm:text-[14px] font-semibold text-[#0B1E3D] mb-2">
                    Gateway Name <span className="text-red-600">*</span>
                </label>

                <input
                    type="text"
                    placeholder="Enter gateway name"
                    className="w-full h-10 rounded-lg border border-slate-200 px-3 text-[10px] sm:text-[13px] text-slate-700 placeholder:text-slate-400 outline-none transition-all focus:border-[#D97706] focus:ring-2 focus:ring-amber-100"
                />
            </div>

            {/* Provider */}
            <div className="mt-6">

                <label className="block text-[11px] sm:text-[14px] font-semibold text-[#0B1E3D]">
                    Provider <span className="text-red-600">*</span>
                </label>

                <p className="text-[9px] sm:text-[12px] text-slate-500 mb-3">
                    Select the payment service provider
                </p>


                {/* Provider Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">

                    {/* Initial Providers */}
                    {initialProviders.map((provider) => {
                        const Icon = provider.icon;
                        const isSelected = selectedProvider === provider.name;

                        return (
                            <button
                                key={provider.name}
                                type="button"
                                onClick={() => setSelectedProvider(provider.name)}
                                className={`relative h-14 sm:h-14 md:h-16 rounded-lg border flex items-center justify-center gap-2 transition-all duration-200
                    ${isSelected
                                        ? "border-[#D97706] bg-indigo-50/40 ring-1 ring-amber-500"
                                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                                    }`}
                            >
                                {/* Radio */}
                                <span
                                    className={`absolute top-2 left-2 w-3.5 h-3.5 rounded-full border flex items-center justify-center
                        ${isSelected
                                            ? "border-[#D97706]"
                                            : "border-slate-200"
                                        }`}
                                >
                                    {isSelected && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                                    )}
                                </span>

                                {/* Icon */}
                                <Icon
                                    className={`${provider.iconColor} text-xl sm:text-2xl`}
                                />

                                {/* Provider Name */}
                                <span className="text-[11px] sm:text-xs md:text-sm font-semibold text-[#0B1E3D]">
                                    {provider.name}
                                </span>
                            </button>
                        );
                    })}


                    {/* Other Button */}
                    {!showMoreProviders && (
                        <button
                            type="button"
                            onClick={() => setShowMoreProviders(!showMoreProviders)}
                            className={`relative h-14 sm:h-14 md:h-16 rounded-lg border flex items-center justify-center gap-2 transition-all duration-200
                                ${showMoreProviders
                                    ? "border-[#D97706] bg-indigo-50/40 ring-1 ring-amber-500"
                                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                                }`}
                        >
                            {/* Radio / More Icon */}
                            <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-sm">
                                ...
                            </span>

                            {/* Other Text */}
                            <span className="text-[11px] sm:text-xs md:text-sm font-semibold text-[#0B1E3D]">
                                Other
                            </span>
                        </button>
                    )}


                    {/* Additional Providers */}
                    {showMoreProviders &&
                        additionalProviders.map((provider) => {
                            const Icon = provider.icon;
                            const isSelected = selectedProvider === provider.name;

                            return (
                                <button
                                    key={provider.name}
                                    type="button"
                                    onClick={() => setSelectedProvider(provider.name)}
                                    className={`relative h-14 sm:h-14 md:h-16 rounded-lg border flex items-center justify-center gap-2 transition-all duration-200
                        ${isSelected
                                            ? "border-[#D97706] bg-indigo-50/40 ring-1 ring-amber-500"
                                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                                        }`}
                                >
                                    {/* Radio */}
                                    <span
                                        className={`absolute top-2 left-2 w-3.5 h-3.5 rounded-full border flex items-center justify-center
                            ${isSelected
                                                ? "border-[#D97706]"
                                                : "border-slate-200"
                                            }`}
                                    >
                                        {isSelected && (
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                                        )}
                                    </span>

                                    {/* Icon */}
                                    <Icon
                                        className={`${provider.iconColor} text-xl sm:text-2xl`}
                                    />

                                    {/* Provider Name */}
                                    <span className="text-[11px] sm:text-xs md:text-sm font-semibold text-[#0B1E3D]">
                                        {provider.name}
                                    </span>
                                </button>
                            );
                        })}
                </div>
            </div>

            {/* Description */}
            <div className="mt-6">
                <label className="block text-[11px] sm:text-[14px] font-semibold text-[#0B1E3D] mb-2">
                    Description
                </label>

                <textarea
                    rows="3"
                    maxLength={200}
                    placeholder="Enter gateway description (optional)"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-[10px] sm:text-[13px] text-slate-700 placeholder:text-slate-400 outline-none resize-none transition-all focus:border-[#D97706] focus:ring-2 focus:ring-amber-100"
                />
                <div className="flex justify-end mt-1">
                    <span className="text-[9px] sm:text-[11px] text-slate-400">0 / 200</span>
                </div>

            </div>

            {/* Environment & Status */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">

                {/* Environment */}
                <div className="flex flex-col">

                    <label className="block text-[11px] sm:text-[14px] font-semibold text-[#0B1E3D] mb-2">
                        Environment <span className="text-red-600">*</span>
                    </label>

                    <CustomDropdown
                        options={[
                            "Test",
                            "Live",
                        ]}
                        placeholder="Select environment"
                    />

                    <p className="text-[9px] sm:text-[12px] text-slate-500 mt-1">
                        Choose the environment for this gateway
                    </p>

                </div>


                {/* Status */}
                <div className="flex flex-col">

                    <label className="block text-[11px] sm:text-[14px] font-semibold text-[#0B1E3D] mb-2">
                        Status <span className="text-red-600">*</span>
                    </label>

                    <CustomDropdown
                        options={[
                            "Active",
                            "Inactive",
                        ]}
                        placeholder="Select status"
                    />

                    <p className="text-[9px] sm:text-[12px] text-slate-500 mt-1">
                        You can change status later
                    </p>

                </div>

            </div>

        </div>
    )
}

export default PaymentGatewayFormStep1;

import React, { useState } from 'react';
import { CreditCard, Package, Truck, RefreshCw, CircleDollarSign, UserRound, MessageSquare, AlertTriangle, FileText, ShieldAlert, Tag } from "lucide-react";
import FilterDropdown from '../../SharedComponents/FilterDropdown';

const iconsProviders = [
    {
        name: "Payment Not Received",
        icon: CreditCard,
        iconColor: "text-rose-500",
        iconBg: "bg-rose-50",
    },
    {
        name: "Item Not as Described",
        icon: Package,
        iconColor: "text-amber-500",
        iconBg: "bg-amber-50",
    },
    {
        name: "Damaged Item",
        icon: Truck,
        iconColor: "text-blue-500",
        iconBg: "bg-blue-50",
    },
    {
        name: "Wrong Item Delivered",
        icon: RefreshCw,
        iconColor: "text-violet-600",
        iconBg: "bg-violet-50",
    },
    {
        name: "Payment Fraud",
        icon: CircleDollarSign,
        iconColor: "text-amber-500",
        iconBg: "bg-amber-50",
    },
    {
        name: "Service Not Provided",
        icon: UserRound,
        iconColor: "text-emerald-500",
        iconBg: "bg-emerald-50",
    },
    {
        name: "Return & Refund Issues",
        icon: RefreshCw,
        iconColor: "text-red-400",
        iconBg: "bg-red-50",
    },
    {
        name: "Communication Issues",
        icon: MessageSquare,
        iconColor: "text-sky-500",
        iconBg: "bg-sky-50",
    },
    {
        name: "General Issue",
        icon: AlertTriangle,
        iconColor: "text-orange-500",
        iconBg: "bg-orange-50",
    },
    {
        name: "Documentation Issue",
        icon: FileText,
        iconColor: "text-indigo-500",
        iconBg: "bg-indigo-50",
    },
    {
        name: "Security Issue",
        icon: ShieldAlert,
        iconColor: "text-red-500",
        iconBg: "bg-red-50",
    },
    {
        name: "Listing Issue",
        icon: Tag,
        iconColor: "text-cyan-500",
        iconBg: "bg-cyan-50",
    },
];

function AddNewCategoryStep1({ setStep }) {

    const [selectedIcon, setSelectedIcon] = useState();
    const [selectedPriority, setSelectedPriority] = useState();
    const [isActive, setIsActive] = useState(false);

    return (
        <div className="w-full bg-white border border-slate-100 rounded-2xl p-4 sm:p-5 shadow-sm">

            {/* Header */}
            <div>
                <h3 className="text-base font-bold text-[#0B1E3D]">
                    Category Details
                </h3>

                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Enter the basic information for the dispute category.
                </p>
            </div>

            {/* cat Name */}
            <div className="mt-6">
                <label className="block text-[11px] sm:text-[14px] font-semibold text-[#0B1E3D] mb-2">
                    Category Name <span className="text-red-600">*</span>
                </label>

                <input
                    type="text"
                    placeholder="Enter category name"
                    className="w-full h-10 rounded-lg border border-slate-200 px-3 text-[10px] sm:text-[13px] text-slate-700 placeholder:text-slate-400 outline-none transition-all focus:border-[#D97706] focus:ring-2 focus:ring-amber-100"
                />
            </div>

            {/* Description */}
            <div className="mt-6">
                <label className="block text-[11px] sm:text-[14px] font-semibold text-[#0B1E3D] mb-2">
                    Description <span className="text-red-600">*</span>
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

            {/* Icon Selector */}
            <div className='mt-6'>
                <label className="block text-[11px] sm:text-[14px] font-semibold text-[#0B1E3D] mb-2">
                    Icon <span className="text-red-600">*</span>
                </label>

                <div className="flex flex-wrap gap-3">
                    {iconsProviders.map((item) => {
                        const Icon = item.icon;
                        const isSelected = selectedIcon === item.name;

                        return (
                            <button
                                key={item.name}
                                type="button"
                                onClick={() => setSelectedIcon(item.name)}
                                className={`w-14 h-12 rounded-lg border flex items-center justify-center transition-all
                                        ${isSelected
                                        ? "border-[#D97706] bg-amber-50 ring-[#D97706]"
                                        : "border-slate-200 bg-white hover:border-slate-300"
                                    }`}
                            >
                                <span
                                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${item.iconBg}`}
                                >
                                    <Icon className={`w-5 h-5 ${item.iconColor}`} />
                                </span>
                            </button>
                        );
                    })}
                </div>

                <p className="mt-1.5 text-[10px] text-slate-400">
                    Choose an icon that best represents this dispute category.
                </p>
            </div>

            {/* Priority Level / Status */}
            <div className='flex justify-between'>
                <div className="mt-6">
                    <label className="block text-[11px] sm:text-[14px] font-semibold text-[#0B1E3D] mb-2">
                        Priority Level <span className="text-red-600">*</span>
                    </label>

                    <FilterDropdown
                        label="Select Priority"
                        options={[
                            { label: "Low", value: "low" },
                            { label: "Medium", value: "medium" },
                            { label: "High", value: "high" },
                        ]}
                        value={selectedPriority}
                        onChange={setSelectedPriority}
                    />
                </div>

                <div className="mt-6">
                    <label className="block text-[11px] sm:text-[14px] font-semibold text-[#0B1E3D] mb-2">
                        Status <span className="text-red-600">*</span>
                    </label>

                    <button
                        type="button"
                        onClick={() => setIsActive(!isActive)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isActive ? "bg-[#D97706]" : "bg-slate-300"
                            }`}
                    >
                        <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${isActive ? "translate-x-5" : "translate-x-0.5"
                                }`}
                        />
                    </button>

                    <span className="ml-3 text-sm font-medium text-slate-700">
                        {isActive ? "Active" : "Inactive"}
                    </span>

                    <p className="max-w-50 mt-1.5 text-[10px] text-slate-400">
                        Inactive categories will not be available for new disputes.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default AddNewCategoryStep1;
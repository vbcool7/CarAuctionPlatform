
import { Circle, CircleDot, DollarSign, LayoutGrid, ShieldAlert } from 'lucide-react';
import React, { useState } from 'react';
import FilterDropdown from '../../SharedComponents/FilterDropdown';

const categoryTypes = [
    {
        id: "standard",
        title: "Standard",
        description: "General disputes that follow normal workflow.",
        icon: LayoutGrid
    },
    {
        id: "financial",
        title: "Financial",
        description: "Disputes related to payments, refunds or transactions.",
        icon: DollarSign,
    },
    {
        id: "policy",
        title: "Policy",
        description: "Disputes related to platform policies or violations.",
        icon: ShieldAlert,
    },
];

function AddNewCategoryStep2({ setStep }) {

    const [selectedType, setSelectedType] = useState('standard');
    const [isSubCatAllow, setIsSubCatAllow] = useState();
    const [isDisputeEnable, setIsDisputeEnable] = useState();
    const [isPriorityEnable, setIsPriorityEnable] = useState();

    const [selectedPriority, setSelectedPriority] = useState();
    const [selectedStatus, setSelectedStatus] = useState();

    return (
        <div className="w-full bg-white border border-slate-100 rounded-2xl p-4 sm:p-5 shadow-sm">

            {/* Header */}
            <div>
                <h3 className="text-base font-bold text-[#0B1E3D]">
                    Settings
                </h3>

                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Configure how this category behaves and who can manage it.
                </p>
            </div>

            {/* cat ttpe selector */}
            <div className="mt-6">
                <label className="block text-[11px] sm:text-[14px] font-semibold text-[#0B1E3D] mb-2">
                    Category Type <span className="text-red-600">*</span>
                </label>

                <div className="grid grid-cols-2 gap-5">
                    {categoryTypes.map((item) => {
                        const isSelected = selectedType === item.id;
                        const Icon = item.icon;

                        return (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => setSelectedType(item.id)}
                                className={`text-left cursor-pointer rounded-xl p-4 border transition-all flex flex-col justify-between
                                    ${isSelected
                                        ? "border-[#D97706] bg-amber-50/20 shadow-sm ring-1 ring-[#D97706]"
                                        : "border-slate-200 bg-white hover:border-slate-300"
                                    }`}>

                                <div className="flex items-center gap-2 mb-2">
                                    {isSelected ? (
                                        <CircleDot className="w-5 h-5 text-[#D97706] shrink-0" />
                                    ) : (
                                        <Circle className="w-5 h-5 text-slate-300 shrink-0" />
                                    )}

                                    {Icon && (
                                        <Icon className="w-4 h-4 text-slate-600 shrink-0" />
                                    )}

                                    <span
                                        className={`font-semibold text-sm 
                                            ${isSelected
                                                ? "text-[#0B1E3D]"
                                                : "text-slate-800"
                                            }`}
                                    >
                                        {item.title}
                                    </span>
                                </div>

                                <p className="text-xs text-slate-500 leading-relaxed pl-7">
                                    {item.description}
                                </p>
                            </button>
                        );
                    })}
                </div>
            </div>
            
            {/* toggle */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Allow Sub-Categories */}
                <div>
                    <label className="block text-[11px] sm:text-[14px] font-semibold text-[#0B1E3D]">
                        Allow Sub-Categories
                    </label>

                    <p className="mt-1 text-xs text-slate-400">
                        Allow creating sub-categories under this category.
                    </p>

                    <div className="mt-3 flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setIsSubCatAllow(!isSubCatAllow)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isSubCatAllow ? "bg-[#D97706]" : "bg-slate-300"
                                }`}
                        >
                            <span
                                className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${isSubCatAllow ? "translate-x-5" : "translate-x-0.5"
                                    }`}
                            />
                        </button>

                        <span className="text-sm font-medium text-slate-700">
                            {isSubCatAllow ? "Yes" : "No"}
                        </span>
                    </div>
                </div>


                {/* Enable for Disputes */}
                <div>
                    <label className="block text-[11px] sm:text-[14px] font-semibold text-[#0B1E3D]">
                        Enable for Disputes
                    </label>

                    <p className="mt-1 text-xs text-slate-400">
                        Enable this category for creating new disputes.
                    </p>

                    <div className="mt-3 flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setIsDisputeEnable(!isDisputeEnable)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isDisputeEnable ? "bg-[#D97706]" : "bg-slate-300"
                                }`}
                        >
                            <span
                                className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${isDisputeEnable ? "translate-x-5" : "translate-x-0.5"
                                    }`}
                            />
                        </button>

                        <span className="text-sm font-medium text-slate-700">
                            {isDisputeEnable ? "Yes" : "No"}
                        </span>
                    </div>
                </div>


                {/* Allow Priority Override */}
                <div>
                    <label className="block text-[11px] sm:text-[14px] font-semibold text-[#0B1E3D]">
                        Allow Priority Override
                    </label>

                    <p className="mt-1 text-xs text-slate-400">
                        Allow agents to change priority while creating a dispute.
                    </p>

                    <div className="mt-3 flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setIsPriorityEnable(!isPriorityEnable)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isPriorityEnable ? "bg-[#D97706]" : "bg-slate-300"
                                }`}
                        >
                            <span
                                className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${isPriorityEnable ? "translate-x-5" : "translate-x-0.5"
                                    }`}
                            />
                        </button>

                        <span className="text-sm font-medium text-slate-700">
                            {isPriorityEnable ? "Yes" : "No"}
                        </span>
                    </div>
                </div>

            </div>

            {/* assign default priority / status */}
            <div className='mt-6 flex justify-between'>
                <div className="">
                    <label className="block text-[11px] sm:text-[14px] font-semibold text-[#0B1E3D] mb-2">
                        Assign Default Priority <span className="text-red-600">*</span>
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

                <div className="">
                    <label className="block text-[11px] sm:text-[14px] font-semibold text-[#0B1E3D] mb-2">
                        Default Status <span className="text-red-600">*</span>
                    </label>

                    <FilterDropdown
                        label="Select Status"
                        options={[
                            { label: "Open", value: "open" },
                            { label: "Under Review", value: "under-review" },
                            { label: "Resolved", value: "resolved" },
                            { label: "Closed", value: "closed" },
                        ]}
                        value={selectedStatus}
                        onChange={setSelectedStatus}
                    />
                </div>
            </div>

            {/* Visible To */}
            <div className="mt-6">
                <label className="block text-[11px] sm:text-[14px] font-semibold text-[#0B1E3D]">
                    Visible To <span className="text-red-600">*</span>
                </label>

                <p className="mt-1 text-xs text-slate-400">
                    Select who can view and use this category.
                </p>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                    {[
                        { id: "buyers", label: "Buyers" },
                        { id: "sellers", label: "Sellers" },
                        { id: "administrators", label: "Administrators" },
                        { id: "support-agents", label: "Support Agents" },
                    ].map((item) => (
                        <label
                            key={item.id}
                            className="flex items-center gap-2.5 cursor-pointer group"
                        >
                            <input
                                type="checkbox"
                                value={item.id}
                                className="accent-[#D97706]"
                            />

                            <span className="text-sm font-medium text-[#0B1E3D]">
                                {item.label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Description */}
            <div className="mt-6">
                <label className="block text-[11px] sm:text-[14px] font-semibold text-[#0B1E3D] mb-1">
                    Category Rule
                </label>
                <p className='mb-2 text-sm text-gray-400'>Add rules or notes that agents should follow for this category.</p>

                <textarea
                    rows="3"
                    maxLength={200}
                    placeholder="Enter rules, guidlines or important notes"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-[10px] sm:text-[13px] text-slate-700 placeholder:text-slate-400 outline-none resize-none transition-all focus:border-[#D97706] focus:ring-2 focus:ring-amber-100"
                />
                <div className="flex justify-end mt-1">
                    <span className="text-[9px] sm:text-[11px] text-slate-400">0 / 200</span>
                </div>

            </div>
        </div>
    )
}

export default AddNewCategoryStep2
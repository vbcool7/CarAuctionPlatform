
import React, { useState } from 'react';
import { CalendarClock, Clock, Info } from 'lucide-react';

function AddNewCategoryStep3({ setStep }) {

    const [isAuctoCloseEnable, setIsAuctoCloseEnable] = useState();

    return (
        <div className="w-full bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">

            {/* Header */}
            <div>
                <h3 className="text-base font-bold text-[#0B1E3D]">
                    Auto Close & SLA
                </h3>

                <p className="mt-1 text-xs sm:text-sm text-slate-500">
                    Define when disputes should auto close and set SLA time limits for responses.
                </p>
            </div>

            {/* Auto Close Heading */}
            <div className="mt-7 flex items-start gap-3">
                <div className="w-9 h-9 shrink-0 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-[#D97706]" />
                </div>

                <div>
                    <h3 className="text-base font-bold text-[#0B1E3D]">
                        Auto Close Settings
                    </h3>

                    <p className="mt-1 text-xs sm:text-[13px] text-slate-500 leading-5">
                        Configure when a dispute should be automatically closed.
                    </p>
                </div>
            </div>


            {/* Auto Close Toggle + Duration */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10">

                {/* Enable Auto Close */}
                <div>
                    <label className="block text-xs sm:text-sm font-semibold text-[#0B1E3D]">
                        Enable Auto Close
                    </label>

                    <p className="mt-1 text-[11px] text-slate-400">
                        Automatically close disputes after the selected duration.
                    </p>

                    <div className="mt-3 flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setIsAuctoCloseEnable(!isAuctoCloseEnable)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isAuctoCloseEnable
                                    ? "bg-[#D97706]"
                                    : "bg-slate-300"
                                }`}
                        >
                            <span
                                className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${isAuctoCloseEnable
                                        ? "translate-x-5"
                                        : "translate-x-0.5"
                                    }`}
                            />
                        </button>

                        <span className="text-sm font-medium text-slate-600">
                            {isAuctoCloseEnable ? "Yes" : "No"}
                        </span>
                    </div>
                </div>


                {/* Auto Close After */}
                <div>
                    <label className="block text-xs sm:text-sm font-semibold text-[#0B1E3D]">
                        Auto Close After <span className="text-red-500">*</span>
                    </label>

                    <p className="mt-1 text-[11px] text-slate-400">
                        Set the duration before the dispute closes automatically.
                    </p>

                    <div className="mt-3 flex items-center gap-2">
                        <input
                            type="number"
                            min="1"
                            className="w-24 h-10 border border-slate-200 rounded-lg px-3 text-sm text-[#0B1E3D] outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706]"
                            placeholder="7"
                        />

                        <select
                            className="h-10 border border-slate-200 rounded-lg px-3 text-sm bg-white text-[#0B1E3D] outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706]"
                        >
                            <option>Days</option>
                            <option>Hours</option>
                        </select>
                    </div>
                </div>
            </div>


            {/* Auto Close Note */}
            <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-violet-200 bg-violet-50 px-3 py-2.5">
                <Info className="w-4 h-4 mt-0.5 shrink-0 text-violet-600" />

                <p className="text-[11px] leading-4 text-violet-700">
                    Dispute will automatically closed if no activity occurs for the selected duration.
                </p>
            </div>


            {/* SLA Time Heading */}
            <div className="mt-8 flex items-start gap-3">
                <div className="w-9 h-9 shrink-0 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center">
                    <CalendarClock className="w-5 h-5 text-[#D97706]" />
                </div>

                <div>
                    <h3 className="text-base font-bold text-[#0B1E3D]">
                        SLA Time Limits
                    </h3>

                    <p className="mt-1 text-xs sm:text-[13px] text-slate-500 leading-5">
                        Set the time limits for each stage of the disputes.
                    </p>
                </div>
            </div>


            {/* SLA Rows */}
            <div className="mt-6 space-y-6">
                {[
                    {
                        label: "Initial Response Time",
                        sub: "Time to respond after dispute is created",
                    },
                    {
                        label: "Resolution Time",
                        sub: "Time to resolve the dispute",
                    },
                    {
                        label: "Final Response Time",
                        sub: "Time to respond to user after resolution",
                    },
                ].map((slaItem) => (
                    <div
                        key={slaItem.label}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8"
                    >

                        {/* SLA Time */}
                        <div>
                            <label className="block text-xs sm:text-sm font-semibold text-[#0B1E3D]">
                                {slaItem.label}{" "}
                                <span className="text-red-500">*</span>
                            </label>

                            <p className="mt-1 text-[11px] leading-4 text-slate-400 max-w-60">
                                {slaItem.sub}
                            </p>

                            <div className="mt-3 flex items-center gap-2">
                                <input
                                    type="number"
                                    min="1"
                                    placeholder="0"
                                    className="w-20 h-10 border border-slate-200 rounded-lg px-3 text-sm text-[#0B1E3D] outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706]"
                                />

                                <select
                                    className="h-10 border border-slate-200 rounded-lg px-3 text-sm bg-white text-[#0B1E3D] outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706]"
                                >
                                    <option value="hours">Hours</option>
                                    <option value="days">Days</option>
                                </select>
                            </div>
                        </div>


                        {/* SLA Breach Action */}
                        <div>
                            <label className="block text-xs sm:text-sm font-semibold text-[#0B1E3D]">
                                SLA Breach Action
                            </label>

                            <p className="mt-1 text-[11px] text-slate-400">
                                Choose action on SLA breach.
                            </p>

                            <select
                                className="mt-3 w-full h-10 border border-slate-200 rounded-lg px-3 text-sm bg-white text-[#0B1E3D] outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706]"
                            >
                                <option value="send-reminder">
                                    Send Reminder
                                </option>
                                <option value="escalate-admin">
                                    Escalate to Admin
                                </option>
                                <option value="auto-close">
                                    Auto Close
                                </option>
                            </select>
                        </div>

                    </div>
                ))}
            </div>

        </div>
    )
}

export default AddNewCategoryStep3
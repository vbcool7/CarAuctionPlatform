
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { ChevronDown, CircleDollarSign, CalendarDays, Clock, } from "lucide-react";

function PayoutFormStep1({draft, updateDraft}) {

    const [payoutDate, setPayoutDate] = useState(new Date);

    const payoutTypes = [
        { id: "winning", title: "Winning Payout", description: "Payout for winning amount" },
        { id: "refund", title: "Refund Payout", description: "Refund to user" },
        { id: "seller", title: "Seller Payout", description: "Payout for sold vehicles" },
        { id: "commission", title: "Commission Payout", description: "Admin or staff commission" },
        { id: "manual", title: "Manual Payout", description: "Manual or custom payout" },
        { id: "bonus", title: "Bonus Payout", description: "Bonus or reward payout" },
    ];

    return (
        <div className="w-full bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm">

            {/* Header */}
            <h3 className="text-base font-bold text-[#0B1E3D] mb-5">
                Payout Details
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">

                {/* LEFT SECTION */}
                <div className="min-w-0">

                    {/* Payout Type */}
                    <div>
                        <label className="block text-[11px] sm:text-[14px] font-semibold text-[#0B1E3D] mb-3">
                            Payout Type <span className="text-red-500">*</span>
                        </label>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
                            {payoutTypes.map((type, index) => (
                                <label
                                    key={type.id}
                                    className="flex items-start gap-2 cursor-pointer group"
                                >
                                    <input
                                        type="radio"
                                        name="payoutType"
                                        defaultChecked={index === 0}
                                        className="mt-0.5 w-3.5 h-3.5 accent-[#D97706] shrink-0"
                                    />

                                    <div className="min-w-0">
                                        <p className="text-[11px] sm:text-[12px] font-semibold text-[#0B1E3D] group-hover:text-[#D97706] transition-colors">
                                            {type.title}
                                        </p>

                                        <p className="text-[9px] sm:text-[11px] text-slate-500 mt-0.5 leading-4">
                                            {type.description}
                                        </p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Related To */}
                    <div className="mt-7">
                        <label className="block text-[11px] sm:text-[14px] font-semibold text-[#0B1E3D] mb-2">
                            Related To <span className="text-red-500">*</span>
                        </label>

                        <div className="relative">
                            <select
                                className="w-full h-9.5 appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-9 text-[10px] sm:text-[13px] text-[#0B1E3D] outline-none transition-all focus:border-[#D97706] focus:ring-2 focus:ring-amber-100"
                                defaultValue=""
                            >
                                <option value="" disabled>
                                    Select Auction / Invoice / Transaction
                                </option>
                                <option value="auction">Auction</option>
                                <option value="invoice">Invoice</option>
                                <option value="transaction">Transaction</option>
                            </select>

                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#0B1E3D] pointer-events-none" />
                        </div>
                    </div>

                    {/* Reference ID */}
                    <div className="mt-5">
                        <label className="block text-[11px] sm:text-[14px] font-semibold text-[#0B1E3D] mb-2">
                            Reference ID
                        </label>

                        <input
                            type="text"
                            placeholder="Enter reference ID (optional)"
                            className="w-full h-9.5 rounded-lg border border-slate-200 px-3 text-[10px] sm:text-[13px] text-slate-700 placeholder:text-slate-400 outline-none transition-all focus:border-[#D97706] focus:ring-2 focus:ring-amber-100"
                        />

                        <p className="text-[9px] sm:text-[12px] text-slate-500 mt-1.5">
                            This will help to track this payout
                        </p>
                    </div>

                </div>

                {/* RIGHT SECTION */}
                <div className="min-w-0">

                    {/* Payout Amount */}
                    <div>
                        <div>
                            <label className="block text-[11px] sm:text-[14px] font-semibold text-[#0B1E3D] mb-2">
                                Payout Amount <span className="text-red-500">*</span>
                            </label>

                            <div className="flex h-9.5 rounded-lg border border-slate-200 overflow-hidden focus-within:border-[#D97706] focus-within:ring-2 focus-within:ring-amber-100">
                                <select className="w-14 sm:w-16 px-2 text-[10px] sm:text-[13px] font-medium text-[#0B1E3D] bg-white border-r border-slate-200 outline-none">
                                    <option>USD</option>
                                    <option>INR</option>
                                </select>

                                <input
                                    type="number"
                                    placeholder="0.00"
                                    className="flex-1 min-w-0 px-3 text-[10px] sm:text-[13px] text-slate-700 outline-none"
                                />
                            </div>
                            <p className="text-[9px] sm:text-[12px] text-slate-500 mt-1.5"> Minimum payout amount: $10.00 </p>
                        </div>

                        <div className="mt-5 rounded-lg border border-slate-200 p-3 sm:p-4">
                            <h4 className="text-[11px] sm:text-[14px] font-bold text-[#0B1E3D] mb-4">
                                Fees & Charges <span className="text-red-500">*</span>
                            </h4>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between gap-3">
                                    <span className="text-[10px] sm:text-[13px] text-slate-600">Transaction Fees</span>
                                    <span className="text-[10px] sm:text-[13px] font-medium text-slate-700">$0.00</span>
                                </div>

                                <div className="flex items-center justify-between gap-3">
                                    <span className="text-[10px] sm:text-[13px] text-slate-600">Gateway Charges</span>
                                    <span className="text-[10px] sm:text-[13px] font-medium text-slate-700">$0.00</span>
                                </div>

                                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-3">
                                    <span className="text-[10px] sm:text-[13px] font-bold text-[#0B1E3D]">Total Deductions</span>

                                    <span className="text-[10px] sm:text-[13px] font-bold text-red-500">$0.00</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 rounded-lg border border-slate-200 p-3 sm:p-4">
                            <h4 className="text-[11px] sm:text-[13px] font-bold text-[#0B1E3D] mb-3">
                                Net Payout Amount
                            </h4>

                            <div className="flex items-center gap-2 rounded-md bg-green-50 px-3 py-2.5">
                                <span className="text-[11px] sm:text-[13px] font-bold text-green-600">USD 0.00</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* PAYOUT DATE SECTION */}
            <div className=" mt-8">
                <h3 className="text-[14px] font-semibold text-[#0B1E3D] mb-4">
                    Payout Date & Time
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                    {/* Date */}
                    <div>
                        <label className="block text-[13px] font-medium text-[#0B1E3D] mb-2">
                            Payout Date <span className="text-red-500">*</span>
                        </label>

                        <div className="relative">
                            <DatePicker
                                selected={payoutDate}
                                onChange={(date) => setPayoutDate(date)}
                                dateFormat="MMMM d, yyyy"
                                placeholderText="Select payout date"
                                className="w-full h-10 px-3 pr-10 border border-slate-200 rounded-lg text-xs text-[#0B1E3D] outline-none focus:border-[#D97706]"
                            />
                            <CalendarDays
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0B1E3D] pointer-events-none"
                            />
                        </div>
                    </div>

                    {/* Payout Time */}
                    <div>
                        <label className="block text-[13px] font-medium text-[#0B1E3D] mb-2">
                            Payout Time <span className="text-red-500">*</span>
                        </label>

                        <div className="h-10 px-3 flex items-center justify-between border border-slate-200 rounded-lg">
                            <span className="text-xs text-[#0B1E3D]">
                                02:30 PM
                            </span>
                            <Clock className="w-4 h-4 text-[#0B1E3D]" />
                        </div>
                    </div>

                    {/* Time Zone */}
                    <div>
                        <label className="block text-[13px] font-medium text-[#0B1E3D] mb-2">
                            Time Zone
                        </label>

                        <div className="h-10 px-3 flex items-center justify-between border border-slate-200 rounded-lg">
                            <span className="text-xs text-[#0B1E3D] truncate">
                                (UTC +04:00) Dubai, UAE
                            </span>
                        </div>
                    </div>

                </div>

                {/* Priority - Below */}
                <div className="mt-5">
                    <label className="block text-[13px] font-medium text-[#0B1E3D] mb-3">
                        Priority
                    </label>

                    <div className="flex flex-wrap items-center gap-x-8 gap-y-3">

                        {/* Normal */}
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="priority"
                                defaultChecked
                                className="accent-[#D97706]"
                            />
                            <span className="flex flex-col text-xs font-medium text-[#0B1E3D]">
                                Normal
                            </span>
                        </label>

                        {/* High */}
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="priority"
                                className="accent-[#D97706]"
                            />
                            <span className="text-xs font-medium text-[#0B1E3D]">
                                High
                            </span>
                        </label>

                        {/* Urgent */}
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="priority"
                                className="accent-[#D97706]"
                            />
                            <span className="text-xs font-medium text-[#0B1E3D]">
                                Urgent
                            </span>
                        </label>

                    </div>
                </div>
            </div>

            {/* PAYOUT NOTE */}
            <div className="mt-6 pt-5 border-t border-slate-100">
                <label className="block text-[11px] sm:text-[14px] font-semibold text-[#0B1E3D] mb-2">
                    Payout Note (Optional)
                </label>

                <textarea
                    rows="3"
                    placeholder="Enter note for this payout..."
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-[10px] sm:text-[13px] text-slate-700 placeholder:text-slate-400 outline-none resize-none transition-all focus:border-[#D97706] focus:ring-2 focus:ring-amber-100"
                />
            </div>

        </div>
    );
}

export default PayoutFormStep1;
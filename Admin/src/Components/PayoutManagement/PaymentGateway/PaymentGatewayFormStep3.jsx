import React from 'react';
import { Info } from 'lucide-react';
import { AE } from 'country-flag-icons/react/3x2';

function PaymentGatewayFormStep3() {

    const currency = {
        name: "UAE Dirham",
        code: "AED",
        symbol: "د.إ",
        region: "Middle East",
        badge: "Available",
        FlagComponent: AE,
    };

    const Flag = currency.FlagComponent;

    return (
        <div className="w-full bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm">

            {/* Header */}
            <div>
                <h3 className="text-base font-bold text-[#0B1E3D]">
                    Supported Currency
                </h3>

                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    This gateway supports AED for transactions and payouts.
                </p>
            </div>

            {/* Note */}
            <div className="flex gap-4 items-start mt-6 rounded-xl bg-gray-50/70 p-4 border border-amber-100">

                <Info className="w-4 h-4 text-[#D97706] mt-0.5 shrink-0" />

                <div className="flex flex-col">
                    <h3 className="text-sm font-bold text-[#0B1E3D]">
                        Currency Information
                    </h3>

                    <p className="text-[11px] text-gray-600 mt-1">
                        This payment gateway is configured to process transactions
                        and payouts only in AED (UAE Dirham).
                    </p>
                </div>

            </div>

            {/* Selected Currency */}
            <div className="mt-6">

                <h1 className="text-[14px] font-bold text-[#0B1E3D] mb-3">
                    Selected Currency
                </h1>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">

                    <div className="flex flex-wrap gap-2">

                        <div className="flex items-center gap-2 bg-white border border-amber-100 text-[#0B1E3D] px-3 py-2 rounded-full shadow-sm text-xs font-medium">

                            <Flag className="w-5 h-4 rounded-sm object-cover" />

                            <span className="font-semibold">
                                {currency.name}
                            </span>

                            <span className="text-slate-500">
                                ({currency.code})
                            </span>

                        </div>

                    </div>

                </div>

            </div>

            {/* Currency Table */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg mt-6">

                <table className="w-full text-left table-fixed">

                    <thead className="bg-gray-100 border-b border-gray-200 text-slate-500 uppercase text-[11px] font-bold">

                        <tr>
                            <th className="px-6 py-4 w-20">
                                Select
                            </th>

                            <th className="px-6 py-4 w-48">
                                Currency
                            </th>

                            <th className="px-6 py-4 w-30">
                                Code
                            </th>

                            <th className="px-6 py-4 w-30">
                                Symbol
                            </th>

                            <th className="px-6 py-4 w-40">
                                Region
                            </th>

                            <th className="px-6 py-4 w-40">
                                Status
                            </th>
                        </tr>

                    </thead>

                    <tbody>

                        <tr className="bg-amber-50/30">

                            {/* Checkbox */}
                            <td className="px-6 py-4">

                                <input
                                    type="checkbox"
                                    checked={true}
                                    disabled
                                    readOnly
                                    className="w-3.5 h-3.5 accent-[#D97706] rounded border-slate-300 cursor-not-allowed"
                                />

                            </td>

                            {/* Currency */}
                            <td className="px-6 py-4 flex items-center gap-3 font-semibold text-slate-900">

                                <Flag className="w-6 h-4 rounded-sm shadow-sm object-cover" />

                                {currency.name}

                            </td>

                            {/* Code */}
                            <td className="px-6 py-4 font-medium text-slate-600">
                                {currency.code}
                            </td>

                            {/* Symbol */}
                            <td className="px-6 py-4 font-medium text-slate-900">
                                {currency.symbol}
                            </td>

                            {/* Region */}
                            <td className="px-6 py-4 text-slate-600">
                                {currency.region}
                            </td>

                            {/* Status */}
                            <td className="px-6 py-4">

                                <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold border bg-emerald-50 text-emerald-600 border-emerald-100">
                                    {currency.badge}
                                </span>

                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default PaymentGatewayFormStep3;
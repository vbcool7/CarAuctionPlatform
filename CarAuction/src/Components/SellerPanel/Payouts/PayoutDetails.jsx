
import React from 'react';
import { payoutsData } from '../SellerSharedComponents/SellerData';
import { Download, Landmark } from 'lucide-react';

function PayoutDetails({ payoutId, setCurrentPage }) {

    const payout = payoutsData.find((item) => item.id === payoutId);

    return (
        <div className='pb-6 space-y-6'>

            {/* back link */}
            <button
                onClick={() => setCurrentPage('payouts')}
                className='flex items-center gap-1 text-xs md:text-sm text-gray-500 hover:text-[#0B1E3D]'
            >
                ← Back to Payouts
            </button>

            {/* header */}
            <div className='w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0'>
                <div className='flex flex-col'>
                    <h1 className='text-xl md:text-2xl font-bold'>Payout Details</h1>
                    <p className='text-xs md:text-sm text-gray-600 p-px'>
                        Overview of all completed and pending payouts to your account.
                    </p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    <button className="flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg transition-colors shadow-sm active:scale-95">
                        <Download className='h-4 w-4' />
                        Export Receipt
                    </button>
                </div>
            </div>

            {/* main grid */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>

                {/* left column */}
                <div className='lg:col-span-2 space-y-6'>

                    {/* Payout Summary */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5">

                        <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
                            <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                                <Landmark className="w-7 h-7 text-emerald-600" />
                            </div>

                            <div>
                                <p className="text-xs font-medium text-gray-600 mb-1">Payout ID</p>
                                <div className="flex flex-wrap items-center gap-3">
                                    <h2 className="text-xl font-bold text-[#0B1E3D]">
                                        {payout.id}
                                    </h2>

                                    <div>
                                        {payout.status === "Completed" ? (
                                            <span className="inline-flex px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-600 rounded-md">
                                                Completed
                                            </span>
                                        ) : (
                                            <span className="inline-flex px-2.5 py-1 text-xs font-semibold bg-amber-50 text-amber-600 rounded-md">
                                                Pending
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-5">
                            <div>
                                <p className="text-xs font-medium text-gray-500 mb-2">Payout Date</p>
                                <p className="text-sm font-semibold text-[#0B1E3D]">{payout.payoutDate}</p>
                                <p className="text-xs text-gray-400 mt-1">{payout.payoutTime}</p>
                            </div>

                            <div>
                                <p className="text-xs font-medium text-gray-500 mb-2">Earnings From</p>
                                <p className="text-sm font-semibold text-[#0B1E3D]">{payout.earningsFrom}</p>
                                <p className="text-xs text-gray-400 mt-1">{payout.salesCount}</p>
                            </div>

                            <div>
                                <p className="text-xs font-medium text-gray-500 mb-2"> Payout Method</p>
                                <div className="flex items-center gap-2">
                                    <Landmark className="w-4 h-4 text-slate-600" />
                                    <p className="text-sm font-semibold text-[#0B1E3D]">{payout.payoutMethod}</p>
                                </div>
                                <p className="text-xs text-gray-400 mt-1 ml-6">{payout.accountNumber}</p>
                            </div>

                            <div>
                                <p className="text-xs font-medium text-gray-500 mb-2">Payout Amount</p>
                                <p className="text-xl font-bold text-[#0B1E3D]">{payout.amount}</p>
                            </div>
                        </div>
                    </div>

                    {/* payout info */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

                        {/* Header */}
                        <div className="px-4 py-3 border-b border-gray-100">
                            <h3 className="text-sm font-semibold text-[#0B1E3D]">
                                Payment Information
                            </h3>
                        </div>

                        {/* Details */}
                        <div className="px-4 py-3">

                            {/* Payout ID */}
                            <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                                <span className="text-[13px] text-gray-600">
                                    Payout ID
                                </span>
                                <span className="text-[13px] font-medium text-gray-800">
                                    PAYOUT12456
                                </span>
                            </div>

                            {/* Payout Date */}
                            <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                                <span className="text-[13px] text-gray-600">
                                    Payout Date
                                </span>
                                <span className="text-[13px] font-medium text-gray-800">
                                    May 31, 2024 02:45 PM
                                </span>
                            </div>

                            {/* Earnings From */}
                            <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                                <span className="text-[13px] text-gray-600">
                                    Earnings From
                                </span>
                                <span className="text-[13px] font-medium text-gray-800">
                                    May 1 – May 31, 2024 (31 Sales)
                                </span>
                            </div>

                            {/* Payout Method */}
                            <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                                <span className="text-[13px] text-gray-600">
                                    Payout Method
                                </span>
                                <span className="text-[13px] font-medium text-gray-800">
                                    Bank Transfer
                                </span>
                            </div>

                            {/* Bank Name */}
                            <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                                <span className="text-[13px] text-gray-600">
                                    Bank Name
                                </span>
                                <span className="text-[13px] font-medium text-gray-800">
                                    Wells Fargo Bank
                                </span>
                            </div>

                            {/* Account Holder Name */}
                            <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                                <span className="text-[13px] text-gray-600">
                                    Account Holder Name
                                </span>
                                <span className="text-[13px] font-medium text-gray-800">
                                    Michael Johnson
                                </span>
                            </div>

                            {/* Account Number */}
                            <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                                <span className="text-[13px] text-gray-600">
                                    Account Number
                                </span>
                                <span className="text-[13px] font-medium text-gray-800">
                                    **** **** 4567
                                </span>
                            </div>

                            {/* Reference ID */}
                            <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                                <span className="text-[13px] text-gray-600">
                                    Reference ID
                                </span>
                                <span className="text-[13px] font-mono font-medium text-gray-800">
                                    UTR987654321
                                </span>
                            </div>

                            {/* Status */}
                            <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                                <span className="text-[13px] text-gray-600">
                                    Status
                                </span>

                                {payout.status === "Completed" ? (
                                    <span className="inline-flex px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-600 rounded-md">
                                        Completed
                                    </span>
                                ) : (
                                    <span className="inline-flex px-2.5 py-1 text-xs font-semibold bg-amber-50 text-amber-600 rounded-md">
                                        Pending
                                    </span>
                                )}
                            </div>

                            {/* Expected Payout Date */}
                            <div className="flex items-center justify-between py-1.5">
                                <span className="text-[13px] text-gray-600">
                                    Expected Payout Date
                                </span>
                                <span className="text-[13px] font-semibold text-gray-800">
                                    Jun 3, 2024
                                </span>
                            </div>

                        </div>
                    </div>
                </div>

                {/* right col */}
                <div className='space-y-6'>

                </div>
            </div>
        </div>
    )
}

export default PayoutDetails
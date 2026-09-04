
import React from 'react';
import { payoutsData } from '../SellerSharedComponents/SellerData';
import { Circle, CircleHelp, Download, Hourglass, Info, Landmark, MessageCircle } from 'lucide-react';

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

                    {/* sales payout included */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">

                            <h3 className="text-base font-semibold text-[#0B1E3D]">
                                Sales Included in This Payout
                                <span className="text-gray-500 font-normal ml-1">
                                    (31 Sales)
                                </span>
                            </h3>

                            <button className="text-xs font-medium text-[#D97706] hover:underline">
                                View All Sales
                            </button>

                        </div>


                        {/* Table */}
                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[750px]">

                                <thead>
                                    <tr className="bg-slate-50 border-b border-gray-100">

                                        <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500">
                                            Vehicle
                                        </th>

                                        <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500">
                                            Sale Date
                                        </th>

                                        <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500">
                                            Sale Price
                                        </th>

                                        <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500">
                                            Commission (5%)
                                        </th>

                                        <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500">
                                            Payout Amount
                                        </th>

                                    </tr>
                                </thead>


                                <tbody className="divide-y divide-gray-100">

                                    {[
                                        {
                                            id: 1,
                                            image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=300&q=80',
                                            vehicle: '2021 BMW X5',
                                            stock: 'BDV12345',
                                            date: 'May 30, 2024',
                                            time: '02:30 PM',
                                            salePrice: 28500,
                                            commission: 1425,
                                            payout: 27075
                                        },
                                        {
                                            id: 2,
                                            image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=300&q=80',
                                            vehicle: '2019 Audi Q5',
                                            stock: 'BDV12344',
                                            date: 'May 28, 2024',
                                            time: '11:15 AM',
                                            salePrice: 18000,
                                            commission: 900,
                                            payout: 17100
                                        },
                                        {
                                            id: 3,
                                            image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=300&q=80',
                                            vehicle: '2020 Mercedes C300',
                                            stock: 'BDV12343',
                                            date: 'May 25, 2024',
                                            time: '04:45 PM',
                                            salePrice: 22750,
                                            commission: 1137.5,
                                            payout: 21612.5
                                        }
                                    ].map((sale) => (

                                        <tr
                                            key={sale.id}
                                            className="hover:bg-slate-50/50"
                                        >

                                            {/* Vehicle */}
                                            <td className="px-4 py-3">

                                                <div className="flex items-center gap-3">

                                                    <img
                                                        src={sale.image}
                                                        alt={sale.vehicle}
                                                        className="w-12 h-9 object-cover rounded-md shrink-0"
                                                    />

                                                    <div>
                                                        <p className="text-xs font-semibold text-[#0B1E3D]">
                                                            {sale.vehicle}
                                                        </p>

                                                        <p className="text-[10px] text-gray-400 mt-0.5">
                                                            Stock ID: {sale.stock}
                                                        </p>
                                                    </div>

                                                </div>

                                            </td>


                                            {/* Sale Date */}
                                            <td className="px-4 py-3">

                                                <p className="text-[11px] font-medium text-[#0B1E3D]">
                                                    {sale.date}
                                                </p>

                                                <p className="text-[10px] text-gray-400 mt-0.5">
                                                    {sale.time}
                                                </p>

                                            </td>


                                            {/* Sale Price */}
                                            <td className="px-4 py-3">

                                                <span className="text-xs font-semibold text-[#0B1E3D]">
                                                    ${sale.salePrice.toLocaleString()}
                                                </span>

                                            </td>


                                            {/* Commission */}
                                            <td className="px-4 py-3">

                                                <span className="text-xs font-semibold text-[#0B1E3D]">
                                                    ${sale.commission.toLocaleString()}
                                                </span>

                                            </td>


                                            {/* Payout */}
                                            <td className="px-4 py-3">

                                                <span className="text-xs font-semibold text-[#0B1E3D]">
                                                    ${sale.payout.toLocaleString()}
                                                </span>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>


                        {/* Footer */}
                        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">

                            <p className="text-[10px] text-gray-500">
                                Showing 1 to 3 of 31 sales
                            </p>

                            <button className="px-4 py-1.5 border border-gray-200 rounded-md text-[11px] font-medium text-gray-600 hover:bg-gray-50">
                                View All Sales
                            </button>

                        </div>

                    </div>
                </div>

                {/* right col */}
                <div className="space-y-5">

                    {/* ================== PAYOUT STATUS ================== */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5">

                        <h3 className="text-md font-semibold text-[#0B1E3D] mb-5">
                            Payout Status
                        </h3>

                        <div className="relative">

                            {/* Vertical Line */}
                            <div className="absolute left-[12px] top-3 bottom-3 w-px bg-gray-200" />

                            <div className="space-y-5">

                                {/* Initiated */}
                                <div className="relative flex gap-3">

                                    <div className="w-7 h-7 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center z-10 shrink-0">
                                        <Hourglass className="w-3.5 h-3.5 text-[#D97706]" />
                                    </div>

                                    <div>
                                        <p className="text-[13px] font-semibold text-[#0B1E3D]">
                                            Payout Initiated
                                        </p>

                                        <p className="text-[11px] text-gray-500 mt-0.5">
                                            May 31, 2024 02:45 PM
                                        </p>

                                        <p className="text-[11px] text-gray-400 mt-0.5">
                                            Your payout has been initiated.
                                        </p>
                                    </div>

                                </div>


                                {/* Processing */}
                                <div className="relative flex gap-3">

                                    <div className="w-7 h-7 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center z-10 shrink-0">
                                        <Circle className="w-3 h-3 text-gray-300 fill-gray-300" />
                                    </div>

                                    <div>
                                        <p className="text-[13px] font-semibold text-[#0B1E3D]">
                                            Processing
                                        </p>

                                        <p className="text-[11px] text-gray-500 mt-0.5">
                                            Estimated: Jun 1 – Jun 3, 2024
                                        </p>

                                        <p className="text-[11px] text-gray-400 mt-0.5">
                                            We are processing your payout.
                                        </p>
                                    </div>

                                </div>


                                {/* In Transit */}
                                <div className="relative flex gap-3">

                                    <div className="w-7 h-7 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center z-10 shrink-0">
                                        <Circle className="w-3 h-3 text-gray-300 fill-gray-300" />
                                    </div>

                                    <div>
                                        <p className="text-[13px] font-semibold text-[#0B1E3D]">
                                            In Transit
                                        </p>

                                        <p className="text-[11px] text-gray-500 mt-0.5">
                                            Estimated: Jun 3 – Jun 4, 2024
                                        </p>

                                        <p className="text-[11px] text-gray-400 mt-0.5">
                                            Your payout is on the way to your bank.
                                        </p>
                                    </div>

                                </div>


                                {/* Paid */}
                                <div className="relative flex gap-3">

                                    <div className="w-7 h-7 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center z-10 shrink-0">
                                        <Circle className="w-3 h-3 text-gray-300 fill-gray-300" />
                                    </div>

                                    <div>
                                        <p className="text-[13px] font-semibold text-[#0B1E3D]">
                                            Paid
                                        </p>

                                        <p className="text-[11px] text-gray-500 mt-0.5">
                                            Estimated: Jun 4, 2024
                                        </p>

                                        <p className="text-[11px] text-gray-400 mt-0.5">
                                            The amount will be credited to your bank account.
                                        </p>
                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* Info */}
                        <div className="flex items-center gap-2 mt-5 pt-3 border-t border-gray-100">
                            <Info className="w-4 h-4 text-gray-400" />

                            <p className="text-[11px] text-gray-500">
                                Payouts are usually completed within 3-5 business days.
                            </p>
                        </div>

                    </div>

                    {/* ================== AMOUNT BREAKDOWN ================== */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5">

                        <h3 className="text-md font-semibold text-[#0B1E3D] mb-4">
                            Amount Breakdown
                        </h3>

                        <div className="space-y-2.5">

                            {/* Total Earnings */}
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">
                                    Total Earnings
                                </span>

                                <span className="text-sm font-semibold text-[#0B1E3D]">
                                    $6,860.00
                                </span>
                            </div>

                            {/* Platform Fee */}
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">
                                    Platform Fee (5%)
                                </span>

                                <span className="text-sm font-semibold text-red-500">
                                    -$343.00
                                </span>
                            </div>

                            {/* Payment Processing */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                    <span className="text-xs text-gray-500">
                                        Payment Processing Fee
                                    </span>

                                    <Info className="w-3 h-3 text-gray-400" />
                                </div>

                                <span className="text-sm font-semibold text-red-500">
                                    -$55.00
                                </span>
                            </div>

                            {/* Other Adjustments */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                    <span className="text-xs text-gray-500">
                                        Other Adjustments
                                    </span>

                                    <Info className="w-3 h-3 text-gray-400" />
                                </div>

                                <span className="text-sm font-semibold text-red-500">
                                    -$212.00
                                </span>
                            </div>

                        </div>

                        {/* Payout Amount */}
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">

                            <span className="text-sm font-semibold text-[#0B1E3D]">
                                Payout Amount
                            </span>

                            <span className="text-sm font-bold text-green-600">
                                $6,250.00
                            </span>

                        </div>

                    </div>

                    {/* ================== NEED HELP ================== */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5">

                        <h3 className="text-md font-semibold text-[#0B1E3D] mb-4">
                            Need Help?
                        </h3>

                        <div className="flex items-start gap-3">

                            <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                                <CircleHelp className="w-4.5 h-4.5 text-blue-500" />
                            </div>

                            <p className="text-[12px] leading-5 text-gray-500">
                                If you have any questions about your payout, our support team
                                is here to help.
                            </p>

                        </div>

                        <button className="mt-4 flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-md text-[12px] font-medium text-[#0B1E3D] hover:bg-gray-50">
                            <MessageCircle className="w-4 h-4 text-[#D97706]" />
                            Contact Support
                        </button>

                    </div>

                </div>
            </div>
        </div>
    )
}

export default PayoutDetails
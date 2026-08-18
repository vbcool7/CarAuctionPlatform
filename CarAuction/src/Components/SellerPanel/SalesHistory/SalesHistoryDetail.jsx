
import React from 'react';
import { salesHistoryData } from '../SellerSharedComponents/SellerData';
import { Download, FileText } from 'lucide-react';

function getTimelineSteps(sales) {
    if (sales.status === 'cancelled') {
        return [
            { title: 'Vehicle Sold', date: sales.saleDate, description: 'Buyer completed the purchase.', state: 'done' },
            { title: 'Sale Cancelled', date: sales.cancelledDate, description: 'This sale was cancelled.', state: 'error' },
        ];
    }

    return [
        { title: 'Vehicle Sold', date: sales.saleDate, description: 'Buyer completed the payment.', state: 'done' },
        {
            title: sales.status === 'payment_overdue' ? 'Payment Overdue' : 'Payment Received',
            date: sales.status === 'sold' ? null : sales.paymentDate,
            description:
                sales.status === 'sold' ? 'Waiting for buyer to make payment.'
                    : sales.status === 'payment_overdue' ? 'Payment deadline has passed.'
                        : `Payment received from buyer.`,
            state:
                sales.status === 'sold' ? 'upcoming'
                    : sales.status === 'payment_pending' ? 'pending'
                        : sales.status === 'payment_overdue' ? 'error'
                            : 'done', // completed
        },
        {
            title: 'Payout Initiated',
            date: sales.payoutInitiatedDate,
            description: 'Payout initiated to your bank account.',
            state: sales.status === 'completed' ? 'done' : 'upcoming',
        },
        {
            title: 'Payout Completed',
            date: sales.payoutDate,
            description: 'Amount transferred to your bank account.',
            state: sales.status === 'completed' ? 'done' : 'upcoming',
        },
    ];
}

const iconByState = {
    done: 'bg-green-500 text-white',
    pending: 'bg-orange-400 text-white',
    error: 'bg-red-500 text-white',
    upcoming: 'bg-gray-200 text-gray-400',
};

const iconSymbol = {
    done: '✓',
    pending: '⏳',
    error: '✗',
    upcoming: '',
};

function SalesHistoryDetail({ setCurrentPage, salesId }) {

    const sales = salesHistoryData.find((item) => item.id === salesId);

    const steps = getTimelineSteps(sales);

    return (
        <div className='pb-6 space-y-6'>

            {/* back link */}
            <button
                onClick={() => setCurrentPage('sales-history')}
                className='flex items-center gap-1 text-xs md:text-sm text-gray-500 hover:text-[#0B1E3D]'
            >
                ← Back to Sales History
            </button>

            {/* header */}
            <div className='w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0'>
                <div className='flex flex-col'>
                    <h1 className='text-xl md:text-2xl font-bold'>Sales Details</h1>
                    <p className='text-xs md:text-sm text-gray-600 p-px'>
                        Overview of all recent vehicle sales and financial records.
                    </p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    <button className="flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg transition-colors shadow-sm active:scale-95">
                        <Download className='h-4 w-4' />
                        Export Report
                    </button>
                </div>
            </div>

            {/* main grid */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>

                {/* left column */}
                <div className='lg:col-span-2 space-y-6'>

                    {/* cover image + basic specs card */}
                    <div className='bg-white rounded-xl border border-gray-200 p-5'>
                        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-5'>

                            {/* Vehicle Image */}
                            <div className='rounded-xl overflow-hidden h-36 w-full sm:w-56 bg-gray-100 shrink-0 border border-gray-100'>
                                <img
                                    src={sales.vehicleImage}
                                    alt={sales.vehicle}
                                    className='w-full h-full object-cover'
                                />
                            </div>
                            <div className='flex flex-col justify-between w-full gap-4'>
                                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-2'>
                                    <div className='flex flex-wrap items-center gap-2.5'>
                                        <h2 className='text-lg md:text-xl font-bold text-[#0B1E3D] leading-tight'>
                                            {sales.vehicle}
                                        </h2>
                                    </div>
                                </div>

                                <div className='flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-gray-500'>
                                    <span>Stock ID:
                                        <span className='ml-1 font-semibold text-gray-700'>
                                            {sales.stockId}
                                        </span>
                                    </span>
                                    <span className='hidden sm:inline text-gray-300'>•</span>
                                    <span>
                                        VIN:
                                        <span className='ml-1 font-semibold text-gray-700 tracking-wide'>
                                            5UXCR6C07M9G12345
                                        </span>
                                    </span>
                                </div>

                                <div className='grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 pt-4 border-t border-gray-100'>
                                    <div>
                                        <p className='text-[11px] uppercase tracking-wide text-gray-400 font-medium mb-1'>Sale Price</p>
                                        <p className='text-lg font-bold text-[#0B1E3D] leading-none'>
                                            ${sales.salePrice.toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className='text-[11px] uppercase tracking-wide text-gray-400 font-medium mb-1'> Sold On </p>
                                        <p className='text-sm font-semibold text-gray-800'>{sales.saleDate}</p>
                                        <p className='text-[11px] text-gray-400 mt-0.5'> {sales.saleTime}</p>
                                    </div>
                                    <div className='col-span-2 md:col-span-1'>
                                        <p className='text-[11px] uppercase tracking-wide text-gray-400 font-medium mb-1'>
                                            Sale Status
                                        </p>
                                        <span
                                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${sales.status === 'completed'
                                                ? 'bg-green-100 text-green-700'
                                                : sales.status === 'sold'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : sales.status === 'pending'
                                                        ? 'bg-orange-100 text-orange-700'
                                                        : sales.status === 'overdue'
                                                            ? 'bg-red-100 text-red-700'
                                                            : 'bg-gray-100 text-gray-600' // cancelled
                                                }`}
                                        >
                                            {sales.status === 'sold' && 'Sold'}
                                            {sales.status === 'pending' && 'Pending'}
                                            {sales.status === 'completed' && 'Completed'}
                                            {sales.status === 'overdue' && 'Overdue'}
                                            {sales.status === 'cancelled' && 'Cancelled'}
                                        </span>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Transaction Summary */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100">
                            <h3 className="text-sm font-semibold text-[#0B1E3D]">Transaction Summary</h3>
                        </div>

                        <div className="px-4 py-3 space-y-3 text-[13px]">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Sale Price</span>
                                <span className="font-semibold text-gray-800">$28,500.00</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-gray-600 flex items-center gap-1">
                                    Buyer Payment
                                    <span className="text-gray-500">ⓘ</span>
                                </span>
                                <span className="font-semibold text-gray-800">$30,000.00</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Platform Fee (5%)</span>
                                <span className="font-semibold text-red-500">-$1,425.00</span>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                <span className="font-semibold text-gray-800">Payout Amount</span>
                                <span className="font-bold text-green-600">$27,075.00</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Information */}
                    <div className="bg-white border border-gray-200 rounded-xl">
                        <div className="px-4 py-3 border-b border-gray-100">
                            <h3 className="text-sm font-semibold text-[#0B1E3D]">
                                Payment Information
                            </h3>
                        </div>

                        <div className="px-4 py-3 space-y-3 text-[13px]">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Payment Status</span>
                                <span className="px-1.5 py-0.5 text-[10px] font-medium text-green-600 bg-green-50 rounded"> Paid</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Payment Method</span>
                                <span className="font-medium text-gray-700">Bank Transfer</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Paid On</span>
                                <span className="font-medium text-gray-700">May 31, 2024</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Payout ID</span>
                                <span className="font-medium text-gray-700">PAYOUT123456</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Transaction ID</span>
                                <span className="font-medium text-gray-700">TXN789456123</span>
                            </div>
                        </div>
                    </div>

                    {/* time line */}
                    <div className='bg-white rounded-xl border border-gray-100 shadow-sm p-5'>
                        <h3 className='text-sm font-semibold text-gray-800 mb-4'>
                            Timeline
                        </h3>

                        <div>
                            {steps.map((step, i) => (
                                <div key={i} className='flex gap-3'>
                                    <div className='flex flex-col items-center'>
                                        <div
                                            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 ${iconByState[step.state]}`}
                                        >
                                            {iconSymbol[step.state]}
                                        </div>

                                        {i < steps.length - 1 && (
                                            <div
                                                className={`w-px flex-1 my-1 ${step.state === 'done'
                                                        ? 'bg-green-200'
                                                        : 'bg-gray-200'
                                                    }`}
                                            />
                                        )}
                                    </div>

                                    <div className={i < steps.length - 1 ? 'pb-5' : ''}>
                                        <p className='text-[13px] font-medium text-gray-900'>
                                            {step.title}
                                        </p>

                                        {step.date && (
                                            <p className='text-xs text-gray-400'>
                                                {step.date}
                                            </p>
                                        )}

                                        <p className='text-sm text-gray-500 mt-0.5'>
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* right column */}
                <div className='space-y-6'>

                    {/* User Information */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100">
                            <h3 className="text-sm font-semibold text-[#0B1E3D]">User Information</h3>
                        </div>

                        <div className="p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                                <span className="text-lg font-semibold text-purple-600">
                                    D
                                </span>
                            </div>

                            {/* User Details */}
                            <div className="space-y-1">
                                <p className="text-sm font-semibold text-gray-800">David Williams</p>
                                <p className="text-xs text-gray-500">david@example.com</p>
                                <p className="text-xs text-gray-500"> +1 (555) 123-4567</p>
                                <p className="text-xs text-gray-500">New York, USA</p>
                            </div>
                        </div>
                    </div>

                    {/* Vehicle Information */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100">
                            <h3 className="text-sm font-semibold text-[#0B1E3D]">Vehicle Information</h3>
                        </div>

                        <div className="px-4 py-3 space-y-3 text-[13px]">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Make / Model</span>
                                <span className="font-medium text-gray-800">BMW X5</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Year</span>
                                <span className="font-medium text-gray-800">2021</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Body Type</span>
                                <span className="font-medium text-gray-800">SUV</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Mileage</span>
                                <span className="font-medium text-gray-800">32,450 miles</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Transmission</span>
                                <span className="font-medium text-gray-800">Automatic</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Fuel Type</span>
                                <span className="font-medium text-gray-800">Petrol</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Color</span>
                                <span className="font-medium text-gray-800">White</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Condition</span>
                                <span className="font-medium text-gray-800">Excellent</span>
                            </div>

                        </div>
                    </div>

                    {/* Commission Breakdown */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100">
                            <h3 className="text-sm font-semibold text-[#0B1E3D]">Commission Breakdown</h3>
                        </div>

                        <div className="px-4 py-3 space-y-3 text-[13px]">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Platform Fee (5%)</span>
                                <span className="font-medium text-gray-800">$1,425.00 </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-gray-600 flex items-center gap-1">
                                    Payment Processing Fee <span className="text-gray-400">ⓘ</span>
                                </span>
                                <span className="font-medium text-gray-800">$180.00</span>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                <span className="font-semibold text-gray-800"> Total Commission</span>
                                <span className="font-bold text-red-500">$1,605.00</span>
                            </div>
                        </div>
                    </div>

                    {/* Documents */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100">
                            <h3 className="text-sm font-semibold text-[#0B1E3D]">Documents</h3>
                        </div>

                        <div className="px-4 py-3 space-y-3">

                            {/* Bill of Sale */}
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="w-7 h-7 rounded-md bg-purple-50 flex items-center justify-center shrink-0">
                                        <FileText className="w-4 h-4 text-purple-600" />
                                    </div>
                                    <span className="text-[13px] font-medium text-gray-700 truncate">Bill of Sale</span>
                                </div>
                                <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50">
                                    <Download className="w-3 h-3" />
                                    Download
                                </button>
                            </div>

                            {/* Payment Receipt */}
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="w-7 h-7 rounded-md bg-green-50 flex items-center justify-center shrink-0">
                                        <FileText className="w-4 h-4 text-green-600" />
                                    </div>
                                    <span className="text-[13px] font-medium text-gray-700 truncate">Payment Receipt</span>
                                </div>
                                <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50">
                                    <Download className="w-3 h-3" />
                                    Download
                                </button>
                            </div>

                            {/* Payout Receipt */}
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="w-7 h-7 rounded-md bg-orange-50 flex items-center justify-center shrink-0">
                                        <FileText className="w-4 h-4 text-orange-500" />
                                    </div>
                                    <span className="text-[13px] font-medium text-gray-700 truncate">Payout Receipt</span>
                                </div>
                                <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50">
                                    <Download className="w-3 h-3" />
                                    Download
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default SalesHistoryDetail
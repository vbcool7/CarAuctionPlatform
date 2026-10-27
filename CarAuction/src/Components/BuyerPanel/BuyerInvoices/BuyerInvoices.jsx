
import React, { useState } from 'react';
import { FileText, Download, ShieldCheck } from 'lucide-react';
import { VscFilePdf } from "react-icons/vsc";
import { IoIosLock } from "react-icons/io";
import BuyerContactSupport from '../BuyerSharedComponents/BuyerContactSupport';

import { getPaginationRange } from '../../utils/getPaginationRange';
import { formatDateTime, formatPrice } from '../../../utils/formatters';
import { useDownloadBuyerInvoice } from '../../../hook/useInvoice';
import { useGetMyOrders, useGetMyOrdersSummary } from '../../../hook/usePayment';

const tabs = [
    { name: 'All Invoices', status: '' },
    { name: 'Paid', status: 'paid' },
    { name: 'Pending Payment', status: 'pending_payment' },
    { name: 'Expired', status: 'expired' },
    { name: 'Canceled', status: 'canceled' },
];

// Helper 
const SummaryRow = ({ label, value, color = "text-[#0B1E3D]" }) => (
    <div className="flex justify-between items-center text-sm font-medium">
        <span className="text-slate-600">{label}</span>
        <span className={`font-bold ${color}`}>{value}</span>
    </div>
);

const PriceRow = ({ label, value, color = "text-[#0B1E3D]" }) => (
    <div className="flex justify-between items-center text-sm">
        <span className="text-slate-600 font-medium">{label}</span>
        <span className={`font-bold ${color}`}>{value}</span>
    </div>
);

function BuyerInvoices() {

    const [activeTab, setActiveTab] = useState('');
    const [page, setPage] = useState(1);

    const { data, isLoading, isError } = useGetMyOrders(page, 10, activeTab, '');
    const { data: summaryResponse } = useGetMyOrdersSummary();
    const { mutate: downloadInvoice, isPending: isDownloading, variables: downloadingOrderId, } = useDownloadBuyerInvoice();

    const orders = data?.orders || [];
    const totalPages = data?.pagination?.totalPages || 1;
    const summary = summaryResponse?.summary || {};

    const summaryRows = Object.values(summary);
    const totalInvoices = summaryRows.reduce((sum, row) => sum + (row.count || 0), 0);
    const totalInvoiced = summaryRows.reduce((sum, row) => sum + (row.total || 0), 0);

    const invoiceData = {
        totalInvoices,
        paid: summary.paid?.count || 0,
        unpaid: summary.pending_payment?.count || 0,
        totalInvoiced,
        totalPaid: summary.paid?.total || 0,
        totalDue: summary.pending_payment?.total || 0,
    };

    return (
        <div className='pb-6'>
            <div className='pb-7'>
                <h1 className='text-slate-800 text-xl md:text-2xl font-bold'>Invoices</h1>
                <p className='pt-1 text-gray-600 text-[12px] md:text-sm font-medium'>View and download all your invoices.</p>
            </div>

            {/* tabs */}
            <div className="border-b border-slate-200 mb-6 overflow-x-auto no-scrollbar">
                <div className="flex gap-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.name}
                            onClick={() => {
                                setActiveTab(tab.status);
                                setPage(1);
                            }}
                            className={`pb-4 text-[13px] md:text-sm font-semibold transition-all relative whitespace-nowrap
                                ${activeTab === tab.status
                                    ? 'text-[#0B1E3D]'
                                    : 'text-slate-400 hover:text-[#0B1E3D]'
                                }`}
                        >
                            {tab.name}
                            {activeTab === tab.status && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#D97706] rounded-t-full" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                {/* table */}
                <div className="lg:col-span-8 space-y-6">

                    <div className="w-full overflow-x-auto bg-white border border-gray-200 rounded-lg">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-xs text-gray-800 uppercase bg-gray-100 border-b border-gray-200">
                                    <th className="px-6 py-4 font-medium min-w-50">Invoice</th>
                                    <th className="px-6 py-4 font-medium min-w-75">Vehicle & Auction Detail</th>
                                    <th className="px-6 py-4 font-medium min-w-43">Invoice Date</th>
                                    <th className="px-6 py-4 font-medium min-w-43">Due Date</th>
                                    <th className="px-6 py-4 font-medium min-w-43">Amount</th>
                                    <th className="px-6 py-4 font-medium min-w-30">Status</th>
                                    <th className="px-6 py-4 font-medium  min-w-50">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-sm text-slate-500">
                                            Loading invoices...
                                        </td>
                                    </tr>
                                ) : isError ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-sm text-red-600">
                                            Could not load invoices.
                                        </td>
                                    </tr>
                                ) : orders.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-sm text-slate-500">
                                            No invoices found.
                                        </td>
                                    </tr>
                                ) : (
                                    orders.map((order) => {

                                        const vehicle = order.vehicleId || {};
                                        const isPaid = order.status === 'paid';
                                        const refundStatus = order.refund?.status;

                                        const badge = order.status === 'canceled'
                                            ? refundStatus === 'succeeded'
                                                ? { text: 'Refunded', color: 'text-purple-600', bg: 'bg-purple-100/80' }
                                                : refundStatus === 'pending'
                                                    ? { text: 'Refund Pending', color: 'text-amber-600', bg: 'bg-amber-100/80' }
                                                    : refundStatus === 'failed'
                                                        ? { text: 'Refund Failed', color: 'text-red-600', bg: 'bg-red-100/80' }
                                                        : { text: 'Canceled', color: 'text-slate-600', bg: 'bg-slate-100' }
                                            : order.status === 'paid'
                                                ? { text: 'Paid', color: 'text-green-600', bg: 'bg-green-100/80' }
                                                : order.status === 'pending_payment'
                                                    ? { text: 'Pending Payment', color: 'text-amber-600', bg: 'bg-amber-100/80' }
                                                    : order.status === 'expired'
                                                        ? { text: 'Expired', color: 'text-slate-600', bg: 'bg-slate-100' }
                                                        : { text: order.status, color: 'text-slate-600', bg: 'bg-slate-100' };

                                        return (
                                            <tr
                                                key={order._id}
                                                className="hover:bg-gray-50">

                                                {/* order id */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-slate-600 flex items-center justify-center shadow-2xs">
                                                            <FileText size={18} />
                                                        </div>

                                                        <div className="flex flex-col">
                                                            <span className="text-xs font-bold text-[#0B1E3D] tracking-tight">
                                                                INV-{order.orderId}
                                                            </span>
                                                            <span className="text-[11px] text-slate-400 font-medium">
                                                                {order.listingId ? `${order.listingId}` : '—'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                
                                                {/* vehicle details */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200/80 shrink-0 shadow-2xs">
                                                            {vehicle?.images ? (
                                                                <img
                                                                    src={vehicle.images[0].url}
                                                                    alt={vehicle.make || 'Vehicle'}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-slate-400 text-[10px] font-medium">
                                                                    No Img
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Vehicle Details */}
                                                        <div className="flex flex-col">
                                                            <p className="font-bold text-[#0B1E3D] text-sm tracking-tight">
                                                                {[vehicle?.year, vehicle?.make, vehicle?.model].filter(Boolean).join(' ') || 'Vehicle'}
                                                            </p>
                                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${order.source === 'auction'
                                                                        ? 'bg-amber-50 text-[#D97706] border border-amber-200/60'
                                                                        : 'bg-emerald-50 text-emerald-600 border border-emerald-200/60'
                                                                    }`}>
                                                                    {order.source === 'auction' ? 'Auction' : 'Buy Now'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4 text-xs text-gray-500 font-semibold">
                                                    {formatDateTime(order.paidAt || order.createdAt)}
                                                </td>

                                                <td className="px-6 py-4 text-xs text-gray-500 font-semibold">
                                                    {formatDateTime(order.paymentDueAt)}
                                                </td>

                                                <td className="px-6 py-4 text-sm font-bold">
                                                    {formatPrice(order.amount, order.currency)}
                                                </td>

                                                <td className="px-6 py-4">
                                                    <span className={`text-[11px] font-bold ${badge.color} ${badge.bg} px-2 py-1 rounded`}>
                                                        {badge.text}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4">
                                                    {isPaid ? (
                                                        <button
                                                            onClick={() => downloadInvoice(order.orderId)}
                                                            disabled={isDownloading && downloadingOrderId === order.orderId}
                                                            title="Download invoice"
                                                            className="p-2 text-[#D97706] border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
                                                        >
                                                            <Download size={18} />
                                                        </button>
                                                    ) : (
                                                        <span className="text-xs text-slate-400">Available after payment</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between gap-4 px-5 py-4 mt-5 ">
                            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
                                <span>Page</span>
                                <span className="inline-flex items-center justify-center min-w-7 h-7 px-2 rounded-lg bg-slate-50 border border-slate-100 font-bold text-[#0B1E3D]">{page}</span>
                                <span>of</span>
                                <span className="font-semibold text-[#0B1E3D]">{totalPages}</span>
                            </div>

                            <div className="flex items-center gap-1.5 mx-auto sm:mx-0 sm:ml-auto">
                                <button
                                    type="button"
                                    onClick={() => setPage((p) => p - 1)}
                                    disabled={page === 1}
                                    className=" h-9 px-3.5 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-xs font-semibold text-[#0B1E3D] hover:bg-slate-50 hover:border-[#0B1E3D] disabled:opacity-35 disabled:cursor-not-allowed transition-all duration-200">
                                    Previous
                                </button>

                                <div className="flex items-center gap-1">
                                    {getPaginationRange(page, totalPages).map((num, idx) =>
                                        num === "..." ? (
                                            <span
                                                key={`dot-${idx}`}
                                                className=" w-8 h-9 flex items-center justify-center text-xs font-semibold text-slate-400">
                                                ...
                                            </span>
                                        ) : (
                                            <button
                                                type="button"
                                                key={num}
                                                onClick={() => setPage(num)}
                                                className={` w-9 h-9 flex items-center justify-center rounded-lg text-xs font-bold border transition-all duration-200
                                                    ${page === num
                                                        ? "bg-[#0B1E3D] text-white border-[#0B1E3D] shadow-md shadow-slate-200 scale-[1.02]"
                                                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-[#0B1E3D] hover:text-[#0B1E3D]"
                                                    }`}>
                                                {num}
                                            </button>
                                        )
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setPage((p) => p + 1)}
                                    disabled={page === totalPages}
                                    className=" h-9 px-3.5 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-xs font-semibold text-[#0B1E3D] hover:bg-slate-50 hover:border-[#0B1E3D] disabled:opacity-35 disabled:cursor-not-allowed transition-all duration-200">
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* summary */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="w-full max-w-sm space-y-6">

                        {/* 1. Invoice Summary Card */}
                        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <FileText className="text-[#D97706]" size={20} />
                                <h2 className="text-lg font-bold text-[#0B1E3D]">Invoice Summary</h2>
                            </div>

                            <p className="text-xs text-slate-500 mb-4">All Amounts in AED</p>

                            <div className="space-y-4 mb-6">
                                <SummaryRow label="Total Invoices" value={invoiceData.totalInvoices} />
                                <SummaryRow label="Paid Invoices" value={invoiceData.paid} color="text-green-600" />
                                <SummaryRow label="Unpaid Invoices" value={invoiceData.unpaid} color="text-orange-600" />
                            </div>

                            <div className="space-y-3 pt-4 border-t border-slate-100">
                                <PriceRow label="Total Invoiced" value={formatPrice(invoiceData.totalInvoiced)} />
                                <PriceRow label="Total Paid" value={formatPrice(invoiceData.totalPaid)} color="text-green-600" />
                                <PriceRow label="Total Due" value={formatPrice(invoiceData.totalDue)} color="text-orange-600" />
                            </div>
                        </div>

                        {/* 2. Download Statement */}
                        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <Download className="text-[#D97706]" size={20} />
                                <h2 className="text-sm font-bold text-[#0B1E3D]">Download Statement</h2>
                            </div>
                            <p className="text-xs text-slate-500 mb-4">Download your invoice statement.</p>
                            <button className="w-full py-2.5 border border-[#D97706] text-[#D97706] rounded-lg text-sm font-bold hover:bg-amber-50 transition-colors flex items-center justify-center gap-2">
                                <Download size={16} /> Download Statement
                            </button>
                        </div>

                        {/* 3. Support & Security */}
                        <BuyerContactSupport />

                        {/* 4. Note */}
                        <div className="bg-white border border-slate-200/70 rounded-2xl p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2.5">
                                    <ShieldCheck className="text-[#D97706]" size={20} />
                                    <h2 className="text-sm font-bold text-[#0B1E3D]">Secure Invoices</h2>
                                </div>

                                <div className="flex items-center gap-1.5">
                                    <div className="p-1.5 bg-red-50 text-red-600 rounded-lg" title="PDF Format">
                                        <VscFilePdf size={16} />
                                    </div>
                                    <div className="p-1.5 bg-slate-100 text-slate-600 rounded-lg" title="Encrypted">
                                        <IoIosLock size={16} />
                                    </div>
                                </div>
                            </div>

                            <p className="text-xs text-slate-500 leading-relaxed">
                                Invoices are auto-generated, digitally signed, and fully protected against unauthorized access.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BuyerInvoices;
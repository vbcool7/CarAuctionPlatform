
import React, { useState } from 'react';
import { Download, CreditCard, Truck, Trophy, ClipboardList } from 'lucide-react';
import BuyerContactSupport from '../BuyerSharedComponents/BuyerContactSupport';
import PendingPaymentsBanner from './PendingPaymentsBanner';
import { toast } from 'react-toastify';

import { formatLabel, formatDateTime, formatPrice } from '../../../utils/formatters';
import { useGetMyOrders, useGetMyOrdersSummary } from '../../../hook/usePayment';
import { useCheckout } from '../../../hook/useBuy';
import { getPaginationRange } from '../../utils/getPaginationRange';

const tabs = [
    { name: 'All Won', label: 'All Won', },
    { name: 'Payment Pending', label: 'Payment Pending', },
    { name: 'Payment Completed', label: 'Payment Completed', },
    { name: 'Handed Over', label: 'Handed Over', },
    { name: 'Expired', label: 'Expired', },
];

const actions = [
    {
        icon: CreditCard,
        title: 'Pending Payments',
        desc: 'You have 2 payments pending.',
        link: 'Pay Now',
        badge: '2',
        color: 'bg-amber-50 text-[#D97706]',
    },
];

function BuyerWonAuctions({ setSelectedVehicleId, setCurrentPage }) {

    const [activeTab, setActiveTab] = useState('All Won');
    const [page, setPage] = useState(1);

    const TAB_STATUS = { 'All Won': '', 'Payment Pending': 'pending_payment', 'Payment Completed': 'paid', 'Handed Over': 'paid', 'Expired': 'expired' };

    const { data, isLoading, isError } = useGetMyOrders(page, 10, TAB_STATUS[activeTab], '');
    const { data: sumData } = useGetMyOrdersSummary('');
    const { mutate: startCheckout, isPending, variables: payingId } = useCheckout();

    const all = data?.orders || [];
    const s = sumData?.summary || {};
    const totalPages = data?.pagination?.totalPages || 1;

    const orders =
        activeTab === 'Payment Completed' ? all.filter((o) => o.handover?.status !== 'confirmed')
            : activeTab === 'Handed Over' ? all.filter((o) => o.handover?.status === 'confirmed')
                : all;

    // handle pay
    const handlePay = (id) => startCheckout(id, {
        onSuccess: (res) => { window.location.href = res.url; },
        onError: (err) => toast.error(err.response?.data?.message || 'Could not start payment'),
    });

    const summaryData = [
        { label: 'Total Won', value: (s.pending_payment?.count || 0) + (s.paid?.count || 0) + (s.expired?.count || 0) },
        { label: 'Payment Completed', value: s.paid?.count || 0 },
        { label: 'Payment Pending', value: s.pending_payment?.count || 0 },
        { label: 'Expired', value: s.expired?.count || 0 },
    ];

    const financialData = [
        { label: 'Total Amount Won', value: formatPrice((s.pending_payment?.total || 0) + (s.paid?.total || 0)) },
        { label: 'Total Paid', value: formatPrice(s.paid?.total || 0) },
        { label: 'Pending Amount', value: formatPrice(s.pending_payment?.total || 0) },
    ];

    if (isLoading) return <p className="p-10 text-center">Loading my winning vehicle list....</p>;
    if (isError) return <p className="p-10 text-center text-red-500">Failed to load winning vehicle list</p>;

    return (
        <div>
            <div className='pb-7'>
                <h1 className='text-slate-800 text-xl md:text-2xl font-bold'>Won Auctions</h1>
                <p className='pt-1 text-gray-600 text-[12px] md:text-sm font-medium'>Auctions you've won and ready for the next steps.</p>
            </div>
            
            {/* show pending payment badge */}
            <PendingPaymentsBanner setCurrentPage={setCurrentPage} />

            {/* tabs */}
            <div className="flex justify-between items-end border-b border-slate-200 mb-6 overflow-x-auto no-scrollbar">

                {/* Tabs */}
                <div className="flex gap-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.name}
                            onClick={() => {
                                setActiveTab(tab.name);
                                setPage(1);
                            }}
                            className={`pb-4 text-[13px] md:text-sm font-semibold transition-all relative whitespace-nowrap
                            ${activeTab === tab.name
                                    ? 'text-[#0B1E3D]'
                                    : 'text-slate-400 hover:text-[#0B1E3D]'
                                }`}
                        >
                            {tab.label}
                            {activeTab === tab.name && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#D97706] rounded-t-full" />
                            )}
                        </button>
                    ))}
                </div>

                <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#0B1E3D] hover:bg-slate-50 rounded-md transition-colors border border-slate-200">
                    <Download className="w-4 h-4" />
                    Export
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                <div className="lg:col-span-8">

                    {/* top heading */}
                    <div className="pb-5">
                        <p className="text-[12px] md:text-sm text-slate-500 font-medium">
                            Showing {orders.length} won auctions
                        </p>
                    </div>

                    {/* table */}
                    <div className="w-full overflow-x-auto bg-white border border-gray-200 rounded-lg">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-xs text-gray-800 uppercase bg-gray-100 border-b border-gray-200">
                                    <th className="px-6 py-4 font-medium min-w-80">Vehicle Details</th>
                                    <th className="px-6 py-4 font-medium min-w-50">Auction Info</th>
                                    <th className="px-6 py-4 font-medium min-w-40">Winning Details</th>
                                    <th className="px-6 py-4 font-medium min-w-55 text-center">Payment Status</th>
                                    <th className="px-6 py-4 font-medium min-w-50">Next Step</th>
                                    <th className="px-6 py-4 font-medium  min-w-50">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {orders.length > 0 ? (
                                    orders.map((order, index) => {
                                        const v = order.vehicleId;

                                        return (
                                            <tr key={order._id || index} className="hover:bg-gray-50">

                                                {/* Vehicle Details */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        {v?.images?.[0]?.url ? (
                                                            <img
                                                                src={v.images[0].url}
                                                                alt={`${v?.year || ''} ${formatLabel(v?.make)} ${formatLabel(v?.model)}`}
                                                                className="w-20 h-14 object-cover rounded"
                                                            />
                                                        ) : (
                                                            <div className="w-20 h-14 rounded bg-slate-100 flex items-center justify-center">
                                                                <Truck className="w-6 h-6 text-slate-400" />
                                                            </div>
                                                        )}

                                                        <div>
                                                            <h3 className="font-bold text-[#0B1E3D] text-sm">
                                                                {v?.year || 'N/A'} {formatLabel(v?.make)} {formatLabel(v?.model)}
                                                            </h3>
                                                            <p className="text-xs text-gray-500">
                                                                {order.listingId || 'N/A'}
                                                            </p>
                                                            <p className="text-xs text-gray-700">
                                                                {v?.mileage != null ? `${v.mileage.toLocaleString()} KM` : 'N/A'}
                                                                {' • '}{formatLabel(v?.transmission)}
                                                                {' • '}{formatLabel(v?.fuelType)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Auction Info */}
                                                <td className="px-6 py-4 text-sm text-[#0B1E3D]">
                                                    <p className="font-semibold">{order.orderId || 'N/A'}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {formatLabel(v?.emirate) || 'N/A'}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {order.createdAt ? formatDateTime(order.createdAt) : 'N/A'}
                                                    </p>
                                                </td>

                                                {/* Winning Details */}
                                                <td className="px-6 py-4 text-sm">
                                                    <span className="text-xs text-gray-500">{order.source === 'buy_now' ? "Purchse Price" : "Winning Bid"}</span>
                                                    <p className="font-bold text-[#0B1E3D] pb-2">
                                                        {formatPrice(order.amount ?? 0)}
                                                    </p>
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${order.source === 'buy_now'
                                                            ? 'bg-blue-50 text-blue-700'
                                                            : 'bg-amber-50 text-amber-700'
                                                        }`}>
                                                        {order.source === 'buy_now' ? 'Buy Now' : 'Auction Bid'}
                                                    </span>
                                                </td>

                                                {/* Payment Status */}
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1.5 items-center">
                                                        <span
                                                            className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider
                                                                ${order.status === 'paid'
                                                                    ? 'bg-emerald-50 text-emerald-600'
                                                                    : order.status === 'pending_payment'
                                                                        ? 'bg-amber-50 text-[#D97706]'
                                                                        : order.status === 'expired'
                                                                            ? 'bg-slate-100 text-slate-600'
                                                                            : 'bg-red-50 text-red-600'
                                                                }`}
                                                        >
                                                            {order.status === 'paid'
                                                                ? 'Payment Completed'
                                                                : order.status === 'pending_payment'
                                                                    ? 'Payment Pending'
                                                                    : order.status === 'expired'
                                                                        ? 'Payment Expired'
                                                                        : formatLabel(order.status) || 'Unknown'}
                                                        </span>

                                                        <span className="text-xs text-slate-500">
                                                            {order.status === 'paid'
                                                                ? `Paid on ${order.paidAt ? formatDateTime(order.paidAt) : 'N/A'}`
                                                                : order.status === 'pending_payment'
                                                                    ? `Due by ${order.paymentDueAt ? formatDateTime(order.paymentDueAt) : 'N/A'}`
                                                                    : order.status === 'expired'
                                                                        ? `Expired ${order.expiredAt ? formatDateTime(order.expiredAt) : ''}`
                                                                        : 'No payment details available'}
                                                        </span>

                                                        {order.status === 'pending_payment' && (
                                                            <button
                                                                onClick={() => handlePay(order._id)}
                                                                disabled={isPending}
                                                                className="text-xs font-semibold text-[#D97706] hover:text-amber-700 transition-colors disabled:opacity-50"
                                                            >
                                                                {isPending && payingId === order._id
                                                                    ? 'Opening...'
                                                                    : 'Pay Now →'}
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Next Step */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-start gap-3">
                                                        <div className="text-[#0B1E3D] mt-0.5 shrink-0">
                                                            {order.status === 'pending_payment'
                                                                ? <CreditCard size={20} />
                                                                : <Truck size={20} />}
                                                        </div>

                                                        <div>
                                                            <p className="text-[13px] font-semibold text-[#0B1E3D] leading-tight">
                                                                {order.status === 'pending_payment' ? (
                                                                    <>Complete<br />payment</>
                                                                ) : order.status === 'expired' ? (
                                                                    <>Payment<br />window ended</>
                                                                ) : order.handover?.status === 'confirmed' ? (
                                                                    <>Vehicle<br />handed over</>
                                                                ) : order.status === 'paid' ? (
                                                                    <>Waiting for<br />handover</>
                                                                ) : (
                                                                    <>Check order<br />status</>
                                                                )}
                                                            </p>

                                                            <button
                                                                onClick={() => {
                                                                    setSelectedVehicleId(order._id);
                                                                    setCurrentPage('won-auctions-detail');
                                                                }}
                                                                className="mt-1 text-xs font-semibold text-[#D97706] hover:text-amber-700 transition-colors"
                                                            >
                                                                View Details
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Actions */}
                                                <td className="px-6 py-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedVehicleId(order._id);
                                                            setCurrentPage('won-auctions-detail');
                                                        }}
                                                        className="px-4 py-2 text-[14px] font-semibold text-[#D97706] border border-[#D97706] rounded-lg hover:bg-[#D97706] hover:text-white transition-all duration-300"
                                                    >
                                                        View Details
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                                                    <Trophy className="h-7 w-7 text-slate-400" />
                                                </div>

                                                <h3 className="text-sm font-bold text-slate-600">
                                                    {activeTab === 'All Won'
                                                        ? 'No Won Auctions Yet'
                                                        : `No ${activeTab} Orders`}
                                                </h3>

                                                <p className="mt-2 max-w-sm text-xs text-slate-500">
                                                    {activeTab === 'All Won'
                                                        ? "You haven't won any auctions yet. Your winning vehicles will appear here."
                                                        : `You don't have any orders with ${activeTab.toLowerCase()} status right now.`}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between gap-4 px-5 py-4 mt-5 ">
                            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
                                <span>Page</span>

                                <span className="inline-flex items-center justify-center min-w-7 h-7 px-2 rounded-lg bg-slate-50 border border-slate-100 font-bold text-[#0B1E3D]">
                                    {page}
                                </span>

                                <span>of</span>

                                <span className="font-semibold text-[#0B1E3D]">
                                    {totalPages}
                                </span>
                            </div>

                            {/* Pagination */}
                            <div className="flex items-center gap-1.5 mx-auto sm:mx-0 sm:ml-auto">
                                <button
                                    type="button"
                                    onClick={() => setPage((p) => p - 1)}
                                    disabled={page === 1}
                                    className=" h-9 px-3.5 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-xs font-semibold text-[#0B1E3D] hover:bg-slate-50 hover:border-[#0B1E3D] disabled:opacity-35 disabled:cursor-not-allowed transition-all duration-200"
                                >
                                    Previous
                                </button>

                                <div className="flex items-center gap-1">
                                    {getPaginationRange(page, totalPages).map((num, idx) =>
                                        num === "..." ? (
                                            <span
                                                key={`dot-${idx}`}
                                                className=" w-8 h-9 flex items-center justify-center text-xs font-semibold text-slate-400"
                                            >
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
                                                    }`}
                                            >
                                                {num}
                                            </button>
                                        )
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setPage((p) => p + 1)}
                                    disabled={page === totalPages}
                                    className=" h-9 px-3.5 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-xs font-semibold text-[#0B1E3D] hover:bg-slate-50 hover:border-[#0B1E3D] disabled:opacity-35 disabled:cursor-not-allowed transition-all duration-200"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-4 flex flex-col gap-6">

                    {/* summary card */}
                    <div className="w-full max-w-sm bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">

                        {/* Header */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-[#D97706]/10 rounded-lg">
                                <Trophy className="text-[#D97706]" size={20} />
                            </div>
                            <h2 className="text-lg font-bold text-[#0B1E3D]">Summary</h2>
                        </div>

                        {/* Main List */}
                        <div className="space-y-4 mb-6">
                            {summaryData.map((item, index) => (
                                <div key={index} className="flex justify-between items-center text-sm">
                                    <span className="text-slate-600">{item.label}</span>
                                    <span className="font-semibold text-[#0B1E3D]">{item.value}</span>
                                </div>
                            ))}
                        </div>

                        {/* Divider */}
                        <div className="border-t border-slate-100 my-4" />

                        {/* Financials */}
                        <div className="space-y-4 mb-6">
                            {financialData.map((item, index) => (
                                <div key={index} className="flex justify-between items-center text-sm">
                                    <span className="text-slate-600 font-medium">{item.label}</span>
                                    <span className="font-bold text-[#0B1E3D]">{item.value}</span>
                                </div>
                            ))}
                        </div>

                        {/* Action Button */}
                        <button
                        onClick={() => setCurrentPage('payments')}
                        className="w-full py-2 rounded-xl border-2 border-[#D97706] text-sm text-[#D97706] font-bold hover:bg-[#0B1E3D] hover:text-white transition-all duration-300">
                            View Payments
                        </button>
                    </div>

                    {/* card */}
                    <div className="w-full">

                        {/* Action List */}
                        <div className='bg-white border border-slate-100 rounded-2xl p-6 shadow-sm'>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-[#0B1E3D]/5 rounded-lg">
                                    <ClipboardList className="text-[#0B1E3D]" size={20} />
                                </div>
                                <h2 className="text-lg font-bold text-[#0B1E3D]">Need to Do</h2>
                            </div>

                            <div className="space-y-6">
                                {actions.map((action, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className={`p-2.5 rounded-full h-fit ${action.color}`}>
                                            <action.icon size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center">
                                                <h3 className="text-sm font-bold text-[#0B1E3D]">{action.title}</h3>
                                                {action.badge && (
                                                    <span className="bg-[#D97706]/10 text-[#D97706] text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                        {action.badge}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1">{action.desc}</p>
                                            <button className="text-xs font-semibold text-[#0B1E3D] hover:text-[#D97706] mt-2 flex items-center gap-1 transition-colors">
                                                {action.link} →
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Help Section */}
                        <div className='mt-5'>
                            <BuyerContactSupport />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default BuyerWonAuctions;
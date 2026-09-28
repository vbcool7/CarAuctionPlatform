
import React, { useState } from 'react';
import { Download, BadgeCheck, BarChart3, TrendingUp, Bell, Briefcase, FileText, } from 'lucide-react';

import BuyerContactSupport from '../BuyerSharedComponents/BuyerContactSupport';
import { useGetLostAuctions } from '../../../hook/useAuction';
import { formatLabel, formatPrice } from '../../../utils/formatters';
import { getPaginationRange } from '../../utils/getPaginationRange';

const tips = [
    { icon: Bell, title: 'Set Higher Alerts', desc: 'Get notified for similar vehicles.' },
    { icon: Briefcase, title: 'Research Market Value', desc: 'Know the right price range.' },
    { icon: FileText, title: 'Bid at the Right Time', desc: 'Last-minute bids can increase your chances.' },
];

const tabs = [
    { name: 'all', label: 'All Lost', },
    { name: 'outbid', label: 'Outbid', },
    { name: 'reserve-not-met', label: 'Reserve Not Met', },
];

function BuyerLostAuctions({ setSelectedLostId, setCurrentPage }) {

    const [activeTab, setActiveTab] = useState('all');
    const [page, setPage] = useState(1);

    const { data: getLostAuctions, isLoading, isError } = useGetLostAuctions({ tab: activeTab, page, limit: 10, });

    const auctions = getLostAuctions?.lostAuctions || [];
    const totalPages = getLostAuctions?.pagination?.totalPages || 1;
    const totalCount = getLostAuctions?.pagination?.totalCount || 0;
    const summary = getLostAuctions?.summary || {};
    const limit = 10;

    // summary card
    const summaryData = [
        { label: 'Total Lost', value: summary.totalLost || 0 },
        { label: 'Outbid', value: summary.outbid || 0 },
        { label: 'Win Rate', value: `${summary.winRate || 0}%` },
        { label: 'Total Bids Placed', value: summary.totalBidsPlaced || 0 },
        { label: 'Total Amount Bid', value: `AED ${(summary.totalAmountBid || 0).toLocaleString()}` },
    ];

    if (isLoading) return <p className="p-10 text-center">Loading auctions....</p>;
    if (isError) return <p className="p-10 text-center text-red-500">Failed to load auctions list</p>;

    return (
        <div>
            <div className='pb-7'>
                <h1 className='text-slate-800 text-xl md:text-2xl font-bold'>Lost Auctions</h1>
                <p className='pt-1 text-gray-600 text-[12px] md:text-sm font-medium'>Auctions you didn't win, keep watching and bid again.</p>
            </div>

            {/* Tabs */}
            <div className="flex justify-between items-end border-b border-slate-200 mb-6 overflow-x-auto no-scrollbar">
                <div className="flex gap-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.name}
                            onClick={() => {
                                setActiveTab(tab.name);
                                setPage(1)
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

                {/* table */}
                <div className="lg:col-span-8">
                    <div className='w-full'>

                        {/* top heading */}
                        <div className="pb-5">
                            <p className="text-[12px] md:text-sm text-slate-500 font-medium">
                               Showing {totalCount ? (page - 1) * limit + 1 : 0} – {Math.min(page * limit, totalCount)} of {totalCount} auctions
                            </p>
                        </div>

                        {/* table */}
                        <div className="w-full overflow-x-auto bg-white border border-gray-200 rounded-lg">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-xs text-gray-800 uppercase bg-gray-100 border-b border-gray-200">
                                        <th className="px-6 py-4 font-medium min-w-80">Vehicle Details</th>
                                        <th className="px-6 py-4 font-medium min-w-60">Auction Info</th>
                                        <th className="px-6 py-4 font-medium min-w-40">Your Bid</th>
                                        <th className="px-6 py-4 font-medium min-w-50">Winning Bid</th>
                                        <th className="px-6 py-4 font-medium min-w-40">Result</th>
                                        <th className="px-6 py-4 font-medium  min-w-40">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100">
                                    {auctions.map((item, index) => (
                                        <tr
                                            key={item.vehicleId || index}
                                            className="hover:bg-gray-50">

                                            {/* Vehicle Details */}
                                            <td className="px-6 py-4 flex items-center gap-4">
                                                <img
                                                    src={item.images?.[0]?.url || null}
                                                    alt={formatLabel(item.model) || "Vehicle"}
                                                    className="w-20 h-14 object-cover rounded" />
                                                <div>
                                                    <h3 className="font-bold text-[#0B1E3D] text-sm">
                                                        {`${item.year || ""} ${formatLabel(item.make)} ${formatLabel(item.model)}`}
                                                    </h3>
                                                    <p className="text-xs text-gray-500">{item.listingId}</p>
                                                    <p className="text-xs text-gray-700">
                                                        {item.mileage} KM • {formatLabel(item.transmission)} • {formatLabel(item.fuelType)}
                                                    </p>
                                                </div>
                                            </td>

                                            {/* Auction Info */}
                                            <td className="px-6 py-4 text-sm text-[#0B1E3D]">
                                                <p className="font-semibold flex items-center gap-1">
                                                    {item.sellerBusinessName || "Not Applicable"}
                                                    <BadgeCheck className="text-blue-600" size={16} fill="#2563eb" stroke="white" />
                                                </p>
                                                <p className="text-xs text-gray-500">{formatLabel(item.emirate)} {formatLabel(item.city)}</p>
                                                {/* <p className="text-xs text-gray-500">{vehicle.date || "May 20, 2024 • 11:00 AM GST"}</p> */}
                                            </td>

                                            {/* your bid */}
                                            <td className="px-6 py-4 text-sm">
                                                <span className='text-sm text-slate-700 font-bold'>{formatPrice(item.yourBid)}</span>
                                            </td>

                                            {/* winning bid */}
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-[#0B1E3D]">{formatPrice(item.winningBid)}</p>
                                                {item.auctionStatus === 'sold' && (
                                                    <p className="text-xs text-gray-500 pt-px">
                                                        by another bidder
                                                    </p>
                                                )}
                                            </td>

                                            {/* result */}
                                            <td className="px-6 py-4">
                                                <span className="text-[11px] font-bold text-red-500 bg-red-100/80 px-2 py-1 rounded">
                                                    {item.resultLabel}
                                                </span>

                                                {item.auctionStatus === 'sold' && (
                                                    <p className="text-xs text-gray-500 pt-px">
                                                        You were outbid
                                                    </p>
                                                )}
                                            </td>

                                            {/* action btn */}
                                            <td className="px-6 py-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedLostId(item.vehicleId);
                                                        setCurrentPage('lost-auctions-detail');
                                                    }}
                                                    className="px-3 py-1.5 text-xs font-semibold text-[#D97706] border border-[#D97706] rounded-md hover:bg-[#D97706] hover:text-white transition-colors duration-200"
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between gap-4 px-5 py-4 mt-5 ">

                                {/* Page Info */}
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

                                    {/* Previous */}
                                    <button
                                        type="button"
                                        onClick={() => setPage((p) => p - 1)}
                                        disabled={page === 1}
                                        className=" h-9 px-3.5 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-xs font-semibold text-[#0B1E3D] hover:bg-slate-50 hover:border-[#0B1E3D] disabled:opacity-35 disabled:cursor-not-allowed transition-all duration-200"
                                    >
                                        Previous
                                    </button>

                                    {/* Page Numbers */}
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

                                    {/* Next */}
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
                </div>

                <div className="lg:col-span-4 flex flex-col gap-6">

                    {/* summary card */}
                    <div className="w-full max-w-sm bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">

                        <div className="flex items-center gap-3 mb-6">
                            <BarChart3 className="text-[#0B1E3D]" size={20} />
                            <h2 className="text-lg font-bold text-[#0B1E3D]">Summary</h2>
                        </div>

                        <div className="space-y-5">
                            {summaryData.map((item, index) => (
                                <div key={index} className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-600">{item.label}</span>
                                    <span className="text-sm font-bold text-[#0B1E3D]">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* tips */}
                    <div className="w-full space-y-6">
                        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <TrendingUp className="text-[#0B1E3D]" size={24} />
                                <h2 className="text-lg font-bold text-[#0B1E3D]">Keep Improving!</h2>
                            </div>
                            <p className="text-sm text-slate-500 mb-6">
                                You're getting there! Here are some tips to help you win more auctions.
                            </p>

                            <div className="space-y-6">
                                {tips.map((tip, index) => (
                                    <div key={index} className="flex gap-4">
                                        <div className="shrink-0 w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                                            <tip.icon className="text-[#D97706]" size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-[#0B1E3D]">{tip.title}</h3>
                                            <p className="text-xs text-slate-500 mt-0.5">{tip.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bottom Card: Need Help */}
                        <BuyerContactSupport />
                    </div>
                </div>

            </div>
        </div>
    )
}

export default BuyerLostAuctions;
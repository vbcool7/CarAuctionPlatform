
import React, { useState } from 'react';
import { Download, BadgeCheck, Gavel } from 'lucide-react';
import { vehicles } from '../../Data';

import BuyerMyBidsFilter from './BuyerMyBidsFilter';
import { useGetMyBids } from '../../../hook/useBid';
import { getPaginationRange } from '../../utils/getPaginationRange';

export const getAuctionStatusStyle = (status) => {
    switch (status) {
        case 'upcoming':
            return 'text-blue-600';

        case 'live':
            return 'text-green-600';

        case 'sold':
            return 'text-emerald-600';

        case 'unsold':
            return 'text-orange-600';

        case 'reserve-not-met':
            return 'text-red-600';

        case 'canceled':
            return 'text-gray-500';

        default:
            return 'text-[#0B1E3D]';
    }
};

function BuyerMyBids({ setCurrentPage, setSelectedBidId, setPreviousPage }) {

    const [activeTab, setActiveTab] = useState('all');
    const [page, setPage] = useState(1);

    const { data: myBids, isLoading, isError, isPlaceholderData } = useGetMyBids({ page, limit: 10, status: activeTab });

    const totalPages = myBids?.pagination?.totalPages || 1;
    const limit = 10;

    const tabs = [
        { key: 'all', label: 'All', count: myBids?.tabCounts?.all || 0 },
        { key: 'active', label: 'Active Bids', count: myBids?.tabCounts?.active || 0 },
        { key: 'won', label: 'Won', count: myBids?.tabCounts?.won || 0 },
        { key: 'outbid', label: 'Outbid', count: myBids?.tabCounts?.outbid || 0 },
        { key: 'withdrawn', label: 'Withdrawn', count: myBids?.tabCounts?.withdrawn || 0 },
        { key: 'canceled', label: 'Canceled', count: myBids?.tabCounts?.canceled || 0 },
    ];

    if (isLoading) return <p className="p-10 text-center">Loading my bids list....</p>;
    if (isError) return <p className="p-10 text-center text-red-500">Failed to load bids list</p>;

    return (
        <div className='pb-6'>
            <div className='pb-7'>
                <h1 className='text-slate-800 text-xl md:text-2xl font-bold'>My Bids</h1>
                <p className='pt-1 text-gray-600 text-[12px] md:text-sm font-medium'>Track and manage all the auctions you've placed ids on.</p>
            </div>

            {/* tabs */}
            <div className="flex justify-between items-end border-b border-slate-200 mb-6 overflow-x-auto no-scrollbar">

                <div className="flex gap-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => {
                                setActiveTab(tab.key);
                                setPage(1);
                            }}
                            className={`pb-4 text-[13px] md:text-sm font-semibold transition-all relative whitespace-nowrap
                                ${activeTab === tab.key
                                    ? 'text-[#0B1E3D]'
                                    : 'text-slate-400 hover:text-[#0B1E3D]'
                                }`}
                        >
                            {tab.label}
                            <span className="ml-1 text-xs font-medium">
                                ({tab.count})
                            </span>

                            {activeTab === tab.key && (
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

                {/* left */}
                <div className="lg:col-span-8">

                    <div className='w-full'>

                        <p className="text-[12px] md:text-sm text-slate-500 font-medium pb-5">
                            Showing {(page - 1) * limit + 1} – {Math.min(page * limit, myBids?.pagination?.totalCount || 0)} of {myBids?.pagination?.totalCount || 0} bids
                        </p>

                        {/* table */}
                        <div className="w-full overflow-x-auto bg-white border border-gray-200 rounded-lg">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-xs text-gray-800 uppercase bg-gray-100 border-b border-gray-200">
                                        <th className="px-6 py-4 font-medium min-w-35">Bid ID</th>
                                        <th className="px-6 py-4 font-medium min-w-80">Vehicle Details</th>
                                        <th className="px-6 py-4 font-medium min-w-60">Auction Info</th>
                                        <th className="px-6 py-4 font-medium min-w-55">My Bids</th>
                                        <th className="px-6 py-4 font-medium min-w-40">Status</th>
                                        <th className="px-6 py-4 font-medium min-w-45">Time Left</th>
                                        <th className="px-6 py-4 font-medium  min-w-40">Actions</th>
                                    </tr>
                                </thead>

                                <tbody
                                    className={`divide-y divide-gray-100 transition-opacity ${isPlaceholderData
                                        ? 'opacity-50 pointer-events-none'
                                        : ''
                                        }`}
                                >
                                    {myBids?.bids?.length > 0 ? (
                                        myBids.bids.map((bid, index) => (
                                            <tr
                                                key={bid._id || index}
                                                className="hover:bg-gray-50"
                                            >
                                                {/* bid id */}
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {bid.bidId || '—'}
                                                </td>

                                                {/* Vehicle Details */}
                                                <td className="px-6 py-4 flex items-center gap-4">
                                                    <img
                                                        src={bid.vehicleId?.images?.[0]?.url || '/placeholder-car.jpg'}
                                                        alt={bid.vehicleId?.model || 'Vehicle'}
                                                        className="w-20 h-14 object-cover rounded"
                                                    />

                                                    <div>
                                                        <h3 className="font-bold text-[#0B1E3D] text-sm">
                                                            {bid.vehicleId?.year || '—'}{' '}
                                                            {bid.vehicleId?.make || ''}{' '}
                                                            {bid.vehicleId?.model || ''}
                                                        </h3>

                                                        <p className="text-xs text-gray-500">
                                                            Listing ID: {bid.vehicleId?.listingId || '—'}
                                                        </p>

                                                        <p className="text-xs text-gray-700">
                                                            {bid.vehicleId?.mileage || '—'} KM •{' '}
                                                            {bid.vehicleId?.transmission || '—'} •{' '}
                                                            {bid.vehicleId?.fuelType || '—'}
                                                        </p>
                                                    </div>
                                                </td>

                                                {/* Auction Info */}
                                                <td className="px-6 py-4 text-sm text-[#0B1E3D]">
                                                    <p className="font-semibold flex items-center gap-1">
                                                        {bid.vehicleId?.sellerId?.businessName || '—'}

                                                        {bid.vehicleId?.sellerId?.businessName && (
                                                            <BadgeCheck
                                                                className="text-blue-600"
                                                                size={16}
                                                                fill="#2563eb"
                                                                stroke="white"
                                                            />
                                                        )}
                                                    </p>

                                                    <p className="text-xs text-gray-500">
                                                        {bid.vehicleId?.emirate || '—'}{' '}
                                                        {bid.vehicleId?.city || ''}
                                                    </p>

                                                    <p className="text-xs text-gray-500">
                                                        Seller since{' '}
                                                        {bid.vehicleId?.sellerId?.createdAt
                                                            ? new Date(
                                                                bid.vehicleId.sellerId.createdAt
                                                            ).toLocaleDateString('en-US', {
                                                                month: 'short',
                                                                year: 'numeric',
                                                                timeZone: 'Asia/Dubai',
                                                            })
                                                            : '—'}
                                                    </p>
                                                </td>

                                                {/* My Bid */}
                                                <td className="px-6 py-4 text-sm">
                                                    <p className="text-[12px] text-gray-500 mt-1">
                                                        My Bid
                                                    </p>

                                                    <p
                                                        className={`text-sm font-bold ${bid.status === 'won'
                                                            ? 'text-green-600'
                                                            : 'text-[#0B1E3D]'
                                                            }`}
                                                    >
                                                        AED {bid.amount?.toLocaleString() || '0'}
                                                    </p>

                                                    <p className="text-[12px] text-gray-500">
                                                        Reserve: AED{' '}
                                                        {bid.vehicleId?.reservePrice?.toLocaleString() || '0'}
                                                    </p>

                                                    {bid.status === 'outbid' && (
                                                        <p className="text-[12px] text-amber-600 font-medium mt-1">
                                                            Current Highest: AED{' '}
                                                            {bid.vehicleId?.currentBid?.toLocaleString() || '0'}
                                                        </p>
                                                    )}
                                                </td>

                                                {/* Status */}
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-flex px-2 py-1 rounded-md text-[11px] font-semibold
                            ${bid.status === 'active'
                                                                ? 'bg-green-100 text-green-600'
                                                                : bid.status === 'outbid'
                                                                    ? 'bg-red-100 text-red-600'
                                                                    : bid.status === 'won'
                                                                        ? 'bg-green-100 text-green-600'
                                                                        : bid.status === 'withdrawn'
                                                                            ? 'bg-orange-100 text-orange-700'
                                                                            : bid.status === 'canceled'
                                                                                ? 'bg-gray-100 text-gray-600'
                                                                                : 'bg-gray-100 text-gray-500'
                                                            }`}
                                                    >
                                                        {bid.status === 'active'
                                                            ? 'Highest Bid'
                                                            : bid.status === 'outbid'
                                                                ? 'Outbid'
                                                                : bid.status === 'won'
                                                                    ? 'Won'
                                                                    : bid.status === 'withdrawn'
                                                                        ? 'Withdrawn'
                                                                        : bid.status === 'canceled'
                                                                            ? 'Canceled'
                                                                            : bid.status || 'N/A'}
                                                    </span>
                                                </td>

                                                {/* Time Left */}
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p
                                                            className={`text-xs font-semibold ${getAuctionStatusStyle(
                                                                bid.vehicleId?.auctionStatus
                                                            )}`}
                                                        >
                                                            {bid.vehicleId?.auctionStatus === 'reserve-not-met'
                                                                ? 'Reserve Not Met'
                                                                : bid.vehicleId?.auctionStatus
                                                                    ? bid.vehicleId.auctionStatus
                                                                        .charAt(0)
                                                                        .toUpperCase() +
                                                                    bid.vehicleId.auctionStatus.slice(1)
                                                                    : 'N/A'}
                                                        </p>

                                                        {bid.vehicleId?.auctionEndDateTime ? (
                                                            <>
                                                                <p className="text-[12px] text-gray-700 mt-1">
                                                                    {new Date(
                                                                        bid.vehicleId.auctionEndDateTime
                                                                    ).toLocaleDateString('en-US', {
                                                                        month: 'short',
                                                                        day: 'numeric',
                                                                        year: 'numeric',
                                                                        timeZone: 'Asia/Dubai',
                                                                    })}
                                                                </p>

                                                                <p className="text-[12px] text-gray-500">
                                                                    {new Date(
                                                                        bid.vehicleId.auctionEndDateTime
                                                                    ).toLocaleTimeString('en-US', {
                                                                        hour: '2-digit',
                                                                        minute: '2-digit',
                                                                        timeZone: 'Asia/Dubai',
                                                                    })}
                                                                </p>
                                                            </>
                                                        ) : (
                                                            <p className="text-[12px] text-gray-400 mt-1">
                                                                No end time
                                                            </p>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Actions */}
                                                <td className="px-6 py-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedBidId(bid._id);
                                                            setCurrentPage('bids-detail')
                                                        }}
                                                        className="inline-flex items-center justify-center px-3.5 py-2 text-[12px] md:text-[13px] font-semibold text-[#D97706] bg-[#D97706]/5 border border-[#D97706]/30 rounded-lg hover:bg-[#D97706] hover:text-white hover:border-[#D97706] transition-all duration-200 active:scale-95 whitespace-nowrap"
                                                    >
                                                        View Auction
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={7}
                                                className="px-6 py-16 text-center"
                                            >
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                                                        <Gavel
                                                            size={22}
                                                            className="text-slate-400"
                                                        />
                                                    </div>

                                                    <h3 className="text-sm font-semibold text-[#0B1E3D]">
                                                        No bids found
                                                    </h3>

                                                    <p className="text-xs text-slate-500 mt-1">
                                                        You don't have any bids matching the selected tab filter.
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
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

                {/* right */}
                <div className="lg:col-span-4 flex flex-col gap-6">

                    {/* filter side bar */}
                    <BuyerMyBidsFilter />

                    {/* about card */}
                    <div className="bg-white border border-slate-100 rounded-xl p-6 flex items-start gap-4 shadow-sm">
                        <div className="p-3 bg-amber-50 rounded-lg shrink-0">
                            <Gavel className="text-[#D97706] w-6 h-6" />
                        </div>

                        <div>
                            <h2 className="text-lg font-bold text-[#0B1E3D] mb-1">About Bids</h2>
                            <p className="text-sm text-slate-500 leading-relaxed font-semibold">
                                Here you can track all your active bids, check if you are the highest bidder,
                                and manage your participation in auctions.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default BuyerMyBids
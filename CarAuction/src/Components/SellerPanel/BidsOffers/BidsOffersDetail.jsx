
import React, { useState } from 'react';
import { CarFront, ChevronDown, ChevronLeft, ChevronRight, CircleDollarSign, CircleX, Clock3, Eye, Fingerprint, Gavel, Mail, Tag, User } from 'lucide-react';

import { useGetMyBidDetail } from '../../../hook/useBid';
import { formatPrice, formatDateTime, formatLabel } from '../../../utils/formatters';

const BID_PAGE_SIZE_OPTIONS = [5, 10, 20];

const STATUS_STYLES = {
    won: "bg-green-100 text-green-700",
    active: "bg-green-100 text-green-700",
    outbid: "bg-red-100 text-red-600",
    withdrawn: "bg-orange-100 text-orange-700",
    canceled: "bg-gray-100 text-gray-600",
};

const getBidderDisplay = (bidderType, bidder) => ({
    name:
        bidderType === "Buyer"
            ? `${bidder?.firstName || ""} ${bidder?.lastName || ""}`.trim() || "Unknown"
            : bidder?.fullName || "Unknown",
});

function BidsOffersDetail({ bidsOfferId, setCurrentPage }) {

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const { data, isLoading, isError } = useGetMyBidDetail(bidsOfferId, page, pageSize);

    const bid = data?.bid;
    const vehicle = data?.vehicle;
    const bids = data?.bids || [];
    const pagination = data?.pagination;

    if (isLoading) return <p className="p-10 text-center">Loading bid details....</p>;
    if (isError) return <p className="p-10 text-center text-red-500">Failed to load bid details</p>;

    const totalBids = pagination?.totalBids ?? bids.length;
    const totalPages = pagination?.totalPages ?? 1;
    const showingFrom = totalBids === 0 ? 0 : (page - 1) * pageSize + 1;
    const showingTo = Math.min(page * pageSize, totalBids);

    const isHighestBidder = bid?.status === "active" && vehicle?.currentBid === bid?.amount;
    const isWon = bid?.status === "won";
    const isCanceledOrWithdrawn = ["canceled", "withdrawn"].includes(bid?.status);
    const canStillBid = ["active", "outbid"].includes(vehicle?.auctionStatus === "live" ? bid?.status : "");

    const priceLabel = vehicle?.priceType === "reserve_price" ? "Reserve Price" : "Buy Now Price";
    const priceValue =
        vehicle?.priceType === "reserve_price" ? vehicle?.reservePrice : vehicle?.buyNowPrice;

    const goToPage = (p) => setPage(Math.min(Math.max(1, p), totalPages));

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) {
            pageNumbers.push(i);
        } else if (pageNumbers[pageNumbers.length - 1] !== "...") {
            pageNumbers.push("...");
        }
    }

    return (
        <div className='pb-6 space-y-6'>

            {/* back link */}
            <button
                onClick={() => setCurrentPage('bids-offers')}
                className='flex items-center gap-1 text-xs md:text-sm text-gray-500 hover:text-[#0B1E3D]'
            >
                ← Back to Bids & Offers
            </button>

            {/* header */}
            <div className='w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0'>
                <div className='flex flex-col'>
                    <h1 className='text-xl md:text-2xl font-bold'>Bid Details</h1>
                    <p className='text-sm text-gray-600 p-px wrap-break-word'>
                        View complete information about the bid and vehicle
                    </p>
                </div>

                <div className="">
                    <button
                        onClick={() => setCurrentPage('my-vehicles')}
                        className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-[#D97706] hover:text-[#D97706] hover:bg-amber-50">
                        <Eye size={16} />
                        <span className="text-sm">View Vehicle</span>
                    </button>
                </div>
            </div>

            {/* content */}
            <div className="grid grid-cols-1 xl:grid-cols-3 pb-6 gap-6 items-start">

                {/* ================== LEFT SIDE ================== */}
                <div className="lg:col-span-2 space-y-6">

                    {/* auction summary */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4">

                        <div className="flex items-center gap-3 pb-3 border-b border-gray-100">

                            <img
                                src={vehicle?.images?.[0]?.url || "https://via.placeholder.com/300x220?text=No+Image"}
                                alt={`${vehicle?.year || ''} ${vehicle?.make || ''} ${vehicle?.model || ''}`}
                                className="w-32 h-22 object-cover rounded-lg shrink-0"
                            />

                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-lg font-bold text-[#0B1E3D] truncate">
                                        {vehicle?.year} {vehicle?.make} {vehicle?.model}
                                    </h2>

                                    <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[11px] font-semibold shrink-0 capitalize">
                                        {vehicle?.auctionStatus || '—'}
                                    </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">

                                    <div className="flex items-center gap-1">
                                        <Tag className="w-3.5 h-3.5 text-gray-400" />
                                        <span className="text-[12px] text-gray-400">
                                            Listing ID
                                        </span>
                                        <span className="text-[12px] font-medium text-[#0B1E3D]">
                                            {vehicle?.listingId || '—'}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <Fingerprint className="w-3.5 h-3.5 text-gray-400" />
                                        <span className="text-[12px] text-gray-400">
                                            VIN
                                        </span>
                                        <span className="text-[12px] font-medium text-[#0B1E3D]">
                                            {vehicle?.vin || '—'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Auction Stats */}
                        <div className="grid grid-cols-3 divide-x divide-gray-100 pt-3">

                            {/* Current Bid */}
                            <div className="pr-3">

                                <p className="text-[12px] text-gray-400 mb-1">
                                    Current Highest Bid
                                </p>

                                <p className="text-[16px] font-bold text-green-600">
                                    {vehicle?.currentBid != null ? formatPrice(vehicle.currentBid) : '—'}
                                </p>

                                <p className="text-[12px] text-gray-400 mt-1">
                                    {priceLabel}:{" "}
                                    <span className="text-gray-500">
                                        {priceValue != null ? formatPrice(priceValue) : '—'}
                                    </span>
                                </p>

                            </div>


                            {/* Auction Ends */}
                            <div className="px-3">

                                <p className="text-[12px] text-gray-400 mb-1">
                                    Auction Ends
                                </p>

                                <div className="flex items-center gap-1.5">
                                    <Clock3 className="w-3.5 h-3.5 text-gray-400 shrink-0" />

                                    <p className="text-[13px] font-semibold text-[#0B1E3D]">
                                        {vehicle?.auctionEndDateTime ? formatDateTime(vehicle.auctionEndDateTime) : '—'}
                                    </p>
                                </div>

                            </div>


                            {/* Status */}
                            <div className="pl-3">

                                <p className="text-[12px] text-gray-400 mb-1">
                                    Status
                                </p>

                                <span
                                    className={`inline-flex px-2 py-1 rounded-full text-[11px] font-semibold capitalize ${STATUS_STYLES[bid?.status] || 'bg-gray-100 text-gray-700'}`}
                                >
                                    {bid?.status || '—'}
                                </span>

                            </div>

                        </div>

                    </div>

                    {/* Bid History */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold text-[#0B1E3D]">
                                    Bid History
                                    <span className="text-gray-500 font-normal ml-1">
                                        (Total {totalBids} Bids)
                                    </span>
                                </h3>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-180">
                                    <thead>
                                        <tr className="bg-slate-50 border-y border-gray-100">
                                            <th className="text-left px-3 py-3 text-[13px] font-semibold text-[#0B1E3D]">#</th>
                                            <th className="text-left px-3 py-3 text-[13px] font-semibold text-[#0B1E3D]">Bidder</th>
                                            <th className="text-left px-3 py-3 text-[13px] font-semibold text-[#0B1E3D]">Bid Amount</th>
                                            <th className="text-left px-3 py-3 text-[13px] font-semibold text-[#0B1E3D]">Bid Time</th>
                                            <th className="text-left px-3 py-3 text-[13px] font-semibold text-[#0B1E3D]">Status</th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-100">
                                        {bids.length > 0 ? bids.map((item, index) => {
                                            const { name: bidderName } = getBidderDisplay(item?.bidderType, item?.bidder);

                                            return (
                                                <tr key={item?._id || item?.bidId} className="hover:bg-slate-50/50">

                                                    {/* Number */}
                                                    <td className="px-3 py-3 text-[12px] text-gray-500">
                                                        {(page - 1) * pageSize + index + 1}
                                                    </td>

                                                    {/* Bidder */}
                                                    <td className="px-3 py-3">
                                                        <div className="flex items-center gap-2">

                                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                                                <User className="w-4 h-4 text-gray-500" />
                                                            </div>

                                                            <div className="flex items-center gap-1.5">
                                                                <span className="text-[13px] font-medium text-[#0B1E3D]">
                                                                    {bidderName}
                                                                </span>

                                                                <span className={`px-1.5 py-0.5 rounded-full text-[11px] font-medium
                                                                    ${item.bidderType === 'Seller' ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"}`}>
                                                                    {item?.bidderType}
                                                                </span>
                                                            </div>

                                                        </div>
                                                    </td>

                                                    {/* Amount */}
                                                    <td className="px-3 py-3">
                                                        <span className="text-[13px] font-semibold text-green-600">
                                                            {formatPrice(item?.amount || 0)}
                                                        </span>
                                                    </td>

                                                    {/* Bid Time */}
                                                    <td className="px-3 py-3">
                                                        <div>
                                                            <p className="text-[13px] text-gray-600">
                                                                {item?.createdAt
                                                                    ? new Date(item.createdAt).toLocaleDateString('en-US', {
                                                                        timeZone: 'Asia/Dubai', month: 'short', day: '2-digit', year: 'numeric',
                                                                    })
                                                                    : '—'}
                                                            </p>

                                                            <p className="text-[12px] text-gray-400 mt-0.5">
                                                                {item?.createdAt
                                                                    ? new Date(item.createdAt).toLocaleTimeString('en-US', {
                                                                        timeZone: 'Asia/Dubai', hour: '2-digit', minute: '2-digit', hour12: true,
                                                                    })
                                                                    : ''}
                                                            </p>
                                                        </div>
                                                    </td>

                                                    {/* Status */}
                                                    <td className="px-3 py-3">
                                                        <span
                                                            className={`inline-flex px-2 py-1 rounded-full text-[10px] font-semibold capitalize 
                                                            ${STATUS_STYLES[item?.status] || 'bg-gray-100 text-gray-700'}`}>
                                                            {item?.status || '—'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        }) : (
                                            <tr>
                                                <td colSpan={6} className="py-10 text-center text-sm text-gray-500">
                                                    No bid history found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="flex items-center justify-between mt-4">
                                <p className="text-[12px] text-gray-500">Showing {showingFrom} to {showingTo} of {totalBids} bids</p>
                                <div className="flex items-center gap-1">

                                    <button
                                        onClick={() => goToPage(page - 1)}
                                        disabled={page === 1}
                                        className="w-7 h-7 rounded-md border border-gray-200 flex items-center justify-center text-gray-400 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        <ChevronLeft className="w-3.5 h-3.5" />
                                    </button>

                                    {pageNumbers.map((p, idx) =>
                                        p === "..." ? (
                                            <span key={`ellipsis-${idx}`} className="px-1 text-[10px] text-gray-400">...</span>
                                        ) : (
                                            <button
                                                key={p}
                                                onClick={() => goToPage(p)}
                                                className={`w-7 h-7 rounded-md text-[10px] font-medium ${p === page ? 'bg-[#D97706] text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                            >
                                                {p}
                                            </button>
                                        )
                                    )}

                                    <button
                                        onClick={() => goToPage(page + 1)}
                                        disabled={page === totalPages}
                                        className="w-7 h-7 rounded-md border border-gray-200 flex items-center justify-center text-gray-600 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        <ChevronRight className="w-3.5 h-3.5" />
                                    </button>

                                </div>

                                <select
                                    value={pageSize}
                                    onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-gray-200 text-[10px] text-gray-600 hover:bg-gray-50 outline-none"
                                >
                                    {BID_PAGE_SIZE_OPTIONS.map((size) => (
                                        <option key={size} value={size}>{size} / page</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================== RIGHT SIDE ================== */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-4">

                    {/* bid summary */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Gavel className="w-4 h-4 text-[#0B1E3D]" />
                            <h3 className="text-base font-semibold text-[#0B1E3D]">Bid Summary</h3>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Gavel className="w-3.5 h-3.5 text-gray-400" />
                                    <span className="text-xs text-gray-500">Current Highest Bid</span>
                                </div>
                                <span className="text-xs font-bold text-green-600">
                                    {vehicle?.currentBid != null ? formatPrice(vehicle.currentBid) : '—'}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CircleDollarSign className="w-3.5 h-3.5 text-gray-400" />
                                    <span className="text-xs text-gray-500">This Bid</span>
                                </div>
                                <span className="text-xs font-semibold text-[#0B1E3D]">
                                    {bid?.amount != null ? formatPrice(bid.amount) : '—'}
                                </span>
                            </div>

                            {/* Reserve / Buy Now Price */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Tag className="w-3.5 h-3.5 text-gray-400" />
                                    <span className="text-xs text-gray-500">{priceLabel}</span>
                                </div>
                                <span className="text-xs font-semibold text-[#0B1E3D]">
                                    {priceValue != null ? formatPrice(priceValue) : '—'}
                                </span>
                            </div>

                            {/* Auction Ends */}
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <Clock3 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                    <span className="text-xs text-gray-500">Auction Ends</span>
                                </div>
                                <span className="text-[11px] font-semibold text-[#0B1E3D] text-right">
                                    {vehicle?.auctionEndDateTime ? formatDateTime(vehicle.auctionEndDateTime) : '—'}
                                </span>
                            </div>

                            {/* Total Bids */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Gavel className="w-3.5 h-3.5 text-gray-400" />
                                    <span className="text-xs text-gray-500">Total Bids</span>
                                </div>
                                <span className="text-xs font-semibold text-[#0B1E3D]">
                                    {totalBids}
                                </span>
                            </div>
                        </div>

                        {/* Status message */}
                        {isHighestBidder && (
                            <div className="mt-4 px-3 py-2.5 rounded-md bg-green-50 text-center">
                                <p className="text-[11px] font-medium text-green-700">
                                    ✓ You are currently the highest bidder!
                                </p>
                            </div>
                        )}
                        {isWon && (
                            <div className="mt-4 px-3 py-2.5 rounded-md bg-green-50 text-center">
                                <p className="text-[11px] font-medium text-green-700">
                                    🏆 You won this auction!
                                </p>
                            </div>
                        )}
                        {bid?.status === 'outbid' && (
                            <div className="mt-4 px-3 py-2.5 rounded-md bg-red-50 text-center">
                                <p className="text-[11px] font-medium text-red-600">
                                    You've been outbid.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* vehicle details */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <CarFront className="w-4 h-4 text-[#0B1E3D]" />
                            <h3 className="text-base font-semibold text-[#0B1E3D]">Vehicle Details</h3>
                        </div>

                        <img
                            src={vehicle?.images?.[0]?.url || "https://via.placeholder.com/600x300?text=No+Image"}
                            alt={`${vehicle?.make || ''} ${vehicle?.model || ''}`}
                            className="w-full h-33 object-cover rounded-lg"
                        />

                        <div className="mt-4 space-y-2.5">
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-xs text-gray-500">VIN</span>
                                <span className="text-[11px] font-medium text-[#0B1E3D]">{vehicle?.vin || '—'}</span>
                            </div>


                            <div className="flex items-center justify-between gap-3">
                                <span className="text-xs text-gray-500">Make</span>
                                <span className="text-xs font-medium text-[#0B1E3D]">{formatLabel(vehicle?.make || '—')}</span>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <span className="text-xs text-gray-500">Model</span>
                                <span className="text-xs font-medium text-[#0B1E3D]">{formatLabel(vehicle?.model || '—')}</span>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <span className="text-xs text-gray-500">Year</span>
                                <span className="text-xs font-medium text-[#0B1E3D]">{vehicle?.year || '—'}</span>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <span className="text-xs text-gray-500">Body Type</span>
                                <span className="text-xs font-medium text-[#0B1E3D]">{formatLabel(vehicle?.bodyType || '—')}</span>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <span className="text-xs text-gray-500">Fuel Type</span>
                                <span className="text-xs font-medium text-[#0B1E3D]">{formatLabel(vehicle?.fuelType || '—')}</span>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <span className="text-xs text-gray-500">Transmission</span>
                                <span className="text-xs font-medium text-[#0B1E3D]">{formatLabel(vehicle?.transmission || '—')}</span>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <span className="text-xs text-gray-500">Drive Type</span>
                                <span className="text-xs font-medium text-[#0B1E3D]">{formatLabel(vehicle?.drivetrain || '—')}</span>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <span className="text-xs text-gray-500">Overall Condition</span>
                                <span className="text-xs font-medium text-[#0B1E3D]">{formatLabel(vehicle?.overallCondition || '—')}</span>
                            </div>

                        </div>

                        {/* Full Details Button */}
                        <button
                            onClick={() => setCurrentPage('my-vehicles')}
                            className="w-full mt-4 py-2.5 border border-gray-200 rounded-md text-[11px] font-medium bg-[#0B1E3D] text-gray-100 hover:bg-[#0B1E3D]/90 flex items-center justify-center gap-1.5"
                        >
                            <Eye className="w-3.5 h-3.5" />
                            View Full Vehicle Details
                        </button>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default BidsOffersDetail;
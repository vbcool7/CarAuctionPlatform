
import React from 'react';
import { ChevronRight, Eye, Copy, User, ChevronLeft, Phone, Mail, CarFront, CalendarDays, Fingerprint, Gavel, CircleDollarSign, Tag, Clock3 } from 'lucide-react';
import { useGetBidDetail } from '../../hooks/useBid';
import { formatDateTime, formatPrice, formatLabel } from '../utils/formatter';
import { useState } from 'react';

const getBidderDisplay = (bidderType, bidder) => ({
    name:
        bidderType === "Buyer"
            ? `${bidder?.firstName || ""} ${bidder?.lastName || ""}`.trim() || "Unknown"
            : bidder?.fullName || "Unknown",
    uniqueId:
        bidderType === "Buyer" ? bidder?.buyerId : bidder?.sellerId || "NA",
    image:
        bidderType === "Buyer" ? bidder?.profileImageUrl : bidder?.profileImage,
});

const BID_PAGE_SIZE_OPTIONS = [5, 10, 20];
const LOG_PREVIEW_COUNT = 7;

// timeline
const TERMINAL_LABELS = {
    sold: "Auction Sold",
    unsold: "Auction Unsold",
    "reserve-not-met": "Reserve Not Met",
    canceled: "Auction Canceled",
};

const getAuctionTimelineStages = (vehicle) => {
    const status = vehicle?.auctionStatus;
    const now = new Date();
    const startTime = vehicle?.auctionStartDateTime ? new Date(vehicle.auctionStartDateTime) : null;
    const endTime = vehicle?.auctionEndDateTime ? new Date(vehicle.auctionEndDateTime) : null;

    const isCanceled = status === "canceled";
    const isTerminal = ["sold", "unsold", "reserve-not-met", "canceled"].includes(status);

    // Stage 1: always done once the record exists
    const createdStage = {
        key: "created",
        label: "Auction Created",
        time: vehicle?.createdAt,
        done: true,
    };

    // Stage 2: merged "Started"/"Live" — done if status has moved past upcoming,
    const liveDone = isCanceled
        ? vehicle?.statusAtCancellation !== "upcoming" // it was live when canceled
        : status !== "upcoming" || (startTime && now >= startTime);
    const liveStage = {
        key: "live",
        label: "Live Auction",
        time: vehicle?.auctionStartDateTime,
        done: liveDone,
        current: !isTerminal && liveDone, // currently live, nothing after it done yet
    };

    // Stage 3: terminal — label/time changes based on how it actually ended
    const terminalStage = isCanceled
        ? {
            key: "terminal",
            label: TERMINAL_LABELS.canceled,
            time: vehicle?.canceledAt,
            done: true,
            variant: "canceled", // render grey/red instead of green
            extra: vehicle?.cancellationReason
                ? `Reason: ${vehicle.cancellationReason}`
                : null,
        }
        : {
            key: "terminal",
            label: TERMINAL_LABELS[status] || "Auction Ended",
            time: vehicle?.auctionEndDateTime,
            done: isTerminal,
            variant: isTerminal ? "done" : "pending",
        };

    return [createdStage, liveStage, terminalStage];
};

function BidManagementDetail({ bidId, setCurrentPage }) {

    const { data: bidDetail, isLoading, isError } = useGetBidDetail(bidId);

    const bid = bidDetail?.bid;
    const vehicle = bidDetail?.vehicle;
    const bids = bidDetail?.bids || [];

    // ---- bidder table pagination state (client-side, no new API call) ----
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // ---- logs expand/collapse state ----
    const [showAllLogs, setShowAllLogs] = useState(false);

    if (isLoading) return <p className="p-10 text-center">Loading bid details....</p>;
    if (isError) return <p className="p-10 text-center text-red-500">Failed to load bid details</p>;

    // primary bidder (the one this detail page was opened for)
    const primaryBidder = bids.find((item) => item?.bidId === bid?.bidId)?.bidder;
    const { name: bidderName, uniqueId: bidderUniqueId, image: bidderImage } = getBidderDisplay(
        bid?.bidderType,
        primaryBidder
    );

    // ---- pagination derived values ----
    const totalPages = Math.max(1, Math.ceil(bids.length / pageSize));
    const safePage = Math.min(page, totalPages);
    const startIdx = (safePage - 1) * pageSize;
    const paginatedBids = bids.slice(startIdx, startIdx + pageSize);
    const showingFrom = bids.length === 0 ? 0 : startIdx + 1;
    const showingTo = Math.min(startIdx + pageSize, bids.length);

    const goToPage = (p) => setPage(Math.min(Math.max(1, p), totalPages));

    // page numbers to render: 1, ..., current-ish, ..., last (simple version)
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || Math.abs(i - safePage) <= 1) {
            pageNumbers.push(i);
        } else if (pageNumbers[pageNumbers.length - 1] !== "...") {
            pageNumbers.push("...");
        }
    }

    const visibleLogs = showAllLogs ? bids : bids.slice(0, LOG_PREVIEW_COUNT);

    return (
        <div className="w-full pb-6">

            {/* Header */}
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between pb-6">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3D]">Bid Detail</h1>

                    <div className="mt-2 flex items-center text-[11px] md:text-[13px]">
                        <span
                            onClick={() => setCurrentPage("dashboard")}
                            className="cursor-pointer text-slate-500 hover:text-[#D97706] transition-colors">
                            Dashboard
                        </span>

                        <span className="mx-1 text-slate-300"><ChevronRight size={16} /></span>
                        <span
                            onClick={() => setCurrentPage('bid-management')}
                            className="cursor-pointer text-slate-500 hover:text-[#D97706] transition-colors">
                            Bid Management
                        </span>

                        <span className="mx-1 text-slate-300"><ChevronRight size={16} /></span>
                        <span className="font-medium text-[#D97706]">
                            Bid Details
                        </span>
                    </div>
                </div>

                <div className="">
                    <button
                        onClick={() => setCurrentPage('vehicle-approvals')}
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

                    {/* Bid Summary */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-xs text-gray-500 mb-1"> Bid ID</p>
                                <div className="flex items-center gap-1.5">
                                    <p className="text-xs font-semibold text-[#0B1E3D]">
                                        {bid?.bidId || '—'}
                                    </p>

                                    <Copy
                                        className="w-3 h-3 text-gray-400 cursor-pointer hover:text-[#D97706]"
                                        onClick={() =>
                                            navigator.clipboard.writeText(bid?.bidId || '')
                                        }
                                    />
                                </div>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500 mb-1">Bid Amount</p>
                                <p className="text-sm font-bold text-[#0B1E3D]">
                                    AED {Number(bid?.amount || 0).toLocaleString('en-AE')}
                                </p>
                            </div>

                            {/* Status */}
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Status</p>
                                <span
                                    className={`inline-flex px-2 py-1 rounded-md text-[11px] font-semibold capitalize
                                        ${bid?.status === 'won'
                                            ? 'bg-green-100 text-green-700'
                                            : bid?.status === 'active'
                                                ? 'bg-green-100 text-green-700'
                                                : bid?.status === 'outbid'
                                                    ? 'bg-red-100 text-red-600'
                                                    : bid?.status === 'withdrawn'
                                                        ? 'bg-orange-100 text-orange-700'
                                                        : bid?.status === 'canceled'
                                                            ? 'bg-gray-100 text-gray-600'
                                                            : 'bg-gray-100 text-gray-700'
                                        }`}
                                >
                                    {bid?.status || '—'}
                                </span>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500 mb-1">Auction ID</p>
                                <div className="flex items-center gap-1.5">
                                    <p className="text-xs font-semibold text-[#0B1E3D]">
                                        {vehicle?.listingId || '—'}
                                    </p>

                                    <Copy
                                        className="w-3 h-3 text-gray-400 cursor-pointer hover:text-[#D97706]"
                                        onClick={() =>
                                            navigator.clipboard.writeText(
                                                vehicle?.listingId || ''
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500 mb-1">Bid Time </p>
                                <p className="text-xs font-semibold text-[#0B1E3D]">
                                    {bid?.createdAt
                                        ? formatDateTime(bid.createdAt)
                                        : '—'}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500 mb-1">Bidder Type</p>
                                <p className="text-xs font-semibold text-[#0B1E3D]">{bid?.bidderType || '—'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Bid History */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-200">
                            <h3 className="text-md font-semibold text-[#0B1E3D]"> Bid History
                                <span className="text-[12px] font-normal text-gray-500 ml-1">
                                    (All bids for this vehicle)
                                </span>
                            </h3>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-175">

                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-500">#</th>
                                        <th className="px-4 py-3 text-left text-[13px] font-semibold text-gray-500">
                                            Bidder
                                        </th>

                                        <th className="px-4 py-2.5 text-left text-[13px] font-semibold text-gray-500">
                                            Bid Amount
                                        </th>

                                        <th className="px-4 py-2.5 text-left text-[13px] font-semibold text-gray-500">
                                            Bidder Type
                                        </th>

                                        <th className="px-4 py-2.5 text-left text-[13px] font-semibold text-gray-500">
                                            Bid Time
                                        </th>

                                        <th className="px-4 py-2.5 text-left text-[13px] font-semibold text-gray-500">
                                            Status
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100">
                                    {paginatedBids.length > 0 ? (
                                        paginatedBids.map((item, index) => {

                                            const { name: bidderName, uniqueId: bidderId, image: bidderImage } =
                                                getBidderDisplay(item?.bidderType, item?.bidder);

                                            return (
                                                <tr
                                                    key={item?._id || item?.bidId}
                                                    className="hover:bg-gray-50 transition"
                                                >

                                                    {/* Number */}
                                                    <td className="px-4 py-3 text-[12px] text-gray-500">
                                                        {startIdx + index + 1}
                                                    </td>


                                                    {/* Bidder */}
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-2.5">

                                                            {bidderImage ? (
                                                                <img
                                                                    src={bidderImage}
                                                                    alt={bidderName}
                                                                    className="w-8 h-8 rounded-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                                                    <User className="w-4 h-4 text-gray-500" />
                                                                </div>
                                                            )}

                                                            <div>
                                                                <p className="text-[12px] font-semibold text-[#0B1E3D]">
                                                                    {bidderName || 'Unknown'}
                                                                </p>

                                                                <p className="text-[11px] text-gray-400">
                                                                    {bidderId || '—'}
                                                                </p>
                                                            </div>

                                                        </div>
                                                    </td>

                                                    <td className="px-4 py-3">
                                                        <p className="text-[12px] font-bold text-[#0B1E3D]">
                                                            AED {Number(item?.amount || 0).toLocaleString('en-AE')}
                                                        </p>
                                                    </td>

                                                    <td className="px-4 py-3">
                                                        <span className="text-[12px] text-gray-600">
                                                            {item?.bidderType || '—'}
                                                        </span>
                                                    </td>

                                                    <td className="px-4 py-3">
                                                        {item?.createdAt ? (
                                                            <>
                                                                <p className="text-[11px] text-gray-600">
                                                                    {new Date(item.createdAt).toLocaleDateString('en-US', {
                                                                        timeZone: 'Asia/Dubai',
                                                                        month: 'short',
                                                                        day: '2-digit',
                                                                        year: 'numeric',
                                                                    })}
                                                                </p>

                                                                <p className="text-[11px] text-gray-400 mt-0.5">
                                                                    {new Date(item.createdAt).toLocaleTimeString('en-US', {
                                                                        timeZone: 'Asia/Dubai',
                                                                        hour: '2-digit',
                                                                        minute: '2-digit',
                                                                        hour12: true,
                                                                    })}
                                                                </p>
                                                            </>
                                                        ) : (
                                                            '—'
                                                        )}
                                                    </td>

                                                    <td className="px-4 py-3">
                                                        <span
                                                            className={`inline-flex px-2 py-1 rounded-md text-[11px] font-semibold capitalize
                                                                ${item?.status === 'won'
                                                                    ? 'bg-green-100 text-green-700'
                                                                    : item?.status === 'outbid'
                                                                        ? 'bg-red-100 text-red-600'
                                                                        : item?.status === 'withdrawn'
                                                                            ? 'bg-orange-100 text-orange-700'
                                                                            : item?.status === 'canceled'
                                                                                ? 'bg-gray-100 text-gray-600'
                                                                                : 'bg-gray-100 text-gray-700'
                                                                }`}
                                                        >
                                                            {item?.status || '—'}
                                                        </span>
                                                    </td>

                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="py-10 text-center text-sm text-gray-500"
                                            >
                                                No bid history found.
                                            </td>
                                        </tr>
                                    )}

                                </tbody>

                            </table>
                        </div>

                        {/* Footer — real pagination, wired to state above */}
                        <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">

                            <p className="text-[9px] text-gray-500">
                                Showing <span className="font-medium text-gray-700">{showingFrom}</span>
                                {' '}to{' '}
                                <span className="font-medium text-gray-700">{showingTo}</span>
                                {' '}of{' '}
                                <span className="font-medium text-gray-700">{bids.length}</span>
                                {' '}bids
                            </p>

                            <div className="flex items-center gap-1">

                                <button
                                    onClick={() => goToPage(safePage - 1)}
                                    disabled={safePage === 1}
                                    className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    <ChevronLeft className="w-3.5 h-3.5" />
                                </button>

                                {pageNumbers.map((p, idx) =>
                                    p === "..." ? (
                                        <span key={`ellipsis-${idx}`} className="px-1 text-[10px] text-gray-400">
                                            ...
                                        </span>
                                    ) : (
                                        <button
                                            key={p}
                                            onClick={() => goToPage(p)}
                                            className={`w-7 h-7 flex items-center justify-center rounded border text-[10px] font-medium
                                                ${p === safePage
                                                    ? 'border-[#D97706] bg-[#D97706] text-white'
                                                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    )
                                )}

                                <button
                                    onClick={() => goToPage(safePage + 1)}
                                    disabled={safePage === totalPages}
                                    className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    <ChevronRight className="w-3.5 h-3.5" />
                                </button>

                                <select
                                    className="ml-2 h-7 rounded border border-gray-200 px-2 text-[9px] text-gray-600 outline-none"
                                    value={pageSize}
                                    onChange={(e) => {
                                        setPageSize(Number(e.target.value));
                                        setPage(1);
                                    }}
                                >
                                    {BID_PAGE_SIZE_OPTIONS.map((size) => (
                                        <option key={size} value={size}>{size} / page</option>
                                    ))}
                                </select>

                            </div>

                        </div>

                    </div>

                    {/* bidder info */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <h3 className="text-md font-semibold text-[#0B1E3D] mb-4">Bidder Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <div className="border border-gray-200 rounded-lg p-4">

                                <div className="flex items-start gap-3">
                                    {bidderImage ? (
                                        <img
                                            src={bidderImage}
                                            alt={bidderName}
                                            className="w-13 h-13 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-13 h-13 rounded-full bg-gray-100 flex items-center justify-center">
                                            <User className="w-5.5 h-5.5 text-gray-400" />
                                        </div>
                                    )}

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h4 className="text-sm font-semibold text-[#0B1E3D]">
                                                {bidderName || 'Unknown'}
                                            </h4>

                                            <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-[11px] font-semibold">
                                                {bid?.bidderType || '—'}
                                            </span>

                                        </div>

                                        <div className="flex items-center gap-1 mt-1">
                                            <p className="text-[11px] text-gray-500">{bidderUniqueId || 'NA'}</p>
                                            <Copy
                                                className="w-3.5 h-3.5 text-gray-400 cursor-pointer hover:text-[#D97706]"
                                                onClick={() => {
                                                    if (bidderUniqueId) {
                                                        navigator.clipboard.writeText(
                                                            bidderUniqueId
                                                        );
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Details */}
                                <div className="mt-4 space-y-2.5">

                                    <div className="flex items-center gap-2 text-[13px] text-gray-600">
                                        <Mail className="w-4 h-4 text-[#0B1E3D]" />
                                        <span>
                                            {primaryBidder?.email || '—'}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-[13px] text-gray-600">
                                        <Phone className="w-4 h-4 text-[#0B1E3D]" />
                                        <span>
                                            {primaryBidder?.mobile || primaryBidder?.phone || '—'}
                                        </span>
                                    </div>

                                </div>

                                <button
                                    onClick={() => {
                                        setCurrentPage('buyers')
                                    }}
                                    className="mt-4 w-full border border-[#D97706] text-[#D97706] rounded-lg py-2 text-[13px] font-semibold hover:bg-amber-50 transition">
                                    View Profile
                                </button>
                            </div>

                            {/* Bidder Summary */}
                            <div className="border border-gray-200 rounded-lg p-4">
                                <h4 className="text-sm font-semibold text-[#0B1E3D] mb-4">Bidder Summary</h4>

                                <div className="flex justify-between items-center space-y-3">
                                    <span className="text-xs text-gray-500">
                                        {vehicle?.priceType === 'reserve_price'
                                            ? 'Reserve Price'
                                            : 'Buy Now Price'}
                                    </span>

                                    <span className="text-xs font-semibold text-[#0B1E3D]">
                                        {vehicle?.priceType === 'reserve_price'
                                            ? formatPrice(vehicle?.reservePrice || 0)
                                            : formatPrice(vehicle?.buyNowPrice || 0)}
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[12px] text-gray-500">Starting Bid Price</span>

                                        <span className="text-[13px] font-semibold text-[#0B1E3D]">
                                            {formatPrice(vehicle?.startingBidPrice || '—')}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-[12px] text-gray-500">Current Bid</span>

                                        <span className="text-[13px] font-semibold text-[#0B1E3D]">
                                            {formatPrice(bid?.amount)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-[12px] text-gray-500">Total Bids</span>

                                        <span className="text-[13px] font-semibold text-[#0B1E3D]">
                                            {bids.length}
                                        </span>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>

                    {/* logs — latest 7 by default, expand to see all (no fetch, same data) */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4">

                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-[#0B1E3D]">Bid Notes / Logs</h3>
                            <span className="text-[12px] text-gray-400">{bids.length} activities</span>
                        </div>

                        <div className="border-t border-gray-100">
                            {bids.length > 0 ? (
                                <div className="relative">

                                    {/* Vertical line */}
                                    <div className="absolute left-1.25 top-4 bottom-4 w-px bg-gray-200" />

                                    <div className="space-y-0">
                                        {visibleLogs.map((item) => {
                                            const { name: itemBidderName } = getBidderDisplay(
                                                item?.bidderType,
                                                item?.bidder
                                            );

                                            const actionText =
                                                item?.status === 'outbid'
                                                    ? 'Bid outbid'
                                                    : item?.status === 'won'
                                                        ? 'Winning bid placed by'
                                                        : item?.status === 'withdrawn'
                                                            ? 'Bid withdrawn by'
                                                            : item?.status === 'canceled'
                                                                ? 'Bid canceled for'
                                                                : 'Bid placed by';

                                            return (
                                                <div
                                                    key={item?._id || item?.bidId}
                                                    className="relative flex gap-4 py-3 border-b border-gray-100 last:border-b-0">

                                                    {/* Timeline Dot */}
                                                    <div className="relative z-10 mt-1.5 w-3 h-3 rounded-full bg-[#D97706] border-2 border-white ring-1 ring-orange-100 shrink-0" />

                                                    {/* Log Content */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div>
                                                                <p className="text-[12px] font-semibold text-[#0B1E3D]">
                                                                    {actionText}{' '}
                                                                    {itemBidderName}
                                                                    <span className="font-normal text-gray-500">
                                                                        {' '}({item?.bidderType || 'Manual'})
                                                                    </span>
                                                                </p>

                                                                <p className="text-[11px] text-gray-500 mt-1">
                                                                    Bid amount: AED{' '}
                                                                    {Number(item?.amount || 0).toLocaleString('en-AE')}
                                                                </p>
                                                            </div>

                                                            {/* Date & Time */}
                                                            <div className="text-right shrink-0">
                                                                {item?.createdAt ? (
                                                                    <>
                                                                        <p className="text-[10px] text-gray-500">
                                                                            {new Date(
                                                                                item.createdAt
                                                                            ).toLocaleDateString(
                                                                                'en-US',
                                                                                {
                                                                                    timeZone: 'Asia/Dubai',
                                                                                    month: 'short',
                                                                                    day: '2-digit',
                                                                                    year: 'numeric',
                                                                                }
                                                                            )}
                                                                        </p>

                                                                        <p className="text-[10px] text-gray-400 mt-0.5">
                                                                            {new Date(
                                                                                item.createdAt
                                                                            ).toLocaleTimeString(
                                                                                'en-US',
                                                                                {
                                                                                    timeZone: 'Asia/Dubai',
                                                                                    hour: '2-digit',
                                                                                    minute: '2-digit',
                                                                                    hour12: true,
                                                                                }
                                                                            )}
                                                                        </p>
                                                                    </>
                                                                ) : (
                                                                    <p className="text-[9px] text-gray-400">
                                                                        —
                                                                    </p>
                                                                )}

                                                            </div>

                                                        </div>

                                                    </div>

                                                </div>
                                            );
                                        })}

                                    </div>

                                    {bids.length > LOG_PREVIEW_COUNT && (
                                        <div className="pt-3 text-center">
                                            <button
                                                onClick={() => setShowAllLogs((prev) => !prev)}
                                                className="text-[12px] font-semibold text-[#D97706] hover:underline"
                                            >
                                                {showAllLogs
                                                    ? 'Show less'
                                                    : `Show all ${bids.length} activities`}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="py-8 text-center text-xs text-gray-500">
                                    No bid logs found.
                                </div>
                            )}

                        </div>
                    </div>


                </div>


                {/* ================== Right SIDE ================== */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">

                    {/* Vehicle Details */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="px-4 pt-4">
                            <h3 className="text-sm font-semibold text-[#0B1E3D]">Vehicle Details</h3>
                        </div>

                        <div className="px-4 mt-3">
                            <div className="relative">
                                <img
                                    src={vehicle?.images?.[0]?.url}
                                    alt={`${vehicle?.year || ''} ${vehicle?.make || ''} ${vehicle?.model || ''}`}
                                    className="w-full h-28 object-cover rounded-lg"
                                />
                                <span className="absolute top-2 right-2 px-2 py-1 rounded-full bg-green-100 text-green-700 text-[8px] font-semibold">
                                    {vehicle?.auctionStatus}
                                </span>
                            </div>
                        </div>

                        {/* Vehicle Name */}
                        <div className="px-4 mt-3">
                            <h4 className="text-[15px] font-bold text-[#0B1E3D]">
                                {vehicle?.year} {formatLabel(vehicle?.make)} {formatLabel(vehicle?.model)}
                            </h4>

                            <p className="text-[12px] text-gray-500 mt-2.5">
                                {vehicle?.listingId || '—'}
                            </p>
                        </div>

                        {/* Vehicle Info */}
                        <div className="px-4 py-4 space-y-4">

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CarFront className="w-4 h-4 text-gray-400" />
                                    <span className="text-[13px] text-gray-500">
                                        Make
                                    </span>
                                </div>

                                <span className="text-[13px] font-medium text-[#0B1E3D]">
                                    {formatLabel(vehicle?.make) || '—'}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CarFront className="w-4 h-4 text-gray-400" />
                                    <span className="text-[13px] text-gray-500">
                                        Model
                                    </span>
                                </div>

                                <span className="text-[13px] font-medium text-[#0B1E3D]">
                                    {formatLabel(vehicle?.model) || '—'}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CalendarDays className="w-4 h-4 text-gray-400" />
                                    <span className="text-[13px] text-gray-500">
                                        Year
                                    </span>
                                </div>

                                <span className="text-[13px] font-medium text-[#0B1E3D]">
                                    {vehicle?.year || '—'}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 min-w-0">
                                    <Fingerprint className="w-4 h-4 text-gray-400 shrink-0" />
                                    <span className="text-[13px] text-gray-500">
                                        VIN
                                    </span>
                                </div>

                                <span className="text-[13px] font-medium text-[#0B1E3D] truncate ml-4">
                                    {vehicle?.vin || '—'}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Gavel className="w-4 h-4 text-gray-400" />
                                    <span className="text-[13px] text-gray-500">
                                        Starting Bid
                                    </span>
                                </div>

                                <span className="text-[13px] font-medium text-[#0B1E3D]">
                                    AED {Number(vehicle?.startingBidPrice || 0).toLocaleString('en-AE')}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CircleDollarSign className="w-4 h-4 text-gray-400" />
                                    <span className="text-[13px] text-gray-500">
                                        Current Bid
                                    </span>
                                </div>

                                <span className="text-[13px] font-bold text-green-600">
                                    AED {Number(vehicle?.currentBid || 0).toLocaleString('en-AE')}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CircleDollarSign className="w-4 h-4 text-gray-400" />
                                    <span className="text-[13px] text-gray-500">
                                        {vehicle?.priceType === 'reserve_price'
                                            ? 'Reserve Price'
                                            : 'Buy Now Price'}
                                    </span>
                                </div>

                                <span className="text-[13px] font-medium text-[#0B1E3D]">
                                    AED{' '}
                                    {Number(
                                        vehicle?.priceType === 'reserve_price'
                                            ? vehicle?.reservePrice || 0
                                            : vehicle?.buyNowPrice || 0
                                    ).toLocaleString('en-AE')}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-gray-400" />
                                    <span className="text-[13px] text-gray-500">
                                        Auction Type
                                    </span>
                                </div>

                                <span className="text-[13px] font-medium text-[#0B1E3D]">
                                    {formatLabel(vehicle?.auctionType) || '—'}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Clock3 className="w-4 h-4 text-gray-400" />
                                    <span className="text-[13px] text-gray-500">
                                        Auction End Time
                                    </span>
                                </div>

                                <span className="text-[13px] font-medium text-[#0B1E3D] text-right">
                                    {vehicle?.auctionEndDateTime
                                        ? formatDateTime(vehicle.auctionEndDateTime)
                                        : '—'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Auction Timeline */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4">

                        <h3 className="text-sm font-semibold text-[#0B1E3D] mb-4">
                            Auction Timeline
                        </h3>

                        <div className="relative">

                            <div className="absolute left-[5px] top-2 bottom-2 w-px bg-gray-200" />

                            <div className="space-y-5">
                                {getAuctionTimelineStages(vehicle).map((stage) => {
                                    const dotColor =
                                        stage.variant === "canceled"
                                            ? "bg-red-500 ring-red-100"
                                            : stage.current
                                                ? "bg-amber-500 ring-amber-100"
                                                : stage.done
                                                    ? "bg-green-500 ring-green-100"
                                                    : "bg-gray-300 ring-transparent";

                                    return (
                                        <div key={stage.key} className="relative flex gap-3">
                                            <div
                                                className={`relative z-10 w-[11px] h-[11px] mt-1 rounded-full border-2 border-white ring-1 shrink-0 ${dotColor}`}
                                            />

                                            <div>
                                                <p className="text-[9px] font-semibold text-[#0B1E3D]">
                                                    {stage.label}
                                                    {stage.current && (
                                                        <span className="ml-1 text-amber-600">(current)</span>
                                                    )}
                                                </p>

                                                <p className="text-[8px] text-gray-400 mt-0.5">
                                                    {stage.time ? formatDateTime(stage.time) : "—"}
                                                </p>

                                                {stage.extra && (
                                                    <p className="text-[8px] text-gray-500 mt-0.5">
                                                        {stage.extra}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default BidManagementDetail;
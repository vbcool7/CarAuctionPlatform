
import { useState } from 'react';
import { Share2, ShoppingBag, Gavel, Heart, Tag, TrendingUp, Users, ArrowUpRight } from 'lucide-react';
import AuctionGallery from '../BuyerSharedComponents/AuctionGallery';
import { formatLabel } from '../../../utils/formatters';
import { UseCountDown } from '../BuyerSharedComponents/UseCountDown';

import { useGetBuyerAuctionDetail } from '../../../hook/useAuction';
import { useBidSocket } from '../../../socket/listeners/useBidSocket';
import InspectionTab from '../../InspectionTab';
import { useQueryClient } from '@tanstack/react-query';
import { useWithdrawBid } from '../../../hook/useBid';
import { toast } from 'react-toastify';

const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'vehicle-details', label: 'Vehicle Details' },
    { key: 'inspection', label: 'Inspection' },
    { key: 'bids', label: `Bids` },
    { key: 'watchers', label: 'Watchers' },
    { key: 'images', label: `Images` },
    { key: 'documents', label: `Documents` },
];

const getAuctionStatusStyles = (status) => {
    switch (status) {
        case "live":
            return {
                label: "Live",
                className: "bg-green-50 text-green-600",
                dot: "bg-green-500",
            };

        case "upcoming":
            return {
                label: "Upcoming",
                className: "bg-blue-50 text-blue-600",
                dot: "bg-blue-500",
            };

        case "sold":
            return {
                label: "Sold",
                className: "bg-emerald-50 text-emerald-600",
                dot: "bg-emerald-500",
            };

        case "unsold":
            return {
                label: "Unsold",
                className: "bg-slate-100 text-slate-600",
                dot: "bg-slate-500",
            };

        case "reserve-not-met":
            return {
                label: "Reserve Not Met",
                className: "bg-orange-50 text-orange-600",
                dot: "bg-orange-500",
            };

        case "canceled":
            return {
                label: "Canceled",
                className: "bg-red-50 text-red-600",
                dot: "bg-red-500",
            };

        case "draft":
            return {
                label: "Draft",
                className: "bg-gray-100 text-gray-500",
                dot: "bg-gray-400",
            };

        default:
            return {
                label: "Unknown",
                className: "bg-gray-100 text-gray-500",
                dot: "bg-gray-400",
            };
    }
};

function BidTimeSection({ vehicle }) {
    const { auctionStatus, priceType } = vehicle;
    const isCountdownStatus = auctionStatus === 'live' || auctionStatus === 'upcoming';
    const isUpcoming = auctionStatus === 'upcoming';
    const isFixedPrice = priceType === 'fixed_price';

    const targetDateTime = isUpcoming ? vehicle.auctionStartDateTime : vehicle.auctionEndDateTime;
    const { days, hours, mins } = UseCountDown(isCountdownStatus ? targetDateTime : null);

    const priceLabel = isFixedPrice ? 'Buy Now Price' : (isUpcoming ? 'Starting Bid' : 'Current Bid');
    const priceAmount = isFixedPrice
        ? vehicle.buyNowPrice
        : (isUpcoming ? vehicle.startingBidPrice : (vehicle.currentBid ?? vehicle.startingBidPrice));

    const endedDateTime = auctionStatus === 'canceled' ? vehicle.canceledAt : vehicle.auctionEndDateTime;

    return (
        <div className="grid grid-cols-2 mt-5 pt-4 border-t border-slate-100">

            <div className="border-r border-slate-200">
                <p className="text-[11px] text-slate-400">{priceLabel}</p>
                <p className="text-xl font-bold text-[#0B1E3D]">
                    AED {priceAmount?.toLocaleString() || 0}
                </p>
                {!isFixedPrice && (
                    <p className="text-[10px] text-slate-400">
                        Reserve Price: AED {vehicle.reservePrice?.toLocaleString()}
                    </p>
                )}
            </div>

            <div className="pl-5">
                {isCountdownStatus ? (
                    <>
                        <p className="text-[11px] text-slate-400">{isUpcoming ? 'Starts In' : 'Time Remaining'}</p>
                        <p className="text-lg font-bold text-[#D97706]">
                            {String(days).padStart(2, '0')}d {String(hours).padStart(2, '0')}h {String(mins).padStart(2, '0')}m
                        </p>
                        <p className="text-[10px] text-slate-400">
                            {isUpcoming ? 'Starts on' : 'Ends on'}{' '}
                            {targetDateTime && new Date(targetDateTime).toLocaleString('en-AE', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Dubai' })}
                        </p>
                    </>
                ) : (
                    <>
                        <p className="text-[11px] text-slate-400">Ended</p>
                        <p className="text-lg font-bold text-slate-500">
                            {endedDateTime ? new Date(endedDateTime).toLocaleDateString('en-AE', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                        </p>
                        <p className="text-[10px] text-slate-400">
                            {endedDateTime && new Date(endedDateTime).toLocaleTimeString('en-AE', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Dubai' })} (Dubai)
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}

function AuctionStatusCard({ vehicle }) {
    const { auctionStatus, statusAtCancellation } = vehicle;
    const isCanceled = auctionStatus === 'canceled';

    const outcomeConfig = {
        sold: { label: 'Sold', color: 'green' },
        unsold: { label: 'Unsold', color: 'slate' },
        'reserve-not-met': { label: 'Reserve Not Met', color: 'amber' },
    };

    const steps = [
        { key: 'upcoming', label: 'Upcoming' },
        { key: 'live', label: 'Live' },
        {
            key: 'outcome',
            label: outcomeConfig[auctionStatus]?.label || 'Outcome',
            color: outcomeConfig[auctionStatus]?.color || 'slate',
        },
    ];

    const getStepState = (stepKey) => {
        if (stepKey === 'upcoming') {
            return auctionStatus === 'upcoming' ? 'active' : 'done';
        }
        if (stepKey === 'live') {
            if (auctionStatus === 'upcoming') return 'pending';
            return auctionStatus === 'live' ? 'active' : 'done';
        }

        if (['live', 'upcoming'].includes(auctionStatus)) return 'pending';
        return 'active'; // sold/unsold/reserve-not-met — final-reached
    };

    const stateColor = (state, color) => {
        if (state === 'pending') return { dot: 'bg-slate-200 border-2 border-slate-300', text: 'text-slate-400', badge: 'bg-slate-100 text-slate-500' };
        if (state === 'done') return { dot: 'bg-emerald-500 border-2 border-emerald-100', text: 'text-slate-700', badge: 'bg-emerald-50 text-emerald-600' };
        // active
        const colorMap = {
            green: { dot: 'bg-green-500 ring-4 ring-green-100 border-2 border-white', text: 'text-green-700 font-bold', badge: 'bg-green-100 text-green-700' },
            amber: { dot: 'bg-amber-500 ring-4 ring-amber-100 border-2 border-white', text: 'text-amber-700 font-bold', badge: 'bg-amber-100 text-amber-700' },
            slate: { dot: 'bg-slate-700 ring-4 ring-slate-100 border-2 border-white', text: 'text-slate-800 font-bold', badge: 'bg-slate-100 text-slate-700' },
        };
        return colorMap[color] || colorMap.slate;
    };

    return (
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm hover:shadow transition-all duration-200">
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Auction Status</h3>
                {isCanceled && (
                    <span className="flex items-center gap-1.5 bg-red-50 text-red-600 text-[11px] font-semibold px-3 py-1 rounded-full border border-red-100">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        Canceled
                    </span>
                )}
            </div>

            {isCanceled ? (
                <div className="bg-red-50/50 border border-red-100 rounded-lg p-4 text-center">
                    <p className="text-xs text-slate-600">
                        This auction was canceled while it was{' '}
                        <span className="font-semibold text-slate-800">{statusAtCancellation || 'in progress'}</span>.
                    </p>
                    {vehicle.cancellationReason && (
                        <p className="text-[11px] text-red-500 font-medium mt-1.5">Reason: {vehicle.cancellationReason}</p>
                    )}
                </div>
            ) : (
                <div className="relative pl-2">
                    {/* Vertical connecting line */}
                    <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-slate-100" />

                    <div className="relative flex flex-col gap-5">
                        {steps.map((step) => {
                            const state = getStepState(step.key);
                            const c = stateColor(state, step.color);
                            return (
                                <div key={step.key} className="flex items-center gap-4">
                                    <div className="relative flex items-center justify-center shrink-0">
                                        <span className={`block w-3.5 h-3.5 rounded-full z-10 transition-all ${c.dot}`} />
                                    </div>
                                    <div className="flex-1 flex items-center justify-between bg-slate-50/60 border border-slate-100 rounded-lg px-3.5 py-2.5">
                                        <div>
                                            <p className={`text-xs font-semibold ${c.text}`}>{step.label}</p>
                                        </div>
                                        <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-md ${c.badge}`}>
                                            {state === 'active' ? 'Current' : state === 'done' ? 'Completed' : 'Pending'}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

function QuickActionsCard({ vehicle, onPlaceBidClick, onBuyNow, onWithdrawClick }) {
    const isLive = vehicle.auctionStatus === 'live';
    const isFixedPrice = vehicle.priceType === 'fixed_price';

    return (
        <div className="">
            <div className="grid grid-cols-2 gap-2.5 pt-8">

                {/* Buy Now / Place Bid / Withdraw */}
                {isLive && (
                    isFixedPrice ? (
                        <button
                            onClick={() => onBuyNow(vehicle._id)}
                            className="col-span-2 h-10 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 group"
                        >
                            <ShoppingBag className="w-4 h-4 text-amber-100 group-hover:scale-110 transition-transform" />
                            Buy Now — AED {vehicle.buyNowPrice?.toLocaleString()}
                        </button>
                    ) : vehicle.isCurrentHighestBidder ? (
                        <>
                            <button
                                onClick={onPlaceBidClick}
                                className="h-10 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center justify-center gap-2"
                            >
                                <Gavel className="w-4 h-4" />
                                Increase My Bid
                            </button>
                            <button
                                onClick={() => onWithdrawClick(vehicle.myBidId)}
                                className="h-10 border border-red-500 text-red-600 hover:bg-red-50 text-xs font-semibold rounded-lg"
                            >
                                Withdraw
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={onPlaceBidClick}
                            className="col-span-2 h-10 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 group"
                        >
                            <Gavel className="w-4 h-4 text-amber-100 group-hover:scale-110 transition-transform" />
                            Place Bid
                        </button>
                    )
                )}

                {/* Watchlist */}
                <button className="h-10 border border-amber-500/60 text-[#0B1E3D] bg-amber-50/20 hover:bg-amber-50 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 group">
                    <Heart className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
                    Watchlist
                </button>

                {/* Share */}
                <button className="h-10 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 group">
                    <Share2 className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:scale-110 transition-transform" />
                    Share
                </button>

            </div>
        </div>
    );
}

function BidSummaryCard({ vehicle }) {
    if (vehicle.priceType === 'fixed_price') {
        return (
            <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm hover:shadow transition-all duration-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Purchase Info</h3>
                <div className="bg-slate-50/60 border border-slate-100 rounded-lg p-3.5 flex justify-between items-center">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                            <Tag className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-medium text-slate-600">Buy Now Price</span>
                    </div>
                    <span className="text-xs font-bold text-[#0B1E3D]">AED {vehicle.buyNowPrice?.toLocaleString()}</span>
                </div>
            </div>
        );
    }

    const isUpcoming = vehicle.auctionStatus === 'upcoming';
    const bidAmount = isUpcoming ? vehicle.startingBidPrice : (vehicle.currentBid ?? vehicle.startingBidPrice);
    const MIN_INCREMENT = 1000; // ⚠️ abhi-bhi-hardcoded-guess, confirm-nahi-hua real-rule

    return (
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm hover:shadow transition-all duration-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Bid Summary</h3>
            <div className="space-y-2.5">
                <div className="bg-slate-50/60 border border-slate-100 rounded-lg p-3 flex justify-between items-center">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                            <TrendingUp className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-medium text-slate-600">{isUpcoming ? 'Starting Bid' : 'Current Bid'}</span>
                    </div>
                    <span className="text-xs font-bold text-[#0B1E3D]">AED {bidAmount?.toLocaleString() || 0}</span>
                </div>

                <div className="bg-slate-50/60 border border-slate-100 rounded-lg p-3 flex justify-between items-center">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <Users className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-medium text-slate-600">Total Bids</span>
                    </div>
                    <span className="text-xs font-bold text-[#0B1E3D]">{vehicle.totalBids || 0}</span>
                </div>

                {!isUpcoming && (
                    <div className="bg-slate-50/60 border border-slate-100 rounded-lg p-3 flex justify-between items-center">
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                <ArrowUpRight className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-xs font-medium text-slate-600">Next Minimum Bid</span>
                        </div>
                        <span className="text-xs font-bold text-[#0B1E3D]">
                            AED {((bidAmount || 0) + MIN_INCREMENT).toLocaleString()}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

function LiveBidUpdatesCard({ vehicle }) {
    if (vehicle.auctionStatus !== 'live' || !vehicle.recentBids?.length) return null;
    return (
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-sm font-bold text-[#0B1E3D] mb-4">Live Bid Updates</h3>
            <div className="space-y-3.5">
                {vehicle.recentBids.map((bid, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-500">
                            #{i + 1}
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] font-semibold text-slate-700">Bidder #{i + 1}</p>
                            <p className="text-[9px] text-slate-400">
                                {new Date(bid.createdAt).toLocaleTimeString('en-AE', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                        <p className="text-[10px] font-bold text-[#0B1E3D]">AED {bid.amount?.toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

const DetailRow = ({ label, value, highlight = false }) => {
    const displayValue =
        value === null || value === undefined || value === ''
            ? '-'
            : formatLabel(String(value));

    return (
        <div
            className={`flex items-center justify-between gap-4 py-2 border-b border-slate-100 
                ${highlight ? 'bg-amber-50 px-2 rounded-lg' : ''}`}
        >
            <span className="text-xs text-slate-400">
                {label}
            </span>

            <span
                className={`text-sm font-medium text-right ${highlight
                    ? 'text-amber-700'
                    : 'text-slate-700'
                    }`}
            >
                {displayValue}
            </span>
        </div>
    );
};

function BuyerBrowseAuctionsDetail({ setCurrentPage, selectedVehicleId, previousPage, openBidModal }) {

    const [activeTab, setActiveTab] = useState('overview');

    const { data: auctionDetail, isLoading, isError } = useGetBuyerAuctionDetail(selectedVehicleId);
    const { mutate: withdrawBid } = useWithdrawBid();

    const queryClient = useQueryClient();
    const vehicle = auctionDetail?.vehicle;

    useBidSocket(selectedVehicleId);

    const handleWithdraw = (bidId) => {
        withdrawBid(bidId, {
            onSuccess: () => {
                toast.success("Bid Withdraw Successfully");
                queryClient.invalidateQueries({ queryKey: ['auctionDetail', selectedVehicleId] })
            },
            onError: (err) => toast.error(err.response?.data?.message || 'Withdraw failed')
        });
    };

    if (isLoading) return <p className="p-10 text-center">Loading auction detail....</p>;
    if (isError) return <p className="p-10 text-center text-red-500">Failed to load auctions detail</p>;
    if (!vehicle) return <p className="p-10 text-center text-red-500">Vehicle not found</p>;

    return (
        <div className='pb-6 space-y-6'>

            {/* back link */}
            <button
                onClick={() => setCurrentPage(previousPage || 'browse-auctions')}
                className='flex items-center gap-1 text-xs md:text-sm text-gray-500 hover:text-[#0B1E3D]'
            >
                ← Back to Auctions
            </button>

            {/* header */}
            <div className='w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0'>
                <div className='flex flex-col'>
                    <h1 className='text-xl md:text-2xl font-bold'>Auction Details</h1>
                    <p className='text-xs md:text-sm text-gray-600 p-px'>
                        View detailed information about this auction.
                    </p>
                </div>

                <div className='flex gap-2'>
                    <button className='flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-medium rounded-lg border border-gray-300'>
                        <Share2 className='w-4 h-4' />
                        Share Auction
                    </button>

                    <button
                        onClick={() => setCurrentPage('browse-auctions')}
                        className='px-4 py-2 text-xs md:text-sm font-medium rounded-lg border border-gray-300'>
                        More Actions
                    </button>
                </div>
            </div>

            {/* gallery card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                    <div className="h-100">
                        <AuctionGallery
                            images={vehicle.images?.map(img => img.url) || []}
                            video={vehicle.video || null}
                            status={vehicle.auctionStatus}
                        />
                    </div>

                    <div className="flex flex-col">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-[#0B1E3D]">
                                    {vehicle.year} {formatLabel(vehicle.make)} {formatLabel(vehicle.model)}
                                </h2>

                                <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                                    <span>{formatLabel(vehicle.bodyType)}</span>
                                    <span>|</span>
                                    <span>{vehicle.mileage}</span>
                                    <span>|</span>
                                    <span>{formatLabel(vehicle.fuelType)}</span>
                                    <span>|</span>
                                    <span>{formatLabel(vehicle.transmission)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-5">
                            <div>
                                <p className="text-[11px] text-slate-400">Listing ID</p>
                                <p className="text-xs font-medium text-[#0B1E3D] mt-1">{vehicle.listingId}</p>
                            </div>
                            <div>
                                <p className="text-[11px] text-slate-400">VIN</p>
                                <p className="text-xs font-medium text-[#0B1E3D] mt-1">{vehicle.vin}</p>
                            </div>
                        </div>

                        <div className="mt-5">
                            <p className="text-[11px] text-slate-400 mb-1">Auction Status</p>

                            {(() => {
                                const status = getAuctionStatusStyles(vehicle?.auctionStatus);
                                return (
                                    <span
                                        className={`inline-flex items-center gap-1.5 ${status.className} text-xs font-semibold px-2.5 py-1 rounded-md`}
                                    >
                                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                                        {status.label}
                                    </span>
                                );
                            })()}
                        </div>

                        {/* Bid + Time */}
                        <BidTimeSection vehicle={vehicle} />

                        {/* btns */}
                        <QuickActionsCard
                            vehicle={vehicle}
                            onPlaceBidClick={() => openBidModal(vehicle._id, 'browse-auctions-detail')}
                            // onBuyNow={handleBuyNow}
                            onWithdrawClick={handleWithdraw}
                        />

                    </div>
                </div>
            </div>

            {/* main grid */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>

                {/* ================== LEFT ================= */}
                <div className="lg:col-span-2 space-y-6 ">
                    {/* tabs */}
                    <div className='bg-white rounded-xl border border-gray-200'>
                        <div className='flex gap-4 border-b border-gray-200 px-5 overflow-x-auto '>
                            <div className='flex gap-9 border-b border-gray-200 px-5 overflow-x-auto no-scrollbar'>
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`py-3 text-xs md:text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.key
                                            ? 'border-[#D97706] text-[#D97706]'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className='p-5'>
                            {activeTab === 'overview' && (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 ">
                                    <div>
                                        <div className="mb-7">
                                            <h3 className="text-sm font-bold text-slate-900 mb-4">Vehicle Information</h3>
                                            <div className="space-y-0">
                                                <DetailRow label="Listing ID" value={vehicle?.listingId} />
                                                <DetailRow label="Make" value={vehicle?.make} />
                                                <DetailRow label="Model" value={vehicle?.model} />
                                                <DetailRow label="Year" value={vehicle?.year} />
                                                <DetailRow label="Trim" value={vehicle?.trim} />
                                                <DetailRow label="Vehicle Type" value={vehicle?.vehicleType} />
                                                <DetailRow label="Body Type" value={vehicle?.bodyType} />
                                                <DetailRow
                                                    label="Mileage"
                                                    value={
                                                        vehicle?.mileage != null
                                                            ? `${vehicle.mileage.toLocaleString()} km`
                                                            : '-'
                                                    }
                                                />
                                                <DetailRow label="Transmission" value={vehicle?.transmission} />
                                                <DetailRow label="Fuel Type" value={vehicle?.fuelType} />
                                                <DetailRow label="Drivetrain" value={vehicle?.drivetrain} />
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-bold text-slate-900 mb-4">Location & History</h3>
                                            <div>
                                                <DetailRow label="Country" value={vehicle?.country} />
                                                <DetailRow label="Emirate" value={vehicle?.emirate} />
                                                <DetailRow label="City" value={vehicle?.city} />
                                                <DetailRow label="ZIP Code" value={vehicle?.zipCode} />
                                                <DetailRow label="VIN" value={vehicle?.vin} />
                                                <DetailRow label="Title Status" value={vehicle?.titleStatus} />
                                                <DetailRow
                                                    label="Accident History"
                                                    value={vehicle?.accidentHistory}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div>

                                        <div className="mb-7">
                                            <h3 className="text-sm font-bold text-slate-900 mb-4">Pricing & Auction</h3>
                                            <div>
                                                <DetailRow label="Price Type" value={vehicle?.priceType} />
                                                <DetailRow label="Auction Type" value={vehicle?.auctionType} />

                                                {vehicle?.priceType === 'fixed_price' && (
                                                    <DetailRow
                                                        label="Buy Now Price"
                                                        value={
                                                            vehicle?.buyNowPrice != null
                                                                ? `AED ${vehicle.buyNowPrice.toLocaleString()}`
                                                                : '-'
                                                        }
                                                        highlight
                                                    />
                                                )}

                                                {vehicle?.priceType === 'reserve_price' && (
                                                    <>
                                                        <DetailRow
                                                            label="Starting Bid"
                                                            value={
                                                                vehicle?.startingBidPrice != null
                                                                    ? `AED ${vehicle.startingBidPrice.toLocaleString()}`
                                                                    : '-'
                                                            }
                                                        />

                                                        <DetailRow
                                                            label="Reserve Price"
                                                            value={
                                                                vehicle?.reservePrice != null
                                                                    ? `AED ${vehicle.reservePrice.toLocaleString()}`
                                                                    : '-'
                                                            }
                                                            highlight
                                                        />

                                                        <DetailRow
                                                            label="Current Bid"
                                                            value={
                                                                vehicle?.currentBid != null
                                                                    ? `AED ${vehicle.currentBid.toLocaleString()}`
                                                                    : 'No bids yet'
                                                            }
                                                        />
                                                    </>
                                                )}

                                                <DetailRow label="Views" value={vehicle?.views ?? 0} />
                                                <DetailRow label="Auction Duration" value={vehicle?.auctionDuration} />
                                            </div>
                                        </div>

                                        <div className="mb-7">
                                            <h3 className="text-sm font-bold text-slate-900 mb-4">Appearance</h3>

                                            <DetailRow
                                                label="Exterior Color"
                                                value={vehicle?.exteriorColor}
                                            />

                                            <DetailRow
                                                label="Interior Color"
                                                value={vehicle?.interiorColor}
                                            />
                                        </div>

                                        {/* Description */}
                                        {vehicle?.vehicleDescription && (
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-900 mb-3">
                                                    Description
                                                </h3>

                                                <p className="text-sm text-slate-500 leading-6">
                                                    {vehicle.vehicleDescription}
                                                </p>
                                            </div>
                                        )}

                                    </div>

                                </div>
                            )}

                            {activeTab === 'vehicle-details' && (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-8">

                                    {/* ================= LEFT COLUMN ================= */}
                                    <div>

                                        {/* Vehicle Information */}
                                        <div className="mb-7">
                                            <h3 className="text-sm font-bold text-slate-900 mb-4">
                                                Vehicle Information
                                            </h3>

                                            <div>
                                                <DetailRow
                                                    label="Vehicle Type"
                                                    value={vehicle?.vehicleType}
                                                />

                                                <DetailRow
                                                    label="Body Type"
                                                    value={vehicle?.bodyType}
                                                />

                                                <DetailRow
                                                    label="Make"
                                                    value={vehicle?.make}
                                                />

                                                <DetailRow
                                                    label="Model"
                                                    value={vehicle?.model}
                                                />

                                                <DetailRow
                                                    label="Year"
                                                    value={vehicle?.year}
                                                />

                                                <DetailRow
                                                    label="Trim"
                                                    value={vehicle?.trim}
                                                />

                                                <DetailRow
                                                    label="Mileage"
                                                    value={vehicle?.mileage}
                                                />

                                                <DetailRow
                                                    label="Transmission"
                                                    value={vehicle?.transmission}
                                                />

                                                <DetailRow
                                                    label="Fuel Type"
                                                    value={vehicle?.fuelType}
                                                />

                                                <DetailRow
                                                    label="Drivetrain"
                                                    value={vehicle?.drivetrain}
                                                />
                                            </div>
                                        </div>

                                        {/* Location & History */}
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-900 mb-4">
                                                Location & History
                                            </h3>

                                            <div>
                                                <DetailRow
                                                    label="Country"
                                                    value={vehicle?.country}
                                                />

                                                <DetailRow
                                                    label="Emirate"
                                                    value={vehicle?.emirate}
                                                />

                                                <DetailRow
                                                    label="City"
                                                    value={vehicle?.city}
                                                />

                                                <DetailRow
                                                    label="ZIP Code"
                                                    value={vehicle?.zipCode}
                                                />

                                                <DetailRow
                                                    label="VIN"
                                                    value={vehicle?.vin}
                                                />

                                                <DetailRow
                                                    label="Title Status"
                                                    value={vehicle?.titleStatus}
                                                />

                                                <DetailRow
                                                    label="Accident History"
                                                    value={vehicle?.accidentHistory}
                                                />
                                            </div>
                                        </div>

                                    </div>


                                    {/* ================= RIGHT COLUMN ================= */}
                                    <div>

                                        {/* Auction Settings */}
                                        <div className="mb-7">
                                            <h3 className="text-sm font-bold text-slate-900 mb-4">
                                                Auction Settings
                                            </h3>

                                            <div>
                                                <DetailRow
                                                    label="Price Type"
                                                    value={vehicle?.priceType}
                                                />

                                                <DetailRow
                                                    label="Auction Type"
                                                    value={vehicle?.auctionType}
                                                />

                                                <DetailRow
                                                    label="Auction Duration"
                                                    value={vehicle?.auctionDuration}
                                                />

                                                <DetailRow
                                                    label="Starting Bid"
                                                    value={
                                                        vehicle?.startingBidPrice != null
                                                            ? `AED ${vehicle.startingBidPrice.toLocaleString()}`
                                                            : '-'
                                                    }
                                                />

                                                <DetailRow
                                                    label="Reserve Price"
                                                    value={
                                                        vehicle?.reservePrice != null
                                                            ? `AED ${vehicle.reservePrice.toLocaleString()}`
                                                            : '-'
                                                    }
                                                />

                                                <DetailRow
                                                    label="Buy Now Price"
                                                    value={
                                                        vehicle?.buyNowPrice != null
                                                            ? `AED ${vehicle.buyNowPrice.toLocaleString()}`
                                                            : '-'
                                                    }
                                                />

                                                <DetailRow
                                                    label="Anti-Sniping Window"
                                                    value={
                                                        vehicle?.antiSnipingWindow != null
                                                            ? `${vehicle.antiSnipingWindow} min`
                                                            : '-'
                                                    }
                                                />

                                                <DetailRow
                                                    label="Anti-Sniping Extension"
                                                    value={
                                                        vehicle?.antiSnipingExtension != null
                                                            ? `${vehicle.antiSnipingExtension} min`
                                                            : '-'
                                                    }
                                                />
                                            </div>
                                        </div>


                                        {/* Listing Options */}
                                        <div className="mb-7">
                                            <h3 className="text-sm font-bold text-slate-900 mb-4">
                                                Listing Options
                                            </h3>

                                            <div>
                                                <DetailRow
                                                    label="Save by Bidders"
                                                    value={vehicle?.allowBiddersToSave ? 'Yes' : 'No'}
                                                />

                                                <DetailRow
                                                    label="Social Media"
                                                    value={vehicle?.shareOnSocialMedia ? 'Yes' : 'No'}
                                                />

                                                <DetailRow
                                                    label="Featured Listing"
                                                    value={vehicle?.featuredListing ? 'Yes' : 'No'}
                                                />

                                                <DetailRow
                                                    label="Auto Relist"
                                                    value={vehicle?.autoRelist ? 'Yes' : 'No'}
                                                />
                                            </div>
                                        </div>


                                        {/* Notes */}
                                        {vehicle?.cancellationReason && (
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-900 mb-4">
                                                    Notes
                                                </h3>

                                                <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">
                                                    <p className="text-xs font-medium text-red-500 mb-1">
                                                        Cancellation Reason
                                                    </p>

                                                    <p className="text-sm text-red-700 leading-5">
                                                        {vehicle.cancellationReason}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                    </div>

                                </div>
                            )}

                            {activeTab === 'inspection' && (
                                <InspectionTab vehicle={vehicle} />
                            )}
                        </div>

                    </div>
                </div>

                {/* ================== RIGHT ================= */}
                <div className="space-y-4">

                    {/* AUCTION STATUS */}
                    <AuctionStatusCard vehicle={vehicle} />

                    {/* BID SUMMARY */}
                    <BidSummaryCard vehicle={vehicle} />

                    {/* LIVE BID UPDATES */}
                    <LiveBidUpdatesCard vehicle={vehicle} />

                </div>
            </div>


        </div>
    )
}

export default BuyerBrowseAuctionsDetail
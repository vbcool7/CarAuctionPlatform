
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Share2, Heart, MapPin, Hash, Cog, Flag, Fuel, Tag, Calendar, Clock, User, ShieldCheck, MessageCircle, Mail, Link, Gavel, Eye, Users, AlertCircle, Bell, Gauge, XCircle } from 'lucide-react';
import { HiCheckCircle, HiXCircle } from 'react-icons/hi';
import { HiReceiptRefund } from 'react-icons/hi2';
import { FaFacebookF, FaXTwitter } from "react-icons/fa6";
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine } from 'recharts';

import Breadcrumbs from './Breadcrumbs';
import AuctionFeaturesBar from './SharedComponents/AuctionFeatureBar';
import SellerInfo from './SellerInfo';
import HomeRecentlySold from './HomeRecentlySold';

import OverviewTab from './OverviewTab';
import VehiclInfoTab from './VehicleInfoTab';
import InspectionTab from './InspectionTab';
import DetailTabs from './DetailTabs';
import BiddingHistoryTab from './BiddingHistoryTab';
import DocumentsTab from './DocumentsTab';
import LocationTab from './LocationTab';
import AuctionBottomFeaturesBar from './SharedComponents/AuctionBottomFeaturesBar';
import EndedSoldGallery from './EndedSoldGallery';
import EndedUnsoldGallery from './EndedUnSoldGallery';
import Loader from './Loader';

import { formatDateTime, formatLabel, formatPrice } from '../utils/formatters';
import useAuthStore from '../store/useAuthStore';
import { usePublicAuctionDetail } from '../hook/useAuction';
import { useStatusRedirect } from '../hook/useStatusRedirect';
import { useGetPublicAuctionBids } from '../hook/useBid';
import { useGetWatchlistIds, useToggleWatchlist } from '../hook/useWatchlist';
import { toast } from 'react-toastify';

// market insights
const chartData = [
    { name: 'Dec', value: 153000 },
    { name: 'Jan', value: 158000 },
    { name: 'Feb', value: 164000 },
    { name: 'Mar', value: 170000 },
    { name: 'Apr', value: 179000 },
    { name: 'May', value: 192000 },
];

const unSoldMarketdata = {
    avgMarketPrice: 92000,
    highestBid: 78000,
    difference: -14000,
    hasBelowMarketWarning: true,
};

// ─── Sold Panel ───────────────────────────────────────────────
function SoldBidPanel({ vehicle }) {
    return (
        <div className="flex flex-col h-full">

            {/* Auction Completed Bar */}
            <div className="bg-green-50 border-t border-x border-green-200 rounded-t-xl px-5 py-3 text-center">
                <div className="flex items-center justify-center gap-2">
                    <HiCheckCircle className="text-green-500" size={18} />
                    <span className="text-sm font-semibold text-green-700">
                        Auction Completed
                    </span>
                </div>

                <p className="text-xs text-green-600 mt-0.5">
                    This auction ended on{" "}
                    {vehicle.auctionEndDateTime
                        ? formatDateTime(vehicle.auctionEndDateTime)
                        : "—"}
                </p>
            </div>

            <div className="border-x border-b border-gray-200 rounded-b-xl p-4 flex flex-col gap-4">

                <div>
                    <p className="text-sm text-slate-500 mb-1">
                        {vehicle.priceType === "fixed_price"
                            ? "Buy Now Price"
                            : "Winning Bid"}
                    </p>

                    <p className="text-3xl font-bold text-[#D97706]">
                        {vehicle.priceType === "fixed_price"
                            ? vehicle.buyNowPrice != null
                                ? formatPrice(vehicle.buyNowPrice)
                                : "—"
                            : vehicle.currentBid != null
                                ? formatPrice(vehicle.currentBid)
                                : "—"}
                    </p>
                </div>

                <div className="border border-emerald-200 bg-emerald-50/50 rounded-xl py-3 px-4">
                    <div className="flex items-center justify-between mb-1">
                        <p className="text-xs text-slate-400">Sold To</p>

                        {vehicle.auctionStatus === "sold" && (
                            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                                Winner
                            </span>
                        )}
                    </div>

                    <p className="text-sm font-semibold text-[#0F172A]">
                        {vehicle.auctionStatus === "sold"
                            ? (vehicle.recentBids?.[0]?.bidder ?? "—")
                            : "—"}
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">

                    <div className="border border-slate-200 rounded-xl p-4">
                        <p className="text-xs text-slate-400 mb-1">
                            {vehicle.priceType === "fixed_price"
                                ? "Buy Now Price"
                                : "Starting Bid Price"}
                        </p>

                        <p className="text-sm font-semibold text-[#0F172A]">
                            {vehicle.priceType === "fixed_price"
                                ? vehicle.buyNowPrice != null
                                    ? formatPrice(vehicle.buyNowPrice)
                                    : "—"
                                : vehicle.startingBidPrice != null
                                    ? formatPrice(vehicle.startingBidPrice)
                                    : "—"}
                        </p>
                    </div>

                    {/* Number Of Bids — Reserve Price Only */}
                    {vehicle.priceType === "reserve_price" && (
                        <div className="border border-slate-200 rounded-xl p-4">
                            <p className="text-xs text-slate-400 mb-1">
                                Number Of Bids
                            </p>

                            <p className="text-sm font-semibold text-[#0F172A]">
                                {vehicle.totalBids ?? "—"}
                            </p>
                        </div>
                    )}

                    <div className="border border-slate-200 rounded-xl p-4">
                        <p className="text-xs text-slate-400 mb-1">
                            Auction Type
                        </p>

                        <p className="text-sm font-semibold text-[#0F172A]">
                            {vehicle.auctionType
                                ? formatLabel(vehicle.auctionType)
                                : "—"}
                        </p>
                    </div>

                    <div className="border border-slate-200 rounded-xl p-4">
                        <p className="text-xs text-slate-400 mb-1">
                            Price Type
                        </p>

                        <p className="text-sm font-semibold text-[#0F172A]">
                            {vehicle.priceType
                                ? formatLabel(vehicle.priceType)
                                : "—"}
                        </p>
                    </div>

                </div>

                {/* View Payment Summary */}
                <button
                    className="w-full flex items-center justify-center gap-2 border border-slate-300 text-slate-700 py-3 rounded-xl text-sm font-semibold hover:bg-slate-50 transition cursor-pointer">
                    <HiReceiptRefund size={18} />
                    View Payment Summary
                </button>

            </div>
        </div>
    );
}

// ─── Unsold + Reserve Not Met Panel ─────────────────────────────────────────────
function UnsoldBidPanel({ vehicle }) {
    const isReserveNotMet = vehicle.auctionStatus === "reserve-not-met";

    return (
        <div className="flex flex-col gap-4 h-full border border-gray-200 p-4 rounded-xl">

            {/* Auction Outcome Header */}
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#0F172A] text-base">
                    Auction Outcome
                </h3>
            </div>

            {/* Basic Auction Stats */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <p className="text-xs text-slate-400 mb-1">
                        Highest Bid
                    </p>
                    <p className="text-xl font-bold text-[#0F172A]">
                        {vehicle.currentBid != null
                            ? formatPrice(vehicle.currentBid)
                            : "No bids"}
                    </p>
                </div>

                <div>
                    <p className="text-xs text-slate-400 mb-1">
                        Total Bids
                    </p>
                    <p className="text-xl font-bold text-[#0F172A]">
                        {vehicle.totalBids ?? 0}
                    </p>
                </div>
            </div>

            {/* Auction Info */}
            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3">
                <div>
                    <p className="text-xs text-slate-400 mb-1">
                        Auction Duration
                    </p>
                    <p className="text-sm font-semibold text-[#0F172A]">
                        {vehicle.auctionDuration
                            ? formatLabel(vehicle.auctionDuration)
                            : "—"}
                    </p>
                </div>

                <div>
                    <p className="text-xs text-slate-400 mb-1">
                        Auction Type
                    </p>
                    <p className="text-sm font-semibold text-[#0F172A]">
                        {vehicle.auctionType
                            ? formatLabel(vehicle.auctionType)
                            : "—"}
                    </p>
                </div>
            </div>

            {/* Auction Dates */}
            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3">
                <div>
                    <p className="text-xs text-slate-400 mb-1">
                        Started
                    </p>
                    <p className="text-sm font-semibold text-[#0F172A]">
                        {vehicle.auctionStartDateTime
                            ? formatDateTime(vehicle.auctionStartDateTime)
                            : "—"}
                    </p>
                </div>

                <div>
                    <p className="text-xs text-slate-400 mb-1">
                        Ended
                    </p>
                    <p className="text-sm font-semibold text-[#0F172A]">
                        {vehicle.auctionEndDateTime
                            ? formatDateTime(vehicle.auctionEndDateTime)
                            : "—"}
                    </p>
                </div>
            </div>

            {/* Pricing Info */}
            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3">
                <div>
                    <p className="text-xs text-slate-400 mb-1">
                        Price Type
                    </p>
                    <p className="text-sm font-semibold text-[#0F172A]">
                        {vehicle.priceType
                            ? formatLabel(vehicle.priceType)
                            : "—"}
                    </p>
                </div>

                <div>
                    <p className="text-xs text-slate-400 mb-1">
                        {vehicle.priceType === "fixed_price"
                            ? "Buy Now Price"
                            : "Starting Bid"}
                    </p>

                    <p className="text-sm font-semibold text-[#0F172A]">
                        {vehicle.priceType === "fixed_price"
                            ? vehicle.buyNowPrice != null
                                ? formatPrice(vehicle.buyNowPrice)
                                : "—"
                            : vehicle.startingBidPrice != null
                                ? formatPrice(vehicle.startingBidPrice)
                                : "—"}
                    </p>
                </div>
            </div>
            <div
                className={`w-fit px-3 py-1.5 rounded-full text-[11px] font-semibold ${isReserveNotMet
                    ? "bg-amber-50 border border-amber-200 text-amber-700"
                    : "bg-red-50 border border-red-200 text-red-600"
                    }`}
            >
                {isReserveNotMet
                    ? "Reserve Price Not Met"
                    : "Auction Ended Without Sale"}
            </div>
        </div>
    );
}

const getStatusBadge = (auctionStatus) => {
    switch (auctionStatus?.toLowerCase()) {
        case 'sold':
            return {
                bg: 'bg-emerald-600',
                text: 'Sold'
            };
        case 'unsold':
            return {
                bg: 'bg-red-600',
                text: 'Not Sold'
            };
        case 'reserve-not-met':
            return {
                bg: 'bg-amber-500',
                text: 'Reserve Not Met'
            };
        default:
            return {
                bg: 'bg-slate-500',
                text: auctionStatus
            };
    }
};

function EndedAuctionsDetail() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [bidPage] = useState(1);
    const token = useAuthStore((state) => state.token);

    const { data, isLoading, isError } = usePublicAuctionDetail(id);
    const { data: watchlistIds } = useGetWatchlistIds();
    const { mutate: toggleWatchlist, isPending, variables: pendingId } = useToggleWatchlist();

    const vehicle = data?.data;
    useStatusRedirect(vehicle, '/live-ended-detail');

    // for bid chart - sold
    const { data: bidsData } = useGetPublicAuctionBids(vehicle?._id, bidPage, 20);

    if (isLoading) {
        return <Loader />
    }
    if (isError) return <p className="p-10 text-center text-red-500">Failed to load ended auctions</p>;
    if (!vehicle) return <div className="p-10 text-center">Vehicle not found!</div>;

    const isWatchlisted = !!watchlistIds?.has(vehicle._id);
    const isToggling = isPending && pendingId === vehicle._id;

    const isSold = vehicle.auctionStatus === "sold";
    const isUnSold = vehicle.auctionStatus === "unsold";
    const isReserveNotMet = vehicle.auctionStatus === "reserve-not-met";
    const isFixedPrice = vehicle.priceType === "fixed_price";
    const bids = bidsData?.data || [];

    const statusInfo = getStatusBadge(vehicle.auctionStatus);

    // watchlist handler
    const handleWatchlistClick = (e, vehicle) => {
        e.stopPropagation();

        if (!token) {
            toast.info('Please login to manage your watchlist');
            navigate('/login');
            return;
        }

        toggleWatchlist(vehicle._id, {
            onSuccess: (data) => {
                toast.success(data?.message || 'Watchlist updated successfully');
            },
            onError: (error) => {
                toast.error(
                    error?.response?.data?.message || 'Failed to update watchlist'
                );
            },
        });
    };

    const breadcrumbItems = [
        { label: 'Home', path: '/' },
        { label: 'Ended Auctions', path: '/ended-auctions' },
        {
            label: vehicle
                ? `${vehicle.year} ${formatLabel(vehicle.make)} ${formatLabel(vehicle.model)}`
                : 'Vehicle Detail'
        }
    ];

    const metaItems = [
        { icon: <MapPin size={16} />, label: formatLabel(vehicle.emirate) },
        { icon: <Hash size={16} />, label: vehicle.listingId },
        { icon: <Cog size={16} />, label: `${formatLabel(vehicle.engineSize)}` },
        { icon: <Gauge size={16} />, label: `${vehicle.mileage?.toLocaleString()} km` },
        { icon: <Flag size={16} />, label: formatLabel(vehicle.drivetrain) },
        { icon: <Fuel size={16} />, label: formatLabel(vehicle.fuelType) }
    ];

    // feature bar - unsold, not met
    const stats = [
        {
            icon: Gavel,
            label: isFixedPrice ? "Listed Price" : "Highest Bid",
            value: isFixedPrice
                ? vehicle.buyNowPrice != null
                    ? formatPrice(vehicle.buyNowPrice)
                    : "—"
                : vehicle.currentBid != null
                    ? formatPrice(vehicle.currentBid)
                    : "No Bids",
            colorClass: "bg-amber-50 text-[#D97706]",
        },
        {
            icon: Users,
            label: "Total Bids",
            value: isFixedPrice
                ? "0"
                : vehicle.totalBids ?? 0,
            colorClass: "bg-blue-50 text-blue-600",
        },
        {
            icon: Clock,
            label: "Auction Duration",
            value: vehicle.auctionDuration
                ? formatLabel(vehicle.auctionDuration)
                : "—",
            colorClass: "bg-purple-50 text-purple-600",
        },
        {
            icon: isReserveNotMet ? AlertCircle : XCircle,
            label: "Auction Status",
            value: isReserveNotMet
                ? "Reserve Not Met"
                : "Unsold",
            colorClass: isReserveNotMet
                ? "bg-amber-50 text-amber-600"
                : "bg-red-50 text-red-600",
        },
    ];

    const auctionTabs = [
        {
            key: "overview",
            label: "Overview",
            content: <OverviewTab vehicle={vehicle} />,
        },
        {
            key: "specifications",
            label: "Specifications",
            content: <VehiclInfoTab vehicle={vehicle} />,
        },
        {
            key: "inspection",
            label: "Inspection Report",
            content: <InspectionTab vehicle={vehicle} />,
        },

        ...(vehicle.auctionStatus !== "unsold"
            ? [
                {
                    key: "bidding",
                    label: "Bidding History",
                    content: <BiddingHistoryTab vehicle={vehicle} />,
                },
            ]
            : []),

        {
            key: "documents",
            label: "Documents",
            content: <DocumentsTab vehicle={vehicle} />,
        },
        {
            key: "location",
            label: "Location",
            content: <LocationTab vehicle={vehicle} />,
        },
    ];

    // bid chart
    const bidProgressData = [...bids]
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .map((bid, index) => ({
            name: `Bid ${index + 1}`,
            amount: bid.amount,
        }));

    const openingBid =
        vehicle?.startingBidPrice ??
        bidProgressData[0]?.amount ??
        0;

    const finalBid =
        vehicle?.currentBid ??
        bidProgressData[bidProgressData.length - 1]?.amount ??
        0;

    return (
        <section className='w-full'>

            {/* ========= breadcrumb ========= */}
            <div className='max-w-6xl mx-auto px-4 sm:px-5 lg:px-6 '>
                <Breadcrumbs items={breadcrumbItems} />
            </div>

            <div className='max-w-6xl mx-auto px-4 sm:px-5 lg:px-6'>

                {/* ========= header ========= */}
                <div className=" border-b border-slate-100">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className='flex gap-3 items-center'>
                            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                                {`${vehicle.year} ${formatLabel(vehicle.make)} ${formatLabel(vehicle.model)}`}
                            </h1>

                            <div className="flex gap-2 mt-3">
                                <span className={`${statusInfo.bg} text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest`}>
                                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span> {statusInfo.text}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all">
                                <Share2 size={18} /> Share
                            </button>

                            <button
                                onClick={(e) => handleWatchlistClick(e, vehicle)}
                                disabled={isToggling}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${isWatchlisted
                                    ? "bg-orange-50 text-[#D97706] border border-orange-200 hover:bg-orange-100"
                                    : "border border-slate-200 text-slate-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                                    }`}
                            >
                                <Heart
                                    size={18}
                                    className={isWatchlisted ? "fill-current" : ""}
                                />
                                {isWatchlisted ? "Added to Watchlist" : "Add to Watchlist"}
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-6 text-slate-600 text-sm font-medium">
                        {metaItems.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                                <span className="opacity-70">{item.icon}</span>
                                <span>{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ======== Auction Ended Banner ======== */}
                {!isSold && (
                    <div
                        className={`flex items-center justify-between rounded-lg px-4 py-3 mt-4 
                            ${isReserveNotMet ? "bg-amber-50 border border-amber-200" : "bg-red-50 border border-red-200"}`}
                    >
                        <div
                            className={`flex items-center gap-2 text-sm font-medium 
                                ${isReserveNotMet ? "text-amber-600" : "text-red-600"}`}
                        >
                            <AlertCircle size={16} />

                            <span>
                                Auction Ended on{" "}
                                {formatDateTime(vehicle.auctionEndDateTime)}
                            </span>
                        </div>

                        <span
                            className={`text-sm font-medium 
                                ${isReserveNotMet ? "text-amber-600" : "text-red-600"}`}
                        >
                            Reason:{" "}
                            {isUnSold
                                ? "No Successful Bids"
                                : isReserveNotMet
                                    ? "Reserve Price Not Met"
                                    : "Auction Ended"}
                        </span>
                    </div>
                )}

                <div className={`grid grid-cols-1 gap-5 mt-6 items-stretch 
                ${isSold ? 'lg:grid-cols-12' : 'lg:grid-cols-9'}`}>

                    {/* Gallery */}
                    <div className={`${isSold ? 'lg:col-span-5' : 'lg:col-span-5'} flex flex-col h-full`}>
                        <div className="relative flex flex-col h-full">

                            {isSold ? (
                                <EndedSoldGallery
                                    images={vehicle.images?.map(img => img.url) || []}
                                    status={vehicle.auctionStatus}
                                />
                            ) : (
                                <EndedUnsoldGallery
                                    images={vehicle.images?.map(img => img.url) || []}
                                    status={vehicle.auctionStatus}
                                />
                            )}

                        </div>
                    </div>

                    {/* Bid Panel  */}
                    <div className="lg:col-span-4 flex flex-col">
                        {isSold ? (
                            <SoldBidPanel vehicle={vehicle} />
                        ) : (
                            <UnsoldBidPanel vehicle={vehicle} />
                        )}
                    </div>

                    {isSold && (
                        <div className="lg:col-span-3 flex flex-col">
                            <div className="flex flex-col gap-4 h-full">

                                {/* Auction Information Card */}
                                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex-1">
                                    <h2 className="text-base font-bold text-[#0B1E3D] mb-4">Auction Information</h2>

                                    <div className="space-y-4">
                                        {[
                                            {
                                                icon: Tag,
                                                label: "Lot Number",
                                                value: vehicle.listingId
                                                    ? `${vehicle.listingId}`
                                                    : "—"
                                            },
                                            {
                                                icon: Calendar,
                                                label: "Start Date",
                                                value: vehicle.auctionStartDateTime
                                                    ? formatDateTime(vehicle.auctionStartDateTime)
                                                    : "—"
                                            },
                                            {
                                                icon: Calendar,
                                                label: "End Date",
                                                value: vehicle.auctionEndDateTime
                                                    ? formatDateTime(vehicle.auctionEndDateTime)
                                                    : "—"
                                            },
                                            {
                                                icon: Clock,
                                                label: "Auction Duration",
                                                value: vehicle.auctionDuration
                                                    ? formatLabel(vehicle.auctionDuration)
                                                    : "—"
                                            },
                                            {
                                                icon: MapPin,
                                                label: "Location",
                                                value: [
                                                    vehicle.city,
                                                    vehicle.emirate
                                                        ? formatLabel(vehicle.emirate)
                                                        : null
                                                ]
                                                    .filter(Boolean)
                                                    .join(", ") || "—"
                                            },
                                            {
                                                icon: User,
                                                label: "Seller Type",
                                                value: vehicle.sellerInfo?.businessType
                                                    ? formatLabel(vehicle.sellerInfo.businessType)
                                                    : "—"
                                            },
                                        ].map((item, idx) => {
                                            const Icon = item.icon;

                                            return (
                                                <div
                                                    key={idx}
                                                    className="flex justify-between items-center text-sm"
                                                >
                                                    <div className="flex items-center gap-2 text-slate-500">
                                                        <Icon size={15} />
                                                        <span>{item.label}</span>
                                                    </div>

                                                    <span className="font-medium text-[#0B1E3D] text-[12px] text-right">
                                                        {item.value}
                                                    </span>
                                                </div>
                                            );
                                        })}

                                        {/* Seller Name */}
                                        <div className="flex justify-between items-start pt-2 border-t border-slate-100">
                                            <span className="text-slate-500 text-sm">Seller Name</span>

                                            <div className="flex flex-col items-end gap-1">
                                                <span className="font-bold text-[#0B1E3D] text-[12px]">
                                                    {vehicle.sellerInfo?.name || "—"}
                                                </span>

                                                {vehicle.sellerInfo?.name && (
                                                    <span className="flex items-center gap-1 text-[#D97706] text-xs font-semibold bg-orange-50 px-2 py-1 rounded-full">
                                                        <ShieldCheck size={11} />
                                                        Verified
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                {/* Share Vehicle Card */}
                                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-bold text-[#0B1E3D] mb-1 text-sm">
                                            Share this vehicle
                                        </h3>
                                    </div>

                                    <p className="text-slate-500 text-xs mb-3">
                                        Know someone who might be interested?
                                    </p>

                                    <div className="flex gap-2">
                                        {[FaFacebookF, FaXTwitter, MessageCircle, Mail, Link].map(
                                            (Icon, idx) => (
                                                <button
                                                    key={idx}
                                                    className="p-2 border border-slate-200 rounded-lg bg-white text-slate-500 hover:border-[#D97706] hover:text-[#D97706] hover:bg-orange-50 transition-all"
                                                >
                                                    <Icon size={16} />
                                                </button>
                                            )
                                        )}
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}

                </div>

                {/* ======== featurebar ======== */}
                {isSold && (
                    <div>
                        <AuctionFeaturesBar vehicle={vehicle} />
                    </div>
                )}

                {!isSold && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 my-8 bg-linear-to-br from-white via-slate-50/60 to-white border border-slate-200/80 rounded-3xl shadow-xl shadow-slate-200/40 backdrop-blur-md">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="group relative flex items-center gap-4 px-3 py-2 rounded-2xl transition-all duration-300 hover:bg-white hover:shadow-sm"
                            >
                                <div className={`p-3 rounded-2xl shadow-sm transition-transform duration-300 group-hover:scale-105 shrink-0 ${stat.colorClass}`}>
                                    <stat.icon size={22} strokeWidth={2.2} />
                                </div>

                                <div className="flex flex-col min-w-0">
                                    <span className="text-xl font-black text-slate-900 tracking-tight truncate">
                                        {stat.value}
                                    </span>
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate mt-0.5">
                                        {stat.label}
                                    </span>
                                </div>

                                {index < stats.length - 1 && (
                                    <div className="hidden md:block w-px h-10 bg-slate-200/80 ml-auto" />
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* ======== tabs - sold/unsold ======== */}
                <div className="mt-10">
                    <DetailTabs
                        tabs={auctionTabs}
                        defaultTab="overview"
                    />
                </div>

                {/* ======== sold ======== */}
                {isSold && (
                    <div className={`mt-10 grid grid-cols-1 md:grid-cols-${vehicle.priceType === "reserve_price" ? "3" : "2"} gap-6`}>

                        {/* market insights */}
                        <div className="w-full">
                            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm w-full h-full flex flex-col">
                                <h2 className="text-xl font-bold text-[#0B1E3D] mb-4">Market Insights</h2>

                                {/* Stats Section */}
                                <div className="space-y-4 flex-1">
                                    <div>
                                        <p className="text-sm text-slate-500">Market Value</p>
                                        <p className="text-lg font-bold text-[#0B1E3D]">AED 165,000 – 185,000</p>
                                    </div>

                                    <div className='flex justify-between'>
                                        <div>
                                            <p className="text-sm text-slate-500">Avg. Selling Price</p>
                                            <p className="text-lg font-bold text-[#0B1E3D]">AED 172,000</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">This Vehicle Sold For</p>
                                            <p className="text-lg font-bold text-[#10B981]">AED 285,000</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 my-3" />

                                {/* Recharts Trend Chart */}
                                <div className="mt-auto">
                                    <h3 className="font-bold text-[#0B1E3D] mb-2 text-sm">Price Trend (Last 6 Months)</h3>
                                    <div className="h-32 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={chartData}>
                                                <defs>

                                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <XAxis dataKey="name" hide />
                                                <YAxis hide domain={['auto', 'auto']} />
                                                <Tooltip
                                                    cursor={{ stroke: '#3B82F6', strokeWidth: 1 }}
                                                    contentStyle={{ borderRadius: '8px' }}
                                                />

                                                <Area
                                                    type="monotone"
                                                    dataKey="value"
                                                    stroke="#3B82F6"
                                                    strokeWidth={3}
                                                    fillOpacity={1}
                                                    fill="url(#colorValue)"
                                                    dot={{
                                                        r: 4,
                                                        fill: '#ffffff',
                                                        stroke: '#3B82F6',
                                                        strokeWidth: 2
                                                    }}
                                                    activeDot={{
                                                        r: 6,
                                                        fill: '#3B82F6'
                                                    }}
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* bid progress */}
                        {vehicle.priceType === "reserve_price" && (
                            <div className="w-full">
                                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm w-full">
                                    <h2 className="text-xl font-bold text-[#0B1E3D] mb-6">
                                        Bid Progress
                                    </h2>

                                    {/* Header Info */}
                                    <div className="flex justify-between mb-6">
                                        <div>
                                            <p className="text-sm text-slate-500">Opening Bid</p>
                                            <p className="text-lg font-bold text-[#0B1E3D]">
                                                {openingBid
                                                    ? formatPrice(openingBid)
                                                    : "—"}
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-sm text-slate-500">Final Bid</p>
                                            <p className="text-lg font-bold text-[#0B1E3D]">
                                                {finalBid
                                                    ? formatPrice(finalBid)
                                                    : "—"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Chart */}
                                    <div className="h-48 w-full mb-4">
                                        {bidProgressData.length > 0 ? (
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={bidProgressData}>
                                                    <defs>
                                                        <linearGradient
                                                            id="bidGradient"
                                                            x1="0"
                                                            y1="0"
                                                            x2="0"
                                                            y2="1"
                                                        >
                                                            <stop
                                                                offset="5%"
                                                                stopColor="#3B82F6"
                                                                stopOpacity={0.2}
                                                            />
                                                            <stop
                                                                offset="95%"
                                                                stopColor="#3B82F6"
                                                                stopOpacity={0}
                                                            />
                                                        </linearGradient>
                                                    </defs>

                                                    <YAxis
                                                        hide
                                                        domain={["dataMin - 10000", "dataMax + 10000"]}
                                                    />

                                                    <Tooltip
                                                        formatter={(value) => [
                                                            formatPrice(value),
                                                            "Bid",
                                                        ]}
                                                        contentStyle={{
                                                            borderRadius: "8px",
                                                            fontSize: "12px",
                                                            borderColor: "#e2e8f0",
                                                        }}
                                                    />

                                                    <Area
                                                        type="monotone"
                                                        dataKey="amount"
                                                        stroke="#3B82F6"
                                                        strokeWidth={3}
                                                        fill="url(#bidGradient)"
                                                        dot={{
                                                            r: 4,
                                                            fill: "#fff",
                                                            stroke: "#3B82F6",
                                                            strokeWidth: 2,
                                                        }}
                                                        activeDot={{
                                                            r: 6,
                                                            fill: "#3B82F6",
                                                        }}
                                                    />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <div className="h-full flex items-center justify-center text-sm text-slate-400">
                                                No bidding activity available
                                            </div>
                                        )}
                                    </div>

                                    {/* Legend */}
                                    <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                                        <span className="w-3 h-3 rounded-xs bg-[#3B82F6]"></span>
                                        <span>Bid Amount (AED)</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* seller info */}
                        <div className="w-full">
                            <SellerInfo vehicle={vehicle} />
                        </div>
                    </div>
                )}

                {/* ======== unsold ======== */}
                {!isSold && (
                    <div className={`mt-10 grid grid-cols-1 md:grid-cols-${vehicle.priceType === "reserve_price" ? "3" : "2"} gap-6`}>

                        {/* auc analytics */}
                        {vehicle.priceType === 'reserve_price' && vehicle.totalBids > 0 && (
                            <div className="w-full">
                                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm w-full h-full">
                                    <h2 className="text-xl font-bold text-[#0B1E3D] mb-6">
                                        Auction Analytics
                                    </h2>

                                    {/* Header Info */}
                                    <div className="grid grid-cols-2 gap-4 mb-2">
                                        <div>
                                            <p className="text-sm text-slate-500 mb-0.5">
                                                Opening Bid
                                            </p>
                                            <p className="text-lg font-bold text-[#0B1E3D]">
                                                {vehicle.startingBidPrice != null
                                                    ? formatPrice(vehicle.startingBidPrice)
                                                    : "—"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-slate-500 mb-0.5">
                                                Highest Bid
                                            </p>
                                            <p className="text-lg font-bold text-[#0B1E3D]">
                                                {vehicle.currentBid != null
                                                    ? formatPrice(vehicle.currentBid)
                                                    : "—"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Chart */}
                                    <div className="h-50 w-full mb-4">
                                        {bidProgressData?.length > 0 ? (
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={bidProgressData}>
                                                    <defs>
                                                        <linearGradient
                                                            id="analyticsGradient"
                                                            x1="0"
                                                            y1="0"
                                                            x2="0"
                                                            y2="1"
                                                        >
                                                            <stop
                                                                offset="0%"
                                                                stopColor="#3B82F6"
                                                                stopOpacity={0.2}
                                                            />
                                                            <stop
                                                                offset="100%"
                                                                stopColor="#3B82F6"
                                                                stopOpacity={0}
                                                            />
                                                        </linearGradient>
                                                    </defs>

                                                    <YAxis
                                                        hide
                                                        domain={[
                                                            "dataMin - 10000",
                                                            "dataMax + 10000",
                                                        ]}
                                                    />

                                                    <Tooltip
                                                        cursor={{
                                                            stroke: "#CBD5E1",
                                                            strokeDasharray: "4 4",
                                                        }}
                                                        contentStyle={{
                                                            borderRadius: "8px",
                                                            border: "1px solid #E2E8F0",
                                                            fontSize: "11px",
                                                            padding: "6px 8px",
                                                        }}
                                                        formatter={(value) => [
                                                            formatPrice(value),
                                                            "Bid",
                                                        ]}
                                                    />

                                                    {vehicle.reservePrice != null && (
                                                        <ReferenceLine
                                                            y={vehicle.reservePrice}
                                                            stroke="#EF4444"
                                                            strokeDasharray="5 4"
                                                            strokeWidth={1.5}
                                                        />
                                                    )}

                                                    <Area
                                                        type="monotone"
                                                        dataKey="amount"
                                                        stroke="#3B82F6"
                                                        strokeWidth={2.5}
                                                        fill="url(#analyticsGradient)"
                                                        dot={{
                                                            r: 3.5,
                                                            fill: "#fff",
                                                            stroke: "#3B82F6",
                                                            strokeWidth: 2,
                                                        }}
                                                        activeDot={{
                                                            r: 5,
                                                            fill: "#3B82F6",
                                                            stroke: "#fff",
                                                            strokeWidth: 2,
                                                        }}
                                                    />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <div className="h-full flex items-center justify-center rounded-lg bg-slate-50 border border-dashed border-slate-200">
                                                <p className="text-xs text-slate-400">
                                                    No bidding activity
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Legend */}
                                    <div className="flex items-center justify-center gap-5 text-[12px] text-slate-600">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
                                            <span>Bid Amount (AED)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* market insights */}
                        <div className="w-full">
                            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                                <h2 className="text-xl font-bold text-[#0B1E3D] mb-6">Market Insights</h2>

                                <div className="mb-6">
                                    <p className="text-sm text-slate-500 mb-1">Average Market Price</p>
                                    <p className="text-2xl font-bold text-[#0B1E3D]">AED {unSoldMarketdata.avgMarketPrice.toLocaleString()}</p>
                                </div>

                                <div className="border-t border-slate-100 my-6" />

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">Highest Bid</p>
                                        <p className="text-lg font-bold text-[#0B1E3D]">AED {unSoldMarketdata.highestBid.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">Difference</p>
                                        <p className="text-lg font-bold text-red-600">
                                            {unSoldMarketdata.difference > 0 ? '+' : ''}{unSoldMarketdata.difference.toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                {unSoldMarketdata.hasBelowMarketWarning && (
                                    <div className="bg-red-50 border border-red-100 p-3 rounded-lg flex items-start gap-2">
                                        <AlertCircle className="text-red-500 shrink-0" size={18} />
                                        <p className="text-sm text-red-600 font-medium">
                                            Vehicle received bids below market value.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="w-full">
                            <SellerInfo vehicle={vehicle} />
                        </div>

                    </div>
                )}

                {/* ======== unsold - notify ======== */}
                {!isSold && (
                    <div className='mt-10'>
                        <div className="w-full bg-red-50 border border-red-100 rounded-xl p-4 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-red-100 rounded-lg shadow-sm border border-red-100">
                                    <Bell className="text-red-500" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#0B1E3D]">Interested in this vehicle?</h3>
                                    <p className="text-sm text-slate-600">
                                        Get notified if this vehicle returns to auction.
                                    </p>
                                </div>
                            </div>

                            <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors shadow-sm">
                                <Bell size={18} />
                                Notify Me
                            </button>
                        </div>
                    </div>
                )}

                {/* ======== similar sold ======== */}
                <div className='mt-6'>
                    <HomeRecentlySold />
                </div>
            </div>

            {/* ======= bottom - features ======= */}
            <AuctionBottomFeaturesBar />
        </section>
    )
}

export default EndedAuctionsDetail;
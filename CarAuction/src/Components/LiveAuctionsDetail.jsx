
import React, { useState } from 'react';
import { useParams } from 'react-router-dom'
import { Share2, Heart, MapPin, Hash, Fingerprint, Cog, Flag, Fuel, Download, Send } from 'lucide-react';
import Breadcrumbs from './Breadcrumbs';
import LiveBidsPanel from './SharedComponents/LiveBidsPanel';
import AuctionFeaturesBar from './SharedComponents/AuctionFeatureBar';
import HomeLiveAuctions from './HomeLiveAuctions';
import LiveAuctionGallery from './LiveAuctionGallery';

import OverviewTab from './OverviewTab';
import VehiclInfoTab from './VehicleInfoTab';
import InspectionTab from './InspectionTab';
import ConditionTab from './ConditionTab';
import DetailTabs from './DetailTabs';
import BiddingHistoryTab from './BiddingHistoryTab';
import DocumentsTab from './DocumentsTab';
import ShippingPaymentsTab from './ShippingPaymentsTab';
import AuctionBottomFeaturesBar from './SharedComponents/AuctionBottomFeaturesBar';
import { formatDateTime, formatLabel, formatPrice } from '../utils/formatters';
import { UseCountdown } from './SharedComponents/UseCountdown';

import { usePublicAuctionDetail } from '../hook/useAuction';

const bidderAvatars = [
    { initials: "JM", color: "bg-blue-500" },
    { initials: "AH", color: "bg-green-500" },
    { initials: "SK", color: "bg-purple-500" },
    { initials: "MR", color: "bg-red-500" },
    { initials: "DW", color: "bg-yellow-500" },
];

const initialMessages = [
    { user: "Ali Hassan", text: "This is a great car! 🔥" },
    { user: "AutoBid Assistant", text: "The engine is in excellent condition." }
];

const InfoRow = ({ label, value }) => (
    <div className="flex justify-between">
        <span className="text-slate-500">{label}</span>
        <span className="font-medium text-slate-900">{value}</span>
    </div>
);

// count-down
const AuctionTimeLeft = ({ auctionEndDateTime }) => {
    const timeLeft = UseCountdown(auctionEndDateTime);

    return (
        <div className={`py-3 grid ${timeLeft.days > 0 ? 'grid-cols-4' : 'grid-cols-3'} gap-2`}>
            {timeLeft.days > 0 && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg py-2 text-center">
                    <p className="text-sm font-bold text-[#0B1E3D]">
                        {String(timeLeft.days).padStart(2, '0')}
                    </p>
                    <span className="text-[8px] text-slate-800 uppercase tracking-widest">
                        DAYS
                    </span>
                </div>
            )}

            <div className="bg-slate-50 border border-slate-200 rounded-lg py-2 text-center">
                <p className="text-sm font-bold text-[#0B1E3D]">
                    {String(timeLeft.hours).padStart(2, '0')}
                </p>
                <span className="text-[8px] text-slate-800 uppercase tracking-widest">
                    HRS
                </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg py-2 text-center">
                <p className="text-sm font-bold text-[#0B1E3D]">
                    {String(timeLeft.mins).padStart(2, '0')}
                </p>
                <span className="text-[8px] text-slate-800 uppercase tracking-widest">
                    MINS
                </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg py-2 text-center">
                <p className="text-sm font-bold text-[#D97706]">
                    {String(timeLeft.secs).padStart(2, '0')}
                </p>
                <span className="text-[8px] text-slate-800 uppercase tracking-widest">
                    SECS
                </span>
            </div>
        </div>
    );
};

function LiveAuctionsDetail() {

    const { id } = useParams();

    const [messages, setMessages] = useState(initialMessages);
    const [newMessage, setNewMessage] = useState("");

    const { data, isLoading, isError } = usePublicAuctionDetail(id);

    const vehicle = data?.data;

    if (isLoading) return <p className="p-10 text-center">Loading live auctions....</p>;
    if (isError) return <p className="p-10 text-center text-red-500">Failed to load live auctions</p>;
    if (!vehicle) return <div className="p-10 text-center">Vehicle not found!</div>;

    const progress =
        vehicle?.priceType === 'reserve_price' && vehicle.reservePrice
            ? Math.min(
                ((vehicle.currentBid || vehicle.startingBidPrice || 0) / vehicle.reservePrice) * 100,
                100
            )
            : 0;

    const breadcrumbItems = [
        { label: 'Home', path: '/' },
        { label: 'Live Auctions', path: '/live-auctions' },
        {
            label: vehicle
                ? `${vehicle.year} ${formatLabel(vehicle.make)} ${formatLabel(vehicle.model)}`
                : 'Vehicle Detail'
        }
    ];

    const metaItems = [
        { icon: <MapPin size={16} />, label: formatLabel(vehicle.emirate) },
        { icon: <Hash size={16} />, label: vehicle.listingId },
        { icon: <Cog size={16} />, label: `${formatLabel(vehicle.engineSize)} ${vehicle.mileage}` },
        { icon: <Flag size={16} />, label: formatLabel(vehicle.drivetrain) },
        { icon: <Fuel size={16} />, label: formatLabel(vehicle.fuelType) }
    ];

    const liveAuctionTabs = [
        {
            key: "overview",
            label: "Overview",
            content: <OverviewTab vehicle={vehicle} />,
        },
        {
            key: "specifications",
            label: "Specifications",
            content: <VehiclInfoTab vehicle={vehicle} />, // reuse
        },
        {
            key: "inspection",
            label: "Inspection Report",
            content: <InspectionTab vehicle={vehicle} />, // reuse
        },
        {
            key: "condition",
            label: "Condition Report",
            content: <ConditionTab vehicle={vehicle} />, // reuse
        },
        {
            key: "bidding",
            label: "Bidding History",
            content: <BiddingHistoryTab vehicle={vehicle} />,
        },
        {
            key: "documents",
            label: "Documents",
            content: <DocumentsTab vehicle={vehicle} />,
        },
        {
            key: "shipping",
            label: "Shipping & Payments",
            content: <ShippingPaymentsTab vehicle={vehicle} />,
        },
    ];

    const infoItems = [
        { label: "Auction Type", value: formatLabel(vehicle.auctionType) },
        { label: "Start Time", value: formatDateTime(vehicle.auctionStartDateTime) },
        { label: "End Time", value: formatDateTime(vehicle.auctionEndDateTime) },
        { label: "Listing ID", value: vehicle.listingId },
        { label: "Seller", value: formatLabel(vehicle?.sellerInfo?.name) },
        { label: "Location", value: formatLabel(vehicle.emirate) },

        ...(vehicle.priceType === "fixed_price"
            ? [
                {
                    label: "Buy Now Price",
                    value: formatPrice(vehicle.buyNowPrice)
                }
            ]
            : []),

        { label: "Vehicle Condition", value: formatLabel(vehicle.overallCondition) },
        { label: "Auction Status", value: formatLabel(vehicle.auctionStatus) },
    ];

    return (
        <section className='w-full'>

            {/* ========= breadcrumb ========= */}
            <div className='max-w-6xl mx-auto px-4 sm:px-5 lg:px-6 pt-4'>
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
                                <span className="bg-orange-50 text-orange-600 border border-orange-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                                    Live Auction
                                </span>
                                <span className="bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                                    Featured
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all">
                                <Share2 size={18} /> Share
                            </button>

                            <button className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all">
                                <Heart size={18} /> Add to Watchlist
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

                {/* ======== top-content grid ======== */}
                <div
                    className={`grid grid-cols-1 gap-5 mt-6 ${vehicle.priceType === 'fixed_price'
                        ? 'lg:grid-cols-9'
                        : 'lg:grid-cols-12'
                        }`}
                >
                    {/* Gallery */}
                    <div className="lg:col-span-5 flex flex-col">
                        <LiveAuctionGallery
                            images={vehicle.images?.map(img => img.url) || []}
                            status={vehicle.auctionStatus}
                        />
                    </div>

                    {/* Bidding / Buy Now Controls */}
                    <div className="lg:col-span-4 flex flex-col">
                        <div className="bg-[#0B1E3D] text-white p-4 rounded-2xl shadow-xl">

                            {/* Header */}
                            <div className="flex justify-between items-center my-3">
                                <span className="text-sm font-medium text-slate-300">
                                    Auction Ends In
                                </span>

                                <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#D97706] bg-[#D97706]/10 px-2 py-0.5 rounded">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] animate-pulse"></span>
                                    LIVE
                                </span>
                            </div>

                            {/* Countdown */}
                            <AuctionTimeLeft
                                auctionEndDateTime={vehicle.auctionEndDateTime}
                            />

                            {/* Price / Bid Info */}
                            <div className="space-y-2.5 mt-4 border-t border-slate-600 pt-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-slate-400 text-[9px] uppercase tracking-wide">
                                            {vehicle.priceType === 'fixed_price'
                                                ? 'Buy Now Price'
                                                : vehicle.currentBid != null
                                                    ? 'Current Highest Bid'
                                                    : 'Starting Bid'}
                                        </p>

                                        <p className="text-lg font-bold mt-0.5 text-[#D97706]">
                                            {vehicle.priceType === 'fixed_price'
                                                ? formatPrice(vehicle.buyNowPrice)
                                                : vehicle.currentBid != null
                                                    ? formatPrice(vehicle.currentBid)
                                                    : vehicle.startingBidPrice != null
                                                        ? formatPrice(vehicle.startingBidPrice)
                                                        : 'N/A'}
                                        </p>
                                    </div>

                                    {vehicle.priceType !== 'fixed_price' && (
                                        <div>
                                            <p className="text-slate-400 text-[9px] uppercase tracking-wide">
                                                Total Bids
                                            </p>

                                            <p className="text-lg font-bold mt-0.5">
                                                {vehicle.totalBids ?? 0}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {vehicle.priceType === 'fixed_price' && (
                                <div className="mt-4 p-3 rounded-lg bg-[#142d55] border border-slate-700">
                                    <p className="text-[10px] text-slate-400 uppercase tracking-wide">
                                        Direct Purchase
                                    </p>

                                    <p className="text-sm font-semibold text-white mt-1">
                                        Skip the auction and purchase this vehicle instantly.
                                    </p>

                                    <p className="text-[10px] text-slate-400 mt-1">
                                        No bidding required
                                    </p>
                                </div>
                            )}

                            {/* Input & Buttons */}
                            <div className="mt-4 space-y-6">
                                {vehicle.priceType === 'reserve_price' ? (
                                    <>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2.5 text-xs font-bold text-[#D97706]">
                                                AED
                                            </span>

                                            <input
                                                type="number"
                                                placeholder="Enter your bid amount"
                                                className="w-full bg-[#142d55] border border-slate-600 rounded-lg py-2.5 pl-12 pr-3 text-sm text-white placeholder-slate-400 outline-none focus:border-[#D97706]"
                                            />
                                        </div>

                                        <button className="w-full bg-[#D97706] hover:bg-[#b86405] text-white text-sm font-bold py-2.5 rounded-lg transition-all">
                                            Place Bid Now
                                        </button>
                                    </>
                                ) : (
                                    <button className="w-full bg-[#D97706] hover:bg-[#b86405] text-white text-sm font-bold py-2.5 rounded-lg transition-all">
                                        Buy Now {formatPrice(vehicle.buyNowPrice)}
                                    </button>
                                )}
                            </div>

                            {/* Bidders — Reserve Price Only */}
                            {vehicle.priceType === 'reserve_price' && (
                                <div className="mt-3 flex items-center gap-2 pt-3 border-t border-slate-700">
                                    <div className="flex -space-x-1.5">
                                        {bidderAvatars.map((b, i) => (
                                            <div
                                                key={i}
                                                className={`w-6 h-6 rounded-full ${b.color} flex items-center justify-center text-[9px] font-bold text-white ring-2 ring-[#0B1E3D]`}
                                            >
                                                {b.initials}
                                            </div>
                                        ))}

                                        <div className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center text-[9px] font-bold text-white ring-2 ring-[#0B1E3D]">
                                            +6
                                        </div>
                                    </div>

                                    <span className="text-[10px] text-slate-400">
                                        {vehicle.biddersOnline || 12} Bidders Online
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bids Activity — Reserve Price Only */}
                    {vehicle.priceType === 'reserve_price' && (
                        <div className="lg:col-span-3">
                            <LiveBidsPanel bids={vehicle.recentBids || []} />
                        </div>
                    )}
                </div>

                {/* ======== feature bar ======== */}
                <AuctionFeaturesBar vehicle={vehicle} />

                {/* ======== middle section ======== */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

                    {/* auct info */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-4">Auction Information</h3>
                        <div className="space-y-4 text-sm">

                            {infoItems.map((item, index) => (
                                <InfoRow key={index} label={item.label} value={item.value} />
                            ))}
                            <button className="w-full flex items-center justify-center gap-2 mt-6 py-3 px-4 bg-[#0B1E3D] text-white rounded-xl hover:bg-slate-800 transition-all shadow-sm active:scale-[0.99] font-medium text-sm">
                                <Download size={18} /> Download Lot Sheet
                            </button>
                        </div>
                    </div>

                    {/* auc progress card */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-6">Auction Progress</h3>

                        <div className="flex justify-between items-start mb-6">

                            {vehicle.priceType === 'fixed_price' ? (
                                <>
                                    <div>
                                        <p className="text-slate-500 text-sm">Buy Now Price</p>
                                        <p className="text-2xl font-extrabold text-[#D97706]">
                                            {formatPrice(vehicle.buyNowPrice)}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-slate-500 text-sm">Purchase Type</p>
                                        <p className="font-bold text-slate-900">
                                            Fixed Price
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <p className="text-slate-500 text-sm">
                                            {vehicle.currentBid != null
                                                ? 'Current Bid'
                                                : 'Starting Bid'}
                                        </p>

                                        <p className="text-2xl font-extrabold text-[#D97706]">
                                            {formatPrice(
                                                vehicle.currentBid != null
                                                    ? vehicle.currentBid
                                                    : vehicle.startingBidPrice
                                            )}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-slate-500 text-sm">
                                            Reserve Price
                                        </p>

                                        <p className="font-bold text-slate-900">
                                            {formatPrice(vehicle.reservePrice)}
                                        </p>
                                    </div>
                                </>
                            )}

                        </div>

                        {/* Progress Bar */}
                        {vehicle.priceType === 'reserve_price' && (
                            <>
                                {/* Progress Bar */}
                                <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                                    <div
                                        className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>

                                <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-8">
                                    <span>
                                        {formatPrice(vehicle.currentBid || vehicle.startingBidPrice)} Current
                                    </span>

                                    <span>
                                        {formatPrice(vehicle.reservePrice)} Reserve
                                    </span>
                                </div>
                            </>
                        )}

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4 py-6 border-y border-slate-100 mb-6">

                            {vehicle.priceType === 'reserve_price' && (
                                <div className="text-center">
                                    <p className="text-lg font-bold text-slate-900">
                                        {(vehicle.totalBids ?? 0).toLocaleString()}
                                    </p>
                                    <p className="text-[10px] text-slate-400 uppercase font-bold">
                                        Total Bids
                                    </p>
                                </div>
                            )}

                            <div className="text-center">
                                <p className="text-lg font-bold text-slate-900">
                                    {(vehicle.views ?? 0).toLocaleString()}
                                </p>
                                <p className="text-[10px] text-slate-400 uppercase font-bold">
                                    Views
                                </p>
                            </div>

                        </div>

                        <p className="font-bold text-[#0F172A] mb-4">Bid Trend</p>

                        <div className="h-24 w-full bg-linear-to-b from-[#D97706]/10 to-transparent rounded-lg border-b-2 border-[#D97706] flex items-end px-2">

                            <p className="text-[10px] text-[#D97706] font-bold mb-2">Trend data visualization...</p>

                        </div>
                    </div>

                    {/* live chat */}
                    {/* <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col h-100">
                        <h3 className="font-bold text-slate-900 mb-4">Auction Chat</h3>
                        <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
                            {messages.map((msg, idx) => (
                                <div key={idx} className="text-sm">
                                    <p className="font-bold text-slate-900">{msg.user}</p>
                                    <p className="text-slate-600">{msg.text}</p>
                                </div>
                            ))}
                        </div>
                        <div className="relative">
                            <input
                                className="w-full p-3 pr-14 border border-slate-200 bg-slate-50 rounded-xl text-sm  focus:outline-none focus:bg-white focus:border-[#D97706]/50 focus:ring-4 focus:ring-[#D97706]/10 transition-all duration-300"
                                placeholder="Type your message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />

                            <button className="absolute right-2 top-2 p-1.5 text-slate-400 hover:text-[#0F172A] transition-colors duration-300">
                                <Send size={18} />
                            </button>
                        </div>
                    </div> */}
                </div>

                {/* ======== tabs ======== */}
                <div className="mt-10">
                    <DetailTabs
                        tabs={liveAuctionTabs}
                        defaultTab="overview"
                    />
                </div>

                {/* ======= smiliar live auction ======= */}
                <HomeLiveAuctions />

            </div>

            {/* ======= bottom - features ======= */}
            <AuctionBottomFeaturesBar />
        </section>
    )
}

export default LiveAuctionsDetail;

import React from 'react';
import { AlertCircle, Bell } from "lucide-react";
import { useParams } from 'react-router-dom';
import { vehicles } from './Data';
import { Share2, Heart, MapPin, Hash, Fingerprint, Cog, Flag, Fuel, Tag, Calendar, Clock, User, ShieldCheck, MessageCircle, Mail, Link, Gavel, Eye, Users } from 'lucide-react';
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
import ConditionTab from './ConditionTab';
import DetailTabs from './DetailTabs';
import BiddingHistoryTab from './BiddingHistoryTab';
import DocumentsTab from './DocumentsTab';
import ShippingPaymentsTab from './ShippingPaymentsTab';
import LocationTab from './LocationTab';
import AuctionBottomFeaturesBar from './SharedComponents/AuctionBottomFeaturesBar';
import EndedSoldGallery from './EndedSoldGallery';
import EndedUnsoldGallery from './EndedUnSoldGallery';

const stats = [
    { label: 'Total Bids', value: '12', icon: Gavel, colorClass: 'bg-blue-50 text-blue-600' },
    { label: 'Total Views', value: '643', icon: Eye, colorClass: 'bg-emerald-50 text-emerald-600' },
    { label: 'Watchlisted', value: '87', icon: Heart, colorClass: 'bg-purple-50 text-purple-600' },
    { label: 'Interested Buyers', value: '26', icon: Users, colorClass: 'bg-orange-50 text-orange-600' },
];

const data = [
    { name: 'Dec', value: 153000 },
    { name: 'Jan', value: 158000 },
    { name: 'Feb', value: 164000 },
    { name: 'Mar', value: 170000 },
    { name: 'Apr', value: 179000 },
    { name: 'May', value: 192000 },
];

const staticBidData = [
    { step: 'Start', amount: 120000 },
    { step: '1', amount: 135000 },
    { step: '2', amount: 155000 },
    { step: '3', amount: 185000 },
    { step: '4', amount: 200000 },
    { step: '5', amount: 215000 },
    { step: '6', amount: 230000 },
    { step: '7', amount: 245000 },
    { step: '8', amount: 260000 },
    { step: 'End', amount: 285000 },
];

const openingBid = 120000;
const finalBid = 285000;

const unSoldAnalyticsdata = [
    { time: '10:00 AM', amount: 50000 },
    { time: '11:00 AM', amount: 55000 },
    { time: '12:00 PM', amount: 62000 },
    { time: '01:00 PM', amount: 72000 },
    { time: '02:00 PM', amount: 78000 },
    { time: '03:45 PM', amount: 92000 },
];

const reservePrice = 95000;

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
                    <span className="text-sm font-semibold text-green-700">Auction Completed</span>
                </div>
                <p className="text-xs text-green-600 mt-0.5">
                    This auction ended on {vehicle.endedDate}, {vehicle.endedTime} GST
                </p>
            </div>

            <div className='border-x border-b border-gray-200 rounded-b-xl p-4 flex flex-col gap-4'>
                {/* Winning Bid */}
                <div>
                    <p className="text-sm text-slate-500 mb-1">Winning Bid</p>
                    <p className="text-3xl font-bold text-[#D97706]">{vehicle.soldPrice}</p>
                </div>

                {/* Sold To / Winning Country */}
                <div className="grid grid-cols-2 gap-4 border border-slate-200 rounded-xl p-4">
                    <div>
                        <p className="text-xs text-slate-400 mb-1">Sold To</p>
                        <p className="text-sm font-semibold text-[#0F172A]">{vehicle.winner}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 mb-1">Winning Country</p>
                        <div className="flex items-center gap-1.5">
                            <p className="text-sm font-semibold text-[#0F172A]">UAE</p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="border border-slate-200 rounded-xl p-4">
                        <p className="text-xs text-slate-400 mb-1">Final Bid</p>
                        <p className="text-sm font-semibold text-[#0F172A]">{vehicle.soldPrice}</p>
                    </div>
                    <div className="border border-slate-200 rounded-xl p-4">
                        <p className="text-xs text-slate-400 mb-1">Number Of Bids</p>
                        <p className="text-sm font-semibold text-[#0F172A]">{vehicle.totalBids ?? '—'}</p>
                    </div>
                    <div className="border border-slate-200 rounded-xl p-4">
                        <p className="text-xs text-slate-400 mb-1">Reserve Price</p>
                        <p className="text-sm font-semibold text-[#0F172A]">{vehicle.reservePrice ?? '—'}</p>
                    </div>
                    <div className="border border-slate-200 rounded-xl p-4">
                        <p className="text-xs text-slate-400 mb-1">Auction Type</p>
                        <p className="text-sm font-semibold text-[#0F172A]">{vehicle.source ?? 'Live Auction'}</p>
                    </div>
                </div>

                {/* View Payment Summary */}
                <button className="w-full flex items-center justify-center gap-2 border border-slate-300 text-slate-700 py-3 rounded-xl text-sm font-semibold hover:bg-slate-50 transition cursor-pointer">
                    <HiReceiptRefund size={18} />
                    View Payment Summary
                </button>
            </div>
        </div>
    );
}

// ─── Unsold Panel ─────────────────────────────────────────────
function UnsoldBidPanel({ vehicle }) {

    // Calculate slider position percentage
    const highest = parseInt(vehicle.highestBid?.replace(/[^0-9]/g, '') || 0);
    const reserve = parseInt(vehicle.reservePrice?.replace(/[^0-9]/g, '') || 1);
    const sliderPct = Math.min((highest / reserve) * 100, 100);

    // Difference
    const diff = reserve - highest;
    const diffFormatted = `AED ${diff.toLocaleString()}`;

    return (
        <div className="flex flex-col gap-4 h-full border border-gray-200 p-4 rounded-xl ">

            {/* Auction Outcome Header */}
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#0F172A] text-base">Auction Outcome</h3>
                <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-full">
                    <HiXCircle size={15} />
                    Not Sold
                </div>
            </div>

            {/* Bid / Reserve / Difference */}
            <div className="grid grid-cols-3 gap-3">
                <div>
                    <p className="text-xs text-slate-400 mb-1">Highest Bid</p>
                    <p className="text-xl font-bold text-[#0F172A]">{vehicle.highestBid}</p>
                </div>
                <div>
                    <p className="text-xs text-slate-400 mb-1">Reserve Price</p>
                    <p className="text-sm font-semibold text-[#0F172A] mt-1">{vehicle.reservePrice}</p>
                </div>
                <div>
                    <p className="text-xs text-slate-400 mb-1">Difference</p>
                    <p className="text-sm font-semibold text-red-500 mt-1">{diffFormatted}</p>
                </div>
            </div>

            {/* Total Bids / Auction Duration */}
            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                <div>
                    <p className="text-xs text-slate-400 mb-1">Total Bids</p>
                    <p className="text-sm font-semibold text-[#0F172A]">{vehicle.totalBids ?? '—'}</p>
                </div>
                <div>
                    <p className="text-xs text-slate-400 mb-1">Auction Duration</p>
                    <p className="text-sm font-semibold text-[#0F172A]">{vehicle.estDuration ?? '—'}</p>
                </div>
            </div>

            {/* Why Not Sold */}
            <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                <p className="text-sm font-semibold text-red-700 mb-1">Why This Auction Was Not Sold?</p>
                <p className="text-sm font-medium text-red-500">Reserve Price Not Met</p>

                {/* Slider */}
                <div className="mt-4">
                    <div className="relative h-2 bg-red-200 rounded-full">
                        <div
                            className="absolute left-0 top-0 h-2 bg-[#0F172A] rounded-full"
                            style={{ width: `${sliderPct}%` }}
                        />
                        <div
                            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow"
                            style={{ left: `calc(${sliderPct}% - 8px)` }}
                        />
                    </div>
                    <div className="flex justify-between mt-2">
                        <div>
                            <p className="text-xs font-semibold text-[#0F172A]">
                                {highest.toLocaleString()}
                            </p>
                            <p className="text-xs text-slate-400">Highest Bid</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-semibold text-[#0F172A]">
                                {reserve.toLocaleString()}
                            </p>
                            <p className="text-xs text-slate-400">Reserve Price</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function EndedAuctionsDetail() {

    const { id } = useParams();

    const vehicle = vehicles.find((v) => v.id === parseInt(id));
    const isSold = vehicle.status === "sold";

    const breadcrumbItems = [
        { label: 'Home', path: '/' },
        { label: 'Ended Auctions', path: '/ended-auctions' },
        { label: vehicle?.name || 'Vehicle Detail' }
    ];

    const soldAuctionTabs = [
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
            key: "location",
            label: "Location",
            content: <LocationTab vehicle={vehicle} />,
        },
    ];

    const metaItems = [
        { icon: <MapPin size={16} />, label: vehicle.location },
        { icon: <Hash size={16} />, label: `Lot # ${vehicle.id}` },
        { icon: <Fingerprint size={16} />, label: `VIN: ${vehicle.vin}` },
        { icon: <Cog size={16} />, label: `${vehicle.engineSize} ${vehicle.engine}` },
        { icon: <Flag size={16} />, label: vehicle.driveType },
        { icon: <Fuel size={16} />, label: vehicle.fuelType }
    ];

    const getStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
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
            case 'not met':
                return {
                    bg: 'bg-amber-500',
                    text: 'Reserve Not Met'
                };
            default:
                return {
                    bg: 'bg-slate-500',
                    text: status
                };
        }
    };

    const statusInfo = getStatusBadge(vehicle.status);

    // Static values for testing


    if (!vehicle) {
        return <div className="p-10 text-center">Vehicle not found!</div>;
    }

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
                                {vehicle.name}
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

                {/* ======== content grid ======== */}
                {!isSold && (
                    <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg px-4 py-3 mt-4">
                        <div className="flex items-center gap-2 text-red-600 text-sm font-medium">
                            <AlertCircle size={16} />
                            Auction Ended on {vehicle.endedDate} — {vehicle.endedTime}
                        </div>
                        <span className="text-red-600 text-sm font-medium">Reason: Reserve Price Not Met</span>
                    </div>
                )}

                <div className={`grid grid-cols-1 gap-5 mt-6 items-stretch 
                ${isSold ? 'lg:grid-cols-12' : 'lg:grid-cols-9'}`}>

                    {/* Gallery */}
                    <div className={`${isSold ? 'lg:col-span-5' : 'lg:col-span-5'} flex flex-col h-full`}>
                        <div className="relative flex flex-col h-full">

                            {isSold ? (
                                <EndedSoldGallery images={vehicle.images} video={vehicle.video} status={vehicle.status} />
                            ) : (
                                <EndedUnsoldGallery images={vehicle.images} status={vehicle.status} />
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
                                            { icon: Tag, label: "Lot Number", value: "# 44578231" },
                                            { icon: Calendar, label: "Start Date", value: "25 May 2024, 10:00 AM GST" },
                                            { icon: Calendar, label: "End Date", value: "25 May 2024, 03:45 PM GST" },
                                            { icon: Clock, label: "Auction Duration", value: "5h 45m" },
                                            { icon: MapPin, label: "Location", value: "Dubai, UAE" },
                                            { icon: User, label: "Seller Type", value: "Dealer" },
                                        ].map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="flex justify-between items-center text-sm">
                                                <div className="flex items-center gap-2 text-slate-500">
                                                    {/* <item.icon size={15} /> */}
                                                    <span>{item.label}</span>
                                                </div>
                                                <span className="font-medium text-[#0B1E3D] text-[12px] text-right">{item.value}</span>
                                            </div>
                                        ))}

                                        {/* Seller Name */}
                                        <div className="flex justify-between items-start pt-2 border-t border-slate-100">
                                            <span className="text-slate-500 text-sm">Seller Name</span>
                                            <div className="flex flex-col items-end gap-1">
                                                <span className="font-bold text-[#0B1E3D] text-[12px]">Premium Motors LLC</span>
                                                <span className="flex items-center gap-1 text-[#D97706] text-xs font-semibold bg-orange-50 px-2 py-1 rounded-full">
                                                    <ShieldCheck size={11} /> Verified
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Share Vehicle Card */}
                                <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm">
                                    <h3 className="font-bold text-[#0B1E3D] mb-1 text-sm">Share this vehicle</h3>
                                    <p className="text-slate-500 text-xs mb-3">Know someone who might be interested?</p>
                                    <div className="flex gap-2">
                                        {[FaFacebookF, FaXTwitter, MessageCircle, Mail, Link].map((Icon, idx) => (
                                            <button
                                                key={idx}
                                                className="p-2 border border-slate-300 rounded-full text-slate-600 hover:border-[#D97706] hover:text-[#D97706] transition-colors"
                                            >
                                                <Icon size={16} />
                                            </button>
                                        ))}
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
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 my-8 bg-white border border-slate-100 rounded-2xl shadow-sm">
                        {stats.map((stat, index) => (
                            <div key={index} className="flex items-center gap-4 px-2">
                                <div className={`p-3 rounded-xl ${stat.colorClass}`}>
                                    <stat.icon size={24} strokeWidth={2} />
                                </div>

                                <div className="flex flex-col">
                                    <span className="text-xl font-bold text-[#0B1E3D]">{stat.value}</span>
                                    <span className="text-xs text-slate-500 font-medium">{stat.label}</span>
                                </div>

                                {index < stats.length - 1 && (
                                    <div className="hidden md:block w-px h-8 bg-slate-200 ml-auto" />
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* ======== tabs - sold/unsold ======== */}
                {isSold && (
                    <div className="mt-10">
                        <DetailTabs
                            tabs={soldAuctionTabs}
                            defaultTab="overview"
                        />
                    </div>
                )}

                {/* ======== sold ======== */}
                {isSold && (
                    <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">

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
                                    <div>
                                        <p className="text-sm text-slate-500">Avg. Selling Price</p>
                                        <p className="text-lg font-bold text-[#0B1E3D]">AED 172,000</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">This Vehicle Sold For</p>
                                        <p className="text-lg font-bold text-[#10B981]">AED 285,000</p>
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 my-3" />

                                {/* Recharts Trend Chart */}
                                <div className="mt-auto">
                                    <h3 className="font-bold text-[#0B1E3D] mb-2 text-sm">Price Trend (Last 6 Months)</h3>
                                    <div className="h-32 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={data}>
                                                <defs>
                                                    {/* Defining the blue gradient shadow */}
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
                                                {/* Apply the gradient to the fill */}
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
                        <div className="w-full">
                            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm w-full">
                                <h2 className="text-xl font-bold text-[#0B1E3D] mb-6">Bid Progress</h2>

                                {/* Header Info */}
                                <div className="flex justify-between mb-6">
                                    <div>
                                        <p className="text-sm text-slate-500">Opening Bid</p>
                                        <p className="text-lg font-bold text-[#0B1E3D]">AED {openingBid.toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-slate-500">Final Bid</p>
                                        <p className="text-lg font-bold text-[#0B1E3D]">AED {finalBid.toLocaleString()}</p>
                                    </div>
                                </div>

                                {/* Chart Wrapper with fixed height to prevent Recharts container error */}
                                <div className="h-48 w-full mb-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={staticBidData}>
                                            <defs>
                                                <linearGradient id="bidGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <YAxis hide domain={['dataMin - 10000', 'dataMax + 10000']} />
                                            <Tooltip
                                                formatter={(value) => [`AED ${value.toLocaleString()}`, 'Bid']}
                                                contentStyle={{ borderRadius: '8px', fontSize: '12px', borderColor: '#e2e8f0' }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="amount"
                                                stroke="#3B82F6"
                                                strokeWidth={3}
                                                fill="url(#bidGradient)"
                                                dot={{ r: 4, fill: '#fff', stroke: '#3B82F6', strokeWidth: 2 }}
                                                activeDot={{ r: 6, fill: '#3B82F6' }}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Legend */}
                                <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                                    <span className="w-3 h-3 rounded-xs bg-[#3B82F6]"></span>
                                    <span>Bid Amount (AED)</span>
                                </div>
                            </div>
                        </div>

                        {/* seller info */}
                        <div className="w-full">
                            <SellerInfo />
                        </div>
                    </div>
                )}

                {/* ======== unsold ======== */}
                {!isSold && (
                    <div className="mt-10 grid grid-cols-1 xl:grid-cols-11 gap-6 items-stretch">

                        {/* auc analytics */}
                        <div className="xl:col-span-5 h-full">
                            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm w-full h-full">
                                <h2 className="text-xl font-bold text-[#0B1E3D] mb-6">Auction Analytics</h2>

                                {/* Header Info */}
                                <div className="grid grid-cols-3 gap-4 mb-8">
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">Opening Bid</p>
                                        <p className="text-lg font-bold text-[#0B1E3D]">AED 50,000</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">Highest Bid</p>
                                        <p className="text-lg font-bold text-[#0B1E3D]">AED 78,000</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">Reserve Price</p>
                                        <p className="text-lg font-bold text-[#0B1E3D]">AED {reservePrice.toLocaleString()}</p>
                                    </div>
                                </div>

                                {/* Chart */}
                                <div className="h-64 w-full mb-6">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={unSoldAnalyticsdata}>
                                            <defs>
                                                <linearGradient id="analyticsGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <XAxis
                                                dataKey="time"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fontSize: 12, fill: '#64748b' }}
                                                dy={10}
                                            />
                                            <YAxis
                                                hide
                                                domain={[20000, 100000]}
                                            />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                                                formatter={(value) => [`AED ${value.toLocaleString()}`, 'Bid Amount']}
                                            />

                                            {/* Reserve Price Line */}
                                            <ReferenceLine y={reservePrice} stroke="#EF4444" strokeDasharray="3 3" />

                                            <Area
                                                type="monotone"
                                                dataKey="amount"
                                                stroke="#3B82F6"
                                                strokeWidth={3}
                                                fill="url(#analyticsGradient)"
                                                dot={{ r: 4, fill: '#fff', stroke: '#3B82F6', strokeWidth: 2 }}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Legend */}
                                <div className="flex gap-6 text-sm text-slate-600 justify-center">
                                    <div className="flex items-center gap-2">
                                        <span className="w-4 h-4 rounded-sm bg-[#3B82F6] border border-blue-400"></span>
                                        <span>Bid Amount (AED)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-4 h-4 rounded-sm bg-[#EF4444]"></span>
                                        <span>Reserve Price (AED)</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* market insights */}
                        <div className="xl:col-span-3 h-full">
                            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm w-full max-w-sm">
                                <h2 className="text-xl font-bold text-[#0B1E3D] mb-6">Market Insights</h2>

                                {/* Average Market Price */}
                                <div className="mb-6">
                                    <p className="text-sm text-slate-500 mb-1">Average Market Price</p>
                                    <p className="text-2xl font-bold text-[#0B1E3D]">AED {unSoldMarketdata.avgMarketPrice.toLocaleString()}</p>
                                </div>

                                <div className="border-t border-slate-100 my-6" />

                                {/* Highest Bid and Difference */}
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

                                {/* Warning Notification */}
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

                        <div className="xl:col-span-3 h-full">
                            <SellerInfo />
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
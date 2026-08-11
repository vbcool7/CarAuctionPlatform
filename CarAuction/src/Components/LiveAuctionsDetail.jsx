
import React, { useState } from 'react';
import { useParams } from 'react-router-dom'
import { Share2, Heart, MapPin, Hash, Fingerprint, Cog, Flag, Fuel, Download, TrendingUp, MessageSquare, Send } from 'lucide-react';
import { vehicles } from './Data';
import { liveBids } from './Data';
import Breadcrumbs from './Breadcrumbs';
import LiveBidsPanel from './SharedComponents/LiveBidsPanel';
import AuctionFeaturesBar from './SharedComponents/AuctionFeatureBar';
import HomeLiveAuctions from './HomeLiveAuctions';
import LiveAuctionGallery from './LiveAuctionGallery';
import AuctionCountdown from './AuctionCountdown';

import OverviewTab from './OverviewTab';
import VehiclInfoTab from './VehicleInfoTab';
import InspectionTab from './InspectionTab';
import ConditionTab from './ConditionTab';
import DetailTabs from './DetailTabs';
import BiddingHistoryTab from './BiddingHistoryTab';
import DocumentsTab from './DocumentsTab';
import ShippingPaymentsTab from './ShippingPaymentsTab';
import AuctionBottomFeaturesBar from './SharedComponents/AuctionBottomFeaturesBar';

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

function LiveAuctionsDetail() {

    const { id } = useParams();

    const vehicle = vehicles.find((v) => v.id === parseInt(id));

    const [messages, setMessages] = useState(initialMessages);
    const [newMessage, setNewMessage] = useState("");

    const breadcrumbItems = [
        { label: 'Home', path: '/' },
        { label: 'Live Auctions', path: '/live-auctions' },
        { label: vehicle?.name || 'Vehicle Detail' }
    ];

    const metaItems = [
        { icon: <MapPin size={16} />, label: vehicle.location },
        { icon: <Hash size={16} />, label: `Lot # ${vehicle.id}` },
        { icon: <Fingerprint size={16} />, label: `VIN: ${vehicle.vin}` },
        { icon: <Cog size={16} />, label: `${vehicle.engineSize} ${vehicle.engine}` },
        { icon: <Flag size={16} />, label: vehicle.driveType },
        { icon: <Fuel size={16} />, label: vehicle.fuelType }
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

    const formatValue = (val) => {
        if (val === null || val === undefined) return "NA";
        if (val instanceof Date) return val.toLocaleString();
        return String(val);
    };

    const infoItems = [
        { label: "Auction Type", value: formatValue(vehicle.auctionType) },
        { label: "Start Time", value: formatValue(vehicle.startTime) },
        { label: "End Time", value: formatValue(vehicle.endTime) },
        { label: "Lot Number", value: formatValue(vehicle.id) },
        { label: "Seller", value: formatValue(vehicle.seller) },
        { label: "Location", value: formatValue(vehicle.location) },
        { label: "Reserve Price", value: formatValue(vehicle.reservePrice) },
        { label: "Buy Now Price", value: formatValue(vehicle.buyNowPrice) },
        { label: "Vehicle Condition", value: formatValue(vehicle.condition) },
        { label: "Title Status", value: formatValue(vehicle.status) },
    ];

    const InfoRow = ({ label, value }) => (
        <div className="flex justify-between">
            <span className="text-slate-500">{label}</span>
            <span className="font-medium text-slate-900">{value}</span>
        </div>
    );

    const currentBid = Number(vehicle.currentBid) || 0;
    const reservePrice = Number(vehicle.reservePrice) || 0;
    const buyNowPrice = Number(vehicle.buyNowPrice) || 0;
    const totalBids = vehicle.totalBids || 0;
    const biddersOnline = vehicle.biddersOnline || 0;
    const views = vehicle.views || 0;

    const progress = buyNowPrice > 0 ? Math.min(((currentBid / buyNowPrice) * 100), 100) : 0;

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

                {/* ======== top- content grid ======== */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-6">

                    {/* Gallery — col 1 */}
                    <div className="lg:col-span-5 flex flex-col">
                        <LiveAuctionGallery images={vehicle.images} status={vehicle.status} />
                    </div>

                    {/* Bidding Controls — col 2 */}
                    <div className="lg:col-span-4 flex flex-col">
                        <div className="bg-[#0B1E3D] text-white p-4 rounded-2xl shadow-xl">

                            {/* Header */}
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-xs font-medium text-slate-300">Auction Ends In</span>
                                <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#D97706] bg-[#D97706]/10 px-2 py-0.5 rounded">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] animate-pulse"></span>
                                    LIVE
                                </span>
                            </div>

                            {/* Countdown */}
                            <div>
                                <AuctionCountdown endTime={vehicle.endTime} />
                                <div className="grid grid-cols-3 text-center mt-1">
                                    <span className="text-[9px] text-slate-400 uppercase tracking-widest">HRS</span>
                                    <span className="text-[9px] text-slate-400 uppercase tracking-widest">MINS</span>
                                    <span className="text-[9px] text-slate-400 uppercase tracking-widest">SECS</span>
                                </div>
                            </div>

                            {/* Divider + Bid Info */}
                            <div className="space-y-2.5 mt-4 border-t border-slate-600 pt-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-slate-400 text-[9px] uppercase tracking-wide">Current Highest Bid</p>
                                        <p className="text-lg font-bold mt-0.5 text-[#D97706]">{vehicle.bid}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-[9px] uppercase tracking-wide">Total Bids</p>
                                        <p className="text-lg font-bold mt-0.5">{vehicle.totalBids}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-slate-400 text-[9px] uppercase tracking-wide">Maximum Bid Limit</p>
                                        <p className="text-xs font-semibold mt-0.5">{vehicle.maxBidLimit || "AED 300,000"}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-[9px] uppercase tracking-wide">Minimum Next Bid</p>
                                        <p className="text-xs font-semibold mt-0.5">{vehicle.minNextBid || "AED 5,000"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Input & Buttons */}
                            <div className="mt-4 space-y-2">
                                <div className="relative">
                                    <input
                                        type="number"
                                        placeholder="Enter your bid amount"
                                        className="w-full bg-[#142d55] border border-slate-600 rounded-lg py-2.5 px-3 text-sm text-white placeholder-slate-400 outline-none focus:border-[#D97706]"
                                    />
                                    <span className="absolute right-3 top-2.5 text-xs font-bold text-[#D97706]">AED</span>
                                </div>

                                <button className="w-full bg-[#D97706] hover:bg-[#b86405] text-white text-sm font-bold py-2.5 rounded-lg transition-all">
                                    Place Bid Now
                                </button>

                                <button className="w-full border border-slate-600 hover:border-[#D97706] hover:text-[#D97706] text-white text-sm font-medium py-2 rounded-lg transition-all">
                                    Buy Now AED 420,000
                                </button>
                            </div>

                            {/* Bidders Online */}
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
                                <span className="text-[10px] text-slate-400">{vehicle.biddersOnline || 12} Bidders Online</span>
                            </div>

                        </div>
                    </div>

                    {/* Bids Activity — col 3 */}
                    <div className="lg:col-span-3">
                        <LiveBidsPanel vehicleId={vehicle.id} />
                    </div>

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
                            <div>
                                <p className="text-slate-500 text-sm">Current Bid</p>
                                <p className="text-2xl font-extrabold text-blue-600">
                                    AED {currentBid.toLocaleString()}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-slate-500 text-sm">Reserve Price</p>
                                <p className="font-bold text-slate-900">
                                    AED {reservePrice.toLocaleString()}
                                </p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                            <div
                                className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-8">
                            <span>AED {reservePrice.toLocaleString()} Reserve</span>
                            <span>AED {buyNowPrice.toLocaleString()} Buy Now</span>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-4 py-6 border-y border-slate-100 mb-6">
                            {[
                                { label: "Total Bids", value: totalBids },
                                { label: "Bidders Online", value: biddersOnline },
                                { label: "Views", value: views }
                            ].map((stat, i) => (
                                <div key={i} className="text-center">
                                    <p className="text-lg font-bold text-slate-900">{stat.value.toLocaleString()}</p>
                                    <p className="text-[10px] text-slate-400 uppercase font-bold">{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        <p className="font-bold text-[#0F172A] mb-4">Bid Trend</p>

                        <div className="h-24 w-full bg-linear-to-b from-[#D97706]/10 to-transparent rounded-lg border-b-2 border-[#D97706] flex items-end px-2">

                            <p className="text-[10px] text-[#D97706] font-bold mb-2">Trend data visualization...</p>

                        </div>
                    </div>

                    {/* live chat */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col h-100">
                        <h3 className="font-bold text-slate-900 mb-4">Auction Chat</h3>

                        {/* Chat History Area */}
                        <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
                            {messages.map((msg, idx) => (
                                <div key={idx} className="text-sm">
                                    <p className="font-bold text-slate-900">{msg.user}</p>
                                    <p className="text-slate-600">{msg.text}</p>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
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
                    </div>
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
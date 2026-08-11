
import React from 'react';
import { useParams } from 'react-router-dom';

import { vehicles } from './Data';
import { Share2, Heart, MapPin, Hash, Fingerprint, Cog, Flag, Fuel, User, ShieldCheck, Gavel, Award, Briefcase } from 'lucide-react';
import { HiCalendar, HiOutlineTag, HiOutlineCurrencyDollar, HiLocationMarker, HiCheckCircle } from "react-icons/hi";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Area, AreaChart } from 'recharts';

import Breadcrumbs from './Breadcrumbs';
import VehicleGallery from './VehicleGallery';
import AuctionFeaturesBar from './SharedComponents/AuctionFeatureBar';

import DetailTabs from './DetailTabs';
import OverviewTab from './OverviewTab';
import VehiclInfoTab from './VehicleInfoTab';
import InspectionTab from './InspectionTab';
import ConditionTab from './ConditionTab';
import BiddingHistoryTab from './BiddingHistoryTab';
import DocumentsTab from './DocumentsTab';
import ShippingPaymentsTab from './ShippingPaymentsTab';
import AuctionBottomFeaturesBar from './SharedComponents/AuctionBottomFeaturesBar';
import AuctionDetailsTab from './AuctionDetailsTab';
import LocationTab from './LocationTab';
import SellerInfo from './SellerInfo';
import UpcomingSimilarAuctions from './UpcomingSimilarAuctions';

const bidDetails = [
    { label: 'Start Date', val: '27 May 2026, 10:00 AM', icon: HiCalendar },
    { label: 'End Date', val: '27 May 2026, 12:00 PM', icon: HiCalendar },
    { label: 'Starting Bid', val: 'AED 120,000', icon: HiOutlineTag },
    { label: 'Est. Value', val: 'AED 175,000', icon: HiOutlineTag },
    { label: 'Bid Increment', val: 'AED 2,000', icon: HiOutlineCurrencyDollar },
    { label: 'Reserve Price', val: 'AED 150,000', tag: 'Met', icon: HiCheckCircle },
    { label: 'Auction Type', val: 'Live Auction', icon: null },
    { label: 'Location', val: 'Dubai, UAE', icon: HiLocationMarker }
];

const chartData = [
    { month: 'Dec', price: 150 }, { month: '', price: 154 }, { month: 'Jan', price: 156 },
    { month: '', price: 158 }, { month: 'Feb', price: 161 }, { month: '', price: 160 },
    { month: 'Mar', price: 161 }, { month: '', price: 167 }, { month: 'Apr', price: 166 },
    { month: '', price: 170 }, { month: 'May', price: 176 }
];

const steps = [
    { icon: User, title: "Register", desc: "Create an account and register to bid." },
    { icon: ShieldCheck, title: "Get Approved", desc: "Complete KYC verification to bid." },
    { icon: Gavel, title: "Place Bids", desc: "Bid live when the auction starts." },
    { icon: Award, title: "Win", desc: "If you're the highest bidder." },
    { icon: Briefcase, title: "Pay & Pickup", desc: "Complete payment and pick up your vehicle." },
];

function UpcomingAuctionsDetail() {

    const { id } = useParams();

    const vehicle = vehicles.find((v) => v.id === parseInt(id));

    const breadcrumbItems = [
        { label: 'Home', path: '/' },
        { label: 'Upcoming Auctions', path: '/upcoming-auctions' },
        { label: vehicle?.name || 'Vehicle Detail' }
    ];

    const upcomingAuctionTabs = [
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
        {
            key: "condition",
            label: "Condition Report",
            content: <ConditionTab vehicle={vehicle} />,
        },
        {
            key: "bidding",
            label: "Auction Detail",
            content: <AuctionDetailsTab vehicle={vehicle} />,
        },
        {
            key: "documents",
            label: "Documents",
            content: <DocumentsTab vehicle={vehicle} />,
        },
        {
            key: "shipping",
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

    if (!vehicle) {
        return <div className="p-10 text-center">Vehicle not found!</div>;
    }

    return (
        <section className='w-full'>

            {/* ========= breadcrumb ========= */}
            <div className='max-w-6xl mx-auto px-4 sm:px-5 lg:px-6'>
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
                                    Upcoming Auction
                                </span>
                                <span className="bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                                    Featured
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all">
                                <Share2 size={18} /> Share
                            </button>
                            <button className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all">
                                <Heart size={18} /> Add to Watchlist
                            </button>
                        </div>
                    </div>

                    {/* Metadata Row - Premium Simplified */}
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
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">

                    <div className="lg:col-span-7 flex flex-col">
                        <VehicleGallery images={vehicle.images} status={vehicle.status} />
                    </div>

                    <div className="lg:col-span-5 flex flex-col lg:sticky lg:top-6 self-start">
                        <div className="w-full h-full bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">

                            <div className="text-center">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Auction Starts In</p>
                                <div className="flex justify-center gap-4 text-[#0F172A]">
                                    {['02', '14', '30', '15'].map((val, i) => (
                                        <div key={i} className="flex flex-col items-center">
                                            <span className="text-3xl font-black">{val}</span>
                                            <span className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">{['Days', 'Hrs', 'Mins', 'Secs'][i]}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Details Grid - Optimized spacing */}
                            <div className="grid grid-cols-2 gap-x-4 gap-y-4 border-y border-slate-100 py-5 my-4">
                                {bidDetails.map((item, i) => (
                                    <div key={i} className={`${i % 2 !== 0 ? 'pl-3 border-l border-slate-100' : ''}`}>
                                        <p className="text-[8px] text-slate-400 uppercase font-bold tracking-widest">{item.label}</p>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            {item.icon && <item.icon size={13} className="text-[#D97706]" />}
                                            <span className="text-[11px] font-bold text-[#0F172A] truncate">
                                                {item.val}
                                            </span>
                                            {item.tag && (
                                                <span className="text-[8px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">{item.tag}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-2">
                                <button className="w-full bg-[#0B1E3D] hover:bg-[#1a3a6e] text-white py-3.5 rounded-xl text-sm font-bold transition-all shadow-md active:scale-[0.98]">
                                    Register to Bid
                                </button>
                                <button className="w-full border border-slate-200 text-slate-600 py-3.5 rounded-xl text-sm font-semibold hover:border-[#D97706] hover:text-[#D97706] transition-all flex items-center justify-center gap-2">
                                    <HiCalendar size={15} /> Add to Calendar
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

                {/* ======== feature bar ======== */}
                <AuctionFeaturesBar vehicle={vehicle} />

                {/* ======== tabs ======== */}
                <div className="mt-10">
                    <DetailTabs
                        tabs={upcomingAuctionTabs}
                        defaultTab="overview"
                    />
                </div>

                {/* ======== market insights ======== */}
                <div className="flex flex-col md:flex-row gap-8 mt-10">

                    <div className="w-full md:w-2/3">
                        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
                            <h3 className="text-lg font-bold text-[#0F172A] mb-4">Market Insights</h3>

                            {/* Top Value Stats */}
                            <div className="mb-4">
                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Market Value</p>
                                <p className="text-xl font-black text-[#0F172A] mt-1">AED 165,000 – 185,000</p>

                                <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-slate-100">
                                    <div>
                                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Avg. Selling Price</p>
                                        <p className="font-bold text-[#0F172A] mt-1">AED 172,000</p>
                                    </div>
                                    <div className="pl-4 border-l border-slate-100">
                                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Potential Saving</p>
                                        <p className="font-bold text-[#D97706] mt-1">Up to AED 32,000</p>
                                    </div>
                                </div>
                            </div>

                            {/* Price Trend Graph */}
                            <div className="mt-4">
                                <p className="text-sm font-bold text-[#0F172A] mb-4">
                                    Price Trend <span className="text-slate-400 font-normal">(Last 6 Months)</span>
                                </p>

                                <div className="h-42 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartData}>
                                            <defs>
                                                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} domain={[140, 180]} />
                                            <Area type="monotone" dataKey="price" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-1/3">
                        <SellerInfo />
                    </div>
                </div>

                {/* ======== auction process ======== */}
                <div className='mt-6'>
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-[#0F172A] mb-8">
                            Auction Process
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-12">
                            {steps.map((step, i) => (
                                <div
                                    key={i}
                                    className="relative flex flex-col items-center text-center border border-slate-200 rounded-2xl p-6 bg-white pt-12"
                                >
                                    {/* Absolute Icon Container that touches/overlaps the border */}
                                    <div className="absolute -top-8 w-16 h-16 rounded-full bg-amber-50 border border-amber-100 shadow-md flex items-center justify-center">
                                        <step.icon className="text-[#D97706]" size={24} strokeWidth={1.5} />
                                    </div>

                                    {/* Text Content */}
                                    <h4 className="font-bold text-[#0F172A] text-sm mb-2 mt-2">
                                        {step.title}
                                    </h4>
                                    <p className="text-slate-500 text-xs leading-relaxed max-w-35">
                                        {step.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ======== similar auctions ======== */}
                <div className='mt-6'>
                    <UpcomingSimilarAuctions />
                </div>

            </div>

        </section>
    )
}

export default UpcomingAuctionsDetail;
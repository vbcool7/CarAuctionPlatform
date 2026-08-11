
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiSearch, HiViewGrid, HiViewList } from 'react-icons/hi';
import { Gavel, Truck, Users, CircleDollarSign } from "lucide-react";
import { Camera, MapPin, Tag, Eye, ChevronRight, Settings, Fuel, GitBranch, Gauge } from 'lucide-react';
import { PiCarFill } from 'react-icons/pi';
import { HiOutlineUser, HiOutlineUserGroup } from 'react-icons/hi';
import { MdOutlineMonetizationOn } from 'react-icons/md';

import { HiOutlineRefresh } from 'react-icons/hi';
import { vehicles } from "./Data";
import EndedAuctionSideFilter from './EndedAuctionSideFilter';
import AuctionBottomFeaturesBar from './SharedComponents/AuctionBottomFeaturesBar';

const stats = [
    { title: "Total Ended Auctions", value: "1,842", icon: Gavel, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Sold Vehicles", value: "1,256", icon: Truck, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Happy Bidders", value: "12,845", icon: Users, color: "text-violet-600", bg: "bg-violet-50" },
    { title: "Total Sales Value", value: "AED 220M+", icon: CircleDollarSign, color: "text-orange-600", bg: "bg-orange-50" },
];

const statisticsStats = [
    {
        icon: <PiCarFill className="text-green-500" size={18} />,
        label: 'Sold Vehicles',
        value: '1,256',
    },
    {
        icon: <HiOutlineUser className="text-green-500" size={18} />,
        label: 'Not Sold',
        value: '486',
    },
    {
        icon: <HiOutlineUserGroup className="text-green-500" size={18} />,
        label: 'Reserve Not Met',
        value: '100',
    },
    {
        icon: <MdOutlineMonetizationOn className="text-green-500" size={18} />,
        label: 'Total Sales Value',
        value: 'AED 220M+',
        highlight: true,
    },
];

const topMakes = [
    { rank: 1, name: 'BMW', count: 245 },
    { rank: 2, name: 'Mercedes-Benz', count: 210 },
    { rank: 3, name: 'Toyota', count: 165 },
    { rank: 4, name: 'Audi', count: 150 },
    { rank: 5, name: 'Land Rover', count: 120 },
];

function EndedAuctions() {

    const navigate = useNavigate();

    const [view, setView] = useState('list');
    const [visibleCount, setVisibleCount] = useState(5);
    const [activeTab, setActiveTab] = useState('all');

    const soldUnsoldVehicles = vehicles.filter(
        (v) => v.status === "sold" || v.status === "unsold"
    );

    const tabs = [
        { key: 'all', label: 'All Ended' },
        { key: 'sold', label: 'Sold' },
        { key: 'unsold', label: 'Not Sold' },
        { key: 'not-met', label: 'Reserve Not Met' },
    ];

    const filteredVehicles = soldUnsoldVehicles.filter((v) => {
        if (activeTab === 'all') return true;
        if (activeTab === 'sold') return v.status === 'sold';
        if (activeTab === 'unsold') return v.status === 'unsold';
        if (activeTab === 'not-met') return v.status === 'unsold' && v.reserveMet === false;
        return true;
    });

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
                    text: 'Unsold'
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

    const statusInfo = getStatusBadge(soldUnsoldVehicles.status);

    return (
        <section className='w-full'>
            <div className='max-w-6xl mx-auto px-4 md:px-5 lg:px-6 py-8'>

                {/* Heading */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">Ended Auctions</h1>
                    <p className='text-sm text-slate-500'>Browse vehicles from completed auctions.</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                            {/* Icon Container */}
                            <div className={`p-3 rounded-full ${stat.bg}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>

                            {/* Text Content */}
                            <div>
                                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                                <p className="text-sm text-slate-500 font-medium">{stat.title}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Two-column layout */}
                <div className="flex flex-col md:flex-row gap-6 mt-6">

                    {/* Left: main content */}
                    <div className="w-full md:w-[70%] space-y-4">

                        {/* Tabs */}
                        <div className="border-b border-slate-200">
                            <div className="flex gap-6">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.key
                                            ? 'border-[#D97706] text-[#D97706]'
                                            : 'border-transparent text-slate-500 hover:text-slate-700'
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Search + Sort + View */}
                        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mt-4">
                            <div className="relative w-full md:grow">
                                <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
                                <input
                                    type="text"
                                    placeholder="Search by make, model or lot number..."
                                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D97706]/20"
                                />
                            </div>
                            <div className="flex items-center gap-2 w-full md:w-auto">
                                <select className="w-full md:w-48 px-3 py-2.5 border border-slate-200 rounded-lg text-slate-700 bg-white focus:outline-none">
                                    <option>Sort By: Soonest First</option>
                                    <option>Sort By: Starting Bid (Low)</option>
                                    <option>Sort By: Starting Bid (High)</option>
                                </select>
                                <div className="flex border border-slate-200 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => setView('grid')}
                                        className={`px-3 py-2.5 ${view === 'grid' ? 'bg-slate-100 text-[#D97706]' : 'text-slate-500'}`}
                                    >
                                        <HiViewGrid size={20} />
                                    </button>
                                    <button
                                        onClick={() => setView('list')}
                                        className={`px-3 py-2.5 border-l border-slate-200 ${view === 'list' ? 'bg-slate-100 text-[#D97706]' : 'text-slate-500'}`}
                                    >
                                        <HiViewList size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* list */}
                        <div className="space-y-4 mt-2">
                            {filteredVehicles.length === 0 ? (
                                <div className="text-center py-16 text-slate-400 text-sm">
                                    No ended auctions found for this period.
                                </div>
                            ) : (
                                filteredVehicles.slice(0, visibleCount).map((vehicle, index) => (
                                    <div
                                        key={index}
                                        className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row gap-6 transition-all hover:shadow-lg hover:border-slate-300">

                                        {/* Left: Image Section */}
                                        <div className="relative w-full md:w-80 h-64 rounded-xl overflow-hidden shrink-0">
                                            <img
                                                src={vehicle.image}
                                                alt={vehicle.name}
                                                className="w-full h-full object-cover"
                                            />

                                            {/* Status Badge */}
                                            <div className={`absolute top-3 left-3 ${statusInfo.bg} text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider flex items-center gap-1`}>
                                                <span className="w-1.5 h-1.5 bg-white rounded-full"></span> {statusInfo.text}
                                            </div>

                                            {/* Photo Count */}
                                            <div className="absolute bottom-3 left-3 bg-black/60 text-white text-[10px] px-2 py-1 rounded flex items-center gap-1">
                                                {vehicle.images.length} Photos
                                            </div>
                                        </div>

                                        {/* Right: Content Section */}
                                        <div className="flex flex-1 flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <h3 className="text-xl font-bold text-[#0F172A]">{vehicle.name}</h3>
                                                    <span className="text-[11px] font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                                                        Lot # {vehicle.id}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-500 font-medium mb-4">VIN: {vehicle.vin}</p>

                                                {/* Quick Specs */}
                                                <div className="flex gap-2 text-[11px] text-slate-600 flex-wrap mb-6">
                                                    <div className="flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                                        <Settings size={12} className="text-[#D97706]" /> {vehicle.engine}
                                                    </div>
                                                    <div className="flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                                        <Gauge size={12} className="text-[#D97706]" /> {vehicle.transmission}
                                                    </div>
                                                    <div className="flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                                        <Fuel size={12} className="text-[#D97706]" /> {vehicle.fuelType}
                                                    </div>
                                                    <div className="flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                                        <GitBranch size={12} className="text-[#D97706]" /> {vehicle.driveType}
                                                    </div>
                                                </div>

                                                {/* Meta Info Row */}
                                                <div className="grid grid-cols-4 gap-4 mb-4">
                                                    <div>
                                                        <p className="text-[9px] uppercase text-slate-400 font-bold tracking-wider">End Date</p>
                                                        <p className="text-xs font-bold text-[#0F172A]">{vehicle.endedDate}</p>
                                                        {/* <p className="text-xs font-bold text-gray-500 pt-0.5">{vehicle.endedTime}</p> */}
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] uppercase text-slate-400 font-bold tracking-wider">Location</p>
                                                        <p className="text-xs font-bold text-[#0F172A] flex items-center gap-1">
                                                            {vehicle.location}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] uppercase text-slate-400 font-bold tracking-wider">Bidders</p>
                                                        <p className="text-xs font-bold text-[#0F172A] flex items-center gap-1">
                                                            {vehicle.totalBids || "NA"}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] uppercase text-slate-400 font-bold tracking-wider">Views</p>
                                                        <p className="text-xs font-bold text-[#0F172A] flex items-center gap-1">
                                                            {vehicle.views}</p>
                                                    </div>
                                                </div>
                                            </div>


                                            {/* Footer: Dynamic Bid Section */}
                                            <div className="flex items-center gap-4 mt-2">
                                                <div className="flex items-center border border-slate-100 rounded-xl bg-slate-50/50 flex-1">

                                                    {vehicle.status?.toLowerCase() === 'sold' ? (
                                                        <>
                                                            <div className="p-3 border-r border-slate-100 flex-1">
                                                                <p className="text-[9px] uppercase text-slate-400 font-bold tracking-widest">Winning Bid</p>
                                                                <p className="text-sm font-bold text-emerald-600">{vehicle.winningBid || "AED 440,000"}</p>
                                                            </div>
                                                            <div className="p-3 flex-1">
                                                                <p className="text-[9px] uppercase text-slate-400 font-bold tracking-widest">Sold To</p>
                                                                <p className="text-sm font-bold text-[#0F172A]">{vehicle.buyerName || "John Hassan"}</p>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="p-3 border-r border-slate-100 flex-1">
                                                                <p className="text-[9px] uppercase text-slate-400 font-bold tracking-widest">Highest Bid</p>
                                                                <p className="text-sm font-bold text-red-600">{vehicle.highestBid}</p>
                                                            </div>
                                                            <div className="p-3 flex-1">
                                                                <p className="text-[9px] uppercase text-slate-400 font-bold tracking-widest">Reserve Price</p>
                                                                <p className="text-sm font-bold text-[#0F172A]">{vehicle.reservePrice}</p>
                                                            </div>
                                                        </>
                                                    )}

                                                </div>

                                                <button
                                                    onClick={() => navigate(`/ended-auctions-detail/${vehicle.id}`)}
                                                    className="bg-[#0B1E3D] text-white px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-1 hover:bg-[#1e3a6a] transition-all">
                                                    View Details <ChevronRight size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}

                            {visibleCount < filteredVehicles.length && (
                                <button
                                    onClick={() => setVisibleCount((prev) => prev + 5)}
                                    className="w-60 mx-auto flex items-center justify-center gap-2 border border-[#D97706] text-[#D97706] py-2.5 rounded-lg text-sm font-semibold hover:bg-[#D97706]/5 transition cursor-pointer"
                                >
                                    <HiOutlineRefresh size={16} /> Load More Auctions
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Right: filter sidebar */}
                    <div className="w-full md:w-[30%] space-y-4">
                        <EndedAuctionSideFilter />

                        {/* statis card */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                            <h3 className="font-bold text-[#0F172A] mb-4">Auction Statistics</h3>

                            <div className="space-y-3">
                                {statisticsStats.map((stat, idx) => (
                                    <div key={idx} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {stat.icon}
                                            <span className="text-sm text-slate-600">{stat.label}</span>
                                        </div>
                                        <span className={`text-sm font-semibold ${stat.highlight ? 'text-[#D97706]' : 'text-[#0F172A]'}`}>
                                            {stat.value}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <button className="mt-5 w-full border border-[#D97706] text-[#D97706] py-2.5 rounded-lg text-sm font-semibold hover:bg-[#D97706]/5 transition cursor-pointer">
                                View Full Report
                            </button>
                        </div>

                        {/* top selling */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                            <h3 className="font-bold text-[#0F172A] mb-4">Top Selling Makes</h3>

                            <div className="space-y-3">
                                {topMakes.map((make) => (
                                    <div key={make.rank} className="flex items-center gap-3">
                                        {/* Rank */}
                                        <span className="text-sm text-slate-400 w-4 shrink-0">{make.rank}</span>

                                        {/* Logo placeholder */}
                                        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                            <span className="text-[10px] font-bold text-slate-400">
                                                {make.name.slice(0, 1)}
                                            </span>
                                        </div>

                                        {/* Name */}
                                        <span className="text-sm text-slate-700 flex-1">{make.name}</span>

                                        {/* Count */}
                                        <span className="text-sm font-semibold text-[#0F172A]">{make.count}</span>
                                    </div>
                                ))}
                            </div>

                            <button className="mt-5 w-full border border-[#D97706] text-[#D97706] py-2.5 rounded-lg text-sm font-semibold hover:bg-[#D97706]/5 transition cursor-pointer">
                                View All Makes
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            <AuctionBottomFeaturesBar />
        </section>
    )
}

export default EndedAuctions;

import React, { useState } from 'react';
import { ArrowDown, ArrowUp, Clock3, Headphones, MoreVertical, Trophy } from 'lucide-react';
import { bidsData } from '../SellerSharedComponents/SellerData';
import SearchBar from '../SellerSharedComponents/SearchBar';
import FilterDropdown from '../SellerSharedComponents/FilterDropdown';

const statusOptions = [
    { value: "", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "sold", label: "Sold" },
    { value: "pending", label: "Pending Approval" },
    { value: "draft", label: "Draft" },
];

const auctionTypeOptions = [
    { value: "", label: "All Auction Types" },
    { value: "live-auction", label: "Live Auction" },
    { value: "fixed-price", label: "Fixed Price" },
];

const dateOptions = [
    { value: "na", label: "NA" },
    { value: "na", label: "NA" },
];

const recentActivities = [
    {
        id: 1,
        type: 'highestBid',
        title: 'New highest bid on 2021 BMW X5',
        amount: '$32,000',
        time: '10 minutes ago',
    },
    {
        id: 2,
        type: 'upcoming',
        title: 'Upcoming auction for 2019 E-Class',
        amount: 'Starts in 1d 05h',
        time: '1 hour ago',
    },
    {
        id: 3,
        type: 'outbid',
        title: 'Outbid on 2021 Range Rover Sport',
        amount: 'by $1,500',
        time: '3 hours ago',
    },
    {
        id: 4,
        type: 'won',
        title: 'You won the auction for 2020 Ford F-150',
        amount: '$28,000',
        time: '2 days ago',
    },
];

function BidsOffers({ setCurrentPage, setSelectedBidsOfferId }) {

    const [activeTab, setActiveTab] = useState('all');
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [auctionType, setAuctionType] = useState('');
    const [date, setDate] = useState('');

    const tabs = [
        { key: 'all', label: 'All', count: 0 },
        { key: 'active-bids', label: 'Active Bids', count: 0 },
        { key: 'offers-made', label: 'Offers Made', count: 0 },
        { key: 'won', label: 'Won', count: 0 },
        { key: 'outbid', label: 'Outbid', count: 0 },
        { key: 'declined', label: 'Declined', count: 0 },
    ];

    return (
        <div className='pb-6 space-y-6'>

            {/* header */}
            <div className='w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0'>
                <div className='flex flex-col'>
                    <h1 className='text-xl md:text-2xl font-bold'>Bids & Offers</h1>
                    <p className='text-xs md:text-sm text-gray-600 p-px'>
                        Track all your bids and offers across auctions.
                    </p>
                </div>
            </div>

            {/* tabs */}
            <div className='flex gap-9 border-b border-gray-200 overflow-x-auto no-scrollbar'>
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`py-3 text-xs md:text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.key
                            ? 'border-[#D97706] text-[#D97706]'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {tab.label} <span className='text-xs'>({tab.count})</span>
                    </button>
                ))}
            </div>

            {/* filter */}
            <div className="flex flex-wrap gap-3 py-4 px-4 border border-gray-300 bg-white/80 rounded-xl">
                <div className='flex-1 min-w-50'>
                    <SearchBar value={search} onChange={setSearch} placeholder="Search by make, model or VIN..." />
                </div>

                <div className='w-full sm:w-auto'>
                    <FilterDropdown label="All Status" options={statusOptions} value={status} onChange={setStatus} />
                </div>

                <div className='w-full sm:w-auto'>
                    <FilterDropdown label="All Auction Types" options={auctionTypeOptions} value={auctionType} onChange={setAuctionType} />
                </div>

                <div className='w-full sm:w-auto'>
                    <FilterDropdown label="All Dates" options={dateOptions} value={date} onChange={setDate} />
                </div>
            </div>

            {/* content grid */}
            <div className='grid grid-cols-1 xl:grid-cols-3 gap-6'>

                {/* left */}
                <div className='xl:col-span-2 space-y-6'>

                    {/* list */}
                    <div className="overflow-x-auto border border-slate-200/80 rounded-xl shadow-xs bg-white">
                        <table className="w-full text-left table-fixed">
                            <thead className="bg-white border-b border-slate-200 text-[#0B1E3D] uppercase text-[11px] font-extrabold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4.5 w-85">Vehicle / Auction</th>
                                    <th className="px-6 py-4.5 w-50">Your Bid / Offer</th>
                                    <th className="px-6 py-4.5 w-40">Status</th>
                                    <th className="px-6 py-4.5 w-40 pl-10">Auction Ends</th>
                                    <th className="px-6 py-4.5 w-45 pl-12">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {bidsData.map((bid) => (
                                    <tr
                                        key={bid.id}
                                        className='hover:bg-slate-50/60 transition-colors border-b border-gray-100 last:border-b-0'
                                    >
                                        {/* Vehicle / Auction */}
                                        <td className='px-3 py-3'>
                                            <div className='flex items-center gap-3'>
                                                <img
                                                    src={bid.image}
                                                    alt={bid.name}
                                                    className='w-16 h-12 rounded-md object-cover shrink-0'
                                                />

                                                <div className='min-w-0'>
                                                    <div className='flex items-center gap-2'>
                                                        <p className='text-sm font-semibold text-[#0B1E3D] truncate'>
                                                            {bid.name}
                                                        </p>

                                                        {bid.auctionStatus === 'live' && (
                                                            <span className='px-1.5 py-0.5 rounded bg-green-100 text-green-600 text-[11px] font-semibold'>
                                                                Live Auction
                                                            </span>
                                                        )}

                                                        {bid.auctionStatus === 'ended' && (
                                                            <span className='px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 text-[11px] font-semibold'>
                                                                Ended
                                                            </span>
                                                        )}
                                                    </div>

                                                    <p className='text-[11px] text-gray-500 mt-1'>
                                                        Listing ID: {bid.listingId}
                                                    </p>

                                                    <p className='text-[11px] text-gray-500'>
                                                        VIN: {bid.vin}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Your Bid / Offer */}
                                        <td className='px-3 py-3'>
                                            <div className=''>
                                                <p
                                                    className={`text-sm font-bold ${bid.status === 'highestBid' || bid.status === 'won'
                                                        ? 'text-green-600'
                                                        : 'text-[#0B1E3D]'
                                                        }`}
                                                >
                                                    {bid.bid}
                                                </p>

                                                <p className='text-[12px] text-gray-500 mt-1'>
                                                    {bid.bidLabel}
                                                </p>

                                                <p className='text-[12px] text-gray-500'>
                                                    Reserve: {bid.reserve}
                                                </p>
                                            </div>
                                        </td>

                                        {/* Status */}
                                        <td className='px-3 py-3'>
                                            <div className=''>
                                                <span
                                                    className={`inline-flex px-2 py-1 rounded-md text-[11px] font-semibold ${bid.status === 'highestBid'
                                                        ? 'bg-green-100 text-green-600'
                                                        : bid.status === 'upcoming'
                                                            ? 'bg-blue-100 text-blue-600'
                                                            : bid.status === 'outbid'
                                                                ? 'bg-red-100 text-red-600'
                                                                : bid.status === 'won'
                                                                    ? 'bg-green-100 text-green-600'
                                                                    : 'bg-gray-100 text-gray-500'
                                                        }`}
                                                >
                                                    {bid.statusLabel}
                                                </span>

                                                <p className='text-[12px] text-gray-500 mt-1 line-clamp-2'>
                                                    {bid.statusText}
                                                </p>
                                            </div>
                                        </td>

                                        {/* Auction Ends */}
                                        <td className='px-3 py-3  pl-10'>
                                            <div className=''>
                                                <p
                                                    className={`text-sm font-semibold ${bid.auctionStatus === 'live'
                                                        ? 'text-amber-600'
                                                        : 'text-[#0B1E3D]'
                                                        }`}
                                                >
                                                    {bid.auctionEnds}
                                                </p>

                                                <p className='text-[12px] text-gray-500 mt-1'>
                                                    {bid.date}
                                                </p>

                                                <p className='text-[12px] text-gray-500'>
                                                    {bid.time}
                                                </p>
                                            </div>
                                        </td>

                                        {/* Action */}
                                        <td className='px-3 py-3 pl-10'>
                                            <div className='flex items-center gap-2'>
                                                <button
                                                    onClick={() => {
                                                        setSelectedBidsOfferId(bid.id)
                                                        setCurrentPage('bids-offers-detail')
                                                    }}
                                                    className='whitespace-nowrap px-3 py-2 rounded-md border border-gray-200 text-[12px] font-medium text-[#0B1E3D] hover:bg-gray-50 transition-colors'>
                                                    {bid.action}
                                                </button>

                                                <button
                                                    className='w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50'>
                                                    <MoreVertical className='w-4 h-4' />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* right  */}
                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6'>

                    {/* bid summary */}
                    <div className='bg-white rounded-xl border border-gray-200 p-5'>
                        <h3 className='text-sm font-semibold text-[#0B1E3D] mb-4'>
                            Bid Summary
                        </h3>

                        <div className='space-y-3'>
                            <div className='flex items-center justify-between'>
                                <span className='text-[12px] sm:text-[14px] text-gray-500'>Active Bids</span>
                                <span className='text-[12px] sm:text-[14px] font-semibold text-[#0B1E3D]'>3</span>
                            </div>

                            <div className='flex items-center justify-between'>
                                <span className='text-[12px] sm:text-[14px] text-gray-500'>Offers Made</span>
                                <span className='text-[12px] sm:text-[14px] font-semibold text-[#0B1E3D]'>2</span>
                            </div>

                            <div className='flex items-center justify-between'>
                                <span className='text-[12px] sm:text-[14px] text-gray-500'>Auctions Won</span>
                                <span className='text-[12px] sm:text-[14px] font-semibold text-[#0B1E3D]'>1</span>
                            </div>

                            <div className='flex items-center justify-between'>
                                <span className='text-[12px] sm:text-[14px] text-gray-500'>Outbid</span>
                                <span className='text-[12px] sm:text-[14px] font-semibold text-[#0B1E3D]'>2</span>
                            </div>

                            <div className='flex items-center justify-between'>
                                <span className='text-[12px] sm:text-[14px] text-gray-500'>Total Amount Bidded</span>
                                <span className='text-[12px] sm:text-[14px] font-semibold text-[#0B1E3D]'>
                                    $149,500
                                </span>
                            </div>

                            <div className='flex items-center justify-between'>
                                <span className='text-[12px] sm:text-[14px] text-gray-500'>Winning Amount</span>
                                <span className='text-[12px] sm:text-[14px] font-bold text-[#0B1E3D]'>
                                    $28,000
                                </span>
                            </div>
                        </div>

                    </div>

                    {/* recent */}
                    <div className='bg-white rounded-xl border border-gray-200 p-5'>
                        {/* Header */}
                        <div className='flex items-center justify-between mb-4'>
                            <h3 className='text-sm font-semibold text-[#0B1E3D]'>
                                Recent Activity
                            </h3>

                            <button className='text-[10px] font-semibold text-[#D97706] hover:underline'>
                                View All
                            </button>
                        </div>

                        {/* Activities */}
                        <div className='space-y-4'>
                            {recentActivities.map((activity) => {
                                const activityConfig = {
                                    highestBid: { icon: ArrowUp, iconClass: 'bg-green-100 text-green-600', },
                                    upcoming: { icon: Clock3, iconClass: 'bg-blue-100 text-blue-600', },
                                    outbid: { icon: ArrowDown, iconClass: 'bg-red-100 text-red-600', },
                                    won: { icon: Trophy, iconClass: 'bg-green-100 text-green-600', },
                                };

                                const config = activityConfig[activity.type];
                                const Icon = config.icon;

                                return (
                                    <div
                                        key={activity.id}
                                        className='flex items-start gap-3'
                                    >
                                        {/* Icon */}
                                        <div
                                            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${config.iconClass}`}
                                        >
                                            <Icon className='w-3.5 h-3.5' />
                                        </div>

                                        {/* Content */}
                                        <div className='flex-1 min-w-0'>
                                            <p className='text-[11px] sm:text-[12px] font-medium text-[#0B1E3D] leading-4'>
                                                {activity.title}
                                            </p>

                                            <p className='text-[11px] sm:text-[13px] font-semibold text-gray-600'>
                                                {activity.amount}
                                            </p>
                                        </div>

                                        {/* Time */}
                                        <span className='text-[11px] text-gray-500 whitespace-nowrap'>
                                            {activity.time}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* support */}
                    <div className='bg-white rounded-xl border border-gray-200 p-4'>
                        <h3 className='text-sm font-semibold text-[#0B1E3D] mb-3'>
                            Need Help?
                        </h3>

                        <p className='text-[11px] text-gray-500 leading-4 mb-3'>
                            If you have any questions about your bids or offers, our support team is here to help.
                        </p>

                        <button
                            className='inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 text-[11px] font-medium text-[#0B1E3D] hover:bg-gray-50 transition-colors'
                        >
                            <Headphones className='w-3.5 h-3.5' />
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BidsOffers;
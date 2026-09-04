
import React, { useState } from 'react';
import { Radio, Gavel, Users, DollarSign, Clock3, Eye, MoreVertical, Activity } from "lucide-react";

import AuctionsHeader from '../Shared/AuctionsHeader';
import SearchBar from '../../SharedComponents/SearchBar';
import FilterDropdown from '../../SharedComponents/FilterDropdown';

import { useGetAllAuctions, useGetLiveAuctionStats } from '../../../hooks/useAuction';
import { getPaginationRange } from '../../utils/getPaginationRange';
import { formatLabel } from '../../utils/formatter';
import { UseCountDown } from '../../SharedComponents/UseCountDown';

const endingSoon = [
    {
        id: 1,
        image: "https://imgd.aeplcdn.com/370x208/n/cw/ec/200003/gravite-exterior-right-front-three-quarter-6.jpeg?isig=0&q=80",
        title: "2019 Ford F-150 XLT",
        time: "Ends in 04:32",
        status: "Live",
    },
    {
        id: 2,
        image: "https://imgd.aeplcdn.com/370x208/n/cw/ec/200003/gravite-exterior-right-front-three-quarter-6.jpeg?isig=0&q=80",
        title: "2021 BMW X5 xDrive30i",
        time: "Ends in 06:15",
        status: "Live",
    },
];

const topBidders = [
    { id: 1, name: "John Smith", bids: 12, avatar: "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg" },
    { id: 2, name: "Michael Davis", bids: 10, avatar: "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg" },
    { id: 3, name: "Sarah Johnson", bids: 9, avatar: "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg" },
    { id: 4, name: "David Lee", bids: 7, avatar: "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg" },
    { id: 5, name: "Emma Wilson", bids: 6, avatar: "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg" },
];

const liveActivity = [
    {
        id: 1,
        title: "New bid of $28,500",
        vehicle: "2021 BMW X5 xDrive30i",
        time: "Just now",
        color: "bg-blue-500",
    },
    {
        id: 2,
        title: "New bid of $22,300",
        vehicle: "2019 Ford F-150 XLT",
        time: "1 min ago",
        color: "bg-amber-500",
    },
    {
        id: 3,
        title: "New bid of $19,750",
        vehicle: "2020 Mercedes C300",
        time: "2 min ago",
        color: "bg-green-500",
    },
];

function LiveAuctionRow({ auction, onSelectVehicle }) {
    const timeLeft = UseCountDown(auction.auctionEndDateTime);
    const timeLeftDisplay = `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.mins}m ${timeLeft.secs}s`;

    return (
        <tr className="hover:bg-gray-50/50 transition-colors">

            {/* auction id */}
            <td className="px-6 py-4 text-[13px] font-medium text-slate-700 truncate">
                {auction.listingId || "N/A"}
            </td>

            {/* vehicle detail */}
            <td className="px-6 py-4 flex items-center gap-4">
                <img
                    src={auction.images?.[0]?.url || null}
                    alt={formatLabel(auction.model) || "Vehicle"}
                    className="w-16 h-10 object-cover rounded-lg shrink-0"
                />

                <div className="truncate">
                    <div className="text-gray-900 font-bold text-sm truncate">
                        {`${auction.year || ""} ${formatLabel(auction.make)} ${formatLabel(auction.model)}`}
                    </div>

                    <div className="text-[11px] text-gray-500">
                        VIN: {auction.vin || "N/A"}
                    </div>

                    <div className="text-[11px] text-gray-400 truncate">
                        {formatLabel(auction.bodyType)} •{" "}
                        {formatLabel(auction.exteriorColor)} •{" "}
                        {formatLabel(auction.transmission)}
                    </div>
                </div>
            </td>

            {/* auction type */}
            <td className="px-6 py-4">
                <span
                    className={`px-2 py-1 rounded text-[11px] font-medium border
                        ${auction.priceType === "reserve_price"
                            ? "border-purple-200 bg-purple-50 text-purple-700"
                            : "border-blue-200 bg-blue-50 text-blue-600"
                        }`}
                >
                    {formatLabel(auction.priceType)}
                </span>
            </td>

            {/* Price / Bid */}
            <td className="px-6 py-4">
                {auction.priceType === "reserve_price" ? (
                    <>
                        <div className="font-bold text-green-600 text-[12px]">
                            Current Bid:{" "}
                            {auction.currentBid != null
                                ? `AED ${auction.currentBid.toLocaleString()}`
                                : "No bids"}
                        </div>

                        <div className="text-[11px] text-slate-400">
                            Starting Bid:{" "}
                            {auction.startingBidPrice != null
                                ? `AED ${auction.startingBidPrice.toLocaleString()}`
                                : "N/A"}
                        </div>

                        <div className="text-[11px] text-slate-400">
                            Reserve:{" "}
                            {auction.reservePrice != null
                                ? `AED ${auction.reservePrice.toLocaleString()}`
                                : "N/A"}
                        </div>
                    </>
                ) : (
                    <>
                        <div className="font-bold text-green-600 text-[12px]">
                            Buy Now:{" "}
                            {auction.buyNowPrice != null
                                ? `AED ${auction.buyNowPrice.toLocaleString()}`
                                : "N/A"}
                        </div>

                        <div className="text-[11px] text-slate-400">
                            Starting Bid:{" "}
                            {auction.startingBidPrice != null
                                ? `AED ${auction.startingBidPrice.toLocaleString()}`
                                : "N/A"}
                        </div>
                    </>
                )}
            </td>

            {/* Bids */}
            <td className="px-6 py-4">
                <div className="font-bold text-sm text-slate-900">
                    {auction.bids ?? 0}
                </div>

                <div className="text-[11px] text-slate-500">
                    Bidders: {auction.bidders ?? 0}
                </div>
            </td>

            {/* Time Left */}
            <td className="px-6 py-4">
                <div className="text-sm font-bold text-slate-900 font-mono">
                    {timeLeftDisplay}
                </div>

                {auction.extensionCount > 0 && (
                    <div className="text-[10px] text-amber-600 font-medium bg-amber-50 px-1.5 py-0.5 rounded w-fit mt-1">
                        Extended {auction.extensionCount}x
                    </div>
                )}
            </td>

            {/* Status */}
            <td className="px-6 py-4">
                <span className="px-2 py-1 rounded-lg text-[11px] text-green-600 bg-green-50 border border-green-100 font-medium flex w-fit items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                    {formatLabel(auction.auctionStatus)}
                </span>
            </td>

            {/* Actions */}
            <td className="px-6 py-4">
                <div className="flex gap-2">
                    <button
                        onClick={() => onSelectVehicle(auction)}
                        className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <Eye size={16} />
                    </button>

                    <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                        <MoreVertical size={16} />
                    </button>
                </div>
            </td>

        </tr>
    );
}

function LiveAuctions({ setCurrentPage, onSelectVehicle }) {

    const [page, setPage] = useState(1);
    const [selectedType, setSelectedType] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSort, setSelectedSort] = useState("");

    const { data: allAuctions, isLoading, isError } = useGetAllAuctions(page, 10, 'live');
    const { data: liveAuctions } = useGetLiveAuctionStats();

    const allAuctionData = allAuctions?.vehicles || [];
    const totalPages = allAuctions?.pagination?.totalPages || 1;

    const statsData = liveAuctions?.data;

    if (isLoading) return <p className="p-10 text-center">Loading live auctions list....</p>;
    if (isError) return <p className="p-10 text-center text-red-500">Failed to load live auctions list</p>;

    const liveAuctionStats = [
        {
            title: "Live Auctions",
            value: statsData?.liveAuctions ?? 0,
            subTitle: "Currently running",
            badge: "Live",
            icon: Radio,
            theme: "bg-green-50",
            iconColor: "text-green-600",
        },
        {
            title: "Total Bids (All)",
            value: statsData?.totalBids ?? 0,
            subTitle: "Across all live auctions",
            icon: Gavel,
            theme: "bg-violet-50",
            iconColor: "text-violet-600",
        },
        {
            title: "Total Participants",
            value: statsData?.totalParticipants ?? 0,
            subTitle: "Active in live auctions",
            icon: Users,
            theme: "bg-blue-50",
            iconColor: "text-blue-600",
        },
        {
            title: "Total Value",
            value: statsData?.totalValue != null
                ? `AED ${statsData.totalValue.toLocaleString()}`
                : "AED 0",
            subTitle: "Combined current bids",
            icon: DollarSign,
            theme: "bg-green-50",
            iconColor: "text-green-600",
        },
        {
            title: "Ending Soon",
            value: statsData?.endingSoon ?? 0,
            subTitle: "Ending in next 5 min",
            icon: Clock3,
            theme: "bg-orange-50",
            iconColor: "text-orange-500",
        },
    ];

    return (
        <div>
            <AuctionsHeader
                setCurrentPage={setCurrentPage}
                pageTitle="Live Auctions"
                breadcrumbLabel="All Live Auctions"
            />

            {/* stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
                {liveAuctionStats.map((stat, index) => {
                    const Icon = stat.icon;

                    return (
                        <div
                            key={index}
                            className="bg-white px-3 py-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex justify-between items-start"
                        >
                            {/* Left */}
                            <div className="flex-1">

                                <p className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold">
                                    {stat.title}
                                </p>

                                <div className="flex items-center gap-2 mt-1">
                                    <h3 className="text-xl font-bold text-[#0B1E3D] leading-none py-1">
                                        {stat.value}
                                    </h3>

                                    {stat.badge && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 text-green-700 px-2 py-0.5 text-[9px] font-semibold">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                            {stat.badge}
                                        </span>
                                    )}
                                </div>

                                <p className="text-[11px] text-slate-400 font-medium mt-2">
                                    {stat.subTitle}
                                </p>

                            </div>

                            {/* Right */}
                            <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.theme}`}
                            >
                                <Icon size={18} className={stat.iconColor} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* search / filter - not perfect */}
            <div className="my-6 flex flex-wrap items-center gap-3 bg-white p-2 rounded-xl">

                <div className="grow">
                    <SearchBar />
                </div>

                {/* Filter Dropdowns */}
                <div className="flex flex-wrap items-center gap-3">

                    <FilterDropdown
                        label="All Type"
                        options={[{ label: "Standard", value: "standard" }, { label: "Reserve", value: "reserve" }]}
                        value={selectedType}
                        onChange={setSelectedType}
                    />

                    <FilterDropdown
                        label="All Categories"
                        options={[{ label: "SUV", value: "suv" }, { label: "Sedan", value: "sedan" }]}
                        value={selectedCategory}
                        onChange={setSelectedCategory}
                    />

                    <FilterDropdown
                        label="Sort By"
                        options={[{ label: "Ending Soon", value: "ending-soon" }, { label: "Ending Soon", value: "ending-soon" }]}
                        value={selectedSort}
                        onChange={setSelectedSort}
                    />

                    {/* Clear Filters */}
                    <button className="text-sm text-[#D97706] hover:underline px-2">
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* main section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 pb-6 gap-6">

                {/* left side */}
                <div className="lg:col-span-2 space-y-6">

                    <div className="overflow-x-auto border border-gray-200 rounded-lg">

                        <table className="w-full text-left table-fixed">
                            <thead className="bg-gray-100 border-b border-gray-200 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 w-35">Auction ID</th>
                                    <th className="px-6 py-4 w-75">Auction / Vehicle</th>
                                    <th className="px-6 py-4 w-40">Auction Type</th>
                                    <th className="px-6 py-4 w-50">Price / Bid</th>
                                    <th className="px-6 py-4 w-30">Bids</th>
                                    <th className="px-6 py-4 w-40">Time Left</th>
                                    <th className="px-6 py-4 w-30">Status</th>
                                    <th className="px-6 py-4 w-25">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-amber-50">
                                {allAuctionData.length > 0 ? (
                                    allAuctionData.map((auction, index) => {
                                        return (
                                            <LiveAuctionRow
                                                key={auction._id || index}
                                                auction={auction}
                                                onSelectVehicle={onSelectVehicle}
                                            />
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="px-6 py-10 text-center text-sm text-gray-500"
                                        >
                                            No auctions found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between gap-4 px-6 py-4 border-t border-slate-200 bg-white">

                            {/* Page Info */}
                            <p className="hidden sm:block text-xs text-slate-500">
                                Page <span className="font-semibold text-[#0B1E3D]">{page}</span> of{" "}
                                <span className="font-semibold text-[#0B1E3D]">{totalPages}</span>
                            </p>

                            {/* Pagination */}
                            <div className="flex items-center gap-1.5 mx-auto sm:mx-0 sm:ml-auto">

                                {/* Previous */}
                                <button
                                    type="button"
                                    onClick={() => setPage((p) => p - 1)}
                                    disabled={page === 1}
                                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600
                                                                                    hover:bg-slate-50 hover:border-slate-300
                                                                                    disabled:opacity-40 disabled:cursor-not-allowed
                                                                                    transition-all"
                                >
                                    Previous
                                </button>

                                {/* Page Numbers */}
                                {getPaginationRange(page, totalPages).map((num, idx) =>
                                    num === "..." ? (
                                        <span
                                            key={`dot-${idx}`}
                                            className="px-2 py-1.5 text-xs font-medium text-slate-400"
                                        >
                                            ...
                                        </span>
                                    ) : (
                                        <button
                                            type="button"
                                            key={num}
                                            onClick={() => setPage(num)}
                                            className={`min-w-8 h-8 px-2 rounded-lg text-xs font-semibold border transition-all
                                                                                                ${page === num
                                                    ? "bg-[#D97706] text-white border-[#D97706] shadow-sm"
                                                    : "bg-white border-slate-200 text-slate-600 hover:bg-amber-50 hover:text-[#D97706] hover:border-amber-200"
                                                }`}
                                        >
                                            {num}
                                        </button>
                                    )
                                )}

                                {/* Next */}
                                <button
                                    type="button"
                                    onClick={() => setPage((p) => p + 1)}
                                    disabled={page === totalPages}
                                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600
                                                                                    hover:bg-slate-50 hover:border-slate-300
                                                                                    disabled:opacity-40 disabled:cursor-not-allowed
                                                                                    transition-all"
                                >
                                    Next
                                </button>

                            </div>
                        </div>
                    )}
                </div>

                {/* right side */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">
                    <div className="space-y-5">

                        {/* Ending Soon */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-[13px] font-semibold text-[#0B1E3D]">
                                    Ending Soon
                                </h3>
                                <button className="text-[11px] font-medium text-[#2563EB]">
                                    View All
                                </button>
                            </div>

                            <div className="space-y-3">
                                {endingSoon.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-3"
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-12 h-12 rounded-lg object-cover shadow-lg border border-gray-300"
                                        />

                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-[12px] font-medium text-[#0B1E3D] truncate">
                                                {item.title}
                                            </h4>
                                            <p className="text-[10px] text-slate-500">
                                                {item.time}
                                            </p>
                                        </div>

                                        <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-medium">
                                            {item.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Top Bidders */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-[13px] font-semibold text-[#0B1E3D]">
                                    Top Bidders
                                </h3>
                                <button className="text-[11px] font-medium text-[#2563EB]">
                                    View All
                                </button>
                            </div>

                            <div className="space-y-3">
                                {topBidders.map((bidder, index) => (
                                    <div
                                        key={bidder.id}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="w-5 h-5 rounded bg-amber-100 text-amber-700 text-[10px] font-bold flex items-center justify-center">
                                            {index + 1}
                                        </div>

                                        <img
                                            src={bidder.avatar}
                                            alt={bidder.name}
                                            className="w-8 h-8 rounded-full"
                                        />

                                        <p className="flex-1 text-[12px] font-medium text-[#0B1E3D]">
                                            {bidder.name}
                                        </p>

                                        <span className="text-[11px] text-slate-500">
                                            {bidder.bids} Bids
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Live Activity */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-[13px] font-semibold text-[#0B1E3D]">
                                    Live Activity
                                </h3>

                                <Activity size={15} className="text-[#D97706]" />
                            </div>

                            <div className="space-y-4">
                                {liveActivity.map((item) => (
                                    <div key={item.id} className="flex gap-3">

                                        <div
                                            className={`w-2 h-2 rounded-full mt-1.5 ${item.color}`}
                                        />

                                        <div className="flex-1">
                                            <p className="text-[11px] text-[#0B1E3D] font-medium leading-5">
                                                {item.title}
                                            </p>

                                            <p className="text-[10px] text-slate-500">
                                                {item.vehicle}
                                            </p>
                                        </div>

                                        <span className="text-[10px] text-slate-400 whitespace-nowrap">
                                            {item.time}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <button className="mt-5 w-full border border-slate-200 rounded-lg py-2 text-[11px] font-medium text-[#D97706] hover:bg-amber-50 transition">
                                View All Activity
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default LiveAuctions;
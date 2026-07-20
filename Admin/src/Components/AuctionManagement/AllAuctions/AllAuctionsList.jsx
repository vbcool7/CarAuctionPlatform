
import React, { useState } from 'react';
import { Eye, MoreVertical } from "lucide-react";
import { allAuctionData } from '../../Data';

function AllAuctionsList({ setSelectedAuction, setCurrentPage }) {

    const [activeTab, setActiveTab] = useState("all auctions");

    // status styling
    const getStatusStyles = (status) => {
        switch (status) {
            case "Live": return "bg-green-50 text-green-600";
            case "Upcoming": return "bg-blue-50 text-blue-600";
            case "Completed": return "bg-emerald-50 text-emerald-600";
            case "Cancelled": return "bg-red-50 text-red-600";
            default: return "bg-gray-50 text-gray-600";
        }
    };

    return (
        <div>
            {/* Tabs */}
            <div className="mb-6 flex items-center gap-6 md:gap-8 border-b border-slate-200 overflow-x-auto scrollbar-hide">
                {["all auctions", "live", "upcoming", "completed", "cancelled"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-3 text-sm font-medium transition-all whitespace-nowrap capitalize
                        ${activeTab === tab
                                ? "border-b-2 border-[#D97706] text-[#D97706]"
                                : "text-slate-500 hover:text-[#0B1E3D]"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="overflow-x-auto no-scrollbar border border-gray-200 rounded-lg">
                {/* use table-fixed, eay to control width */}
                <table className="w-full text-left table-fixed">
                    <thead className="bg-gray-100 border-b border-gray-200 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                        <tr>
                            <th className="px-6 py-4 w-40">Auction ID</th>
                            <th className="px-6 py-4 w-75">Auction title / Vehicle</th>
                            <th className="px-6 py-4 w-25">Type</th>
                            <th className="px-6 py-4 w-38">Start Date & Time</th>
                            <th className="px-6 py-4 w-38">End Date & Time</th>
                            <th className="px-6 py-4 w-35 text-center">Current Bid</th>
                            <th className="px-6 py-4 w-30">Bids</th>
                            <th className="px-6 py-4 w-30">Status</th>
                            <th className="px-6 py-4 w-25">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-amber-50">
                        {allAuctionData.map((auction) => (
                            <tr key={auction.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 text-[13px] font-medium text-slate-700 truncate">{auction.id}</td>

                                <td className="px-6 py-4 flex items-center gap-4">
                                    <img src={auction.imageUrl} alt={auction.title} className="w-16 h-10 object-cover rounded-lg shrink-0" />
                                    <div className="truncate">
                                        <div className="text-gray-900 font-bold text-sm truncate">{auction.title}</div>
                                        <div className="text-[11px] text-gray-500">VIN: {auction.vin}</div>
                                        <div className="text-[11px] text-gray-400 truncate">{auction.specs.body} • {auction.specs.color} • {auction.specs.transmission}</div>
                                    </div>
                                </td>

                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-[11px] font-medium border 
                                        ${auction.type === 'Reserve' ? 'border-purple-200 bg-purple-50 text-purple-700' : 'border-blue-200 bg-blue-50 text-blue-600'}`}>
                                        {auction.type}
                                    </span>
                                </td>

                                {/* Start Date & Time */}
                                <td className="px-6 py-4 text-[13px] text-slate-700 leading-tight">
                                    <div>{auction.startDate}</div>
                                    <div className="font-semibold">{auction.startTime}</div>
                                </td>

                                {/* End Date & Time */}
                                <td className="px-6 py-4 text-[13px] text-slate-700 leading-tight">
                                    <div>{auction.endDate}</div>
                                    <div className="font-semibold">{auction.endTime}</div>
                                </td>

                                {/* current bid */}
                                <td className="px-6 py-4 ">
                                    <div className="font-bold text-green-600 text-sm">{auction.currentBid}</div>
                                    <div className="text-[11px] text-slate-400">Reserve: {auction.reserve}</div>
                                </td>

                                {/* bids */}
                                <td className="px-6 py-4">
                                    <div className="font-bold text-sm text-slate-900">{auction.bids}</div>
                                    <div className="text-[11px] text-slate-500">Bidders: {auction.bidders}</div>
                                </td>

                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-medium flex w-fit items-center gap-1.5 ${getStatusStyles(auction.status)}`}>
                                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                        {auction.status}
                                    </span>
                                </td>

                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setSelectedAuction(auction);
                                                if (auction.status === 'Live') setCurrentPage('live-auction-detail');
                                                else if (auction.status === 'Upcoming') setCurrentPage('upcoming-auction-detail');
                                                // else: no branch yet — see question below
                                            }}
                                            className="p-1 text-slate-400 hover:text-slate-600">
                                            <Eye size={16} />
                                        </button>
                                        <button className="p-1 text-slate-400 hover:text-slate-600"><MoreVertical size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AllAuctionsList;
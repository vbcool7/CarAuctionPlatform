
import React, { useState } from 'react';
import { Eye } from 'lucide-react';
import { bidsList } from '../Data';

function BidManagementList() {

    const [activeTab, setActiveTab] = useState("all-bids");

    // tabs
    const tabs = [
        { id: 'all-bids', label: 'All Bids', },
        { id: 'active-bids', label: 'Active Bids', },
        { id: 'won-bids', label: 'Won Bids', },
        { id: 'outbid-bids', label: 'Outbid Bids', },
        { id: 'withdrawn-bids', label: 'Withdrawn Bids', },
    ];

    const filteredBids = bidsList.filter((bid) => {
    if (activeTab === 'all-bids') return true;
    if (activeTab === 'active-bids') return bid.badge === 'Active';
    if (activeTab === 'won-bids') return bid.badge === 'Won';
    if (activeTab === 'outbid-bids') return bid.badge === 'Outbid';
    if (activeTab === 'withdrawn-bids') return bid.badge === 'Withdrawn';
    return true;
});

    return (
        <div>
            {/* tabs */}
            <div className="flex gap-10 border-b border-slate-100 my-6 overflow-x-auto no-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`pb-3 text-[14px] font-medium whitespace-nowrap border-b-2 transition-colors 
                            ${activeTab === tab.id
                                ? 'border-[#D97706] text-[#D97706]'
                                : 'border-transparent text-slate-500 hover:text-slate-700'
                            }`}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* table */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-left table-fixed">
                    <thead className="bg-gray-100 border-b border-gray-200 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                        <tr>
                            <th className="px-6 py-4 w-38">Bid ID</th>
                            <th className="px-6 py-4 w-75">Auction / Vehicle</th>
                            <th className="px-6 py-4 w-55">Bidder</th>
                            <th className="px-6 py-4 w-45">Bid Amount</th>
                            <th className="px-6 py-4 w-40">Bid Time</th>
                            <th className="px-6 py-4 w-35">Status</th>
                            <th className="px-6 py-4 w-35">Bid Type</th>
                            <th className="px-6 py-4 w-25">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-amber-50">
                        {filteredBids.map((bid, index) => (
                            <tr
                                key={bid.bidId || index}
                                className="hover:bg-gray-50/50 transition-colors">

                                {/* bid id */}
                                <td className='px-6 py-4'>
                                    <span className='text-[13px] font-semibold text-gray-500'>
                                        {bid.bidId || "---"}
                                    </span>
                                </td>

                                {/* vehicle detail */}
                                <td className="px-6 py-4 flex items-center gap-4">
                                    <img
                                        src={bid.imageUrl}
                                        alt={bid.name}
                                        className="w-16 h-10 object-cover rounded-lg shrink-0" />
                                    <div className="truncate">
                                        <div className="text-gray-900 font-bold text-sm truncate">{bid.name}</div>
                                        <div className="text-[11px] text-gray-500">VIN: {bid.auctionId}</div>
                                    </div>
                                </td>

                                {/* bidder */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={bid.avatarUrl}
                                            alt={bid.bidderName}
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                        <div>
                                            <div className="font-semibold text-slate-900 text-[14px]">
                                                {bid.bidderName}
                                            </div>
                                            <div className="text-xs text-slate-500 font-medium">
                                                {bid.bidderId}
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                {/* bid amt */}
                                <td className='px-6 py-4'>
                                    <div className="flex items-center gap-2">
                                        <span className={`font-bold text-sm ${bid.status === 'Winning' ? 'text-green-600' : 'text-slate-700'}`}>
                                            {bid.amount}
                                        </span>
                                        {bid.status && (
                                            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-green-50 text-green-600 border border-green-200">
                                                {bid.status}
                                            </span>
                                        )}
                                    </div>
                                </td>

                                {/* bid time */}
                                <td className="px-6 py-4 text-[13px] text-slate-700 leading-tight">
                                    <div>{bid.date}</div>
                                    <div className="font-semibold">{bid.time}</div>
                                </td>

                                {/* status */}
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-[11px] font-medium border 
                                    ${bid.badgeType === 'success'
                                            ? 'border-green-200 bg-green-50 text-green-700'
                                            : bid.badgeType === 'danger'
                                                ? 'border-red-200 bg-red-50 text-red-600'
                                                : 'border-amber-200 bg-amber-50 text-amber-600'
                                        }`}>
                                        {bid.badge}
                                    </span>
                                </td>

                                {/* bid type */}
                                <td className='px-6 py-4'>
                                    <span className='px-2 py-1 rounded text-[11px] font-medium border border-gray-200 bg-gray-50 text-gray-600'>
                                        {bid.bidType}
                                    </span>
                                </td>

                                {/* actions */}
                                <td className="px-6 py-4">
                                    <div className="">
                                        <button
                                            // onClick={() => onSelectVehicle(auction)}
                                            className="p-1 text-slate-400 hover:text-slate-600">
                                            <Eye size={16} />
                                        </button>
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

export default BidManagementList;
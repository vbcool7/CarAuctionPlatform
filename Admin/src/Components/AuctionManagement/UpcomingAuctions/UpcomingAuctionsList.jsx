
import React, { useState } from 'react';
import { Eye, MoreVertical } from 'lucide-react';
import { allAuctionData } from '../../Data';

function UpcomingAuctionsList({ setCurrentPage, onSelectVehicle }) {

    const [activeTab, setActiveTab] = useState("all-upcoming");

    // tabs
    const tabs = [
        { id: 'all-upcoming', label: 'All Upcoming' },
        { id: 'starting-today', label: 'Starting Today' },
        { id: 'this-week', label: 'This Week' },
        { id: 'this-month', label: 'This Month' },
    ];

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
                            <th className="px-6 py-4 w-38">Auction ID</th>
                            <th className="px-6 py-4 w-75">Auction / Vehicle</th>
                            <th className="px-6 py-4 w-25">Type</th>
                            <th className="px-6 py-4 w-40">Start Date & time</th>
                            <th className="px-6 py-4 w-35">Current Bid</th>
                            <th className="px-6 py-4 w-40">Starting Price</th>
                            <th className="px-6 py-4 w-30">Bids</th>
                            <th className="px-6 py-4 w-40">Status</th>
                            <th className="px-6 py-4 w-25">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-amber-50">
                        {allAuctionData.filter((item) => item.status === "Upcoming").map((auction) => (
                            <tr
                                key={auction.id}
                                className="hover:bg-gray-50/50 transition-colors">

                                {/* auction id */}
                                <td className='px-6 py-4'>
                                    <span className='text-[13px] font-semibold text-gray-500'>
                                        {auction.id || "---"}
                                    </span>
                                </td>

                                {/* vehicle detail */}
                                <td className="px-6 py-4 flex items-center gap-4">
                                    <img
                                        src={auction.imageUrl}
                                        alt={auction.title}
                                        className="w-16 h-10 object-cover rounded-lg shrink-0" />
                                    <div className="truncate">
                                        <div className="text-gray-900 font-bold text-sm truncate">{auction.title}</div>
                                        <div className="text-[11px] text-gray-500">VIN: {auction.vin}</div>
                                        <div className="text-[11px] text-gray-400 truncate">{auction.specs.body} • {auction.specs.color} • {auction.specs.transmission}</div>
                                    </div>
                                </td>

                                {/* type */}
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-[11px] font-medium border 
                                        ${auction.type === 'Reserve' ? 'border-purple-200 bg-purple-50 text-purple-700' : 'border-blue-200 bg-blue-50 text-blue-600'}`}>
                                        {auction.type}
                                    </span>
                                </td>

                                {/* start date */}
                                <td className="px-6 py-4 text-[13px] text-slate-700 leading-tight">
                                    <div>{auction.startDate}</div>
                                    <div className="font-semibold">{auction.startTime}</div>
                                </td>

                                {/* current bid */}
                                <td className="px-6 py-4 ">
                                    <div className="font-bold text-green-600 text-sm">-</div>
                                    <div className="text-[11px] text-slate-400">No Bids Yet</div>
                                </td>

                                {/* starting price */}
                                <td className='px-6 py-4'>
                                    <div className="font-bold text-green-600 text-sm">{auction.currentBid}</div>
                                </td>

                                {/* bids */}
                                <td className='px-6 py-4'>
                                    <div className="font-bold text-gray-600 text-sm">0</div>
                                </td>

                                {/* status */}
                                <td className='px-6 py-4'>
                                    <span className='px-2 py-1 rounded text-[11px] font-medium border border-blue-200 bg-blue-50 text-blue-600'>
                                        {auction.startsIn}
                                    </span>
                                </td>

                                {/* actions */}
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onSelectVehicle(auction)}
                                            className="p-1 text-slate-400 hover:text-slate-600">
                                            <Eye size={16} />
                                        </button>

                                        <button className="p-1 text-slate-400 hover:text-slate-600">
                                            <MoreVertical size={16} />
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

export default UpcomingAuctionsList;
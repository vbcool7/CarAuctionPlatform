
import React, { useState } from 'react'
import { Users, CalendarDays, Gavel, Tag, BadgeDollarSign } from "lucide-react";

import AuctionsDetailHeader from '../Shared/AuctionsDetailHeader'
import CancelledAuctionDetailInfobar from './CancelledAuctionDetailInfobar'
import LiveAuctionOverviewTab from '../LiveAuctions/LiveAuctionOverviewTab';
import LiveAuctionVehiclDetailTab from '../LiveAuctions/LiveAuctionVehiclDetailTab';
import LiveAuctionsDocumentsTab from '../LiveAuctions/LiveAuctionsDocumentsTab';
import LiveAuctionsParticipantsTab from '../LiveAuctions/LiveAuctionsParticipantsTab';
import LiveAuctionsBidsTab from '../LiveAuctions/LiveAuctionsBidsTab';
import OverviewSidebar from '../Shared/OverviewSidebar';
import VehicleDetailSidebar from '../Shared/VehicleDetailSidebar';
import DocumentSidebar from '../Shared/DocumentSidebar';
import BidsSidebar from '../Shared/BidsSidebar';
import ParticipantSidebar from '../Shared/ParticipantSidebar';

const auctionHighlights = [
    {
        label: "Total Participants",
        value: "8",
        icon: Users,
        iconBg: "bg-blue-50",
        iconColor: "text-blue-600",
    },
    {
        label: "Total Bids Placed",
        value: "5",
        icon: Gavel,
        iconBg: "bg-amber-50",
        iconColor: "text-amber-600",
    },
    {
        label: "Starting Price",
        value: "$24,500",
        icon: CalendarDays,
        iconBg: "bg-red-50",
        iconColor: "text-red-500",
    },
    {
        label: "Reserve Price",
        value: "$28,000",
        icon: Tag,
        iconBg: "bg-blue-50",
        iconColor: "text-blue-600",
    },
    {
        label: "Final Price",
        value: "-",
        icon: BadgeDollarSign,
        iconBg: "bg-emerald-50",
        iconColor: "text-emerald-600",
    },
];

function CancelledAuctionsDetail({ setCurrentPage, auction }) {

    const [activeTab, setActiveTab] = useState('auction-overview');

    // tabs
    const tabs = [
        { id: 'auction-overview', label: 'Auction Overview' },
        { id: 'vehicles-detail', label: 'Vehicles Detail' },
        { id: 'documents', label: 'Documents' },
        { id: 'bids', label: 'Bids' },
        { id: 'participants', label: 'Participants' },
    ];

    return (
        <div>
            <AuctionsDetailHeader
                setCurrentPage={setCurrentPage}
                pageTitle="Cancelled Auction Details"
                parentLabel="Cancelled Auctions"
                parentPage="cancelled-auctions"
                currentLabel="Cancelled Auction Detail"
                backButtonTarget="all-auctions"
            />

            <CancelledAuctionDetailInfobar auction={auction} />

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

            {/* tabs detail */}
            <div className="grid grid-cols-1 xl:grid-cols-3 pb-6 gap-6 items-start">

                {/* right side - section */}
                <div className="lg:col-span-2 space-y-6">
                    {activeTab === 'auction-overview' && <LiveAuctionOverviewTab auction={auction} />}
                    {activeTab === 'vehicles-detail' && <LiveAuctionVehiclDetailTab auction={auction} />}
                    {activeTab === 'documents' && <LiveAuctionsDocumentsTab auction={auction} />}
                    {activeTab === 'participants' && <LiveAuctionsParticipantsTab auction={auction} />}
                    {activeTab === 'bids' && <LiveAuctionsBidsTab auction={auction} />}

                    {/* feature bar */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        {/* Header */}
                        <h3 className="mb-3 text-sm font-semibold text-[#0B1E3D]">
                            Auction Highlights
                        </h3>

                        {/* Feature Bar */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            {auctionHighlights.map((item, index) => {
                                const Icon = item.icon;

                                return (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3"
                                    >
                                        {/* Icon */}
                                        <div
                                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${item.iconBg}`}
                                        >
                                            <Icon
                                                size={17}
                                                className={item.iconColor}
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-[#0B1E3D]">
                                                {item.value}
                                            </p>

                                            <p className="mt-0.5 truncate text-[10px] font-medium text-slate-500">
                                                {item.label}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* left side - section */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">
                    {activeTab === 'auction-overview' && <OverviewSidebar auction={auction} />}
                    {activeTab === 'vehicles-detail' && <VehicleDetailSidebar auction={auction} />}
                    {activeTab === 'documents' && <DocumentSidebar auction={auction} />}
                    {activeTab === 'bids' && <BidsSidebar auction={auction} />}
                    {activeTab === 'participants' && <ParticipantSidebar auction={auction} />}
                </div>

            </div>
        </div>
    )
}

export default CancelledAuctionsDetail
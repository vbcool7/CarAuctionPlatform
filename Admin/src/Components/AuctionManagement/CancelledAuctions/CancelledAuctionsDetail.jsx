
import React, { useState } from 'react'
import { Users, CalendarDays, Gavel, Tag, BadgeDollarSign, XCircle, FileText } from "lucide-react";

import AuctionsDetailHeader from '../Shared/AuctionsDetailHeader'
import OverviewSidebar from '../Shared/OverviewSidebar';
import DocumentSidebar from '../Shared/DocumentSidebar';
import BidsSidebar from '../Shared/BidsSidebar';
import ParticipantSidebar from '../Shared/ParticipantSidebar';
import AuctionsOverviewTab from '../Shared/AuctionsOverviewTab';
import AuctionsVehicleDetailTab from '../Shared/AuctionsVehicleDetailTab';
import AuctionsDocumentsTab from '../Shared/AuctionsDocumentsTab';
import AuctionsParticipantsTab from '../Shared/AuctionsParticipantsTab';
import AuctionsBidsTab from '../Shared/AuctionsBidsTab';
import AuctionsGallery from '../Shared/AuctionsGallery';
import ContactSupport from '../../SharedComponents/ContactSupport';

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

const Info = ({ label, value }) => (
    <div className="flex flex-col">
        <span className="text-slate-500 text-xs">{label}</span>
        <span className="font-semibold text-[#0B1E3D]">{value || "--"}</span>
    </div>
);

const TagBadge = ({ children }) => (
    <span className="px-3 py-1 rounded-md bg-slate-100 text-xs font-medium text-slate-700">
        {children}
    </span>
);

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

            {/* cancel info bar */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* left Gallery */}
                    <AuctionsGallery
                        images={auction.images}
                        status="cancelled"
                    />

                    {/* Right Section */}
                    <div className="flex flex-col">

                        {/* Title */}
                        <h2 className="text-2xl font-bold text-[#0B1E3D]">
                            {auction.title}
                        </h2>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mt-3 mb-6">
                            <TagBadge>{auction.specs.body}</TagBadge>
                            <TagBadge>{auction.specs.color}</TagBadge>
                            <TagBadge>{auction.specs.transmission}</TagBadge>
                            <TagBadge>{auction.specs.fuelType}</TagBadge>
                        </div>

                        {/* Auction Details */}
                        <div className="grid grid-cols-3 gap-x-8 gap-y-3 text-[13px] mb-8">
                            <Info label="Auction ID" value={auction.id} />
                            <Info label="Auction Type" value={auction.type} />

                            <Info label="VIN" value={auction.vin} />
                            <Info label="Start Date" value={auction.startDate} />

                            <Info label="Start Time" value={auction.startTime} />
                            <Info label="End Time" value={auction.endTime} />

                            <Info label="Starting Price" value={auction.currentBid} />
                            <Info label="Reserve Price" value={auction.reserve} />

                            <Info label="Total Bids" value={auction.bids} />
                            <Info label="Bidders" value={auction.bidders} />

                            <Info label="Buy Now Price" value={auction.bidders} />
                        </div>
                        
                        {/* Auction Cancellation Details */}
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-700">
                                        Auction Status
                                    </h3>
                                    <p className="mt-0.5 text-[11px] text-slate-400">
                                        Cancellation details
                                    </p>
                                </div>

                                <span className="inline-flex items-center gap-1.5 rounded-md border border-red-100 bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-600">
                                    <XCircle size={13} />
                                    Cancelled
                                </span>
                            </div>

                            {/* Cancellation Details */}
                            <div className="grid grid-cols-2 gap-x-6 gap-y-4 py-4">
                                {/* Cancelled Date */}
                                <div>
                                    <p className="text-[11px] font-medium text-slate-500">
                                        Cancelled Date
                                    </p>
                                    <p className="mt-1 text-xs font-semibold text-slate-700">
                                        May 14, 2024 09:30 AM
                                    </p>
                                </div>

                                {/* Cancelled By */}
                                <div>
                                    <p className="text-[11px] font-medium text-slate-500">
                                        Cancelled By
                                    </p>
                                    <p className="mt-1 text-xs font-semibold text-slate-700">
                                        Admin User
                                    </p>
                                </div>

                                {/* Reason */}
                                <div className="col-span-2">
                                    <p className="text-[11px] font-medium text-slate-500">
                                        Reason
                                    </p>
                                    <p className="mt-1 text-xs font-semibold text-slate-700">
                                        Not enough participants
                                    </p>
                                </div>
                            </div>

                            {/* Footer Action */}
                            <div className="border-t border-slate-200 pt-3">
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-2 rounded-lg bg-[#0B1E3D] px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-[#142B50]"
                                >
                                    <FileText size={13} />
                                    View Cancellation Log
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

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
                    {activeTab === 'auction-overview' && <AuctionsOverviewTab auction={auction} />}
                    {activeTab === 'vehicles-detail' && <AuctionsVehicleDetailTab auction={auction} />}
                    {activeTab === 'documents' && <AuctionsDocumentsTab auction={auction} />}
                    {activeTab === 'participants' && <AuctionsParticipantsTab auction={auction} />}
                    {activeTab === 'bids' && <AuctionsBidsTab auction={auction} />}

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
                    {activeTab === 'vehicles-detail' && <ContactSupport />}
                    {activeTab === 'documents' && <DocumentSidebar auction={auction} />}
                    {activeTab === 'bids' && <BidsSidebar auction={auction} />}
                    {activeTab === 'participants' && <ParticipantSidebar auction={auction} />}
                </div>

            </div>
        </div>
    )
}

export default CancelledAuctionsDetail
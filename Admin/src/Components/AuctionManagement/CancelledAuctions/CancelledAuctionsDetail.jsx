
import React, { useState } from 'react'
import { Users, CalendarDays, Gavel, Tag, XCircle, FileText } from "lucide-react";

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
import AuctionsDetailTimeline from '../Shared/AuctionsDetailTimeline';

import { useGetAuctionDetail } from '../../../hooks/useAuction';
import { formatLabel, formatPrice } from '../../utils/formatter';

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

    const { data: auctionDetail, isLoading, isError } = useGetAuctionDetail(auction._id);

    const vehicle = auctionDetail?.data?.vehicle;

    if (isLoading) return <p className="p-10 text-center">Loading auction details...</p>;
    if (isError) return <p className="p-10 text-center text-red-500">Failed to load auction details</p>;

    if (!vehicle) {
        return (
            <p className="p-10 text-center text-red-500">
                Auction details not found
            </p>
        );
    }

    const bids = auctionDetail?.data?.bids || [];
    const participants = auctionDetail?.data?.participants || [];

    // tabs
    const tabs = [
        { id: 'auction-overview', label: 'Auction Overview' },
        { id: 'vehicles-detail', label: 'Vehicles Detail' },
        { id: 'documents', label: 'Documents' },
        { id: 'bids', label: 'Bids' },
        { id: 'participants', label: 'Participants' },
    ];

    const auctionHighlights = [
        {
            label: "Total Participants",
            value: participants.length || 0,
            icon: Users,
            iconBg: "bg-blue-50",
            iconColor: "text-blue-600",
        },
        {
            label: "Total Bids Placed",
            value: bids.length || 0,
            icon: Gavel,
            iconBg: "bg-amber-50",
            iconColor: "text-amber-600",
        },
        {
            label: "Starting Price",
            value: formatPrice(vehicle?.startingBidPrice),
            icon: CalendarDays,
            iconBg: "bg-red-50",
            iconColor: "text-red-500",
        },
        {
            label: vehicle?.priceType === "fixed_price"
                ? "Buy Now Price"
                : "Reserve Price",

            value: vehicle?.priceType === "fixed_price"
                ? formatPrice(vehicle?.buyNowPrice)
                : formatPrice(vehicle?.reservePrice),

            icon: Tag,
            iconBg: "bg-blue-50",
            iconColor: "text-blue-600",
        },
    ];

    return (
        <div>
            <AuctionsDetailHeader
                setCurrentPage={setCurrentPage}
                pageTitle="Cancelled Auction Details"
                parentLabel="Canceled Auctions"
                parentPage="canceled-auctions"
                currentLabel="Canceled Auction Detail"
                backButtonTarget="all-auctions"
            />

            {/* cancel info bar */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Left Gallery */}
                    <div className="h-100">
                        <AuctionsGallery
                            images={vehicle.images?.map((image) => image.url) || []}
                            status={vehicle.auctionStatus}
                        />
                    </div>

                    {/* Right Section */}
                    <div className="flex flex-col">

                        {/* Title */}
                        <h2 className="text-2xl font-bold text-[#0B1E3D]">
                            {`${vehicle.year || ""} ${formatLabel(vehicle.make)} ${formatLabel(vehicle.model)}`}
                        </h2>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mt-3 mb-6">
                            <TagBadge>{formatLabel(vehicle.bodyType)}</TagBadge>
                            <TagBadge>{formatLabel(vehicle.exteriorColor)}</TagBadge>
                            <TagBadge>{formatLabel(vehicle.transmission)}</TagBadge>
                            <TagBadge>{formatLabel(vehicle.fuelType)}</TagBadge>
                        </div>

                        {/* Auction Details */}
                        <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-[13px] mb-8">
                            <Info label="Auction ID" value={formatLabel(vehicle.listingId)} />

                            <Info label="VIN" value={formatLabel(vehicle.vin)} />
                            <Info
                                label="Start Date"
                                value={
                                    vehicle.auctionStartDateTime
                                        ? new Date(vehicle.auctionStartDateTime).toLocaleDateString("en-GB", {
                                            timeZone: "Asia/Dubai",
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: true,
                                        })
                                        : "—"
                                }
                            />

                            <Info
                                label="End Date"
                                value={
                                    vehicle.auctionEndDateTime
                                        ? new Date(vehicle.auctionEndDateTime).toLocaleDateString("en-GB", {
                                            timeZone: "Asia/Dubai",
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: true,
                                        })
                                        : "—"
                                }
                            />
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
                                    {formatLabel(vehicle?.auctionStatus)}
                                </span>
                            </div>

                            {/* Cancellation Details */}
                            <div className="grid grid-cols-2 gap-x-6 gap-y-4 py-4">
                                <div>
                                    <p className="text-[11px] font-medium text-slate-500"> Cancelled Date </p>
                                    <p className="mt-1 text-xs font-semibold text-slate-700">
                                        <div>
                                            {vehicle.canceledAt
                                                ? new Date(vehicle.canceledAt).toLocaleDateString("en-GB", {
                                                    timeZone: "Asia/Dubai",
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    hour12: true,
                                                })
                                                : "N/A"}
                                        </div>
                                    </p>
                                </div>

                                {/* Cancelled By */}
                                <div>
                                    <p className="text-[11px] font-medium text-slate-500">
                                        Cancelled By
                                    </p>
                                    <span
                                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium 
                                            ${vehicle.canceledBy === "admin"
                                                ? "bg-blue-50 text-blue-600"
                                                : "bg-purple-50 text-purple-600"
                                            }`}
                                    >
                                        {formatLabel(vehicle.canceledBy)}
                                    </span>
                                </div>

                                {/* Reason */}
                                <div className="col-span-2">
                                    <p className="text-[11px] font-medium text-slate-500">
                                        Reason
                                    </p>
                                    <p className="mt-1 text-xs font-semibold text-slate-700">
                                        {formatLabel(vehicle.cancellationReason || "—")}
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
                    {activeTab === 'auction-overview' && <AuctionsOverviewTab vehicle={vehicle} />}
                    {activeTab === 'vehicles-detail' && <AuctionsVehicleDetailTab vehicle={vehicle} />}
                    {activeTab === 'documents' && <AuctionsDocumentsTab vehicle={vehicle} />}
                    {activeTab === 'bids' && <AuctionsBidsTab vehicle={vehicle} bids={bids} />}
                    {activeTab === 'participants' && <AuctionsParticipantsTab participants={participants} />}

                    <AuctionsDetailTimeline vehicle={vehicle} />

                    {/* feature bar */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <h3 className="mb-3 text-sm font-semibold text-[#0B1E3D]">
                            Auction Highlights
                        </h3>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {auctionHighlights.map((item, index) => {
                                const Icon = item.icon;

                                return (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3"
                                    >
                                        <div
                                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${item.iconBg}`}
                                        >
                                            <Icon
                                                size={17}
                                                className={item.iconColor}
                                            />
                                        </div>

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
                    {activeTab === 'auction-overview' && <OverviewSidebar vehicle={vehicle} bids={bids} participants={participants} setCurrentPage={setCurrentPage} />}
                    {activeTab === 'vehicles-detail' && <ContactSupport />}
                    {activeTab === 'documents' && <DocumentSidebar vehicle={vehicle} />}
                    {activeTab === 'bids' && <BidsSidebar vehicle={vehicle} bids={bids} />}
                    {activeTab === 'participants' && <ParticipantSidebar vehicle={vehicle} participants={participants} bids={bids} />}
                </div>

            </div>
        </div>
    )
}

export default CancelledAuctionsDetail
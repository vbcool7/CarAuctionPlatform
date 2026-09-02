
import React, { useState } from 'react'
import { FileText } from 'lucide-react';
import AuctionsDetailHeader from '../Shared/AuctionsDetailHeader';
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

// tabs
const tabs = [
    { id: 'auction-overview', label: 'Auction Overview' },
    { id: 'vehicles-detail', label: 'Vehicles Detail' },
    { id: 'documents', label: 'Documents' },
    { id: 'bids', label: 'Bids' },
    { id: 'participants', label: 'Participants' },
];

const statusColors = {
    live: "bg-green-100 text-green-700",
    upcoming: "bg-blue-100 text-blue-700",
    sold: "bg-purple-100 text-purple-700",
    unsold: "bg-slate-100 text-slate-600",
    "reserve-not-met": "bg-orange-100 text-orange-700",
    canceled: "bg-red-100 text-red-700",
    draft: "bg-gray-100 text-gray-700",
};

const Info = ({ label, value }) => (
    <div className="flex flex-col">
        <span className="text-slate-500 text-xs">{label}</span>
        <span className="font-semibold text-[#0B1E3D]">{value || "--"}</span>
    </div>
);

const Tag = ({ children }) => (
    <span className="px-3 py-1 rounded-md bg-slate-100 text-xs font-medium text-slate-700">
        {children}
    </span>
);

function CompletedAuctionsDetail({ setCurrentPage, auction }) {

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
    const soldTo = auctionDetail?.data?.soldTo;

    return (
        <div>
            <AuctionsDetailHeader
                setCurrentPage={setCurrentPage}
                pageTitle="Completed Auction Details"
                parentLabel="Completed Auctions"
                parentPage="completed-auctions"
                currentLabel="Completed Auction Detail"
                backButtonTarget="all-auctions"
            />

            {/* completed info bar */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Left Gallery */}
                    <div className="h-100">
                        <AuctionsGallery
                            images={vehicle.images?.map((image) => image.url) || []}
                            status={
                                vehicle.auctionStatus === 'canceled' ? 'cancelled' :
                                    ['sold', 'unsold', 'reserve-not-met'].includes(vehicle.auctionStatus) ? 'completed' :
                                        vehicle.auctionStatus
                            }
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
                            <Tag>{formatLabel(vehicle.bodyType)}</Tag>
                            <Tag>{formatLabel(vehicle.exteriorColor)}</Tag>
                            <Tag>{formatLabel(vehicle.transmission)}</Tag>
                            <Tag>{formatLabel(vehicle.fuelType)}</Tag>
                        </div>

                        {/* Auction Details */}
                        <div className="grid grid-cols-3 gap-x-8 gap-y-3 text-[13px] mb-8">
                            <Info label="Auction ID" value={formatLabel(vehicle.listingId)} />
                            <Info label="Category" value={formatLabel(vehicle.vehicleType)} />

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
                                        })
                                        : "—"
                                }
                            />

                            <Info
                                label="Start Time"
                                value={
                                    vehicle.auctionStartDateTime
                                        ? new Date(vehicle.auctionStartDateTime).toLocaleTimeString("en-US", {
                                            timeZone: "Asia/Dubai",
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
                                        })
                                        : "—"
                                }
                            />

                            <Info
                                label="End Time"
                                value={
                                    vehicle.auctionEndDateTime
                                        ? new Date(vehicle.auctionEndDateTime).toLocaleTimeString("en-US", {
                                            timeZone: "Asia/Dubai",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: true,
                                        })
                                        : "—"
                                }
                            />

                            <Info label="Starting Bid Price" value={formatPrice(vehicle.startingBidPrice)} />

                            {vehicle.priceType === "fixed_price" ? (
                                <Info
                                    label="Buy Now Price"
                                    value={formatPrice(vehicle.buyNowPrice)}
                                />
                            ) : vehicle.priceType === "reserve_price" ? (
                                <Info
                                    label="Reserve Price"
                                    value={formatPrice(vehicle.reservePrice)}
                                />
                            ) : null}

                        </div>

                        {/* Auction Completion Details */}
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                                <div>
                                    <h3 className="text-sm font-semibold text-[#0B1E3D]">
                                        Auction Status
                                    </h3>
                                    <p className="mt-0.5 text-[11px] text-slate-400">
                                        Completion details
                                    </p>
                                </div>

                                <span className={`inline-flex w-fit items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium 
                                    ${statusColors[vehicle.auctionStatus] || "bg-slate-100 text-slate-600"}`}>
                                    <span className="w-2 h-2 rounded-full bg-current"></span>
                                    {formatLabel(vehicle.auctionStatus) || "—"}
                                </span>
                            </div>

                            {/* Completion Details */}
                            <div className="grid grid-cols-2 gap-x-6 gap-y-4 py-4">
                                {/* Completed Date */}
                                <div>
                                    <p className="text-[11px] font-medium text-slate-500">
                                        Completed Date
                                    </p>
                                    <p className="mt-1 text-xs font-semibold text-slate-700">
                                        {vehicle.auctionEndDateTime
                                            ? new Date(vehicle.auctionEndDateTime).toLocaleString("en-GB", {
                                                timeZone: "Asia/Dubai",
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: true,
                                            })
                                            : "—"}
                                    </p>
                                </div>

                                {/* Winner */}
                                {vehicle.auctionStatus === "sold" && (
                                    <div>
                                        <p className="text-[11px] font-medium text-slate-500">
                                            Winner
                                        </p>

                                        <p className="mt-1 text-xs font-semibold text-slate-700">
                                            {soldTo?.name || "—"}
                                        </p>
                                    </div>
                                )}

                                {/* Final Price */}
                                {vehicle.auctionStatus === "sold" && (
                                    <div>
                                        <p className="text-[11px] font-medium text-slate-500">
                                            Final Price
                                        </p>

                                        <p className="mt-1 text-xs font-semibold text-green-600">
                                            {formatPrice(vehicle.currentBid)}
                                        </p>
                                    </div>
                                )}

                                {/* Total Bids */}
                                <div>
                                    <p className="text-[11px] font-medium text-slate-500">
                                        Total Bids
                                    </p>
                                    <p className="mt-1 text-xs font-semibold text-slate-700">
                                        {bids?.length ?? 0} Bids
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
                                    View Auction Results
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

                {/* left side - section */}
                <div className="lg:col-span-2 space-y-6">
                    {activeTab === 'auction-overview' && <AuctionsOverviewTab vehicle={vehicle} />}
                    {activeTab === 'vehicles-detail' && <AuctionsVehicleDetailTab vehicle={vehicle} />}
                    {activeTab === 'documents' && <AuctionsDocumentsTab vehicle={vehicle} />}
                    {activeTab === 'bids' && <AuctionsBidsTab vehicle={vehicle} bids={bids} />}
                    {activeTab === 'participants' && <AuctionsParticipantsTab participants={participants} />}

                    <AuctionsDetailTimeline vehicle={vehicle} />
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

        </div >
    )
}

export default CompletedAuctionsDetail

import React, { useState } from 'react'
import { Share2, Pause, XCircle } from 'lucide-react';

import AuctionsDetailHeader from '../Shared/AuctionsDetailHeader';
import AuctionsDetailTimeline from '../Shared/AuctionsDetailTimeline';
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

import { useGetAuctionDetail } from '../../../hooks/useAuction';
import { formatLabel, formatPrice } from '../../utils/formatter';
import { UseCountDown } from '../../SharedComponents/UseCountDown';
import ContactSupport from '../../SharedComponents/ContactSupport';

// tabs
const tabs = [
    { id: 'auction-overview', label: 'Auction Overview' },
    { id: 'vehicles-detail', label: 'Vehicles Detail' },
    { id: 'documents', label: 'Documents' },
    { id: 'bids', label: 'Bids' },
    { id: 'participants', label: 'Participants' },
];

const Info = ({ label, value }) => (
    <div>
        <p className="text-xs text-slate-500 mb-1">
            {label}
        </p>
        <p className="font-semibold text-[#0B1E3D] text-[13px] wrap-break-word">
            {value || "--"}
        </p>
    </div>
);

const Tag = ({ children }) => {
    return (
        <span className="px-3 py-1 rounded-md bg-slate-100 text-xs font-medium text-slate-700">
            {children}
        </span>
    );
};

function LiveAuctionsDetail({ auction, setCurrentPage }) {

    const [activeTab, setActiveTab] = useState('auction-overview');
    const { data: auctionDetail, isLoading, isError } = useGetAuctionDetail(auction._id);

    const vehicle = auctionDetail?.data?.vehicle;

    const { days, hours, mins, secs } = UseCountDown(vehicle?.auctionEndDateTime);

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
                pageTitle="Live Auction Details"
                parentLabel="Live Auctions"
                parentPage="live-auctions"
                currentLabel="Live Auction Detail"
                backButtonTarget="all-auctions"
            />

            {/* Live Auction Info Bar */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                    {/* Left Gallery */}
                    <div className="h-100">
                        <AuctionsGallery
                            images={vehicle.images?.map((image) => image.url) || []}
                            status="live"
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

                        {/* Details */}
                        <div className="grid grid-cols-3 gap-x-8 gap-y-4 mb-6">
                            <Info label="VIN" value={formatLabel(vehicle.vin)} />
                            <Info label="Auction ID" value={formatLabel(vehicle.listingId)} />
                            <Info label="Category" value={formatLabel(vehicle.vehicleType)} />
                            <Info label="Auction Type" value={formatLabel(vehicle.auctionType)} />
                            <Info label="Mileage" value={formatLabel(vehicle.mileage)} />
                            <Info label="Current Bid" value={formatPrice(vehicle.currentBid)} />
                            <Info label="Location" value={formatLabel(`${vehicle.city}, ${vehicle.emirate}`)} />
                            <Info label="Reserve Price" value={formatPrice(vehicle.reservePrice)} />
                        </div>

                        {/* Countdown */}
                        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">

                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-[14px] font-semibold text-[#0B1E3D]">
                                    Auction End In
                                </h3>

                                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-semibold">
                                    {formatLabel(vehicle?.auctionStatus)}
                                </span>
                            </div>

                            <div className="flex justify-center gap-3">

                                {[
                                    { value: String(days).padStart(2, "0"), label: "Days" },
                                    { value: String(hours).padStart(2, "0"), label: "Hours" },
                                    { value: String(mins).padStart(2, "0"), label: "Mins" },
                                    { value: String(secs).padStart(2, "0"), label: "Secs" },
                                ].map((item) => (
                                    <div
                                        key={item.label}
                                        className="text-center"
                                    >

                                        <div className="w-13 h-13 rounded-xl border border-slate-200 bg-white shadow-sm flex items-center justify-center">
                                            <span className="text-[17px] font-bold text-red-600">
                                                {item.value}
                                            </span>
                                        </div>

                                        <p className="mt-2 text-[10px] font-semibold text-slate-500 uppercase">
                                            {item.label}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-5 pt-4 border-t border-slate-200 text-center">
                                <p className="text-sm font-semibold text-[#0B1E3D]">
                                    Ends at{" "}
                                    {vehicle.auctionEndDateTime
                                        ? new Date(vehicle.auctionEndDateTime).toLocaleTimeString("en-US", {
                                            timeZone: "Asia/Dubai",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: true,
                                        })
                                        : "---"}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                    {vehicle.auctionEndDateTime
                                        ? new Date(vehicle.auctionEndDateTime).toLocaleDateString("en-GB", {
                                            timeZone: "Asia/Dubai",
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        })
                                        : "---"}
                                </p>
                            </div>

                            {/* Buttons */}
                            <div className="grid grid-cols-2 gap-3 mt-5">
                                <button className="h-11 rounded-xl border border-slate-200 flex items-center justify-center gap-2 text-sm font-medium hover:bg-white transition">
                                    <Share2 size={16} />
                                    Share
                                </button>

                                <button className="h-11 rounded-xl bg-[#0B1E3D] text-white flex items-center justify-center gap-2 text-sm font-medium hover:bg-[#132d59] transition">
                                    <XCircle size={16} />
                                    Cancel
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

        </div>
    )
}

export default LiveAuctionsDetail;
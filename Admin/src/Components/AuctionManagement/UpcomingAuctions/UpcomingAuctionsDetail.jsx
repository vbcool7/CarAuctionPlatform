
import React, { useState } from 'react';
import AuctionsDetailHeader from '../Shared/AuctionsDetailHeader';
import AuctionsGallery from '../Shared/AuctionsGallery';
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
import { useGetAuctionDetail } from '../../../hooks/useAuction';
import { formatLabel, formatPrice } from '../../utils/formatter';
import { UseCountDown } from '../../SharedComponents/UseCountDown';
import ContactSupport from '../../SharedComponents/ContactSupport';

// tabs
const tabs = [
    { id: 'auction-overview', label: 'Auction Overview' },
    { id: 'vehicles-detail', label: 'Vehicles Detail' },
    { id: 'documents', label: 'Documents' },
];

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

function UpcomingAuctionsDetail({ setCurrentPage, auction }) {

    const [activeTab, setActiveTab] = useState('auction-overview');
    const { data: auctionDetail, isLoading, isError } = useGetAuctionDetail(auction._id);

    const vehicle = auctionDetail?.data?.vehicle;

    const { days, hours, mins, secs } = UseCountDown(vehicle?.auctionStartDateTime);

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
                pageTitle="Upcoming Auction Details"
                parentLabel="Upcoming Auctions"
                parentPage="upcoming-auctions"
                currentLabel="Upcoming Auction Detail"
                backButtonTarget="all-auctions"
            />

            {/* upcoming info bar */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 ">

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

                        {/* auction time */}
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-[14px] font-semibold text-[#0B1E3D]">
                                    Auction Starts In
                                </h3>

                                <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-[11px] font-semibold">
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
                                    Start at{" "}
                                    {vehicle.auctionStartDateTime
                                        ? new Date(vehicle.auctionStartDateTime).toLocaleTimeString("en-US", {
                                            timeZone: "Asia/Dubai",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: true,
                                        })
                                        : "---"}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                    {vehicle.auctionStartDateTime
                                        ? new Date(vehicle.auctionStartDateTime).toLocaleDateString("en-GB", {
                                            timeZone: "Asia/Dubai",
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        })
                                        : "---"}
                                </p>
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

                    <AuctionsDetailTimeline vehicle={vehicle} />
                </div>

                {/* left side - section */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">
                    {activeTab === 'auction-overview' && <OverviewSidebar vehicle={vehicle} bids={bids} participants={participants} setCurrentPage={setCurrentPage} />}
                    {activeTab === 'vehicles-detail' && <ContactSupport />}
                    {activeTab === 'documents' && <DocumentSidebar vehicle={vehicle} />}
                </div>

            </div>
        </div>
    )
}

export default UpcomingAuctionsDetail;
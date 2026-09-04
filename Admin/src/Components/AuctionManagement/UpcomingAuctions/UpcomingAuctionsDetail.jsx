
import React, { useState } from 'react';
import { Share2, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import AuctionsDetailHeader from '../Shared/AuctionsDetailHeader';
import AuctionsGallery from '../Shared/AuctionsGallery';
import AuctionsDetailTimeline from '../Shared/AuctionsDetailTimeline';
import OverviewSidebar from '../Shared/OverviewSidebar';
import DocumentSidebar from '../Shared/DocumentSidebar';
import AuctionsOverviewTab from '../Shared/AuctionsOverviewTab';
import AuctionsVehicleDetailTab from '../Shared/AuctionsVehicleDetailTab';
import AuctionsDocumentsTab from '../Shared/AuctionsDocumentsTab';
import ContactSupport from '../../SharedComponents/ContactSupport';
import CancelAuctionModal from '../Shared/CancelAuctionModal';

import { useCancelAuction, useGetAuctionDetail } from '../../../hooks/useAuction';
import { formatLabel } from '../../utils/formatter';
import { UseCountDown } from '../../SharedComponents/UseCountDown';

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
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const [cancelError, setCancelError] = useState("");

    const { data: auctionDetail, isLoading, isError } = useGetAuctionDetail(auction._id);
    const { mutate: cancelAuction, isPending: isUpdating } = useCancelAuction();

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

                            {/* Buttons */}
                            <div className="grid grid-cols-2 gap-3 mt-5">
                                <button
                                    className="h-11 rounded-xl border border-slate-200 flex items-center justify-center gap-2 text-sm text-white font-medium bg-[#D97706] hover:bg-[#D97706]/90 active:bg-[#B45309] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D97706]/40 transition-all duration-150" >
                                    <Share2 size={16} />
                                    Share
                                </button>

                                <button
                                    onClick={() => {
                                        setCancelReason("");
                                        setCancelError("");
                                        setIsCancelModalOpen(true);
                                    }}
                                    className="h-11 rounded-xl bg-[#0B1E3D] text-white flex items-center justify-center gap-2 text-sm font-medium hover:bg-[#132d59] active:bg-[#08162d] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B1E3D]/40 transition-all duration-150">
                                    <XCircle size={16} />
                                    Cancel Auction
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

                    <AuctionsDetailTimeline vehicle={vehicle} />
                </div>

                {/* left side - section */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">
                    {activeTab === 'auction-overview' && <OverviewSidebar vehicle={vehicle} bids={bids} participants={participants} setCurrentPage={setCurrentPage} />}
                    {activeTab === 'vehicles-detail' && <ContactSupport />}
                    {activeTab === 'documents' && <DocumentSidebar vehicle={vehicle} />}
                </div>

            </div>

            {/* auction cancel modal */}
            <CancelAuctionModal
                isOpen={isCancelModalOpen}
                onClose={() => {
                    if (isUpdating) return;
                    setIsCancelModalOpen(false);
                    setCancelReason("");
                    setCancelError("");
                }}
                onConfirm={() => {
                    setCancelError("");
                    cancelAuction(
                        { id: vehicle._id, reason: cancelReason },
                        {
                            onSuccess: (data) => {
                                setIsCancelModalOpen(false);
                                setCancelReason("");
                                toast.success(data?.message || "Auction canceled successfully");
                                setCurrentPage('upcoming-auctions')
                            },
                            onError: (err) => {
                                const msg = err?.response?.data?.message || "Failed to cancel auction. Please try again.";
                                setCancelError(msg);
                                toast.error(msg);
                            },
                        }
                    );
                }}
                vehicle={vehicle}
                reason={cancelReason}
                setReason={setCancelReason}
                loading={isUpdating}
                error={cancelError}
            />
        </div>
    )
}

export default UpcomingAuctionsDetail;
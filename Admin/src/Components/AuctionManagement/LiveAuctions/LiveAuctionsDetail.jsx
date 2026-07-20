
import React, { useState } from 'react'
import LiveAuctionsDetailHeader from '../Shared/AuctionsDetailHeader';
import LiveAuctionOverviewTab from './LiveAuctionOverviewTab';
import LiveAuctionVehiclDetailTab from './LiveAuctionVehiclDetailTab';
import LiveAuctionsDocumentsTab from './LiveAuctionsDocumentsTab';
import LiveAuctionsDetailInfoBar from './LiveAuctionsDetailInfoBar';
import LiveAuctionsParticipantsTab from './LiveAuctionsParticipantsTab';
import LiveAuctionsBidsTab from './LiveAuctionsBidsTab';
import AuctionsDetailTimeline from '../Shared/AuctionsDetailTimeline';
import OverviewSidebar from '../Shared/OverviewSidebar';
import DocumentSidebar from '../Shared/DocumentSidebar';
import BidsSidebar from '../Shared/BidsSidebar';
import ParticipantSidebar from '../Shared/ParticipantSidebar';
import VehicleDetailSidebar from '../Shared/VehicleDetailSidebar';

function LiveAuctionsDetail({ auction, setCurrentPage }) {

    const tagColors = {
        blue: "bg-blue-50 text-blue-600",
        slate: "bg-slate-100 text-slate-600",
        orange: "bg-orange-50 text-orange-600",
        red: "bg-red-50 text-red-600",
    };

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
            <LiveAuctionsDetailHeader
                setCurrentPage={setCurrentPage}
                pageTitle="Live Auction Details"
                parentLabel="Live Auctions"
                parentPage="live-auctions"
                currentLabel="Live Auction Detail"
                backButtonTarget="all-auctions"
            />

            {/* AuctionInfoBar */}
            <LiveAuctionsDetailInfoBar auction={auction} />

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
                    {activeTab === 'auction-overview' && <LiveAuctionOverviewTab auction={auction} />}
                    {activeTab === 'vehicles-detail' && <LiveAuctionVehiclDetailTab auction={auction} />}
                    {activeTab === 'documents' && <LiveAuctionsDocumentsTab auction={auction} />}
                    {activeTab === 'participants' && <LiveAuctionsParticipantsTab auction={auction} />}
                    {activeTab === 'bids' && <LiveAuctionsBidsTab auction={auction} />}

                    {/* timeline */}
                    <AuctionsDetailTimeline steps={auction.timeline} />
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

export default LiveAuctionsDetail;
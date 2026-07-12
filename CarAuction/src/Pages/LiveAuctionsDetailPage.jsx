
import React from 'react';
import { vehicles } from '../Components/Data';
import { useParams } from 'react-router-dom';
import Breadcrumbs from '../Components/Breadcrumbs';
import LiveBidsPanel from '../Components/LiveBidsPanel';
import LiveBiddingControlPanel from '../Components/LiveBiddingControlPanel';
import LiveAuctionDetailHeader from '../Components/LiveAuctionDetailHeader';
import AuctionFeaturesBar from '../Components/AuctionFeatureBar';
import LiveAuctionInfo from '../Components/LiveAuctionInfo';
import LiveAuctionProgressCard from '../Components/LiveAuctionProgressCard';
import LiveAuctionChat from '../Components/LiveAuctionChat';
import HomeLiveAuctions from '../Components/HomeLiveAuctions';
import LiveAuctionGallery from '../Components/LiveAuctionGallery';

import OverviewTab from '../Components/OverviewTab';
import VehiclInfoTab from '../Components/VehicleInfoTab';
import InspectionTab from '../Components/InspectionTab';
import ConditionTab from '../Components/ConditionTab';
import DetailTabs from '../Components/DetailTabs';
import BiddingHistoryTab from '../Components/BiddingHistoryTab';
import DocumentsTab from '../Components/DocumentsTab';
import ShippingPaymentsTab from '../Components/ShippingPaymentsTab';
import AuctionBottomFeaturesBar from '../Components/AuctionBottomFeaturesBar';

function LiveAuctionsDetailPage() {

    const { id } = useParams();

    const vehicle = vehicles.find((v) => v.id === parseInt(id));

    const breadcrumbItems = [
        { label: 'Home', path: '/' },
        { label: 'Live Auctions', path: '/live-auctions' },
        { label: vehicle?.name || 'Vehicle Detail' }
    ];

    const liveAuctionTabs = [
        {
            key: "overview",
            label: "Overview",
            content: <OverviewTab vehicle={vehicle} />,
        },
        {
            key: "specifications",
            label: "Specifications",
            content: <VehiclInfoTab vehicle={vehicle} />, // reuse
        },
        {
            key: "inspection",
            label: "Inspection Report",
            content: <InspectionTab vehicle={vehicle} />, // reuse
        },
        {
            key: "condition",
            label: "Condition Report",
            content: <ConditionTab vehicle={vehicle} />, // reuse
        },
        {
            key: "bidding",
            label: "Bidding History",
            content: <BiddingHistoryTab vehicle={vehicle} />,
        },
        {
            key: "documents",
            label: "Documents",
            content: <DocumentsTab vehicle={vehicle} />,
        },
        {
            key: "shipping",
            label: "Shipping & Payments",
            content: <ShippingPaymentsTab vehicle={vehicle} />,
        },
    ];

    if (!vehicle) {
        return <div className="p-10 text-center">Vehicle not found!</div>;
    }

    return (
        <section className='w-full'>

            {/* ========= breadcrumb ========= */}
            <div className='max-w-6xl mx-auto px-4 sm:px-5 lg:px-6 '>
                <Breadcrumbs items={breadcrumbItems} />
            </div>

            <div className='max-w-6xl mx-auto px-4 sm:px-5 lg:px-6'>

                {/* ========= header ========= */}
                <LiveAuctionDetailHeader vehicle={vehicle} />

                {/* ======== top- content grid ======== */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-6">

                    {/* Gallery — col 1 */}
                    <div className="lg:col-span-5 flex flex-col">
                        <LiveAuctionGallery images={vehicle.images} status={vehicle.status} />
                    </div>

                    {/* Bidding Controls — col 2 */}
                    <div className="lg:col-span-4 flex flex-col">
                        <LiveBiddingControlPanel vehicle={vehicle} />
                    </div>

                    {/* Bids Activity — col 3 */}
                    <div className="lg:col-span-3">
                        <LiveBidsPanel vehicleId={vehicle.id} />
                    </div>

                </div>

                {/* ======== feature bar ======== */}
                <AuctionFeaturesBar vehicle={vehicle} />

                {/* ======== middle section ======== */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <LiveAuctionInfo vehicle={vehicle} />
                    <LiveAuctionProgressCard vehicle={vehicle} />
                    <LiveAuctionChat initialMessages={[
                        { user: "Ali Hassan", text: "This is a great car! 🔥" },
                        { user: "AutoBid Assistant", text: "The engine is in excellent condition." }
                    ]} />
                </div>

                {/* ======== tabs ======== */}
                <div className="mt-10">
                    <DetailTabs
                        tabs={liveAuctionTabs}
                        defaultTab="overview"
                    />
                </div>

                {/* ======= smiliar live auction ======= */}
                <HomeLiveAuctions />

            </div>

            {/* ======= bottom - features ======= */}
            <AuctionBottomFeaturesBar />
        </section>
    )
}

export default LiveAuctionsDetailPage;
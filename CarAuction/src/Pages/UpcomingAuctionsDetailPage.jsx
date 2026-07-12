
import React from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumbs from '../Components/Breadcrumbs';
import { vehicles } from '../Components/Data';
import UpcomingAuctionDetailHeader from '../Components/UpcomingAuctionDetailHeader';
import VehicleGallery from '../Components/VehicleGallery';
import UpcomingBiddingControlPanel from '../Components/UpcomingBiddingControlPanel';
import AuctionFeaturesBar from '../Components/AuctionFeatureBar';

import DetailTabs from '../Components/DetailTabs';
import OverviewTab from '../Components/OverviewTab';
import VehiclInfoTab from '../Components/VehicleInfoTab';
import InspectionTab from '../Components/InspectionTab';
import ConditionTab from '../Components/ConditionTab';
import BiddingHistoryTab from '../Components/BiddingHistoryTab';
import DocumentsTab from '../Components/DocumentsTab';
import ShippingPaymentsTab from '../Components/ShippingPaymentsTab';
import AuctionBottomFeaturesBar from '../Components/AuctionBottomFeaturesBar';
import AuctionDetailsTab from '../Components/AuctionDetailsTab';
import LocationTab from '../Components/LocationTab';
import MarketValueInsights from '../Components/MarketValueInsights';
import SellerInfo from '../Components/SellerInfo';
import UpcomingMarketValueInsights from '../Components/UpcomingMarketValueInsights';
import AuctionProcess from '../Components/AuctionProcess';
import UpcomingSimilarAuctions from '../Components/UpcomingSimilarAuctions';

function UpcomingAuctionsDetailPage() {

    const { id } = useParams();

    const vehicle = vehicles.find((v) => v.id === parseInt(id));

    const breadcrumbItems = [
        { label: 'Home', path: '/' },
        { label: 'Upcoming Auctions', path: '/upcoming-auctions' },
        { label: vehicle?.name || 'Vehicle Detail' }
    ];

    const upcomingAuctionTabs = [
        {
            key: "overview",
            label: "Overview",
            content: <OverviewTab vehicle={vehicle} />,
        },
        {
            key: "specifications",
            label: "Specifications",
            content: <VehiclInfoTab vehicle={vehicle} />,
        },
        {
            key: "inspection",
            label: "Inspection Report",
            content: <InspectionTab vehicle={vehicle} />,
        },
        {
            key: "condition",
            label: "Condition Report",
            content: <ConditionTab vehicle={vehicle} />,
        },
        {
            key: "bidding",
            label: "Auction Detail",
            content: <AuctionDetailsTab vehicle={vehicle} />,
        },
        {
            key: "documents",
            label: "Documents",
            content: <DocumentsTab vehicle={vehicle} />,
        },
        {
            key: "shipping",
            label: "Location",
            content: <LocationTab vehicle={vehicle} />,
        },
    ];

    if (!vehicle) {
        return <div className="p-10 text-center">Vehicle not found!</div>;
    }

    return (
        <section className='w-full'>

            {/* ========= breadcrumb ========= */}
            <div className='max-w-6xl mx-auto px-4 sm:px-5 lg:px-6'>
                <Breadcrumbs items={breadcrumbItems} />
            </div>

            <div className='max-w-6xl mx-auto px-4 sm:px-5 lg:px-6'>

                {/* ========= header ========= */}
                < UpcomingAuctionDetailHeader vehicle={vehicle} />

                {/* ======== top-content grid ======== */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">

                    <div className="lg:col-span-7 flex flex-col">
                        <VehicleGallery images={vehicle.images} status={vehicle.status} />
                    </div>

                    <div className="lg:col-span-5 flex flex-col lg:sticky lg:top-6 self-start">
                        <UpcomingBiddingControlPanel vehicle={vehicle} />
                    </div>

                </div>

                {/* ======== feature bar ======== */}
                <AuctionFeaturesBar vehicle={vehicle} />

                {/* ======== tabs ======== */}
                <div className="mt-10">
                    <DetailTabs
                        tabs={upcomingAuctionTabs}
                        defaultTab="overview"
                    />
                </div>

                {/* ======== seller info ======== */}
                <div className="flex flex-col md:flex-row gap-8 mt-10">

                    <div className="w-full md:w-2/3">
                        <UpcomingMarketValueInsights />
                    </div>

                    <div className="w-full md:w-1/3">
                        <SellerInfo />
                    </div>
                </div>

                {/* ======== auction process ======== */}
                <div className='mt-6'>
                    <AuctionProcess />
                </div>

                {/* ======== similar auctions ======== */}
                <div className='mt-6'>
                    <UpcomingSimilarAuctions />
                </div>

            </div>

        </section>
    )
}

export default UpcomingAuctionsDetailPage;
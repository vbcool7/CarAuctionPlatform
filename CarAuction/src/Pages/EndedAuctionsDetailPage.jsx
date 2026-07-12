
import React from 'react';
import { AlertCircle } from "lucide-react";
import { useParams } from 'react-router-dom';
import Breadcrumbs from '../Components/Breadcrumbs';
import { vehicles } from '../Components/Data';
import EndedAuctionDetailHeader from '../Components/EndedAuctionDetailHeader';
import EndedAuctionGallery from '../Components/EndedAuctionGallery';
import EndedBiddingControlPanel from '../Components/EndedBiddingControlPanel';
import EndedAuctionInfoPanel from '../Components/EndedAuctionInfoPanel';
import AuctionFeaturesBar from '../Components/AuctionFeatureBar';
import EndedNotSoldFeatureBar from '../Components/EndedNotSoldFeatureBar';
import SellerInfo from '../Components/SellerInfo';
import HomeRecentlySold from '../Components/HomeRecentlySold';

import OverviewTab from '../Components/OverviewTab';
import VehiclInfoTab from '../Components/VehicleInfoTab';
import InspectionTab from '../Components/InspectionTab';
import ConditionTab from '../Components/ConditionTab';
import DetailTabs from '../Components/DetailTabs';
import BiddingHistoryTab from '../Components/BiddingHistoryTab';
import DocumentsTab from '../Components/DocumentsTab';
import ShippingPaymentsTab from '../Components/ShippingPaymentsTab';
import LocationTab from '../Components/LocationTab';
import EndedSoldMarketInsights from '../Components/EndedSoldMarketInsights';
import EndedSoldBidProgress from '../Components/EndedSoldBidProgress';
import AuctionBottomFeaturesBar from '../Components/AuctionBottomFeaturesBar';
import EndedUnsoldAnalytics from '../Components/EndedUnsoldAnalytics';
import EndedUnsoldMarketInsights from '../Components/EndedUnsoldMarketInsights';
import EndedUnsoldNotify from '../Components/EndedUnsoldNotify';

function EndedAuctionsDetailPage() {

    const { id } = useParams();

    const vehicle = vehicles.find((v) => v.id === parseInt(id));
    const isSold = vehicle.status === "sold";

    const breadcrumbItems = [
        { label: 'Home', path: '/' },
        { label: 'Ended Auctions', path: '/ended-auctions' },
        { label: vehicle?.name || 'Vehicle Detail' }
    ];

    const soldAuctionTabs = [
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
            key: "location",
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
            <div className='max-w-6xl mx-auto px-4 sm:px-5 lg:px-6 '>
                <Breadcrumbs items={breadcrumbItems} />
            </div>

            <div className='max-w-6xl mx-auto px-4 sm:px-5 lg:px-6'>

                {/* ========= header ========= */}
                < EndedAuctionDetailHeader vehicle={vehicle} />

                {/* ======== content grid ======== */}
                {!isSold && (
                    <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg px-4 py-3 mt-4">
                        <div className="flex items-center gap-2 text-red-600 text-sm font-medium">
                            <AlertCircle size={16} />
                            Auction Ended on {vehicle.endedDate} — {vehicle.endedTime}
                        </div>
                        <span className="text-red-600 text-sm font-medium">Reason: Reserve Price Not Met</span>
                    </div>
                )}

                <div className={`grid grid-cols-1 gap-5 mt-6 items-stretch ${isSold ? 'lg:grid-cols-12' : 'lg:grid-cols-9'
                    }`}>

                    {/* Gallery */}
                    <div className={`${isSold ? 'lg:col-span-5' : 'lg:col-span-5'} flex flex-col h-full`}>
                        <EndedAuctionGallery vehicle={vehicle} images={vehicle.images} status={vehicle.status} />
                    </div>

                    {/* Bid Panel  */}
                    <div className={`${isSold ? 'lg:col-span-4' : 'lg:col-span-4'} flex flex-col`}>
                        <EndedBiddingControlPanel vehicle={vehicle} />
                    </div>

                    {isSold && (
                        <div className="lg:col-span-3 flex flex-col">
                            <EndedAuctionInfoPanel vehicle={vehicle} />
                        </div>
                    )}

                </div>

                {/* ======== featurebar ======== */}
                {isSold && (
                    <div>
                        <AuctionFeaturesBar vehicle={vehicle} />
                    </div>
                )}
                {!isSold && (
                    <div>
                        <EndedNotSoldFeatureBar vehicle={vehicle} />
                    </div>
                )}

                {/* ======== tabs - sold/unsold ======== */}
                {isSold && (
                    <div className="mt-10">
                        <DetailTabs
                            tabs={soldAuctionTabs}
                            defaultTab="overview"
                        />
                    </div>
                )}

                {/* ======== sold ======== */}
                {isSold && (
                    <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="w-full">
                            <EndedSoldMarketInsights />
                        </div>
                        <div className="w-full">
                            <EndedSoldBidProgress />
                        </div>
                        <div className="w-full">
                            <SellerInfo />
                        </div>
                    </div>
                )}

                {/* ======== unsold ======== */}
                {!isSold && (
                    <div className="mt-10 grid grid-cols-1 xl:grid-cols-11 gap-6 items-stretch">

                        <div className="xl:col-span-5 h-full">
                            <EndedUnsoldAnalytics />
                        </div>

                        <div className="xl:col-span-3 h-full">
                            <EndedUnsoldMarketInsights />
                        </div>

                        <div className="xl:col-span-3 h-full">
                            <SellerInfo />
                        </div>

                    </div>
                )}

                {/* ======== unsold - notify ======== */}
                {!isSold && (
                    <div className='mt-10'>
                        <EndedUnsoldNotify />
                    </div>
                )}

                {/* ======== similar sold ======== */}
                <div className='mt-6'>
                    <HomeRecentlySold />
                </div>
            </div>

            {/* ======= bottom - features ======= */}
            <AuctionBottomFeaturesBar />
        </section>
    )
}

export default EndedAuctionsDetailPage;
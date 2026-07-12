
import React from 'react';
import { Heart, Share2 } from 'lucide-react';
import { vehicles } from '../../Data';
import BuyerVehicleGallery from '../BuyerSharedComponents/BuyerVehicleGallery';
import BuyerLostDetailVehicleInfo from './BuyerLostDetailVehicleInfo';
import BuyerLostAuctionsDetailSummaryCard from './BuyerLostAuctionsDetailSummaryCard';
import BuyerLostAuctionsDetailFeaturebar from './BuyerLostAuctionsDetailFeaturebar';
import BuyerLostAuctionsDetailBiddingSummary from './BuyerLostAuctionsDetailBiddingSummary';
import DetailTabs from '../../DetailTabs';
import OverviewTab from '../../OverviewTab';
import VehicleInfoTab from '../../VehicleInfoTab';
import InspectionTab from '../../InspectionTab';
import ConditionTab from '../../ConditionTab';
import ShippingPaymentsTab from '../../ShippingPaymentsTab';

function BuyerLostAuctionsDetail({ vehicleId, setCurrentPage }) {

    const vehicle = vehicles.find(item => item.id === vehicleId);

    const lostAuctionTabs = [
        {
            key: "overview",
            label: "Overview",
            content: <OverviewTab vehicle={vehicle} />,
        },
        {
            key: "specifications",
            label: "Specifications",
            content: <VehicleInfoTab vehicle={vehicle} />,
        },
        {
            key: "condition",
            label: "Condition Report",
            content: <ConditionTab vehicle={vehicle} />,
        },
        {
            key: "shipping",
            label: "Shipping & Payment",
            content: <ShippingPaymentsTab vehicle={vehicle} />,
        },
    ];

    return (
        <div>
            {/* Back button */}
            <button onClick={() => setCurrentPage("lost-auctions")}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-[#0B1E3D] mb-4">
                ← Back to Lost Auctions
            </button>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">

                {/* Left - Vehicle Name & Meta */}
                <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-2xl font-extrabold text-[#0B1E3D]">{vehicle?.name}</h1>
                        <div className="flex gap-2">
                            <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">
                                Lot # {vehicle?.id}
                            </span>
                            <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide animate-pulse">
                                Outbid
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 font-medium">
                        <span className="flex items-center gap-1">📍 {vehicle?.mileage || "NA"}</span>
                        <span className="text-slate-300">•</span>
                        <span>{vehicle?.transmission}</span>
                        <span className="text-slate-300">•</span>
                        <span>{vehicle?.fuelType}</span>
                        <span className="text-slate-300">•</span>
                        <span>{vehicle?.bodyStyle}</span>
                    </div>
                </div>

                {/* Right - Actions */}
                <div className="flex items-center gap-2 shrink-0">
                    <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:border-[#D97706] hover:text-[#D97706] transition-all">
                        <Heart size={16} /> Watchlist
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:border-[#D97706] hover:text-[#D97706] transition-all">
                        <Share2 size={16} /> Share
                    </button>
                </div>
            </div>

            {/* ======== top ======== */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* left */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <BuyerVehicleGallery vehicle={vehicle} />
                </div>

                {/* mid */}
                <div className="lg:col-span-5">
                    <BuyerLostDetailVehicleInfo vehicle={vehicle} />
                </div>

                {/* right */}
                <div className="lg:col-span-3">
                    <BuyerLostAuctionsDetailSummaryCard vehicle={vehicle} />
                </div>
            </div>

            {/* ======== feature bar ======== */}
            <div className='mt-6'>
                <BuyerLostAuctionsDetailFeaturebar vehicle={vehicle} />
            </div>

            {/* ======== mid ======== */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-8 pb-6">

                {/* left */}
                <div className="lg:col-span-9 flex flex-col gap-6">
                    <DetailTabs
                        tabs={lostAuctionTabs}
                        defaultTab="overview"
                    />
                </div>

                {/* right */}
                <div className="lg:col-span-3">
                    <BuyerLostAuctionsDetailBiddingSummary vehicle={vehicle} />
                </div>
            </div>
        </div>
    )
}

export default BuyerLostAuctionsDetail;
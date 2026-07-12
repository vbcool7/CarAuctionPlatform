
import React, { useEffect, useState } from 'react';
import { Radio, Star } from 'lucide-react';
import { vehicles } from '../../Data';
import BuyerLiveAuctionDetailBidPanel from './BuyerLiveAuctionDetailBidPanel';
import BuyerLiveAuctionDetailSpecs from './BuyerLiveAuctionDetailSpecs';
import BuyerLiveAuctionDetailBidActivity from './BuyerLiveAuctionDetailBidActivity';
import BuyerLiveAuctionDetailAuctionInfo from './BuyerLiveAuctionDetailAuctionInfo';
import BuyerLiveAuctionDetailNotice from './BuyerLiveAuctionDetailNotice';
import BuyerAuctionSellerCard from '../BuyerAuctionSellerCard';
import BuyerVehicleGallery from '../BuyerSharedComponents/BuyerVehicleGallery';

function BuyerLiveAuctionDetail({ setCurrentPage, vehicleId, setSelectedSellerId, setPreviousPage, openBidModal, previousPage }) {

    const vehicle = vehicles.find(v => v.id === vehicleId);

    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 14, seconds: 32 });

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                const totalSeconds =
                    prev.hours * 3600 + prev.minutes * 60 + prev.seconds - 1;
                if (totalSeconds <= 0) {
                    clearInterval(interval);
                    return { hours: 0, minutes: 0, seconds: 0 };
                }
                return {
                    hours: Math.floor(totalSeconds / 3600),
                    minutes: Math.floor((totalSeconds % 3600) / 60),
                    seconds: totalSeconds % 60,
                };
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    if (!vehicle) {
        return (
            <div className="p-8 text-center text-gray-500">Vehicle not found.</div>
        );
    }

    const pad = (n) => String(n).padStart(2, "0");

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <button
                        onClick={() => setCurrentPage("live-auctions")}
                        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#0B1E3D] mb-2 transition-colors"
                    >
                        ← Back to Live Auctions
                    </button>

                    <h1 className="text-2xl font-bold text-[#0B1E3D]">
                        {vehicle.year} {vehicle.make} {vehicle.model} {vehicle.transmission}
                    </h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Lot #{vehicle.id ?? "L-00421"} &middot; {vehicle.location ?? "Dubai, UAE"}
                    </p>
                </div>

                {/* Live badge + countdown */}
                <div className="flex items-center gap-3 shrink-0">
                    <span className="flex items-center gap-1.5 bg-red-50 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-full border border-red-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        LIVE
                    </span>
                    <div className="bg-[#D97706] text-white rounded-xl px-4 py-2 text-center min-w-27.5">
                        <p className="text-[10px] uppercase tracking-widest text-white mb-0.5">
                            Ends In
                        </p>
                        <p className="text-lg font-mono font-bold tracking-tight">
                            {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
                        </p>
                    </div>
                </div>
            </div>

            {/* 3-column grid */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                <div className="xl:col-span-5 space-y-6">
                    <BuyerVehicleGallery vehicle={vehicle} />
                    <BuyerLiveAuctionDetailSpecs vehicle={vehicle} />
                    <BuyerLiveAuctionDetailBidActivity vehicle={vehicle} />
                </div>

                {/* Middle — col-span-4 */}
                <div className="xl:col-span-4 xl:sticky xl:top-6 space-y-4">
                    <BuyerLiveAuctionDetailBidPanel 
                    vehicle={vehicle}
                    vehicleId={vehicleId}
                    openBidModal={openBidModal}
                    previousPage={previousPage} 
                    />
                </div>

                {/* Right — col-span-3 */}
                <div className="xl:col-span-3 xl:sticky xl:top-6 space-y-4">
                    <BuyerLiveAuctionDetailAuctionInfo vehicle={vehicle} />
                    <BuyerAuctionSellerCard
                        vehicle={vehicle}
                        setCurrentPage={setCurrentPage}
                        setSelectedSellerId={setSelectedSellerId}
                        setPreviousPage={setPreviousPage}
                        currentPageName="live-auctions-detail"
                    />
                    <BuyerLiveAuctionDetailNotice />
                </div>
            </div>
        </div>
    )
}

export default BuyerLiveAuctionDetail;

import React from 'react';
import { vehicles } from '../../Data';
import BuyerWonAuctionDetailHeader from './BuyerWonAuctionDetailHeader';
import BuyerWonAuctionDetailPanel from './BuyerWonAuctionsDetailPanel';
import BuyerWonAuctionDetailTabs from './BuyerWonAuctionDetailTabs';
import BuyerWonAuctionsDetailPenPayment from './BuyerWonAuctionsDetailPenPayment';
import BuyerWonAuctionsDetailInfo from './BuyerWonAuctionsDetailInfo';
import BuyerVehicleGallery from '../BuyerSharedComponents/BuyerVehicleGallery';

function BuyerWonAuctionsDetail({ vehicleId, setCurrentPage }) {

    const vehicle = vehicles.find(v => v.id === vehicleId);

    return (
        <div>
            <BuyerWonAuctionDetailHeader
                vehicle={vehicle}
                setCurrentPage={setCurrentPage} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* left */}
                <div className="lg:col-span-6 flex flex-col gap-6">
                    <BuyerVehicleGallery vehicle={vehicle} />
                </div>

                {/* right */}
                <div className="lg:col-span-6">
                    <BuyerWonAuctionDetailPanel vehicle={vehicle} />
                </div>
            </div>

            <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* left */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    {vehicle.wonStatus === 'payment-pending' &&(
                        <BuyerWonAuctionsDetailPenPayment vehicle={vehicle}/>
                    )}

                    <BuyerWonAuctionDetailTabs vehicle={vehicle} />
                </div>

                {/* right */}
                <div className="lg:col-span-4">
                    <BuyerWonAuctionsDetailInfo vehicle={vehicle} />
                </div>
            </div>
        </div>
    )
}

export default BuyerWonAuctionsDetail;
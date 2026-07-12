
import React from 'react';
import { vehicles } from '../../Data';
import BuyerMyOffersDetailHeader from './BuyerMyOffersDetailHeader';
import BuyerMyOffersDetailVehicleInfo from './BuyerMyOffersDetailVehicleInfo';
import BuyerMyOffersDetailSummaryCard from './BuyerMyOffersDetailSummaryCard';
import BuyerMyOffersDetailOfferInfo from './BuyerMyOffersDetailOfferInfo';
import BuyerMyOffersDetailSideInfo from './BuyerMyOffersDetailSideInfo';
import BuyerVehicleGallery from '../BuyerSharedComponents/BuyerVehicleGallery'

function BuyerMyOffersDetail({ vehicleId, setCurrentPage }) {

    const vehicle = vehicles.find(v => v.id === vehicleId);

    return (
        <div>
            <BuyerMyOffersDetailHeader
                vehicle={vehicle}
                setCurrentPage={setCurrentPage}
            />
        
            {/* ======== top ======== */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* left */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <BuyerVehicleGallery vehicle={vehicle} />
                </div>

                {/* right */}
                <div className="lg:col-span-5">
                    <BuyerMyOffersDetailVehicleInfo vehicle={vehicle} />
                </div>

                 <div className="lg:col-span-3">
                    <BuyerMyOffersDetailSummaryCard vehicle={vehicle} />
                </div>
            </div>
            
            {/* ======== mid ======== */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-8">

                {/* left */}
                <div className="lg:col-span-9 flex flex-col gap-6">
                    <BuyerMyOffersDetailOfferInfo vehicle={vehicle} />
                </div>

                {/* right */}
                <div className="lg:col-span-3">
                    <BuyerMyOffersDetailSideInfo vehicle={vehicle} />
                </div>
            </div>
        </div>
    )
}

export default BuyerMyOffersDetail;
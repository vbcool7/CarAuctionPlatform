
import React from 'react';
import { vehicles } from '../../Data';
import BuyerPaymentsDetailHeader from './BuyerPaymentsDetailHeader';
import BuyerVehicleGallery from '../BuyerSharedComponents/BuyerVehicleGallery';
import BuyerMyOffersDetailVehicleInfo from '../BuyerMyOffers/BuyerMyOffersDetailVehicleInfo';
import BuyerPaymentsDetailSummaryCard from './BuyerPaymentsDetailSummaryCard';
import BuyerPaymentDetailPaymentInfo from './BuyerPaymentsDetailPaymentInfo';
import BuyerPaymentDetailRefundPaymentInfo from './BuyerPaymentDetailRefundPaymentInfo';
import BuyerPaymentsDetailSideInfo from './BuyerPaymentsDetailSideInfo';

function BuyerPaymentsDetail({ vehicleId, setCurrentPage, setSelectedSellerId, setPreviousPage }) {

    const vehicle = vehicles.find(v => v.id === vehicleId);

    const isPending = vehicle.paymentStatus === 'payment-pending';
    const isCompleted = vehicle.paymentStatus === 'payment-completed';
    const isRefunded = vehicle.paymentStatus === 'refunded';

    return (
        <div>
            <BuyerPaymentsDetailHeader
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
                    <BuyerPaymentsDetailSummaryCard vehicle={vehicle} />
                </div>
            </div>

            {/* ======== mid ======== */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-8">

                {/* left */}
                <div className="lg:col-span-9 flex flex-col gap-6">
                    {(isPending || isCompleted) && <BuyerPaymentDetailPaymentInfo vehicle={vehicle} />}
                    {isRefunded && <BuyerPaymentDetailRefundPaymentInfo vehicle={vehicle} />}
                </div>

                {/* right */}
                <div className="lg:col-span-3">
                    <BuyerPaymentsDetailSideInfo
                        vehicle={vehicle}
                        setCurrentPage={setCurrentPage}
                        setSelectedSellerId={setSelectedSellerId}
                        setPreviousPage={setPreviousPage}
                    />
                </div>
            </div>
        </div>
    )
}

export default BuyerPaymentsDetail;
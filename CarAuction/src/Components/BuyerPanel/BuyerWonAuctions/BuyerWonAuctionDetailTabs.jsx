
import React from 'react';
import VehicleInfoTab from '../../VehicleInfoTab';
import AuctionDetailsTab from '../../AuctionDetailsTab';
import DocumentsTab from '../../DocumentsTab';
import DetailTabs from '../../DetailTabs';
import ConditionTab from '../../ConditionTab';

function BuyerWonAuctionDetailTabs({ vehicle }) {

    const { wonStatus } = vehicle;

    const isPending = vehicle.wonStatus === "payment-pending";
    const isCompleted = vehicle.wonStatus === "payment-completed";
    const isPickup = vehicle.wonStatus === "ready-for-pickup";

    const pendingTabs = [
        { key: "vehicle-details", label: "Vehicle Details", content: <VehicleInfoTab vehicle={vehicle} /> },
        { key: "invoices", label: "Invoices", content: <div /> },
        { key: "documents", label: "Documents", content: <DocumentsTab vehicle={vehicle} /> },
        { key: "activity-timeline", label: "Activity Timeline", content: <div /> },
    ];

    const completedTabs = [
        { key: "specifications", label: "Vehicle Details", content: <VehicleInfoTab vehicle={vehicle} /> },
        { key: "auction-info", label: "Auction Info", content: <AuctionDetailsTab vehicle={vehicle} /> },
        { key: "invoices", label: "Invoices", content: <div /> },
        { key: "documents", label: "Documents", content: <DocumentsTab vehicle={vehicle} /> },
        { key: "activity-timeline", label: "Activity Timeline", content: <div /> },
    ];

    const pickupTabs = [
        { key: "pickup-info", label: "Pickup Information", content: <div /> },
        { key: "vehicle-details", label: "Vehicle Details", content: <VehicleInfoTab vehicle={vehicle} /> },
        { key: "documents", label: "Documents", content: <DocumentsTab vehicle={vehicle} /> },
        { key: "activity-timeline", label: "Activity Timeline", content: <div /> },
    ];

    const tabMap = {
        "payment-pending": { tabs: pendingTabs, defaultTab: "vehicle-details" },
        "payment-completed": { tabs: completedTabs, defaultTab: "specifications" },
        "ready-for-pickup": { tabs: pickupTabs, defaultTab: "pickup-info" },
    };

    const config = tabMap[wonStatus];
    if (!config) return null;

    return (
        <>
            <DetailTabs
                tabs={config.tabs}
                defaultTab={config.defaultTab}
            />

            {(isCompleted || isPickup) && (
                <div className='bg-white border border-slate-100 rounded-2xl p-6 shadow-sm mb-6'>
                    <ConditionTab vehicle={vehicle} />
                </div>
            )}

        </>
    );
}

export default BuyerWonAuctionDetailTabs;
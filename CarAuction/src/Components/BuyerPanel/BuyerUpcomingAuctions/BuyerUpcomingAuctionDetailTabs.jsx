
import React from 'react';
import DetailTabs from '../../DetailTabs';
import OverviewTab from '../../OverviewTab';
import VehicleInfoTab from '../../VehicleInfoTab';
import InspectionTab from '../../InspectionTab';
import ConditionTab from '../../ConditionTab';
import AuctionDetailsTab from '../../AuctionDetailsTab';
import DocumentsTab from '../../DocumentsTab';
import LocationTab from '../../LocationTab';

function BuyerUpcomingAuctionDetailTabs({ vehicle }) {

  const upcomingAuctionTabs = [
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
      key: "auction-details",
      label: "Auction Details",
      content: <AuctionDetailsTab vehicle={vehicle} />,
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

  return (
    <div className=''>
    <DetailTabs
      tabs={upcomingAuctionTabs}
      defaultTab="overview"
    />
    </div>
  );
}

export default BuyerUpcomingAuctionDetailTabs
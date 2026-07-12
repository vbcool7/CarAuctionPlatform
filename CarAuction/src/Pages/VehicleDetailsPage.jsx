
import { useParams } from "react-router-dom";
import { vehicles } from "../Components/Data";
import VehicleGallery from "../Components/VehicleGallery";
import VehicleAuctionPanel from "../Components/VehicleAuctionPanel";
import LiveBidsPanel from "../Components/LiveBidsPanel";
import SellerInfo from "../Components/SellerInfo";
import VehicleSimilar from "../Components/VehicleSimilar";
import MarketValueInsights from "../Components/MarketValueInsights";
import DetailTabs from "../Components/DetailTabs";
import VehicleInfoTab from "../Components/VehicleInfoTab";
import ConditionTab from "../Components/ConditionTab";
import InspectionTab from "../Components/InspectionTab";
import DamageReportTab from "../Components/DamageReportTab";
import MaintenanceTab from "../Components/MaintenanceTab";

function VehicleDetailsPage() {

    const { id } = useParams();

    const vehicle = vehicles.find((v) => v.id === parseInt(id));

    if (!vehicle) {
        return <div className="p-10 text-center">Vehicle not found!</div>;
    }

    const vehicleTabs = [
        {
            key: "rows",
            label: "Vehicle Info",
            content: <VehicleInfoTab vehicle={vehicle} />,
        },
        {
            key: "condition",
            label: "Condition",
            content: <ConditionTab vehicle={vehicle} />,
        },
        {
            key: "inspection",
            label: "Inspection",
            content: <InspectionTab vehicle={vehicle} />,
        },
        {
            key: "damage",
            label: "Damage Report",
            content: <DamageReportTab vehicle={vehicle} />,
        },
        {
            key: "maintenance",
            label: "Maintenance",
            content: <MaintenanceTab vehicle={vehicle} />,
        },
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-6 py-8 space-y-12">

            {/* SECTION 1: Top Grid */}
            <div className="flex flex-col md:flex-row gap-8">

                <div className="w-full md:w-2/3">
                    <VehicleGallery images={vehicle.images} video={vehicle.video} />
                </div>

                <div className="w-full md:w-1/3">
                    <VehicleAuctionPanel vehicle={vehicle} endTime={vehicle.endTime} />
                </div>
            </div>

            {/* SECTION 2: Details + live bid table */}
            <div className="flex flex-col md:flex-row gap-8">

                <div className="w-full md:w-2/3">
                    <DetailTabs
                        tabs={vehicleTabs}
                        defaultTab="rows" />
                </div>

                <div className="w-full md:w-1/3">
                    <LiveBidsPanel />
                </div>
            </div>

            {/* SECTION 3: Seller Info */}
            <div className="flex flex-col md:flex-row gap-8">

                <div className="w-full md:w-2/3">
                    <MarketValueInsights />
                </div>

                <div className="w-full md:w-1/3">
                    <SellerInfo />
                </div>
            </div>

            {/* SECTION 4: Similar */}
            <div className="w-full">
                <VehicleSimilar />
            </div>

        </div>

    );
}

export default VehicleDetailsPage;
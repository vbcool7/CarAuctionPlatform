import {
    Gavel,
    Timer,
    MapPin,
    User,
    Car,
    Building2,
    Activity,
    CircleDollarSign,
    Eye,
    Fuel,
    Gauge,
    Hash,
    Palette,
    FileText,
} from "lucide-react";

const formatValue = (value) => {
    if (value === null || value === undefined || value === "") {
        return "—";
    }

    return value;
};

const formatLabel = (value) => {
    if (!value) return "—";

    return value
        .replace(/_/g, " ")
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

const StatCard = ({ icon: Icon, label, value, highlight = false }) => (
    <div
        className={`rounded-2xl border p-4 transition-all ${
            highlight
                ? "border-[#D97706]/30 bg-[#D97706]/5"
                : "border-slate-200 bg-slate-50 hover:border-[#D97706]/30"
        }`}
    >
        <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#D97706]/10 flex items-center justify-center">
                <Icon size={18} className="text-[#D97706]" />
            </div>

            <span className="text-xs uppercase tracking-wider text-slate-500 font-medium">
                {label}
            </span>
        </div>

        <p
            className={`font-semibold text-base ${
                highlight ? "text-[#D97706]" : "text-slate-900"
            }`}
        >
            {value || "—"}
        </p>
    </div>
);

function OverviewTab({ vehicle }) {
    const currentBid =
        vehicle?.currentBid != null
            ? `AED ${vehicle.currentBid.toLocaleString()}`
            : "No bids yet";

    const price =
        vehicle?.priceType === "fixed_price"
            ? vehicle?.buyNowPrice != null
                ? `AED ${vehicle.buyNowPrice.toLocaleString()}`
                : "—"
            : vehicle?.startingBidPrice != null
                ? `AED ${vehicle.startingBidPrice.toLocaleString()}`
                : "—";

    return (
        <div className="space-y-7">

            {/* Vehicle Information */}
            <div>
                <h3 className="text-sm font-bold text-slate-900 mb-4">
                    Vehicle Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

                    <StatCard
                        icon={Hash}
                        label="Listing ID"
                        value={vehicle?.listingId}
                    />

                    <StatCard
                        icon={Car}
                        label="Make"
                        value={formatLabel(vehicle?.make)}
                    />

                    <StatCard
                        icon={Car}
                        label="Model"
                        value={formatLabel(vehicle?.model)}
                    />

                    <StatCard
                        icon={Car}
                        label="Year"
                        value={vehicle?.year}
                    />

                    <StatCard
                        icon={Car}
                        label="Trim"
                        value={formatLabel(vehicle?.trim)}
                    />

                    <StatCard
                        icon={Car}
                        label="Vehicle Type"
                        value={formatLabel(vehicle?.vehicleType)}
                    />

                    <StatCard
                        icon={Car}
                        label="Body Type"
                        value={formatLabel(vehicle?.bodyType)}
                    />

                    <StatCard
                        icon={Gauge}
                        label="Mileage"
                        value={
                            vehicle?.mileage != null
                                ? `${vehicle.mileage.toLocaleString()} km`
                                : "—"
                        }
                    />

                    <StatCard
                        icon={Car}
                        label="Transmission"
                        value={formatLabel(vehicle?.transmission)}
                    />

                    <StatCard
                        icon={Fuel}
                        label="Fuel Type"
                        value={formatLabel(vehicle?.fuelType)}
                    />

                    <StatCard
                        icon={Car}
                        label="Drivetrain"
                        value={formatLabel(vehicle?.drivetrain)}
                    />

                </div>
            </div>

            {/* Location & History */}
            <div>
                <h3 className="text-sm font-bold text-slate-900 mb-4">
                    Location & History
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

                    <StatCard
                        icon={MapPin}
                        label="Country"
                        value={formatLabel(vehicle?.country)}
                    />

                    <StatCard
                        icon={MapPin}
                        label="Emirate"
                        value={formatLabel(vehicle?.emirate)}
                    />

                    <StatCard
                        icon={MapPin}
                        label="City"
                        value={formatLabel(vehicle?.city)}
                    />

                    <StatCard
                        icon={MapPin}
                        label="ZIP Code"
                        value={vehicle?.zipCode}
                    />

                    <StatCard
                        icon={Hash}
                        label="VIN"
                        value={vehicle?.vin}
                    />

                    <StatCard
                        icon={FileText}
                        label="Title Status"
                        value={formatLabel(vehicle?.titleStatus)}
                    />

                    <StatCard
                        icon={Activity}
                        label="Accident History"
                        value={formatLabel(vehicle?.accidentHistory)}
                    />

                </div>
            </div>

            {/* Pricing & Auction */}
            <div>
                <h3 className="text-sm font-bold text-slate-900 mb-4">
                    Pricing & Auction
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

                    <StatCard
                        icon={CircleDollarSign}
                        label="Price Type"
                        value={formatLabel(vehicle?.priceType)}
                    />

                    <StatCard
                        icon={Gavel}
                        label="Auction Type"
                        value={formatLabel(vehicle?.auctionType)}
                    />

                    <StatCard
                        icon={CircleDollarSign}
                        label={
                            vehicle?.priceType === "fixed_price"
                                ? "Buy Now Price"
                                : "Starting Bid"
                        }
                        value={price}
                        highlight
                    />

                    {vehicle?.priceType === "reserve_price" && (
                        <>
                            <StatCard
                                icon={CircleDollarSign}
                                label="Reserve Price"
                                value={
                                    vehicle?.reservePrice != null
                                        ? `AED ${vehicle.reservePrice.toLocaleString()}`
                                        : "—"
                                }
                                highlight
                            />

                            <StatCard
                                icon={Gavel}
                                label="Current Bid"
                                value={currentBid}
                            />
                        </>
                    )}

                    <StatCard
                        icon={Eye}
                        label="Views"
                        value={vehicle?.views ?? 0}
                    />

                    <StatCard
                        icon={Timer}
                        label="Auction Duration"
                        value={
                            vehicle?.auctionDuration
                                ? `${vehicle.auctionDuration} days`
                                : "—"
                        }
                    />

                    <StatCard
                        icon={Activity}
                        label="Auction Status"
                        value={formatLabel(vehicle?.auctionStatus)}
                    />

                </div>
            </div>

            {/* Appearance */}
            <div>
                <h3 className="text-sm font-bold text-slate-900 mb-4">
                    Appearance
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <StatCard
                        icon={Palette}
                        label="Exterior Color"
                        value={formatLabel(vehicle?.exteriorColor)}
                    />

                    <StatCard
                        icon={Palette}
                        label="Interior Color"
                        value={formatLabel(vehicle?.interiorColor)}
                    />

                </div>
            </div>

            {/* Description */}
            {vehicle?.vehicleDescription && (
                <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-3">
                        Description
                    </h3>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm text-slate-600 leading-6">
                            {vehicle.vehicleDescription}
                        </p>
                    </div>
                </div>
            )}

        </div>
    );
}

export default OverviewTab;
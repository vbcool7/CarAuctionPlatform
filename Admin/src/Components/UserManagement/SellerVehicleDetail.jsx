import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Car, MapPin, Calendar, Gauge, Fuel, Settings2, Palette, FileText, Eye, KeyRound, CircleDollarSign, Gavel, Clock3, ShieldCheck, CheckCircle2, XCircle, AlertCircle, ExternalLink, Download } from "lucide-react";
import { useGetVehicleById } from "../../hooks/useVehicle";

// ------------------- helpers
const formatEnumValue = (value) => {
    if (!value) return "--";

    return value
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatDate = (value) => {
    if (!value) return "--";

    return new Date(value).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const formatDateTime = (value) => {
    if (!value) return "--";

    return new Date(value).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const formatPrice = (value) => {
    if (value === null || value === undefined || value === "") {
        return "--";
    }

    return `$${Number(value).toLocaleString()}`;
};

// -------------------- Reusable Components
function SectionCard({ title, icon: Icon, children }) {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
                {Icon && (
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                        <Icon size={17} />
                    </div>
                )}

                <h2 className="font-bold text-[#0B1E3D]">
                    {title}
                </h2>
            </div>

            <div className="p-5">
                {children}
            </div>
        </div>
    );
}

function DetailItem({ label, value }) {
    return (
        <div className="">
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">
                {label}
            </p>

            <p className="text-sm font-semibold text-slate-700">
                {value || "--"}
            </p>
        </div>
    );
}

function StatusBadge({ status, type = "default" }) {
    const normalizedStatus = status?.toLowerCase();

    let className = "bg-slate-100 text-slate-600";
    let Icon = AlertCircle;

    if (type === "admin") {
        if (normalizedStatus === "approved") {
            className = "bg-green-100 text-green-700";
            Icon = CheckCircle2;
        } else if (normalizedStatus === "rejected") {
            className = "bg-red-100 text-red-700";
            Icon = XCircle;
        } else if (normalizedStatus === "pending") {
            className = "bg-amber-100 text-amber-700";
            Icon = Clock3;
        }
    }

    if (type === "auction") {
        if (normalizedStatus === "live") {
            className = "bg-green-100 text-green-700";
            Icon = CheckCircle2;
        } else if (normalizedStatus === "sold") {
            className = "bg-blue-100 text-blue-700";
            Icon = CheckCircle2;
        } else if (normalizedStatus === "canceled") {
            className = "bg-red-100 text-red-700";
            Icon = XCircle;
        } else if (normalizedStatus === "upcoming") {
            className = "bg-amber-100 text-amber-700";
            Icon = Clock3;
        }
    }

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${className}`}
        >
            <Icon size={13} />
            {formatEnumValue(status)}
        </span>
    );
}

// ------------------------------ Main Component
function SellerVehicleDetail({ vehicleId, setCurrentPage }) {

    const { data: vehicleResponse, isLoading, isError, } = useGetVehicleById(vehicleId);
    const vehicle = vehicleResponse?.data;

    console.log(vehicle?.documents?.[0]?.url);

    if (isLoading) return <p className="p-10 text-center">Loading vehicle detail....</p>;
    if (isError) return <p className="p-10 text-center text-red-500">Failed to load vehicle detail</p>;

    const mainImage = vehicle.images?.[0]?.url || "/placeholder-car.jpg";

    return (
        <div className="space-y-6 pb-6">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                {/* header */}
                <div className="flex items-start gap-3">
                    <button
                        onClick={() => setCurrentPage('sellers')}
                        className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-amber-600 hover:border-amber-500 transition"
                    >
                        <ArrowLeft size={19} />
                    </button>

                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3D]">
                                {`${formatEnumValue(vehicle.make)} ${formatEnumValue(vehicle.model)}`}
                            </h1>

                            <span className="text-xs font-semibold px-2 py-1 rounded-md bg-slate-100 text-slate-600">
                                {vehicle.year}
                            </span>
                        </div>

                        <p className="text-sm text-slate-500 mt-1">
                            Listing ID:{" "}
                            <span className="font-semibold text-slate-700">
                                {vehicle.listingId || "--"}
                            </span>
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge
                        status={vehicle.adminStatus}
                        type="admin"
                    />

                    <StatusBadge
                        status={vehicle.auctionStatus}
                        type="auction"
                    />
                </div>
            </div>

            {/* gallery + summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-4">

                    <div className="rounded-xl overflow-hidden bg-slate-100 h-70 md:h-100">
                        <img
                            src={mainImage}
                            alt={`${vehicle.make || ""} ${vehicle.model || ""}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.currentTarget.src = "/placeholder-car.jpg";
                            }}
                        />
                    </div>

                    {vehicle.images?.length > 1 && (
                        <div className="flex gap-3 mt-3 overflow-x-auto pb-1">
                            {vehicle.images.map((image, index) => (
                                <img
                                    key={image._id || index}
                                    src={image.url}
                                    alt={`Vehicle ${index + 1}`}
                                    className="w-20 h-16 rounded-lg object-cover border border-slate-200 shrink-0"
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Summary */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                    <h2 className="font-bold text-[#0B1E3D] mb-5">
                        Quick Overview
                    </h2>

                    <div className="space-y-5">

                        <DetailItem
                            label="VIN"
                            value={vehicle.vin}
                        />

                        <DetailItem
                            label="Mileage"
                            value={
                                vehicle.mileage
                                    ? `${Number(vehicle.mileage).toLocaleString()} km`
                                    : "--"
                            }
                        />

                        <DetailItem
                            label="Body Type"
                            value={formatEnumValue(vehicle.bodyType)}
                        />

                        <DetailItem
                            label="Fuel Type"
                            value={formatEnumValue(vehicle.fuelType)}
                        />

                        <DetailItem
                            label="Transmission"
                            value={formatEnumValue(vehicle.transmission)}
                        />

                        <DetailItem
                            label="Drivetrain"
                            value={formatEnumValue(vehicle.drivetrain)}
                        />

                        <DetailItem
                            label="Views"
                            value={vehicle.views?.toLocaleString()}
                        />

                    </div>

                </div>
            </div>

            {/* basic vehicle info */}
            <SectionCard
                title="Vehicle Information"
                icon={Car}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                    <DetailItem label="Make" value={vehicle.make} />
                    <DetailItem label="Model" value={vehicle.model} />
                    <DetailItem label="Year" value={vehicle.year} />
                    <DetailItem label="Trim" value={vehicle.trim} />

                    <DetailItem
                        label="Vehicle Type"
                        value={formatEnumValue(vehicle.vehicleType)}
                    />

                    <DetailItem
                        label="Body Type"
                        value={formatEnumValue(vehicle.bodyType)}
                    />

                    <DetailItem
                        label="Mileage"
                        value={
                            vehicle.mileage
                                ? `${Number(vehicle.mileage).toLocaleString()} km`
                                : "--"
                        }
                    />

                    <DetailItem
                        label="Transmission"
                        value={formatEnumValue(vehicle.transmission)}
                    />

                    <DetailItem
                        label="Fuel Type"
                        value={formatEnumValue(vehicle.fuelType)}
                    />

                    <DetailItem
                        label="Drivetrain"
                        value={formatEnumValue(vehicle.drivetrain)}
                    />

                    <DetailItem
                        label="Exterior Color"
                        value={formatEnumValue(vehicle.exteriorColor)}
                    />

                    <DetailItem
                        label="Interior Color"
                        value={formatEnumValue(vehicle.interiorColor)}
                    />

                </div>
            </SectionCard>

            {/* location + title */}
            <SectionCard
                title="Location & Title Information"
                icon={MapPin}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                    <DetailItem
                        label="Country"
                        value={formatEnumValue(vehicle.country)}
                    />

                    <DetailItem
                        label="Emirate"
                        value={formatEnumValue(vehicle.emirate)}
                    />

                    <DetailItem
                        label="City"
                        value={vehicle.city}
                    />

                    <DetailItem
                        label="ZIP / Postal Code"
                        value={vehicle.zipCode}
                    />

                    <DetailItem
                        label="Title Status"
                        value={formatEnumValue(vehicle.titleStatus)}
                    />

                    <DetailItem
                        label="Accident History"
                        value={formatEnumValue(vehicle.accidentHistory)}
                    />

                </div>
            </SectionCard>


            {/* conditiono */}
            <SectionCard
                title="Vehicle Condition"
                icon={ShieldCheck}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                    <DetailItem
                        label="Overall Condition"
                        value={formatEnumValue(vehicle.overallCondition)}
                    />

                    <DetailItem
                        label="Mechanical Condition"
                        value={formatEnumValue(vehicle.mechanicalCondition)}
                    />

                    <DetailItem
                        label="Interior Condition"
                        value={formatEnumValue(vehicle.interiorCondition)}
                    />

                    <DetailItem
                        label="Exterior Condition"
                        value={formatEnumValue(vehicle.exteriorCondition)}
                    />

                    <DetailItem
                        label="Repainted"
                        value={formatEnumValue(vehicle.repainted)}
                    />

                    <DetailItem
                        label="Smoke Odor"
                        value={formatEnumValue(vehicle.smokeOdor)}
                    />

                    <DetailItem
                        label="Pet Friendly"
                        value={formatEnumValue(vehicle.petFriendly)}
                    />

                    <DetailItem
                        label="Paint Type"
                        value={formatEnumValue(vehicle.paintType)}
                    />

                    <DetailItem
                        label="Glass Condition"
                        value={formatEnumValue(vehicle.glassCondition)}
                    />

                    <DetailItem
                        label="Tire Condition"
                        value={formatEnumValue(vehicle.tiresCondition)}
                    />

                    <DetailItem
                        label="Tire Brand"
                        value={vehicle.tireBrand}
                    />

                    <DetailItem
                        label="Tire Size"
                        value={vehicle.tireSize}
                    />

                </div>
            </SectionCard>

            {/* engine/features */}
            <SectionCard
                title="Engine & Features"
                icon={Settings2}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                    <DetailItem
                        label="Engine Size"
                        value={vehicle.engineSize}
                    />

                    <DetailItem
                        label="Cylinders"
                        value={vehicle.cylinders}
                    />

                    <DetailItem
                        label="Doors"
                        value={vehicle.doors}
                    />

                    <DetailItem
                        label="Seats"
                        value={vehicle.seats}
                    />

                    <DetailItem
                        label="Key Type"
                        value={formatEnumValue(vehicle.keyType)}
                    />

                    <DetailItem
                        label="Number of Keys"
                        value={vehicle.numberOfKeys}
                    />

                    <DetailItem
                        label="Seat Material"
                        value={formatEnumValue(vehicle.seatMaterial)}
                    />

                    <DetailItem
                        label="Sunroof"
                        value={formatEnumValue(vehicle.sunroof)}
                    />

                    <DetailItem
                        label="AC / Heater"
                        value={vehicle.acHeater}
                    />

                    <DetailItem
                        label="Audio System"
                        value={vehicle.audioSystem}
                    />

                    <DetailItem
                        label="Navigation"
                        value={formatEnumValue(vehicle.navigation)}
                    />

                    <DetailItem
                        label="Power Windows"
                        value={formatEnumValue(vehicle.powerWindows)}
                    />

                    <DetailItem
                        label="Power Locks"
                        value={formatEnumValue(vehicle.powerLocks)}
                    />

                </div>

                {(vehicle.additionalFeatures || vehicle.additionalNotes) && (
                    <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">

                        {vehicle.additionalFeatures && (
                            <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">
                                    Additional Features
                                </p>

                                <p className="text-sm text-slate-600 leading-6">
                                    {vehicle.additionalFeatures}
                                </p>
                            </div>
                        )}

                        {vehicle.additionalNotes && (
                            <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">
                                    Additional Notes
                                </p>

                                <p className="text-sm text-slate-600 leading-6">
                                    {vehicle.additionalNotes}
                                </p>
                            </div>
                        )}

                    </div>
                )}
            </SectionCard>

            {/* description */}
            {vehicle.vehicleDescription && (
                <SectionCard
                    title="Vehicle Description"
                    icon={FileText}
                >
                    <p className="text-sm text-slate-600 leading-7 whitespace-pre-line">
                        {vehicle.vehicleDescription}
                    </p>
                </SectionCard>
            )}

            {/* pricing & auction */}
            <SectionCard
                title="Pricing & Auction"
                icon={Gavel}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                    <DetailItem
                        label="Price Type"
                        value={formatEnumValue(vehicle.priceType)}
                    />

                    <DetailItem
                        label="Starting Bid"
                        value={formatPrice(vehicle.startingBidPrice)}
                    />

                    {vehicle.priceType === "fixed_price" && (
                        <DetailItem
                            label="Buy Now Price"
                            value={formatPrice(vehicle.buyNowPrice)}
                        />
                    )}

                    {vehicle.priceType === "reserve_price" && (
                        <DetailItem
                            label="Reserve Price"
                            value={formatPrice(vehicle.reservePrice)}
                        />
                    )}

                    <DetailItem
                        label="Current Bid"
                        value={formatPrice(vehicle.currentBid)}
                    />

                    <DetailItem
                        label="Auction Type"
                        value={formatEnumValue(vehicle.auctionType)}
                    />

                    <DetailItem
                        label="Start Date"
                        value={formatDate(vehicle.auctionStartDate)}
                    />

                    <DetailItem
                        label="Start Time"
                        value={vehicle.auctionStartTime}
                    />

                    <DetailItem
                        label="Duration"
                        value={formatEnumValue(vehicle.auctionDuration)}
                    />

                    <DetailItem
                        label="Auction Ends"
                        value={formatDateTime(vehicle.auctionEndDateTime)}
                    />

                    <DetailItem
                        label="Anti-Sniping Window"
                        value={
                            vehicle.antiSnipingWindow !== undefined
                                ? `${vehicle.antiSnipingWindow} min`
                                : "--"
                        }
                    />

                    <DetailItem
                        label="Anti-Sniping Extension"
                        value={
                            vehicle.antiSnipingExtension !== undefined
                                ? `${vehicle.antiSnipingExtension} min`
                                : "--"
                        }
                    />

                </div>
            </SectionCard>


            {/* listing setting */}
            <SectionCard
                title="Listing Settings"
                icon={ShieldCheck}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                    {[
                        ["Allow Bidders to Save", vehicle.allowBiddersToSave],
                        ["Share on Social Media", vehicle.shareOnSocialMedia],
                        ["Featured Listing", vehicle.featuredListing],
                        ["Auto Relist", vehicle.autoRelist],
                        ["VIN Decoded", vehicle.vinDecoded],
                    ].map(([label, value]) => (
                        <div
                            key={label}
                            className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
                        >
                            <span className="text-sm text-slate-600">
                                {label}
                            </span>

                            {value ? (
                                <CheckCircle2
                                    size={18}
                                    className="text-green-600"
                                />
                            ) : (
                                <XCircle
                                    size={18}
                                    className="text-slate-300"
                                />
                            )}
                        </div>
                    ))}

                </div>
            </SectionCard>

            {/* documents */}
            <SectionCard
                title="Documents"
                icon={FileText}
            >
                {vehicle.documents?.length > 0 ? (
                    <div className="space-y-3">

                        {vehicle.documents.map((document, index) => (
                            <div
                                key={document._id || index}
                                className="flex items-center justify-between gap-4 p-4 rounded-xl border border-slate-200"
                            >

                                <div className="flex items-center gap-3 min-w-0">

                                    <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                                        <FileText size={18} />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-slate-700 truncate">
                                            {document.name || `Document ${index + 1}`}
                                        </p>

                                        <p className="text-xs text-slate-400">
                                            {formatEnumValue(document.resourceType)}
                                        </p>
                                    </div>

                                </div>

                                <div className="flex items-center gap-2 shrink-0">

                                    {document.url && (
                                        <a
                                            href={document.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:text-amber-600 hover:border-amber-500"
                                        >
                                            <ExternalLink size={16} />
                                        </a>
                                    )}

                                    {document.url && (
                                        <a
                                            href={document.url}
                                            download={document.name}
                                            className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:text-amber-600 hover:border-amber-500"
                                        >
                                            <Download size={16} />
                                        </a>
                                    )}

                                </div>

                            </div>
                        ))}

                    </div>
                ) : (
                    <div className="py-8 text-center text-sm text-slate-400">
                        No documents available.
                    </div>
                )}
            </SectionCard>

            {/* footer info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shadow-sm">

                <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <p className="text-xs text-slate-400 uppercase">
                        Created At
                    </p>
                    <p className="text-sm font-semibold text-slate-700 mt-1">
                        {formatDateTime(vehicle.createdAt)}
                    </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <p className="text-xs text-slate-400 uppercase">
                        Last Updated
                    </p>
                    <p className="text-sm font-semibold text-slate-700 mt-1">
                        {formatDateTime(vehicle.updatedAt)}
                    </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <p className="text-xs text-slate-400 uppercase">
                        Vehicle ID
                    </p>
                    <p className="text-xs font-medium text-slate-600 mt-1 break-all">
                        {vehicle._id}
                    </p>
                </div>

            </div>

        </div>
    );
}

export default SellerVehicleDetail;
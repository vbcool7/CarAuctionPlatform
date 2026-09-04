
import React, { useState } from 'react';
import { Download, File, Share2 } from 'lucide-react';
import CancelAuctionModal from '../SellerSharedComponents/CancelAuctionModal';

import { UseCountDown } from '../SellerSharedComponents/UseCountDown';
import { formatLabel, formatPrice } from '../../../utils/formatters';
import { useCancelAuction, useGetAuctionDetail } from '../../../hook/useAuction';
import { toast } from 'react-toastify';

const auctionPhaseLabels = {
    draft: {
        label: 'Draft',
        className: 'bg-gray-400 text-white',
    },

    upcoming: {
        label: 'Upcoming',
        className: 'bg-blue-500 text-white',
    },

    live: {
        label: 'Live',
        className: 'bg-green-500 text-white',
    },

    sold: {
        label: 'Sold',
        className: 'bg-emerald-600 text-white',
    },

    unsold: {
        label: 'Unsold',
        className: 'bg-red-500 text-white',
    },

    'reserve-not-met': {
        label: 'Reserve Not Met',
        className: 'bg-orange-500 text-white',
    },

    canceled: {
        label: 'Canceled',
        className: 'bg-gray-500 text-white',
    },
};

const renderDetailItem = (label, value) => (
    <div>
        <p className="text-xs text-gray-400">
            {label}
        </p>

        <p className="mt-0.5 text-sm font-medium text-[#0B1E3D]">
            {value || "---"}
        </p>
    </div>
);

function MyAuctionsDetail({ setCurrentPage, auctionId }) {

    const [activeTab, setActiveTab] = useState('overview');
    const [selectedImage, setSelectedImage] = useState(0);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const [cancelError, setCancelError] = useState("");

    const { data: auctionDetail, isLoading, isError } = useGetAuctionDetail(auctionId);
    const { mutate: cancelAuction, isPending: isCanceling } = useCancelAuction();

    const vehicle = auctionDetail?.data?.vehicle;
    const bids = auctionDetail?.data?.bids || [];
    const soldTo = auctionDetail?.data?.soldTo || [];

    const tabs = [
        { key: 'overview', label: 'Overview' },
        { key: 'vehicle-details', label: 'Vehicle Details' },
        { key: 'bids', label: `Bids (${bids?.length || 0})` },
        { key: 'watchers', label: 'Watchers' },
        { key: 'images', label: `Images (${vehicle?.images?.length || 0})` },
        { key: 'documents', label: `Documents (${vehicle?.documents?.length || 0})` },
    ];

    const auctionStatusContent = {
        upcoming: {
            heading: "This auction hasn't started yet.",
            countdownLabel: 'Starts In',
            targetDateTime: vehicle?.auctionStartDateTime,
            showCountdown: true,
            primaryAction: 'Cancel Auction',
        },
        live: {
            heading: 'This auction is currently live. Place your bid before it ends.',
            countdownLabel: 'Auction Ends In',
            targetDateTime: vehicle?.auctionEndDateTime,
            showCountdown: true,
            primaryAction: 'Cancel Auction',
        },
        sold: {
            heading: 'This auction has ended — vehicle sold.',
            showCountdown: false,
            primaryAction: 'View Payout'
        },
        unsold: {
            heading: 'This auction ended with no bids.',
            showCountdown: false,
            primaryAction: 'Relist Vehicle'
        },
        'reserve-not-met': {
            heading: "Reserve price wasn't met. Vehicle wasn't sold.",
            showCountdown: false,
            primaryAction: 'Relist Vehicle'
        },
        canceled: {
            heading: 'This auction was canceled.',
            showCountdown: false,
            primaryAction: null
        },
    };

    const statusInfo = auctionStatusContent[vehicle?.auctionStatus];

    const countdown = UseCountDown(statusInfo?.showCountdown ? statusInfo.targetDateTime : null);

    if (isLoading) return <p className="p-10 text-center">Loading auction details....</p>;
    if (isError) return <p className="p-10 text-center text-red-500">Failed to load auction details</p>;

    if (!vehicle) {
        return (
            <p className="p-10 text-center text-red-500">
                Auction details not found
            </p>
        );
    }

    return (
        <div className='pb-6 space-y-6'>

            {/* back link */}
            <button
                onClick={() => setCurrentPage('my-auctions')}
                className='flex items-center gap-1 text-xs md:text-sm text-gray-500 hover:text-[#0B1E3D]'
            >
                ← Back to My Auctions
            </button>

            {/* header */}
            <div className='w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0'>
                <div className='flex flex-col'>
                    <h1 className='text-xl md:text-2xl font-bold'>Auction Details</h1>
                    <p className='text-xs md:text-sm text-gray-600 p-px'>
                        View detailed information about this auction.
                    </p>
                </div>

                <div className='flex gap-2'>
                    <button className='flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-medium rounded-lg border border-gray-300'>
                        <Share2 className='w-4 h-4' />
                        Share Auction
                    </button>
                    <button className='px-4 py-2 text-xs md:text-sm font-medium rounded-lg border border-gray-300'>
                        More Actions
                    </button>
                </div>
            </div>

            {/* main grid */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>

                {/* left column */}
                <div className='lg:col-span-2 space-y-6'>

                    {/* cover image + basic specs card */}
                    <div className='bg-white rounded-xl border border-gray-200 p-5'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                            <div>
                                <div className='space-y-3'>

                                    {/* Cover Image */}
                                    <div className='relative rounded-xl overflow-hidden h-64 md:h-72 bg-gray-100'>
                                        {vehicle?.images?.length > 0 ? (
                                            <img
                                                src={vehicle.images[selectedImage]?.url}
                                                alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                                                className='w-full h-full object-cover'
                                            />
                                        ) : (
                                            <div className='flex items-center justify-center h-full text-sm text-gray-400'>
                                                No image available
                                            </div>
                                        )}

                                        <div className='absolute top-3 left-3 flex items-center gap-1 bg-black/60 text-white text-xs px-2 py-1 rounded-md'>
                                            {vehicle?.images?.length || 0} Photos
                                        </div>
                                    </div>

                                    {/* Thumbnails */}
                                    {vehicle?.images?.length > 0 && (
                                        <div className='flex gap-2 overflow-x-auto pb-1'>
                                            {vehicle.images.map((image, index) => (
                                                <button
                                                    key={image._id || index}
                                                    type='button'
                                                    onClick={() => setSelectedImage(index)}
                                                    className={`relative shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition ${selectedImage === index
                                                        ? 'border-[#D97706]'
                                                        : 'border-gray-200'
                                                        }`}
                                                >
                                                    <img
                                                        src={image.url}
                                                        alt={`${vehicle.make} ${vehicle.model} ${index + 1}`}
                                                        className='w-full h-full object-cover'
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* title + quick specs */}
                            <div className="flex flex-col gap-5">

                                {/* Vehicle Title */}
                                <div>
                                    <h2 className="text-xl md:text-2xl font-bold leading-tight text-[#0B1E3D]">
                                        {vehicle.year} {formatLabel(vehicle.make)}{" "}
                                        {formatLabel(vehicle.model)}
                                    </h2>

                                    <p className="mt-1 text-xs text-gray-400">
                                        Vehicle Details
                                    </p>
                                </div>

                                {/* Vehicle Details */}
                                <div className="grid grid-cols-2 gap-x-6 gap-y-5 rounded-xl border border-slate-100 bg-slate-50/50 p-4">

                                    <div>
                                        <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                                            Auction ID
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-[#0B1E3D]">
                                            {vehicle.listingId || '--'}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                                            Engine
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-[#0B1E3D]">
                                            {vehicle.engineSize || "---"}
                                            {vehicle.cylinders && ` • ${vehicle.cylinders}-Cyl`}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                                            Mileage
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-[#0B1E3D]">
                                            {vehicle.mileage ? `${vehicle.mileage.toLocaleString()} km` : "---"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                                            Transmission
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-[#0B1E3D]">
                                            {formatLabel(vehicle.transmission || "---")}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                                            Title Status
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-[#0B1E3D]">
                                            {formatLabel(
                                                vehicle.titleStatus?.replace("_", " ") || "---"
                                            )}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                                            Location
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-[#0B1E3D]">
                                            {formatLabel(vehicle.city || "---")},{" "}
                                            {formatLabel(
                                                vehicle.emirate?.replaceAll("_", " ") || "---"
                                            )}
                                        </p>
                                    </div>

                                </div>

                                {/* VIN */}
                                <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3">
                                    <div>
                                        <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                                            Vehicle Identification Number
                                        </p>
                                        <p className="mt-1 text-sm font-semibold tracking-wider text-[#0B1E3D] break-all">
                                            {vehicle.vin || "---"}
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* tabs */}
                    <div className='bg-white rounded-xl border border-gray-200'>
                        <div className='flex gap-4 border-b border-gray-200 px-5 overflow-x-auto '>
                            <div className='flex gap-9 border-b border-gray-200 px-5 overflow-x-auto no-scrollbar'>
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`py-3 text-xs md:text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.key
                                            ? 'border-[#D97706] text-[#D97706]'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className='p-5'>
                            {activeTab === "overview" && (
                                <div className="space-y-7">

                                    {/* Vehicle Description */}
                                    <div>
                                        <h3 className="text-sm font-semibold text-[#0B1E3D] mb-2">
                                            Vehicle Description
                                        </h3>

                                        <p className="text-sm leading-6 text-gray-600">
                                            {vehicle.vehicleDescription || "----"}
                                        </p>
                                    </div>

                                    {/* Vehicle Information */}
                                    <div>
                                        <h3 className="text-sm font-semibold text-[#0B1E3D] mb-4">
                                            Vehicle Information
                                        </h3>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-10 gap-y-5">

                                            <div>
                                                <p className="text-xs text-gray-400">Vehicle Type</p>
                                                <p className="mt-1 text-sm font-medium text-[#0B1E3D]">
                                                    {formatLabel(vehicle.vehicleType || "----")}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-gray-400">Title Status</p>
                                                <p className="mt-1 text-sm font-medium text-[#0B1E3D]">
                                                    {formatLabel(vehicle.titleStatus || "----")}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-gray-400">Drive Type</p>
                                                <p className="mt-1 text-sm font-medium text-[#0B1E3D]">
                                                    {formatLabel(vehicle.drivetrain || "----")}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-gray-400">Transmission</p>
                                                <p className="mt-1 text-sm font-medium text-[#0B1E3D]">
                                                    {formatLabel(vehicle.transmission || "----")}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-gray-400">Mileage</p>
                                                <p className="mt-1 text-sm font-medium text-[#0B1E3D]">
                                                    {vehicle.mileage
                                                        ? `${vehicle.mileage.toLocaleString()} km`
                                                        : "----"}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-gray-400">Engine</p>
                                                <p className="mt-1 text-sm font-medium text-[#0B1E3D]">
                                                    {vehicle.engineSize || "----"}
                                                    {vehicle.cylinders &&
                                                        ` • ${vehicle.cylinders}-Cylinder`}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-gray-400">Accident History</p>
                                                <p className="mt-1 text-sm font-medium text-[#0B1E3D]">
                                                    {formatLabel(vehicle.accidentHistory || "----")}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-gray-400">Location</p>
                                                <p className="mt-1 text-sm font-medium text-[#0B1E3D]">
                                                    {formatLabel(vehicle.city || "----")}
                                                    {vehicle.emirate &&
                                                        `, ${formatLabel(vehicle.emirate)}`}
                                                </p>
                                            </div>

                                        </div>
                                    </div>

                                    {/* Auction Information */}
                                    <div className="border-t border-slate-100 pt-6">
                                        <h3 className="text-sm font-semibold text-[#0B1E3D] mb-4">
                                            Auction Information
                                        </h3>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-10 gap-y-5">

                                            {/* Auction Type */}
                                            <div>
                                                <p className="text-xs text-gray-400">Auction Type</p>
                                                <p className="mt-1 text-sm font-medium text-[#0B1E3D]">
                                                    {formatLabel(vehicle.auctionType || "----")} Auction
                                                </p>
                                            </div>

                                            {/* Price Type */}
                                            <div>
                                                <p className="text-xs text-gray-400">Price Type</p>
                                                <p className="mt-1 text-sm font-medium text-[#0B1E3D]">
                                                    {vehicle.priceType === "fixed_price"
                                                        ? "Fixed Price"
                                                        : "Reserve Price"}
                                                </p>
                                            </div>

                                            {/* Start Date */}
                                            <div>
                                                <p className="text-xs text-gray-400">
                                                    Start Date & Time
                                                </p>
                                                <p className="mt-1 text-sm font-medium text-[#0B1E3D]">
                                                    {vehicle.auctionStartDateTime
                                                        ? new Date(
                                                            vehicle.auctionStartDateTime
                                                        ).toLocaleString("en-GB", {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                            hour12: true,
                                                        })
                                                        : "----"}
                                                </p>
                                            </div>

                                            {/* End Date */}
                                            <div>
                                                <p className="text-xs text-gray-400">
                                                    End Date & Time
                                                </p>
                                                <p className="mt-1 text-sm font-medium text-[#0B1E3D]">
                                                    {vehicle.auctionEndDateTime
                                                        ? new Date(
                                                            vehicle.auctionEndDateTime
                                                        ).toLocaleString("en-GB", {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                            hour12: true,
                                                        })
                                                        : "----"}
                                                </p>
                                            </div>

                                            {/* Extension Rule */}
                                            <div>
                                                <p className="text-xs text-gray-400">
                                                    Extension Rule
                                                </p>
                                                <p className="mt-1 text-sm font-medium text-[#0B1E3D]">
                                                    {vehicle.antiSnipingExtension || 0} min extension
                                                </p>
                                            </div>

                                            {/* Starting Bid */}
                                            <div>
                                                <p className="text-xs text-gray-400">
                                                    Starting Bid
                                                </p>
                                                <p className="mt-1 text-sm font-semibold text-[#0B1E3D]">
                                                    {formatPrice(vehicle.startingBidPrice)}
                                                </p>
                                            </div>

                                            {/* Buy Now / Reserve */}
                                            <div>
                                                <p className="text-xs text-gray-400">
                                                    {vehicle.priceType === "fixed_price"
                                                        ? "Buy Now Price"
                                                        : "Reserve Price"}
                                                </p>

                                                <p className="mt-1 text-sm font-semibold text-[#0B1E3D]">
                                                    {vehicle.priceType === "fixed_price"
                                                        ? formatPrice(vehicle.buyNowPrice)
                                                        : formatPrice(vehicle.reservePrice)}
                                                </p>
                                            </div>

                                            {/* Current Bid */}
                                            <div>
                                                <p className="text-xs text-gray-400">
                                                    Current Bid
                                                </p>

                                                <p className="mt-1 text-sm font-semibold text-[#0B1E3D]">
                                                    {vehicle.currentBid
                                                        ? formatPrice(vehicle.currentBid)
                                                        : "—"}
                                                </p>
                                            </div>

                                            {/* Status */}
                                            <div>
                                                <p className="text-xs text-gray-400">Status</p>

                                                <span
                                                    className={`mt-1 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${vehicle.auctionStatus === "live"
                                                        ? "bg-green-50 text-green-600"
                                                        : vehicle.auctionStatus === "upcoming"
                                                            ? "bg-blue-50 text-blue-600"
                                                            : vehicle.auctionStatus === "canceled"
                                                                ? "bg-red-50 text-red-600"
                                                                : "bg-gray-100 text-gray-600"
                                                        }`}
                                                >
                                                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                                    {formatLabel(vehicle.auctionStatus || "----")}
                                                </span>
                                            </div>

                                        </div>
                                    </div>

                                </div>
                            )}

                            {activeTab === "vehicle-details" && (
                                <div className="space-y-7">

                                    {/* Basic Information */}
                                    <div>
                                        <h3 className="mb-4 text-sm font-semibold text-[#0B1E3D]">
                                            Basic Information
                                        </h3>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                                            {renderDetailItem("VIN", vehicle.vin)}
                                            {renderDetailItem("Vehicle Type", formatLabel(vehicle.vehicleType))}
                                            {renderDetailItem("Body Type", formatLabel(vehicle.bodyType))}
                                            {renderDetailItem("Year", vehicle.year)}
                                            {renderDetailItem(
                                                "Mileage",
                                                vehicle.mileage
                                                    ? `${vehicle.mileage.toLocaleString()} km`
                                                    : "---"
                                            )}
                                            {renderDetailItem("Transmission", formatLabel(vehicle.transmission))}
                                            {renderDetailItem("Fuel Type", formatLabel(vehicle.fuelType))}
                                            {renderDetailItem("Drive Type", formatLabel(vehicle.drivetrain))}
                                            {renderDetailItem("Title Status", formatLabel(vehicle.titleStatus))}
                                            {renderDetailItem(
                                                "Location",
                                                `${vehicle.city || "---"}${vehicle.emirate
                                                    ? `, ${formatLabel(vehicle.emirate)}`
                                                    : ""
                                                }`
                                            )}
                                            {renderDetailItem("Exterior Color", formatLabel(vehicle.exteriorColor))}
                                            {renderDetailItem("Interior Color", formatLabel(vehicle.interiorColor))}
                                            {renderDetailItem(
                                                "Engine",
                                                `${vehicle.engineSize || "---"}${vehicle.cylinders
                                                    ? ` • ${vehicle.cylinders}-Cylinder`
                                                    : ""
                                                }`
                                            )}
                                            {renderDetailItem("Seating Capacity", vehicle.seats)}
                                            {renderDetailItem("Doors", vehicle.doors)}
                                            {renderDetailItem(
                                                "Accident History",
                                                formatLabel(vehicle.accidentHistory)
                                            )}
                                        </div>
                                    </div>


                                    {/* Condition */}
                                    <div className="border-t border-slate-100 pt-6">
                                        <h3 className="mb-4 text-sm font-semibold text-[#0B1E3D]">
                                            Condition
                                        </h3>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                                            {renderDetailItem(
                                                "Overall Condition",
                                                formatLabel(vehicle.overallCondition)
                                            )}
                                            {renderDetailItem(
                                                "Mechanical Condition",
                                                formatLabel(vehicle.mechanicalCondition)
                                            )}
                                            {renderDetailItem(
                                                "Exterior Condition",
                                                formatLabel(vehicle.exteriorCondition)
                                            )}
                                            {renderDetailItem(
                                                "Interior Condition",
                                                formatLabel(vehicle.interiorCondition)
                                            )}
                                            {renderDetailItem("Repainted", formatLabel(vehicle.repainted))}
                                            {renderDetailItem("Smoke Odor", formatLabel(vehicle.smokeOdor))}
                                            {renderDetailItem("Pet Friendly", formatLabel(vehicle.petFriendly))}
                                            {renderDetailItem(
                                                "Glass Condition",
                                                formatLabel(vehicle.glassCondition)
                                            )}
                                            {renderDetailItem(
                                                "Tires Condition",
                                                formatLabel(vehicle.tiresCondition)
                                            )}
                                        </div>
                                    </div>


                                    {/* Features & Equipment */}
                                    <div className="border-t border-slate-100 pt-6">
                                        <h3 className="mb-4 text-sm font-semibold text-[#0B1E3D]">
                                            Features & Equipment
                                        </h3>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                                            {renderDetailItem("Paint Type", formatLabel(vehicle.paintType))}
                                            {renderDetailItem("Tire Brand", vehicle.tireBrand)}
                                            {renderDetailItem("Tire Size", vehicle.tireSize)}
                                            {renderDetailItem("Seat Material", formatLabel(vehicle.seatMaterial))}
                                            {renderDetailItem("Number of Keys", vehicle.numberOfKeys)}
                                            {renderDetailItem("Key Type", formatLabel(vehicle.keyType))}
                                            {renderDetailItem("Sunroof", formatLabel(vehicle.sunroof))}
                                            {renderDetailItem("AC / Heater", vehicle.acHeater)}
                                            {renderDetailItem("Audio System", vehicle.audioSystem)}
                                            {renderDetailItem("Navigation", formatLabel(vehicle.navigation))}
                                            {renderDetailItem("Power Windows", formatLabel(vehicle.powerWindows))}
                                            {renderDetailItem("Power Locks", formatLabel(vehicle.powerLocks))}
                                            {renderDetailItem("Additional Features", vehicle.additionalFeatures)}
                                        </div>
                                    </div>

                                </div>
                            )}

                            {activeTab === 'bids' && (
                                <div className='space-y-4'>
                                    <div className='flex items-center justify-between'>
                                        <p className='text-xs text-gray-500'>All bids placed on this auction.</p>
                                        <button className='flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300'>
                                            <Download className='h-3.5 w-3.5' />
                                            Export Bids
                                        </button>
                                    </div>

                                    {bids.length > 0 ? (
                                        <div className='overflow-x-auto'>
                                            <table className="w-full text-left text-[12px]">
                                                <thead>
                                                    <tr className='text-left text-xs text-gray-400 border-b border-gray-100'>
                                                        <th className="px-5 py-3 font-medium min-w-20">SN</th>
                                                        <th className='px-4 py-3 font-medium min-w-50'>Bidder</th>
                                                        <th className='px-4 py-3 font-medium min-w-30'>Bid Amount</th>
                                                        <th className='px-4 py-3 font-medium min-w-40'>Bid Time</th>
                                                        <th className='px-4 py-3 font-medium min-w-30'>Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {bids.map((b, index) => (
                                                        <tr
                                                            key={b._id}
                                                            className='border-b border-gray-50'>

                                                            {/* SN */}
                                                            <td className="px-5 py-4">
                                                                <span className="text-slate-400 font-medium ml-1.5">
                                                                    {index + 1}
                                                                </span>
                                                            </td>

                                                            {/* bidder info */}
                                                            <td className='px-4 py-4'>
                                                                <div className='flex items-center gap-2'>
                                                                    <div className='w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-700'>
                                                                        {b.bidder?.name?.charAt(0) || '?'}
                                                                    </div>
                                                                    <div>
                                                                        <p className='className="font-medium text-[#0B1E3D]'>{b.bidder?.name || 'Unknown'}</p>
                                                                        <p className="text-xs text-slate-400">Bid ID: {b.bidId}</p>
                                                                    </div>
                                                                </div>
                                                            </td>

                                                            {/* bid amt */}
                                                            <td className="px-4 py-4 font-semibold text-[#0B1E3D]">
                                                                {formatPrice(b.amount)}
                                                            </td>

                                                            {/* date/time */}
                                                            <td className="px-4 py-4">
                                                                {b.createdAt ? (
                                                                    <>
                                                                        <div>
                                                                            {new Date(b.createdAt).toLocaleDateString("en-GB", {
                                                                                timeZone: "Asia/Dubai",
                                                                                day: "2-digit",
                                                                                month: "short",
                                                                                year: "numeric",
                                                                            })}
                                                                        </div>

                                                                        <div className="text-slate-500 text-[11px] mt-1">
                                                                            {new Date(b.createdAt).toLocaleTimeString("en-GB", {
                                                                                timeZone: "Asia/Dubai",
                                                                                hour: "2-digit",
                                                                                minute: "2-digit",
                                                                                hour12: true,
                                                                            })}
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    "—"
                                                                )}
                                                            </td>

                                                            {/* status */}
                                                            <td className="px-4 py-4">
                                                                <span
                                                                    className={`px-2 py-1 text-[10px] font-medium rounded-full 
                                                                        ${b.status === "active"
                                                                            ? "bg-green-100 text-green-700"
                                                                            : b.status === "outbid"
                                                                                ? "bg-yellow-100 text-yellow-700"
                                                                                : b.status === "won"
                                                                                    ? "bg-purple-100 text-purple-700"
                                                                                    : b.status === "canceled"
                                                                                        ? "bg-red-100 text-red-700"
                                                                                        : "bg-gray-100 text-gray-600"
                                                                        }`}
                                                                >
                                                                    {b.status}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <p className='text-sm text-gray-400'>No bids placed yet.</p>
                                    )}
                                </div>
                            )}

                            {activeTab === 'watchers' && (
                                <div className='space-y-4'>
                                    <div className='flex items-center justify-between'>
                                        <p className='text-xs text-gray-500'>People who are watching this auction.</p>
                                        <button className='flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300'>
                                            Export Watchers
                                        </button>
                                    </div>

                                    {/* {myVehicles.watchersList?.length > 0 ? (
                                        <div className='overflow-x-auto'>
                                            <table className='w-full text-sm'>
                                                <thead>
                                                    <tr className='text-left text-xs text-gray-400 border-b border-gray-100'>
                                                        <th className='py-2 font-medium'>Watcher</th>
                                                        <th className='py-2 font-medium'>Member Since</th>
                                                        <th className='py-2 font-medium'>Watch Time</th>
                                                        <th className='py-2 font-medium'>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {myVehicles.watchersList.map((w, index) => (
                                                        <tr key={index} className='border-b border-gray-50'>
                                                            <td className='py-3'>
                                                                <div className='flex items-center gap-2'>
                                                                    <div className='w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-700'>
                                                                        {w.watcherInitials}
                                                                    </div>
                                                                    <div>
                                                                        <p className='font-medium text-[#0B1E3D]'>{w.watcherName}</p>
                                                                        <p className='text-xs text-gray-400'>Member ID: {w.id}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className='py-3 text-[#0B1E3D]'>{w.memberSince}</td>
                                                            <td className='py-3'>
                                                                <p className='text-[#0B1E3D]'>{w.watchTime}</p>
                                                                <p className='text-xs text-gray-400'>{w.timeAgo}</p>
                                                            </td>
                                                            <td className='py-3'>
                                                                <button className='px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300'>
                                                                    View Profile
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <p className='text-sm text-gray-400'>No watchers yet.</p>
                                    )} */}
                                </div>
                            )}

                            {activeTab === 'images' && (
                                <div>
                                    <p className='text-xs text-gray-500 mb-4'>
                                        All images uploaded for this vehicle listing.
                                    </p>

                                    {vehicle.images?.length > 0 ? (
                                        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
                                            {vehicle.images.map((img, index) => (
                                                <div key={index} className='relative'>
                                                    <img
                                                        src={img.url}
                                                        alt={`Vehicle image ${index + 1}`}
                                                        className='h-32 w-full rounded-xl object-cover'
                                                    />
                                                    <p className='mt-1 text-xs text-gray-500'>
                                                        {index === 0 ? 'Cover Photo' : `Image ${index + 1}`}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className='text-sm text-gray-400'>No images uploaded.</p>
                                    )}
                                </div>
                            )}

                            {activeTab === 'documents' && (
                                <div>
                                    <p className='text-xs text-gray-500 mb-4'>
                                        All documents related to this vehicle listing.
                                    </p>
                                    {vehicle.documents?.length > 0 ? (
                                        <div className='space-y-3'>
                                            {vehicle.documents.map((doc, index) => (
                                                <div
                                                    key={index}
                                                    className='flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3'
                                                >
                                                    <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50'>
                                                        <File className='text-[#D97706] w-5 h-5' />
                                                    </div>

                                                    <div className='flex-1 min-w-0'>
                                                        <p className='text-sm font-medium text-[#0B1E3D]'>
                                                            {doc.name}
                                                        </p>
                                                        <p className='text-xs text-gray-400'>
                                                            {doc.resourceType}
                                                        </p>
                                                    </div>

                                                    <div className='flex gap-2'>
                                                        <a
                                                            href={doc.url}
                                                            target='_blank'
                                                            rel='noreferrer'
                                                            className='px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300'
                                                        >
                                                            View
                                                        </a>

                                                        <a
                                                            href={doc.url}
                                                            download
                                                            className='px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300'
                                                        >
                                                            Download
                                                        </a>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className='text-sm text-gray-400'>
                                            No documents uploaded.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                    </div>
                </div>

                {/* right column */}
                <div className='space-y-6'>

                    {/* countdown */}
                    <div className='bg-white rounded-xl border border-gray-200 p-5'>
                        <div className='flex items-center justify-between mb-2'>
                            <h3 className='text-sm font-semibold text-[#0B1E3D]'>Auction Status</h3>
                            <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-md ${auctionPhaseLabels[vehicle.auctionStatus]?.className}`}>
                                {auctionPhaseLabels[vehicle.auctionStatus]?.label}
                            </span>
                        </div>
                        <p className='text-xs text-gray-500 mb-4'>{statusInfo?.heading}</p>

                        {statusInfo?.showCountdown && (
                            <>
                                <p className='text-xs text-gray-500 mb-2'>{statusInfo.countdownLabel}</p>
                                <div className='grid grid-cols-4 gap-2 text-center mb-2'>
                                    <div className='bg-gray-50 rounded-lg py-2'>
                                        <p className='text-base font-bold text-[#0B1E3D]'>{String(countdown.days).padStart(2, '0')}</p>
                                        <p className='text-[10px] text-gray-400'>Days</p>
                                    </div>
                                    <div className='bg-gray-50 rounded-lg py-2'>
                                        <p className='text-base font-bold text-[#0B1E3D]'>{String(countdown.hours).padStart(2, '0')}</p>
                                        <p className='text-[10px] text-gray-400'>Hours</p>
                                    </div>
                                    <div className='bg-gray-50 rounded-lg py-2'>
                                        <p className='text-base font-bold text-[#0B1E3D]'>{String(countdown.mins).padStart(2, '0')}</p>
                                        <p className='text-[10px] text-gray-400'>Mins</p>
                                    </div>
                                    <div className='bg-gray-50 rounded-lg py-2'>
                                        <p className='text-base font-bold text-[#0B1E3D]'>{String(countdown.secs).padStart(2, '0')}</p>
                                        <p className='text-[10px] text-gray-400'>Secs</p>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* if solded */}
                        {vehicle?.auctionStatus === 'sold' && (
                            <div className='space-y-3 mt-4'>
                                <div className='flex justify-between items-center'>
                                    <span className='text-xs text-gray-500'>
                                        Winning Bidder
                                    </span>

                                    <span className='text-sm font-semibold text-[#0B1E3D]'>
                                        {soldTo?.name || "—"}
                                    </span>
                                </div>

                                <div className='flex justify-between items-center'>
                                    <p className="text-[11px] font-medium text-slate-500">
                                        Final Price
                                    </p>

                                    <p className="mt-1 text-xs font-semibold text-green-600">
                                        {formatPrice(vehicle.currentBid)}
                                    </p>
                                </div>

                                <div className='flex justify-between items-center'>
                                    <p className="text-[11px] font-medium text-slate-500">
                                        Total Bids
                                    </p>
                                    <p className="mt-1 text-xs font-semibold text-slate-700">
                                        {bids?.length ?? 0} Bids
                                    </p>
                                </div>

                                <div className='flex justify-between items-center'>
                                    <span className='text-xs text-gray-500'>
                                        Auction Completed
                                    </span>

                                    <span className='text-sm font-semibold text-[#0B1E3D]'>
                                        {vehicle.auctionEndDateTime
                                            ? new Date(vehicle.auctionEndDateTime).toLocaleString("en-GB", {
                                                timeZone: "Asia/Dubai",
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: true,
                                            })
                                            : "—"}
                                    </span>
                                </div>

                            </div>
                        )}

                        {/* if canceled */}
                        {vehicle?.auctionStatus === 'canceled' && (
                            <div className='space-y-3 mt-4'>

                                {/* Cancelled By */}
                                <div className='flex justify-between items-center'>
                                    <span className='text-xs text-gray-500'>
                                        Cancelled By
                                    </span>

                                    <span className='text-sm font-semibold text-[#0B1E3D]'>
                                        {vehicle?.canceledBy === 'admin'
                                            ? 'Admin'
                                            : vehicle?.canceledBy === 'seller'
                                                ? 'By You'
                                                : 'N/A'
                                        }
                                    </span>
                                </div>

                                {/* Cancelled At */}
                                <div className='flex justify-between items-center'>
                                    <span className='text-xs text-gray-500'>
                                        Cancelled At
                                    </span>

                                    <span className='text-sm font-semibold text-[#0B1E3D]'>
                                        {vehicle?.canceledAt
                                            ? new Date(vehicle.canceledAt).toLocaleString('en-IN', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })
                                            : 'N/A'
                                        }
                                    </span>
                                </div>

                                {/* Cancellation Reason */}
                                <div>
                                    <p className='text-xs text-gray-500 mb-1'>
                                        Cancellation Reason
                                    </p>

                                    <p className='text-sm text-red-600 bg-red-50 rounded-lg p-3'>
                                        {vehicle?.cancellationReason || 'No reason provided'}
                                    </p>
                                </div>

                            </div>
                        )}

                        {/* cancel auction button */}
                        {statusInfo?.primaryAction && statusInfo.primaryAction === 'Cancel Auction' && (
                            <button
                                onClick={() => {
                                    setCancelReason("");
                                    setCancelError("");
                                    setIsCancelModalOpen(true);
                                }}
                                className='w-full mt-2 py-2.5 text-xs font-semibold rounded-lg bg-[#D97706] text-white hover:bg-[#B45309]'>
                                {statusInfo.primaryAction}
                            </button>
                        )}
                    </div>

                    {/* auction summary */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h3 className="text-sm font-semibold text-[#0B1E3D] mb-4">
                            Auction Summary
                        </h3>

                        <div className="space-y-3 text-sm">

                            {/* Current Bid */}
                            <div className="flex justify-between">
                                <span className="text-gray-500">Current Bid</span>
                                <span className="font-semibold text-green-600">
                                    {vehicle.currentBid != null
                                        ? formatPrice(vehicle.currentBid)
                                        : "—"}
                                </span>
                            </div>

                            {/* Starting Bid Price */}
                            <div className="flex justify-between">
                                <span className="text-gray-500">Starting Bid Price</span>
                                <span className="font-medium text-[#0B1E3D]">
                                    {formatPrice(vehicle.startingBidPrice ?? "—")}
                                </span>
                            </div>

                            {/* Price Type */}
                            <div className="flex justify-between">
                                <span className="text-gray-500">Price Type</span>
                                <span className="font-medium text-[#0B1E3D]">
                                    {vehicle.priceType === "fixed_price"
                                        ? "Fixed Price"
                                        : "Reserve Price"}
                                </span>
                            </div>

                            {/* Reserve Price */}
                            {vehicle.priceType === "reserve_price" && (
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Reserve Price</span>
                                    <span className="font-medium text-[#0B1E3D]">
                                        {formatPrice(vehicle.reservePrice ?? "—")}
                                    </span>
                                </div>
                            )}

                            {/* Buy Now Price */}
                            {vehicle.priceType === "fixed_price" && (
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Buy Now Price</span>
                                    <span className="font-medium text-[#0B1E3D]">
                                        {formatPrice(vehicle.buyNowPrice ?? "—")}
                                    </span>
                                </div>
                            )}

                            {/* Total Bids */}
                            <div className="flex justify-between">
                                <span className="text-gray-500">Total Bids</span>
                                <span className="font-medium text-[#0B1E3D]">
                                    {bids.length ?? 0}
                                </span>
                            </div>

                            {/* Watchers */}
                            <div className="flex justify-between">
                                <span className="text-gray-500">Watchers</span>
                                <span className="font-medium text-[#0B1E3D]">
                                    {vehicle.watchers ?? 0}
                                </span>
                            </div>

                            {/* Final Sale Price */}
                            {vehicle.auctionStatus === "sold" && vehicle.currentBid != null && (
                                <div className="flex justify-between pt-3 border-t border-gray-100">
                                    <span className="text-gray-500">Final Sale Price</span>
                                    <span className="font-semibold text-green-600">
                                        {formatPrice(vehicle.currentBid)}
                                    </span>
                                </div>
                            )}

                        </div>
                    </div>

                    {/* recent activity */}
                    <div className='bg-white rounded-xl border border-gray-200 p-5'>
                        <h3 className='text-sm font-semibold text-[#0B1E3D] mb-3'>Recent Activity</h3>

                        <div className='space-y-4'>
                            {[
                                { color: 'bg-green-500', text: 'New highest bid of $32,000 placed by you', time: '10 minutes ago' },
                                { color: 'bg-gray-400', text: 'John D. placed a bid of $31,500', time: '12 minutes ago' },
                                { color: 'bg-blue-500', text: 'Sarah K. is watching this auction', time: '15 minutes ago' },
                            ].map((item, i) => (
                                <div key={i} className='flex gap-2'>
                                    <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${item.color}`} />
                                    <div>
                                        <p className='text-xs text-[#0B1E3D]'>{item.text}</p>
                                        <p className='text-[10px] text-gray-400'>{item.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* cancel auction modal */}
            <CancelAuctionModal
                isOpen={isCancelModalOpen}
                onClose={() => {
                    if (isCanceling) return;
                    setIsCancelModalOpen(false);
                    setCancelReason("");
                    setCancelError("");
                }}
                onConfirm={() => {
                    setCancelError("");
                    cancelAuction(
                        { id: vehicle._id, reason: cancelReason },
                        {
                            onSuccess: () => {
                                setIsCancelModalOpen(false);
                                setCancelReason("");
                                toast.success(data?.message || "Auction canceled successfully");
                                setCurrentPage('my-auctions')
                            },
                            onError: (err) => {
                                const msg = err?.response?.data?.message || "Failed to cancel auction. Please try again.";
                                setCancelError(msg);
                                toast.error(msg);
                            },
                        }
                    );
                }}
                vehicle={vehicle}
                reason={cancelReason}
                setReason={setCancelReason}
                loading={isCanceling}
                error={cancelError}
            />

        </div>
    )
}

export default MyAuctionsDetail;
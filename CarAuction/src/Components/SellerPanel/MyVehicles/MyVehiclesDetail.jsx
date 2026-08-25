
import React, { useState } from 'react';
import { myVehiclesData } from '../SellerSharedComponents/SellerData';
import { Copy, Edit3, Undo2 } from 'lucide-react';
import { useVehicleDetail } from '../../../hook/useVehicle';

const getAuctionPhase = (vehicle) => {
    if (vehicle.adminStatus !== 'approved') {
        return 'draft'; // draft: never submitted / not yet approved
    }

    // status 
    const now = new Date();
    const startDateTime = new Date(`${vehicle.auctionStartDate}T${vehicle.auctionStartTime}`);

    if (vehicle.auctionEndedManually) {
        // manual end action — seller/admin ne "End Auction" click kiya
        return vehicle.hasBids ? 'sold' : 'expired';
    }

    if (now < startDateTime) {
        return 'upcoming';
    }

    return 'live';
};

const auctionPhaseLabels = {
    draft: { label: 'Draft', className: 'bg-gray-100 text-gray-700' },
    upcoming: { label: 'Upcoming', className: 'bg-blue-100 text-blue-700' },
    live: { label: 'Live', className: 'bg-green-100 text-green-700' },
    sold: { label: 'Sold', className: 'bg-purple-100 text-purple-700' },
    expired: { label: 'Expired', className: 'bg-red-100 text-red-700' },
};

const adminStatusLabels = {
    pending: { label: 'Pending Approval', className: 'bg-amber-100 text-amber-700' },
    approved: { label: 'Approved', className: 'bg-green-100 text-green-700' },
    rejected: { label: 'Rejected', className: 'bg-red-100 text-red-700' },
};

function MyVehiclesDetail({ setCurrentPage, myVehileId }) {

    const { data: vehicleData, isLoading, isError } = useVehicleDetail(myVehileId);
    const vehicle = vehicleData?.data;

    const [activeTab, setActiveTab] = useState('overview');

    if (isLoading) return <p className="p-10 text-center">Loading vehicle details....</p>;
    if (isError) return <p className="p-10 text-center text-red-500">Failed to load vehicle details</p>;

    const tabs = [
        { key: 'overview', label: 'Overview' },
        { key: 'condition', label: 'Condition & Details' },
        { key: 'pricing', label: 'Pricing & Auction' },
        { key: 'images', label: `Images (${vehicle.images?.length || 0})` },
        { key: 'documents', label: `Documents (${vehicle.documents?.length || 0})` },
    ];

    const phase = getAuctionPhase(vehicle);
    const phaseInfo = auctionPhaseLabels[phase];

    return (
        <div className='pb-6 space-y-6'>

            {/* back link */}
            <button
                onClick={() => setCurrentPage('my-vehicles')}
                className='flex items-center gap-1 text-xs md:text-sm text-gray-500 hover:text-[#0B1E3D]'
            >
                ← Back to My Vehicles
            </button>

            {/* header */}
            <div className='w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>

                {/* title */}
                <div className='flex flex-col min-w-0'>
                    <h1 className='text-xl md:text-2xl font-bold'>
                        Vehicle Details
                    </h1>

                    <p className="text-xs md:text-sm text-gray-600 p-px wrap-break-word">
                        Listing ID: {vehicle.listingId} • Submitted on{" "}
                        {vehicle.createdAt
                            ? new Date(vehicle.createdAt).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            })
                            : "N/A"}
                    </p>
                </div>

                {/* actions */}
                <div className='w-full md:w-auto flex flex-col sm:flex-row gap-2'>
                    <button className='w-full sm:w-auto px-4 py-2 text-xs md:text-sm font-medium rounded-lg border border-gray-300'>
                        Edit Listing
                    </button>

                    <button className='w-full sm:w-auto px-4 py-2 text-xs md:text-sm font-medium rounded-lg border border-gray-300'>
                        Duplicate Listing
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
                            {/* cover image + thumbnails */}
                            <div>
                                <div className='relative rounded-xl overflow-hidden h-64 md:h-72 bg-gray-100'>
                                    <img
                                        src={vehicle?.images?.[0].url || null}
                                        alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                                        className='w-full h-full object-cover'
                                    />
                                    <div className='absolute top-3 left-3 flex items-center gap-1 bg-black/60 text-white text-xs px-2 py-1 rounded-md'>
                                        {vehicle.images?.length || 0} Photos
                                    </div>
                                </div>

                                <div className='grid grid-cols-6 gap-2 mt-3'>
                                    {vehicle.images?.slice(1, 6).map((img, index) => (
                                        <img
                                            key={index}
                                            src={img.url}
                                            alt={`Vehicle ${index + 2}`}
                                            className='h-14 w-full rounded-lg object-cover cursor-pointer border-2 border-transparent hover:border-[#D97706]'
                                        />
                                    ))}

                                    {vehicle.images?.length > 6 && (
                                        <button
                                            onClick={() => setActiveTab('images')}
                                            className='h-14 w-full rounded-lg bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600 hover:bg-gray-200'
                                        >
                                            +{vehicle.images.length - 6} More
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* title + quick specs */}
                            <div className='flex flex-col gap-4'>
                                <div className='flex items-start justify-between gap-2'>
                                    <h2 className='text-lg md:text-xl font-bold text-[#0B1E3D]'>
                                        {vehicle.year} {vehicle.make} {vehicle.model}
                                        {vehicle.trim && ` ${vehicle.trim}`}
                                    </h2>

                                    <div className='flex items-center gap-2'>

                                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full 
                                            ${auctionPhaseLabels[vehicle.auctionStatus]?.className}`}>
                                            {auctionPhaseLabels[vehicle.auctionStatus]?.label}
                                        </span>
                                    </div>
                                </div>

                                <div className='grid grid-cols-2 gap-y-4 gap-x-2'>
                                    <div>
                                        <p className='text-xs text-gray-400'>Drive Type</p>
                                        <p className='text-sm font-medium text-[#0B1E3D]'>{vehicle.drivetrain || "---"}</p>
                                    </div>
                                    <div>
                                        <p className='text-xs text-gray-400'>Engine</p>
                                        <p className='text-sm font-medium text-[#0B1E3D]'>{vehicle.engineSize || "---"}
                                            {vehicle.cylinders && ` • ${vehicle.cylinders}-Cyl`}</p>
                                    </div>
                                    <div>
                                        <p className='text-xs text-gray-400'>Seats</p>
                                        <p className='text-sm font-medium text-[#0B1E3D]'>{vehicle.seats || "---"}</p>
                                    </div>
                                    <div>
                                        <p className='text-xs text-gray-400'>Doors</p>
                                        <p className='text-sm font-medium text-[#0B1E3D]'>{vehicle.doors || '---'}</p>
                                    </div>
                                    <div>
                                        <p className='text-xs text-gray-400'>Title Status</p>
                                        <p className='text-sm font-medium text-[#0B1E3D]'>{vehicle.titleStatus?.replace("_", " ") || "---"}</p>
                                    </div>
                                    <div>
                                        <p className='text-xs text-gray-400'>Location</p>
                                        <p className='text-sm font-medium text-[#0B1E3D]'>{vehicle.city}, {vehicle.emirate?.replaceAll("_", " ")}</p>
                                    </div>
                                </div>

                                <div className='pt-2 border-t border-gray-100'>
                                    <p className='text-sm font-medium text-[#0B1E3D]'>{vehicle.vin}</p>
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
                            {activeTab === 'overview' && (
                                <div className='space-y-6'>
                                    <div>
                                        <h3 className='text-sm font-semibold text-[#0B1E3D] mb-2'>
                                            Vehicle Description
                                        </h3>

                                        <p className='text-sm text-gray-600'>
                                            {vehicle.vehicleDescription || '----'}
                                        </p>
                                    </div>

                                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4'>

                                        <div>
                                            <p className='text-xs text-gray-400'>Title Status</p>
                                            <p className='text-sm font-medium text-[#0B1E3D] capitalize'>
                                                {vehicle.titleStatus?.replaceAll('_', ' ') || '----'}
                                            </p>
                                        </div>

                                        <div>
                                            <p className='text-xs text-gray-400'>Drive Type</p>
                                            <p className='text-sm font-medium text-[#0B1E3D] uppercase'>
                                                {vehicle.drivetrain || '----'}
                                            </p>
                                        </div>

                                        <div>
                                            <p className='text-xs text-gray-400'>Accident History</p>
                                            <p className='text-sm font-medium text-[#0B1E3D] capitalize'>
                                                {vehicle.accidentHistory?.replaceAll('_', ' ') || '----'}
                                            </p>
                                        </div>

                                        <div>
                                            <p className='text-xs text-gray-400'>Engine</p>
                                            <p className='text-sm font-medium text-[#0B1E3D]'>
                                                {vehicle.engineSize || '----'}
                                                {vehicle.cylinders && ` • ${vehicle.cylinders}-Cylinder`}
                                            </p>
                                        </div>

                                        <div>
                                            <p className='text-xs text-gray-400'>Seating Capacity</p>
                                            <p className='text-sm font-medium text-[#0B1E3D]'>
                                                {vehicle.seats || '----'}
                                            </p>
                                        </div>

                                        <div>
                                            <p className='text-xs text-gray-400'>Doors</p>
                                            <p className='text-sm font-medium text-[#0B1E3D]'>
                                                {vehicle.doors || '----'}
                                            </p>
                                        </div>

                                        <div>
                                            <p className='text-xs text-gray-400'>Location</p>
                                            <p className='text-sm font-medium text-[#0B1E3D] capitalize'>
                                                {vehicle.city || '----'}
                                                {vehicle.emirate && `, ${vehicle.emirate.replaceAll('_', ' ')}`}
                                            </p>
                                        </div>

                                        <div>
                                            <p className='text-xs text-gray-400'>Vehicle Type</p>
                                            <p className='text-sm font-medium text-[#0B1E3D] capitalize'>
                                                {vehicle.vehicleType?.replaceAll('_', ' ') || '----'}
                                            </p>
                                        </div>

                                    </div>
                                </div>
                            )}

                            {activeTab === 'condition' && (
                                <div className='space-y-8'>

                                    {/* Vehicle Condition */}
                                    <div>
                                        <h3 className='text-sm font-semibold text-[#0B1E3D] mb-4'>Vehicle Condition</h3>
                                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-2'>
                                            <div>
                                                <p className='text-xs text-gray-400'>Overall Condition</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>{vehicle.overallCondition}</p>
                                            </div>
                                            <div>
                                                <p className='text-xs text-gray-400'>Exterior Condition</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>{vehicle.exteriorCondition}</p>
                                            </div>
                                            <div>
                                                <p className='text-xs text-gray-400'>Interior Condition</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>{vehicle.interiorCondition}</p>
                                            </div>
                                            <div>
                                                <p className='text-xs text-gray-400'>Mechanical Condition</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>{vehicle.mechanicalCondition}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Exterior Details */}
                                    <div>
                                        <h3 className='text-sm font-semibold text-[#0B1E3D] mb-4'>Exterior Details</h3>
                                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-2'>
                                            <div>
                                                <p className='text-xs text-gray-400'>Paint Type</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>{vehicle.paintType}</p>
                                            </div>
                                            <div>
                                                <p className='text-xs text-gray-400'>Glass Condition</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>{vehicle.glassCondition}</p>
                                            </div>
                                            <div>
                                                <p className='text-xs text-gray-400'>Tires Condition</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>{vehicle.tiresCondition}</p>
                                            </div>
                                            <div>
                                                <p className='text-xs text-gray-400'>Tire Brand</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>{vehicle.tireBrand}</p>
                                            </div>
                                            <div>
                                                <p className='text-xs text-gray-400'>Tire Size</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>{vehicle.tireSize}</p>
                                            </div>
                                            <div>
                                                <p className='text-xs text-gray-400'>Repainted</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>{vehicle.repainted}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Interior Details */}
                                    <div>
                                        <h3 className='text-sm font-semibold text-[#0B1E3D] mb-4'>Interior Details</h3>
                                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-2'>
                                            <div>
                                                <p className='text-xs text-gray-400'>Seat Material</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>{vehicle.seatMaterial}</p>
                                            </div>
                                            <div>
                                                <p className='text-xs text-gray-400'>Interior Color</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>{vehicle.interiorColor}</p>
                                            </div>
                                            <div>
                                                <p className='text-xs text-gray-400'>Sunroof</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>{vehicle.sunroof}</p>
                                            </div>
                                            <div>
                                                <p className='text-xs text-gray-400'>AC/Heater</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>{vehicle.acHeater}</p>
                                            </div>
                                            <div>
                                                <p className='text-xs text-gray-400'>Audio System</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>{vehicle.audioSystem}</p>
                                            </div>
                                            <div>
                                                <p className='text-xs text-gray-400'>Navigation</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>{vehicle.navigation}</p>
                                            </div>
                                            <div>
                                                <p className='text-xs text-gray-400'>Power Windows</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>{vehicle.powerWindows}</p>
                                            </div>
                                            <div>
                                                <p className='text-xs text-gray-400'>Power Locks</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>{vehicle.powerLocks}</p>
                                            </div>
                                            <div>
                                                <p className='text-xs text-gray-400'>Number of Keys</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>{vehicle.numberOfKeys}</p>
                                            </div>
                                            <div>
                                                <p className='text-xs text-gray-400'>Smoke Odor</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>{vehicle.smokeOdor}</p>
                                            </div>
                                            <div>
                                                <p className='text-xs text-gray-400'>Pet Friendly</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>{vehicle.petFriendly}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Additional Notes */}
                                    {vehicle.additionalNotes && (
                                        <div>
                                            <h3 className='text-sm font-semibold text-[#0B1E3D] mb-2'>Additional Notes</h3>
                                            <p className='text-sm text-gray-600'>{vehicle.additionalNotes}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'pricing' && (
                                <div className='space-y-8'>

                                    {/* Pricing Details */}
                                    <div>
                                        <h3 className='text-sm font-semibold text-[#0B1E3D] mb-4'>Pricing Details</h3>
                                        <div className='grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-2'>
                                            <div>
                                                <p className='text-xs text-gray-400'>Starting Bid Price</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>{vehicle.startingBidPrice}</p>
                                            </div>
                                            <div>
                                                <p className='text-xs text-gray-400'>Buy Now Price</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>
                                                    {vehicle.priceType === 'fixed_price' ? vehicle.buyNowPrice : '----'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className='text-xs text-gray-400'>Reserve Price</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>
                                                    {vehicle.priceType === 'reserve_price' ? vehicle.reservePrice : '----'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Auction Details */}
                                    <div>
                                        <h3 className='text-sm font-semibold text-[#0B1E3D] mb-4'>Auction Details</h3>
                                        <div className='grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-2'>
                                            <div>
                                                <p className='text-xs text-gray-400'>Auction Type</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>{vehicle.auctionType}</p>
                                            </div>
                                            <div>
                                                <p className='text-xs text-gray-400'>Auction Starts</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>{vehicle.auctionStartDate} {vehicle.auctionStartTime}</p>
                                            </div>
                                            <div>
                                                <p className='text-xs text-gray-400'>Auction Duration</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>{vehicle.auctionDuration}</p>
                                            </div>
                                            <div>
                                                <p className='text-xs text-gray-400'>Time Extension</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>{vehicle.antiSnipingExtension}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Current Bid (from list-card dummy data, if available) */}
                                    {/* {myVehicles.bid && (
                                        <div className='rounded-xl border border-amber-200 bg-amber-50 p-4'>
                                            <p className='text-xs text-gray-500'>{myVehicles.bid.label}</p>
                                            <p className='text-lg font-bold text-[#0B1E3D]'>{myVehicles.bid.amount}</p>
                                        </div>
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
                        <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50'>
                            {/* file icon */}
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

    {/* listing status card */}
    <div className='bg-white rounded-xl border border-gray-200 p-5'>
        <div className='flex items-center justify-between mb-4'>
            <h3 className='text-sm font-semibold text-[#0B1E3D]'>Listing Status</h3>
            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${adminStatusLabels[vehicle.adminStatus]?.className}`}>
                {adminStatusLabels[vehicle.adminStatus]?.label}
            </span>
        </div>
        <p className='text-xs text-gray-500'>{vehicle.adminStatus}</p>
    </div>

    {/* auction & pricing summary card */}
    <div className='bg-white rounded-xl border border-gray-200 p-5'>
        <h3 className='text-sm font-semibold text-[#0B1E3D] mb-4'>Auction & Pricing Summary</h3>
        <div className='space-y-3'>
            <div className='flex justify-between text-sm'>
                <span className='text-gray-500'>Current Bid</span>
                <span className='font-medium text-[#0B1E3D]'>{vehicle.currentBid ?? "---"}</span>
            </div>
            <div className='flex justify-between text-sm'>
                <span className='text-gray-500'>Buy Now Price</span>
                <span className='font-medium text-[#0B1E3D]'>{vehicle.buyNowPrice ?? "---"}</span>
            </div>
            <div className='flex justify-between text-sm'>
                <span className='text-gray-500'>Reserve Price</span>
                <span className='font-medium text-[#0B1E3D]'>{vehicle.reservePrice ?? "---"}</span>
            </div>
            <div className='flex justify-between text-sm'>
                <span className='text-gray-500'>Auction Type</span>
                <span className='font-medium text-green-600'>{vehicle.auctionType}</span>
            </div>
            <div className='flex justify-between text-sm'>
                <span className='text-gray-500'>Views</span>
                <span className='font-medium text-[#0B1E3D]'>{vehicle.views}</span>
            </div>
            {vehicle.auctionEndDateTime && (
                <div className='flex justify-between text-sm'>
                    <span className='text-gray-500'>Ends</span>
                    <span className='font-medium text-[#0B1E3D]'>
                        {new Date(vehicle.auctionEndDateTime).toLocaleDateString('en-GB')} • {new Date(vehicle.auctionEndDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            )}
        </div>
    </div>

    {/* actions card */}
    <div className='bg-white rounded-xl border border-gray-200 p-5'>
        <h3 className='text-sm font-semibold text-[#0B1E3D] mb-2'>Actions</h3>

        <div className='space-y-1.5'>
            <button
                onClick={() => setCurrentPage('edit-vehicle', vehicle._id)}
                className='w-full flex items-center gap-3 rounded-lg p-3 text-left hover:bg-gray-50'
            >
                <Edit3 className='h-4 w-4 text-[#D97706] shrink-0' />

                <div>
                    <p className='text-[13px] font-medium text-[#0B1E3D]'>
                        Edit Listing
                    </p>
                    <p className='text-xs text-gray-400'>
                        Update your vehicle information
                    </p>
                </div>
            </button>

            <button
                className='w-full flex items-center gap-3 rounded-lg p-3 text-left hover:bg-gray-50'
            >
                <Copy className='h-4 w-4 text-[#D97706] shrink-0' />

                <div>
                    <p className='text-[13px] font-medium text-[#0B1E3D]'>
                        Duplicate Listing
                    </p>
                    <p className='text-xs text-gray-400'>
                        Create a copy of this listing
                    </p>
                </div>
            </button>

            <button
                className='w-full flex items-center gap-3 rounded-lg p-3 text-left hover:bg-red-50'
            >
                <Undo2 className='h-4 w-4 text-red-500 shrink-0' />

                <div>
                    <p className='text-[13px] font-medium text-red-600'>
                        Withdraw Listing
                    </p>
                    <p className='text-xs text-gray-400'>
                        Withdraw this listing from review
                    </p>
                </div>
            </button>
        </div>
    </div>

</div>
            </div>

        </div>
    );
}

export default MyVehiclesDetail;
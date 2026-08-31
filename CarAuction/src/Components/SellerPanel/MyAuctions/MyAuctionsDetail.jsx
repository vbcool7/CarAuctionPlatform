
import React, { useState } from 'react';
import { Download, File, Share2 } from 'lucide-react';
import { myVehiclesData } from '../SellerSharedComponents/SellerData';
import { UseCountdown } from '../SellerSharedComponents/useCountDown';

import { useVehicleDetail } from '../../../hook/useVehicle';
import { formatLabel, formatPrice } from '../../../utils/formatters';
import { useGetAuctionDetail } from '../../../hook/useAuction';
import { useGetVehicleBids } from '../../../hook/useBid';

const adminStatusLabels = {
    pending: { label: 'Pending Approval', className: 'bg-amber-100 text-amber-700' },
    approved: { label: 'Approved', className: 'bg-green-100 text-green-700' },
    rejected: { label: 'Rejected', className: 'bg-red-100 text-red-700' },
};

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

function MyAuctionsDetail({ setCurrentPage, auctionId }) {

    const [activeTab, setActiveTab] = useState('overview');
    const [selectedImage, setSelectedImage] = useState(0);
    const [page, setPage] = useState(1);

    const { data: vehicleBidsData } = useGetVehicleBids();
    const { data: auctionData, isLoading, isError } = useGetAuctionDetail(auctionId);

    const totalPages = vehicleBidsData?.pagination?.totalPages || 1;
    const vehicle = auctionData?.data;

    const tabs = [
        { key: 'overview', label: 'Overview' },
        { key: 'bids', label: 'Bids' },
        { key: 'watchers', label: 'Watchers' },
        { key: 'vehicle-details', label: 'Vehicle Details' },
        { key: 'images', label: `Images (${vehicle?.images?.length || 0})` },
        { key: 'documents', label: `Documents (${vehicle?.documents?.length || 0})` },
    ];

    const auctionStatusContent = {
        upcoming: {
            heading: "This auction hasn't started yet.",
            countdownLabel: 'Starts In',
            targetDateTime: vehicle?.auctionStartDateTime,
            showCountdown: true,
            primaryAction: null,
        },
        live: {
            heading: 'This auction is currently live. Place your bid before it ends.',
            countdownLabel: 'Auction Ends In',
            targetDateTime: vehicle?.auctionEndDateTime,
            showCountdown: true,
            primaryAction: 'End Auction',
        },
        sold: { heading: 'This auction has ended — vehicle sold.', showCountdown: false, primaryAction: 'View Payout' },
        unsold: { heading: 'This auction ended with no bids.', showCountdown: false, primaryAction: 'Relist Vehicle' },
        'reserve-not-met': { heading: "Reserve price wasn't met. Vehicle wasn't sold.", showCountdown: false, primaryAction: 'Relist Vehicle' },
        canceled: { heading: 'This auction was canceled.', showCountdown: false, primaryAction: null },
    };

    const statusInfo = auctionStatusContent[vehicle?.auctionStatus];

    const countdown = UseCountdown(statusInfo?.showCountdown ? statusInfo.targetDateTime : null);

    const hasCurrentBid =
        vehicle?.currentBid !== null && vehicle?.currentBid !== undefined;

    const bidLabel = hasCurrentBid ? "Current Bid" : "Starting Bid";

    const bidValue = hasCurrentBid
        ? vehicle?.currentBid
        : vehicle?.startingBidPrice;

    if (isLoading) return <p className="p-10 text-center">Loading auction details....</p>;
    if (isError) return <p className="p-10 text-center text-red-500">Failed to load auction details</p>;

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
                            <div className='flex flex-col gap-4'>
                                <div className='flex items-start justify-between gap-2'>
                                    <h2 className='text-lg md:text-xl font-bold text-[#0B1E3D]'>
                                        {vehicle.year} {formatLabel(vehicle.make)} {formatLabel(vehicle.model)}
                                    </h2>
                                </div>

                                <div className='grid grid-cols-2 gap-y-4 gap-x-2'>
                                    <div>
                                        <p className='text-xs text-gray-400'>Drive Type</p>
                                        <p className='text-sm font-medium text-[#0B1E3D]'>{formatLabel(vehicle.drivetrain || "---")}</p>
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
                                        <p className='text-sm font-medium text-[#0B1E3D]'>{formatLabel(vehicle.titleStatus?.replace("_", " ") || "---")}</p>
                                    </div>
                                    <div>
                                        <p className='text-xs text-gray-400'>Location</p>
                                        <p className='text-sm font-medium text-[#0B1E3D]'>{formatLabel(vehicle.city)}, {formatLabel(vehicle.emirate?.replaceAll("_", " "))}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className='text-xs text-gray-400'>VIN</p>
                                    <p className='text-sm font-medium text-[#0B1E3D]'>{formatLabel(vehicle.vin)}</p>
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
                                                {formatLabel(vehicle.titleStatus || '----')}
                                            </p>
                                        </div>

                                        <div>
                                            <p className='text-xs text-gray-400'>Drive Type</p>
                                            <p className='text-sm font-medium text-[#0B1E3D] uppercase'>
                                                {formatLabel(vehicle.drivetrain || '----')}
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
                                                {formatLabel(vehicle.city) || '----'}
                                                {vehicle.emirate && `, ${formatLabel(vehicle.emirate)}`}

                                            </p>
                                        </div>

                                        <div>
                                            <p className='text-xs text-gray-400'>Vehicle Type</p>
                                            <p className='text-sm font-medium text-[#0B1E3D] capitalize'>
                                                {formatLabel(vehicle.vehicleType)}
                                            </p>
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

                                    {/* {myVehicles.bidsList?.length > 0 ? (
                                        <div className='overflow-x-auto'>
                                            <table className='w-full text-sm'>
                                                <thead>
                                                    <tr className='text-left text-xs text-gray-400 border-b border-gray-100'>
                                                        <th className='py-2 font-medium'>Bidder</th>
                                                        <th className='py-2 font-medium'>Bid Amount</th>
                                                        <th className='py-2 font-medium'>Bid Time</th>
                                                        <th className='py-2 font-medium'>Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {myVehicles.bidsList.map((b, index) => (
                                                        <tr key={index} className='border-b border-gray-50'>
                                                            <td className='py-3'>
                                                                <div className='flex items-center gap-2'>
                                                                    <div className='w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-700'>
                                                                        {b.bidderInitials}
                                                                    </div>
                                                                    <div>
                                                                        <p className='font-medium text-[#0B1E3D]'>{b.bidderName}</p>
                                                                        <p className='text-xs text-gray-400'>Bidder ID: {b.id}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className='py-3'>
                                                                <div className='flex items-center gap-2'>
                                                                    <span className='font-semibold text-[#0B1E3D]'>{b.amount}</span>
                                                                    {b.isHighest && (
                                                                        <span className='text-[10px] font-medium text-green-600'>Highest Bid</span>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className='py-3'>
                                                                <p className='text-[#0B1E3D]'>{b.time}</p>
                                                                <p className='text-xs text-gray-400'>{b.timeAgo}</p>
                                                            </td>
                                                            <td className='py-3'>
                                                                <span className={`px-2 py-1 text-[10px] font-medium rounded-full ${b.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                                                    }`}>
                                                                    {b.status === 'active' ? 'Active' : 'Outbid'}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <p className='text-sm text-gray-400'>No bids placed yet.</p>
                                    )} */}
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

                            {activeTab === 'vehicle-details' && (
                                <div className='space-y-8'>

                                    {/* Basic Info */}
                                    <div>
                                        <h3 className='text-sm font-semibold text-[#0B1E3D] mb-4'>
                                            Basic Information
                                        </h3>

                                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8'>
                                            <div>
                                                <p className='text-xs text-gray-400'>VIN</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>
                                                    {vehicle.vin}
                                                </p>
                                            </div>

                                            <div>
                                                <p className='text-xs text-gray-400'>Title Status</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>
                                                    {formatLabel(vehicle.titleStatus)}
                                                </p>
                                            </div>

                                            <div>
                                                <p className='text-xs text-gray-400'>Drive Type</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>
                                                    {formatLabel(vehicle.drivetrain)}
                                                </p>
                                            </div>

                                            <div>
                                                <p className='text-xs text-gray-400'>Engine</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>
                                                    {vehicle.engineSize} • {vehicle.cylinders}-Cylinder
                                                </p>
                                            </div>

                                            <div>
                                                <p className='text-xs text-gray-400'>Seating Capacity</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>
                                                    {vehicle.seats}
                                                </p>
                                            </div>

                                            <div>
                                                <p className='text-xs text-gray-400'>Doors</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>
                                                    {vehicle.doors}
                                                </p>
                                            </div>

                                            <div>
                                                <p className='text-xs text-gray-400'>Location</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>
                                                    {vehicle.city}, {formatLabel(vehicle.emirate)}
                                                </p>
                                            </div>

                                            <div>
                                                <p className='text-xs text-gray-400'>Accident History</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>
                                                    {formatLabel(vehicle.accidentHistory)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Condition */}
                                    <div>
                                        <h3 className='text-sm font-semibold text-[#0B1E3D] mb-4'>
                                            Condition
                                        </h3>

                                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8'>
                                            <div>
                                                <p className='text-xs text-gray-400'>Overall Condition</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>
                                                    {formatLabel(vehicle.overallCondition)}
                                                </p>
                                            </div>

                                            <div>
                                                <p className='text-xs text-gray-400'>Exterior Condition</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>
                                                    {formatLabel(vehicle.exteriorCondition)}
                                                </p>
                                            </div>

                                            <div>
                                                <p className='text-xs text-gray-400'>Interior Condition</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>
                                                    {formatLabel(vehicle.interiorCondition)}
                                                </p>
                                            </div>

                                            <div>
                                                <p className='text-xs text-gray-400'>Mechanical Condition</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>
                                                    {formatLabel(vehicle.mechanicalCondition)}
                                                </p>
                                            </div>

                                            <div>
                                                <p className='text-xs text-gray-400'>Repainted</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>
                                                    {formatLabel(vehicle.repainted)}
                                                </p>
                                            </div>

                                            <div>
                                                <p className='text-xs text-gray-400'>Smoke Odor</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>
                                                    {formatLabel(vehicle.smokeOdor)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Exterior & Interior */}
                                    <div>
                                        <h3 className='text-sm font-semibold text-[#0B1E3D] mb-4'>
                                            Exterior & Interior
                                        </h3>

                                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8'>
                                            <div>
                                                <p className='text-xs text-gray-400'>Paint Type</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>
                                                    {formatLabel(vehicle.paintType)}
                                                </p>
                                            </div>

                                            <div>
                                                <p className='text-xs text-gray-400'>Tire Brand / Size</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>
                                                    {vehicle.tireBrand} • {vehicle.tireSize}
                                                </p>
                                            </div>

                                            <div>
                                                <p className='text-xs text-gray-400'>Seat Material</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>
                                                    {formatLabel(vehicle.seatMaterial)}
                                                </p>
                                            </div>

                                            <div>
                                                <p className='text-xs text-gray-400'>Interior Color</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>
                                                    {formatLabel(vehicle.interiorColor)}
                                                </p>
                                            </div>

                                            <div>
                                                <p className='text-xs text-gray-400'>Number of Keys</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>
                                                    {vehicle.numberOfKeys}
                                                </p>
                                            </div>

                                            <div>
                                                <p className='text-xs text-gray-400'>Sunroof</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>
                                                    {formatLabel(vehicle.sunroof)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    {vehicle.vehicleDescription && (
                                        <div>
                                            <h3 className='text-sm font-semibold text-[#0B1E3D] mb-2'>
                                                Description
                                            </h3>
                                            <p className='text-sm text-gray-600'>
                                                {vehicle.vehicleDescription}
                                            </p>
                                        </div>
                                    )}
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

                        {statusInfo?.primaryAction === 'End Auction' && (
                            <button className='w-full mt-2 py-2.5 text-xs font-semibold rounded-lg border border-red-200 text-red-600 hover:bg-red-50'>
                                End Auction
                            </button>
                        )}
                        {statusInfo?.primaryAction && statusInfo.primaryAction !== 'End Auction' && (
                            <button className='w-full mt-2 py-2.5 text-xs font-semibold rounded-lg bg-[#D97706] text-white hover:bg-[#B45309]'>
                                {statusInfo.primaryAction}
                            </button>
                        )}
                    </div>

                    {/* auction summary */}
                    <div className='bg-white rounded-xl border border-gray-200 p-5'>
                        <h3 className='text-sm font-semibold text-[#0B1E3D] mb-4'>
                            Auction Summary
                        </h3>

                        <div className='space-y-3 text-sm'>

                            <div className='flex justify-between'>
                                <span className='text-gray-500'>
                                    {vehicle.auctionStatus === 'upcoming'
                                        ? 'Starting Bid'
                                        : 'Current Bid'}
                                </span>

                                <span
                                    className={`font-medium ${vehicle.auctionStatus === 'live'
                                        ? 'text-green-600'
                                        : 'text-[#0B1E3D]'
                                        }`}
                                >
                                    {vehicle.auctionStatus === 'upcoming'
                                        ? (formatPrice(vehicle.startingBidPrice ?? '—'))
                                        : (formatPrice(vehicle.currentBid ?? '—'))}
                                </span>
                            </div>

                            <div className='flex justify-between'>
                                <span className='text-gray-500'>Reserve Price</span>
                                <span className='font-medium text-[#0B1E3D]'>
                                    {formatPrice(vehicle.reservePrice ?? '—')}
                                </span>
                            </div>

                            {vehicle.priceType === 'fixed_price' && (
                                <div className='flex justify-between'>
                                    <span className='text-gray-500'>Buy Now Price</span>
                                    <span className='font-medium text-[#0B1E3D]'>
                                        {vehicle.buyNowPrice ?? '—'}
                                    </span>
                                </div>
                            )}

                            <div className='flex justify-between'>
                                <span className='text-gray-500'>Total Bids</span>
                                <span className='font-medium text-[#0B1E3D]'>
                                    {vehicle.bids ?? 0}
                                </span>
                            </div>

                            <div className='flex justify-between'>
                                <span className='text-gray-500'>Watchers</span>
                                <span className='font-medium text-[#0B1E3D]'>
                                    {vehicle.watchers ?? 0}
                                </span>
                            </div>

                            {/* sirf 'sold' status mein relevant */}
                            {vehicle.auctionStatus === 'sold' && vehicle.currentBid != null && (
                                <div className='flex justify-between pt-3 border-t border-gray-100'>
                                    <span className='text-gray-500'>Final Sale Price</span>
                                    <span className='font-semibold text-green-600'>
                                        {vehicle.currentBid}
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

        </div>
    )
}

export default MyAuctionsDetail;
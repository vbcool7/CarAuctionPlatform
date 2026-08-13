
import React, { useState } from 'react';
import { Download, Share2 } from 'lucide-react';
import { myVehiclesData } from '../SellerSharedComponents/SellerData';
import { UseCountdown } from '../SellerSharedComponents/useCountDown';

const adminStatusLabels = {
    pending: { label: 'Pending Approval', className: 'bg-amber-100 text-amber-700' },
    approved: { label: 'Approved', className: 'bg-green-100 text-green-700' },
    rejected: { label: 'Rejected', className: 'bg-red-100 text-red-700' },
};

const auctionPhaseLabels = {
    draft: { label: 'Draft', className: 'bg-gray-100 text-gray-700' },
    upcoming: { label: 'Upcoming', className: 'bg-blue-100 text-blue-700' },
    live: { label: 'Live Auction', className: 'bg-green-100 text-green-700' },
    sold: { label: 'Sold', className: 'bg-purple-100 text-purple-700' },
    unsold: { label: 'Unsold', className: 'bg-gray-100 text-gray-700' },
    'reserve-not-met': { label: 'Reserve Not Met', className: 'bg-red-100 text-red-700' },
    canceled: { label: 'Canceled', className: 'bg-red-100 text-red-700' },
};

function MyAuctionsDetail({ setCurrentPage, auctionId }) {

    const myVehicles = myVehiclesData.find((item) => item.id === auctionId);

    const [activeTab, setActiveTab] = useState('overview');

    const tabs = [
        { key: 'overview', label: 'Overview' },
        { key: 'bids', label: 'Bids' },
        { key: 'watchers', label: 'Watchers' },
        { key: 'vehicle-details', label: 'Vehicle Details' },
        { key: 'images', label: 'Images' },
        { key: 'documents', label: 'Documents' },
    ];

    const auctionStatusContent = {
        upcoming: {
            heading: "This auction hasn't started yet.",
            countdownLabel: 'Starts In',
            targetDateTime: `${myVehicles.auctionStartDate}T${myVehicles.auctionStartTime}`,
            showCountdown: true,
            primaryAction: null,
        },
        live: {
            heading: 'This auction is currently live. Place your bid before it ends.',
            countdownLabel: 'Auction Ends In',
            targetDateTime: myVehicles.auctionEndDateTime, // flag: field naam confirm karna hai
            showCountdown: true,
            primaryAction: 'End Auction',
        },
        sold: {
            heading: 'This auction has ended — vehicle sold.',
            showCountdown: false,
            primaryAction: 'View Payout',
        },
        unsold: {
            heading: 'This auction ended with no bids.',
            showCountdown: false,
            primaryAction: 'Relist Vehicle',
        },
        'reserve-not-met': {
            heading: "Reserve price wasn't met. Vehicle wasn't sold.",
            showCountdown: false,
            primaryAction: 'Relist Vehicle',
        },
    };

    const statusInfo = auctionStatusContent[myVehicles.auctionStatus];
    const countdown = UseCountdown(statusInfo?.showCountdown ? statusInfo.targetDateTime : null);

    if (!myVehicles) {
        return (
            <div className='pb-6'>
                <p className='text-sm text-gray-600'>Vehicle not found.</p>
            </div>
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
                            {/* cover image + thumbnails */}
                            <div>
                                <div className='relative rounded-xl overflow-hidden h-64 md:h-72 bg-gray-100'>
                                    <img
                                        src={myVehicles.images?.[0]?.previewUrl || myVehicles.image}
                                        alt={myVehicles.name}
                                        className='w-full h-full object-cover'
                                    />
                                    <div className='absolute top-3 left-3 flex items-center gap-1 bg-black/60 text-white text-xs px-2 py-1 rounded-md'>
                                        {myVehicles.images?.length || 0} Photos
                                    </div>
                                </div>

                                <div className='grid grid-cols-6 gap-2 mt-3'>
                                    {myVehicles.images?.slice(1, 6).map((img, index) => (
                                        <img
                                            key={index}
                                            src={img.previewUrl}
                                            alt={`Vehicle ${index + 2}`}
                                            className='h-14 w-full rounded-lg object-cover cursor-pointer border-2 border-transparent hover:border-[#D97706]'
                                        />
                                    ))}

                                    {myVehicles.images?.length > 6 && (
                                        <button
                                            onClick={() => setActiveTab('images')}
                                            className='h-14 w-full rounded-lg bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600 hover:bg-gray-200'
                                        >
                                            +{myVehicles.images.length - 6} More
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* title + quick specs */}
                            <div className='flex flex-col gap-4'>
                                <div className='flex items-start justify-between gap-2'>
                                    <h2 className='text-lg md:text-xl font-bold text-[#0B1E3D]'>
                                        {myVehicles.name}
                                    </h2>

                                    <div className='flex items-center gap-2'>

                                        <div className='flex items-center gap-2'>

                                            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${auctionPhaseLabels[myVehicles.auctionStatus]?.className}`}>
                                                {auctionPhaseLabels[myVehicles.auctionStatus]?.label}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className='grid grid-cols-2 gap-y-4 gap-x-2'>
                                    <div>
                                        <p className='text-xs text-gray-400'>Drive Type</p>
                                        <p className='text-sm font-medium text-[#0B1E3D]'>{myVehicles.driveType}</p>
                                    </div>
                                    <div>
                                        <p className='text-xs text-gray-400'>Engine</p>
                                        <p className='text-sm font-medium text-[#0B1E3D]'>{myVehicles.engineSize} • {myVehicles.cylinders}-Cyl</p>
                                    </div>
                                    <div>
                                        <p className='text-xs text-gray-400'>Seats</p>
                                        <p className='text-sm font-medium text-[#0B1E3D]'>{myVehicles.seats}</p>
                                    </div>
                                    <div>
                                        <p className='text-xs text-gray-400'>Doors</p>
                                        <p className='text-sm font-medium text-[#0B1E3D]'>{myVehicles.doors}</p>
                                    </div>
                                    <div>
                                        <p className='text-xs text-gray-400'>Title Status</p>
                                        <p className='text-sm font-medium text-[#0B1E3D]'>{myVehicles.titleStatus}</p>
                                    </div>
                                    <div>
                                        <p className='text-xs text-gray-400'>Location</p>
                                        <p className='text-sm font-medium text-[#0B1E3D]'>{myVehicles.city}, {myVehicles.emirate}</p>
                                    </div>
                                </div>

                                <div className='pt-2 border-t border-gray-100'>
                                    <p className='text-sm font-medium text-[#0B1E3D]'>{myVehicles.vin}</p>
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
                                        <h3 className='text-sm font-semibold text-[#0B1E3D] mb-2'>Vehicle Description</h3>
                                        <p className='text-sm text-gray-600'>{myVehicles.description}</p>
                                    </div>

                                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4'>
                                        <div>
                                            <p className='text-xs text-gray-400'>Title Status</p>
                                            <p className='text-sm font-medium text-[#0B1E3D]'>{myVehicles.titleStatus || '----'}</p>
                                        </div>
                                        <div>
                                            <p className='text-xs text-gray-400'>Drive Type</p>
                                            <p className='text-sm font-medium text-[#0B1E3D]'>{myVehicles.driveType}</p>
                                        </div>
                                        <div>
                                            <p className='text-xs text-gray-400'>Accident History</p>
                                            <p className='text-sm font-medium text-[#0B1E3D]'>{myVehicles.accidentHistory}</p>
                                        </div>
                                        <div>
                                            <p className='text-xs text-gray-400'>Engine</p>
                                            <p className='text-sm font-medium text-[#0B1E3D]'>{myVehicles.engineSize} • {myVehicles.cylinders}-Cylinder</p>
                                        </div>
                                        <div>
                                            <p className='text-xs text-gray-400'>Seating Capacity</p>
                                            <p className='text-sm font-medium text-[#0B1E3D]'>{myVehicles.seats}</p>
                                        </div>
                                        <div>
                                            <p className='text-xs text-gray-400'>Doors</p>
                                            <p className='text-sm font-medium text-[#0B1E3D]'>{myVehicles.doors}</p>
                                        </div>
                                        <div>
                                            <p className='text-xs text-gray-400'>Location</p>
                                            <p className='text-sm font-medium text-[#0B1E3D]'>{myVehicles.city}, {myVehicles.emirate}</p>
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

                                    {myVehicles.bidsList?.length > 0 ? (
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
                                    )}
                                </div>
                            )}

                            {activeTab === 'watchers' && (
                                <div className='space-y-4'>
                                    <div className='flex items-center justify-between'>
                                        <p className='text-xs text-gray-500'>People who are watching this auction.</p>
                                        <button className='flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300'>
                                            {/* download icon */}
                                            Export Watchers
                                        </button>
                                    </div>

                                    {myVehicles.watchersList?.length > 0 ? (
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
                                    )}
                                </div>
                            )}

                            {activeTab === 'vehicle-details' && (
                                <div className='space-y-8'>

                                    {/* Basic Info */}
                                    <div>
                                        <h3 className='text-sm font-semibold text-[#0B1E3D] mb-4'>Basic Information</h3>
                                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8'>
                                            <div>
                                                <p className='text-xs text-gray-400'>VIN</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>{myVehicles.vin}</p>
                                            </div>
                                            <div>
                                                <p className='text-xs text-gray-400'>Title Status</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>{myVehicles.titleStatus}</p>
                                            </div>
                                            <div>
                                                <p className='text-xs text-gray-400'>Drive Type</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>{myVehicles.driveType}</p>
                                            </div>
                                            <div>
                                                <p className='text-xs text-gray-400'>Engine</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>{myVehicles.engineSize} • {myVehicles.cylinders}-Cylinder</p>
                                            </div>
                                            <div>
                                                <p className='text-xs text-gray-400'>Seating Capacity</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>{myVehicles.seats}</p>
                                            </div>
                                            <div>
                                                <p className='text-xs text-gray-400'>Doors</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>{myVehicles.doors}</p>
                                            </div>
                                            <div>
                                                <p className='text-xs text-gray-400'>Location</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>{myVehicles.city}, {myVehicles.emirate}</p>
                                            </div>
                                            <div>
                                                <p className='text-xs text-gray-400'>Accident History</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>{myVehicles.accidentHistory}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Condition */}
                                    <div>
                                        <h3 className='text-sm font-semibold text-[#0B1E3D] mb-4'>Condition</h3>
                                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8'>
                                            <div>
                                                <p className='text-xs text-gray-400'>Overall Condition</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>{myVehicles.overallCondition}</p>
                                            </div>
                                            <div>
                                                <p className='text-xs text-gray-400'>Exterior Condition</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>{myVehicles.exteriorCondition}</p>
                                            </div>
                                            <div>
                                                <p className='text-xs text-gray-400'>Interior Condition</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>{myVehicles.interiorCondition}</p>
                                            </div>
                                            <div>
                                                <p className='text-xs text-gray-400'>Mechanical Condition</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>{myVehicles.mechanicalCondition}</p>
                                            </div>
                                            <div>
                                                <p className='text-xs text-gray-400'>Repainted</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>{myVehicles.repainted}</p>
                                            </div>
                                            <div>
                                                <p className='text-xs text-gray-400'>Smoke Odor</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>{myVehicles.smokeOdor}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Exterior & Interior */}
                                    <div>
                                        <h3 className='text-sm font-semibold text-[#0B1E3D] mb-4'>Exterior & Interior</h3>
                                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8'>
                                            <div>
                                                <p className='text-xs text-gray-400'>Paint Type</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>{myVehicles.paintType}</p>
                                            </div>
                                            <div>
                                                <p className='text-xs text-gray-400'>Tire Brand / Size</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>{myVehicles.tireBrand} • {myVehicles.tireSize}</p>
                                            </div>
                                            <div>
                                                <p className='text-xs text-gray-400'>Seat Material</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>{myVehicles.seatMaterial}</p>
                                            </div>
                                            <div>
                                                <p className='text-xs text-gray-400'>Interior Color</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>{myVehicles.interiorColor}</p>
                                            </div>
                                            <div>
                                                <p className='text-xs text-gray-400'>Number of Keys</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>{myVehicles.numberOfKeys}</p>
                                            </div>
                                            <div>
                                                <p className='text-xs text-gray-400'>Sunroof</p>
                                                <p className='text-sm font-medium text-[#0B1E3D]'>{myVehicles.sunroof}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    {myVehicles.description && (
                                        <div>
                                            <h3 className='text-sm font-semibold text-[#0B1E3D] mb-2'>Description</h3>
                                            <p className='text-sm text-gray-600'>{myVehicles.description}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'images' && (
                                <div>
                                    <p className='text-xs text-gray-500 mb-4'>
                                        All images uploaded for this vehicle listing.
                                    </p>

                                    {myVehicles.images?.length > 0 ? (
                                        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
                                            {myVehicles.images.map((img, index) => (
                                                <div key={index} className='relative'>
                                                    <img
                                                        src={img.previewUrl}
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
                                    {myVehicles.documents?.length > 0 ? (
                                        <div className='space-y-3'>
                                            {myVehicles.documents.map((doc, index) => (
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
                                                            {doc.docType}
                                                        </p>
                                                    </div>

                                                    <div className='flex gap-2'>
                                                        <a
                                                            href={doc.previewUrl}
                                                            target='_blank'
                                                            rel='noreferrer'
                                                            className='px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300'
                                                        >
                                                            View
                                                        </a>

                                                        <a
                                                            href={doc.previewUrl}
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

                    {/* count down */}
                    <div className='bg-white rounded-xl border border-gray-200 p-5'>
                        <div className='flex items-center justify-between mb-2'>
                            <h3 className='text-sm font-semibold text-[#0B1E3D]'>Auction Status</h3>
                            <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-md ${auctionPhaseLabels[myVehicles.auctionStatus]?.className}`}>
                                {auctionPhaseLabels[myVehicles.auctionStatus]?.label}
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
                        <h3 className='text-sm font-semibold text-[#0B1E3D] mb-4'>Auction Summary</h3>
                        <div className='space-y-3 text-sm'>

                            <div className='flex justify-between'>
                                <span className='text-gray-500'>
                                    {myVehicles.auctionStatus === 'upcoming' ? 'Starting Bid' : 'Current Bid'}
                                </span>
                                <span className={`font-medium ${myVehicles.auctionStatus === 'live' ? 'text-green-600' : 'text-[#0B1E3D]'}`}>
                                    {myVehicles.bid?.amount || '—'}
                                </span>
                            </div>

                            <div className='flex justify-between'>
                                <span className='text-gray-500'>Reserve Price</span>
                                <span className='font-medium text-[#0B1E3D]'>{myVehicles.reservePrice || '—'}</span>
                            </div>

                            <div className='flex justify-between'>
                                <span className='text-gray-500'>Buy Now Price</span>
                                <span className='font-medium text-[#0B1E3D]'>{myVehicles.buyPrice || '—'}</span>
                            </div>

                            <div className='flex justify-between'>
                                <span className='text-gray-500'>Total Bids</span>
                                <span className='font-medium text-[#0B1E3D]'>{myVehicles.bids ?? 0}</span>
                            </div>

                            <div className='flex justify-between'>
                                <span className='text-gray-500'>Watchers</span>
                                <span className='font-medium text-[#0B1E3D]'>{myVehicles.watchers ?? 0}</span>
                            </div>

                            {/* sirf 'sold' status mein relevant */}
                            {myVehicles.auctionStatus === 'sold' && myVehicles.finalSalePrice && (
                                <div className='flex justify-between pt-3 border-t border-gray-100'>
                                    <span className='text-gray-500'>Final Sale Price</span>
                                    <span className='font-semibold text-green-600'>{myVehicles.finalSalePrice}</span>
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
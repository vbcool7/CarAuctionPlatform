
import React, { useEffect, useState } from 'react';
import { CalendarDays, CircleDollarSign, Clock3, Copy, Eye, Gavel, MoreVertical, Plus, Users } from 'lucide-react';
import { myVehiclesData } from '../SellerSharedComponents/SellerData';
import SearchBar from '../SellerSharedComponents/SearchBar';
import FilterDropdown from '../SellerSharedComponents/FilterDropdown';

const tabs = [
    { key: 'active-auctions', label: 'Active Auctions' },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'ended', label: 'Ended' },
    { key: 'cancelled', label: 'Cancelled' },
];

const statusOptions = [
    { value: "", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "sold", label: "Sold" },
    { value: "pending", label: "Pending Approval" },
    { value: "draft", label: "Draft" },
];

const auctionTypeOptions = [
    { value: "", label: "All Auction Types" },
    { value: "live-auction", label: "Live Auction" },
    { value: "fixed-price", label: "Fixed Price" },
];

const dateOptions = [
    { value: "na", label: "NA" },
    { value: "na", label: "NA" },
];

function useCountdown(targetDate) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

    useEffect(() => {
        const interval = setInterval(() => {
            const diff = new Date(targetDate) - new Date();
            if (diff <= 0) {
                clearInterval(interval);
                setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
                return;
            }
            setTimeLeft({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                mins: Math.floor((diff / (1000 * 60)) % 60),
                secs: Math.floor((diff / 1000) % 60),
            });
        }, 1000);

        return () => clearInterval(interval); // cleanup — zaroori, warna memory leak
    }, [targetDate]);

    return timeLeft;
}

function MyAuctions({ setCurrentPage, setSelectedAuctionId }) {

    const [activeTab, setActiveTab] = useState('live');
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [auctionType, setAuctionType] = useState('');
    const [date, setDate] = useState('');

    const auctionVehicles = myVehiclesData.filter((v) => v.adminStatus === 'approved');

    const tabFilters = {
        live: (v) => v.auctionStatus === 'live',
        upcoming: (v) => v.auctionStatus === 'upcoming',
        ended: (v) => ['sold', 'unsold', 'reserve-not-met'].includes(v.auctionStatus),
        canceled: (v) => v.adminStatus === 'rejected', // pending confirm — sir se poochna hai
    };

    const tabs = [
        { key: 'live', label: 'Active Auctions', count: auctionVehicles.filter(tabFilters.live).length },
        { key: 'upcoming', label: 'Scheduled', count: auctionVehicles.filter(tabFilters.upcoming).length },
        { key: 'ended', label: 'Ended', count: auctionVehicles.filter(tabFilters.ended).length },
        { key: 'canceled', label: 'Canceled', count: auctionVehicles.filter(tabFilters.canceled).length },
    ];

    const filteredVehicles = auctionVehicles
        .filter(tabFilters[activeTab])
        .filter((v) => v.name?.toLowerCase().includes(search.toLowerCase()));

    const upcomingVehicle = auctionVehicles.find((v) => v.auctionStatus === 'upcoming');

    const useCountdown = (targetDateTime) => {
        const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

        useEffect(() => {
            if (!targetDateTime) return;
            const interval = setInterval(() => {
                const diff = new Date(targetDateTime) - new Date();
                if (diff <= 0) {
                    clearInterval(interval);
                    setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
                    return;
                }
                setTimeLeft({
                    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                    mins: Math.floor((diff / (1000 * 60)) % 60),
                    secs: Math.floor((diff / 1000) % 60),
                });
            }, 1000);
            return () => clearInterval(interval);
        }, [targetDateTime]);

        return timeLeft;
    };

    const countdown = useCountdown(
        upcomingVehicle ? `${upcomingVehicle.auctionStartDate}T${upcomingVehicle.auctionStartTime}` : null
    );

    return (
        <div className='pb-6 space-y-6'>

            {/* header */}
            <div className='w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0'>
                <div className='flex flex-col'>
                    <h1 className='text-xl md:text-2xl font-bold'>My Auctions</h1>
                    <p className='text-xs md:text-sm text-gray-600 p-px'>
                        Manage and track all your auction listings
                    </p>
                </div>

                <button
                    onClick={() => setCurrentPage('add-new-vehicle')}
                    className='inline-flex items-center gap-2 rounded-lg bg-[#D97706] px-3 py-2 sm:px-4 sm:py-2.5 text-sm font-semibold text-white hover:bg-[#B45309] transition-colors'
                >
                    <Plus className='h-4 w-4' />
                    List a Vehicle
                </button>
            </div>

            {/* tabs */}
            <div className='flex gap-9 border-b border-gray-200 overflow-x-auto no-scrollbar'>
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`py-3 text-xs md:text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.key
                            ? 'border-[#D97706] text-[#D97706]'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {tab.label} <span className='text-xs'>({tab.count})</span>
                    </button>
                ))}
            </div>

            {/* filter */}
            <div className="flex flex-wrap gap-3 py-4 px-4 border border-gray-300 bg-white/80 rounded-xl">
                <div className='flex-1 min-w-50'>
                    <SearchBar value={search} onChange={setSearch} placeholder="Search by make, model or VIN..." />
                </div>

                <div className='w-full sm:w-auto'>
                    <FilterDropdown label="All Status" options={statusOptions} value={status} onChange={setStatus} />
                </div>

                <div className='w-full sm:w-auto'>
                    <FilterDropdown label="All Auction Types" options={auctionTypeOptions} value={auctionType} onChange={setAuctionType} />
                </div>

                <div className='w-full sm:w-auto'>
                    <FilterDropdown label="All Dates" options={dateOptions} value={date} onChange={setDate} />
                </div>
            </div>

            {/* content grid */}
            <div className='grid grid-cols-1 xl:grid-cols-3 gap-6'>

                {/* left */}
                <div className='xl:col-span-2 space-y-6'>

                    {/* list */}
                    <div className='space-y-4'>
                        {filteredVehicles.length === 0 && (
                            <p className='text-sm text-gray-400 py-8 text-center'>No auctions in this category.</p>
                        )}

                        {filteredVehicles.map((vehicle) => (
                            <div
                                key={vehicle.id}
                                className='bg-white border border-gray-200 rounded-xl p-3 md:p-4 shadow-sm'
                            >
                                <div className='flex flex-col md:flex-row gap-4 items-start'>

                                    {/* Vehicle Image */}
                                    <div className='relative w-full md:w-40 lg:w-48 h-44 md:h-32 lg:h-36 shrink-0 rounded-lg overflow-hidden bg-gray-100'>
                                        <img
                                            src={vehicle.images?.[0]?.previewUrl || vehicle.image}
                                            alt={vehicle.name}
                                            className='w-full h-full object-cover'
                                        />

                                        <span
                                            className={`absolute top-2 left-2 px-2 py-1 rounded-md text-[10px] font-semibold 
                                                ${vehicle.auctionStatus === 'live'
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-blue-500 text-white'
                                                }`}
                                        >
                                            {vehicle.auctionStatus === 'live' ? 'Live' : 'Scheduled'}
                                        </span>

                                        <span className='absolute bottom-2 left-2 flex items-center gap-1 bg-black/70 text-white text-[10px] px-2 py-1 rounded-md'>
                                            <Eye className='w-3 h-3' />
                                            {vehicle.images?.length || 0} Photos
                                        </span>
                                    </div>

                                    {/* Vehicle Content */}
                                    <div className='flex-1 min-w-0 w-full'>

                                        {/* Title */}
                                        <div className='flex flex-wrap items-center gap-2 mb-4'>
                                            <h3 className='text-base md:text-lg font-bold text-[#0B1E3D]'>
                                                {vehicle.name}
                                            </h3>
                                            <span
                                                className={`text-[10px] font-semibold px-2 py-1 rounded-md ${vehicle.auctionStatus === 'live'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-blue-100 text-blue-600'
                                                    }`}
                                            >
                                                {vehicle.auctionType}
                                            </span>
                                        </div>

                                        {/* Stats — 4 items: 2 cols on mobile, 4 in a row from sm+ */}
                                        <div className='grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4'>
                                            <div>
                                                <div className='flex items-center gap-1.5 text-xs text-gray-500 mb-1'>
                                                    <Gavel className='w-3.5 h-3.5' />
                                                    {vehicle.auctionStatus === 'live' ? 'Current Bid' : 'Starting Bid'}
                                                </div>
                                                <p className='sm:pl-3 text-xs font-bold text-[#0B1E3D]'>
                                                    {vehicle.bid?.amount}
                                                </p>
                                            </div>

                                            <div>
                                                <div className='flex items-center gap-1.5 text-xs text-gray-500 mb-1'>
                                                    <CircleDollarSign className='w-3.5 h-3.5' />
                                                    Reserve Price
                                                </div>
                                                <p className='pl-3 text-xs font-bold text-[#0B1E3D]'>
                                                    {vehicle.reservePrice || '—'}
                                                </p>
                                            </div>

                                            <div>
                                                <div className='flex items-center gap-1.5 text-xs text-gray-500 mb-1'>
                                                    <Users className='w-3.5 h-3.5' />
                                                    Bids
                                                </div>
                                                <p className='text-xs font-bold text-[#0B1E3D]'>
                                                    {vehicle.bids ?? 0}
                                                </p>
                                            </div>

                                            <div>
                                                <div className='flex items-center gap-1.5 text-xs text-gray-500 mb-1'>
                                                    <Eye className='w-3.5 h-3.5' />
                                                    Watchers
                                                </div>
                                                <p className='text-xs font-bold text-[#0B1E3D]'>
                                                    {vehicle.watchers ?? 0}
                                                </p>
                                            </div>
                                        </div>

                                        <div className='border-t border-gray-100 pt-3'>
                                            <div className='flex gap-8'>

                                                {/* Auction Timing */}
                                                <div>
                                                    <div className='flex items-center gap-1.5 text-xs text-gray-500 mb-1'>
                                                        {vehicle.auctionStatus === 'live' ? (
                                                            <Clock3 className='w-3.5 h-3.5 text-amber-600' />
                                                        ) : (
                                                            <CalendarDays className='w-3.5 h-3.5 text-blue-500' />
                                                        )}
                                                        {vehicle.auctionStatus === 'live' ? 'Auction Ends' : 'Auction Starts'}
                                                    </div>

                                                    {vehicle.auctionStatus === 'live' ? (
                                                        <>
                                                            <p className='text-xs font-bold text-amber-600'>
                                                                {vehicle.timing?.timeLeft}
                                                            </p>
                                                            <p className='text-[10px] text-gray-400 mt-0.5'>
                                                                {vehicle.timing?.date}
                                                            </p>
                                                        </>
                                                    ) : (
                                                        <p className='text-xs font-semibold text-[#0B1E3D]'>
                                                            {vehicle.auctionStartDate} {vehicle.auctionStartTime}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Listing ID / Duration */}
                                                <div>
                                                    <div className='flex items-center gap-1.5 text-xs text-gray-500 mb-1'>
                                                        {vehicle.auctionStatus === 'live' ? 'Listing ID' : 'Duration'}
                                                    </div>

                                                    {vehicle.auctionStatus === 'live' ? (
                                                        <div className='flex items-center gap-2'>
                                                            <p className='text-xs font-semibold text-[#0B1E3D]'>
                                                                {vehicle.id}
                                                            </p>
                                                            <Copy className='w-3.5 h-3.5 text-gray-400 cursor-pointer hover:text-[#D97706]' />
                                                        </div>
                                                    ) : (
                                                        <p className='text-xs font-semibold text-[#0B1E3D]'>
                                                            {vehicle.auctionDuration}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className='w-full md:w-30 shrink-0 flex md:flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-3 md:pt-0 md:pl-4'>
                                        <button
                                            onClick={() => {
                                                setSelectedAuctionId(vehicle.id)
                                                setCurrentPage('my-auctions-detail')
                                            }}
                                            className='flex-1 md:w-full flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-2 py-2.5 text-xs font-semibold text-[#0B1E3D] hover:bg-gray-50 transition'
                                        >
                                            {vehicle.auctionStatus === 'live' ? 'View Auction' : 'View Details'}
                                        </button>

                                        <button className='flex items-center justify-center rounded-lg border border-gray-200 px-3 py-2.5 text-gray-600 hover:bg-gray-50 transition'>
                                            <MoreVertical className='w-4 h-4' />
                                        </button>
                                    </div>
                                </div>

                                {/* Tags */}
                                <div className='flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100'>
                                    {[vehicle.vehicleType, vehicle.transmission, vehicle.driveType, `${vehicle.mileage} miles`, vehicle.fuelType]
                                        .filter(Boolean)
                                        .map((tag, index) => (
                                            <span key={index} className='px-3 py-1 rounded-md bg-gray-50 text-[10px] sm:text-xs font-medium text-gray-500'>
                                                {tag}
                                            </span>
                                        ))}
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

                {/* right  */}
                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6'>

                    {/* Upcoming Auction */}
                    <div className='bg-white rounded-xl border border-gray-200 p-5'>
                        <div className='flex items-center justify-between mb-3'>
                            <h3 className='text-sm font-semibold text-[#0B1E3D]'>Upcoming Auction</h3>
                            {/* <button
                                onClick={() => setActiveTab('upcoming')}
                                className='text-xs text-[#D97706] font-medium'
                            >
                                View All
                            </button> */}
                        </div>

                        {upcomingVehicle ? (
                            <>
                                <div className='flex gap-3'>
                                    <img
                                        src={upcomingVehicle.images?.[0]?.previewUrl || upcomingVehicle.image}
                                        alt={upcomingVehicle.name}
                                        className='w-16 h-16 rounded-lg object-cover shrink-0'
                                    />
                                    <div>
                                        <p className='text-sm font-medium text-[#0B1E3D]'>{upcomingVehicle.name}</p>
                                        <span className='inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-100 text-blue-600'>
                                            Scheduled
                                        </span>
                                    </div>
                                </div>

                                <p className='text-xs text-gray-500 mt-4 mb-2'>Starts in:</p>
                                <div className='grid grid-cols-4 gap-2 text-center'>
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

                                <p className='text-xs text-gray-500 mt-3'>
                                    Starts on {upcomingVehicle.auctionStartDate} at {upcomingVehicle.auctionStartTime}
                                </p>

                                <button
                                    onClick={() => {
                                        setSelectedAuctionId(upcomingVehicle.id)
                                        setCurrentPage('my-auctions-detail')
                                    }}
                                    className='w-full mt-4 py-2.5 text-xs font-semibold rounded-lg border border-gray-200 hover:bg-gray-50'
                                >
                                    View Details
                                </button>
                            </>
                        ) : (
                            <p className='text-sm text-gray-400'>No upcoming auctions.</p>
                        )}
                    </div>

                    {/* Auction Activity — static placeholder, real backend event-feed abhi nahi bana */}
                    <div className='bg-white rounded-xl border border-gray-200 p-5'>
                        <div className='flex items-center justify-between mb-3'>
                            <h3 className='text-sm font-semibold text-[#0B1E3D]'>Auction Activity</h3>
                            <span className='text-xs text-[#D97706] font-medium'>View All</span>
                        </div>

                        <div className='space-y-3'>
                            {[
                                { color: 'bg-green-500', text: 'New highest bid on 2021 BMW X5 $32,000 by John D.', time: '10 minutes ago' },
                                { color: 'bg-blue-500', text: 'You have a new watcher on 2021 BMW X5', time: '25 minutes ago' },
                                { color: 'bg-orange-500', text: 'Auction for 2018 Toyota Camry has ended', time: '2 hours ago' },
                                { color: 'bg-gray-400', text: 'You listed 2020 Audi Q7 for auction', time: '1 day ago' },
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

                    {/* Need Help */}
                    <div className='bg-white rounded-xl border border-gray-200 p-5'>
                        <h3 className='text-sm font-semibold text-[#0B1E3D] mb-1'>Need Help?</h3>
                        <p className='text-xs text-gray-500 mb-3'>
                            If you have any questions regarding your auctions, our support team is here to help.
                        </p>
                        <button
                            onClick={() => setCurrentPage('support')}
                            className='w-full py-2.5 text-xs font-semibold rounded-lg border border-gray-200 hover:bg-gray-50'
                        >
                            Contact Support
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default MyAuctions;
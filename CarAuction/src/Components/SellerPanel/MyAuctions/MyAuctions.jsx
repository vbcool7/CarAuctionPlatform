
import React, { useEffect, useState } from 'react';
import { CalendarDays, CircleDollarSign, Clock3, Copy, Eye, Gavel, MoreVertical, Plus, Users } from 'lucide-react';
import { myVehiclesData } from '../SellerSharedComponents/SellerData';
import SearchBar from '../SellerSharedComponents/SearchBar';
import FilterDropdown from '../SellerSharedComponents/FilterDropdown';
import { useGetMyAuctions } from '../../../hook/useAuction';
import { getPaginationRange } from '../../../utils/getPaginationRange';
import { formatLabel } from '../../../utils/formatters';

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

const statusConfig = {
    draft: { label: 'Draft', className: 'bg-gray-400 text-white' },
    upcoming: { label: 'Upcoming', className: 'bg-blue-500 text-white' },
    live: { label: 'Live', className: 'bg-green-500 text-white' },
    sold: { label: 'Sold', className: 'bg-emerald-600 text-white' },
    unsold: { label: 'Unsold', className: 'bg-red-500 text-white' },
    'reserve-not-met': { label: 'Reserve Not Met', className: 'bg-orange-500 text-white' },
    canceled: { label: 'Canceled', className: 'bg-gray-500 text-white' },
};

function AuctionCard({ vehicle, setSelectedAuctionId, setCurrentPage }) {
    const isLive = vehicle.auctionStatus === 'live';
    const isEnded = ['sold', 'unsold', 'reserve-not-met', 'canceled'].includes(vehicle.auctionStatus);

    const countdown = useCountdown(isLive ? vehicle.auctionEndDateTime : null);

    const formatDate = (d) =>
        d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

    const bidAmount = isLive ? (vehicle.currentBid ?? vehicle.startingBidPrice) : vehicle.startingBidPrice;

    return (
        <div className='bg-white border border-gray-200 rounded-xl p-3 md:p-4 shadow-sm'>
            <div className='flex flex-col md:flex-row gap-4 items-start'>

                {/* Vehicle Image */}
                <div className='relative w-full md:w-40 lg:w-48 h-44 md:h-32 lg:h-36 shrink-0 rounded-lg overflow-hidden bg-gray-100'>
                    <img
                        src={vehicle.images?.[0]?.url}
                        alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                        className='w-full h-full object-cover'
                    />
                    <span
                        className={`absolute top-2 left-2 px-2 py-1 rounded-md text-[10px] font-semibold ${statusConfig[vehicle.auctionStatus]?.className || 'bg-gray-400 text-white'
                            }`}
                    >
                        {statusConfig[vehicle.auctionStatus]?.label || vehicle.auctionStatus}
                    </span>
                    <span className='absolute bottom-2 left-2 flex items-center gap-1 bg-black/70 text-white text-[10px] px-2 py-1 rounded-md'>
                        <Eye className='w-3 h-3' />
                        {vehicle.images?.length || 0} Photos
                    </span>
                </div>

                {/* Vehicle Content */}
                <div className='flex-1 min-w-0 w-full'>
                    <div className='flex flex-wrap items-center gap-2 mb-4'>
                        <h3 className='text-base md:text-lg font-bold text-[#0B1E3D]'>
                            {`${vehicle.year} ${formatLabel(vehicle.make)} ${formatLabel(vehicle.model)}`}
                        </h3>
                    </div>

                    <div className='grid grid-cols-2 sm:grid-cols-2 gap-4 mb-4'>
                        <div>
                            <div className='flex items-center gap-1.5 text-xs text-gray-500 mb-1'>
                                <Gavel className='w-3.5 h-3.5' />
                                {isLive ? 'Current Bid' : 'Starting Bid'}
                            </div>
                            <p className='sm:pl-3 text-xs font-bold text-[#0B1E3D]'>
                                AED {Number(bidAmount ?? 0).toLocaleString('en-AE')}
                            </p>
                        </div>

                        <div>
                            <div className='flex items-center gap-1.5 text-xs text-gray-500 mb-1'>
                                <CircleDollarSign className='w-3.5 h-3.5' />
                                Reserve Price
                            </div>
                            <p className='sm:pl-3 text-xs font-bold text-[#0B1E3D]'>
                                {vehicle.reservePrice ? `AED ${vehicle.reservePrice.toLocaleString('en-AE')}` : '—'}
                            </p>
                        </div>

                        <div>
                            <div className='flex items-center gap-1.5 text-xs text-gray-500 mb-1'>
                                <Users className='w-3.5 h-3.5' />
                                Bids
                            </div>
                            <p className='sm:pl-3 text-xs font-bold text-[#0B1E3D]'>{vehicle.bids ?? 0}</p>
                        </div>

                        <div>
                            <div className='flex items-center gap-1.5 text-xs text-gray-500 mb-1'>
                                <Eye className='w-3.5 h-3.5' />
                                Watchers
                            </div>
                            <p className='sm:pl-3 text-xs font-bold text-[#0B1E3D]'>{vehicle.watchers ?? 0}</p>
                        </div>
                    </div>

                    <div className='border-t border-gray-100 pt-3'>
                        <div className='flex gap-8'>
                            {/* Auction Timing */}
                            <div>
                                <div className='flex items-center gap-1.5 text-xs text-gray-500 mb-1'>
                                    {isLive ? (
                                        <Clock3 className='w-3.5 h-3.5 text-amber-600' />
                                    ) : isEnded ? (
                                        <Clock3 className='w-3.5 h-3.5 text-gray-400' />
                                    ) : (
                                        <CalendarDays className='w-3.5 h-3.5 text-blue-500' />
                                    )}
                                    {isLive ? 'Auction Ends' : isEnded ? 'Auction Ended' : 'Auction Starts'}
                                </div>

                                {isLive ? (
                                    <>
                                        <p className='text-xs font-bold text-amber-600'>
                                            {countdown.days}d {countdown.hours}h {countdown.mins}m
                                        </p>
                                        <p className='text-[10px] text-gray-400 mt-0.5'>
                                            {formatDate(vehicle.auctionEndDateTime)}
                                        </p>
                                    </>
                                ) : isEnded ? (
                                    <p className='text-xs font-semibold text-gray-500'>
                                        {formatDate(vehicle.auctionEndDateTime)}
                                    </p>
                                ) : (
                                    <p className='text-xs font-semibold text-[#0B1E3D]'>
                                        {formatDate(vehicle.auctionStartDate)} {vehicle.auctionStartTime}
                                    </p>
                                )}
                            </div>

                            {/* Listing ID / Duration */}
                            <div>
                                <div className='flex items-center gap-1.5 text-xs text-gray-500 mb-1'>
                                    {isLive ? 'Listing ID' : 'Duration'}
                                </div>
                                {isLive ? (
                                    <div className='flex items-center gap-2'>
                                        <p className='text-xs font-semibold text-[#0B1E3D]'>
                                            {vehicle.listingId || vehicle._id}
                                        </p>
                                        <Copy className='w-3.5 h-3.5 text-gray-400 cursor-pointer hover:text-[#D97706]' />
                                    </div>
                                ) : (
                                    <p className='text-xs font-semibold text-[#0B1E3D]'>
                                        {formatLabel(vehicle.auctionDuration)}
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
                            setSelectedAuctionId(vehicle._id);
                            setCurrentPage('my-auctions-detail');
                        }}
                        className='flex-1 md:w-full flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-2 py-2.5 text-xs font-semibold text-[#0B1E3D] hover:bg-gray-50 transition'
                    >
                        {isLive ? 'View Auction' : 'View Details'}
                    </button>
                    <button className='flex items-center justify-center rounded-lg border border-gray-200 px-3 py-2.5 text-gray-600 hover:bg-gray-50 transition'>
                        <MoreVertical className='w-4 h-4' />
                    </button>
                </div>
            </div>

            {/* Tags */}
            <div className='flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100'>
                {[vehicle.vin, vehicle.vehicleType, vehicle.transmission, vehicle.drivetrain, `${vehicle.mileage} miles`, vehicle.fuelType]
                    .filter(Boolean)
                    .map((tag, index) => (
                        <span
                            key={index}
                            className='px-3 py-1 rounded-md bg-gray-50 text-[10px] sm:text-xs font-medium text-gray-500'
                        >
                            {index === 0 ? `VIN: ${tag}` : formatLabel(tag)}
                        </span>
                    ))}
            </div>
        </div>
    );
}

function MyAuctions({ setCurrentPage, setSelectedAuctionId }) {

    const [page, setPage] = useState(1);
    const { data: myAuctionsData, isLoading, isError } = useGetMyAuctions(page);

    const myAuctions = myAuctionsData?.vehicles || [];
    const auctionVehicles = myAuctions;

    const totalPages = myAuctionsData?.pagination?.totalPages || 1;

    const [activeTab, setActiveTab] = useState('live');
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [auctionType, setAuctionType] = useState('');
    const [date, setDate] = useState('');

    const tabFilters = {
        live: (v) => v.auctionStatus === 'live',
        upcoming: (v) => v.auctionStatus === 'upcoming',
        ended: (v) => ['sold', 'unsold', 'reserve-not-met'].includes(v.auctionStatus),
        canceled: (v) => v.auctionStatus === 'canceled', // was checking adminStatus==='rejected', wrong field entirely
    };

    const tabs = [
        { key: 'live', label: 'Active Auctions', count: auctionVehicles.filter(tabFilters.live).length },
        { key: 'upcoming', label: 'Scheduled', count: auctionVehicles.filter(tabFilters.upcoming).length },
        { key: 'ended', label: 'Ended', count: auctionVehicles.filter(tabFilters.ended).length },
        { key: 'canceled', label: 'Canceled', count: auctionVehicles.filter(tabFilters.canceled).length },
    ];

    const filteredVehicles = auctionVehicles
        .filter(tabFilters[activeTab])
        .filter((v) =>
            `${v.year} ${v.make} ${v.model} ${v.vin}`.toLowerCase().includes(search.toLowerCase())
        );

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
                            <AuctionCard
                                key={vehicle._id}
                                vehicle={vehicle}
                                setSelectedAuctionId={setSelectedAuctionId}
                                setCurrentPage={setCurrentPage}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between gap-4 px-6 py-4 border-t border-slate-200 bg-white">

                            {/* Page Info */}
                            <p className="hidden sm:block text-xs text-slate-500">
                                Page <span className="font-semibold text-[#0B1E3D]">{page}</span> of{" "}
                                <span className="font-semibold text-[#0B1E3D]">{totalPages}</span>
                            </p>

                            {/* Pagination */}
                            <div className="flex items-center gap-1.5 mx-auto sm:mx-0 sm:ml-auto">

                                {/* Previous */}
                                <button
                                    type="button"
                                    onClick={() => setPage((p) => p - 1)}
                                    disabled={page === 1}
                                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                >
                                    Previous
                                </button>

                                {/* Page Numbers */}
                                {getPaginationRange(page, totalPages).map((num, idx) =>
                                    num === "..." ? (
                                        <span
                                            key={`dot-${idx}`}
                                            className="px-2 py-1.5 text-xs font-medium text-slate-400"
                                        >
                                            ...
                                        </span>
                                    ) : (
                                        <button
                                            type="button"
                                            key={num}
                                            onClick={() => setPage(num)}
                                            className={`min-w-8 h-8 px-2 rounded-lg text-xs font-semibold border transition-all
                                                ${page === num
                                                    ? "bg-[#D97706] text-white border-[#D97706] shadow-sm"
                                                    : "bg-white border-slate-200 text-slate-600 hover:bg-amber-50 hover:text-[#D97706] hover:border-amber-200"
                                                }`}
                                        >
                                            {num}
                                        </button>
                                    )
                                )}

                                {/* Next */}
                                <button
                                    type="button"
                                    onClick={() => setPage((p) => p + 1)}
                                    disabled={page === totalPages}
                                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                >
                                    Next
                                </button>

                            </div>
                        </div>
                    )}

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
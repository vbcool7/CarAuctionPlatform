
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Share2, Heart, MapPin, Hash, Cog, Flag, Fuel, Download, Send, Gauge } from 'lucide-react';
import Breadcrumbs from './Breadcrumbs';
import LiveBidsPanel from './SharedComponents/LiveBidsPanel';
import AuctionFeaturesBar from './SharedComponents/AuctionFeatureBar';
import HomeLiveAuctions from './HomeLiveAuctions';
import LiveAuctionGallery from './LiveAuctionGallery';
import OverviewTab from './OverviewTab';
import VehiclInfoTab from './VehicleInfoTab';
import InspectionTab from './InspectionTab';
import DetailTabs from './DetailTabs';
import BiddingHistoryTab from './BiddingHistoryTab';
import DocumentsTab from './DocumentsTab';
import ShippingPaymentsTab from './ShippingPaymentsTab';
import AuctionBottomFeaturesBar from './SharedComponents/AuctionBottomFeaturesBar';
import Loader from './Loader';
import PlaceBidSuccessModal from './PlaceBidSuccessModal';
import { toast } from 'react-toastify';

import { formatDateTime, formatLabel, formatPrice } from '../utils/formatters';
import { useStatusRedirect } from '../hook/useStatusRedirect';
import { UseCountdown } from './SharedComponents/UseCountdown';

import { useQueryClient } from '@tanstack/react-query';
import { usePublicAuctionDetail } from '../hook/useAuction';
import { useBidSocket } from '../socket/listeners/useBidSocket';
import { usePlaceBid, useWithdrawBid } from '../hook/useBid';
import useAuthStore from '../store/useAuthStore';
import { useGetWatchlistIds, useToggleWatchlist } from '../hook/useWatchlist';


const initialMessages = [
    { user: "Ali Hassan", text: "This is a great car! 🔥" },
    { user: "AutoBid Assistant", text: "The engine is in excellent condition." }
];

const AVATAR_COLORS = [
    "bg-[#DC2626]",
    "bg-[#2563EB]",
    "bg-[#7C3AED]",
    "bg-[#059669]",
    "bg-[#E11D48]",
];

const InfoRow = ({ label, value }) => (
    <div className="flex justify-between">
        <span className="text-slate-500">{label}</span>
        <span className="font-medium text-slate-900">{value}</span>
    </div>
);

// count-down
const AuctionTimeLeft = ({ auctionEndDateTime, onComplete }) => {
    const timeLeft = UseCountdown(auctionEndDateTime);

    useEffect(() => {
        if (
            timeLeft.days === 0 &&
            timeLeft.hours === 0 &&
            timeLeft.mins === 0 &&
            timeLeft.secs === 0
        ) {
            onComplete?.();
        }
    }, [timeLeft, onComplete]);

    return (
        <div className={`py-3 grid ${timeLeft.days > 0 ? 'grid-cols-4' : 'grid-cols-3'} gap-2`}>
            {timeLeft.days > 0 && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg py-2 text-center">
                    <p className="text-sm font-bold text-[#0B1E3D]">
                        {String(timeLeft.days).padStart(2, '0')}
                    </p>
                    <span className="text-[8px] text-slate-800 uppercase tracking-widest">
                        DAYS
                    </span>
                </div>
            )}

            <div className="bg-slate-50 border border-slate-200 rounded-lg py-2 text-center">
                <p className="text-sm font-bold text-[#0B1E3D]">
                    {String(timeLeft.hours).padStart(2, '0')}
                </p>
                <span className="text-[8px] text-slate-800 uppercase tracking-widest">
                    HRS
                </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg py-2 text-center">
                <p className="text-sm font-bold text-[#0B1E3D]">
                    {String(timeLeft.mins).padStart(2, '0')}
                </p>
                <span className="text-[8px] text-slate-800 uppercase tracking-widest">
                    MINS
                </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg py-2 text-center">
                <p className="text-sm font-bold text-[#D97706]">
                    {String(timeLeft.secs).padStart(2, '0')}
                </p>
                <span className="text-[8px] text-slate-800 uppercase tracking-widest">
                    SECS
                </span>
            </div>
        </div>
    );
};

function LiveAuctionsDetail() {

    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const token = useAuthStore((state) => state.token);
    const queryClient = useQueryClient();

    const [messages, setMessages] = useState(initialMessages);
    const [newMessage, setNewMessage] = useState("");
    const [bidAmount, setBidAmount] = useState('');
    const [successBid, setSuccessBid] = useState(null);

    const { data, isLoading, isError } = usePublicAuctionDetail(id);
    const { mutate: placeBid, isPending } = usePlaceBid();
    const { mutate: withdrawBid, isPending: isWithdrawing } = useWithdrawBid();
    const { data: watchlistIds } = useGetWatchlistIds();
    const { mutate: toggleWatchlist, variables: pendingId } = useToggleWatchlist();

    useBidSocket(id);

    const vehicle = data?.data;
    useStatusRedirect(vehicle, '/live-auction-detail');

    if (isLoading) {
        return <Loader />
    }
    if (isError) return <p className="p-10 text-center text-red-500">Failed to load live auctions</p>;
    if (!vehicle) return <div className="p-10 text-center">Vehicle not found!</div>;

    const isWatchlisted = !!watchlistIds?.has(vehicle._id);
    const isToggling = isPending && pendingId === vehicle._id;

    const hasBids = vehicle.totalBids > 0;

    // place bid handler
    const handlePlaceBid = () => {
        if (!token) {
            navigate('/login', { state: { from: location.pathname } });
            toast.error("Please login to continue bidding.");
            return;
        }
        placeBid(
            { vehicleId: vehicle._id, amount: Number(bidAmount) },
            {
                onSuccess: (res) => {
                    setBidAmount('');
                    setSuccessBid({
                        newBid: res.bid,
                        previousBid: hasBids ? vehicle.currentBid : null,
                    });
                },
                onError: (err) => {
                    toast.error(err.response?.data?.message || 'Could not place bid');
                },
            }
        );
    };

    // withdraw bid handler
    const handleWithdraw = () => {
        if (!vehicle.myActiveBid?._id) return;
        if (!window.confirm('Withdraw your bid? This cannot be undone.')) return;

        withdrawBid(vehicle.myActiveBid._id, {
            onSuccess: () => {
                queryClient.setQueryData(['publicAuctionDetail', id], (old) =>
                    old?.data ? { ...old, data: { ...old.data, myActiveBid: null } } : old
                );
                toast.success('Bid withdrawn successfully')
            },
            onError: (err) => {
                console.log('withdraw error:', err.response?.status, err.response?.data, err.message);
                toast.error(err.response?.data?.message || 'Could not withdraw bid')
            },
        });
    };

    // watchlist handler
    const handleWatchlistClick = (e, vehicle) => {
        e.stopPropagation();

        if (!token) {
            toast.info('Please login to manage your watchlist');
            navigate('/login');
            return;
        }

        toggleWatchlist(vehicle._id, {
            onSuccess: (data) => {
                toast.success(data?.message || 'Watchlist updated successfully');
            },
            onError: (error) => {
                toast.error(
                    error?.response?.data?.message || 'Failed to update watchlist'
                );
            },
        });
    }

    const breadcrumbItems = [
        { label: 'Home', path: '/' },
        { label: 'Live Auctions', path: '/live-auctions' },
        {
            label: vehicle
                ? `${vehicle.year} ${formatLabel(vehicle.make)} ${formatLabel(vehicle.model)}`
                : 'Vehicle Detail'
        }
    ];

    const metaItems = [
        { icon: <MapPin size={16} />, label: formatLabel(vehicle.emirate) },
        { icon: <Hash size={16} />, label: vehicle.listingId },
        { icon: <Cog size={16} />, label: `${formatLabel(vehicle.engineSize)}` },
        { icon: <Gauge size={16} />, label: `${vehicle.mileage?.toLocaleString()} km` },
        { icon: <Flag size={16} />, label: formatLabel(vehicle.drivetrain) },
        { icon: <Fuel size={16} />, label: formatLabel(vehicle.fuelType) }
    ];

    const infoItems = [
        { label: "Auction Type", value: formatLabel(vehicle.auctionType) },
        { label: "Start Time", value: formatDateTime(vehicle.auctionStartDateTime) },
        { label: "End Time", value: formatDateTime(vehicle.auctionEndDateTime) },
        { label: "Listing ID", value: vehicle.listingId },
        { label: "Seller", value: vehicle.sellerInfo?.name },
        { label: "Location", value: formatLabel(vehicle.emirate) },

        ...(vehicle.priceType === "fixed_price"
            ? [
                {
                    label: "Buy Now Price",
                    value: formatPrice(vehicle.buyNowPrice)
                }
            ]
            : []),

        { label: "Vehicle Condition", value: formatLabel(vehicle.overallCondition) },
    ];

    // tabs
    const liveAuctionTabs = [
        {
            key: "overview",
            label: "Overview",
            content: <OverviewTab vehicle={vehicle} />,
        },
        {
            key: "specifications",
            label: "Specifications",
            content: <VehiclInfoTab vehicle={vehicle} />, // reuse
        },
        {
            key: "inspection",
            label: "Inspection Report",
            content: <InspectionTab vehicle={vehicle} />, // reuse
        },
        {
            key: "bidding",
            label: "Bidding History",
            content: <BiddingHistoryTab vehicle={vehicle} />,
        },
        {
            key: "documents",
            label: "Documents",
            content: <DocumentsTab vehicle={vehicle} />,
        },
        {
            key: "shipping",
            label: "Shipping & Payments",
            content: <ShippingPaymentsTab vehicle={vehicle} />,
        },
    ];

    if (vehicle.auctionStatus !== 'live') return null;

    return (
        <section className='w-full'>

            {/* ========= breadcrumb ========= */}
            <div className='max-w-6xl mx-auto px-4 sm:px-5 lg:px-6 pt-4'>
                <Breadcrumbs items={breadcrumbItems} />
            </div>

            <div className='max-w-6xl mx-auto px-4 sm:px-5 lg:px-6'>

                {/* ========= header ========= */}
                <div className=" border-b border-slate-100">

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className='flex gap-3 items-center'>
                            <h1 className=" text-3xl font-extrabold text-slate-900 tracking-tight">
                                {`${vehicle.year} ${formatLabel(vehicle.make)} ${formatLabel(vehicle.model)}`}
                            </h1>

                            <div className="flex gap-2 mt-3">
                                <span className="bg-orange-50 text-orange-600 border border-orange-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                                    Live Auction
                                </span>
                                {vehicle.featuredListing && (
                                    <span className="bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                                        Featured
                                    </span>
                                )}

                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all">
                                <Share2 size={18} /> Share
                            </button>

                            <button
                                onClick={(e) => handleWatchlistClick(e, vehicle)}
                                disabled={isToggling}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${isWatchlisted
                                        ? "bg-orange-50 text-[#D97706] border border-orange-200 hover:bg-orange-100"
                                        : "border border-slate-200 text-slate-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                                    }`}
                            >
                                <Heart
                                    size={18}
                                    className={isWatchlisted ? "fill-current" : ""}
                                />
                                {isWatchlisted ? "Added to Watchlist" : "Add to Watchlist"}
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-6 text-slate-600 text-sm font-medium">
                        {metaItems.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                                <span className="opacity-70">{item.icon}</span>
                                <span>{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ======== top-content grid ======== */}
                <div className={`grid grid-cols-1 gap-5 mt-6 ${vehicle.priceType === 'fixed_price' ? 'lg:grid-cols-9' : 'lg:grid-cols-12'}`}>

                    {/* Gallery */}
                    <div className="h-100 lg:col-span-5 flex flex-col">
                        <LiveAuctionGallery
                            images={vehicle.images?.map(img => img.url) || []}
                            status={vehicle.auctionStatus}
                        />
                    </div>

                    {/* Bidding / Buy Now Controls */}
                    <div className="lg:col-span-4 flex flex-col">
                        <div className="bg-[#0B1E3D] text-white p-4 rounded-2xl shadow-xl">

                            {/* Header */}
                            <div className="flex justify-between items-center my-3">
                                <span className="text-sm font-medium text-slate-300">
                                    Auction Ends In
                                </span>

                                <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#D97706] bg-[#D97706]/10 px-2 py-0.5 rounded">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] animate-pulse"></span>
                                    LIVE
                                </span>
                            </div>

                            {/* Countdown */}
                            <AuctionTimeLeft
                                auctionEndDateTime={vehicle.auctionEndDateTime}
                                onComplete={() => {
                                    queryClient.invalidateQueries({
                                        queryKey: ["publicAuctionDetail", id],
                                    });
                                }}
                            />

                            {/* Price / Bid Info */}
                            <div className="space-y-2.5 mt-4 border-t border-slate-600 pt-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-slate-400 text-[9px] uppercase tracking-wide">
                                            {vehicle.priceType === 'fixed_price'
                                                ? 'Buy Now Price'
                                                : hasBids
                                                    ? 'Current Highest Bid'
                                                    : 'Starting Bid'}
                                        </p>

                                        <p className="text-lg font-bold mt-0.5 text-[#D97706]">
                                            {vehicle.priceType === 'fixed_price'
                                                ? formatPrice(vehicle.buyNowPrice)
                                                : hasBids
                                                    ? formatPrice(vehicle.currentBid)
                                                    : vehicle.startingBidPrice != null
                                                        ? formatPrice(vehicle.startingBidPrice)
                                                        : 'N/A'}
                                        </p>
                                    </div>

                                    {vehicle.priceType !== 'fixed_price' && (
                                        <div>
                                            <p className="text-slate-400 text-[9px] uppercase tracking-wide">
                                                Total Bids
                                            </p>

                                            <p className="text-lg font-bold mt-0.5">
                                                {vehicle.totalBids ?? 0}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {vehicle.priceType === 'fixed_price' && (
                                <div className="mt-4 p-3 rounded-lg bg-[#142d55] border border-slate-700">
                                    <p className="text-[10px] text-slate-400 uppercase tracking-wide">
                                        Direct Purchase
                                    </p>

                                    <p className="text-sm font-semibold text-white mt-1">
                                        Skip the auction and purchase this vehicle instantly.
                                    </p>

                                    <p className="text-[10px] text-slate-400 mt-1">
                                        No bidding required
                                    </p>
                                </div>
                            )}

                            {/* Input & Buttons */}
                            <div className="mt-4 space-y-4">
                                {vehicle.priceType === 'reserve_price' ? (
                                    vehicle.isOwner ? (
                                        <div className="w-full py-4 px-5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                                            <p className="text-sm font-semibold text-slate-600">
                                                Own Listing
                                            </p>
                                            <p className="text-xs text-slate-400 mt-1">
                                                Bidding is unavailable for your own vehicle.
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            {vehicle.myActiveBid && (
                                                <div className="flex items-center justify-between rounded-lg border border-green-500/30 bg-green-500/10 p-2.5">
                                                    <div>
                                                        <p className="text-[10px] uppercase tracking-wide text-green-400">You're leading</p>
                                                        <p className="text-sm font-bold">{formatPrice(vehicle.myActiveBid.amount)}</p>
                                                    </div>
                                                    <button
                                                        onClick={handleWithdraw}
                                                        disabled={isWithdrawing}
                                                        className="text-xs font-semibold text-red-400 hover:text-red-300 disabled:opacity-50"
                                                    >
                                                        {isWithdrawing ? 'Withdrawing...' : 'Withdraw Bid'}
                                                    </button>
                                                </div>
                                            )}

                                            <div className="relative">
                                                <span className="absolute left-3 top-2.5 text-xs font-bold text-[#D97706]">AED</span>
                                                <input
                                                    type="number"
                                                    value={bidAmount}
                                                    onChange={(e) => setBidAmount(e.target.value)}
                                                    placeholder="Enter your bid amount"
                                                    className="w-full bg-[#142d55] border border-slate-600 rounded-lg py-2.5 pl-12 pr-3 text-sm text-white placeholder-slate-400 outline-none focus:border-[#D97706]"
                                                />
                                            </div>

                                            <button
                                                onClick={handlePlaceBid}
                                                disabled={isPending || !bidAmount}
                                                className="w-full bg-[#D97706] hover:bg-[#b86405] text-white text-sm font-bold py-2.5 rounded-lg transition-all disabled:opacity-50"
                                            >
                                                {isPending ? 'Placing...' : 'Place Bid Now'}
                                            </button>
                                        </>
                                    )
                                ) : (
                                    <button className="w-full bg-[#D97706] hover:bg-[#b86405] text-white text-sm font-bold py-2.5 rounded-lg transition-all">
                                        Buy Now {formatPrice(vehicle.buyNowPrice)}
                                    </button>
                                )}
                            </div>

                            {/* Bidders — Reserve Price Only */}
                            {vehicle.priceType === 'reserve_price' && vehicle.bidderCount > 0 && (
                                <div className="mt-3 flex items-center gap-2 pt-3 border-t border-slate-700">
                                    <div className="flex -space-x-1.5">
                                        {Array.from({ length: Math.min(vehicle.bidderCount, 5) }).map((_, i) => (
                                            <div key={i} className={`w-6 h-6 rounded-full ${AVATAR_COLORS[i]} flex items-center justify-center text-[9px] font-bold text-white ring-2 ring-[#0B1E3D]`}>
                                                {i + 1}
                                            </div>
                                        ))}
                                        {vehicle.bidderCount > 5 && (
                                            <div className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center text-[9px] font-bold text-white ring-2 ring-[#0B1E3D]">
                                                +{vehicle.bidderCount - 5}
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-[10px] text-slate-400">
                                        {vehicle.bidderCount} {vehicle.bidderCount === 1 ? 'Bidder' : 'Bidders'}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bids Activity — Reserve Price Only */}
                    {vehicle.priceType === 'reserve_price' && (
                        <div className="lg:col-span-3">
                            <LiveBidsPanel bids={vehicle.recentBids || []} />
                        </div>
                    )}
                </div>

                {/* ======== feature bar ======== */}
                <AuctionFeaturesBar vehicle={vehicle} />

                {/* ======== middle section ======== */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

                    {/* auct info */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-4">Auction Information</h3>
                        <div className="space-y-4 text-sm">

                            {infoItems.map((item, index) => (
                                <InfoRow key={index} label={item.label} value={item.value} />
                            ))}
                            <button className="w-full flex items-center justify-center gap-2 mt-6 py-3 px-4 bg-[#0B1E3D] text-white rounded-xl hover:bg-slate-800 transition-all shadow-sm active:scale-[0.99] font-medium text-sm">
                                <Download size={18} /> Download Lot Sheet
                            </button>
                        </div>
                    </div>

                    {/* auc progress card */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-6">
                            {vehicle.priceType === 'fixed_price'
                                ? 'Purchase Overview'
                                : 'Auction Progress'}
                        </h3>

                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <p className="text-slate-500 text-sm">
                                    {vehicle.priceType === 'fixed_price'
                                        ? 'Buy Now Price'
                                        : hasBids
                                            ? 'Current Bid'
                                            : 'Starting Bid'}
                                </p>

                                <p className="text-2xl font-extrabold text-[#D97706]">
                                    {vehicle.priceType === 'fixed_price'
                                        ? formatPrice(vehicle.buyNowPrice)
                                        : formatPrice(
                                            hasBids
                                                ? vehicle.currentBid
                                                : vehicle.startingBidPrice
                                        )}
                                </p>
                            </div>

                            <div className="text-right">
                                <p className="text-slate-500 text-sm">
                                    {vehicle.priceType === 'fixed_price'
                                        ? 'Purchase Type'
                                        : 'Auction Type'}
                                </p>

                                <p className="font-bold text-slate-900">
                                    {vehicle.priceType === 'fixed_price'
                                        ? 'Fixed Price'
                                        : 'Reserve Auction'}
                                </p>
                            </div>
                        </div>

                        {vehicle.priceType === 'fixed_price' ? (
                            <>
                                {/* Purchase Info */}
                                <div className="grid grid-cols-2 gap-4 py-6 border-t border-slate-100">
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-emerald-600">
                                            Available
                                        </p>
                                        <p className="text-[10px] text-slate-400 uppercase font-bold">
                                            Purchase Status
                                        </p>
                                    </div>

                                    <div className="text-center">
                                        <p className="text-lg font-bold text-slate-900">
                                            {(vehicle.views ?? 0).toLocaleString()}
                                        </p>
                                        <p className="text-[10px] text-slate-400 uppercase font-bold">
                                            Views
                                        </p>
                                    </div>
                                </div>

                                {/* Direct Purchase */}
                                <div className="mt-2 rounded-xl bg-amber-50 border border-amber-100 p-4">
                                    <p className="text-sm font-semibold text-slate-900">
                                        Ready to purchase?
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Buy this vehicle instantly at the listed price.
                                    </p>
                                </div>
                            </>
                        ) : (
                            <div className="grid grid-cols-2 gap-4 py-6 border-t border-slate-100">
                                <div className="text-center">
                                    <p className="text-lg font-bold text-slate-900">
                                        {(vehicle.totalBids ?? 0).toLocaleString()}
                                    </p>
                                    <p className="text-[10px] text-slate-400 uppercase font-bold">
                                        Total Bids
                                    </p>
                                </div>

                                <div className="text-center">
                                    <p className="text-lg font-bold text-slate-900">
                                        {(vehicle.views ?? 0).toLocaleString()}
                                    </p>
                                    <p className="text-[10px] text-slate-400 uppercase font-bold">
                                        Views
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* live chat */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col h-100">
                        <h3 className="font-bold text-slate-900 mb-4">Auction Chat</h3>
                        <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
                            {messages.map((msg, idx) => (
                                <div key={idx} className="text-sm">
                                    <p className="font-bold text-slate-900">{msg.user}</p>
                                    <p className="text-slate-600">{msg.text}</p>
                                </div>
                            ))}
                        </div>
                        <div className="relative">
                            <input
                                className="w-full p-3 pr-14 border border-slate-200 bg-slate-50 rounded-xl text-sm  focus:outline-none focus:bg-white focus:border-[#D97706]/50 focus:ring-4 focus:ring-[#D97706]/10 transition-all duration-300"
                                placeholder="Type your message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />

                            <button className="absolute right-2 top-2 p-1.5 text-slate-400 hover:text-[#0F172A] transition-colors duration-300">
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* ======== tabs ======== */}
                <div className="mt-10">
                    <DetailTabs
                        tabs={liveAuctionTabs}
                        defaultTab="overview"
                    />
                </div>

            </div>

            {/* ======= smiliar live auction ======= */}
            <div className='max-w-6xl mx-auto'>
                <HomeLiveAuctions />
            </div>

            {/* ======= bottom - features ======= */}
            <AuctionBottomFeaturesBar />

            {/* ======= bid success modal ======= */}
            {successBid && (
                <PlaceBidSuccessModal
                    vehicle={vehicle}
                    newBid={successBid.newBid}
                    previousBid={successBid.previousBid}
                    onClose={() => setSuccessBid(null)}
                />
            )}
        </section>
    )
}

export default LiveAuctionsDetail;
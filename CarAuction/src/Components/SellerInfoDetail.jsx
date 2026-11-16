
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Star, BadgeCheck, MapPin, Briefcase, CalendarDays, CarFront, Building2, Globe, ShieldCheck, Trophy, Users,
} from 'lucide-react';
import Breadcrumbs from './Breadcrumbs';
import SellerReviews from './BuyerPanel/BuyerSharedComponents/SellerReviews';

import { useGetSellerPublicReviews } from '../hook/useReview';
import { useGetPublicSellerAuctions } from '../hook/useAuction';
import { formatLabel } from '../utils/formatters';

const pretty = (s) =>
    String(s || '').replace(/[_-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const BUSINESS_TYPES = {
    car_dealership: 'Car Dealership',
    individual_seller: 'Individual Seller',
    vehicle_importer: 'Vehicle Importer',
    fleet_company: 'Fleet Company',
    rental_company: 'Rental Company',
    auction_house: 'Auction House',
    other: 'Other',
};

const COUNTRIES = {
    united_arab_emirates: 'United Arab Emirates',
};

const YEARS = {
    less_than_1: 'Less than 1 year',
    '1_plus': '1+ years',
    '2_plus': '2+ years',
    '3_plus': '3+ years',
    '5_plus': '5+ years',
    '10_plus': '10+ years',
    '15_plus': '15+ years',
    '20_plus': '20+ years',
};

const initialsOf = (name) =>
    String(name || 'S')
        .split(/\s+/)
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

function SellerInfoDetail() {

    const { sellerId } = useParams();
    const navigate = useNavigate();
    const [page, setPage] = useState(1);

    const { data, isLoading, isError, isFetching } = useGetSellerPublicReviews(sellerId, page, 10);

    const [vehiclePage, setVehiclePage] = useState(1);
    const [sellerVehicles, setSellerVehicles] = useState([]);

    const {
        data: vehiclesResponse,
        isLoading: vehiclesLoading,
        isFetching: vehiclesFetching,
        isError: vehiclesError,
    } = useGetPublicSellerAuctions(sellerId, vehiclePage, 4);

    useEffect(() => {
        setVehiclePage(1);
        setSellerVehicles([]);
    }, [sellerId]);

    useEffect(() => {
        if (vehiclesResponse?.pagination?.currentPage !== vehiclePage) return;

        const newVehicles = vehiclesResponse?.data || [];

        setSellerVehicles((prev) => {
            const existingIds = new Set(prev.map((vehicle) => vehicle._id));
            const uniqueVehicles = newVehicles.filter(
                (vehicle) => !existingIds.has(vehicle._id)
            );

            return vehiclePage === 1
                ? newVehicles
                : [...prev, ...uniqueVehicles];
        });
    }, [vehiclesResponse, vehiclePage]);

    const vehiclePagination = vehiclesResponse?.pagination;

    const formatAED = (amount) =>
        amount != null
            ? `AED ${Number(amount).toLocaleString('en-US')}`
            : 'Price unavailable';

    const getVehiclePrice = (vehicle) => {
        if (vehicle.priceType === 'fixed_price') {
            return {
                label: 'Buy Now Price',
                value: vehicle.buyNowPrice,
            };
        }

        if (vehicle.auctionStatus === 'live' && vehicle.currentBid != null) {
            return {
                label: 'Current Bid',
                value: vehicle.currentBid,
            };
        }

        return {
            label: 'Starting Bid',
            value: vehicle.startingBidPrice,
        };
    };

    const back = (
        <button
            onClick={() => navigate(-1)}
            className="text-sm text-slate-500 hover:text-[#0B1E3D] mb-3"
        >
            ← Back
        </button>
    );

    // navigate to detail page
    const getAuctionDetailRoute = (vehicle) => {
        const { auctionStatus, _id } = vehicle;

        if (auctionStatus === "live") {
            return `/live-auction-detail/${_id}`;
        }

        if (auctionStatus === "upcoming") {
            return `/upcoming-auction-detail/${_id}`;
        }

        if (["sold", "unsold", "reserve-not-met"].includes(auctionStatus)) {
            return `/ended-auction-detail/${_id}`;
        }

        return `/live-auction-detail/${_id}`;
    };

    if (isLoading) {
        return <p className="p-10 text-center">Loading seller....</p>;
    }

    if (isError || !data) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-10">
                {back}
                <p className="text-center text-red-500">Seller not found</p>
            </div>
        );
    }

    const { seller, summary, reviews, pagination } = data;

    const location = [
        pretty(seller?.area),
        pretty(seller?.city),
        pretty(seller?.emirate),
        pretty(seller?.country)
    ].filter(Boolean).join(', ');

    const memberSince = seller?.createdAt
        ? new Date(seller.createdAt).toLocaleDateString('en-GB', {
            month: 'short',
            year: 'numeric'
        })
        : null;

    const breadcrumbItems = [
        { label: 'Home', path: '/' },
        { label: 'Seller Profile' },
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

            <Breadcrumbs items={breadcrumbItems} />

            {/* SELLER PROFILE HEADER - DYNAMIC */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                {/* Subtle Brand Accent Strip */}
                <div className="h-1.5 w-full bg-gradient-to-r from-[#0B1E3D] via-[#1E3A8A] to-[#D97706]" />

                <div className="p-6 sm:p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

                        {/* Left Side: Avatar + Main Details */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-5 min-w-0">

                            {/* Avatar with Status Indicator */}
                            <div className="relative shrink-0 self-start sm:self-center">
                                {seller?.profileImage ? (
                                    <img
                                        src={seller.profileImage}
                                        alt={seller?.fullName || seller?.name}
                                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-slate-100 shadow-sm"
                                    />
                                ) : (
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#0B1E3D] text-white flex items-center justify-center rounded-2xl font-bold text-2xl sm:text-3xl shadow-sm">
                                        {initialsOf(seller?.fullName || seller?.name)}
                                    </div>
                                )}

                                {seller?.status === 'approved' && (
                                    <span
                                        title="Verified Seller"
                                        className="absolute -bottom-1.5 -right-1.5 bg-emerald-600 text-white p-1.5 rounded-xl border-2 border-white shadow-sm"
                                    >
                                        <BadgeCheck size={14} />
                                    </span>
                                )}
                            </div>

                            {/* Seller Name, Badge & Metadata */}
                            <div className="min-w-0 flex-1 space-y-2.5">
                                <div className="flex flex-wrap items-center gap-2.5">
                                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0B1E3D] tracking-tight truncate">
                                        {seller?.fullName || seller?.name}
                                    </h1>

                                    {seller?.status === 'approved' && (
                                        <span className="inline-flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-3 py-1 rounded-full font-semibold">
                                            <BadgeCheck size={14} className="text-emerald-600" />
                                            Verified Dealer
                                        </span>
                                    )}
                                </div>

                                {/* Location & Business Info Pills */}
                                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                                    {location && (
                                        <span className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200/70 px-3 py-1.5 rounded-lg font-medium">
                                            <MapPin size={14} className="text-[#D97706] shrink-0" />
                                            {location}
                                        </span>
                                    )}

                                    {seller?.businessYear && (
                                        <span className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200/70 px-3 py-1.5 rounded-lg font-medium">
                                            <Briefcase size={14} className="text-[#D97706] shrink-0" />
                                            {YEARS[seller.businessYear] || pretty(seller.businessYear)} in business
                                        </span>
                                    )}

                                    {memberSince && (
                                        <span className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200/70 px-3 py-1.5 rounded-lg font-medium">
                                            <CalendarDays size={14} className="text-[#D97706] shrink-0" />
                                            Joined {memberSince}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Highlighted Rating Card */}
                        <div className="flex sm:inline-flex items-center justify-between sm:justify-start gap-4 bg-slate-50/80 border border-slate-200/80 rounded-2xl px-5 py-4 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-xl bg-amber-100/80 text-[#D97706] flex items-center justify-center">
                                    <Star size={22} className="fill-[#D97706] text-[#D97706]" />
                                </div>
                                <div>
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-2xl font-bold text-[#0B1E3D]">
                                            {summary?.ratingCount
                                                ? Number(summary.ratingAverage).toFixed(1)
                                                : 'New'}
                                        </span>
                                        {summary?.ratingCount > 0 && (
                                            <span className="text-xs font-semibold text-slate-400">/ 5.0</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium">
                                        {summary?.ratingCount
                                            ? `Based on ${summary.ratingCount} ${summary.ratingCount === 1 ? 'review' : 'reviews'}`
                                            : 'No reviews yet'}
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* SELLER STATISTICS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                {[
                    {
                        label: 'Listed Vehicles',
                        value: vehiclePagination?.total ?? '—',
                        icon: CarFront,
                        description: 'Live and upcoming vehicles',
                    },
                    {
                        label: 'Customer Rating',
                        value: summary?.ratingCount
                            ? `${Number(summary.ratingAverage).toFixed(1)}/5`
                            : '—',
                        icon: Star,
                        description: `${summary?.ratingCount || 0} customer reviews`,
                    },
                    {
                        label: 'Years of Experience',
                        value: YEARS[seller?.businessYear] || pretty(seller?.businessYear) || '—',
                        icon: Trophy,
                        description: 'Automotive industry experience',
                    },
                ].map((item) => (
                    <div
                        key={item.label}
                        className="group relative bg-white border border-slate-200/80 rounded-xl p-5
            transition-all duration-300 hover:border-amber-300 hover:shadow-lg hover:shadow-slate-200/50"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    {item.label}
                                </p>

                                <h3 className="text-2xl font-bold text-[#0B1E3D] mt-2 tracking-tight">
                                    {item.value}
                                </h3>
                            </div>

                            <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-100
                    text-[#D97706] flex items-center justify-center shrink-0
                    transition-colors duration-300 group-hover:bg-[#D97706] group-hover:text-white">
                                <item.icon size={21} strokeWidth={1.9} />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                            <p className="text-xs text-slate-500">
                                {item.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ABOUT SELLER - DYNAMIC */}
            <section className="mt-8 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">

                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#D97706] flex items-center justify-center">
                        <Building2 size={21} />
                    </div>

                    <div>
                        <h2 className="text-lg font-bold text-[#0B1E3D]">
                            About the Seller
                        </h2>
                        <p className="text-xs text-slate-500">
                            Learn more about this seller
                        </p>
                    </div>
                </div>

                <h3 className="text-base font-bold text-[#0B1E3D] mb-2">
                    {seller?.businessName || seller?.fullName || 'Seller'}
                </h3>

                <p className="text-sm text-slate-600 leading-7">
                    {seller?.businessDescription ||
                        'No business description has been added yet.'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 pt-5 border-t border-slate-100">

                    <div>
                        <p className="text-xs text-slate-400">Experience</p>
                        <p className="text-sm font-semibold text-slate-700 mt-1">
                            {YEARS[seller?.businessYear] || '—'}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-slate-400">Team Size</p>
                        <p className="text-sm font-semibold text-slate-700 mt-1">
                            {seller?.employees || '—'}
                        </p>
                    </div>

                    {seller?.website && (
                        <div>
                            <p className="text-xs text-slate-400">Website</p>
                            <a
                                href={
                                    /^https?:\/\//i.test(seller.website)
                                        ? seller.website
                                        : `https://${seller.website}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-semibold text-[#D97706] hover:underline mt-1 inline-block break-all"
                            >
                                {seller.website}
                            </a>
                        </div>
                    )}

                </div>
            </section>

            {/* SELLER VEHICLES - DYNAMIC */}
            <section className="mt-8">

                <div className="flex items-center justify-between gap-3 mb-5">
                    <div>
                        <h2 className="text-lg font-bold text-[#0B1E3D]">
                            Seller's Vehicles
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Explore vehicles listed by this seller
                        </p>
                    </div>

                    <span className="text-xs font-semibold bg-amber-50 text-[#D97706] px-3 py-1.5 rounded-full">
                        {vehiclePagination?.total ?? 0} Vehicles
                    </span>
                </div>

                {vehiclesLoading && vehiclePage === 1 ? (
                    <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-sm text-slate-500">
                        Loading seller vehicles...
                    </div>
                ) : vehiclesError ? (
                    <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-sm text-red-500">
                        Unable to load seller vehicles.
                    </div>
                ) : sellerVehicles.length === 0 ? (
                    <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
                        <CarFront size={32} className="mx-auto text-slate-300 mb-2" />
                        <p className="text-sm font-semibold text-slate-600">
                            No vehicles available
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                            This seller has no live or upcoming listings right now.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {sellerVehicles.map((vehicle) => {
                                const price = getVehiclePrice(vehicle);

                                const image =
                                    vehicle.image ||
                                    vehicle.images?.[0]?.url ||
                                    null;

                                return (
                                    <div
                                        key={vehicle._id}
                                        onClick={() => navigate(getAuctionDetailRoute(vehicle))}
                                        className="group bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-[#D97706]/50 hover:shadow-xl hover:shadow-[#0B1E3D]/10 cursor-pointer"
                                    >
                                        <div className="relative">
                                            {image ? (
                                                <img
                                                    src={image}
                                                    alt={`${vehicle.make} ${vehicle.model}`}
                                                    className="w-full h-44 object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="w-full h-44 bg-slate-100 flex items-center justify-center">
                                                    <CarFront
                                                        size={42}
                                                        className="text-slate-300"
                                                    />
                                                </div>
                                            )}

                                            <span
                                                className={`absolute top-3 left-3 text-[10px] font-semibold px-2.5 py-1 rounded-full ${vehicle.auctionStatus === 'live'
                                                    ? 'bg-green-50 text-green-700'
                                                    : 'bg-amber-50 text-amber-700'
                                                    }`}
                                            >
                                                {vehicle.auctionStatus === 'live'
                                                    ? 'Live Auction'
                                                    : 'Upcoming'}
                                            </span>
                                        </div>

                                        <div className="p-4">
                                            <h3 className="font-bold text-sm text-[#0B1E3D] line-clamp-1">
                                                {vehicle.year} {formatLabel(vehicle.make)} {formatLabel(vehicle.model)}
                                            </h3>

                                            {vehicle.trim && (
                                                <p className="text-xs text-slate-500 mt-1">
                                                    {formatLabel(vehicle.trim)}
                                                </p>
                                            )}

                                            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500 mt-2">
                                                {vehicle.mileage != null && (
                                                    <span>
                                                        {Number(vehicle.mileage).toLocaleString('en-US')} km
                                                    </span>
                                                )}

                                                {vehicle.transmission && (
                                                    <span>
                                                        {pretty(vehicle.transmission)}
                                                    </span>
                                                )}
                                            </div>

                                            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                                                <MapPin size={13} className="text-[#D97706]" />
                                                {[pretty(vehicle.city), pretty(vehicle.emirate)]
                                                    .filter(Boolean)
                                                    .join(', ')}
                                            </p>

                                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                                                <div className="min-w-0">
                                                    <p className="text-[10px] text-slate-400">
                                                        {price.label}
                                                    </p>
                                                    <p className="font-bold text-[#0B1E3D] text-sm">
                                                        {formatAED(price.value)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                        </div>

                        {vehiclePagination?.hasNextPage && (
                            <div className="flex justify-center mt-6">
                                <button
                                    type="button"
                                    disabled={vehiclesFetching}
                                    onClick={() => setVehiclePage((prev) => prev + 1)}
                                    className="px-6 py-2.5 rounded-lg border border-[#0B1E3D] text-[#0B1E3D] text-sm font-semibold hover:bg-[#0B1E3D] hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {vehiclesFetching ? 'Loading...' : 'Load More Vehicles'}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </section>

            {/* BUSINESS INFORMATION - DYNAMIC */}
            <section className="mt-8 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">

                <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#D97706] flex items-center justify-center">
                        <ShieldCheck size={21} />
                    </div>

                    <div>
                        <h2 className="text-lg font-bold text-[#0B1E3D]">
                            Business Information
                        </h2>
                        <p className="text-xs text-slate-500">
                            Seller's business details
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                    <div className="flex items-start gap-3">
                        <Building2 size={18} className="text-[#D97706] mt-0.5" />
                        <div>
                            <p className="text-xs text-slate-400">Business Name</p>
                            <p className="text-sm font-semibold text-slate-700">
                                {seller?.businessName || '—'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Briefcase size={18} className="text-[#D97706] mt-0.5" />
                        <div>
                            <p className="text-xs text-slate-400">Business Type</p>
                            <p className="text-sm font-semibold text-slate-700">
                                {BUSINESS_TYPES[seller?.businessType] ||
                                    pretty(seller?.businessType) || '—'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <MapPin size={18} className="text-[#D97706] mt-0.5" />
                        <div>
                            <p className="text-xs text-slate-400">Business Address</p>
                            <p className="text-sm font-semibold text-slate-700">
                                {[
                                    seller?.streetAddress,
                                    seller?.building,
                                    pretty(seller?.area),
                                    pretty(seller?.city),
                                    pretty(seller?.emirate),
                                    COUNTRIES[seller?.country] || pretty(seller?.country),
                                ].filter(Boolean).join(', ') || '—'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Globe size={18} className="text-[#D97706] mt-0.5" />
                        <div>
                            <p className="text-xs text-slate-400">Operating Market</p>
                            <p className="text-sm font-semibold text-slate-700">
                                {COUNTRIES[seller?.country] || '—'}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CUSTOMER REVIEWS - EXISTING DYNAMIC COMPONENT */}
            <section className="mt-8">
                <div className="mb-5">
                    <h2 className="text-lg font-bold text-[#0B1E3D]">
                        Customer Reviews
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Feedback from customers who have dealt with this seller
                    </p>
                </div>

                <SellerReviews
                    summary={summary}
                    reviews={reviews}
                    pagination={pagination}
                    page={page}
                    setPage={setPage}
                    isFetching={isFetching}
                />
            </section>

        </div>
    );
}

export default SellerInfoDetail;
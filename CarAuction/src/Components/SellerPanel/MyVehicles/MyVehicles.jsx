
import React, { useState } from 'react';
import { CarFront, CheckCircle2, Clock, Eye, Gavel, MoreVertical, Sparkles } from 'lucide-react';
import SearchBar from '../SellerSharedComponents/SearchBar';
import FilterDropdown from '../SellerSharedComponents/FilterDropdown';
import { myVehiclesData } from '../SellerSharedComponents/SellerData';

import { useSellerVehicles, useVehicleStats } from '../../../hook/useVehicle';
import { getPaginationRange } from '../../../utils/getPaginationRange';

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

const sortOptions = [
    { value: "newest", label: "Sort By: Newest" },
    { value: "oldest", label: "Sort By: Oldest" },
    { value: "price-high", label: "Sort By: Price (High to Low)" },
    { value: "price-low", label: "Sort By: Price (Low to High)" },
];

function MyVehicles({ setCurrentPage, setSelectedMyVehicleId }) {

    const [page, setPage] = useState(1);
    const { data: myVehicles, isLoading, isError } = useSellerVehicles(page);
    const { data: statsData } = useVehicleStats();

    const totalPages = myVehicles?.pagination?.totalPages || 1;

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [auctionType, setAuctionType] = useState("");
    const [sortBy, setSortBy] = useState("newest");

    const stats = [
        {
            id: "total-vehicles",
            title: "Total Vehicles",
            value: statsData?.stats?.totalVehicles ?? 0,
            subtitle: "All Listings",
            subtitleColor: "text-green-600",
            icon: CarFront,
            iconBg: "bg-slate-100",
            iconColor: "text-slate-700",
        },
        {
            id: "pending-approval",
            title: "Pending Approval",
            value: statsData?.stats?.pendingApproval ?? 0,
            subtitle: "Awaiting Review",
            subtitleColor: "text-amber-500",
            icon: Clock,
            iconBg: "bg-amber-50",
            iconColor: "text-amber-600",
        },
        {
            id: "active-listings",
            title: "Active Listings",
            value: statsData?.stats?.activeListing ?? 0,
            subtitle: "Live Now",
            subtitleColor: "text-green-600",
            icon: CheckCircle2,
            iconBg: "bg-emerald-50",
            iconColor: "text-emerald-600",
        },
        {
            id: "upcoming-auctions",
            title: "Upcoming Auctions",
            value: statsData?.stats?.upcomingAuctions ?? 0,
            subtitle: "Starts Soon",
            subtitleColor: "text-blue-600",
            icon: Gavel,
            iconBg: "bg-blue-50",
            iconColor: "text-blue-600",
        },
        {
            id: "sold-vehicles",
            title: "Sold Vehicles",
            value: statsData?.stats?.soldVehicles ?? 0,
            subtitle: "Completed",
            subtitleColor: "text-purple-600",
            icon: Sparkles,
            iconBg: "bg-purple-50",
            iconColor: "text-purple-600",
            extraClass: "sm:col-span-2 lg:col-span-1",
        },
    ];

    if (isLoading) return <p className="p-10 text-center">Loading vehicles list....</p>;
    if (isError) return <p className="p-10 text-center text-red-500">Failed to load vehicles list</p>;

    return (
        <div className='pb-6 space-y-6'>

            {/* header */}
            <div className='w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0'>
                <div className='flex flex-col'>
                    <h1 className='text-xl md:text-2xl font-bold'>My Vehicles</h1>
                    <p className='text-xs md:text-sm text-gray-600 p-px'>
                        Manage and track all your vehicle listings
                    </p>
                </div>
            </div>

            {/* stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 my-6">
                {stats.map((stat) => {
                    const IconComponent = stat.icon;
                    return (
                        <div
                            key={stat.id}
                            className="group relative overflow-hidden rounded-xl border border-slate-200/70 bg-linear-to-br from-white via-white to-slate-50/50 p-3.5 sm:p-5 shadow-xs sm:shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-amber-300/80 hover:shadow-xl cursor-pointer"
                        >
                            <div className="flex items-center justify-between sm:block">
                                <div className="flex items-center gap-3 sm:block">
                                    <div
                                        className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl ${stat.iconBg} shadow-xs transition-transform duration-300 group-hover:scale-110`}
                                    >
                                        <IconComponent
                                            className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.iconColor}`}
                                        />
                                    </div>
                                    <span className="hidden sm:inline-block h-2 w-2 rounded-full bg-slate-200 transition-colors duration-300 group-hover:bg-amber-400 float-right" />
                                </div>

                                {/* Text Section */}
                                <div className="mt-0 sm:mt-4 text-right sm:text-left">
                                    <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                                        {stat.title}
                                    </p>

                                    <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#0B1E3D]">
                                        {stat.value}
                                    </h3>

                                    <div className="mt-1 sm:mt-2 flex items-center justify-end sm:justify-start gap-1.5">
                                        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] sm:text-[11px] font-bold ${stat.subtitleColor} bg-slate-100/80`}>
                                            {stat.subtitle}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* search / filter */}
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
                    <FilterDropdown label="Sort By: Newest" options={sortOptions} value={sortBy} onChange={setSortBy} />
                </div>
            </div>

            {/* list */}
            <div className="overflow-x-auto border border-slate-200/80 rounded-xl shadow-xs bg-white">
                <table className="w-full text-left table-fixed">
                    <thead className="bg-white border-b border-slate-200 text-[#0B1E3D] uppercase text-[11px] font-extrabold tracking-wider">
                        <tr>
                            <th className="px-6 py-4.5 w-32">Listing Id</th>
                            <th className="px-6 py-4.5 w-75">Vehicle</th>
                            <th className="px-6 py-4.5 w-50">Admin Approval</th>
                            <th className="px-6 py-4.5 w-40">Auction Status</th>
                            <th className="px-6 py-4.5 w-40">Auction Type</th>
                            <th className="px-6 py-4.5 w-40">Current / Starting Bid</th>
                            <th className="px-6 py-4.5 w-30">Views</th>
                            <th className="px-6 py-4.5 w-40">Ends In / Start Date</th>
                            <th className="px-6 py-4.5 w-50 pl-10">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                        {myVehicles?.vehicles?.length > 0 ? (
                            myVehicles.vehicles.map((vehicle, index) => {

                                const bidAmount =
                                    vehicle.currentBid !== null && vehicle.currentBid !== undefined
                                        ? vehicle.currentBid
                                        : vehicle.startingBidPrice;

                                const bidLabel =
                                    vehicle.currentBid !== null && vehicle.currentBid !== undefined
                                        ? "Current Bid"
                                        : "Starting Bid";

                                const endDate = vehicle.auctionEndDateTime
                                    ? new Date(vehicle.auctionEndDateTime)
                                    : null;

                                return (
                                    <tr
                                        key={vehicle._id || index}
                                        className="hover:bg-slate-50/60 transition-colors"
                                    >
                                        {/* id */}
                                        <td className="px-6 py-4 text-[14px] text-gray-600">
                                            {vehicle.listingId}
                                        </td>

                                        {/* vehicle detail */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3.5">
                                                <div className="h-14 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-200/80 bg-slate-100 shadow-xs">
                                                    <img
                                                        src={vehicle.images?.[0]?.url || null}
                                                        alt={vehicle.make}
                                                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                                    />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h4 className="truncate text-sm font-bold text-[#0B1E3D]">
                                                        {vehicle.year} {vehicle.make} {vehicle.model}
                                                    </h4>
                                                    <p className="mt-0.5 text-xs font-medium text-slate-400 tracking-tight">
                                                        {vehicle.vin}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* admin approval */}
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col items-start gap-1">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold
                                                 ${vehicle.adminStatus === 'pending'
                                                        ? 'bg-amber-50 text-amber-600 border border-amber-200/60'
                                                        : vehicle.adminStatus === 'approved'
                                                            ? 'bg-green-50 text-green-700 border border-green-200/60'
                                                            : 'bg-red-50 text-red-600 border border-red-200/60'
                                                    }`}>
                                                    {vehicle.adminStatus === 'pending' ? 'Pending Approval' :
                                                        vehicle.adminStatus === 'approved' ? 'Approved' : 'Rejected'}
                                                </span>

                                                <span className="text-[11px] font-medium text-slate-400">
                                                    {vehicle.adminStatus === "approved"
                                                        ? vehicle.reviewedAt
                                                            ? `Approved on ${new Date(
                                                                vehicle.reviewedAt
                                                            ).toLocaleDateString("en-US", {
                                                                month: "short",
                                                                day: "2-digit",
                                                                year: "numeric",
                                                            })}`
                                                            : "Approved"
                                                        : vehicle.adminStatus === "pending"
                                                            ? "Awaiting admin review"
                                                            : vehicle.rejectionReason || "Application rejected"}
                                                </span>
                                            </div>
                                        </td>

                                        {/* auction status */}
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold 
                                            ${vehicle.auctionStatus === "live"
                                                    ? "bg-emerald-50 text-emerald-600 border border-emerald-200/60"
                                                    : vehicle.auctionStatus === "upcoming"
                                                        ? "bg-blue-50 text-blue-600 border border-blue-200/60"
                                                        : vehicle.auctionStatus === "draft"
                                                            ? "bg-slate-100 text-slate-600 border border-slate-200/60"
                                                            : vehicle.auctionStatus === "sold"
                                                                ? "bg-purple-50 text-purple-700 border border-purple-200/60"
                                                                : vehicle.auctionStatus === "unsold" ||
                                                                    vehicle.auctionStatus === "reserve-not-met" ||
                                                                    vehicle.auctionStatus === "canceled"
                                                                    ? "bg-red-50 text-red-600 border border-red-200/60"
                                                                    : "bg-slate-100 text-slate-600 border border-slate-200/60"
                                                }`}>
                                                {vehicle.auctionStatus
                                                    ? vehicle.auctionStatus
                                                        .split("-")
                                                        .map(
                                                            word =>
                                                                word.charAt(0).toUpperCase() +
                                                                word.slice(1)
                                                        )
                                                        .join(" ")
                                                    : "Unknown"}
                                            </span>
                                        </td>

                                        {/* auction type */}
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-[11px] font-semibold border 
                                            ${vehicle.auctionType === 'timed'
                                                    ? 'bg-purple-50 text-purple-600 border-purple-200/60'
                                                    : 'bg-emerald-50 text-emerald-600 border-emerald-200/50'
                                                }`}>
                                                {vehicle.auctionType === 'timed' ? "Timed Auction" : "Live Auction"}
                                            </span>
                                        </td>

                                        {/* Current Bid / Starting Bid Column */}
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-[#0B1E3D]">
                                                    AED {bidAmount?.toLocaleString() || "0"}
                                                </span>
                                                <span className="text-[11px] font-medium text-slate-400">
                                                    {bidLabel || '---'}
                                                </span>
                                            </div>
                                        </td>

                                        {/* views */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-slate-500">
                                                <Eye size={15} className="text-slate-400" />
                                                <span className="text-xs font-semibold text-[#0B1E3D]">
                                                    {vehicle.views || 0}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Ends */}
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                {endDate ? (
                                                    <>
                                                        <span className="text-xs font-bold text-[#0B1E3D]">
                                                            {endDate.toLocaleDateString("en-US", {
                                                                month: "short",
                                                                day: "2-digit",
                                                                year: "numeric",
                                                            })}
                                                        </span>

                                                        <span className="mt-0.5 text-[11px] font-semibold text-slate-400">
                                                            {endDate.toLocaleTimeString("en-US", {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                                hour12: true,
                                                            })}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="text-xs font-bold text-slate-400">
                                                            Not scheduled
                                                        </span>

                                                        <span className="mt-0.5 text-[11px] font-semibold text-slate-400">
                                                            —
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </td>

                                        {/* actions */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedMyVehicleId(vehicle._id);
                                                        setCurrentPage('my-vehicles-detail')
                                                    }}
                                                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#0B1E3D] shadow-xs transition-all hover:bg-slate-50 hover:border-slate-300"
                                                >
                                                    View Details
                                                </button>

                                                <button
                                                    type="button"
                                                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                                                >
                                                    <MoreVertical size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        ) : (
                            <tr>
                                <td
                                    colSpan={9}
                                    className="px-6 py-12 text-center text-gray-500"
                                >
                                    No Data Found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
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
                            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600
                            hover:bg-slate-50 hover:border-slate-300
                            disabled:opacity-40 disabled:cursor-not-allowed
                            transition-all"
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
                            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600
                            hover:bg-slate-50 hover:border-slate-300
                            disabled:opacity-40 disabled:cursor-not-allowed
                            transition-all"
                        >
                            Next
                        </button>

                    </div>
                </div>
            )}

        </div>
    )
}

export default MyVehicles;

import React, { useState } from 'react';
import { CarFront, CheckCircle2, Clock, Eye, Gavel, MoreVertical, Sparkles } from 'lucide-react';
import SearchBar from '../SellerSharedComponents/SearchBar';
import FilterDropdown from '../SellerSharedComponents/FilterDropdown';
import { myVehiclesData } from '../SellerSharedComponents/SellerData';

const statsData = [
    {
        id: "total-vehicles",
        title: "Total Vehicles",
        value: "12",
        subtitle: "All Listings",
        subtitleColor: "text-green-600",
        icon: CarFront,
        iconBg: "bg-slate-100",
        iconColor: "text-slate-700",
    },
    {
        id: "pending-approval",
        title: "Pending Approval",
        value: "3",
        subtitle: "Awaiting Review",
        subtitleColor: "text-amber-500",
        icon: Clock,
        iconBg: "bg-amber-50",
        iconColor: "text-amber-600",
    },
    {
        id: "active-listings",
        title: "Active Listings",
        value: "5",
        subtitle: "Live Now",
        subtitleColor: "text-green-600",
        icon: CheckCircle2,
        iconBg: "bg-emerald-50",
        iconColor: "text-emerald-600",
    },
    {
        id: "upcoming-auctions",
        title: "Upcoming Auctions",
        value: "2",
        subtitle: "Starts Soon",
        subtitleColor: "text-blue-600",
        icon: Gavel,
        iconBg: "bg-blue-50",
        iconColor: "text-blue-600",
    },
    {
        id: "sold-vehicles",
        title: "Sold Vehicles",
        value: "2",
        subtitle: "Completed",
        subtitleColor: "text-purple-600",
        icon: Sparkles,
        iconBg: "bg-purple-50",
        iconColor: "text-purple-600",
        extraClass: "sm:col-span-2 lg:col-span-1",
    },
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

const sortOptions = [
    { value: "newest", label: "Sort By: Newest" },
    { value: "oldest", label: "Sort By: Oldest" },
    { value: "price-high", label: "Sort By: Price (High to Low)" },
    { value: "price-low", label: "Sort By: Price (Low to High)" },
];

function MyVehicles({ setCurrentPage, setSelectedMyVehicleId }) {

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [auctionType, setAuctionType] = useState("");
    const [sortBy, setSortBy] = useState("newest");

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
                {statsData.map((stat) => {
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
                        {myVehiclesData.map((vehicle) => (
                            <tr
                                key={vehicle.id}
                                className="hover:bg-slate-50/60 transition-colors"
                            >
                                {/* vehicle detail */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3.5">
                                        <div className="h-14 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-200/80 bg-slate-100 shadow-xs">
                                            <img
                                                src={vehicle.image}
                                                alt={vehicle.name}
                                                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                            />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h4 className="truncate text-sm font-bold text-[#0B1E3D]">
                                                {vehicle.name}
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
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${vehicle.adminStatus === 'pending' ? 'bg-amber-50 text-amber-600 border border-amber-200/60' :
                                            vehicle.adminStatus === 'approved' ? 'bg-green-50 text-green-700 border border-green-200/60' :
                                                'bg-red-50 text-red-600 border border-red-200/60' // rejected
                                            }`}>
                                            {vehicle.adminStatus === 'pending' ? 'Pending Approval' :
                                                vehicle.adminStatus === 'approved' ? 'Approved' : 'Rejected'}
                                        </span>

                                        <span className="text-[11px] font-medium text-slate-400">
                                            {vehicle.status.subtext}
                                        </span>
                                    </div>
                                </td>

                                {/* auction status */}
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${vehicle.auctionStatus === 'live' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60' :
                                        vehicle.auctionStatus === 'upcoming' ? 'bg-blue-50 text-blue-600 border border-blue-200/60' :
                                            vehicle.auctionStatus === 'draft' ? 'bg-slate-100 text-slate-600 border border-slate-200/60' :
                                                vehicle.auctionStatus === 'sold' ? 'bg-purple-50 text-purple-700 border border-purple-200/60' :
                                                    'bg-red-50 text-red-600 border border-red-200/60' // expired or default
                                        }`}>
                                        {vehicle.auctionStatus.charAt(0).toUpperCase() + vehicle.auctionStatus.slice(1)}
                                    </span>
                                </td>

                                {/* auction type */}
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-[11px] font-semibold border ${vehicle.auctionType === 'Buy Now'
                                        ? 'bg-purple-50 text-purple-600 border-purple-200/60'
                                        : 'bg-emerald-50 text-emerald-600 border-emerald-200/50'
                                        }`}>
                                        {vehicle.auctionType}
                                    </span>
                                </td>

                                {/* Current Bid / Starting Bid Column */}
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-[#0B1E3D]">
                                            {vehicle.bid.amount}
                                        </span>
                                        <span className="text-[11px] font-medium text-slate-400">
                                            {vehicle.bid.label}
                                        </span>
                                    </div>
                                </td>

                                {/* views */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1.5 text-slate-500">
                                        <Eye size={15} className="text-slate-400" />
                                        <span className="text-xs font-semibold text-[#0B1E3D]">
                                            {vehicle.views}
                                        </span>
                                    </div>
                                </td>

                                {/* ends */}
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-[#0B1E3D]">
                                            {vehicle.timing.date}
                                        </span>
                                        <span className={`mt-0.5 text-[11px] font-semibold ${vehicle.timing.statusColor}`}>
                                            {vehicle.timing.timeLeft}
                                        </span>
                                    </div>
                                </td>

                                {/* actions */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedMyVehicleId(vehicle.id);
                                                setCurrentPage('my-vehicles-detail')
                                            }}
                                            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#0B1E3D] shadow-xs transition-all hover:bg-slate-50 hover:border-slate-300"
                                        >
                                            {vehicle.action.label}
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
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    )
}

export default MyVehicles;
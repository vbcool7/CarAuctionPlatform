
import React, { useState } from 'react'
import AuctionsHeader from '../Shared/AuctionsHeader';
import UpcomingAuctionsStats from './UpcomingAuctionsStats';
import SearchBar from '../Shared/Filters/SearchBar';
import FilterDropdown from '../Shared/Filters/FilterDropDown';
import UpcomingAuctionsList from './UpcomingAuctionsList';
import UpcomingAuctionsCalender from './UpcomingAuctionsCalender';

function UpcomingAuctions({ onSelectVehicle, setCurrentPage }) {

    const [selectedType, setSelectedType] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");

    return (
        <div>
            <AuctionsHeader
                setCurrentPage={setCurrentPage}
                pageTitle="Upcoming Auctions"
                breadcrumbLabel="All Upcoming Auctions"
            />

            <UpcomingAuctionsStats />

            {/* Search / Filter */}
            <div className="my-6 bg-white border border-slate-200 rounded-xl p-4 space-y-4">

                {/* Row 1 */}
                <div className="flex flex-wrap md:flex-nowrap items-center gap-3">

                    {/* Search */}
                    <div className="flex-1 sm:w-75">
                        <SearchBar />
                    </div>

                    {/* Status */}
                    <div className="w-full sm:w-42.5">
                        <FilterDropdown
                            label="All Status"
                            options={[
                                { label: "NA", value: "na" },
                                { label: "NA", value: "na" }
                            ]}
                            value={selectedType}
                            onChange={setSelectedType}
                        />
                    </div>

                    {/* Type */}
                    <div className="w-full sm:w-42.5">
                        <FilterDropdown
                            label="All Type"
                            options={[
                                { label: "Standard", value: "standard" },
                                { label: "Reserve", value: "reserve" }
                            ]}
                            value={selectedType}
                            onChange={setSelectedType}
                        />
                    </div>

                    {/* Category */}
                    <div className="w-full sm:w-45">
                        <FilterDropdown
                            label="All Categories"
                            options={[
                                { label: "SUV", value: "suv" },
                                { label: "Sedan", value: "sedan" }
                            ]}
                            value={selectedCategory}
                            onChange={setSelectedCategory}
                        />
                    </div>

                </div>

                {/* Row 2 */}
                <div className="flex flex-wrap items-center justify-between gap-3">

                    {/* Date Range */}
                    <div className="flex items-center gap-2 h-11 px-4 border border-slate-300 rounded-lg bg-white text-sm text-slate-600">
                        <span>📅</span>
                        <span>May 01, 2024 - May 31, 2024</span>
                    </div>

                    {/* Clear Filters */}
                    <button className="text-sm font-medium text-[#D97706] hover:underline">
                        Clear Filters
                    </button>

                </div>

            </div>

            {/* main section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 pb-6 gap-6">

                {/* left side */}
                <div className="lg:col-span-2 space-y-6">
                    <UpcomingAuctionsList
                        setCurrentPage={setCurrentPage}
                        onSelectVehicle={onSelectVehicle}
                    />
                </div>

                {/* right side */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">

                    {/* calender + list + notification badge */}
                    <UpcomingAuctionsCalender />
                </div>
            </div>
        </div>
    )
}

export default UpcomingAuctions;
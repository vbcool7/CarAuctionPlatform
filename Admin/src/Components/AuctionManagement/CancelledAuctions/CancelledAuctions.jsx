
import React, { useState } from 'react'
import AuctionsHeader from '../Shared/AuctionsHeader';
import CancelledAuctionsStats from './CancelledAuctionsStats';
import SearchBar from '../../SharedComponents/SearchBar';
import FilterDropdown from '../../SharedComponents/FilterDropdown';
import CancelledAuctionsList from './CancelledAuctionsList';
import SummaryDonutCard from '../../SharedComponents/SummaryDonutCard';
import ContactSupport from '../../SharedComponents/ContactSupport';
import CancelledAuctionsCategories from './CancelledAuctionsCategories';

function CancelledAuctions({ setCurrentPage, onSelectVehicle }) {

    const [selectedReason, setSelectedReason] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedType, setSelectedType] = useState("");

    return (
        <div>
            <AuctionsHeader
                setCurrentPage={setCurrentPage}
                pageTitle="Cancelled Auctions"
                breadcrumbLabel="All Cancelled Auctions"
            />

            <CancelledAuctionsStats />

            {/* Search / Filter */}
            <div className="my-6 bg-white border border-slate-200 rounded-xl p-4 space-y-4">

                {/* Row 1 */}
                <div className="flex flex-wrap md:flex-nowrap items-center gap-3">

                    {/* Search */}
                    <div className="flex-1 sm:w-75">
                        <SearchBar />
                    </div>

                    {/* reason */}
                    <div className="w-full sm:w-42.5">
                        <FilterDropdown
                            label="All Reasons"
                            options={[
                                { label: "NA", value: "na" },
                                { label: "NA", value: "na" }
                            ]}
                            value={selectedReason}
                            onChange={setSelectedReason}
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
                    <CancelledAuctionsList
                        setCurrentPage={setCurrentPage}
                        onSelectVehicle={onSelectVehicle}
                    />
                </div>

                {/* right side */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">
                    <SummaryDonutCard
                        title="Cancelled Reasons"
                        centerValue="12"
                        centerLabel="Total"
                        showPercentage={false}
                        segments={[
                            { name: 'Not enough participants', value: 5, color: '#3B82F6' },
                            { name: 'Vehicle not available', value: 2, color: '#22C55E' },
                            { name: 'Payment issue', value: 1, color: '#F59E0B' },
                            { name: 'Logistics issue', value: 1, color: '#A855F7' },
                            { name: 'Reserve not met', value: 1, color: '#F97316' },
                            { name: 'Others', value: 2, color: '#94A3B8' }
                        ]}
                    />

                    <CancelledAuctionsCategories />

                    <ContactSupport />
                </div>
            </div>
        </div>
    )
}

export default CancelledAuctions;
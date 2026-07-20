
import React, { useState } from 'react'
import AllAuctionsHeader from './AllAuctionsHeader';
import AllAuctionsStats from './AllAuctionsStats';
import FilterDropdown from '../Shared/Filters/FilterDropDown';
import SearchBar from '../Shared/Filters/SearchBar';
import SummaryDonutCard from '../../SharedComponents/SummaryDonutCard';
import AllAuctionsList from './AllAuctionsList';
import TopPerformanceAuctions from './TopPerformanceAuctions';

function AllAuctions({ setCurrentPage, setSelectedAuction }) {

    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    return (
        <div>
            <AllAuctionsHeader setCurrentPage={setCurrentPage} />

            <AllAuctionsStats />

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

                {/* left side - section */}
                <div className="lg:col-span-2 space-y-6">
                    <AllAuctionsList
                        setCurrentPage={setCurrentPage}
                        setSelectedAuction={setSelectedAuction}
                    />
                </div>

                {/* right side - section */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">
                    <SummaryDonutCard
                        title="Quick Stats"
                        centerValue="48"
                        centerLabel="Total"
                        showPercentage={true}
                        segments={[
                            { name: 'Live', value: 60, color: '#10B981' },
                            { name: 'Upcoming', value: 6, color: '#3B82F6' },
                            { name: 'Completed', value: 8, color: '#34D399' },
                            { name: 'Cancelled', value: 8, color: '#EF4444' },
                        ]}
                    />

                    <TopPerformanceAuctions />
                </div>
            </div>
        </div>
    )
}

export default AllAuctions;
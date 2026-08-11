
import React, { useState } from 'react'
import AuctionsHeader from '../Shared/AuctionsHeader';
import LiveAuctionsList from './LiveAuctionsList';
import LiveAuctionsStats from './LiveAuctionsStats';
import SearchBar from '../../SharedComponents/SearchBar';
import FilterDropdown from '../../SharedComponents/FilterDropdown';
import LiveAuctionsSidebar from './LiveAuctionsSidebar';

function LiveAuctions({ setCurrentPage, onSelectVehicle }) {

    const [selectedType, setSelectedType] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSort, setSelectedSort] = useState("");

    return (
        <div>
            <AuctionsHeader
                setCurrentPage={setCurrentPage}
                pageTitle="Live Auctions"
                breadcrumbLabel="All Live Auctions"
            />

            <LiveAuctionsStats />

            {/* search / filter - not perfect */}
            <div className="my-6 flex flex-wrap items-center gap-3 bg-white p-2 rounded-xl">

                <div className="grow">
                    <SearchBar />
                </div>

                {/* Filter Dropdowns */}
                <div className="flex flex-wrap items-center gap-3">

                    <FilterDropdown
                        label="All Type"
                        options={[{ label: "Standard", value: "standard" }, { label: "Reserve", value: "reserve" }]}
                        value={selectedType}
                        onChange={setSelectedType}
                    />

                    <FilterDropdown
                        label="All Categories"
                        options={[{ label: "SUV", value: "suv" }, { label: "Sedan", value: "sedan" }]}
                        value={selectedCategory}
                        onChange={setSelectedCategory}
                    />

                    <FilterDropdown
                        label="Sort By"
                        options={[{ label: "Ending Soon", value: "ending-soon" }, { label: "Ending Soon", value: "ending-soon" }]}
                        value={selectedSort}
                        onChange={setSelectedSort}
                    />

                    {/* Clear Filters */}
                    <button className="text-sm text-[#D97706] hover:underline px-2">
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* main section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 pb-6 gap-6">

                {/* left side */}
                <div className="lg:col-span-2 space-y-6">
                    <LiveAuctionsList
                        setCurrentPage={setCurrentPage}
                        onSelectVehicle={onSelectVehicle}
                    />
                </div>

                {/* right side */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">
                    <LiveAuctionsSidebar />
                </div>
            </div>
        </div>
    )
}

export default LiveAuctions;
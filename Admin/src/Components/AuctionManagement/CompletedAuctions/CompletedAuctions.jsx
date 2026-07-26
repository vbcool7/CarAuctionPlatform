
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { DollarSign, Gavel, Wallet, TrendingUp } from 'lucide-react';
import AuctionsHeader from '../Shared/AuctionsHeader';
import CompletedAuctionsStats from './CompletedAuctionsStats';
import SearchBar from '../Shared/Filters/SearchBar';
import FilterDropdown from '../Shared/Filters/FilterDropDown';
import CompletedAuctionsList from './CompletedAuctionsList';
import ContactSupport from '../../SharedComponents/ContactSupport';

const completedHighlights = [
    {
        id: 1,
        date: "2026-05-21",
        status: "highSales",
    },
    {
        id: 2,
        date: "2026-05-22",
        status: "completed",
    },
    {
        id: 3,
        date: "2026-05-23",
        status: "completed",
    },
    {
        id: 4,
        date: "2026-05-23",
        status: "unsold",
    },
    {
        id: 5,
        date: "2026-06-23",
        status: "unsold",
    },
];

// completion highlight
const highlights = [
    {
        title: "Highest Sold Price",
        value: "$45,500",
        date: "May 30, 2024",
        icon: DollarSign,
        theme: "text-emerald-600 bg-emerald-50"
    },
    {
        title: "Most Bids",
        value: "18 Bids",
        date: "May 30, 2024",
        icon: Gavel,
        theme: "text-emerald-600 bg-emerald-50"
    },
    {
        title: "Total Sold Value",
        value: "$612,450",
        date: "This Month",
        icon: Wallet,
        theme: "text-amber-600 bg-amber-50"
    },
    {
        title: "Sell Through Rate",
        value: "78.6%",
        date: "This Month",
        icon: TrendingUp,
        theme: "text-emerald-600 bg-emerald-50"
    }
];

function CompletedAuctions({ onSelectVehicle, setCurrentPage }) {

    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedType, setSelectedType] = useState("");

    const [selectedDate, setSelectedDate] = useState(new Date("2026-05-21"));

    const highlightedDates = [
        {
            "highlight-high-sales": completedHighlights
                .filter(item => item.status === "highSales")
                .map(item => new Date(item.date)),
        },
        {
            "highlight-completed": completedHighlights
                .filter(item => item.status === "completed")
                .map(item => new Date(item.date)),
        },
        {
            "highlight-unsold": completedHighlights
                .filter(item => item.status === "unsold")
                .map(item => new Date(item.date)),
        },
    ];

    return (
        <div>
            <AuctionsHeader
                setCurrentPage={setCurrentPage}
                pageTitle="Completed Auctions"
                breadcrumbLabel="All Completed Auctions"
            />

            <CompletedAuctionsStats />

            {/* Search / Filter */}
            <div className="my-6 bg-white border border-slate-200 rounded-xl p-4 space-y-4">

                {/* Row 1 */}
                <div className="flex flex-wrap md:flex-nowrap items-center gap-3">

                    {/* Search */}
                    <div className="flex-1 sm:w-75">
                        <SearchBar />
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

                    {/* status */}
                    <div className="w-full sm:w-42.5">
                        <FilterDropdown
                            label="All Status"
                            options={[
                                { label: "NA", value: "na" },
                                { label: "NA", value: "na" }
                            ]}
                            value={selectedStatus}
                            onChange={setSelectedStatus}
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
                    <CompletedAuctionsList
                        setCurrentPage={setCurrentPage}
                        onSelectVehicle={onSelectVehicle}
                    />
                </div>

                {/* right side */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">

                    {/* calender */}
                    <div className=" bg-white border border-slate-200 rounded-2xl p-4">
                        <h3 className="text-sm font-semibold text-[#0B1E3D] mb-4">
                            Auction Completion Calendar
                        </h3>

                        <div className='bg-white border border-slate-200 rounded-2xl p-4 shadow-sm'>
                            <DatePicker
                                inline
                                selected={selectedDate}
                                highlightDates={highlightedDates}
                                onChange={(date) => setSelectedDate(date)}
                                calendarClassName="completed-auction-calendar"
                                openToDate={new Date("2026-05-21")}
                            />

                            <div className="space-y-2 text-[12px] border-t border-gray-200 pt-2.5">
                                <div className="flex items-center gap-2">
                                    <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                                    <span className="text-[#0B1E3D]">High Sales Day</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                                    <span className="text-[#0B1E3D]">Completed Auction</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                                    <span className="text-[#0B1E3D]">Unsold Auction</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* completion highlight */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-[#0B1E3D]">
                                Completion Highlights
                            </h3>
                            <span className="text-xs font-medium text-[#D97706] cursor-pointer hover:underline">
                                View All
                            </span>
                        </div>

                        <div className="space-y-4">
                            {highlights.map((item, index) => {
                                const IconComponent = item.icon;
                                return (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className={`p-2 rounded-xl ${item.theme}`}>
                                                <IconComponent className="w-3.5 h-3.5" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium">{item.title}</p>
                                                <p className="text-sm font-bold text-[#0B1E3D]">{item.value}</p>
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-400 font-medium">{item.date}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* support */}
                    <ContactSupport />
                </div>
            </div>

        </div>
    )
}

export default CompletedAuctions;
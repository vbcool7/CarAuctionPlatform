
import React, { useState } from 'react';
import { CheckCircle2, XCircle, Download, Filter, Calendar } from 'lucide-react';
import VehicleApprovalsList from './VehicleApprovalsList';
import SummaryDonutCard from '../SharedComponents/SummaryDonutCard';
import QuickActionsCard from '../SharedComponents/QuickActionsCard';
import NotesSection from '../SharedComponents/NotesSection';
import VehicleApprovalsDetail from './VehicleApprovalsDetail';
import SearchBar from '../AuctionManagement/Shared/Filters/SearchBar';
import FilterDropdown from '../AuctionManagement/Shared/Filters/FilterDropDown';

function VehicleApprovals({ setCurrentPage }) {

    const [activeTab, setActiveTab] = useState("all requests");
    const [selectedVehicle, setSelectedVehicle] = useState(null);

    const [selectedMake, setSelectedMake] = useState("");
    const [selectedVehicleType, setSelectedVehicleType] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSelectedVehicle(null);
    };

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between pb-6">

                {/* Left */}
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3D]">
                        Vehicle Approvals
                    </h1>

                    <div className="mt-2 flex items-center text-[11px] md:text-[13px]">
                        <span
                            onClick={() => setCurrentPage("dashboard")}
                            className="cursor-pointer text-slate-500 hover:text-[#D97706] transition-colors"
                        >
                            Dashboard
                        </span>
                        <span className="mx-2 text-slate-300">/</span>
                        <span className="font-medium text-[#D97706]">
                            Vehicle Approvals
                        </span>
                    </div>
                </div>

                {/* Right */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <button
                        className="text-sm md:text-[16px] flex justify-center items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2 md:py-2.5 font-medium text-[#0B1E3D] shadow-sm transition-all duration-300 hover:border-[#D97706] hover:bg-amber-50"
                    >
                        <Filter className='w-4 h-4 md:w-5 md:h-5' />
                        Filter
                    </button>

                    <button
                        className="text-sm md:text-[16px] flex justify-center items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2 md:py-2.5 font-medium text-[#0B1E3D] shadow-sm transition-all duration-300 hover:border-[#D97706] hover:bg-amber-50"
                    >
                        <Download className='w-4 h-4 md:w-5 md:h-5' />
                        Export
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="mb-6 flex items-center gap-6 md:gap-8 border-b border-slate-200 overflow-x-auto scrollbar-hide">
                {["all requests", "pending", "approved", "rejected"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-3 text-sm font-medium transition-all whitespace-nowrap capitalize
                        ${activeTab === tab
                                ? "border-b-2 border-[#D97706] text-[#D97706]"
                                : "text-slate-500 hover:text-[#0B1E3D]"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Search / Filter */}
            <div className="my-6 bg-white border border-slate-200 rounded-xl p-4 space-y-4">

                {/* Row 1 */}
                <div className="flex flex-wrap md:flex-nowrap items-center gap-3">

                    {/* Search */}
                    <div className="flex-1 sm:w-75">
                        <SearchBar />
                    </div>

                    {/* makes */}
                    <div className="w-full sm:w-42.5">
                        <FilterDropdown
                            label="All Makes"
                            options={[
                                { label: "NA", value: "na" },
                                { label: "NA", value: "na" }
                            ]}
                            value={selectedMake}
                            onChange={setSelectedMake}
                        />
                    </div>

                    {/* vehicle */}
                    <div className="w-full sm:w-42.5">
                        <FilterDropdown
                            label="All Vehicle Types"
                            options={[
                                { label: "Standard", value: "standard" },
                                { label: "Reserve", value: "reserve" }
                            ]}
                            value={selectedVehicleType}
                            onChange={setSelectedVehicleType}
                        />
                    </div>

                    {/* status */}
                    <div className="w-full sm:w-45">
                        <FilterDropdown
                            label="All Status"
                            options={[
                                { label: "SUV", value: "suv" },
                                { label: "Sedan", value: "sedan" }
                            ]}
                            value={selectedStatus}
                            onChange={setSelectedStatus}
                        />
                    </div>

                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">

                    {/* Date Range */}
                    <div className="w-full sm:w-auto flex items-center gap-2 h-9.5 px-3 md:px-4 border border-slate-300 rounded-lg bg-white text-[13px] md:text-sm text-slate-600">
                        <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                        <span className="truncate">
                            May 01, 2024 - May 31, 2024
                        </span>
                    </div>

                    {/* Clear Filters */}
                    <button className="text-xs md:text-sm font-medium text-[#D97706] hover:underline">
                        Clear Filters
                    </button>
                </div>

            </div>

            {/* main section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 pb-6 gap-6">

                {/* left side - section */}
                <div className="lg:col-span-2 space-y-6">
                    <VehicleApprovalsList
                        activeTab={activeTab}
                        onSelectVehicle={setSelectedVehicle}
                    />
                </div>

                {/* right side - section */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">
                    {selectedVehicle ? (
                        <VehicleApprovalsDetail
                            selectedVehicle={selectedVehicle}
                        />
                    ) : (
                        <>
                            <SummaryDonutCard
                                title="Approval Summary"
                                centerValue="32"
                                centerLabel="Total Requests"
                                showPercentage={true}
                                segments={[
                                    { name: 'Approved', value: 60, color: '#10B981' },
                                    { name: 'Pending', value: 6, color: '#F59E0B' },
                                    { name: 'Rejected', value: 8, color: '#FF0000' },
                                ]}
                            />

                            <QuickActionsCard
                                actions={[
                                    { label: "Approve All Pending", icon: CheckCircle2, onClick: () => { } },
                                    { label: "Reject All Pending", icon: XCircle, onClick: () => { }, variant: 'danger' },
                                    { label: "Download Report", icon: Download, onClick: () => { }, },
                                ]}
                            />

                            <NotesSection
                                message="Review all vehicle details and documents carefully before approving or rejecting the request. Approved vehicles will be visible to buyers."
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default VehicleApprovals;
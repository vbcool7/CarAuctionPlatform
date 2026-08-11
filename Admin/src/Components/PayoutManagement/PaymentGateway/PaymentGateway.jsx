
import React, { useState } from 'react';
import { CheckCircle, DollarSign, Download, Filter, HelpCircle, Landmark, PauseCircle, XCircle } from 'lucide-react';
import SearchBar from '../../SharedComponents/SearchBar';
import FilterDropdown from '../../SharedComponents/FilterDropdown';
import SummaryDonutCard from '../../SharedComponents/SummaryDonutCard';
import PaymentGatewayList from './PaymentGatewayList';

const allGatewaysStats = [
    {
        title: "Total Gateways",
        value: "6",
        subTitle: "All Payment Gateways",
        subTextColor: "text-slate-500",
        icon: Landmark,
        theme: "bg-purple-50",
        iconColor: "text-purple-600",
    },
    {
        title: "Active Gateways",
        value: "4",
        subTitle: "66.67% of total",
        subTextColor: "text-slate-500",
        icon: CheckCircle,
        theme: "bg-green-50",
        iconColor: "text-green-600",
    },
    {
        title: "Inactive Gateways",
        value: "1",
        subTitle: "16.67% of total",
        subTextColor: "text-slate-500",
        icon: PauseCircle,
        theme: "bg-amber-50",
        iconColor: "text-amber-500",
    },
    {
        title: "Error Gateways",
        value: "1",
        subTitle: "16.67% of total",
        subTextColor: "text-slate-500",
        icon: XCircle,
        theme: "bg-red-50",
        iconColor: "text-red-500",
    },
    {
        title: "Total Transactions",
        value: "18,645",
        subTitle: "↑ 15.6% from last month",
        subTextColor: "text-green-600",
        icon: DollarSign,
        theme: "bg-blue-50",
        iconColor: "text-blue-600",
    },
];

const topPerformingGateways = [
    {
        id: 1,
        name: "Razorpay",
        percentage: "99.1%",
        rank: 1,
        color: "bg-green-600"
    },
    {
        id: 2,
        name: "Stripe",
        percentage: "90.6%",
        rank: 2,
        color: "bg-green-600"
    },
    {
        id: 3,
        name: "Wise",
        percentage: "9%",
        rank: 3,
        color: "bg-green-600"
    },
];

function PaymentGateway({ setCurrentPage, setSelectedGatewayId }) {

    const [selectedStatus, setSelectedStatus] = useState();
    const [selectedCurrencies, setSelectedCurrencies] = useState();
    const [selectedEnvironments, setSelectedEnvironments] = useState();

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between pb-6">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3D]">
                        Payment Gateways
                    </h1>

                    <div className="mt-2 flex items-center text-[11px] md:text-[13px]">
                        <span
                            onClick={() => setCurrentPage("dashboard")}
                            className="cursor-pointer text-slate-500 hover:text-[#D97706] transition-colors">
                            Dashboard
                        </span>

                        <span className="mx-2 text-slate-300">/</span>

                        <span className="text-slate-500">Payment Management</span>

                        <span className="mx-2 text-slate-300">/</span>
                        <span className="font-medium text-[#D97706]">Payment Gateways</span>
                    </div>
                </div>

                {/* btns */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <button
                        onClick={() => setCurrentPage('add-new-payment-gateway')}
                        className="flex items-center justify-center gap-1.5 rounded-lg bg-[#D97706] px-4 py-2 font-medium text-white shadow-md shadow-amber-500/20 transition-all duration-200 hover:bg-[#B45F04] hover:scale-[1.02]">
                        <span className="text-sm">+ Add New Gateway</span>
                    </button>
                </div>
            </div>

            {/* stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-5 gap-4">
                {allGatewaysStats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className="bg-white rounded-xl border border-slate-100 p-4 shadow-md flex items-center justify-between"
                        >
                            <div>
                                <span className="text-xs font-semibold text-slate-500 block mb-0.5">
                                    {stat.title}
                                </span>
                                <h4 className="py-1 text-base font-bold text-slate-900 tracking-tight">
                                    {stat.value}
                                </h4>
                                <span className={`text-[11px] font-medium mt-1 block ${stat.subTextColor}`}>
                                    {stat.subTitle}
                                </span>
                            </div>
                            <div className={`w-11.5 h-11.5 rounded-xl flex items-center justify-center shrink-0 ${stat.theme} ${stat.iconColor}`}>
                                <Icon className="w-5.5 h-5.5" />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Search / Filter */}
            <div className="my-6 bg-white border border-slate-200 rounded-xl p-4 space-y-4">
                <div className="flex flex-nowrap items-center gap-3 overflow-x-auto">

                    {/* Search */}
                    <div className="min-w-50 flex-1">
                        <SearchBar />
                    </div>

                    {/* All Currencies */}
                    <div className="min-w-35 shrink-0">
                        <FilterDropdown
                            label="All Currencies"
                            options={[
                                { label: "Type A", value: "type-a" },
                                { label: "Type B", value: "type-b" }
                            ]}
                            value={selectedCurrencies}
                            onChange={setSelectedCurrencies}
                        />
                    </div>

                    {/* Status */}
                    <div className="min-w-35 shrink-0">
                        <FilterDropdown
                            label="All Status"
                            options={[
                                { label: "Completed", value: "completed" },
                                { label: "Pending", value: "pending" },
                                { label: "Failed", value: "failed" }
                            ]}
                            value={selectedStatus}
                            onChange={setSelectedStatus}
                        />
                    </div>

                    {/* Environments */}
                    <div className="min-w-35 shrink-0">
                        <FilterDropdown
                            label="All Environments"
                            options={[
                                { label: "na", value: "na" },
                                { label: "na", value: "na" }
                            ]}
                            value={selectedEnvironments}
                            onChange={setSelectedEnvironments}
                        />
                    </div>

                    {/* Filter Button with Icon */}
                    <div className="shrink-0">
                        <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs md:text-sm font-medium rounded-lg transition-colors">
                            <Filter className="w-4 h-4" />
                            <span>Filter</span>
                        </button>
                    </div>

                </div>
            </div>

            {/* main section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 pb-6 gap-6">

                {/* left side - section */}
                <div className="lg:col-span-2 space-y-6">
                    <PaymentGatewayList setCurrentPage={setCurrentPage} setSelectedGatewayId={setSelectedGatewayId} />
                </div>

                {/* right side - section */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">

                    <SummaryDonutCard
                        title="Gateway Health"
                        centerValue="6"
                        centerLabel="Total"
                        showPercentage={true}
                        prefix='$'
                        segments={[
                            { name: 'Active', value: 4, color: '#00B050' },
                            { name: 'Inactive', value: 1, color: '#FF9900' },
                            { name: 'Error', value: 1, color: '#FF3B30' },
                        ]}
                    />

                    {/* top gateways */}
                    <div className="w-full bg-white rounded-xl border border-slate-100 p-4 md:p-5 shadow-sm space-y-4">
                        <h3 className="font-bold text-slate-900 text-base">Top Performing Gateways</h3>

                        <div className="space-y-4">
                            {topPerformingGateways.map((item) => (
                                <div key={item.id} className="space-y-1.5">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2.5">
                                            <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold flex items-center justify-center">
                                                {item.rank}
                                            </span>
                                            <span className="font-semibold text-slate-900">{item.name}</span>
                                        </div>
                                        <span className="font-semibold text-slate-900">{item.percentage}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                        <div
                                            className={`${item.color} h-full rounded-full`}
                                            style={{ width: item.percentage }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-2">
                            <button className="text-sm font-semibold text-amber-600 hover:text-[#D97706] flex items-center gap-1 transition-colors">
                                View All Performance <span>→</span>
                            </button>
                        </div>
                    </div>

                    {/* quick action */}
                    <div className="w-full bg-white rounded-xl border border-slate-100 p-4 md:p-5 shadow-sm space-y-4">
                        <h3 className="font-bold text-slate-900 text-base">Quick Help</h3>

                        <div className="space-y-3">
                            {/* Help Item 1 */}
                            <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200/80 hover:bg-slate-50 transition-colors text-left">
                                <span className="text-indigo-600 shrink-0">
                                    <HelpCircle className="w-5 h-5" />
                                </span>
                                <span className="text-sm font-medium text-slate-800">How to add a new gateway?</span>
                            </button>

                            {/* Help Item 2 */}
                            <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200/80 hover:bg-slate-50 transition-colors text-left">
                                <span className="text-indigo-600 shrink-0">
                                    <HelpCircle className="w-5 h-5" />
                                </span>
                                <span className="text-sm font-medium text-slate-800">How to configure webhook?</span>
                            </button>

                            {/* Help Item 3 */}
                            <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200/80 hover:bg-slate-50 transition-colors text-left">
                                <span className="text-indigo-600 shrink-0">
                                    <HelpCircle className="w-5 h-5" />
                                </span>
                                <span className="text-sm font-medium text-slate-800">Supported currencies list</span>
                            </button>
                        </div>

                        <div className="pt-1">
                            <button className="w-full py-2.5 px-4 rounded-lg border border-[#D97706] text-[#D97706] hover:bg-amber-50/50 text-sm font-semibold transition-colors text-center">
                                View Documentation
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PaymentGateway;
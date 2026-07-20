
import React from 'react';
import { Clock, CheckCircle2, XCircle, Eye, Check, X, MoreHorizontal, Search, Calendar, ChevronDown, Filter } from 'lucide-react';
import { vehicleApproval } from '../Data';

function VehicleApprovalsList({ activeTab, onSelectVehicle }) {

    const columnConfig = {
        "all requests": {
            columns: [
                { key: "vehicleDetails", label: "Vehicle Details", width: "min-w-[305px]" },
                { key: "ownerSeller", label: "Owner / Seller", width: "min-w-[250px]" },
                { key: "submittedOn", label: "Submitted On", width: "min-w-[150px]" },
                { key: "status", label: "Status", width: "min-w-[120px]" },
                { key: "actions", label: "Actions", width: "min-w-[150px]" },
            ],
            actions: ["view", "approve", "reject"]
        },
        "pending": {
            columns: [
                { key: "vehicleDetails", label: "Vehicle Details", width: "min-w-[305px]" },
                { key: "ownerSeller", label: "Owner / Seller", width: "min-w-[250px]" },
                { key: "submittedOn", label: "Submitted On", width: "min-w-[150px]" },
                { key: "actions", label: "Actions", width: "min-w-[120px]" },
            ],
            actions: ["view", "approve", "reject"]
        },
        "approved": {
            columns: [
                { key: "vehicleDetails", label: "Vehicle Details", width: "min-w-[305px]" },
                { key: "ownerSeller", label: "Owner / Seller", width: "min-w-[200px]" },
                { key: "approvedOn", label: "Approved On", width: "min-w-[150px]" },
                { key: "approvedBy", label: "Approved By", width: "min-w-[150px]" },
                { key: "actions", label: "Actions", width: "min-w-[100px]" },
            ],
            actions: ["view", "more"]
        },
        "rejected": {
            columns: [
                { key: "vehicleDetails", label: "Vehicle Details", width: "min-w-[305px]" },
                { key: "ownerSeller", label: "Owner / Seller", width: "min-w-[200px]" },
                { key: "rejectedOn", label: "Rejected On", width: "min-w-[150px]" },
                { key: "rejectedBy", label: "Rejected By", width: "min-w-[150px]" },
                { key: "rejectedReason", label: "Reason", width: "min-w-[200px]" },
                { key: "actions", label: "Actions", width: "min-w-[100px]" },
            ],
            actions: ["view"]
        }
    };

    const config = columnConfig[activeTab];

    const filteredVehicles = vehicleApproval.filter((item) => {
        if (activeTab === "all request") return true;
        if (activeTab === "approved") return item.status === "Approved";
        if (activeTab === "pending") return item.status === "Pending";
        if (activeTab === "rejected") return item.status === "Rejected";
        return true;
    })

    return (
        <div>
            {/* search bar/filter */}
            <div className="mb-5 flex flex-wrap items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">

                {/* Search Input */}
                <div className="grow min-w-58 relative">
                    <input
                        type="text"
                        placeholder="Search by vehicle, user or VIN..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                </div>

                {/* Select Filters */}
                <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 cursor-pointer hover:bg-gray-50">
                    <span>All Vehicle Types</span>
                    <ChevronDown className="w-4 h-4" />
                </div>

                <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 cursor-pointer hover:bg-gray-50">
                    <span>All Makes</span>
                    <ChevronDown className="w-4 h-4" />
                </div>

                <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 cursor-pointer hover:bg-gray-50">
                    <span>All Status</span>
                    <ChevronDown className="w-4 h-4" />
                </div>

                {/* Date Filter */}
                <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 cursor-pointer">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>May 01, 2024 - May 31, 2024</span>
                    <ChevronDown className="w-4 h-4" />
                </div>

                {/* Clear Filters */}
                <button className="text-sm text-[#D97706] font-medium hover:underline ml-auto flex items-center gap-1">
                    <Filter className="w-4 h-4" />
                    Clear Filters
                </button>
            </div>

            {/* table */}
            <div className="w-full overflow-x-auto bg-white border border-gray-200 rounded-lg">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-xs text-gray-800 uppercase bg-gray-100 border-b border-gray-200">
                            {config.columns.map((col, index) => (
                                <th
                                    key={index}
                                    className={`px-6 py-4 font-medium ${col.width}`}
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {filteredVehicles.map((item, index) => {
                            return (
                                <tr key={index}>
                                    {config.columns.map((col) => (
                                        <td
                                            key={col.key}
                                            className="px-6 py-4 whitespace-nowrap"
                                        >
                                            {/* vehicle details */}
                                            {col.key === "vehicleDetails" && (
                                                <div className="flex items-center gap-4">

                                                    <img
                                                        src={item.vehicleDetails.imageUrl}
                                                        alt={item.vehicleDetails.name}
                                                        className="w-20 h-14 object-cover rounded-lg"
                                                    />

                                                    <div className="flex flex-col">
                                                        <span className="text-gray-700 font-bold text-sm">{item.vehicleDetails.name}</span>
                                                        <span className="text-[11px] pt-1 text-gray-500 font-medium">VIN: {item.vehicleDetails.vin}</span>
                                                        <div className="text-xs text-gray-400 mt-1 flex gap-2">
                                                            <span>{item.vehicleDetails.type}</span>
                                                            <span>•</span>
                                                            <span>{item.vehicleDetails.color}</span>
                                                            <span>•</span>
                                                            <span>{item.vehicleDetails.transmission}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* owner/seller */}
                                            {col.key === "ownerSeller" && (
                                                <div className="flex items-center gap-2">
                                                    <img
                                                        src={item.ownerSeller.avatarUrl}
                                                        alt={item.ownerSeller.name}
                                                        className="w-7 h-7 rounded-full object-cover"
                                                    />
                                                    <div className="flex flex-col truncate">
                                                        <span className="text-xs font-semibold text-gray-900 truncate">
                                                            {item.ownerSeller.name}
                                                        </span>
                                                        <span className="text-[12px] text-gray-500">
                                                            {item.ownerSeller.bid}
                                                        </span>
                                                        <span className="text-[12px] text-gray-500">
                                                            {item.ownerSeller.email}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* submitted On */}
                                            {col.key === "submittedOn" && (
                                                <div className="flex flex-col">
                                                    <span className="text-[13px] text-gray-700">
                                                        {item.submittedOn || '---'}
                                                    </span>
                                                    <span className="text-[13px] text-gray-700">
                                                        {item.submittedDate}
                                                    </span>
                                                </div>
                                            )}

                                            {/* status */}
                                            {col.key === "status" && (
                                                <span
                                                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium  border
                                                        ${item.status === "Pending"
                                                            ? "bg-amber-50 text-amber-600 border-amber-100"
                                                            : item.status === "Approved"
                                                                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                                                : "bg-rose-50 text-rose-600 border-red-100"
                                                        }`}
                                                >
                                                    {item.status}
                                                    {/* Optional: Agar icon dikhana hai */}
                                                    {item.status === "Pending" && <Clock size={12} />}
                                                    {item.status === "Approved" && <CheckCircle2 size={12} />}
                                                    {item.status === "Rejected" && <XCircle size={12} />}
                                                </span>
                                            )}

                                            {/* approved On */}
                                            {col.key === "approvedOn" && (
                                                <div className="flex flex-col">
                                                    <span className="text-[13px] text-gray-700">
                                                        {item.approvedOn}
                                                    </span>
                                                    <span className="text-[13px] text-gray-700">
                                                        {item.approvedDate}
                                                    </span>
                                                </div>
                                            )}

                                            {/* approved by or rejected by */}
                                            {(col.key === "approvedBy" || col.key === "rejectedBy") && (
                                                <div className="flex items-center gap-2">
                                                    <img
                                                        src={item.approvedUserImg}
                                                        alt={item.approvedBy}
                                                        className="w-7 h-7 rounded-full object-cover"
                                                    />
                                                    <span className="text-xs font-semibold text-gray-900 truncate">
                                                        {item.approvedBy}
                                                    </span>
                                                </div>
                                            )}

                                            {/* rejected On */}
                                            {col.key === "rejectedOn" && (
                                                <div className="flex flex-col">
                                                    <span className="text-[13px] text-gray-700">
                                                        {item.rejectedOn}
                                                    </span>
                                                    <span className="text-[13px] text-gray-700">
                                                        {item.rejectedDate}
                                                    </span>
                                                </div>
                                            )}

                                            {/* rejected reason */}
                                            {col.key === "rejectedReason" && (
                                                <span className='text-[13px] font-semibold text-red-600 truncate block'>
                                                    {item.rejectedReason || "No reason provided"}
                                                </span>
                                            )}

                                            {/* actions */}
                                            {col.key === 'actions' && (
                                                <div className="flex gap-2">
                                                    {config.actions.map((action, index) => {
                                                        if (action === "view") {
                                                            return (
                                                                <button
                                                                    key="view"
                                                                    onClick={() => onSelectVehicle(item)}
                                                                    className="p-1 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer">
                                                                    <Eye size={18} />
                                                                </button>
                                                            );
                                                        }
                                                        if (action === "approve") {
                                                            return (
                                                                <button key="approve" className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors">
                                                                    <Check size={18} />
                                                                </button>
                                                            );
                                                        }
                                                        if (action === "reject") {
                                                            return (
                                                                <button key="reject" className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors">
                                                                    <X size={18} />
                                                                </button>
                                                            );
                                                        }
                                                        if (action === "more") {
                                                            return (
                                                                <button key="more" className="p-1 text-gray-400 hover:text-gray-600">
                                                                    <MoreHorizontal size={18} />
                                                                </button>
                                                            );
                                                        }
                                                        return null;
                                                    })}
                                                </div>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default VehicleApprovalsList;
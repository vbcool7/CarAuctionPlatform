
import React, { useState } from 'react';
import { X } from 'lucide-react';
import VehicleOverviewTab from './VehicleOverviewTab';
import OwnerInformation from './OwnerInformation';
import VehicleDocumentTab from './VehicleDocumentTab';
import NotesSection from '../SharedComponents/NotesSection';
import VehicleHistoryTab from './VehicleHistoryTab';
import VehicleNotesTab from './VehicleNotesTab';

function VehicleApprovalsDetail({ selectedVehicle }) {

    const { vehicleDetails, status: vehicleStatus } = selectedVehicle;

    const [activeTab, setActiveTab] = useState('overview');

    const statusConfig = {
        "Approved": { bg: "bg-emerald-50", text: "text-emerald-600", label: "Approved" },
        "Pending": { bg: "bg-amber-50", text: "text-amber-600", label: "Pending" },
        "Rejected": { bg: "bg-rose-50", text: "text-rose-600", label: "Rejected" }
    };

    const status = statusConfig[vehicleStatus] || statusConfig["Pending"];

    return (
        <>
            <div className="w-full overflow-y-auto h-[calc(100vh-180px)] bg-white border border-gray-200 rounded-lg p-4">

                {/* Header */}
                <div className="">
                    {/* Top Row */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <h3 className="text-[15px] font-semibold text-[#0B1E3D]">
                                Vehicle Details
                            </h3>

                            <span
                                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold ${status.bg} ${status.text}`}
                            >
                                {status.label}
                            </span>
                        </div>

                        <button className="text-gray-400 hover:text-gray-700 transition">
                            <X size={18} />
                        </button>
                    </div>

                    {/* Vehicle Info */}
                    <div className="flex gap-4">
                        <img
                            src={vehicleDetails.imageUrl}
                            alt={vehicleDetails.name}
                            className="w-24 h-16 rounded-lg object-cover border border-gray-100 shrink-0"
                        />

                        <div className="flex-1 min-w-0">
                            <h4 className="text-[13px] font-bold text-[#1E2B5E] leading-tight">
                                {vehicleDetails.name || "---"}
                            </h4>

                            <p className="mt-1 text-[12px] text-[#4F63A3]">
                                <span className="font-semibold text-gray-600">VIN:</span>{" "}
                                {vehicleDetails.vin || "---"}
                            </p>

                            <div className="mt-1 flex flex-wrap items-center gap-2 text-[12px] text-gray-500">
                                <span>{vehicleDetails.type || "---"}</span>
                                <span>•</span>
                                <span>{vehicleDetails.color || "---"}</span>
                                <span>•</span>
                                <span>{vehicleDetails.transmission || "---"}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* tabs */}
                <div className="my-6 flex items-center gap-6 md:gap-8 border-b border-slate-200 overflow-x-auto no-scrollbar">
                    {["overview", "documents", "history", "notes"].map((tab) => (
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

                <div className=''>
                    {activeTab === "overview" && (
                        <VehicleOverviewTab vehicleDetails={selectedVehicle.vehicleDetails} status={vehicleStatus} />
                    )}

                    {activeTab === "documents" && (
                        <VehicleDocumentTab documents={selectedVehicle.documents} />
                    )}

                    {activeTab === "history" && (
                        <VehicleHistoryTab history={selectedVehicle.history} />
                    )}

                    {activeTab === "notes" && (
                        <VehicleNotesTab notes={selectedVehicle.notes} />
                    )}
                </div>
            </div>

            {/* owner info */}
            <OwnerInformation selectedVehicle={selectedVehicle}
                status={vehicleStatus}
            />

            {/* notes info */}
            {activeTab === "overview" && (
                <NotesSection
                    message="The vehicle has been approved and is visible to buyers." />
            )}

            {activeTab === "documents" && (
                <NotesSection
                    message="Please review all documents carefully. All required documents marked as pending must be verified before approving this vehicle." />
            )}

            {activeTab === "history" && (
                <NotesSection
                    message="The history log shows all actions performed on this vehicle approval request." />
            )}

            {activeTab === "notes" && (
                <NotesSection
                    message="Internal notes are visible only to admin users. Sellers will not be able to see admin notes." />
            )}

            {/* footer buttons */}
            {selectedVehicle.status === "Pending" && (
                <div className="flex justify-between gap-4">
                    <button className="px-6 py-2 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                        Close
                    </button>

                    <div className="flex gap-2">
                        <button className="px-6 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors">
                            Reject
                        </button>

                        <button className="px-6 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors shadow-sm">
                            Approve
                        </button>
                    </div>
                </div>
            )}

            {selectedVehicle.status === "Rejected" && (
                <div className="flex justify-between gap-4">
                    <button className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                        Delete Request
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                        View History
                    </button>
                </div>
            )}
        </>
    )
}

export default VehicleApprovalsDetail;

import React, { useState } from 'react';
import { CheckCircle2, XCircle, Download } from 'lucide-react';
import VehicleApprovalsHeader from './VehicleApprovalsHeader';
import VehicleApprovalsList from './VehicleApprovalsList';
import SummaryDonutCard from '../SharedComponents/SummaryDonutCard';
import QuickActionsCard from '../SharedComponents/QuickActionsCard';
import NotesSection from '../SharedComponents/NotesSection';
import VehicleApprovalsDetail from './VehicleApprovalsDetail';

function VehicleApprovals({ setCurrentPage }) {

    const [activeTab, setActiveTab] = useState("all requests");
    const [selectedVehicle, setSelectedVehicle] = useState(null);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSelectedVehicle(null); 
    };

    return (
        <div>
            <VehicleApprovalsHeader
                activeTab={activeTab}
                setActiveTab={handleTabChange}
                setCurrentPage={setCurrentPage}
            />

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
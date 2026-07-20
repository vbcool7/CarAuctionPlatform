
import React from "react";

function OwnerInformation({ selectedVehicle }) {

    const { ownerSeller, status } = selectedVehicle;

    return (
        <div className="w-full bg-white border border-gray-200 rounded-xl p-4">
            {/* Heading */}
            <h3 className="text-[15px] font-semibold text-[#0B1E3D] mb-4">
                Owner Information
            </h3>

            {/* Owner */}
            <div className="flex items-start gap-3">
                <img
                    src={ownerSeller.avatarUrl}
                    alt={ownerSeller.name}
                    className="w-12 h-12 rounded-full object-cover border border-gray-200"
                />

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-[14px] font-semibold text-[#0B1E3D]">
                            {ownerSeller.name}
                        </h4>

                        <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-emerald-50 text-emerald-600">
                            Verified
                        </span>
                    </div>

                    <div className="mt-2 space-y-1 text-[12px] text-gray-600">
                        <p>{ownerSeller.bid}</p>
                        <p>{ownerSeller.email}</p>
                        <p>+971 50 234 5678</p>
                        <p className="text-gray-500">
                            Member Since: <span className="font-medium">Apr 10, 2023</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Approval Information */}
            {status === "Approved" && (
                <div className="mt-5 pt-5 border-t border-gray-100">
                    <h4 className="text-[14px] font-semibold text-[#0B1E3D] mb-3">
                        Approval Information
                    </h4>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-[11px] text-gray-500 mb-1">
                                Approved By
                            </p>

                            <p className="text-[13px] font-medium text-[#0B1E3D]">
                                {selectedVehicle.approvedBy}
                            </p>
                        </div>

                        <div>
                            <p className="text-[11px] text-gray-500 mb-1">
                                Approved On
                            </p>

                            <p className="text-[13px] font-medium text-[#0B1E3D]">
                                {selectedVehicle.approvedOn} • {selectedVehicle.approvedDate}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OwnerInformation;

import React from 'react';

function BuyerLostDetailVehicleInfo({ vehicle }) {

    const details = [
        { label: 'Odometer', value: vehicle?.odometer || '45,200 KM' },
        { label: 'Body Type', value: vehicle?.bodyType || 'SUV' },
        { label: 'Engine', value: vehicle?.engine || '3.0L I6 Turbo' },
        { label: 'Fuel Type', value: vehicle?.fuelType || 'Petrol' },
        { label: 'Transmission', value: vehicle?.transmission || 'Automatic' },
        { label: 'Drive Type', value: vehicle?.driveType || 'AWD' },
        { label: 'Exterior Color', value: vehicle?.exteriorColor || 'Black' },
        { label: 'Interior Color', value: vehicle?.interiorColor || 'Brown' },
        { label: 'Condition', value: vehicle?.condition || 'Excellent' },
        { label: 'Title Status', value: vehicle?.titleStatus || 'Clean' },
    ];

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h2 className="text-lg font-bold text-[#0B1E3D] mb-6 tracking-tighter">
                Vehicle Details
                </h2>

            {/* 2 Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {details.map((item, index) => (
                    <div
                        key={index}
                        className="flex justify-between border-b border-slate-50 pb-3">
                        <span className="text-slate-500 text-sm">{item.label}</span>
                        <span className="font-semibold text-[#0B1E3D] text-sm text-right">
                            {item.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BuyerLostDetailVehicleInfo;
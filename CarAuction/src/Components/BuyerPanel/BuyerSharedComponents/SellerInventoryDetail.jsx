
import React from 'react';
import { Heart } from 'lucide-react';
import { vehicles } from '../../Data';
import BuyerVehicleGallery from '../BuyerSharedComponents/BuyerVehicleGallery';
import VehicleInfoTab from '../../VehicleInfoTab';
import ConditionTab from '../../ConditionTab';
import InspectionTab from '../../InspectionTab';
import DamageReportTab from '../../DamageReportTab';
import MaintenanceTab from '../../MaintenanceTab';
import DetailTabs from '../../DetailTabs';

function SellerInventoryDetail({ vehicleId, sellerId, setCurrentPage, setSelectedSellerId, setPreviousPage }) {

    const vehicle = vehicles.find(v => v.id === vehicleId);

    const vehicleTabs = [
        {
            key: "rows",
            label: "Vehicle Info",
            content: <VehicleInfoTab vehicle={vehicle} />,
        },
        {
            key: "condition",
            label: "Condition",
            content: <ConditionTab vehicle={vehicle} />,
        },
        {
            key: "inspection",
            label: "Inspection",
            content: <InspectionTab vehicle={vehicle} />,
        },
        {
            key: "damage",
            label: "Damage Report",
            content: <DamageReportTab vehicle={vehicle} />,
        },
        {
            key: "maintenance",
            label: "Maintenance",
            content: <MaintenanceTab vehicle={vehicle} />,
        },
    ];

    return (
        <div className="pb-6">

            <button
                onClick={() => setCurrentPage('seller-profile')}
                className="text-sm text-slate-500 hover:text-[#0B1E3D] mb-4 flex items-center gap-1">
                ← Back to Inventory
            </button>

            <div className="flex flex-col md:flex-row gap-8">

                <div className="w-full md:w-2/3">
                    <BuyerVehicleGallery vehicle={vehicle} />
                </div>

                {/* side panel */}
                <div className="w-full md:w-1/3 flex flex-col gap-4">

                    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">

                        <div className='flex justify-between items-center'>
                            <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[11px] font-bold rounded-md">
                                {vehicle?.condition || 'New'}
                            </span>

                            <button
                                className='p-2 bg-slate-50 hover:bg-pink-50 rounded-full transition-all duration-300 group'
                            >
                                <Heart
                                    size={18}
                                    className='text-slate-400 group-hover:text-red-500 group-hover:fill-red-500 transition-all duration-300'
                                />
                            </button>
                        </div>

                        <h2 className="text-xl font-bold text-[#0B1E3D] leading-tight">
                            {vehicle?.year} {vehicle?.make} {vehicle?.model}
                        </h2>

                        <p className="text-xs text-slate-400">VIN: {vehicle?.vin}</p>

                        <div className="flex flex-wrap gap-2 text-xs text-slate-600">
                            <span className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-md">{vehicle?.transmission}</span>
                            <span className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-md">{vehicle?.fuelType}</span>
                            <span className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-md">{vehicle?.bodyStyle}</span>
                        </div>

                        <p className="text-sm text-slate-500">{vehicle?.location}</p>

                        <div className="text-2xl font-bold text-[#0B1E3D]">
                            AED {vehicle?.price?.toLocaleString() || "25,000"}
                        </div>

                        <div className="pt-2">
                            <button className="w-full py-2.5 bg-[#D97706] hover:bg-[#b8650a] text-white font-semibold text-sm rounded-xl transition-all">
                                Contact Dealer
                            </button>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
                        {/* Header */}
                        <div className="flex justify-between items-center">
                            <h3 className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Seller Info</h3>
                            <span className="flex items-center gap-1 text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-bold">
                                ✓ Verified
                            </span>
                        </div>

                        {/* Seller Details */}
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-lg font-bold text-[#0B1E3D] border border-slate-200">
                                {vehicle?.sellerName?.[0] || 'S'}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-[#0B1E3D] leading-tight">{vehicle?.sellerName}</p>
                                <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                                    <span className="text-amber-500">★ {vehicle?.sellerRating || '4.8'}</span> | 128 Reviews
                                </p>
                            </div>
                        </div>

                        {/* Button */}
                        <button
                            onClick={() => {
                                setSelectedSellerId(sellerId || vehicle?.sellerId);
                                setPreviousPage('seller-inventory-detail');
                                setCurrentPage('seller-profile');
                            }}
                            className="w-full py-2.5 text-xs bg-[#0B1E3D] hover:bg-[#1a2d4d] text-white font-bold rounded-lg transition-all shadow-sm"
                        >
                            View Profile
                        </button>
                    </div>

                </div>
            </div>

            {/* tabs */}
            <div className="w-full mt-10">
                <h1 className="text-xl font-bold text-[#0B1E3D] pb-6">
                    Vehicle Information
                </h1>
                <DetailTabs tabs={vehicleTabs} defaultTab="rows" />
            </div>
        </div>
    )
}

export default SellerInventoryDetail;
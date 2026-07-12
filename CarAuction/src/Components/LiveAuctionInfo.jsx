import React from 'react';
import { Download, TrendingUp, MessageSquare } from 'lucide-react';

function LiveAuctionInfo({ vehicle }) {

   if (!vehicle) return null; 

   console.log (vehicle);
   
    const formatValue = (val) => {
        if (val === null || val === undefined) return "NA";
        if (val instanceof Date) return val.toLocaleString();
        return String(val); 
    };

    const infoItems = [
        { label: "Auction Type", value: formatValue(vehicle.auctionType) },
        { label: "Start Time", value: formatValue(vehicle.startTime) },
        { label: "End Time", value: formatValue(vehicle.endTime) },
        { label: "Lot Number", value: formatValue(vehicle.id) },
        { label: "Seller", value: formatValue(vehicle.seller) },
        { label: "Location", value: formatValue(vehicle.location) },
        { label: "Reserve Price", value: formatValue(vehicle.reservePrice) },
        { label: "Buy Now Price", value: formatValue(vehicle.buyNowPrice) },
        { label: "Vehicle Condition", value: formatValue(vehicle.condition) },
        { label: "Title Status", value: formatValue(vehicle.status) },
    ];

    const InfoRow = ({ label, value }) => (
        <div className="flex justify-between">
            <span className="text-slate-500">{label}</span>
            <span className="font-medium text-slate-900">{value}</span>
        </div>
    );

    return (
        <div className="w-full">

            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4">Auction Information</h3>
                <div className="space-y-4 text-sm">

                    {infoItems.map((item, index) => (
                        <InfoRow key={index} label={item.label} value={item.value} />
                    ))}
                    <button className="w-full flex items-center justify-center gap-2 mt-6 py-3 px-4 bg-[#0B1E3D] text-white rounded-xl hover:bg-slate-800 transition-all shadow-sm active:scale-[0.99] font-medium text-sm">
                        <Download size={18} /> Download Lot Sheet
                    </button>
                </div>
            </div>

        </div>
    );
}

export default LiveAuctionInfo;
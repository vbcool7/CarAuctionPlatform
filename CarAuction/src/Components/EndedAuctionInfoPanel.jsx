
import React from "react";

import {
    Tag,
    Calendar,
    Clock,
    MapPin,
    User,
    ShieldCheck,
    MessageCircle,
    Mail,
    Link,
} from "lucide-react";

import {
    FaFacebookF,
    FaXTwitter,
} from "react-icons/fa6";

function EndedAuctionInfoPanel() {
    return (
        <div className="flex flex-col gap-4 h-full">

            {/* Auction Information Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex-1">
                <h2 className="text-base font-bold text-[#0B1E3D] mb-4">Auction Information</h2>
                <div className="space-y-4">
                    {[
                        { icon: Tag, label: "Lot Number", value: "# 44578231" },
                        { icon: Calendar, label: "Start Date", value: "25 May 2024, 10:00 AM GST" },
                        { icon: Calendar, label: "End Date", value: "25 May 2024, 03:45 PM GST" },
                        { icon: Clock, label: "Auction Duration", value: "5h 45m" },
                        { icon: MapPin, label: "Location", value: "Dubai, UAE" },
                        { icon: User, label: "Seller Type", value: "Dealer" },
                    ].map((item, idx) => (
                        <div
                            key={idx}
                            className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2 text-slate-500">
                                {/* <item.icon size={15} /> */}
                                <span>{item.label}</span>
                            </div>
                            <span className="font-medium text-[#0B1E3D] text-[12px] text-right">{item.value}</span>
                        </div>
                    ))}

                    {/* Seller Name */}
                    <div className="flex justify-between items-start pt-2 border-t border-slate-100">
                        <span className="text-slate-500 text-sm">Seller Name</span>
                        <div className="flex flex-col items-end gap-1">
                            <span className="font-bold text-[#0B1E3D] text-[12px]">Premium Motors LLC</span>
                            <span className="flex items-center gap-1 text-[#D97706] text-xs font-semibold bg-orange-50 px-2 py-1 rounded-full">
                                <ShieldCheck size={11} /> Verified
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Share Vehicle Card */}
            <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm">
                <h3 className="font-bold text-[#0B1E3D] mb-1 text-sm">Share this vehicle</h3>
                <p className="text-slate-500 text-xs mb-3">Know someone who might be interested?</p>
                <div className="flex gap-2">
                    {[FaFacebookF, FaXTwitter, MessageCircle, Mail, Link].map((Icon, idx) => (
                        <button
                            key={idx}
                            className="p-2 border border-slate-300 rounded-full text-slate-600 hover:border-[#D97706] hover:text-[#D97706] transition-colors"
                        >
                            <Icon size={16} />
                        </button>
                    ))}
                </div>
            </div>

        </div>
    );
}

export default EndedAuctionInfoPanel;
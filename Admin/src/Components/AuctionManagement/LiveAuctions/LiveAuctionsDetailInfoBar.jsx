
import React from "react";
import { Share2, Pause } from "lucide-react";
import AuctionsGallery from "../Shared/AuctionsGallery";

function LiveAuctionsDetailInfoBar({ auction }) {
    if (!auction) return null;

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Left Gallery */}
                <AuctionsGallery
                    images={auction.images}
                    status="live"
                />

                {/* Right Section */}
                <div className="flex flex-col">

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-[#0B1E3D]">
                        {auction.title}
                    </h2>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-3 mb-6">
                        <Tag>{auction.specs.body}</Tag>
                        <Tag>{auction.specs.color}</Tag>
                        <Tag>{auction.specs.transmission}</Tag>
                        <Tag>{auction.specs.fuelType}</Tag>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-6">

                        <Info label="VIN" value={auction.vin} />
                        <Info label="Auction ID" value={auction.id} />
                        <Info label="Category" value={auction.specs.vehicleType} />
                        <Info label="Auction Type" value={auction.type} />
                        <Info label="Odometer" value={auction.specs.mileage} />
                        <Info label="Current Bid" value={auction.currentBid} />
                        <Info label="Location" value={auction.location || "Dubai, UAE"} />
                        <Info label="Reserve Price" value={auction.reserve} />

                    </div>

                    {/* Countdown */}
                    <div className="border border-slate-200 rounded-xl p-5 bg-slate-50">

                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-[15px] font-semibold text-[#0B1E3D]">
                                Auction End In
                            </h3>

                            <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-[11px] font-semibold">
                                Upcoming
                            </span>
                        </div>

                        <div className="flex justify-center gap-3">

                            {[
                                { value: "00", label: "HRS" },
                                { value: "04", label: "MINS" },
                                { value: "32", label: "SECS" },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className="text-center"
                                >

                                    <div className="w-14 h-14 rounded-xl border border-slate-200 bg-white shadow-sm flex items-center justify-center">
                                        <span className="text-xl font-bold text-red-600">
                                            {item.value}
                                        </span>
                                    </div>

                                    <p className="mt-2 text-[10px] font-semibold text-slate-500 uppercase">
                                        {item.label}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-5 pt-4 border-t border-slate-200 text-center">
                            <p className="text-sm font-semibold text-[#0B1E3D]">
                                Ends at {auction.endTime}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                                {auction.endDate}
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="grid grid-cols-2 gap-3 mt-5">
                            <button className="h-11 rounded-xl border border-slate-200 flex items-center justify-center gap-2 text-sm font-medium hover:bg-white transition">
                                <Share2 size={16} />
                                Share
                            </button>

                            <button className="h-11 rounded-xl bg-[#0B1E3D] text-white flex items-center justify-center gap-2 text-sm font-medium hover:bg-[#132d59] transition">
                                <Pause size={16} />
                                Pause
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const Info = ({ label, value }) => (
    <div>
        <p className="text-xs text-slate-500 mb-1">
            {label}
        </p>
        <p className="font-semibold text-[#0B1E3D] text-sm wrap-break-word">
            {value || "--"}
        </p>
    </div>
);

const Tag = ({ children }) => {
    return (
        <span className="px-3 py-1 rounded-md bg-slate-100 text-xs font-medium text-slate-700">
            {children}
        </span>
    );
};

export default LiveAuctionsDetailInfoBar;
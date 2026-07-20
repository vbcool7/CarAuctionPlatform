import React from "react";
import AuctionsGallery from "../Shared/AuctionsGallery";

function UpcomingAuctionDetailInfobar({ auction }) {
    if (!auction) return null;

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* left Gallery */}
                <AuctionsGallery
                    images={auction.images}
                    status="upcoming"
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

                    {/* Auction Details */}
                    <div className="grid grid-cols-3 gap-x-8 gap-y-3 text-[13px] mb-8">
                        <Info label="Auction ID" value={auction.id} />
                        <Info label="Auction Type" value={auction.type} />

                        <Info label="VIN" value={auction.vin} />
                        <Info label="Start Date" value={auction.startDate} />

                        <Info label="Start Time" value={auction.startTime} />
                        <Info label="End Time" value={auction.endTime} />

                        <Info label="Current Bid" value={auction.currentBid} />
                        <Info label="Reserve Price" value={auction.reserve} />

                        <Info label="Total Bids" value={auction.bids} />
                        <Info label="Bidders" value={auction.bidders} />
                    </div>
                     
                    {/* auction time */}
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-[15px] font-semibold text-[#0B1E3D]">
                                Auction Starts In
                            </h3>

                            <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-[11px] font-semibold">
                                Upcoming
                            </span>
                        </div>

                        <div className="grid grid-cols-4 gap-3">
                            {[
                                { value: "02", label: "Days" },
                                { value: "23", label: "Hrs" },
                                { value: "45", label: "Mins" },
                                { value: "22", label: "Secs" },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className="bg-white border border-slate-200 rounded-xl py-3 text-center shadow-sm"
                                >
                                    <p className="text-2xl font-bold text-[#D97706]">
                                        {item.value}
                                    </p>

                                    <p className="mt-1 text-[10px] uppercase tracking-wide text-slate-500">
                                        {item.label}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-5 pt-4 border-t border-slate-200 text-center">
                            <p className="text-sm font-semibold text-[#0B1E3D]">
                                {auction.startDate}
                            </p>

                            <p className="text-xs text-slate-500 mt-1">
                                {auction.startTime}
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

const Info = ({ label, value }) => (
    <div className="flex flex-col">
        <span className="text-slate-500 text-xs">{label}</span>
        <span className="font-semibold text-[#0B1E3D]">{value || "--"}</span>
    </div>
);

const Tag = ({ children }) => (
    <span className="px-3 py-1 rounded-md bg-slate-100 text-xs font-medium text-slate-700">
        {children}
    </span>
);

export default UpcomingAuctionDetailInfobar;
import { Gavel, Tag } from "lucide-react";
import { RowData } from "./DetailTabs";
import { formatPrice } from "../utils/formatters";

const formatLabel = (value) => {
    if (!value) return "—";

    return String(value)
        .replace(/_/g, " ")
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatDateTime = (value) => {
    if (!value) return "—";

    return new Date(value).toLocaleString("en-GB", {
        timeZone: "Asia/Dubai",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
};

function AuctionDetailsTab({ vehicle }) {
    const isFixedPrice = vehicle?.priceType === "fixed_price";

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Financial Section */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">
                    <Tag size={16} className="text-[#D97706]" />
                    Financials
                </h4>

                {isFixedPrice ? (
                    <>
                        <RowData
                            label="Buy Now Price"
                            value={
                                vehicle.buyNowPrice != null
                                    ? formatPrice(vehicle.buyNowPrice)
                                    : "—"
                            }
                        />

                        <RowData
                            label="Currency"
                            value="AED"
                        />
                    </>
                ) : (
                    <>
                        <RowData
                            label="Starting Bid"
                            value={
                                vehicle.startingBidPrice != null
                                    ? formatPrice(vehicle.startingBidPrice)
                                    : "—"
                            }
                        />

                        <RowData
                            label="Current Highest Bid"
                            value={
                                vehicle.currentBid != null
                                    ? formatPrice(vehicle.currentBid)
                                    : "No bids yet"
                            }
                        />

                        <RowData
                            label="Total Bids"
                            value={(vehicle.totalBids ?? 0).toLocaleString()}
                        />

                        <RowData
                            label="Currency"
                            value="AED"
                        />
                    </>
                )}
            </div>

            {/* Auction Terms */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">
                    <Gavel size={16} className="text-[#D97706]" />
                    Auction Terms
                </h4>

                <RowData
                    label="Auction Type"
                    value={formatLabel(vehicle.auctionType)}
                />

                <RowData
                    label="Start Date"
                    value={formatDateTime(vehicle.auctionStartDateTime)}
                />

                <RowData
                    label="End Date"
                    value={formatDateTime(vehicle.auctionEndDateTime)}
                />

                <RowData
                    label="Auction Duration"
                    value={formatLabel(vehicle.auctionDuration)}
                />

                {!isFixedPrice && (
                    <>
                        <RowData
                            label="Late Bid Extension"
                            value={
                                vehicle.antiSnipingExtension != null
                                    ? `${vehicle.antiSnipingExtension} min`
                                    : "—"
                            }
                        />
                    </>
                )}
            </div>

            {/* Important Information */}
            <div className="md:col-span-2 bg-amber-50 border border-amber-100 rounded-xl p-4">
                <div className="flex items-start gap-3">
                    <Gavel
                        size={17}
                        className="text-[#D97706] mt-0.5 shrink-0"
                    />

                    <div>
                        <p className="text-sm font-bold text-slate-900">
                            {isFixedPrice
                                ? "Important Purchase Information"
                                : "Important Auction Information"}
                        </p>

                        <p className="text-xs text-slate-600 leading-5 mt-1.5">
                            {isFixedPrice
                                ? "This vehicle is available for direct purchase at the listed Buy Now price once the auction becomes active."
                                : `Place your bids before the auction ends. The final auction outcome will be determined once the bidding period closes.`}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuctionDetailsTab;
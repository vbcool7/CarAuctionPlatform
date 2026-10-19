import { Gavel, Tag, CalendarDays, Info } from "lucide-react";
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

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleString("en-GB", {
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
    if (!vehicle) {
        return (
            <p className="text-sm text-slate-500 text-center py-8">
                Auction details are not available.
            </p>
        );
    }

    const isFixedPrice = vehicle.priceType === "fixed_price";
    const isReservePrice = vehicle.priceType === "reserve_price";

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Pricing Information */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">
                    <Tag size={16} className="text-[#D97706]" />
                    Pricing Information
                </h4>

                <RowData
                    label="Pricing Type"
                    value={formatLabel(vehicle.priceType)}
                />

                {isFixedPrice && (
                    <RowData
                        label="Buy Now Price"
                        value={
                            vehicle.buyNowPrice != null
                                ? formatPrice(vehicle.buyNowPrice)
                                : "—"
                        }
                    />
                )}

                {isReservePrice && (
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
                            label="Current Bid"
                            value={
                                vehicle.currentBid != null &&
                                    Number(vehicle.currentBid) > 0
                                    ? formatPrice(vehicle.currentBid)
                                    : "No bids yet"
                            }
                        />

                        <RowData
                            label="Total Bids"
                            value={
                                vehicle.totalBids != null
                                    ? Number(vehicle.totalBids).toLocaleString()
                                    : "—"
                            }
                        />
                    </>
                )}

                <RowData label="Currency" value="AED" />
            </div>

            {/* Auction Schedule */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">
                    <CalendarDays size={16} className="text-[#D97706]" />
                    Auction Schedule
                </h4>

                <RowData
                    label="Auction Type"
                    value={formatLabel(vehicle.auctionType)}
                />

                <RowData
                    label="Auction Status"
                    value={formatLabel(vehicle.auctionStatus)}
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
                    label="Duration"
                    value={formatLabel(vehicle.auctionDuration)}
                />
            </div>

            {/* Information Note */}
            <div className="md:col-span-2 bg-amber-50 border border-amber-100 rounded-xl p-4">
                <div className="flex items-start gap-3">
                    <Info
                        size={17}
                        className="text-[#D97706] mt-0.5 shrink-0"
                    />

                    <div>
                        <p className="text-sm font-bold text-slate-900">
                            {isFixedPrice
                                ? "Purchase Information"
                                : "Auction Information"}
                        </p>

                        <p className="text-xs text-slate-600 leading-5 mt-1.5">
                            {isFixedPrice
                                ? "This vehicle was listed for direct purchase at its specified Buy Now price."
                                : "Bidding details and auction schedule are displayed above. The final outcome depends on the auction result and applicable auction rules."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuctionDetailsTab;

import React from 'react'
import SummaryDonutCard from '../../SharedComponents/SummaryDonutCard'
import ContactSupport from '../../SharedComponents/ContactSupport'
import { formatPrice } from '../../utils/formatter';

function BidsSidebar({ vehicle, bids = [] }) {

    const activeBids = bids.filter(
        (bid) => bid.status === "active"
    ).length;

    const outbidBids = bids.filter(
        (bid) => bid.status === "outbid"
    ).length;

    const wonBids = bids.filter(
        (bid) => bid.status === "won"
    ).length;

    const withdrawnBids = bids.filter(
        (bid) => bid.status === "withdrawn"
    ).length;

    const cancelledBids = bids.filter(
        (bid) => bid.status === "cancelled"
    ).length;

    const validBidAmounts = bids
        .filter((bid) => bid.status !== 'withdrawn' && bid.status !== 'cancelled')
        .map((bid) => bid.amount);

    return (
        <div className="space-y-6">

            {/* donut */}
            <SummaryDonutCard
                title="Bid Summary"
                centerLabel="Total Bids"
                showPercentage={true}
                segments={[
                    {
                        name: "Active",
                        value: activeBids,
                        color: "#10B981"
                    },
                    {
                        name: "Outbid",
                        value: outbidBids,
                        color: "#F59E0B"
                    },
                    {
                        name: "Won",
                        value: wonBids,
                        color: "#3B82F6"
                    },
                    {
                        name: "Withdrawn",
                        value: withdrawnBids,
                        color: "#8B5CF6"
                    },
                    {
                        name: "Cancelled",
                        value: cancelledBids,
                        color: "#EF4444"
                    },
                ]}
            />

            {/* Bid Information */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 text-sm">

                <h3 className="font-semibold text-slate-700 mb-3">
                    Bid Information
                </h3>

                <div className="flex justify-between">
                    <span className="text-slate-500">
                        Starting Bid
                    </span>
                    <span className="font-medium text-[#0B1E3D]">
                        {formatPrice(vehicle?.startingBidPrice)}
                    </span>
                </div>

                <div className="flex justify-between">
                    <span className="text-slate-500">
                        Reserve Price
                    </span>
                    <span className="font-medium text-[#0B1E3D]">
                        {formatPrice(vehicle?.reservePrice)}
                    </span>
                </div>

                <div className="flex justify-between">
                    <span className="text-slate-500">
                        Buy Now Price
                    </span>
                    <span className="font-medium text-[#0B1E3D]">
                        {formatPrice(vehicle?.buyNowPrice)}
                    </span>
                </div>

                <div className="flex justify-between">
                    <span className="text-slate-500">
                        Total Bids
                    </span>
                    <span className="font-medium text-[#0B1E3D]">
                        {bids.length}
                    </span>
                </div>

            </div>

            {/* Bidding Activity */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 text-sm">

                <h3 className="font-semibold text-slate-700 mb-3">
                    Bidding Activity
                </h3>

                {bids.length > 0 ? (
                    <>
                        <div className="flex justify-between">
                            <span className="text-slate-500">
                                Total Bids
                            </span>
                            <span className="font-medium text-[#0B1E3D]">
                                {bids.length}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-slate-500">
                                Highest Bid
                            </span>
                            <span className="font-medium text-green-600">
                                {validBidAmounts.length > 0
                                    ? formatPrice(Math.max(...validBidAmounts))
                                    : "—"}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-slate-500">
                                Last Bid Time
                            </span>
                            <span className="font-medium text-[#0B1E3D]">
                                {bids[0]?.createdAt
                                    ? new Date(
                                        bids[0].createdAt
                                    ).toLocaleTimeString("en-GB", {
                                        timeZone: "Asia/Dubai",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                    })
                                    : "—"}
                            </span>
                        </div>
                    </>
                ) : (
                    <div className="text-slate-400">
                        No bids placed on this auction
                    </div>
                )}

            </div>

            {/* Support */}
            <ContactSupport />

        </div>
    );
}

export default BidsSidebar
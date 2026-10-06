import { useState } from "react";
import { Crown } from "lucide-react";
import { formatPrice } from "../utils/formatters";
import { useGetPublicAuctionBids } from '../hook/useBid'

const formatBidTime = (createdAt) => {
    if (!createdAt) return "--";

    return new Date(createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
};

function BiddingHistoryTab({ vehicle }) {
    const [page, setPage] = useState(1);
    const limit = 10;

    const {
        data,
        isLoading,
        isFetching,
    } = useGetPublicAuctionBids(vehicle?._id, page, limit);

    const bids = data?.data || [];
    const pagination = data?.pagination;

    if (isLoading) {
        return (
            <div className="text-center py-10">
                <p className="text-slate-500 text-sm">
                    Loading bids...
                </p>
            </div>
        );
    }

    if (bids.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-slate-500 text-sm">
                    No bids have been placed yet.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">

            <div className="overflow-hidden border border-slate-200 rounded-2xl">

                {/* Header */}
                <div className="grid grid-cols-3 bg-slate-50 px-4 py-3 border-b border-slate-200">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Bidder
                    </span>

                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 text-center">
                        Amount
                    </span>

                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 text-right">
                        Time
                    </span>
                </div>

                {/* Rows */}
                <div className="divide-y divide-slate-200">
                    {bids.map((bid, index) => (
                        <div
                            key={bid._id || index}
                            className={`grid grid-cols-3 items-center px-4 py-3 transition-colors ${
                                index === 0 && page === 1
                                    ? "bg-[#D97706]/5"
                                    : "hover:bg-slate-50"
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                {index === 0 && page === 1 && (
                                    <Crown
                                        size={14}
                                        className="text-[#D97706]"
                                    />
                                )}

                                <span className="text-sm font-medium text-slate-800">
                                    {bid.label || `Bidder #${index + 1}`}
                                </span>
                            </div>

                            <span
                                className={`text-center text-sm font-semibold ${
                                    index === 0 && page === 1
                                        ? "text-[#D97706]"
                                        : "text-slate-900"
                                }`}
                            >
                                {formatPrice(bid.amount)}
                            </span>

                            <span className="text-right text-xs text-slate-500">
                                {formatBidTime(bid.createdAt)}
                            </span>
                        </div>
                    ))}
                </div>

            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between">

                    <p className="text-xs text-slate-500">
                        Page {pagination.page} of {pagination.totalPages}
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            disabled={page === 1 || isFetching}
                            onClick={() => setPage((prev) => prev - 1)}
                            className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>

                        <button
                            type="button"
                            disabled={
                                page >= pagination.totalPages || isFetching
                            }
                            onClick={() => setPage((prev) => prev + 1)}
                            className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>

                </div>
            )}

        </div>
    );
}

export default BiddingHistoryTab;
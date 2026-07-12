
import { Crown } from "lucide-react";

const formatPrice = (amount) => {

  return `AED ${amount.toLocaleString()}`;
};

const maskBidder = (name = "") => {
  if (name.length <= 3) return name[0] + "***";
  return name.slice(0, 2) + "***" + name.slice(-2);
};


function BiddingHistoryTab({ vehicle }) {
  const { bidHistory = [] } = vehicle;

  if (bidHistory.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-slate-500 text-sm">
          No bids have been placed yet.
        </p>
      </div>
    );
  }

  return (
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
        {bidHistory.map((bid, index) => (
          <div
            key={index}
            className={`grid grid-cols-3 items-center px-4 py-3 transition-colors
            ${
              index === 0
                ? "bg-[#D97706]/5"
                : "hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-2">
              {index === 0 && (
                <Crown
                  size={14}
                  className="text-[#D97706]"
                />
              )}

              <span className="text-sm font-medium text-slate-800">
                {maskBidder(bid.bidder)}
              </span>
            </div>

            <span
              className={`text-center text-sm font-semibold ${
                index === 0
                  ? "text-[#D97706]"
                  : "text-slate-900"
              }`}
            >
              {formatPrice(bid.amount)}
            </span>

            <span className="text-right text-xs text-slate-500">
              {bid.time}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}

export default BiddingHistoryTab;
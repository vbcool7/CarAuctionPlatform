
import { useState, useEffect, useRef } from "react";
import { GoHeart } from "react-icons/go";
import { GoHeartFill } from "react-icons/go";
import { IoIosShareAlt } from "react-icons/io";
import { IoCheckmark } from "react-icons/io5";

const formatAED = (amount) => {
  if (!amount) return "AED 0";
  return `AED ${amount.toLocaleString("en-AE")}`;
};

const useCountdown = (endTime) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [isSnipe, setIsSnipe] = useState(false);

  useEffect(() => {
    const tick = () => {
      const diff = new Date(endTime) - Date.now();
      if (diff <= 0) { setTimeLeft(null); return; }
      setIsSnipe(diff < 2 * 60 * 1000);
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ h, m, s, diff });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endTime]);

  return { timeLeft, isSnipe };
};

function VehicleAuctionPanel({
  auctionId,
  currentBid = 0,
  bidIncrement = 5000,
  endTime,
  totalBids = 0,
  onPlaceBid,
  onWatchlist,
  isWatchlisted = false,
  vehicle
}) {

  const { timeLeft, isSnipe } = useCountdown(endTime);
  const [bidAmount, setBidAmount] = useState(currentBid + bidIncrement);
  const [bidError, setBidError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showBidInput, setShowBidInput] = useState(false);
  const bidListRef = useRef(null);

  const minBid = currentBid + bidIncrement;

  useEffect(() => {
    setBidAmount(minBid);
  }, [currentBid, bidIncrement]);


  const handleBidSubmit = async () => {
    setBidError("");
    if (bidAmount < minBid) {
      setBidError(`Minimum bid is ${formatAED(minBid)}`);
      return;
    }
    setIsSubmitting(true);
    try {
      await onPlaceBid?.(bidAmount);
      setShowBidInput(false);
    } catch (err) {
      setBidError(err?.message || "Bid failed. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const TimerBlock = ({ value, label }) => (
    <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-center">
      <div className="text-xl font-bold text-slate-900">
        {String(value).padStart(2, "0")}
      </div>

      <div className="pt-1 text-[11px] uppercase tracking-wide text-slate-500">
        {label}
      </div>
    </div>
  );

  const auctionEnded = !timeLeft;

  return (
    <div className="h-full flex flex-col">

      {/* =========================
          Vehicle Summary
      ========================== */}
      <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col">

        {/* Vehicle Name */}
        <div>
          <h2 className="text-slate-900 text-lg font-bold leading-snug">
            {vehicle.name}
          </h2>

          {vehicle.model && (
            <p className="text-slate-500 text-sm mt-0.5">
              {vehicle.model}
            </p>
          )}
        </div>

        {/* Vehicle Details */}
        <div className="mt-4 flex flex-col text-sm">

          {/* VIN */}
          <div className="flex justify-between items-center border-b border-slate-100 pb-0.5">
            <span className="text-slate-500">
              VIN
            </span>

            <span className="text-slate-900 font-mono text-[10px] font-medium">
              {vehicle.vin}
            </span>
          </div>

          {/* Location */}
          <div className="flex justify-between items-center border-b border-slate-100 py-0.5">
            <span className="text-slate-500">
              Location
            </span>

            <span className="text-slate-900 font-medium">
              {vehicle.location}
            </span>
          </div>

          {/* Seller */}
          <div className="flex justify-between items-center pt-1">
            <span className="text-slate-500">
              Seller
            </span>

            <span className="text-slate-900 font-medium">
              {vehicle.sellerName || "—"}
            </span>
          </div>

        </div>

        {/* =========================
            Current Bid
        ========================== */}
        <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">

          <div className="flex items-center justify-between">

            {/* Bid Amount */}
            <div>
              <p className="text-xs font-medium text-slate-500">
                Current Bid
              </p>

              <div className="mt-1 flex items-baseline gap-1.5">

                <span className="text-sm font-semibold text-slate-500">
                  AED
                </span>

                <p className="text-2xl font-bold tracking-tight text-slate-900">
                  {vehicle.bid}
                </p>

              </div>
            </div>

            {/* Total Bids */}
            <div className="text-right">
              <p className="text-[10px] text-slate-400">
                Bids
              </p>

              <p className="mt-1 text-xs font-semibold text-slate-700">
                {totalBids} placed
              </p>
            </div>

          </div>
        </div>

        {/* =========================
            Timer
        ========================== */}
        <div className="mt-4">

          {auctionEnded ? (

            <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2">

              <span className="w-2 h-2 rounded-full bg-red-500" />

              <span className="text-red-600 text-sm font-medium">
                Auction Ended
              </span>

            </div>

          ) : (

            <>
              {/* Ending Soon */}
              {isSnipe && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2 mb-3">

                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />

                  <span className="text-red-600 text-xs font-medium">
                    Ending soon — bids extend timer by 2 min
                  </span>

                </div>
              )}

              {/* Countdown */}
              <div className="flex items-center gap-2">

                <TimerBlock
                  value={timeLeft.h}
                  label="hr"
                />

                <span className="text-slate-400 text-xl font-light mb-1">
                  :
                </span>

                <TimerBlock
                  value={timeLeft.m}
                  label="min"
                />

                <span className="text-slate-400 text-xl font-light mb-1">
                  :
                </span>

                <TimerBlock
                  value={timeLeft.s}
                  label="sec"
                />

              </div>
            </>
          )}

        </div>

      </div>

      {/* =========================
          Bottom Action Area
          mt-auto keeps this section
          at the bottom
      ========================== */}
      {!auctionEnded && (
        <div className="mt-auto pt-3">

          {/* Minimum Next Bid */}
          <div className="flex items-center justify-between bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-sm">

            <span className="text-slate-600">
              Minimum next bid
            </span>

            <span className="text-[#D97706] font-semibold">
              {formatAED(minBid)}
            </span>

          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 mt-3">

            {/* =========================
                Place Bid / Bid Form
            ========================== */}
            {!showBidInput ? (

              <button
                onClick={() => setShowBidInput(true)}
                className="w-full bg-[#D97706] hover:bg-[#B45309] text-white font-semibold py-2.5 rounded-xl transition-all duration-200 text-sm"
              >
                Place Bid
              </button>

            ) : (

              <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col gap-3 shadow-sm">

                <p className="text-slate-900 text-xs font-semibold">
                  Enter your bid
                </p>

                {/* Bid Input */}
                <div className="flex items-center gap-2">

                  <span className="text-slate-500 text-xs">
                    AED
                  </span>

                  <input
                    type="number"
                    value={bidAmount}
                    min={minBid}
                    step={bidIncrement}
                    onChange={(e) =>
                      setBidAmount(Number(e.target.value))
                    }
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm focus:outline-none focus:border-[#D97706] focus:ring-2 focus:ring-[#D97706]/20 transition-all"
                  />

                </div>

                {/* Bid Error */}
                {bidError && (
                  <p className="text-red-500 text-xs">
                    {bidError}
                  </p>
                )}

                {/* Confirm / Cancel */}
                <div className="flex gap-2">

                  <button
                    onClick={handleBidSubmit}
                    disabled={isSubmitting}
                    className="flex-1 bg-[#D97706] hover:bg-[#B45309] disabled:opacity-50 text-white font-semibold py-2 rounded-lg transition-all text-xs"
                  >
                    {isSubmitting
                      ? "Submitting..."
                      : `Confirm ${formatAED(bidAmount)}`}
                  </button>

                  <button
                    onClick={() => {
                      setShowBidInput(false);
                      setBidError("");
                    }}
                    className="px-4 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors text-xs border border-slate-200"
                  >
                    Cancel
                  </button>

                </div>

              </div>
            )}

            {/* =========================
                Buy Now
            ========================== */}
            <button
              className="w-full border border-[#D97706] hover:bg-amber-50 text-[#D97706] font-semibold py-2.5 rounded-xl transition-all text-sm"
            >
              Buy Now For AED 32,000
            </button>

            {/* =========================
                Watchlist / Share
            ========================== */}
            <div className="flex gap-2">

              {/* Watchlist */}
              <button
                onClick={onWatchlist}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border transition-all text-xs font-medium ${isWatchlisted
                    ? "bg-amber-50 border-[#D97706] text-[#D97706]"
                    : "bg-white border-slate-200 text-slate-600 hover:border-[#D97706] hover:text-[#D97706]"
                  }`}
              >

                {isWatchlisted ? (
                  <GoHeartFill className="w-4 h-4" />
                ) : (
                  <GoHeart className="w-4 h-4" />
                )}

                <span>
                  {isWatchlisted
                    ? "Watching"
                    : "Watchlist"}
                </span>

              </button>

              {/* Share */}
              <button
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-[#D97706] hover:text-[#D97706] transition-all text-xs font-medium"
              >

                {copied ? (
                  <IoCheckmark className="w-4 h-4" />
                ) : (
                  <IoIosShareAlt className="w-4 h-4" />
                )}

                <span>
                  {copied ? "Copied!" : "Share"}
                </span>

              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default VehicleAuctionPanel;
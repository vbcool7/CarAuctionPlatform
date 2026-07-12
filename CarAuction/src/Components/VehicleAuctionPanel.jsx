
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
    <div className="flex flex-col gap-4">

      {/* Vehicle Summary */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

        <h2 className="text-slate-900 text-lg font-bold leading-snug">
          {vehicle.name}
        </h2>
        {vehicle.model && (
          <p className="text-slate-500 text-sm mt-0.5">
            {vehicle.model}
          </p>
        )}

        <div className="mt-4 flex flex-col gap-3 text-sm">
          <div className="flex justify-between items-center border-b border-slate-50 pb-2">
            <span className="text-slate-500">VIN</span>
            <span className="text-slate-900 font-mono text-xs font-medium">
              {vehicle.vin}
            </span>
          </div>

          <div className="flex justify-between items-center border-b border-slate-50 pb-2">
            <span className="text-slate-500">Location</span>
            <span className="text-slate-900 font-medium">{vehicle.location}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">Seller</span>
            <span className="text-slate-900 font-medium">
              {vehicle.sellerName || "—"}
            </span>
          </div>
        </div>

         {/* Current Bid */}
        <p className="font-semibold text-md text-slate-700 mb-1 pt-4">Current Bid</p>

        <p className="text-3xl font-bold text-slate-900">
          {/* {formatAED(currentBid)} */}
          {vehicle.bid}
        </p>

        <p className="text-slate-500 text-xs mt-1">
          {totalBids} bid{totalBids !== 1 ? "s" : ""} placed
        </p>

        {/* Timer */}
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
              {isSnipe && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-red-600 text-xs font-medium">
                    Ending soon — bids extend timer by 2 min
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <TimerBlock value={timeLeft.h} label="hr" />
                <span className="text-slate-400 text-xl font-light mb-1">:</span>

                <TimerBlock value={timeLeft.m} label="min" />
                <span className="text-slate-400 text-xl font-light mb-1">:</span>

                <TimerBlock value={timeLeft.s} label="sec" />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bid Increment Info */}
      {!auctionEnded && (
        <div className="flex items-center justify-between bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-sm">
          <span className="text-slate-600">
            Minimum next bid
          </span>

          <span className="text-[#D97706] font-semibold">
            {formatAED(minBid)}
          </span>
        </div>
      )}

      {/* Action Buttons */}
      {!auctionEnded && (
        <div className="flex flex-col gap-2">

          {!showBidInput ? (
            <button
              onClick={() => setShowBidInput(true)}
              className="w-full bg-[#D97706] hover:bg-[#B45309] hover:-translate-y-0.5 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:shadow-lg text-base"
            >
              Place Bid
            </button>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-3">

              <p className="text-slate-900 text-sm font-medium">
                Enter your bid
              </p>

              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-sm">AED</span>

                <input
                  type="number"
                  value={bidAmount}
                  min={minBid}
                  step={bidIncrement}
                  onChange={(e) => setBidAmount(Number(e.target.value))}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-sm focus:outline-none focus:border-[#D97706] focus:ring-2 focus:ring-[#D97706]/20 transition-all"
                />
              </div>

              {bidError && (
                <p className="text-red-500 text-xs">
                  {bidError}
                </p>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleBidSubmit}
                  disabled={isSubmitting}
                  className="flex-1 bg-[#D97706] hover:bg-[#B45309] disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-all text-sm"
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
                  className="px-4 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl transition-colors text-sm border border-slate-200"
                >
                  Cancel
                </button>
              </div>

            </div>
          )}
          
          {/* buy now btn */}
          <button
              className="w-full border-2 border-[#D97706] hover:border-[#B45309] hover:-translate-y-0.5 text-[#D97706] font-semibold py-3 rounded-xl transition-all duration-300 hover:shadow-lg text-base"
            >
              Buy Now For AED 32,000
            </button>
          
          {/* watchlist and share btn */}
          <div className="flex gap-2">

            <button
              onClick={onWatchlist}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border transition-all text-sm font-medium ${isWatchlisted
                ? "bg-amber-50 border-[#D97706] text-[#D97706]"
                : "bg-white border-slate-200 text-slate-600 hover:border-[#D97706] hover:text-[#D97706]"
                }`}
            >
              <span>
                {isWatchlisted ? (
                  <GoHeartFill className="w-4 h-4" />
                ) : (
                  <GoHeart className="w-4 h-4" />
                )}
              </span>

              <span>{isWatchlisted ? "Watching" : "Watchlist"}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:border-[#D97706] hover:text-[#D97706] transition-all text-sm font-medium"
            >
              <span>
                {copied ? <IoCheckmark className="w-5 h-5" /> : <IoIosShareAlt className="w-5 h-5" />}
              </span>
              <span>{copied ? "Copied!" : "Share"}</span>
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

export default VehicleAuctionPanel;
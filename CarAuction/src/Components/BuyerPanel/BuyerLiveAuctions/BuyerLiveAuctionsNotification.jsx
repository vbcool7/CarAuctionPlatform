import React from 'react';
import { Bell, ArrowRight } from 'lucide-react';

function BuyerLiveAuctionsNotification() {
  return (
    <div
      className="p-4 md:p-6 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC]"
    >
      <div className="flex gap-4 items-start">

        <div className="shrink-0 bg-amber-50 rounded-full">
          <Bell
            className="w-8 h-8 md:w-10 md:h-10 text-[#D97706] fill-[#FDE68A]"
          />
        </div>

        {/* Content */}
        <div className="flex-1">
          <h2 className="text-md md:text-lg font-bold text-[#0B1E3D]">
            Never Miss an Auction!
          </h2>
          <p className="mt-1 text-xs md:text-sm leading-relaxed text-[#0B1E3D]">
            Enable notifications and get alerted for your favorite auctions.
          </p>
        </div>
      </div>

      {/* Button */}
      <button
        className="w-full mt-5 py-1.5 md:py-2 text-[#D97706] text-[13px] md:text-sm flex items-center justify-center gap-2 rounded-lg border font-semibold transition-all"
      >
        Manage Notifications
        <ArrowRight size={18} />
      </button>
    </div>
  );
}

export default BuyerLiveAuctionsNotification;
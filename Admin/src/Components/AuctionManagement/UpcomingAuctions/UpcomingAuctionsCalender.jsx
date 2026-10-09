
import React, { useEffect, useState } from 'react';
import { Info, Bell } from 'lucide-react';
import DatePicker from 'react-datepicker';
import { useGetUpcomingAuctionsCalendar } from '../../../hooks/useAuction';

function UpcomingAuctionsCalender() {

  const {
    data,
    isLoading,
    isError,
  } = useGetUpcomingAuctionsCalendar();

  const upcomingAuctions = data?.auctions || [];

  const DUBAI_TIME_ZONE = "Asia/Dubai";

  // Get date key from auction datetime based on Dubai timezone
  const getDubaiDateKey = (dateTime) => {
    if (!dateTime) return "";

    return new Intl.DateTimeFormat("en-CA", {
      timeZone: DUBAI_TIME_ZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(dateTime));
  };

  // Get date key from DatePicker calendar date
  const getCalendarDateKey = (date) => {
    if (!date) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // Selected date
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Select first upcoming auction date after API data loads
  useEffect(() => {
    if (upcomingAuctions.length > 0) {
      setSelectedDate(
        new Date(upcomingAuctions[0].auctionStartDateTime)
      );
    }
  }, [upcomingAuctions]);

  const badgeColors = {
    green: "bg-green-100 text-green-700",
    orange: "bg-orange-100 text-orange-700",
    violet: "bg-violet-100 text-violet-700",
    blue: "bg-blue-100 text-blue-700",
  };

  // Get auctions for selected date
  const selectedDateKey = getCalendarDateKey(selectedDate);

  const selectedAuctions = upcomingAuctions.filter((auction) => {
    return (
      getDubaiDateKey(auction.auctionStartDateTime) === selectedDateKey
    );
  });

  // Format auction time in Dubai timezone
  const formatAuctionTime = (dateTime) => {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: DUBAI_TIME_ZONE,
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(dateTime));
  };

  // Get month/day in Dubai timezone
  const getAuctionDateParts = (dateTime) => {
    const date = new Date(dateTime);

    const month = new Intl.DateTimeFormat("en-US", {
      month: "short",
      timeZone: DUBAI_TIME_ZONE,
    }).format(date);

    const day = new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      timeZone: DUBAI_TIME_ZONE,
    }).format(date);

    return { month, day };
  };

  // Dubai auction dates for calendar highlighting
  const highlightedDubaiDates = new Set(
    upcomingAuctions.map((auction) =>
      getDubaiDateKey(auction.auctionStartDateTime)
    )
  );

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-2xl p-4">

        <h3 className="text-sm font-semibold text-[#0B1E3D] mb-4">
          Auction Calendar
        </h3>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">

          {isLoading ? (
            <div className="h-75 flex items-center justify-center text-sm text-slate-500">
              Loading calendar...
            </div>
          ) : isError ? (
            <div className="h-75 flex items-center justify-center text-sm text-red-500">
              Failed to load auctions.
            </div>
          ) : (
            <DatePicker
              inline
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              calendarClassName="biddrive-calendar"
              openToDate={selectedDate || new Date()}
              dayClassName={(date) => {
                const dateKey = getCalendarDateKey(date);

                return highlightedDubaiDates.has(dateKey)
                  ? "auction-highlight-day"
                  : undefined;
              }}
            />
          )}

        </div>

        <div className="mt-5 border-t border-slate-200 pt-4">

          <div className="flex items-center justify-between mb-4">

            <h3 className="font-semibold text-[#0B1E3D]">
              Upcoming Highlights
            </h3>

            <button className="text-xs text-[#D97706]">
              View All
            </button>

          </div>

          <div className="space-y-3">

            {isLoading ? (
              <div className="text-sm text-gray-500 text-center">
                Loading auctions...
              </div>
            ) : selectedAuctions.length === 0 ? (
              <div className="text-sm text-gray-500 text-center">
                No Auctions Available.
              </div>
            ) : (
              selectedAuctions.map((auction, index) => {

                const { month, day } = getAuctionDateParts(
                  auction.auctionStartDateTime
                );

                const colorKeys = Object.keys(badgeColors);
                const color = colorKeys[index % colorKeys.length];

                return (
                  <div
                    key={auction.id}
                    className="flex gap-3 items-start"
                  >

                    <div
                      className={`w-11 h-11 rounded-lg ${badgeColors[color]} flex flex-col items-center justify-center`}
                    >
                      <span className="text-[9px] uppercase font-bold">
                        {month}
                      </span>

                      <span className="text-sm font-bold">
                        {day}
                      </span>
                    </div>

                    <div className="flex-1">

                      <h4 className="text-sm font-semibold text-[#0B1E3D]">
                        {auction.title}
                      </h4>

                      <p className="text-xs text-slate-500">
                        {formatAuctionTime(
                          auction.auctionStartDateTime
                        )}
                      </p>

                    </div>

                  </div>
                );
              })
            )}

          </div>

        </div>

      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4">

        <div className="flex items-center gap-2 text-indigo-900 font-bold mb-2">
          <Info size={18} />
          <span>Quick Tips</span>
        </div>

        <p className="text-[13px] text-indigo-800/80 mb-4">
          Upcoming auctions will be visible to all registered users before the start time.
        </p>

        <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg text-sm font-semibold text-[#D97706] border border-amber-200 shadow-sm hover:bg-amber-50 transition-colors">
          <Bell size={16} />
          Manage Notifications
        </button>

      </div>
    </>
  );
}

export default UpcomingAuctionsCalender;
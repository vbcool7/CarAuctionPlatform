
import React from 'react';
import { useState } from 'react';
import { Info, Bell } from 'lucide-react';
import DatePicker from 'react-datepicker';

const upcomingHighlights = [
    {
        id: 1,
        title: "2022 Range Rover Sport HSE",
        date: "2026-05-21",
        time: "10:00 AM",
        color: "green",
    },
    {
        id: 2,
        title: "2021 Mercedes-Benz E300",
        date: "2026-05-22",
        time: "11:00 AM",
        color: "orange",
    },
    {
        id: 3,
        title: "2020 Ford F-150 XLT",
        date: "2026-05-23",
        time: "09:00 AM",
        color: "violet",
    },
    {
        id: 4,
        title: "BMW X5",
        date: "2026-05-23",
        time: "02:00 PM",
        color: "blue",
    },
    {
        id: 5,
        title: "BMW X5",
        date: "2026-06-23",
        time: "02:00 PM",
        color: "blue",
    },
];

function UpcomingAuctionsCalender() {

    const [selectedDate, setSelectedDate] = useState(new Date("2026-05-21"));

    // badge color
    const badgeColors = {
        green: "bg-green-100 text-green-700",
        orange: "bg-orange-100 text-orange-700",
        violet: "bg-violet-100 text-violet-700",
        blue: "bg-blue-100 text-blue-700",
    };

    // highlight dates in cal
    const highlightedDates = upcomingHighlights.map(
        item => new Date(item.date)
    );

    // when user click on date
    const selectedAuctions = upcomingHighlights.filter(
        auction =>
            new Date(auction.date).toDateString() ===
            selectedDate?.toDateString()
    );

    return (
        <>
            {/* calender */}
            <div className=" bg-white border border-slate-200 rounded-2xl p-4">
                <h3 className="text-sm font-semibold text-[#0B1E3D] mb-4">
                    Auction Calendar
                </h3>

                <div className='bg-white border border-slate-200 rounded-2xl p-4 shadow-sm'>
                    <DatePicker
                        inline
                        selected={selectedDate}
                        highlightDates={highlightedDates}
                        onChange={(date) => setSelectedDate(date)}
                        calendarClassName="biddrive-calendar"
                        openToDate={new Date("2026-05-21")}
                    />
                </div>

                {/* highlights */}
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
                        {selectedAuctions.length === 0 ? (
                            <div className='text-sm text-gray-500 text-center'>
                                No Auctions Available.
                            </div>
                        ) : (
                            selectedAuctions.map((auction) => (
                                <div
                                    key={auction.id}
                                    className="flex gap-3 items-start"
                                >
                                    {/* Date Badge */}
                                    <div className={`w-11 h-11 rounded-lg ${badgeColors[auction.color]} flex flex-col items-center justify-center`}>

                                        <span className="text-[9px] uppercase font-bold">
                                            {new Date(auction.date).toLocaleString("en-US", {
                                                month: "short",
                                            })}
                                        </span>

                                        <span className="text-sm font-bold">
                                            {new Date(auction.date).getDate()}
                                        </span>

                                    </div>

                                    <div className="flex-1">

                                        <h4 className="text-sm font-semibold text-[#0B1E3D]">
                                            {auction.title}
                                        </h4>

                                        <p className="text-xs text-slate-500">
                                            {auction.time}
                                        </p>

                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Card */}
            <div className=" bg-white border border-slate-200 rounded-2xl p-4">
                {/* Title */}
                <div className="flex items-center gap-2 text-indigo-900 font-bold mb-2">
                    <Info size={18} />
                    <span>Quick Tips</span>
                </div>

                {/* Description */}
                <p className="text-[13px] text-indigo-800/80 mb-4">
                    Upcoming auctions will be visible to all registered users before the start time.
                </p>

                {/* Button */}
                <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg text-sm font-semibold text-[#D97706] border border-amber-200 shadow-sm hover:bg-amber-50 transition-colors">
                    <Bell size={16} />
                    Manage Notifications
                </button>
            </div>
        </>
    )
}

export default UpcomingAuctionsCalender;
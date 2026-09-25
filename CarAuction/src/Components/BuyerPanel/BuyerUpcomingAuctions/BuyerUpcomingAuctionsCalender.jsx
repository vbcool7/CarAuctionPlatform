
import React, { useState } from 'react';
import { useGetUpcomingAuctionDates } from '../../../hook/useAuction';

function BuyerUpcomingAuctionsCalender() {

    const {
        data: getUpcomingDates,
        isLoading,
        isError
    } = useGetUpcomingAuctionDates();

    const [calMonth, setCalMonth] = useState(new Date());

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        return { firstDay, daysInMonth };
    };

    const { firstDay, daysInMonth } = getDaysInMonth(calMonth);

    const today = new Date().getDate();

    const isCurrentMonth =
        calMonth.getMonth() === new Date().getMonth() &&
        calMonth.getFullYear() === new Date().getFullYear();

    const monthLabel = calMonth.toLocaleString('en-AE', {
        month: 'long',
        year: 'numeric'
    });

    // API se upcoming auction dates
    const upcomingDates = getUpcomingDates?.data || [];

    return (
        <div>
            {/* ── Auction Calendar ── */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-slate-900">
                        Auction Calendar
                    </h4>
                </div>

                {/* Month Nav */}
                <div className="flex items-center justify-between mb-3">
                    <button
                        onClick={() =>
                            setCalMonth(
                                new Date(
                                    calMonth.getFullYear(),
                                    calMonth.getMonth() - 1
                                )
                            )
                        }
                        className="text-slate-400 hover:text-slate-700 p-1"
                    >
                        ‹
                    </button>

                    <span className="text-sm font-semibold text-slate-700">
                        {monthLabel}
                    </span>

                    <button
                        onClick={() =>
                            setCalMonth(
                                new Date(
                                    calMonth.getFullYear(),
                                    calMonth.getMonth() + 1
                                )
                            )
                        }
                        className="text-slate-400 hover:text-slate-700 p-1"
                    >
                        ›
                    </button>
                </div>

                {/* Day Headers */}
                <div className="grid grid-cols-7 mb-1">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                        <div
                            key={d}
                            className="text-center text-[10px] font-bold text-slate-400"
                        >
                            {d}
                        </div>
                    ))}
                </div>

                {/* Day Grid */}
                <div className="grid grid-cols-7 gap-y-1">

                    {/* Empty days */}
                    {Array.from({ length: firstDay }).map((_, i) => (
                        <div key={`empty-${i}`} />
                    ))}

                    {/* Calendar days */}
                    {Array.from({ length: daysInMonth }).map((_, i) => {

                        const day = i + 1;

                        const isToday =
                            isCurrentMonth && day === today;

                        // Current calendar date
                        const currentDate = new Date(
                            calMonth.getFullYear(),
                            calMonth.getMonth(),
                            day
                        );

                        // Find auction for this date
                        const auctionDate = upcomingDates.find((item) => {

                            const apiDate = new Date(item.date);

                            return (
                                apiDate.getFullYear() === currentDate.getFullYear() &&
                                apiDate.getMonth() === currentDate.getMonth() &&
                                apiDate.getDate() === currentDate.getDate()
                            );
                        });

                        const hasAuction = !!auctionDate;
                        const auctionCount = auctionDate?.count || 0;

                        return (
                            <div
                                key={day}
                                className={`relative text-center text-[11px] py-1.5 rounded-full font-medium cursor-pointer transition-colors
                                    ${isToday
                                        ? 'bg-[#D97706] text-white'
                                        : hasAuction
                                            ? 'bg-[#D97706]/10 text-[#D97706] font-bold'
                                            : 'text-slate-600 hover:bg-slate-100'
                                    }`}
                            >
                                {day}
                                {hasAuction && (
                                    <span
                                        className="absolute -top-1 -right-1 min-w-3.75 h-3.75 px-1 rounded-full flex items-center justify-center bg-[#D97706] text-white text-[8px] font-bold leading-none"
                                    >
                                        {auctionCount}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Loading */}
                {isLoading && (
                    <p className="text-[10px] text-slate-400 text-center mt-3">
                        Loading auction dates...
                    </p>
                )}

                {/* Error */}
                {isError && (
                    <p className="text-[10px] text-red-400 text-center mt-3">
                        Failed to load auction dates
                    </p>
                )}

            </div>
        </div>
    );
}

export default BuyerUpcomingAuctionsCalender;
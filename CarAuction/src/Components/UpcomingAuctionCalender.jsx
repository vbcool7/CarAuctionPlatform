
import React, { useState } from 'react';
import { vehicles } from './Data';

function UpcomingAuctionCalender() {

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
    const monthLabel = calMonth.toLocaleString('en-AE', { month: 'long', year: 'numeric' });

    return (
        <div>
            {/* ── Auction Calendar ── */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-slate-900">Auction Calendar</h4>
                </div>

                {/* Month Nav */}
                <div className="flex items-center justify-between mb-3">
                    <button
                        onClick={() => setCalMonth(new Date(calMonth.getFullYear(), calMonth.getMonth() - 1))}
                        className="text-slate-400 hover:text-slate-700 p-1"
                    >
                        ‹
                    </button>
                    <span className="text-sm font-semibold text-slate-700">{monthLabel}</span>
                    <button
                        onClick={() => setCalMonth(new Date(calMonth.getFullYear(), calMonth.getMonth() + 1))}
                        className="text-slate-400 hover:text-slate-700 p-1"
                    >
                        ›
                    </button>
                </div>

                {/* Day Headers */}
                <div className="grid grid-cols-7 mb-1">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                        <div key={d} className="text-center text-[10px] font-bold text-slate-400">{d}</div>
                    ))}
                </div>

                {/* Day Grid */}
                <div className="grid grid-cols-7 gap-y-1">
                    {Array.from({ length: firstDay }).map((_, i) => (
                        <div key={`empty-${i}`} />
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const isToday = isCurrentMonth && day === today;
                        // highlight days with upcoming auctions
                        const hasAuction = vehicles
                            .filter(v => v.status === 'upcoming' && v.startTime)
                            .some(v => {
                                const d = new Date(v.startTime);
                                return d.getDate() === day &&
                                    d.getMonth() === calMonth.getMonth() &&
                                    d.getFullYear() === calMonth.getFullYear();
                            });

                        return (
                            <div
                                key={day}
                                className={`text-center text-[11px] py-1 rounded-full font-medium cursor-pointer transition-colors
                                    ${isToday ? 'bg-[#D97706] text-white' : ''}
                                    ${hasAuction && !isToday ? 'bg-[#D97706]/15 text-[#D97706] font-bold' : ''}
                                    ${!isToday && !hasAuction ? 'text-slate-600 hover:bg-slate-100' : ''}
                                `}
                            >
                                {day}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}

export default UpcomingAuctionCalender
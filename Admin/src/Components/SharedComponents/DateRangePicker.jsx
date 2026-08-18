
import React from "react";
import DatePicker from "react-datepicker";
import { Calendar } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";

const DateRangePicker = ({
    startDate,
    endDate,
    onChange,
    placeholder = "Select Date Range",
    className = "",
}) => {
    return (
        <div className={`relative ${className}`}>
            <Calendar
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-slate-400 pointer-events-none"
            />

            <DatePicker
                selectsRange
                startDate={startDate}
                endDate={endDate}
                onChange={onChange}
                placeholderText={placeholder}
                dateFormat="MMM dd, yyyy"
                className="
                    w-full
                    h-10
                    pl-10
                    pr-3
                    bg-white
                    border
                    border-slate-300
                    rounded-lg
                    text-sm
                    text-[#0B1E3D]
                    placeholder:text-slate-400
                    outline-none
                    hover:bg-slate-50
                    transition-colors
                "
                calendarClassName="rounded-xl shadow-lg border-slate-200"
            />
        </div>
    );
};

export default DateRangePicker;
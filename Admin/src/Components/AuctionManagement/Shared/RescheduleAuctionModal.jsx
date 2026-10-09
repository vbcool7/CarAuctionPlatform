
import { useState, useEffect } from "react";
import { X, AlertCircle } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DURATION_OPTIONS = [
    { value: "1_day", label: "1 Day" },
    { value: "3_days", label: "3 Days" },
    { value: "5_days", label: "5 Days" },
    { value: "7_days", label: "7 Days" },
    { value: "14_days", label: "14 Days" },
];

const UAE_UTC_OFFSET_HOURS = 4;

const pad = (n) => String(n).padStart(2, "0");

// DatePicker ka Date -> "YYYY-MM-DD" (user ne jo calendar din chuna wahi, timezone se independent)
const toDateString = (d) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

// "14:30" -> "2:30 PM"
const to12h = (hhmm) => {
    const [h, m] = hhmm.split(":").map(Number);
    const meridiem = h >= 12 ? "PM" : "AM";
    return `${h % 12 || 12}:${pad(m)} ${meridiem}`;
};

// chuna hua (UAE) date + time kis instant par hai (ms)
const uaeStartMs = (date, hhmm) => {
    const [h, m] = hhmm.split(":").map(Number);
    return Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        h - UAE_UTC_OFFSET_HOURS,
        m
    );
};

const inputClasses =
    "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#D97706] focus:ring-2 focus:ring-[#D97706]/10 disabled:bg-slate-100 disabled:cursor-not-allowed";

const RescheduleAuctionModal = ({
    isOpen,
    onClose,
    onConfirm,   // ({ startDate, startTime, duration, reason }) => void
    vehicle,
    loading = false,
    error,
}) => {
    const [date, setDate] = useState(null);
    const [time, setTime] = useState("");
    const [duration, setDuration] = useState("");
    const [reason, setReason] = useState("");
    const [localError, setLocalError] = useState("");

    // upcoming = reschedule, baaki (unsold / reserve-not-met / canceled) = relist
    const isRelist = vehicle?.auctionStatus !== "upcoming";

    // modal khulte hi form reset
    useEffect(() => {
        if (isOpen) {
            setDate(null);
            setTime("");
            setReason("");
            setLocalError("");
            setDuration(vehicle?.auctionDuration || "");
        }
    }, [isOpen, vehicle?.auctionDuration]);

    if (!isOpen) return null;

    const canSubmit = !!date && !!time && !!duration && !!reason.trim() && !loading;
    const shownError = localError || error;

    const handleSubmit = () => {
        if (uaeStartMs(date, time) < Date.now() + 60 * 1000) {
            setLocalError("Start time must be at least 1 minute in the future (UAE time).");
            return;
        }
        setLocalError("");
        onConfirm({
            startDate: toDateString(date),
            startTime: to12h(time),
            duration,
            reason: reason.trim(),
        });
    };

    return (
        <div className="fixed inset-0 z-75 flex items-center justify-center p-4 backdrop-blur-md bg-slate-900/60 transition-all duration-300">
            <style>{`.reschedule-popper { z-index: 95; }`}</style>

            <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl ring-1 ring-slate-900/5 max-h-[92vh] flex flex-col transform transition-all overflow-hidden">

                {/* Header (Fixed at top) */}
                <div className="relative flex items-start justify-between border-b border-slate-100 px-7 pt-6 pb-5 bg-linear-to-b from-slate-50/50 to-white shrink-0">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#0B1E3D]/10 text-[#0B1E3D] shadow-inner font-semibold">
                                {isRelist ? "🔄" : "📅"}
                            </span>
                            <div>
                                <h2 className="text-xl font-bold tracking-tight text-[#0B1E3D]">
                                    {isRelist ? "Relist Auction" : "Reschedule Auction"}
                                </h2>
                                <div className="mt-1 flex items-center gap-2">
                                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">VIN</span>
                                    <span className="text-xs font-bold tracking-wide text-slate-700">
                                        {vehicle?.vin || "—"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <p className="text-xs leading-relaxed text-slate-500 pt-1">
                            {isRelist
                                ? "Relisting clears the previous bids and puts this vehicle back to Upcoming."
                                : "Only the start time and duration change. The auction stays Upcoming."}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-full p-2 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-700 active:scale-95 disabled:opacity-50"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body (Scrollable area) */}
                <div className="space-y-5 px-7 py-6 overflow-y-auto flex-1">

                    {/* Date */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                            New Start Date <span className="text-red-500">*</span>
                        </label>
                        <DatePicker
                            selected={date}
                            onChange={(d) => setDate(d)}
                            minDate={new Date()}
                            dateFormat="dd MMM yyyy"
                            placeholderText="Select date"
                            disabled={loading}
                            wrapperClassName="w-full"
                            className={`${inputClasses} focus:ring-2 focus:ring-[#0B1E3D]/20 focus:border-[#0B1E3D]`}
                            popperClassName="reschedule-popper"
                        />
                    </div>

                    {/* Time */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                                New Start Time <span className="text-red-500">*</span>
                            </label>
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-[#D97706] ring-1 ring-inset ring-amber-500/20">
                                UAE time (UTC+4)
                            </span>
                        </div>
                        <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            disabled={loading}
                            className={`${inputClasses} focus:ring-2 focus:ring-[#0B1E3D]/20 focus:border-[#0B1E3D]`}
                        />
                        <p className="text-[11px] text-slate-500">
                            Enter UAE time, not your local time.
                        </p>
                    </div>

                    {/* Duration */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                            Auction Duration <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            disabled={loading}
                            className={`${inputClasses} focus:ring-2 focus:ring-[#0B1E3D]/20 focus:border-[#0B1E3D]`}
                        >
                            <option value="" disabled hidden>
                                Select duration
                            </option>
                            {DURATION_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Reason */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                            Reason <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder={`Enter reason for ${isRelist ? "relisting" : "rescheduling"} this auction...`}
                            rows={3}
                            disabled={loading}
                            className={`${inputClasses} resize-none focus:ring-2 focus:ring-[#0B1E3D]/20 focus:border-[#0B1E3D]`}
                        />
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-0.5">
                            <AlertCircle size={14} className="shrink-0 text-slate-400" />
                            <span>This reason will be recorded in the schedule history.</span>
                        </div>
                    </div>

                    {shownError && (
                        <div className="rounded-xl bg-red-50 p-3 ring-1 ring-inset ring-red-500/20">
                            <p className="text-xs font-medium text-red-600">{shownError}</p>
                        </div>
                    )}
                </div>

                {/* Footer (Fixed at bottom) */}
                <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-7 py-4 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 shadow-sm transition-all hover:bg-slate-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Close
                    </button>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!canSubmit}
                        className="h-11 rounded-xl bg-[#0B1E3D] px-6 text-sm font-semibold text-white shadow-md shadow-[#0B1E3D]/20 transition-all hover:bg-[#132d59] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? "Saving..." : isRelist ? "Relist Auction" : "Reschedule"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RescheduleAuctionModal;

import React, { useState, useRef, useEffect } from 'react';
import { HiChevronDown } from 'react-icons/hi';
import { HiCalendarDays } from 'react-icons/hi2';

// ===== Reusable Dropdown =====
function CustomDropdown({ label, options, placeholder }) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(placeholder);
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="mb-5" ref={ref}>
            <label className="block text-sm font-semibold text-[#0F172A] mb-2">{label}</label>
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setOpen((prev) => !prev)}
                    className="w-full flex items-center justify-between px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#D97706]/20"
                >
                    <span className={selected === placeholder ? 'text-slate-400' : 'text-slate-700'}>
                        {selected}
                    </span>
                    <HiChevronDown
                        className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
                        size={18}
                    />
                </button>

                {open && (
                    <ul className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-56 overflow-y-auto">
                        {options.map((option) => (
                            <li key={option}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelected(option);
                                        setOpen(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-50 ${
                                        selected === option
                                            ? 'text-[#D97706] font-medium bg-orange-50'
                                            : 'text-slate-700'
                                    }`}
                                >
                                    {option}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

// ===== Option lists =====
const locations    = ['All Locations', 'Dubai, UAE', 'Abu Dhabi, UAE', 'Sharjah, UAE', 'Ras Al Khaimah, UAE'];
const vehicleTypes = ['All Types', 'Luxury Sedan', 'Luxury SUV', 'Luxury Coupe', 'Pickup Truck'];
const makes        = ['All Makes', 'BMW', 'Mercedes-Benz', 'Porsche', 'Range Rover', 'Audi', 'Toyota', 'Land Rover'];
const auctionTypes = ['All Types', 'Live Auction', 'Sealed Bid', 'Reserve Auction'];
const saleStatuses = ['All Status', 'Sold', 'Not Sold', 'Reserve Not Met'];

// ===== EndedAuctionSideFilter =====
function EndedAuctionSideFilter({ onApply, onReset }) {
    const [endDate, setEndDate]     = useState('');
    const [minPrice, setMinPrice]   = useState('');
    const [maxPrice, setMaxPrice]   = useState('');

    const handleReset = () => {
        setEndDate('');
        setMinPrice('');
        setMaxPrice('');
        onReset?.();
    };

    const handleApply = () => {
        onApply?.({ endDate, minPrice, maxPrice });
    };

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-[#0F172A]">Filter Auctions</h3>
                <button
                    onClick={handleReset}
                    className="text-sm font-medium text-[#D97706] hover:underline"
                >
                    Reset
                </button>
            </div>

            {/* Location */}
            <CustomDropdown label="Location" options={locations} placeholder="All Locations" />

            {/* Vehicle Type */}
            <CustomDropdown label="Vehicle Type" options={vehicleTypes} placeholder="All Types" />

            {/* Make */}
            <CustomDropdown label="Make" options={makes} placeholder="All Makes" />

            {/* Auction Type */}
            <CustomDropdown label="Auction Type" options={auctionTypes} placeholder="All Types" />

            {/* Sale Status */}
            <CustomDropdown label="Sale Status" options={saleStatuses} placeholder="All Status" />

            {/* End Date */}
            <div className="mb-5">
                <label className="block text-sm font-semibold text-[#0F172A] mb-2">End Date</label>
                <div className="relative">
                    <HiCalendarDays
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                        size={17}
                    />
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#D97706]/20"
                    />
                </div>
            </div>

            {/* Price Range */}
            <div className="mb-5">
                <label className="block text-sm font-semibold text-[#0F172A] mb-2">Price Range (AED)</label>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        placeholder="Min Price"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#D97706]/20"
                    />
                    <span className="text-slate-400 text-sm">-</span>
                    <input
                        type="number"
                        placeholder="Max Price"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#D97706]/20"
                    />
                </div>
            </div>

            {/* Apply */}
            <button
                onClick={handleApply}
                className="w-full bg-[#D97706] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-[#b45f04] transition cursor-pointer"
            >
                Apply Filters
            </button>
        </div>
    );
}

export default EndedAuctionSideFilter;
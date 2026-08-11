
import React, { useState, useRef, useEffect } from 'react';
import { HiChevronDown } from 'react-icons/hi';

// ===== Single Dropdown =====
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
                    className="w-full flex items-center justify-between px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#D97706]/20"
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
                                        selected === option ? 'text-[#D97706] font-medium bg-orange-50' : 'text-slate-700'
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

// ===== Static option lists =====
const locations = ['All Locations', 'Dubai, UAE', 'Abu Dhabi, UAE', 'Sharjah, UAE'];
const vehicleTypes = ['All Types', 'Luxury Sedan', 'Luxury SUV', 'Luxury Coupe', 'Pickup Truck'];
const years = ['All Years', '2023', '2022', '2021', '2020', '2019'];
const endsWithin = ['Any Time', 'Ending in 15 mins', 'Ending in 1 hour', 'Ending in 3 hours', 'Ending Today'];
const auctionTypes = ['All Types', 'Live Auction', 'Sealed Bid', 'Reserve Auction'];
const makes = ['All Makes', 'BMW', 'Mercedes-Benz', 'Porsche', 'Range Rover', 'Audi'];

function AuctionSideFilter({ variant = 'live' }) {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-[#0F172A]">Filter Auctions</h3>
                <button className="text-sm font-medium text-[#D97706] hover:underline">Reset</button>
            </div>

            <CustomDropdown label="Location" options={locations} placeholder="All Locations" />

            {/* Upcoming only */}
            {variant === 'upcoming' && (
                <CustomDropdown label="Auction Type" options={auctionTypes} placeholder="All Types" />
            )}

            <CustomDropdown label="Vehicle Type" options={vehicleTypes} placeholder="All Types" />

            {/* Upcoming only */}
            {variant === 'upcoming' && (
                <CustomDropdown label="Make" options={makes} placeholder="All Makes" />
            )}

            {/* Live only */}
            {variant === 'live' && (
                <CustomDropdown label="Year" options={years} placeholder="All Years" />
            )}

            {/* Live: Ends Within / Upcoming: Start Date */}
            {variant === 'live' ? (
                <CustomDropdown label="Ends Within" options={endsWithin} placeholder="Any Time" />
            ) : (
                <div className="mb-5">
                    <label className="block text-sm font-semibold text-[#0F172A] mb-2">Start Date</label>
                    <input
                        type="date"
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#D97706]/20"
                    />
                </div>
            )}

            <div className="mb-5">
                <label className="block text-sm font-semibold text-[#0F172A] mb-2">Price Range (AED)</label>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        placeholder="Min Price"
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#D97706]/20"
                    />
                    <span className="text-slate-400">-</span>
                    <input
                        type="number"
                        placeholder="Max Price"
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#D97706]/20"
                    />
                </div>
            </div>

            <button className="w-full bg-[#D97706] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-[#b45f04] transition">
                Apply Filters
            </button>
        </div>
    );
}

export default AuctionSideFilter;
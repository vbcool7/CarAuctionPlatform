
import { useEffect, useState, useRef } from "react";
import { HiChevronDown } from "react-icons/hi";

function CustomDropdown({ label, options, value, onChange }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    const selectedLabel = options.find((o) => o.value === value)?.label ?? options[0].label;

    return (
        <div className="mb-5" ref={ref}>
            <label className="block text-sm font-semibold text-[#0F172A] mb-2">{label}</label>
            <div className="relative">
                <button type="button" onClick={() => setOpen((p) => !p)}
                    className="w-full flex items-center justify-between px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white">
                    <span className={value ? 'text-slate-700' : 'text-slate-400'}>{selectedLabel}</span>
                    <HiChevronDown className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} size={18} />
                </button>
                
                {open && (
                    <ul className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-56 overflow-y-auto">
                        {options.map((o) => (
                            <li key={o.value}>
                                <button type="button" onClick={() => { onChange(o.value); setOpen(false); }}
                                    className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-50 ${value === o.value ? 'text-[#D97706] font-medium bg-orange-50' : 'text-slate-700'}`}>
                                    {o.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

const emirates = [
  { label: 'All Locations', value: '' },
  { label: 'Dubai', value: 'dubai' },
  { label: 'Abu Dhabi', value: 'abu_dhabi' },
  { label: 'Sharjah', value: 'sharjah' },
  { label: 'Ajman', value: 'ajman' },
  { label: 'Umm Al Quwain', value: 'umm_al_quwain' },
  { label: 'Ras Al Khaimah', value: 'ras_al_khaimah' },
  { label: 'Fujairah', value: 'fujairah' },
];

const fuelTypes = [
  { label: 'All Fuel Types', value: '' },
  { label: 'Petrol', value: 'petrol' },
  { label: 'Diesel', value: 'diesel' },
  { label: 'Electric', value: 'electric' },
  { label: 'Hybrid', value: 'hybrid' },
  { label: 'Plug-in Hybrid', value: 'plug_in_hybrid' },
  { label: 'CNG', value: 'cng' },
  { label: 'LPG', value: 'lpg' },
];

const vehicleTypes = [
  { label: 'All Types', value: '' },
  { label: 'Sedan', value: 'sedan' },
  { label: 'SUV', value: 'suv' },
  { label: 'Hatchback', value: 'hatchback' },
  { label: 'Coupe', value: 'coupe' },
  { label: 'Convertible', value: 'convertible' },
  { label: 'Wagon', value: 'wagon' },
  { label: 'Pickup Truck', value: 'pickup_truck' },
  { label: 'Van', value: 'van' },
  { label: 'Minivan', value: 'minivan' },
  { label: 'Sports Car', value: 'sports_car' },
  { label: 'Luxury Car', value: 'luxury_car' },
  { label: 'Electric Vehicle', value: 'electric_vehicle' },
  { label: 'Motorcycle', value: 'motorcycle' },
];

const makes = [
  { label: 'All Makes', value: '' },
  { label: 'BMW', value: 'BMW' },
  { label: 'Mercedes-Benz', value: 'Mercedes-Benz' },
  { label: 'Porsche', value: 'Porsche' },
  { label: 'Range Rover', value: 'Range Rover' },
  { label: 'Audi', value: 'Audi' },
  { label: 'Toyota', value: 'Toyota' },
  { label: 'Land Rover', value: 'Land Rover' },
];

const DEFAULTS = { emirate: '', vehicleType: '', make: '', fuelType: '', minPrice: '', maxPrice: '', endDate: '' };

function AuctionSideFilter({ variant = 'live', onApply }) {
    const [f, setF] = useState(DEFAULTS);
    const set = (k) => (v) => setF((p) => ({ ...p, [k]: v }));

    const reset = () => { setF(DEFAULTS); onApply?.(DEFAULTS); };
    const apply = () => onApply?.(f);

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-[#0F172A]">Filter Auctions</h3>
                <button onClick={reset} className="text-sm font-medium text-[#D97706] hover:underline">Reset</button>
            </div>

            <CustomDropdown label="Location" options={emirates} value={f.emirate} onChange={set('emirate')} />
            <CustomDropdown label="Vehicle Type" options={vehicleTypes} value={f.vehicleType} onChange={set('vehicleType')} />
            <CustomDropdown label="Make" options={makes} value={f.make} onChange={set('make')} />
            <CustomDropdown label="Fuel Type" options={fuelTypes} value={f.fuelType} onChange={set('fuelType')} />

            {variant === 'ended' && (
                <div className="mb-5">
                    <label className="block text-sm font-semibold text-[#0F172A] mb-2">End Date</label>
                    <input type="date" value={f.endDate} onChange={(e) => set('endDate')(e.target.value)}
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-700" />
                </div>
            )}

            <div className="mb-5">
                <label className="block text-sm font-semibold text-[#0F172A] mb-2">Price Range (AED)</label>
                <div className="flex items-center gap-2">
                    <input type="number" placeholder="Min" value={f.minPrice} onChange={(e) => set('minPrice')(e.target.value)}
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm" />
                    <span className="text-slate-400">-</span>
                    <input type="number" placeholder="Max" value={f.maxPrice} onChange={(e) => set('maxPrice')(e.target.value)}
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm" />
                </div>
            </div>

            <button onClick={apply} className="w-full bg-[#D97706] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-[#b45f04] transition">
                Apply Filters
            </button>
        </div>
    );
}

export default AuctionSideFilter;
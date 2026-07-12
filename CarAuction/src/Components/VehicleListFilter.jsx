import { useState } from "react";
import { ChevronDown, ChevronUp, SlidersHorizontal, X } from "lucide-react";

const MAKES = [
  { label: "Ford", count: 17292 },
  { label: "Toyota", count: 16861 },
  { label: "Chevrolet", count: 14698 },
  { label: "Honda", count: 12215 },
  { label: "Nissan", count: 10586 },
  { label: "BMW", count: 8104 },
  { label: "Mercedes-Benz", count: 7230 },
  { label: "Audi", count: 6871 },
  { label: "Hyundai", count: 6540 },
  { label: "Kia", count: 5980 },
];

const MODELS = [
  { label: "Camry", count: 3741 },
  { label: "Corolla", count: 3204 },
  { label: "Accord", count: 3180 },
  { label: "Civic", count: 3140 },
  { label: "Altima", count: 2488 },
  { label: "F-150", count: 2210 },
  { label: "Silverado", count: 2100 },
  { label: "RAV4", count: 1980 },
];

const COLORS = [
  { label: "White", hex: "#F1F5F9" },
  { label: "Black", hex: "#1E293B" },
  { label: "Silver", hex: "#94A3B8" },
  { label: "Red", hex: "#EF4444" },
  { label: "Blue", hex: "#3B82F6" },
  { label: "Grey", hex: "#64748B" },
  { label: "Brown", hex: "#92400E" },
  { label: "Green", hex: "#10B981" },
  { label: "Orange", hex: "#F97316" },
  { label: "Yellow", hex: "#EAB308" },
];

const YEAR_OPTIONS = Array.from({ length: 26 }, (_, i) => 2000 + i);

const defaultFilters = {
  makes: [],
  models: [],
  yearFrom: "",
  yearTo: "",
  maxMileage: 200000,
  transmission: [],
  fuelType: [],
  driveType: [],
  colors: [],
  engineType: [],
  condition: [],
  auctionStatus: [],
};

// Reusable checkbox UI
function Checkbox({ checked }) {
  return (
    <div
      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
        checked ? "bg-amber-500 border-amber-500" : "border-gray-300 bg-white"
      }`}
    >
      {checked && (
        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
          <path
            d="M1 3.5L3.5 6L8 1"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}

function FilterSection({ title, isOpen, onToggle, children }) {
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-3 text-left transition-colors hover:bg-amber-50"
      >
        <span className="text-sm font-semibold text-gray-900">{title}</span>
        {isOpen ? (
          <ChevronUp size={15} className="text-gray-400 shrink-0" />
        ) : (
          <ChevronDown size={15} className="text-gray-400 shrink-0" />
        )}
      </button>
      {isOpen && <div className="pb-3">{children}</div>}
    </div>
  );
}

function CheckList({ items, selected, onToggle, showSearch = false }) {
  
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);

  const filtered = items.filter((i) =>
    i.label.toLowerCase().includes(search.toLowerCase())
  );
  const visible = showAll ? filtered : filtered.slice(0, 5);

  return (
    <div>
      {showSearch && (
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="w-full bg-white border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400 px-3 py-2 mb-2 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
        />
      )}
      <div className="space-y-0.5">
        {visible.map((item) => {
          const checked = selected.includes(item.label);
          return (
            <div
              key={item.label}
              onClick={() => onToggle(item.label)}
              className="flex items-center justify-between py-1.5 px-1 rounded cursor-pointer hover:bg-amber-50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Checkbox checked={checked} />
                <span className="text-sm text-gray-700">{item.label}</span>
              </div>
              {item.count !== undefined && (
                <span className="text-xs text-gray-400">
                  {item.count.toLocaleString()}
                </span>
              )}
            </div>
          );
        })}
      </div>
      {(filtered.length > 5 || showAll) && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-1.5 flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 font-medium transition-colors"
        >
          {showAll ? (
            <><ChevronUp size={13} /> Show less</>
          ) : (
            <><ChevronDown size={13} /> Show all {filtered.length} A–Z</>
          )}
        </button>
      )}
    </div>
  );
}

// Checkbox-style group (replaces PillGroup for transmission, fuel, drive, engine, condition, color)
function CheckboxGroup({ options, selected, onToggle }) {
  return (
    <div className="space-y-0.5">
      {options.map((opt) => {
        const checked = selected.includes(opt);
        return (
          <div
            key={opt}
            onClick={() => onToggle(opt)}
            className="flex items-center gap-2.5 py-1.5 px-1 rounded cursor-pointer hover:bg-amber-50 transition-colors"
          >
            <Checkbox checked={checked} />
            <span className="text-sm text-gray-700">{opt}</span>
          </div>
        );
      })}
    </div>
  );
}

// Color section uses checkbox rows with swatch
function ColorCheckList({ colors, selected, onToggle }) {
  return (
    <div className="space-y-0.5">
      {colors.map(({ label, hex }) => {
        const checked = selected.includes(label);
        return (
          <div
            key={label}
            onClick={() => onToggle(label)}
            className="flex items-center gap-2.5 py-1.5 px-1 rounded cursor-pointer hover:bg-amber-50 transition-colors"
          >
            <Checkbox checked={checked} />
            <div
              style={{ backgroundColor: hex }}
              className="w-4 h-4 rounded-full border border-gray-300 shrink-0"
            />
            <span className="text-sm text-gray-700">{label}</span>
          </div>
        );
      })}
    </div>
  );
}

function VehicleListFilter({ onFiltersChange }) {
  
  const [filters, setFilters] = useState(defaultFilters);
  const [openSections, setOpenSections] = useState({
    make: true,
    model: true,
    year: true,
    mileage: true,
    transmission: false,
    fuel: false,
    drive: false,
    color: false,
    engine: false,
    condition: false,
    auction: true,
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSection = (key) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleArrayFilter = (key, value) => {
    setFilters((prev) => {
      const arr = prev[key];
      const updated = arr.includes(value)
        ? arr.filter((v) => v !== value)
        : [...arr, value];
      const next = { ...prev, [key]: updated };
      onFiltersChange?.(next);
      return next;
    });
  };

  const setFilter = (key, value) => {
    setFilters((prev) => {
      const next = { ...prev, [key]: value };
      onFiltersChange?.(next);
      return next;
    });
  };

  const clearAll = () => {
    setFilters(defaultFilters);
    onFiltersChange?.(defaultFilters);
  };

  const activeCount = Object.entries(filters).reduce((acc, [key, val]) => {
    if (key === "maxMileage") return val < 200000 ? acc + 1 : acc;
    if (Array.isArray(val)) return acc + (val.length > 0 ? 1 : 0);
    if (val !== "") return acc + 1;
    return acc;
  }, 0);

  const sidebarContent = (
    <div className="bg-white border border-gray-200 rounded-xl p-4 w-full shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-amber-500" />
          <span className="text-sm font-semibold text-gray-900">Filters</span>
          {activeCount > 0 && (
            <span className="text-xs bg-amber-100 text-amber-700 font-medium px-2 py-0.5 rounded-full">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="text-xs text-red-500 hover:text-red-600 transition-colors flex items-center gap-1"
          >
            <X size={12} /> Clear all
          </button>
        )}
      </div>

      {/* Basic Filters */}
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
        Basic filters
      </p>

      <FilterSection title="Make" isOpen={openSections.make} onToggle={() => toggleSection("make")}>
        <CheckList items={MAKES} selected={filters.makes} onToggle={(v) => toggleArrayFilter("makes", v)} showSearch />
      </FilterSection>

      <FilterSection title="Model" isOpen={openSections.model} onToggle={() => toggleSection("model")}>
        <CheckList items={MODELS} selected={filters.models} onToggle={(v) => toggleArrayFilter("models", v)} showSearch />
      </FilterSection>

      <FilterSection title="Year" isOpen={openSections.year} onToggle={() => toggleSection("year")}>
        <div className="flex gap-2">
          <select
            value={filters.yearFrom}
            onChange={(e) => setFilter("yearFrom", e.target.value)}
            className="flex-1 bg-white border border-gray-300 rounded-md text-sm text-gray-900 px-2 py-2 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
          >
            <option value="">From</option>
            {YEAR_OPTIONS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <select
            value={filters.yearTo}
            onChange={(e) => setFilter("yearTo", e.target.value)}
            className="flex-1 bg-white border border-gray-300 rounded-md text-sm text-gray-900 px-2 py-2 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
          >
            <option value="">To</option>
            {YEAR_OPTIONS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </FilterSection>

      <FilterSection title="Mileage" isOpen={openSections.mileage} onToggle={() => toggleSection("mileage")}>
        <div className="space-y-2">
          <input
            type="range" min={0} max={200000} step={5000}
            value={filters.maxMileage}
            onChange={(e) => setFilter("maxMileage", Number(e.target.value))}
            className="w-full accent-amber-500"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>0 km</span>
            <span className="text-gray-900 font-medium">Up to {filters.maxMileage.toLocaleString()} km</span>
            <span>200,000 km</span>
          </div>
        </div>
      </FilterSection>

      {/* Advanced Filters */}
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-4 mb-2">
        Advanced filters
      </p>

      <FilterSection title="Transmission" isOpen={openSections.transmission} onToggle={() => toggleSection("transmission")}>
        <CheckboxGroup
          options={["Automatic", "Manual", "CVT", "Semi-auto"]}
          selected={filters.transmission}
          onToggle={(v) => toggleArrayFilter("transmission", v)}
        />
      </FilterSection>

      <FilterSection title="Fuel type" isOpen={openSections.fuel} onToggle={() => toggleSection("fuel")}>
        <CheckboxGroup
          options={["Petrol", "Diesel", "Electric", "Hybrid", "CNG"]}
          selected={filters.fuelType}
          onToggle={(v) => toggleArrayFilter("fuelType", v)}
        />
      </FilterSection>

      <FilterSection title="Drive type" isOpen={openSections.drive} onToggle={() => toggleSection("drive")}>
        <CheckboxGroup
          options={["FWD", "RWD", "AWD", "4WD"]}
          selected={filters.driveType}
          onToggle={(v) => toggleArrayFilter("driveType", v)}
        />
      </FilterSection>

      <FilterSection title="Color" isOpen={openSections.color} onToggle={() => toggleSection("color")}>
        <ColorCheckList
          colors={COLORS}
          selected={filters.colors}
          onToggle={(v) => toggleArrayFilter("colors", v)}
        />
      </FilterSection>

      <FilterSection title="Engine type" isOpen={openSections.engine} onToggle={() => toggleSection("engine")}>
        <CheckboxGroup
          options={["Inline-4", "V6", "V8", "Rotary", "Electric motor"]}
          selected={filters.engineType}
          onToggle={(v) => toggleArrayFilter("engineType", v)}
        />
      </FilterSection>

      <FilterSection title="Vehicle condition" isOpen={openSections.condition} onToggle={() => toggleSection("condition")}>
        <CheckboxGroup
          options={["Excellent", "Good", "Fair", "Salvage"]}
          selected={filters.condition}
          onToggle={(v) => toggleArrayFilter("condition", v)}
        />
      </FilterSection>

      {/* Auction Filters */}
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-4 mb-2">
        Auction filters
      </p>

      <div className="space-y-2">
        {[
          { key: "live", label: "Live auctions", dot: "bg-green-500", badge: "bg-green-100 text-green-700", badgeText: "Live" },
          { key: "upcoming", label: "Upcoming", dot: "bg-amber-500", badge: "bg-amber-100 text-amber-700", badgeText: "Soon" },
          { key: "ended", label: "Ended", dot: "bg-gray-400", badge: "bg-gray-100 text-gray-500", badgeText: "Ended" },
        ].map(({ key, label, dot, badge, badgeText }) => {
          const active = filters.auctionStatus.includes(key);
          return (
            <div
              key={key}
              onClick={() => toggleArrayFilter("auctionStatus", key)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg border cursor-pointer transition-all ${
                active
                  ? "border-amber-500 bg-amber-50"
                  : "border-gray-200 bg-white hover:border-amber-300 hover:bg-amber-50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
                <span className="text-sm text-gray-700">{label}</span>
              </div>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${badge}`}>
                {badgeText}
              </span>
            </div>
          );
        })}
      </div>

      {/* Apply button */}
      <button
        onClick={() => onFiltersChange?.(filters)}
        className="w-full mt-6 py-2.5 bg-[#D97706] hover:bg-amber-500 text-white font-semibold text-sm rounded-lg transition-colors cursor-pointer"
      >
        Apply filters
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-amber-50 hover:border-amber-300 transition-colors"
        >
          <SlidersHorizontal size={15} className="text-amber-500" />
          Filters
          {activeCount > 0 && (
            <span className="text-xs bg-amber-100 text-amber-700 font-medium px-1.5 py-0.5 rounded-full">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-80 overflow-y-auto bg-white p-4 shadow-xl hide-scrollbar">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-900">Filters</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1 rounded hover:bg-gray-100 transition-colors"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:block w-[25%] shrink-0 sticky top-24 h-fit bg-gray-50 rounded-2xl p-2">
        {sidebarContent}
      </div>
    </>
  );
}

export default VehicleListFilter;
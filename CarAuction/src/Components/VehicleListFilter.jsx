
import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, SlidersHorizontal, X } from "lucide-react";

import { CATEGORIES } from './Data'
import { useListingFilters } from "../hook/useListingFilters";
import { useGetFilterOptions } from "../hook/useVehicle";
import { formatLabel } from "../utils/formatters";

// ---------- static options: value = DB enum, label = UI ----------
const TRANSMISSION = [
  { label: "Automatic", value: "automatic" },
  { label: "Manual", value: "manual" },
  { label: "CVT", value: "cvt" },
  { label: "Semi-auto", value: "semi_automatic" },
];

const FUEL = [
  { label: "Petrol", value: "petrol" },
  { label: "Diesel", value: "diesel" },
  { label: "Electric", value: "electric" },
  { label: "Hybrid", value: "hybrid" },
  { label: "Plug-in Hybrid", value: "plug_in_hybrid" },
  { label: "CNG", value: "cng" },
  { label: "LPG", value: "lpg" },
];

const DRIVETRAIN = [
  { label: "FWD", value: "fwd" },
  { label: "RWD", value: "rwd" },
  { label: "AWD", value: "awd" },
  { label: "4WD", value: "4wd" },
];

const CONDITION = [
  { label: "Excellent", value: "excellent" },
  { label: "Good", value: "good" },
  { label: "Fair", value: "fair" },
  { label: "Poor", value: "poor" },
];

const COLORS = [
  { label: "White", value: "white", hex: "#F1F5F9" },
  { label: "Black", value: "black", hex: "#1E293B" },
  { label: "Silver", value: "silver", hex: "#94A3B8" },
  { label: "Grey", value: "grey", hex: "#64748B" },
  { label: "Red", value: "red", hex: "#EF4444" },
  { label: "Blue", value: "blue", hex: "#3B82F6" },
  { label: "Green", value: "green", hex: "#10B981" },
  { label: "Brown", value: "brown", hex: "#92400E" },
  { label: "Gold", value: "gold", hex: "#CA8A04" },
  { label: "Beige", value: "beige", hex: "#D6C7A1" },
  { label: "Orange", value: "orange", hex: "#F97316" },
  { label: "Yellow", value: "yellow", hex: "#EAB308" },
  { label: "Purple", value: "purple", hex: "#8B5CF6" },
  { label: "Other", value: "other", hex: "#CBD5E1" },
];

// 3 status buttons of UI -> backend auctionStatus values
const STATUS_GROUPS = {
  live: ["live"],
  upcoming: ["upcoming"],
  ended: ["sold", "unsold", "reserve-not-met"],
};

const AUCTION_UI = [
  { key: "live", label: "Live auctions", dot: "bg-green-500", badge: "bg-green-100 text-green-700", badgeText: "Live" },
  { key: "upcoming", label: "Upcoming", dot: "bg-amber-500", badge: "bg-amber-100 text-amber-700", badgeText: "Soon" },
  { key: "ended", label: "Ended", dot: "bg-gray-400", badge: "bg-gray-100 text-gray-500", badgeText: "Ended" },
];

const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = 1980;
const YEAR_OPTIONS = Array.from({ length: CURRENT_YEAR - MIN_YEAR + 1 }, (_, i) => CURRENT_YEAR - i);
const MAX_MILEAGE = 200000;

// URL parameter keys included in the active filter count
const FILTER_KEYS = [
  "category", "status", "make", "model", "yearMin", "yearMax", "mileageMax",
  "transmission", "fuelType", "drivetrain", "exteriorColor", "condition",
];

const csv = (v) => (v ? v.split(",") : []);

// ---------- small UI pieces ----------
function Checkbox({ checked }) {
  return (
    <div
      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors 
        ${checked ? "bg-amber-500 border-amber-500" : "border-gray-300 bg-white"}`}
    >
      {checked && (
        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
          <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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

// Reusable list component: items = [{ label, value, hex? }], selected = [value]
function CheckList({ items, selected, onToggle, showSearch = false, limit = Infinity, emptyText = "No options" }) {

  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);

  if (!items.length) return <p className="text-xs text-gray-400 px-1">{emptyText}</p>;

  const filtered = items.filter((i) => i.label.toLowerCase().includes(search.toLowerCase()));
  const visible = showAll ? filtered : filtered.slice(0, limit);

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
        {visible.map((item) => (
          <div
            key={item.value}
            onClick={() => onToggle(item.value)}
            className="flex items-center gap-2.5 py-1.5 px-1 rounded cursor-pointer hover:bg-amber-50 transition-colors"
          >
            <Checkbox checked={selected.includes(item.value)} />
            {item.hex && (
              <div style={{ backgroundColor: item.hex }} className="w-4 h-4 rounded-full border border-gray-300 shrink-0" />
            )}
            <span className="text-sm text-gray-700">{formatLabel(item.label)}</span>
          </div>
        ))}
      </div>

      {filtered.length > limit && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-1.5 flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 font-medium transition-colors"
        >
          {showAll ? (
            <><ChevronUp size={13} /> Show less</>
          ) : (
            <><ChevronDown size={13} /> Show all {filtered.length}</>
          )}
        </button>
      )}
    </div>
  );
}

// ---------- main ----------
function VehicleListFilter() {

  const { params, setFilter, setFilters, clearAll } = useListingFilters();
  const { data: options } = useGetFilterOptions();

  const [openSections, setOpenSections] = useState({
    category: true, make: true, model: true, year: true, mileage: true,
    transmission: false, fuel: false, drive: false, color: false, condition: false, auction: true,
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  // mileage slider: drag ke dauran local state, chhodne pe URL update (har tick pe API call nahi)
  const [mileage, setMileage] = useState(Number(params.mileageMax) || MAX_MILEAGE);
  useEffect(() => {
    setMileage(Number(params.mileageMax) || MAX_MILEAGE);
  }, [params.mileageMax]);

  const commitMileage = () => setFilter("mileageMax", mileage < MAX_MILEAGE ? mileage : null);

  const toggleSection = (key) => setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  // ---- selected values (URL se) ----
  const selected = {
    category: csv(params.category),
    make: csv(params.make),
    model: csv(params.model),
    transmission: csv(params.transmission),
    fuelType: csv(params.fuelType),
    drivetrain: csv(params.drivetrain),
    exteriorColor: csv(params.exteriorColor),
    condition: csv(params.condition),
    status: csv(params.status),
  };

  // generic toggle (category, transmission, fuel, ...)
  const toggle = (key, value) => {
    const current = selected[key];
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    setFilters({ [key]: next });
  };

  // ---- make / model (DB se) ----
  const makeOptions = options?.makes || [];
  const makeItems = makeOptions.map((m) => ({ label: m.make, value: m.make }));

  const modelItems = [...new Set(
    makeOptions.filter((m) => selected.make.includes(m.make)).flatMap((m) => m.models)
  )].sort().map((m) => ({ label: m, value: m }));

  // make hatane par uske models bhi hatao, warna URL mein stale model reh jata hai
  const toggleMake = (value) => {
    const nextMakes = selected.make.includes(value)
      ? selected.make.filter((v) => v !== value)
      : [...selected.make, value];

    const allowedModels = makeOptions
      .filter((m) => nextMakes.includes(m.make))
      .flatMap((m) => m.models);

    setFilters({
      make: nextMakes,
      model: selected.model.filter((m) => allowedModels.includes(m)),
    });
  };

  // ---- auction status (UI group -> backend statuses) ----
  const isStatusActive = (key) => STATUS_GROUPS[key].every((s) => selected.status.includes(s));

  const toggleStatus = (key) => {
    const group = STATUS_GROUPS[key];
    const next = isStatusActive(key)
      ? selected.status.filter((s) => !group.includes(s))
      : [...new Set([...selected.status, ...group])];
    setFilters({ status: next });
  };

  const activeCount = FILTER_KEYS.filter((k) => params[k]).length;

  const selectClass =
    "flex-1 bg-white border border-gray-300 rounded-md text-sm text-gray-900 px-2 py-2 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors";

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
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Basic filters</p>

      {/* ============= category ============= */}
      <FilterSection title="Category" isOpen={openSections.category} onToggle={() => toggleSection("category")}>
        <CheckList items={CATEGORIES} selected={selected.category} onToggle={(v) => toggle("category", v)} limit={6} />
      </FilterSection>

      {/* ============= make ============= */}
      <FilterSection title="Make" isOpen={openSections.make} onToggle={() => toggleSection("make")}>
        <CheckList items={makeItems} selected={selected.make} onToggle={toggleMake} showSearch limit={5} emptyText="No makes available" />
      </FilterSection>

      {/* ============= model ============= */}
      <FilterSection title="Model" isOpen={openSections.model} onToggle={() => toggleSection("model")}>
        <CheckList
          items={modelItems}
          selected={selected.model}
          onToggle={(v) => toggle("model", v)}
          showSearch
          limit={5}
          emptyText="Select a make first"
        />
      </FilterSection>

      {/* ============= year ============= */}
      <FilterSection title="Year" isOpen={openSections.year} onToggle={() => toggleSection("year")}>
        <div className="flex gap-2">
          <select
            value={params.yearMin || ""}
            onChange={(e) => setFilter("yearMin", e.target.value)}
            className={selectClass}
          >
            <option value="">From</option>

            {YEAR_OPTIONS.map((y) => (
              <option
                key={y}
                value={y}
                disabled={params.yearMax && y > Number(params.yearMax)}
              >
                {y}
              </option>
            ))}
          </select>

          <select
            value={params.yearMax || ""}
            onChange={(e) => setFilter("yearMax", e.target.value)}
            className={selectClass}
          >
            <option value="">To</option>

            {YEAR_OPTIONS.map((y) => (
              <option
                key={y}
                value={y}
                disabled={params.yearMin && y < Number(params.yearMin)}
              >
                {y}
              </option>
            ))}
          </select>
        </div>
      </FilterSection>

      {/* ============= mileage ============= */}
      <FilterSection title="Mileage" isOpen={openSections.mileage} onToggle={() => toggleSection("mileage")}>
        <div className="space-y-2">
          <input
            type="range" min={0} max={MAX_MILEAGE} step={5000}
            value={mileage}
            onChange={(e) => setMileage(Number(e.target.value))}
            onMouseUp={commitMileage}
            onTouchEnd={commitMileage}
            onKeyUp={commitMileage}
            className="w-full accent-amber-500"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>0 km</span>
            <span className="text-gray-900 font-medium">Up to {mileage.toLocaleString()} km</span>
            <span>200,000 km</span>
          </div>
        </div>
      </FilterSection>

      {/* Advanced Filters */}
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-4 mb-2">
        Advanced filters
      </p>

      {/* ============= transmission ============= */}
      <FilterSection title="Transmission" isOpen={openSections.transmission} onToggle={() => toggleSection("transmission")}>
        <CheckList items={TRANSMISSION} selected={selected.transmission} onToggle={(v) => toggle("transmission", v)} />
      </FilterSection>

      {/* ============= fuel type ============= */}
      <FilterSection title="Fuel type" isOpen={openSections.fuel} onToggle={() => toggleSection("fuel")}>
        <CheckList items={FUEL} selected={selected.fuelType} onToggle={(v) => toggle("fuelType", v)} />
      </FilterSection>

      {/* ============= drive type ============= */}
      <FilterSection title="Drive type" isOpen={openSections.drive} onToggle={() => toggleSection("drive")}>
        <CheckList items={DRIVETRAIN} selected={selected.drivetrain} onToggle={(v) => toggle("drivetrain", v)} />
      </FilterSection>

      {/* ============= color ============= */}
      <FilterSection title="Color" isOpen={openSections.color} onToggle={() => toggleSection("color")}>
        <CheckList items={COLORS} selected={selected.exteriorColor} onToggle={(v) => toggle("exteriorColor", v)} />
      </FilterSection>

      {/* ============= condition ============= */}
      <FilterSection title="Vehicle condition" isOpen={openSections.condition} onToggle={() => toggleSection("condition")}>
        <CheckList items={CONDITION} selected={selected.condition} onToggle={(v) => toggle("condition", v)} />
      </FilterSection>

      {/* Auction Filters */}
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-4 mb-2">
        Auction filters
      </p>

      <div className="space-y-2">
        {AUCTION_UI.map(({ key, label, dot, badge, badgeText }) => {
          const active = isStatusActive(key);
          return (
            <div
              key={key}
              onClick={() => toggleStatus(key)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg border cursor-pointer transition-all ${active
                ? "border-amber-500 bg-amber-50"
                : "border-gray-200 bg-white hover:border-amber-300 hover:bg-amber-50"
                }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
                <span className="text-sm text-gray-700">{label}</span>
              </div>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${badge}`}>{badgeText}</span>
            </div>
          );
        })}
      </div>
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
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-80 overflow-y-auto bg-white p-4 shadow-xl hide-scrollbar">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-900">Filters</span>
              <button onClick={() => setMobileOpen(false)} className="p-1 rounded hover:bg-gray-100 transition-colors">
                <X size={18} className="text-gray-500" />
              </button>
            </div>
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:block shrink-0 bg-gray-50 rounded-2xl">{sidebarContent}</div>
    </>
  );
}

export default VehicleListFilter;
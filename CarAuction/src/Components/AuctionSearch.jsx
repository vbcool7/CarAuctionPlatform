
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { IoSearch } from 'react-icons/io5';
import { X } from 'lucide-react';
import { CATEGORIES } from './Data';
import { formatLabel } from '../utils/formatters';

import { useGetFilterOptions, useGetPublicStats } from '../hook/useVehicle';

const TABS = [
  { label: 'Search Cars', statuses: [] },
  { label: 'Live Auctions', statuses: ['live'] },
  { label: 'Upcoming Auctions', statuses: ['upcoming'] },
  { label: 'Ended Auctions', statuses: ['sold', 'unsold', 'reserve-not-met'] },
];

const MIN_YEAR = 1980;
const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: CURRENT_YEAR - MIN_YEAR + 1 }, (_, i) => String(CURRENT_YEAR - i));

const EMPTY_FORM = { make: '', model: '', yearMin: '', yearMax: '', category: '' };

// Reusable Custom Dropdown Component
const CustomDropdown = ({
  label,
  placeholder,
  options,
  value,
  onSelect,
  openDropdown,
  setOpenDropdown,
  disabled = false,
}) => {

  const isOpen = openDropdown === label;
  const selectedLabel = options.find((o) => o.value === value)?.label;

  return (
    <div className="relative">
      <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>

      <div
        onClick={() => !disabled && setOpenDropdown(isOpen ? null : label)}
        className={`w-full flex items-center justify-between p-2.5 bg-gray-50 border border-gray-200 rounded-lg transition-all text-sm
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-[#D97706]'}`}
      >
        <span className={selectedLabel ? 'text-gray-900' : 'text-gray-400'}>
          {formatLabel(selectedLabel || placeholder)}
        </span>
        {isOpen ? <IoIosArrowUp className="text-gray-400" /> : <IoIosArrowDown className="text-gray-400" />}
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-100 rounded-lg shadow-xl max-h-40 overflow-y-auto">
          {/* "All" = reset this field */}
          <div
            onClick={() => {
              onSelect('');
              setOpenDropdown(null);
            }}
            className="px-4 py-2 hover:bg-orange-50 hover:text-[#D97706] cursor-pointer text-sm text-gray-400">
            {placeholder}
          </div>

          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                if (opt.disabled) return;
                onSelect(opt.value);
                setOpenDropdown(null);
              }}
              className={`px-4 py-2 text-sm 
                ${opt.disabled
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'hover:bg-orange-50 hover:text-[#D97706] cursor-pointer'
                }`}
            >
              {formatLabel(opt.label)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

function AuctionSearch() {

  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { data: filterOptions } = useGetFilterOptions();
  const { data } = useGetPublicStats();

  const stats = data?.stats || {
    live: 0,
    upcoming: 0,
    ended: 0,
    total: 0,
  };

  const [openDropdown, setOpenDropdown] = useState(null);
  const [activeTab, setActiveTab] = useState(TABS[0].label);
  const [form, setForm] = useState(EMPTY_FORM);

  // outside click - drop-down close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // ---- options ----
  const makes = filterOptions?.makes || [];
  const makeOptions = makes.map((m) => ({ label: m.make, value: m.make }));
  const modelOptions = (makes.find((m) => m.make === form.make)?.models || [])
    .slice()
    .sort()
    .map((m) => ({ label: m, value: m }));

  const yearFromOptions = YEAR_OPTIONS.map((y) => ({ label: y, value: y }));

  // disabled prev years in "To" when "From" selected
  const yearToOptions = YEAR_OPTIONS.map((y) => ({
    label: y,
    value: y,
    disabled: !!form.yearMin && Number(y) < Number(form.yearMin),
  }));

  // ---- handlers ----
  const onMakeChange = (make) => setForm((f) => ({ ...f, make, model: '' }));
  const onYearMinChange = (yearMin) =>
    setForm((f) => ({
      ...f,
      yearMin,
      yearMax: f.yearMax && Number(f.yearMax) < Number(yearMin) ? '' : f.yearMax,
    }));

  const hasFilters = Object.values(form).some(Boolean);

  const clearFilters = () => {
    setForm(EMPTY_FORM);
    setOpenDropdown(null);
  };

  const handleSearch = () => {
    const statuses = TABS.find((t) => t.label === activeTab)?.statuses || [];
    const p = new URLSearchParams();

    if (statuses.length) p.set('status', statuses.join(','));
    if (form.make) p.set('make', form.make);
    if (form.model) p.set('model', form.model);
    if (form.yearMin) p.set('yearMin', form.yearMin);
    if (form.yearMax) p.set('yearMax', form.yearMax);
    if (form.category) p.set('category', form.category);
    navigate(`/vehicle-list?${p.toString()}`);
  };

  return (
    <div ref={dropdownRef} className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-6">
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">

        {/* Tabs */}
        <div className="flex gap-8 border-b border-gray-200 mb-6 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className={`pb-4 text-sm font-medium transition-colors whitespace-nowrap 
              ${activeTab === tab.label ? 'text-[#D97706] border-b-2 border-[#D97706]' : 'text-gray-500 hover:text-[#D97706]'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
          <div className="lg:col-span-5 grid grid-cols-2 lg:grid-cols-5 gap-4">

            {/* =========== make =========== */}
            <CustomDropdown
              label="Make"
              placeholder="All Makes"
              options={makeOptions}
              value={form.make}
              onSelect={onMakeChange}
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
            />

            {/* =========== model =========== */}
            <CustomDropdown
              label="Model"
              placeholder={form.make ? 'All Models' : 'Select make first'}
              options={modelOptions}
              value={form.model}
              onSelect={(model) => setForm((f) => ({ ...f, model }))}
              disabled={!form.make}
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
            />

            {/* =========== year =========== */}
            <CustomDropdown
              label="Year From"
              placeholder="Any"
              options={yearFromOptions}
              value={form.yearMin}
              onSelect={onYearMinChange}
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
            />

            <CustomDropdown
              label="Year To"
              placeholder="Any"
              options={yearToOptions}
              value={form.yearMax}
              onSelect={(yearMax) => setForm((f) => ({ ...f, yearMax }))}
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
            />

            {/* =========== category =========== */}
            <CustomDropdown
              label="Vehicle Type"
              placeholder="All Types"
              options={CATEGORIES.map((c) => ({ label: c.label, value: c.value }))}
              value={form.category}
              onSelect={(category) => setForm((f) => ({ ...f, category }))}
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
            />
          </div>

          <button
            onClick={handleSearch}
            className="bg-[#D97706] text-white py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-[#B45309] hover:scale-[1.02] active:scale-95 transition-all duration-200 shadow-md cursor-pointer">
            <IoSearch /> Search
          </button>
        </div>

        {/* Footer Stats + Clear */}
        <div className="mt-6 flex flex-wrap gap-4 text-xs text-gray-500 items-center">
          {stats && (
            <>
              {stats.live > 0 && (
                <>
                  <span className="flex items-center gap-1 text-[#D97706] font-medium">
                    🔥 {stats.live.toLocaleString()} Live {stats.live === 1 ? 'Auction' : 'Auctions'}
                  </span>
                  <span>•</span>
                </>
              )}
              <span>{stats.upcoming.toLocaleString()} Upcoming</span>
              <span>•</span>
              <span>{stats.total.toLocaleString()} Vehicles Listed</span>
            </>
          )}

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="ml-auto flex items-center gap-1 text-red-500 hover:text-red-600 font-medium transition-colors"
            >
              <X size={12} /> Clear filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuctionSearch;
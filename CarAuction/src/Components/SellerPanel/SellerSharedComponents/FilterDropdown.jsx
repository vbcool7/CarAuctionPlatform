
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Filter } from "lucide-react";

function FilterDropdown({ label, options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = options.find(o => o.value === value)?.label || label;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm text-slate-700 hover:bg-slate-50 transition-all w-full min-w-0 sm:min-w-32 justify-between"
      >
        <div className="flex items-center gap-2">
          {/* <Filter size={14} className="text-slate-400" /> */}
          <span className="truncate">{selectedLabel}</span>
        </div>
        <ChevronDown size={14} className={`text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1 max-h-60 overflow-y-auto">
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`px-4 py-2 text-sm cursor-pointer hover:bg-amber-50 hover:text-amber-700 
                ${value === opt.value ? "bg-amber-50 text-amber-700 font-medium" : "text-slate-600"}`}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FilterDropdown;
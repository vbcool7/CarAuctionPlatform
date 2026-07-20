
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const PERMISSIONS = [
  "Dashboard Access", "User Management", "Vehicle Approvals",
  "Auction Management", "Bid Management", "Payment Management", "Reports & Analytics"
];

function PermissionSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState([]);

  const togglePermission = (perm) => {
    setSelected(prev =>
      prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
    );
  };

  const toggleAll = () => {
    setSelected(selected.length === PERMISSIONS.length ? [] : PERMISSIONS);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <div className="flex flex-col gap-1.5">
        <h3 className="text-base font-bold text-slate-800 mb-4">
          Permissions <span className='text-red-500'>*</span>
        </h3>

        <div className="relative">
          {/* Dropdown Header */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex justify-between items-center px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-amber-50 focus:border-[#D97706] transition-all"
          >
            <span className="text-slate-500 truncate">
              {selected.length > 0 ? `${selected.length} selected` : "Select permissions"}
            </span>
            <ChevronDown size={16} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Dropdown Body */}
          {isOpen && (
            <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-200 rounded-lg shadow-xl z-10 overflow-hidden">
              <div className="p-2 space-y-1">
                {PERMISSIONS.map(perm => (
                  <label key={perm} className="flex items-center gap-3 px-2 py-1.5 hover:bg-slate-50 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selected.includes(perm)}
                      onChange={() => togglePermission(perm)}
                      className="rounded border-slate-300 text-[#D97706] focus:ring-[#D97706]"
                    />
                    <span className="text-sm text-slate-700">{perm}</span>
                  </label>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t border-slate-100 p-3 bg-slate-50 text-right">
                <button onClick={toggleAll} className="text-xs font-semibold text-[#D97706] hover:underline">
                  {selected.length === PERMISSIONS.length ? "Deselect All" : "Select All"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PermissionSelector;
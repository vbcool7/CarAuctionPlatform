
import React from 'react';

const AccountStatus = ({ label = "Account Status", selected, onChange, options, required=true }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <h3 className="font-bold text-slate-800 mb-4">
        {label} {required && <span className='text-red-500'>*</span>}
      </h3>
      <div className="space-y-4">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="accountStatus"
              value={option.value}
              checked={selected === option.value}
              onChange={() => onChange(option.value)}
              className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500"
            />
            <div className="flex items-center gap-3">
              <span className="font-medium text-slate-700 text-sm">{option.label}</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${option.colorClass}`}>
                {option.description}
              </span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default AccountStatus;
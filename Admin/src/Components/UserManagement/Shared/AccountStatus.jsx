
import React from 'react';

const AccountStatus = ({
  label = "Account Status",
  selected,
  onChange,
  options,
  required = true,
}) => {
  return (
    <div className="bg-white p-4 lg:p-6 rounded-2xl border border-slate-200 shadow-sm">
      {/* Heading */}
      <h3 className="text-base font-bold text-slate-800 mb-5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </h3>

      {/* Options */}
      <div className="space-y-4">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-start gap-3 cursor-pointer"
          >
            {/* Radio */}
            <input
              type="radio"
              name="accountStatus"
              value={option.value}
              checked={selected === option.value}
              onChange={() => onChange(option.value)}
              className="mt-1 h-4 w-4 shrink-0 accent-amber-600"
            />

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col gap-2">
                {/* Status */}
                <span className="text-sm sm:text-base font-medium text-slate-700 wrap-break-word">
                  {option.label}
                </span>

                {/* Description Badge */}
                <span
                  className={`inline-block w-fit max-w-full px-2.5 py-1 rounded-md text-xs font-medium whitespace-normal wrap-break-word
                     ${option.colorClass}`}
                >
                  {option.description}
                </span>
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default AccountStatus;

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

function InputField({ label, name, value, onChange, type = 'text', options = [], disabled = false, required = false }) {

    const [showPassword, setShowPassword] = useState(false);

    // Determine if we should show the toggle icon
    const isPasswordField = type === 'password';
    const inputType = isPasswordField ? (showPassword ? 'text' : 'password') : type;

    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-slate-500 uppercase tracking-wide">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {type === 'select' ? (
                <select
                    value={value}
                    onChange={(e) => onChange(name, e.target.value)}
                    disabled={disabled}
                    className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-50 focus:border-[#D97706] transition-all text-[#0B1E3D] bg-white disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
                >
                    {options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
            ) : type === 'textarea' ? (
                <textarea
                    value={value}
                    onChange={(e) => onChange(name, e.target.value)}
                    disabled={disabled}
                    placeholder={`Enter ${label}`}
                    rows={4}
                    className="w-full px-4 py-2.5 text-sm text-[#0B1E3D] placeholder:text-slate-400 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-50 focus:border-[#D97706] transition-all disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed resize-y"
                />
            ) : (
                <div className="relative">
                    <input
                        type={inputType}
                        value={value}
                        onChange={(e) => onChange(name, e.target.value)}
                        disabled={disabled}
                        placeholder={`Enter ${label}`}
                        className="w-full px-4 py-2.5 text-sm text-[#0B1E3D] placeholder:text-slate-400 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-50 focus:border-[#D97706] transition-all disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
                    />
                    {isPasswordField && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}

export default InputField;

import { ChevronDown, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const FormInputFields = ({ label, name, value, onChange, type = "text", placeholder, required = false, disabled = false, options = [], rows = 4, className = "" }) => {
    const [showPassword, setShowPassword] = useState(false);

    const inputType = type === "password" ? (showPassword ? "text" : "password") : type;

    const inputClasses = `
        py-2.5 w-full rounded-lg border border-slate-300
        px-4 text-sm text-[#0B1E3D]
        placeholder:text-slate-400
        outline-none transition-all
        focus:border-[#D97706]
        focus:ring-2 focus:ring-[#D97706]/15
        disabled:bg-slate-100 disabled:cursor-not-allowed
        ${className}
    `;

    const selectClasses = `
        py-2.5 w-full rounded-lg border border-slate-300
        px-4 pr-10 text-sm
        truncate
        ${!value ? "text-slate-400" : "text-[#0B1E3D]"}
        appearance-none bg-white
        outline-none transition-all
        focus:border-[#D97706]
        focus:ring-2 focus:ring-[#D97706]/15
        disabled:bg-slate-100 disabled:cursor-not-allowed
        ${className}
    `;

    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-[13px] font-medium text-[#0B1E3D]">
                    {label}
                    {required && <span className="ml-1 text-red-500">*</span>}
                </label>
            )}

            {type === "textarea" ? (
                <textarea
                    name={name}
                    value={value}
                    rows={rows}
                    disabled={disabled}
                    placeholder={placeholder || `Enter ${label}`}
                    onChange={onChange}
                    className={`${inputClasses} h-auto py-3 resize-none`}
                />
            ) : type === "select" ? (
                <div className="relative">
                    <select
                        name={name}
                        value={value}
                        disabled={disabled}
                        onChange={onChange}
                        className={selectClasses}
                    >
                        <option value="" disabled hidden>
                            {placeholder || `Select ${label}`}
                        </option>
                        {options.map((item) => (
                            <option
                                key={item.value || item}
                                value={item.value || item}
                                className="text-[#0B1E3D]"
                            >
                                {item.label || item}
                            </option>
                        ))}
                    </select>
                    <ChevronDown
                        size={18}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                </div>
            ) : (
                <div className="relative">
                    <input
                        type={inputType}
                        name={name}
                        value={value}
                        disabled={disabled}
                        placeholder={placeholder || `Enter ${label}`}
                        onChange={onChange}
                        className={`${inputClasses} ${type === "password" ? "pr-11" : ""}`}
                    />
                    {type === "password" && (
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
    );
};

export default FormInputFields;
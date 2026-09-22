
import { useState } from "react";
import { useRef } from 'react';
import { CheckCircle2, ChevronDown, Eye, EyeOff, FileText, Upload } from "lucide-react";

const FormInputFields = ({ label, name, value, onChange, type = "text", placeholder, required = false, disabled = false, options = [], rows = 4, className = "", prefix = "", maxLength, onBlur }) => {

    const fileInputRef = useRef(null);
    const [showPassword, setShowPassword] = useState(false);
    const inputType = type === "password" ? (showPassword ? "text" : "password") : type;

    // File change
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        // 5MB validation
        if (file.size > 5 * 1024 * 1024) {
            alert("File size exceeds 5MB limit");
            e.target.value = "";
            return;
        }

        onChange(name, file);
    };

    const inputClasses = `
        py-2.5 w-full rounded-lg border border-slate-300
        px-4 text-sm text-[#0B1E3D]
        placeholder:text-slate-400
        outline-none transition-all
        focus:border-[#D97706]
        focus:ring-2 focus:ring-[#D97706]/15 
        disabled:bg-slate-100 disabled:cursor-not-allowed
        ${prefix ? "pl-8" : ""}
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
            ) : type === "file" ? (
                <div className="flex items-center justify-between p-3.5 border border-slate-200 rounded-lg bg-white">

                    <div className="flex items-center gap-3 min-w-0">
                        <div
                            className={`p-2 rounded-lg shrink-0 ${value
                                    ? "bg-green-50 text-green-600"
                                    : "bg-amber-50 text-[#D97706]"
                                }`}
                        >
                            {value ? (
                                <CheckCircle2 size={18} />
                            ) : (
                                <FileText size={18} />
                            )}
                        </div>

                        <div className="min-w-0">
                            <p
                                className={`text-sm truncate ${value
                                        ? "text-green-600 font-medium"
                                        : "text-slate-400"
                                    }`}
                            >
                                {value
                                    ? value.name
                                    : placeholder ||
                                    "PDF, JPG or PNG. Max size 10MB."}
                            </p>
                        </div>
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileChange}
                        disabled={disabled}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                    />

                    <button
                        type="button"
                        disabled={disabled}
                        onClick={() =>
                            fileInputRef.current?.click()
                        }
                        className="p-2 text-[#D97706] hover:bg-slate-50 rounded-full transition-colors cursor-pointer disabled:text-slate-300 disabled:cursor-not-allowed shrink-0"
                    >
                        <Upload size={20} />
                    </button>
                </div>

                /* ================= NORMAL INPUT + PASSOWRD ================= */
            ) : (
                <div className="relative">
                    {prefix && (
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-500 pointer-events-none">
                            {prefix}
                        </span>
                    )}
                    <input
                        type={inputType}
                        name={name}
                        value={value}
                        onBlur={onBlur}
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
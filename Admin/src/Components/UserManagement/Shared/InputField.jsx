
import React, { useState } from 'react';
import { Eye, EyeOff, ChevronDown, Upload, FileText, CheckCircle2 } from "lucide-react";
import { useRef } from 'react';

function InputField({
    label,
    name,
    value,
    onChange,
    placeholder,
    type = "text",
    options = [],
    disabled = false,
    required = false,
}) {
    const [showPassword, setShowPassword] = useState(false);
    const fileInputRef = useRef(null);

    const isPasswordField = type === "password";
    const inputType = isPasswordField
        ? (showPassword ? "text" : "password")
        : type;

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

    return (
        <div className="flex flex-col gap-1.5">

            {/* Label */}
            <label className="text-[12px] font-semibold text-slate-500 uppercase tracking-wide">
                {label}

                {required && (
                    <span className="text-red-500 ml-1">*</span>
                )}
            </label>

            {/* ================= SELECT ================= */}
            {type === "select" ? (
                <div className="relative">
                    <select
                        name={name}
                        value={value}
                        disabled={disabled}
                        onChange={(e) => onChange(name, e.target.value)}
                        className={`appearance-none w-full px-4 py-2.5 pr-10 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-50 focus:border-[#D97706] transition-all disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed ${
                            value
                                ? "text-[#0B1E3D]"
                                : "text-slate-400"
                        }`}
                    >
                        <option value="" disabled>
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

            /* ================= TEXTAREA ================= */
            ) : type === "textarea" ? (
                <textarea
                    name={name}
                    value={value}
                    onChange={(e) => onChange(name, e.target.value)}
                    disabled={disabled}
                    placeholder={placeholder || `Enter ${label}`}
                    rows={4}
                    className="w-full px-4 py-2.5 text-sm text-[#0B1E3D] placeholder:text-slate-400 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-50 focus:border-[#D97706] transition-all disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed resize-y"
                />

            /* ================= FILE ================= */
            ) : type === "file" ? (
                <div className="flex items-center justify-between p-3.5 border border-slate-200 rounded-lg bg-white">

                    <div className="flex items-center gap-3 min-w-0">
                        <div
                            className={`p-2 rounded-lg shrink-0 ${
                                value
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
                                className={`text-sm truncate ${
                                    value
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

            /* ================= NORMAL INPUT ================= */
            ) : (
                <div className="relative">
                    <input
                        type={inputType}
                        name={name}
                        value={value || ""}
                        onChange={(e) =>
                            onChange(name, e.target.value)
                        }
                        disabled={disabled}
                        placeholder={
                            placeholder || `Enter ${label}`
                        }
                        className="w-full px-4 py-2.5 text-sm text-[#0B1E3D] placeholder:text-slate-400 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-50 focus:border-[#D97706] transition-all disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed truncate"
                    />

                    {isPasswordField && (
                        <button
                            type="button"
                            onClick={() =>
                                setShowPassword(!showPassword)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            {showPassword ? (
                                <EyeOff size={18} />
                            ) : (
                                <Eye size={18} />
                            )}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default InputField;
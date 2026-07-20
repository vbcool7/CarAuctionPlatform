
import { useState, useRef, useEffect } from 'react';
import { X, ChevronUp, ChevronDown } from 'lucide-react';

function CustomDropdown({ label, options, selected, onChange, multi = false, placeholder = "Select an option", requiredField = false }) {

    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const isSelected = (opt) => multi ? selected.includes(opt) : selected === opt;

    const toggle = (opt) => {
        if (multi) {
            onChange(isSelected(opt) ? selected.filter((s) => s !== opt) : [...selected, opt]);
        } else {
            onChange(opt);
            setOpen(false);
        }
    };

    const remove = (opt, e) => {
        e.stopPropagation();
        onChange(selected.filter((s) => s !== opt));
    };

    return (
        <div className="flex flex-col gap-1.5 relative" ref={ref}>
            {label && (
                <label className="text-[12px] font-semibold text-slate-500 uppercase tracking-wide">
                    {label}
                    {requiredField && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            {/* Trigger */}
            <div
                onClick={() => setOpen((o) => !o)}
                className="w-full min-h-10.5 px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white cursor-pointer flex flex-wrap gap-1.5 items-center hover:border-[#D97706] transition-colors"
            >
                {/* Multi — show tags */}
                {multi && selected.length === 0 && (
                    <span className="text-slate-400 text-sm">{placeholder}</span>
                )}
                {multi && selected.map((opt) => (
                    <span
                        key={opt}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 border border-amber-200 rounded-md text-[12px] font-semibold text-[#0B1E3D]"
                    >
                        {opt}
                        <button
                            onClick={(e) => remove(opt, e)}
                            className="text-amber-400 hover:text-red-500 transition-colors ml-0.5"
                        >
                            <X size={10} strokeWidth={3} />
                        </button>
                    </span>
                ))}

                {/* Single — show value */}
                {!multi && (
                    <span className={`flex-1 ${selected ? 'text-[#0B1E3D]' : 'text-slate-400'}`}>
                        {selected || placeholder}
                    </span>
                )}

                {/* Chevron */}
                <span className="ml-auto text-slate-400">
                    {open ? (
                        <ChevronUp size={14} strokeWidth={2} />
                    ) : (
                        <ChevronDown size={14} strokeWidth={2} />
                    )}
                </span>
            </div>

            {/* Options list */}
            {open && (
                <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-52 overflow-y-auto">
                    {options.map((opt) => (
                        <div
                            key={opt}
                            onClick={() => toggle(opt)}
                            className={`flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer transition-colors
                            ${isSelected(opt) ? 'bg-amber-50 text-[#0B1E3D] font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            <span>{opt}</span>
                            {isSelected(opt) && (
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomDropdown;
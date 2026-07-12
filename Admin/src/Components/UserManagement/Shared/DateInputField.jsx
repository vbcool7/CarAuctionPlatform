
import React, { forwardRef, useState } from "react";
import DatePicker from "react-datepicker";
import { Calendar } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";

// dob
//   const yesterday = new Date();
//   yesterday.setDate(yesterday.getDate() - 1);

const DateInputField = ({ label, selected, onChange, placeholder = "Select date", required = false }) => {

    const [isOpen, setIsOpen] = useState(false);

    const CustomInput = forwardRef(({ value, onClick }, ref) => (
        <div className="relative w-full"
            onClick={() => setIsOpen(!isOpen)} ref={ref}
            ref={ref}
        >
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Calendar size={18} />
            </div>
            <input
                type="text"
                readOnly
                value={value}
                placeholder={placeholder}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-50 focus:border-[#D97706] transition-all text-[#0B1E3D] cursor-pointer"
            />
        </div>
    ));

    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-slate-500 uppercase tracking-wide">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <DatePicker
                selected={selected}
                onChange={(date) => {
                    onChange(date);
                    setIsOpen(false); 
                }}
                open={isOpen} 
                onClickOutside={() => setIsOpen(false)}
                customInput={<CustomInput placeholder={placeholder} />}
                dateFormat="yyyy/MM/dd"
            />
        </div>
    );
};

export default DateInputField;
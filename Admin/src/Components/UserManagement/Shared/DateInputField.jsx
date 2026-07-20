
import React, { forwardRef, useState } from "react";
import DatePicker from "react-datepicker";
import { Calendar } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";

const DateInputField = ({ label, selected, onChange, placeholder = "Select date", required = false, variant }) => {

    const [isOpen, setIsOpen] = useState(false);

    const pickerProps = {};

    switch (variant) {
        case "dob":
            pickerProps.maxDate = new Date();
            pickerProps.scrollableYearDropdown = true;
            pickerProps.yearDropdownItemNumber = 100;
            break;

        case "future":
            pickerProps.minDate = new Date();
            break;

        default:
            break;
    }
    
    const CustomInput = forwardRef(({ value, onClick }, ref) => (
        <div
            className="relative w-full"
            onClick={() => setIsOpen(!isOpen)}
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
                className="w-full h-11 pl-10 pr-4 text-sm text-[#0B1E3D] placeholder:text-slate-400 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-50 focus:border-[#D97706] transition-all cursor-pointer"
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
                dateFormat="dd/MM/yyyy"
                showMonthDropdown={variant === "dob"}
                showYearDropdown={variant === "dob"}
                dropdownMode="select"
                {...pickerProps}
            />
        </div>
    );
};

export default DateInputField;
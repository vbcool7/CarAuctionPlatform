
import React, { useEffect, useRef, useState } from 'react';
import { Filter } from 'lucide-react';

const options = ['Payments', 'Payments'];

function BuyerPaymentsTabs({ activeTab, setActiveTab }) {

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const tabs = [
        { name: 'All Payments', label: 'All Payments', },
        { name: 'Payment Pending', label: 'Payment Pending', },
        { name: 'Payment Completed', label: 'Payment Completed', },
        { name: 'Refunds', label: 'Refunds', },
    ];

    return (
        <div className="flex justify-between items-end border-b border-slate-200 mb-6 overflow-x-auto no-scrollbar">

            {/* Tabs */}
            <div className="flex gap-8">
                {tabs.map((tab) => (
                    <button
                        key={tab.name}
                        onClick={() => setActiveTab(tab.name)}
                        className={`pb-4 text-[13px] md:text-sm font-semibold transition-all relative whitespace-nowrap
                                   ${activeTab === tab.name
                                ? 'text-[#0B1E3D]'
                                : 'text-slate-400 hover:text-[#0B1E3D]'
                            }`}
                    >
                        {tab.label}
                        {activeTab === tab.name && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#D97706] rounded-t-full" />
                        )}
                    </button>
                ))}
            </div>

            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#0B1E3D] hover:bg-slate-50 rounded-md transition-colors border border-slate-200"
                >
                    <Filter className="w-4 h-4" />
                    Filter
                </button>

                {/* Dropdown Menu - State based */}
                {isOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-2">
                        <div className="px-4 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Offer Status</div>
                        {options.map((option) => (
                            <button
                                key={option}
                                className="w-full text-left px-4 py-2 text-sm text-[#0B1E3D] hover:bg-slate-50 transition-colors"
                                onClick={() => {
                                    console.log(`Filtering by: ${option}`);
                                    setIsOpen(false);
                                }}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default BuyerPaymentsTabs
import React, { useState } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { IoSearch } from 'react-icons/io5';

// Dropdown data
const dropdownOptions = {
  Make: ["Toyota", "Nissan", "Mercedes-Benz", "BMW", "Lexus", "Ford", "Chevrolet", "Honda", "Hyundai", "Kia", "Land Rover", "Porsche", "Audi", "Jeep", "Mitsubishi"],
  Model: ["Camry", "Corolla", "Land Cruiser", "Patrol", "Altima", "Sunny", "C-Class", "E-Class", "GLC", "3 Series", "5 Series", "LX", "GX", "Mustang", "Ranger"],
  Year: ["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015"],
  "Price Range": ["Under AED 25,000", "AED 25,000 - 50,000", "AED 50,000 - 75,000", "AED 75,000 - 100,000", "AED 100,000 - 150,000", "AED 150,000 - 250,000", "AED 250,000 - 500,000", "Above AED 500,000"],
  "Vehicle Type": ["Sedan", "SUV", "Coupe", "Hatchback", "Convertible", "Pickup Truck", "Van", "Wagon", "Crossover", "Sports Car", "Luxury", "Electric"],
};

// Reusable Custom Dropdown Component
const CustomDropdown = ({
  label,
  options,
  selected,
  onSelect,
  openDropdown,
  setOpenDropdown,
}) => {
  const isOpen = openDropdown === label;

  return (
    <div className="relative">
      <label className="block text-xs font-semibold text-gray-700 mb-1">
        {label}
      </label>

      <div
        onClick={() =>
          setOpenDropdown(isOpen ? null : label)
        }
        className="w-full flex items-center justify-between p-2.5 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:border-[#D97706] transition-all text-sm"
      >
        <span className={selected ? "text-gray-900" : "text-gray-400"}>
          {selected || `All ${label}s`}
        </span>

        {isOpen ? (
          <IoIosArrowUp className="text-gray-400" />
        ) : (
          <IoIosArrowDown className="text-gray-400" />
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-100 rounded-lg shadow-xl max-h-40 overflow-y-auto">
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => {
                onSelect(opt);
                setOpenDropdown(null);
              }}
              className="px-4 py-2 hover:bg-orange-50 hover:text-[#D97706] cursor-pointer text-sm"
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

function AuctionSearch() {

  const [openDropdown, setOpenDropdown] = useState(null);
  const [activeTab, setActiveTab] = useState('Search Cars');
  const [filters, setFilters] = useState({});

  const tabs = ['Search Cars', 'Live Auctions', 'Upcoming Auctions', 'Ended Auctions'];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-6">
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">

        {/* Tabs */}
        <div className="flex gap-8 border-b border-gray-200 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-medium transition-colors whitespace-nowrap 
              ${activeTab === tab ? 'text-[#D97706] border-b-2 border-[#D97706]' : 'text-gray-500 hover:text-[#D97706]'}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {['Make', 'Model', 'Year', 'Price Range', 'Vehicle Type'].map((label) => (
              <CustomDropdown
                key={label}
                label={label}
                options={dropdownOptions[label]}
                selected={filters[label]}
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
                onSelect={(val) => setFilters({ ...filters, [label]: val })}
              />
            ))}
          </div>

          <button className="bg-[#D97706] text-white py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-[#B45309] transition-all shadow-md">
            <IoSearch /> Search
          </button>
        </div>

        {/* Footer Stats */}
        <div className="mt-6 flex flex-wrap gap-4 text-xs text-gray-500 items-center">
          <span className="flex items-center gap-1 text-[#D97706] font-medium">🔥 24 Live Auctions</span>
          <span>•</span> <span>1,245 Cars</span> <span>•</span> <span>3,672 Bidders Online</span>
        </div>
      </div>
    </div>
  );
}

export default AuctionSearch;

import React, { useState } from 'react';
import { Search, ChevronDown, SlidersHorizontal, LayoutGrid, List, Heart, MapPin, Gauge } from 'lucide-react';
import BuyerCustomDropdown from './BuyerCustomDropdown';
import { vehicles } from '../../Data';

function SellerInventory({setSelectedVehicleId, setCurrentPage}) {

  const [view, setView] = useState('grid');
  const [make, setMake] = useState('All Make');
  const [model, setModel] = useState('All Model');
  const [bodyType, setBodyType] = useState('All BodyType');
  const [price, setPrice] = useState('Price Range');
  const [year, setYear] = useState('Any');
  const [sortDropDown, setSortDropDown] = useState('Newest First');

  return (
    <div className="flex flex-col gap-3 p-4 bg-white border border-slate-200 rounded-xl shadow-sm my-6">

      <div>
        {/* row 1: search + filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-50">
            <input
              type="text"
              placeholder="Search inventory..."
              className="w-full pl-4 pr-10 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D97706]/20"
            />
            <Search className="absolute right-3 top-2.5 text-slate-400" size={18} />
          </div>

          <BuyerCustomDropdown options={["Toyota", "BMW", "Mercedes"]} selected={make} onChange={setMake} />
          <BuyerCustomDropdown options={["X5", "C300", "Land Cruiser"]} selected={model} onChange={setModel} />
          <BuyerCustomDropdown options={["SUV", "Sedan", "Coupe"]} selected={bodyType} onChange={setBodyType} />
          <BuyerCustomDropdown options={["0 - 50k", "50k - 100k", "100k+"]} selected={price} onChange={setPrice} />
          <BuyerCustomDropdown options={["2024", "2023", "2022"]} selected={year} onChange={setYear} />

          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all whitespace-nowrap">
            <SlidersHorizontal size={16} /> More Filters
          </button>
        </div>

        {/* row 2: sort + view toggle */}
        <div className="flex items-center justify-between gap-3 mt-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500 whitespace-nowrap">Sort by:</span>
            <BuyerCustomDropdown
              options={["Newest First", "Price: Low to High", "Price: High to Low"]}
              selected={sortDropDown}
              onChange={setSortDropDown}
            />
          </div>

          <div className="hidden md:flex border border-slate-200 rounded-lg p-1 shrink-0">
            <button
              onClick={() => setView('grid')}
              className={`p-1.5 rounded ${view === 'grid' ? 'bg-[#0B1E3D] text-white' : 'text-slate-400'}`}>
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-1.5 rounded ${view === 'list' ? 'bg-[#0B1E3D] text-white' : 'text-slate-400'}`}>
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* cards */}
      <div className={`grid gap-6 mt-8 ${view === 'grid' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1'}`}>
        {vehicles.map((car) => (
          <div
            key={car.id}
            className={`bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex transition-all ${view === 'list' ? 'flex-row' : 'flex-col'
              }`}
          >
            {/* Image Section */}
            <div className={`relative overflow-hidden ${view === 'list' ? 'w-1/2 min-h-50' : 'w-full h-48'
              }`}>
              <img
                src={car.image}
                alt={car.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
              <div className="absolute top-3 left-3">
                <span className="bg-[#0B1E3D] text-white text-[10px] font-bold px-2 py-1 rounded">New</span>
              </div>
              <div className="absolute top-3 right-3">
                <Heart size={18} className="text-white fill-transparent hover:fill-red-500 hover:text-red-500 cursor-pointer" />
              </div>
            </div>

            {/* Content section */}
            <div className="p-4 w-full flex flex-col grow">
              <h3 className="font-bold text-[#0B1E3D] text-sm mb-3">{car.name}</h3>

              {/* VIN and Specs */}
              <div className="text-[11px] text-slate-500 space-y-1 mb-4">
                <p><span className="text-slate-400">VIN:</span> {car.vin}</p>
                <div className="flex gap-2 mt-2">
                  <span className="bg-slate-100 px-2 py-1 rounded text-slate-600">{car.transmission}</span>
                  <span className="bg-slate-100 px-2 py-1 rounded text-slate-600">{car.fuelType}</span>
                  <span className="bg-slate-100 px-2 py-1 rounded text-slate-600">{car.bodyStyle}</span>
                </div>
              </div>

              <div className="flex justify-between items-end mt-auto">
                <div>
                  <p className="text-[10px] text-slate-400">{car.location}</p>
                  <p className="font-bold text-[#0B1E3D] text-lg">{car.price || "AED 25,000"}</p>
                </div>
              </div>

              <div className="mt-4">
                <button 
                onClick={() => {
                  setSelectedVehicleId(car.id)
                  setCurrentPage('seller-inventory-detail')
                }}
                className="w-full text-[#D97706] font-bold text-sm hover:underline flex items-center justify-start gap-1">
                  View Details →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SellerInventory;
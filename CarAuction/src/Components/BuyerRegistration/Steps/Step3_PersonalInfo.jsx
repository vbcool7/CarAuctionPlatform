
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import toast from 'react-hot-toast';
import { Calendar, MapPin, User, Building2, Briefcase, ArrowLeft, ArrowRight, Bookmark, ChevronDown, Lock } from 'lucide-react';

import useBuyerRegFormStore from '../../../store/useBuyerRegFormStore';

function Step3_PersonalInfo({ onBack, onNext }) {

  const [isOpen, setIsOpen] = useState(false);

  const options = ["Indian", "Emirati", "American", "British", "Other"];
  const countries = ["UAE", "India", "USA", "Saudi Arabia", "Qatar"];

  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const { formData, setField } = useBuyerRegFormStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setField(name, value);
  };

  const handleDateChange = (date) => {
    if (date) {
      setField("dob", date);
    }
  };
  // submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.dob) return toast.error("Date Of Birth is required");
    const age = Math.floor((new Date() - new Date(formData.dob)) / (365.25 * 24 * 60 * 60 * 1000));
    if (age < 18) return toast.error("You must be at least 18 years old to register");

    if (!formData.nationality) return toast.error("Please select nationality");

    if (!formData.country) return toast.error("Please select country");

    if (!formData.city) return toast.error("City is required");
    if (!formData.address) return toast.error("Address is required");
    if (!formData.pincode) return toast.error("Pincode is required");

    if (['dealer', 'business'].includes(formData.buyerType)) {
      if (!formData.companyName) return toast.error("Company Name is required");
      if (!formData.registrationNumber) return toast.error("Registration Number is required");
    }

    onNext();
  };

  return (
    <section className='w-full py-10'>
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">

        <h1 className="block text-sm font-bold text-gray-800 mb-4">
          Basic Details
        </h1>

        {/* Basic Details Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">

          {/* date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Date of birth <span className='text-red-600'>*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
              <DatePicker
                selected={formData.dob ? new Date(formData.dob) : null}
                onChange={(date) => handleDateChange(date)}
                maxDate={new Date()}
                placeholderText="dd/mm/yyyy"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#D97706] focus:ring-[#D97706] transition-all"
                calendarClassName="shadow-xl border-none rounded-lg"
              />
            </div>
          </div>

          {/* nationality */}
          <div className="relative w-full">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nationality <span className='text-red-600'>*</span>
            </label>

            {/* Dropdown Header */}
            <div
              onClick={() => setIsOpen(!isOpen)}
              className={`w-full flex items-center justify-between px-4 py-2.5 border rounded-lg cursor-pointer transition-all duration-200
              ${isOpen ? 'border-[#D97706] ring-[#D97706]' : 'border-gray-200 hover:border-gray-300'}`}
            >
              <div className="flex items-center gap-2 text-gray-600">
                <span className={!formData.nationality ? "text-gray-500" : "text-gray-700"}>
                  {formData.nationality || "Select Nationality"}
                </span>
              </div>
              <ChevronDown size={18} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
              <div className="absolute z-10 w-full mt-2 bg-white border border-gray-100 rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {options.map((option) => (
                  <div
                    key={option}
                    onClick={() => {
                      // setSelected(option);
                      setField("nationality", option)
                      setIsOpen(false);
                    }}
                    className="px-4 py-3 hover:bg-orange-50 hover:text-[#D97706] cursor-pointer transition-colors"
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* country */}
          <div className="relative w-full">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Country <span className='text-red-600'>*</span>
            </label>

            {/* Dropdown Header */}
            <div
              onClick={() => setIsCountryOpen(!isCountryOpen)}
              className={`w-full flex items-center justify-between px-4 py-2.5 border rounded-lg cursor-pointer transition-all duration-200
              ${isCountryOpen ? 'border-[#D97706] ring-[#D97706]' : 'border-gray-200 hover:border-gray-300'}`}
            >
              <div className="flex items-center gap-2 text-gray-600">
                <span className={!formData.country ? "text-gray-500" : "text-gray-700"}>
                  {formData.country || "Select Country"}
                </span>
              </div>
              <ChevronDown size={18} className={`text-gray-500 transition-transform ${isCountryOpen ? 'rotate-180' : ''}`} />
            </div>

            {/* Dropdown Menu */}
            {isCountryOpen && (
              <div className="absolute z-10 w-full mt-2 bg-white border border-gray-100 rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {countries.map((option) => (
                  <div
                    key={option}
                    onClick={() => {
                      // setSelectedCountry(option);
                      setField("country", option)
                      setIsCountryOpen(false);
                    }}
                    className="px-4 py-3 hover:bg-orange-50 hover:text-[#D97706] cursor-pointer transition-colors"
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* city */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              City <span className='text-red-600'>*</span>
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter your city"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-[#D97706] focus:ring-[#D97706] outline-none" />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Address <span className='text-red-600'>*</span>
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your full address"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-[#D97706] focus:ring-[#D97706] outline-none" />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Postal Code <span className='text-red-600'>*</span>
            </label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="Enter postal code"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-[#D97706] focus:ring-[#D97706] outline-none" />
          </div>
        </div>

        <div className="flex-1 h-px mb-6 bg-gray-200"></div>

        {/* Buyer Type Section */}
        <div className="mb-8">

          {/* heading */}
          <div className='mb-4'>
            <h1 className="block text-sm font-bold text-gray-800 ">
              Buyer Type
            </h1>
            <span className='text-gray-600 text-xs '>Select the type of account you want to create</span>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { id: 'individual', label: 'Individual', icon: User, desc: 'I am buying as an individual.' },
              { id: 'dealer', label: 'Dealer', icon: Briefcase, desc: 'I am a registered car dealer.' },
              { id: 'business', label: 'Business', icon: Building2, desc: 'I represent a business.' },
            ].map((type) => (
              <div
                key={type.id}
                onClick={() => setField('buyerType', type.id)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition ${formData.buyerType === type.id ? 'border-[#D97706] bg-orange-50' : 'border-gray-100 hover:border-gray-200'}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <input
                    type="radio"
                    checked={formData.buyerType === type.id}
                    onChange={() => setField('buyerType', type.id)}
                    className="accent-[#D97706]" />
                  <type.icon className={formData.buyerType === type.id ? 'text-[#D97706]' : 'text-gray-400'} />
                  <span className="font-bold text-gray-800">{type.label}</span>
                </div>
                <p className="text-xs text-gray-500 pl-8">{type.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Conditional Business Information */}
        {(formData.buyerType === 'dealer' || formData.buyerType === 'business') && (
          <div className="p-6 bg-slate-50/40 rounded-xl border border-slate-100 mb-8">

            <div className="flex items-center gap-2 mb-4 text-[#0B1E3D] font-bold">
              <Building2 size={20} /> Business Information
            </div>

            <div className="grid md:grid-cols-3 gap-6">

              {/* Company Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Company Name <span className='text-red-600'>*</span>
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Enter company name"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-[#D97706] focus:ring-[#D97706] outline-none"
                />
              </div>

              {/* Business Registration Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Registration Number <span className='text-red-600'>*</span>
                </label>
                <input
                  type="text"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  placeholder="Enter registration number"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-[#D97706] focus:ring-[#D97706] outline-none truncate"
                />
              </div>

              {/* VAT Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  VAT Number <span className='text-gray-400 font-normal'>(Optional)</span>
                </label>
                <input
                  type="text"
                  name="vatNumber"
                  value={formData.vatNumber}
                  onChange={handleChange}
                  placeholder="Enter VAT number"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-[#D97706] focus:ring-[#D97706] outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* security line */}
        <div className="flex items-center gap-2 text-gray-500 mt-6 px-1">
          <Lock size={14} className="text-gray-400" />
          <p className="text-xs font-medium">
            All information is kept secure and confidential.
          </p>
        </div>
      </div>

      {/* butn */}
      <div className="mt-8 flex items-center justify-between">

        <button
          onClick={onBack}
          className="flex items-center gap-2 hover:text-[#D97706] font-semibold py-2.5 rounded-lg text-gray-500 active:scale-95 transition-all duration-200 ease-in-out"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 text-[#D97706] font-semibold border border-[#D97706] py-2.5 px-8 rounded-lg hover:bg-[#D97706] hover:text-white active:scale-95 transition-all duration-200 ease-in-out cursor-pointer"
        >
          Continue
          <ArrowRight size={18} />
        </button>

      </div>
    </section>
  );
}

export default Step3_PersonalInfo;
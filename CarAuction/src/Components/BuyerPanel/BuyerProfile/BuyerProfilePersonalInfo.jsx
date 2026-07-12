
import React, { useState, useRef, useEffect } from 'react';
import { Pencil, Building2, User, Briefcase, X, ChevronUp, ChevronDown } from 'lucide-react';
import { HiOutlineCamera } from 'react-icons/hi2';
import BuyerCustomDropdown from '../BuyerSharedComponents/BuyerCustomDropdown';
import { buyerProfile } from '../../Data';

const InputField = ({ label, value, type = 'text', options = [], disabled = false }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-semibold text-slate-500 uppercase tracking-wide">
            {label}
        </label>
        {type === 'select' ? (
            <select
                defaultValue={value}
                disabled={disabled}
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-50 focus:border-[#D97706] transition-all text-[#0B1E3D] bg-white disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
            >
                {options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
        ) : (
            <input
                type="text"
                defaultValue={value}
                disabled={disabled}
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-50 focus:border-[#D97706] transition-all text-[#0B1E3D] disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
            />
        )}
    </div>
);

const dropdownOptions = {
    buyingInterests: ['Sedans', 'SUVs', 'Trucks', 'Luxury', 'Sports Cars', 'Classic Cars', 'Electric Vehicles', 'Motorcycles', 'Vans', 'Pickups'],
    preferredBrands: ['Toyota', 'BMW', 'Mercedes-Benz', 'Audi', 'Ford', 'Chevrolet', 'Nissan', 'Honda', 'Porsche', 'Land Rover', 'Lexus', 'Ferrari', 'Lamborghini'],
    preferredLocations: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'],
};

const PriceRangeField = ({ label, min, max }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-semibold text-slate-500 uppercase tracking-wide">
            {label}
        </label>
        <div className="flex items-center gap-2">
            <input
                type="text"
                defaultValue={min.toLocaleString()}
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-50 focus:border-[#D97706] transition-all text-[#0B1E3D]"
            />
            <span className="text-slate-400 font-bold text-sm shrink-0">—</span>
            <input
                type="text"
                defaultValue={max.toLocaleString()}
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-50 focus:border-[#D97706] transition-all text-[#0B1E3D]"
            />
        </div>
    </div>
);

const FuelTypeField = ({ label, selected }) => {
    const options = ['All', 'Petrol', 'Diesel', 'Hybrid', 'Electric'];
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-slate-500 uppercase tracking-wide">
                {label}
            </label>
            <div className="flex flex-wrap items-center gap-4 py-2">
                {options.map((opt) => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="fuelType"
                            defaultChecked={selected === opt}
                            className="accent-[#D97706] w-4 h-4"
                        />
                        <span className="text-sm text-[#0B1E3D]">{opt}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};

// ── Buyer Type card config ──
const buyerTypeConfig = [
    {
        value: 'Individual',
        icon: User,
        description: 'I am buying as an individual.',
    },
    {
        value: 'Dealer',
        icon: Briefcase,
        description: 'I am a registered car dealer.',
    },
    {
        value: 'Business',
        icon: Building2,
        description: 'I represent a business.',
    },
];

function BuyerProfilePersonalInfo() {

    const [preferredLanguage, setPreferredLanguage] = useState(buyerProfile.preferredLanguage || 'English');
    const [preferredTimeZone, setPreferredTimeZone] = useState(buyerProfile.preferredTimeZone || '(GMT +04:00) Dubai, UAE');

    const [buyingInterests, setBuyingInterests] = useState(buyerProfile.buyingInterests || []);
    const [preferredBrands, setPreferredBrands] = useState(buyerProfile.preferredBrands || []);
    const [preferredLocations, setPreferredLocations] = useState(buyerProfile.preferredLocations || []);

    const [profileImage, setProfileImage] = useState(buyerProfile.profileImage);
    const [receiveOffers, setReceiveOffers] = useState(buyerProfile.receiveOffers);

    const isDealer = buyerProfile.buyerType === 'Dealer';
    const isBusiness = buyerProfile.buyerType === 'Business';
    const showBusinessInfo = isDealer || isBusiness;

    // img handler
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setProfileImage(reader.result);
        reader.readAsDataURL(file);
    };

    return (
        <>
            {/* ── Personal Info + Account Info Card ── */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm w-full">

                {/* Photo Upload Row */}
                <div className="flex flex-col md:flex-row items-center md:items-end gap-5 mb-8 pb-8 border-b border-slate-100">
                    <div className="relative shrink-0">
                        {profileImage ? (
                            <img
                                src={profileImage}
                                alt="Profile"
                                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center border-4 border-white shadow-xl">
                                <HiOutlineCamera size={28} className="text-slate-400" />
                            </div>
                        )}
                        <input
                            type="file"
                            id="profilePic"
                            hidden
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        <label
                            htmlFor="profilePic"
                            className="absolute bottom-0 right-0 bg-[#D97706] p-2 rounded-full text-white cursor-pointer shadow-lg hover:scale-110 transition-all border-2 border-white"
                        >
                            <HiOutlineCamera size={16} />
                        </label>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-[#0B1E3D]">Upload Photo</p>
                        <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide mt-0.5">
                            JPG, PNG (Max 2 MB)
                        </p>
                    </div>
                </div>

                {/* Personal Information */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-base font-bold text-[#0B1E3D]">
                        Personal Information
                    </h2>
                    <button className="flex items-center gap-1.5 text-sm text-[#D97706] font-semibold hover:text-amber-600 transition-colors">
                        <Pencil size={14} /> Edit
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                    <InputField label="First Name" value={buyerProfile.firstName} />
                    <InputField label="Last Name" value={buyerProfile.lastName} />
                    <InputField label="Username" value={buyerProfile.username} />
                    <InputField label="Email Address" value={buyerProfile.email} />
                    <InputField label="Date of Birth" value={buyerProfile.dateOfBirth} />
                    <InputField label="Phone Number" value={buyerProfile.phone} />

                    <BuyerCustomDropdown
                        label="Preferred Language"
                        options={['English', 'Arabic', 'French', 'Urdu']}
                        selected={preferredLanguage}
                        onChange={setPreferredLanguage}
                    />
                </div>

                {/* Account Information */}
                <div className="flex justify-between items-center mb-6 pt-6 border-t border-slate-100">
                    <h2 className="text-base font-bold text-[#0B1E3D]">
                        Account Information
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                    <InputField
                        label="Account Type"
                        value={buyerProfile.accountType}
                        disabled
                    />
                    <InputField
                        label="Member Since"
                        value={buyerProfile.memberSince}
                        disabled
                    />
                    <BuyerCustomDropdown
                        label="Timezone"
                        options={[
                            '(GMT +04:00) Dubai, UAE',
                            '(GMT +03:00) Riyadh, KSA',
                            '(GMT +00:00) London, UK',
                            '(GMT +05:30) Mumbai, India',
                        ]}
                        selected={preferredTimeZone}
                        onChange={setPreferredTimeZone}
                    />
                </div>

                {/* Buyer Type — view only cards */}
                <div className="pt-6 border-t border-slate-100">
                    <div className="mb-4">
                        <h2 className="text-base font-bold text-[#0B1E3D]">
                            Buyer Type
                        </h2>
                        <p className="text-[13px] text-slate-500 mt-0.5">
                            Your account type is set at registration and cannot be changed.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {buyerTypeConfig.map(({ value, icon: Icon, description }) => {
                            const isActive = buyerProfile.buyerType === value;
                            return (
                                <div
                                    key={value}
                                    className={`relative flex items-start gap-3 p-4 rounded-xl border-2 transition-all
                                        ${isActive
                                            ? 'border-[#D97706] bg-amber-50'
                                            : 'border-slate-200 bg-white opacity-50'
                                        }`}
                                >
                                    {/* Radio dot — view only */}
                                    <div className={`mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center
                                        ${isActive ? 'border-[#D97706]' : 'border-slate-300'}`}
                                    >
                                        {isActive && (
                                            <div className="w-2 h-2 rounded-full bg-[#D97706]" />
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <Icon
                                                size={16}
                                                className={isActive ? 'text-[#D97706]' : 'text-slate-400'}
                                            />
                                            <span className={`text-sm font-bold ${isActive ? 'text-[#0B1E3D]' : 'text-slate-400'}`}>
                                                {value}
                                            </span>
                                        </div>
                                        <p className={`text-[12px] ${isActive ? 'text-slate-500' : 'text-slate-400'}`}>
                                            {description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Business Information — only for Dealer or Business */}
                {showBusinessInfo && (
                    <div className="mt-6 pt-6 border-t border-slate-100">
                        <div className="flex items-center gap-2 mb-5">
                            <Building2 size={18} className="text-[#D97706]" />
                            <h2 className="text-base font-bold text-[#0B1E3D]">Business Information</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <InputField
                                label="Company Name"
                                value={buyerProfile.companyName}
                                disabled
                            />
                            <InputField
                                label="Registration Number"
                                value={buyerProfile.registrationNumber}
                                disabled
                            />
                            <InputField
                                label="VAT Number (Optional)"
                                value={buyerProfile.vatNumber || '—'}
                                disabled
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* ── About You Card ── */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm w-full mt-5">
                <div className="mb-6">
                    <h2 className="text-base font-bold text-[#0B1E3D]">About You</h2>
                    <p className="text-[13px] text-slate-500 mt-1">
                        Tell us more about your buying preferences.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <BuyerCustomDropdown l
                        label="Buying Interests"
                        options={dropdownOptions.buyingInterests}
                        selected={buyingInterests}
                        onChange={setBuyingInterests}
                        multi
                    />
                    <PriceRangeField
                        label="Preferred Price Range (AED)"
                        min={buyerProfile.preferredPriceRange.min}
                        max={buyerProfile.preferredPriceRange.max}
                    />
                    <BuyerCustomDropdown
                        label="Preferred Brands"
                        options={dropdownOptions.preferredBrands}
                        selected={preferredBrands}
                        onChange={setPreferredBrands}
                        multi
                    />
                    <BuyerCustomDropdown
                        label="Preferred Locations"
                        options={dropdownOptions.preferredLocations}
                        selected={preferredLocations}
                        onChange={setPreferredLocations}
                        multi
                    />
                    <div className="md:col-span-2">
                        <FuelTypeField
                            label="Preferred Fuel Type"
                            selected={buyerProfile.preferredFuelType}
                        />
                    </div>
                    <div className="md:col-span-2 flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="receiveOffers"
                            checked={receiveOffers}
                            onChange={(e) => setReceiveOffers(e.target.checked)}
                            className="w-4 h-4 accent-[#D97706] cursor-pointer"
                        />
                        <label
                            htmlFor="receiveOffers"
                            className="text-sm text-[#0B1E3D] cursor-pointer select-none"
                        >
                            I want to receive exclusive offers and updates.
                        </label>
                    </div>
                </div>
            </div>

            {/* ── Save Button ── */}
            <div className="mt-6">
                <button
                    className="flex items-center gap-2 bg-[#D97706] text-white text-sm font-medium px-4 py-2 rounded-lg 
             transition-all duration-200 ease-in-out
             hover:bg-amber-600 hover:shadow-md 
             active:scale-[0.97] active:bg-amber-700 cursor-pointer"
                >
                    Save Changes
                </button>
            </div>
        </>
    );
}

export default BuyerProfilePersonalInfo;
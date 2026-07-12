
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Eye, EyeOff } from 'lucide-react';

import FormPageHeader from '../Shared/FormPageHeader';
import ProfileImageUpload from '../Shared/ProfileImageUpload';
import NotesField from '../Shared/NotesField';
import CustomDropdown from '../../SharedComponents/CustomDropDown';
import DateInputField from '../Shared/DateInputField';

const InputField = ({ label, name, value, onChange, type = 'text', options = [], disabled = false, required = false }) => {

    const [showPassword, setShowPassword] = useState(false);

    // Determine if we should show the toggle icon
    const isPasswordField = type === 'password';
    const inputType = isPasswordField ? (showPassword ? 'text' : 'password') : type;

    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-slate-500 uppercase tracking-wide">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {type === 'select' ? (
                <select
                    value={value}
                    onChange={(e) => onChange(name, e.target.value)}
                    disabled={disabled}
                    className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-50 focus:border-[#D97706] transition-all text-[#0B1E3D] bg-white disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
                >
                    {options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
            ) : (
                <div className="relative">
                    <input
                        type={inputType}
                        value={value}
                        onChange={(e) => onChange(name, e.target.value)}
                        disabled={disabled}
                        placeholder={`Enter ${label}`}
                        className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-50 focus:border-[#D97706] transition-all text-[#0B1E3D] disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
                    />
                    {isPasswordField && (
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
    )
};

function AddNewBuyerForm({ setCurrentPage }) {

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        dob: '',
        gender: '',
        nationality: '',
        preferredLanguage: '',
        alternatePhone: '',
        address: '',
        city: '',
        country: '',
        zipCode: '',
        password: '',
        confirmPassword: '',
        twoFAEnabled: false,
        kycStatus: '',
        emailVerified: false,
        phoneVerified: false,
        accountStatus: 'Active',
        notes: '',
        profileImage: null,
    });

    const [selectedDate, setSelectedDate] = useState(new Date());

    const [selectedGender, setSelectedGender] = useState("Select Gender");
    const [selectedKYC, setSelectedKYC] = useState("Select KYC Status");
    const [selectedStatus, setSelectedStatus] = useState("Select Status");
    const [selectedLang, setSelectedLang] = useState("Select Preffered Language");

    const [authToggle, setAuthToggle] = useState(true);
    const [emailToggle, setEmailToggle] = useState(true);
    const [phoneToggle, setPhoneToggle] = useState(true);

    const updateField = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // dob
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const handleSubmit = () => {
        // validation yahan pehle, phir API call
        console.log('submitting buyer:', formData);
    };

    const handleCancel = () => {
        setCurrentPage('buyers');
    };

    return (
        <div>
            {/* heading */}
            <FormPageHeader
                title="Add New Buyer"
                breadcrumbItems={[
                    { label: 'Dashboard', onClick: () => setCurrentPage('dashboard') },
                    { label: 'Buyers', onClick: () => setCurrentPage('buyers') },
                    { label: 'Add New Buyer' },
                ]}
                onBack={() => setCurrentPage('buyers')}
                backLabel="Back to Buyers"
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6">

                {/* left side - section */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Personal Information */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <h2 className="text-base font-bold text-[#0B1E3D] mb-6">
                            Personal Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <InputField label="First Name" name="firstName" value={formData.firstName} onChange={updateField} required />
                            <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={updateField} required />
                            <InputField label="Email Address" name="email" value={formData.email} onChange={updateField} required />
                            <InputField label="Phone Number" name="phone" value={formData.phone} onChange={updateField} required />

                            {/* dob */}
                            <DateInputField
                                label="Date of Birth"
                                selected={formData.dob}
                                onChange={(date) => updateField('dob', date)}
                                placeholder="Select date of birth"
                                required
                            />

                            <CustomDropdown
                                label="Gender"
                                options={['Male', 'Female', 'Other']}
                                selected={selectedGender}
                                onChange={setSelectedGender}
                                requiredField
                            />

                            <InputField label="Nationality" name="nationality" value={formData.nationality} onChange={updateField} required />

                            {/* preffered lang */}
                            <CustomDropdown
                                label="Preffered Language"
                                options={['English']}
                                selected={selectedLang}
                                onChange={setSelectedLang}
                            />
                            <InputField label="Alternate Phone" name="alternatePhone" value={formData.alternatePhone} onChange={updateField} />
                            <InputField label="Address" name="address" value={formData.address} onChange={updateField} required />
                            <InputField label="City" name="city" value={formData.city} onChange={updateField} required />
                            <InputField label="Country" name="country" value={formData.country} onChange={updateField} required />
                            <InputField label="Zip/Postal Code" name="pincode" value={formData.pincode} onChange={updateField} />
                        </div>
                    </div>

                    {/* Account Information */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <h2 className="text-base font-bold text-[#0B1E3D] mb-6">
                            Account Information
                        </h2>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>

                            {/* pass */}
                            <InputField label="Password" name="password" type='password' value={formData.password} required onChange={updateField} />

                            {/* confirm pass */}
                            <InputField label="ConfirmPassword" name="confirmPassword" type='password' value={formData.confirmPassword} required onChange={updateField} />

                            {/* 2FA toggle */}
                            <div className='flex flex-col gap-1.5'>
                                <label className="text-[12px] font-semibold text-slate-500 uppercase tracking-wide">
                                    Two Factor Authentication
                                </label>
                                <div className='flex gap-2 items-center mt-1.5'>
                                    <button
                                        onClick={() => setAuthoggle(!authToggle)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none 
                                        ${authToggle ? "bg-[#D97706]" : "bg-gray-300"}`}>
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 
                                            ${authToggle ? "translate-x-6" : "translate-x-1"}`}
                                        />
                                    </button>
                                    <span className="text-sm text-slate-500">Mark email as verified</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Verification & Status */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <h2 className="text-base font-bold text-[#0B1E3D] mb-6">
                            Verification & Status
                        </h2>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>

                            {/* kyc */}
                            <CustomDropdown
                                label="KYC Status"
                                options={['NA', 'NA', 'NA']}
                                selected={selectedKYC}
                                onChange={setSelectedKYC}
                            />

                            {/* acc status */}
                            <CustomDropdown
                                label="Account Status"
                                options={['NA', 'NA', 'NA']}
                                selected={selectedStatus}
                                onChange={setSelectedStatus}
                            />

                            {/* email  */}
                            <div className='flex flex-col gap-1.5'>
                                <label className="text-[12px] font-semibold text-slate-500 uppercase tracking-wide">
                                    Email Verification
                                </label>
                                <div className='flex gap-2 items-center mt-1.5'>
                                    <button
                                        onClick={() => setEmailToggle(!emailToggle)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none 
                                        ${emailToggle ? "bg-[#D97706]" : "bg-gray-300"}`}>
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 
                                            ${emailToggle ? "translate-x-6" : "translate-x-1"}`}
                                        />
                                    </button>
                                    <span className="text-sm text-slate-500">Mark email as verified</span>
                                </div>
                            </div>

                            {/* phone */}
                            <div className='flex flex-col gap-1.5'>
                                <label className="text-[12px] font-semibold text-slate-500 uppercase tracking-wide">
                                    Phone Verification
                                </label>
                                <div className='flex gap-2 items-center mt-1.5'>
                                    <button
                                        onClick={() => setPhoneToggle(!phoneToggle)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none 
                                        ${phoneToggle ? "bg-[#D97706]" : "bg-gray-300"}`}>
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 
                                            ${phoneToggle ? "translate-x-6" : "translate-x-1"}`}
                                        />
                                    </button>
                                    <span className="text-sm text-slate-500">Mark phone as verified</span>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* btns */}
                    <div className="mt-6 flex items-center justify-end gap-3">

                        {/* Cancel */}
                        <button
                            onClick={handleCancel}
                            className="
            rounded-xl
            border border-slate-200
            bg-white
            px-5 py-2.5
            text-sm font-medium
            text-slate-600
            transition-all duration-300
            hover:border-[#D97706]
            hover:bg-amber-50
            hover:text-[#0B1E3D]
            cursor-pointer
        "
                        >
                            Cancel
                        </button>

                        {/* Create Buyer */}
                        <button
                            onClick={handleSubmit}
                            className="rounded-xl bg-[#D97706] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-[#B45309] hover:shadow-lg active:scale-[0.98] cursor-pointer"
                        >
                            Create Buyer
                        </button>

                    </div>
                </div>

                {/* right side - section */}
                <div className="space-y-6">
                    <ProfileImageUpload
                        image={formData.profileImage}
                        onChange={(file) => updateField('profileImage', file)}
                    />
                    <NotesField
                        value={formData.notes}
                        onChange={(val) => updateField('notes', val)}
                    />
                </div>
            </div>
        </div>
    );
}

export default AddNewBuyerForm;
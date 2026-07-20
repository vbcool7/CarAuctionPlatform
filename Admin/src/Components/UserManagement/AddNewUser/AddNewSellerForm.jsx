
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import FormPageHeader from '../Shared/FormPageHeader';
import ProfileImageUpload from '../Shared/ProfileImageUpload';
import NotesField from '../Shared/NotesField';
import DocumentsUpload from '../Shared/DocumentsUpload';
import AccountStatus from '../Shared/AccountStatus';
import CustomDropdown from '../../SharedComponents/CustomDropDown';
import InputField from '../Shared/InputField';
import DateInputField from '../Shared/DateInputField';

// for acc status compo
const staffOptions = [
    { value: 'active', label: 'Active', description: 'Seller can login and access system', colorClass: 'bg-green-50 text-green-700' },
    { value: 'inactive', label: 'Inactive', description: 'Seller cannot login', colorClass: 'bg-orange-50 text-orange-700' },
    { value: 'suspended', label: 'Suspended', description: 'Seller account is suspended', colorClass: 'bg-red-50 text-red-700' },
];

function AddNewSellerForm({ setCurrentPage }) {

    const [formData, setFormData] = useState({
        // Personal Information
        fullName: '',
        email: '',
        phone: '',
        dob: '',
        gender: '',
        nationality: '',

        // Business Information
        companyName: '',
        businessType: '',
        sellerType: 'Dealer',
        tradeLicenseNumber: '',
        tradeLicenseExpiryDate: '',
        vatNumber: '',
        website: '',
        businessAddress: '',

        // Account Information
        password: '',
        confirmPassword: '',
        twoFAEnabled: false,

        // Additional Information
        preferredLanguage: '',
        supportEmail: '',
        supportPhone: '',

        status: ''
    });

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedGender, setSelectedGender] = useState("");

    const [selectedBusiness, setSelectedBusiness] = useState("");
    const [selectedSeller, setSelectedSeller] = useState("");

    const [authToggle, setAuthoggle] = useState(true);
    const [selectedLang, setSelectedLang] = useState("");

    const [welcomeEmailToggle, setWelcomeEmailToggle] = useState(true);

    // dob
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const updateField = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        // validation yahan pehle, phir API call
        console.log('submitting buyer:', formData);
    };

    const handleCancel = () => {
        setCurrentPage('sellers');
    };

    return (
        <div>
            <FormPageHeader
                title="Add New Seller"
                breadcrumbItems={[
                    { label: 'Dashboard', onClick: () => setCurrentPage('dashboard') },
                    { label: 'Sellers', onClick: () => setCurrentPage('sellers') },
                    { label: 'Add New Seller' },
                ]}
                onBack={() => setCurrentPage('sellers')}
                backLabel="Back to Sellers"
                backLabelOnMob="Back"
            />

            {/* form container */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6">

                {/* left side - section */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Personal Information */}
                    <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <h2 className="text-base font-bold text-[#0B1E3D] mb-6">
                            Personal Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <InputField label="Full Name" name="fullName" value={formData.fullName} onChange={updateField} required />
                            <InputField label="Email Address" name="email" value={formData.email} onChange={updateField} required />
                            <InputField label="Phone Number" name="phone" value={formData.phone} onChange={updateField} required />

                            {/* dob */}
                            <DateInputField
                                label="Date Of Birth"
                                selected={formData.dob}
                                onChange={(date) => updateField('dob', date)}
                                placeholder="Select Date Of Birth"
                                variant='dob'
                                required
                            />

                            <CustomDropdown
                                label="Gender"
                                placeholder="Select Gender"
                                options={['Male', 'Female', 'Other']}
                                selected={selectedGender}
                                onChange={setSelectedGender}
                                requiredField
                            />

                            <InputField label="Nationality" name="nationality" value={formData.nationality} onChange={updateField} required />

                        </div>
                    </div>

                    {/*business Information */}
                    <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <h2 className="text-base font-bold text-[#0B1E3D] mb-6">
                            Business Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <InputField label="Business / Company Name" name="companyName" value={formData.companyName} onChange={updateField} required />

                            {/* business type */}
                            <CustomDropdown
                                label="Business Type"
                                placeholder="Select Business Type"
                                options={['NA', 'NA', 'NA']}
                                selected={selectedBusiness}
                                onChange={setSelectedBusiness}
                                requiredField
                            />

                            {/* seller type */}
                            <CustomDropdown
                                label="Seller Type"
                                placeholder="Select Seller Type"
                                options={['Dealer', 'Individual']}
                                selected={selectedSeller}
                                onChange={setSelectedSeller}
                                requiredField
                            />

                            <InputField label="Trade License Number" name="tradeLicenseNumber" value={formData.tradeLicenseNumber} onChange={updateField} required />

                            {/* license */}
                            <DateInputField
                                label="Trade License Expiry Date"
                                selected={formData.tradeLicenseExpiryDate}
                                onChange={(date) => updateField('tradeLicenseExpiryDate', date)}
                                placeholder="Select License Expiry Date"
                            />

                            <InputField label="VAT Number (Optional)" name="vatNumber" value={formData.vatNumber} onChange={updateField} />
                            <InputField label="Website (Optional)" name="website" value={formData.website} onChange={updateField} />

                            <InputField label="Business Address" name="businessAddress" value={formData.businessAddress} onChange={updateField} required />
                        </div>
                    </div>

                    {/* Account Information */}
                    <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm">
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

                    {/* additional Information */}
                    <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <h2 className="text-base font-bold text-[#0B1E3D] mb-6">
                            Additional Information
                        </h2>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>

                            <CustomDropdown
                                label="Preffered Language"
                                placeholder="Select Preffered Language"
                                options={['English']}
                                selected={selectedLang}
                                onChange={setSelectedLang}
                            />

                            <InputField label="Customer Support Email" name='supportEmail' value={formData.supportEmail} onChange={updateField} />

                            <InputField label="Customer Support Phone" name='supportPhone' value={formData.supportPhone} onChange={updateField} />
                        </div>
                    </div>

                    {/* btns */}
                    <div className="flex flex-col lg:flex-wrap xl:flex-nowrap xl:flex-row xl:justify-between gap-6">

                        {/* toggle */}
                        <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                            <button
                                onClick={() => setWelcomeEmailToggle(!welcomeEmailToggle)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none 
                        ${welcomeEmailToggle ? "bg-[#D97706]" : "bg-gray-300"}`}>
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 
                            ${welcomeEmailToggle ? "translate-x-5 md:translate-x-6" : "translate-x-1"}`}
                                />
                            </button>
                            <div className="flex-1 min-w-0 flex flex-col">
                                <span className="text-[12px] font-semibold text-slate-500 uppercase tracking-wide">
                                    Send Welcome Email
                                </span>

                                <span className="text-[13px] md:text-sm text-slate-500">
                                    Seller will receive an email with login credentials
                                </span>
                            </div>
                        </div>

                        <div className="flex w-full sm:w-auto flex-wrap justify-end gap-3 xl:ml-6 shrink-0">

                            {/* Cancel */}
                            <button
                                onClick={handleCancel}
                                className="flex-1 md:flex-none rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 transition-all duration-300 hover:border-[#D97706] hover:bg-amber-50 hover:text-[#0B1E3D] cursor-pointer"
                            >
                                Cancel
                            </button>

                            {/* Create Buyer */}
                            <button
                                onClick={handleSubmit}
                                className="flex-1 md:flex-none rounded-xl bg-[#D97706] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-[#B45309] hover:shadow-lg active:scale-[0.98] cursor-pointer"
                            >
                                Create Seller
                            </button>
                        </div>
                    </div>
                </div>

                {/* right side - section */}
                <div className="space-y-6">

                    {/* img upload */}
                    <ProfileImageUpload
                        image={formData.profileImage}
                        onChange={(file) => updateField('profileImage', file)}
                    />

                    {/* documents */}
                    <DocumentsUpload />

                    {/* acc status */}
                    <AccountStatus
                        label="Account Status"
                        required
                        options={staffOptions}
                        selected={formData.status}
                        onChange={(val) => updateField('status', val)}
                    />
                </div>
            </div>
        </div>
    )
}

export default AddNewSellerForm
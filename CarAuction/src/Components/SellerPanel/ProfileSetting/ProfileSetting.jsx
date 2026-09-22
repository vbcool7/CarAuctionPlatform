
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Camera, User, ShieldCheck, Mail, Phone, Lock, Building2, Save } from 'lucide-react';

import FormInputFields from '../../SellerRegistration/FormInputFields';
import { useSellerGet, useUpdateSellerProfile } from '../../../hook/useSeller';

const tabs = [
    { key: 'account-details', label: 'Account Details' },
    { key: 'business-information', label: 'Business Information' },
    { key: 'notification-preferences', label: 'Notification Preferences' },
];

function ProfileSetting({ setCurrentPage }) {

    const [activeTab, setActiveTab] = useState('account-details');
    const [isEditing, setIsEditing] = useState(false);

    const { data: sellerData, isLoading, isError } = useSellerGet();
    const { mutate: updateProfile, isPending } = useUpdateSellerProfile();

    const initialFormData = {
        fullName: "",
        email: "",
        phone: "",
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',

        businessName: "",
        businessType: "",
        tradeLicenseNumber: "",
        vatNumber: "",
        businessYear: "",
        employees: "",
        website: "",
        businessDescription: "",

        country: "",
        emirate: "",
        city: "",
        area: "",
        streetAddress: "",
        buildingOffice: "",
        poBox: "",
        postalCode: "",

        isEmailVerified: false,
        isPhoneVerified: false,

        accountHolderName: "",
        bankName: "",
        ibanNumber: "",
        accountNumber: "",
        swiftCode: "",
        currency: "",

        profileImage: null,
        tradeLicense: null,
        emiratesId: null,
    };

    const [formData, setFormData] = useState(initialFormData);
    const [originalData, setOriginalData] = useState(initialFormData);

    // pre-filled
    useEffect(() => {
        if (sellerData) {
            const mapped = {
                fullName: sellerData.fullName || "",
                email: sellerData.email || "",
                phone: sellerData.phone || "",
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',

                businessName: sellerData.businessName || "",
                businessType: sellerData.businessType || "",
                tradeLicenseNumber: sellerData.licenseNumber || "",   // note reverse mapping
                vatNumber: sellerData.vatNumber || "",
                businessYear: sellerData.businessYear || "",
                employees: sellerData.employees || "",
                website: sellerData.website || "",
                businessDescription: sellerData.businessDescription || "",

                country: sellerData.country || "",
                emirate: sellerData.emirate || "",
                city: sellerData.city || "",
                area: sellerData.area || "",
                streetAddress: sellerData.streetAddress || "",
                buildingOffice: sellerData.building || "",
                poBox: sellerData.poBox || "",
                postalCode: sellerData.zipCode || "",

                isEmailVerified: sellerData.isEmailVerified || false,
                isPhoneVerified: sellerData.isPhoneVerified || false,

                accountHolderName: sellerData.accountHolderName || "",
                bankName: sellerData.bankName || "",
                ibanNumber: sellerData.ibanNumber || "",
                accountNumber: sellerData.accountNumber || "",
                swiftCode: sellerData.swiftCode || "",
                currency: sellerData.currency || "",

                profileImage: null,   
                tradeLicense: null,
                emiratesId: null,
            };
            setFormData(mapped);
            setOriginalData(mapped);
        }
    }, [sellerData]);

    // NOTE: still no fetch-and-populate. Wire your seller-profile query +
    // useEffect(() => { setFormData(data); setOriginalData(data); }, [data])
    // before this is real.

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileUpload = (field, file) => {
        if (!file) return;

        const maxSize = 10 * 1024 * 1024; // 10MB
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

        if (file.size > maxSize) {
            toast.error(`${field}: File size must be under 10MB`);
            return;
        }

        if (!allowedTypes.includes(file.type)) {
            toast.error(`${field}: Only JPG, PNG, WEBP, and PDF files are allowed`);
            return;
        }

        setFormData((prev) => ({
            ...prev,
            [field]: file,
        }));
    };

    const handleEditToggle = () => {
        if (isEditing) {
            setFormData(originalData);
        } else {
            setOriginalData(formData);
        }
        setIsEditing((prev) => !prev);
    };

    const handleSubmit = () => {
        const payload = {
            fullName: formData.fullName,
            businessName: formData.businessName,
            businessType: formData.businessType,
            licenseNumber: formData.tradeLicenseNumber,
            businessYear: formData.businessYear,
            website: formData.website,
            businessDescription: formData.businessDescription,
            employees: formData.employees,
            emirate: formData.emirate,
            city: formData.city,
            area: formData.area,
            streetAddress: formData.streetAddress,
            building: formData.buildingOffice,
            poBox: formData.poBox,
            zipCode: formData.postalCode,
        };

        const fd = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                fd.append(key, value);
            }
        });

        if (formData.profileImage instanceof File) fd.append('profileImage', formData.profileImage);
        if (formData.tradeLicense instanceof File) fd.append('tradeLicense', formData.tradeLicense);
        if (formData.emiratesId instanceof File) fd.append('emiratesId', formData.emiratesId);

        updateProfile(fd, {
            onSuccess: (data) => {
                toast.success(data?.message || 'Profile updated successfully');
                setOriginalData(formData);
                setIsEditing(false);
            },
            onError: (err) => {
                toast.error(err.response?.data?.message || 'Failed to update profile');
            },
        });
    };

    if (isLoading) return <p className="p-10 text-center">Loading seller details....</p>;
    if (isError) return <p className="p-10 text-center text-red-500">Failed to load seller details</p>;

    return (
        <div className='pb-6 space-y-6'>

            {/* header */}
            <div className='w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0'>
                <div className='flex flex-col'>
                    <h1 className='text-xl md:text-2xl font-bold'>Profile Settings</h1>
                    <p className='text-xs md:text-sm text-gray-600 p-px'>
                        Manage your account details and preferences.
                    </p>
                </div>
            </div>

            <div className="space-y-8">

                {/* Tabs */}
                <div className="flex gap-9 border-b border-gray-200 overflow-x-auto no-scrollbar">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`py-3 text-xs md:text-sm font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer
                                ${activeTab === tab.key
                                    ? "border-[#D97706] text-[#D97706]"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                    {/* ================= LEFT FORM ================= */}
                    <div className="lg:col-span-8">

                        {activeTab === "account-details" && (
                            <div className="space-y-6">

                                {/* ================= PERSONAL INFORMATION ================= */}
                                <div className="rounded-xl border border-slate-200 bg-white p-5">

                                    <div className="mb-5">
                                        <h3 className="text-sm font-semibold text-[#0B1E3D]">
                                            Personal Information
                                        </h3>
                                        <p className="text-xs text-slate-400 mt-1">
                                            Update your personal information and contact details.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                        <FormInputFields
                                            label="Full Name"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            placeholder="Enter Full Name"
                                            required
                                            disabled={!isEditing}
                                        />

                                        <FormInputFields
                                            label="Email Address"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Enter Email Address"
                                            required
                                            disabled={!isEditing}
                                        />

                                        <FormInputFields
                                            label="Phone Number"
                                            name="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="Enter Phone Number"
                                            required
                                            disabled={!isEditing}
                                        />

                                    </div>
                                </div>

                                {/* ================= ADDRESS INFORMATION ================= */}
                                <div className="rounded-xl border border-slate-200 bg-white p-5">

                                    <div className="mb-5">
                                        <h3 className="text-sm font-semibold text-[#0B1E3D]">
                                            Address Information
                                        </h3>
                                        <p className="text-xs text-slate-400 mt-1">
                                            Update your address information .
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                        <FormInputFields
                                            label="Country"
                                            name="country"
                                            type="select"
                                            value={formData.country}
                                            onChange={handleChange}
                                            placeholder="Select Country"
                                            options={[
                                                { value: "united_arab_emirates", label: "United Arab Emirates" }
                                            ]}
                                            required
                                            disabled={!isEditing}
                                        />

                                        <FormInputFields
                                            label="Emirate"
                                            name="emirate"
                                            type="select"
                                            value={formData.emirate}
                                            onChange={handleChange}
                                            placeholder="Select Emirate"
                                            options={[
                                                { value: "abu_dhabi", label: "Abu Dhabi" },
                                                { value: "dubai", label: "Dubai" },
                                                { value: "sharjah", label: "Sharjah" },
                                                { value: "ajman", label: "Ajman" },
                                                { value: "umm_al_quwain", label: "Umm Al Quwain" },
                                                { value: "ras_al_khaimah", label: "Ras Al Khaimah" },
                                                { value: "fujairah", label: "Fujairah" }
                                            ]}
                                            required
                                            disabled={!isEditing}
                                        />

                                        <FormInputFields
                                            label="City"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            placeholder="Enter City"
                                            required
                                            disabled={!isEditing}
                                        />

                                        <FormInputFields
                                            label="Area / District"
                                            name="area"
                                            value={formData.area}
                                            onChange={handleChange}
                                            placeholder="Enter Area / District"
                                            required
                                            disabled={!isEditing}
                                        />

                                        <FormInputFields
                                            label="Street Address"
                                            name="streetAddress"
                                            value={formData.streetAddress}
                                            onChange={handleChange}
                                            placeholder="Enter Street Address"
                                            required
                                            disabled={!isEditing}
                                        />

                                        <FormInputFields
                                            label="Building / Office"
                                            name="buildingOffice"
                                            value={formData.buildingOffice}
                                            onChange={handleChange}
                                            placeholder="Enter Building / Office (Optional)"
                                            disabled={!isEditing}
                                        />

                                        <FormInputFields
                                            label="P.O. Box"
                                            name="poBox"
                                            value={formData.poBox}
                                            onChange={handleChange}
                                            placeholder="Enter P.O. Box (Optional)"
                                            disabled={!isEditing}
                                        />

                                        <FormInputFields
                                            label="ZIP / Postal Code"
                                            name="postalCode"
                                            value={formData.postalCode}
                                            onChange={handleChange}
                                            placeholder="Enter Zip / Postal Code"
                                            disabled={!isEditing}
                                        />

                                    </div>
                                </div>

                                {/* ================= BANK INFORMATION ================= */}
                                <div className="rounded-xl border border-slate-200 bg-white p-5">

                                    <div className="mb-5">
                                        <h3 className="text-sm font-semibold text-[#0B1E3D]">
                                            Bank Information
                                        </h3>
                                        <p className="text-xs text-slate-400 mt-1">
                                            Ipdate bank account details.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                        <FormInputFields
                                            label="Account Holder Name"
                                            name="accountHolderName"
                                            value={formData.accountHolderName}
                                            onChange={handleChange}
                                            placeholder="Enter Account Holder Name"
                                            required
                                            disabled={!isEditing}
                                        />

                                        <FormInputFields
                                            label="Bank Name"
                                            name="bankName"
                                            value={formData.bankName}
                                            onChange={handleChange}
                                            placeholder="Enter Bank Name"
                                            required
                                            disabled={!isEditing}
                                        />

                                        <FormInputFields
                                            label="IBAN Number"
                                            name="ibanNumber"
                                            value={formData.ibanNumber}
                                            onChange={handleChange}
                                            placeholder="Enter IBAN Number"
                                            required
                                            disabled={!isEditing}
                                        />

                                        <FormInputFields
                                            label="Account Number"
                                            name="accountNumber"
                                            value={formData.accountNumber}
                                            onChange={handleChange}
                                            placeholder="Enter Account Number"
                                            required
                                            disabled={!isEditing}
                                        />

                                        <FormInputFields
                                            label="SWIFT Code"
                                            name="swiftCode"
                                            value={formData.swiftCode}
                                            onChange={handleChange}
                                            placeholder="Enter Swift Code"
                                            required
                                            disabled={!isEditing}
                                        />

                                        <FormInputFields
                                            label="Currency"
                                            name="currency"
                                            type="select"
                                            value={formData.currency}
                                            onChange={handleChange}
                                            placeholder="Select Currency"
                                            options={[
                                                { value: "aed_uae_dirham", label: "AED - UAE Dirham" }
                                            ]}
                                            required
                                            disabled={!isEditing}
                                        />

                                    </div>

                                </div>

                            </div>
                        )}

                        {activeTab === "business-information" && (
                            <div className="space-y-6">
                                <div className="rounded-xl border border-slate-200 bg-white p-5">

                                    <div className="mb-5">
                                        <h3 className="text-sm font-semibold text-[#0B1E3D]">Business Information</h3>
                                        <p className="text-xs text-slate-400 mt-1"> Update your business information. </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                        <FormInputFields
                                            label="Business / Company Name"
                                            name="businessName"
                                            value={formData.businessName}
                                            onChange={handleChange}
                                            placeholder="Enter Business / Company Name"
                                            required
                                            disabled={!isEditing}
                                        />

                                        <FormInputFields
                                            label="Business Type"
                                            name="businessType"
                                            type="select"
                                            value={formData.businessType}
                                            onChange={handleChange}
                                            placeholder="Select Business Type"
                                            options={[
                                                { value: "car_dealership", label: "Car Dealership" },
                                                { value: "individual_seller", label: "Individual Seller" },
                                                { value: "vehicle_importer", label: "Vehicle Importer" },
                                                { value: "fleet_company", label: "Fleet Company" },
                                                { value: "rental_company", label: "Rental Company" },
                                                { value: "auction_house", label: "Auction House" },
                                                { value: "other", label: "Other" }
                                            ]}
                                            required
                                            disabled={!isEditing}
                                        />

                                        <FormInputFields
                                            label="Trade License Number"
                                            name="tradeLicenseNumber"
                                            value={formData.tradeLicenseNumber}
                                            onChange={handleChange}
                                            placeholder="Enter Trade License Number"
                                            required
                                            disabled={!isEditing}
                                        />

                                        <FormInputFields
                                            label="VAT Number (Optional)"
                                            name="vatNumber"
                                            value={formData.vatNumber}
                                            onChange={handleChange}
                                            placeholder="Enter VAT Number (Optional)"
                                            disabled={!isEditing}
                                        />

                                        <FormInputFields
                                            label="Years in Business"
                                            name="businessYear"
                                            type="select"
                                            value={formData.businessYear}
                                            onChange={handleChange}
                                            placeholder="Select Years in Business"
                                            options={[
                                                { value: "less_than_1", label: "Less than 1 Year" },
                                                { value: "1_plus", label: "1+ Years" },
                                                { value: "2_plus", label: "2+ Years" },
                                                { value: "3_plus", label: "3+ Years" },
                                                { value: "5_plus", label: "5+ Years" },
                                                { value: "10_plus", label: "10+ Years" },
                                                { value: "15_plus", label: "15+ Years" },
                                                { value: "20_plus", label: "20+ Years" }
                                            ]}
                                            required
                                            disabled={!isEditing}
                                        />

                                        <FormInputFields
                                            label="Number of Employees"
                                            name="employees"
                                            type="select"
                                            value={formData.employees}
                                            onChange={handleChange}
                                            placeholder="Select Number of Employees"
                                            options={[
                                                { value: "1-10", label: "1-10" },
                                                { value: "11-20", label: "11-20" },
                                                { value: "21-50", label: "21-50" },
                                                { value: "51-100", label: "51-100" },
                                                { value: "101-250", label: "101-250" },
                                                { value: "250_plus", label: "250+" }
                                            ]}
                                            required
                                            disabled={!isEditing}
                                        />

                                        <FormInputFields
                                            label="Website (Optional)"
                                            name="website"
                                            value={formData.website}
                                            onChange={handleChange}
                                            placeholder="Enter Website (Optional)"
                                            disabled={!isEditing}
                                        />

                                        <FormInputFields
                                            label="Short Business Description (Optional)"
                                            name="businessDescription"
                                            type="textarea"
                                            rows={3}
                                            value={formData.businessDescription}
                                            onChange={handleChange}
                                            placeholder="Enter Short Business Description"
                                            disabled={!isEditing}
                                        />

                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "notification-preferences" && (
                            <div className="space-y-6">
                                <div className="rounded-xl border border-slate-200 bg-white p-5">

                                    <div className="mb-5">
                                        <h3 className="text-sm font-semibold text-[#0B1E3D]">Notifications Preferences</h3>
                                        <p className="text-xs text-slate-400 mt-1">Choose how you want to receive update and alerts from BidDrive.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* edit / save / cancel */}
                        <div className="mt-6 flex justify-start gap-3">
                            {!isEditing ? (
                                <button
                                    type="button"
                                    onClick={handleEditToggle}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#D97706] text-white text-xs font-semibold hover:bg-[#B45309] active:scale-[0.98] transition-all duration-200 shadow-sm cursor-pointer"
                                >
                                    Edit Profile
                                </button>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        disabled={isPending}
                                        onClick={handleSubmit}
                                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#D97706] text-white text-xs font-semibold hover:bg-[#B45309] active:scale-[0.98] transition-all duration-200 shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Save size={14} />
                                        {isPending ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleEditToggle}
                                        disabled={isPending}
                                        className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-all disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                </>
                            )}
                        </div>

                    </div>

                    {/* ================= RIGHT : SUMMARY CARD ================= */}
                    <div className="lg:col-span-4">

                        {/* 1st tab */}
                        {activeTab === "account-details" && (
                            <div className="space-y-4">

                                {/* Profile Photo */}
                                <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                                    <div className="px-4 py-3">
                                        <h3 className="text-sm font-semibold text-[#0B1E3D]">
                                            Profile Photo
                                        </h3>

                                        <div className="flex items-center gap-4 mt-3">
                                            <div className="relative shrink-0">
                                                <div className="w-25 h-25 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                                                    <img
                                                        src="/profile-placeholder.png"
                                                        alt="Profile"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>

                                                <button
                                                    type="button"
                                                    disabled={!isEditing}
                                                    className="absolute -right-1 bottom-0 w-8 h-8 rounded-full bg-[#D97706] text-white flex items-center justify-center border-2 border-white hover:bg-[#B45309] transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <Camera size={16} />
                                                </button>
                                            </div>

                                            <div className="flex-1">
                                                <p className="text-[13px] font-medium text-slate-700"> Upload a clear profile photo </p>
                                                <p className="text-xs text-slate-400 mt-1"> JPG, PNG (Max 2MB)</p>

                                                <div className="flex items-center gap-2 mt-2">
                                                    <button
                                                        type="button"
                                                        disabled={!isEditing}
                                                        className="px-3 py-1.5 rounded-md bg-[#D97706] text-white text-[11px] font-semibold hover:bg-[#B45309] transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        Change Photo
                                                    </button>

                                                    <button
                                                        type="button"
                                                        disabled={!isEditing}
                                                        className="px-3 py-1.5 rounded-md border border-slate-200 text-[11px] font-medium text-slate-600 hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Account Status */}
                                <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                                    <div className="px-4 py-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-[15px] font-semibold text-[#0B1E3D]">Account Status</h3>
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-semibold">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                                Active
                                            </span>
                                        </div>

                                        <div className="divide-y divide-slate-100">
                                            <div className="flex items-center justify-between py-2">
                                                <div className="flex items-center gap-2">
                                                    <User size={15} className="text-slate-500" />
                                                    <span className="text-[12px] text-slate-600"> Seller ID</span>
                                                </div>
                                                <span className="text-[14px] font-semibold text-slate-700">DB987654</span>
                                            </div>

                                            <div className="flex items-center justify-between py-2">
                                                <div className="flex items-center gap-2">
                                                    <Building2 size={15} className="text-slate-500" />
                                                    <span className="text-[12px] text-slate-600"> Account Type </span>
                                                </div>
                                                <span className="flex items-center gap-1 text-[14px] font-medium text-green-600">
                                                    <ShieldCheck size={13} />
                                                    Verified Seller
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between py-2">
                                                <div className="flex items-center gap-2">
                                                    <Mail size={15} className="text-slate-500" />
                                                    <span className="text-[12px] text-slate-600"> Email Verification </span>
                                                </div>
                                                <span className="flex items-center gap-1 text-[14px] font-medium text-green-600">
                                                    <ShieldCheck size={13} />
                                                    Verified
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between py-2">
                                                <div className="flex items-center gap-2">
                                                    <Phone size={15} className="text-slate-500" />
                                                    <span className="text-[12px] text-slate-600">Phone Verification</span>
                                                </div>
                                                <span className="flex items-center gap-1 text-[14px] font-medium text-green-600">
                                                    <ShieldCheck size={13} />
                                                    Verified
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Change Password — separate API, left as-is (currently no onClick wired) */}
                                <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                                    <div className="px-4 py-3">

                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-md bg-slate-50 flex items-center justify-center">
                                                <Lock size={14} className="text-slate-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-[15px] font-semibold text-[#0B1E3D]">Change Password</h3>
                                                <p className="text-[12px] text-slate-400">For your security, please use a strong password</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4 mt-4">
                                            <FormInputFields
                                                label="Current Password"
                                                name="currentPassword"
                                                type="password"
                                                value={formData.currentPassword}
                                                onChange={handleChange}
                                                placeholder="Enter current password"
                                                required
                                            />

                                            <FormInputFields
                                                label="New Password"
                                                name="newPassword"
                                                type="password"
                                                value={formData.newPassword}
                                                onChange={handleChange}
                                                placeholder="Enter new password"
                                                required
                                            />

                                            <FormInputFields
                                                label="Confirm New Password"
                                                name="confirmPassword"
                                                type="password"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                placeholder="Confirm new password"
                                                required
                                            />

                                            <button
                                                type="button"
                                                className="w-full py-2.5 rounded-lg border border-[#D97706] text-[#D97706] text-[13px] font-semibold hover:bg-[#D97706] hover:text-white transition-colors"
                                            >
                                                Update Password
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 2nd tab */}
                        {activeTab === "business-information" && (
                            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                                <div className="px-4 py-3 space-y-4 ">

                                    <div className="mb-5">
                                        <h3 className="text-sm font-semibold text-[#0B1E3D]"> Business Documents</h3>
                                        <p className="text-xs text-slate-400 mt-1">Manage and update your business documents.</p>
                                    </div>

                                    {/* Trade License */}
                                    <FormInputFields
                                        label="Trade License"
                                        name="tradeLicense"
                                        type="file"
                                        value={formData.tradeLicense}
                                        onChange={(name, file) => handleFileUpload(name, file)}
                                        required
                                        disabled={!isEditing}
                                    />

                                    {/* Emirates ID / Passport — fixed: now uses handleFileUpload */}
                                    <FormInputFields
                                        label="Emirates ID / Passport"
                                        name="emiratesId"
                                        type="file"
                                        value={formData.emiratesId}
                                        onChange={(name, file) => handleFileUpload(name, file)}
                                        required
                                        disabled={!isEditing}
                                    />

                                    {/* Bank Statement */}
                                    <FormInputFields
                                        label="Bank Statement"
                                        name="bankStatement"
                                        type="file"
                                        value={formData.bankStatement}
                                        onChange={(name, file) => handleFileUpload(name, file)}
                                        required
                                        disabled={!isEditing}
                                    />

                                    {/* VAT Certificate */}
                                    <FormInputFields
                                        label="VAT Certificate"
                                        name="vatCertificate"
                                        type="file"
                                        value={formData.vatCertificate}
                                        onChange={(name, file) => handleFileUpload(name, file)}
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>
                        )}

                        {/* 3rd tab */}
                        {activeTab === "notification-preferences" && (
                            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                                <div className="px-4 py-3 space-y-4 ">

                                    <div className="mb-5">
                                        <h3 className="text-sm font-semibold text-[#0B1E3D]"> Business Documents</h3>
                                        <p className="text-xs text-slate-400 mt-1">Manage and update your business documents.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>

                </div>
            </div>

        </div>
    )
}

export default ProfileSetting;

import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-hot-toast';

import FormPageHeader from '../Shared/FormPageHeader';
import ProfileImageUpload from '../Shared/ProfileImageUpload';
import NotesField from '../Shared/NotesField';
import AccountStatus from '../Shared/AccountStatus';
import InputField from '../Shared/InputField';
import { useAddNewSeller } from '../../../hooks/useSeller';


// for acc status compo
const staffOptions = [
    { value: 'approved', label: 'Approved', description: 'Seller can login and access system', colorClass: 'bg-green-50 text-green-700' },
    { value: 'pending', label: 'Pending', description: 'Seller cannot login', colorClass: 'bg-orange-50 text-orange-700' },
];

function AddNewSellerForm({ setCurrentPage }) {

    const { mutate: addSeller, isPending: isAdding } = useAddNewSeller();

    const [savedDocuments, setSavedDocuments] = useState({
        tradeLicense: "",
        emiratesId: "",
        bankStatement: "",
        vatCertificate: ""
    });

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        profileImage: null,
        businessName: "",
        businessType: "",
        licenseNumber: "",
        vatNumber: "",
        website: "",
        businessDescription: "",
        businessYear: "",
        employees: "",
        country: "",
        emirate: "",
        streetAddress: "",
        building: "",
        city: "",
        area: "",
        poBox: "",
        zipCode: "",
        accountHolderName: "",
        bankName: "",
        ibanNumber: "",
        accountNumber: "",
        swiftCode: "",
        currency: "",
        tradeLicense: null,
        emiratesId: null,
        bankStatement: null,
        vatCertificate: null,
        isEmailVerified: false,
        isPhoneVerified: false,
        status: '',
    });

    const [authToggle, setAuthoggle] = useState(true);
    const [selectedLang, setSelectedLang] = useState("");

    const [welcomeEmailToggle, setWelcomeEmailToggle] = useState(true);

    // i/p handler
    const handleChange = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const updateField = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // profile image
    const handleProfileImage = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast("Please upload a valid image.");
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            toast("Maximum image size is 2MB.");
            return;
        }

        setFormData((prev) => ({
            ...prev,
            profileImage: file,
        }));
    };

    // file upload handler
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

    const handleSubmit = () => {

        const requiredFields = {
            fullName: "Full Name",
            email: "Email",
            phone: "Phone",
            businessName: "Business Name",
            businessType: "Business Type",
            licenseNumber: "License Number",
            businessYear: "Business Year",
            employees: "Employees",
            country: "Country",
            emirate: "Emirate",
            city: "City",
            area: "Area",
            streetAddress: "Street Address",
            accountHolderName: "Account Holder Name",
            bankName: "Bank Name",
            ibanNumber: "IBAN Number",
            accountNumber: "Account Number",
            swiftCode: "Swift Code",
            currency: "Currency",
        };

        const missingField = Object.entries(requiredFields).find(([key]) => !formData[key]);
        if (missingField) {
            return toast.error(`${missingField[1]} is required`);
        }

        if (!formData.tradeLicense || !formData.emiratesId || !formData.bankStatement) {
            return toast.error("Please upload all required documents");
        }

        const payload = new FormData();

        // Personal Information
        payload.append("fullName", formData.fullName);
        payload.append("email", formData.email);
        payload.append("phone", `+971${formData.phone}`);

        // Business Information
        payload.append("businessName", formData.businessName);
        payload.append("businessType", formData.businessType);
        payload.append("licenseNumber", formData.licenseNumber);
        payload.append("vatNumber", formData.vatNumber);
        payload.append("website", formData.website);
        payload.append("businessDescription", formData.businessDescription);
        payload.append("businessYear", formData.businessYear);
        payload.append("employees", formData.employees);

        // Address Information
        payload.append("country", formData.country);
        payload.append("emirate", formData.emirate);
        payload.append("streetAddress", formData.streetAddress);
        payload.append("building", formData.building);
        payload.append("city", formData.city);
        payload.append("area", formData.area);
        payload.append("poBox", formData.poBox);
        payload.append("zipCode", formData.zipCode);

        // Bank Details
        payload.append("accountHolderName", formData.accountHolderName);
        payload.append("bankName", formData.bankName);
        payload.append("ibanNumber", formData.ibanNumber);
        payload.append("accountNumber", formData.accountNumber);
        payload.append("swiftCode", formData.swiftCode);
        payload.append("currency", formData.currency);

        // Verification
        payload.append("isEmailVerified", String(formData.isEmailVerified));
        payload.append("isPhoneVerified", String(formData.isPhoneVerified));
        payload.append("sendWelcomeEmail", String(welcomeEmailToggle));

        // Profile Image
        if (formData.profileImage) {
            payload.append("profileImage", formData.profileImage);
        }

        // Documents
        if (formData.tradeLicense) {
            payload.append("tradeLicense", formData.tradeLicense);
        }

        if (formData.emiratesId) {
            payload.append("emiratesId", formData.emiratesId);
        }

        if (formData.bankStatement) {
            payload.append("bankStatement", formData.bankStatement);
        }

        if (formData.vatCertificate) {
            payload.append("vatCertificate", formData.vatCertificate);
        }

        addSeller(payload, {
            onSuccess: (res) => {
                toast.success("Seller added successfully");

                // form reset
                setFormData({
                    fullName: "",
                    email: "",
                    phone: "",
                    profileImage: null,
                    businessName: "",
                    businessType: "",
                    licenseNumber: "",
                    vatNumber: "",
                    website: "",
                    businessDescription: "",
                    businessYear: "",
                    employees: "",
                    country: "",
                    emirate: "",
                    streetAddress: "",
                    building: "",
                    city: "",
                    area: "",
                    poBox: "",
                    zipCode: "",
                    accountHolderName: "",
                    bankName: "",
                    ibanNumber: "",
                    accountNumber: "",
                    swiftCode: "",
                    currency: "",
                    tradeLicense: null,
                    emiratesId: null,
                    bankStatement: null,
                    vatCertificate: null,
                    isEmailVerified: true,
                    isPhoneVerified: true,
                });
                setSavedDocuments({
                    tradeLicense: "",
                    emiratesId: "",
                    bankStatement: "",
                    vatCertificate: ""
                });
                setWelcomeEmailToggle(true);
            },
            onError: (err) => {
                console.error(err);
                toast.error(
                    err?.response?.data?.message ||
                    "Failed to add seller"
                );
            },
        });
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

                {/* left side */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Personal Information */}
                    <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <h2 className="text-base font-bold text-[#0B1E3D] mb-6">
                            Personal Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <InputField
                                label="Full Name"
                                name="fullName"
                                value={formData.fullName}
                                onChange={updateField}
                                required
                            />

                            <InputField
                                label="Email Address"
                                name="email"
                                value={formData.email}
                                onChange={updateField}
                                required
                            />

                            <InputField
                                label="Phone Number"
                                name="phone"
                                value={formData.phone}
                                onChange={updateField}
                                required
                            />
                        </div>
                    </div>

                    {/* Business Information */}
                    <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <h2 className="text-base font-bold text-[#0B1E3D] mb-6">
                            Business Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            <InputField
                                label="Business / Company Name"
                                name="businessName"
                                value={formData.businessName}
                                onChange={updateField}
                                required
                            />

                            {/* Business Type */}
                            <InputField
                                label="Business Type"
                                name="businessType"
                                type="select"
                                value={formData.businessType}
                                onChange={updateField}
                                required
                                options={[
                                    { label: "Car Dealership", value: "car_dealership" },
                                    { label: "Individual Seller", value: "individual_seller" },
                                    { label: "Vehicle Importer", value: "vehicle_importer" },
                                    { label: "Fleet Company", value: "fleet_company" },
                                    { label: "Rental Company", value: "rental_company" },
                                    { label: "Auction House", value: "auction_house" },
                                    { label: "Other", value: "other" },
                                ]}
                            />

                            <InputField
                                label="Trade License Number"
                                name="licenseNumber"
                                value={formData.licenseNumber}
                                onChange={updateField}
                                required
                            />

                            <InputField
                                label="VAT Number (Optional)"
                                name="vatNumber"
                                value={formData.vatNumber}
                                onChange={updateField}
                            />

                            {/* Years in Business */}
                            <InputField
                                label="Years in Business"
                                type="select"
                                name="businessYear"
                                value={formData.businessYear}
                                onChange={updateField}
                                required
                                options={[
                                    { label: "Less than 1 Year", value: "less_than_1" },
                                    { label: "1+ Year", value: "1_plus" },
                                    { label: "2+ Years", value: "2_plus" },
                                    { label: "3+ Years", value: "3_plus" },
                                    { label: "5+ Years", value: "5_plus" },
                                    { label: "10+ Years", value: "10_plus" },
                                    { label: "15+ Years", value: "15_plus" },
                                    { label: "20+ Years", value: "20_plus" },
                                ]}
                            />

                            {/* Number of Employees */}
                            <InputField
                                label="Number of Employees"
                                type="select"
                                name="employees"
                                value={formData.employees}
                                onChange={updateField}
                                required
                                options={[
                                    { label: "1 - 10", value: "1-10" },
                                    { label: "11 - 20", value: "11-20" },
                                    { label: "21 - 50", value: "21-50" },
                                    { label: "51 - 100", value: "51-100" },
                                    { label: "101 - 250", value: "101-250" },
                                    { label: "250+", value: "250_plus" },
                                ]}
                            />

                            <InputField
                                label="Website (Optional)"
                                name="website"
                                value={formData.website}
                                onChange={updateField}
                            />

                            <InputField
                                label="Short Business Description (Optional)"
                                name="businessDescription"
                                type="textarea"
                                value={formData.businessDescription}
                                onChange={updateField}
                                placeholder="Enter Short Business Description"
                            />

                        </div>
                    </div>

                    {/* Address Information */}
                    <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <h2 className="text-base font-bold text-[#0B1E3D] mb-6">
                            Address Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            {/* Country */}
                            <InputField
                                label="Country"
                                name="country"
                                type="select"
                                value={formData.country}
                                onChange={updateField}
                                required
                                options={[
                                    {
                                        label: "United Arab Emirates",
                                        value: "united_arab_emirates"
                                    },
                                ]}
                            />

                            {/* Emirate */}
                            <InputField
                                label="Emirate"
                                name="emirate"
                                type="select"
                                value={formData.emirate}
                                onChange={updateField}
                                required
                                options={[
                                    { label: "Abu Dhabi", value: "abu_dhabi" },
                                    { label: "Dubai", value: "dubai" },
                                    { label: "Sharjah", value: "sharjah" },
                                    { label: "Ajman", value: "ajman" },
                                    { label: "Umm Al Quwain", value: "umm_al_quwain" },
                                    { label: "Ras Al Khaimah", value: "ras_al_khaimah" },
                                    { label: "Fujairah", value: "fujairah" },
                                ]}
                            />

                            {/* City */}
                            <InputField
                                label="City"
                                name="city"
                                value={formData.city}
                                onChange={updateField}
                                placeholder="Enter City"
                                required
                            />

                            {/* Area / District */}
                            <InputField
                                label="Area / District"
                                name="area"
                                value={formData.area}
                                onChange={updateField}
                                placeholder="Enter Area / District"
                                required
                            />

                            {/* Street Address */}
                            <InputField
                                label="Street Address"
                                name="streetAddress"
                                value={formData.streetAddress}
                                onChange={updateField}
                                placeholder="Enter Street Address"
                                required
                            />

                            {/* Building / Office */}
                            <InputField
                                label="Building / Office"
                                name="building"
                                value={formData.building}
                                onChange={updateField}
                                placeholder="Enter Building / Office (Optional)"
                            />

                            {/* P.O. Box */}
                            <InputField
                                label="P.O. Box"
                                name="poBox"
                                value={formData.poBox}
                                onChange={updateField}
                                placeholder="Enter P.O. Box (Optional)"
                            />

                            {/* Zip / Postal Code */}
                            <InputField
                                label="Zip / Postal Code"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={updateField}
                                placeholder="Enter Zip / Postal Code"
                            />

                            {/* Email Verification */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[12px] font-semibold text-slate-500 uppercase tracking-wide">
                                    Email Verification
                                </label>

                                <div className="flex gap-2 items-center mt-1.5">
                                    <button
                                        type="button"
                                        onClick={() => updateField("isEmailVerified", !formData.isEmailVerified)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${formData.isEmailVerified
                                            ? "bg-[#D97706]"
                                            : "bg-gray-300"
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${formData.isEmailVerified
                                                ? "translate-x-6"
                                                : "translate-x-1"
                                                }`}
                                        />
                                    </button>

                                    <span className="text-sm text-slate-500">
                                        Mark email as verified
                                    </span>
                                </div>
                            </div>

                            {/* Phone Verification */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[12px] font-semibold text-slate-500 uppercase tracking-wide">
                                    Phone Verification
                                </label>

                                <div className="flex gap-2 items-center mt-1.5">
                                    <button
                                        type="button"
                                        onClick={() => updateField("isPhoneVerified", !formData.isPhoneVerified)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${formData.isPhoneVerified
                                            ? "bg-[#D97706]"
                                            : "bg-gray-300"
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${formData.isPhoneVerified
                                                ? "translate-x-6"
                                                : "translate-x-1"
                                                }`}
                                        />
                                    </button>

                                    <span className="text-sm text-slate-500">
                                        Mark phone as verified
                                    </span>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Bank Information */}
                    <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <h2 className="text-base font-bold text-[#0B1E3D] mb-6">
                            Bank Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            {/* Account Holder Name */}
                            <InputField
                                label="Account Holder Name"
                                name="accountHolderName"
                                value={formData.accountHolderName}
                                onChange={updateField}
                                placeholder="Enter Account Holder Name"
                                required
                            />

                            {/* Bank Name */}
                            <InputField
                                label="Bank Name"
                                name="bankName"
                                value={formData.bankName}
                                onChange={updateField}
                                placeholder="Enter Bank Name"
                                required
                            />

                            {/* IBAN Number */}
                            <InputField
                                label="IBAN Number"
                                name="ibanNumber"
                                value={formData.ibanNumber}
                                onChange={updateField}
                                placeholder="Enter IBAN Number"
                                required
                            />

                            {/* Account Number */}
                            <InputField
                                label="Account Number"
                                name="accountNumber"
                                value={formData.accountNumber}
                                onChange={updateField}
                                placeholder="Enter Account Number"
                                required
                            />

                            {/* Swift Code */}
                            <InputField
                                label="Swift Code"
                                name="swiftCode"
                                value={formData.swiftCode}
                                onChange={updateField}
                                placeholder="Enter Swift Code"
                                required
                            />

                            {/* Currency */}
                            <InputField
                                label="Currency"
                                name="currency"
                                type="select"
                                value={formData.currency}
                                onChange={updateField}
                                placeholder="Select Currency"
                                required
                                options={[
                                    {
                                        label: "AED - UAE Dirham",
                                        value: "aed_uae_dirham"
                                    },
                                ]}
                            />

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
                                type="button"
                                onClick={handleSubmit}
                                disabled={isAdding}
                                className={`flex-1 md:flex-none rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 ${isAdding
                                    ? "bg-[#D97706]/60 cursor-not-allowed"
                                    : "bg-[#D97706] hover:bg-[#B45309] hover:shadow-lg active:scale-[0.98] cursor-pointer"
                                    }`}
                            >
                                {isAdding ? "Creating Seller..." : "Create Seller"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* right side */}
                <div className="space-y-6">

                    {/* ------------------ img upload */}
                    <ProfileImageUpload
                        image={formData.profileImage}
                        onChange={(file) => updateField('profileImage', file)}
                    />

                    {/* ---------------- documents */}
                    {/* Trade License */}
                    <InputField
                        label="Trade License"
                        name="tradeLicense"
                        type="file"
                        value={formData.tradeLicense}
                        onChange={(name, file) => handleFileUpload(name, file)}
                        required
                    />

                    {/* Emirates ID / Passport */}
                    <InputField
                        label="Emirates ID / Passport"
                        name="emiratesId"
                        type="file"
                        value={formData.emiratesId}
                        onChange={handleChange}
                        required
                    />

                    {/* Bank Statement */}
                    <InputField
                        label="Bank Statement"
                        name="bankStatement"
                        type="file"
                        value={formData.bankStatement}
                        onChange={handleChange}
                        required
                    />

                    {/* VAT Certificate */}
                    <InputField
                        label="VAT Certificate"
                        name="vatCertificate"
                        type="file"
                        value={formData.vatCertificate}
                        onChange={handleChange}
                    />

                    {/* -------------------- acc status */}
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
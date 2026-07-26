
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Eye, EyeOff, User, Briefcase, Building2, ChevronDown, FileText, UploadCloud, CheckCircle2, X } from 'lucide-react';
import toast from 'react-hot-toast';

import FormPageHeader from '../Shared/FormPageHeader';
import ProfileImageUpload from '../Shared/ProfileImageUpload';
import NotesField from '../Shared/NotesField';
import CustomDropdown from '../../SharedComponents/CustomDropDown';
import DateInputField from '../Shared/DateInputField';
import InputField from '../Shared/InputField';
import { useAddNewBuyer } from '../../../hooks/useAdmin';

const initialFormState = {
    firstName: '', lastName: '', email: '', mobile: '', password: '', confirmPassword: '',
    dob: '', gender: '', profileImageUrl: null,
    identityDocType: '', addressDocType: '',
    frontImageUrl: null, backImageUrl: null, selfieImageUrl: null, documentUrl: null, landlordIdUrl: null,
    nationality: '', address: '', city: '',
    country: '', pincode: '', buyerType: '', companyName: '', registrationNumber: '',
    vatNumber: '', paymentMethod: '', kycStatus: '',
    isEmailVerified: false, isMobileVerified: false, accountStatus: '',
};

const GENDER_MAP = {
    'Male': 'male',
    'Female': 'female',
    'Other': 'other'
};

const KYC_STATUS_MAP = {
    'Not Submitted': 'not_submitted',
    'Pending': 'pending',
    'Approved': 'approved',
    'Rejected': 'rejected'
};

const ACCOUNT_STATUS_MAP = {
    'Pending': 'pending',
    'Approved': 'approved',
    'Rejected': 'rejected'
};

const PAYMENT_METHOD_MAP = {
    'Card': 'card',
    'Bank Transfer': 'bank_transfer',
    'PayPal': 'paypal',
    'Other': 'other'
};

const IDENTITY_DOC_MAP = {
    'Passport': 'passport',
    'National ID': 'national_id',
    'Driving License': 'driving_license',
};

const ADDRESS_DOC_MAP = {
    'Utility Bill (Electricity/Water)': 'utility_bill',
    'Bank Statement': 'bank_statement',
    'Rental Agreement': 'rental_agreement',
};

const IDENTITY_DOC_OPTIONS = [
    { value: 'passport', label: 'Passport' },
    { value: 'national_id', label: 'National ID' },
    { value: 'driving_license', label: 'Driving License' },
];

const ADDRESS_DOC_OPTIONS = [
    { value: 'utility_bill', label: 'Utility Bill (Electricity/Water)' },
    { value: 'bank_statement', label: 'Bank Statement' },
    { value: 'rental_agreement', label: 'Rental Agreement' }
];

const docConfigs = {
    passport: { fields: [{ key: 'frontImageUrl', label: 'Front Side' }, { key: 'backImageUrl', label: 'Back Side' }] },
    national_id: { fields: [{ key: 'frontImageUrl', label: 'Front Side' }, { key: 'backImageUrl', label: 'Back Side' }] },
    driving_license: { fields: [{ key: 'frontImageUrl', label: 'Front Side' }] }
};

const addrConfigs = {
    utility_bill: { fields: [{ key: 'documentUrl', label: 'Utility Bill' }] },
    bank_statement: { fields: [{ key: 'documentUrl', label: 'Bank Statement' }] },
    rental_agreement: {
        fields: [
            { key: 'documentUrl', label: 'Rental Agreement' },
            { key: 'landlordIdUrl', label: 'Landlord ID' }
        ]
    },
};

// Helper for Upload Card
const UploadCard = ({ title, file, onUpload, onRemove }) => {
    if (file) {
        return (
            <div className="border border-dashed border-gray-300 rounded-xl py-4 px-2 flex items-center justify-between hover:bg-gray-50 w-full overflow-hidden">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    <FileText
                        size={20}
                        className="text-amber-600 shrink-0" />
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold truncate">{file.name}</p>
                        <p className="text-xs text-gray-400">{
                            (file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                    <CheckCircle2 size={18} className="text-green-500" />
                    <button
                        onClick={onRemove}
                        className="text-gray-400 hover:text-red-500 transition-colors">
                        <X size={18} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <label className="border border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-amber-50/30 hover:border-amber-400 transition cursor-pointer">
            <UploadCloud
                className="text-[#D97706] mb-2"
                size={28} />
            <span className="text-xs text-gray-500">{title}</span>
            <input
                type="file"
                className="hidden"
                accept="image/*,.pdf"
                onChange={(e) => {
                    const selected = e.target.files?.[0];
                    if (selected) {
                        if (selected.size > 5 * 1024 * 1024) {
                            toast.error('File must be under 5MB');
                            e.target.value = '';
                            return;
                        }
                        onUpload(selected);
                        e.target.value = '';
                    }
                }}
            />
        </label>
    );
};

function AddNewBuyerForm({ setCurrentPage }) {

    const { mutate: isBuyerAdded, isPending } = useAddNewBuyer();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: '',
        dob: '',
        gender: '',
        profileImageUrl: null,
        identityDocType: '',
        addressDocType: '',
        frontImageUrl: null,
        backImageUrl: null,
        selfieImageUrl: null,
        documentUrl: null,
        landlordIdUrl: null,
        nationality: '',
        address: '',
        city: '',
        country: '',
        pincode: '',
        buyerType: '',
        companyName: '',
        registrationNumber: '',
        vatNumber: '',
        paymentMethod: '',
        kycStatus: '',
        isEmailVerified: false,
        isMobileVerified: false,
        accountStatus: '',
    });

    const [emailToggle, setEmailToggle] = useState(false);
    const [phoneToggle, setPhoneToggle] = useState(false);

    const [isOpen, setIsOpen] = useState(false);
    const [isAddrOpen, setIsAddrOpen] = useState(false);

    const docType = formData.identityDocType;
    const addrType = formData.addressDocType;

    // field update
    const updateField = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {

        const requiredFields = [
            { value: formData.firstName, label: "First Name" },
            { value: formData.lastName, label: "Last Name" },
            { value: formData.email, label: "Email" },
            { value: formData.mobile, label: "Mobile Number" },
            { value: formData.password, label: "Password" },
            { value: formData.dob, label: "Date Of Birth" },
        ];

        for (const field of requiredFields) {
            if (!field.value?.toString().trim()) {
                return toast.error(`${field.label} is required`);
            }
        }

        if (formData.password !== formData.confirmPassword) {
            return toast.error("Password and Confirm Password do not match");
        }

        if (!formData.buyerType) {
            return toast.error("Please select Buyer Type");
        }

        if (["dealer", "business"].includes(formData.buyerType)) {
            if (!formData.companyName?.trim()) {
                return toast.error("Company Name is required");
            }

            if (!formData.registrationNumber?.trim()) {
                return toast.error("Registration Number is required");
            }
        }

        // if (!formData.docType) {
        //     return toast.error("Please select Identity Document Type");
        // }

        // if (!formData.addrType) {
        //     return toast.error("Please select Address Document Type");
        // }

        if (!formData.paymentMethod) {
            return toast.error("Please select Payment Method");
        }

        const submitData = new FormData();

        const directFields = [
            'firstName', 'lastName', 'email', 'mobile', 'password', 'confirmPassword',
            'dob', 'nationality', 'address', 'city', 'country', 'pincode',
            'buyerType', 'companyName', 'registrationNumber', 'vatNumber',
            'isEmailVerified', 'isMobileVerified'
        ];

        directFields.forEach((key) => {
            const value = formData[key];
            if (value !== null && value !== undefined && value !== '') {
                submitData.append(key, value);
            }
        });

        // mapped fields — convert display value to backend enum value
        if (formData.gender) {
            submitData.append('gender', GENDER_MAP[formData.gender] || formData.gender);
        }
        if (formData.kycStatus) {
            submitData.append('kycStatus', KYC_STATUS_MAP[formData.kycStatus] || formData.kycStatus);
        }
        if (formData.accountStatus) {
            submitData.append('accountStatus', ACCOUNT_STATUS_MAP[formData.accountStatus] || formData.accountStatus);
        }
        if (formData.paymentMethod) {
            submitData.append('paymentMethod', PAYMENT_METHOD_MAP[formData.paymentMethod] || formData.paymentMethod);
        }

        if (formData.profileImageUrl) {
            submitData.append('profileImageUrl', formData.profileImageUrl);
        }

        if (formData.identityDocType) submitData.append('identityDocType', formData.identityDocType);
        if (formData.addressDocType) submitData.append('addressDocType', formData.addressDocType);
        if (formData.frontImageUrl) submitData.append('frontImageUrl', formData.frontImageUrl);
        if (formData.backImageUrl) submitData.append('backImageUrl', formData.backImageUrl);
        if (formData.selfieImageUrl) submitData.append('selfieImageUrl', formData.selfieImageUrl);
        if (formData.documentUrl) submitData.append('documentUrl', formData.documentUrl);
        if (formData.landlordIdUrl) submitData.append('landlordIdUrl', formData.landlordIdUrl);

        isBuyerAdded(submitData, {
            onSuccess: (res) => {
                toast.success(res.message || "Buyer Added Successfully");
                setFormData(initialFormState);
                setEmailToggle(false);
                setPhoneToggle(false);
            },
            onError: (err) => {
                toast.error(err.response?.data?.message || "Failed to create new buyer");
            }
        })
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
                            <InputField label="First Name" name="firstName" value={formData.firstName} onChange={updateField} required />
                            <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={updateField} required />
                            <InputField label="Email Address" name="email" value={formData.email} onChange={updateField} required />
                            <InputField label="Phone Number" name="mobile" value={formData.mobile} onChange={updateField} required />

                            {/* dob */}
                            <DateInputField
                                label="Date of Birth"
                                selected={formData.dob}
                                onChange={(date) => updateField('dob', date)}
                                placeholder="Select Date Of Birth"
                                variant="dob"
                                required
                            />

                            <CustomDropdown
                                label="Gender"
                                placeholder="Select Gender"
                                options={['Male', 'Female', 'Other']}
                                selected={formData.gender}
                                onChange={(val) => updateField('gender', val)}
                            />

                            <InputField label="Nationality" name="nationality" value={formData.nationality} onChange={updateField} />

                            <InputField label="Address" name="address" value={formData.address} onChange={updateField} required />
                            <InputField label="City" name="city" value={formData.city} onChange={updateField} required />
                            <InputField label="Country" name="country" value={formData.country} onChange={updateField} required />
                            <InputField label="Zip/Postal Code" name="pincode" value={formData.pincode} onChange={updateField} />
                        </div>
                    </div>

                    {/* buyer type */}
                    <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm">
                        {/* heading */}
                        <div className='mb-6'>
                            <h2 className="text-base font-bold text-[#0B1E3D]">
                                Buyer Type
                            </h2>
                            <span className='text-gray-600 text-xs '>Select the type of account you want to create.</span>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                            {[
                                { id: 'individual', label: 'Individual', icon: User, desc: 'I am buying as an individual.' },
                                { id: 'dealer', label: 'Dealer', icon: Briefcase, desc: 'I am a registered car dealer.' },
                                { id: 'business', label: 'Business', icon: Building2, desc: 'I represent a business.' },
                            ].map((type) => (
                                <div
                                    key={type.id}
                                    onClick={() => updateField('buyerType', type.id)}
                                    className={`p-4 rounded-xl border-2 cursor-pointer transition ${formData.buyerType === type.id ? 'border-[#D97706] bg-orange-50' : 'border-gray-100 hover:border-gray-200'}`}
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <input
                                            type="radio"
                                            checked={formData.buyerType === type.id}
                                            onChange={() => updateField('buyerType', type.id)}
                                            className="accent-[#D97706]" />
                                        <type.icon className={formData.buyerType === type.id ? 'text-[#D97706]' : 'text-gray-400'} />
                                        <span className="font-bold text-gray-800">{type.label}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 pl-8">{type.desc}</p>
                                </div>
                            ))}
                        </div>

                        {/* Conditional Business Information */}
                        {(formData.buyerType === 'dealer' || formData.buyerType === 'business') && (
                            <div className="pt-6">

                                <h2 className="text-base font-bold text-[#0B1E3D] mb-4">
                                    Buyer Information
                                </h2>

                                <div className="grid md:grid-cols-3 gap-6">

                                    <InputField label="Company Name" name="companyName" value={formData.companyName} onChange={updateField} required />
                                    <InputField label="Registration Number" name="registrationNumber" value={formData.registrationNumber} onChange={updateField} required />
                                    <InputField label="VAT Number" name="vatNumber" value={formData.vatNumber} onChange={updateField} />

                                </div>
                            </div>
                        )}
                    </div>

                    {/* doc verification */}
                    <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <h2 className="text-base font-bold text-[#0B1E3D] mb-6">
                            Identity Verification
                        </h2>

                        <CustomDropdown
                            label="Identity Document Type"
                            options={IDENTITY_DOC_OPTIONS.map(o => o.label)}
                            selected={IDENTITY_DOC_OPTIONS.find(o => o.value === formData.identityDocType)?.label || ''}
                            requiredField
                            onChange={(label) => {
                                const value = IDENTITY_DOC_OPTIONS.find(o => o.label === label)?.value || '';
                                updateField('identityDocType', value);
                                updateField('frontImageUrl', null);
                                updateField('backImageUrl', null);
                            }}
                        />

                        {/* --- dynamic fields - identity --- */}
                        <div className="grid md:grid-cols-3 gap-6 mb-10 mt-4">
                            {(docConfigs[docType]?.fields || []).map((field) => (
                                <div
                                    key={field.key}
                                    className="space-y-3">
                                    <p className="text-sm text-gray-500">{field.label}</p>
                                    <UploadCard
                                        title={`Upload ${field.label}`}
                                        file={formData[field.key]}
                                        onUpload={(f) => updateField(field.key, f)}
                                        onRemove={() => updateField(field.key, null)}
                                    />
                                </div>
                            ))}

                            {/* always visible */}
                            <div className="space-y-3">
                                <p className="text-sm text-gray-500">Selfie Verification</p>
                                <UploadCard
                                    title="Take a selfie or upload"
                                    file={formData.selfieImageUrl}
                                    onUpload={(f) => updateField('selfieImageUrl', f)}
                                    onRemove={() => updateField('selfieImageUrl', null)}
                                />
                            </div>
                        </div>

                        <h2 className="text-base font-bold text-[#0B1E3D] mb-6">
                            Address Verification
                        </h2>

                        <CustomDropdown
                            label="Address Document Type"
                            options={ADDRESS_DOC_OPTIONS.map(o => o.label)}
                            selected={ADDRESS_DOC_OPTIONS.find(o => o.value === formData.addressDocType)?.label || ''}
                            requiredField
                            onChange={(label) => {
                                const value = ADDRESS_DOC_OPTIONS.find(o => o.label === label)?.value || '';
                                updateField('addressDocType', value);
                                updateField('documentUrl', null);
                                updateField('landlordIdUrl', null);
                            }}
                        />

                        {/* --- dynamic fields - address --- */}
                        <div className="grid md:grid-cols-3 gap-6 mt-4">
                            {(addrConfigs[addrType]?.fields || []).map((field) => (
                                <div
                                    key={field.key}
                                    className="space-y-2">
                                    <p className="text-sm text-gray-500">{field.label}</p>
                                    <UploadCard
                                        title={`Upload ${field.label}`}
                                        file={formData[field.key]}
                                        onUpload={(f) => updateField(field.key, f)}
                                        onRemove={() => updateField(field.key, null)}
                                    />
                                </div>
                            ))}
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

                            <CustomDropdown
                                label="Payment Method"
                                placeholder="Select Payment Method"
                                options={['Card', 'Bank Transfer', 'PayPal', 'Other']}
                                selected={formData.paymentMethod}
                                onChange={(val) => updateField('paymentMethod', val)}
                                requiredField
                            />
                        </div>
                    </div>

                    {/* Verification & Status */}
                    <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <h2 className="text-base font-bold text-[#0B1E3D] mb-6">
                            Verification & Status
                        </h2>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>

                            {/* kyc */}
                            <CustomDropdown
                                label="KYC Status"
                                placeholder="Select KYC Status"
                                options={['Not Submitted', 'Pending', 'Approved', 'Rejected']}
                                selected={formData.kycStatus}
                                onChange={(val) => updateField('kycStatus', val)}
                            />

                            {/* acc status */}
                            <CustomDropdown
                                label="Account Status"
                                placeholder="Select Account Status"
                                options={['Pending', 'Approved', 'Rejected']}
                                selected={formData.accountStatus}
                                onChange={(val) => updateField('accountStatus', val)}
                            />

                            {/* email  */}
                            <div className='flex flex-col gap-1.5'>
                                <label className="text-[12px] font-semibold text-slate-500 uppercase tracking-wide">
                                    Email Verification
                                </label>
                                <div className='flex gap-2 items-center mt-1.5'>
                                    <button
                                        onClick={() => {
                                            setEmailToggle(!emailToggle)
                                            updateField('isEmailVerified', !emailToggle)
                                        }}
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
                                        onClick={() => {
                                            setPhoneToggle(!phoneToggle)
                                            updateField('isMobileVerified', !phoneToggle)
                                        }}
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
                            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 transition-all duration-300 hover:border-[#D97706] hover:bg-amber-50 hover:text-[#0B1E3D] cursor-pointer"
                        >
                            Cancel
                        </button>

                        {/* Create Buyer */}
                        <button
                            onClick={handleSubmit}
                            disabled={isPending}
                            className={`rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300
                                ${isPending
                                    ? "bg-amber-400 cursor-not-allowed opacity-70 shadow-none"
                                    : "bg-[#D97706] hover:bg-[#B45309] hover:shadow-lg active:scale-[0.98] cursor-pointer"
                                }`}
                        >
                            {isPending ? "Creating Buyer..." : "Create Buyer"}
                        </button>

                    </div>
                </div>

                {/* right side - section */}
                <div className="space-y-6">
                    <ProfileImageUpload
                        image={formData.profileImageUrl}
                        onChange={(file) => updateField('profileImageUrl', file)}
                    />
                </div>
            </div>
        </div>
    );
}

export default AddNewBuyerForm;
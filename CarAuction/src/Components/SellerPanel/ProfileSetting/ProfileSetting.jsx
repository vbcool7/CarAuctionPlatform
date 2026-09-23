
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { Camera, User, ShieldCheck, ShieldAlert, Mail, Phone, Lock, Building2, Save, Bell, Check, Smartphone, Lightbulb } from 'lucide-react';

import FormInputFields from '../../SellerRegistration/FormInputFields';
import { useQueryClient } from '@tanstack/react-query';
import { useChangeSellerPassword, useSellerGet, useUpdateSellerProfile } from '../../../hook/useSeller';

const tabs = [
    { key: 'account-details', label: 'Account Details' },
    { key: 'business-information', label: 'Business Information' },
    { key: 'notification-preferences', label: 'Notification Preferences' },
];

const LICENSE_TRIGGER_FIELDS = ['businessName', 'businessType', 'tradeLicenseNumber', 'businessYear'];

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

    accountHolderName: "",
    bankName: "",
    ibanNumber: "",
    accountNumber: "",
    swiftCode: "",
    currency: "",

    profileImage: null,
    tradeLicense: null,
    emiratesId: null,
    bankStatement: null,
    vatCertificate: null,
};

const DocStatus = ({ doc }) => {
    if (!doc?.status) return null;
    const styles = {
        pending: 'bg-amber-50 text-amber-600',
        approved: 'bg-green-50 text-green-600',
        rejected: 'bg-red-50 text-red-600',
    };
    return (
        <div className="-mt-2 mb-1">
            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${styles[doc.status] || ''}`}>
                {doc.status}
            </span>
            {doc.status === 'rejected' && doc.rejectionReason && (
                <p className="text-[11px] text-red-500 mt-1">{doc.rejectionReason}</p>
            )}
        </div>
    );
};

// notification prefrences
const notificationSections = [
    {
        key: "email",
        icon: Mail,
        title: "Email Notifications",
        description: "Receive important updates and alerts via email.",
        items: [
            {
                key: "auctionUpdates",
                label: "Auction Updates",
                description: "Get notified when new auctions match your interests.",
            },
            {
                key: "bidUpdates",
                label: "Bid Updates",
                description: "Receive alerts when someone bids on your vehicles.",
            },
            {
                key: "saleConfirmations",
                label: "Sale Confirmations",
                description: "Get notified when your vehicle is sold.",
            },
            {
                key: "payoutNotifications",
                label: "Payout Notifications",
                description: "Receive updates about your payouts and transactions.",
            },
            {
                key: "accountActivity",
                label: "Account Activity",
                description: "Get alerts for login, security and account changes.",
            },
            {
                key: "promotionsOffers",
                label: "Promotions & Offers",
                description: "Receive special offers and promotional messages.",
            },
        ],
    },
    {
        key: "sms",
        icon: Smartphone,
        title: "SMS Notifications",
        description: "Get critical alerts via text message.",
        items: [
            {
                key: "auctionReminders",
                label: "Auction Reminders",
                description: "Get reminders about upcoming auctions.",
            },
            {
                key: "bidAlerts",
                label: "Bid Alerts",
                description: "Receive instant alerts for bid activity.",
            },
            {
                key: "paymentNotifications",
                label: "Payment Notifications",
                description: "Get notified about payments and payouts.",
            },
        ],
    },
    {
        key: "push",
        icon: Bell,
        title: "Push Notifications",
        description: "Receive real-time notifications on your device.",
        items: [
            {
                key: "realTimeBids",
                label: "Real-time Bids",
                description: "Get instant updates on bid activity.",
            },
            {
                key: "messageAlerts",
                label: "Message Alerts",
                description: "Receive new messages from buyers/sellers.",
            },
            {
                key: "systemNotifications",
                label: "System Notifications",
                description: "Get important platform updates and announcements.",
            },
        ],
    },
];

const NotificationSection = ({
    section,
    settings,
    onToggle,
    onItemToggle,
}) => {
    const Icon = section.icon;

    return (
        <div className="">

            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
                        <Icon
                            size={17}
                            className="text-[#0B1E3D]"
                        />
                    </div>

                    <div>
                        <h4 className="text-xs font-semibold text-[#0B1E3D]">
                            {section.title}
                        </h4>

                        <p className="text-[9px] text-slate-400 mt-0.5">
                            {section.description}
                        </p>
                    </div>
                </div>

                {/* Main Toggle */}
                <button
                    type="button"
                    onClick={() => onToggle(section.key)}
                    className={`relative w-7 h-4 rounded-full transition-colors ${settings.enabled
                        ? "bg-[#D97706]"
                        : "bg-slate-300"
                        }`}
                >
                    <span
                        className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-transform ${settings.enabled
                            ? "translate-x-3"
                            : "translate-x-0"
                            }`}
                    />
                </button>
            </div>

            {/* Checkboxes */}
            <div className="mt-3 ml-11 space-y-2">
                {section.items.map((item) => (
                    <label
                        key={item.key}
                        className={`flex items-start gap-2 cursor-pointer ${!settings.enabled
                            ? "opacity-50"
                            : ""
                            }`}
                    >
                        <input
                            type="checkbox"
                            checked={Boolean(settings[item.key])}
                            disabled={!settings.enabled}
                            onChange={() =>
                                onItemToggle(
                                    section.key,
                                    item.key
                                )
                            }
                            className="sr-only peer"
                        />

                        <span
                            className="
                                mt-0.5 w-3.5 h-3.5 shrink-0
                                rounded-sm border border-slate-300
                                flex items-center justify-center
                                peer-checked:bg-[#D97706]
                                peer-checked:border-[#D97706]
                                transition-colors
                            "
                        >
                            <Check
                                size={9}
                                strokeWidth={3}
                                className="text-white opacity-0 peer-checked:opacity-100"
                            />
                        </span>

                        <span className="w-28 shrink-0 text-[9px] font-medium text-slate-600">
                            {item.label}
                        </span>

                        <span className="text-[9px] text-slate-400">
                            {item.description}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    );
};

function ProfileSetting({ setCurrentPage }) {

    const queryClient = useQueryClient();

    const [activeTab, setActiveTab] = useState('account-details');
    const [isEditing, setIsEditing] = useState(false);

    const { data: sellerData, isLoading, isError } = useSellerGet();
    const { mutate: updateProfile, isPending } = useUpdateSellerProfile();
    const { mutate: changePassword, isPending: isPasswordPending } = useChangeSellerPassword();

    const [formData, setFormData] = useState(initialFormData);
    const [originalData, setOriginalData] = useState(initialFormData);

    const fileInputRef = useRef(null);
    const [photoPreview, setPhotoPreview] = useState(null);

    const [notificationSettings, setNotificationSettings] = useState({
        email: {
            enabled: true,
            auctionUpdates: true,
            bidUpdates: true,
            saleConfirmations: true,
            payoutNotifications: true,
            accountActivity: true,
            promotionsOffers: true,
        },
        sms: {
            enabled: true,
            auctionReminders: true,
            bidAlerts: true,
            paymentNotifications: true,
        },
        push: {
            enabled: true,
            realTimeBids: true,
            messageAlerts: true,
            systemNotifications: true,
        },
    });

    // pre-filled
    useEffect(() => {
        if (sellerData && !isEditing) {
            const mapped = {
                ...initialFormData,
                fullName: sellerData.fullName || "",
                email: sellerData.email || "",
                phone: sellerData.phone || "",

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

                accountHolderName: sellerData.accountHolderName || "",
                bankName: sellerData.bankName || "",
                ibanNumber: sellerData.ibanNumber || "",
                accountNumber: sellerData.accountNumber || "",
                swiftCode: sellerData.swiftCode || "",
                currency: sellerData.currency || "",
            };
            setFormData(mapped);
            setOriginalData(mapped);
        }
    }, [sellerData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // documents (trade license, emirates id)
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
        setFormData((prev) => ({ ...prev, [field]: file }));
    };

    // profile photo 
    const handlePhotoSelect = (e) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file) return;

        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            toast.error('Only JPG, PNG or WEBP allowed');
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            toast.error('Photo must be under 2MB');
            return;
        }
        setFormData((prev) => ({ ...prev, profileImage: file }));
        setPhotoPreview((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return URL.createObjectURL(file);
        });
    };

    // handle edit toggling
    const handleEditToggle = () => {
        if (isEditing) {
            // cancel: original values + selected files/preview hata do
            setFormData(originalData);
            setPhotoPreview((prev) => {
                if (prev) URL.revokeObjectURL(prev);
                return null;
            });
        }
        setIsEditing((prev) => !prev);
    };

    // handle submit
    const handleSubmit = () => {

        const licenseChanged = LICENSE_TRIGGER_FIELDS.some((k) => formData[k] !== originalData[k]);

        if (licenseChanged && !(formData.tradeLicense instanceof File)) {
            toast.error("Business details changed. Please upload a new Trade License.");
            setActiveTab('business-information');
            return;
        }
        if (formData.emirate !== originalData.emirate && !(formData.emiratesId instanceof File)) {
            toast.error("Emirate changed. Please upload a new Emirates ID.");
            setActiveTab('business-information');
            return;
        }

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
        // khali value bhi bhejo, taaki optional fields clear ho sakein
        Object.entries(payload).forEach(([key, value]) => fd.append(key, value ?? ""));

        if (formData.profileImage instanceof File) fd.append('profileImage', formData.profileImage);
        if (formData.tradeLicense instanceof File) fd.append('tradeLicense', formData.tradeLicense);
        if (formData.emiratesId instanceof File) fd.append('emiratesId', formData.emiratesId);

        updateProfile(fd, {
            onSuccess: (data) => {
                toast.success(data?.message || 'Profile updated successfully');
                // files clear, warna agle save par wahi document dobara upload hoga
                setFormData((prev) => ({ ...prev, profileImage: null, tradeLicense: null, emiratesId: null }));
                setPhotoPreview((prev) => {
                    if (prev) URL.revokeObjectURL(prev);
                    return null;
                });
                setIsEditing(false);
                queryClient.invalidateQueries({ queryKey: ['getSeller'], });
            },

            onError: (err) => {
                toast.error(err.response?.data?.message || 'Failed to update profile');
            },
        });
    };

    // handle pass change
    const handleChangePassword = () => {
        const { currentPassword, newPassword, confirmPassword } = formData;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return toast.error('All password fields are required');
        }

        if (newPassword !== confirmPassword) {
            return toast.error('New password and confirm password do not match');
        }

        if (newPassword === currentPassword) {
            return toast.error('New password must be different from current password');
        }

        changePassword({ currentPassword, newPassword }, {
            onSuccess: (data) => {
                toast.success(data?.message || 'Password changed');
                setFormData((prev) => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
            },
            onError: (err) => {
                toast.error(err.response?.data?.message || 'Failed to change password');
            },
        });
    };

    // notification
    const handleNotificationToggle = (sectionKey) => {
        setNotificationSettings((prev) => ({
            ...prev,
            [sectionKey]: {
                ...prev[sectionKey],
                enabled: !prev[sectionKey].enabled,
            },
        }));
    };

    const handleNotificationItemToggle = (sectionKey, itemKey) => {
        setNotificationSettings((prev) => ({
            ...prev,
            [sectionKey]: {
                ...prev[sectionKey],
                [itemKey]: !prev[sectionKey][itemKey],
            },
        }));
    };

    if (isLoading) return <p className="p-10 text-center">Loading seller details....</p>;
    if (isError) return <p className="p-10 text-center text-red-500">Failed to load seller details</p>;

    const isSuspended = sellerData?.accountStatus === 'suspended';
    const isApproved = sellerData?.status === 'approved';

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

                                {/* PERSONAL INFORMATION */}
                                <div className="rounded-xl border border-slate-200 bg-white p-5">
                                    <div className="mb-5">
                                        <h3 className="text-sm font-semibold text-[#0B1E3D]">Personal Information</h3>
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

                                        {/* email/phone abhi is API se edit nahi hote */}
                                        <FormInputFields
                                            label="Email Address"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Enter Email Address"
                                            required
                                            disabled
                                        />

                                        <FormInputFields
                                            label="Phone Number"
                                            name="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="Enter Phone Number"
                                            required
                                            disabled
                                        />
                                    </div>
                                </div>

                                {/* ADDRESS INFORMATION */}
                                <div className="rounded-xl border border-slate-200 bg-white p-5">
                                    <div className="mb-5">
                                        <h3 className="text-sm font-semibold text-[#0B1E3D]">Address Information</h3>
                                        <p className="text-xs text-slate-400 mt-1">Update your address information.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <FormInputFields
                                            label="Country"
                                            name="country"
                                            type="select"
                                            value={formData.country}
                                            onChange={handleChange}
                                            placeholder="Select Country"
                                            options={[{ value: "united_arab_emirates", label: "United Arab Emirates" }]}
                                            required
                                            disabled
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

                                {/* BANK INFORMATION (read-only) */}
                                <div className="rounded-xl border border-slate-200 bg-white p-5">
                                    <div className="mb-5">
                                        <h3 className="text-sm font-semibold text-[#0B1E3D]">Bank Information</h3>
                                        <p className="text-xs text-slate-400 mt-1">
                                            Bank details cannot be changed here. Please contact support to update them.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <FormInputFields
                                            label="Account Holder Name"
                                            name="accountHolderName"
                                            value={formData.accountHolderName}
                                            onChange={handleChange}
                                            placeholder="Enter Account Holder Name"
                                            disabled
                                        />

                                        <FormInputFields
                                            label="Bank Name"
                                            name="bankName"
                                            value={formData.bankName}
                                            onChange={handleChange}
                                            placeholder="Enter Bank Name"
                                            disabled
                                        />

                                        <FormInputFields
                                            label="IBAN Number"
                                            name="ibanNumber"
                                            value={formData.ibanNumber}
                                            onChange={handleChange}
                                            placeholder="Enter IBAN Number"
                                            disabled
                                        />

                                        <FormInputFields
                                            label="Account Number"
                                            name="accountNumber"
                                            value={formData.accountNumber}
                                            onChange={handleChange}
                                            placeholder="Enter Account Number"
                                            disabled
                                        />

                                        <FormInputFields
                                            label="SWIFT Code"
                                            name="swiftCode"
                                            value={formData.swiftCode}
                                            onChange={handleChange}
                                            placeholder="Enter Swift Code"
                                            disabled
                                        />

                                        <FormInputFields
                                            label="Currency"
                                            name="currency"
                                            type="select"
                                            value={formData.currency}
                                            onChange={handleChange}
                                            placeholder="Select Currency"
                                            options={[{ value: "aed_uae_dirham", label: "AED - UAE Dirham" }]}
                                            disabled
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
                                        <p className="text-xs text-slate-400 mt-1">
                                            Changing business name, type, license number or years in business requires a new Trade License.
                                        </p>
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

                                        {/* VAT abhi is API se edit nahi hota */}
                                        <FormInputFields
                                            label="VAT Number (Optional)"
                                            name="vatNumber"
                                            value={formData.vatNumber}
                                            onChange={handleChange}
                                            placeholder="Enter VAT Number (Optional)"
                                            disabled
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
                            <div className="rounded-xl border border-slate-200 bg-white p-5">
                                <div className="px-4 py-3">

                                    <div className="mb-5">
                                        <h3 className="text-sm font-semibold text-[#0B1E3D]">
                                            Notification Preferences
                                        </h3>

                                        <p className="text-xs text-slate-400 mt-1">
                                            Choose how you want to receive updates and alerts from BidDrive.
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        {notificationSections.map((section) => (
                                            <NotificationSection
                                                key={section.key}
                                                section={section}
                                                settings={notificationSettings[section.key]}
                                                onToggle={handleNotificationToggle}
                                                onItemToggle={handleNotificationItemToggle}
                                            />
                                        ))}
                                    </div>

                                </div>
                            </div>
                        )}

                        {/* edit/cancel/save buttons */}
                        {activeTab !== "notification-preferences" && (
                            <div className="mt-6 flex justify-start gap-3">
                                {!isEditing ? (
                                    <button
                                        type="button"
                                        onClick={handleEditToggle}
                                        disabled={isSuspended || !isApproved}
                                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#D97706] text-white text-xs font-semibold hover:bg-[#B45309] active:scale-[0.98] transition-all duration-200 shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
                        )}
                    </div>

                    {/* ================= RIGHT : SUMMARY CARD ================= */}
                    <div className="lg:col-span-4">

                        {/* 1st tab */}
                        {activeTab === "account-details" && (
                            <div className="space-y-4">

                                {/* Profile Photo */}
                                <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                                    <div className="px-4 py-3">
                                        <h3 className="text-sm font-semibold text-[#0B1E3D]">Profile Photo</h3>

                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            className="hidden"
                                            onChange={handlePhotoSelect}
                                        />

                                        <div className="flex items-center gap-4 mt-3">
                                            <div className="relative shrink-0">
                                                <div className="w-25 h-25 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                                                    <img
                                                        src={photoPreview || sellerData?.profileImage || "/profile-placeholder.png"}
                                                        alt="Profile"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>

                                                <button
                                                    type="button"
                                                    disabled={!isEditing}
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="absolute -right-1 bottom-0 w-8 h-8 rounded-full bg-[#D97706] text-white flex items-center justify-center border-2 border-white hover:bg-[#B45309] transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <Camera size={16} />
                                                </button>
                                            </div>

                                            <div className="flex-1">
                                                <p className="text-[13px] font-medium text-slate-700">Upload a clear profile photo</p>
                                                <p className="text-xs text-slate-400 mt-1">JPG, PNG, WEBP (Max 2MB)</p>

                                                <div className="flex items-center gap-2 mt-2">
                                                    <button
                                                        type="button"
                                                        disabled={!isEditing}
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className="px-3 py-1.5 rounded-md bg-[#D97706] text-white text-[11px] font-semibold hover:bg-[#B45309] transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        Change Photo
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
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold capitalize
                                                ${isSuspended ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${isSuspended ? 'bg-red-500' : 'bg-green-500'}`} />
                                                {sellerData?.accountStatus || 'active'}
                                            </span>
                                        </div>

                                        <div className="divide-y divide-slate-100">
                                            <div className="flex items-center justify-between py-2">
                                                <div className="flex items-center gap-2">
                                                    <User size={15} className="text-slate-500" />
                                                    <span className="text-[12px] text-slate-600">Seller ID</span>
                                                </div>
                                                <span className="text-[14px] font-semibold text-slate-700">{sellerData?.sellerId || '-'}</span>
                                            </div>

                                            <div className="flex items-center justify-between py-2">
                                                <div className="flex items-center gap-2">
                                                    <Building2 size={15} className="text-slate-500" />
                                                    <span className="text-[12px] text-slate-600">Account Type</span>
                                                </div>
                                                {isApproved ? (
                                                    <span className="flex items-center gap-1 text-[14px] font-medium text-green-600">
                                                        <ShieldCheck size={13} /> Verified Seller
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-[14px] font-medium text-amber-600 capitalize">
                                                        <ShieldAlert size={13} /> {sellerData?.status || 'pending'}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between py-2">
                                                <div className="flex items-center gap-2">
                                                    <Mail size={15} className="text-slate-500" />
                                                    <span className="text-[12px] text-slate-600">Email Verification</span>
                                                </div>
                                                {sellerData?.isEmailVerified ? (
                                                    <span className="flex items-center gap-1 text-[14px] font-medium text-green-600">
                                                        <ShieldCheck size={13} /> Verified
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-[14px] font-medium text-amber-600">
                                                        <ShieldAlert size={13} /> Not verified
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between py-2">
                                                <div className="flex items-center gap-2">
                                                    <Phone size={15} className="text-slate-500" />
                                                    <span className="text-[12px] text-slate-600">Phone Verification</span>
                                                </div>
                                                {sellerData?.isPhoneVerified ? (
                                                    <span className="flex items-center gap-1 text-[14px] font-medium text-green-600">
                                                        <ShieldCheck size={13} /> Verified
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-[14px] font-medium text-amber-600">
                                                        <ShieldAlert size={13} /> Not verified
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Change Password  */}
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
                                                onClick={handleChangePassword}
                                                disabled={isPasswordPending}
                                                className="w-full py-2.5 rounded-lg border border-[#D97706] text-[#D97706] text-[13px] font-semibold hover:bg-[#D97706] hover:text-white transition-colors"
                                            >
                                                {isPasswordPending ? 'Updating...' : 'Update Password'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 2nd tab */}
                        {activeTab === "business-information" && (
                            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                                <div className="px-4 py-3 space-y-4">

                                    <div className="mb-5">
                                        <h3 className="text-sm font-semibold text-[#0B1E3D]">Business Documents</h3>
                                        <p className="text-xs text-slate-400 mt-1">Manage and update your business documents.</p>
                                    </div>

                                    <FormInputFields
                                        label="Trade License"
                                        name="tradeLicense"
                                        type="file"
                                        value={formData.tradeLicense}
                                        onChange={(name, file) => handleFileUpload(name, file)}
                                        disabled={!isEditing}
                                    />
                                    <DocStatus doc={sellerData?.tradeLicense} />

                                    <FormInputFields
                                        label="Emirates ID / Passport"
                                        name="emiratesId"
                                        type="file"
                                        value={formData.emiratesId}
                                        onChange={(name, file) => handleFileUpload(name, file)}
                                        disabled={!isEditing}
                                    />
                                    <DocStatus doc={sellerData?.emiratesId} />

                                    {/* in dono ka upload backend mein abhi nahi hai */}
                                    <FormInputFields
                                        label="Bank Statement"
                                        name="bankStatement"
                                        type="file"
                                        value={formData.bankStatement}
                                        onChange={(name, file) => handleFileUpload(name, file)}
                                        disabled
                                    />
                                    <DocStatus doc={sellerData?.bankStatement} />

                                    <FormInputFields
                                        label="VAT Certificate"
                                        name="vatCertificate"
                                        type="file"
                                        value={formData.vatCertificate}
                                        onChange={(name, file) => handleFileUpload(name, file)}
                                        disabled
                                    />
                                    <DocStatus doc={sellerData?.vatCertificate} />
                                </div>
                            </div>
                        )}

                        {/* 3rd tab */}
                        {activeTab === "notification-preferences" && (
                            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                                <div className="px-5 py-7">

                                    {/* Icon */}
                                    <div className="flex justify-center">
                                        <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center">
                                            <Bell
                                                size={36}
                                                strokeWidth={1.8}
                                                className="text-[#D97706]"
                                            />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="text-center mt-6">
                                        <h3 className="text-base font-semibold text-[#0B1E3D]">
                                            Stay Informed. Stay Ahead.
                                        </h3>

                                        <p className="text-xs leading-5 text-slate-400 mt-2 ">
                                            Customize your notification preferences to never miss
                                            an important update on BidDrive.
                                        </p>
                                    </div>

                                    {/* Info Box */}
                                    <div className="mt-6 rounded-lg bg-[#D97706]/5 px-3.5 py-3 flex items-start gap-2.5">
                                        <Lightbulb
                                            size={19}
                                            strokeWidth={2}
                                            className="text-[#D97706] shrink-0 mt-0.5"
                                        />

                                        <p className="text-[12px] leading-4 text-slate-500">
                                            You can always change your notification preferences
                                            at any time.
                                        </p>
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
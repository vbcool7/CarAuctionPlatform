
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { Pencil, Building2, User, Briefcase, FileText, ExternalLink } from 'lucide-react';
import { HiOutlineCamera } from 'react-icons/hi2';
import BuyerCustomDropdown from '../BuyerSharedComponents/BuyerCustomDropdown';
import { useBuyerGet, useUpdateBuyerProfile } from '../../../hook/useBuyer';
import useAuthStore from '../../../store/useAuthStore';

const INPUT_CLASS =
    'w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-50 focus:border-[#D97706] transition-all text-[#0B1E3D] disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed';

const LABEL_CLASS = 'text-[12px] font-semibold text-slate-500 uppercase tracking-wide';

const IDENTITY_TYPES = {
    passport: 'Passport',
    national_id: 'National ID',
    driving_license: 'Driving License',
};

const ADDRESS_TYPES = {
    bank_statement: 'Bank Statement',
    utility_bill: 'Utility Bill',
    rental_agreement: 'Rental Agreement',
};

const STATUS_STYLES = {
    pending: 'bg-amber-50 text-amber-600',
    approved: 'bg-green-50 text-green-600',
    rejected: 'bg-red-50 text-red-600',
};

const dropdownOptions = {
    buyingInterests: ['Sedans', 'SUVs', 'Trucks', 'Luxury', 'Sports Cars', 'Classic Cars', 'Electric Vehicles', 'Motorcycles', 'Vans', 'Pickups'],
    preferredBrands: ['Toyota', 'BMW', 'Mercedes-Benz', 'Audi', 'Ford', 'Chevrolet', 'Nissan', 'Honda', 'Porsche', 'Land Rover', 'Lexus', 'Ferrari', 'Lamborghini'],
    preferredLocations: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'],
};

const buyerTypeConfig = [
    { value: 'individual', title: 'Individual', icon: User, description: 'I am buying as an individual.' },
    { value: 'dealer', title: 'Dealer', icon: Briefcase, description: 'I am a registered car dealer.' },
    { value: 'business', title: 'Business', icon: Building2, description: 'I represent a business.' },
];

const toLabel = (value) =>
    value ? String(value).replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : '—';

const formatDate = (value) =>
    value
        ? new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' })
        : '—';

const noop = () => { };

// ── helpers (component ke BAHAR, taaki typing pe remount na ho) ──

const ComingSoonPill = () => (
    <span className="ml-2 bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded normal-case tracking-normal">
        Coming soon
    </span>
);

// fieldset disabled: andar ke saare native inputs/buttons disable, pointer-events-none custom dropdown ke liye
const ComingSoonBlock = ({ children, className = '' }) => (
    <fieldset disabled className={`min-w-0 opacity-60 pointer-events-none select-none ${className}`}>
        {children}
    </fieldset>
);

const InputField = ({ label, value, onChange, disabled = false, comingSoon = false, ...rest }) => (
    <div className="flex flex-col gap-1.5">
        <label className={LABEL_CLASS}>
            {label}
            {comingSoon && <ComingSoonPill />}
        </label>
        <input
            type="text"
            value={value ?? ''}
            onChange={onChange}
            disabled={disabled}
            className={INPUT_CLASS}
            {...rest}
        />
    </div>
);

const DocGroup = ({ title, typeLabel, status, rejectionReason, files }) => (
    <div className="rounded-xl border border-slate-200 p-4">
        <div className="flex items-center justify-between gap-3 mb-3">
            <div>
                <p className="text-sm font-bold text-[#0B1E3D]">{title}</p>
                <p className="text-[12px] text-slate-500">{typeLabel}</p>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${STATUS_STYLES[status] || 'bg-slate-100 text-slate-500'}`}>
                {status || 'pending'}
            </span>
        </div>

        {status === 'rejected' && rejectionReason && (
            <p className="text-[12px] text-red-500 mb-3">{rejectionReason}</p>
        )}

        <div className="flex flex-wrap gap-4">
            {files.filter((f) => f.url).map((f) => (
                <a
                    key={f.label}
                    href={f.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#D97706] hover:underline"
                >
                    <FileText size={14} />
                    {f.label}
                    <ExternalLink size={12} />
                </a>
            ))}
        </div>
    </div>
);

function BuyerProfilePersonalInfo() {

    const user = useAuthStore((s) => s.user);
    const { data: buyer, isLoading, isError } = useBuyerGet(user?.id);
    const { mutate: updateProfile, isPending } = useUpdateBuyerProfile();

    const fileInputRef = useRef(null);

    const [isEditing, setIsEditing] = useState(false);
    const [mobile, setMobile] = useState('');
    const [photoFile, setPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);

    // server data -> form (edit mode band ho tab; cancel/save ke baad bhi reset)
    useEffect(() => {
        if (buyer && !isEditing) setMobile(buyer.mobile || '');
    }, [buyer, isEditing]);

    // preview URL cleanup (naya preview aane pe / unmount pe purana revoke)
    useEffect(() => {
        return () => {
            if (photoPreview) URL.revokeObjectURL(photoPreview);
        };
    }, [photoPreview]);

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

        setPhotoFile(file);
        setPhotoPreview(URL.createObjectURL(file));
    };

    const resetEdit = () => {
        setIsEditing(false);
        setPhotoFile(null);
        setPhotoPreview(null);
    };

    const mobileChanged = mobile.trim() !== (buyer?.mobile || '');
    const hasChanges = mobileChanged || !!photoFile;

    const handleSave = () => {
        if (mobileChanged && !/^\d{10}$/.test(mobile.trim())) {
            return toast.error('Mobile number must be 10 digits');
        }

        const fd = new FormData();
        if (mobileChanged) fd.append('mobile', mobile.trim());
        if (photoFile) fd.append('profileImage', photoFile);

        updateProfile(fd, {
            onSuccess: (data) => {
                toast.success(data?.message || 'Profile updated successfully');
                resetEdit();
            },
            onError: (err) => {
                toast.error(err?.response?.data?.message || 'Failed to update profile');
            },
        });
    };

    if (isLoading) return <p className="p-10 text-center">Loading profile...</p>;
    if (isError || !buyer) return <p className="p-10 text-center text-red-500">Failed to load profile</p>;

    const showBusinessInfo = ['dealer', 'business'].includes(buyer.buyerType);
    const photoSrc = photoPreview || buyer.profileImageUrl;

    const identity = buyer.identityVerification || {};
    const address = buyer.addressVerification || {};

    return (
        <>
            {/* ── Personal Info + Account Info Card ── */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm w-full">

                {/* Photo Upload Row */}
                <div className="flex flex-col md:flex-row items-center md:items-end gap-5 mb-8 pb-8 border-b border-slate-100">
                    <div className="relative shrink-0">
                        {photoSrc ? (
                            <img
                                src={photoSrc}
                                alt="Profile"
                                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center border-4 border-white shadow-xl">
                                <HiOutlineCamera size={28} className="text-slate-400" />
                            </div>
                        )}

                        <input
                            ref={fileInputRef}
                            type="file"
                            hidden
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handlePhotoSelect}
                        />
                        <button
                            type="button"
                            disabled={!isEditing}
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 bg-[#D97706] p-2 rounded-full text-white shadow-lg border-2 border-white transition-all enabled:hover:scale-110 enabled:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <HiOutlineCamera size={16} />
                        </button>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-[#0B1E3D]">Upload Photo</p>
                        <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide mt-0.5">
                            JPG, PNG, WEBP (Max 2 MB)
                        </p>
                        {!isEditing && (
                            <p className="text-[11px] text-slate-400 mt-1">Click Edit to change your photo.</p>
                        )}
                    </div>
                </div>

                {/* Personal Information */}
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-base font-bold text-[#0B1E3D]">
                        Personal Information
                    </h2>
                    <button
                        type="button"
                        onClick={() => (isEditing ? resetEdit() : setIsEditing(true))}
                        disabled={isPending}
                        className="flex items-center gap-1.5 text-sm text-[#D97706] font-semibold hover:text-amber-600 transition-colors cursor-pointer disabled:opacity-50"
                    >
                        {isEditing ? 'Cancel' : <><Pencil size={14} /> Edit</>}
                    </button>
                </div>
                <p className="text-[12px] text-slate-400 mb-6">
                    Name, date of birth and email can't be changed here. Contact Support to update these details.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                    <InputField label="First Name" value={buyer.firstName} disabled />
                    <InputField label="Last Name" value={buyer.lastName} disabled />
                    <InputField label="Username" value="" placeholder="—" disabled comingSoon />
                    <InputField label="Email Address" value={buyer.email} disabled />
                    <InputField label="Date of Birth" value={formatDate(buyer.dob)} disabled />
                    <InputField
                        label="Phone Number"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        disabled={!isEditing}
                        inputMode="numeric"
                        maxLength={10}
                        placeholder="10 digit mobile number"
                    />

                    <ComingSoonBlock>
                        <BuyerCustomDropdown
                            label="Preferred Language (Coming soon)"
                            options={['English', 'Arabic', 'French', 'Urdu']}
                            selected="English"
                            onChange={noop}
                        />
                    </ComingSoonBlock>
                </div>

                {/* Account Information */}
                <div className="flex justify-between items-center mb-6 pt-6 border-t border-slate-100">
                    <h2 className="text-base font-bold text-[#0B1E3D]">
                        Account Information
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                    <InputField label="Account Type" value={toLabel(buyer.role)} disabled />
                    <InputField label="Member Since" value={formatDate(buyer.createdAt)} disabled />

                    <ComingSoonBlock>
                        <BuyerCustomDropdown
                            label="Timezone (Coming soon)"
                            options={['(GMT +04:00) Dubai, UAE']}
                            selected="(GMT +04:00) Dubai, UAE"
                            onChange={noop}
                        />
                    </ComingSoonBlock>
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
                        {buyerTypeConfig.map(({ value, title, icon: Icon, description }) => {
                            const isActive = buyer.buyerType === value;
                            return (
                                <div
                                    key={value}
                                    className={`relative flex items-start gap-3 p-4 rounded-xl border-2 transition-all
                                        ${isActive
                                            ? 'border-[#D97706] bg-amber-50'
                                            : 'border-slate-200 bg-white opacity-50'
                                        }`}
                                >
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
                                                {title}
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
                            <InputField label="Company Name" value={buyer.companyName} disabled />
                            <InputField label="Registration Number" value={buyer.registrationNumber} disabled />
                            <InputField label="VAT Number (Optional)" value={buyer.vatNumber || '—'} disabled />
                        </div>
                    </div>
                )}
            </div>

            {/* ── Verification Documents (view only) ── */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm w-full mt-5">
                <div className="mb-5">
                    <h2 className="text-base font-bold text-[#0B1E3D]">Verification Documents</h2>
                    <p className="text-[13px] text-slate-500 mt-1">
                        Documents submitted at registration. To update them, contact Support.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DocGroup
                        title="Identity Verification"
                        typeLabel={IDENTITY_TYPES[identity.documentType] || toLabel(identity.documentType)}
                        status={identity.status}
                        rejectionReason={identity.rejectionReason}
                        files={[
                            { label: 'Front', url: identity.frontImageUrl },
                            { label: 'Back', url: identity.backImageUrl },
                            { label: 'Selfie', url: identity.selfieImageUrl },
                        ]}
                    />
                    <DocGroup
                        title="Address Verification"
                        typeLabel={ADDRESS_TYPES[address.documentType] || toLabel(address.documentType)}
                        status={address.status}
                        rejectionReason={address.rejectionReason}
                        files={[
                            { label: 'Document', url: address.documentUrl },
                            { label: 'Landlord ID', url: address.landlordIdUrl },
                        ]}
                    />
                </div>
            </div>

            {/* ── Save Button ── */}
            <div className="mt-6">
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={!isEditing || !hasChanges || isPending}
                    className="flex items-center gap-2 bg-[#D97706] text-white text-sm font-medium px-4 py-2 rounded-lg
                        transition-all duration-200 ease-in-out
                        enabled:hover:bg-amber-600 enabled:hover:shadow-md
                        enabled:active:scale-[0.97] enabled:active:bg-amber-700 enabled:cursor-pointer
                        disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </>
    );
}

export default BuyerProfilePersonalInfo;
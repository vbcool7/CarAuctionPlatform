
import React, { useState } from 'react';
import { EyeOff, Eye, Download, Gavel, FileCheck, Award, XCircle, ShieldCheck, MapPin, Mail, Ban } from 'lucide-react';

import InputField from './Shared/InputField';
import FormPageHeader from './Shared/FormPageHeader';
import AccountStatusCard from './Shared/AccountStatusCard';
import NotesCard from './Shared/NotesCard';

import { useGetBuyerById } from '../../hooks/useBuyer';

export function WalletSummary() {
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-[14px] md:text-base font-bold text-slate-900 mb-4">
                Wallet Summary
            </h3>
            <div className="space-y-3 mb-4">
                <div className="flex justify-between text-[13px] md:text-sm">
                    <span className="text-slate-500">Total Balance</span>
                    <span className="font-bold text-slate-900">AED 20,2000</span>
                </div>
                <div className="flex justify-between text-[13px] md:text-sm">
                    <span className="text-slate-500">Pending Deposits</span>
                    <span className="font-semibold text-slate-900">AED 20,2000</span>
                </div>
                <div className="flex justify-between text-[13px] md:text-sm">
                    <span className="text-slate-500">Total Spent</span>
                    <span className="font-semibold text-slate-900">AED 20,2000</span>
                </div>
            </div>
            <button
                // onClick={onViewHistory}
                className="w-full py-1.5 md:py-2 text-sm font-medium text-[#D97706] border border-[#D97706] rounded-lg hover:bg-amber-50">
                View Wallet History
            </button>
        </div>
    );
}

function BuyerDetail({ buyerId, setCurrentPage }) {

    const { data: buyerData, isLoading, isError } = useGetBuyerById(buyerId);
    const buyer = buyerData?.data;

    const [isEditing, setIsEditing] = useState(null);
    const [editData, setEditData] = useState(buyer);

    const [showPassword, setShowPassword] = useState(false);

    const updateField = (name, value) => {
        setEditData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditClick = () => {
        setEditData(buyer);
        setIsEditing(true);
    };

    const handleSave = () => {
        console.log('saving buyer:', editData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditData(buyer);
        setIsEditing(false);
    };

    const data = isEditing ? editData : buyer;

    const activityStats = [
        { label: "Auctions Participated", value: '--', icon: Gavel, color: "text-blue-600 bg-blue-50" },
        { label: "Bids Placed", value: '--', icon: FileCheck, color: "text-emerald-600 bg-emerald-50" },
        { label: "Auctions Won", value: '--', icon: Award, color: "text-purple-600 bg-purple-50" },
        { label: "Auctions Lost", value: '--', icon: XCircle, color: "text-orange-500 bg-orange-50" },
    ];

    const personalFields = [
        { label: "First Name", name: "firstName", value: data?.firstName },
        { label: "last Name", name: "lastName", value: data?.lastName },
        { label: "Email Address", name: "email", value: data?.email, badge: buyer?.isEmailVerified ? "Verified" : null },
        { label: "Date of Birth", name: "dob", value: data?.dob ? new Date(data.dob).toLocaleDateString() : null },
        { label: "Phone Number", name: "mobile", value: data?.mobile, badge: buyer?.isMobileVerified ? "Verified" : null },
        { label: "Gender", name: "gender", value: data?.gender },
        { label: "Nationality", name: "nationality", value: data?.nationality },
        { label: "Country", name: "country", value: data?.country },
        { label: "Emirate", name: "emirate", value: data?.emirate },
        { label: "City", name: "city", value: data?.city },
        { label: "Address", name: "address", value: data?.address },
        { label: "Pincode", name: "pincode", value: data?.pincode }
    ];

    if (isLoading) return <div>Loading...</div>;
    if (isError || !buyer) return <div>Buyer not found</div>;

    return (
        <div>
            {/* heading */}
            <FormPageHeader
                title="Buyer Details"
                breadcrumbItems={[
                    { label: 'Dashboard', onClick: () => setCurrentPage('dashboard') },
                    { label: 'Buyers', onClick: () => setCurrentPage('buyers') },
                    { label: 'Buyer Details' },
                ]}
                onBack={() => setCurrentPage('buyers')}
                backLabel="Back to Buyers"
                backLabelOnMob="Back"
            />

            {/* buyer detail */}
            <div className="grid grid-cols-1 xl:grid-cols-3 pb-6 gap-6 items-start">

                {/* left side - section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm">

                        {/* Header Section */}
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5 md:mb-6">

                            {/* Left Section */}
                            <div className="flex items-start gap-4 flex-1 min-w-0">
                                <img
                                    src={buyer.profileImageUrl || "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg"}
                                    alt={buyer.firstName}
                                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover shrink-0"
                                />

                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h2 className="text-sm md:text-lg font-bold text-slate-900 wrap-break-word">
                                            {`${buyer.firstName || ''} ${buyer.lastName || ''}`.trim()}
                                        </h2>

                                        {buyer.kycStatus === "approved" && (
                                            <span className="bg-green-50 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-md whitespace-nowrap">
                                                Verified
                                            </span>
                                        )}
                                    </div>

                                    <p className="mt-1 text-xs sm:text-sm text-slate-500">
                                        Buyer ID:
                                        <span className="font-semibold text-slate-900 ml-1">
                                            {buyer.buyerId || "--"}
                                        </span>
                                    </p>

                                    <p className="text-xs sm:text-sm text-slate-500">
                                        Member Since:
                                        <span className="ml-1">
                                            {buyer.createdAt
                                                ? new Date(buyer.createdAt).toLocaleDateString()
                                                : '--'}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {/* Right Section */}
                            <div className="flex flex-wrap justify-start lg:justify-end gap-3 shrink-0">
                                {!isEditing ? (
                                    <button
                                        onClick={handleEditClick}
                                        className="px-4 py-2 text-sm font-medium rounded-xl border border-amber-200 text-[#D97706] hover:bg-amber-50 transition"
                                    >
                                        Edit Buyer
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleSave}
                                            className="px-4 py-2 text-sm font-medium rounded-xl bg-[#D97706] text-white hover:bg-amber-700 transition"
                                        >
                                            Save
                                        </button>

                                        <button
                                            onClick={handleCancel}
                                            className="px-4 py-2 text-sm font-medium rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                )}
                            </div>

                        </div>

                        <hr className="my-4 md:my-6 border-slate-100" />

                        {/* Personal Information */}
                        <div className="md:mb-8">
                            <h3 className="font-bold md:text-slate-900 mb-4">
                                Personal Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {personalFields.map((item, i) => (
                                    <div key={i}>
                                        {isEditing ? (
                                            <InputField
                                                label={item.label}
                                                name={item.name}
                                                value={item.value || ''}
                                                onChange={updateField}
                                            />
                                        ) : (
                                            <>
                                                <p className="text-xs text-slate-500 uppercase">{item.label}</p>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-semibold text-slate-700">{item.value || '--'}</p>
                                                    {item.badge && <span className="text-[10px] bg-green-50 text-green-600 px-1.5 rounded">{item.badge}</span>}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <hr className="my-4 md:my-6 border-slate-100" />

                        {/* Account Information */}
                        <div className="md:mb-8">
                            <h3 className="font-bold text-slate-900 mb-4">
                                Account Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                                {/* last login */}
                                <div>
                                    <p className="text-xs text-slate-500 uppercase">Last Login</p>
                                    <p className="text-sm font-semibold text-slate-700">
                                        {buyer.lastLoginAt
                                            ? new Date(buyer.lastLoginAt).toLocaleString()
                                            : '--'}
                                    </p>
                                </div>

                                {/* acc status */}
                                <div>
                                    <p className="text-xs text-slate-500 uppercase mb-1">
                                        Account Status
                                    </p>
                                    {isEditing ? (
                                        <select
                                            value={editData.status || ''}
                                            onChange={(e) => updateField('status', e.target.value)}
                                            className="text-sm border border-slate-200 rounded-lg px-3 py-1.5"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="approved">Approved</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                    ) : (
                                        <span className="text-[12px] bg-green-50 text-green-700 font-semibold px-2 py-0.5 rounded capitalize">
                                            {buyer.status || '--'}
                                        </span>
                                    )}
                                </div>

                                {/* 2fa */}
                                {/* <div>
                                    <p className="text-xs text-slate-500 uppercase mb-1">
                                        Two Factor Authentication
                                    </p>
                                    {isEditing ? (
                                        <label className="flex items-center gap-2 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={!!editData.twoFAEnabled}
                                                onChange={(e) => updateField('twoFAEnabled', e.target.checked)}
                                            />
                                            {editData.twoFAEnabled ? 'Enabled' : 'Disabled'}
                                        </label>
                                    ) : (
                                        <span className="text-[12px] bg-green-50 text-green-700 font-semibold px-2 py-0.5 rounded">
                                            {buyer.twoFAEnabled ? 'Enabled' : 'Disabled'}
                                        </span>
                                    )}
                                </div> */}

                                {/* login ip add */}
                                {/* <div>
                                    <p className="text-xs text-slate-500 uppercase">
                                        Login IP Address
                                    </p>
                                    <p className="text-sm font-semibold text-slate-700">{buyer.loginIP || '--'}</p>
                                </div> */}

                                {/* mail notification */}
                                {/* <div>
                                    <p className="text-xs text-slate-500 uppercase mb-1">
                                        Email Notifications
                                    </p>
                                    {isEditing ? (
                                        <label className="flex items-center gap-2 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={!!editData.emailNotifications}
                                                onChange={(e) => updateField('emailNotifications', e.target.checked)}
                                            />
                                            {editData.emailNotifications ? 'Enabled' : 'Disabled'}
                                        </label>
                                    ) : (
                                        <span className="text-[12px] bg-green-50 text-green-700 font-semibold px-2 py-0.5 rounded">
                                            {buyer.emailNotifications ? 'Enabled' : 'Disabled'}
                                        </span>
                                    )}
                                </div> */}
                            </div>
                        </div>

                        <hr className="my-4 md:my-6 border-slate-100" />

                        {/* Identity Verification */}
                        <div>
                            <h3 className="font-bold text-slate-900 mb-4">
                                KYC / Identity Verification
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                                {/* Status */}
                                <div className="min-w-0">
                                    <p className="text-xs text-slate-500 uppercase mb-1">
                                        Verification Status
                                    </p>

                                    <span
                                        className={`inline-block text-xs font-semibold px-2 py-0.5 rounded capitalize ${buyer.identityVerification?.status === "approved"
                                            ? "bg-green-50 text-green-700"
                                            : buyer.identityVerification?.status === "rejected"
                                                ? "bg-red-50 text-red-700"
                                                : "bg-amber-50 text-amber-700"
                                            }`}
                                    >
                                        {buyer.identityVerification?.status || "--"}
                                    </span>
                                </div>

                                {/* Document Type */}
                                <div className="min-w-0">
                                    <p className="text-xs text-slate-500 uppercase mb-1">
                                        Document Type
                                    </p>

                                    <p className="text-sm font-semibold text-slate-700 capitalize">
                                        {buyer.identityVerification?.documentType
                                            ? buyer.identityVerification.documentType.replaceAll("_", " ")
                                            : "--"}
                                    </p>
                                </div>

                                {/* Front Document */}
                                <div className="min-w-0">
                                    <p className="text-xs text-slate-500 uppercase mb-1">
                                        Front Document
                                    </p>

                                    {buyer.identityVerification?.frontImageUrl ? (
                                        <a
                                            href={buyer.identityVerification.frontImageUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-sm font-semibold text-[#D97706] hover:underline"
                                        >
                                            View Document
                                            <Download size={14} />
                                        </a>
                                    ) : (
                                        <p className="text-sm text-slate-400">--</p>
                                    )}
                                </div>

                                {/* Back Document */}
                                <div className="min-w-0">
                                    <p className="text-xs text-slate-500 uppercase mb-1">
                                        Back Document
                                    </p>

                                    {buyer.identityVerification?.backImageUrl ? (
                                        <a
                                            href={buyer.identityVerification.backImageUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-sm font-semibold text-[#D97706] hover:underline"
                                        >
                                            View Document
                                            <Download size={14} />
                                        </a>
                                    ) : (
                                        <p className="text-sm text-slate-400">--</p>
                                    )}
                                </div>

                                {/* Selfie */}
                                <div className="min-w-0">
                                    <p className="text-xs text-slate-500 uppercase mb-1">
                                        Selfie
                                    </p>

                                    {buyer.identityVerification?.selfieImageUrl ? (
                                        <a
                                            href={buyer.identityVerification.selfieImageUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-sm font-semibold text-[#D97706] hover:underline"
                                        >
                                            View Selfie
                                            <Download size={14} />
                                        </a>
                                    ) : (
                                        <p className="text-sm text-slate-400">--</p>
                                    )}
                                </div>

                                {/* Reviewed On */}
                                <div className="min-w-0">
                                    <p className="text-xs text-slate-500 uppercase mb-1">
                                        Reviewed On
                                    </p>

                                    <p className="text-sm font-semibold text-slate-700">
                                        {buyer.identityVerification?.reviewedAt
                                            ? new Date(
                                                buyer.identityVerification.reviewedAt
                                            ).toLocaleString()
                                            : "--"}
                                    </p>
                                </div>

                                {/* Rejection Reason */}
                                {buyer.identityVerification?.status === "rejected" && (
                                    <div className="min-w-0 md:col-span-3">
                                        <p className="text-xs text-slate-500 uppercase mb-1">
                                            Rejection Reason
                                        </p>

                                        <p className="text-sm font-semibold text-red-600">
                                            {buyer.identityVerification?.rejectionReason || "--"}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <hr className="my-4 md:my-6 border-slate-100" />

                        {/* Address Verification */}
                        <div>
                            <h3 className="font-bold text-slate-900 mb-4">
                                Address Verification
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                                {/* Status */}
                                <div className="min-w-0">
                                    <p className="text-xs text-slate-500 uppercase mb-1">
                                        Verification Status
                                    </p>

                                    <span
                                        className={`inline-block text-xs font-semibold px-2 py-0.5 rounded capitalize ${buyer.addressVerification?.status === "approved"
                                            ? "bg-green-50 text-green-700"
                                            : buyer.addressVerification?.status === "rejected"
                                                ? "bg-red-50 text-red-700"
                                                : "bg-amber-50 text-amber-700"
                                            }`}
                                    >
                                        {buyer.addressVerification?.status || "--"}
                                    </span>
                                </div>

                                {/* Document Type */}
                                <div className="min-w-0">
                                    <p className="text-xs text-slate-500 uppercase mb-1">
                                        Document Type
                                    </p>

                                    <p className="text-sm font-semibold text-slate-700 capitalize">
                                        {buyer.addressVerification?.documentType
                                            ? buyer.addressVerification.documentType.replaceAll("_", " ")
                                            : "--"}
                                    </p>
                                </div>

                                {/* Address Document */}
                                <div className="min-w-0">
                                    <p className="text-xs text-slate-500 uppercase mb-1">
                                        Address Document
                                    </p>

                                    {buyer.addressVerification?.documentUrl ? (
                                        <a
                                            href={buyer.addressVerification.documentUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-sm font-semibold text-[#D97706] hover:underline"
                                        >
                                            View Document
                                            <Download size={14} />
                                        </a>
                                    ) : (
                                        <p className="text-sm text-slate-400">--</p>
                                    )}
                                </div>

                                {/* Landlord ID */}
                                {buyer.addressVerification?.documentType === "rental_agreement" && (
                                    <div className="min-w-0">
                                        <p className="text-xs text-slate-500 uppercase mb-1">
                                            Landlord ID
                                        </p>

                                        {buyer.addressVerification?.landlordIdUrl ? (
                                            <a
                                                href={buyer.addressVerification.landlordIdUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-sm font-semibold text-[#D97706] hover:underline"
                                            >
                                                View Landlord ID
                                                <Download size={14} />
                                            </a>
                                        ) : (
                                            <p className="text-sm text-slate-400">--</p>
                                        )}
                                    </div>
                                )}

                                {/* Reviewed On */}
                                <div className="min-w-0">
                                    <p className="text-xs text-slate-500 uppercase mb-1">
                                        Reviewed On
                                    </p>

                                    <p className="text-sm font-semibold text-slate-700">
                                        {buyer.addressVerification?.reviewedAt
                                            ? new Date(
                                                buyer.addressVerification.reviewedAt
                                            ).toLocaleString()
                                            : "--"}
                                    </p>
                                </div>

                                {/* Rejection Reason */}
                                {buyer.addressVerification?.status === "rejected" && (
                                    <div className="min-w-0 md:col-span-3">
                                        <p className="text-xs text-slate-500 uppercase mb-1">
                                            Rejection Reason
                                        </p>

                                        <p className="text-sm font-semibold text-red-600">
                                            {buyer.addressVerification?.rejectionReason || "--"}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <hr className="my-4 md:my-6 border-slate-100" />

                        {/* Buyer / Business Information */}
                        <div>
                            <h3 className="font-bold text-slate-900 mb-4">
                                Buyer / Business Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                                {/* Buyer Type */}
                                <div>
                                    <p className="text-xs text-slate-500 uppercase mb-1">
                                        Buyer Type
                                    </p>

                                    <p className="text-sm font-semibold text-slate-700 capitalize">
                                        {buyer.buyerType || "--"}
                                    </p>
                                </div>

                                {/* Company Name */}
                                <div>
                                    <p className="text-xs text-slate-500 uppercase mb-1">
                                        Company Name
                                    </p>

                                    <p className="text-sm font-semibold text-slate-700">
                                        {buyer.companyName || "--"}
                                    </p>
                                </div>

                                {/* Registration Number */}
                                <div>
                                    <p className="text-xs text-slate-500 uppercase mb-1">
                                        Registration Number
                                    </p>

                                    <p className="text-sm font-semibold text-slate-700 break-all">
                                        {buyer.registrationNumber || "--"}
                                    </p>
                                </div>

                                {/* VAT Number */}
                                <div>
                                    <p className="text-xs text-slate-500 uppercase mb-1">
                                        VAT Number
                                    </p>

                                    <p className="text-sm font-semibold text-slate-700 break-all">
                                        {buyer.vatNumber || "--"}
                                    </p>
                                </div>

                            </div>
                        </div>

                        <hr className="my-4 md:my-6 border-slate-100" />

                        {/* feature bar */}
                        <div>
                            <h3 className="text-[14px] md:text-base font-bold text-slate-900 mb-4">
                                Activity Summary
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {activityStats.map((stat, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                                        <div className={`p-3 rounded-full ${stat.color}`}>
                                            <stat.icon size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xl md:text-2xl font-bold text-slate-900">
                                                {stat.value}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {stat.label}
                                            </p>

                                            <button
                                                className="text-xs font-semibold text-[#D97706] hover:underline mt-1 block">
                                                View All
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* right side - section */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">

                    {/* RIGHT SIDE */}
                    <div className="space-y-5">

                        {/* Account Status */}
                        <AccountStatusCard
                            fields={[
                                {
                                    label: 'Status',
                                    value: buyer?.status || 'active',
                                    type: 'badge',
                                },
                                {
                                    label: 'KYC Status',
                                    value: buyer?.kycStatus || 'pending',
                                    type: 'badge',
                                },
                                {
                                    label: 'Email Verified',
                                    value: buyer?.isEmailVerified || false,
                                    type: 'boolean',
                                },
                                {
                                    label: 'Phone Verified',
                                    value: buyer?.isMobileVerified || false,
                                    type: 'boolean',
                                },
                                {
                                    label: 'Suspended',
                                    value: buyer?.status === 'rejected',
                                    type: 'boolean',
                                },
                            ]}
                        />

                        {/* KYC Verification Summary */}
                        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

                            <div className="px-5 py-4 border-b border-slate-200">
                                <h3 className="text-sm font-semibold text-[#0B1E3D]">
                                    KYC Verification
                                </h3>
                                <p className="text-xs text-slate-500 mt-1">
                                    Verification status
                                </p>
                            </div>

                            <div className="p-5 space-y-4">

                                {/* Identity */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                                            <ShieldCheck
                                                size={18}
                                                className="text-[#0B1E3D]"
                                            />
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-slate-700">
                                                Identity
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                Identity verification
                                            </p>
                                        </div>
                                    </div>

                                    <span
                                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${buyer?.identityVerification?.status === 'verified'
                                                ? 'bg-green-50 text-green-600'
                                                : buyer?.identityVerification?.status === 'rejected'
                                                    ? 'bg-red-50 text-red-600'
                                                    : 'bg-amber-50 text-amber-600'
                                            }`}
                                    >
                                        {buyer?.identityVerification?.status || 'Pending'}
                                    </span>
                                </div>

                                {/* Address */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                                            <MapPin
                                                size={18}
                                                className="text-[#0B1E3D]"
                                            />
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-slate-700">
                                                Address
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                Address verification
                                            </p>
                                        </div>
                                    </div>

                                    <span
                                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${buyer?.addressVerification?.status === 'verified'
                                                ? 'bg-green-50 text-green-600'
                                                : buyer?.addressVerification?.status === 'rejected'
                                                    ? 'bg-red-50 text-red-600'
                                                    : 'bg-amber-50 text-amber-600'
                                            }`}
                                    >
                                        {buyer?.addressVerification?.status || 'Pending'}
                                    </span>
                                </div>

                            </div>
                        </div>

                        {/* Account Actions */}
                        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

                            <div className="px-5 py-4 border-b border-slate-200">
                                <h3 className="text-sm font-semibold text-[#0B1E3D]">
                                    Account Actions
                                </h3>
                            </div>

                            <div className="p-5 space-y-3">

                                <button
                                    type="button"
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                                >
                                    <Mail size={16} />
                                    Send Email
                                </button>

                                {buyer?.status === 'suspended' ? (
                                    <button
                                        type="button"
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition"
                                    >
                                        <UserCheck size={16} />
                                        Activate Account
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition"
                                    >
                                        <Ban size={16} />
                                        Suspend Account
                                    </button>
                                )}

                            </div>
                        </div>

                    </div>

                    <WalletSummary />

                    <NotesCard notes={buyer.notes} />
                </div>
            </div>
        </div>
    )
}

export default BuyerDetail;
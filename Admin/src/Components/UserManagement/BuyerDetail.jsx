
import React, { useState } from 'react';
import { EyeOff, Eye, Download, Gavel, FileCheck, Award, XCircle } from 'lucide-react';

import InputField from './Shared/InputField';
import FormPageHeader from './Shared/FormPageHeader';
import AccountStatusCard from './Shared/AccountStatusCard';
import RecentActivities from '../Dashboard/RecentActivities';
import NotesCard from './Shared/NotesCard';

export function WalletSummary({ wallet, onViewHistory }) {

    if (!wallet) return null;

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-[14px] md:text-base font-bold text-slate-900 mb-4">
                Wallet Summary
            </h3>
            <div className="space-y-3 mb-4">
                <div className="flex justify-between text-[13px] md:text-sm">
                    <span className="text-slate-500">Total Balance</span>
                    <span className="font-bold text-slate-900">AED {wallet.balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-[13px] md:text-sm">
                    <span className="text-slate-500">Pending Deposits</span>
                    <span className="font-semibold text-slate-900">AED {wallet.pendingDeposits?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-[13px] md:text-sm">
                    <span className="text-slate-500">Total Spent</span>
                    <span className="font-semibold text-slate-900">AED {wallet.totalSpent?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
            </div>
            <button
                onClick={onViewHistory}
                className="w-full py-1.5 md:py-2 text-sm font-medium text-[#D97706] border border-[#D97706] rounded-lg hover:bg-amber-50">
                View Wallet History
            </button>
        </div>
    );
}

function BuyerDetail({ buyer, setCurrentPage }) {

    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(buyer);

    const [showPassword, setShowPassword] = useState(false);

    if (!buyer) return null;

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
        { label: "Auctions Participated", value: buyer.activitySummary?.auctionsParticipated ?? '--', icon: Gavel, color: "text-blue-600 bg-blue-50" },
        { label: "Bids Placed", value: buyer.activitySummary?.bidsPlaced ?? '--', icon: FileCheck, color: "text-emerald-600 bg-emerald-50" },
        { label: "Auctions Won", value: buyer.activitySummary?.auctionsWon ?? '--', icon: Award, color: "text-purple-600 bg-purple-50" },
        { label: "Auctions Lost", value: buyer.activitySummary?.auctionsLost ?? '--', icon: XCircle, color: "text-orange-500 bg-orange-50" },
    ];

    const personalFields = [
        { label: "Full Name", name: "name", value: data.name },
        { label: "Email Address", name: "email", value: data.email, badge: buyer.emailVerified ? "Verified" : null },
        { label: "Preferred Language", name: "preferredLanguage", value: data.preferredLanguage },
        { label: "Date of Birth", name: "dob", value: data.dob },
        { label: "Phone Number", name: "phone", value: data.phone, badge: buyer.phoneVerified ? "Verified" : null },
        { label: "Alternate Phone", name: "alternatePhone", value: data.alternatePhone },
        { label: "Gender", name: "gender", value: data.gender },
        { label: "Nationality", name: "nationality", value: data.nationality },
        { label: "Address", name: "address", value: data.address },
    ];

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
            <div className="grid grid-cols-1 xl:grid-cols-3 pb-6 gap-6">

                {/* left side - section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm">

                        {/* Header Section */}
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5 md:mb-6">

                            {/* Left Section */}
                            <div className="flex items-start gap-4 flex-1 min-w-0">
                                <img
                                    src={buyer.avatar}
                                    alt={buyer.name}
                                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover shrink-0"
                                />

                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h2 className="text-sm md:text-lg font-bold text-slate-900 wrap-break-word">
                                            {buyer.name}
                                        </h2>

                                        {buyer.kycStatus === "verified" && (
                                            <span className="bg-green-50 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-md whitespace-nowrap">
                                                Verified
                                            </span>
                                        )}
                                    </div>

                                    <p className="mt-1 text-xs sm:text-sm text-slate-500">
                                        Buyer ID:
                                        <span className="font-semibold text-slate-900 ml-1">
                                            {buyer.id || "--"}
                                        </span>
                                    </p>

                                    <p className="text-xs sm:text-sm text-slate-500">
                                        Member Since:
                                        <span className="ml-1">
                                            {buyer.joinedOn
                                                ? new Date(buyer.joinedOn).toLocaleDateString()
                                                : "--"}
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

                                <div>
                                    {isEditing ? (
                                        <InputField
                                            label="Password"
                                            name="password"
                                            type="password"
                                            value={editData.password || ''}
                                            onChange={updateField}
                                        />
                                    ) : (
                                        <>
                                            <p className="text-xs text-slate-500 uppercase">Password</p>
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-semibold text-slate-700">
                                                    {showPassword ? buyer.password || '--' : '••••••••••••'}
                                                </p>
                                                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                                                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* last login */}
                                <div>
                                    <p className="text-xs text-slate-500 uppercase">Last Login</p>
                                    <p className="text-sm font-semibold text-slate-700">
                                        {buyer.lastLogin ? new Date(buyer.lastLogin).toLocaleString() : '--'}
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
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                            <option value="suspended">Suspended</option>
                                        </select>
                                    ) : (
                                        <span className="text-[12px] bg-green-50 text-green-700 font-semibold px-2 py-0.5 rounded capitalize">
                                            {buyer.status || '--'}
                                        </span>
                                    )}
                                </div>

                                {/* 2fa */}
                                <div>
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
                                </div>

                                {/* login ip add */}
                                <div>
                                    <p className="text-xs text-slate-500 uppercase">
                                        Login IP Address
                                    </p>
                                    <p className="text-sm font-semibold text-slate-700">{buyer.loginIP || '--'}</p>
                                </div>

                                {/* mail notification */}
                                <div>
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
                                </div>
                            </div>
                        </div>

                        <hr className="my-4 md:my-6 border-slate-100" />

                        {/* KYC Verification */}
                        <div>
                            <h3 className="font-bold text-slate-900 mb-4">
                                KYC Verification
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                                <div className="min-w-0">
                                    <p className="text-xs text-slate-500 uppercase mb-1">
                                        KYC Status
                                    </p>

                                    <span className="inline-block text-xs bg-green-50 text-green-700 font-semibold px-2 py-0.5 rounded capitalize">
                                        {buyer.kycStatus || "--"}
                                    </span>
                                </div>

                                <div className="min-w-0">
                                    <p className="text-xs text-slate-500 uppercase mb-1">
                                        ID Type
                                    </p>

                                    <p className="text-sm font-semibold text-slate-700 wrap-break-word">
                                        {buyer.idType || "--"}
                                    </p>
                                </div>

                                <div className="min-w-0">
                                    <p className="text-xs text-slate-500 uppercase mb-1">
                                        Document
                                    </p>

                                    {buyer.documentUrl ? (
                                        <a
                                            href={buyer.documentUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-sm font-semibold text-[#D97706] break-all hover:underline"
                                        >
                                            View Document
                                            <Download size={14} />
                                        </a>
                                    ) : (
                                        <p className="text-sm text-slate-400">--</p>
                                    )}
                                </div>

                                <div className="min-w-0">
                                    <p className="text-xs text-slate-500 uppercase mb-1">
                                        Verified On
                                    </p>

                                    <p className="text-sm font-semibold text-slate-700">
                                        {buyer.verifiedOn
                                            ? new Date(buyer.verifiedOn).toLocaleDateString()
                                            : "--"}
                                    </p>
                                </div>

                                <div className="min-w-0">
                                    <p className="text-xs text-slate-500 uppercase mb-1">
                                        ID Number
                                    </p>

                                    <p className="text-sm font-semibold text-slate-700 break-all">
                                        {buyer.idNumber || "--"}
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

                    <AccountStatusCard fields={[
                        { label: 'Status', value: buyer.status, type: 'badge' },
                        { label: 'KYC Status', value: buyer.kycStatus, type: 'badge' },
                        { label: 'Email Verified', value: buyer.emailVerified, type: 'boolean' },
                        { label: 'Phone Verified', value: buyer.phoneVerified, type: 'boolean' },
                        { label: 'Suspended', value: buyer.status === 'suspended', type: 'boolean' },
                    ]} />

                    <WalletSummary wallet={buyer.wallet} onViewHistory={() => console.log('view wallet history')} />

                    <RecentActivities items={buyer.activities} />

                    <NotesCard notes={buyer.notes} />
                </div>
            </div>
        </div>
    )
}

export default BuyerDetail;
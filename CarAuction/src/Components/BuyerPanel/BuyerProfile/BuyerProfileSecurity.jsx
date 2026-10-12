
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Pencil, Lock, Check, ShieldCheck, Smartphone, Key, Mail } from 'lucide-react';
import { useBuyerGet, useChangeBuyerPassword } from '../../../hook/useBuyer';
import useAuthStore from '../../../store/useAuthStore';

const emptyForm = { currentPassword: '', newPassword: '', confirmPassword: '' };

const PasswordInput = ({ label, name, value, onChange, disabled, autoComplete }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-semibold text-slate-500 uppercase tracking-wide">
            {label}
        </label>
        <input
            type="password"
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            autoComplete={autoComplete}
            className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-50 focus:border-[#D97706] transition-all text-[#0B1E3D] disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
        />
    </div>
);

const VerifyBadge = ({ verified }) =>
    verified ? (
        <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded mr-auto">
            Verified
        </span>
    ) : (
        <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded mr-auto">
            Not verified
        </span>
    );

function BuyerProfileSecurity() {

    const user = useAuthStore((s) => s.user);
    const { data: buyer } = useBuyerGet(user?.id);
    const { mutate: changePassword, isPending } = useChangeBuyerPassword();

    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState(emptyForm);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleCancel = () => {
        setForm(emptyForm);
        setIsEditing(false);
    };

    const handleSave = () => {
        const { currentPassword, newPassword, confirmPassword } = form;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return toast.error('All password fields are required');
        }
        if (newPassword !== confirmPassword) {
            return toast.error('New password and confirm password do not match');
        }
        if (newPassword === currentPassword) {
            return toast.error('New password must be different from current password');
        }

        changePassword(form, {
            onSuccess: (data) => {
                toast.success(data?.message || 'Password changed successfully');
                handleCancel();
            },
            onError: (err) => {
                toast.error(err?.response?.data?.message || 'Failed to change password');
            },
        });
    };

    return (
        <>
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm w-full">

                {/* password change */}
                <div className='w-full flex items-start gap-4'>

                    <div className='w-12 h-12 flex items-center justify-center bg-blue-50/50 rounded-xl'>
                        <Lock className="text-blue-600" size={24} />
                    </div>

                    <div className="w-[calc(100%-64px)] flex justify-between items-start">
                        <div className='flex flex-col'>
                            <h2 className="text-base font-bold text-[#0B1E3D]">Change Password</h2>
                            <span className='text-[13px] text-gray-500 pt-px'>Update your password regularly to keep your account secure.</span>
                        </div>

                        {!isEditing ? (
                            <button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-1.5 text-sm text-[#D97706] font-semibold hover:text-amber-600 transition-colors cursor-pointer"
                            >
                                <Pencil size={14} /> Edit
                            </button>
                        ) : (
                            <div className="flex items-center gap-4">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    disabled={isPending}
                                    className="text-sm text-slate-500 font-semibold hover:text-slate-700 transition-colors cursor-pointer disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={isPending}
                                    className="flex items-center gap-1.5 text-sm text-[#D97706] font-semibold hover:text-amber-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Check size={14} /> {isPending ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className='mt-6 max-w-xl flex flex-col gap-5'>
                    <PasswordInput
                        label="Current Password"
                        name="currentPassword"
                        value={form.currentPassword}
                        onChange={handleChange}
                        disabled={!isEditing}
                        autoComplete="current-password"
                    />
                    <PasswordInput
                        label="New Password"
                        name="newPassword"
                        value={form.newPassword}
                        onChange={handleChange}
                        disabled={!isEditing}
                        autoComplete="new-password"
                    />
                    <PasswordInput
                        label="Confirm Password"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        disabled={!isEditing}
                        autoComplete="new-password"
                    />
                </div>
            </div>

            {/* mid sec */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm w-full mt-6">

                <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 flex items-center justify-center bg-green-50 rounded-xl">
                        <ShieldCheck className="text-green-600" size={24} />
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-base font-bold text-[#0B1E3D]">Two-Factor Authentication (2FA)</h2>
                            <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded">Coming soon</span>
                        </div>
                        <p className="text-[13px] text-gray-500 pt-1">Add an extra layer of security to your account.</p>
                    </div>
                </div>

                <div className="space-y-4 opacity-60">
                    <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                                <Smartphone size={20} className="text-[#0B1E3D]" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-[#0B1E3D]">Authentication App</p>
                                <p className="text-xs text-gray-500">You will receive a code from your authenticator app.</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            disabled
                            className="px-4 py-2 border border-[#D97706] rounded-lg text-xs font-semibold text-[#D97706] cursor-not-allowed"
                        >
                            Manage 2FA
                        </button>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                                <Key size={20} className="text-[#0B1E3D]" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-[#0B1E3D]">Backup Codes</p>
                                <p className="text-xs text-gray-500">Use these codes to access your account if you lose your device.</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            disabled
                            className="px-4 py-2 border border-[#D97706] rounded-lg text-xs font-semibold text-[#D97706] cursor-not-allowed"
                        >
                            View Codes
                        </button>
                    </div>
                </div>
            </div>

            {/* bottom sect */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm w-full mt-6">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 flex items-center justify-center bg-green-50 rounded-xl">
                        <Mail className="text-green-600" size={24} />
                    </div>
                    <h2 className="text-base font-bold text-[#0B1E3D]">Email & Phone Verification</h2>
                </div>

                {/* Verification Rows */}
                <div className="space-y-3">
                    {/* Email Section */}
                    <div className="flex items-center justify-between border-t border-slate-50 pt-6 first:border-0 first:pt-0">
                        <div className="flex items-center gap-8 w-full">
                            <p className="text-sm font-semibold text-slate-500 w-32">Email Address</p>
                            <p className="text-sm font-medium text-[#0B1E3D] flex-1">{buyer?.email || '—'}</p>
                            <VerifyBadge verified={buyer?.isEmailVerified} />
                        </div>
                    </div>

                    {/* Phone Section */}
                    <div className="flex items-center justify-between border-t border-slate-50 pt-6">
                        <div className="flex items-center gap-8 w-full">
                            <p className="text-sm font-semibold text-slate-500 w-32">Phone Number</p>
                            <p className="text-sm font-medium text-[#0B1E3D] flex-1">{buyer?.mobile || '—'}</p>
                            <VerifyBadge verified={buyer?.isMobileVerified} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BuyerProfileSecurity;
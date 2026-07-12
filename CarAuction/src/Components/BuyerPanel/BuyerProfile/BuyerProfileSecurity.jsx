
import React, { useState } from 'react';
import { buyerProfile } from '../../Data';
import { Pencil, Lock, Check, ShieldCheck, Smartphone, Key, Mail, ChevronRight } from 'lucide-react';

function BuyerProfileSecurity() {

    const [isEditing, setIsEditing] = useState(false);

    const InputField = ({ label, value, type = 'password' }) => (
        <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-slate-500 uppercase tracking-wide">
                {label}
            </label>
            <input
                type="password"
                defaultValue={value}
                disabled={!isEditing}
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-50 focus:border-[#D97706] transition-all text-[#0B1E3D] disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
            />
        </div>
    );

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
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="flex items-center gap-1.5 text-sm text-[#D97706] font-semibold hover:text-amber-600 transition-colors cursor-pointer"
                        >
                            {!isEditing ? (
                                <><Pencil size={14} /> Edit</>
                            ) : (
                                <><Check size={14} /> Save</>
                            )}
                        </button>
                    </div>
                </div>

                <div className='flex justify-between items-center gap-5 mt-6'>

                    <div className='w-[65%] flex flex-col gap-5'>
                        <InputField label="Current Password" value={buyerProfile.password} />
                        <InputField label="New Password" />
                        <InputField label="Confirm Password" />
                    </div>

                    {/* pass hint */}
                    <div className='w-[35%] bg-blue-50/50 border border-blue-100 rounded-2xl p-3'>
                        <h3 className="text-sm font-bold text-[#0B1E3D] mb-4">Password must contain:</h3>
                        <div className="space-y-3">
                            {[
                                'At least 8 characters',
                                'One uppercase letter (A-Z)',
                                'One lowercase letter (a-z)',
                                'One number (0-9)',
                                'One special character (e.g. !@#$%)'
                            ].map((req, i) => (
                                <div key={i} className="flex items-center gap-3 text-[13px] text-slate-700">
                                    <span className="text-green-600">✓</span>
                                    <span>{req}</span>
                                </div>
                            ))}
                        </div>
                    </div>
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
                            <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded">Enabled</span>
                        </div>
                        <p className="text-[13px] text-gray-500 pt-1">Add an extra layer of security to your account.</p>
                    </div>
                </div>

                <div className="space-y-4">
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
                        <button className="px-4 py-2 border border-[#D97706] rounded-lg text-xs font-semibold text-[#D97706] hover:bg-amber-50 transition-colors">
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
                        <button className="px-4 py-2 border border-[#D97706] rounded-lg text-xs font-semibold text-[#D97706] hover:bg-amber-50 transition-colors">
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
                            <p className="text-sm font-medium text-[#0B1E3D] flex-1">{buyerProfile.email}</p>
                            <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded mr-auto">
                                Verified
                            </span>
                        </div>
                        {/* <button className="flex items-center gap-1 text-sm font-semibold text-[#0B1E3D] hover:text-[#D97706] transition-colors whitespace-nowrap">
                            Update Email <ChevronRight size={16} />
                        </button> */}
                    </div>

                    {/* Phone Section */}
                    <div className="flex items-center justify-between border-t border-slate-50 pt-6">
                        <div className="flex items-center gap-8 w-full">
                            <p className="text-sm font-semibold text-slate-500 w-32">Phone Number</p>
                            <p className="text-sm font-medium text-[#0B1E3D] flex-1">{buyerProfile.phone}</p>
                            <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded mr-auto">
                                Verified
                            </span>
                        </div>
                        {/* <button className="flex items-center gap-1 text-sm font-semibold text-[#0B1E3D] hover:text-[#D97706] transition-colors whitespace-nowrap">
                            Update Phone <ChevronRight size={16} />
                        </button> */}
                    </div>
                </div>
            </div>
        </>
    )
}

export default BuyerProfileSecurity;

import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, CheckCircle2, EyeOff } from 'lucide-react';

import useBuyerRegFormStore from '../../../store/useBuyerRegFormStore';
import { toast } from "react-toastify";

function Step1_CreateAccount({ onNext }) {

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { formData, setField } = useBuyerRegFormStore();

    // i/p handler
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'mobile') {
            setField('mobile', value.replace(/\D/g, '').slice(0, 10));
            return;
        }
        if (name === 'email' && formData.isEmailVerified) {
            setField('isEmailVerified', false);
        }
        setField(name, value);
    };

    // submit
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.firstName.trim()) return toast.error("First Name is required");
        if (formData.firstName.trim().length < 2) return toast.error("Name must be at least 2 characters");

        if (!formData.lastName.trim()) return toast.error("Last Name is required");
        if (formData.lastName.trim().length < 2) return toast.error("Last name must be at least 2 characters");

        if (!formData.email.trim()) return toast.error("Email is required");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return toast.error("Enter a valid email");

        if (!formData.mobile.trim()) return toast.error("Contact number is required");
        if (!/^\d{10}$/.test(formData.mobile)) return toast.error("Contact must be exactly 10 digits");

        if (!formData.password) return toast.error("Password is required");
        if (formData.password.length < 8) return toast.error("Password must be at least 8 characters");
        if (!/\d/.test(formData.password)) return toast.error("Password must contain a number");
        if (!/[A-Z]/.test(formData.password)) return toast.error("Password must contain an uppercase letter");
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) return toast.error("Password must contain a special character");

        if (!formData.confirmPassword) return toast.error("Please confirm your password");
        if (formData.password !== formData.confirmPassword) return toast.error("Passwords do not match");

        if (!formData.termsAccepted) return toast.error("You must accept the Terms & Conditions and Privacy Policy");

        onNext();
    };

    return (
        <section className='w-full py-10'>
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">

                <h2 className="text-2xl font-bold text-[#0B1E3D] mb-2">
                    Basic Account Information
                </h2>
                <p className="text-gray-500 mb-8">
                    Please fill in your basic details to create your account.
                </p>

                <div className="grid md:grid-cols-2 gap-6">

                    {/* First */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            First Name <span className='text-red-600'>*</span>
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                type="text"
                                name='firstName'
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="Enter first name"
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg outline-none transition-all duration-200 focus:border-[#D97706] focus:ring-[#D97706]"
                            />
                        </div>
                    </div>

                    {/* Last Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Last Name <span className='text-red-600'>*</span>
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                type="text"
                                name='lastName'
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Enter last name"
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg outline-none transition-all duration-200 focus:border-[#D97706] focus:ring-[#D97706]" />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Email Address <span className='text-red-600'>*</span>
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                type="email"
                                name='email'
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg outline-none transition-all duration-200 focus:border-[#D97706] focus:ring-[#D97706]" />
                        </div>
                    </div>

                    {/* Mobile */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Mobile Number <span className='text-red-600'>*</span>
                        </label>
                        <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                            <div className="flex items-center px-3 bg-gray-50 text-gray-600 border-r border-gray-200">
                                <span>🇦🇪</span> <span className="ml-2">+971</span>
                            </div>
                            <input
                                type="tel"
                                name='mobile'
                                value={formData.mobile}
                                onChange={handleChange}
                                placeholder="50 123 4567"
                                className="w-full px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#D97706]" />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Password <span className='text-red-600'>*</span>
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                type={showPassword ? "text" : "password"}
                                name='password'
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a password"
                                className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg outline-none transition-all duration-200 focus:border-[#D97706] focus:ring-[#D97706]"
                            />
                            <div
                                className="absolute right-3 top-3 text-gray-400 cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </div>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Confirm Password <span className='text-red-600'>*</span>
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name='confirmPassword'
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your password"
                                className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg outline-none transition-all duration-200 focus:border-[#D97706] focus:ring-[#D97706]"
                            />
                            <div
                                className="absolute right-3 top-3 text-gray-400 cursor-pointer"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </div>
                        </div>
                    </div>
                </div>

                {/* note : pass */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-sm font-semibold text-gray-700 mb-3">Password must contain:</p>
                    <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600">
                        {['At least 8 characters', 'One number', 'One uppercase letter', 'One special character'].map((item, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <CheckCircle2 size={16} className="text-emerald-500" /> {item}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Checkboxe */}
                <div className="mt-6 space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.termsAccepted}
                            onChange={(e) => setField('termsAccepted', e.target.checked)}
                            className="accent-[#D97706] w-4 h-4"
                        />
                        <span className="text-sm text-gray-600">
                            I agree to the <span className="text-[#D97706] font-semibold underline">Terms & Conditions</span> and <span className="text-[#D97706] font-semibold underline">Privacy Policy</span>
                        </span>
                    </label>
                </div>

                {/* Continue Button */}
                <button
                    onClick={handleSubmit}
                    className="w-full mt-8 bg-[#D97706] text-white py-3.5 rounded-lg font-bold hover:bg-[#b86405] transition-all flex items-center justify-center gap-2">
                    Continue →
                </button>

                {/* Footer Link */}
                <p className="text-center text-sm text-gray-500 mt-6">
                    Already have an account?
                    <span
                    onClick={() => navigate('/login')}
                        className="text-[#D97706] font-bold cursor-pointer">
                        Login
                    </span>
                </p>
            </div>
        </section>
    )
}

export default Step1_CreateAccount;
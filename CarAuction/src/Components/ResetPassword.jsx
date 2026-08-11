
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, Key } from 'lucide-react';
import { HiOutlineCheckCircle } from "react-icons/hi2";
import { useBuyerResetpassword } from '../hook/useBuyer';
import { toast } from "react-toastify";

function ResetPassword() {

    const { id, token } = useParams();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: ""
    });

    const { mutate: resetpass, isPending: isResetting } = useBuyerResetpassword();

    // input handler
    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    // submit
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.password || !formData.confirmPassword) {
            return toast.error("Please fill all fields");
        }

        if (formData.password.length < 8) {
            return toast.error("Password must be at least 8 characters");
        }

        if (!/\d/.test(formData.password)) {
            return toast.error("Password must contain at least one number");
        }

        if (!/[A-Z]/.test(formData.password)) {
            return toast.error("Password must contain at least one uppercase letter");
        }

        if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
            return toast.error("Password must contain at least one special character");
        }

        if (formData.password !== formData.confirmPassword) {
            return toast.error("Passwords do not match");
        }

        resetpass({ ...formData, id, token }, {
            onSuccess: (res) => {
                setIsSuccess(true);
            },

            onError: (err) => {
                toast.error(err.response?.data?.message || "Link expired or invalid")
            }
        });
    };

    return (
        <div className="min-h-screen bg-slate-50/60 flex items-center justify-center p-4 sm:p-6 selection:bg-amber-500/20 relative overflow-hidden">

            <div className="relative z-10 max-w-md w-full bg-white border border-slate-100 rounded-2xl p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">

                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200/50 flex items-center justify-center text-amber-600 mb-6 shadow-sm">
                    <Lock className="stroke-[1.75]" size={22} />
                </div>

                {/* header */}
                <div className="space-y-2 mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Set new password
                    </h2>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        Please secure your credential footprint. Your updated password must be at least 8 characters long.
                    </p>
                </div>

                {/* form */}
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* pass */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                            New Password
                        </label>
                        <div className="relative group">
                            <input
                                type={showPassword ? "text" : "password"}
                                name='password'
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full pl-11 pr-11 py-3 bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706]/5 transition-all text-sm text-slate-800 placeholder-slate-400 font-medium"

                            />
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-[#0B1E3D]" size={18} />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* confirm pass */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                            Confirm Password
                        </label>
                        <div className="relative group">
                            <input
                                type="password"
                                name='confirmPassword'
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706]/5  transition-all text-sm text-slate-800 placeholder-slate-400 font-medium"
                                placeholder="••••••••"
                            />
                            <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-[#0B1E3D]" size={18} />
                        </div>
                    </div>

                    {/* btn */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isResetting}
                            className={`w-full flex items-center justify-center gap-2 text-white py-3.5 px-6 rounded-xl font-semibold text-sm tracking-wide transition-all duration-200 active:scale-[0.99] shadow-md
                        ${isResetting
                                    ? "bg-[#0B1E3D]/70 cursor-not-allowed opacity-80"
                                    : "bg-[#0B1E3D] hover:bg-[#122b54] cursor-pointer"}`}
                        >
                            {isResetting ? "Updating..." : "Reset Password"}
                        </button>
                    </div>
                </form>
            </div>

            {/* pop-up modal */}
            <div className={`fixed inset-0 z-50 flex items-center justify-center px-4 transition-all duration-300 
            ${isSuccess ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>

                {/* Smooth Light Blurred Overlay Backdrop */}
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"></div>

                {/* Modal Dialog Content Container Card */}
                <div className={`relative max-w-sm w-full bg-white shadow-2xl rounded-2xl p-8 text-center transform transition-all duration-300 ease-out border border-slate-100
                ${isSuccess ? "translate-y-0 scale-100" : "translate-y-4 scale-95"}`}>

                    {/* Verification Checkmark Banner Icon header wrapper */}
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-5 ring-8 ring-emerald-50/40">
                        <HiOutlineCheckCircle />
                    </div>

                    {/* Core confirmation messaging */}
                    <div className="space-y-2 mb-8">
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                            All set!
                        </h2>
                        <p className="text-slate-500 text-sm leading-relaxed px-2">
                            Your account password has been successfully reset. You can now use your updated credentials to safely sign into your platform user account dashboards.
                        </p>
                    </div>

                    {/* Trigger Finish Redirect anchor route target element */}
                    <div>
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full text-xs bg-[#0B1E3D] hover:bg-[#122b54] text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-200 active:scale-[0.98] uppercase tracking-wider cursor-pointer shadow-md shadow-[#0B1E3D]/10"
                        >
                            Proceed to Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
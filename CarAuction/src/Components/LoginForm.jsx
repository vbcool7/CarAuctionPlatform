
import React, { useState } from 'react';
import LoginCarImg from '../assets/Images/LoginCarImg.jpg';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useBuyerLogin } from '../hook/useBuyer';
import useAuthStore from '../store/useAuthStore';

function LoginForm() {

    const navigate = useNavigate();
    const [role, setRole] = useState('buyer');
    const [formData, setFormData] = useState({ email: '', password: '' });

    const { mutate: loginBuyer, isPending: isLogging } = useBuyerLogin();
    const login = useAuthStore((state) => state.login);

    // i/p handler
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    // submit
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.email) return toast.error("Email is required");
        if (!formData.password) return toast.error("Password is required");

        loginBuyer({ ...formData }, {
            onSuccess: async (res) => {
                toast.success(res.message || "Login Successful");

                const buyerData = res.buyer;

                if (buyerData && res.token) {
                    login(res.token, buyerData);

                    // redirect
                    const targetPath =
                        buyerData.role === 'buyer'
                            ? "/buyer-dashboard"
                            : "/seller-dashboard";
                    navigate(targetPath);
                }
            },

            onError: async (err) => {
                toast.error(err.response?.data?.message || "Invalid Credentials")
            }
        })
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 sm:p-5 lg:p-6 ">
            <div className="max-w-5xl w-full bg-[#0B1423] rounded-xl sm:rounded-2xl shadow-xl overflow-hidden grid lg:grid-cols-12 min-h-162.5 ">

                {/* Left Column */}
                <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-10 overflow-hidden bg-[#0B1423]">

                    <img
                        src={LoginCarImg}
                        alt="Premium Car Auction"
                        className="absolute inset-0 w-full h-full object-cover object-center z-0 transition-transform duration-700 hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-linear-to-t from-[#060D18]/95 via-[#060D18]/70 to-[#060D18]/40 z-10" />

                    <div className="relative z-20 flex flex-col justify-between h-full w-full">

                        {/* header */}
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-amber-500/20">
                                CA
                            </div>
                            <span className="text-white font-bold tracking-wider text-xs uppercase">
                                Car <span className="text-amber-500">Auction</span>
                            </span>
                        </div>

                        {/* content */}
                        <div className="space-y-3 my-auto pt-32">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                                ⚡ Live Auctions
                            </div>
                            <h1 className="text-2xl xl:text-3xl font-extrabold text-white tracking-tight leading-tight">
                                Your Next Car Is Just <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 to-amber-500">One Bid Away</span>
                            </h1>
                            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-medium">
                                Join thousands of verified buyers and sellers in the most secure automotive platform.
                            </p>
                        </div>

                        {/* trust bar */}
                        <div className="grid grid-cols-2 gap-4 pt-5 border-t border-white/10 backdrop-blur-xs">
                            <div>
                                <p className="text-lg font-bold text-white tracking-tight">10K+</p>
                                <p className="text-[11px] text-slate-400 font-medium">Happy Buyers</p>
                            </div>
                            <div>
                                <p className="text-lg font-bold text-white tracking-tight">100%</p>
                                <p className="text-[11px] text-slate-400 font-medium">Secure Platform</p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Right Column */}
                <div className="col-span-12 lg:col-span-7 bg-white p-8 sm:p-12 md:p-16 flex flex-col justify-center">
                    <div className="w-full max-w-md mx-auto space-y-6">

                        {/* Header */}
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                                Welcome Back
                            </h2>
                            <p className="text-slate-500 text-sm mt-1.5">
                                Login to your account to continue configuration
                            </p>
                            <div className="w-12 h-1 bg-amber-500 rounded-full mt-4" />
                        </div>

                        {/* tabs */}
                        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200/60">
                            <button
                                type="button"
                                onClick={() => setRole('buyer')}
                                className={`py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 
                            ${role === 'buyer'
                                        ? 'bg-white text-amber-600 shadow-md shadow-slate-200/80 ring-1 ring-black/5'
                                        : 'text-slate-500 hover:text-slate-800 cursor-pointer'
                                    }`}
                            >
                                Login as Buyer
                            </button>

                            <button
                                type="button"
                                onClick={() => setRole('seller')}
                                className={`py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${role === 'seller'
                                    ? 'bg-white text-amber-600 shadow-md shadow-slate-200/80 ring-1 ring-black/5'
                                    : 'text-slate-500 hover:text-slate-800 cursor-pointer'
                                    }`}
                            >
                                Login as Seller
                            </button>
                        </div>

                        {/* Form Layout */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Email Input */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                    Email Address
                                </label>
                                <div className="relative group">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-600 transition-colors" size={18} />
                                    <input
                                        type="email"
                                        name='email'
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="you@example.com"
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all text-sm text-slate-800 placeholder-slate-400"
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                        Password
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => navigate('/forgot-password')}
                                        className="text-xs text-amber-600 font-semibold hover:text-amber-700 transition-colors"
                                    >
                                        Forgot?
                                    </button>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-600 transition-colors" size={18} />
                                    <input
                                        type="password"
                                        name='password'
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="••••••••"
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all text-sm text-slate-800 placeholder-slate-400"
                                    />
                                </div>
                            </div>

                            {/* Primary Sign In Call-To-Action */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isLogging}
                                    className={`w-full flex items-center justify-center gap-2 text-white py-3 px-6 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 shadow-xl shadow-amber-600/10 active:scale-[0.99]
                                    ${isLogging
                                            ? "bg-amber-600/70 cursor-not-allowed"
                                            : "bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 cursor-pointer"
                                        }`}
                                >
                                    {isLogging ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Signing In...
                                        </>
                                    ) : (
                                        <>
                                            Sign In <ArrowRight size={16} className="mt-0.5" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* Divider Break */}
                        <div className="relative flex items-center justify-center py-2">
                            <div className="absolute inset-x-0 h-px bg-slate-100" />
                            <span className="relative px-3 bg-white text-xs font-semibold text-slate-400 uppercase tracking-widest">
                                or
                            </span>
                        </div>

                        {/* Clean Google Social Button Action */}
                        <div>
                            <button
                                type="button"
                                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold py-3 border border-slate-200 rounded-xl transition-all duration-200 text-sm shadow-sm hover:shadow active:scale-[0.99] cursor-pointer"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24">
                                    <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.43 15.02 0 12 0 7.35 0 3.37 2.67 1.48 6.56l3.84 2.98C6.24 6.94 8.89 5.04 12 5.04z" />
                                    <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.44h6.46c-.28 1.48-1.12 2.73-2.38 3.58l3.69 2.87c2.16-1.99 3.42-4.92 3.42-8.55z" />
                                    <path fill="#FBBC05" d="M5.32 14.42c-.24-.72-.38-1.49-.38-2.3a7.86 7.86 0 0 1 .38-2.3L1.48 6.56A11.977 11.977 0 0 0 0 12c0 1.95.47 3.79 1.48 5.44l3.84-2.98z" />
                                    <path fill="#34A853" d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.69-2.87c-1.02.68-2.33 1.09-3.92 1.09-3.11 0-5.76-1.9-6.71-4.5l-3.84 2.98C3.37 21.33 7.35 24 12 24z" />
                                </svg>
                                Continue with Google
                            </button>
                        </div>

                        {/* Account Footnote Link */}
                        <p className="text-center text-sm text-slate-500 pt-2">
                            Don't have an account?{' '}
                            <button
                                onClick={() => navigate('/signup')}
                                className="text-amber-600 font-bold hover:text-amber-700 hover:underline transition-colors"
                            >
                                Register here
                            </button>
                        </p>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
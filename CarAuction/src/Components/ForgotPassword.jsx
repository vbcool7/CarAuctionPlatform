
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { HiOutlineCheckCircle } from "react-icons/hi2";
import { Lock } from 'lucide-react';
import { toast } from "react-toastify";
import { useForgotPassword } from '../hook/useBuyer';

function ForgotPassword() {

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const paramRole = searchParams.get('role');

    const role = ['buyer', 'seller'].includes(paramRole)
        ? paramRole
        : 'buyer';

    const [email, setEmail] = useState('');

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [timer, setTimer] = useState(0);

    const { mutate: forgotPass, isPending: isForgettingPass } = useForgotPassword();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!email) return toast.error("Email is required");

        forgotPass({ email, role }, {
            onSuccess: (res) => {
                setIsSubmitted(true);
                setTimer(60);
            },
            onError: (err) => {
                toast.error(err.response?.data?.message || "Something went wrong")
            }
        });
    };

    // timer for resend btn
    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() =>
                setTimer((prev) => prev - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    // resend btn
    const handleResend = () => {

        if (isForgettingPass) return;

        setTimer(60);

        forgotPass({ email, role }, {
            onSuccess: (res) => {

                toast.success("New reset link sent successfully!");
            },
            onError: (err) => {
                toast.error(err.response?.data?.message || "Failed to resend link");
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 selection:bg-amber-500/20 relative overflow-hidden">

            {/* Asymmetric Artistic Abstract Background Blobs for a premium look */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#0B1E3D]/5 rounded-full blur-3xl translate-y-1/2 pointer-events-none" />

            {/* Crisp White Desktop Workspace Card */}
            <div className="relative z-10 max-w-md w-full bg-white border border-slate-100 rounded-2xl p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">

                {/* Minimal Back Button floating over top corner */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/login')}
                        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-800 transition-colors cursor-pointer group"
                    >
                        <span className="transform group-hover:-translate-x-0.5 transition-transform">←</span> Back to Login
                    </button>
                </div>

                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200/50 flex items-center justify-center text-amber-600 mb-6 shadow-sm">
                    <Lock size={22} className="stroke-[1.75]" />
                </div>

                {/* header */}
                <div className="space-y-2 mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Reset your password
                    </h2>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        No worries! Enter your registered account email address below and we'll send a recovery link straight over.
                    </p>
                </div>

                {/* form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                            Email Address
                        </label>
                        <div className="relative group">
                            <input
                                type="email"
                                id="email"
                                name='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] transition-all text-sm text-slate-800 placeholder-slate-400 font-medium"
                            />
                        </div>
                    </div>

                    {/* button */}
                    <div>
                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 bg-[#0B1E3D] hover:bg-[#122b54] text-white py-3.5 px-6 rounded-xl font-semibold text-sm tracking-wide transition-all duration-200 active:scale-[0.99] shadow-md cursor-pointer"
                        >
                            Send Instructions <ArrowRight size={16} />
                        </button>
                    </div>
                </form>
            </div>

            {/* pop up modal */}
            {isSubmitted && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 transition-all duration-300">

                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"></div>

                    <div className="relative max-w-sm w-full bg-white shadow-2xl rounded-2xl p-8 text-center transform transition-all animate-in fade-in zoom-in duration-300 border border-slate-100">
                        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-5 ring-8 ring-emerald-50/40">
                            <HiOutlineCheckCircle />
                        </div>

                        <div className="space-y-2 mb-6">
                            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                                Link Dispatch Success
                            </h2>
                            <div className="text-slate-500 text-sm leading-relaxed">
                                Check your inbox! A security verification path has been generated for:{' '}
                                <span className="font-semibold text-white block mt-2 break-all bg-[#0B1E3D] py-2 px-3 rounded-xl border border-slate-200/60 font-mono text-xs">
                                    {email}
                                </span>
                            </div>
                        </div>

                        {/* resend */}
                        <div className="border-t border-slate-100 pt-5 space-y-2 mb-6">
                            <p className="text-xs text-slate-500">
                                Can't find the email? Check spam or resend.
                            </p>
                            <button
                                onClick={handleResend}
                                disabled={timer > 0 || isForgettingPass}
                                className={`text-xs font-bold transition-all tracking-wider uppercase inline-block
                                ${(timer > 0 || isForgettingPass)
                                        ? 'text-slate-400 cursor-not-allowed'
                                        : 'text-amber-600 hover:text-amber-700 active:scale-95 cursor-pointer'
                                    }`}
                            >
                                {isForgettingPass
                                    ? "Sending Link..."
                                    : timer > 0
                                        ? `Resend available in ${timer}s`
                                        : "Resend Link"
                                }
                            </button>
                        </div>

                        {/* btn */}
                        <div>
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-6 rounded-xl transition-all duration-200 active:scale-[0.98] uppercase tracking-wider cursor-pointer"
                            >
                                Return to Login Screen
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ForgotPassword;

import { useState } from "react";
import { HiOutlineLockClosed, HiOutlineMail } from "react-icons/hi";
import { useAdminLogin } from "../hooks/useAdmin";
import useAdminAuthStore from "../store/useAdminAuthStore";
import toast from "react-hot-toast";

function Login() {

    const { mutate: loginAdmin, isPending: isLogging } = useAdminLogin();
    const login = useAdminAuthStore((state) => state.login);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        if (e) e.preventDefault();

        if (!formData.email) {
            return toast.error("Please enter an email");
        }

        if (!formData.password) {
            return toast.error("Please enter a password");
        }

        loginAdmin(formData, {
            onSuccess: (res) => {
                if (res.admin && res.token) {
                    toast.success(res.message || "Login Successful");
                    login(res.admin, res.token);
                } else {
                    toast.error("Invalid response from server");
                }
            },
            onError: (error) => {
                toast.error(error.response?.data?.message || "Login failed");
            }
        })
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

            {/* Background */}
            <div className="absolute inset-0 bg-[#040B18]/70 backdrop-blur-md"></div>

            <div className="relative w-full max-w-md">

                {/* Card */}
                <div className="rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden">

                    {/* Top Accent */}
                    <div className="h-1.5 bg-linear-to-r from-[#FBBF24] via-[#D97706] to-[#92400E]" />

                    <div className="p-6">

                        {/* Header */}
                        <div className="text-center mb-8">

                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-[#FBBF24] via-[#D97706] to-[#92400E] shadow-lg shadow-amber-500/20">
                                <HiOutlineLockClosed
                                    size={30}
                                    className="text-white"
                                />
                            </div>

                            <h2 className="text-2xl font-bold text-[#0B1E3D]">
                                Admin Login
                            </h2>

                            <p className="mt-2 text-[13px] text-slate-500">
                                Sign in to access your dashboard
                            </p>

                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* Email */}

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Email Address
                                </label>

                                <div className="relative">

                                    <HiOutlineMail
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                        size={20}
                                    />

                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter email"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm outline-none transition-all
                                        focus:border-[#D97706]
                                        focus:bg-white
                                        focus:ring-4
                                        focus:ring-amber-100"
                                    />
                                </div>
                            </div>

                            {/* Password */}

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Password
                                </label>

                                <div className="relative">

                                    <HiOutlineLockClosed
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                        size={20}
                                    />

                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter password"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm outline-none transition-all
                                        focus:border-[#D97706]
                                        focus:bg-white
                                        focus:ring-4
                                        focus:ring-amber-100"
                                    />
                                </div>
                            </div>

                            {/* Button */}

                            <button
                                type="submit"
                                disabled={isLogging}
                                className={`mt-3 w-full rounded-xl
                                ${isLogging ? "bg-gray-400" : "bg-linear-to-r from-[#FBBF24] via-[#D97706] to-[#92400E]"} py-3.5 font-semibold text-white shadow-lg
                                ${isLogging ? "shadow-gray-500/20" : "shadow-amber-500/20"} transition-all duration-300 hover:scale-[1.01] hover:shadow-xl
                                ${isLogging ? "cursor-not-allowed" : "cursor-pointer"} `}
                            >
                                {isLogging ? "Verifying..." : "Access Dashboard"}
                            </button>

                        </form>

                        {/* Footer */}
                        <div className="mt-2 border-t border-slate-100 pt-5 text-center">
                            <p className="text-xs text-slate-400">
                                BidDrive Admin Panel
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
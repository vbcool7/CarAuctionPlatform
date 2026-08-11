
import React from 'react';
import { User, Store, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function RegisterSelection() {

    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full text-center">

                {/* Header */}
                <h1 className="text-4xl font-bold text-[#0B1E3D] mb-4">Create Your Account</h1>
                <p className="text-slate-600 mb-12">Choose how you would like to join BidDrive</p>

                {/* Selection Cards */}
                <div className="grid md:grid-cols-2 gap-8">

                    {/* Buyer Option */}
                    <div
                        onClick={() => navigate('/buyer-registration')}
                        className="bg-white p-8 rounded-3xl border-2 border-transparent hover:border-[#0B1E3D] shadow-lg transition-all cursor-pointer group">
                        <div className="w-16 h-16 bg-blue-50 text-[#0B1E3D] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#0B1E3D] group-hover:text-white transition-all">
                            <User size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-[#0B1E3D] mb-2">Join as a Buyer</h2>
                        <p className="text-slate-500 mb-6">Find your dream car, place bids, and get the best deals on verified vehicles.</p>
                        <button className="flex items-center justify-center gap-2 w-full py-3 bg-[#0B1E3D] text-white rounded-xl font-bold hover:bg-[#0B1E3D]/90 transition">
                            Register as Buyer <ArrowRight size={18} />
                        </button>
                    </div>

                    {/* Seller Option */}
                    <div
                        onClick={() => navigate('/seller-registration')}
                        className="bg-white p-8 rounded-3xl border-2 border-transparent hover:border-[#D97706] shadow-lg transition-all cursor-pointer group">
                        <div className="w-16 h-16 bg-orange-50 text-[#D97706] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#D97706] group-hover:text-white transition-all">
                            <Store size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-[#0B1E3D] mb-2">Join as a Seller</h2>
                        <p className="text-slate-500 mb-6">Sell your car quickly to thousands of verified buyers with a hassle-free process.</p>
                        <button className="flex items-center justify-center gap-2 w-full py-3 bg-[#D97706] text-white rounded-xl font-bold hover:bg-[#b86405] transition">
                            Register as Seller <ArrowRight size={18} />
                        </button>
                    </div>

                </div>

                <p className="mt-12 text-slate-500 text-sm">
                    Already have an account?
                    <button 
                    onClick={()=> navigate('/login')}
                     className="text-[#D97706] font-bold hover:underline">
                        Sign In here
                    </button>
                </p>
            </div>
        </div>
    );
}

export default RegisterSelection;
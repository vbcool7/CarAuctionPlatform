
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, Search, Bookmark, Bell, CreditCard, ArrowRight, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

function RegistrationSuccessModal({ onClose, isOpen }) {

    useEffect(() => {
        const end = Date.now() + 1500; // run for 1.5 seconds

        const frame = () => {
            // left side burst
            confetti({
                particleCount: 3,
                angle: 60,           // shooting right
                spread: 55,
                origin: { x: 0, y: 0.5 },
                colors: ['#D97706', '#0B1E3D', '#10b981', '#f59e0b', '#6366f1'],
            });

            // right side burst
            confetti({
                particleCount: 3,
                angle: 120,          // shooting left
                spread: 55,
                origin: { x: 1, y: 0.5 },
                colors: ['#D97706', '#0B1E3D', '#10b981', '#f59e0b', '#6366f1'],
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };

        frame();
    }, []);

    const navigate = useNavigate();

    return (
        <div className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 
      transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}>

            <div className={`bg-white rounded-2xl max-w-4xl w-full shadow-2xl transform 
        transition-all duration-500 ease-in-out ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>

                <div className="grid grid-cols-12 gap-0">

                    {/* ── Left ── */}
                    <div className="col-span-7 p-6 text-center border-r border-gray-100">

                        {/* confetti is CSS only — just dots */}
                        <div className="relative flex justify-center mb-4">
                            <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center">
                                <CheckCircle2 size={40} className="text-white" strokeWidth={2.5} />
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-[#0B1E3D] mb-2">Registration Successful!</h2>
                        <p className="text-gray-500 text-sm mb-4">
                            Welcome to AutoBid. Your buyer account has been created successfully.
                        </p>

                        {/* You're all set banner */}
                        <div className="flex items-start gap-3 bg-green-50 border border-green-100 rounded-xl p-4 text-left mb-8">
                            <ShieldCheck size={20} className="text-green-600 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-bold text-green-700">You're All Set!</p>
                                <p className="text-xs text-green-600 mt-0.5">
                                    Your account has been verified and you can now start exploring and bidding on vehicles.
                                </p>
                            </div>
                        </div>

                        {/* 3 status cards */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            {[
                                { label: 'Account Created', sub: 'Your account is ready to use.' },
                                { label: 'Identity Verified', sub: 'KYC verification completed.' },
                                { label: 'Ready to Bid', sub: 'You can now bid on your favorite vehicles.' },
                            ].map((item) => (
                                <div key={item.label} className="border border-gray-100 rounded-xl p-4 text-center">
                                    <p className="text-sm font-semibold text-[#0B1E3D] mb-1">{item.label}</p>
                                    <p className="text-xs text-gray-400 mb-3">{item.sub}</p>
                                    <CheckCircle2 size={18} className="text-green-500 mx-auto" />
                                </div>
                            ))}
                        </div>

                        {/* Buttons */}
                        <button
                            onClick={() => navigate('/vehicle-list')}
                            className="w-full flex items-center justify-center gap-2 bg-[#0B1E3D] text-white font-semibold py-3 rounded-xl mb-3 hover:bg-[#D97706] transition-colors"
                        >
                            Browse Auctions <ArrowRight size={18} />
                        </button>
                        <button
                            onClick={() => navigate('/buyer-dashboard')}
                            className="w-full flex items-center justify-center gap-2 border border-gray-200 text-[#0B1E3D] font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            Go to Dashboard
                        </button>
                    </div>

                    {/* ── Right ── */}
                    <div className="col-span-5 p-6">

                        <h3 className="text-base font-bold text-[#0B1E3D] mb-4">What's Next?</h3>

                        <div className="space-y-4 mb-8">
                            {[
                                { icon: Search, label: 'Explore Auctions', sub: 'Browse live, upcoming and featured auctions from around the world.' },
                                { icon: Bookmark, label: 'Save Your Favorites', sub: 'Add vehicles to your watchlist and never miss a great deal.' },
                                { icon: Bell, label: 'Get Notified', sub: 'Enable notifications to receive updates on auctions and outbid alerts.' },
                                { icon: CreditCard, label: 'Manage Payments', sub: 'View your deposit details, invoices and transaction history.' },
                            ].map(({ icon: Icon, label, sub }) => (
                                <div key={label} className="flex items-start gap-3 cursor-pointer group">
                                    <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 group-hover:bg-amber-50 transition-colors">
                                        <Icon size={18} className="text-gray-400 group-hover:text-[#D97706] transition-colors" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-[#0B1E3D]">{label}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                                    </div>
                                    <ArrowRight size={16} className="text-gray-300 shrink-0 mt-1" />
                                </div>
                            ))}
                        </div>

                        {/* Deposit Summary */}
                        <div className="border border-gray-100 rounded-xl p-4">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-sm font-bold text-[#0B1E3D]">Your Deposit Summary</h4>
                                <button className="text-xs text-[#D97706] hover:underline">View Details</button>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Total Deposit Paid</span>
                                    <span className="font-semibold text-green-600">AED 5,250</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Deposit Status</span>
                                    <span className="bg-green-50 text-green-600 text-xs font-semibold px-2 py-0.5 rounded-full">Active</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Refundable Amount</span>
                                    <span className="font-semibold text-[#0B1E3D]">AED 5,000</span>
                                </div>
                            </div>
                            <div className="mt-3 flex items-start gap-2 bg-blue-50 rounded-lg p-3">
                                <ShieldCheck size={14} className="text-blue-400 shrink-0 mt-0.5" />
                                <p className="text-xs text-blue-500">Your deposit is secure and refundable if no vehicle is purchased.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default RegistrationSuccessModal;

import { useNavigate } from 'react-router-dom';
import { LogOut, X } from 'lucide-react';
import { toast } from 'react-toastify';

import useAuthStore from '../../store/useAuthStore';
import { useBuyerLogout } from '../../hook/useBuyer';

function BuyerLogout({ onClose }) {

    const navigate = useNavigate();

    const { mutate: logoutBuyer, isPending: isLoggingOut } = useBuyerLogout();
    const clearStore = useAuthStore((state) => state.logout);

    const handleConfirmLogout = () => {

        logoutBuyer(null, {
            onSuccess: (res) => {
                onClose();
                clearStore();
                navigate('/login');
                toast.success(res.message || "Logout successful!");
            },
            onError: (err) => {
                onClose();
                clearStore();
                navigate('/login');
                toast.error(err.response?.data?.message || "Logout failed, but you've been signed out locally");
            }
        })
    };

    return (
        <div className='fixed inset-0 z-60 flex items-center justify-center p-4'>
            {/* Backdrop */}
            <div className='absolute inset-0 bg-[#0B1E3D]/40 backdrop-blur-sm'
                onClick={onClose}>
            </div>

            {/* Modal Box */}
            <div className='relative bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300'>

                <div className='h-24 bg-linear-to-r from-[#0B1E3D] to-[#1e3a66] flex items-center justify-center'>
                    <div className='bg-white/10 p-3 rounded-full backdrop-blur-md'>
                        <LogOut size={28} className='text-white' />
                    </div>
                </div>

                {/* Content */}
                <div className='px-8 py-6 text-center'>
                    <h2 className='text-xl font-bold text-[#0B1E3D]'>Leaving already?</h2>
                    <p className='text-sm text-slate-500 mt-2 leading-relaxed'>
                        Your session will be cleared and you'll need to sign in next time you visit.
                    </p>

                    {/* Action Buttons */}
                    <div className='flex flex-col gap-2 mt-8'>
                        <button
                            type="button"
                            onClick={handleConfirmLogout}
                            disabled={isLoggingOut}
                            className="w-full bg-[#0B1E3D] hover:bg-[#162D4D] text-white font-semibold py-3.5 rounded-2xl transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isLoggingOut ? 'Logging Out...' : 'Yes, Log Out'}
                        </button>

                        <button
                            onClick={onClose}
                            className='w-full text-slate-500 hover:text-slate-700 font-semibold py-3.5 rounded-2xl transition-all'
                        >
                            No, stay here
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BuyerLogout;

import React, { useState } from 'react';
import { UserX, AlertTriangle, X } from 'lucide-react';

const SuspendModal = ({ isOpen, onClose, onConfirm, itemName }) => {
    const [reason, setReason] = useState('');

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (!reason.trim()) return;

        onConfirm(reason.trim());
        setReason('');
    };

    const handleClose = () => {
        setReason('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-70 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">

            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 transform transition-all">

                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute"
                >
                    <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
                </button>

                {/* Header Icon */}
                <div className="flex justify-center mb-4">
                    <div className="bg-red-50 p-3 rounded-full">
                        <AlertTriangle className="w-8 h-8 text-red-600" />
                    </div>
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-slate-900 text-center mb-2">
                    Suspend {itemName}?
                </h3>

                <p className="text-slate-500 text-sm text-center mb-5">
                    Please provide a reason for suspending this buyer.
                </p>

                {/* Reason */}
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Suspension Reason
                    </label>

                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Enter suspension reason..."
                        rows={4}
                        className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 placeholder-slate-400 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-50"
                    />

                    {!reason.trim() && (
                        <p className="mt-1.5 text-xs text-slate-400">
                            Suspension reason is required.
                        </p>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={handleClose}
                        className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleConfirm}
                        disabled={!reason.trim()}
                        className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition"
                    >
                        <UserX className="w-4 h-4" />
                        Suspend
                    </button>
                </div>

            </div>
        </div>
    );
};

export default SuspendModal;
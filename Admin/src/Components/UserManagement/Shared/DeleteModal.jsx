
import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';

const DeleteModal = ({ isOpen, onClose, onConfirm, itemName }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-70 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 transform transition-all">

                {/* Header Icon */}
                <div className="flex justify-center mb-4">
                    <div className="bg-red-50 p-3 rounded-full">
                        <AlertTriangle className="w-8 h-8 text-red-600" />
                    </div>
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-slate-900 text-center mb-2">
                    Delete {itemName}?
                </h3>
                <p className="text-slate-500 text-sm text-center mb-6">
                    Are you sure you want to delete this "{itemName?.toLowerCase()}"? This action cannot be undone and all associated data will be permanently removed.
                </p>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;
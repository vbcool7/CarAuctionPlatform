
import { X, AlertCircle } from "lucide-react";

const CancelAuctionModal = ({
    isOpen,
    onClose,
    onConfirm,
    reason,
    setReason,
    loading = false,
    vehicle,
    error
}) => {
    if (!isOpen) return null;

    {
        error && (
            <p className="mt-2 text-xs text-red-600">{error}</p>
        )
    }

    return (
        <div className="fixed inset-0 z-70 flex items-center justify-center backdrop-blur-sm bg-black/50 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                    <div>
                        <h2 className="text-lg font-semibold text-[#0B1E3D]">
                            Cancel Auction
                        </h2>

                        <div className="mt-1.5 flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                                VIN:
                            </span>

                            <span className="text-xs font-semibold tracking-wide text-[#0B1E3D]">
                                {vehicle?.vin || "—"}
                            </span>
                        </div>

                        <p className="mt-1 text-xs text-gray-500">
                            Please provide a reason for canceling this auction.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 active:scale-95"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 pb-3">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Cancellation Reason
                        <span className="ml-1 text-red-500">*</span>
                    </label>

                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Enter reason for canceling this auction..."
                        rows={4}
                        disabled={loading}
                        className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#D97706] focus:ring-2 focus:ring-[#D97706]/10"
                    />

                    <div className="mt-2 flex items-start gap-2 text-xs text-gray-500">
                        <AlertCircle size={14} className="mt-0.5 shrink-0" />
                        <span>
                            This reason will be recorded for cancellation history.
                        </span>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="h-10 rounded-xl border border-slate-200 px-5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading || !reason.trim()}
                        className="h-10 rounded-xl bg-[#0B1E3D] px-5 text-sm font-medium text-white transition hover:bg-[#132d59] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? "Canceling..." : "Cancel Bid"}
                    </button>

                </div>
            </div>
        </div>
    );
};

export default CancelAuctionModal;
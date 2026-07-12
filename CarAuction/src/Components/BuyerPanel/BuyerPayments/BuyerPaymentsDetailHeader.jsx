
import React from 'react';
import { ArrowLeft, File, FileText } from 'lucide-react';

function BuyerPaymentsDetailHeader({ vehicle, setCurrentPage }) {

    const isCompleted = vehicle.paymentStatus === "payment-completed";
    const isPending = vehicle.paymentStatus === "payment-pending";
    const isRefunded = vehicle.paymentStatus === "refunded";

    const title = isCompleted ? "Payment Completed Details"
        : isPending ? "Payment Pending Details"
            : "Refunds Details";

    const subtitle = isCompleted ? "Your payment has been received and your order is confirmed."
        : isPending ? "Complete the payment to confirm your purchase and processed with vehicle pickup."
            : "View and track all your refunded transactions.";

    const badgeStyle = isCompleted ? "bg-emerald-100 text-emerald-700"
        : isPending ? "bg-amber-100 text-amber-700"
            : "bg-purple-100 text-purple-600";

    const badgeLabel = isCompleted ? "Completed"
        : isPending ? "Pending"
            : "Refunded";


    return (
        <div className='mb-6'>

            {/* Back link */}
            <button
                onClick={() => setCurrentPage("payments")}
                className="flex items-center gap-1.5 text-sm text-[#0B1E3D] font-medium hover:opacity-70 transition-opacity mb-3"
            >
                <ArrowLeft size={15} />
                Back to Payments
            </button>

            {/* content */}
            <div className="flex items-start justify-between gap-4">

                {/* Title row */}
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-[#0B1E3D]">{title}</h1>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badgeStyle}`}>
                            {badgeLabel}
                        </span>
                    </div>
                    <p className="text-sm text-gray-500">{subtitle}</p>
                </div>

                {/* Action button */}
                {isCompleted && (
                    <button className="flex items-center gap-2 text-sm font-medium text-[#0B1E3D] border border-[#0B1E3D] rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors">
                        <FileText className="w-4 h-4" />
                        View Invoice
                    </button>
                )}

                {isPending && (
                    <button className="flex items-center gap-2 text-sm font-medium text-[#0B1E3D] border border-[#0B1E3D] rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors">
                        <File className="w-4 h-4" />
                        Pay Now
                    </button>
                )}
            </div>

        </div>
    )
}

export default BuyerPaymentsDetailHeader;
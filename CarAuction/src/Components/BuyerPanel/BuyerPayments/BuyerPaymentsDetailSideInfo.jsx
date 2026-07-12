
import React from 'react';
import BuyerAuctionSellerCard from '../BuyerAuctionSellerCard';
import { Calendar, Truck, FileText, CheckCircle, Clock } from 'lucide-react';

function BuyerPaymentsDetailSideInfo({ vehicle, setCurrentPage, setSelectedSellerId, setPreviousPage }) {

    const isCompleted = vehicle.paymentStatus === 'payment-completed';
    const isPending = vehicle.paymentStatus === 'payment-pending';
    const isRefunded = vehicle.paymentStatus === 'refunded';

    return (
        <div className="space-y-6">
            {/* 1. Seller Information Card */}
            <BuyerAuctionSellerCard
                vehicle={vehicle}
                setCurrentPage={setCurrentPage}
                setSelectedSellerId={setSelectedSellerId}
                setPreviousPage={setPreviousPage}
                currentPageName="payments-detail"
            />

            {/* 2. What Happens Next / What Happened Section */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-[#0B1E3D] mb-6">
                    {isPending ? "What Happens Next?" : isCompleted ? "What's Next?" : "What Happened?"}
                </h2>

                <div className="space-y-6">
                    {/* Status Content */}
                    {isPending && (
                        <>
                            <Step icon={<FileText size={20} />} title="Payment Pending" desc="Complete the payment to confirm your purchase." />
                            <Step icon={<Truck size={20} />} title="Vehicle Ready" desc="Once payment is completed, the vehicle will be ready for pickup." />
                            <Step icon={<Calendar size={20} />} title="Pickup" desc="Schedule a pickup time and collect your vehicle." />
                        </>
                    )}

                    {isCompleted && (
                        <>
                            <Step icon={<CheckCircle size={20} />} title="Vehicle Ready" desc="Once payment is completed, the vehicle will be ready for pickup." />
                            <Step icon={<Truck size={20} />} title="Pickup" desc="Schedule a pickup time and collect your vehicle." />
                            <Step icon={<FileText size={20} />} title="View Invoice" desc="Download your invoice and payment receipt for your records." />
                            <button className="w-full mt-2 py-3 border border-blue-600 text-blue-600 rounded-lg font-bold hover:bg-blue-50">
                                Download Invoice
                            </button>
                        </>
                    )}

                    {isRefunded && (
                        <Step icon={<Clock size={20} />} title="Your offer has expired." desc="The seller didn't accept your offer before it expired." />
                    )}
                </div>
            </div>
        </div>
    );
}

// Helper component for cleaner UI steps
function Step({ icon, title, desc }) {
    return (
        <div className="flex gap-4">
            <div className="text-blue-600 mt-1">{icon}</div>
            <div>
                <h3 className="font-bold text-[#0B1E3D] text-sm">{title}</h3>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}

export default BuyerPaymentsDetailSideInfo;
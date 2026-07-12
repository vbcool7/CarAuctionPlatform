
import React from 'react';

function BuyerPaymentsDetailSummaryCard({ vehicle }) {

    const isCompleted = vehicle.paymentStatus === "payment-completed";
    const isPending = vehicle.paymentStatus === "payment-pending";
    const isRefunded = vehicle.paymentStatus === "refunded";

    return (
        <div className="border border-slate-100 rounded-2xl p-4 shadow-sm">

            {/* Heading */}
            <h2 className="text-lg font-bold text-[#0B1E3D] mb-4">
                {isCompleted || isPending ? "Payment Summary" : "Refund Summary"}
            </h2>

            <div className="space-y-3">

                {/* Section: Bid & Fees (Only for Payment) */}
                {(isCompleted || isPending) && (
                    <>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">Winning Bid</span>
                            <span className="font-semibold text-[#0B1E3D]">AED {vehicle.winningBid?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">Buyer Fee (5%)</span>
                            <span className="font-semibold text-[#0B1E3D]">AED {vehicle.buyerFee?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">VAT (5%)</span>
                            <span className="font-semibold text-[#0B1E3D]">AED {vehicle.vat?.toLocaleString()}</span>
                        </div>
                        <div className="border-t border-slate-100 pt- flex justify-between items-center text-sm">
                            <span className="text-slate-600 font-bold">Total Amount</span>
                            <span className="font-bold text-blue-600">AED {vehicle.totalAmount?.toLocaleString()}</span>
                        </div>
                    </>
                )}

                {/* Section: Refund Details */}
                {isRefunded && (
                    <>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">Refund Amount</span>
                            <span className="font-semibold text-purple-600">AED {vehicle.refundAmount?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">Refund Fee (0%)</span>
                            <span className="font-semibold text-purple-600">AED 0</span>
                        </div>
                        <div className="flex justify-between items-start text-sm">
                            <span className="text-slate-500">Refund Date</span>

                            <div className="flex flex-col items-end text-[#0B1E3D]">
                                <span className="font-semibold text-sm">
                                    {vehicle.refundDate || "12 May, 2026"}
                                </span>
                                <span className="text-xs text-slate-500">
                                    {vehicle.refundTime || "11:00 AM GST"}
                                </span>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-slate-200 pt flex justify-between items-center text-sm">
                            <span className="text-slate-600 font-bold">Total Refund</span>
                            <span className="font-bold text-purple-600">AED {vehicle.refundAmount?.toLocaleString() || "125,00"}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">Refund Method</span>
                            <span className="font-semibold text-[#0B1E3D]">Original Payment Method</span>
                        </div>
                    </>
                )}

                {/* Section: Status Specific Amount (Paid/Pending) */}
                {isCompleted && (
                    <div className="border-t border-slate-100 flex justify-between items-center text-sm">
                        <span className="text-slate-500">Amount Paid</span>
                        <span className="font-bold text-emerald-600">AED {vehicle.totalAmount?.toLocaleString()}</span>
                    </div>
                )}

                {isCompleted && (
                    <div className="border-t border-slate-100 flex justify-between items-center text-sm">
                        <span className="text-slate-500">Payment Date</span>
                        <div className="flex flex-col items-end text-[#0B1E3D]">
                                <span className="font-semibold text-sm">
                                    {vehicle.refundDate || "12 May, 2026"}
                                </span>
                                <span className="text-xs text-slate-500">
                                    {vehicle.refundTime || "11:00 AM GST"}
                                </span>
                            </div>
                    </div>
                )}

                {isCompleted && (
                    <div className="border-t border-slate-100 flex justify-between items-center text-sm">
                        <span className="text-slate-500">Payment Method</span>
                        <span className="font-bold text-[#0B1E3D] text-xs">VISA</span>
                    </div>
                )}

                {isPending && (
                    <div className="border-t border-slate-100 flex justify-between items-center text-sm">
                        <span className="text-slate-500">Amount Paid</span>
                        <span className="font-bold text-[#0B1E3D]">AED {vehicle.totalAmount?.toLocaleString() || "0"}</span>
                    </div>
                )}

                {isPending && (
                    <div className="border-t border-slate-100 flex justify-between items-center text-sm">
                        <span className="text-slate-500">Amount Pending</span>
                        <span className="font-bold text-orange-600">AED {vehicle.totalAmount?.toLocaleString() || "2000"}</span>
                    </div>
                )}
            </div>

            {/* Footer Badge for Success/Refund Status */}
            {/* {(isCompleted || isRefunded) && (
                <div className={`mt-6 p-4 rounded-xl text-sm ${isCompleted ? 'bg-green-50 text-green-700' : 'bg-green-50 text-green-700'}`}>
                    <p className="font-bold">{isCompleted ? "Payment Completed" : "Refund Processed"}</p>
                    <p className="text-xs mt-1">
                        {isCompleted ? "Your payment has been received successfully." : "Your refund has been processed and successfully credited."}
                    </p>
                </div>
            )} */}
        </div>
    );
}

export default BuyerPaymentsDetailSummaryCard
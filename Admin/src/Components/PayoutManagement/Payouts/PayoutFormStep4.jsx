
import React from "react";
import { FiAlertTriangle } from "react-icons/fi";
import { FileText, User, Building2, CalendarDays, ReceiptText} from "lucide-react";

function PayoutFormStep4({ draft, updateDraft }) {

    // Temporary fallback data
    const payout = draft?.payout || {
        payoutType: "Winning Payout",
        relatedTo: "Auction AUC-2024-00021",
        referenceId: "REF-2024-07091",
        description: "Winning amount for Auction 2022 Range Rover Sport HSE",
        payoutAmount: 45500,
        transactionFees: 0,
        gatewayCharges: 0,
        totalDeductions: 0,
        netPayoutAmount: 45500,
        payoutDate: "May 20, 2024",
        payoutTime: "02:30 PM",
        timeZone: "(UTC +04:00) Dubai, UAE",
        priority: "Normal",
    };

    const recipient = draft?.recipient || {
        name: "Michael Johnson",
        userId: "USER-000124",
        role: "Buyer",
        email: "michael.j@email.com",
        phone: "+971 50 123 4567",
        memberSince: "Mar 15, 2024",
        kycStatus: "Verified",
        accountStatus: "Active",
        availableBalance: 45500,
    };

    const paymentMethod = draft?.paymentMethod || {
        method: "Bank Transfer",
        accountHolderName: "Michael Johnson",
        bankName: "Chase Bank",
        accountNumber: "•••• •••• 4242",
        routingNumber: "021000021",
        swiftCode: "CHASUS33XXX",
        iban: "—",
        branchAddress: "Dubai Main Branch, Dubai, UAE",
    };

    return (
        <div className="w-full bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm">

            {/* Header */}
            <div className="mb-6">
                <h3 className="text-base font-bold text-[#0B1E3D]">
                    Review & Confirm
                </h3>

                <p className="mt-1 text-xs sm:text-[13px] text-slate-400">
                    Please review all the details carefully before confirming the payout.
                </p>
            </div>

            {/* Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* 1. Payout Details */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100">
                        <FileText className="w-4 h-4 text-[#D97706]" />
                        <h4 className="text-xs font-semibold text-[#0B1E3D]">
                            1. Payout Details
                        </h4>
                    </div>

                    <div className="p-4 space-y-3 text-xs">

                        <div className="flex justify-between gap-4">
                            <span className="text-slate-500">Payout Type</span>
                            <span className="font-medium text-slate-700 text-right">
                                {payout.payoutType}
                            </span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span className="text-slate-500">Related To</span>
                            <span className="font-medium text-slate-700 text-right">
                                {payout.relatedTo}
                            </span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span className="text-slate-500">Reference ID</span>
                            <span className="font-medium text-slate-700">
                                {payout.referenceId}
                            </span>
                        </div>

                        <div>
                            <span className="text-slate-500">Description</span>
                            <p className="mt-1 font-medium text-slate-700 leading-5">
                                {payout.description}
                            </p>
                        </div>

                        <div className="pt-2 border-t border-slate-100 space-y-2">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Payout Amount</span>
                                <span className="font-semibold text-emerald-600">
                                    ${payout.payoutAmount.toLocaleString()}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-slate-500">Transaction Fees</span>
                                <span className="font-medium text-slate-700">
                                    ${payout.transactionFees.toFixed(2)}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-slate-500">Gateway Charges</span>
                                <span className="font-medium text-slate-700">
                                    ${payout.gatewayCharges.toFixed(2)}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="font-medium text-slate-700">
                                    Total Deductions
                                </span>
                                <span className="font-semibold text-red-500">
                                    ${payout.totalDeductions.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-emerald-50">
                            <span className="font-semibold text-emerald-700">
                                Net Payout Amount
                            </span>
                            <span className="font-bold text-emerald-700">
                                ${payout.netPayoutAmount.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 2. Recipient Details */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100">
                        <User className="w-4 h-4 text-[#D97706]" />
                        <h4 className="text-xs font-semibold text-[#0B1E3D]">
                            2. Recipient Details
                        </h4>
                    </div>

                    <div className="p-4 space-y-3 text-xs">

                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2.5">
                                {/* Avatar */}
                                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                                    {recipient?.image ? (
                                        <img
                                            src={recipient.image}
                                            alt={recipient?.name || "Recipient"}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-sm font-semibold text-[#D97706]">
                                            {recipient?.name?.charAt(0)?.toUpperCase() || "U"}
                                        </span>
                                    )}
                                </div>

                                {/* Name + Role */}
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs sm:text-[13px] font-semibold text-[#0B1E3D] truncate">
                                            {recipient?.name || "-"}
                                        </span>

                                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-[10px] font-medium text-emerald-700 shrink-0">
                                            Verified
                                        </span>
                                    </div>

                                    <p className="text-[11px] text-slate-500 mt-0.5">
                                        {recipient?.role || "-"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span className="text-slate-500">Role</span>
                            <span className="font-medium text-slate-700">
                                {recipient.role}
                            </span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span className="text-slate-500">User ID</span>
                            <span className="font-medium text-slate-700">
                                {recipient.userId || "Manual Entry"}
                            </span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span className="text-slate-500">Email</span>
                            <span className="font-medium text-slate-700 break-all text-right">
                                {recipient.email}
                            </span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span className="text-slate-500">Phone</span>
                            <span className="font-medium text-slate-700">
                                {recipient.phone}
                            </span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span className="text-slate-500">KYC Status</span>
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-[10px] font-medium text-emerald-700">
                                {recipient.kycStatus}
                            </span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span className="text-slate-500">Available Balance</span>
                            <span className="font-semibold text-emerald-600">
                                ${recipient.availableBalance.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>


                {/* 3. Payment Method */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100">
                        <Building2 className="w-4 h-4 text-[#D97706]" />
                        <h4 className="text-xs font-semibold text-[#0B1E3D]">
                            3. Payment Method
                        </h4>
                    </div>

                    <div className="p-4 space-y-3 text-xs">

                        <div className="flex justify-between gap-4">
                            <span className="text-slate-500">Method</span>
                            <span className="font-medium text-slate-700">
                                {paymentMethod.method}
                            </span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span className="text-slate-500">Account Holder</span>
                            <span className="font-medium text-slate-700">
                                {paymentMethod.accountHolderName}
                            </span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span className="text-slate-500">Bank Name</span>
                            <span className="font-medium text-slate-700">
                                {paymentMethod.bankName}
                            </span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span className="text-slate-500">Account Number</span>
                            <span className="font-medium text-slate-700">
                                {paymentMethod.accountNumber}
                            </span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span className="text-slate-500">SWIFT Code</span>
                            <span className="font-medium text-slate-700">
                                {paymentMethod.swiftCode}
                            </span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span className="text-slate-500">IBAN</span>
                            <span className="font-medium text-slate-700">
                                {paymentMethod.iban}
                            </span>
                        </div>

                        <div className="flex justify-between gap-4">
                            <span className="text-slate-500">Branch Address</span>
                            <span className="font-medium text-slate-700 text-right">
                                {paymentMethod.branchAddress}
                            </span>
                        </div>
                    </div>
                </div>


                {/* 4. Payout Summary */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100">
                        <ReceiptText className="w-4 h-4 text-[#D97706]" />
                        <h4 className="text-xs font-semibold text-[#0B1E3D]">
                            4. Payout Summary
                        </h4>
                    </div>

                    <div className="p-4 space-y-3 text-xs">
                        <div className="flex justify-between">
                            <span className="text-slate-500">Winning Amount</span>
                            <span className="font-semibold text-[#0B1E3D]">
                                $45,500.00
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-slate-500">Transaction Fees</span>
                            <span className="font-medium text-slate-700">
                                $0.00
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-slate-500">Gateway Charges</span>
                            <span className="font-medium text-slate-700">
                                $0.00
                            </span>
                        </div>

                        <div className="flex justify-between font-semibold">
                            <span className="text-slate-700">Total Deductions</span>
                            <span className="text-red-500">$0.00</span>
                        </div>

                        <div className="flex justify-between px-3 py-2 rounded-lg bg-emerald-50">
                            <span className="font-semibold text-emerald-700">
                                Net Payout Amount
                            </span>
                            <span className="font-bold text-emerald-700">
                                $45,500.00
                            </span>
                        </div>
                    </div>
                </div>


                {/* 5. Schedule & Priority */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100">
                        <CalendarDays className="w-4 h-4 text-[#D97706]" />
                        <h4 className="text-xs font-semibold text-[#0B1E3D]">
                            5. Payout Schedule & Priority
                        </h4>
                    </div>

                    <div className="p-4 space-y-3 text-xs">

                        <div className="flex justify-between">
                            <span className="text-slate-500">Payout Date</span>
                            <span className="font-medium text-slate-700">
                                {payout.payoutDate}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-slate-500">Payout Time</span>
                            <span className="font-medium text-slate-700">
                                {payout.payoutTime}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-slate-500">Time Zone</span>
                            <span className="font-medium text-slate-700 text-right">
                                {payout.timeZone}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-slate-500">Priority</span>
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-[10px] font-medium text-emerald-700">
                                {payout.priority}
                            </span>
                        </div>
                    </div>
                </div>

            </div>


            {/* note */}
            <div className="w-full flex items-start gap-3 px-4 py-3.5 mt-6 border border-[#D97706]/20 border-l-2 border-l-[#D97706] bg-[#FFFDF8] rounded-lg">
                <div className="pt-0.5 shrink-0"><FiAlertTriangle className="w-5 h-5 text-[#D97706]" /></div>
                <div>
                    <h4 className="text-[13px] font-semibold text-[#0B1E3D]">Please Note</h4>
                    <p className="mt-1 text-xs text-slate-600 leading-5">
                        Once the payout is created. it will be processed within 1-3 business days depending on the selected payment method.
                        You will recieve an emil notification once the payout is successfully sent to the recipient.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default PayoutFormStep4;

import { ChevronDown, Eye, EyeOff, Info, ShieldCheck } from 'lucide-react';
import React, { useState } from 'react';
import { FaPaypal, FaUniversity, FaExchangeAlt, FaWallet } from "react-icons/fa";
import { SiWise } from "react-icons/si";
import { FiAlertTriangle } from "react-icons/fi";

const payoutMethods = [
    { id: 1, name: "Bank Transfer", description: "Send payout directly to bank account", icon: FaUniversity, iconColor: "text-purple-600", theme: "bg-purple-50 text-purple-600", color: "bg-purple-600" },
    { id: 2, name: "PayPal", description: "Send payout to PayPal account", icon: FaPaypal, iconColor: "text-blue-600", theme: "bg-blue-50 text-blue-600", color: "bg-blue-600" },
    { id: 3, name: "Wire Transfer", description: "International wire transfer", icon: FaExchangeAlt, iconColor: "text-indigo-600", theme: "bg-indigo-50 text-indigo-600", color: "bg-indigo-500" },
    { id: 4, name: "Wise Transfer", description: "Send payout via Wise", icon: SiWise, iconColor: "text-emerald-600", theme: "bg-emerald-50 text-emerald-600", color: "bg-emerald-500" },
    { id: 5, name: "Manual Payout", description: "Mark as manual payout (Cash/Cheque etc.)", icon: FaWallet, iconColor: "text-slate-600", theme: "bg-slate-50 text-slate-600", color: "bg-slate-400" },
];

function PayoutFormStep3({ draft, updateDraft }) {

    const [showAccNum, setShowshowAccNum] = useState(false);
    const [paypalEmail, setPaypalEmail] = useState("michael.j@email.com");

    // controlled: default to first method (Bank Transfer) if none selected yet
    const selectedMethodId = draft?.payoutMethod?.id ?? 1;

    const handleSelectMethod = (method) => {
        updateDraft({ payoutMethod: { id: method.id, name: method.name } });
    };

    const selectedMethod = payoutMethods.find(m => m.id === selectedMethodId);

    return (
        <div className="w-full bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm">

            <div className="mb-6">
                <h3 className="text-base font-bold text-[#0B1E3D]">Payout Method</h3>
                <p className="mt-1 text-xs sm:text-[13px] text-slate-400">
                    Choose a payment method to send the payout.
                </p>
            </div>

            {/* parent section */}
            <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.3fr] gap-5 lg:gap-6">

                {/* Payment Method Selector */}
                <div className="my-2">
                    <h4 className="text-sm font-semibold text-[#0B1E3D] mb-4">Select Payment Method</h4>

                    <div className="space-y-3">
                        {payoutMethods.map((type) => {
                            const IconComponent = type.icon;
                            const isSelected = selectedMethodId === type.id;

                            return (
                                <label
                                    key={type.id}
                                    className={`flex items-start gap-3 p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all duration-200
                                ${isSelected ? 'border-[#D97706] bg-amber-50/30' : 'border-slate-200 bg-white hover:border-gray-300 hover:bg-amber-50/30 shadow-sm'}`}
                                >
                                    <input
                                        type="radio"
                                        name="payoutType"
                                        checked={isSelected}
                                        onChange={() => handleSelectMethod(type)}
                                        className="mt-1 w-4 h-4 accent-[#D97706] shrink-0"
                                    />

                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${type.theme}`}>
                                        <IconComponent className={`w-4 h-4 ${type.iconColor}`} />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-xs sm:text-[13px] font-semibold text-[#0B1E3D]">{type.name}</p>
                                        <p className="text-[11px] sm:text-xs text-slate-500 mt-1 leading-4">{type.description}</p>
                                    </div>
                                </label>
                            );
                        })}
                    </div>
                </div>

                {/* Payment Method Form */}
                <div className="my-2">
                    <h4 className="text-sm font-semibold text-[#0B1E3D] mb-4">
                        {selectedMethod?.name} Details
                    </h4>

                    {(selectedMethodId === 1 || selectedMethodId === 3) && (
                        <div className='border border-slate-200 rounded-2xl shadow-sm p-4 sm:p-5 space-y-4 bg-white'>

                            {/* acc holder name */}
                            <div>
                                <label className="block text-[11px] sm:text-[12px] font-semibold text-[#0B1E3D] mb-1">
                                    Account Holder Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    defaultValue="Michael Johnson"
                                    className="w-full px-3 py-2 text-[11px] sm:text-[12px] bg-slate-50 border border-slate-200 rounded-xl text-[#0B1E3D] focus:outline-none focus:border-[#D97706]"
                                />
                            </div>

                            {/* bank name */}
                            <div>
                                <label className="block text-[11px] sm:text-[12px] font-semibold text-[#0B1E3D] mb-1">
                                    Bank Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <select className="w-full px-3 py-2 text-[11px] sm:text-[12px] bg-slate-50 border border-slate-200 rounded-xl text-[#0B1E3D] appearance-none focus:outline-none focus:border-[#D97706]">
                                        <option>Chase Bank</option>
                                        <option>Bank of America</option>
                                        <option>Wells Fargo</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500">
                                        <ChevronDown className="w-3.5 h-3.5" />
                                    </div>
                                </div>
                            </div>

                            {/* acc num */}
                            <div>
                                <label className="block text-[11px] sm:text-[12px] font-semibold text-[#0B1E3D] mb-1">
                                    Account Number <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        type={showAccNum ? "text" : "password"}
                                        defaultValue="4242424242424242"
                                        className="w-full px-3 py-2 text-[11px] sm:text-[12px] bg-slate-50 border border-slate-200 rounded-xl text-[#0B1E3D] focus:outline-none focus:border-[#D97706]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowshowAccNum(!showAccNum)}
                                        className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                                    >
                                        {showAccNum ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Routing Number */}
                            <div>
                                <label className="block text-[11px] sm:text-[12px] font-semibold text-[#0B1E3D] mb-1">
                                    Routing Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    defaultValue="021000021"
                                    className="w-full px-3 py-2 text-[11px] sm:text-[12px] bg-slate-50 border border-slate-200 rounded-xl text-[#0B1E3D] focus:outline-none focus:border-[#D97706]"
                                />
                            </div>

                            {/* SWIFT Code */}
                            <div>
                                <label className="block text-[11px] sm:text-[12px] font-semibold text-[#0B1E3D] mb-1">
                                    SWIFT Code
                                </label>
                                <input
                                    type="text"
                                    defaultValue="CHASUS33XXX"
                                    className="w-full px-3 py-2 text-[11px] sm:text-[12px] bg-slate-50 border border-slate-200 rounded-xl text-[#0B1E3D] focus:outline-none focus:border-[#D97706]"
                                />
                            </div>

                            {/* IBAN */}
                            <div>
                                <label className="block text-[11px] sm:text-[12px] font-semibold text-[#0B1E3D] mb-1">
                                    IBAN <span className="text-slate-400 font-normal">(Optional)</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter IBAN (if applicable)"
                                    className="w-full px-3 py-2 text-[11px] sm:text-[12px] bg-slate-50 border border-slate-200 rounded-xl text-[#0B1E3D] placeholder:text-slate-400 focus:outline-none focus:border-[#D97706]"
                                />
                            </div>

                            {/* Branch Address */}
                            <div>
                                <label className="block text-[11px] sm:text-[12px] font-semibold text-[#0B1E3D] mb-1">
                                    Branch Address <span className="text-slate-400 font-normal">(Optional)</span>
                                </label>
                                <input
                                    type="text"
                                    defaultValue="Dubai Main Branch, Dubai, UAE"
                                    className="w-full px-3 py-2 text-[11px] sm:text-[12px] bg-slate-50 border border-slate-200 rounded-xl text-[#0B1E3D] focus:outline-none focus:border-[#D97706]"
                                />
                            </div>

                            {/* Verification Alert */}
                            <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 text-[11px] sm:text-[12px]">
                                <svg className="w-4 h-4 shrink-0 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="font-medium">This bank account is verified and active.</span>
                            </div>
                        </div>
                    )}

                    {selectedMethodId === 2 && (
                        <div className='border border-slate-200 rounded-2xl shadow-sm p-4 sm:p-5 space-y-6 bg-white'>

                            {/* email */}
                            <div>
                                <label className="block text-[11px] sm:text-[12px] font-semibold text-[#0B1E3D] mb-1">
                                    PayPal Email Address <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={paypalEmail}
                                        onChange={(e) => setPaypalEmail(e.target.value)}
                                        className="w-full px-3 py-2 pr-9 text-[11px] sm:text-[13px] bg-slate-50 border border-slate-200 rounded-lg text-[#0B1E3D] focus:outline-none focus:border-[#D97706]"
                                    />
                                </div>
                            </div>

                            {/* info box */}
                            <div className="p-3.5 bg-blue-50/60 border border-blue-100 rounded-xl space-y-4">
                                <div className="flex items-center gap-2 text-[#0B1E3D]">
                                    <FaPaypal className="w-4 h-4 text-blue-600 shrink-0" />
                                    <span className="text-[11px] sm:text-[12px] font-bold">Important Information</span>
                                </div>
                                <ul className="list-disc list-inside text-[10px] sm:text-[11px] text-slate-600 space-y-1 pl-1">
                                    <li>The payout will be sent to the PayPal email address above.</li>
                                    <li>Please ensure the email is correct and belongs to the recipient.</li>
                                    <li>Payouts via PayPal are usually processed within 24 hours.</li>
                                </ul>
                            </div>

                            {/* warning */}
                            <div className="flex items-start gap-2.5 px-3.5 py-2.5 bg-amber-50/70 border border-amber-200/60 rounded-xl text-amber-800 text-[10px] sm:text-[11px]">
                                <FiAlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                                <span>Transaction fees and currency conversion (if applicable) will be deducted from the payout amount.</span>
                            </div>
                        </div>
                    )}

                    {selectedMethodId === 4 && (
                        <div className='border border-slate-200 rounded-2xl shadow-sm p-4 sm:p-5 space-y-4 bg-white'>

                            {/* acc holder name */}
                            <div>
                                <label className="block text-[11px] sm:text-[12px] font-semibold text-[#0B1E3D] mb-1">
                                    Account Holder Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    defaultValue="Michael Johnson"
                                    className="w-full px-3 py-2 text-[11px] sm:text-[12px] bg-slate-50 border border-slate-200 rounded-xl text-[#0B1E3D] focus:outline-none focus:border-[#D97706]"
                                />
                            </div>

                            {/* email */}
                            <div>
                                <label className="block text-[11px] sm:text-[12px] font-semibold text-[#0B1E3D] mb-1">
                                    Wise Email / Account Email <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={paypalEmail}
                                        onChange={(e) => setPaypalEmail(e.target.value)}
                                        className="w-full px-3 py-2 pr-9 text-[11px] sm:text-[13px] bg-slate-50 border border-slate-200 rounded-lg text-[#0B1E3D] focus:outline-none focus:border-[#D97706]"
                                    />
                                </div>
                            </div>

                            {/* country */}
                            <div>
                                <label className="block text-[11px] sm:text-[12px] font-semibold text-[#0B1E3D] mb-1">
                                    Country of Residence <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <select className="w-full px-3 py-2 text-[11px] sm:text-[12px] bg-slate-50 border border-slate-200 rounded-xl text-[#0B1E3D] appearance-none focus:outline-none focus:border-[#D97706]">
                                        <option>United Arab Emirates (UAE)</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500">
                                        <ChevronDown className="w-3.5 h-3.5" />
                                    </div>
                                </div>
                            </div>

                            {/* currency */}
                            <div>
                                <label className="block text-[11px] sm:text-[12px] font-semibold text-[#0B1E3D] mb-1">
                                    Currency to send <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <select className="w-full px-3 py-2 text-[11px] sm:text-[12px] bg-slate-50 border border-slate-200 rounded-xl text-[#0B1E3D] appearance-none focus:outline-none focus:border-[#D97706]">
                                        <option>AED</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500">
                                        <ChevronDown className="w-3.5 h-3.5" />
                                    </div>
                                </div>
                            </div>

                            <div className='mt-6 mb-4'>
                                <h1 className='text-gray-800 font-bold text-[13px] mb-2'>Wise Account Details</h1>

                                <div className="flex items-start gap-2.5 px-3.5 py-2.5 bg-green-50/70 border border-green-200/60 rounded-lg text-green-800 text-[10px] sm:text-[11px]">
                                    <ShieldCheck className="w-4 h-4 shrink-0 text-green-600 mt-0.5" />
                                    <span>Wise details are used to identify the recipient.</span>
                                </div>
                            </div>

                            {/* wise email */}
                            <div>
                                <label className="block text-[11px] sm:text-[12px] font-semibold text-[#0B1E3D] mb-1">
                                    Wise Account Email <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={paypalEmail}
                                        onChange={(e) => setPaypalEmail(e.target.value)}
                                        className="w-full px-3 py-2 pr-9 text-[11px] sm:text-[13px] bg-slate-50 border border-slate-200 rounded-lg text-[#0B1E3D] focus:outline-none focus:border-[#D97706]"
                                    />
                                </div>
                            </div>

                            {/* full name */}
                            <div>
                                <label className="block text-[11px] sm:text-[12px] font-semibold text-[#0B1E3D] mb-1">
                                    Full Name (as per wise account) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    defaultValue="Michael Johnson"
                                    className="w-full px-3 py-2 text-[11px] sm:text-[12px] bg-slate-50 border border-slate-200 rounded-xl text-[#0B1E3D] focus:outline-none focus:border-[#D97706]"
                                />
                            </div>

                            {/* ref note */}
                            <div>
                                <label className="block text-[11px] sm:text-[12px] font-semibold text-[#0B1E3D] mb-1">
                                    Reference Note (Optional) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    defaultValue="Payout for Auction #AUC-00098"
                                    className="w-full px-3 py-2 text-[11px] sm:text-[12px] bg-slate-50 border border-slate-200 rounded-xl text-[#0B1E3D] focus:outline-none focus:border-[#D97706]"
                                />
                            </div>

                        </div>
                    )}

                    {selectedMethodId === 5 && (
                        <div className='border border-slate-200 rounded-2xl shadow-sm p-4 sm:p-5 space-y-4 bg-white'>

                            {/* payment medium */}
                            <div>
                                <label className="block text-[11px] sm:text-[12px] font-semibold text-[#0B1E3D] mb-1">
                                    Payment Medium <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <select className="w-full px-3 py-2 text-[11px] sm:text-[12px] bg-slate-50 border border-slate-200 rounded-xl text-[#0B1E3D] appearance-none focus:outline-none focus:border-[#D97706]">
                                        <option>Cash</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500">
                                        <ChevronDown className="w-3.5 h-3.5" />
                                    </div>
                                </div>
                            </div>

                            {/* pay location */}
                            <div>
                                <label className="block text-[11px] sm:text-[12px] font-semibold text-[#0B1E3D] mb-1">
                                    Payment Location / Branch <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    defaultValue="New York Office"
                                    className="w-full px-3 py-2 text-[11px] sm:text-[12px] bg-slate-50 border border-slate-200 rounded-xl text-[#0B1E3D] focus:outline-none focus:border-[#D97706]"
                                />
                            </div>

                            {/* ref num */}
                            <div>
                                <label className="block text-[11px] sm:text-[12px] font-semibold text-[#0B1E3D] mb-1">
                                    Reference / Receipt Number (Optional)
                                </label>
                                <input
                                    type="text"
                                    defaultValue="New York Office"
                                    className="w-full px-3 py-2 text-[11px] sm:text-[12px] bg-slate-50 border border-slate-200 rounded-xl text-[#0B1E3D] focus:outline-none focus:border-[#D97706]"
                                />
                            </div>

                            {/* notes */}
                            <div>
                                <label className="block text-[11px] sm:text-[12px] font-semibold text-[#0B1E3D] mb-1">
                                    Notes (Optional) <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    type="text"
                                    rows={4}
                                    defaultValue="Cash paid to recipient at New York Office"
                                    className="w-full px-3 py-2 text-[11px] sm:text-[12px] bg-slate-50 border border-slate-200 rounded-xl text-[#0B1E3D] focus:outline-none focus:border-[#D97706] resize-none"
                                />
                            </div>

                            <div className="flex items-start gap-2.5 px-3.5 py-2.5 bg-amber-50/70 border border-amber-200/60 rounded-xl text-amber-800 text-[10px] sm:text-[11px]">
                                <ShieldCheck className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                                <span>This payout will be marked as completed manually. Please ensure cash/cheque has been ended over to the recipient</span>
                            </div>
                        </div>
                    )}

                </div>

            </div>

            {/* note */}
            <div className="w-full flex items-start gap-3 px-4 py-3.5 mt-6 border border-[#D97706]/20 border-l-2 border-l-[#D97706] bg-[#FFFDF8] rounded-lg">
                <div className="pt-0.5 shrink-0"><Info className="w-5 h-5 text-[#D97706]" /></div>
                <div>
                    <h4 className="text-[13px] font-semibold text-[#0B1E3D]">Note</h4>
                    <p className="mt-1 text-xs text-slate-600 leading-5">
                        Payouts are usually processed within 1-3 business days depending on the selected payment method.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default PayoutFormStep3;
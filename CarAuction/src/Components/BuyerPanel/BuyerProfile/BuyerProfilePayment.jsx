
import React, { useState } from 'react';
import { paymentMethods } from '../../Data';
import { paymentTransactions } from '../../Data';
import VISA from '../../../assets/Images/VISA.png';
import MasterCard from '../../../assets/Images/MasterCard.png';
import AmericanExp from '../../../assets/Images/AmericanExp.png';
import { Landmark, MoreVertical, Lock, ChevronDown } from 'lucide-react';

// logos
const BrandLogo = ({ brand }) => {
    if (brand === 'visa') return <img src={VISA} className="h-6 w-auto" alt="Visa" />;
    if (brand === 'mastercard') return <img src={MasterCard} className="h-6 w-auto" alt="Mastercard" />;
    if (brand === 'amex') return <img src={AmericanExp} className="h-6 w-auto" alt="Amex" />;
    if (brand === 'bank') return <Landmark size={22} className="text-slate-500" />;
    return null;
};

// label
const cardLabel = (item) => {
    if (item.brand === 'visa') return `Visa ending in ${item.last4}`;
    if (item.brand === 'mastercard') return `Mastercard ending in ${item.last4}`;
    if (item.brand === 'amex') return `American Express ending in ${item.last4}`;
    if (item.brand === 'bank') return `Bank Account •••• ${item.last4}`;
    return `Card ending in ${item.last4}`;
};

// Single payment method row
const PaymentMethodRow = ({ item }) => (
    <div className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0">

        {/* Left - logo + details */}
        <div className="flex items-center gap-4">
            <div className="w-14 h-10 border border-slate-200 rounded-lg flex items-center justify-center bg-white shrink-0">
                <BrandLogo brand={item.brand} />
            </div>

            <div>
                <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-[#0B1E3D]">
                        {cardLabel(item)}
                    </p>
                    {item.isDefault && (
                        <span className="px-2 py-0.5 text-[11px] font-bold text-amber-600 bg-amber-50 border border-amber-200 rounded-full">
                            Default
                        </span>
                    )}
                </div>
                <p className="text-[12px] text-slate-400 mt-0.5">
                    {item.brand === 'bank'
                        ? `${item.bankName}  •  ${item.holder}`
                        : `Expires ${item.expires}  •  ${item.holder}`
                    }
                </p>
            </div>
        </div>

        {/* Right - verified badge + menu */}
        <div className="flex items-center gap-3">
            {item.isVerified && (
                <span className="px-2.5 py-1 text-[11px] font-bold text-green-600 bg-green-50 border border-green-200 rounded-full">
                    Verified
                </span>
            )}
            <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                <MoreVertical size={16} className="text-slate-400" />
            </button>
        </div>
    </div>
);

// Small brand logo for transaction table — smaller than card row
const TransactionBrandLogo = ({ brand }) => {
    if (brand === 'visa') return <img src={VISA} className="h-4 w-auto" alt="Visa" />;
    if (brand === 'mastercard') return <img src={MasterCard} className="h-4 w-auto" alt="Mastercard" />;
    if (brand === 'amex') return <img src={AmericanExp} className="h-4 w-auto" alt="Amex" />;
    if (brand === 'bank') return <Landmark size={14} className="text-slate-400" />;
    return null;
};

const TransactionRow = ({ item }) => (
    <div className="grid grid-cols-12 items-center py-3 border-b border-slate-100 last:border-0">

        {/* date */}
        <div className="col-span-2">
            <p className="text-[12px] text-slate-500">{item.date}</p>
        </div>

        {/* desc */}
        <div className="col-span-4">
            <p className="text-[13px] font-semibold text-[#0B1E3D]">{item.description}</p>
        </div>

        {/* pay method */}
        <div className="col-span-3 flex items-center gap-2">
            <TransactionBrandLogo brand={item.brand} />
            <p className="text-[12px] text-slate-500">•••• {item.last4}</p>
        </div>

        {/* amount */}
        <div className="col-span-2">
            <p className="text-[13px] font-semibold text-[#0B1E3D]">
                AED {item.amount.toLocaleString()}
            </p>
        </div>

        {/* status */}
        <div className="col-span-1 flex justify-end">
            <span className="px-2 py-0.5 text-[11px] font-bold text-green-600 bg-green-50 border border-green-100 rounded-full whitespace-nowrap">
                {item.status}
            </span>
        </div>
    </div>
);

// Table header — col spans must match TransactionRow exactly
const TransactionTableHeader = () => (
    <div className="grid grid-cols-12 items-center pb-3 border-b-2 border-slate-100 mb-1">
        <div className="col-span-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Date</span>
        </div>
        <div className="col-span-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Description</span>
        </div>
        <div className="col-span-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Payment Method</span>
        </div>
        <div className="col-span-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Amount</span>
        </div>
        <div className="col-span-1 flex justify-end">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Status</span>
        </div>
    </div>
);

function BuyerProfilePayment() {

    const [showAll, setShowAll] = useState(false);

    const visibleTransactions = showAll
        ? paymentTransactions
        : paymentTransactions.slice(0, 3);

    return (
        <div>

            {/* payments */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">

                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-base font-bold text-[#0B1E3D]">
                            Payment Methods
                        </h2>
                        <p className="w-105 text-[13px] text-slate-500 mt-1">
                            Manage your saved payment methods for deposits, auction payments and fees.
                        </p>
                    </div>
                    <button
                        className="flex items-center gap-2 px-4 py-2.5 bg-[#D97706] text-white text-sm font-bold rounded-lg transition-all duration-200 ease-in-out hover:bg-amber-600 hover:shadow-md active:scale-[0.97] active:bg-amber-700 shrink-0">
                        + Add Payment Method
                    </button>
                </div>

                {paymentMethods.map(item => (
                    <PaymentMethodRow key={item.id} item={item} />
                ))}

                {/* note */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                    <Lock size={13} className="text-slate-400 shrink-0" />
                    <p className="text-[12px] text-slate-400">
                        Your payment information is securely stored and encrypted.
                    </p>
                </div>
            </div>

            {/* transaction */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm mt-5">

                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-base font-bold text-[#0B1E3D]">
                            Transaction History
                        </h2>
                        <p className="text-[13px] text-slate-500 mt-1">
                            View your recent payment transactions.
                        </p>
                    </div>
                    <button className="text-sm font-semibold text-[#D97706] hover:text-amber-600 transition-colors">
                        View All Transactions
                    </button>
                </div>

                <TransactionTableHeader />
                {visibleTransactions.map(item => (
                    <TransactionRow key={item.id} item={item} />
                ))}

                {/* show more btn */}
                {paymentTransactions.length > 3 && (
                    <button
                        onClick={() => setShowAll(prev => !prev)}
                        className="w-full mt-4 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-sm font-semibold text-[#D97706] hover:text-amber-600 transition-colors"
                    >
                        {showAll ? 'Show Less' : 'View More Transactions'}
                        <ChevronDown
                            size={16}
                            className={`transition-transform duration-200 ${showAll ? 'rotate-180' : ''}`}
                        />
                    </button>
                )}
            </div>
        </div>
    );
}

export default BuyerProfilePayment

import React, { useState } from 'react';
import { CreditCard, Landmark, Palette, MoreHorizontal, ShieldCheck, RefreshCcw, ArrowLeft, ArrowRight, Lock } from 'lucide-react';
import { toast } from "react-toastify";
import useBuyerRegFormStore from '../../../store/useBuyerRegFormStore';

const DEPOSIT_AMOUNT = 5000;
const PLATFORM_FEE = 250;
const TOTAL_PAYABLE = DEPOSIT_AMOUNT + PLATFORM_FEE;

function Step5_PaymentDeposit({ onBack, onNext }) {

  const { formData, setField } = useBuyerRegFormStore();

  const methods = [
    { id: 'card', title: 'Credit / Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, AMEX' },
    { id: 'bank', title: 'Bank Transfer', icon: Landmark, desc: 'Transfer directly from your bank account' },
    { id: 'paypal', title: 'PayPal', icon: Palette, desc: 'Pay securely with your PayPal account' },
    { id: 'other', title: 'Other Methods', icon: MoreHorizontal, desc: 'View more payment options' },
  ];

  const handleContinue = () => {
    if (!formData.paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }
    onNext();
  };

  return (
    <section className='w-full py-10'>
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">

        {/* 1. Payment Methods */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-[#0B1E3D] mb-6">
            1. Select Payment Method
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {methods.map((method) => (
              <div
                key={method.id}
                onClick={() => setField('paymentMethod', method.id)}
                className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${formData.paymentMethod === method.id ? 'border-[#D97706] bg-amber-50/30' : 'border-gray-100 hover:border-gray-200'}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-1 ${formData.paymentMethod === method.id ? 'text-[#D97706]' : 'text-gray-400'}`}>
                    <method.icon size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0B1E3D]">{method.title}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{method.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Deposit Information */}
        <div>
          <h2 className="text-lg font-bold text-[#0B1E3D] mb-6">
            2. Deposit Information
          </h2>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">

            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <span className="text-sm text-gray-600">Required Bid Deposit</span>
              <div className="text-right">
                <span className="font-bold text-[#0B1E3D]">AED {DEPOSIT_AMOUNT.toLocaleString()}</span>
                <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded ml-2">
                  <ShieldCheck size={12} /> REFUNDABLE
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between py-4 border-b border-slate-200">
              <span className="text-sm text-gray-600">Platform Fee (VAT 5%)</span>
              <div className="text-right">
                <span className="font-bold text-[#0B1E3D]">AED {PLATFORM_FEE.toLocaleString()}</span>
                <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded ml-2">
                  NON-REFUNDABLE
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <span className="text-sm font-bold text-[#0B1E3D]">Total Payable</span>
              <span className="text-2xl font-extrabold text-[#D97706]">AED {TOTAL_PAYABLE.toLocaleString()}</span>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <div className="bg-amber-50 p-1.5 rounded-lg text-[#D97706]">
                  <ShieldCheck size={16} />
                </div>
                This deposit is mandatory to place bids on vehicles.
              </div>

              <div className="flex items-center gap-3 text-sm text-slate-600">
                <div className="bg-amber-50 p-1.5 rounded-lg text-[#D97706]">
                  <Lock size={16} />
                </div>
                The bid deposit is refundable; the platform fee is not.
              </div>

              <div className="flex items-center gap-3 text-sm text-slate-600">
                <div className="bg-amber-50 p-1.5 rounded-lg text-[#D97706]">
                  <RefreshCcw size={16} />
                </div>
                Deposit refund will be initiated within 3-5 business days if no purchase is made.
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2 p-3 bg-white rounded-lg border border-slate-200">
              <ShieldCheck size={18} className="text-[#3b82f6]" />
              <p className="text-xs text-slate-600 font-medium">
                The deposit helps us ensure serious and genuine buyers on our platform.
              </p>
            </div>
          </div>
        </div>

      </div>

      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 hover:text-[#D97706] font-semibold py-2.5 rounded-lg text-gray-500 active:scale-95 transition-all duration-200 ease-in-out"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <button
          onClick={handleContinue}
          className="flex items-center gap-2 text-[#D97706] font-semibold border border-[#D97706] py-2.5 px-8 rounded-lg hover:bg-[#D97706] hover:text-white active:scale-95 transition-all duration-200 ease-in-out cursor-pointer"
        >
          Continue
          <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
}

export default Step5_PaymentDeposit;
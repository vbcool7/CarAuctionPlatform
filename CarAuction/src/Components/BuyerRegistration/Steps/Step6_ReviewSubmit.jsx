
import React from 'react';
import { User, FileText, CreditCard, Edit2, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
import useBuyerRegFormStore from '../../../store/useBuyerRegFormStore';

function Step6_ReviewSubmit({ onBack, onSubmit, isPending }) {

  const { formData } = useBuyerRegFormStore();
  const goToStep = useBuyerRegFormStore((state) => state.goToStep);

  const paymentMethodLabels = {
    card: 'Credit / Debit Card',
    bank_transfer: 'Bank Transfer',
    paypal: 'PayPal',
    other: 'Other',
  };

  const DEPOSIT_AMOUNT = 5000;
  const PLATFORM_FEE = 250;

  const sections = [
    {
      title: 'Account Information',
      icon: User,
      step: 1,
      data: {
        Name: `${formData.firstName} ${formData.lastName}`,
        Email: formData.email,
        Phone: formData.mobile,
      },
    },
    {
      title: 'Identity Verification',
      icon: FileText,
      step: 4,
      data: {
        'Document Type': formData.identityDocType,
        'Status': 'Pending Review', // NOT "Verified" — see note below
      },
    },
    {
      title: 'Payment Method',
      icon: CreditCard,
      step: 5,
      data: {
        Method: paymentMethodLabels[formData.paymentMethod] || 'Not selected',
        'Deposit Amount': `AED ${DEPOSIT_AMOUNT.toLocaleString()}`,
        'Platform Fee': `AED ${PLATFORM_FEE.toLocaleString()}`,
        'Total Payable': `AED ${(DEPOSIT_AMOUNT + PLATFORM_FEE).toLocaleString()}`,
      },
    },
  ];

  return (
    <section className='w-full py-10'>
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">

        <h2 className="text-lg font-bold text-[#0B1E3D]">Review Your Information</h2>
        <p className="text-sm text-gray-500 mb-8 pt-1">Please confirm that all details are correct.</p>

        <div className="space-y-6">
          {sections.map((section, idx) => (
            <div key={idx} className="border border-gray-100 rounded-xl p-6 hover:border-blue-100 transition-colors">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-50 p-2 rounded-lg text-[#D97706]">
                    <section.icon size={20} />
                  </div>
                  <h3 className="font-bold text-[#0B1E3D]">{section.title}</h3>
                </div>

                <button
                  onClick={() => goToStep(section.step)}
                  className="text-sm text-[#D97706] flex items-center gap-1 hover:underline">
                  <Edit2 size={14} /> Edit
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {Object.entries(section.data).map(([key, val]) => (
                  <div key={key}>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">{key}</p>
                    <p className="text-sm font-semibold text-gray-700">{val}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3">
          <div className="mt-0.5 text-[#D97706]">
            <ShieldCheck size={20} strokeWidth={2.5} />
          </div>
          <div className="text-sm text-[#0B1E3D]">
            <span className="font-bold">Almost There!</span>
            <p className="text-gray-600 mt-0.5">
              By submitting, you agree to our{' '}
              <a href="#" className="text-[#D97706] font-semibold hover:underline">Terms & Conditions</a>{' '}
              and{' '}
              <a href="#" className="text-[#D97706] font-semibold hover:underline">Privacy Policy</a>.
            </p>
          </div>
        </div>

      </div>

      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={onBack}
          disabled={isPending}
          className="flex items-center gap-2 hover:text-[#D97706] font-semibold py-2.5 rounded-lg text-gray-500 active:scale-95 transition-all duration-200 ease-in-out disabled:opacity-50"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <button
          onClick={onSubmit}
          disabled={isPending}
          className="flex items-center gap-2 text-[#D97706] font-semibold border border-[#D97706] py-2.5 px-8 rounded-lg hover:bg-[#D97706] hover:text-white active:scale-95 transition-all duration-200 ease-in-out cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Submitting...' : 'Save Registration'}
          <CheckCircle2 size={18} />
        </button>
      </div>
    </section>
  );
}

export default Step6_ReviewSubmit;
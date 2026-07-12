
import React, { useState } from 'react';
import RegistrationNavbar from '../Components/BuyerRegistration/RegistrationNavbar';
import RegistrationStepper from '../Components/BuyerRegistration/RegistrationStepper';

import Step1_CreateAccount from '../Components/BuyerRegistration/Steps/Step1_CreateAccount';
import Step2_VerifyContact from '../Components/BuyerRegistration/Steps/Step2_VerifyContact';
import Step3_PersonalInfo from '../Components/BuyerRegistration/Steps/Step3_PersonalInfo';
import Step4_KYCVerification from '../Components/BuyerRegistration/Steps/Step4_KYCVerification';
import Step5_PaymentDeposit from '../Components/BuyerRegistration/Steps/Step5_PaymentDeposit';
import Step6_ReviewSubmit from '../Components/BuyerRegistration/Steps/Step6_ReviewSubmit';

import Step1_SidePanel from '../Components/BuyerRegistration/SideContent/Step1_SidePanel';
import Step2_SidePanel from '../Components/BuyerRegistration/SideContent/Step2_SidePanel';
import Step3_SidePanel from '../Components/BuyerRegistration/SideContent/Step3_SidePanel';
import Step4_SidePanel from '../Components/BuyerRegistration/SideContent/Step4_SidePanel';
import Step5_SidePanel from '../Components/BuyerRegistration/SideContent/Step5_SidePanel';
import Step6_SidePanel from '../Components/BuyerRegistration/SideContent/Step6_SidePanel';

import RegistrationSuccessModal from '../Components/BuyerRegistration/RegistrationSuccessModal';
import { useBuyerRegistration } from '../hook/useBuyer';
import useBuyerRegFormStore from '../store/useBuyerRegFormStore';
import { buildFormData } from '../utils/buildFormData';
import toast from 'react-hot-toast';

const header = [
  { id: 1, heading: "Create Your Buyer Account", subHeading: "Join thousands of verified bidders and buy your dream car." },
  { id: 2, heading: "Verify Your Contact Information", subHeading: "Please verify your email address and mobile number to continue." },
  { id: 3, heading: "Personal Information", subHeading: "Please provide your personal details to continue." },
  { id: 4, heading: "KYC Verification", subHeading: "Please verify your identity to continue." },
  { id: 5, heading: "Payment Deposit", subHeading: "Add a refundable deposit to start bidding on our auctions." },
  { id: 6, heading: "Review & Submit", subHeading: "Please review your information carefully before submitting your registration." },
];

function BuyerRegistrationPage() {

  const currentStep = useBuyerRegFormStore((state) => state.currentStep);
  const nextStep = useBuyerRegFormStore((state) => state.nextStep);
  const prevStep = useBuyerRegFormStore((state) => state.prevStep);
  const goToStep = useBuyerRegFormStore((state) => state.goToStep);
  const formData = useBuyerRegFormStore((state) => state.formData);

  const { mutate: registerBuyer, isPending } = useBuyerRegistration();
  const [showSuccess, setShowSuccess] = useState(false);

  const currentHeader = header.find(h => h.id === currentStep);

  // submit
   const handleSubmit = () => {
    const data = buildFormData(formData);
    for (let [key, val] of data.entries()) console.log(key, val);
    registerBuyer(data, {
      onSuccess: () => setShowSuccess(true),
      onError: (err) => toast.error(err?.response?.data?.message || 'Registration failed'),
    });
  };

  const stepComponents = {
    1: { left: <Step1_CreateAccount onNext={nextStep} />, right: <Step1_SidePanel /> },
    2: { left: <Step2_VerifyContact onNext={nextStep} onBack={prevStep} />, right: <Step2_SidePanel /> },
    3: { left: <Step3_PersonalInfo onNext={nextStep} onBack={prevStep} />, right: <Step3_SidePanel /> },
    4: { left: <Step4_KYCVerification onNext={nextStep} onBack={prevStep} />, right: <Step4_SidePanel /> },
    5: { left: <Step5_PaymentDeposit onNext={nextStep} onBack={prevStep} />, right: <Step5_SidePanel /> },
    6: { left: <Step6_ReviewSubmit onBack={prevStep} onSubmit={handleSubmit} isPending={isPending} />, right: <Step6_SidePanel /> },
  };

  return (
    <>
      {/* ======= navbar ======== */}
      <RegistrationNavbar />

      {/* ======= heading ======== */}
      <div className='max-w-6xl mx-auto px-4 sm:px-5 lg:px-6 py-6'>
        <h1 className='text-3xl font-semibold text-slate-800'>{currentHeader.heading}</h1>
        <p className='pt-1 text-sm text-gray-600'>{currentHeader.subHeading}</p>
      </div>

      {/* ======= stepper ======== */}
      <div className='max-w-6xl mx-auto px-4 sm:px-5 lg:px-6'>
        <RegistrationStepper currentStep={currentStep} onStepChange={goToStep} />
      </div>

      {/* ======= form/content ======== */}
      <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-6 grid grid-cols-12 gap-5">
        <div className="col-span-8">{stepComponents[currentStep].left}</div>
        <div className="col-span-4">{stepComponents[currentStep].right}</div>
      </div>

      {/* ======= success modal ======== */}
      {showSuccess &&
        <RegistrationSuccessModal
          isOpen={showSuccess}
          onClose={() => setShowSuccess(false)} />
      }
    </>
  )
}

export default BuyerRegistrationPage;
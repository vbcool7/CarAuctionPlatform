
import React, { useState } from 'react';
import { UploadCloud, ShieldCheck, FileText, CheckCircle2, X, ArrowLeft, ArrowRight, ChevronDown, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

import useBuyerRegFormStore from '../../../store/useBuyerRegFormStore';

const identityOptions = [
  { value: 'passport', label: 'Passport' },
  { value: 'national_id', label: 'National ID ' },
  { value: 'driving_license', label: 'Driver’s License' }
];

const addressOptions = [
  { value: 'utility_bill', label: 'Utility Bill (Electricity/Water)' },
  { value: 'bank_statement', label: 'Bank Statement' },
  { value: 'rental_agreement', label: 'Rental Agreement' }
];

const docConfigs = {
  passport: { fields: [{ key: 'frontImage', label: 'Front Side' }, { key: 'backImage', label: 'Back Side' }] },
  national_id: { fields: [{ key: 'frontImage', label: 'Front Side' }, { key: 'backImage', label: 'Back Side' }] },
  driving_license: { fields: [{ key: 'frontImage', label: 'Front Side' }] }
};

const addrConfigs = {
  utility_bill: { fields: [{ key: 'documentFile', label: 'Utility Bill' }] },
  bank_statement: { fields: [{ key: 'documentFile', label: 'Bank Statement' }] },
  rental_agreement: {
    fields: [
      { key: 'documentFile', label: 'Rental Agreement' },
      { key: 'landlordIdFile', label: 'Landlord ID' }
    ]
  },
};

// Helper for Upload Card
const UploadCard = ({ title, file, onUpload, onRemove }) => {
  if (file) {
    return (
      <div className="border border-dashed border-gray-300 rounded-xl py-4 px-2 flex items-center justify-between hover:bg-gray-50 w-full overflow-hidden">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <FileText
            size={20}
            className="text-amber-600 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold truncate">{file.name}</p>
            <p className="text-xs text-gray-400">{
              (file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-2">
          <CheckCircle2 size={18} className="text-green-500" />
          <button
            onClick={onRemove}
            className="text-gray-400 hover:text-red-500 transition-colors">
            <X size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <label className="border border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-amber-50/30 hover:border-amber-400 transition cursor-pointer">
      <UploadCloud
        className="text-[#D97706] mb-2"
        size={28} />
      <span className="text-xs text-gray-500">{title}</span>
      <input
        type="file"
        className="hidden"
        accept="image/*,.pdf"
        onChange={(e) => {
          const selected = e.target.files?.[0];
          if (selected) {
            if (selected.size > 5 * 1024 * 1024) {
              toast.error('File must be under 5MB');
              e.target.value = '';
              return;
            }
            onUpload(selected);
            e.target.value = '';
          }
        }}
      />
    </label>
  );
};

function Step4_KYCVerification({ onBack, onNext }) {

  const { formData, setField } = useBuyerRegFormStore();

  const [isOpen, setIsOpen] = useState(false);
  const [isAddrOpen, setIsAddrOpen] = useState(false);

  const docType = formData.identityDocType;
  const addrType = formData.addressDocType;

  const handleContinue = () => {

    if (!docType) return toast.error("Please select an identity document type");

    const requiredIdentityFields = docConfigs[docType]?.fields || [];
    for (const f of requiredIdentityFields) {
      if (!formData[f.key]) return toast.error(`${f.label} is required`);
    }
    if (!formData.selfieImage) return toast.error("Selfie is required");

    if (!addrType) return toast.error("Please select an address document type");

    const requiredAddrFields = addrConfigs[addrType]?.fields || [];
    for (const f of requiredAddrFields) {
      if (!formData[f.key]) return toast.error(`${f.label} is required`);
    }

    onNext();
  }

  return (
    <section className='w-full py-10'>
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">

        {/* 1. Identity Verification */}
        <h2 className="text-lg font-bold text-[#0B1E3D]">
          1. Identity Verification
        </h2>
        <p className="text-sm text-gray-500 mb-6 ml-5">
          Upload a clear, valid government issued document.
        </p>

        <div
          className="relative w-full md:w-1/3 mb-6"
          tabIndex={0}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}>

          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Document Type <span className='text-red-500'>*</span>
          </label>

          <div
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full flex items-center justify-between px-4 py-2.5 border rounded-lg cursor-pointer ${isOpen ? 'border-[#D97706] ring-[#D97706]' : 'border-gray-200'}`}>
            <div className="flex items-center gap-2 text-gray-700 font-medium text-sm">
              <FileText size={18} className="text-gray-400" />
              {identityOptions.find(o => o.value === docType)?.label || "Select Document"}
            </div>
            <ChevronDown size={18} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>

          {isOpen && (
            <div className="absolute z-20 w-full mt-2 bg-white border border-gray-100 rounded-lg shadow-xl overflow-hidden">
              {identityOptions.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => {
                    setField('identityDocType', opt.value);
                    setField('frontImage', null);
                    setField('backImage', null);
                    setIsOpen(false);
                  }}
                  className={`px-4 py-3 cursor-pointer hover:bg-amber-50/40 hover:text-[#D97706] text-sm
                    ${docType === opt.value ? 'bg-amber-50/40 text-[#D97706]' : ''}`}
                >
                  {opt.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- dynamic fields --- */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {(docConfigs[docType]?.fields || []).map((field) => (
            <div key={field.key} className="space-y-3">
              <p className="text-sm font-semibold">{field.label}</p>
              <UploadCard
                title={`Upload ${field.label}`}
                file={formData[field.key]}
                onUpload={(f) => setField(field.key, f)}
                onRemove={() => setField(field.key, null)}
              />
            </div>
          ))}

          {/* always visible */}
          <div className="space-y-3">
            <p className="text-sm font-semibold">Selfie Verification</p>
            <UploadCard
              title="Take a selfie or upload"
              file={formData.selfieImage}
              onUpload={(f) => setField('selfieImage', f)}
              onRemove={() => setField('selfieImage', null)}
            />
          </div>
        </div>

        {/* 2. Address Verification */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-[#0B1E3D]">
            2. Address Verification
          </h2>
          <p className="text-sm text-gray-500 mb-6 ml-5">
            Upload any document that shows your current address.
          </p>

          {/* Custom Dropdown */}
          <div
            className="relative w-full md:w-1/3 mb-6"
            tabIndex={0}
            onBlur={() => setTimeout(() => setIsAddrOpen(false), 200)}
          >
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Document Type <span className="text-red-500">*</span>
            </label>

            <div
              onClick={() => setIsAddrOpen(!isAddrOpen)}
              className={`w-full flex items-center justify-between px-4 py-2.5 border rounded-lg cursor-pointer ${isAddrOpen ? 'border-[#D97706]' : 'border-gray-200'}`}
            >
              <div className="flex items-center gap-2 text-gray-700 font-medium text-sm">
                <FileText size={18} className="text-gray-400" />
                {addressOptions.find(o => o.value === addrType)?.label || 'Select Document'}
              </div>
              <ChevronDown size={18} className={`text-gray-500 transition-transform 
                ${isAddrOpen ? 'rotate-180' : ''}`} />
            </div>

            {isAddrOpen && (
              <div className="absolute z-20 w-full mt-2 bg-white border border-gray-100 rounded-lg shadow-xl overflow-hidden">
                {addressOptions.map((opt) => (
                  <div
                    key={opt.value}
                    onClick={() => {
                      setField('addressDocType', opt.value);
                      setField('documentFile', null);
                      setField('landlordIdFile', null);
                      setIsAddrOpen(false);
                    }}
                    className={`px-4 py-3 cursor-pointer hover:bg-amber-50/40 hover:text-[#D97706] text-sm 
                      ${addrType === opt.value ? 'bg-amber-50/40 text-[#D97706]' : ''}`}
                  >
                    {opt.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dynamic Upload Fields */}
          <div className="grid md:grid-cols-3 gap-6">
            {(addrConfigs[addrType]?.fields || []).map((field) => (
              <div key={field.key} className="space-y-2">
                <p className="text-sm font-semibold text-gray-700">{field.label}</p>
                <UploadCard
                  title="Click to upload"
                  file={formData[field.key]}
                  onUpload={(f) => setField(field.key, f)}
                  onRemove={() => setField(field.key, null)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Security Box */}
        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 mt-8">
          <ShieldCheck className="text-[#D97706]" />
          <div>
            <p className="text-sm font-bold text-[#0B1E3D]">Your information is secure</p>
            <p className="text-xs text-gray-500">We use industry-standard encryption to protect your data and documents.</p>
          </div>
        </div>

      </div>

      {/* butn */}
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

export default Step4_KYCVerification;

import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';
import InputField from './Shared/InputField';

function SellerOverviewTab({ data, isEditing, updateField }) {

  const contactInfoFields = [
    { label: "Email Address", name: "email", value: data.email },
    { label: "Phone Number", name: "phone", value: data.phone },
    { label: "Alternate Phone", name: "alternatePhone", value: data.alternatePhone },
    { label: "Website", name: "website", value: data.website },
    { label: "Business Address", name: "businessAddress.street", value: data.businessAddress.street },
    { label: "City", name: "businessAddress.city", value: data.businessAddress.city },
    { label: "Country", name: "businessAddress.country", value: data.businessAddress.country },
    { label: "Zip / Postal Code", name: "businessAddress.zip", value: data.businessAddress.zip },
  ];

  const socialMediaFields = [
    { label: "Facebook", name: "socialMedia.facebook", value: data.socialMedia?.facebook, icon: FaFacebook, color: "text-blue-600" },
    { label: "Instagram", name: "socialMedia.instagram", value: data.socialMedia?.instagram, icon: FaInstagram, color: "text-pink-600" },
    { label: "Twitter", name: "socialMedia.twitter", value: data.socialMedia?.twitter, icon: FaTwitter, color: "text-sky-600" },
    { label: "LinkedIn", name: "socialMedia.linkedin", value: data.socialMedia?.linkedin, icon: FaLinkedin, color: "text-blue-600" },
  ];

  const bankInfoFields = [
    { label: "Bank Name", name: "bankDetails.bankName", value: data.bankDetails?.bankName },
    { label: "Account Number", name: "bankDetails.accountNumber", value: data.bankDetails?.accountNumber },
    { label: "Branch Name", name: "bankDetails.branchName", value: data.bankDetails?.branchName },
    { label: "Account Holder Name", name: "bankDetails.accountHolderName", value: data.bankDetails?.accountHolderName },
    { label: "IBAN", name: "bankDetails.iban", value: data.bankDetails?.iban },
    { label: "SWIFT Code", name: "bankDetails.swiftCode", value: data.bankDetails?.swiftCode },
  ];

  return (
    <div>

      {/*contact Information */}
      <div className="mb-8">
        <h3 className="font-bold text-slate-900 mb-4">
          Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contactInfoFields.map((item, i) => (
            <div key={i}>
              {isEditing ? (
                <InputField
                  label={item.label}
                  name={item.name}
                  value={item.value || ''}
                  onChange={updateField}
                />
              ) : (
                <>
                  <p className="text-xs text-slate-500 uppercase">{item.label}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900">{item.value || '--'}</p>
                    {item.badge && <span className="text-[10px] bg-green-50 text-green-600 px-1.5 rounded">{item.badge}</span>}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <hr className="my-6 border-slate-100" />

      {/* bank and pay info */}
      <div className="mb-8">
        <h3 className="font-bold text-slate-900 mb-4">Bank & Payment Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bankInfoFields.map((item, i) => (
            <div key={i}>
              {isEditing ? (
                <InputField
                  label={item.label}
                  name={item.name}
                  value={item.value || ''}
                  onChange={updateField}
                />
              ) : (
                <div>
                  <p className="text-xs text-slate-500 uppercase">{item.label}</p>
                  <p className="text-sm font-semibold text-slate-900 mt-1">{item.value || '--'}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <hr className="my-6 border-slate-100" />

      {/* Social Media */}
      <div className="mb-8">
        <h3 className="font-bold text-slate-900 mb-4">Social Media</h3>
        <div className="grid grid-cols-2 gap-6">
          {socialMediaFields.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i}>
                {isEditing ? (
                  <InputField
                    label={item.label}
                    name={item.name}
                    value={item.value || ''}
                    onChange={updateField}
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${item.color}`} />
                    <p className="text-sm font-semibold text-slate-900">{item.value || '--'}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  )
}

export default SellerOverviewTab;
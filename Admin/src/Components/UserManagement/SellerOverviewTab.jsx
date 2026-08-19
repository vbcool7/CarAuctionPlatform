
import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';
import InputField from './Shared/InputField';

function SellerOverviewTab({ data, isEditing, updateField }) {

  const contactInfoFields = [
    { label: "Name", name: "email", value: data.fullName },
    { label: "Email Address", name: "email", value: data.email },
    { label: "Phone Number", name: "phone", value: data.phone },
  ];

  const addressInfoFields = [
    { label: "Country", name: "country", value: data.country },
    { label: "Emirate", name: "country", value: data.emirate },
    { label: "City", name: "city", value: data.city },
    { label: "Area / District", name: "area", value: data.area },
    { label: "Street Address", name: "street", value: data.streetAddress },
    { label: "Building", name: "building", value: data.building },
    { label: "P.O Box", name: "poBox", value: data.poBox },
    { label: "Zip / Postal Code", name: "zip", value: data.zip },
  ];

  const bankInfoFields = [
    { label: "Account Holder Name", name: "accountHolderName", value: data.accountHolderName },
    { label: "Bank Name", name: "bankName", value: data.bankName },
    { label: "IBAN", name: "iban", value: data.ibanNumber },
    { label: "Account Number", name: "accountNumber", value: data.accountNumber },
    { label: "SWIFT Code", name: "swiftCode", value: data.swiftCode },
    { label: "Currency", name: "currency", value: data.currency },
  ];

  const socialMediaFields = [
    { label: "Facebook", name: "socialMedia.facebook", value: data.socialMedia?.facebook, icon: FaFacebook, color: "text-blue-600" },
    { label: "Instagram", name: "socialMedia.instagram", value: data.socialMedia?.instagram, icon: FaInstagram, color: "text-pink-600" },
    { label: "Twitter", name: "socialMedia.twitter", value: data.socialMedia?.twitter, icon: FaTwitter, color: "text-sky-600" },
    { label: "LinkedIn", name: "socialMedia.linkedin", value: data.socialMedia?.linkedin, icon: FaLinkedin, color: "text-blue-600" },
  ];

  const formatEnumValue = (value) => {
    if (!value) return "--";

    return value
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div>

      {/* basic Information */}
      <div className="md:mb-8">
        <h3 className="font-bold text-slate-900 mb-4">
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    <p className="text-sm font-semibold text-slate-700 truncate">{formatEnumValue(item.value) || '---'}</p>
                    {item.badge && <span className="text-[10px] bg-green-50 text-green-600 px-1.5 rounded">{item.badge}</span>}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <hr className="my-4 md:my-6 border-slate-100" />

      {/* address Information */}
      <div className="md:mb-8">
        <h3 className="font-bold text-slate-900 mb-4">
          Address Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {addressInfoFields.map((item, i) => (
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
                    <p className="text-sm font-semibold text-slate-700 truncate">{formatEnumValue(item.value) || '---'}</p>
                    {item.badge && <span className="text-[10px] bg-green-50 text-green-600 px-1.5 rounded">{item.badge}</span>}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <hr className="my-4 md:my-6 border-slate-100" />

      {/* bank and pay info */}
      <div className="md:mb-8">
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
                  <p className="text-sm font-semibold text-slate-700 mt-1">{formatEnumValue(item.value) || '---'}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <hr className="my-4 md:my-6 border-slate-100" />

      {/* Social Media */}
      <div className="md:mb-8">
        <h3 className="font-bold text-slate-900 mb-4">Social Media</h3>
        <div className="grid grid-cols-1 md:grid md:grid-cols-2 gap-6">
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
                    <p className="text-sm font-semibold text-slate-700">{item.value || 'Not Applicable'}</p>
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
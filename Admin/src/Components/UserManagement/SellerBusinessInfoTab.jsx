
import React from 'react';
import InputField from './Shared/InputField';

function SellerBusinessInfoTab({ data, isEditing, updateField }) {

  const businessInformation = [
    { label: "Business / Company Name", name: "companyName", value: data.companyName },
    { label: "Business Type", name: "sellerType", value: data.sellerType },
    { label: "Company Registration Number", name: "regNumber", value: data.regNumber },
    { label: "Trade License Number", name: "tradeLicenseNumber", value: data.tradeLicenseNumber },
    { label: "Trade License Issue Date", name: "tradeLicenseIssueDate", value: data.tradeLicenseIssueDate },
    { label: "Trade License Expiry Date", name: "tradeLicenseExpiry", value: data.tradeLicenseExpiry },
    { label: "VAT Number", name: "vatNumber", value: data.vatNumber },
    { label: "Est. Year", name: "establishedYear", value: data.establishedYear },
    { label: "Number of Employees", name: "numberOfEmployees", value: data.numberOfEmployees },
    { label: "Preferred Language", name: "preferredLanguage", value: data.preferredLanguage },
  ];

  const businessAddress = [
    { label: "Showroom / Office Address", name: "businessAddress.street", value: data.businessAddress?.street },
    { label: "Zip / Postal Code", name: "businessAddress.zip", value: data.businessAddress?.zip },
    { label: "Country", name: "businessAddress.country", value: data.businessAddress?.country },
    { label: "Phone Number", name: "phone", value: data.phone },
    { label: "City", name: "businessAddress.city", value: data.businessAddress?.city },
    { label: "Email Address", name: "email", value: data.email },
  ];

  const businessDescription = {
    label: "About Business",
    name: "aboutBusiness",
    value: data.aboutBusiness,
  };

  return (
    <div>
      {/* business company detail */}
      <div className="md:mb-8">
        <h3 className="font-bold text-slate-900 mb-4">
          Business / Company Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {businessInformation.map((item, i) => (
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
                    <p className="text-sm font-semibold text-slate-700">{item.value || '--'}</p>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <hr className="my-4 md:my-6 border-slate-100" />

      {/* business address */}
      <div className="md:mb-8">
        <h3 className="font-bold text-slate-900 mb-4">
          Business Address
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {businessAddress.map((item, i) => (
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
                    <p className="text-sm font-semibold text-slate-700">{item.value || '--'}</p>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* map — NOT built, placeholder only, decide separately */}
        <div>
        </div>
      </div>

      <hr className="my-4 md:my-6 border-slate-100" />

      {/* business desc */}
      <div className="md:mb-8">
        <h3 className="font-bold text-slate-900 mb-4">
          Business Description
        </h3>
        <>
          {isEditing ? (
            <InputField
              label={businessDescription.label}
              name={businessDescription.name}
              value={businessDescription.value || ""}
              onChange={updateField}
              type="textarea"
            />
          ) : (
            <>
              <p className="text-xs text-slate-500 uppercase">
                {businessDescription.label}
              </p>
              <p className="text-sm font-semibold text-slate-700">
                {businessDescription.value || "No Business Description Available"}
              </p>
            </>
          )}
        </>
      </div>
    </div>
  )
}

export default SellerBusinessInfoTab;
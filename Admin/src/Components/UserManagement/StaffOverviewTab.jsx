
import React from 'react';
import { User, Building, UserCheck } from 'lucide-react';
import InputField from './Shared/InputField';

function StaffOverviewTab({ isEditing, data, updateField }) {

  const personalInfoFields = [
    { label: "Full Name", name: "name", value: data.name },
    { label: "Date of Birth", name: "dob", value: data.dob },
    { label: "Gender", name: "gender", value: data.gender },
    { label: "Nationality", name: "nationality", value: data.nationality },
    { label: "Email Address", name: "email", value: data.email },
    { label: "Phone Number", name: "phone", value: data.phone },
    { label: "Alternate Phone", name: "alternatePhone", value: data.alternatePhone },
    { label: "ID / Passport Number", name: "idNumber", value: data.idNumber },
    {
      label: "Address",
      name: "address",
      value: `${data.address?.street}, ${data.address?.city}, ${data.address?.country}`
    },
    { label: "Language", name: "language", value: data.language },
    {
      label: "Emergency Contact",
      name: "emergencyContact",
      value: `${data.emergencyContact?.name} (${data.emergencyContact?.phone})`
    },
  ];

  const workInfoFields = [
    { label: "Role", name: "role", value: data.role },
    { label: "Employee ID", name: "employeeId", value: data.employeeId },
    { label: "Employment Type", name: "employmentType", value: data.employmentType },
    { label: "Department", name: "department", value: data.department },
    { label: "Date of Joining", name: "joinedOn", value: data.joinedOn },
    { label: "Office Location", name: "officeLocation", value: data.officeLocation },
    { label: "Reporting To", name: "reportingTo", value: data.reportingTo },
    { label: "Work Phone", name: "workPhone", value: data.workPhone },
    { label: "Payroll Type", name: "payrollType", value: data.payrollType },
  ];

  const accountInfoFields = [
    { label: "Username", name: "username", value: data.username },
    { label: "Password Change", name: "passwordChangeDate", value: data.passwordChangeDate },
    { label: "Account Created On", name: "joinedOn", value: data.joinedOn },
    { label: "Account Status", name: "status", value: data.status, type: "select" }, // Yahan add kiya
  ];

  return (
    <div>

      {/* personal info */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-amber-500" />
          <h3 className="font-bold text-slate-900">Personal Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {personalInfoFields.map((item, i) => (
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
                  <p className="text-sm font-semibold text-slate-900 mt-1">
                    {item.value || '--'}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* work info */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Building className="w-5 h-5 text-amber-500" />
          <h3 className="font-bold text-slate-900">Work Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {workInfoFields.map((item, i) => (
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
                  <p className="text-sm font-semibold text-slate-900 mt-1">
                    {item.value || '--'}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* acc info */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <UserCheck className="w-5 h-5 text-amber-500" />
          <h3 className="font-bold text-slate-900">Account Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {accountInfoFields.map((item, i) => (
            <div key={i}>
              {isEditing ? (
                item.type === "select" ? (
                  <div className="flex flex-col">
                    <label className="text-xs text-slate-500 uppercase mb-1">{item.label}</label>
                    <select
                      name={item.name}
                      value={item.value}
                      onChange={(e) => updateField(e.target.name, e.target.value)}
                      className="text-sm border border-slate-200 rounded-lg px-3 py-1.5"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                ) : (
                  <InputField label={item.label} name={item.name} value={item.value} onChange={(e) => updateField(e.target.name, e.target.value)} />
                )
              ) : (
                <div>
                  <p className="text-xs text-slate-500 uppercase">{item.label}</p>
                  {item.name === "status" ? (
                    <span className={`text-[12px] font-semibold px-2 py-0.5 rounded capitalize ${item.value === 'active' ? 'bg-green-50 text-green-700' :
                      item.value === 'suspended' ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                      {item.value || '--'}
                    </span>
                  ) : (
                    <p className="text-sm font-semibold text-slate-900 mt-1">{item.value || '--'}</p>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* 2fa */}
          <div>
            <p className="text-xs text-slate-500 uppercase mb-1">
              Two Factor Authentication
            </p>
            {isEditing ? (
              <label className="flex items-center gap-2 text-sm cursor-pointer border rounded-lg p-2">
                <input
                  type="checkbox"
                  name="twoFAEnabled"
                  checked={!!data.twoFAEnabled}
                  onChange={(e) => updateField(e.target.name, e.target.checked)}
                  className="w-4 h-4"
                />
                {data.twoFAEnabled ? 'Enabled' : 'Disabled'}
              </label>
            ) : (
              <span className={`text-[12px] font-semibold px-2 py-0.5 rounded 
              ${data.twoFAEnabled ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                {data.twoFAEnabled ? 'Enabled' : 'Disabled'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StaffOverviewTab;
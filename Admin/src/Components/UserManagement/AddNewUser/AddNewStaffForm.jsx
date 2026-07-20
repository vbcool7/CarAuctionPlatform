
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import FormPageHeader from '../Shared/FormPageHeader';
import ProfileImageUpload from '../Shared/ProfileImageUpload';
import PermissionSelector from '../Shared/PermissionSelector';
import AccountStatus from '../Shared/AccountStatus';
import CustomDropdown from '../../SharedComponents/CustomDropDown';
import InputField from '../Shared/InputField';
import DateInputField from '../Shared/DateInputField';

// for acc status compo
const staffOptions = [
  { value: 'active', label: 'Active', description: 'Staff can login and access system', colorClass: 'bg-green-50 text-green-700' },
  { value: 'inactive', label: 'Inactive', description: 'Staff cannot login', colorClass: 'bg-orange-50 text-orange-700' },
  { value: 'suspended', label: 'Suspended', description: 'Staff account is suspended', colorClass: 'bg-red-50 text-red-700' },
];

function AddNewStaffForm({ setCurrentPage }) {

  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    nationality: '',
    passportNumber: '',
    idType: '',
    issueDate: '',

    // Business Information
    role: '',
    department: '',
    reportingTo: '',
    employeeid: '',
    joiningDate: '',
    workPhone: 'Dealer',

    // Account Information
    password: '',
    confirmPassword: '',

    // Additional Information
    address: '',
    preferredLanguage: '',
    remarks: '',

    status: ''
  });

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedGender, setSelectedGender] = useState("");

  const [selectedIssueDate, setSelectedIssueDate] = useState(new Date());

  const [selectedRole, setSelectedRole] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedReporting, setSelectedReporting] = useState("");
  const [selectedJoiningDate, setSelectedJoiningDate] = useState(new Date());

  const [selectedLang, setSelectedLang] = useState("");
  const [welcomeEmailToggle, setWelcomeEmailToggle] = useState(true);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // validation yahan pehle, phir API call
    console.log('submitting buyer:', formData);
  };

  const handleCancel = () => {
    setCurrentPage('staffs');
  };

  return (
    <div>
      <FormPageHeader
        title="Add New Staff"
        breadcrumbItems={[
          { label: 'Dashboard', onClick: () => setCurrentPage('dashboard') },
          { label: 'Staffs', onClick: () => setCurrentPage('staffs') },
          { label: 'Add New Staff' },
        ]}
        onBack={() => setCurrentPage('staffs')}
        backLabel="Back to Staffs"
      />

      {/* form container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6">

        {/* left side - section */}
        <div className="lg:col-span-2 space-y-6">

          {/* Personal Information */}
          <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h2 className="text-base font-bold text-[#0B1E3D] mb-6">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField label="Full Name" name="fullName" value={formData.fullName} onChange={updateField} required />
              <InputField label="Email Address" name="email" value={formData.email} onChange={updateField} required />
              <InputField label="Phone Number" name="phone" value={formData.phone} onChange={updateField} required />

              {/* dob */}
              <DateInputField
                label="Date of Birth"
                selected={formData.dob}
                onChange={(date) => updateField('dob', date)}
                placeholder="Select Date Of Birth"
                variant="dob"
                required
              />

              <CustomDropdown
                label="Gender"
                placeholder="Select Gender"
                options={['Male', 'Female', 'Other']}
                selected={selectedGender}
                onChange={setSelectedGender}
                requiredField
              />

              <InputField label="Nationality" name="nationality" value={formData.nationality} onChange={updateField} required />

              <InputField label="ID / Passport Number" name="passportNumber" value={formData.passportNumber} onChange={updateField} required />
              <InputField label="ID Type" name="idType" value={formData.idType} onChange={updateField} required />

              {/* issue date */}
              <DateInputField
                label="Issue Date"
                selected={formData.issueDate}
                onChange={(date) => updateField('issueDate', date)}
                placeholder="Select issue date"
              />
            </div>
          </div>

          {/* work Information */}
          <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h2 className="text-base font-bold text-[#0B1E3D] mb-6">
              Work Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* role */}
              <CustomDropdown
                label="Role"
                placeholder="Select Role"
                options={['NA', 'NA', 'Other']}
                selected={selectedRole}
                onChange={setSelectedRole}
                requiredField
              />

              {/* depart */}
              <CustomDropdown
                label="Department"
                placeholder="Select Department"
                options={['NA', 'NA', 'Other']}
                selected={selectedDepartment}
                onChange={setSelectedDepartment}
                requiredField
              />

              {/* reporting to */}
              <CustomDropdown
                label="Reporting To"
                placeholder="Select Reporting Manager"
                options={['NA', 'NA', 'Other']}
                selected={selectedReporting}
                onChange={setSelectedReporting}
                requiredField
              />

              <InputField label="Employee ID" name="employeeid" value={formData.employeeid} onChange={updateField} required />

              {/* joining date */}
              <DateInputField
                label="Date of Joining"
                selected={formData.joiningDate}
                onChange={(date) => updateField('joiningDate', date)}
                placeholder="Select joining date"
                required
              />

              {/* work phone */}
              <InputField label="Work Phone (Optional)" name="workPhone" value={formData.workPhone} onChange={updateField} required />

            </div>
          </div>

          {/* Account Information */}
          <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h2 className="text-base font-bold text-[#0B1E3D] mb-6">
              Account Information
            </h2>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>

              {/* pass */}
              <InputField label="Password" name="password" type='password' value={formData.password} required onChange={updateField} />

              {/* confirm pass */}
              <InputField label="ConfirmPassword" name="confirmPassword" type='password' value={formData.confirmPassword} required onChange={updateField} />
            </div>
          </div>

          {/* additional Information */}
          <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h2 className="text-base font-bold text-[#0B1E3D] mb-6">
              Additional Information
            </h2>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>

              <CustomDropdown
                label="Preffered Language"
                placeholder="Select Preffered Language"
                options={['English']}
                selected={selectedLang}
                onChange={setSelectedLang}
              />

              <InputField label="Address" name='address' value={formData.address} onChange={updateField} />

              <InputField label="Remarks (Optional)" name='remarks' value={formData.remarks} onChange={updateField} />
            </div>
          </div>

          {/* btns */}
          <div className="flex flex-col lg:flex-wrap xl:flex-nowrap xl:flex-row xl:justify-between gap-6">

            {/* toggle */}
            <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
              <button
                onClick={() => setWelcomeEmailToggle(!welcomeEmailToggle)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none 
                        ${welcomeEmailToggle ? "bg-[#D97706]" : "bg-gray-300"}`}>
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 
                            ${welcomeEmailToggle ? "translate-x-5 md:translate-x-6" : "translate-x-1"}`}
                />
              </button>
              <div className="flex-1 min-w-0 flex flex-col">
                <span className="text-[12px] font-semibold text-slate-500 uppercase tracking-wide">
                  Send Welcome Email
                </span>

                <span className="text-[13px] md:text-sm text-slate-500">
                  Seller will receive an email with login credentials
                </span>
              </div>
            </div>

            <div className="flex w-full sm:w-auto flex-wrap justify-end gap-3 xl:ml-6 shrink-0">

              {/* Cancel */}
              <button
                onClick={handleCancel}
                className="flex-1 md:flex-none rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 transition-all duration-300 hover:border-[#D97706] hover:bg-amber-50 hover:text-[#0B1E3D] cursor-pointer"
              >
                Cancel
              </button>

              {/* Create Buyer */}
              <button
                onClick={handleSubmit}
                className="flex-1 md:flex-none rounded-xl bg-[#D97706] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-[#B45309] hover:shadow-lg active:scale-[0.98] cursor-pointer"
              >
                Create Staff
              </button>
            </div>
          </div>
        </div>

        {/* right side - section */}
        <div className="space-y-6">

          {/* img upload */}
          <ProfileImageUpload
            image={formData.profileImage}
            onChange={(file) => updateField('profileImage', file)}
          />

          {/* documents */}
          <PermissionSelector />

          <AccountStatus
            label="Account Status"
            required
            options={staffOptions}
            selected={formData.status}
            onChange={(val) => updateField('status', val)}
          />
        </div>
      </div>
    </div>
  )
}

export default AddNewStaffForm;